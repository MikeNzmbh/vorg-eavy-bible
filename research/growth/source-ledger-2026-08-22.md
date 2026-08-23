# Growth + Prediction Source Ledger

Checked: 2026-08-22
Truth class: external mechanism evidence. No row is a VORG sales receipt.

## 1. Channel and commerce infrastructure

| ID | Source | Atomic fact used | VORG use / limit |
| --- | --- | --- | --- |
| CH-IG-01 | [Meta — Trial Reels](https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/) | Trial Reels can be shown to non-followers first; initial metrics appear after about 24 hours and optional auto-sharing can use the first 72 hours | Use as an Instagram creative exploration lane. Meta's creator analysis is platform-reported and does not guarantee VORG reach |
| CH-IG-02 | [Meta — creativity and Trial Reels rollout](https://about.fb.com/news/2025/06/inspiring-creativity-that-brings-people-together/) | Meta said Trial Reels became broadly available and reported changes among creators who adopted them | Mechanism only; do not import Meta's reach result into a VORG forecast |
| CH-IG-03 | [Instagram Help — Shops](https://www.facebook.com/help/instagram/1187859655048322/) | Eligible businesses can present a product catalog through Facebook/Instagram commerce surfaces; support and availability can change | Catalog continuity lane, subject to current account/country eligibility |
| CH-TT-01 | [TikTok — Shopify supported events](https://ads.tiktok.com/help/article/supported-events-shopify) | TikTok's Shopify integration supports view, cart, checkout, purchase, search, wishlist and subscribe events | Instrument the full funnel; audit deduplication and consent |
| CH-TT-02 | [TikTok — Shopify data sharing](https://ads.tiktok.com/help/article/data-sharing-tiktok-app-shopify) | Enhanced/maximum sharing can combine Pixel, Events API and Shopify integrations | Measurement option, not permission to share all customer data; privacy/legal review controls |
| CH-TT-03 | [TikTok — Search Ads Campaign](https://ads.tiktok.com/business/en-GB/blog/introducing-search-ads-campaign) | Search campaigns use keywords and can support traffic/web-conversion objectives with video or carousel creative | Treat TikTok as an intent test as well as discovery; platform case results are not VORG priors |
| CH-TT-04 | [TikTok — Shop discovery](https://newsroom.tiktok.com/tiktok-shop-is-where-shoppers-come-to-discover?lang=en) | TikTok describes shoppable videos and LIVE as discovery-commerce formats and reports platform growth | Test only after fee, return, inventory, brand-control and eligibility gates |
| CH-YT-01 | [YouTube — A/B test titles and thumbnails](https://support.google.com/youtube/answer/16391400) | Eligible creators can test up to three title/thumbnail combinations; YouTube selects on watch-time share and can report no clear winner | Use concurrent native tests on long-form founder media; do not force a winner from insufficient impressions |
| CH-YT-02 | [YouTube Shopping](https://support.google.com/youtube/answer/12257682) | Eligible creators can connect a store and tag products in videos, Shorts and live streams | Later commerce layer; eligibility and Merchant Center countries of sale control |
| CH-GO-01 | [Google Merchant Center — free listings](https://support.google.com/merchants/answer/13889434) | Eligible product data can appear free across Search, Images, Lens, YouTube, Gemini, Shopping and Maps | Make product feed quality an owned infrastructure task; display is not guaranteed |
| CH-GO-02 | [Google + Shopify free listings](https://support.google.com/merchants/answer/13692890) | Eligible Shopify stores can sync products to Merchant Center through the Google & YouTube app | Implement before launch so feed errors are found early |
| CH-GO-03 | [Google Search — Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product) | Product/variant markup and Merchant Center feeds can improve eligibility for price, availability, shipping, returns and visual results | One product truth layer across Shopify, feed and markup; rich results are not guaranteed |
| CH-GO-04 | [Google Search — ecommerce launch options](https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website) | Google documents soft-launch and unavailable-product feed options that permit technical verification before the marketing event | Use a truthful soft technical launch; never show false availability |
| CH-GA-01 | [GA4 — recommended ecommerce events](https://support.google.com/analytics/answer/9267735) | GA4 recommends item-view, cart, checkout, purchase, refund and related ecommerce events | Canonical measurement map, verified in DebugView before spend |
| CH-GA-02 | [GA4 — ecommerce setup](https://support.google.com/analytics/answer/12200568) | Ecommerce parameters provide item/event context; refund events can include item details | Keep transaction IDs, SKU/variant and refund truth consistent |
| CH-PIN-01 | [Pinterest — Path to Performance](https://business.pinterest.com/en-ca/pdf/pinterest-presents/path-to-performance/) | Pinterest recommends catalog and tag/Conversions API infrastructure and reports platform-internal performance comparisons | Evergreen visual-search test; internal platform studies are mechanism evidence only |
| CH-SH-01 | [Shopify — customer cohort analysis](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/customers-reports) | Shopify can group customers by first-order cohort and report repeat behavior, order value, channels and geography | Returning-customer and channel-quality control after first orders |
| CH-SH-02 | [Shopify — Shop discovery](https://help.shopify.com/en/manual/online-sales-channels/shop/customer-experience) | Shop search uses product titles, descriptions, imagery, price, customer context and shipping availability; conversational search is available in U.S./Canada | Optimize catalog truth for an additional discovery surface; eligibility and ranking are not assured |
| CH-SH-03 | [Shopify — channel markets](https://help.shopify.com/en/manual/online-sales-channels/channel-markets) | Shopify Markets can separate channel catalog, price and currency, including a TikTok Shop catalog adjusted for channel fees | Use channel-specific contribution math without creating inconsistent product truth |
| CH-SH-04 | [Shopify — complementary products](https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-recommendations) | Merchants can define complementary products; Shopify also uses purchase history, text and collection relationships | “Complete the look” can raise basket size only when recommendations are genuinely relevant |

## 2. Search and trend interpretation

| ID | Source | Atomic fact used | VORG use / limit |
| --- | --- | --- | --- |
| TR-GT-01 | [Google Trends FAQ](https://support.google.com/trends/answer/4365533) | Trends uses sampled, anonymized, aggregated searches; values are normalized by time/location and scaled 0–100 | Treat as relative direction, never absolute volume or sales; save query, geo, period and CSV |
| TR-GT-02 | [Google Trends export guidance](https://support.google.com/trends/answer/4365538) | Trends charts can be exported to CSV and should be attributed when reused | Freeze dated exports so mutable searches become auditable artifacts |
| TR-WGSN-01 | [WGSN Fashion](https://www.wgsn.com/en/products/fashion-design) | WGSN describes expert forecasting combined with proprietary data | Benchmark only; paid evidence is not available to VORG unless purchased |
| TR-ED-01 | [EDITED trend analysis](https://edited.com/solutions/trend-analysis/) | EDITED positions its work around market/runway signals and assortment decisions | Transfer the signal→assortment discipline, not proprietary results |
| TR-HEU-01 | [Heuritech](https://heuritech.com/company-about-us/) | Heuritech describes visual-recognition analysis of fashion in social imagery | Benchmark for visual signal detection; no accessible VORG dataset is assumed |
| TR-LYST-01 | [Lyst Index methodology](https://www.lyst.com/the-lyst-index/) | Lyst combines interactions, searches, views, sales and social signals in its product/brand index | Evidence that fashion heat is multi-signal; Lyst demand is not VORG demand |

## 3. Prediction systems adapted to apparel

| ID | Source | Atomic fact used | VORG translation |
| --- | --- | --- | --- |
| PR-M5-01 | [M5 Accuracy Competition paper](https://www.sciencedirect.com/science/article/pii/S0169207021001874) | The M5 challenge forecast 42,840 hierarchical Walmart sales series and tested statistical/ML approaches with explanatory variables | Preserve simple baselines, cross-learning and SKU→drop→month reconciliation; activate only after history exists |
| PR-M5-02 | [M5 Uncertainty Competition paper](https://doi.org/10.1016/j.ijforecast.2021.10.009) | The uncertainty challenge evaluated multiple quantiles across the same retail hierarchy | Report ranges and downside quantities, not only one unit forecast |
| PR-TS-01 | [Agrawal & Goyal — contextual Thompson sampling](https://arxiv.org/abs/1209.3352) | Thompson sampling balances exploration and exploitation using Bayesian sampling with theoretical regret guarantees in a contextual setting | Later allocate a capped creative/creator exploration budget after attributable observations exist |
| PR-CM-01 | [Contextual bandits for causal marketing](https://arxiv.org/abs/1810.01859) | The research combines causal uplift and bandits and reports preliminary fashion-marketing dataset results | Optimize incremental retained contribution, not customers who would buy anyway; not a prelaunch model |
| PR-CI-01 | [Google research — Bayesian structural time series](https://research.google/pubs/inferring-causal-impact-using-bayesian-structural-time-series-models/) | The model predicts a counterfactual time series to estimate the impact of an intervention | Later evaluate campaigns or pop-ups when a credible control series exists |
| PR-NV-01 | [Mean-downside-risk newsvendor for fashion](https://www.sciencedirect.com/science/article/pii/S092552731000397X) | Newsvendor logic fits short-season, uncertain-demand fashion inventory and can incorporate downside risk | Set quantities using margin, salvage, stockout and cash-at-risk rather than a point forecast alone |
| PR-NV-02 | [Two-order newsvendor with information updating](https://www.sciencedirect.com/science/article/pii/S0925527312003192) | A fashion supply chain can use an initial order and a later updated order under uncertainty | Negotiate split-wave buys and fast replenishment; first wave buys learning |
| PR-KEL-01 | [Kelly — A New Interpretation of Information Rate](https://onlinelibrary.wiley.com/doi/abs/10.1002/j.1538-7305.1956.tb03809.x) | Kelly linked information/edge to capital growth under repeated bets | Use conservative fractional sizing with hard cash caps; never assume precise fashion probabilities |
| PR-BAY-01 | [Hierarchical Bayesian size recommendation in fashion](https://arxiv.org/abs/1908.00825) | The model pools article/customer characteristics and return outcomes for size recommendations | Later pool size/fit learning while preserving article differences; capture too-small/too-big reasons now |
| PR-AGE-01 | [Product-age demand forecast for fashion retail](https://arxiv.org/abs/2007.05278) | The paper models demand by weeks since product launch | Anchor VORG curves to product age and compare like-for-like launch weeks |
| PR-MMM-01 | [Google Meridian](https://developers.google.com/meridian) | Meridian is an open-source Bayesian MMM and supports experiment calibration, reach/frequency and search-volume controls | Block until VORG has sufficient weekly variation; use experiments first |

## 4. Comparable operator mechanisms

| ID | Source | Observed result | Transferable mechanism / boundary |
| --- | --- | --- | --- |
| CO-SCUF-01 | [Shopify — Scuffers](https://www.shopify.com/uk/case-studies/scuffers) | Shopify reports 225% year-over-year growth, weekly/biweekly launches, about 60% direct traffic and online-data-led physical expansion | Daily data ritual, rapid content/store response, direct demand and online proof before retail. Large-company result is not a VORG forecast |
| CO-CHUB-01 | [Shopify — Chubbies](https://www.shopify.com/case-studies/chubbies) | Shopify reports 50% year-over-year sales growth and a large owned/community audience | Lifestyle world, customer UGC and owned audience compounding. Old, platform-authored case; no direct transfer rate |
| CO-BRUNT-01 | [Shopify — BRUNT](https://www.shopify.com/case-studies/brunt-workwear) | Shopify describes founder/audience fit, DTC/retail scale and a store that ran out of inventory in week one | Build with a specific lived customer, let product proof precede channel breadth; enterprise scale is not comparable |
| CO-REP-01 | [Shopify — Represent](https://www.shopify.com/in/case-studies/represent) | Shopify describes the founders' path from graphic tees to a broader luxury fashion label and community-led drops | Founder media + patient product ladder; revenue target is not imported |
| CO-COR-01 | [GQ — Corteiz Brooklyn Denim Exchange](https://www.gq.com/story/corteiz-brooklyn-denim-exchange-scene-report) | Reporting documents a participatory garment-exchange event in Brooklyn | Participation, earned city proof and content density; no unsafe queueing, surprise crowd or imitation |
| CO-TEL-01 | [Telfar — general questions](https://help.telfar.net/en-US/articles/general-questions-55282) | Telfar documents its limited Bag Security preorder program | Time-boxed demand capture can reduce inventory guesswork; delivery and customer cash obligations must be explicit |

## 5. Tax, legal, consent and truth boundaries

| ID | Source | Atomic fact used | Gate |
| --- | --- | --- | --- |
| LG-FTC-01 | [FTC — Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) | Material connections include payment, gifts, discounts and other value and should be clearly disclosed | Creator brief, disclosure instruction and pre-publish audit |
| LG-CASL-01 | [CRTC — CASL requirements](https://crtc.gc.ca/eng/internet/anti/reg.htm) | Commercial electronic messages generally require consent, sender identification and a working unsubscribe mechanism | Consent ledger and proof; applies to email/SMS and can reach cross-border sending situations |
| LG-FCC-01 | [FCC — revocation of robocall/robotext consent](https://docs.fcc.gov/public/attachments/FCC-24-24A1_Rcd.pdf) | FCC rules recognize reasonable revocation methods and require timely honoring of opt-outs in covered contexts | U.S. SMS counsel/vendor configuration; STOP and suppression must work |
| TX-CRA-01 | [CRA — T4 information for employers](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/completing-filing-information-returns/t4-information-employers/t4-slip.html) | Salary/wages and deductions can require T4 reporting | C$3k founder salary needs payroll/accountant setup; engine amount is a cash envelope only |
| TX-CRA-02 | [CRA — T5 guide](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4015/t5-guide-return-investment-income.html) | Canadian corporate dividends have eligible/non-eligible reporting rules and T5 fields | Year-end dividend lock does not replace accountant classification/reporting |
| TX-CRA-03 | [CRA — exports](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-imports-exports.html) | Qualifying exports can be zero-rated when conditions/evidence are satisfied | Retain carrier/export evidence; do not assume every U.S. order is automatically handled correctly |
| TX-NY-01 | [New York — sales-tax registration](https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/do_i_need_to_register_for_sales_tax.htm) | New York lists physical/activity and remote-seller triggers; taxable event selling can require registration | Brooklyn pop-up creates a different review from remote Shopify-only sales |
| TX-NY-02 | [New York — clothing exemption](https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/clothing_and_footwear.htm) | Qualifying clothing under US$110 can receive state/local exemptions depending on locality | SKU-by-SKU and locality review; do not use one blanket rate |
| TX-CA-01 | [California — remote seller matrix](https://cdtfa.ca.gov/formspubs/cdtfa758.pdf) | California documents a US$500,000 remote-sales threshold and district-tax rules | Track state sales and physical activity; threshold is not the only nexus question |
| TX-SST-01 | [Streamlined Sales Tax — state tables](https://www.streamlinedsalestax.org/state-tables) | States use different economic-nexus thresholds and bases | Maintain a monthly state-nexus tracker; confirm against each state's current guidance |

## Source-quality rules

1. Platform and Shopify case studies are first-party/vendor claims. They can justify testing a mechanism but cannot supply VORG conversion, CAC or sell-through.
2. Academic methods are transferable only when the VORG sample meets the activation gate; sophistication before data is not rigor.
3. Mutable tax/platform pages are rechecked at implementation and launch, not merely cited once.
4. Search/trend data needs a saved export with query, topic/term choice, geography, period, category and date.
5. Every VORG forecast freezes its inputs before outcomes arrive, then records error; no retroactive tuning to make the engine look correct.

\n