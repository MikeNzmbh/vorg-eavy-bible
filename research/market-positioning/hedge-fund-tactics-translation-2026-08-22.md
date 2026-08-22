# Hedge-Fund Research Tactics → VORG Micro-Label Translation

Checked: 2026-08-22
Companion ledger: `research/market-positioning/macro-economy-ledger-2026-08-22.json`

**Honesty rule:** tactics VORG cannot lawfully or affordably access are marked **NOT ACCESSIBLE** and nothing may be faked in their place. All translations must respect existing gates (`gate-auth-accounts`: no unauthorized data/ad/account access) and CASL/TCPA/FTC/privacy constraints already logged in `route-to-market-gates.json`.

## 1. What Decision Does This Support?

How VORG gathers demand evidence, sizes bets, and kills losers like a disciplined fund analyzes consumer companies — using only free/cheap lawful equivalents, so the prediction engine gets calibrated inputs instead of vibes.

## 2. Tactic-by-Tactic Map

| # | Fund tactic | What it is (source) | VORG translation (lawful, free/cheap) | Access status |
| --- | --- | --- | --- | --- |
| 1 | Credit/debit card transaction panels | Millions of de-identified card accounts used as revenue proxies weeks before earnings — YipitData (450+ institutional clients), Consumer Edge (100M+ cards, apparel vertical), Bloomberg Second Measure, M Science ([Consumer Edge product pages](https://dataproducts.consumeredge.com/products/consumer-edge-transact-consumer-financial-data-for-hedge-fund-consumer-edge); [alphanume research explainer](https://www.alphanume-research.com/p/so-you-want-to-trade-credit-card); checked 2026-08-22) | **Later:** VORG's own Shopify order/cohort data is a 100%-coverage "card panel" of its own demand — weekly YoY/WoW matched-cohort tracking once live. **Now:** public aggregate tier only — e.g., bank-published aggregate card-spend commentary and Census MARTS as the free proxy | Paid panels **NOT ACCESSIBLE** (six-to-seven-figure subscriptions); own-data version accessible post-launch |
| 2 | Geolocation / foot-traffic data | Phone-GPS panels (e.g., Placer.ai, Advan) estimating store visits ([Bright Data provider survey](https://brightdata.com/blog/web-data/best-alternative-data-providers)) | Manual pop-up foot-traffic logs: hourly door counts, dwell notes, conversion-to-purchase per event; simple tally sheet becomes a dated artifact feeding `popup` receipts | Paid panels NOT ACCESSIBLE; manual logs fully accessible |
| 3 | Web/app traffic intelligence | Similarweb-class clickstream, app rankings to nowcast e-commerce demand | Own GA4/Shopify analytics (spec in `macro-economy-nowcast-2026-08-22.md` §2b) + Google Trends with saved query/date/geo discipline | Own data accessible post-launch; Trends accessible now |
| 4 | Satellite / aerial imagery | Parking-lot counts, port activity (RS Metrics-class) | No honest micro-label equivalent at VORG scale — skip rather than fake | **NOT ACCESSIBLE / NOT APPLICABLE** |
| 5 | Expert networks | Paid 1:1 calls with industry operators (GLG/AlphaSights-class) for texture on channels and margins | Free version: structured conversations with suppliers, stockists, pop-up venue operators, and other founders — each logged as a dated channel-check memo with who/when/claims/confidence | Paid networks NOT ACCESSIBLE; founder conversations accessible |
| 6 | Channel checks | Calling distributors/stores to verify sell-through before believing management claims | Supplier behavior as signal: quote turnaround, MOQ flexibility, fabric availability, factory backlog comments = capacity-side nowcast; stockist/boutique conversations in target metro = demand-side check | Accessible now (already partially practiced in supplier campaign logs under `product/tech-packs/drop-001/`) |
| 7 | Social listening / NLP sentiment | Scraped social chatter scored by NLP for brand/category heat | Manual, platform-ToS-compliant version: weekly log of comment themes, saves/shares ratios on VORG and comparable-brand posts, TikTok search-suggest terms; no scraping tools without authorization gate | Accessible in manual form |
| 8 | Nowcasting models | High-frequency indicator blends (GDPNow-style) updated as data drops | The macro nowcast file + `MacroContext` input refreshed on each major release (MARTS mid-month, UMich prelim/final, StatCan retail, NY Fed quarterly) | Accessible — this pack is the first iteration |
| 9 | Scenario / stress frameworks | Base/up/down cases with explicit triggers; portfolio stress-tested before sizing | Scenario table in nowcast §6 with named reversal triggers wired into the engine spec | Accessible |
| 10 | Position sizing / Kelly-style bet sizing | Bet size scales with edge and confidence; fractional Kelly to avoid ruin ([alphanume](https://www.alphanume-research.com/p/so-you-want-to-trade-credit-card) illustrates edge-based sizing) | Per-wave budget caps tied to evidence strength: wave sizes grow only as receipt-verified evidence (purchases > checkouts > waitlists) accumulates; ceiling C$5,000-6,000 is the bankroll, first wave is a deliberately fractional bet | Accessible — see engine spec `budgetCapPolicy` |
| 11 | Kill rules / drawdown limits | Pre-committed exit triggers; no averaging down on a broken thesis | Already VORG-native (`cashPolicy` "kill if no qualified actions"); extended: every paid test and production wave gets a written kill condition **before** money moves, and macro downside scenario auto-shrinks the next wave | Accessible |

## 3. Top 5 Tactics Formally Adopted into VORG Strategy

1. **Own-data "card panel" (tactic 1):** treat Shopify + GA4 first-party data as the highest-grade dataset VORG will ever have; instrument it properly from day one (event map in nowcast §2b).
2. **Channel checks (tactic 6):** formalize supplier/stockist conversations into dated memos with confidence scores — VORG already has the raw material in its supplier campaign logs.
3. **Nowcasting cadence (tactic 8):** refresh the macro nowcast on each release date (next: Conference Board 2026-08-25, UMich final 2026-08-28, MARTS ~2026-09-15, StatCan retail ~2026-09-19).
4. **Evidence-scaled position sizing (tactic 10):** per-wave budget caps that grow only with receipt strength; never deploy the full production ceiling on priors.
5. **Pre-committed kill rules (tactic 11):** written reversal/kill conditions before every spend, including macro-triggered ones (downside scenario → smaller proof buy).

## 4. Assumed / Boundaries

- Manual logs are noisy small-N data; they calibrate direction, never "prove demand" for Drop OS GO.
- Comparable-brand social metrics are mechanism priors only (existing mechanism-card discipline applies).
- No scraping, automated collection, or paid-data purchases without clearing `gate-auth-accounts` and privacy gates.

## 5. Unresolved / Next Agent

- Create a `channel-check-memo` template (who/date/claims/confidence/limitations) and file the first three supplier memos retroactively from existing outreach logs.
- Add the release-date refresh calendar to the founder's operating rhythm.
- Implement `MacroContext` + budget-cap policy per the engine spec so tactics 8-11 become code, not prose.
