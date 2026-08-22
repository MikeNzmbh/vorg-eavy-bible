'use strict';

/**
 * VORG Edge Commerce catalog.
 *
 * Source mechanisms are hypotheses for VORG until a linked experiment result
 * exists. This file is immutable reference data; operator outcomes live in
 * state.edgeExperiments and are scored by drop-os-algorithm.js.
 */
(function () {
  const CHECKED_ON = '2026-07-21';
  const CATALOG_VERSION = 'VORG Edge Commerce catalog v1.0';

  const TACTICS = [
    {
      id: 'E01', name: 'Comment Becomes The Ad', lane: 'Creative', evidenceTier: 'C', risk: 'Green', priority: 'now', topFive: true,
      mechanism: 'Turn one real buyer objection into one founder answer and a matching landing-page section.',
      mutation: 'Answer price, fit, difference, delivery, or returns using the physical garment and approved truth.',
      proof: 'Qualified-action rate and cost per qualified action.',
      successThreshold: 'Two assets beat the median qualified-action rate by at least 25%, with ten qualified actions across the sprint.',
      killCondition: 'Stop when attention produces no product action, the page breaks continuity, or a claim is misleading.',
      sourceLabel: 'DTC Midas public thread index', sourceUrl: 'https://threadreaderapp.com/user/DTCMidas'
    },
    {
      id: 'E02', name: 'Personal Story Angle Bank', lane: 'Creative', evidenceTier: 'B', risk: 'Green', priority: 'now',
      mechanism: 'Build stories from researched desire, pain, failed alternatives, objections, and transformation.',
      mutation: 'Use five VORG narratives: origin, failed compromise, sample correction, city original, and refused tradeoff.',
      proof: 'Qualified comments, PDP clicks, opt-ins, and story retention.',
      successThreshold: 'Advance only stories that improve both attention quality and a purchase-proximate action.',
      killCondition: 'Stop when the founder becomes more memorable than the object or the story needs invented facts.',
      sourceLabel: 'DTC Midas public thread index', sourceUrl: 'https://threadreaderapp.com/user/DTCMidas'
    },
    {
      id: 'E03', name: 'Static Concept Factory', lane: 'Creative', evidenceTier: 'B', risk: 'Green', priority: 'now',
      mechanism: 'Separate the customer concept from executions; test three visual/copy variants per concept.',
      mutation: 'Run six concepts across object authority, fit, day-to-night, local arrival, construction, and controlled units.',
      proof: 'Cost per qualified opt-in and outbound click quality by concept.',
      successThreshold: 'Scale only a concept that wins twice.',
      killCondition: 'Stop making variants after three executions show the concept itself is weak.',
      sourceLabel: 'DTC Midas public thread index', sourceUrl: 'https://threadreaderapp.com/user/DTCMidas'
    },
    {
      id: 'E04', name: 'Viral Format Translation', lane: 'Creative', evidenceTier: 'B', risk: 'Yellow', priority: 'test',
      mechanism: 'Translate pacing, tension, camera grammar, and reveal structure into original VORG expression.',
      mutation: 'Question, tactile proof, fit reveal, objection answer, drop action.',
      proof: 'Hook hold, completion, qualified clicks, and opt-ins versus the ordinary edit.',
      successThreshold: 'Advance only when retention and purchase-proximate action both improve.',
      killCondition: 'Stop when resemblance creates copyright, attribution, music, footage, or likeness risk.',
      sourceLabel: 'DTC Midas public thread index', sourceUrl: 'https://threadreaderapp.com/user/DTCMidas'
    },
    {
      id: 'E05', name: 'Organic Winner To Paid', lane: 'Acquisition', evidenceTier: 'A', risk: 'Green', priority: 'now',
      mechanism: 'Promote the exact native organic post that earns real product intent.',
      mutation: 'Spend C$10-C$15 per day for four days behind one qualified organic winner.',
      proof: 'Cost per qualified action, PDP engagement, and add-to-cart when live.',
      successThreshold: 'Stay inside the approved cost per qualified action and preserve on-site intent.',
      killCondition: 'Stop at the spend cap or when cheaper clicks produce worse product intent.',
      sourceLabel: 'CREA Jewelry Spark Ads case', sourceUrl: 'https://ads.tiktok.com/business/en/inspiration/crea-jewelry'
    },
    {
      id: 'E06', name: 'Native 9:16 Reels Cell', lane: 'Acquisition', evidenceTier: 'A', risk: 'Green', priority: 'now',
      mechanism: 'Compare a native 9:16 sound-on safe-zone edit with the closest static or non-native control.',
      mutation: 'Use a 12-20 second object-first cut with captions, tactile audio, and one action.',
      proof: 'Cost per qualified action and landing-page view rate.',
      successThreshold: 'Native creative must improve the decision metric without degrading on-site intent.',
      killCondition: 'Stop when view efficiency fails to translate into product action.',
      sourceLabel: 'Meta Reels ads', sourceUrl: 'https://www.facebook.com/business/ads/facebook-instagram-reels-ads'
    },
    {
      id: 'E07', name: 'Creator Partnership Cluster', lane: 'Acquisition', evidenceTier: 'A', risk: 'Yellow', priority: 'test',
      mechanism: 'Give several aligned small creators one product tension and native creative freedom.',
      mutation: 'Use three Ottawa/Gatineau connectors, one sample rotation, and three distinct contexts.',
      proof: 'Qualified comments, PDP clicks, opt-ins, usage rights, and reusable assets.',
      successThreshold: 'Continue only creators whose intent quality and reusable content justify cost.',
      killCondition: 'Stop when disclosure, permission, or product legibility fails.',
      sourceLabel: 'FashionZone creator partnership case', sourceUrl: 'https://ads.tiktok.com/business/en/inspiration/fashionzone-tiktok-success-story'
    },
    {
      id: 'E08', name: 'Live Ad Radar', lane: 'Intelligence', evidenceTier: 'C', risk: 'Green', priority: 'weekly',
      mechanism: 'Code public ad hooks, proof, format, offer, destination, and active dates.',
      mutation: 'Scan 100 ads weekly and extract ten mechanisms plus three VORG mutations.',
      proof: 'Share of scan-derived concepts that become tests and beat VORG baselines.',
      successThreshold: 'The radar must generate decision-ready concepts, not screenshots.',
      killCondition: 'Remove fields that do not change a test or decision.',
      sourceLabel: 'TikTok Creative Center', sourceUrl: 'https://ads.tiktok.com/business/en-US/tiktok-creative-center'
    },
    {
      id: 'E09', name: 'The Firm Referral Ladder', lane: 'Waitlist', evidenceTier: 'A', risk: 'Yellow', priority: 'now', topFive: true,
      mechanism: 'Give each consented member a unique link and achievable non-inventory reward tiers.',
      mutation: 'Three referrals unlock a dossier; five a fitting; ten a print; twenty an optional portrait.',
      proof: 'Verified referred opt-ins, seed-to-share rate, lead quality, fraud, and reward liability.',
      successThreshold: 'At least 20% of the seed shares and nine verified referred opt-ins arrive from thirty seeded subscribers.',
      killCondition: 'Stop on consent complaints, more than 10% suspected fraud, or reward liability above the cap.',
      sourceLabel: 'Harry\'s prelaunch case', sourceUrl: 'https://tim.blog/2014/07/21/harrys-prelaunchr-email/'
    },
    {
      id: 'E10', name: 'Traveling Firm Jacket', lane: 'Local proof', evidenceTier: 'F', risk: 'Yellow', priority: 'now', topFive: true,
      mechanism: 'Move one credible jacket sample through seven aligned local people in seven days.',
      mutation: 'Each carrier styles it, answers one honest product question, and nominates the next carrier.',
      proof: 'Completed handoffs, product questions, consented assets, fit notes, and waitlist actions.',
      successThreshold: 'Five handoffs, ten qualified questions, three reusable assets, and two purchase-intent statements.',
      killCondition: 'Stop for custody failure, unsafe transfer, non-consent, product invisibility, or material sample damage.',
      sourceLabel: 'VORG frontier hypothesis', sourceUrl: '../launch/campaign-proof-playbook.md'
    },
    {
      id: 'E11', name: 'Controlled Garment Exchange', lane: 'Participation', evidenceTier: 'C', risk: 'Yellow', priority: 'later',
      mechanism: 'Use a capacity-controlled garment exchange with a verified donation, repair, or upcycle path.',
      mutation: 'RSVP, timed arrivals, disclosed capacity, known venue, queue lead, security, and confirmed material destination.',
      proof: 'Qualified RSVPs, attendance, sell-through, content, partner receipt, and incidents.',
      successThreshold: 'Proceed only when venue, partner, terms, security, consent, and capacity are confirmed.',
      killCondition: 'Cancel when it reads as bait, has no material destination, or creates unsafe demand.',
      sourceLabel: 'Corteiz Bolo Exchange coverage', sourceUrl: 'https://www.vogue.com/article/corteiz-clint-and-the-future-of-streetwear'
    },
    {
      id: 'E12', name: 'Permissioned City Clue Trail', lane: 'Local acquisition', evidenceTier: 'C', risk: 'Yellow', priority: 'later',
      mechanism: 'Reveal product details or RSVP actions through approved partner locations and tracked QR links.',
      mutation: 'Known hours, no race, no first-come product prize, permissioned displays, and digital completion.',
      proof: 'Scans, qualified opt-ins, completion, product recall, and partner satisfaction.',
      successThreshold: 'Keep a location when at least 20% of scans convert to qualified intent.',
      killCondition: 'Stop for trespass, litter, unsafe movement, partner concern, or confusing action.',
      sourceLabel: 'Corteiz exchange coverage', sourceUrl: 'https://www.gq.com/story/corteiz-brooklyn-denim-exchange-scene-report'
    },
    {
      id: 'E13', name: 'Pay With Originality', lane: 'Participation', evidenceTier: 'F', risk: 'Yellow', priority: 'now', topFive: true,
      mechanism: 'A short transparent creative act unlocks a guaranteed controlled benefit.',
      mutation: 'Thirty seconds of original work unlocks a portrait, styling conversation, and fitting-priority action.',
      proof: 'Participation, qualified product actions, content permissions, benefit cost, and sentiment.',
      successThreshold: 'Eight completions, 40% qualified action rate, four usable assets, and no unclear-rule report.',
      killCondition: 'Stop for ambiguity, coercion, humiliation, accessibility failure, or product displacement.',
      sourceLabel: 'Endorphins Pay with Your Pace case', sourceUrl: 'https://www.shopify.com/no-en/case-studies/endorphins'
    },
    {
      id: 'E14', name: 'Skill-Shot Store Credit', lane: 'Experience', evidenceTier: 'F', risk: 'Yellow', priority: 'later',
      mechanism: 'A disclosed spend threshold unlocks one low-risk skill attempt for defined credit.',
      mutation: 'Use originality or styling, preserve the original purchase, and provide an accessible alternative.',
      proof: 'Participation, incremental basket, redeemed credit, UGC permission, and queue time.',
      successThreshold: 'The experience must improve purchase value without harming margin or checkout.',
      killCondition: 'Stop for embarrassment, unclear rules, margin exposure, queue damage, or gambling framing.',
      sourceLabel: 'Culture Kings Double or Nothing case', sourceUrl: 'https://www.shopify.com/ie/case-studies/culture-kings-black-friday'
    },
    {
      id: 'E15', name: 'Time-Boxed Demand Window', lane: 'Demand', evidenceTier: 'B', risk: 'Yellow', priority: 'hold',
      mechanism: 'Open a genuine preorder window with a disclosed delivery range and refund terms.',
      mutation: 'Use only after signed quote, tested sample, MOQ, capacity, QC, cash flow, and ship window are verified.',
      proof: 'Paid demand by size, refunds, support load, fulfilment variance, and contribution.',
      successThreshold: 'Orders remain within confirmed capacity and the delivery promise remains conservative.',
      killCondition: 'Do not launch—or pause—when vendor, capacity, delivery, or refund proof fails.',
      sourceLabel: 'Telfar Bag Security Program', sourceUrl: 'https://help.telfar.net/en-US/articles/general-questions-55282'
    },
    {
      id: 'E16', name: 'Batch Restock Release', lane: 'Lifecycle', evidenceTier: 'A', risk: 'Green', priority: 'later',
      mechanism: 'Notify small back-in-stock subscriber batches and widen only while inventory remains.',
      mutation: 'Sequence exact SKU and size subscribers by signup time with accurate sold, held, and available states.',
      proof: 'Batch conversion, time to sell, unsubscribes, complaints, and remaining inventory.',
      successThreshold: 'Widen only while inventory and support capacity remain accurate.',
      killCondition: 'Stop all sends at zero available units or on consent/inventory mismatch.',
      sourceLabel: 'Brava Fabrics lifecycle case', sourceUrl: 'https://www.klaviyo.com/customers/case-studies/brava-fabrics'
    },
    {
      id: 'E17', name: 'Threshold-Backed Demand Guarantee', lane: 'Demand', evidenceTier: 'F', risk: 'Yellow', priority: 'hold',
      mechanism: 'Collect paid preorders for a disclosed second-run threshold and refund automatically if missed.',
      mutation: 'Publish the exact order threshold, deadline, delivery window, and refund date only after vendor confirmation.',
      proof: 'Paid threshold progress, refunds, support load, contribution, and vendor acceptance.',
      successThreshold: 'The exact confirmed threshold is met before the deadline.',
      killCondition: 'Kill and refund at the deadline or whenever delivery/refund capacity becomes uncertain.',
      sourceLabel: 'Competition Bureau guarantee guidance', sourceUrl: 'https://competition-bureau.canada.ca/en/deceptive-marketing-practices/types-deceptive-marketing-practices/misleading-representations-and-deceptive-marketing-practices'
    },
    {
      id: 'E18', name: 'Mystery Styling Bundle', lane: 'Offer', evidenceTier: 'A', risk: 'Yellow', priority: 'adapt',
      mechanism: 'Sell a bounded surprise with category, count, sizing, exclusions, value, returns, and fulfilment disclosed.',
      mutation: 'Use only size-safe approved items and editorial artifacts; never use mystery to bury weak inventory.',
      proof: 'Conversion, contribution, support, disappointment/refund rate, and repeat intent.',
      successThreshold: 'The bundle must protect contribution and improve content or conversion.',
      killCondition: 'Stop when surprise makes sizing, condition, value, or returns ambiguous.',
      sourceLabel: 'Goodfair mystery bundle case', sourceUrl: 'https://ads.tiktok.com/business/en-US/inspiration/goodfair-466'
    },
    {
      id: 'E19', name: 'Founder Delivery Documentary', lane: 'Trust', evidenceTier: 'F', risk: 'Yellow', priority: 'later',
      mechanism: 'Offer the first few local buyers an optional scheduled founder delivery and fit capture.',
      mutation: 'Five Ottawa/Gatineau orders maximum, no surprise visit, content separately consented.',
      proof: 'Acceptance, fit insight, usage permission, referral action, delivery cost, and founder time.',
      successThreshold: 'High-trust evidence is created without delaying ordinary fulfilment.',
      killCondition: 'Stop for privacy, safety, schedule, consent, or unequal-service concern.',
      sourceLabel: 'VORG frontier hypothesis', sourceUrl: '../launch/drop-001-edge-experiments.md'
    },
    {
      id: 'E20', name: 'Pop-Up Proof Engine', lane: 'Conversion', evidenceTier: 'C', risk: 'Yellow', priority: 'now', topFive: true,
      mechanism: 'Make every station convert, teach, or capture evidence, then rehearse failures before launch.',
      mutation: 'Founder table, fit, objection, action, truthful inventory, and next-city stations.',
      proof: 'Qualified-action completion, queues, recall, inventory accuracy, and failure handling.',
      successThreshold: '75% action completion, queues under five minutes, 80% recall, and correct inventory state.',
      killCondition: 'Stop for inventory error, unsafe/inaccessible flow, consent failure, or no checkout contingency.',
      sourceLabel: 'VORG Edge Experiments', sourceUrl: '../launch/drop-001-edge-experiments.md'
    },
    {
      id: 'E21', name: 'Ad-To-Page Continuity', lane: 'Conversion', evidenceTier: 'C', risk: 'Green', priority: 'mandatory',
      mechanism: 'Repeat the ad product, promise, proof, imagery, and action above the fold.',
      mutation: 'Build modular openings for authority, fit, construction, local arrival, and day-to-night styling.',
      proof: 'Landing-page view rate, engagement, scroll to proof, opt-in, and add-to-cart.',
      successThreshold: 'Winning traffic must keep or improve on-site product intent.',
      killCondition: 'Kill mismatched ad/page pairs before adding media spend.',
      sourceLabel: 'VORG conversion hypothesis', sourceUrl: '../research/commerce-intelligence/edge-ledger.md'
    },
    {
      id: 'E22', name: 'Shipping Threshold Test', lane: 'Offer', evidenceTier: 'A', risk: 'Green', priority: 'later',
      mechanism: 'Test one viable free-shipping threshold against contribution per visitor.',
      mutation: 'Calculate from real carrier quotes, packaging, geography, margin, and likely baskets.',
      proof: 'Contribution per visitor, conversion, AOV, units per order, and support impact.',
      successThreshold: 'Contribution per visitor improves without unacceptable conversion damage.',
      killCondition: 'Stop when economics are unquoted, traffic is insufficient, or advertised price is unattainable.',
      sourceLabel: 'Intelligems shipping threshold case', sourceUrl: 'https://www.intelligems.io/resources/customer-stories/testing-your-free-shipping-threshold-can-improve-aov-and-revenue'
    },
    {
      id: 'E23', name: 'Price And Offer Cell', lane: 'Offer', evidenceTier: 'A', risk: 'Yellow', priority: 'later',
      mechanism: 'Test price, bundle, discount, shipping, or returns one variable at a time.',
      mutation: 'Begin with qualitative acceptance against the vendor-backed price floor; A/B only with viable traffic.',
      proof: 'Contribution per visitor, conversion, gross profit, return intent, and confusion.',
      successThreshold: 'Adopt only when contribution improves above the approved price floor.',
      killCondition: 'Stop below the margin floor or when reference-price claims become misleading.',
      sourceLabel: 'Intelligems price testing case', sourceUrl: 'https://www.intelligems.io/resources/blog/getting-scientific-with-pricing'
    },
    {
      id: 'E24', name: 'Size-Safe Complete-Look Bundle', lane: 'Offer', evidenceTier: 'C', risk: 'Green', priority: 'later',
      mechanism: 'Pair a high-fit-risk hero with a low-fit-risk accessory or service benefit.',
      mutation: 'Jacket plus scarf or denim plus fitting/alteration credit after costs are real.',
      proof: 'Attach rate, contribution, returns, and discount-only buying.',
      successThreshold: 'Contribution and product comprehension both improve.',
      killCondition: 'Stop when the bundle obscures value, raises returns, or creates dead stock.',
      sourceLabel: 'VORG offer hypothesis', sourceUrl: '../research/commerce-intelligence/edge-ledger.md'
    },
    {
      id: 'E25', name: 'Fit Proof Relay', lane: 'Conversion', evidenceTier: 'C', risk: 'Green', priority: 'mandatory',
      mechanism: 'Show one SKU on multiple relevant bodies with measurements, worn size, movement, and honest notes.',
      mutation: 'Use five to eight target bodies for each high-risk size architecture.',
      proof: 'Size confidence, guide usage, product questions, exchanges, and returns by fit reason.',
      successThreshold: 'Target buyers can choose a size with consistent guidance.',
      killCondition: 'Stop bulk when fit cannot be explained or the sample fails target bodies.',
      sourceLabel: 'Campaign Proof Playbook', sourceUrl: '../launch/campaign-proof-playbook.md'
    },
    {
      id: 'E26', name: 'Intent-Split Welcome Flow', lane: 'Lifecycle', evidenceTier: 'C', risk: 'Green', priority: 'now',
      mechanism: 'Ask subscribers for product, size, pop-up, city, or founder/process intent and tailor the path.',
      mutation: 'Deliver the promise, product proof, chosen objection answer, and real launch action.',
      proof: 'Consent, preference capture, proof clicks, replies, unsubscribe, and downstream action.',
      successThreshold: 'Segments must change content and improve downstream intent.',
      killCondition: 'Remove inert segments or flows with complaints and high unsubscribes.',
      sourceLabel: 'Brava Fabrics lifecycle case', sourceUrl: 'https://www.klaviyo.com/customers/case-studies/brava-fabrics'
    },
    {
      id: 'E27', name: 'Consent-Safe Recovery Flow', lane: 'Lifecycle', evidenceTier: 'A', risk: 'Yellow', priority: 'later',
      mechanism: 'Recover cart or checkout intent only for people with a documented permission path.',
      mutation: 'One fit reminder, one proof reminder, and one real deadline/inventory update when true.',
      proof: 'Recovered orders, contribution, unsubscribe, complaint, and support contacts.',
      successThreshold: 'Recovery improves contribution without consent or trust damage.',
      killCondition: 'Stop when it depends on abandoned checkout alone as implied consent or generates complaints.',
      sourceLabel: 'CRTC CASL FAQ', sourceUrl: 'https://crtc.gc.ca/eng/com500/faq500.htm'
    },
    {
      id: 'E28', name: 'Review-To-Service-To-Advocacy', lane: 'Lifecycle', evidenceTier: 'A', risk: 'Yellow', priority: 'post-launch',
      mechanism: 'Route dissatisfied customers to service and give genuine advocates an optional share tool.',
      mutation: 'Capture fit, quality, delivery, and expectation match; resolve issues before promotion.',
      proof: 'Response, issues resolved, verified reviews, referrals, repeat purchase, and return reasons.',
      successThreshold: 'Service recovery and genuine advocacy improve without review manipulation.',
      killCondition: 'Stop any suppression, conditioned service, scripted praise, or misleading incentive.',
      sourceLabel: 'Brava Fabrics lifecycle case', sourceUrl: 'https://www.klaviyo.com/customers/case-studies/brava-fabrics'
    },
    {
      id: 'E29', name: 'Post-Purchase Styling Mission', lane: 'Retention', evidenceTier: 'F', risk: 'Yellow', priority: 'post-launch',
      mechanism: 'Give buyers a seven-day styling prompt and publish only separately consented work.',
      mutation: 'One object, two lives: work/day and night/creative, with fit notes.',
      proof: 'Participation, consented assets, product questions, referrals, repeat intent, and moderation cost.',
      successThreshold: 'The product stays central and contributors feel credited.',
      killCondition: 'Stop when pressure, comparison, rights ambiguity, or rewards harm trust.',
      sourceLabel: 'VORG frontier hypothesis', sourceUrl: '../research/commerce-intelligence/edge-ledger.md'
    },
    {
      id: 'E30', name: 'Next-City Signal Market', lane: 'Expansion', evidenceTier: 'C', risk: 'Green', priority: 'post-launch',
      mechanism: 'Pair one verified city vote with consented city signup or later refundable reservation.',
      mutation: 'Compare Montreal, Toronto, Vancouver, and Halifax on verified demand—not likes.',
      proof: 'Unique signups, purchase intent, referral-adjusted growth, cost to serve, and fraud.',
      successThreshold: 'A founder-approved threshold based on event and fulfilment economics is reached.',
      killCondition: 'Never announce a city from a poll or collect money without settled delivery/refund terms.',
      sourceLabel: 'Campaign Proof Playbook', sourceUrl: '../launch/campaign-proof-playbook.md'
    }
  ];

  const SEVEN_DAY_PLANS = {
    X01: ['Rank ten purchase objections', 'Write five truth-checked answers and matching page modules', 'Shoot five object-led answers', 'Publish objections one and two', 'Publish objections three and four', 'Publish objection five and promote only the qualified winner', 'Compare qualified action and decide'],
    X02: ['Approve rules, rewards, consent, and fraud definition', 'Test links, confirmation, progress, and analytics', 'Seed publicly and to up to thirty consented subscribers', 'Publish genuine aggregate progress', 'Demonstrate one reward and one product proof asset', 'Remind only consented participants', 'Audit referrals, liability, lead quality, and complaints'],
    X03: ['Founder handoff and construction context', 'Campus or young-creative context', 'Work or founder context', 'Cafe or studio context', 'Movement and commute context', 'Nightlife or event context', 'Return, inspect, map, and review evidence'],
    X04: ['Write rule, benefit, consent, capacity, and accessibility path', 'Recruit twelve to twenty through public or consented channels', 'Build and rehearse the sixty-minute run of show', 'Shoot benefit example and product context', 'Run one controlled session', 'Deliver portraits and request separate publication permission', 'Measure action, cost, sentiment, and product relevance'],
    X05: ['Draw flow and assign one job to every station', 'Build scripts, size tools, QR paths, and simulation cards', 'Run a tabletop with five injected failures', 'Confirm twelve testers and consent boundaries', 'Run the rehearsal and observe silently', 'Fix the two highest-friction stations', 'Run a six-person verification pass and decide']
  };

  function tactic(id) {
    return TACTICS.find(item => item.id === id);
  }

  function experiment(id, tacticId, overrides) {
    const source = tactic(tacticId);
    const risk = source.risk;
    return {
      id,
      tacticId,
      name: source.name,
      sourceEvidenceTier: source.evidenceTier,
      sourceProvenanceVerified: true,
      risk,
      status: 'planned',
      decision: 'pending',
      owner: '',
      startDate: '',
      endDate: '',
      budgetCap: 0,
      budgetSource: 'TBD',
      actualSpend: 0,
      primaryMetric: source.proof,
      successThreshold: source.successThreshold,
      killCondition: source.killCondition,
      targetQualifiedActions: 0,
      qualifiedActions: 0,
      assetsTarget: 2,
      assetsEarned: 0,
      baseline: '',
      resultSummary: '',
      evidenceUrl: '',
      approvalStatus: risk === 'Green' ? 'not-required' : 'pending',
      approvedBy: '',
      approvedAt: '',
      counselReviewed: false,
      counselReviewedAt: '',
      prerequisites: [],
      sevenDayPlan: SEVEN_DAY_PLANS[id] || [],
      createdAt: '',
      updatedAt: '',
      ...overrides
    };
  }

  const EXPERIMENT_TEMPLATES = [
    experiment('X01', 'E01', {
      owner: 'Founder / campaign lead', budgetCap: 30, budgetSource: 'Paid social / seeding', targetQualifiedActions: 10, assetsTarget: 7,
      prerequisites: [
        { id: 'sample', label: 'Credible sample or final garment in hand', cleared: false },
        { id: 'claims', label: 'Product, fit, price, and timing claims approved', cleared: false },
        { id: 'tracking', label: 'Tracked landing page and consent path live', cleared: false },
        { id: 'objections', label: 'Ten real objections captured and anonymized', cleared: false }
      ]
    }),
    experiment('X02', 'E09', {
      owner: 'CRM / growth owner', budgetCap: 25, budgetSource: 'Website / apps or invitations', targetQualifiedActions: 9, assetsTarget: 3,
      prerequisites: [
        { id: 'consent', label: 'Public waitlist has explicit email and SMS consent choices', cleared: false },
        { id: 'links', label: 'Unique referral links and duplicate handling work', cleared: false },
        { id: 'liability', label: 'Reward liability is capped and deliverable', cleared: false },
        { id: 'rules', label: 'Rules, privacy, eligibility, and verified referral definition are posted', cleared: false }
      ]
    }),
    experiment('X03', 'E10', {
      owner: 'Campaign lead / sample custodian', budgetCap: 35, budgetSource: 'Paid social / seeding', targetQualifiedActions: 12, assetsTarget: 3,
      prerequisites: [
        { id: 'sample', label: 'Wearable jacket sample can survive seven wears', cleared: false },
        { id: 'carriers', label: 'Seven carriers and two backups are confirmed', cleared: false },
        { id: 'custody', label: 'Custody, care, disclosure, rights, transport, and return terms are signed', cleared: false },
        { id: 'tracking', label: 'Unique tracked action exists for every carrier', cleared: false }
      ]
    }),
    experiment('X04', 'E13', {
      owner: 'Event lead / consent lead', budgetCap: 75, budgetSource: 'Pop-up venue / ops', targetQualifiedActions: 4, assetsTarget: 4,
      prerequisites: [
        { id: 'room', label: 'Permissioned accessible room for twelve to twenty people', cleared: false },
        { id: 'terms', label: 'Capacity, completion rule, benefit, privacy, and no-purchase terms posted', cleared: false },
        { id: 'consent', label: 'Attendance, recording, and publication choices are separate', cleared: false },
        { id: 'alternative', label: 'Private and accessible participation alternative exists', cleared: false }
      ]
    }),
    experiment('X05', 'E20', {
      owner: 'Event lead / independent observer', budgetCap: 50, budgetSource: 'Pop-up venue / ops', targetQualifiedActions: 9, assetsTarget: 4,
      prerequisites: [
        { id: 'room', label: 'Draft venue flow or permissioned substitute room exists', cleared: false },
        { id: 'claims', label: 'Credible samples and approved product claims exist', cleared: false },
        { id: 'protocol', label: 'Tracking, consent, size, inventory, and staff protocols are drafted', cleared: false },
        { id: 'testers', label: 'Twelve informed testers and one independent observer are confirmed', cleared: false }
      ]
    })
  ];

  function createExperimentFromTactic(tacticId, suffix) {
    const source = tactic(tacticId);
    if (!source) return null;
    const id = `X-${tacticId}-${suffix || Date.now()}`;
    return experiment(id, tacticId, {
      owner: '',
      prerequisites: [
        { id: 'conditions', label: 'Mechanism conditions and source context reviewed', cleared: false },
        { id: 'path', label: 'Purchase, RSVP, reservation, referral, or consented opt-in path is live', cleared: false },
        { id: 'tracking', label: 'Metric, baseline, evidence capture, and kill authority are assigned', cleared: false },
        { id: 'rights', label: 'Consent, rights, platform, venue, and disclosure controls are cleared', cleared: false }
      ],
      sevenDayPlan: [
        'Confirm objective, owner, conditions, and opposing argument',
        'Build the smallest original VORG execution',
        'Verify tracking, consent, rights, risk, and rollback',
        'Launch the bounded test',
        'Observe the primary metric without changing the threshold',
        'Close the test at its cap or kill condition',
        'Attach evidence and decide adopt, adapt, retest, or reject'
      ]
    });
  }

  window.VorgEdgeCommerce = {
    CHECKED_ON,
    CATALOG_VERSION,
    TACTICS,
    EXPERIMENT_TEMPLATES,
    createExperimentFromTactic
  };
})();
