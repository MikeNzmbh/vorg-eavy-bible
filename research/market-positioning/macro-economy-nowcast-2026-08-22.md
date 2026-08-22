# Macro-Economy Nowcast — US & Canada Consumer Health (Hedge-Fund Style)

Checked: 2026-08-22
Companion ledger: `research/market-positioning/macro-economy-ledger-2026-08-22.json`
Engine spec: `research/market-positioning/macro-engine-integration-spec-2026-08-22.md`

**This is research and working strategy analysis, not investment, tax, or legal advice.** Every number below is either linked to a dated source or explicitly labeled a working assumption.

## 1. What Decision Does This Support?

Whether Drop 001 (conditional Nov 5-12, 2026 window) should size, price, and pace its proof buy assuming a strengthening, flat, or weakening consumer in the US (primary forecast track) and Canada (fallback), and how macro conditions should feed the prediction engine as a `MacroContext` input.

## 2. Analytics Layer: Past/Future Sales Data

### 2a. GA status — nothing to report, and we will not invent it

- VORG has **no authorized GA4 property and no first-party sales history** (`source-ledger.json` ga4Status, confirmed 2026-08-22). There is no "past sales" dataset. Any agent output implying VORG traffic, conversion, or geo history is fabricated and must be rejected.

### 2b. What to instrument once a store is live (spec, not data)

When a Shopify store + GA4 property exist with founder authorization, the receipt-calibration layer of the prediction engine (`applyReceipts` in `site/src/market-positioning-prediction.ts`) needs these exports:

| Export | Contents | Feeds engine as |
| --- | --- | --- |
| GA4 event map | `page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `generate_lead` (waitlist), custom `size_selected` | `VorgReceipt.kind`: `product-selection`, `checkout`, `purchase`, `waitlist`, `content-qualified-action` |
| GA4 geo report | City/DMA-level users and conversions (Reports > User attributes > Demographic details > City) | `geoPrecision: "metro"` vs `"country"` — metro-tagged receipts get full weight; country-level get 0.35x |
| Shopify Orders export | Order line items, shipping city/region, discount codes, refunds | `purchase` receipts + refund/return reversal evidence |
| Shopify/GA4 cohort export | Weekly acquisition cohorts, repeat-purchase rate | Later: retention priors for wave-2 sizing (no engine field yet; see spec) |
| UTM discipline | Per-creator/per-channel UTM tags from day one | Attribution of receipts to content system components |

Consent/privacy gates from `route-to-market-gates.json` (`gate-privacy-sms-us`, `gate-ca-privacy`, `gate-auth-accounts`) must clear before collection scales. Each export must be saved as a dated artifact file so `artifactUrl` on receipts is a real link.

### 2c. Lawful public proxies to use meanwhile

| Proxy | What it gives | Discipline |
| --- | --- | --- |
| Google Trends | Relative search interest for silhouette terms by metro DMA | Save query string + date range + geo + screenshot per capture; already a `missingResearchTasks` item in source-ledger |
| US Census Monthly Retail Trade (MARTS/MRTS), clothing series | National nominal apparel demand direction ([census.gov/retail](https://www.census.gov/retail/marts/www/marts_current.pdf), [FRED RSCCASN](https://fred.stlouisfed.org/series/RSCCASN)) | Nominal, national, store-based — direction only, never VORG demand |
| StatCan retail trade, clothing retailers | Canadian equivalent ([Daily, 2026-08-21](https://www150.statcan.gc.ca/n1/daily-quotidien/260821/t002a-eng.htm)) | Same limits; note advance-estimate response rates |
| Platform benchmarks already in `research/commerce-intelligence/` | Category conversion/AOV context | Vendor-reported; never VORG expected results |

## 3. US Consumer Nowcast (checked 2026-08-22)

### Known (dated, sourced)

- **Retail / apparel demand (nominal):** July 2026 advance retail sales fell 0.6% MoM but rose 5.0% YoY; clothing & clothing accessories stores rose **+1.9% MoM and +5.0% YoY** to $28.3B seasonally adjusted. Source: [Census MARTS, July 2026](https://www.census.gov/retail/marts/www/marts_current.pdf) (released 2026-08-14); [FRED RSCCASN](https://fred.stlouisfed.org/series/RSCCASN).
- **Inflation:** CPI +3.4% YoY in July 2026; PCE price index +3.7% YoY in June 2026 ([BEA Personal Income & Outlays, June 2026](https://www.bea.gov/news/2026/personal-income-and-outlays-june-2026)). Apparel is a named upward contributor, driven partly by **tariff pass-through** on imported clothing ([Truflation PCE report, April 2026](https://truflation.com/blog/truflation-bea-pce-price-index-monthly-report-april-2026); [StatCan Spring 2026 economic review](https://www150.statcan.gc.ca/n1/pub/36-28-0001/2026004/article/00005-eng.htm) documents the same tariff-price channel in Canada). Real apparel growth is therefore roughly **+1-2% YoY, not +5%** (working derivation: 5.0% nominal minus ~3.4% CPI; apparel-specific inflation may be higher, pushing real volume near zero).
- **Consumer sentiment:** University of Michigan preliminary August 2026 index at **51.0**, down from 55.2 in July, near the record low of 44.8 set in May 2026; decline attributed to inflation fears from the Iran/Middle East conflict with gas above US$4/gallon; year-ahead inflation expectations 4.3%; **only 8% of consumers expect income growth to beat inflation** (vs 18% in Dec 2024). Source: [UMich Surveys of Consumers](https://www.sca.isr.umich.edu/) (prelim released 2026-08-14; final due 2026-08-28). Conference Board July 2026 reading 90.8; August release due 2026-08-25.
- **Savings buffer:** Personal saving rate **2.7% in June 2026**, down from 3.8% in February — historically thin. Source: [BEA](https://www.bea.gov/data/income-saving/personal-saving-rate) / [FRED PSAVERT](https://fred.stlouisfed.org/series/PSAVERT) (updated 2026-07-30).
- **Household credit stress:** NY Fed Q2 2026 report (released 2026-08-11): total household debt $18.8T; credit card balances **$1.26T** (+$21B QoQ); new-delinquency flow rate for cards **~6.97%, elevated but stable for ~2 years**; the scarier 12.8% "90+ days delinquent" stock figure is driven by stale charged-off debt, not a new deterioration. NY Fed researchers describe a **"K-shaped" consumer** — roughly 60% of cardholders carry revolving debt paycheck-to-paycheck while upper cohorts keep spending. Sources: [NY Fed press release](https://www.newyorkfed.org/newsevents/news/research/2026/20260811); [Liberty Street Economics](https://libertystreeteconomics.newyorkfed.org/2026/08/how-distressed-are-consumers-reconciling-diverging-credit-card-delinquency-measures/); [CNBC summary](https://www.cnbc.com/2026/08/11/ny-fed-credit-card-debt-hits-1point26-trillion-k-shaped-divide-persists.html).
- **Rates:** Markets price ~65% probability the Fed holds at its next meeting, with residual **hike** risk (not cuts) because of the inflation shock ([CME FedWatch via market commentary, 2026-08-21](https://www.tmgm.com/tl/analysis/market-news/article/canadian-dollar-heads-for-fourth-weekly-gain-on-weaker-us-dollar-elevated-oil-prices-202608211259)).

### Plain-language read (working analysis)

The US consumer is **spending through gritted teeth**. Dollar sales of clothing are still growing ~5% YoY, but most of that is price, not volume. Sentiment is at near-record lows, the savings buffer is nearly gone (2.7%), and the bottom half of the K is squeezed by >US$4 gas and card debt. Spending is being held up by the **upper-income cohorts** — which happens to include a meaningful slice of the 20s-30s urban fashion buyer VORG targets in Brooklyn. For a C$68-249 (≈US$50-185 at current FX) small-drop label, the buyer exists but is **more selective and more price-annoyed than in 2024-25**: hero pieces with a clear story can still sell; weak mid-priced basics are the first thing cut from a stretched budget. Direction into Nov 2026: **flat to slightly worsening**, with the Iran-conflict inflation path as the swing variable. This is a nowcast, not a certainty.

## 4. Canada Consumer Nowcast (checked 2026-08-22)

### Known (dated, sourced)

- **Retail / apparel demand:** June 2026 retail sales +0.6% MoM to $74.3B (+5.2% YoY); clothing/accessories-group retailers **+3.1% MoM (+5.4% YoY)**; clothing retailers narrowly +2.0% MoM (+4.1% YoY). Retail **e-commerce +18.7% YoY**. But the July advance estimate is **-0.8%, the first drop in seven months** (low 56.5% response rate; subject to revision). Source: [StatCan Daily, 2026-08-21](https://www150.statcan.gc.ca/n1/daily-quotidien/260821/t002a-eng.htm); [Financial Post](https://financialpost.com/news/economy/canada-retail-sales-set-to-fall-after-seven-months-gain); [Canadian Mortgage Professional](https://www.mpamag.com/ca/mortgage-industry/industry-trends/retail-sales-data-unlikely-to-shift-bank-of-canada-rate-path/587071).
- **Policy rate:** Bank of Canada overnight rate **2.25%, held since late 2025**; no change expected at the 2026-09-02 meeting (same sources).
- **Household balance sheet:** credit-market debt at **177.2% of disposable income** (Q4 2025); debt-service ratio edged lower in late 2025 as interest costs eased; BoC's 2026 Financial Stability Report calls households "resilient" with "pockets of stress," unemployment ~6.5-7%, and mortgage-renewal payment shocks mostly absorbed. Sources: [StatCan Spring 2026](https://www150.statcan.gc.ca/n1/pub/36-28-0001/2026004/article/00005-eng.htm); [BoC FSR 2026 — Households](https://www.bankofcanada.ca/publications/financial-stability-report/financial-stability-report-2026/households/).
- **Trade backdrop:** a tentative Canada-US agreement would halve steel/aluminium tariffs to 25% and cut auto tariffs to 15%; unfinished, but it lifted CAD ([exchangerates.org.uk, 2026-08-22](https://www.exchangerates.org.uk/news/46960/2026-08-22-canadian-dollar-forecast-trade-pact-supports-cad-near-term.html)).
- **FX:** USD/CAD **~1.374-1.377 on 2026-08-21**, CAD strengthening for a fourth straight week; bank consensus Q3 2026 ~1.39-1.41, Q4 ~1.38-1.40, drifting to ~1.35-1.37 by mid-2027. Sources: [Trading Economics](https://tradingeconomics.com/canada/currency); [MTFX 5-bank forecast](https://www.mtfxgroup.com/fx-forecast/).

### Plain-language read (working analysis)

Canada's consumer is in **slightly better shape than the US one on direction, worse on structure**. Rates have already come down (2.25% vs the Fed still in hold-or-hike mode), debt-service costs are easing, and clothing was one of June's strongest categories — with e-commerce growing ~19% YoY, which is exactly VORG's channel. The structural weight is the 177% debt-to-income ratio and a 6.5-7% unemployment rate; the July -0.8% flash says momentum may be stalling. For Ottawa/Gatineau fallback purposes: a small, local, story-led drop remains viable; the constraint is audience size, not macro collapse.

### What this means for a CAD-cost / USD-revenue brand

At ~1.37-1.40 USD/CAD, **every US$1 of revenue converts to ~C$1.37-1.40** while VORG's production ceiling and most costs are in CAD. A US$185 jacket sale ≈ C$254 gross before duties/shipping/fees — the FX tailwind is real but is easily consumed by the ~29-36.5% US duty stack on Asian-origin goods (see `supplier-origin-tariff-map-2026-08-22.md`). Consensus mildly favors CAD strengthening into 2027, which would **shrink** this tailwind over time — an argument for testing the US sooner rather than later, not for assuming permanent FX margin. Working analysis, not an FX forecast we own.

## 5. How Much Do Target Buyers Have to Spend? (working synthesis)

- US 20s-30s urban buyers: nominal wallet still growing but **real discretionary capacity flat-to-down**; savings thin; the segment still spending is the higher-income, style-motivated cohort concentrated in exactly the metros VORG ranked (Brooklyn/NYC, LA, Chicago). Price sensitivity is elevated: the C$249 (~US$182) Firm Jacket must win as a considered hero purchase; the C$68 top (~US$50) and C$35 scarf (~US$26) are impulse-viable.
- Canada 20s-30s urban buyers: modest tailwind from rate relief, heavy debt load; clothing spend positive and e-commerce strong; Ottawa/Gatineau audience smaller but macro-stable.
- Direction into Nov 2026: **US flat-to-worsening (sentiment-led risk), Canada flat-to-slightly-improving (rate-relief-led)** — unless the Iran conflict re-escalates fuel prices, which hits both.

## 6. Scenario Table — Working Analysis, Not Certainty

Probabilities are founder-judgment working weights, not measured odds.

| Scenario (working weight) | Macro shape into Nov 2026 | Drop 001 sizing implication | Pricing implication |
| --- | --- | --- | --- |
| **Base (~55%)** | US nominal apparel +3-5% YoY, real ~flat; UMich 50-58; gas US$3.50-4.50; BoC holds; USD/CAD 1.37-1.41 | Hold the 126-unit working plan as the **ceiling**; first production wave at the low end of the C$5,000-6,000 ceiling; wave 2 only on receipts | Hold working C$ prices; US prices must be rebuilt from the USD contribution sheet (gate still blocked), not converted at spot |
| **Upside (~20%)** | Iran de-escalates, gas falls, UMich recovers >60, holiday season strong, Fed cut talk returns | Keep plan; accelerate wave-2 trigger threshold (receipts needed to reorder can be met faster); consider adding units only within the ceiling | Modest headroom on hero SKU if sell-through receipts justify; no price increases without evidence |
| **Downside (~25%)** | Iran escalates, gas >US$5, UMich <45, holiday discretionary pullback, card delinquency flow rises above ~7.5% | **Cut proof buy 30-40%** (working ~75-90 units), hero-jacket + one denim lead, drop or delay lowest-margin SKUs; delay any US paid test | No launch discounting to chase volume (brand damage); protect price, shrink quantity; fallback wedge (Ottawa/Gatineau) rises in relative attractiveness because it avoids the US duty stack |

Reversal conditions (feed the engine as `MacroContext` triggers — see spec):

1. UMich final or Conference Board (2026-08-25/28 releases) surprising hard down → shift to downside sizing before any production PO.
2. Census MARTS clothing series turning negative YoY nominal for two consecutive months → downside.
3. USD/CAD < 1.30 sustained → USD contribution sheet must be rebuilt; FX tailwind assumption void.
4. Card delinquency **flow** rate (not stock) rising materially in NY Fed Q3 report (due ~Nov 2026, after launch window — use monthly proxies meanwhile) → tighten wave-2 caps.

## 7. Assumed (not proven)

- The 126-unit / C$3,712 working merchandise plan remains an internal planning assumption; no vendor quotes.
- Target-buyer income mix in Brooklyn matches the "upper K" cohort — inferred from metro priors, not measured.
- Scenario weights are founder-judgment placeholders until at least one month of first-party receipt data exists.

## 8. Unresolved / Next Agent

- Capture the 2026-08-25 Conference Board and 2026-08-28 UMich final prints and update this file's scenario weights.
- Google Trends silhouette-term captures per metro (still an open `missingResearchTasks` item).
- Build the USD contribution sheet once a DDP/3PL quote exists — macro scenarios cannot substitute for it.
- Once GA4/Shopify are live and authorized, implement the export map in §2b and begin receipt-calibrated recalibration.
