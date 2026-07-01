# VORG-EAVY Site Access

Checked: 2026-07-01

## What Exists

- `index.html` - public-facing Drop 001 site/lookbook prototype.
- `drop-os.html` - team-facing Drop Operating System dashboard.
- `drop-os-guide.html` - full team help guide (UX flows, how-tos, limits).
- `DROP_OS_GUIDE.md` - same guide in Markdown for repo handoff.
- `drop-os.css` - dashboard styling.
- `drop-os.js` - dashboard interactions, local storage, CSV import/export, snapshot copy.
- `drop-os-supabase.js` - optional Supabase squad sync (loads when `drop-os-config.js` is present).
- `drop-os-config.example.js` - template for Supabase URL, anon key, drop slug, and sync pin.
- `supabase/schema.sql` - RPC-backed shared state table for squad sync.
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
| Sync squad | Handoff → CSV, snapshot, or Supabase (config file) |

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

### Supabase squad sync (optional)

1. Create a Supabase project.
2. Run `site/supabase/schema.sql` in the SQL editor.
3. Seed a row: `insert into drop_states (drop_slug, sync_pin, state) values ('drop-001', 'your-pin', '{}');`
4. Copy `drop-os-config.example.js` → `drop-os-config.js` (gitignored) with URL, anon key, slug, and pin.
5. Redeploy `site/`. Handoff → Squad sync shows status; edits debounce to cloud. SKU photos stay local until Storage v2.

Without config, the browser saves to local storage only.

## Squad readiness — when to use Drop OS

**Good enough for internal Drop 001 ops today** (checked 2026-07-01):

| Gate | Status |
| --- | --- |
| Live URL + guide | ✅ https://site-blond-kappa.vercel.app/drop-os |
| Smoke tests | ✅ 29/29 local |
| Squad sync (Supabase) | ✅ Production env configured |
| Milestones, tasks, heat, SKUs | ✅ |
| Checklists → bag check math | ✅ |
| Debrief + investor read | ✅ |
| Daily snapshot ritual | ✅ copy + download |
| Conflict handling | ✅ pull / force push |

**Not production-manufacturing truth** — still working assumptions until vendor quotes, samples, and sell-through land.

**Before you rely on it for spend calls:**

1. Two teammates open the live URL — confirm top-bar pill shows **Cloud**.
2. Edit a milestone on device A — device B pulls and sees the change.
3. Run one daily snapshot to Drive.
4. Keep sync pin squad-private; rotate if leaked.

**Still out of scope (v2):** per-user auth, SKU photo cloud storage, Shopify/Sheets live feeds, mobile polish pass.

## Design References

Used for inspiration only, not copied.

- Flowza SaaS Project Management Dashboard, checked 2026-07-01: https://www.behance.net/gallery/248310091/Flowza-SaaS-Project-Management-Dashboard
- Taskflow PM Case Study, checked 2026-07-01: https://www.behance.net/gallery/247847037/Project-Management-SaaS-Dashboard-Case-Study
- Behance project-management dashboard search, checked 2026-06-25: https://www.behance.net/search/projects/project%20management%20dashboard
- LOOP fashion ecommerce concept, checked 2026-06-25: https://www.behance.net/gallery/241787329/LOOP-Fashion-E-commerce-Branding-Web-Design

## Current Limit

This is a working static prototype with optional Supabase sync. It is usable by non-Codex teammates. SKU photos and very large snapshots still favor local export until Storage ships.

## Current Algorithm

The dashboard now uses `VORG Drop OS score v0.2`.

- Launch confidence is proof-gated by evidence, product proof, operations, stage momentum, signal heat, campaign proof, and risk drag.
- Campaign success rate remains a working forecast, not a guarantee.
- Next-city signal aggregates signals by city instead of picking only the highest single signal.
- The fuller UI restructure plan lives in `../strategy/drop-os-ui-restructure.md`.
