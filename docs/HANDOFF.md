# VORG-EAVY Agent Handoff

Last updated: 2026-08-22

## What This Repo Is

This repo is the VORG-EAVY Bible: the operating memory for the brand, product system, launch, finance assumptions, research, and agent handoffs.

Path:

`C:\Users\mbaho\OneDrive\Documents\vorg-eavy-bible`

## What The Project Is

VORG-EAVY is currently being shaped as a direct-to-consumer fashion micro-label, not a broad marketplace.

The immediate thesis:

- Pursue the **U.S.-first route**, with Brooklyn as the operating lead hypothesis and Chicago, Los Angeles, and Atlanta retained as co-finalists per `docs/DECISIONS.md` 2026-08-22. Market-entry hard stops remain; demand is not proven.
- Treat Canada as the secondary expansion queue: Ontario, Quebec, Vancouver, then Halifax. Ottawa is not the launch focus.
- Build a status-driven brand world before broad catalog.
- Launch with a small controlled drop.
- Use scarcity, community, product quality, and a controlled pop-up after the market is selected and permitted.
- Reinvest first before founder withdrawal.
- Current growth outcome contract: at least C$100,000 reconciled net sales in August 2027, 85% sell-through inside 30 days, 45% per-release growth floor / 50% target. The goal-seeking architecture uses eight approximately 40-day releases. See `finance/growth-finance-engine-v3.md`; this is not a PO authorization.
- Founder pay is modeled as a working C$3,000 monthly total corporate cash envelope. Use a cash gate or a protected C$11,465-C$12,258 working-capital bridge; confirm gross/net/payroll meaning with the founder/accountant. No dividends before month 12 or without solvency/tax clearance.

## Active Launch Shape

- Launch window: November 5-12, 2026, conditional on quote, PP sample, demand-proof, inbound, and QC gates. October is not the active plan unless those gates clear early enough.
- Drop 001 founder-stated product set: The Firm Jacket, women's low-rise denim jean, men's denim jean, scarf, women's top / bodysuit.
- Initial inventory / production spend ceiling: C$5,000-C$6,000 max.
- Planned units: TBD after vendor quotes.
- Target revenue: TBD after prices and units are rebuilt.
- Channel: direct-to-consumer first; U.S.-first omnichannel portfolio across Shopify, Instagram, TikTok, creators, founder YouTube, Google, owned CRM, Pinterest, Shop and controlled offline proof. See `launch/omnichannel-demand-system-2026-08-22.md`.
- Storefront: open online drop at launch; no password gate.
- Event: one controlled day-to-night pop-up after market proof / permissions.
- Wedge: U.S.-first; Brooklyn = operating lead hypothesis; Chicago / Los Angeles / Atlanta = co-finalists; Canada expands Ontario -> Quebec -> Vancouver -> Halifax.

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
- **Frozen Forecast Lab comparison:** 126 assumed units / C$3,712 assumed landed inventory cost / C$4,700 assumed non-inventory spend / 2,160 legacy Ottawa/Gatineau planned sessions / 135 planned pop-up visitors / 3.06% planning conversion / 1.25 units per order. The session geography/composition is superseded and must not be used as the live U.S. channel plan. See `launch/drop-001-traffic-channel-plan.md` for the frozen comparison and `launch/omnichannel-demand-system-2026-08-22.md` for current direction. 85% remains the goal; the old modeled P(85%) is not a green light.
- **Paid-ads practice priors:** `research/commerce-intelligence/ads-public-priors/` + `launch/simulate-paid-ads-practice.mjs`. Free WordStream apparel CPC/CTR and IRP fashion CVR fill empty paid fields for cash geometry only. Practice result: ~C$1,001 to buy 850 sessions at WordStream CPC vs C$450 paid-social working line; ~14.8 orders if IRP 1.74% holds. Not VORG CAC. Not a Hermes spend bot.
- **Public-data challenger:** `research/commerce-intelligence/public-data-model/` trains on 12,330 public sessions and audits 541,909 retail transaction rows plus 165,474 fashion clicks. Random holdout AUC/Brier are 0.758938/0.121621; blocked-month AUC/Brier are 0.684304/0.158559. These are within-source diagnostics, not VORG accuracy.
- **Current August-month engine:** `finance/growth-finance-engine-v3.mjs` targets a C$100k August 2027 net-sales month, not cumulative sales. Eight 40-day releases at 85%/45% model C$112,387 August net sales; the 50% target path models C$142,331. Full C$3,000 monthly founder pay requires a working C$11,465-C$12,258 protected bridge or the salary cash gate. The prior `simulate-six-figure-path.mjs` remains a frozen cumulative-sales comparison. Neither is a VORG probability or PO authorization.
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
- Which venue is safest for the first pop-up once the Brooklyn-led U.S. test identifies enough local proof and the permissions/economics gates clear?
- Which Shopify theme and content model should be used for the open online launch?
- Which AI garment stack is worth integrating first into Atelier?
- What legal/compliance checklist should be locked before event deposits?
- What TEST paid cap, landing, and kill rule should the founder approve before any ad is published?

## Brand-house ambition (2026-08-22)

Founder clarified: idea seeds aim at peer **class** (Jacquemus, Nude Project, Hermès, Jaded London, Scuffers, EME Studios) — study mechanisms, not copy revenue. Path: `strategy/brand-house-path-2026-08-22.md`. Master all-corners ledger: `research/market-positioning/brand-path-master-ledger-2026-08-22.md`. Mechanism cards v2 + source ledger v2. Ambition ≠ evidence; forecast ≠ Drop OS GO.

## Next Useful Tasks

1. Clear P0 cross-border/USD gate: choose DDP vs U.S. 3PL, attach quote + USD contribution sheet (`strategy/us-first-cross-border-usd-gate-2026-08-22.md`).
2. Lock image codes + hero SKU (brand-path Top 10) while samples advance; do not claim peer-class proof.
3. Replace the 126-unit proof-buy scenario assumptions with reconciled vendor quotes, approved sample decisions, price-revealed demand selections, and named traffic receipts while preserving the C$5,000-C$6,000 production cap. Rebuild the U.S. channel plan from U.S. evidence; do not transfer Canadian session arithmetic.
4. Turn the corrected product set into vendor-ready tech-pack outlines.
5. Replace financial assumptions with vendor quotes as they arrive.
6. Build a venue shortlist only after market proof / permissions path exists.
7. Build a Shopify information architecture doc for USD Markets.
8. Keep the decision log current for every major strategic choice.
9. Keep this repo synced with the Atelier app when technical capabilities change.
10. Run Drop 001 milestones in Drop OS and keep Supabase state backed up via Handoff snapshots.
11. Founder sets a TEST paid-ads cap from non-inventory cash only after duties/USD economics path is chosen; do not place ads until that cap and landing exist.
