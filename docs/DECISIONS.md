# Decision Log

Use this file for durable decisions. Add dates, context, and consequences.

## 2026-05-13 - Create VORG-EAVY Bible Repo

Decision:

Create a separate local Git repo for VORG-EAVY strategic documentation at:

`C:\Users\mbaho\OneDrive\Documents\vorg-eavy-bible`

Reason:

The brand Bible should not be mixed into the Atelier app codebase.

Consequence:

Future agents should update this repo for strategic, brand, launch, finance, product, and research decisions. The Atelier app repo remains the technical implementation lane.

## 2026-05-13 - Keep Claims Confidence-Banded

Decision:

Adopt the Atelier repo's artifact-first and confidence-banded pattern for VORG-EAVY strategy docs.

Reason:

The project has several high-uncertainty areas: vendor costs, product-market demand, AI garment reconstruction, and event compliance. Docs should preserve that uncertainty instead of hiding it.

Consequence:

Agents should explicitly label working assumptions, research findings, and verified facts.

## 2026-06-25 - Use Open Online Drop, Not Password-Gated Launch

Decision:

Drop 001 should launch through an open direct-to-consumer online storefront, not a password-gated storefront.

Reason:

The operating model now treats scarcity as controlled inventory, waitlist/SMS preheat, local seeding, pop-up RSVP control, sold-out archive, and next-city demand capture. A password gate would add friction at the moment the campaign needs conversion proof.

Consequence:

Future launch docs should describe the storefront as open at launch. Password-gated language should be removed from active launch assumptions unless a later decision explicitly restores it for a narrow pre-launch preview or private customer-service use case.

## 2026-06-25 - Define Drop Operating System

Decision:

Adopt a staged drop operating system from signal to next-city expansion:

`Signal -> Concept -> Sample -> Campaign Proof -> Production -> Campaign Build -> Open Online Drop -> Pop-Up -> VORG After -> City Expansion`

Reason:

The brand needs a repeatable process that can be explained to the team and investors. Campaign proof is now a formal gate because product quality alone will not create demand.

Consequence:

New product ideas should move through documented stage gates with owners, artifacts, evidence, and kill criteria before production spend.

## 2026-06-25 - Approve Real-Proof Guerrilla Campaign System

Decision:

Campaign tactics may borrow from Red Bull-style visible social proof and Corteiz-style participation, but VORG-EAVY will not use fake consumption, fake crowds, fake sell-through, littering, trespass, or undisclosed paid endorsements.

Reason:

The campaign needs cultural pressure, but fake proof would create brand, legal, venue, and investor risk. The stronger version is real visible adoption: real city sightings, real founder education, real exchanges, real RSVPs, real sell-through, real pop-up proof, and real next-city signups.

Consequence:

Use `launch/campaign-proof-playbook.md` as the approved campaign framework. Any public stunt, exchange, creator payment, venue activation, or donation claim needs founder approval and evidence before launch.

## 2026-07-07 - Correct Drop 001 Founder Product Pick And Budget Cap

Decision:

Replace the older 3-SKU planning simplification with the founder-stated active Drop 001 product set:

- The Firm Jacket
- women's low-rise denim jean
- men's denim jean
- scarf
- women's top / bodysuit

Set the initial inventory / production spend ceiling at C$5,000-C$6,000 max unless the founder explicitly revises it.

Reason:

The prior repo state listed The Firm Jacket, Structured Rib Top / Bodysuit, and Signature Cap as the active September drop. The founder corrected that list on 2026-07-07.

Consequence:

The old 150-unit / C$20,550 revenue model is superseded for purchase decisions. Finance, launch, product, and handoff docs must treat units, prices, landed COGS, and revenue as TBD until vendor quotes and sample evidence rebuild the plan.

## 2026-07-21 - Move Drop 001 To A Conditional Early-November Window

Decision:

Use November 5-12, 2026 as the working Drop 001 launch window. October is not the active plan unless landed quotes, approved pre-production samples, verified campaign proof, and a vendor-backed inbound and QC buffer clear early enough.

Reason:

The earlier September target and the unverified October option did not leave a defensible path for separate women's and men's denim fitting, jacket and top sample approval, demand proof, bulk production, inbound control, real product photography, and ecommerce QA. A public date must not outrank manufacturing and demand evidence.

Consequence:

The date remains conditional and should not be publicly announced until the production and inbound gates clear. Use `launch/fall-drop-launch-decision-report.md` and its generated PDF for the corrected proof-buy, cash, conversion, and launch-gate model. Delay rather than compress sample, proof, QC, or customer-truth requirements.

## 2026-08-01 - Remove The Firm Jacket Cuff Component

Decision:

The Firm Jacket keeps its black leather collar but has no separate cuff component. The quilted sleeve continues straight to the wrist at its full opening circumference and ends in an approximately 3 cm self-fabric turnback with precise parallel topstitching.

Explicitly exclude rib, leather cuff bands, elastic, gussets, snaps, zippers, gathering, tapering, narrowing, and wrist cinching.

Reason:

The founder selected a cleaner, more continuous sleeve line and rejected both the original rib cuff and the interim leather-band interpretation.

Consequence:

VE-FJ-001 v0.2 visuals and supplier controls must show the continuous sleeve end. The factory must measure the finished opening and mirror the sleeve-end macro photo before approval. Any cuff component or inward shaping is a design failure, not an acceptable supplier interpretation.

## 2026-08-19 - Named Paid Ads As A Bounded Drop 001 Channel

Decision:

VORG will buy ads for Drop 001. Paid traffic is an intended acquisition path. It replaces the unnamed “other ecommerce” hole only as a named Ottawa/Gatineau channel with an owner, mechanism, cap, landing, and receipt path into Edge Lab and Forecast Lab.

Do not build an autonomous media-buyer skill or autopilot spender. Forecast Lab and Drop OS readiness cannot authorize spend. Drop OS TEST allows a small paid content proof from non-inventory launch cash with founder action-time approval. Large campaigns stay blocked until campaign receipts exist. Production / inventory spend remains C$5,000–C$6,000.

85% sell-through of 126 units remains the goal, not the current modeled tail probability. Agents must not fake observed purchases to raise P(85%).

Reason:

Unnamed sessions were not an acquisition plan. Founder-directed ads with a cap and measurement path are. Autopilot spend would treat a weak conversion prior as ROAS truth.

Consequence:

Use `launch/drop-001-traffic-channel-plan.md` as the live session composition (980 waitlist + 330 connector + 850 named paid + 135 pop-up visitors). Sales Forecast v1.1 may Bayesian-update the planning prior from real session and purchase counts. CAC stays unknown until those counts exist.

Practice fill for empty CPC/CTR/CVR fields may use free public sources in `research/commerce-intelligence/ads-public-priors/`. Those practice numbers set cash kill rules only. They are not VORG evidence and must not feed an unattended media-buyer agent.

## 2026-08-22 - Test, Do Not Yet Adopt, A U.S.-First Shopify And TikTok Thesis

Decision:

Record the founder-directed U.S.-first thesis for formal testing: Shopify and TikTok as the primary commercial route, supported by disclosed UGC, founder-led YouTube and TikTok content, and later controlled physical pop-ups. Ontario, Quebec, Vancouver, and Halifax form the secondary Canadian expansion queue.

Status:

The proposal fails the current Drop OS gate and is **not yet an approved replacement** for the active Ottawa/Gatineau-first launch source of truth.

Reason:

The plan names a country and channels but not a U.S. wedge, demand receipt, USD economics, cross-border fulfilment/returns/duties treatment, compliant creator operating model, Shopify/TikTok attribution route, or a permitted pop-up city. Existing Drop 001 traffic and conversion planning are Ottawa/Gatineau assumptions, not transferable U.S. evidence.

Consequence:

Use `strategy/us-first-gtm-stress-test-2026-08-22.md` and the v1.3 Primary-market gate in Drop OS. The plan is proof-build only: no bulk, broad paid-media, venue-deposit, or public launch-readiness authorization until the market-entry controls and existing production gates clear.

Follow-on (same day):

- Prediction engine v1 + source ledger landed under `research/market-positioning/` and `site/src/market-positioning-prediction.ts`. Provisional forecast winner is New York/Brooklyn (**forecast-only**).
- Cross-border/USD gate opened as a blocked decision artifact: `strategy/us-first-cross-border-usd-gate-2026-08-22.md`.
- Later same day: founder authorized alternating the launch wedge (see next entry). The earlier “do not replace Ottawa/Gatineau” posture in this entry is superseded by that authorization for **direction**, not for production/spend clearance.

## 2026-08-22 - Authorize Alternating The Launch Wedge To The Highest-Gain Market Route

Decision:

The founder authorizes replacing/alternating the locked Ottawa/Gatineau-first wedge in favor of the **highest-gain market route**. As of this date, that route is the U.S.-first track with provisional forecast metro **New York / Brooklyn** from `research/market-positioning/forecast-report-2026-08-22.md`.

Status:

**Authorized direction change.** Still **gated** by existing market-entry hard stops (DDP vs U.S. 3PL + USD contribution sheet, tax/nexus review, textile/care/flammability path, creator rights/disclosure, and related controls in `research/market-positioning/route-to-market-gates.json` and `strategy/us-first-cross-border-usd-gate-2026-08-22.md`). This is **not** a claim that U.S. demand is proven. Drop OS production/spend authorization, bulk, venue deposits, and broad paid media remain blocked until gates clear. The C$5,000–C$6,000 production ceiling is unchanged.

Reason:

Founder direction (2026-08-22): do not keep buying the Ottawa/Gatineau Bible wedge as locked; it is fine to alternate it for higher gain. The prediction engine’s provisional winner is Brooklyn on public priors only.

Consequence:

- Canonical wedge language becomes: **highest-gain market route, currently U.S./Brooklyn forecast track, pending hard-stop gates**.
- Ottawa/Gatineau remains the **Canadian fallback / parallel proof option**, not the locked first wedge.
- Rebuild U.S. traffic/channel plans before transferring Ottawa session arithmetic.
- Agents must not treat this decision as Drop OS GO or inventory authorization.
