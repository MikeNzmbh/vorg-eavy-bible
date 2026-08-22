# Blindspot Ledger — United States + Canada

Checked: 2026-08-22  
Parent brief: `strategy/cursor-us-first-prediction-engine-brief.md`  
Related gates machine file: `route-to-market-gates.json`  
Status: research pack — **not legal/tax advice**; not Drop OS GO. Wedge direction is highest-gain market route (currently U.S./Brooklyn forecast); Ottawa/Gatineau is CA fallback (`docs/DECISIONS.md` 2026-08-22).

States used: `unknown` | `researching` | `review-required` | `blocked` | `cleared-with-evidence`

Hard-stop = blocks U.S. sale / Canada expansion step / spend escalation until cleared or explicitly deferred with founder acceptance.

---

## A. Market and prediction blind spots

| ID | Blindspot | Geo | State | Hard-stop? | Known | Unresolved | Key sources (checked 2026-08-22) |
| --- | --- | --- | ---: | ---: | --- | --- | --- |
| BS-M01 | Generic U.S. fashion demand ≠ VORG five-SKU demand | US | researching | No (forecast hygiene) | Engine caps generic macro search; SKU inventory logged | No metro Trends/query snapshots for exact silhouettes | McKinsey State of Fashion; `sku-inventory.json` |
| BS-M02 | Trends/search ≠ purchase intent; comparable sales not VORG forecast | US/CA | researching | No | Mechanism cards disallow copying brand sales | Live Trends exports missing | Brief contract; mechanism-cards |
| BS-M03 | Prestige city vs buyer/ops/cost fit | US | researching | No | Ranking includes commerce cap + product seasonality | Ops cost by metro still thin | Forecast report; weather map |
| BS-M04 | Double-counting same external fact | US/CA | researching | No | Engine uses source IDs; comparable requires ≥3 mechanisms | Need audit when new signals added | `market-positioning-prediction.ts` |
| BS-M05 | Followers/views/viral ≠ conversion | US/CA | researching | Yes for spend | Tests reject unlinked follower signals | No VORG content-qualified-action receipts | Engine tests; FTC disclosure |
| BS-M06 | Pop-up revenue before venue/POS/RSVP | US/CA | blocked | Yes for pop-up spend | Pop-up sales forced to zero in forecast | No venue package any metro | Stress test; gate-popup-ops |
| BS-M07 | Seasonality / weather / jacket-denim fit / return risk | US | researching | No for online forecast; Yes if jacket-led warm metro | Nov normals logged for 5 metros | Return-reason model absent; sample fit unproven | Current Results / NCEI normals via currentresults.com |
| BS-M08 | Mutable sources without date/query/geo/snapshot | US/CA | researching | No | Ledger requires checkedOn + URL | Trends snapshots not yet filed | `source-ledger.json` |
| BS-M09 | Canada queue treated as provinces not testable cities | CA | blocked | Yes for Canada expansion beyond current CA fallback | Founder queue named; Ottawa/Gatineau is CA fallback / parallel proof | Must name Ontario city, Quebec city, keep Vancouver & Halifax as cities | Stress test P2; MASTER_BRIEF; DECISIONS 2026-08-22 |

---

## B. Commerce, tax, and operations — United States

| ID | Blindspot | State | Hard-stop? | Known | Unresolved | Key sources |
| --- | --- | ---: | ---: | --- | --- | --- |
| BS-U01 | Customs/duties, HS/origin, IOR, DDP/DDU, carrier/3PL, return/re-import | blocked | Yes | De minimis no longer a free pass; Shopify Markets duties docs exist | No VORG choice A/B, quote, HS codes, IOR | Shopify duties; CBP Article-1919; Shopify CA import guide; `us-first-cross-border-usd-gate-2026-08-22.md` |
| BS-U02 | USD pricing, FX, fees, refunds, chargebacks, discounts, contribution | blocked | Yes | C$ planning table exists | No USD contribution sheet | Stress test; forecast inputs |
| BS-U03 | State sales-tax nexus / marketplace facilitator / filings | review-required | Yes before material US sale | Shopify is generally **not** a marketplace facilitator; economic nexus is state-by-state; Amazon/TikTok Shop may collect differently | Threshold monitoring, registrations, EIN/agent, counsel review | Insight CPA 2026 cross-border guide; AVASK nexus; Shopify tax education |
| BS-U04 | Textile fibre/origin/RN, care labels, flammability/GCC, claim substantiation | researching | Yes before US sale | FTC apparel + care guidance; CPSC 16 CFR 1610 clothing textiles; adult GCC discretion for some exempt fabrics | Final fibre/weight/origin, RN or name, care tests, GCC path per SKU | FTC apparel; FTC care; CPSC FFA / clothing guidance |
| BS-U05 | Stock split online/pop-up, size curve, SLA, lost parcels, CS, returns reasons | unknown | Yes for pop-up allocation; soft for tiny online proof | 126-unit plan is assumption | No size curve, CS capacity plan, return operator | Forecast inputs |
| BS-U06 | Trademark clearance, image/music, creator rights/whitelist, affiliate records, FTC disclosure, TikTok commercial music | researching | Yes for paid/gifted seeding | FTC Disclosures 101; TikTok promo + commercial music pages; USPTO clearance guidance | No filed USPTO search packet; no signed creator brief | USPTO clearance; FTC; TikTok support |
| BS-U07 | Email/SMS consent, privacy notices, pixels, state privacy (CCPA etc.), measurement consent | review-required | Yes before SMS/paid pixel scale | TCPA-style express written consent priors for promo SMS; CCPA/CPRA notice/opt-out themes for CA buyers | Consent vault, GPC handling, counsel review of thresholds | FTC not primary; TCPA/SMS guides; California AG CCPA overview via secondary; Shopify privacy tooling docs |
| BS-U08 | Pop-up permits, insurance, occupancy/queue, accessibility, POS, photo consent, security, music | blocked | Yes for pop-up | Later-test only in forecast | No city venue package | Stress test |

---

## C. Commerce, tax, and operations — Canada

| ID | Blindspot | State | Hard-stop? | Known | Unresolved | Key sources |
| --- | --- | ---: | ---: | --- | --- | --- |
| BS-C01 | GST/HST registration, rates by province, export zero-rating to US with proof | review-required | Yes for Canadian taxable sales & clean export claims | Most goods exported to US can be zero-rated if they leave Canada and export proof is kept; still report; ITCs may remain | Founder registration status, filing cadence, export-doc SOP | CRA RC4027 / export zero-rating guidance; CPA cross-border notes (secondary) |
| BS-C02 | QST (Quebec) when selling into Quebec | blocked | Yes before Quebec sale push | Quebec has distinct QST surface; queue puts Quebec behind localization | QST registration/collection decision, French storefront parity | Revenu Québec (to attach); OQLF language rights |
| BS-C03 | CASL commercial electronic messages (email/SMS) | review-required | Yes before CEM campaigns | CRTC CASL FAQ is canonical; consent + identification + unsubscribe | Consent records, CEM inventory, SMS path under CASL | https://crtc.gc.ca/eng/com500/faq500.htm |
| BS-C04 | PIPEDA / OPC privacy + provincial privacy overlap | review-required | Yes before broad data use | OPC guidance exists in source library | Privacy policy adequacy, processor list, retention | OPC; FREE_SOURCE_LIBRARY |
| BS-C05 | Quebec French / Charter / Bill 96 storefront, contracts, invoices, social | blocked | Yes before Quebec market push | OQLF: French language of commerce; websites/commercial docs; consumer rights to French info | Full FR storefront, contracts, support, counsel review | OQLF sites + langue du commerce; Éducaloi |
| BS-C06 | Quebec consumer-contract / distance-selling / OPC Quebec online merchant obligations | blocked | Yes before Quebec push | OPC Quebec online commerce obligations indexed in library | Named counsel review of terms for QC buyers | https://www.opc.gouv.qc.ca/enligne/ (library) |
| BS-C07 | Named Canada expansion cities (not provinces) | blocked | Yes for expansion | Queue must become: named ON city, named QC city, Vancouver, Halifax; Ottawa/Gatineau = CA fallback | Founder picks ON + QC city names for queue | Stress test P2 |
| BS-C08 | Canadian returns/ops, bilingual support risk, carrier SLA inside CA | researching | Soft for Ottawa wedge; hard if promising national CA | Local wedge reduces bilingual load if QC not pushed | National CA returns SOP; FR support if QC opens | Ops README; stress test |
| BS-C09 | Competition Bureau / Ad Standards claims & endorsements (CA) | researching | Yes for performance claims | Library includes Competition Bureau deceptive marketing + Ad Standards | Claim substantiation per SKU; influencer disclosure under CA rules | Competition Bureau; Ad Standards (library) |
| BS-C10 | Health Canada / product safety if claims cross into regulated space | unknown | Conditional | Adult apparel baseline ≠ cosmetics/drugs | Only if health/performance claims appear | Health Canada (library) |

---

## D. Founder and governance blind spots

| ID | Blindspot | State | Hard-stop? | Known | Unresolved |
| --- | --- | ---: | ---: | --- | --- |
| BS-G01 | Founder content capacity vs qualified actions | researching | No | Plan uses founder YouTube as truth library | Weekly capacity, sample availability |
| BS-G02 | Forecast looks precise without calibration/reversal | researching | No | Engine has reversal conditions + receipt layer + tests | No live receipts yet |
| BS-G03 | Weights tuned until desired city wins | researching | No | Weights versioned in code; Brooklyn won narrowly over LA | Freeze weights; log any change |
| BS-G04 | Agent accessing paid/ad/creator/tax accounts without auth | blocked | Yes | GA4 marked unavailable; no unauthorized scrapes | Explicit auth before any paid tooling |

---

## Cleared with evidence?

**None** of the hard-stop commerce gates are `cleared-with-evidence` as of 2026-08-22. Public guidance is logged; VORG operational proof is not.

---

## Next clear order (recommended)

1. **P0 US:** BS-U01 / BS-U02 — DDP vs 3PL + USD sheet (`us-first-cross-border-usd-gate-2026-08-22.md`)
2. **P0 CA (parallel, if selling CA now):** BS-C01 GST/HST status + export-doc SOP; BS-C03 CASL before email/SMS blasts
3. **P1:** BS-U04 labels/flammability path; BS-U06 trademark + creator brief; BS-U03 tax counsel
4. **P2 Canada expansion:** BS-C07 name cities → then BS-C05/C06/C02 Quebec block as a package
