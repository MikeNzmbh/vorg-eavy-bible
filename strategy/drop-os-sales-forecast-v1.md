# Drop OS Sales Forecast v1

Checked: 2026-08-19

Engine: `VORG Sales Forecast v1.1`

## Decision this supports

This contract supports one question: **given the current Drop 001 inventory, prices, traffic plan, event footfall, reservations, and first-party funnel evidence, what range of net units, revenue, sell-through, excess inventory, and stockout risk is plausible?**

It does not decide whether production spend is authorized. The evidence-backed Drop OS readiness and spend gate remains separate and controlling.

## What is known

- The working launch window is November 5-12, 2026 and remains conditional.
- Drop 001 is an open online DTC drop plus one controlled Ottawa/Gatineau pop-up.
- The founder-stated product set is The Firm Jacket, women's low-rise denim, men's denim, scarf, and women's top/bodysuit.
- The initial production/inventory spend ceiling is C$5,000-C$6,000 unless the founder changes it.
- Forecast Lab loads the source-linked 126-unit proof-buy working scenario from `../launch/drop-001-sales-forecast-inputs.md`; readiness and production authorization still treat vendor truth as unresolved. Session composition lives in `../launch/drop-001-traffic-channel-plan.md` (waitlist, connector, named paid ads, pop-up). Paid ads are a plan-only coverage line, not spend authorization.
- Drop OS now stores aggregate forecast inputs, frozen pre-launch calls, linked actual outcomes, and calibration diagnostics in snapshot schema v4.

## What is assumed

- The internal v1 cold-start rate priors are planning policy, not published ecommerce benchmarks.
- The optional `public-transfer-v1` profile is trained from licensed data belonging to other ecommerce businesses. It shapes uncertainty strength only; it is not VORG evidence and never supplies VORG's conversion center.
- Planned online sessions and pop-up visitors are uncertain future inputs, not known facts.
- Reservations create a demand floor and are not added on top of the same online demand twice.
- Product demand weights are relative mix assumptions until SKU-level first-party history exists.
- Missing size-demand weights use equal weak weights. The engine never infers demand from the inventory curve.
- Refunds reduce net demand units in the simulation.

## What is unresolved

- Vendor-backed inventory, price, and landed COGS by SKU.
- Size curve by applicable SKU.
- A named owned-channel traffic plan in `../launch/drop-001-traffic-channel-plan.md`. Historical VORG product-view, cart, checkout, purchase, refund, and pop-up counts are still missing.
- How Shopify returns, cancellations, taxes, discounts, shipping revenue, and POS orders will be reconciled into one net-sales receipt.
- Prior replacement or re-estimation after enough independent VORG launches exist.

## Truth boundary

The forecast has four truth states:

| State | Meaning |
| --- | --- |
| `blocked` | Required merchandise or demand-driver inputs are missing or internally impossible. No forecast should be used. |
| `scenario` | A range can be simulated, but traffic, funnel, reservations, or conversion still relies materially on planning assumptions and cold-start priors. |
| `evidence-anchored` | A historical traffic receipt and funnel receipt are linked, observed funnel counts exist, and any reservation count has a receipt. A traffic plan alone cannot qualify. The output remains uncertain. |
| `synthetic-test` | Generated receipts and outcomes are exercising software behavior. Synthetic inputs contribute zero launch proof and are excluded from live calibration even when every field is populated. |

No forecast state changes the readiness score, clears a factory gate, proves demand, or authorizes spend.

## Model contract

### Inputs

- Horizon: 1-90 days.
- Demand plan: planned online sessions, planned pop-up visitors, optional session-to-purchase planning prior, units-per-order assumption, qualified reservations, and reservation-conversion assumption.
- Cash exposure: committed non-inventory launch spend, kept separate from inventory landed COGS.
- Aggregate observed funnel: sessions, product views, adds to cart, checkouts, purchase orders, purchased units, refunded units, pop-up visitors, pop-up purchases.
- Merchandise: active SKU inventory, retail price, landed COGS, relative demand weight, optional size inventory.
- Evidence: traffic plan/receipt plus an explicit `plan` or `historical` classification, funnel export/receipt, reservation receipt.
- Evidence mode: `live` by default or explicit `synthetic` for the test harness. Paths under a marked synthetic fixture directory fail closed to `synthetic-test` even if locally relabelled live.
- Reproducibility: simulation count and fixed random seed.

Customer names, emails, phone numbers, addresses, order notes, and other PII must never be pasted into the Forecast Lab. Only aggregate counts and links to controlled receipts belong in the state.

### Funnel simulation

The online path is:

```text
planned sessions
  -> product views
  -> adds to cart
  -> checkouts
  -> purchase orders
  -> gross units
  -> net demand units after refunds
```

Each conversion rate is sampled from a beta posterior. Observed aggregate successes and trials update a deliberately weak internal prior. Planned traffic is sampled from a lognormal distribution; no reference uses the widest uncertainty, a linked plan remains wider than a historical receipt, and only a classified historical receipt receives the narrowest v1 traffic range. Pop-up traffic and purchase conversion are simulated separately.

A blank downstream funnel field is missing data, not an observed zero. A transition updates only when both its numerator and denominator are explicitly recorded; a complete core funnel is required for `evidence-anchored` status.

When a complete observed core funnel is absent, the operator may enter a direct session-to-purchase planning prior. The engine samples around it and labels the mode `planning-prior`; this does not become VORG evidence. If aggregate observed sessions and purchase orders are both entered, those counts Bayesian-update the planning prior and are labelled `observed` on that rate only. That still does not create `evidence-anchored` status, readiness credit, or live calibration. A complete observed funnel continues to override the planning prior entirely. Likewise, observed orders and purchased units override the units-per-order assumption.

The v1 internal prior shapes are:

| Transition | Beta shape | Prior mean |
| --- | --- | --- |
| Session -> product view | Beta(2, 3) | 40% |
| Product view -> cart | Beta(1, 9) | 10% |
| Cart -> checkout | Beta(2, 3) | 40% |
| Checkout -> purchase | Beta(2, 3) | 40% |
| Purchased unit -> refund | Beta(1, 19) | 5% |
| Pop-up visitor -> purchase | Beta(1.5, 8.5) | 15% |

These are weak cold-start assumptions. They must not be described externally as VORG performance, an industry benchmark, or a guarantee.

The `internal-weak` direct session-to-purchase planning option uses 20 effective observations around the operator-entered rate. The public-transfer challenger lowers that strength to 7.75785. In both cases the entered rate is the beta mean; changing strength changes skew as well as width, so simulated P50 revenue can move even though no external base rate is imported.

### Public-data transfer profile

Forecast Lab defaults to the versioned `public-transfer-v1` challenger while VORG has no launch history. Its provenance and model card live in `../research/commerce-intelligence/public-data-model/`.

- A leakage-controlled L2 logistic classifier is fitted to 12,330 public shopping sessions. Random holdout AUC/Brier are 0.758938/0.121621; blocked October-December holdout AUC/Brier are 0.684304/0.158559. These are within-source diagnostics, not VORG accuracy.
- The source's 15.474453% purchase rate is rejected as a VORG level. Only between-month variation, after a 75% transfer discount, becomes 7.75785 effective observations around the operator-entered VORG rate.
- The 541,909-row Online Retail source informs a four-observation refund-strength stress. Its median 151-unit basket is rejected because the dataset is wholesale-heavy.
- The 165,474-row clothing clickstream is retained for schema research but excluded from sales training because it has no purchase outcome.
- The profile contributes zero evidence, readiness, production authorization, or live-calibration credit. A first-party complete observed funnel overrides the direct planning model.

Rate precedence is: reconciled first-party VORG observations; otherwise the entered VORG planning center with public-transfer strength when selected; otherwise the internal weak prior. External base conversion, revenue, basket size, assortment, or cancellation rates never become VORG defaults.

### Inventory and merchandise logic

1. Simulated online and pop-up net demand is allocated across SKUs by relative demand weight.
2. Net sold units are capped at recorded SKU inventory.
3. Demand above inventory is reported as lost demand.
4. Inventory below demand creates stockout probability; inventory above sales creates excess-inventory ranges.
5. If size inventory is supplied, its total overrides the SKU inventory field and size-level stockout ranges are calculated.
   Missing size-demand weights use equal weak weights; supply quantities are not allowed to masquerade as demand evidence.
6. Revenue equals net sold units times recorded retail price.
7. Gross profit is withheld unless every active SKU has landed COGS.

Discounts, taxes, shipping, payment fees, duties outside landed COGS, variable marketing, founder pay, and unmodeled losses are not automatically modeled in v1. `Revenue less inventory buy` and `revenue less full committed plan` are narrow cash-recovery diagnostics—not accounting profit, free cash flow, or a complete break-even model.

### Outputs

- P10 / P50 / P90 revenue.
- P10 / P50 / P90 gross profit when COGS is complete.
- Demand units, net sold units, online units, pop-up units.
- Sell-through, excess inventory, and lost demand ranges.
- Probability of reaching 50%, 70%, 90%, and 100% sell-through.
- Probability of reaching the internal Drop 001 85% sell-through target.
- Probability of any SKU stockout and per-SKU stockout probability.
- Product and optional size-level demand/sales ranges.
- Full inventory landed-cost exposure, revenue less the full inventory buy, and probability that merchandise revenue recovers that buy when all COGS is complete.
- Revenue less the full working committed plan (inventory plus entered non-inventory spend) and the probability revenue recovers that amount.
- Model warnings, blocking errors, rate sources, data completeness, engine/prior version, simulation count, and seed.

P10 / P50 / P90 are simulation quantiles. They are not guarantees, confidence claims, or proof of market demand.

### Automatic stress suite

The UI compares the saved base call with five deterministic counterfactuals:

- traffic miss: online and pop-up traffic 30% below plan;
- pop-up cancelled: zero event visitors or sales;
- cost overrun: landed COGS +20% and committed non-inventory spend +10%;
- combined downside: traffic -30%, purchase conversion -35%, no pop-up, COGS +20%, and other committed spend +10%;
- controlled upside: traffic +20% and purchase conversion +30%, still capped by inventory.

Challengers use 700-1,200 simulations for interactive speed and fixed seed offsets for reproducibility. They are sensitivity tests, not additional forecasts or evidence.

## Frozen forecast protocol

1. Save all assumptions and link the evidence available at decision time.
2. Freeze the forecast before the launch begins or before the decision it is intended to grade.
3. The frozen object stores the full normalized input, model output, engine/prior version, seed, and timestamp.
4. Never overwrite a frozen call after observing sales.
5. After the drop, link net revenue, net units sold, optional sell-through, and the controlled actuals receipt.
6. Live calibration uses only evidence-linked live actuals. Synthetic outcomes require an explicit synthetic calibration request and never mix into live metrics.

If a linked actual is corrected, the prior recorded actual is retained in `actualHistory` inside the snapshot before the latest value becomes active.

Multiple frozen scenarios from one drop remain useful audit records, but only the earliest timestamped evidence-linked call from that drop enters calibration metrics. A post-outcome reforecast cannot replace the pre-launch call, and one launch cannot manufacture independent history.

## Calibration contract

The dashboard reports:

- revenue weighted absolute percentage error (WAPE);
- units WAPE;
- P10-P90 interval coverage for revenue and units;
- revenue median bias;
- Brier score for the event `sell-through >= 70%` when actual sell-through is recorded;
- count of linked forecasts and count of independent drops.

Calibration status is deliberately conservative:

- 0 independent drops: `uncalibrated`;
- 1: `first-outcome`;
- 2-3: `early`;
- 4-7: `provisional` only if internal error and coverage floors pass, otherwise `needs-work`;
- 8+: `calibrated` only if tighter internal gates pass, otherwise `needs-work`.

These thresholds are internal governance policy. They are not external standards and must be reviewed after real VORG history accumulates.

The synthetic bench uses the same calculations in a separate calibration lane. Its status validates code paths only; it cannot establish accuracy, replace first-party outcomes, or promote priors.

## Anti-gaming controls

- Missing inventory, price, or all demand drivers blocks the model.
- Negative and fractional counts are rejected.
- Funnel counts must be monotonic: views cannot exceed sessions, carts cannot exceed views, checkouts cannot exceed carts, and purchases cannot exceed checkouts.
- Blank funnel fields never masquerade as zero-conversion observations.
- Purchased units cannot be lower than purchase orders; refunds cannot exceed purchased units.
- Evidence must be a valid web URL or repo/file path; `TBD`, `none`, and similar placeholders do not count.
- Explicit synthetic mode or a marked synthetic input or outcome fixture path forces the record into the synthetic lane; changing a local mode field cannot promote generated receipts into live evidence or calibration.
- Live calibration filters out every synthetic forecast. Synthetic calibration must be requested explicitly and remains labelled test-only.
- A traffic reference must be classified as `plan` or `historical`; a plan cannot tighten the model as historical performance.
- An external profile must exactly match the engine-approved ID, model version, checked date, transfer strengths, and three source URLs or the forecast fails closed. A refreshed artifact requires explicit engine review and promotion.
- External data cannot create `evidence-anchored` status, add calibration observations, move readiness, or replace the entered VORG conversion center.
- Missing size-demand weights use equal weak priors rather than copying the inventory allocation.
- Gross profit is withheld when any active SKU cost is missing.
- Inventory caps sales in every simulation.
- Current input changes cannot rewrite frozen forecasts.
- Multiple snapshots from one drop do not increase the independent calibration count or overweight its calibration metrics.
- The Forecast Lab has no code path into the readiness or spend-authorization calculation.
- Guru, book, AI, social, or library claims may inspire a tested scenario but contribute zero first-party evidence by repetition alone.

## Instrumentation contract

Use one deduplicated event dictionary across Shopify and analytics:

| Forecast count | Preferred first-party event or receipt |
| --- | --- |
| Sessions | GA4 sessions over the declared traffic window |
| Product views | GA4 `view_item` or Shopify `product_viewed` |
| Adds to cart | GA4 `add_to_cart` or Shopify `product_added_to_cart` |
| Checkouts | GA4 `begin_checkout` or Shopify `checkout_started` |
| Purchases | GA4 `purchase` reconciled to Shopify `checkout_completed` / order export |
| Purchased units | Shopify order-line quantity after cancellation policy |
| Refunds | Shopify refund/return export reconciled to net units |
| Pop-up visitors | Controlled counter or venue tally receipt |
| Pop-up purchases | Shopify POS order export, deduplicated from online orders |

Define identity, duplicate-event, timezone, cancellation, refund, discount, and POS reconciliation rules before importing counts. GA4 and Shopify events with similar names are not automatically identical datasets.

## Source basis

- Google Analytics, **Measure ecommerce**, checked 2026-07-22: <https://developers.google.com/analytics/devguides/collection/ga4/ecommerce>
- Shopify, **Web Pixels API standard events**, checked 2026-07-22: <https://shopify.dev/docs/api/web-pixels-api/standard-events>
- Shopify, **checkout_completed**, checked 2026-07-22: <https://shopify.dev/docs/api/web-pixels-api/standard-events/checkout_completed>
- Hyndman and Athanasopoulos, **Forecasting: Principles and Practice (3rd ed.) — Prediction intervals**, open textbook, checked 2026-07-22: <https://otexts.com/fpp3/prediction-intervals.html>
- Hyndman and Athanasopoulos, **Forecasting: Principles and Practice (3rd ed.) — Time-series cross-validation**, open textbook, checked 2026-07-22: <https://otexts.com/fpp3/tscv.html>
- UCI Machine Learning Repository, **Online Shoppers Purchasing Intention Dataset**, CC BY 4.0, checked 2026-07-25: <https://archive.ics.uci.edu/dataset/468/online+shoppers+purchasing+intention+dataset>
- UCI Machine Learning Repository, **Online Retail**, CC BY 4.0, checked 2026-07-25: <https://archive.ics.uci.edu/dataset/352/online+retail>
- UCI Machine Learning Repository, **Clickstream Data for Online Shopping**, CC BY 4.0, checked 2026-07-25: <https://archive.ics.uci.edu/dataset/553/clickstream+data+for+online+shopping>
- Google for Developers, **BigQuery sample dataset for Google Analytics ecommerce web implementation**, checked 2026-07-25: <https://developers.google.com/analytics/bigquery/web-ecommerce-demo-dataset>

The analytics and forecasting sources govern event semantics and honest evaluation. The UCI sources validate only the reproducible within-source training diagnostics and transfer controls; none validate VORG demand or forecast accuracy. The optional Google query is documented but was not executed in v1.

## 10x roadmap

### Now: auditable cold start

- Deterministic Monte Carlo ranges.
- Explicit internal priors and truth state.
- Licensed public-data challenger with reproducible artifacts, rejected-transfer rules, and zero-proof labeling.
- SKU and size-level inventory constraints.
- Frozen calls, outcome receipts, and calibration.
- Synthetic evidence bench covering the full funnel, SKU/size allocation, stresses, frozen call, linked outcome, and isolated calibration.
- Local/browser snapshot schema v4.

### Next: automated first-party receipts

- Shopify order/refund and POS aggregate adapter.
- GA4 funnel aggregate adapter.
- Channel-level traffic plans with named owners and date windows.
- Automated duplicate, missing-day, timezone, and impossible-funnel checks.
- Net-revenue reconciliation report before outcomes enter calibration.

### After four independent drops: VORG-informed model

- Replace static priors with versioned hierarchical posteriors by channel and product class.
- Backtest every proposed model against a frozen baseline using rolling-origin evaluation.
- Keep the simpler model unless the challenger improves error and interval calibration without leakage.
- Add documented promotion/rollback gates and preserve old engine versions for audit.

### After eight or more credible drops: decision optimization

- Estimate channel response curves and marginal contribution with controlled test data.
- Compare inventory buys against cash-at-risk, expected excess stock, and lost-demand ranges.
- Run downside survivability scenarios under delayed inbound, lower traffic, higher refunds, discounting, and pop-up cancellation.
- Optimize for risk-adjusted contribution and learning value, not headline revenue.

## Next agent

1. Do not tune priors against the Drop 001 outcome before grading the frozen v1 call.
2. Obtain vendor-backed SKU inventory, price, landed COGS, and size curves.
3. Write the GA4/Shopify/POS reconciliation dictionary before enabling automated imports.
4. Freeze the first forecast before launch and export snapshot schema v4.
5. Link actual outcomes after returns/cancellations settle under the written reconciliation policy.
6. Review calibration only across independent drops; keep readiness authorization separate.
