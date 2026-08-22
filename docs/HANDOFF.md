# VORG-EAVY Agent Handoff

Last updated: 2026-08-22

## What This Repo Is

This repo is the VORG-EAVY Bible: the operating memory for the brand, product system, launch, finance assumptions, research, and agent handoffs.

Path:

`C:\Users\mbaho\OneDrive\Documents\vorg-eavy-bible`

## What The Project Is

VORG-EAVY is currently being shaped as a direct-to-consumer fashion micro-label, not a broad marketplace.

The immediate thesis:

- Pursue the **highest-gain market route** (currently U.S./Brooklyn forecast track per `docs/DECISIONS.md` 2026-08-22), still behind market-entry hard stops — not proven demand.
- Keep Ottawa/Gatineau as the Canadian fallback / parallel proof option.
- Build a status-driven brand world before broad catalog.
- Launch with a small controlled drop.
- Use scarcity, community, product quality, and a controlled pop-up after the market is selected and permitted.
- Reinvest first before founder withdrawal.

## Active Launch Shape

- Launch window: November 5-12, 2026, conditional on quote, PP sample, demand-proof, inbound, and QC gates. October is not the active plan unless those gates clear early enough.
- Drop 001 founder-stated product set: The Firm Jacket, women's low-rise denim jean, men's denim jean, scarf, women's top / bodysuit.
- Initial inventory / production spend ceiling: C$5,000-C$6,000 max.
- Planned units: TBD after vendor quotes.
- Target revenue: TBD after prices and units are rebuilt.
- Channel: direct-to-consumer only; U.S.-first Shopify + TikTok thesis is the authorized direction under test.
- Storefront: open online drop at launch; no password gate.
- Event: one controlled day-to-night pop-up after market proof / permissions.
- Wedge: highest-gain market route — currently U.S./Brooklyn forecast; Ottawa/Gatineau = CA fallback.

## Important Adjacent Work

The app repo lives at:

`C:\Users\mbaho\OneDrive\Documents\New project`

That app is VORG-EAVY Atelier. It is an internal AI garment studio for concept reconstruction, material editing, and artifact export.

Current app truth:

- It supports image intake, capture QA, material extraction, parametric garment concepts, and export.
- It has a Python worker contract at `workers/scan_worker.py`.
- It should be treated as concept tooling, not a production manufacturing system.
- Recent backend work improved silhouette safety by isolating the largest connected garment component and blending weak one-image evidence conservatively.

## Best Agent Pattern To Preserve

Borrowed from the Atelier repo:

- Artifact-first documentation.
- Confidence-banded claims.
- Explicit review gates.
- Source evidence attached to outputs.
- Human review before production truth.
- Worker contracts that can later be upgraded without changing the whole system.

Apply that mindset to strategy too. Do not let docs drift into hype without evidence.

## Drop OS (internal squad desk)

Checked: 2026-08-19

- **Live:** https://site-blond-kappa.vercel.app/drop-os
- **Guide:** https://site-blond-kappa.vercel.app/guide
- **Deployment truth:** the live URL remains on its previously deployed bundle; the Forecast Lab and predictor changes in this workspace have not been deployed or live-verified in this turn
- **Code:** `site/drop-os.html`, `site/drop-os.js`, `site/drop-os-supabase.js`
- **Local scoring:** `VORG Drop OS score v1.2` in `site/src/drop-os-algorithm.ts`; evidence-backed readiness, C$6,000 cap enforcement, production prerequisites, and deduplicated signal proof
- **Sales predictor:** `VORG Sales Forecast v1.1` in `site/src/sales-forecast.ts`; deterministic range simulation, automatic stresses, frozen calls, linked outcomes, and calibration. Session + purchase counts can update the planning prior without a full funnel; that still grants zero readiness credit. Forecast Lab defaults to the licensed `public-transfer-v1` uncertainty profile, which keeps the entered VORG rate as its center. It has no path into readiness or ads authorization.
- **Loaded working scenario:** 126 assumed units / C$3,712 assumed landed inventory cost / C$4,700 assumed non-inventory spend / 2,160 planned sessions (980 waitlist + 330 connector + 850 named paid ads, CAC unknown) / 135 planned pop-up visitors / 3.06% planning conversion / 1.25 units per order. Traffic is plan-only. See `launch/drop-001-traffic-channel-plan.md`, `launch/drop-001-sales-forecast-inputs.md`, and `launch/drop-001-sales-forecast-readout.md`. 85% sell-through is the coverage goal; the modeled P(85%) remains 25.3% under current uncertainty, not a green light.
- **Paid-ads practice priors:** `research/commerce-intelligence/ads-public-priors/` + `launch/simulate-paid-ads-practice.mjs`. Free WordStream apparel CPC/CTR and IRP fashion CVR fill empty paid fields for cash geometry only. Practice result: ~C$1,001 to buy 850 sessions at WordStream CPC vs C$450 paid-social working line; ~14.8 orders if IRP 1.74% holds. Not VORG CAC. Not a Hermes spend bot.
- **Public-data challenger:** `research/commerce-intelligence/public-data-model/` trains on 12,330 public sessions and audits 541,909 retail transaction rows plus 165,474 fashion clicks. Random holdout AUC/Brier are 0.758938/0.121621; blocked-month AUC/Brier are 0.684304/0.158559. These are within-source diagnostics, not VORG accuracy.
- **C$10k plus every-two-month funding simulation:** `finance/simulate-six-figure-path.mjs` separates owner capital from sales and now tests C$2,000 contributions every two months plus a proof-gated 45% net-sales growth target. At 85% sell-through every drop, the threshold path reaches C$119,192 by August 15, 2027 after C$12,000 of added owner capital; without proven 45% growth, funding alone retains the October 24, 2027 date. Public-transfer results remain uncertainty tests, not VORG probabilities. See `finance/six-figure-sales-simulation.md`.
- **Synthetic predictor bench:** Forecast Lab's **Run synthetic evidence test** loads the generated receipts in `site/fixtures/synthetic-forecast/`, creates one frozen linked test outcome, and grades it only in synthetic calibration. Marked fixture paths fail closed to `synthetic-test`; live calibration and readiness exclude them.
- **Supabase project:** `vorg-eavy-drop-os` (`ca-central-1`) — `site/supabase/schema-v2.sql` (auth + Storage)
- **Squad sync v2:** email magic link + invite redemption — no shared PIN on `drop-001` (`auth_only = true`)
- **Vercel env:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DROP_SYNC_SLUG` (`drop-001`); optional `DROP_INVITE_CODE` for onboarding hint only
- **Squad invite (seed):** `ve-invite-drop001-2026` — rotate in Supabase if leaked
- **Storage:** bucket `drop-sku-images` — SKU photos upload when signed in as squad member
- **QA:** `npm run test:unit`, then `python -m http.server 4182` in `site/` and `npm run test:flow` (59 browser checks as of 2026-07-25)
- **Manufacturing truth:** Factory lane — vendor quote + PP sample proof URLs per SKU
- **Investor read:** working desk scores vs verified debrief metrics (Known / Assumed / Unresolved)

## Current Open Questions

- Which vendor mix can produce jacket, women's denim, men's denim, scarf, and top / bodysuit inside the C$5,000-C$6,000 inventory / production cap?
- What unit split preserves the drop story without overextending cash?
- Is the women's top a bodysuit, rib top, tee, or long-sleeve after fit proof?
- What exact rise, fit, wash, and measurement spec define the women's low-rise denim jean?
- What exact fit block defines the men's denim jean?
- Which venue is safest for the first pop-up once the primary market (currently U.S./Brooklyn track) clears permissions — or for an Ottawa/Gatineau fallback event?
- Which Shopify theme and content model should be used for the open online launch?
- Which AI garment stack is worth integrating first into Atelier?
- What legal/compliance checklist should be locked before event deposits?
- What TEST paid cap, landing, and kill rule should the founder approve before any ad is published?

## Brand-house ambition (2026-08-22)

Founder clarified: idea seeds aim at peer **class** (Jacquemus, Nude Project, Hermès, Jaded London, Scuffers, EME Studios) — study mechanisms, not copy revenue. Path: `strategy/brand-house-path-2026-08-22.md`. Master all-corners ledger: `research/market-positioning/brand-path-master-ledger-2026-08-22.md`. Mechanism cards v2 + source ledger v2. Ambition ≠ evidence; forecast ≠ Drop OS GO.

## Next Useful Tasks

1. Clear P0 cross-border/USD gate: choose DDP vs U.S. 3PL, attach quote + USD contribution sheet (`strategy/us-first-cross-border-usd-gate-2026-08-22.md`).
2. Lock image codes + hero SKU (brand-path Top 10) while samples advance; do not claim peer-class proof.
3. Replace the 126-unit proof-buy scenario assumptions with reconciled vendor quotes, approved sample decisions, price-revealed demand selections, and named traffic receipts while preserving the C$5,000-C$6,000 production cap. Rebuild U.S. channel plan — do not transfer Ottawa session arithmetic.
4. Turn the corrected product set into vendor-ready tech-pack outlines.
5. Replace financial assumptions with vendor quotes as they arrive.
6. Build a venue shortlist only after market proof / permissions path exists.
7. Build a Shopify information architecture doc for USD Markets.
8. Keep the decision log current for every major strategic choice.
9. Keep this repo synced with the Atelier app when technical capabilities change.
10. Run Drop 001 milestones in Drop OS and keep Supabase state backed up via Handoff snapshots.
11. Founder sets a TEST paid-ads cap from non-inventory cash only after duties/USD economics path is chosen; do not place ads until that cap and landing exist.
