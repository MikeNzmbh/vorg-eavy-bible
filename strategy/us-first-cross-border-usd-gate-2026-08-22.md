# U.S. Cross-Border Fulfilment & USD Economics Gate

Checked: 2026-08-22  
Parent: `strategy/us-first-gtm-stress-test-2026-08-22.md`  
Status: **blocked / decision required** — first P0 gate for the U.S.-first thesis.

## Decision This Supports

Choose **one** fulfilment-and-pricing model before any U.S. content scale, paid test, or pop-up deposit:

1. **Canada → U.S. DDP carrier**, or  
2. **U.S. 3PL** (inventory in the U.S., domestic shipping)

Until one path is quoted and a USD contribution sheet exists, the U.S. thesis stays **proof-build only**.

## Known

- U.S. de minimis treatment no longer provides a free pass for low-value inbound parcels (CBP / Shopify guidance surfaces logged 2026-08-22).
- Shopify Markets can collect duties/taxes at checkout only with correct product data and a DDP-capable workflow.
- Active production ceiling remains C$5,000–C$6,000.
- Working C$ prices/COGS in the 126-unit plan are **not** USD landed economics.

## Assumed (not proven)

- VORG continues operating from Canada for Drop 001 unless a U.S. entity/3PL is evidenced.
- Preferred customer promise is all-in landed price transparency (no surprise carrier COD fees).

## Options Under Test

| Option | What it means | What we still need |
| --- | --- | --- |
| A. Canada→US DDP | Ship from Canada; duties/taxes prepaid/collected at checkout; DDP labels | Carrier quote, HS/origin per SKU, IOR, brokerage rules, delivery SLA, return/re-import path |
| B. U.S. 3PL | Import once (or vendor ships to US), then domestic US fulfilment | 3PL quote, inbound import plan, storage/pick fees, returns address, inventory split vs Canada |

## Required Receipts To Clear This Gate

1. Written choice: **A or B** (founder-signed note in this file or DECISIONS).
2. Dated carrier **or** 3PL quote PDF/link.
3. Draft **USD contribution sheet** by SKU: price, duties estimate, shipping, fees, returns reserve, contribution after those costs.
4. Named returns operator and re-import/destruction rule.
5. Importer-of-record decision + tax professional review flag for nexus (review-required, not agent-cleared).

## Current Gate States

Pulled from `research/market-positioning/route-to-market-gates.json`:

| Gate | State |
| --- | --- |
| Merchant entity / IOR | review-required |
| DDP vs U.S. 3PL | **blocked** |
| HS + origin | unknown |
| USD contribution sheet | **blocked** |
| Returns / re-import | unknown |
| Sales-tax nexus | review-required |

## What Must Not Happen Yet

- Broad U.S. paid media
- Venue deposits
- Bulk production justified by “U.S. demand”
- Treating C$ Forecast Lab numbers as USD margins

## Next Agent / Founder Move

Pick Option A or B, attach one real quote, and rebuild USD prices. Then re-run `npm run test:positioning` only after updating `route-to-market-gates.json` states with evidence links — clearing gates still does not equal Drop OS GO without production/sample proof.
