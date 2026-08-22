# VORG Edge Commerce Lab

Checked: 2026-07-25

## Decision Supported

Turn books, operator posts, live ads, storefronts, email/SMS flows, launches, and physical activations into controlled VORG-EAVY experiments for Drop 001.

This is not a swipe file and not a promise that tactics from larger brands will transfer. It is a decision system:

```text
Permitted source -> atomic claim -> mechanism -> conditions -> VORG mutation
-> experiment -> evidence -> adopt / adapt / reject
```

The lab should make VORG-EAVY more inventive without letting anecdotes, vanity metrics, or guru confidence decide how a C$5,000-C$6,000 production budget is used.

The companion [`public-data-model/`](public-data-model/) trains and evaluates a licensed public-data challenger for Forecast Lab. It transfers uncertainty strength only, contributes zero VORG proof, and rejects external base rates or basket sizes that do not match the launch context.

The companion [`ads-public-priors/`](ads-public-priors/) cites free WordStream apparel traffic CPC/CTR and IRP fashion session conversion so the paid channel can be practiced for cash fit. Those numbers stay practice priors. They do not authorize ads or feed a media-buyer bot.

## Current Truth

Known:

- Drop 001 has a conditional November 5-12, 2026 working window in Ottawa/Gatineau; October is viable only if vendor-backed production, inbound, QC, and campaign-proof gates clear early enough.
- The launch is an open DTC storefront plus one controlled day-to-night pop-up.
- The founder-stated product set is The Firm Jacket, women's low-rise denim jean, men's denim jean, scarf, and women's top/bodysuit.
- Production/inventory spend is capped at C$5,000-C$6,000 unless the founder changes it.
- Paid social and seeding currently have a C$450 working budget.
- VORG-EAVY has not yet proven demand, pricing, or repeatable acquisition economics.

Working assumption:

- Credible samples will exist early enough to run product and campaign proof before bulk-production and launch gates.

Open:

- Final unit economics, price architecture, sample readiness, vendor lead times, venue, and exact launch date.

## Lab Architecture

| Layer | Share of research effort | Job |
| --- | ---: | --- |
| Durable knowledge | 15% | Extract mechanisms from books, research, and long-form operator material |
| Live Edge Radar | 35% | Observe active ads, pages, offers, flows, drops, and activations |
| Tactic Forge | 20% | Recombine mechanisms into VORG-native ideas |
| VORG Proof Lab | 20% | Run small, reversible tests with conversion paths |
| Decision Memory | 10% | Record wins, losses, contradictions, and conditions |

This is an attention allocation, not a spending allocation. Completely unproven wildcard tests should receive no more than 10% of launch marketing resources until they earn proof.

## Evidence Labels

| Tier | Meaning | Allowed conclusion |
| --- | --- | --- |
| A | Quantified first-party, platform, or vendor case with a described comparison or result | Strong reason to test; still not independently audited and not proof of transfer |
| B | Brand/operator documents the mechanism and claims an outcome | Useful directional evidence; reproduce only the mechanism |
| C | Credible observation, recurring live pattern, or internal principle without causal proof | Hypothesis generator |
| F | Frontier VORG hypothesis | Cheap, reversible test only |

Platform and vendor case studies must always be labelled `vendor-reported`. Operator revenue/spend claims must always be labelled `operator-reported`. Neither is treated as audited truth.

## Tactic Admission Rule

A tactic enters the active queue only if it has:

1. One primary business objective.
2. A direct purchase, reservation, RSVP, referral, or consented opt-in path.
3. At least two reusable content outputs.
4. One decision-grade data signal.
5. A numeric success threshold.
6. A kill condition.
7. A named owner and execution window.
8. A risk rating and required approvals.

Attention without a path or decision is entertainment, not growth.

## Weekly Operating Cadence

Use AI for classification, comparison, transcription of lawfully accessed material, and first-draft hypotheses. A human approves interpretations, public claims, outreach, spending, and launch decisions.

Weekly scan target:

- 100 live ads across Meta Ad Library and TikTok Creative Center.
- 20 landing pages, PDPs, carts, and offer paths.
- 10 consented email/SMS sequences received directly by the team.
- 5 unusual launches, retail experiences, or city activations.
- 50 public operator posts from the monitored roster.
- 10 atomic tactics extracted.
- 3 VORG mutations forged.
- 1-2 tests launched only when their prerequisites are real.

Friday decision review:

```text
What moved a purchase-proximate signal?
What only produced vanity attention?
What condition made the result possible?
What should VORG adopt, adapt, reject, or retest?
```

## Ingestion Rules

### Books And Courses

- Ingest full text only when it is public domain, supplied by the founder, purchased, licensed, or otherwise lawfully accessible.
- Store atomic notes and citations, not unauthorized copies of protected works.
- Record edition, chapter/page or module, acquisition right, date processed, and exact claim.
- Do not use pirated books, course rips, paywall bypasses, or copied private communities.

### X And Other Operator Platforms

- Prefer official APIs, creator-provided exports, public pages that permit access, newsletters, podcasts, and author-controlled archives.
- For DTC Midas, use `from:DTCMidas` with X full-archive search when that access is purchased; the normal user timeline is limited to the most recent 3,200 posts. Deleted, protected, or unavailable posts cannot be recovered legitimately.
- Do not automate login-gated scraping, evade rate limits, bypass access controls, or impersonate users.
- Save the post URL, publication date, capture date, claim, context, and any stated spend/revenue scale.

Official X references: [timeline limits](https://docs.x.com/x-api/posts/timelines/introduction), [full-archive quickstart](https://docs.x.com/x-api/posts/search/quickstart/full-archive-search), and [full-archive search](https://docs.x.com/x-api/posts/search-all-posts).

### Live Commerce Evidence

- Capture the public URL, date, market, device, offer, price, shipping promise, creative format, and landing-page destination.
- Use Meta Ad Library and TikTok Creative Center as observation tools, not proof that an ad is profitable.
- Subscribe to flows using team-owned addresses and genuine consent. Do not harvest customer or employee addresses.

## Atomic Claim Schema

Each claim should use this record:

```yaml
claim_id: EC-YYYY-NNN
source_type: book | operator | platform | brand | storefront | customer_evidence
source_url_or_citation:
checked_on:
rights_basis: public_domain | owned | licensed | public_permitted
verbatim_excerpt: optional_and_short
claim:
mechanism:
reported_scale:
conditions:
evidence_tier: A | B | C | F
confidence: 0-100
vorg_mutation:
funnel_stage:
metric:
success_threshold:
kill_condition:
risk: Green | Yellow | Orange | Red
status: inbox | test | adopted | adapted | rejected
```

## Seed Source Portfolio

### Durable Books

Acquire protected books lawfully before full-text processing.

| Source | Lens | Rights route |
| --- | --- | --- |
| [Scientific Advertising](https://www.loc.gov/item/23009362/) by Claude Hopkins | Specificity, testing, salesmanship in print | Library of Congress identifies this edition as public domain |
| *How Brands Grow* by Byron Sharp | Mental/physical availability and category growth | Purchased or library copy |
| [Influence, New and Expanded](https://books.google.com/books/about/Influence_New_and_Expanded.html?id=4uf8DwAAQBAJ) by Robert Cialdini | Ethical persuasion mechanisms | Purchased or library copy |
| [Obviously Awesome](https://www.aprildunford.com/books) by April Dunford | Positioning and competitive alternatives | Purchased or author-provided material |
| *The Luxury Strategy* by Jean-Noel Kapferer and Vincent Bastien | Luxury codes and controlled distribution | Purchased or library copy |
| *Fashion Business Manual* by Fashionary | Fashion operating system | Purchased copy |
| *Testing Business Ideas* by David Bland and Alex Osterwalder | Experiment design | Purchased or library copy |

### Operator And Practitioner Radar

Do not treat follower count as evidence. Score each source on specificity, conditions disclosed, result quality, repeatability, and conflict of interest.

- [DTC Midas on X](https://x.com/DTCMidas) and [public thread index](https://threadreaderapp.com/user/DTCMidas): creative research, statics, storytelling, production systems, ad/account structure.
- [Nik Sharma](https://www.nik.co/) and Moiz Ali/Limited Supply: DTC launch, offer, retention, and operator interviews.
- [Dara Denney](https://www.daradenney.com/), [Savannah Sanchez](https://thesocialsavannah.com/), and [Barry Hott](https://www.buildingadswithbarry.com/): paid-social creative systems.
- [Common Thread Collective](https://commonthreadco.com/): contribution economics and forecasting.
- [Baymard](https://baymard.com/blog) and [Jon MacDonald](https://jonmacdonald.com/): ecommerce UX and conversion research.
- [Chase Dimond](https://www.chasedimond.com/): email/lifecycle practitioner material.

### Platform Truth And Live Pattern Sources

- [Meta Ad Library](https://www.facebook.com/ads/library/): public ad observation.
- [TikTok Creative Center](https://ads.tiktok.com/business/en-US/tiktok-creative-center): trend and creative observation.
- [Shopify](https://www.shopify.com/blog): commerce mechanics and vendor case studies.
- [GA4 ecommerce events](https://support.google.com/analytics/answer/12200568): measurement implementation.
- VORG-owned Shopify, email/SMS, survey, RSVP, POS, and post-purchase data: highest-value internal truth once available.

## Canada Guardrails

- Commercial email and SMS require the relevant consent basis, sender identification, and unsubscribe mechanism. The [CRTC CASL FAQ](https://crtc.gc.ca/eng/com500/faq500.htm) says a referral exception is narrow and applies to one message only when its conditions are met.
- The [Competition Bureau](https://competition-bureau.canada.ca/en/deceptive-marketing-practices/types-deceptive-marketing-practices/misleading-representations-and-deceptive-marketing-practices) identifies false representations, drip pricing, fake discounts, distorted testimonials, fake urgency, and non-genuine guarantees as rule surfaces.
- The [Office of the Privacy Commissioner](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/canadas-anti-spam-legislation/casl-compliance-help-for-businesses/casl_guide/) warns against electronic address harvesting and makes the business accountable for third-party lists.
- Venue permission, contest rules, creator disclosure, image consent, product claims, textile requirements, crowd safety, and Quebec/Ontario consumer requirements must be checked for the exact execution.

This is operating guidance, not legal advice. Counsel review is appropriate before scaling a Yellow or Orange tactic with material legal exposure.

## Growth Risk Decision Memo

- Objective: create disproportionate attention, qualified demand, and reusable proof without risking Drop 001 cash or trust on unverified spectacle.
- Proposed mechanism: permitted research feeds a ledger; a human selects a cheap, reversible test; public claims, outreach, spend, and physical activations pause for approval; results enter decision memory.
- Rule surfaces: source/platform access, copyright, CASL, PIPEDA, deceptive marketing, testimonials/disclosure, contest rules, venue/crowd safety, privacy/image rights, inventory truth, and fulfilment promises.
- Strongest opposing argument: the system could rationalize copying, manufacture artificial scarcity, overfit vendor case studies, or let novelty displace sample, unit-economics, and fulfilment work.
- Best aggressive path: translate mechanisms into original VORG executions; test organically or in controlled rooms; demand a purchase-proximate signal; scale only after repeated evidence.
- Red lines: unauthorized scraping, paywall/access bypass, fake identities, fake reviews, planted proof, fake urgency, invented sell-outs, undisclosed endorsements, unapproved public-space tactics, and auto-messaging people without the required consent basis.
- Supervision: research/classification may run unattended through approved sources; humans approve interpretations, public claims, creator terms, sends, spend, venue actions, inventory states, and refunds at action time.
- Evidence required: source URL/citation, rights basis, timestamp, claim context, approval owner, consent/disclosure records, tracking, spend, outcome, incidents, and final decision.
- Portfolio risk: `Yellow`. Individual low-risk research and owned-data tasks may be `Green`; physical activations, referrals, contests, preorders, and creator usage require their named controls.
- Decision: approve the lab and the five controlled cards; do not approve any public tactic merely because it appears in the ledger.

## Files

- `AUDIT_2026-07-22.md` - current library/algorithm verdict, open-library review, adversarial findings, fixes, verification, and unresolved limits.
- `free-source-registry.json` - canonical registry of 83 lawful free sources and 34 deduplicated atomic claims mapped into the Edge tactic system.
- `FREE_SOURCE_LIBRARY.md` - rights model, source coverage, AI/deduplication rule, refresh cadence, truth boundaries, and maintenance contract.
- `edge-ledger.md` - ranked 30-tactic portfolio with mechanisms, VORG mutations, proof thresholds, kill conditions, and risk controls.
- `../../launch/drop-001-edge-experiments.md` - the first five tactics converted into seven-day experiment cards.

## Next Agent

1. Add legally acquired sources to the claim schema.
2. Fill real baselines before scoring any experiment.
3. Run one experiment card at a time unless there is enough traffic to separate effects.
4. Record results and move each tactic to adopted, adapted, rejected, or retest.
