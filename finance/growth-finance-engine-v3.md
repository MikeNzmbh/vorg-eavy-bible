# VORG Growth + Finance Engine v3 — C$100k August 2027 Backsolve

Checked: 2026-08-22
Engine: `growth-finance-engine-v3.mjs`
Truth class: `goal-seeking-working-simulation` — a route to make the goal eligible, not a promise, tax return, purchase order or spend authorization.

## Founder outcome contrac

The engine keeps the founder's destination fixed and moves the operating design around it:

- at least **C$100,000 reconciled net sales in calendar August 2027**;
- **85% sell-through inside 30 days** on each release before scale;
- **45% growth is the floor; 50% is the operating target** between releases;
- replenishment/newness every month to month-and-a-half;
- seasonal pieces plus occasional filler, without turning the house into random product;
- a **C$3,000 monthly founder-pay cash envelope** as the working interpretation;
- no dividends before the end of year one and no year-end dividend without tax/solvency clearance.

“Net sales” excludes collected sales tax and reverses modeled leakage. It is stronger and more auditable than platform-attributed revenue or cumulative GMV.

## Winner architecture: The 40-Day Compounding House

The previous ten-week rhythm is too slow for a C$100k August month. The target architecture runs **eight releases about 40 days apart**, placing the final release on **15 August 2027**. The front-loaded 30-day sales curve allows the August release plus the final tail of the July release to build the month.

The engine uses:

- days 0–6: 55% of a drop's 30-day sales;
- days 7–13: 22%;
- days 14–20: 13%;
- days 21–29: 10%.

That curve is a goal-shaping assumption. The first VORG launch will replace it with a real product-age curve.

### Selected planning outcome

| Path | August 2027 net sales | Approx. August orders | Result |
| --- | ---: | ---: | --- |
| 45% growth floor, 85% sell-through, 40-day cadence | **C$112,387** | **989** | Clears goal |
| 50% growth target, 85% sell-through, 40-day cadence | **C$142,331** | **1,253** | Clears goal with buffer |
| 45% growth, 45-day cadence | C$87,489 | 770 | Misses; cadence is the constraint |
| 35% growth, 75% sell-through, 40-day cadence | C$60,313 | 531 | Misses; demand and growth gates fail |

The operating choice is therefore: **plan production/content capacity to the 50% path, authorize purchase orders only at the 45% proof floor, and keep the extra target buffer as protection against a slower August curve.**

## The 45% floor calendar

All prices and COGS below remain working assumptions pending vendor quotes.

| Drop | Date | Inventory units | 30-day orders | Net sales at 85% | Upfront inventory + launch cash | Available cash after modeled tax reserve* |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 8 Nov 2026 | 126 | 86 | C$9,738 | C$8,412 | C$10,460 |
| 2 | 18 Dec 2026 | 183 | 125 | C$14,144 | C$8,321 | C$14,440 |
| 3 | 27 Jan 2027 | 265 | 181 | C$20,482 | C$11,355 | C$20,794 |
| 4 | 8 Mar 2027 | 384 | 262 | C$29,679 | C$15,758 | C$27,592 |
| 5 | 17 Apr 2027 | 557 | 379 | C$43,050 | C$22,159 | C$39,399 |
| 6 | 27 May 2027 | 808 | 550 | C$62,450 | C$31,446 | C$58,472 |
| 7 | 6 Jul 2027 | 1,171 | 797 | C$90,506 | C$44,877 | C$85,053 |
| 8 | 15 Aug 2027 | 1,698 | 1,155 | C$131,237 | C$64,376 | C$129,889 |

\*Cash-gated salary scenario. “Tax reserve” is a 15% planning contingency on positive operating contribution, not a tax calculation.

This is a steep capacity path: Drop 8 has about 13.5 times Drop 1's units. The algorithm does not hide that requirement. The purpose of the gates is to make the next step conditional on demand, cash, production and service proof rather than buying the whole dream on day one.

## The 50% target calendar

| Drop | Date | Inventory units | 30-day orders | Net sales at 85% | Upfront inventory + launch cash |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | 8 Nov 2026 | 126 | 86 | C$9,738 | C$8,412 |
| 2 | 18 Dec 2026 | 189 | 129 | C$14,608 | C$8,543 |
| 3 | 27 Jan 2027 | 284 | 194 | C$21,950 | C$12,058 |
| 4 | 8 Mar 2027 | 425 | 289 | C$32,848 | C$17,275 |
| 5 | 17 Apr 2027 | 638 | 434 | C$49,311 | C$25,156 |
| 6 | 27 May 2027 | 957 | 651 | C$73,966 | C$36,959 |
| 7 | 6 Jul 2027 | 1,435 | 976 | C$110,910 | C$54,645 |
| 8 | 15 Aug 2027 | 2,153 | 1,465 | C$166,404 | C$81,211 |

The 50% path is the ambition buffer. It is eligible only if the preceding release clears the 85%/30-day demand gate, the lower demand range covers the proposed buy, supplier capacity/quality is proven, and the cash waterfall survives.

## Founder salary: the savvy version

The founder's instinct is strong: use a predictable work expense and leave dividends untouched through year one. The improvement is to **separate compensation liquidity from inventory liquidity**.

At the current C$10,000 start, paying C$3,000 before Drop 001 leaves C$7,000, below the C$8,412 first-drop commitment plus the C$1,500 floor. Two structures solve it:

### Route A — cash-gated salary

Pay the C$3,000 monthly envelope only when the next approved PO, protected tax/refund cash and C$1,500 floor remain covered. Unpaid months become founder compensation deferred; they are not erased or disguised.

- 45% floor path: C$18,000 paid by the modeled August checkpoint; C$12,000 deferred.
- 50% target path: C$15,000 paid; C$15,000 deferred because the next scale step is larger.

### Route B — protected founder-pay bridge (recommended if monthly pay is non-negotiable)

Ring-fence additional working capital outside sales:

- approximately **C$11,465** supports the 45% floor path while paying C$3,000 every month;
- approximately **C$12,258** supports the 50% target path while paying C$3,000 every month.

This can be founder capital, a documented shareholder loan, supplier terms, a preorder/deposit mechanism with clear delivery obligations, or another professionally reviewed working-capital source. It is never recorded as revenue or proof.

## Cash waterfall

Every dollar follows this order:

1. sales tax, duties, refunds and chargeback cash;
2. landed COGS and the next approved purchase order;
3. the C$1,500 bank floor and approved operating commitments;
4. the founder's C$3,000 monthly cash envelope;
5. evidence-backed growth tests and creator commissions;
6. year-end dividends only after month 12, tax provision, payables, returns, next PO, accountant review and director solvency test.

The salary line and dividend lock are not tax advice. A Canadian salary can create payroll deduction/remittance and T4 obligations. Dividends require corporate classification and T5 reporting. The accountant must confirm whether the C$3,000 means total company cash cost, gross salary or net pay.

## Unit economics carried into v3

| SKU | Role | Working units | Working price | Working landed COGS |
| --- | --- | ---: | ---: | ---: |
| The Firm Jacket | Hero | 12 | C$249 | C$85 |
| Women's low-rise denim | Core | 24 | C$128 | C$38 |
| Men's denim | Core | 20 | C$128 | C$38 |
| Scarf | Entry/belonging | 40 | C$35 | C$12 |
| Women's top/bodysuit | Seasonal | 30 | C$68 | C$18 |
| **Total** |  | **126** | **C$12,060 retail** | **C$3,712 landed COGS** |

Weighted average retail is approximately C$95.71 per unit. At 1.25 units/order and 5% revenue leakage, the modeled net AOV is approximately C$113.66. All inputs must be rebuilt from vendor quotes, samples, actual shipping/duties and USD price decisions before a PO.

## Assortment and replenishment policy

The growth target is not permission to multiply every SKU evenly forever.

- 65–75% of a scaled buy: proven hero/core replenishment by SKU-size velocity.
- 15–25%: seasonal new pieces that share the brand world's image, fit and margin grammar.
- 0–10%: filler/entry pieces; never used to hide weak hero demand.
- No new category if it breaks the 85% goal, working-capital turn or founder content capacity.
- Replenishment priority uses lost-demand and size-waitlist evidence, not “sold out” theatre.
- Unsold units remain cash tied in inventory; they cannot finance the next PO.

## What replaces the forecast after each release

| Planning input | Receipt that replaces it |
| --- | --- |
| 85% target | Settled units sold / available units by day 30, SKU and size |
| Front-loaded curve | Daily net units, net sales, stockouts, cancellations and returns |
| 1.25 units/order | Shopify/POS settled line items per order |
| 5% leakage | Discounts, cancellations, refunds and allowances after return window |
| Working landed COGS | Vendor invoice + freight + duty + brokerage + QC/rework |
| Channel order allocation | Deduped acquisition source, assisted touches and post-purchase survey |
| Salary bridge | Bank/loan/shareholder records and accountant classification |
| Tax contingency | Accountant-prepared payroll, corporate, GST/HST and U.S. state/federal schedule |

## Tax and cross-border gates

1. **Canadian export evidence:** CRA guidance permits qualifying exported goods to be zero-rated, but the conditions and carrier/export evidence matter.
2. **U.S. state sales tax:** every state is different. Remote thresholds do not erase physical nexus. A Brooklyn pop-up is a specific New York registration review, and New York clothing treatment varies by item price/locality.
3. **Income-tax footprint:** a Canadian company selling to U.S. customers, using U.S. inventory/3PL, creators, agents or pop-ups needs professional entity and effectively-connected/trade-or-business review.
4. **Payroll:** founder salary requires payroll setup and remittance/reporting analysis.
5. **Dividends:** the engine locks cash; it does not decide eligible/non-eligible characterization or lawful distributable surplus.
6. **Collected tax:** excluded from net sales and never spendable growth capital.

## Hard gates before every 45%–50% step

- ≥85% settled sell-through in 30 days.
- Positive retained contribution after returns, landed cost, shipping, fulfilment, payment, creator commission and variable acquisition.
- Bottom demand range supports proposed inventory; stockout-censored demand is corrected with waitlist/lost-cart evidence.
- Size curve has no unresolved dead-size or fit failure.
- Supplier confirms lead time, material slot, QC and reorder capacity for the 40-day rhythm.
- One-acquisition-source channel ledger covers the required orders without double counting.
- Cash waterfall covers the PO, protected cash, founder-pay route and floor.
- Customer service, 3PL/fulfilment and content capacity clear their own scale gates.

## Run and tes

```powershell
node finance/growth-finance-engine-v3.mjs
cd site
npm run test:growth-path
```

## Known / assumed / unresolved

Known: founder targets; first-product set; current C$10,000 planning base; initial production ceiling; U.S.-first/Brooklyn operating lead; Canada expansion queue; no first-party sales receipts yet.

Assumed: current units/prices/landed COGS; 30-day sales curve; 40-day cadence; 1.25 units/order; 5% leakage and shipping allowances; C$3,000 as a monthly total company cash envelope; 15% tax contingency; proportional product economics at scale.

Unresolved: vendor quotes; actual price elasticity/AOV; returns/fit; supplier lead time; U.S. fulfilment door; duties/FX; state nexus; payroll/tax; channel capacity; August customer mix; whether the founder wants the salary bridge or deferred-pay route.

\n