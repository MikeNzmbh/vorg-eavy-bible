# Finance

## First Funding Rule

Treat the first C$10,000 as proof-machine capital, not mature-brand spending.

## First-Drop Base Assumptions

- Active product set: The Firm Jacket, women's low-rise denim jean, men's denim jean, scarf, women's top / bodysuit
- Initial inventory / production spend ceiling: C$5,000-C$6,000 max
- Planned units: TBD
- Revenue: TBD
- Landed COGS: TBD from vendor quotes
- Founder salary load: TBD after unit plan is rebuilt
- Economic profit after salary load: TBD

The older 3-SKU / 150-unit / C$20,550 model is superseded for purchase decisions. Replace all TBDs with vendor quotes as sampling starts.

The corrected ecommerce stress test in `../launch/fall-drop-launch-decision-report.md` includes a 126-unit proof-buy scenario, price tests, cash reserves, fee assumptions, and downside cases. Those numbers remain working assumptions and do not replace the active vendor-quoted costing table.

## Files

- `growth-finance-engine-v3.mjs` - canonical goal-seeking engine for the C$100k August 2027 month, 85%/30-day sell-through, 45%-50% per-release growth, 40-day cadence, founder salary, cash waterfall, channels, prediction-method activation, tax boundaries, and anti-gaming controls
- `growth-finance-engine-v3.md` - founder/operator readout for the eight-release winner path and C$11,465-C$12,258 protected salary bridge
- `unit-economics.md` - first-drop SKU economics and scenario table
- `simulate-six-figure-path.mjs` - deterministic cash, reinvestment, sell-through, owner-contribution, proof-gated growth, tax-inside, and six-figure timing simulator
- `six-figure-sales-simulation.md` - founder readout for the C$10,000 starting path plus C$2,000 owner funding every two months to C$100,000 cumulative net sales and annual sales pace

The older simulator remains the frozen cumulative-sales comparison. v3 is the current August-month goal engine. Neither authorizes a purchase order.

Run `cd site && npm run test:growth-path` after changing the starting budget, cost structure, pricing, demand model, scaling gate, salary route, or timing assumptions.
