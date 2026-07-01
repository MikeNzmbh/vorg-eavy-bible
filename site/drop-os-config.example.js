// Copy to drop-os-config.js and fill in values. Never commit drop-os-config.js.
window.DROP_OS_CONFIG = {
  // Turns repo-relative proof paths into GitHub links on the live deploy.
  repoBaseUrl: 'https://github.com/MikeNzmbh/vorg-eavy-bible/blob/main',

  supabase: {
    url: 'https://YOUR_PROJECT.supabase.co',
    anonKey: 'YOUR_ANON_KEY',
    dropSlug: 'drop-001',
    syncPin: 'your-squad-sync-pin'
  }
};
