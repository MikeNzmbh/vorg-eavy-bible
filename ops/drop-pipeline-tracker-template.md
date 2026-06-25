# Drop Pipeline Tracker Template

Checked: 2026-06-25

## Purpose

Use this tracker to run each VORG-EAVY product or drop through the same operating system.

The tracker is meant for team use. Each row should have an owner, evidence link, gate result, and next action.

## Status Values

Use only these statuses:

- `not started`
- `in progress`
- `blocked`
- `gate review`
- `approved`
- `hold`
- `killed`
- `complete`

## Master Drop Row

| Field | Value |
| --- | --- |
| Drop |  |
| City |  |
| Season |  |
| Owner |  |
| Target launch date |  |
| SKU count |  |
| Planned units |  |
| Revenue target |  |
| Current stage |  |
| Biggest risk |  |
| Next gate |  |
| Next action |  |

## Stage Tracker

| Stage | Owner | Status | Evidence Link | Gate Score | Gate Result | Next Action | Due |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| 0. Signal |  | not started |  |  |  |  |  |
| 1. Concept |  | not started |  |  |  |  |  |
| 2. Sample |  | not started |  |  |  |  |  |
| 3. Campaign Proof |  | not started |  |  |  |  |  |
| 4. Production |  | not started |  |  |  |  |  |
| 5. Campaign Build |  | not started |  |  |  |  |  |
| 6. Open Online Drop |  | not started |  |  |  |  |  |
| 7. Pop-Up |  | not started |  |  |  |  |  |
| 8. VORG After |  | not started |  |  |  |  |  |
| 9. Postmortem |  | not started |  |  |  |  |  |

## Gate Checklist

### 0. Signal Gate

| Question | Answer | Evidence |
| --- | --- | --- |
| What item or drop idea is being evaluated? |  |  |
| What signals support it? |  |  |
| Does it fit The Firm? |  |  |
| Which city does it serve first? |  |  |
| What could make this a bad idea? |  |  |

Gate result:

`signal / test / hold / kill`

### 1. Concept Gate

| Question | Answer |
| --- | --- |
| Why this item? |  |
| Why now? |  |
| Why VORG-EAVY? |  |
| What role does it play in the drop? |  |
| What is the rough landed COGS ceiling? |  |
| What is the campaign angle? |  |

Gate result:

`approved / revise / hold / kill`

### 2. Sample Gate

| Area | Pass? | Notes |
| --- | --- | --- |
| Fit |  |  |
| Fabric / hand feel |  |  |
| Construction |  |  |
| Measurement/spec |  |  |
| Price/quote path |  |  |
| Photo/video strength |  |  |
| Founder can explain it clearly |  |  |
| Corrections are manageable |  |  |

Gate result:

`sample approved / revise sample / hold / kill`

### 3. Campaign Proof Gate

Use `launch/campaign-proof-playbook.md`.

| Category | Weight | Score 0-5 | Weighted Score | Evidence |
| --- | ---: | ---: | ---: | --- |
| Product clarity | 15 |  |  |  |
| Founder trust | 15 |  |  |  |
| Real social proof | 15 |  |  |  |
| Local activation | 15 |  |  |  |
| Content traction | 15 |  |  |  |
| Conversion path | 10 |  |  |  |
| Risk control | 10 |  |  |  |
| Next-city signal | 5 |  |  |  |
| Total | 100 |  |  |  |

Gate result:

`campaign can carry launch / fix weakest categories / sprint again / do not launch`

### 4. Production Gate

| Area | Pass? | Evidence |
| --- | --- | --- |
| Final quote received |  |  |
| MOQ acceptable |  |  |
| Landed COGS supports price |  |  |
| Fit sample / PP sample approved or justified |  |  |
| QC checklist ready |  |  |
| Label/compliance review ready |  |  |
| Production timeline supports launch |  |  |
| Cash available without breaking reserve |  |  |

Gate result:

`approve PO / revise / hold / kill`

### 5. Campaign Build Gate

| Asset | Status | Notes |
| --- | --- | --- |
| Hero trailer |  |  |
| Teasers |  |  |
| Founder table clips |  |  |
| Fit proof clips |  |  |
| Styling clips |  |  |
| Creator/connector assets |  |  |
| Email/SMS sequence |  |  |
| Product pages |  |  |
| Pop-up RSVP content |  |  |

Gate result:

`launch locked / launch after fixes / delay`

### 6. Open Online Drop Gate

| Area | Pass? | Evidence |
| --- | --- | --- |
| Storefront live/open at release |  |  |
| No password gate at checkout |  |  |
| Checkout tested |  |  |
| Product pages complete |  |  |
| Size guide complete |  |  |
| Policies complete |  |  |
| Analytics tested |  |  |
| Low-stock/sold-out states ready |  |  |

Gate result:

`open launch / fix before launch / delay`

### 7. Pop-Up Gate

| Area | Pass? | Evidence |
| --- | --- | --- |
| Venue approved |  |  |
| Capacity known |  |  |
| RSVP process ready |  |  |
| Security/door lead assigned |  |  |
| POS tested |  |  |
| Stock plan ready |  |  |
| Fitting support ready |  |  |
| Photo consent process ready |  |  |

Gate result:

`event ready / fix before event / delay`

### 8. VORG After Gate

| Area | Pass? | Evidence |
| --- | --- | --- |
| Theme approved |  |  |
| Content plan ready |  |  |
| Safety/venue plan ready |  |  |
| Next-city capture ready |  |  |
| Recap owner assigned |  |  |

Gate result:

`after ready / revise / skip`

### 9. Postmortem Gate

| Area | Result |
| --- | --- |
| Sell-through |  |
| Revenue |  |
| Gross margin |  |
| Return/fit issues |  |
| Best content angle |  |
| Best channel |  |
| Pop-up performance |  |
| Strongest next city |  |
| Reinvest / reorder / evolve / kill |  |

Gate result:

`reinvest / reorder / evolve / kill / hold`

## Drop 001 Starter Row

| Stage | Owner | Status | Evidence Link | Gate Score | Gate Result | Next Action | Due |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| 0. Signal | Founder / signal lead | in progress | research/trend-radar-industry-benchmark.md |  | test | Lock final SKU thesis |  |
| 1. Concept | Founder / product lead | in progress | product/README.md |  | revise | Confirm second SKU path |  |
| 2. Sample | Product lead | not started |  |  |  | Build tech pack v1 and supplier tracker |  |
| 3. Campaign Proof | Campaign lead | not started | launch/campaign-proof-playbook.md |  |  | Shoot sample proof sprint once samples arrive |  |
| 4. Production | Production / finance | not started |  |  |  | Quote MOQ and landed COGS |  |
| 5. Campaign Build | Campaign lead | not started |  |  |  | Build trailer and cutdown board |  |
| 6. Open Online Drop | Ecommerce lead | not started | launch/drop-001.md |  |  | Build open Shopify launch state |  |
| 7. Pop-Up | Event lead | not started | ops/popup-blueprint.md |  |  | Scout approved venue |  |
| 8. VORG After | Event / campaign | not started |  |  |  | Define theme and next-city capture |  |
| 9. Postmortem | Finance / founder | not started |  |  |  | Prepare proof report template |  |

## Next Agent

Duplicate this file or convert the tables into a spreadsheet when a specific drop begins active execution.
