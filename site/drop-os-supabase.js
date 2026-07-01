'use strict';

/**
 * Drop OS v2 — Supabase auth sync + Storage SKU images.
 */
(function () {
  const DEBOUNCE_MS = 1800;
  const BUCKET = 'drop-sku-images';
  let client = null;
  let cfg = null;
  let pushTimer = null;
  let pushing = false;
  const status = {
    mode: 'local',
    auth: 'none',
    lastSyncAt: null,
    lastError: null,
    revision: 0,
    conflict: false,
    userEmail: null
  };

  function getCfg() {
    return window.DROP_OS_CONFIG?.supabase;
  }

  function isConfigured() {
    const c = getCfg();
    return Boolean(c?.url && c?.anonKey && c?.dropSlug);
  }

  function notifyUi() {
    if (window.renderSyncPanel) window.renderSyncPanel();
    if (window.renderSyncStatusPill) window.renderSyncStatusPill();
    if (window.renderSyncConflictBanner) window.renderSyncConflictBanner();
  }

  async function loadClient() {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    return createClient(cfg.url, cfg.anonKey);
  }

  async function getSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session || null;
  }

  function stripForCloud(fullState) {
    const payload = JSON.parse(JSON.stringify(fullState));
    delete payload.productImages;
    payload._syncNote = 'SKU photos in Storage v2 — URLs in productImageMeta';
    return payload;
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
      productImages: { ...localImages, ...(remoteState.productImages || {}) },
      productImageMeta: { ...(current.productImageMeta || {}), ...(remoteState.productImageMeta || {}) }
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
    const session = await getSession();

    if (session) {
      const { data, error } = await client.rpc('fetch_drop_state_auth', { p_slug: cfg.dropSlug });
      if (error) throw error;
      if (data?.error === 'not_authorized') {
        status.auth = 'needs_invite';
        return null;
      }
      if (!data?.found) return null;
      status.revision = Number(data.revision) || 0;
      status.lastSyncAt = data.updated_at || new Date().toISOString();
      status.auth = 'member';
      return data;
    }

    if (cfg.syncPin) {
      const { data, error } = await client.rpc('fetch_drop_state', {
        p_slug: cfg.dropSlug,
        p_pin: cfg.syncPin
      });
      if (error) throw error;
      if (!data?.found) return null;
      status.revision = Number(data.revision) || 0;
      status.lastSyncAt = data.updated_at || new Date().toISOString();
      status.auth = 'legacy_pin';
      return data;
    }

    status.auth = 'signed_out';
    return null;
  }

  async function push(fullState) {
    if (!client || pushing) return;
    pushing = true;
    try {
      const payload = stripForCloud(fullState);
      if (!payload.syncMeta) payload.syncMeta = {};
      payload.syncMeta.updatedAt = new Date().toISOString();
      const revision = Number(fullState.syncMeta?.revision) || 0;
      const session = await getSession();
      let data;
      let error;

      if (session && status.auth === 'member') {
        ({ data, error } = await client.rpc('save_drop_state_auth', {
          p_slug: cfg.dropSlug,
          p_state: payload,
          p_revision: revision
        }));
      } else if (cfg.syncPin) {
        ({ data, error } = await client.rpc('save_drop_state', {
          p_slug: cfg.dropSlug,
          p_pin: cfg.syncPin,
          p_state: payload,
          p_revision: revision
        }));
      } else {
        status.lastError = 'Sign in and redeem squad invite to sync';
        return;
      }

      if (error) throw error;
      if (data?.error === 'not_authorized') {
        status.auth = 'needs_invite';
        status.lastError = 'Redeem squad invite in Sign in panel';
        return;
      }

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
      notifyUi();
    }
  }

  function schedulePush(fullState) {
    if (!client || status.auth !== 'member' && !cfg.syncPin) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(fullState), DEBOUNCE_MS);
  }

  async function uploadSkuImage(productId, file) {
    if (!client) return null;
    const session = await getSession();
    if (!session || status.auth !== 'member') return null;

    const ext = (file.name || 'jpg').split('.').pop()?.toLowerCase() || 'jpg';
    const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
    const path = `${cfg.dropSlug}/${productId}/${Date.now()}.${safeExt}`;

    const { error } = await client.storage.from(BUCKET).upload(path, file, {
      upsert: true,
      contentType: file.type || `image/${safeExt === 'jpg' ? 'jpeg' : safeExt}`
    });
    if (error) throw error;

    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path, storage: true, uploadedAt: new Date().toISOString() };
  }

  async function deleteSkuImage(path) {
    if (!client || !path) return;
    const session = await getSession();
    if (!session || status.auth !== 'member') return;
    await client.storage.from(BUCKET).remove([path]);
  }

  async function refreshAuthState() {
    const session = await getSession();
    status.userEmail = session?.user?.email || null;
    if (!session) {
      status.auth = 'signed_out';
      status.mode = 'auth-required';
      return status;
    }

    try {
      const probe = await client.rpc('fetch_drop_state_auth', { p_slug: cfg.dropSlug });
      if (probe.data?.error === 'not_authorized') {
        status.auth = 'needs_invite';
        status.mode = 'auth-required';
      } else {
        status.auth = 'member';
        status.mode = 'cloud';
      }
    } catch (e) {
      status.auth = 'signed_out';
      status.mode = 'auth-required';
      status.lastError = e.message;
    }
    notifyUi();
    return status;
  }

  async function init() {
    cfg = getCfg();
    if (!isConfigured()) {
      status.mode = 'local';
      return status;
    }

    try {
      client = await loadClient();
      window.DropOSAuth?.bindClient?.(client, cfg);
      await refreshAuthState();

      if (status.auth === 'member') {
        const bridge = window.DropOSBridge;
        const remote = await pull();
        if (remote?.state && Object.keys(remote.state).length) {
          const remoteAt = remote.updated_at ? new Date(remote.updated_at).getTime() : 0;
          const local = bridge?.getState?.();
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
      } else if (status.auth === 'signed_out' || status.auth === 'needs_invite') {
        status.mode = 'auth-required';
      }
    } catch (e) {
      status.mode = 'local';
      status.lastError = e.message || 'Could not connect to Supabase';
      console.warn('Drop OS sync init failed — staying local.', e);
    }

    notifyUi();
    return status;
  }

  async function pullNow() {
    if (!client) return status;
    try {
      await refreshAuthState();
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
    notifyUi();
    return status;
  }

  async function pushNow() {
    const current = window.DropOSBridge?.getState?.();
    if (!client || !current) return status;
    await refreshAuthState();
    await push(current);
    notifyUi();
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
    notifyUi();
    return status;
  }

  window.DropOSSync = {
    init,
    schedulePush,
    pullNow,
    pushNow,
    pushForce,
    uploadSkuImage,
    deleteSkuImage,
    refreshAuthState,
    getClient: () => client,
    getStatus: () => ({ ...status })
  };
})();
