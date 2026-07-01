'use strict';

/**
 * Optional Supabase sync for Drop OS — local-first with cloud handoff.
 * Loads only when DROP_OS_CONFIG.supabase is filled in drop-os-config.js.
 */
(function () {
  const DEBOUNCE_MS = 1800;
  let client = null;
  let cfg = null;
  let pushTimer = null;
  let pushing = false;
  const status = {
    mode: 'local',
    lastSyncAt: null,
    lastError: null,
    revision: 0,
    conflict: false
  };

  function getCfg() {
    return window.DROP_OS_CONFIG?.supabase;
  }

  function isConfigured() {
    const c = getCfg();
    return Boolean(c?.url && c?.anonKey && c?.dropSlug && c?.syncPin);
  }

  function stripForCloud(fullState) {
    const payload = JSON.parse(JSON.stringify(fullState));
    delete payload.productImages;
    payload._syncNote = 'SKU photos stay local until Storage ships';
    return payload;
  }

  async function loadClient() {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    return createClient(cfg.url, cfg.anonKey);
  }

  function applyRemote(remoteState, revision, updatedAt) {
    if (!remoteState || typeof remoteState !== 'object') return false;
    const bridge = window.DropOSBridge;
    if (!bridge?.getState) return false;
    const current = bridge.getState();
    const localImages = current.productImages || {};
    const merged = {
      ...current,
      ...remoteState,
      productImages: { ...localImages, ...(remoteState.productImages || {}) }
    };
    if (!merged.syncMeta) merged.syncMeta = {};
    merged.syncMeta.revision = revision || 0;
    merged.syncMeta.updatedAt = updatedAt || new Date().toISOString();
    bridge.setState(merged);
    window.localStorage.setItem('vorgDropOS.v1', JSON.stringify(merged));
    status.revision = merged.syncMeta.revision;
    return true;
  }

  async function pull() {
    if (!client) return null;
    const { data, error } = await client.rpc('fetch_drop_state', {
      p_slug: cfg.dropSlug,
      p_pin: cfg.syncPin
    });
    if (error) throw error;
    if (!data?.found) return null;
    status.revision = Number(data.revision) || 0;
    status.lastSyncAt = data.updated_at || new Date().toISOString();
    return data;
  }

  async function push(fullState) {
    if (!client || pushing) return;
    pushing = true;
    try {
      const payload = stripForCloud(fullState);
      if (!payload.syncMeta) payload.syncMeta = {};
      payload.syncMeta.updatedAt = new Date().toISOString();

      const { data, error } = await client.rpc('save_drop_state', {
        p_slug: cfg.dropSlug,
        p_pin: cfg.syncPin,
        p_state: payload,
        p_revision: Number(fullState.syncMeta?.revision) || 0
      });
      if (error) throw error;

      if (data?.conflict) {
        status.conflict = true;
        status.lastError = 'Teammate saved newer state — pull to merge.';
        status.revision = Number(data.revision) || status.revision;
        return;
      }

      status.conflict = false;
      status.lastError = null;
      status.revision = Number(data?.revision) || status.revision;
      status.lastSyncAt = new Date().toISOString();
      const current = window.DropOSBridge?.getState?.();
      if (current) {
        if (!current.syncMeta) current.syncMeta = {};
        current.syncMeta.revision = status.revision;
        current.syncMeta.updatedAt = status.lastSyncAt;
        window.DropOSBridge.setState(current);
        window.localStorage.setItem('vorgDropOS.v1', JSON.stringify(current));
      }
    } catch (e) {
      status.lastError = e.message || 'Sync failed';
      console.warn('Drop OS sync push failed.', e);
    } finally {
      pushing = false;
      if (window.renderSyncPanel) window.renderSyncPanel();
      if (window.renderSyncStatusPill) window.renderSyncStatusPill();
      if (window.renderSyncConflictBanner) window.renderSyncConflictBanner();
    }
  }

  function schedulePush(fullState) {
    if (!client) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(fullState), DEBOUNCE_MS);
  }

  async function init() {
    cfg = getCfg();
    if (!isConfigured()) {
      status.mode = 'local';
      return status;
    }

    try {
      client = await loadClient();
      status.mode = 'cloud';
      const bridge = window.DropOSBridge;
      const remote = await pull();

      if (remote?.state && Object.keys(remote.state).length) {
        const remoteAt = remote.updated_at ? new Date(remote.updated_at).getTime() : 0;
        const local = window.DropOSBridge?.getState?.();
        const localAt = local?.syncMeta?.updatedAt
          ? new Date(local.syncMeta.updatedAt).getTime()
          : 0;

        if (remoteAt >= localAt) {
          applyRemote(remote.state, remote.revision, remote.updated_at);
        } else {
          await push(bridge.getState());
        }
      } else if (bridge?.getState) {
        await push(bridge.getState());
      }

      status.lastError = null;
    } catch (e) {
      status.mode = 'local';
      status.lastError = e.message || 'Could not connect to Supabase';
      console.warn('Drop OS sync init failed — staying local.', e);
    }

    if (window.renderSyncPanel) window.renderSyncPanel();
    return status;
  }

  async function pullNow() {
    if (!client) return status;
    try {
      const remote = await pull();
      if (remote?.state) {
        applyRemote(remote.state, remote.revision, remote.updated_at);
        status.conflict = false;
        status.lastError = null;
        window.DropOSBridge?.refresh?.();
      }
    } catch (e) {
      status.lastError = e.message || 'Pull failed';
    }
    if (window.renderSyncPanel) window.renderSyncPanel();
    if (window.renderSyncStatusPill) window.renderSyncStatusPill();
    if (window.renderSyncConflictBanner) window.renderSyncConflictBanner();
    return status;
  }

  async function pushNow() {
    const current = window.DropOSBridge?.getState?.();
    if (!client || !current) return status;
    await push(current);
    if (window.renderSyncPanel) window.renderSyncPanel();
    if (window.renderSyncStatusPill) window.renderSyncStatusPill();
    if (window.renderSyncConflictBanner) window.renderSyncConflictBanner();
    return status;
  }

  async function pushForce() {
    const current = window.DropOSBridge?.getState?.();
    if (!client || !current) return status;
    try {
      const remote = await pull();
      if (remote?.revision) {
        if (!current.syncMeta) current.syncMeta = {};
        current.syncMeta.revision = Number(remote.revision) || 0;
        window.DropOSBridge.setState(current);
      }
      status.conflict = false;
      status.lastError = null;
      await push(current);
      window.DropOSBridge?.refresh?.();
    } catch (e) {
      status.lastError = e.message || 'Force push failed';
    }
    if (window.renderSyncPanel) window.renderSyncPanel();
    if (window.renderSyncStatusPill) window.renderSyncStatusPill();
    if (window.renderSyncConflictBanner) window.renderSyncConflictBanner();
    return status;
  }

  window.DropOSSync = {
    init,
    schedulePush,
    pullNow,
    pushNow,
    pushForce,
    getStatus: () => ({ ...status })
  };
})();
