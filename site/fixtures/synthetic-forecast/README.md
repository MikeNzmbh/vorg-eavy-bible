# Synthetic Forecast Evidence Bench

Generated: 2026-07-22

Truth class: **synthetic test data only**.

## Purpose

Exercise the Forecast Lab's evidence-anchored calculations, SKU and size allocation, stress suite, frozen-call audit, outcome linking, and calibration separation without claiming VORG has observed these results.

Every artifact in this directory is fabricated for deterministic software testing. It contributes zero launch proof, zero readiness, zero vendor truth, and zero production authorization.

## Fixture population

- Historical traffic window: 5,000 synthetic sessions.
- Synthetic core funnel: 3,150 product views, 520 adds to cart, 300 checkouts, 165 purchases, 203 purchased units, and 12 refunded units.
- Synthetic pop-up history: 420 visitors and 65 purchases.
- Synthetic future reservations: 40, with a 70% planning conversion assumption.
- Synthetic product and variant demand weights: 400 fabricated price-revealed selections.
- Synthetic actual outcome: C$9,360 net revenue, 101 net units, and 80.2% sell-through.

## Controls

- `evidenceMode` is `synthetic` in the fixture.
- All receipt paths include `synthetic-forecast`.
- The engine automatically returns `synthetic-test` when either control is present.
- Live calibration excludes `synthetic-test` forecasts.
- Synthetic calibration must be requested explicitly.
- Reloading the working Drop 001 scenario leaves frozen calls intact but restores the live scenario truth label.

Do not rename or copy these receipts into a production evidence directory.
