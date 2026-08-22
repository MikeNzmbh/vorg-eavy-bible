# U.S.-First Go-To-Market Stress Test

Checked: 2026-08-22

Status: **fails the current gate; proof build only.** This is a proposed strategic change under test, not a replacement for the active Ottawa/Gatineau-first source of truth.

## Decision Supported

Decide whether VORG-EAVY may replace its first local wedge with a U.S.-first, Shopify-and-TikTok-led Drop 001, using UGC, founder-led YouTube, TikTok content, and physical pop-ups, while treating Ontario, Quebec, Vancouver, and Halifax as the secondary expansion queue.

## Recovery Brief

- **Referenced thread:** `Update launch focus` (`6a8a00bc-b4e8-83ea-85ad-5046fb9ee703`). It contains the founder direction but no completed Bible audit, decision log, or code change.
- **Confirmed workspace:** `C:\Users\mbaho\OneDrive\Documents\vorg-eavy-bible`.
- **Current source-of-truth conflict:** `docs/MASTER_BRIEF.md`, `docs/HANDOFF.md`, launch planning, and the dashboard defaults still say Ottawa/Gatineau first. The existing traffic plan is explicitly local: 980 waitlist, 330 connector, 850 named paid sessions, and 135 pop-up visitors. None are U.S. receipts.
- **Safe current posture:** evaluate the U.S. thesis as a new market-entry route. Do not overwrite the local thesis, start paid media, book a U.S. pop-up, or place inventory until the new route clears its controls.

## Plan Under Test

| Element | Founder direction | What it means operationally |
| --- | --- | --- |
| Primary market | United States | A country, not yet a focused launch wedge or a physical pop-up city |
| Commerce | Shopify + TikTok | The team must choose whether TikTok is acquisition to Shopify checkout, TikTok Shop, or both; those are different operations and reconciliation paths |
| Creative | UGC, founder-led YouTube, TikTok | Content can create a tested acquisition hypothesis; it is not evidence of U.S. demand by itself |
| Physical | Normal pop-up shops | A city, venue/partner, capacity, permissions, inventory allocation, POS, and run-of-show are still unnamed |
| Canada second | Ontario -> Quebec -> Vancouver -> Halifax | These are a market queue, not yet launch-ready cities; Quebec additionally needs its own French-language and distance-contract preflight |

## Scored Result

The scored scenario uses the 126-unit working merchandise plan from `launch/drop-001-sales-forecast-inputs.md`, but grants **no credit** for its planning prices, costs, traffic, or content ideas. It sets no self-rated heat, no campaign proof, no U.S. demand receipt, and risk at the current TEST ceiling (72) because cross-border execution is undefined.

| Engine surface | Score | Why |
| --- | ---: | --- |
| Overall Drop OS readiness | **0 / 100** | No linked vendor/sample evidence, campaign receipts, completed pre-production stages, U.S. operations proof, or verified demand |
| Gate / spend authorization | **REVISE / proof-only** | RFQs, price work, samples, and founder-approved proof work are allowed; bulk, venue deposits, broad paid media, and launch claims are blocked |
| Evidence coverage | **10 / 100** | The planning SKU table is structured, but it is not vendor, campaign, or market evidence |
| Manufacturing truth | **15 / 100** | Working landed COGS exists; linked quotes, sample proof, and PP approvals do not |
| Financial proof | **70 / 100** | The working units/prices/COGS fit the C$6,000 cap, but price proof and quote proof are absent; it cannot clear GO |
| U.S. market-entry gate | **7 / 100** | Only the U.S. primary-market selection is present. Shopify, TikTok, USD, and a pop-up have been named but not evidenced or operated |
| U.S. market-entry evidence | **0 / 100** | No U.S. demand, market economics, fulfilment, customs, policy, channel, or pop-up receipt is linked |

The score is intentionally not a forecast of whether Americans will like the product. It is a finding that the organization has not yet earned permission to bet the first inventory run on that route.

## Failure Modes And Required Fixes

| Priority | Failure mode | Why it breaks the thesis | Required fix / receipt |
| --- | --- | --- |
| P0 | The U.S. is treated as a wedge | A country cannot supply local density, a pop-up location, or a measurable community loop | Name one U.S. test metro and one audience/context. Capture a geo-tagged, deduplicated demand receipt before calling it the Drop 001 wedge |
| P0 | Cross-border cost and customer promise are absent | Canada-to-U.S. shipping can add duties, brokerage, returns friction, FX, and delivery uncertainty that invalidate the current C$ pricing and margin model | Choose **one** model: Canada-to-U.S. DDP carrier or U.S. 3PL. Attach carrier/3PL quote, importer/broker decision, HS/origin treatment, U.S. shipping promise, return operator, and USD contribution sheet |
| P0 | Current traffic forecast is non-transferable | The 2,160-session plan is Ottawa/Gatineau-only and still plan data; moving geography while retaining its conversion or pop-up assumptions is false precision | Rebuild the channel plan by U.S. source, owner, date window, spend cap, landing, UTM/code, and receipt. Keep every field `plan` until aggregate first-party data lands |
| P0 | “TikTok + Shopify” is not a commerce architecture | TikTok can be a referral channel, TikTok Shop, or both. Checkout, fulfilment, returns, attribution, and reconciliation differ | Choose the commercial route. Map Shopify/POS/GA4 events; require an owner, UTM/code contract, policy review, and a pre-launch test purchase before counting the channel |
| P1 | UGC is treated as content volume rather than a governed acquisition loop | Gifting, payment, affiliate economics, content rights, claims, music, and disclosure can create account, legal, and brand loss | Use a signed creator brief/release, disclosure instructions, asset-usage rights, product-claim guardrails, and a result receipt. Paid/gifted posts need clear material-connection disclosure; no scripted praise or fake UGC |
| P1 | Founder YouTube is unscoped | Long-form founder footage can build trust but will not automatically create TikTok conversion or U.S. intent | Use it as a product-truth library: sample correction, fit, fabric, care, and trade-off. Cut original short versions for TikTok, then measure qualified product/size/city actions—not views alone |
| P1 | A physical pop-up is promised without a market or operating lane | Venue regulations, staffing, inventory split, POS, insurance, photo consent, music, and queue capacity are city-specific | Select a city after market proof; attach venue/partner permission, capacity, run-of-show, insurance/compliance notes, POS/inventory reconciliation, and consent flow. Until then physical pop-up is a test idea, not an assumed 20-order channel |
| P1 | U.S. product truth is unproven | Garments need accurate fibre/origin/responsible-business information and care guidance; unverified textile or performance claims become a launch liability | SKU-level label/care preflight based on final materials, origin, and care testing before U.S. sale or paid seeding |
| P2 | Canada expansion queue is too coarse | Ontario and Quebec are provinces; “Vancouver” and Halifax are cities. Quebec has a materially different language/consumer-contract surface | Convert the queue into testable markets: named Ontario city, named Quebec city, Vancouver, Halifax. Put Quebec behind a complete French storefront/communications/contract review, rather than inheriting the English/U.S. setup |
| P2 | The existing financial model can look more verified than it is | Numeric unit/price/COGS values used to receive financial readiness credit even if they were working assumptions | v1.3 now requires a price-test/approval reference and quote proof for every active SKU to clear the financial model gate |

## Non-Negotiable External Surfaces

These are operating checks, not legal conclusions. The relevant sources must be rechecked immediately before a consequential launch and reviewed by qualified counsel or a customs/tax specialist where needed.

- Shopify says U.S. cross-border orders require market-level duties/tax, HS-code/origin, fulfilment, checkout, and policy decisions; its current guidance also flags that U.S. de minimis treatment no longer applies. See [Shopify’s duties and import-tax guide](https://help.shopify.com/en/manual/international/duties-and-import-taxes) and [Shopify Markets duties/taxes setup](https://help.shopify.com/en/manual/markets/customizations/duties-and-taxes), checked 2026-08-22.
- CBP likewise states that applicable duties, taxes, and fees apply to imports after the 2025 de minimis change. See [CBP’s current guidance](https://www.help.cbp.gov/s/article/Article-1919?language=en_US), checked 2026-08-22.
- The FTC says covered textile products generally need fibre content, origin, and responsible-business identification, and garments need accurate care instructions. See [FTC apparel labeling guidance](https://www.ftc.gov/news-events/topics/tools-consumers/apparel-labeling) and [care-label guidance](https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule), checked 2026-08-22.
- For UGC and creator seeding, the FTC says material connections include payment, gifts, and discounts and must be disclosed clearly with the endorsement. See [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers), checked 2026-08-22. TikTok’s current commercial-content and music surfaces also need the same pre-publish review: [promoting a brand, product, or service](https://support.tiktok.com/en/business-and-creator/creator-and-business-accounts/promoting-a-brand-product-or-service) and [commercial use of music](https://support.tiktok.com/en/business-and-creator/creator-and-business-accounts/commercial-use-of-music-on-tiktok), checked 2026-08-22.

## Engine Changes Made

`VORG Drop OS score v1.3` now adds a market-entry contract only when a primary market is explicitly set. It keeps existing domestic scenarios backward compatible while making a strategic pivot earn its own proof.

1. **New market-entry gate:** primary-market demand receipt, market currency/economics, fulfilment, cross-border treatment, duties/tax, shipping, returns, textile/compliance, privacy/SMS, creator rights/disclosure, Shopify route, TikTok route, and enabled pop-up plan.
2. **Cross-border protection:** when operating and primary markets differ, documented importer/carrier treatment is required. A U.S. primary market also requires USD checkout economics.
3. **Channel protection:** Shopify and TikTok must each have an active owner, commercial route, measurement evidence, and policy evidence. Their names alone are zero proof.
4. **Price-proof correction:** a numeric price and landed COGS no longer make an SKU financially complete without a price-test/approval reference and supplier quote proof.
5. **Dashboard support:** the Next City workspace now exposes the route-to-market form; its state appears in snapshots and in the command-center scoring breakdown.
6. **Tests:** the algorithm test suite now proves that an unverified U.S.-first plan cannot reach GO, a complete evidenced plan can, and missing cross-border treatment or price proof blocks GO.

## Recommended Operating Sequence

1. Choose a single U.S. test metro; do not call the entire country the Drop 001 wedge.
2. Select the commercial route: TikTok-to-Shopify checkout, TikTok Shop, or a deliberately separated test of both. Name a human owner and reconciliation path for each.
3. Obtain a DDP/carrier or U.S.-3PL quote, then rebuild the USD price, landed contribution, returns, and delivery promise by SKU. The C$5,000-C$6,000 production ceiling remains in force until the founder changes it.
4. Run a no-fake-proof creative sprint using an actual sample: founder product-truth clips, contracted/gift-disclosed UGC, and one U.S.-targeted Shopify landing. Lock success and kill conditions before launch; record aggregate geo/source/product/size receipts.
5. Use observed receipts to select the first U.S. pop-up city. Only then prepare venue permissions, staffing, POS and inventory reconciliation, photo consent, music, and queue controls.
6. Run Canada as a separate, evidence-led expansion queue after the U.S. route is proven. Quebec must pass its own localization and consumer-contract review.

## What The Next Agent Should Do

Populate the new **Primary-market gate** in Drop OS with real documents, not placeholders. The first gate to clear is the cross-border fulfilment and USD economics decision; it changes pricing, shipping, returns, and whether the U.S. thesis is economically viable before any content scale or pop-up deposit.
