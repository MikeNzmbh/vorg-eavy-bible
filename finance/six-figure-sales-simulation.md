# C$10,000 Plus Every-Two-Month Funding to Six-Figure Sales Simulation

Checked: 2026-07-28

Truth state: `working-simulation`; not vendor-quoted, VORG-calibrated, or a promise of sales.

Reproduce:

```powershell
node finance/simulate-six-figure-path.mjs
```

## Headline answer

With C$2,000 added every two months and a proof-gated target of at least 45% net-sales growth per drop, the fastest defensible threshold path reaches **C$119,192 cumulative net sales on August 15, 2027**. That is Drop 5, approximately 383 days from the July 28, 2026 model date and 280 days after the November 8 launch midpoint.

By that date, the founder has added **C$12,000** beyond the initial C$10,000. This is therefore a **C$22,000 total owner-capital path**, even though external capital remains separate from sales. It requires every drop to maintain 85% sell-through while qualified traffic and retail inventory capacity grow at least 45% per cycle.

| Owner-funded path | C$100k cumulative net sales | Annual C$100k pace | Capital and proof condition |
| --- | --- | --- | --- |
| 70% sell-through every drop | Drop 13, **February 25, 2029** | Not reached | C$30,000 added; 45% growth target fails because 70% does not clear the scale gate |
| 85% sell-through + 45% growth | Drop 5, **August 15, 2027** | **August 15, 2027** | C$12,000 added; C$119,192 net sales; C$63,826 ending cash |
| 100% sell-through + 45% growth | Drop 5, **August 15, 2027** | **August 15, 2027** | C$12,000 added; C$140,226 net sales; C$83,031 ending cash |
| 85% growth path with Ontario HST inside sticker prices | Drop 5, **August 15, 2027** | **August 15, 2027** | C$12,000 added; C$105,480 net sales; C$51,269 ending cash |

The extra funding is not what advances the perfect 85% path. With the original 25% scale cap, adding C$2,000 every two months still reaches the target on **October 24, 2027**. A 45% growth path without any additional contributions reaches **August 15, 2027** and remains cash-fundable in this threshold case. The faster date is driven by the assumed customer-sales growth; the contributions primarily strengthen runway and downside survival.

## Causal stress test

The public-transfer model remains an uncertainty test, not a VORG forecast:

| Policy | Chance of C$100k within 48 months | First-drop stop | Median completed drops | Interpretation |
| --- | ---: | ---: | ---: | --- |
| No added capital; original 25% cap | 1.7% | 59.9% | 1 | Original lean baseline |
| Added capital only; original 25% cap | 2.9% | 0.7% | 3 | Cash helps survival, but does not create demand |
| 45% growth capacity only; no added capital | 3.2% | 59.9% | 1 | Faster upside when proof clears; downside remains fragile |
| Added capital + 45% growth capacity | 9.7% | 0.7% | 3 | Strongest tested combination, still uncalibrated |

Only **0.2%** of public-transfer paths complete the first five drops while recording at least 45% net-sales growth on every step. The funded public-transfer median ends after three drops with approximately C$11,301 cumulative net sales despite C$10,000 of additional owner contributions. Capital keeps the option alive; it does not manufacture the demand proof.

## What “six figures” means

The controlling target is **C$100,000 cumulative net sales**:

- collected sales tax is excluded because it is remitted rather than retained as sales;
- unit refunds are sampled in the demand model, then an additional 5% discount/allowance leakage reduces displayed receipts;
- product prices fund a separate 5% included-shipping allowance;
- Shopify payment processing is deducted from cash;
- no founder cash withdrawal occurs before the target;
- income tax is excluded because entity structure and taxable profit are unresolved.

The simulator also tests a **C$100,000 trailing-12-month net-sales pace**. Cumulative C$100,000 alone does not mean VORG has become a six-figure annual business.

## Starting contract

| Input | Working amount |
| --- | ---: |
| Starting cash | C$10,000 |
| Additional owner contribution | C$2,000 every two calendar months |
| First additional contribution | September 28, 2026 |
| Owner capital available before Drop 001 | C$12,000 |
| Net-sales growth target | At least 45% versus the immediately preceding drop |
| Drop 001 inventory | 126 units |
| Inventory landed cost | C$3,712 |
| Inventory list value | C$12,060 |
| First-drop non-inventory spend | C$4,700 |
| First-drop committed cost | C$8,412 |
| Reserve from the initial C$10,000 before added funding | C$1,588 |
| Cash remaining after committed spend and September contribution | C$3,588 |
| Repeat cycle | 10 weeks after the November 8, 2026 midpoint |
| Additional discount/allowance leakage | 5% of pre-tax displayed receipts, after modeled unit refunds |
| Included shipping allowance | 5% of pre-tax list receipts |
| Payment processing | 2.8% of the tax-inclusive card total + C$0.30 per order |

The current Shopify Canada Basic online-card rate is 2.8% + C$0.30. The base model assumes Ontario HST is added at checkout and includes that tax in the percentage-fee base. Shopify Tax in Canada is free until the applicable C$100,000 threshold; for qualifying newer Basic/Grow/Advanced stores, a 0.25% tax-service fee applies after the threshold on applicable orders. Both terms require reconfirmation against the actual store and plan before launch.

## Model controls

- 50,000 deterministic business paths, seed `260727`.
- The first-drop demand generator exactly reproduces Forecast Lab's 10,000-run result: C$831 / C$4,299 / C$12,060 displayed revenue and 7.1% / 35.7% / 100% sell-through at P10/P50/P90.
- Public data supply prior strength only; the entered 3.06% session-to-purchase mean remains a VORG planning assumption.
- Unsold inventory stays on hand but receives zero immediate cash recovery. It cannot fund the next purchase order.
- In the retained original baseline, inventory may grow at most 25% after an 85%+ sell-through result. A 70%-84.9% result holds scale. Below 70% forces a 20% downshift.
- In the new funded-growth policy, the 25% cap is replaced by the minimum retail-capacity increase required to support 45% net-sales growth. That capacity increase still requires at least 85% prior sell-through.
- Owner contributions are credited on their calendar due dates and reported separately. They never count as revenue, conversion, sell-through, or proof.
- The first drop and current repeat structure use C$3,750 fixed launch cost plus C$950 variable packaging/acquisition cost at the 126-unit base scale. The lean repeat structure uses C$1,550 fixed plus the same C$950 variable component. That variable component scales with inventory, so C$2,500 and C$4,700 are base-scale amounts, not permanent flat costs.
- The C$2,500 lean base repeat overhead is a redesign target, not a quote. The current C$4,700 base cost remains the working plan.
- Traffic is assumed to scale with inventory. That is optimistic until each channel has a named owner, capacity, and receipt.

## First-drop survival thresholds with scheduled contributions

The September contribution is available before Drop 001; the November contribution is counted only when testing whether the January repeat can be funded. If tax is added at checkout, Drop 001 needs approximately:

| Objective after Drop 001 | Minimum sell-through |
| --- | ---: |
| Preserve the C$12,000 contributed before launch | 80.4% |
| Fund another full current-cost drop after the November contribution and retain C$1,500 | 41.3% |
| Fund a same-size lean repeat after the November contribution and retain C$1,500 | 20.3% |
| Fund the minimum 75%-size lean repeat after the November contribution and retain C$1,500 | 9.2% |

If Ontario HST is included inside the same sticker price, those thresholds become **90.9%, 46.7%, 23.0%, and 10.5%** respectively.

These are financing thresholds, not permission to continue. A weak sell-through result still fails or restricts the demand gate even when the next purchase order is affordable.

At 85% sell-through, the present prices need no uniform increase when sales tax is added at checkout. If the sticker price must also include tax, the model needs an approximate **6.9% Ontario price increase** or **8.9% Quebec price increase** merely to preserve the original C$10,000—before founder pay and income tax.

A uniform mathematical translation would be approximately:

| Product | Current | Ontario tax-inside floor | Quebec tax-inside floor |
| --- | ---: | ---: | ---: |
| Firm Jacket | C$249 | C$267 | C$272 |
| Denim | C$128 | C$137 | C$140 |
| Scarf | C$35 | C$38 | C$39 |
| Women's top | C$68 | C$73 | C$75 |

These are cash-preservation floors, not approved prices. Price elasticity, brand positioning, vendor quotes, and customer proof remain controlling.

## The fastest defensible path

The August 2027 result requires this exact proof-gated sequence:

| Drop | Working date | Inventory | Net-sales growth | Net sales | Cumulative sales | Cumulative added capital | Ending cash |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 2026-11-08 | 126 | Baseline | C$9,738 | C$9,738 | C$2,000 | C$12,480 |
| 2 | 2027-01-17 | 184 | 46.7% | C$14,290 | C$24,028 | C$4,000 | C$19,141 |
| 3 | 2027-03-28 | 269 | 46.0% | C$20,860 | C$44,888 | C$8,000 | C$30,656 |
| 4 | 2027-06-06 | 393 | 45.2% | C$30,294 | C$75,182 | C$10,000 | C$44,261 |
| 5 | 2027-08-15 | 570 | 45.3% | C$44,010 | **C$119,192** | C$12,000 | C$63,826 |

This is a threshold path, not a forecast. Drop 5 assumes approximately 4.5 times the Drop 001 inventory and qualified-traffic capacity. The modeled cash can finance it, but cash alone cannot authorize it; production capacity, channel receipts, size curves, customer service, fulfilment, and repeat demand must also scale.

## Operator decision

Do not plan around the August 2027 result as a promise. Plan around making it *eligible*:

1. Keep Drop 001 committed spend at or below C$8,412 and protect at least C$1,500 cash.
2. Do not increase the next inventory buy unless Drop 001 records at least 85% reconciled sell-through inside the defined window.
3. Rebuild base-scale repeat overhead to C$2,500 or less by separating first-drop development from recurring costs; keep scaling the packaging/acquisition component with inventory.
4. Record each C$2,000 contribution as owner capital, never as revenue or launch performance.
5. Treat 20.3% sell-through as the funded cash-survival line for a same-size lean repeat, while preserving 85% as the growth authorization gate.
6. Before each 45% inventory-capacity increase, freeze a channel-by-channel demand plan capable of producing at least 45% more qualified sales—not merely 45% more impressions or spend.
7. Update the simulator with actual net sales, fees, shipping, returns, vendor costs, contribution dates, and timing after every drop.

## Known, assumed, unresolved

Known: founder-stated C$10,000 starting budget, founder-stated intention to contribute C$2,000 every two months, current 126-unit working architecture, current price tests, C$3,712 assumed landed inventory cost, C$4,700 working non-inventory plan, and the reinvest-first rule.

Assumed: first additional contribution on September 28, 2026, uninterrupted bi-monthly contributions, 45% net-sales growth whenever the 85% gate clears, 10-week repeat cycles, sampled unit refunds plus 5% additional discount/allowance leakage, 5% included shipping, Ontario HST in the base checkout-fee calculation, C$2,500 lean repeat cost at base scale, C$950 of that base cost scaling with inventory, proportional qualified-traffic scaling, and no founder withdrawal.

Unresolved: whether every contribution will arrive on schedule, vendor quotes and MOQs, actual shipping cost, return rate, tax registration and input-tax credits, customer geography, founder salary load, income tax, repeat purchase, channel capacity, fulfilment capacity, and whether the five-SKU mix can scale from 126 to 570 units while preserving its economics.

## Source basis

- [Shopify Canada pricing](https://www.shopify.com/ca/pricing), checked 2026-07-27.
- [Shopify Tax pricing](https://help.shopify.com/en/manual/taxes/shopify-tax/pricing), checked 2026-07-27.
- [Shopify: include taxes in product prices](https://help.shopify.com/en/manual/taxes/include-exclude-taxes), checked 2026-07-27.
- [Canada Revenue Agency: GST/HST rates](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html), checked 2026-07-27.
- [Revenu Quebec: GST/QST rules](https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst/basic-rules-for-applying-the-gsthst-and-qst/), checked 2026-07-27.
- [`../launch/fall-drop-launch-decision-report.md`](../launch/fall-drop-launch-decision-report.md).
- [`../launch/drop-001-sales-forecast-readout.md`](../launch/drop-001-sales-forecast-readout.md).

## Next agent

Replace one assumption at a time with a dated receipt. Do not tune the conversion prior or repeat-cost target merely to force an earlier six-figure date. Preserve the first frozen forecast and compare each realized drop against this path.
