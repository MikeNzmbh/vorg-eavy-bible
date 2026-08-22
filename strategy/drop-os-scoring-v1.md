# Drop OS Scoring v1.3

Checked: 2026-08-22

## Decision Supported

Decide whether Drop 001 may move into bulk production spend, controlled proof tests, proof-building work, or a hard pause without letting self-rated optimism substitute for receipts.

## Current Decision

Use `VORG Drop OS score v1.3` as the local cockpit engine. It is a conservative readiness, experiment-control, spend-control, and market-entry model, not a sales predictor.

The canonical implementation is `site/src/drop-os-algorithm.ts`. The browser consumes the compiled `site/drop-os-algorithm.js` bundle.

## Why v0.4 Was Replaced

The previous model had four material weaknesses:

1. Perfect sliders and status clicks could create a high score without linked proof.
2. Campaign work started at 40/100 even when no tactics existed.
3. Repeated copies of the same signal could add demand heat.
4. An uncalibrated campaign index was presented as a percentage-like success rate.

Those failure modes were incompatible with the repo's proof-before-scale rule and the C$5,000-C$6,000 initial production ceiling.

## v1.3 Model

### Readiness inputs

| Component | Readiness weight | What controls it |
| --- | ---: | --- |
| Manufacturing truth | 18% | Vendor, quote link, landed COGS, MOQ, lead time, sample link/stage, PP approval |
| Financial proof | 16% | Units, price, price-test/approval reference, quote-backed landed COGS, positive unit margin, total production spend vs cap |
| Launch operations | 14% | Effective operations score from checklist completion plus the operations input |
| Stage integrity | 12% | Reached-stage status, gate, score, evidence reference, and sequence order |
| Campaign proof | 12% | Legacy tactic receipts; once an Edge experiment finishes, 65% legacy proof plus 35% evidenced experiment proof |
| Verified demand | 10% | Deduplicated signals discounted when no evidence reference exists |
| Demand self-read | 6% | Working operator input |
| Campaign self-read | 4% | Working operator input |
| Margin self-read | 4% | Working operator input |
| Evidence self-read | 4% | Context only; it cannot satisfy an approval gate |

When a primary-market plan is entered, 10% of the base readiness index is replaced by **Market entry**. It cannot raise a score above the existing base index; it only makes a market pivot carry its own proof burden.

Risk pressure, blocked reached stages, stage-sequence violations, and evidence uncertainty reduce the readiness index.

### Evidence coverage

Evidence coverage is separate from readiness:

| Evidence surface | Coverage weight | What controls it |
| --- | ---: | --- |
| Manufacturing quote/sample references | 35% | Linked quote and sample references across active SKUs |
| Structured unit/price/COGS data | 20% | Complete, valid unit economics fields |
| Reached-stage evidence references | 20% | Proof references on the stage chain reached so far |
| Campaign evidence | 15% | Legacy tactic coverage; once an Edge experiment finishes, 70% legacy coverage plus 30% Edge result coverage |
| Verified demand signals | 10% | Deduplicated signal receipts |

When a primary-market plan is entered, 15% of the evidence coverage becomes **market-entry evidence**: market demand, checkout economics, fulfilment, cross-border and duties treatment where applicable, shipping/returns, product and marketing compliance, Shopify/TikTok route, and a permitted pop-up plan when a physical event is planned.

The cockpit shows a readiness index and an evidence-width band. Wider bands mean more unresolved evidence. This band is a decision aid, not a statistical confidence interval.

## Gate Contract

### GO / production spend eligible

GO requires all of the following:

- readiness index at least 78;
- evidence coverage at least 75;
- manufacturing truth at least 75;
- every active SKU has quote proof, landed COGS, sample proof, and PP approval;
- the unit/price/COGS model is substantially complete and inside the active production cap;
- every active SKU has a price-test or approved-price reference as well as quote-backed landed COGS;
- if a primary-market plan is entered, market-entry score at least 75 and every required route-to-market control linked;
- launch operations at least 70;
- at least two unique linked tactic wins or validated Edge Lab results, with combined campaign proof at least 50;
- Signal, Concept, Sample, and Campaign Proof stages all approved with evidence;
- risk pressure no higher than 55;
- no reached-stage block, explicit kill, or stage-order violation.

GO does not authorize an unquoted SKU change, an above-cap PO, or a public manufacturing-readiness claim without the linked evidence.

### TEST / controlled tests only

TEST requires readiness at least 45, evidence coverage at least 25, risk no higher than 72, and no reached-stage block or hard stop. Bulk remains locked.

### FIX IT / proof build only

FIX IT is the default when proof is incomplete. It allows RFQs, finance work, organic proof work, and a founder-approved one-off prototype needed to obtain sample or fit evidence. It does not authorize bulk or fixed launch commitments.

### HOLD / hard pause

HOLD is forced by any of these conditions:

- risk pressure at least 85;
- known planned production spend above the active cap, even when other SKU costs are still missing;
- a reached stage explicitly marked `kill`.

## Anti-Gaming Rules

- Empty campaign work scores zero.
- An approved tactic without a proof reference receives only partial workflow credit and cannot count as verified.
- A planned or merely running Edge tactic contributes zero experiment proof. Catalog size is not readiness.
- A decision recorded before `completed` is an invalid state and cannot convert planned work into proof.
- A completed Edge decision requires a result summary, valid evidence reference, and an explicit `adopt`, `adapt`, `retest`, or `reject` decision.
- `adopt` or `adapt` counts as validated proof only with qualified action, at least two reusable assets, a populated and cleared prerequisite checklist, required approval/counsel review, non-Red risk, and spend inside its approved cap.
- Rejected and retest decisions improve learning memory but do not create positive campaign proof.
- Evidence source tiers temper positive proof: A ×0.95, B ×0.90, C ×0.85, and frontier F ×0.75. These are internal caution multipliers, not external benchmarks.
- Yellow and Orange experiments require named, timestamped approval saved before the run transition; Orange also requires timestamped counsel review. An approval or prerequisite violation caps GO.
- An active/completed Red-risk experiment or an experiment over its approved spend cap forces HOLD.
- Experiment IDs are deduplicated before scoring, and frontier spend share is surfaced for founder review.
- A claimed source tier without a verified catalog match is forced to frontier F.
- One evidence reference reused across legacy and Edge records counts as one campaign proof, not two.
- Signals are deduplicated by evidence reference; the same receipt cannot create depth.
- Unverified signals are discounted and do not receive verified-depth bonuses.
- A numeric price and COGS assumption cannot make an SKU financially complete without a price reference and quote proof.
- Naming a primary country, Shopify, TikTok, UGC, or a pop-up does not create market-entry proof. A cross-border plan requires a documented importer/carrier treatment; a U.S. plan requires USD checkout economics; and an enabled pop-up requires a city, matching market, and permission/ops reference.
- Future stages are excluded from current stage momentum, but marking a later stage done before an earlier stage creates a sequence violation.
- The SKU proof slider is locked in the UI; manufacturing fields calculate the score.
- The campaign output is an `insufficient`, `early`, `promising`, or `strong` directional index. It is not a sell-through probability.
- Snapshot exports use schema version 3 and preserve the full Edge queue, catalog version, result metrics, spend, violations, and decision memory alongside the uncalibrated campaign-outlook object.

## Free Source Library Contract

`research/commerce-intelligence/free-source-registry.json` holds the lawful source routes and atomic claims; `site/edge-commerce-library.js` is its generated browser bundle. The registry feeds research triage and experiment design, never positive readiness directly.

| Library state | Algorithm treatment |
| --- | --- |
| Registered source | Zero proof |
| Repeated operator or AI-assisted claim | Deduplicate to one mechanism; zero proof |
| Atomic claim mapped to a tactic | Zero proof; eligible for a controlled test |
| VORG experiment planned or running | Zero positive proof; risk and spend controls apply |
| Completed experiment with receipt and controls | Existing Edge experiment contract applies |

Source evidence tier becomes a caution multiplier only after a VORG result qualifies under the experiment contract. Source count, follower count, creator confidence, and AI-generated variants cannot raise tier, readiness, or campaign proof.

## Edge Experiment Contract

The tactic catalog is separated from operational proof. `site/edge-commerce-catalog.js` holds 30 sourced plays and five Drop 001 templates; `site/src/drop-os-algorithm.ts` scores only experiment state and receipts.

| Experiment state | Algorithm treatment |
| --- | --- |
| Planned / ready / blocked | Zero positive proof |
| Running | Zero positive proof; active risk, approval, prerequisite, and spend controls apply |
| Completed + missing receipt | Zero positive proof; evidence violation caps GO |
| Completed + reject / retest + valid receipt | Learning score only |
| Completed + adopt / adapt + every control cleared | Tier-weighted positive proof plus learning memory |

The first completed experiment activates Edge weighting inside the campaign component. Until then, legacy campaign behavior is preserved so merely loading the catalog cannot lower or inflate a drop.

## Known

- The active Drop 001 production spend ceiling is C$5,000-C$6,000; v1.3 defaults to the upper C$6,000 limit.
- The revised U.S.-first Shopify + TikTok thesis is recorded as a failed-to-GO proposal in `us-first-gtm-stress-test-2026-08-22.md`; it must not silently replace the current launch wedge.
- The active product set still has TBD units, prices, and vendor-backed landed COGS.
- Vendor quotes, approved samples, campaign results, and launch checks are still unresolved for the active drop.
- The Edge Lab ships with 83 lawful free-source routes, 34 deduplicated atomic claims, 30 catalog entries, and five seven-day Drop 001 control-card templates. Their queued caps total C$215; actual spend remains zero until recorded.
- Unit tests cover the previous proof gates plus planned Edge work at zero, invalid imported decisions, provenance-verified tier weighting, pre-run approval timestamps, nonempty prerequisites, cross-surface receipt deduplication, Red-risk stops, Edge budget overruns, missing result evidence, experiment deduplication, unproven price inputs, and incomplete U.S. market-entry routes.

## Working Assumptions

- The readiness weights and thresholds are internal operating policy, not external fashion benchmarks.
- A proof reference confirms that an artifact is linked; it does not independently validate the artifact's contents.
- Positive unit margin is a completeness check, not a claim that the margin is commercially sufficient.
- The evidence-width band is heuristic until actual drop outcomes exist for calibration.
- Edge evidence-tier multipliers, learning weights, and the 65/35 campaign blend are internal working policy. They need Drop 001 outcome data before calibration.

## Unresolved

- Backtest thresholds after Drop 001 and later drops produce real outcomes.
- Archive-level DTC Midas ingestion is unresolved until a lawful X full-archive source, creator export, or licensed dataset is available; partial search results must not be represented as “all tweets.”
- Add evidence-capture timestamps, approval expiry, and artifact-content verification; approval and counsel-review timestamps are now recorded.
- Decide whether different spend classes need separate gates for samples, media, venue deposits, and bulk production.
- Decide whether all five founder-stated SKUs remain active after vendor quotes rebuild the unit plan.

## Next Agent

Do not tune weights from taste. Add dated outcome rows after each proof sprint and drop, compare predictions with observed decisions and results, then version any threshold change with a test and decision-log entry.
