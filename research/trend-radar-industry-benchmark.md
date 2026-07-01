# Trend Radar Industry Benchmark

Checked: 2026-06-25

## Decision Supported

Define the standard VORG-EAVY should use before building a trend analytics algorithm for future seasonal items.

This note benchmarks how fashion intelligence, retail merchandising, product development, and risk-management systems separate real signals from noise.

## Conclusion

Do not build a simple "trending items" ranker.

Build a `Trend Radar + Stress Test` system that does four jobs:

1. Detect emerging item signals across multiple channels.
2. Separate cultural heat from purchase intent.
3. Filter each item through VORG-EAVY brand, audience, production, and margin logic.
4. Force a go / hold / test / kill decision before sampling or production.

The industry pattern is not one magic score. The strongest systems combine data triangulation, human judgment, explicit confidence levels, and gated decisions.

## Known Public Facts

### Fashion forecasting and market intelligence

- WGSN describes its fashion forecasts as a combination of expert trend forecasting and data intelligence. Its public fashion product page says it integrates five proprietary data sources across social, sentiment, search, shows, and retail data.
  Sources: https://www.wgsn.com/en/products/fashion-design and https://www.wgsn.com/en/blog/expert-insight-5-essential-data-sources-fashion-forecasting
- EDITED positions trend analysis around validating trends with market and runway insights, turning predictive signals into assortment actions, and benchmarking category mix against competitors.
  Source: https://edited.com/solutions/trend-analysis/
- Heuritech describes its method as AI-based visual recognition and forecasting based on real-world images shared on social media, used to quantify and predict what people wear.
  Source: https://heuritech.com/company-about-us/
- Trendalytics describes its platform as using predictive search, social, market, TikTok, and retail data to help brands validate product ideas and investment decisions.
  Source: https://trendalytics.co/

### Shopper, social, and demand signals

- Lyst's Q1 2026 product methodology filters more than eight million items using social media mentions, searches, page views, interactions, sales on Lyst, color grouping, and demand relative to stock volume.
  Source: https://www.lyst.com/the-lyst-index/q1-26/
- Google Trends data is scaled from 0 to 100 based on a topic's proportion to all Google searches for the selected context; equal values across regions do not mean equal absolute search volume.
  Source: https://support.google.com/trends/answer/4365533
- TikTok's Creative Center exposes trend discovery across hashtags, songs, creators, videos, top products, and creative strategies.
  Source: https://ads.tiktok.com/creative/creativeCenter/trends
- Pinterest Predicts is Pinterest's annual trend forecast across categories including fashion and style.
  Source: https://business.pinterest.com/pinterest-predicts/
- Launchmetrics' Media Impact Value is a proprietary fashion, lifestyle, and beauty metric for comparing brand mentions across voices, channels, and regions.
  Source: https://www.launchmetrics.com/resources/blog/what-is-miv

### Product testing and merchandising discipline

- MakerSights positions its platform around objective consumer insight for product concepts, from seasonal kickoff through final line adoption, including testing sketches and reducing guesswork across the long tail of assortment.
  Source: https://www.makersights.com/
- Style Arcade describes demand planning as more than raw sales. Its True Rate of Sale logic accounts for issues such as stockouts, discounting, and aged stock when planning size availability and quantity recommendations.
  Source: https://www.stylearcade.com/blog/how-to-improve-demand-planning-in-fashion-retail
- McKinsey's 2026 State of Fashion says industry leaders are operating in a volatile environment with trade, consumer behavior, and technology in rapid flux, making adaptability important.
  Source: https://www.mckinsey.com/industries/retail/our-insights/state-of-fashion

### Adjacent lanes worth borrowing from

- Stage-Gate is a product-development governance model built around stages followed by go / kill and resource-allocation gates. The public Stage-Gate overview states that PDMA recognizes Stage-Gate as an industry standard.
  Source: https://www.stage-gate.com/blog/the-stage-gate-model-an-overview/
- IDEO's design-thinking framing combines desirability, viability, and feasibility.
  Source: https://designthinking.ideo.com/
- Intercom's RICE framework scores ideas using reach, impact, confidence, and effort.
  Source: https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/
- The Federal Reserve's bank stress tests estimate losses, revenues, expenses, and resulting capital levels under hypothetical recession scenarios. The useful transferable principle is scenario severity: a serious stress test asks what survives under adverse conditions, not what looks good in a base case.
  Source: https://www.federalreserve.gov/publications/2026-stress-test-scenarios.htm

## Benchmark Pattern

The strongest external systems share six patterns:

1. Multi-source triangulation. They do not trust one channel.
2. Momentum plus context. They check whether a signal is rising, peaking, durable, or only viral.
3. Cultural plus commercial reads. Social attention is not treated as proof of purchase.
4. Assortment translation. The best tools convert signals into product, category, price, and inventory decisions.
5. Confidence scoring. Strong systems state how sure they are and why.
6. Gates. A trend can be interesting and still fail brand, margin, timing, or production gates.

## VORG-EAVY Standard

The VORG-EAVY algorithm should classify each candidate item into one of five states:

| State | Meaning | Action |
| --- | --- | --- |
| Signal | Early cross-channel movement, not enough proof | Watch weekly |
| Test | Promising but unproven | Test with content, waitlist, poll, or sample |
| Build | Strong signal, brand fit, and feasible economics | Move to sample / tech pack |
| Hold | Interesting but timing, production, or brand fit is weak | Archive for later review |
| Kill | Fails hard gates | Do not spend sample money |

## Stress-Test Dimensions

Each candidate item should be scored from 1 to 5 across:

| Dimension | What It Tests |
| --- | --- |
| Trend momentum | Is interest rising across more than one source? |
| Cross-channel confirmation | Does it appear in search, social, retail, editorial, resale, or local observation? |
| Brand fit | Does it strengthen The Firm: access, polish, ambition, discipline? |
| Audience fit | Would Ottawa/Gatineau early adopters plausibly wear it this season? |
| Drop role | Does it serve hero, entry, or belonging-marker logic? |
| Commercial feasibility | Can price, landed COGS, margin, and MOQ make sense? |
| Production feasibility | Can it be sampled and quality-controlled in time? |
| Content and event power | Will it photograph, seed, and show well at a pop-up? |
| Timing durability | Will it still feel relevant when the item arrives? |
| Saturation risk | Is the market already crowded or too late? |
| Fit / return risk | Does the item create sizing, comfort, or return exposure? |
| Brand dilution risk | Would chasing this make VORG-EAVY look noisy or derivative? |

## Proposed Working Score

This is a VORG-EAVY working assumption, not an external benchmark:

```text
Trend Opportunity Score =
  15% trend momentum
+ 10% cross-channel confirmation
+ 20% brand fit
+ 10% audience fit
+ 10% drop role strength
+ 15% commercial feasibility
+ 10% production feasibility
+ 10% content / event power
- penalties for saturation, timing, fit/return, and brand dilution risk
```

Do not let the score override a hard gate.

## Hard Gates

Reject or hold an item if any of these are true:

- It does not fit VORG-EAVY's brand language without loud branding.
- It cannot plausibly be sampled, fitted, and corrected before the seasonal decision window.
- It needs unverified production techniques, materials, or compliance assumptions.
- It requires pricing that breaks the target audience or the margin model.
- It creates high return risk without a fit-testing plan.
- It looks like a direct copy of another brand's recognizable design.
- It only has one-source social virality and no demand proxy.

## Scenario Stress Tests

Before sampling, run each item through these adverse cases:

| Scenario | Question |
| --- | --- |
| Viral collapse | If the trend loses social heat in 30 days, does the item still belong? |
| Mall-brand compression | If a larger brand releases a cheaper version, why would someone still buy VORG-EAVY? |
| Supplier delay | If sampling slips by 30 days, does the seasonal window survive? |
| Cost shock | If landed COGS rises 20%, does the price still work? |
| Fit failure | If the first proto fits poorly, can it be corrected without killing timeline? |
| Local lukewarm read | If Ottawa/Gatineau response is weak, can the item be reduced, reframed, or killed? |
| Content failure | If it does not photograph strongly, does it still have product value? |
| Brand dilution | If it sells but makes the brand look less disciplined, is it still worth it? |

## Evidence Ladder

Use this ladder before committing money:

| Level | Evidence Type | Meaning |
| --- | --- | --- |
| 0 | Founder instinct only | Not enough |
| 1 | One public signal | Watch |
| 2 | Two or more independent signals | Candidate |
| 3 | Signals plus brand/audience fit | Test |
| 4 | Test response plus feasible supplier path | Sample |
| 5 | Sample approved plus quantified demand | Produce small batch |

## Data Sources To Start With

Low-cost first version:

- Google Trends for search direction, with normalization caveats.
- TikTok Creative Center for hashtags, creator formats, and top products.
- Pinterest Predicts and Pinterest search trend reads for early intent.
- Lyst Index and editorial/product rankings for demand proxies.
- Competitor product pages for assortment, pricing, stock/markdown signals, and copy language.
- Local observation from Ottawa/Gatineau campuses, events, nightlife, cafes, and creative circles.
- VORG-EAVY waitlist clicks, polls, saves, DMs, comments, preorders, and pop-up feedback once available.

Paid/professional later:

- WGSN for expert forecasting and broader macro/product forecasts.
- EDITED for assortment, pricing, runway, and competitor benchmarking.
- Heuritech or Trendalytics for AI-powered social/search trend intelligence.
- MakerSights or similar consumer testing if line size grows.
- Style Arcade or similar planning tool after real sales history exists.

## Recommended Build Shape

Version 1 should be a spreadsheet or lightweight database, not an overbuilt app:

1. Candidate item intake.
2. Source evidence log.
3. Signal scores.
4. Brand and commercial gates.
5. Scenario stress-test answers.
6. Confidence level.
7. Decision state.
8. Next action and review date.

Only automate after the scoring language and kill gates produce good decisions across at least 20 candidate items.

## Open Questions

- Which platforms matter most for VORG-EAVY's first wedge: TikTok, Instagram, Pinterest, Google search, or local observation?
- What is the minimum local response needed before sampling an item?
- Should Drop 002 prioritize adjacent items to The Firm Jacket or open a new category?
- What COGS and MOQ ceiling should trigger an automatic hold?
- How much weight should be given to resale/luxury demand versus campus-local wearability?

## Next Agent

Use this benchmark to build `The Signal Desk` v0 as a VORG-EAVY operating tool. Start with a manual scoring sheet and a written review cadence before implementing code.

Do not present the score as truth. Present it as a disciplined decision aid with evidence, confidence, and hard gates.
