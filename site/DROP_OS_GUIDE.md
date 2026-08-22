# Drop OS — Team Playbook

Checked: 2026-07-25

## What this is

Drop OS is VORG-EAVY's internal **drop desk** — one collection, one city wedge, one bag check at a time. Built for sample proof, founder content, controlled units, Shopify launch, pop-up heat, and next-city pull.

- App: `site/drop-os.html`
- **Full walkthrough with screenshots:** `site/drop-os-guide.html`
- Screenshots: `site/assets/guide/` (regenerate with `node site/capture-guide-screenshots.mjs`)
- Smoke tests: `node site/test-drop-os-flow.mjs` (requires local server on port 4182)
- Operating system doc: `strategy/drop-operating-system.md`

## The loop

```text
Heat → Concept → Sample → Campaign Proof → Production → Campaign Build → Online Drop → Pop-Up → VORG After → Debrief
```

**Campaign Proof** gates bulk production. **Drop desk** gates spend (bag check: GO / TEST / FIX IT / HOLD).

## Daily desk (2 min)

1. **Drop desk** — bag check + bag lock banner
2. **Milestone timeline** — status, gate, proof link
3. **This week's run** — complete or add a move
4. **Edge Commerce Lab** — search free sources and claims; check live tests, caps, violations, and receipts
5. **Forecast Lab** — update the range only when the traffic, funnel, reservation, inventory, price, or cost evidence changes
6. **Heat radar** — log new pull if something moved

## Drop lanes

| Lane | Use for |
| --- | --- |
| Drop desk | Bag check, blockers, milestones, readiness model |
| Heat radar | DMs, saves, waitlist, city pull |
| SKU room | Samples, fit risk, reference photos |
| Edge Commerce Lab | 83 free-source routes, 34 atomic claims, 30-play ledger, seven-day control cards, risk/spend gates, decision memory |
| Forecast Lab | Probabilistic revenue/units/sell-through ranges, SKU and size stockout risk, frozen calls, actual receipts, calibration |
| Factory gate | Quotes, MOQ, COGS, PP sample |
| Online drop | Shopify, sizing, sell-through UX |
| Pop-up | Day room + VORG After night |
| Next city | Expansion read from logged heat |
| Debrief | Post-drop sell-through and margin |
| Handoff | Export, snapshot, import, next drop |

## How-to (see screenshots in guide)

| Move | Path |
| --- | --- |
| Log heat | Heat radar → Log heat + attach a proof reference when available |
| Upload SKU pic | SKU room → Upload photo |
| Update gate | Drop desk → timeline → workbench |
| Review proof links | Drop desk → Proof links |
| Search commerce knowledge | Edge Commerce Lab → Free library → Atomic claims / Sources |
| Forge a controlled test | Edge Commerce Lab → 30-tactic ledger → Forge experiment |
| Close the test loop | Edge Commerce Lab → Experiments → result evidence + decision |
| Build a sales range | Forecast Lab → demand plan + observed funnel + merchandise model → Save + recalculate |
| Freeze and grade a call | Forecast Lab → Freeze pre-launch call → link actual revenue, units, and outcome receipt |
| Stress the launch | Forecast Lab → Launch stress matrix → compare traffic miss, pop-up cancellation, cost overrun, combined downside, and controlled upside |
| Add squad move | Drop desk → This week's run |
| Backup | Handoff → Copy snapshot |
| Clear readiness item | Factory / Online drop / Pop-up → tap checklist card |
| Next drop | Handoff → snapshot first → Start next drop |
| Sync squad | Handoff → CSV or snapshot |

## Real talk

- State lives in **this browser** until export
- Factory / launch / pop-up checklists are interactive and saved locally
- Handoff has a daily backup ritual; `Copy snapshot` marks today's backup done
- Drop readiness is an evidence-adjusted operating index, not a sell-through promise
- Campaign outlook is directional, not a calibrated probability
- Sales Forecast v1.1 is a separate range model, not the readiness score. It cannot clear a factory gate or authorize spend or ads.
- Forecast Lab loads the source-linked 126-unit proof-buy working scenario on a fresh or previously blank forecast state. Use **Reload 126-unit scenario** to restore it without deleting frozen calls.
- **Cold-start profile** defaults to **Licensed public data · transfer stress**. It uses public-company data only to choose weak prior strength around the entered VORG conversion rate; it supplies no VORG rate, proof, readiness, or calibration credit. Switch to **Internal weak priors** to compare the previous assumption-only range.
- The loaded scenario is 126 units / C$3,712 assumed inventory cost / C$4,700 assumed non-inventory spend / 2,160 planned sessions (980 waitlist + 330 connector + 850 named paid ads) / 135 planned pop-up visitors / 3.06% planning conversion / 1.25 units per order. Traffic is **plan only**. Paid ads are a named coverage line, not a live campaign or CAC.
- Set **Traffic proof type** to **Historical receipt** only when the linked artifact contains reconciled past traffic for the declared channel/window. A plan link preserves provenance but cannot earn the tighter historical uncertainty range.
- A `scenario` forecast still relies materially on internal or external-transfer cold-start priors. Session + purchase orders update the planning prior in v1.1 without creating `evidence-anchored` status. `Evidence-anchored` still requires linked first-party traffic/funnel receipts and a complete observed core funnel.
- P10/P50/P90 are downside/middle/upside simulation quantiles, not promises. Gross profit is withheld if any active SKU lacks landed COGS.
- The stress matrix automatically challenges traffic, pop-up dependence, cost drift, combined downside, and controlled upside. Stress results are counterfactuals, not separate predictions.
- **Run synthetic evidence test** loads clearly marked fabricated receipts, executes the evidence, size, stress, freeze, outcome, and calibration paths, then displays a purple `synthetic-test` banner. It replaces the live inputs but preserves frozen calls.
- Synthetic fixture paths fail closed to `synthetic-test`. Synthetic outcomes appear only in the isolated synthetic harness and never change live calibration or readiness. Use **Reload 126-unit scenario** to return to the working plan.
- Freeze the pre-launch call before sales are observed. Only evidence-linked actuals enter calibration, and multiple snapshots from one drop count as one independent outcome.
- Forecast Lab accepts aggregate counts only. Never paste customer names, emails, phone numbers, addresses, or other PII.
- Unverified signals are discounted; repeated proof references count once
- Campaign tactics require a proof URL or repo path before approval counts as verified
- The 30-play ledger is an idea bank, not proof. Planned entries contribute zero to the algorithm.
- The Free library has 83 lawful source routes and 34 deduplicated claims. AI or guru repetition cannot increase proof; only a qualifying VORG experiment can move the score.
- A completed Edge experiment needs a result summary, valid evidence reference, and adopt/adapt/retest/reject decision. Positive proof also needs qualified action, two reusable assets, a populated and cleared prerequisite checklist, required approvals, and spend inside cap.
- Imported decisions cannot manufacture completion, unknown source tiers are forced to frontier F, and one receipt reused across campaign surfaces counts once.
- Yellow and Orange experiments need timestamped approval saved before the run transition; Orange also needs prior recorded counsel review. Active Red-risk or over-cap experiments force HOLD.
- The decision-memory view keeps wins and failed tests so Drop 002 does not relearn the same lesson.
- Bulk remains locked until SKU, financial, campaign, operations, stage, risk, and active production-cap gates all clear

## QA status (2026-07-25)

`tests/drop-os-algorithm.test.mjs` covers false approval from sliders, missing PP proof, budget overrun, stage-order violations, click-only campaign work, duplicate signals, city aggregation, malformed finance inputs, planned Edge work scoring zero, invalid imported decisions, provenance-verified tier weighting, timestamped approval, nonempty prerequisites, cross-surface receipt deduplication, Red-risk stops, experiment budget overruns, missing receipts, and experiment-ID deduplication. Run `npm run test:algorithm` before relying on a scoring change.

`tests/edge-commerce-library.test.mjs` validates source and claim schemas, rights routes, URLs, tactic mappings, full-text permissions, fingerprints, and the generated browser bundle. Run `npm run test:library` after every registry change.

`tests/sales-forecast.test.mjs` covers blocked inputs, deterministic output, evidence state, impossible/negative funnels, inventory and revenue caps, missing COGS, size overrides, traffic/reservation response, finite outputs, actual-evidence gating, independent-drop calibration, duplicate-drop protection, synthetic fail-closed labeling, synthetic stress propagation, and live/synthetic calibration isolation. Run `npm run test:forecast` after every model change.

`tests/public-commerce-priors.test.mjs` verifies JSON/browser artifact identity, immutability, licences, row counts, holdout improvement, target-leakage exclusion, rejected transfers, bounded strengths, and the VORG-center policy. Run `npm run test:public-priors` after every public-data refresh.

`test-drop-os-flow.mjs` has 59 checks covering the 83-source library, 34 atomic claims, filters, mobile fit, 30-play ledger, experiment completion, pre-run Yellow approval sequencing, decision memory, public-transfer diagnostics, Forecast Lab save/freeze/actual/calibration, the isolated synthetic evidence bench, signal/campaign persistence, manufacturing proof, snapshot schema v4, and investor Edge metrics.
