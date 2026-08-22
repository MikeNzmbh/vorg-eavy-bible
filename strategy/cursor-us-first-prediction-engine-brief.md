# Cursor Build Brief: U.S.-First Positioning & Prediction Engine

Checked: 2026-08-22
Status: Build brief for Cursor — not an approved launch decision and not a replacement for the Ottawa/Gatineau source of truth yet.

## Decision This Engine Must Support

Recommend the **most defensible initial U.S. position** for VORG-EAVY before VORG has first-party U.S. receipts, then continuously revise that recommendation as genuine VORG demand, conversion, and operational receipts arrive.

The output must be a single provisional winner, not a vague instruction to "target the USA":

1. the primary online market;
2. the first physical test metro (if one is justified);
3. the buyer/problem/style position;
4. the Drop 001 SKU and content sequence;
5. the Shopify + TikTok + founder YouTube distribution roles;
6. the cross-border/tax/fulfilment path required to make that plan commercially real; and
7. the next experiment that could confirm or overturn the prediction.

The current founder direction to evaluate is:

- U.S. first, with Shopify and TikTok as the commercial core;
- original UGC, founder-led YouTube, and TikTok-native content as the distribution system;
- controlled pop-ups after a market is selected and permitted;
- Canadian expansion second: a named Ontario city, a named Quebec city, Vancouver, then Halifax.

## Non-Negotiable Framing

Do **not** make a forecast engine wait for receipts before it can name a provisional winner. Its first version must use dated, linked **public priors** to make a prediction.

At the same time, it must never rewrite forecasts as observed VORG facts. The engine needs two separate evidence lanes:

| Lane | Purpose | Can name a provisional winner? | Can clear bulk production or material launch commitments? |
| --- | --- | ---: | ---: |
| Public prior | External search/demand signals, comparable-brand mechanisms, platform and market data, tax/fulfilment feasibility | Yes | No |
| VORG receipt | Dated first-party waitlist, product selection, checkout, purchase, content-qualified-action, or pop-up data | Yes; it recalibrates the forecast | Only together with existing Drop OS production, financial, and market-entry gates |

The initial result is a **prediction with a confidence band**, not a claim that VORG has already found product-market fit. A lack of VORG receipts is uncertainty, not an instruction to stop thinking. A forecast must become easier to overturn as the live evidence disagrees with it.

## Existing Truth To Preserve

- Current active Drop 001 product set: The Firm Jacket, women’s low-rise denim jean, men’s denim jean, scarf, and women’s top/bodysuit.
- Units, prices, landed COGS, vendor quotes, samples, and product claims remain unresolved until evidenced.
- Initial inventory/production ceiling remains C$5,000–C$6,000 unless the founder changes it.
- Current repo source of truth still names Ottawa/Gatineau as the first wedge. The engine may recommend a U.S.-first replacement only as a recorded proposal with the reasons, confidence, and gates to test it.
- The existing `VORG Drop OS score v1.3` remains the production-readiness authority. This engine is a **position-selection and forecast** authority; it must not silently authorize inventory, venue deposits, broad paid media, or public launch claims.

Read before implementing:

- `docs/MASTER_BRIEF.md`
- `docs/HANDOFF.md`
- `docs/DECISIONS.md`
- `strategy/drop-os-scoring-v1.md`
- `strategy/us-first-gtm-stress-test-2026-08-22.md`
- `site/src/drop-os-algorithm.ts`
- `site/tests/drop-os-algorithm.test.mjs`
- `finance/` forecast documents and tests
- `research/commerce-intelligence/` source registry and public-prior files

## What To Build

Build a standalone, typed **Market Positioning & Prediction Engine v1**. Keep it separate from the Drop OS readiness engine so a market forecast cannot be mistaken for production proof.

Suggested files:

- `site/src/market-positioning-prediction.ts`
- `site/tsconfig.market-positioning.json`
- `site/market-positioning-prediction.js` (compiled browser bundle)
- `site/tests/market-positioning-prediction.test.mjs`
- a small JSON/Markdown data contract in `research/market-positioning/`
- a visible "Prediction, not observed demand" panel in the Drop OS UI only after the pure engine and tests pass.

Follow the repo’s existing namespace/bundle/testing style. Add narrow package scripts such as `build:positioning` and `test:positioning`; do not break the existing algorithm or compile every unrelated in-progress file.

## Required Engine Inputs

Every input needs a source URL or local artifact path, date checked, source class, and confidence. An unlinked number is `unknown`, not zero and not proof.

### 1. Candidate market card

Each candidate must have:

```ts
type CandidateMarket = {
  id: string;
  country: string;
  metro: string;                 // required — “United States” alone is invalid
  onlineScope: "metro" | "national";
  targetBuyer: string;
  positionStatement: string;
  activeSkuIds: string[];
  popUpIntent: "none" | "later-test" | "proposed";
  operatingMarket: string;       // e.g. Canada until a U.S. entity/3PL is evidenced
};
```

Start with a real comparison set, not a hand-picked winner. At minimum compare New York/Brooklyn, Los Angeles, Chicago, Atlanta, and one additional U.S. metro that research justifies. The engine may eliminate candidates; do not score cities the team cannot describe or research.

### 2. Public-prior signals

Use only dated, linkable sources. Each signal needs its geography, category/search term, measurement definition, collection date, value or normalized score, and limitations.

Required signal families:

| Family | What it answers | Examples of acceptable inputs |
| --- | --- | --- |
| Search/category intent | Is there discoverable interest around the exact problem, silhouette, product category, or styling language? | Google Trends exports/screenshots with exact terms and period; Google Ads Keyword Planner only if account access is authorized; search-console/GA data only if VORG has granted access |
| Buyer and cultural fit | Is the target buyer and style context plausibly concentrated in the metro? | Census/official demographic sources, credible local fashion/culture reporting, cited local retail/event sources |
| Creator/format fit | Can VORG’s specific UGC/founder format be produced and distributed there? | Platform documentation, creator-market research, evidenced creator sourcing map; never follower count alone |
| Comparable mechanism | Which *mechanism* has been used by credible brands, and what is actually transferable? | First-party brand case study, reputable editorial reporting, campaign/event documentation |
| Commerce feasibility | Can the product be sold, shipped, returned, and supported within the intended customer promise? | Shopify, carrier/3PL, customs, tax, and official regulator sources; real quotes later override priors |
| Pop-up feasibility | Is a controlled later event plausible? | Venue/partner availability, permit requirements, insurance/POS/queue research; no assumed footfall revenue |

Google Analytics is not public data. If VORG has no authorized property access, label Google Analytics as unavailable and use public search-demand sources instead. Do not invent GA traffic, conversion, audience, or geographic data.

### 3. Comparable-brand mechanism cards

Research brands VORG can learn from, but never make their revenue, followers, sell-through, or city choice a VORG forecast without a source and a similarity rationale.

The initial comparison set should include these mechanisms:

| Reference | Mechanism worth examining | Boundary |
| --- | --- | --- |
| Corteiz | City participation and exchange/event energy | Do not copy surprise-crowd, unsafe queue, scarcity theatre, or uncontrolled public activation mechanics |
| Madhappy | Products, editorial, community, and physical experience reinforcing one world | Do not assume community language itself creates conversion |
| BÉIS | Founder-led long-form trust and connected Shopify/POS pop-up operations | Do not treat a mature company’s scale as a VORG benchmark |
| Goodfair | Native creator/employee content, Shopify connection, and measured TikTok experimentation | Treat platform case-study results as vendor-reported examples, not expected VORG results |
| FashionZone | Creator freedom and native TikTok-format testing | Require VORG rights, disclosure, claims, and commercial-music controls |

For every card save: source link, date checked, exact observed fact, inferred transferable mechanism, disallowed copy, VORG hypothesis, target content pillar, and a small controlled test. At least one source must be primary or reputable editorial; a brand’s own claim is not independent validation.

Useful starting sources, recheck before relying on them:

- [Corteiz Brooklyn Denim Exchange reporting](https://www.gq.com/story/corteiz-brooklyn-denim-exchange-scene-report)
- [Madhappy’s official brand statement](https://www.madhappy.com/en-ph/pages/about)
- [BÉIS Shopify case study](https://www.shopify.com/case-studies/beis)
- [Goodfair TikTok case study](https://ads.tiktok.com/business/en-US/inspiration/goodfair-466)
- [FashionZone TikTok case study](https://ads.tiktok.com/business/en-US/inspiration/fashionzone-tiktok-success-story)

### 4. Route-to-market and tax/compliance inputs

This is a hard feasibility screen, not an optional legal appendix. Store the source and whether the item is a public prior, a professional review, or real VORG operational proof.

- Merchant/entity and importer-of-record decision.
- U.S. state sales-tax nexus exposure and marketplace-facilitator treatment, reviewed by qualified tax counsel/accountant before sale. The engine must not give tax advice or mark this green from a generic article.
- Cross-border duties, tariffs, HS classifications, country of origin, DDP/DDU decision, carrier/3PL quote, customer price display, shipping promise, and returns/re-import path.
- U.S. textile fibre/origin/responsible-business labels, care-label support, product safety/flammability review, and only evidence-backed material/performance claims.
- Store terms, refunds, customer-support ownership, chargeback exposure, payment currency/FX/refund treatment, privacy, email/SMS consent, and applicable state privacy review.
- UGC/creator agreement, payment/gifting/affiliate terms, usage rights, whitelisting/Spark authorization, material-connection disclosure, claims guardrails, and commercial-music rights.
- Shopify owner, checkout path, event map, pixel/consent configuration, and test purchase/refund.
- TikTok owner, link/Shop decision, attribution model, policy review, and measurement path.
- Pop-up venue/partner, permits, insurance, capacity/queue plan, staffing, POS/inventory reconciliation, accessibility, photo consent, and music licensing. A pop-up has no forecasted sales until measured.
- Canada queue: name cities rather than provinces, maintain GST/HST/QST and provincial considerations, and put Quebec behind French-language, consumer-contract, and tax review.

Starting official surfaces to record and recheck:

- [Shopify duties and import taxes](https://help.shopify.com/en/manual/international/duties-and-import-taxes)
- [CBP import guidance](https://www.help.cbp.gov/s/article/Article-1919?language=en_US)
- [FTC apparel labeling](https://www.ftc.gov/news-events/topics/tools-consumers/apparel-labeling) and [care labels](https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule)
- [FTC disclosure guidance for influencers](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers)
- [TikTok brand/product-service disclosure guidance](https://support.tiktok.com/en/business-and-creator/creator-and-business-accounts/promoting-a-brand-product-or-service) and [commercial-music guidance](https://support.tiktok.com/en/business-and-creator/creator-and-business-accounts/commercial-use-of-music-on-tiktok)

## Scoring Contract

Score the **forecast** and its **confidence** separately. The exact weights below are internal policy and must be versioned and test-covered, not presented as external benchmarks.

### Public-prior opportunity score (100 points)

| Component | Weight | What earns credit |
| --- | ---: | --- |
| Search/category fit | 20 | Dated, reproducible query/interest evidence tied to a VORG SKU, silhouette, styling need, or target buyer — not a generic “fashion” term |
| Buyer and cultural fit | 15 | Source-backed target-buyer/context compatibility and competitive texture |
| Content-distribution fit | 20 | A specific TikTok + founder YouTube + Shopify content loop, creator supply plan, original-content rights path, and measurement design |
| Comparable mechanism fit | 10 | At least three source-backed, non-copyable mechanisms mapped to VORG hypotheses; source count alone earns no score |
| Commerce/fulfilment feasibility | 20 | A realistic route to USD checkout, delivery/returns, duties/tax treatment, support, and product compliance; unresolved legal/tax items cap this component |
| Controlled pop-up feasibility | 5 | A plausible *later* local partner/venue/operations route; zero means “do not schedule a pop-up,” not “market is bad” |
| Product-position fit | 10 | The five active SKUs are mapped to buyer problem, fit/season/story, and source-backed competitive whitespace without unsupported product claims |

Calculate a separate **public-prior confidence** from source recency, directness, geography match, method transparency, and independent-source diversity. A polished deck of unsupported scores must produce low confidence.

### Receipt calibration layer

Receipts update the forecast; they do not have to exist before a provisional winner is selected.

- Reward only deduplicated, dated, first-party VORG receipts with a stored artifact link.
- Weight purchase and checkout behaviour more than product selection, waitlist, RSVP, or content-qualified action.
- Discount country-wide receipts when choosing a metro; city-specific receipts carry more geographic relevance.
- Never let raw views, followers, duplicate screenshots, giveaways, bot-like traffic, or one creator’s unsupported claim create demand proof.
- Use a documented Bayesian-style or explicit weighted update. The code must show: `prior score`, `receipt adjustment`, `posterior score`, `confidence change`, and `what evidence would reverse the ranking`.
- Set an expiry/decay rule for public signals and stale receipts. A 2026 trend snapshot is not timeless truth.

### Rank and decision rules

1. The engine must rank all candidate metros by forecast score **and** confidence.
2. It must select a `provisionalWinner` even when VORG receipts are absent, provided the minimum public-prior research coverage is met.
3. If coverage is inadequate, return `no defensible winner yet` and the precise missing research tasks. Do not select a city through defaults.
4. A “whole U.S.” candidate is invalid; the winner requires a named first metro, even if online targeting is national.
5. Any unresolved red route-to-market issue (e.g., no legal seller/fulfilment path, no duties/returns decision, impossible product compliance) makes the candidate `forecast only` and blocks spend escalation regardless of its opportunity score.
6. No forecast score may write to or inflate Drop OS readiness, manufacturing proof, financial proof, evidence coverage, campaign proof, or sales forecast actuals.

Suggested output type:

```ts
type PositionRecommendation = {
  version: string;
  generatedAt: string;
  provisionalWinner: CandidateResult | null;
  rankedCandidates: CandidateResult[];
  winnerRationale: string[];
  confidenceBand: { low: number; high: number };
  decisionStatus: "research-incomplete" | "forecast-only" | "testable" | "recalibrated";
  redFlags: string[];
  assumptions: string[];
  receiptAdjustments: ReceiptAdjustment[];
  reversalConditions: string[];
  nextActions: NextAction[];
};
```

## Required Winner Plan Output

Once public priors clear the coverage threshold, generate one operator-ready plan:

1. **Position:** one sentence describing the buyer, product tension, cultural world, and why VORG—not a generic streetwear brand—is credible.
2. **U.S. online scope:** national or metro-led, with the reason and the channels that can actually reach it.
3. **First metro:** the forecast winner; include its score, confidence, closest alternative, and conditions that would make the alternative win instead.
4. **SKU sequence:** which Drop 001 item(s) lead content and why; retain `TBD` where vendor/sample/product proof is not real.
5. **Content system:**
   - TikTok: original native short-form discovery and creator assets;
   - founder YouTube: durable product-truth/fit/process library, not a promise of conversion;
   - Shopify: product education, size/fit, email/SMS consent capture, checkout and first-party measurement;
   - UGC: rights-cleared, disclosure-compliant, claim-safe creative with its own outcome receipt;
   - pop-up: later evidence-capture and community event, not assumed sales volume.
6. **90-day learning route:** minimum viable creative tests, market pages, search/creator research, fulfilment/tax decisions, and the exact data that updates the forecast.
7. **Cash policy:** test spend cap, explicit owner, kill rule, and separation from the C$5,000–C$6,000 production ceiling.
8. **Compliance path:** unresolved issues, accountable owner, professional-review needs, and hard stops.

## Blind-Spot Ledger — Must Be Implemented

Show these as explicit controls, with state `unknown`, `researching`, `review required`, `blocked`, or `cleared with evidence`. Do not hide them in a text note.

### Market and prediction blind spots

- Confusing generic U.S. fashion demand with demand for VORG’s exact five-SKU proposition.
- Treating Google Trends/search interest as purchase intent or copying comparable-brand sales results.
- Choosing a city for cultural prestige rather than buyer fit, customer acquisition path, cost, and operational viability.
- Double-counting the same external fact across search, brand, creator, and market scores.
- Treating creator follower count, views, or one viral post as conversion proof.
- Forecasting pop-up revenue before venue, capacity, POS, stock, and RSVP mechanics are real.
- Ignoring seasonality, drop timing, geographic weather, denim/jacket fit, and product-return risk.
- Using a mutable external source without saving collection date, query, geography, and snapshot.

### Commerce, tax, and operations blind spots

- U.S. customs/duties treatment, HS/origin classification, importer-of-record, DDP/DDU choice, carrier/3PL liability, and return/re-import cost.
- USD pricing, FX, payment fees, refunds, chargebacks, discount stacking, and actual contribution margin by SKU.
- State sales-tax nexus, marketplace-facilitator rules, registrations, filing ownership, and thresholds. Require professional tax review rather than a universal rule.
- Textile/care/origin labels, flammability/product-safety requirements, substantiation of material/quality claims, and final-SKU care testing.
- Stock allocation between online and pop-up, size-curve risk, fulfilment SLA, lost parcels, customer-service capacity, and returns reasons.
- Trademark/name clearance, image/music licensing, creator usage/whitelisting rights, affiliate payout records, FTC disclosure, and TikTok commercial-content rules.
- Email/SMS consent, privacy notices, pixels/cookies, state privacy obligations, and measurement consent.
- Pop-up permits, insurance, occupancy/queue safety, accessibility, cash/POS reconciliation, photo consent, security, and music licensing.
- Quebec French-language, consumer-contract, privacy, and tax review before that expansion queue advances.

### Founder and governance blind spots

- Founder content capacity, decision bottlenecks, sample availability, and the difference between “content made” and “content that produced a qualified action.”
- A forecasting model that appears mathematically precise but has no calibration, reversal rule, or audit trail.
- Weights being tuned until the desired city wins.
- An agent accessing paid data, creator accounts, ad accounts, or tax filings without clear authorization.

## Test Requirements

Add tests proving that the engine:

1. can select a provisional winner from sufficiently documented public priors with zero VORG receipts;
2. refuses to select "United States" without a metro;
3. labels an incomplete candidate `research-incomplete`, rather than assigning it a default score;
4. does not give score credit for unlinked facts, generic follower counts, duplicated sources, or unverified comparable sales claims;
5. treats public priors as forecast-only and never lifts Drop OS GO/production status;
6. recalibrates ranking when valid first-party receipts arrive and records exactly why;
7. caps/blocks candidates with unresolved tax, customs, returns, creator-rights, or product-compliance hard stops;
8. produces a human-readable audit trail of sources, assumptions, confidence, and reversal conditions;
9. does not mutate input data or silently change historical forecast runs;
10. passes `git diff --check`, the new unit tests, and the existing relevant Drop OS tests.

## Definition Of Done

Cursor is done only when it delivers:

- a versioned, tested pure engine;
- a source ledger with dates, URLs, source classes, limitations, and no fabricated analytics;
- a comparison of at least five named U.S. metros;
- one clearly marked **provisional winner plan** and its closest alternative;
- a predicted confidence band, assumptions, red flags, and reversal conditions;
- a learning/receipt-ingestion path that can change the recommendation;
- tax, compliance, fulfilment, creator, and pop-up controls visible as gates;
- a concise markdown report that distinguishes Known, Public Priors, Working Assumptions, VORG Receipts, Unresolved, and Next Actions;
- no alteration of the existing Ottawa/Gatineau decision without adding an explicit dated decision-log entry.

## First Cursor Work Order

1. Inventory current VORG SKU facts, finance constraints, existing source registry, and existing forecast assumptions.
2. Research and log public-prior sources for the five-candidate U.S. comparison. Use direct sources wherever possible; preserve search query, geography, and date for mutable search/trend data.
3. Build the pure engine and tests before any dashboard UI.
4. Produce the forecast-only ranking and provisional winner plan.
5. Add the receipt calibration layer and prove, with tests, that it can change a winner without laundering forecast data into real demand.
6. Integrate a clearly labeled read-only prediction panel into Drop OS only after the above passes.
7. Leave a review note listing every professional tax/customs/legal question that requires human advice before VORG sells into the recommended market.

## Next Agent

Do not start with code weights or a preferred city. Start with the source ledger and candidate definitions, then encode only what can be traced. When the engine names a winner, write it as a provisional forecast with its failure conditions—not as a declaration that demand has been proven.
