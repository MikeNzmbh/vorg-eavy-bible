# Drop 001 Sales Forecast Inputs

Checked: 2026-08-19

Status: working scenario input contract; not vendor-quoted truth and not first-party demand evidence.

## Decision this supports

Unblock the Drop OS Forecast Lab with the corrected 126-unit proof-buy architecture so the team can stress-test sales ranges now, while preserving the production gate and replacing assumptions as quotes and demand receipts arrive.

Primary source: [`fall-drop-launch-decision-report.md`](fall-drop-launch-decision-report.md), checked 2026-07-21.

Traffic ownership: [`drop-001-traffic-channel-plan.md`](drop-001-traffic-channel-plan.md), checked 2026-08-19.

## Known

- The active product system contains The Firm Jacket, women's low-rise denim, men's denim, scarf, and women's top/bodysuit.
- The product fallback chosen in the launch report is a black women's long-sleeve rather than a bodysuit until fit risk clears.
- Initial inventory/production spend may not exceed C$6,000 without a new founder decision.
- No all-SKU vendor quote packet, approved pre-production samples, reconciled size curve, historical VORG funnel, real reservations, or confirmed pop-up footfall is recorded in the repo.

## Entered working scenario

### Merchandise

| Drop OS product | Scenario product | Units | Price test | Working landed COGS | Demand-mix weight | Evidence class |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| The Firm Jacket | The Firm Jacket, one colour | 12 | C$249 | C$85 | 12 | internal planning assumption |
| Women's Low-Rise Denim Jean | Women's low-rise denim, one wash | 24 | C$128 | C$38 | 24 | internal planning assumption |
| Men's Denim Jean | Men's denim, one wash | 20 | C$128 | C$38 | 20 | internal planning assumption |
| Scarf | Scarves, two colours | 40 | C$35 | C$12 | 40 | internal planning assumption |
| Women's Top / Bodysuit | Women's black long-sleeve fallback | 30 | C$68 | C$18 | 30 | internal planning assumption |
| **Total** |  | **126** |  |  | **126** | **C$3,712 working inventory cost** |

Demand-mix weights mirror the working unit architecture. They are not customer preference observations.

### Demand plan

85% sell-through of 126 units is the **goal** (about 107 units / 86 orders). It is not what the engine currently predicts at the median.

Owned coverage for those 86 orders:

- 30 waitlist email / SMS (plan);
- 10 connector / creator (plan);
- 26 named paid ads, Ottawa/Gatineau (plan, CAC unknown, not spend-authorized);
- 20 pop-up (plan).

Unnamed “other qualified ecommerce” is cut. Paid ads may occupy that 26-order / 850-session hole only because they now have an owner, mechanism, geo, and receipt path. See [`drop-001-traffic-channel-plan.md`](drop-001-traffic-channel-plan.md).

Online working orders are 66. At the 3.06% planning rate:

```text
66 / 0.0306 = 2,156.86
```

The Forecast Lab uses **2,160 planned qualified online sessions** (980 waitlist + 330 connector + 850 paid). Traffic evidence points at the channel plan and remains classified `plan`, not historical.

The 850 paid sessions are coverage arithmetic, not a bought campaign. Forecast Lab cannot authorize the cap. Drop OS TEST allows a small paid proof from non-inventory cash with founder action-time approval. Large paid campaigns stay blocked until campaign receipts exist.

The report does not contain a pop-up visitor forecast. To expose rather than hide that gap, the scenario reverses the Forecast Lab's internal 15% cold-start pop-up purchase prior:

```text
20 / 0.15 = 133.33
```

The Forecast Lab uses **135 planned pop-up visitors**. This is an internal planning assumption, not a venue-capacity or attendance receipt.

The report assumes **1.25 units per order**. The Forecast Lab uses that value only when complete first-party purchase-order and purchased-unit counts are absent.

The report's **3.06% session-to-purchase rate** is loaded as a scenario prior. It is not labelled as observed VORG conversion. A complete first-party funnel still overrides it. If only aggregate sessions and purchase orders exist, Sales Forecast v1.1 updates that planning prior without granting `evidence-anchored` status.

The report's downside test uses **C$4,700 of committed non-inventory launch spend**. The Forecast Lab loads this as a fixed cash-exposure assumption so it can report revenue less the full C$8,412 working committed plan. Payment fees, returns, discounts, tax, shipping subsidy, founder pay, and unmodeled losses remain outside that diagnostic.

### Deliberately blank

- Reservations: `0` because no deduplicated paid or qualified reservation receipt exists.
- Observed sessions, product views, carts, checkouts, purchases, purchased units, refunds, pop-up visitors, and pop-up purchases: blank because no first-party export exists.
- Size inventory: blank because the launch report explicitly says not to convert approximate variants into quantities before fit and price-revealed selections.
- Funnel evidence: blank because the repo has no GA4/Shopify/POS outcome export.
- Reservation evidence: blank because no reservation receipt exists.
- Historical traffic evidence: unavailable; the linked traffic source is classified `plan only`.

## Expected truth state

The Forecast Lab should calculate a `scenario` range, not `evidence-anchored`.

The entered values resolve the software's missing-input blocker. They do **not** resolve the company's vendor, sample, demand, or production-readiness blockers. The Drop OS readiness gate must remain unchanged.

## Replacement rules

Replace inputs only with dated receipts:

| Scenario input | Replacement evidence |
| --- | --- |
| Units and landed COGS | supplier quote, MOQ, Incoterm, freight/duty treatment, and approved production plan |
| Retail price | price-revealed customer test plus approved sample and full unit economics |
| Demand weight | deduplicated product/size/colour selections or SKU-level observed sales |
| 2,160 online sessions | waitlist + connector + named paid tagged sessions; never restore unnamed ecommerce |
| Paid 850-session line | founder-approved TEST cap, then ad-account unique sessions; CAC remains unknown until purchases settle |
| 3.06% conversion | real session + purchase counts to update the planning prior; complete funnel to leave planning-prior mode |
| 135 pop-up visitors | venue capacity, RSVP quality, show rate, counter plan, then actual attendance receipt |
| 1.25 units/order | reconciled Shopify/POS orders and line quantities |
| C$4,700 non-inventory spend | approved line-item budget plus actual committed and paid amounts |

Never overwrite a frozen forecast after sales are visible. Freeze the scenario before the decision it will grade, then link actuals after cancellations and returns settle.

## Open questions

- Which products survive vendor MOQ and approved sample review?
- What size curve is supported by fit and price-revealed selections?
- Can the jacket sample earn C$249?
- Can the team acquire 980 waitlist, 330 connector, and 850 paid qualified sessions without spending production cash or running unattended ads?
- What venue capacity and RSVP-to-attendance rate support 135 pop-up visitors?
- What attribution and deduplication policy separates waitlist, connector, paid ads, and POS orders?

## Next agent

1. Issue and reconcile RFQs for all five active products.
2. Replace the merchandise assumptions SKU by SKU; do not wait for every quote to update one verified field.
3. Execute waitlist, connector-code, and founder-capped paid-proof receipts in `drop-001-traffic-channel-plan.md`.
4. Instrument the event contract in `../strategy/drop-os-sales-forecast-v1.md`.
5. Freeze the resulting pre-launch call and export snapshot schema v4.
