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

- `unit-economics.md` - first-drop SKU economics and scenario table
- `simulate-six-figure-path.mjs` - deterministic cash, reinvestment, sell-through, owner-contribution, proof-gated growth, tax-inside, and six-figure timing simulator
- `six-figure-sales-simulation.md` - founder readout for the C$10,000 starting path plus C$2,000 owner funding every two months to C$100,000 cumulative net sales and annual sales pace

Run `cd site && npm run test:growth-path` after changing the starting budget, cost structure, pricing, demand model, scaling gate, or timing assumptions.
