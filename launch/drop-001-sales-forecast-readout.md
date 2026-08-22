# Drop 001 Sales Forecast Readout

Checked: 2026-08-19

Engine: `VORG Sales Forecast v1.1`

Prior version: `VORG cold-start priors 2026-07.1 + VORG public-data transfer priors v1.0`

Input contract: [`drop-001-sales-forecast-inputs.md`](drop-001-sales-forecast-inputs.md)

Traffic plan: [`drop-001-traffic-channel-plan.md`](drop-001-traffic-channel-plan.md)

Public-data model card: [`../research/commerce-intelligence/public-data-model/MODEL_CARD.md`](../research/commerce-intelligence/public-data-model/MODEL_CARD.md)

Truth state: `scenario` / `planning-prior`; not vendor-backed, not first-party demand proof, and not production or ads authorization.

## Decision this supports

Keep developing the 126-unit proof-buy only if the team treats 85% sell-through as a coverage **goal**, uses Forecast Lab to see which owned channels (including named paid ads) must produce sessions and orders, and refuses to freeze or spend from the current 25.3% tail probability.

## How to read this so it helps hit 85%

85% of 126 units is about **107 units**, or **86 orders** at 1.25 units per order. That is the target inventory coverage. It is not what P50 says today.

| Read this | As | Not as |
| --- | --- | --- |
| 85% sell-through | The Drop 001 goal | Something the model already predicts |
| P50 (45 units, 35.7%) | The middle of uncertain worlds if conversion is still unproven | The plan |
| P(sell-through ≥ 85%) = 25.3% | Share of simulations that still get lucky enough to clear 107 units | A Meta win rate, ROAS, or a number to juice by weakening priors |
| P10 / P90 | Downside / upside of the same unproven plan | A confidence interval on VORG |
| 3.06% | Entered planning mean | Observed VORG conversion |
| 2,160 sessions | Named coverage (980 waitlist + 330 connector + 850 paid ads) | Bought traffic or historical proof |

v1.1 keeps the 3.06% center until real session and purchase counts exist. Then it Bayesian-updates that planning prior. Do not type fake purchases to move 25.3%. Watch P50 and P(85%) move only when receipts strengthen evidence.

Operating loop:

1. Keep the inventory goal: 107 units / 86 orders.
2. Name sessions by channel, including a founder-capped Ottawa/Gatineau paid line.
3. Buy ads only as a TEST proof from non-inventory cash, with action-time approval. Enter only real tagged sessions and purchases.
4. Recalculate. If P50 and P(85%) move, it should be because conversion is no longer a near-zero-skewed guess.
5. Freeze the call before the decision it will grade. Forecast Lab still cannot authorize spend.

## Reproducibility

- Base forecast: 10,000 deterministic simulations.
- Base seed: `260722`.
- Horizon: 30 days.
- Stress challengers: 1,200 deterministic simulations each with documented seed offsets.
- Inventory: 126 units.
- Inventory landed cost: C$3,712 working assumption.
- Committed non-inventory spend: C$4,700 working assumption.
- Full working committed plan: C$8,412 before payment fees and unmodeled leakage.
- Online plan: 2,160 qualified sessions at a 3.06% session-to-purchase planning prior, composed as 980 waitlist + 330 connector + 850 named paid ads.
- Paid 850-session line: coverage arithmetic for 26 orders; CAC unknown; not a live campaign.
- Traffic proof class: linked plan only (`drop-001-traffic-channel-plan.md`); no historical receipt, so the engine uses wider plan-level traffic uncertainty.
- Pop-up plan: 135 visitors using the internal 15% cold-start purchase prior.
- Units per order: 1.25 planning assumption.
- Reservations and observed funnel: deliberately blank because no receipt exists.
- Cold-start profile: `public-transfer-v1`. It retains the entered 3.06% VORG planning center while using a licensed external-data strength of 7.75785 effective observations to widen uncertainty. It contributes zero VORG proof or calibration credit.

The numeric range matches the 25 Jul 2026 10,000-run readout because the session total is still 2,160. What changed is composition and interpretation: unnamed ecommerce is gone; paid ads are named; 25.3% is still a tail, not a target.

## Base range

| Metric | P10 | P50 | P90 |
| --- | ---: | ---: | ---: |
| Revenue | C$831 | C$4,299 | C$12,060 |
| Net units sold | 9 | 45 | 126 |
| Sell-through | 7.1% | 35.7% | 100% |
| Excess inventory | 0 | 81 | 117 |
| Revenue less inventory buy | -C$2,881 | C$587 | C$8,348 |
| Revenue less full C$8,412 committed plan | -C$7,581 | -C$4,113 | C$3,648 |

Probability diagnostics:

| Event | Probability |
| --- | ---: |
| At least 50% sell-through | 40.0% |
| At least 70% sell-through | 30.2% |
| At least 85% sell-through | **25.3%** |
| At least 90% sell-through | 23.5% |
| Full sell-through | 18.5% |
| Any SKU stockout | 28.9% |
| Revenue recovers inventory buy | 54.6% |
| Revenue recovers full C$8,412 committed plan | **30.3%** |

## Product median

| Product | Inventory | P50 sold | P50 sell-through | Stockout probability | P50 revenue |
| --- | ---: | ---: | ---: | ---: | ---: |
| The Firm Jacket | 12 | 4 | 33.3% | 23.8% | C$996 |
| Women's low-rise denim | 24 | 9 | 37.5% | 23.1% | C$1,152 |
| Men's denim | 20 | 7 | 35.0% | 23.3% | C$896 |
| Scarves | 40 | 14 | 35.0% | 22.8% | C$490 |
| Women's top / bodysuit | 30 | 11 | 36.7% | 23.0% | C$748 |

These are SKU-level results. Size inventory is unresolved, so actual size-level stockout and stranded-inventory risk is wider than shown.

## Stress matrix

| Scenario | P50 revenue | P50 units | P50 sell-through | Chance of 85%+ | P50 excess | P10 cash vs full plan | Chance full-plan recovery |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Current plan | C$4,299 | 45 | 35.7% | 25.3% | 81 | -C$7,581 | 30.3% |
| Traffic miss: online and pop-up -30% | C$2,960 | 31 | 24.6% | 17.8% | 95 | -C$7,858 | 21.5% |
| Pop-up cancelled | C$1,181 | 13 | 10.3% | 20.2% | 113 | -C$8,412 | 23.3% |
| Cost overrun: COGS +20%, other spend +10% | C$3,890 | 40 | 31.7% | 23.1% | 86 | -C$8,864 | 24.2% |
| Combined downside | C$575 | 6 | 4.8% | 10.8% | 120 | -C$9,624 | 12.0% |
| Controlled upside: traffic +20%, conversion +30% | C$5,401 | 57 | 45.2% | 32.0% | 69 | -C$7,330 | 38.1% |

Stress definitions are implemented in `../site/src/sales-forecast.ts`. They are controlled counterfactuals, not predictions.

## Operator conclusion

The working plan is **not robust enough to freeze as the launch forecast**.

- The goal remains 85% sell-through. The median is 35.7%. Use the gap as a coverage checklist, not as a reason to weaken the prior.
- 25.3% is the lucky tail under a weak conversion prior. It is not permission to scale ads.
- Named paid ads can cover 26 of the 86 orders only after a TEST produces tagged sessions. CAC is unknown.
- Revenue recovers the inventory buy in 54.6% of simulations and the full working committed plan in 30.3%, before payment fees, returns, discounts, shipping subsidy, tax treatment, founder pay, or damage loss.
- The plan still depends on the pop-up. Removing it cuts median sell-through to 10.3%.
- Do not restore unnamed ecommerce. Do not build an autopilot media buyer.

## Next evidence gates

### 1. Merchandise truth

- Obtain a dated quote, MOQ, Incoterm, freight/duty treatment, lead time, and approved sample path for every active product.
- Keep total inventory landed cost under C$6,000 and rerun the cost-overrun stress with quote-specific ranges.
- Do not add size inventory until fit evidence and price-revealed size selections exist.

### 2. Demand proof

- Record at least 40 deduplicated, price-revealed product + size + colour selections across the drop.
- Require at least eight qualified selections for every product entering bulk.
- Replace the demand weights with those selections; do not tune weights to make the forecast look balanced.

### 3. Traffic coverage

- Prove waitlist reachability (500 consented, tagged unique sessions).
- Issue connector codes before counting 330 connector sessions as historical.
- Founder sets a TEST paid cap from non-inventory cash, one Ottawa/Gatineau geo, one landing, then replace the 850-session plan with tagged ad sessions.
- Enter real session + purchase counts so v1.1 can update the planning prior.

### 4. Pop-up dependence

- Confirm venue capacity, RSVP target, expected show rate, walk-in policy, counter method, POS path, and local-pickup treatment.
- Build a no-pop-up contingency.

### 5. Measurement

- Implement the GA4/Shopify/POS event and reconciliation contract in `../strategy/drop-os-sales-forecast-v1.md`.
- Keep aggregate counts only in Drop OS.
- Freeze the pre-launch call only after merchandise, traffic, and event inputs have dated receipts.

## Known, assumed, unresolved

Known: product set, C$6,000 production ceiling, open online plus pop-up architecture, founder intent to buy ads as a named TEST-then-scale channel, and the fact that no quote/funnel/ad-account packet exists in the repo.

Assumed: all merchandise numbers, 980/330/850 session split, 135 pop-up visitors, 3.06% online conversion, 1.25 units/order, C$4,700 non-inventory spend, demand weights, and public-transfer uncertainty strength.

Unresolved: vendor feasibility, approved samples, size curve, waitlist reachability, connector roster, paid cap and CAC, pop-up capacity/show rate, observed funnel, cancellations, returns, discounts, fees, tax, shipping subsidy, and actual launch cash leakage.

## Next agent

Do not raise P(85%) by editing priors or inventing purchases. Replace one named channel with a receipt, rerun the base and stress suite, and freeze only when the decision timestamp and evidence packet are ready. Do not place ads or spend unless the founder has set a TEST cap in Ads Manager.
