/**
 * Writes drop-os-config.js from environment variables (Vercel build + local).
 * Run: node build-config.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const cfg = {
  repoBaseUrl: process.env.REPO_BASE_URL || 'https://github.com/MikeNzmbh/vorg-eavy-bible/blob/main',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    dropSlug: process.env.DROP_SYNC_SLUG || 'drop-001',
    inviteCode: process.env.DROP_INVITE_CODE || ''
  }
};

const out = `window.DROP_OS_CONFIG = ${JSON.stringify(cfg, null, 2)};\n`;
writeFileSync(join(root, 'drop-os-config.js'), out, 'utf8');
console.log('Wrote drop-os-config.js', cfg.supabase.url ? '(Supabase v2 configured)' : '(local-only)');
