# VORG-EAVY Site Access

Checked: 2026-07-25

## What Exists

- `index.html` - public-facing Drop 001 site/lookbook prototype.
- `drop-os.html` - team-facing Drop Operating System dashboard.
- `drop-os-guide.html` - full team help guide (UX flows, how-tos, limits).
- `DROP_OS_GUIDE.md` - same guide in Markdown for repo handoff.
- `drop-os.css` - dashboard styling.
- `src/drop-os-algorithm.ts` - typed Drop OS scoring, gate, risk, and city-signal algorithm.
- `drop-os-algorithm.js` - compiled browser bundle generated from `src/drop-os-algorithm.ts`.
- `src/supplier-vetting-agent.ts` - supervised Alibaba supplier-conversation, evidence-scoring, contradiction, and approval-gate engine.
- `supplier-vetting-agent.js` - compiled supplier-vetting browser bundle.
- `fixtures/suppliers/drop-001-candidates.json` - current desktop-lead queue for Topshow, Hangyue, and Hebei Dilly.
- `run-supplier-vetting.mjs` - read-only local runner that prints each candidate's next action and approval-paused message draft.
- `src/sales-forecast.ts` - typed deterministic Monte Carlo sales-range and calibration engine.
- `sales-forecast.js` - compiled forecast browser bundle generated from `src/sales-forecast.ts`.
- `public-commerce-priors.js` - generated, deeply frozen licensed public-data transfer profile consumed by Forecast Lab.
- `run-public-prior-training.mjs` - portable launcher for the Python public-data trainer.
- `forecast-synthetic-fixture.js` - canonical browser fixture for the isolated synthetic evidence test.
- `fixtures/synthetic-forecast/` - fabricated test-only traffic, funnel, reservation, and outcome receipts with explicit truth controls.
- `edge-commerce-catalog.js` - versioned 30-tactic commerce ledger plus five Drop 001 control-card templates.
- `edge-commerce-library.js` - generated browser bundle containing 83 lawful free sources and 34 deduplicated atomic claims.
- `build-edge-library.mjs` - validates and builds the browser bundle from `../research/commerce-intelligence/free-source-registry.json`.
- `drop-os.js` - dashboard interactions, local storage, CSV import/export, snapshot copy.
- `drop-os-supabase.js` - Supabase auth sync + Storage SKU images (when `drop-os-config.js` is present).
- `drop-os-auth.js` - email OTP sign-in + squad invite redemption.
- `drop-os-config.example.js` - template for Supabase URL, anon key, and drop slug.
- `supabase/schema-v2.sql` - auth members, invites, RPC sync, Storage bucket (current).
- `supabase/schema.sql` - legacy pin sync (superseded by v2 for Drop 001).
- `vercel.json` - `/drop-os` and `/guide` rewrites for deploy.

## Product Truth Note

Checked: 2026-07-07.

- The strategic source of truth now lists the corrected founder pick: The Firm Jacket, women's low-rise denim jean, men's denim jean, scarf, and women's top / bodysuit.
- `drop-os.js` default SKU seed has been updated to that corrected set with TBD units/prices.
- Forecast Lab separately loads the source-linked 126-unit proof-buy working scenario from `../launch/drop-001-sales-forecast-inputs.md`. Those overrides unblock scenario calculation but do not populate readiness/vendor truth.
- The default `public-transfer-v1` cold-start profile uses three CC BY 4.0 UCI datasets to widen uncertainty around the entered VORG rate. It never supplies the conversion center and contributes zero VORG proof, readiness, or calibration credit.
- **Run synthetic evidence test** loads fabricated traffic, funnel, reservation, product/size demand, and outcome receipts from `fixtures/synthetic-forecast/`. The engine labels the run `synthetic-test`, executes the complete stress and grading loop, and excludes it from live calibration and readiness.
- `drop-os.js` now shows the conditional November 5-12, 2026 working window; saved browser/Supabase state may retain an older target until updated or reset.
- `index.html` and `app.js` still reflect the older 3-object public lookbook prototype and need a separate creative/product refresh before they are used for launch decisions or public preview.
- Existing Supabase/browser-saved Drop OS state may still carry the old seed until reset or imported from an updated snapshot.

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
| Search commerce knowledge | Edge Commerce Lab → Free library → Atomic claims / Sources |
| Stress-test a growth play | Edge Commerce Lab → 30-tactic ledger → Forge experiment |
| Record the result | Edge Commerce Lab → Experiments → control card → Decision memory |
| Forecast sales | Forecast Lab → demand plan + merchandise model → Save + recalculate |
| Grade the forecast | Forecast Lab → Freeze pre-launch call → link post-drop actual receipt |
| Stress the launch | Forecast Lab → Launch stress matrix → compare traffic miss, pop-up cancellation, cost overrun, combined downside, and controlled upside |
| Add squad move | Drop desk → This week's run |
| Clear checklist item | Factory / Online drop / Pop-up → tap card |
| Start Drop 002+ | Handoff → snapshot → Start next drop |
| Sync squad | Handoff → Sign in (email + invite) or snapshot export |

### Drop lanes (sidebar)

- **Drop desk** — bag check, blockers, gates, readiness model
- **Heat radar** — DMs, saves, waitlist, city pull
- **SKU room** — samples, fit risk, reference photos
- **Edge Commerce Lab** — 83-source library, 34 atomic claims, 30-play ledger, seven-day experiments, spend/risk gates, decision memory
- **Forecast Lab** — P10/P50/P90 sales ranges, SKU/size stockout risk, frozen calls, outcome receipts, calibration
- **Factory / Online drop / Pop-up** — interactive readiness checklists
- **Next city** — expansion scores
- **Debrief** — post-drop proof
- **Handoff** — export, import, next collection

### QA & screenshots

- Algorithm compile + unit test: `cd site && npm run test:algorithm`
- Supplier-vetting compile + unit test: `cd site && npm run test:suppliers`
- Print the current supplier review queue and draft messages: `cd site && npm run vet:suppliers`
- Forecast compile + unit test: `cd site && npm run test:forecast`
- Public-prior artifact test: `cd site && npm run test:public-priors`
- Reproduce public-data training: `cd site && npm run train:public-priors`
- Free-library build + schema test: `cd site && npm run test:library`
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
| Smoke tests | ✅ 59/59 local (2026-07-25) |
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

**Still out of scope:** automated Shopify/GA4/POS forecast feeds, vendor-quote PDF parsing, and automated fitting from VORG's own reconciled launch history.

## Design References

Used for inspiration only, not copied.

- Flowza SaaS Project Management Dashboard, checked 2026-07-01: https://www.behance.net/gallery/248310091/Flowza-SaaS-Project-Management-Dashboard
- Taskflow PM Case Study, checked 2026-07-01: https://www.behance.net/gallery/247847037/Project-Management-SaaS-Dashboard-Case-Study
- Behance project-management dashboard search, checked 2026-06-25: https://www.behance.net/search/projects/project%20management%20dashboard
- LOOP fashion ecommerce concept, checked 2026-06-25: https://www.behance.net/gallery/241787329/LOOP-Fashion-E-commerce-Branding-Web-Design

## Current Limit

This is a working static prototype with Supabase v2 squad auth when deployed. Manufacturing and sell-through metrics are tiered (Known / Assumed / Unresolved) — not manufacturing-ready until vendor quotes, PP samples, and reconciled sell-through proof land.

## Current Algorithm

Checked: 2026-07-25.

The local dashboard uses `VORG Drop OS score v1.3`. The hosted production URL remains on its previously deployed bundle until a separate deployment is completed and verified.

- The canonical scoring implementation is now TypeScript in `src/drop-os-algorithm.ts`; run `npm run build:algorithm` from `site/` after changing it.
- `drop-os.js` consumes the compiled `drop-os-algorithm.js` browser bundle and should not reimplement score math inline.
- Readiness is driven primarily by manufacturing truth, quote- and price-proof-backed unit economics, launch operations, reached-stage integrity, verified campaign/Edge Lab proof, deduplicated demand receipts, and an explicit market-entry gate when a primary market is changed.
- Self-rated demand, campaign, margin, and evidence sliders contribute only 18% in total. The SKU proof slider is locked; supplier/sample fields control it.
- GO requires all active SKUs to have linked quote/sample proof and PP approval, a substantially complete financial model inside the active production cap, verified campaign proof, operations readiness, stage integrity, and controlled risk.
- Planned production spend over the active cap forces a hard pause. Drop 001 defaults to C$6,000, matching the current founder ceiling.
- Empty campaign work and planned guru tactics start at zero. Edge Lab proof enters the campaign component only after a completed, evidenced experiment; adopt/adapt additionally requires qualified action, reusable assets, a populated prerequisite checklist, approvals, and spend inside cap.
- Imported decisions cannot manufacture completion, unknown source tiers are forced to frontier F, and one receipt reused across legacy and Edge records counts once.
- Yellow and Orange experiments require timestamped approval saved before the run transition; Orange also requires prior recorded counsel review. Active Red-risk or over-cap experiments force HOLD.
- The Free library exposes 83 checked access routes and 34 deduplicated claims, including public-domain and open-licensed books. Source volume contributes zero readiness; only evidenced VORG experiments enter campaign proof.
- Snapshot schema v4 preserves the complete experiment queue plus current/frozen sales forecasts, inputs, engine/prior version, outcome receipts, and calibration. Forecast optimism remains independent from readiness authorization.
- Campaign outlook is a directional index and band, not a probability or sell-through forecast.
- `VORG Sales Forecast v1.1` is a separate deterministic Monte Carlo engine. It reports P10/P50/P90 sales ranges and inventory risk, remains `scenario` until first-party receipts anchor it, and is uncalibrated until frozen calls receive linked outcomes. Session + purchase counts can update the planning prior without making the call evidence-anchored.
- Forecast Lab defaults to `public-transfer-v1`, trained from 12,330 public sessions and stress-checked against 541,909 retail transaction rows plus 165,474 clothing clicks. The clothing data have no purchase target and the retail baskets are wholesale-heavy, so both raw sales-level transfers are rejected. The accepted profile changes prior strength only and remains external scenario data.
- The default Drop 001 working scenario uses 126 units, C$3,712 assumed landed inventory cost, C$4,700 assumed non-inventory spend, 2,160 qualified sessions (980 waitlist + 330 connector + 850 named paid ads, CAC unknown), 135 pop-up visitors, a 3.06% planning conversion prior, and 1.25 units/order. 85% sell-through is the coverage goal. Under public-transfer uncertainty the modeled chance of hitting it remains 25.3% until real counts exist.
- Under the public-transfer profile, the current 10,000-run base readout spans C$831 / C$4,299 / C$12,060 revenue at P10/P50/P90 and 7.1% / 35.7% / 100% sell-through. It gives a 25.3% modeled chance of reaching 85% sell-through and 30.3% chance revenue recovers the C$8,412 working committed plan before excluded leakage. The external profile deliberately widens the prior-only range; these are assumption-led outputs, not launch proof.
- The synthetic evidence bench reaches 100/100 input completeness and returns `synthetic-test`. At 10,000 runs its P50 is C$8,875 revenue / 94 units / 74.6% sell-through; the fabricated linked outcome produces 5.18% synthetic revenue WAPE. Those numbers validate engine execution only, not forecast accuracy.
- The complete forecast contract lives in `../strategy/drop-os-sales-forecast-v1.md`.
- Score levers are counterfactual ceilings (`up to +X`), not promised score gains.
- The fuller UI restructure plan lives in `../strategy/drop-os-ui-restructure.md`.
- The complete v1.3 decision contract lives in `../strategy/drop-os-scoring-v1.md`; the U.S.-first stress test and market-entry criteria live in `../strategy/us-first-gtm-stress-test-2026-08-22.md`.
