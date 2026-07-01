'use strict';

/**
 * Drop OS squad auth — email OTP + invite redemption.
 */
(function () {
  let client = null;
  let cfg = null;

  function qs(sel) { return document.querySelector(sel); }

  function bindClient(supabaseClient, config) {
    client = supabaseClient;
    cfg = config;
  }

  function open() {
    qs('#authDialog')?.showModal();
  }

  function close() {
    qs('#authDialog')?.close();
  }

  async function signInWithEmail(email) {
    if (!client) throw new Error('Auth not configured');
    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true }
    });
    if (error) throw error;
    return true;
  }

  async function redeemInvite(code) {
    if (!client) throw new Error('Auth not configured');
    const { data, error } = await client.rpc('redeem_drop_invite', { p_code: code.trim() });
    if (error) throw error;
    if (!data?.ok) {
      const map = {
        invalid_invite: 'Invalid invite code',
        invite_expired: 'Invite expired',
        invite_exhausted: 'Invite fully used'
      };
      throw new Error(map[data.error] || 'Could not redeem invite');
    }
    await window.DropOSSync?.refreshAuthState?.();
    await window.DropOSSync?.pullNow?.();
    window.DropOSBridge?.refresh?.();
    close();
    return data;
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    await window.DropOSSync?.refreshAuthState?.();
    notifyUi();
    open();
  }

  function notifyUi() {
    if (window.renderSyncPanel) window.renderSyncPanel();
    if (window.renderSyncStatusPill) window.renderSyncStatusPill();
  }

  function bindEvents() {
    qs('#authForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const email = qs('#authEmail')?.value;
      const msg = qs('#authMessage');
      if (!email) return;
      try {
        await signInWithEmail(email);
        if (msg) msg.textContent = 'Check your email for the sign-in link, then return here.';
      } catch (err) {
        if (msg) msg.textContent = err.message || 'Sign-in failed';
      }
    });

    qs('#inviteForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const code = qs('#inviteCode')?.value;
      const msg = qs('#authMessage');
      if (!code) return;
      try {
        await redeemInvite(code);
        if (msg) msg.textContent = 'Squad access granted — sync is live.';
      } catch (err) {
        if (msg) msg.textContent = err.message || 'Invite failed';
      }
    });

    qs('#authCloseBtn')?.addEventListener('click', close);
    qs('#authSignOutBtn')?.addEventListener('click', signOut);

    client?.auth.onAuthStateChange(async () => {
      await window.DropOSSync?.refreshAuthState?.();
      notifyUi();
      const st = window.DropOSSync?.getStatus?.();
      if (st?.auth === 'member') close();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    const preset = window.DROP_OS_CONFIG?.supabase?.inviteCode;
    if (preset && qs('#inviteCode')) qs('#inviteCode').placeholder = 'Paste squad invite';
  });

  window.DropOSAuth = {
    bindClient,
    open,
    close,
    signInWithEmail,
    redeemInvite,
    signOut
  };
})();
