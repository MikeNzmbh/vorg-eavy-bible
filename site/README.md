# VORG-EAVY Site Access

Checked: 2026-07-01

## What Exists

- `index.html` - public-facing Drop 001 site/lookbook prototype.
- `drop-os.html` - team-facing Drop Operating System dashboard.
- `drop-os-guide.html` - full team help guide (UX flows, how-tos, limits).
- `DROP_OS_GUIDE.md` - same guide in Markdown for repo handoff.
- `drop-os.css` - dashboard styling.
- `drop-os.js` - dashboard interactions, local storage, CSV import/export, snapshot copy.
- `drop-os-supabase.js` - Supabase auth sync + Storage SKU images (when `drop-os-config.js` is present).
- `drop-os-auth.js` - email OTP sign-in + squad invite redemption.
- `drop-os-config.example.js` - template for Supabase URL, anon key, and drop slug.
- `supabase/schema-v2.sql` - auth members, invites, RPC sync, Storage bucket (current).
- `supabase/schema.sql` - legacy pin sync (superseded by v2 for Drop 001).
- `vercel.json` - `/drop-os` and `/guide` rewrites for deploy.

## How People Access It

For local review, open `site/drop-os.html` in a browser.

For team sharing, host the `site/` folder through a static host such as Vercel, Netlify, GitHub Pages, or an internal company file share.

**Production:** https://site-blond-kappa.vercel.app/drop-os · **Guide:** `/guide`

## How People Interact With It

**First visit:** orientation tour — the drop loop, spend call, and browser-only limits.

**Every session:** **Drop desk** → bag check + bag lock → update your gate → clear **This week's run**.

**Help:** **Help** (quick hits) or **Full guide** (`drop-os-guide.html` — screenshot walkthrough of every step).

**Playbook strip:** gradient bar under the header — changes per lane.

### Common actions

| Goal | Path |
| --- | --- |
| Log heat | Heat radar → Log heat |
| Upload SKU pic | SKU room → Upload photo |
| Update gate | Drop desk → milestone timeline |
| Review proof | Drop desk → Proof links |
| Add squad move | Drop desk → This week's run |
| Clear checklist item | Factory / Online drop / Pop-up → tap card |
| Start Drop 002+ | Handoff → snapshot → Start next drop |
| Sync squad | Handoff → Sign in (email + invite) or snapshot export |

### Drop lanes (sidebar)

- **Drop desk** — bag check, blockers, gates, readiness model
- **Heat radar** — DMs, saves, waitlist, city pull
- **SKU room** — samples, fit risk, reference photos
- **Campaign** — content tactics before bulk
- **Factory / Online drop / Pop-up** — interactive readiness checklists
- **Next city** — expansion scores
- **Debrief** — post-drop proof
- **Handoff** — export, import, next collection

### QA & screenshots

- Smoke test: `node site/test-drop-os-flow.mjs` (with `python -m http.server 4182` in `site/`)
- Regenerate guide screenshots: `node site/capture-guide-screenshots.mjs`

### Supabase squad sync v2

1. Run `site/supabase/schema-v2.sql` in the Supabase SQL editor.
2. Enable Email auth (magic link) in Supabase Auth settings.
3. Seed invite + `drop_states` row (included in schema-v2.sql for `drop-001`).
4. Set Vercel env: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DROP_SYNC_SLUG=drop-001`.
5. Squad flow: **Sign in** → email link → redeem invite code → cloud sync + SKU photo Storage.

Without sign-in, the browser saves to local storage only; SKU photos stay in-browser until authenticated.

**Onboarding invite (Drop 001 seed):** `ve-invite-drop001-2026` — share privately; rotate in `drop_invites` if leaked.

## Squad readiness — when to use Drop OS

**Good enough for internal Drop 001 ops today** (checked 2026-07-01):

| Gate | Status |
| --- | --- |
| Live URL + guide | ✅ https://site-blond-kappa.vercel.app/drop-os |
| Smoke tests | ✅ 34/34 local |
| Squad sync (Supabase v2) | ✅ Auth + Storage on production |
| Manufacturing proof board | ✅ Factory lane |
| Debrief + investor tiers | ✅ Working vs verified |
| Daily snapshot ritual | ✅ copy + download |
| Conflict handling | ✅ pull / force push |

**Not production-manufacturing truth** — still working assumptions until vendor quotes, samples, and sell-through land.

**Before you rely on it for spend calls:**

1. Teammate opens live URL → **Sign in** → magic link → redeem squad invite.
2. Top-bar pill shows **Cloud**; edit on device A — device B pulls and sees the change.
3. Upload a SKU photo while signed in — confirm Storage URL in `productImageMeta`.
4. Run one daily snapshot to Drive as backup.

**Still out of scope:** Shopify/Sheets live feeds, mobile polish pass, vendor-quote PDF parsing.

## Design References

Used for inspiration only, not copied.

- Flowza SaaS Project Management Dashboard, checked 2026-07-01: https://www.behance.net/gallery/248310091/Flowza-SaaS-Project-Management-Dashboard
- Taskflow PM Case Study, checked 2026-07-01: https://www.behance.net/gallery/247847037/Project-Management-SaaS-Dashboard-Case-Study
- Behance project-management dashboard search, checked 2026-06-25: https://www.behance.net/search/projects/project%20management%20dashboard
- LOOP fashion ecommerce concept, checked 2026-06-25: https://www.behance.net/gallery/241787329/LOOP-Fashion-E-commerce-Branding-Web-Design

## Current Limit

This is a working static prototype with Supabase v2 squad auth when deployed. Manufacturing and sell-through metrics are tiered (Known / Assumed / Unresolved) — not manufacturing-ready until vendor quotes, PP samples, and reconciled sell-through proof land.

## Current Algorithm

The dashboard uses `VORG Drop OS score v0.3`.

- Launch confidence is proof-gated by evidence, product proof, operations, stage momentum, signal heat, campaign proof, and risk drag.
- Campaign success rate remains a working forecast, not a guarantee.
- Next-city signal aggregates signals by city instead of picking only the highest single signal.
- The fuller UI restructure plan lives in `../strategy/drop-os-ui-restructure.md`.
