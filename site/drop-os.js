'use strict';

/* ═══════════════════════════════════════════════════════════════
   VORG-EAVY Drop OS v2 — Drop desk architecture
   Algorithm: VORG Drop OS score v1.3
   Preserves: localStorage, CSV import/export, snapshot, all state
   ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'vorgDropOS.v1';
const MAX_IMAGE_BYTES = 900000;
const SCORE_ENGINE = window.VorgDropAlgorithm;
const SOURCE_LIBRARY = window.VorgCommerceLibrary;
const EDGE_LIBRARY = window.VorgEdgeCommerce;
const FORECAST_ENGINE = window.VorgSalesForecast;
const PUBLIC_COMMERCE_PRIORS = window.VorgPublicCommercePriors;
const SYNTHETIC_FORECAST_FIXTURE = window.VorgSyntheticForecastFixture;

if (!SCORE_ENGINE) {
  throw new Error('Drop OS algorithm bundle is missing. Run npm run build:algorithm in site/.');
}
if (!EDGE_LIBRARY) {
  throw new Error('Edge Commerce catalog is missing. Load edge-commerce-catalog.js before drop-os.js.');
}
if (!SOURCE_LIBRARY) {
  throw new Error('Free commerce library is missing. Run npm run build:library and load edge-commerce-library.js before drop-os.js.');
}
if (!FORECAST_ENGINE) {
  throw new Error('Sales forecast bundle is missing. Run npm run build:forecast in site/.');
}
if (!PUBLIC_COMMERCE_PRIORS) {
  throw new Error('Public commerce prior artifact is missing. Run npm run train:public-priors in site/.');
}
if (!SYNTHETIC_FORECAST_FIXTURE) {
  throw new Error('Synthetic forecast fixture is missing. Load forecast-synthetic-fixture.js before drop-os.js.');
}

/* ─── Default State ─── */
const DEFAULT_FORECAST_STATE = {
  scenario: {
    version: 'drop-001-proof-buy-2026-08-19',
    label: 'Drop 001 · 126-unit proof-buy working scenario',
    source: '../launch/drop-001-sales-forecast-inputs.md',
    truth: 'working-assumption'
  },
  inputs: {
    asOf: '',
    horizonDays: 30,
    plannedOnlineSessions: '2160',
    plannedPopupVisitors: '135',
    plannedOnlineConversionRate: '3.06',
    priorProfile: 'public-transfer-v1',
    unitsPerOrderAssumption: '1.25',
    committedNonInventorySpend: '4700',
    reservations: '0',
    reservationConversionRate: 60,
    trafficEvidenceUrl: '../launch/drop-001-traffic-channel-plan.md',
    trafficEvidenceClass: 'plan',
    funnelEvidenceUrl: '',
    reservationEvidenceUrl: '',
    simulations: 3000,
    seed: 260722,
    observed: {
      sessions: '',
      productViews: '',
      addsToCart: '',
      checkouts: '',
      purchases: '',
      unitsPurchased: '',
      refunds: '',
      popupVisitors: '',
      popupPurchases: ''
    },
    productOverrides: {
      'sku-jacket': { inventory: '12', price: '249', landedCogs: '85', weight: '12', sizeInventory: '' },
      'sku-womens-denim': { inventory: '24', price: '128', landedCogs: '38', weight: '24', sizeInventory: '' },
      'sku-mens-denim': { inventory: '20', price: '128', landedCogs: '38', weight: '20', sizeInventory: '' },
      'sku-scarf': { inventory: '40', price: '35', landedCogs: '12', weight: '40', sizeInventory: '' },
      'sku-womens-top-bodysuit': { inventory: '30', price: '68', landedCogs: '18', weight: '30', sizeInventory: '' }
    }
  },
  snapshots: []
};

const DEFAULT_STATE = {
  activeWorkspace: 'command',
  activeStageId: 'campaign-proof',
  activeProductId: 'sku-jacket',
  activeProduct: 0,
  eventsTab: 'popup',
  campaignView: 'experiments',
  libraryMode: 'claims',
  edgeFilters: { search: '', lane: 'all', risk: 'all' },
  libraryFilters: { search: '', lens: 'all', sourceType: 'all', tier: 'all', risk: 'all' },
  helpSeen: false,
  drop: {
    id: '001',
    label: 'Drop 001',
    city: 'Ottawa/Gatineau',
    season: 'FW26',
    target: 'November 5-12, 2026 · conditional',
    productionSpendCap: 6000
  },
  productImages: {},
  productImageMeta: {},
  products: null,
  readinessChecks: {},
  backup: {
    lastSnapshotAt: '',
    dailyReminder: true
  },
  syncMeta: {
    revision: 0,
    updatedAt: null
  },
  postmortem: {
    revenueForecast: '',
    revenueActual: '',
    unitsPlanned: '',
    unitsSold: '',
    marginTarget: '',
    marginActual: '',
    sellThroughPct: '',
    topSku: '',
    campaignHighlight: '',
    cityPull: '',
    verdict: 'pending',
    teamNotes: '',
    revenueTier: 'unresolved',
    revenueProofUrl: '',
    marginTier: 'unresolved',
    marginProofUrl: '',
    sellThroughTier: 'unresolved',
    sellThroughProofUrl: '',
    verifiedBy: '',
    verifiedAt: ''
  },
  forecast: clone(DEFAULT_FORECAST_STATE),
  stress: {
    demand: 64,
    product: 52,
    campaign: 70,
    operations: 46,
    margin: 50,
    evidence: 42,
    risk: 38
  },
  stages: [
    {
      id: 'signal', order: 0, name: 'Signal',
      owner: 'Founder / signal lead', status: 'in progress', gate: 'test', score: 58,
      evidence: '../research/trend-radar-industry-benchmark.md',
      known: 'Trend radar and industry benchmark exist.',
      assumed: 'Ottawa/Gatineau can generate enough local signal for the first wedge.',
      unresolved: 'Final SKU thesis still needs stronger buyer proof.',
      next: 'Lock final SKU thesis.'
    },
    {
      id: 'concept', order: 1, name: 'Concept',
      owner: 'Founder / product lead', status: 'in progress', gate: 'revise', score: 54,
      evidence: '../product/README.md',
      known: 'Drop 001 direction is corrected to jacket, women\'s denim, men\'s denim, scarf, and women\'s top/bodysuit.',
      assumed: 'The collection can balance access, polish, and local story.',
      unresolved: 'Unit split, pricing, and landed COGS still need vendor proof.',
      next: 'Rebuild the corrected product set under the C$5k-C$6k cap.'
    },
    {
      id: 'sample', order: 2, name: 'Sample',
      owner: 'Product lead', status: 'not started', gate: 'test', score: 0,
      evidence: '',
      known: 'Tech pack direction is forming.',
      assumed: 'Suppliers can produce a sample that supports the target price.',
      unresolved: 'No approved physical sample yet.',
      next: 'Build tech pack v1 and supplier tracker.'
    },
    {
      id: 'campaign-proof', order: 3, name: 'Campaign Proof',
      owner: 'Campaign lead', status: 'not started', gate: 'test', score: 0,
      evidence: '../launch/campaign-proof-playbook.md',
      known: 'Real-proof campaign mechanics and red lines are documented.',
      assumed: 'Sample content can create trust before production spend.',
      unresolved: 'No sample proof sprint has been shot yet.',
      next: 'Shoot the 7-day sample proof sprint once samples arrive.'
    },
    {
      id: 'production', order: 4, name: 'Production',
      owner: 'Production / finance', status: 'not started', gate: 'test', score: 0,
      evidence: '',
      known: 'Founder-stated product set is jacket, women\'s denim, men\'s denim, scarf, and women\'s top/bodysuit.',
      assumed: 'The unit split can be rebuilt inside the C$5k-C$6k production cap.',
      unresolved: 'No vendor quote or approved production sample yet.',
      next: 'Quote MOQ, landed COGS, and production calendar.'
    },
    {
      id: 'campaign-build', order: 5, name: 'Campaign Build',
      owner: 'Campaign lead', status: 'not started', gate: 'test', score: 0,
      evidence: '../launch/drop-001-campaign-board.md',
      known: 'Campaign board defines the first proof tactics.',
      assumed: 'Founder-led content and city mechanics can carry the campaign.',
      unresolved: 'Trailer, cutdowns, model shoots, and content calendar are not built.',
      next: 'Build trailer and short-form content board.'
    },
    {
      id: 'online-drop', order: 6, name: 'Open Online Drop',
      owner: 'Ecommerce lead', status: 'not started', gate: 'test', score: 0,
      evidence: '../launch/drop-001.md',
      known: 'Launch is open online, not password-gated.',
      assumed: 'Waitlist and release timing can create pressure without blocking access.',
      unresolved: 'Shopify launch state and product pages are not complete.',
      next: 'Build open Shopify launch state.'
    },
    {
      id: 'popup', order: 7, name: 'Pop-Up',
      owner: 'Event lead', status: 'not started', gate: 'test', score: 0,
      evidence: '../ops/popup-blueprint.md',
      known: 'Pop-up must be controlled, indoor, and permissioned.',
      assumed: 'A safe Ottawa/Gatineau venue can carry day-to-night energy.',
      unresolved: 'Venue, staffing, and run-of-show are not confirmed.',
      next: 'Scout approved venue and capacity.'
    },
    {
      id: 'vorg-after', order: 8, name: 'VORG After',
      owner: 'Event / campaign', status: 'not started', gate: 'test', score: 0,
      evidence: '',
      known: 'The party closes content and opens the next-city story.',
      assumed: 'A controlled themed night can produce national expansion signal.',
      unresolved: 'Theme, consent flow, and next-city capture are not defined.',
      next: 'Define VORG After theme and city capture.'
    },
    {
      id: 'postmortem', order: 9, name: 'Postmortem',
      owner: 'Finance / founder', status: 'not started', gate: 'test', score: 0,
      evidence: '',
      known: 'January 2027 is a business-quality gate.',
      assumed: 'Drop data can explain whether to repeat, revise, or scale.',
      unresolved: 'Proof report template still needs final metrics.',
      next: 'Prepare the proof report template.'
    }
  ],
  signals: [
    { id: 'sig-1', item: 'Founder table breakdown questions', city: 'Ottawa/Gatineau', source: 'Comments, saves, and DMs', strength: 62, evidenceUrl: '', action: 'Turn top questions into product-page sections.' },
    { id: 'sig-2', item: 'Montreal next-city pull', city: 'Montreal', source: 'VORG After QR votes', strength: 58, evidenceUrl: '', action: 'Capture city rank after pop-up.' },
    { id: 'sig-3', item: 'Structured fit anxiety', city: 'Ottawa/Gatineau', source: 'Fit proof relay', strength: 46, evidenceUrl: '', action: 'Shoot 5 body types before final production.' }
  ],
  edgeExperiments: clone(EDGE_LIBRARY.EXPERIMENT_TEMPLATES),
  tactics: [
    { id: 'founder-table', name: 'Founder Table', risk: 'Green', status: 'ready', evidenceUrl: '', proof: 'Trust comments, saves, product questions', body: 'Founder explains fit, fabric, construction, corrections, and honest tradeoffs on a table.' },
    { id: 'firm-sightings', name: 'The Firm Sightings', risk: 'Green', status: 'ready', evidenceUrl: '', proof: 'Tagged sightings, DMs, consented street photos', body: 'Seed real samples to local connectors who actually wear the product in the city.' },
    { id: 'city-clue-trail', name: 'City Clue Trail', risk: 'Yellow', status: 'draft', evidenceUrl: '', proof: 'QR scans by location and city waitlist growth', body: 'Permissioned clue cards or displays at partner locations, with no unsafe rush mechanics.' },
    { id: 'exchange', name: 'The Exchange', risk: 'Yellow', status: 'draft', evidenceUrl: '', proof: 'RSVP fill, attendance, exchange receipt, content quality', body: 'Capacity-controlled exchange tied to donation, repair, alteration credit, or priority fitting.' },
    { id: 'hanger-wall', name: 'Empty Hanger Wall', risk: 'Green', status: 'ready', evidenceUrl: '', proof: 'Real inventory movement and size-level sell-through', body: 'Hangers leave the wall only when real units are sold, claimed, or picked up.' }
  ],
  tasks: [
    { id: 'task-1', stageId: 'signal', title: 'Rebuild founder SKU thesis into unit/price model.', owner: 'Founder', done: false },
    { id: 'task-2', stageId: 'concept', title: 'Split corrected product set under C$5k-C$6k cap.', owner: 'Product lead', done: false },
    { id: 'task-3', stageId: 'sample', title: 'Build tech pack v1 and supplier tracker for corrected product set.', owner: 'Product lead', done: false },
    { id: 'task-4', stageId: 'campaign-proof', title: 'Shoot the 7-day sample proof sprint once samples arrive.', owner: 'Campaign lead', done: false },
    { id: 'task-5', stageId: 'production', title: 'Quote MOQ, landed COGS, and production calendar.', owner: 'Production / finance', done: false },
    { id: 'task-6', stageId: 'campaign-build', title: 'Build trailer and short-form content board.', owner: 'Campaign lead', done: false },
    { id: 'task-7', stageId: 'online-drop', title: 'Build open Shopify launch state.', owner: 'Ecommerce lead', done: false },
    { id: 'task-8', stageId: 'popup', title: 'Scout approved venue and capacity.', owner: 'Event lead', done: false },
    { id: 'task-9', stageId: 'vorg-after', title: 'Define VORG After theme and city capture.', owner: 'Event / campaign', done: false },
    { id: 'task-10', stageId: 'postmortem', title: 'Prepare proof report template.', owner: 'Finance / founder', done: false }
  ]
};

const MANUFACTURING_TEMPLATE = {
  vendorName: '',
  quoteRef: '',
  quoteUrl: '',
  moq: '',
  landedCogs: '',
  leadTimeDays: '',
  quoteDate: '',
  sampleStage: 'none',
  sampleProofUrl: '',
  ppApproved: false,
  evidenceTier: 'unresolved'
};

const MARKET_ENTRY_TEMPLATE = {
  primaryMarket: '',
  operatingMarket: '',
  salesCurrency: '',
  fulfillmentModel: '',
  primaryMarketEvidenceUrl: '',
  marketEconomicsEvidenceUrl: '',
  fulfillmentEvidenceUrl: '',
  crossBorderEvidenceUrl: '',
  dutiesAndTaxEvidenceUrl: '',
  shippingEvidenceUrl: '',
  returnsEvidenceUrl: '',
  productComplianceEvidenceUrl: '',
  privacyAndConsentEvidenceUrl: '',
  creatorRightsEvidenceUrl: '',
  popupEnabled: false,
  popupCity: '',
  popupMarket: '',
  popupEvidenceUrl: '',
  channels: [
    { platform: 'Shopify', active: false, owner: '', commerceRoute: '', measurementEvidenceUrl: '', policyEvidenceUrl: '' },
    { platform: 'TikTok', active: false, owner: '', commerceRoute: '', measurementEvidenceUrl: '', policyEvidenceUrl: '' }
  ]
};

const PRODUCT_TEMPLATE = {
  image: 'assets/hero_top.png',
  priceEvidenceUrl: '',
  sampleStatus: 'Not started',
  materialRisk: 'TBD',
  fitRisk: 'TBD',
  marginTarget: '—',
  note: 'Add proof notes after sample review.',
  custom: false
};

const DEFAULT_PRODUCTS = [
  {
    id: 'sku-jacket',
    name: 'The Firm Jacket', units: '', price: 'TBD', proof: 'Hero authority item',
    image: 'assets/hero_jacket.png',
    role: 'The statement piece. Establishes the brand as a credible outerwear voice.',
    note: 'Needs table breakdown, fit proof, and sample correction evidence before production.',
    sampleStatus: 'Awaiting first sample', materialRisk: 'Medium - sourcing unconfirmed',
    fitRisk: 'High - structured fit needs 3+ body types', marginTarget: 'TBD'
  },
  {
    id: 'sku-womens-denim',
    name: 'Women\'s Low-Rise Denim Jean', units: '', price: 'TBD', proof: 'Women\'s core bottom',
    image: '',
    role: 'The women\'s outfit anchor. Defines fit, attitude, and styling with the jacket/top.',
    note: 'Needs rise, wash, measurement spec, and body-type fit proof before production.',
    sampleStatus: 'Awaiting first sample', materialRisk: 'High - denim wash and MOQ unconfirmed',
    fitRisk: 'High - low-rise denim needs careful grading', marginTarget: 'TBD'
  },
  {
    id: 'sku-mens-denim',
    name: 'Men\'s Denim Jean', units: '', price: 'TBD', proof: 'Men\'s core bottom',
    image: '',
    role: 'The men\'s outfit anchor. Must be developed as its own fit block, not a size extension.',
    note: 'Needs fit reference, inseam/rise decision, wash spec, and sample review.',
    sampleStatus: 'Awaiting first sample', materialRisk: 'High - denim wash and MOQ unconfirmed',
    fitRisk: 'High - separate men\'s block required', marginTarget: 'TBD'
  },
  {
    id: 'sku-scarf',
    name: 'Scarf', units: '', price: 'TBD', proof: 'Low-size-risk accessory',
    image: '',
    role: 'The styling signal. Adds brand presence without heavy fit risk.',
    note: 'Needs material, dimensions, finishing, and brand placement decision.',
    sampleStatus: 'Awaiting first sample', materialRisk: 'Medium - material handfeel unconfirmed',
    fitRisk: 'Low - size-flexible accessory', marginTarget: 'TBD'
  },
  {
    id: 'sku-womens-top-bodysuit',
    name: 'Women\'s Top / Bodysuit', units: '', price: 'TBD', proof: 'Women\'s fitted top layer',
    image: 'assets/hero_top.png',
    role: 'The fitted styling anchor. Completes the women\'s look with denim and jacket.',
    note: 'Needs decision between bodysuit, rib top, tee, or long-sleeve after fit proof.',
    sampleStatus: 'Awaiting first sample', materialRisk: 'Medium - fabric path unconfirmed',
    fitRisk: 'High if bodysuit; medium if top/tee', marginTarget: 'TBD'
  }
];

const ALGORITHM_VERSION = SCORE_ENGINE.ALGORITHM_VERSION;

const WORKSPACE_META = {
  command: { crumb: 'Drop desk', heading: 'Drop desk', sub: 'Bag check, blockers, this week\'s run' },
  signals: { crumb: 'Heat radar', heading: 'Heat radar', sub: 'Who\'s talking, saving, waiting' },
  product: { crumb: 'SKU room', heading: 'SKU room', sub: 'Samples, fit drama, hero pics' },
  campaign: { crumb: 'Edge Commerce Lab', heading: 'Edge Commerce Lab', sub: `${SOURCE_LIBRARY.sources.length} free sources · ${SOURCE_LIBRARY.claims.length} claims · 30 plays · evidence before scale` },
  forecast: { crumb: 'Forecast Lab', heading: 'Sales Forecast Lab', sub: 'Demand ranges, stockout risk, frozen calls, calibration' },
  production: { crumb: 'Factory gate', heading: 'Factory gate', sub: 'Quotes, MOQ, COGS, PP sample' },
  launch: { crumb: 'Online drop', heading: 'Online drop', sub: 'Shopify live — open drop, no password' },
  events: { crumb: 'Pop-up & after', heading: 'Pop-up & VORG After', sub: 'The room by day, the party by night' },
  cities: { crumb: 'Next city', heading: 'Next city', sub: 'Where the line travels after the wedge' },
  postmortem: { crumb: 'Debrief', heading: 'Drop debrief', sub: 'What sold, what slapped, what\'s next' },
  data: { crumb: 'Handoff', heading: 'Handoff', sub: 'Backup, export, sync the squad' }
};

const WORKSPACE_PLAYBOOKS = {
  command: {
    title: 'Start here — bag check',
    steps: [
      'Read <strong>Bag check</strong> — GO, TEST, FIX IT, or HOLD on spend.',
      'Peep the <strong>bag lock</strong> banner — what money is off-limits today.',
      'Tap your gate in the timeline → update status, bag check, proof link.',
      'Stack moves in <strong>This week\'s run</strong> so the squad knows what ships.'
    ]
  },
  signals: {
    title: 'Catch the heat',
    steps: [
      'Log real pull: fit DMs, save spikes, waitlist joins, creator buzz, pop-up walk-ins.',
      '0–100 = how hot it feels right now — not a sales forecast.',
      'City scores roll up here → hit <strong>Next city</strong> to see where the line might land.'
    ]
  },
  product: {
    title: 'SKU + sample proof',
    steps: [
      'Use <strong>Add SKU</strong> for new styles — name, units, price, and role tag.',
      'Pick a SKU → upload sample flat, hanger shot, or founder-table still (saved in this browser).',
      'Pair pics with tech packs — paste Drive/repo links in the milestone proof field.',
      'Custom SKUs can be removed with <strong>Remove SKU</strong> if you added them by mistake.'
    ]
  },
  campaign: {
    title: 'Turn tactics into owned proof',
    steps: [
      'Start in <strong>Experiments</strong>: clear prerequisites, name the owner, cap spend, and define the receipt before launch.',
      `Search <strong>Free library</strong> across ${SOURCE_LIBRARY.sources.length} lawful source routes and ${SOURCE_LIBRARY.claims.length} deduplicated claims; AI and guru repetition never count as proof.`,
      'Use the <strong>30-play ledger</strong> as an idea bank; a guru claim contributes zero proof until VORG-EAVY tests it.',
      'Complete every test with evidence and an adopt, adapt, reject, or retest decision. Yellow and Orange plays require action-time approval.',
      '<strong>No bulk production</strong> until the wider Campaign Proof gate clears — edge learning strengthens the call but cannot override factory truth.'
    ]
  },
  forecast: {
    title: 'Forecast without pretending certainty',
    steps: [
      'Enter a traffic plan, event footfall, reservations, inventory, price, and landed COGS. Blank truth stays blank.',
      'Read <strong>P10 / P50 / P90</strong> as a downside, middle, and upside range — never as a promise.',
      'Link analytics or planning receipts to narrow uncertainty, then freeze the call before launch.',
      'After the drop, attach actual revenue and units. Calibration learns across independent drops; repeat snapshots do not manufacture confidence.',
      '<strong>Forecast optimism never unlocks production spend.</strong> The readiness gate remains separate and controls authorization.'
    ]
  },
  production: {
    title: 'Factory + unit economics',
    steps: [
      'Lock vendor quotes, MOQ, landed COGS, and an approved sample before any bulk PO.',
      'No physical proof = desk can\'t show <strong>GO</strong> for production spend.',
      'Export CSV when finance needs a spreadsheet view.'
    ]
  },
  launch: {
    title: 'Shopify goes live',
    steps: [
      'Product pages, size guide, policies, analytics, email/SMS — all ready for a public drop.',
      'Drop 001 is <strong>open</strong> — no password gate. Scarcity = units + timing.',
      'Sold-out flows should capture the next city, not ghost the customer.'
    ]
  },
  events: {
    title: 'Pop-up + VORG After',
    steps: [
      'Toggle day-room checklist vs. night-party checklist.',
      'Venue, capacity, RSVP, consent, run-of-show — non-negotiable for a controlled pop-up.',
      'VORG After should leave with recap content <em>and</em> a next-city vote or waitlist.'
    ]
  },
  cities: {
    title: 'Next-city read',
    steps: [
      'Scores blend every signal in a city — one loud comment doesn\'t pick the next market.',
      'Ottawa/Gatineau is the Drop 001 wedge. Other cities = expansion candidates only.',
      'Log heat in <strong>Heat radar</strong> when Montreal, Toronto, Vancouver, or Halifax pull.'
    ]
  },
  postmortem: {
    title: 'Drop debrief',
    steps: [
      'Run after the January 2027 business-quality gate.',
      'Capture revenue, margin, SKU sell-through, content performance, city pull.',
      'Decide repeat, revise, or scale → open the next drop from <strong>Handoff</strong>.'
    ]
  },
  data: {
    title: 'Handoff + backup',
    steps: [
      '<strong>Export CSV</strong> for spreadsheet trackers and investor updates.',
      '<strong>Copy snapshot</strong> before a new drop or new laptop.',
      '<strong>Import snapshot</strong> to restore a teammate\'s backup.',
      'With <strong>drop-os-config.js</strong>, squad sync pushes to Supabase automatically.'
    ]
  }
};

const ONBOARD_STEPS = [
  {
    title: 'This is the drop desk',
    body: 'Drop OS runs one fashion drop at a time. First read is always the bag check: GO, TEST, FIX IT, or HOLD. Samples, content, Shopify, pop-up — all of it feeds that call.'
  },
  {
    title: '10 gates, one collection',
    body: 'Heat → Concept → Sample → Campaign Proof → Production → Campaign Build → Online Drop → Pop-Up → VORG After → Debrief. Update your gate on the timeline so the squad sees honest progress.'
  },
  {
    title: 'Pick your lane',
    body: 'You don\'t need every tab. Growth experiments live in Edge Commerce Lab. Fit + samples live in SKU room. Factory quotes live in Factory gate. Open your lane — the playbook strip tells you what to do.'
  },
  {
    title: 'Lives on this device + squad sync',
    body: 'Photos stay local until Storage ships. Tracker syncs to Supabase when config is set — still snapshot daily before Drop 002 or a new laptop. Full walkthrough: Help → Full guide.'
  }
];

const STRESS_LABELS = SCORE_ENGINE.STRESS_LABELS;

const PRODUCTION_ITEMS = [
  { label: 'Vendor quotes', note: 'Confirmed quotes from at least two suppliers', filled: false },
  { label: 'MOQ confirmed', note: 'Minimum order quantities align with 150-unit plan', filled: false },
  { label: 'COGS locked', note: 'Landed cost per unit within working model', filled: false },
  { label: 'Sample approved', note: 'Physical sample passes quality and fit review', filled: false },
  { label: 'Size set complete', note: 'Full size run graded and measured', filled: false },
  { label: 'PP sample', note: 'Pre-production sample matches approved standard', filled: false },
  { label: 'QC checklist', note: 'Quality control criteria documented', filled: false },
  { label: 'Compliance / labeling', note: 'Care labels, country of origin, fiber content', filled: false },
  { label: 'Production calendar', note: 'Cut-sew-ship timeline confirmed', filled: false },
  { label: 'Cash exposure mapped', note: 'Total production spend calculated and approved', filled: false }
];

const LAUNCH_ITEMS = [
  { label: 'Product pages live', note: 'All 3 SKUs with photography and copy', filled: false },
  { label: 'No password gate', note: 'Launch is open, not password-protected', filled: false },
  { label: 'Size guide', note: 'Measurement-based guide with fit photos', filled: false },
  { label: 'Policies', note: 'Shipping, returns, exchanges published', filled: false },
  { label: 'Product education', note: 'Fabric, construction, care instructions', filled: false },
  { label: 'Analytics', note: 'Tracking, attribution, and conversion events', filled: false },
  { label: 'Email / SMS', note: 'Waitlist notification and drop announcement ready', filled: false },
  { label: 'Low-stock state', note: 'UI handles < 5 remaining per size', filled: false },
  { label: 'Sold-out state', note: 'Graceful UX with next-city waitlist capture', filled: false },
  { label: 'Next-city waitlist', note: 'Post-purchase or sold-out waitlist for expansion cities', filled: false }
];

const POPUP_ITEMS = [
  { label: 'Venue confirmed', note: 'Indoor, controlled, permissioned space' },
  { label: 'Capacity set', note: 'Maximum safe occupancy documented' },
  { label: 'RSVP system', note: 'Invite and confirmation flow' },
  { label: 'Staffing plan', note: 'Sales, fitting, security, content crew' },
  { label: 'Stock plan', note: 'Units allocated per size per SKU' },
  { label: 'POS ready', note: 'Payment processing tested' },
  { label: 'Fitting flow', note: 'Try-on area setup and mirror placement' },
  { label: 'Content consent', note: 'Photo/video release for all guests' },
  { label: 'Day-to-night run of show', note: 'Full timeline from setup to teardown' }
];

const VORGAFTER_ITEMS = [
  { label: 'Theme defined', note: 'Night concept and visual direction' },
  { label: 'Guest flow', note: 'Entry, experience path, exits' },
  { label: 'Creator list', note: 'Seeded invites for content amplification' },
  { label: 'Recap shots', note: 'Photographer and videographer briefed' },
  { label: 'Next-city prompt', note: 'QR vote or waitlist capture at the event' },
  { label: 'Consent flow', note: 'Photo/video release for party guests' },
  { label: 'Safety / risk controls', note: 'Security, capacity limits, emergency plan' }
];

const CHECKLISTS = {
  production: { label: 'Factory gate', items: PRODUCTION_ITEMS },
  launch: { label: 'Online drop', items: LAUNCH_ITEMS },
  popup: { label: 'Pop-up', items: POPUP_ITEMS },
  vorgafter: { label: 'VORG After', items: VORGAFTER_ITEMS }
};

const CITIES = ['Ottawa/Gatineau', 'Montreal', 'Toronto', 'Vancouver', 'Halifax'];

/* ─── Utilities ─── */
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function qs(s) { return document.querySelector(s); }
function qsa(s) { return Array.from(document.querySelectorAll(s)); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function formatStatus(v) { return v.replace(/-/g, ' '); }
function escapeAttr(v) {
  return String(v ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function formatGateLabel(gate) {
  if (gate === 'approve') return 'GO';
  if (gate === 'test') return 'TEST';
  if (gate === 'revise') return 'FIX IT';
  return 'HOLD';
}

function getStage(id) {
  return state.stages.find(s => s.id === (id || state.activeStageId)) || state.stages[0];
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function checklistItemKey(item) {
  return item.id || slugify(item.label);
}

function getChecklistState(group) {
  if (!state.readinessChecks) state.readinessChecks = {};
  if (!state.readinessChecks[group]) state.readinessChecks[group] = {};
  return state.readinessChecks[group];
}

function isChecklistDone(group, item) {
  const saved = getChecklistState(group)[checklistItemKey(item)];
  return saved ?? Boolean(item.filled);
}

function checklistProgress(group, items) {
  const done = items.filter(item => isChecklistDone(group, item)).length;
  return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
}

function getReadinessRollup() {
  let done = 0;
  let total = 0;
  Object.keys(CHECKLISTS).forEach(group => {
    const progress = checklistProgress(group, CHECKLISTS[group].items);
    done += progress.done;
    total += progress.total;
  });
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function getOperationsEffective() {
  const rollup = getReadinessRollup();
  return Math.round(state.stress.operations * 0.35 + rollup.pct * 0.65);
}

function computeManufacturingTier(mfg) {
  if (!mfg) return 'unresolved';
  if (mfg.ppApproved && mfg.quoteUrl && mfg.landedCogs && mfg.sampleProofUrl) return 'known';
  if (mfg.quoteUrl || mfg.landedCogs || mfg.sampleProofUrl || mfg.vendorName) return 'assumed';
  return 'unresolved';
}

function getManufacturingScore() {
  return SCORE_ENGINE.calculateManufacturingScore(getProducts());
}

function formatEvidenceBadge(tier) {
  if (tier === 'known') return '<span class="evidence-badge known">Known</span>';
  if (tier === 'assumed') return '<span class="evidence-badge assumed">Assumed</span>';
  return '<span class="evidence-badge unresolved">Unresolved</span>';
}

function investorMetric(label, value, tier, proofUrl) {
  const proof = proofUrl ? ` <a href="${proofUrl}" target="_blank" rel="noopener">proof</a>` : '';
  return `<div class="investor-row"><span class="investor-row-label">${label}</span><span class="investor-row-value">${formatEvidenceBadge(tier)} ${value || '—'}${proof}</span></div>`;
}

function getRepoBaseUrl() {
  return (window.DROP_OS_CONFIG?.repoBaseUrl || 'https://github.com/MikeNzmbh/vorg-eavy-bible/blob/main').replace(/\/$/, '');
}

function classifyEvidenceLink(evidence) {
  const raw = String(evidence || '').trim();
  if (!raw) return { kind: 'empty', label: '', href: '' };
  if (/^https?:\/\//i.test(raw)) return { kind: 'url', label: raw, href: raw };
  if (/^(mailto:|tel:)/i.test(raw)) return { kind: 'url', label: raw, href: raw };

  const repoPath = raw.replace(/^(\.\.\/)+/, '').replace(/^\//, '');
  const githubHref = `${getRepoBaseUrl()}/${repoPath}`;
  return { kind: 'repo', label: repoPath, href: githubHref, path: raw };
}

function toggleChecklistItem(group, key) {
  const checklist = CHECKLISTS[group];
  if (!checklist) return;
  const item = checklist.items.find(entry => checklistItemKey(entry) === key);
  if (!item) return;
  const groupState = getChecklistState(group);
  groupState[key] = !isChecklistDone(group, item);
  saveState();
  if (group === 'production') renderProductionReadiness();
  else if (group === 'launch') renderLaunchReadiness();
  else renderEvents();
  if (state.activeWorkspace === 'command') {
    const rollup = getReadinessRollup();
    const el = qs('#cmdReadiness');
    if (el) el.textContent = `${rollup.pct}%`;
    renderCommandCenter();
  }
  refreshIcons();
}

/* ─── Algorithm (Drop OS score v1.3 — proof coverage + market-entry + Edge Lab + hard spend gates) ─── */
function calculateScores() {
  return SCORE_ENGINE.calculateScores({
    stress: state.stress,
    stages: state.stages,
    tactics: state.tactics,
    signals: state.signals,
    operationsEffective: getOperationsEffective(),
    products: getProducts(),
    edgeExperiments: state.edgeExperiments || [],
    marketEntry: state.marketEntry || undefined,
    productionSpendCap: Number(getDrop().productionSpendCap) || SCORE_ENGINE.DEFAULT_PRODUCTION_SPEND_CAP
  });
}

function getNextCitySignal() {
  return SCORE_ENGINE.getNextCitySignal(state.signals, 'Ottawa/Gatineau');
}

function getMarketEntry() {
  const saved = state.marketEntry || {};
  const savedChannels = Array.isArray(saved.channels) ? saved.channels : [];
  return {
    ...clone(MARKET_ENTRY_TEMPLATE),
    ...saved,
    channels: MARKET_ENTRY_TEMPLATE.channels.map(template => ({
      ...template,
      ...(savedChannels.find(channel => String(channel.platform || '').toLowerCase() === template.platform.toLowerCase()) || {})
    }))
  };
}

function decisionText(gate) {
  if (gate === 'approve') return 'Run it — bag is valid';
  if (gate === 'test') return 'Lowkey test first, no bulk yet';
  if (gate === 'revise') return 'Not ready — fix the proof gaps';
  return 'Hard pause — drop needs a reset';
}

function spendGateText(gate) {
  if (gate === 'approve') return 'Bag unlocked — sample runs, media tests, or the PO are fair game';
  if (gate === 'test') return 'Bag locked — run a small proof (content, sample, city test) before big money moves';
  if (gate === 'revise') return 'Bag locked — close proof gaps before factory spend or paid media';
  return 'Bag locked — pause or rebuild before any major spend';
}

/* ─── State ─── */
let state = loadState();

function normalizeProducts(saved) {
  if (!Array.isArray(saved) || !saved.length) return clone(DEFAULT_PRODUCTS);
  return saved.map((p, i) => ({
    ...clone(PRODUCT_TEMPLATE),
    ...p,
    manufacturing: {
      ...clone(MANUFACTURING_TEMPLATE),
      ...(p.manufacturing || {}),
      evidenceTier: p.manufacturing?.evidenceTier || computeManufacturingTier(p.manufacturing)
    },
    id: p.id || `sku-${i}-${Date.now()}`
  }));
}

function getEdgeCatalogTactic(tacticId) {
  return EDGE_LIBRARY.TACTICS.find(tactic => tactic.id === tacticId);
}

function normalizeEdgeExperiment(saved, template = {}) {
  const merged = { ...clone(template), ...(saved || {}) };
  const catalog = getEdgeCatalogTactic(merged.tacticId);
  const templatePrerequisites = Array.isArray(template.prerequisites) ? template.prerequisites : [];
  const savedPrerequisites = Array.isArray(saved?.prerequisites) ? saved.prerequisites : [];
  const prerequisites = templatePrerequisites.map(item => ({
    ...item,
    ...(savedPrerequisites.find(savedItem => savedItem.id === item.id) || {})
  }));
  savedPrerequisites.forEach(item => {
    if (!prerequisites.some(existing => existing.id === item.id)) prerequisites.push({ ...item });
  });

  return {
    ...merged,
    name: catalog?.name || merged.name || 'Untitled experiment',
    sourceEvidenceTier: catalog?.evidenceTier || 'F',
    sourceProvenanceVerified: Boolean(catalog),
    risk: catalog?.risk || 'Orange',
    status: merged.status || 'planned',
    decision: merged.decision || 'pending',
    approvalStatus: catalog?.risk === 'Green'
      ? 'not-required'
      : (merged.approvalStatus || 'pending'),
    prerequisites,
    sevenDayPlan: Array.isArray(merged.sevenDayPlan) ? merged.sevenDayPlan : [],
    createdAt: merged.createdAt || '',
    updatedAt: merged.updatedAt || ''
  };
}

function normalizeEdgeExperiments(saved) {
  const existing = Array.isArray(saved) ? saved : [];
  const normalized = EDGE_LIBRARY.EXPERIMENT_TEMPLATES.map(template => {
    const prior = existing.find(item => item.id === template.id);
    return normalizeEdgeExperiment(prior, template);
  });
  existing.forEach(item => {
    if (!normalized.some(existingItem => existingItem.id === item.id)) {
      normalized.push(normalizeEdgeExperiment(item));
    }
  });
  return normalized;
}

function migrateProductImages(images, products, legacyIndex) {
  if (!images || typeof images !== 'object') return {};
  const out = {};
  Object.entries(images).forEach(([key, val]) => {
    if (/^\d+$/.test(key)) {
      const product = products[Number(key)];
      if (product) out[product.id] = val;
    } else {
      out[key] = val;
    }
  });
  if (!Object.keys(out).length && Number.isFinite(legacyIndex) && products[legacyIndex]) {
    const legacy = images[legacyIndex] || images[String(legacyIndex)];
    if (legacy) out[products[legacyIndex].id] = legacy;
  }
  return out;
}

function resolveActiveProductId(parsed, products) {
  if (parsed.activeProductId && products.some(p => p.id === parsed.activeProductId)) {
    return parsed.activeProductId;
  }
  if (Number.isFinite(parsed.activeProduct) && products[parsed.activeProduct]) {
    return products[parsed.activeProduct].id;
  }
  return products[0]?.id || DEFAULT_PRODUCTS[0].id;
}

function getProducts() {
  return state.products?.length ? state.products : DEFAULT_PRODUCTS;
}

function getForecastProductCatalog(inputs = state.forecast?.inputs) {
  if (inputs?.evidenceMode === 'synthetic') {
    return SYNTHETIC_FORECAST_FIXTURE.input.products.map(product => ({
      id: product.id,
      name: product.name,
      units: product.inventory,
      price: product.price,
      manufacturing: { landedCogs: product.landedCogs }
    }));
  }
  return getProducts();
}

function getProduct(id) {
  return getProducts().find(p => p.id === id) || getProducts()[0];
}

function getActiveProduct() {
  return getProduct(state.activeProductId);
}

function normalizeForecastState(saved) {
  const base = clone(DEFAULT_FORECAST_STATE);
  const savedInput = saved?.inputs || {};
  const hasSavedDemandPlan = ['plannedOnlineSessions', 'plannedPopupVisitors', 'reservations']
    .some(key => String(savedInput[key] ?? '').trim() !== '');
  const hasSavedMerchandise = Object.values(savedInput.productOverrides || {}).some(override => {
    return ['inventory', 'price', 'landedCogs'].some(key => String(override?.[key] ?? '').trim() !== '');
  });
  const input = hasSavedDemandPlan || hasSavedMerchandise ? savedInput : {};
  const productOverrides = { ...base.inputs.productOverrides, ...(input.productOverrides || {}) };
  Object.keys(base.inputs.productOverrides).forEach(productId => {
    productOverrides[productId] = {
      ...base.inputs.productOverrides[productId],
      ...(input.productOverrides?.[productId] || {})
    };
  });
  const snapshots = Array.isArray(saved?.snapshots)
    ? saved.snapshots.filter(snapshot => snapshot?.forecast?.summary?.revenue && snapshot?.forecast?.summary?.soldUnits)
    : [];
  return {
    scenario: { ...base.scenario, ...(saved?.scenario || {}) },
    inputs: {
      ...base.inputs,
      ...input,
      observed: { ...base.inputs.observed, ...(input.observed || {}) },
      productOverrides
    },
    snapshots
  };
}

function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const fresh = clone(DEFAULT_STATE);
      fresh.products = clone(DEFAULT_PRODUCTS);
      fresh.activeProductId = DEFAULT_PRODUCTS[0].id;
      return fresh;
    }
    const parsed = JSON.parse(saved);
    const products = normalizeProducts(parsed.products || clone(DEFAULT_PRODUCTS));
    return {
      ...clone(DEFAULT_STATE), ...parsed,
      products,
      edgeExperiments: normalizeEdgeExperiments(parsed.edgeExperiments),
      drop: { ...clone(DEFAULT_STATE).drop, ...(parsed.drop || {}) },
      edgeFilters: { ...clone(DEFAULT_STATE).edgeFilters, ...(parsed.edgeFilters || {}) },
      libraryFilters: { ...clone(DEFAULT_STATE).libraryFilters, ...(parsed.libraryFilters || {}) },
      activeProductId: resolveActiveProductId(parsed, products),
      readinessChecks: { ...(parsed.readinessChecks || {}) },
      backup: { ...clone(DEFAULT_STATE).backup, ...(parsed.backup || {}) },
      syncMeta: { ...clone(DEFAULT_STATE).syncMeta, ...(parsed.syncMeta || {}) },
      postmortem: { ...clone(DEFAULT_STATE).postmortem, ...(parsed.postmortem || {}) },
      forecast: normalizeForecastState(parsed.forecast),
      productImageMeta: { ...(parsed.productImageMeta || {}) },
      productImages: migrateProductImages(parsed.productImages, products, parsed.activeProduct),
      stress: { ...clone(DEFAULT_STATE).stress, ...(parsed.stress || {}) }
    };
  } catch (e) {
    console.warn('Could not load saved Drop OS state.', e);
    const fresh = clone(DEFAULT_STATE);
    fresh.products = clone(DEFAULT_PRODUCTS);
    fresh.activeProductId = DEFAULT_PRODUCTS[0].id;
    return fresh;
  }
}

function saveState() {
  if (!state.syncMeta) state.syncMeta = { revision: 0, updatedAt: null };
  state.syncMeta.updatedAt = new Date().toISOString();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (window.DropOSSync?.schedulePush) window.DropOSSync.schedulePush(state);
}

/* ─── Workspace Navigation ─── */
function switchWorkspace(id) {
  state.activeWorkspace = id;
  saveState();

  qsa('.ws').forEach(ws => ws.classList.remove('active'));
  const target = qs(`#ws-${id}`);
  if (target) target.classList.add('active');

  qsa('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.workspace === id);
  });

  const meta = WORKSPACE_META[id] || WORKSPACE_META.command;
  const titleEl = qs('#topBarTitle');
  const headingEl = qs('#topBarHeading');
  const subEl = qs('#topBarSub');
  if (titleEl) titleEl.textContent = meta.crumb;
  if (headingEl) headingEl.textContent = meta.heading;
  if (subEl) subEl.textContent = meta.sub || '';

  updateDropMetaUI();
  renderPlaybook();
  renderActiveWorkspace();
  refreshIcons();
}

function getDrop() {
  return state.drop || DEFAULT_STATE.drop;
}

function updateDropMetaUI() {
  const drop = getDrop();
  const label = drop.label || `Drop ${drop.id}`;
  const meta = `${drop.city} · ${drop.season}`;
  const crumb = qs('#breadcrumbDrop');
  const sideLabel = qs('#sidebarDropLabel');
  const sideMeta = qs('#sidebarDropMeta');
  if (crumb) crumb.textContent = label;
  if (sideLabel) sideLabel.textContent = label;
  if (sideMeta) sideMeta.textContent = meta;
  document.title = `${label} — VORG-EAVY Drop OS`;
}

function applyGateVisuals(gate) {
  const gateClass = `gate-${gate}`;
  ['#cmdGateResult', '#kpiDecision'].forEach(sel => {
    const el = qs(sel);
    if (!el) return;
    el.classList.remove('gate-approve', 'gate-test', 'gate-revise', 'gate-kill');
    el.classList.add(gateClass);
  });
}

function renderPlaybook() {
  const wrap = qs('#workspacePlaybook');
  if (!wrap) return;
  const pb = WORKSPACE_PLAYBOOKS[state.activeWorkspace];
  if (!pb) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  wrap.innerHTML = `
    <div class="playbook-inner">
      <div class="playbook-title"><i data-lucide="map"></i><strong>${pb.title}</strong></div>
      <ol class="playbook-steps">${pb.steps.map(s => `<li>${s}</li>`).join('')}</ol>
    </div>
  `;
}

function getProductImage(productId) {
  const product = getProduct(productId);
  return state.productImageMeta?.[productId]?.url
    || state.productImages?.[productId]
    || product?.image
    || '';
}

function createProduct({ name, units, price, proof, role }) {
  return {
    ...clone(PRODUCT_TEMPLATE),
    id: `sku-${Date.now()}`,
    custom: true,
    name: name.trim(),
    units: clamp(Number(units) || 30, 1, 99999),
    price: (price || 'C$0').trim(),
    proof: proof || 'New SKU',
    role: (role || 'Add role and proof notes for this SKU.').trim()
  };
}

function addProduct(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]')?.value.trim();
  if (!name) return;
  const units = form.querySelector('[name="units"]')?.value;
  const price = form.querySelector('[name="price"]')?.value;
  const proof = form.querySelector('[name="proof"]')?.value;
  const role = form.querySelector('[name="role"]')?.value.trim();
  const product = createProduct({ name, units, price, proof, role });
  if (!state.products?.length) state.products = clone(DEFAULT_PRODUCTS);
  state.products.push(product);
  state.activeProductId = product.id;
  state.editingProductId = product.id;
  saveState();
  renderProductLab();
  refreshIcons();
}

function beginProductEdit(productId) {
  state.editingProductId = productId;
  renderProductLab();
  refreshIcons();
}

function cancelProductEdit() {
  state.editingProductId = null;
  renderProductLab();
  refreshIcons();
}

function saveProductEdit(e, productId) {
  e.preventDefault();
  const product = getProduct(productId);
  if (!product) return;
  const form = e.target;
  const name = form.querySelector('[name="name"]')?.value.trim();
  if (!name) return;
  product.name = name;
  product.units = clamp(Number(form.querySelector('[name="units"]')?.value) || product.units, 1, 99999);
  product.price = (form.querySelector('[name="price"]')?.value || product.price).trim();
  product.priceEvidenceUrl = (form.querySelector('[name="priceEvidenceUrl"]')?.value || '').trim();
  product.proof = (form.querySelector('[name="proof"]')?.value || product.proof).trim();
  product.role = (form.querySelector('[name="role"]')?.value || product.role).trim();
  product.sampleStatus = (form.querySelector('[name="sampleStatus"]')?.value || product.sampleStatus).trim();
  product.materialRisk = (form.querySelector('[name="materialRisk"]')?.value || product.materialRisk).trim();
  product.fitRisk = (form.querySelector('[name="fitRisk"]')?.value || product.fitRisk).trim();
  product.marginTarget = (form.querySelector('[name="marginTarget"]')?.value || product.marginTarget).trim();
  product.note = (form.querySelector('[name="note"]')?.value || product.note).trim();
  state.editingProductId = null;
  saveState();
  renderProductLab();
  refreshIcons();
}

function removeProduct(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product?.custom || products.length <= 1) return;
  if (!window.confirm(`Remove "${product.name}" from this drop?`)) return;
  state.products = products.filter(p => p.id !== productId);
  if (state.productImages) delete state.productImages[productId];
  if (state.productImageMeta?.[productId]) {
    const meta = state.productImageMeta[productId];
    if (meta.path) window.DropOSSync?.deleteSkuImage?.(meta.path).catch(() => {});
    delete state.productImageMeta[productId];
  }
  if (state.activeProductId === productId) {
    state.activeProductId = state.products[0]?.id;
  }
  saveState();
  renderProductLab();
  refreshIcons();
}

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1200;
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        let quality = 0.86;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > MAX_IMAGE_BYTES && quality > 0.45) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        if (dataUrl.length > MAX_IMAGE_BYTES) {
          reject(new Error('Image still too large after compression. Try a smaller file.'));
          return;
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Could not read image.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

async function handleProductImageUpload(file, productId) {
  if (!file || !productId) return;
  try {
    let stored = null;
    if (window.DropOSSync?.uploadSkuImage) {
      stored = await window.DropOSSync.uploadSkuImage(productId, file);
    }
    if (stored?.url) {
      if (!state.productImageMeta) state.productImageMeta = {};
      state.productImageMeta[productId] = stored;
      if (state.productImages) delete state.productImages[productId];
    } else {
      const dataUrl = await compressImageFile(file);
      if (!state.productImages) state.productImages = {};
      state.productImages[productId] = dataUrl;
    }
    saveState();
    renderProductLab();
    refreshIcons();
  } catch (e) {
    window.alert(e.message || 'Upload failed.');
  }
}

async function clearProductImage(productId) {
  const meta = state.productImageMeta?.[productId];
  if (meta?.path && window.DropOSSync?.deleteSkuImage) {
    try { await window.DropOSSync.deleteSkuImage(meta.path); } catch (e) { console.warn(e); }
  }
  if (state.productImageMeta) delete state.productImageMeta[productId];
  if (state.productImages) delete state.productImages[productId];
  saveState();
  renderProductLab();
  refreshIcons();
}

function renderActiveWorkspace() {
  const ws = state.activeWorkspace;
  if (ws === 'command') renderCommandCenter();
  else if (ws === 'signals') renderSignalRadar();
  else if (ws === 'product') renderProductLab();
  else if (ws === 'campaign') renderCampaignProof();
  else if (ws === 'forecast') renderForecastLab();
  else if (ws === 'production') renderProductionReadiness();
  else if (ws === 'launch') renderLaunchReadiness();
  else if (ws === 'events') renderEvents();
  else if (ws === 'cities') renderCityExpansion();
  else if (ws === 'postmortem') renderPostmortem();
  else if (ws === 'data') renderDataExport();
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

/* ═══════════════════════════════════════════════════
   Drop desk
   ═══════════════════════════════════════════════════ */
function renderCommandCenter() {
  const scores = calculateScores();
  const stage = getStage();
  const citySignal = getNextCitySignal();
  const complete = state.stages.filter(s => s.status === 'done').length;

  // Hero
  qs('#cmdGateResult').textContent = formatGateLabel(scores.gate);
  qs('#cmdGateText').textContent = decisionText(scores.gate);
  applyGateVisuals(scores.gate);
  qs('#cmdConfidence').textContent = scores.confidence;
  qs('#cmdCampaignRate').textContent = scores.campaignIndex;
  qs('#cmdConfidenceNote').textContent = `Evidence band ${scores.confidenceBand.low}-${scores.confidenceBand.high} · coverage ${scores.evidenceCoverage}/100`;
  qs('#cmdCampaignNote').textContent = `${formatStatus(scores.campaignBand)} · directional index, not a probability`;

  // Spend gate
  const spendEl = qs('#cmdSpend');
  qs('#cmdSpendText').textContent = scores.spendAuthorization?.summary || spendGateText(scores.gate);
  spendEl.classList.toggle('unlocked', scores.spendAuthorization?.level === 'major-spend');
  spendEl.classList.toggle('testing', scores.spendAuthorization?.level === 'small-test');
  spendEl.classList.toggle('paused', scores.spendAuthorization?.level === 'paused');
  renderBackupNudge();
  renderSyncConflictBanner();

  // Blocker
  qs('#cmdBlockerTitle').textContent = scores.bottleneck;
  qs('#cmdBlockerText').textContent = blockerExplanation(scores);

  // Active stage
  qs('#cmdStageName').textContent = stage.name;
  qs('#cmdStageOwner').textContent = stage.owner;
  qs('#cmdStageStatus').textContent = formatStatus(stage.status);
  qs('#cmdStageNext').textContent = `\u2192 ${stage.next}`;

  // Next 72h tasks
  const urgent = state.tasks.filter(t => !t.done).slice(0, 5);
  const taskListHtml = urgent.length
    ? urgent.map(t => {
        const s = getStage(t.stageId);
        return `<div class="cmd-task-item">
          <button class="task-check" type="button" data-task-done="${t.id}" aria-label="Mark done">○</button>
          <span class="cmd-task-text">${t.title}</span>
          <span class="cmd-task-stage">${s.name}</span>
        </div>`;
      }).join('')
    : '<p class="card-body">Nothing queued — add what the squad should ship this week.</p>';

  qs('#cmdTaskList').innerHTML = taskListHtml + `
    <form id="taskForm" class="task-inline-form">
      <input id="taskTitle" type="text" placeholder="e.g. Book fit relay shoot, send tech pack v1…" required />
      <select id="taskStage" aria-label="Task stage">${state.stages.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select>
      <button class="btn-primary compact" type="submit" aria-label="Add task"><i data-lucide="plus"></i></button>
    </form>
  `;

  qsa('[data-task-done]').forEach(btn => {
    btn.addEventListener('click', () => toggleTask(btn.dataset.taskDone, true));
  });

  // Metrics
  qs('#cmdStageProgress').textContent = `${complete} / ${state.stages.length}`;
  qs('#cmdCitySignal').textContent = citySignal.city;
  qs('#cmdEvidenceFloor').textContent = scores.evidenceFloor;
  qs('#cmdStageMomentum').textContent = scores.stageScore;
  qs('#cmdRiskDrag').textContent = scores.riskDrag;
  const readiness = getReadinessRollup();
  const readinessEl = qs('#cmdReadiness');
  if (readinessEl) readinessEl.textContent = `${readiness.pct}%`;

  // Algorithm cockpit
  renderAlgorithmBreakdown(scores);
  renderSpendAuthorization(scores);
  renderScoreLevers(scores);
  renderStressControls();

  // Decision strip
  qs('#decisionText').textContent = decisionText(scores.gate);
  qs('#weaknessText').textContent = scores.bottleneck;

  // Stage timeline
  renderStageTimeline();
  renderStageDetail();
  renderProofLinksPanel();
  renderSyncStatusPill();
}

function renderSyncStatusPill() {
  const el = qs('#syncStatusPill');
  const authBtn = qs('#authOpenBtn');
  if (!el) return;
  const sync = window.DropOSSync?.getStatus?.() || { mode: 'local' };
  const configured = Boolean(window.DROP_OS_CONFIG?.supabase?.url);

  if (authBtn) {
    authBtn.hidden = !configured;
    authBtn.onclick = () => window.DropOSAuth?.open?.();
  }

  if (!configured) {
    el.hidden = true;
    return;
  }

  el.hidden = false;
  if (sync.conflict) {
    el.className = 'sync-status-pill conflict';
    el.textContent = 'Sync conflict';
    el.title = sync.lastError || 'Pull teammate version or force push from Handoff';
    return;
  }

  if (sync.auth === 'member' && sync.mode === 'cloud') {
    el.className = 'sync-status-pill cloud';
    const when = sync.lastSyncAt
      ? new Date(sync.lastSyncAt).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' })
      : 'live';
    el.textContent = `Cloud · ${when}`;
    el.title = sync.userEmail ? `Signed in as ${sync.userEmail}` : 'Squad sync active';
    return;
  }

  if (sync.auth === 'needs_invite') {
    el.className = 'sync-status-pill local';
    el.textContent = 'Invite needed';
    el.title = 'Sign in, then redeem squad invite';
    return;
  }

  if (sync.mode === 'auth-required' || sync.auth === 'signed_out') {
    el.className = 'sync-status-pill local';
    el.textContent = 'Sign in';
    el.title = 'Squad auth required for cloud sync';
    return;
  }

  el.className = 'sync-status-pill local';
  el.textContent = 'Local only';
  el.title = sync.lastError || 'Supabase not connected';
}

function renderSyncConflictBanner() {
  const el = qs('#syncConflictBanner');
  if (!el) return;
  const sync = window.DropOSSync?.getStatus?.() || {};
  if (!sync.conflict) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.innerHTML = `
    <div>
      <strong>Squad sync conflict</strong>
      <span>Someone else saved newer state. Pull their version or force your copy from Handoff.</span>
    </div>
    <div class="sync-conflict-actions">
      <button class="top-btn outline compact" type="button" id="deskSyncPullBtn">Pull squad</button>
      <button class="top-btn primary compact" type="button" id="deskSyncForceBtn">Use my version</button>
    </div>
  `;
  qs('#deskSyncPullBtn')?.addEventListener('click', async () => {
    await window.DropOSSync?.pullNow?.();
    switchWorkspace('command');
  });
  qs('#deskSyncForceBtn')?.addEventListener('click', async () => {
    if (!window.confirm('Overwrite the cloud row with this browser state?')) return;
    await window.DropOSSync?.pushForce?.();
    switchWorkspace('command');
  });
  refreshIcons();
}

function renderBackupNudge() {
  const el = qs('#backupNudge');
  if (!el) return;
  const backup = state.backup || {};
  const last = backup.lastSnapshotAt ? new Date(backup.lastSnapshotAt) : null;
  const today = new Date().toLocaleDateString('en-CA');
  const backedUpToday = last && last.toLocaleDateString('en-CA') === today;
  if (backedUpToday) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.innerHTML = `
    <i data-lucide="hard-drive-download"></i>
    <div>
      <strong>Daily snapshot due</strong>
      <p>Copy or download a backup before you add SKUs or switch devices.</p>
    </div>
    <button class="top-btn outline compact" type="button" id="deskBackupBtn">Backup lane</button>
  `;
  qs('#deskBackupBtn')?.addEventListener('click', () => switchWorkspace('data'));
}

function blockerExplanation(scores) {
  if (scores.gateReason) return scores.gateReason;
  if (scores.evidenceCoverage < 75) {
    return `Evidence coverage is ${scores.evidenceCoverage}/100. Linked manufacturing, financial, stage, campaign, and signal proof controls the gate.`;
  }
  return `${scores.bottleneck} is the weakest link at ${scores.weakness.value}. Level it up to move the bag check forward.`;
}

function renderAlgorithmBreakdown(scores) {
  if (!scores) scores = calculateScores();
  const versionEl = qs('#cmdAlgorithmVersion');
  if (versionEl) versionEl.textContent = scores.version.replace('VORG Drop OS score ', '');
  qs('#algorithmBreakdown').innerHTML = [
    { label: 'Evidence coverage', value: scores.evidenceCoverage, note: 'Linked/structured proof only' },
    { label: 'Manufacturing truth', value: scores.manufacturingScore, note: 'Quote + COGS + sample + PP' },
    { label: 'Financial proof', value: scores.financialProofScore, note: `${formatStatus(scores.budgetStatus)} · cap C$${scores.productionSpendCap.toLocaleString('en-CA')}` },
    ...(scores.marketEntryRequired ? [{ label: 'Primary-market entry', value: scores.marketEntryScore, note: `${scores.marketEntryEvidenceCoverage}% linked · ${scores.marketEntryViolations.length} controls open` }] : []),
    { label: 'Milestone integrity', value: scores.stageScore, note: `${scores.sequenceViolations} sequence violation${scores.sequenceViolations === 1 ? '' : 's'}` },
    { label: 'Verified demand', value: scores.signalHeat, note: `${scores.verifiedSignals} linked signal${scores.verifiedSignals === 1 ? '' : 's'}` },
    { label: 'Campaign proof', value: scores.tacticScore, note: `${scores.verifiedTactics} approved with evidence` },
    { label: 'Edge experiment proof', value: scores.edgeScore, note: `${scores.edgeValidatedExperiments}/${scores.edgeCompletedExperiments} validated · ${scores.edgeLearningScore} learning` },
    { label: 'Risk tax', value: scores.riskDrag, note: 'Drag on spend call', danger: true }
  ].map(c => `
    <div class="algo-card${c.danger ? ' danger' : ''}">
      <span>${c.label}</span>
      <strong>${c.value}</strong>
      <small>${c.note}</small>
    </div>
  `).join('');
}

function renderSpendAuthorization(scores) {
  const panel = qs('#spendAuthorizationPanel');
  if (!panel) return;
  const spend = scores.spendAuthorization;
  panel.innerHTML = `
    <article class="spend-auth-card">
      <span class="model-label">Spend rule</span>
      <strong>${spend.label}</strong>
      <p>${spend.reason}</p>
    </article>
    <article class="spend-auth-card">
      <span class="model-label">Allowed now</span>
      <ul>${spend.allowed.map(item => `<li>${item}</li>`).join('')}</ul>
      <span class="model-label blocked">Blocked</span>
      <ul>${spend.blocked.map(item => `<li>${item}</li>`).join('')}</ul>
    </article>
  `;
}

function renderScoreLevers(scores) {
  const panel = qs('#scoreLevers');
  if (!panel) return;
  const levers = scores.levers || [];
  panel.innerHTML = `
    <div class="score-levers-head">
      <span class="model-label">What moves the score</span>
      <strong>${levers.length ? 'Top proof moves' : 'No high-impact lever found'}</strong>
    </div>
    ${levers.length ? levers.map(lever => `
      <article class="score-lever-card">
        <div class="score-lever-main">
          <span class="score-lever-owner">${lever.owner}</span>
          <strong>${lever.label}</strong>
          <p>${lever.action}</p>
          <small>${lever.proofNeeded}</small>
        </div>
        <div class="score-lever-math">
          <span>${lever.input}</span>
          <strong>up to +${lever.deltaConfidence}</strong>
          <small>${lever.current} &rarr; ${lever.target} · ${formatGateLabel(lever.projectedGate)}</small>
        </div>
      </article>
    `).join('') : '<p class="card-body">The desk needs new evidence, not slider movement. Add real proof and rerun the gate.</p>'}
  `;
}

function renderStressControls() {
  const wrap = qs('#stressControls');
  const rollup = getReadinessRollup();
  wrap.innerHTML = STRESS_LABELS.map(item => {
    const derivedProduct = item.key === 'product';
    const effective = item.key === 'operations'
      ? getOperationsEffective()
      : derivedProduct ? getManufacturingScore() : state.stress[item.key];
    const hint = item.key === 'operations'
      ? `<small class="slider-hint">Effective ${effective} — 65% checklists (${rollup.pct}%) + 35% slider</small>`
      : derivedProduct
        ? `<small class="slider-hint">Derived from SKU quote, COGS, sample, and PP fields — slider locked</small>`
        : item.key === 'evidence'
          ? `<small class="slider-hint">Context only — linked proof coverage controls approval</small>`
          : '';
    return `
    <div class="slider-row">
      <label for="stress-${item.key}">${item.label}</label>
      <input id="stress-${item.key}" type="range" min="0" max="100" value="${derivedProduct ? effective : state.stress[item.key]}" data-stress-key="${item.key}" ${derivedProduct ? 'disabled' : ''} />
      <output>${effective}</output>
      ${hint}
    </div>
  `;
  }).join('');

  qsa('[data-stress-key]').forEach(input => {
    input.addEventListener('input', e => {
      state.stress[e.target.dataset.stressKey] = Number(e.target.value);
      e.target.nextElementSibling.textContent = e.target.value;
      saveState();
      renderCommandCenter();
    });
  });
}

function renderStageTimeline() {
  qs('#stageTimeline').innerHTML = state.stages.map(s => {
    let cls = 'tl-node';
    if (s.id === state.activeStageId) cls += ' active';
    if (s.status === 'done') cls += ' done';
    else if (s.status === 'in progress') cls += ' in-progress';
    return `<div class="${cls}" data-stage-tl="${s.id}">
      <span class="tl-dot"></span>
      <span class="tl-name">${s.name}</span>
    </div>`;
  }).join('');

  qsa('[data-stage-tl]').forEach(node => {
    node.addEventListener('click', () => {
      state.activeStageId = node.dataset.stageTl;
      saveState();
      renderStageTimeline();
      renderStageDetail();
      refreshIcons();
    });
  });
}

function renderStageDetail() {
  const stage = getStage();
  qs('#stageDetail').innerHTML = `
    <div class="sd-header">
      <div>
        <p class="eyebrow">Milestone ${stage.order}</p>
        <h2>${stage.name}</h2>
        <p>${stage.owner} owns this until the gate is honest and proof is linked.</p>
      </div>
      <span class="badge${stage.gate === 'approve' ? ' solid' : ''}">${formatStatus(stage.gate)}</span>
    </div>

    <div class="sd-controls">
      <div class="field">
        <label for="stageStatus">Status</label>
        <select id="stageStatus">
          ${['not started', 'in progress', 'blocked', 'done'].map(s => `<option ${stage.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="stageGate">Gate result</label>
        <select id="stageGate">
          ${['test', 'revise', 'approve', 'kill'].map(g => `<option ${stage.gate === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="stageScore">Gate score <span id="stageScoreValue">${stage.score}</span></label>
        <input id="stageScore" type="range" min="0" max="100" value="${stage.score}" />
      </div>
    </div>

    <div class="sd-evidence">
      <div class="sd-evidence-card"><h3>Known</h3><p>${stage.known}</p></div>
      <div class="sd-evidence-card"><h3>Assumed</h3><p>${stage.assumed}</p></div>
      <div class="sd-evidence-card"><h3>Unresolved</h3><p>${stage.unresolved}</p></div>
    </div>

    <div class="field evidence-link-field">
      <label for="stageEvidence">Proof link</label>
      <input id="stageEvidence" type="text" value="${stage.evidence || ''}" placeholder="Tech pack, Drive folder, or campaign clip link" />
      <small>Where a teammate can verify this milestone — repo path, Drive, or Loom.</small>
    </div>

    <div class="sd-next">
      <i data-lucide="arrow-up-right"></i>
      <div>
        <span class="sd-next-label">Next action</span>
        <strong>${stage.next}</strong>
      </div>
    </div>
  `;

  qs('#stageStatus').addEventListener('change', e => {
    stage.status = e.target.value;
    saveState();
    renderCommandCenter();
    refreshIcons();
  });
  qs('#stageGate').addEventListener('change', e => {
    stage.gate = e.target.value;
    saveState();
    renderCommandCenter();
    refreshIcons();
  });
  qs('#stageScore').addEventListener('input', e => {
    stage.score = Number(e.target.value);
    qs('#stageScoreValue').textContent = stage.score;
    saveState();
    renderCommandCenter();
  });
  qs('#stageEvidence')?.addEventListener('change', e => {
    stage.evidence = e.target.value.trim();
    saveState();
    renderProofLinksPanel();
    refreshIcons();
  });
}

function renderProofLinksPanel() {
  const panel = qs('#proofLinksPanel');
  if (!panel) return;
  const linked = state.stages.filter(stage => stage.evidence && stage.evidence.trim());
  const missing = state.stages.length - linked.length;

  const rows = linked.length ? linked.map(stage => {
    const link = classifyEvidenceLink(stage.evidence);
    if (link.kind === 'repo') {
      return `
        <div class="proof-link-row repo-path">
          <span>
            <strong>${stage.name}</strong>
            <small>${link.label} · repo path</small>
          </span>
          <div class="proof-link-actions">
            <a class="proof-link-btn" href="${link.href}" target="_blank" rel="noopener" title="Open on GitHub">
              <i data-lucide="github"></i>
            </a>
            <button class="proof-link-btn" type="button" data-copy-proof="${stage.evidence}" title="Copy path">
              <i data-lucide="copy"></i>
            </button>
          </div>
        </div>
      `;
    }
    return `
      <a class="proof-link-row" href="${link.href}" target="_blank" rel="noopener">
        <span>
          <strong>${stage.name}</strong>
          <small>${link.label}</small>
        </span>
        <i data-lucide="external-link"></i>
      </a>
    `;
  }).join('') : `
    <div class="empty-state compact">
      <p><strong>No proof linked yet.</strong> Open a gate below and paste Drive, repo, Loom, tech-pack, quote, or campaign clip links.</p>
    </div>
  `;

  panel.innerHTML = `
    <div class="proof-links-head">
      <div>
        <p class="eyebrow">Proof links</p>
        <h3>Receipts tied to the drop</h3>
        <p>${linked.length} linked · ${missing} missing. Bag check should move only when proof exists.</p>
      </div>
      <span class="badge">${linked.length}/${state.stages.length}</span>
    </div>
    <div class="proof-links-list">${rows}</div>
  `;
}

/* ═══════════════════════════════════════════════════
   Signal Radar
   ═══════════════════════════════════════════════════ */
function renderSignalRadar() {
  renderCityBar();
  renderSignalList();
}

function renderCityBar() {
  const cityScores = SCORE_ENGINE.scoreCitySignals(state.signals, CITIES);

  qs('#signalCityBar').innerHTML = cityScores.map(({ city, score, count, verifiedCount }) => {
    return `<div class="city-bar-item">
      <span class="city-bar-name">${city}</span>
      <span class="city-bar-score">${score}</span>
      <span class="city-bar-count">${verifiedCount}/${count} verified</span>
    </div>`;
  }).join('');
}

function renderSignalList() {
  const sorted = state.signals.slice().sort((a, b) => Number(b.strength) - Number(a.strength));
  qs('#signalList').innerHTML = sorted.length ? sorted.map(sig => `
    <article class="signal-card">
      <div class="signal-card-head">
        <div>
          <h3>${sig.item}</h3>
          <p>${sig.source}</p>
        </div>
        <span class="signal-strength-badge">${sig.strength}</span>
      </div>
      <div class="strength-bar">
        <span class="strength-bar-fill" style="width:${clamp(Number(sig.strength), 0, 100)}%"></span>
      </div>
      <div class="signal-meta">
        <span class="pill">${sig.city}</span>
        <span class="pill">${SCORE_ENGINE.hasEvidenceReference(sig.evidenceUrl) ? 'Verified proof' : 'Unverified — discounted'}</span>
        <span class="pill">${sig.action}</span>
      </div>
    </article>
  `).join('') : `<div class="empty-state">
    <p><strong>No heat logged yet.</strong> Add the first pull you see — fit DMs, TikTok saves, waitlist signups, or pop-up walk-ins. This feeds city scores and drop readiness.</p>
  </div>`;
}

/* ═══════════════════════════════════════════════════
   Product Lab
   ═══════════════════════════════════════════════════ */
function renderProductLab() {
  const products = getProducts();
  const product = getActiveProduct();
  const productId = product.id;
  const imgSrc = getProductImage(productId);
  const hasCustom = Boolean(state.productImages?.[productId] || state.productImageMeta?.[productId]);
  const cloudBacked = Boolean(state.productImageMeta?.[productId]?.storage);
  const sync = window.DropOSSync?.getStatus?.() || {};
  const editing = state.editingProductId === productId;

  qs('#productSkuCount').textContent = `${products.length} SKU${products.length === 1 ? '' : 's'}`;

  qs('#productNav').innerHTML = products.map(p => `
    <button class="product-nav-btn${p.id === productId ? ' active' : ''}" data-product-id="${p.id}" type="button">${p.name}</button>
  `).join('');

  const editForm = `
    <form id="productEditForm" class="product-edit-form stack-form">
      <div class="field"><label>Name</label><input name="name" type="text" value="${product.name}" required /></div>
      <div class="field-row">
        <div class="field"><label>Units</label><input name="units" type="number" min="1" value="${product.units}" /></div>
        <div class="field"><label>Price</label><input name="price" type="text" value="${product.price}" /></div>
        <div class="field"><label>Margin target</label><input name="marginTarget" type="text" value="${product.marginTarget}" /></div>
      </div>
      <div class="field"><label>Price-test / approval proof URL</label><input name="priceEvidenceUrl" type="text" value="${product.priceEvidenceUrl || ''}" placeholder="Demand test, approved price table, or receipt" /></div>
      <div class="field"><label>Proof lane</label><input name="proof" type="text" value="${product.proof}" /></div>
      <div class="field"><label>Role</label><textarea name="role" rows="2">${product.role}</textarea></div>
      <div class="field-row">
        <div class="field"><label>Sample status</label><input name="sampleStatus" type="text" value="${product.sampleStatus}" /></div>
        <div class="field"><label>Material risk</label><input name="materialRisk" type="text" value="${product.materialRisk}" /></div>
        <div class="field"><label>Fit risk</label><input name="fitRisk" type="text" value="${product.fitRisk}" /></div>
      </div>
      <div class="field"><label>Proof note</label><textarea name="note" rows="2">${product.note}</textarea></div>
      <div class="product-edit-actions">
        <button class="top-btn outline compact" type="button" data-cancel-edit>Cancel</button>
        <button class="btn-primary compact" type="submit">Save SKU</button>
      </div>
    </form>
  `;

  const viewBlock = `
      <p>${product.role}</p>
      <div class="product-kpis">
        <div class="product-kpi"><span>Units</span><strong>${product.units}</strong></div>
        <div class="product-kpi"><span>Price</span><strong>${product.price}</strong></div>
        <div class="product-kpi"><span>Margin</span><strong>${product.marginTarget}</strong></div>
      </div>
      <div class="product-fields">
        <div><span class="product-field-label">Sample status</span><p class="product-field-value">${product.sampleStatus}</p></div>
        <div><span class="product-field-label">Material risk</span><p class="product-field-value">${product.materialRisk}</p></div>
        <div><span class="product-field-label">Fit risk</span><p class="product-field-value">${product.fitRisk}</p></div>
        <div><span class="product-field-label">Proof note</span><p class="product-field-value">${product.note}</p></div>
      </div>
  `;

  qs('#productDetail').innerHTML = `
    <div class="product-image-wrap">
      <img src="${imgSrc}" alt="${product.name}" />
      <div class="product-upload-bar">
        <button class="btn-primary compact" type="button" data-upload-id="${productId}">
          <i data-lucide="image-plus"></i>
          <span>${hasCustom ? 'Replace photo' : 'Upload photo'}</span>
        </button>
        ${hasCustom ? `<button class="top-btn outline compact" type="button" data-clear-img="${productId}">Remove photo</button>` : ''}
      </div>
      <p class="upload-note">${cloudBacked
    ? 'Backed up to squad Storage — URL syncs across devices when signed in.'
    : sync.auth === 'member'
      ? 'Upload saves to squad Storage automatically.'
      : 'Stored in this browser until you sign in — then photos upload to squad Storage.'}</p>
    </div>
    <div class="product-info">
      <div class="product-info-head">
        <div>
          <p class="eyebrow">${product.proof}</p>
          <h2>${product.name}</h2>
        </div>
        ${product.custom ? `<button class="top-btn outline compact product-remove-btn" type="button" data-remove-product="${productId}">Remove SKU</button>` : ''}
        <button class="top-btn outline compact" type="button" data-edit-product="${productId}">${editing ? 'Editing' : 'Edit SKU'}</button>
      </div>
      ${editing ? editForm : viewBlock}
    </div>
  `;

  qsa('[data-product-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeProductId = btn.dataset.productId;
      state.editingProductId = null;
      saveState();
      renderProductLab();
      refreshIcons();
    });
  });

  qsa('[data-upload-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pendingUploadId = btn.dataset.uploadId;
      const input = qs('#productImageInput');
      input.value = '';
      input.click();
    });
  });

  qsa('[data-clear-img]').forEach(btn => {
    btn.addEventListener('click', () => clearProductImage(btn.dataset.clearImg));
  });

  qsa('[data-remove-product]').forEach(btn => {
    btn.addEventListener('click', () => removeProduct(btn.dataset.removeProduct));
  });

  qsa('[data-edit-product]').forEach(btn => {
    btn.addEventListener('click', () => beginProductEdit(btn.dataset.editProduct));
  });

  qs('[data-cancel-edit]')?.addEventListener('click', cancelProductEdit);
  qs('#productEditForm')?.addEventListener('submit', e => saveProductEdit(e, productId));
}

/* ═══════════════════════════════════════════════════
   Campaign Proof
   ═══════════════════════════════════════════════════ */
function formatMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `C$${amount.toLocaleString('en-CA', { maximumFractionDigits: 2 })}` : 'C$0';
}

function getEdgeExperiment(id) {
  return (state.edgeExperiments || []).find(experiment => experiment.id === id);
}

function getEdgePrerequisiteProgress(experiment) {
  const prerequisites = experiment.prerequisites || [];
  const cleared = prerequisites.filter(item => item.cleared).length;
  return {
    cleared,
    total: prerequisites.length,
    pct: prerequisites.length ? Math.round((cleared / prerequisites.length) * 100) : 100
  };
}

function edgeRiskBadge(risk) {
  return `<span class="edge-badge ${String(risk || 'Green').toLowerCase()}">${escapeAttr(risk || 'Green')} risk</span>`;
}

function renderEdgeSummary(scores) {
  const summary = qs('#edgeLabSummary');
  if (!summary) return;
  const violations = scores.edgeViolations || [];
  summary.innerHTML = `
    <article class="edge-summary-card">
      <span>Experiment proof</span>
      <strong>${scores.edgeScore}/100</strong>
      <small>Positive, linked VORG outcomes only</small>
    </article>
    <article class="edge-summary-card">
      <span>Learning score</span>
      <strong>${scores.edgeLearningScore}/100</strong>
      <small>Verified wins and losses</small>
    </article>
    <article class="edge-summary-card">
      <span>Validated</span>
      <strong>${scores.edgeValidatedExperiments}</strong>
      <small>${scores.edgeCompletedExperiments} completed · ${scores.edgeRunningExperiments} running</small>
    </article>
    <article class="edge-summary-card">
      <span>Cash used</span>
      <strong>${formatMoney(scores.edgeExperimentSpend)}</strong>
      <small>of ${formatMoney(scores.edgeExperimentBudgetCap)} queued caps</small>
    </article>
    <article class="edge-summary-card${violations.length ? ' alert' : ''}">
      <span>Control check</span>
      <strong>${violations.length ? `${violations.length} issue${violations.length === 1 ? '' : 's'}` : 'Clean'}</strong>
      <small>${scores.edgeFrontierSpendShare}% of actual test spend is frontier</small>
    </article>
  `;
}

function renderEdgeExperimentQueue() {
  const panel = qs('#edgeLabPanel');
  if (!panel) return;
  const experiments = (state.edgeExperiments || []).slice().sort((left, right) => {
    const statusOrder = { running: 0, ready: 1, planned: 2, blocked: 3, completed: 4 };
    return (statusOrder[left.status] ?? 5) - (statusOrder[right.status] ?? 5) || left.id.localeCompare(right.id);
  });
  const metrics = SCORE_ENGINE.calculateEdgeExperimentMetrics(experiments);
  const violations = metrics.violations.length
    ? `<ul class="edge-violation-list">${metrics.violations.map(item => `<li>${escapeAttr(item)}</li>`).join('')}</ul>`
    : '';
  panel.innerHTML = `${violations}
    <div class="edge-experiment-grid">
      ${experiments.map(experiment => {
        const tactic = getEdgeCatalogTactic(experiment.tacticId);
        const progress = getEdgePrerequisiteProgress(experiment);
        const decision = experiment.decision && experiment.decision !== 'pending'
          ? `<span class="edge-badge ${experiment.decision}">${escapeAttr(experiment.decision)}</span>`
          : '';
        const result = experiment.resultSummary
          ? `<p class="edge-card-summary"><strong>Result:</strong> ${escapeAttr(experiment.resultSummary)}</p>`
          : `<p class="edge-card-summary">${escapeAttr(tactic?.mutation || 'Define the smallest controlled VORG mutation.')}</p>`;
        return `
          <article class="edge-experiment-card ${escapeAttr(experiment.status)}" data-edge-experiment-card="${escapeAttr(experiment.id)}">
            <div class="edge-card-head">
              <div>
                <p class="edge-card-kicker">${escapeAttr(experiment.id)} · ${escapeAttr(experiment.tacticId)} · Tier ${escapeAttr(experiment.sourceEvidenceTier)}</p>
                <h4>${escapeAttr(experiment.name)}</h4>
              </div>
              <span class="edge-badge">${escapeAttr(experiment.status)}</span>
            </div>
            <div class="edge-badge-row">
              ${edgeRiskBadge(experiment.risk)}
              ${decision}
              <span class="edge-badge">${escapeAttr(experiment.budgetSource || 'Budget TBD')}</span>
            </div>
            ${result}
            <div class="edge-progress">
              <div class="edge-progress-label"><span>Prerequisites</span><strong>${progress.cleared}/${progress.total}</strong></div>
              <div class="edge-progress-track"><div class="edge-progress-fill" style="width:${progress.pct}%"></div></div>
            </div>
            <div class="edge-card-metrics">
              <span><strong>${Number(experiment.qualifiedActions) || 0}</strong> qualified</span>
              <span><strong>${Number(experiment.assetsEarned) || 0}</strong> assets</span>
              <span><strong>${formatMoney(experiment.actualSpend)}</strong> / ${formatMoney(experiment.budgetCap)}</span>
            </div>
            <div class="edge-card-actions">
              ${tactic?.sourceUrl ? `<a href="${escapeAttr(tactic.sourceUrl)}" target="_blank" rel="noopener">Source mechanism</a>` : '<span></span>'}
              <button class="edge-action-btn" type="button" data-edge-open="${escapeAttr(experiment.id)}">Open control card</button>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
  qsa('[data-edge-open]').forEach(button => {
    button.addEventListener('click', () => openEdgeExperimentDialog(button.dataset.edgeOpen));
  });
}

function formatLibraryLabel(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getCommerceSource(id) {
  return SOURCE_LIBRARY.sources.find(source => source.id === id);
}

function renderFreeSourceLibrary() {
  const panel = qs('#edgeLabPanel');
  if (!panel) return;
  const filters = { ...clone(DEFAULT_STATE).libraryFilters, ...(state.libraryFilters || {}) };
  const mode = state.libraryMode === 'sources' ? 'sources' : 'claims';
  const publicDomainCount = SOURCE_LIBRARY.sources.filter(source => source.rightsBasis === 'public-domain').length;
  const openLicenseCount = SOURCE_LIBRARY.sources.filter(source => source.rightsBasis === 'open-license').length;
  const lensCount = new Set(SOURCE_LIBRARY.sources.map(source => source.lens)).size;
  const lenses = Array.from(new Set(SOURCE_LIBRARY.sources.map(source => source.lens))).sort();
  const sourceTypes = Array.from(new Set(SOURCE_LIBRARY.sources.map(source => source.sourceType))).sort();

  const claimCards = SOURCE_LIBRARY.claims.map(claim => {
    const sources = claim.sourceIds.map(getCommerceSource).filter(Boolean);
    const searchText = [claim.id, claim.title, claim.claim, claim.mechanism, claim.conditions, claim.vorgMutation, claim.metric, ...sources.map(source => `${source.name} ${source.publisher}`)].join(' ').toLowerCase();
    return `
      <article class="edge-claim-card" data-library-card data-search="${escapeAttr(searchText)}" data-tier="${escapeAttr(claim.evidenceTier)}" data-risk="${escapeAttr(claim.risk)}">
        <div class="edge-library-card-head">
          <div>
            <p class="edge-card-kicker">${escapeAttr(claim.id)} · ${escapeAttr(claim.funnelStage)} · Tier ${escapeAttr(claim.evidenceTier)}</p>
            <h4>${escapeAttr(claim.title)}</h4>
          </div>
          ${edgeRiskBadge(claim.risk)}
        </div>
        <p class="edge-library-claim">${escapeAttr(claim.claim)}</p>
        <div class="edge-badge-row">
          <span class="edge-badge">${Number(claim.confidence) || 0}% source confidence</span>
          ${(claim.feedsTactics || []).map(id => `<span class="edge-badge">${escapeAttr(id)}</span>`).join('')}
        </div>
        <details>
          <summary>Mechanism, VORG mutation, and decision rule</summary>
          <div class="edge-ledger-detail">
            <p><strong>Mechanism:</strong> ${escapeAttr(claim.mechanism)}</p>
            <p><strong>Conditions:</strong> ${escapeAttr(claim.conditions)}</p>
            <p><strong>VORG mutation:</strong> ${escapeAttr(claim.vorgMutation)}</p>
            <p><strong>Metric:</strong> ${escapeAttr(claim.metric)}</p>
            <p><strong>Win:</strong> ${escapeAttr(claim.successThreshold)}</p>
            <p><strong>Kill:</strong> ${escapeAttr(claim.killCondition)}</p>
          </div>
        </details>
        <div class="edge-source-links">
          ${sources.map(source => `<a href="${escapeAttr(source.url)}" target="_blank" rel="noopener">${escapeAttr(source.id)} · ${escapeAttr(source.name)}</a>`).join('')}
        </div>
      </article>
    `;
  }).join('');

  const sourceCards = SOURCE_LIBRARY.sources.map(source => {
    const relatedClaims = SOURCE_LIBRARY.claims.filter(claim => claim.sourceIds.includes(source.id));
    const searchText = [source.id, source.name, source.publisher, source.lens, source.sourceType, source.note, ...source.feedsTactics].join(' ').toLowerCase();
    return `
      <article class="edge-source-card" data-library-card data-search="${escapeAttr(searchText)}" data-lens="${escapeAttr(source.lens)}" data-source-type="${escapeAttr(source.sourceType)}" data-tier="${escapeAttr(source.defaultTier)}">
        <div class="edge-library-card-head">
          <div>
            <p class="edge-card-kicker">${escapeAttr(source.id)} · ${escapeAttr(source.lens)} · Tier ${escapeAttr(source.defaultTier)}</p>
            <h4>${escapeAttr(source.name)}</h4>
            <small>${escapeAttr(source.publisher)}</small>
          </div>
          <span class="edge-badge">${escapeAttr(source.access)}</span>
        </div>
        <p>${escapeAttr(source.note)}</p>
        <div class="edge-badge-row">
          <span class="edge-badge">${escapeAttr(source.rightsBasis)}</span>
          <span class="edge-badge">${escapeAttr(formatLibraryLabel(source.sourceType))}</span>
          <span class="edge-badge">${escapeAttr(source.refresh)}</span>
          <span class="edge-badge">${relatedClaims.length} claim${relatedClaims.length === 1 ? '' : 's'}</span>
        </div>
        <div class="edge-library-ingestion"><strong>Ingest:</strong> ${escapeAttr(formatLibraryLabel(source.ingestionMode))}</div>
        <div class="edge-card-actions">
          <span>${(source.feedsTactics || []).map(id => `<span class="edge-badge">${escapeAttr(id)}</span>`).join('')}</span>
          <a class="edge-source-open" href="${escapeAttr(source.url)}" target="_blank" rel="noopener">Open source</a>
        </div>
      </article>
    `;
  }).join('');

  panel.innerHTML = `
    <section class="edge-library-overview" aria-label="Free commerce library summary">
      <div><span>Free sources</span><strong>${SOURCE_LIBRARY.sources.length}</strong><small>lawful routes registered</small></div>
      <div><span>Atomic claims</span><strong>${SOURCE_LIBRARY.claims.length}</strong><small>deduplicated mechanisms</small></div>
      <div><span>Public-domain books</span><strong>${publicDomainCount}</strong><small>full text permitted</small></div>
      <div><span>Open-licensed books</span><strong>${openLicenseCount}</strong><small>item licence controls reuse</small></div>
      <div><span>Coverage</span><strong>${lensCount}</strong><small>commerce lenses</small></div>
    </section>
    <aside class="edge-library-truth">
      <strong>AI rule: fluency is not evidence.</strong>
      <span>Repeated guru or AI-assisted advice collapses into one atomic mechanism. Source count never inflates proof; only a VORG result can move the algorithm.</span>
    </aside>
    <div class="edge-library-controls">
      <div class="edge-library-mode" role="group" aria-label="Free library mode">
        <button type="button" data-library-mode="claims" class="${mode === 'claims' ? 'active' : ''}">Atomic claims · ${SOURCE_LIBRARY.claims.length}</button>
        <button type="button" data-library-mode="sources" class="${mode === 'sources' ? 'active' : ''}">Sources · ${SOURCE_LIBRARY.sources.length}</button>
      </div>
      <span id="edgeLibraryVisibleCount"></span>
    </div>
    <div class="edge-ledger-toolbar edge-library-toolbar ${mode}">
      <input id="edgeLibrarySearch" type="search" value="${escapeAttr(filters.search)}" placeholder="Search ${mode === 'claims' ? 'claims, mechanisms, metrics, or sources' : 'sources, publishers, lenses, or tactics'}…" aria-label="Search free commerce library" />
      ${mode === 'sources' ? `
        <select id="edgeLibraryLens" aria-label="Filter source library by lens">
          <option value="all">All lenses</option>
          ${lenses.map(lens => `<option value="${escapeAttr(lens)}"${filters.lens === lens ? ' selected' : ''}>${escapeAttr(lens)}</option>`).join('')}
        </select>
        <select id="edgeLibraryType" aria-label="Filter source library by type">
          <option value="all">All source types</option>
          ${sourceTypes.map(type => `<option value="${escapeAttr(type)}"${filters.sourceType === type ? ' selected' : ''}>${escapeAttr(formatLibraryLabel(type))}</option>`).join('')}
        </select>
      ` : `
        <select id="edgeLibraryRisk" aria-label="Filter atomic claims by risk">
          <option value="all">All risk</option>
          ${['Green', 'Yellow', 'Orange', 'Red'].map(risk => `<option value="${risk}"${filters.risk === risk ? ' selected' : ''}>${risk}</option>`).join('')}
        </select>
      `}
      <select id="edgeLibraryTier" aria-label="Filter free library by evidence tier">
        <option value="all">All evidence tiers</option>
        ${['A', 'B', 'C', 'F'].map(tier => `<option value="${tier}"${filters.tier === tier ? ' selected' : ''}>Tier ${tier}</option>`).join('')}
      </select>
    </div>
    <div class="edge-library-grid" id="edgeLibraryGrid">
      ${mode === 'claims' ? claimCards : sourceCards}
    </div>
    <div class="edge-empty" id="edgeLibraryEmpty" hidden><strong>No library records match.</strong><br />Clear a filter or search a broader mechanism.</div>
  `;

  const updateFilters = () => {
    state.libraryFilters = {
      search: qs('#edgeLibrarySearch')?.value.trim() || '',
      lens: qs('#edgeLibraryLens')?.value || 'all',
      sourceType: qs('#edgeLibraryType')?.value || 'all',
      tier: qs('#edgeLibraryTier')?.value || 'all',
      risk: qs('#edgeLibraryRisk')?.value || 'all'
    };
    const needle = state.libraryFilters.search.toLowerCase();
    let visible = 0;
    qsa('[data-library-card]').forEach(card => {
      const searchMatch = !needle || card.dataset.search.includes(needle);
      const tierMatch = state.libraryFilters.tier === 'all' || card.dataset.tier === state.libraryFilters.tier;
      const lensMatch = mode !== 'sources' || state.libraryFilters.lens === 'all' || card.dataset.lens === state.libraryFilters.lens;
      const typeMatch = mode !== 'sources' || state.libraryFilters.sourceType === 'all' || card.dataset.sourceType === state.libraryFilters.sourceType;
      const riskMatch = mode !== 'claims' || state.libraryFilters.risk === 'all' || card.dataset.risk === state.libraryFilters.risk;
      card.hidden = !(searchMatch && tierMatch && lensMatch && typeMatch && riskMatch);
      if (!card.hidden) visible += 1;
    });
    const total = mode === 'claims' ? SOURCE_LIBRARY.claims.length : SOURCE_LIBRARY.sources.length;
    const visibleCount = qs('#edgeLibraryVisibleCount');
    if (visibleCount) visibleCount.textContent = `${visible} of ${total} visible`;
    const empty = qs('#edgeLibraryEmpty');
    if (empty) empty.hidden = visible > 0;
  };

  qsa('[data-library-mode]').forEach(button => {
    button.onclick = () => {
      state.libraryMode = button.dataset.libraryMode;
      state.libraryFilters.search = '';
      saveState();
      renderFreeSourceLibrary();
    };
  });
  ['#edgeLibrarySearch', '#edgeLibraryLens', '#edgeLibraryType', '#edgeLibraryTier', '#edgeLibraryRisk'].forEach(selector => {
    const input = qs(selector);
    if (!input) return;
    input.addEventListener(input.tagName === 'INPUT' ? 'input' : 'change', updateFilters);
  });
  updateFilters();
}

function renderEdgeLedger() {
  const panel = qs('#edgeLabPanel');
  if (!panel) return;
  const filters = { ...clone(DEFAULT_STATE).edgeFilters, ...(state.edgeFilters || {}) };
  const lanes = Array.from(new Set(EDGE_LIBRARY.TACTICS.map(tactic => tactic.lane))).sort();
  panel.innerHTML = `
    <div class="edge-ledger-toolbar">
      <input id="edgeLedgerSearch" type="search" value="${escapeAttr(filters.search)}" placeholder="Search tactic, mechanism, or proof…" aria-label="Search edge tactic ledger" />
      <select id="edgeLedgerLane" aria-label="Filter tactics by lane">
        <option value="all">All lanes</option>
        ${lanes.map(lane => `<option value="${escapeAttr(lane)}"${filters.lane === lane ? ' selected' : ''}>${escapeAttr(lane)}</option>`).join('')}
      </select>
      <select id="edgeLedgerRisk" aria-label="Filter tactics by risk">
        <option value="all">All risk</option>
        ${['Green', 'Yellow', 'Orange', 'Red'].map(risk => `<option value="${risk}"${filters.risk === risk ? ' selected' : ''}>${risk}</option>`).join('')}
      </select>
    </div>
    <div class="edge-ledger-grid" id="edgeLedgerGrid">
      ${EDGE_LIBRARY.TACTICS.map(tactic => {
        const activeQueued = (state.edgeExperiments || []).some(experiment =>
          experiment.tacticId === tactic.id && experiment.status !== 'completed'
        );
        const searchText = [tactic.id, tactic.name, tactic.lane, tactic.mechanism, tactic.mutation, tactic.proof].join(' ').toLowerCase();
        return `
          <article class="edge-ledger-card" data-edge-ledger-card data-search="${escapeAttr(searchText)}" data-lane="${escapeAttr(tactic.lane)}" data-risk="${escapeAttr(tactic.risk)}">
            <div class="edge-ledger-head">
              <div>
                <p class="edge-card-kicker">${tactic.id} · ${escapeAttr(tactic.lane)} · Tier ${escapeAttr(tactic.evidenceTier)}</p>
                <h4>${escapeAttr(tactic.name)}</h4>
              </div>
              ${edgeRiskBadge(tactic.risk)}
            </div>
            <p>${escapeAttr(tactic.mechanism)}</p>
            <details>
              <summary>VORG mutation and test rule</summary>
              <div class="edge-ledger-detail">
                <p><strong>Mutation:</strong> ${escapeAttr(tactic.mutation)}</p>
                <p><strong>Proof:</strong> ${escapeAttr(tactic.proof)}</p>
                <p><strong>Win:</strong> ${escapeAttr(tactic.successThreshold)}</p>
                <p><strong>Kill:</strong> ${escapeAttr(tactic.killCondition)}</p>
                <p><a href="${escapeAttr(tactic.sourceUrl)}" target="_blank" rel="noopener">${escapeAttr(tactic.sourceLabel)}</a></p>
              </div>
            </details>
            <div class="edge-card-actions">
              <span class="edge-badge">${escapeAttr(tactic.priority)}</span>
              <button class="edge-add-btn" type="button" data-edge-add="${tactic.id}"${activeQueued ? ' disabled' : ''}>${activeQueued ? 'In queue' : 'Forge experiment'}</button>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;

  const updateFilters = () => {
    state.edgeFilters = {
      search: qs('#edgeLedgerSearch')?.value.trim() || '',
      lane: qs('#edgeLedgerLane')?.value || 'all',
      risk: qs('#edgeLedgerRisk')?.value || 'all'
    };
    const needle = state.edgeFilters.search.toLowerCase();
    qsa('[data-edge-ledger-card]').forEach(card => {
      const searchMatch = !needle || card.dataset.search.includes(needle);
      const laneMatch = state.edgeFilters.lane === 'all' || card.dataset.lane === state.edgeFilters.lane;
      const riskMatch = state.edgeFilters.risk === 'all' || card.dataset.risk === state.edgeFilters.risk;
      card.hidden = !(searchMatch && laneMatch && riskMatch);
    });
  };
  qs('#edgeLedgerSearch')?.addEventListener('input', updateFilters);
  qs('#edgeLedgerLane')?.addEventListener('change', updateFilters);
  qs('#edgeLedgerRisk')?.addEventListener('change', updateFilters);
  updateFilters();

  qsa('[data-edge-add]').forEach(button => {
    button.addEventListener('click', () => addEdgeExperiment(button.dataset.edgeAdd));
  });
}

function renderEdgeDecisionMemory() {
  const panel = qs('#edgeLabPanel');
  if (!panel) return;
  const decisions = (state.edgeExperiments || [])
    .filter(experiment => experiment.decision && experiment.decision !== 'pending')
    .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')));
  panel.innerHTML = decisions.length ? `
    <div class="edge-memory-list">
      ${decisions.map(experiment => `
        <article class="edge-memory-card ${escapeAttr(experiment.decision)}">
          <div class="edge-memory-head">
            <div>
              <p class="edge-card-kicker">${escapeAttr(experiment.id)} · ${escapeAttr(experiment.tacticId)} · ${escapeAttr(experiment.updatedAt ? new Date(experiment.updatedAt).toLocaleDateString('en-CA') : 'date unresolved')}</p>
              <h4>${escapeAttr(experiment.name)}</h4>
            </div>
            <span class="edge-badge ${escapeAttr(experiment.decision)}">${escapeAttr(experiment.decision)}</span>
          </div>
          <p>${escapeAttr(experiment.resultSummary || 'No result summary recorded.')}</p>
          <div class="edge-card-metrics">
            <span><strong>${Number(experiment.qualifiedActions) || 0}</strong> qualified</span>
            <span><strong>${Number(experiment.assetsEarned) || 0}</strong> assets</span>
            <span><strong>${formatMoney(experiment.actualSpend)}</strong> spent</span>
          </div>
          <div class="edge-card-actions">
            ${SCORE_ENGINE.hasEvidenceReference(experiment.evidenceUrl) ? `<a href="${escapeAttr(experiment.evidenceUrl)}" target="_blank" rel="noopener">Open result evidence</a>` : '<span>No evidence link</span>'}
            <button class="edge-action-btn" type="button" data-edge-open="${escapeAttr(experiment.id)}">Inspect decision</button>
          </div>
        </article>
      `).join('')}
    </div>
  ` : '<div class="edge-empty"><strong>No decisions yet.</strong><br />Complete an experiment with a result receipt before the memory can teach the next drop.</div>';
  qsa('[data-edge-open]').forEach(button => {
    button.addEventListener('click', () => openEdgeExperimentDialog(button.dataset.edgeOpen));
  });
}

function renderEdgeLab(scores) {
  renderEdgeSummary(scores);
  const view = state.campaignView || 'experiments';
  qsa('[data-edge-view]').forEach(button => {
    button.classList.toggle('active', button.dataset.edgeView === view);
    button.onclick = () => {
      state.campaignView = button.dataset.edgeView;
      saveState();
      renderCampaignProof();
      refreshIcons();
    };
  });
  if (view === 'library') renderFreeSourceLibrary();
  else if (view === 'ledger') renderEdgeLedger();
  else if (view === 'memory') renderEdgeDecisionMemory();
  else renderEdgeExperimentQueue();
}

function addEdgeExperiment(tacticId) {
  const experiment = EDGE_LIBRARY.createExperimentFromTactic(tacticId, Date.now());
  if (!experiment) return;
  experiment.createdAt = new Date().toISOString();
  experiment.updatedAt = experiment.createdAt;
  if (!Array.isArray(state.edgeExperiments)) state.edgeExperiments = [];
  state.edgeExperiments.push(normalizeEdgeExperiment(experiment));
  state.campaignView = 'experiments';
  saveState();
  renderCampaignProof();
  refreshIcons();
  openEdgeExperimentDialog(experiment.id);
}

function edgeOption(value, current, label = value) {
  return `<option value="${escapeAttr(value)}"${current === value ? ' selected' : ''}>${escapeAttr(label)}</option>`;
}

function openEdgeExperimentDialog(id) {
  const experiment = getEdgeExperiment(id);
  const body = qs('#edgeExperimentDialogBody');
  const dialog = qs('#edgeExperimentDialog');
  if (!experiment || !body || !dialog) return;
  const tactic = getEdgeCatalogTactic(experiment.tacticId);
  const approvalRequired = experiment.risk === 'Yellow' || experiment.risk === 'Orange';
  body.innerHTML = `
    <div class="dialog-header">
      <div>
        <p class="edge-card-kicker">${escapeAttr(experiment.id)} · ${escapeAttr(experiment.tacticId)} · Tier ${escapeAttr(experiment.sourceEvidenceTier)}</p>
        <h2>${escapeAttr(experiment.name)}</h2>
      </div>
      <button class="btn-icon" type="button" data-edge-close aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <p class="dialog-lead">${escapeAttr(tactic?.mutation || 'Define the smallest controlled VORG mutation.')}</p>
    <div class="edge-badge-row">${edgeRiskBadge(experiment.risk)}<span class="edge-badge">Source tier ${escapeAttr(experiment.sourceEvidenceTier)}</span><span class="edge-badge">${escapeAttr(experiment.budgetSource)}</span></div>
    <form id="edgeExperimentForm" data-edge-form="${escapeAttr(experiment.id)}">
      <div class="edge-form-grid">
        <div class="field"><label>Owner</label><input name="owner" value="${escapeAttr(experiment.owner)}" placeholder="Named accountable owner" /></div>
        <div class="field"><label>Status</label><select name="status">
          ${edgeOption('planned', experiment.status)}${edgeOption('ready', experiment.status)}${edgeOption('running', experiment.status)}${edgeOption('completed', experiment.status)}${edgeOption('blocked', experiment.status)}
        </select></div>
        <div class="field"><label>Start date</label><input name="startDate" type="date" value="${escapeAttr(experiment.startDate)}" /></div>
        <div class="field"><label>End date</label><input name="endDate" type="date" value="${escapeAttr(experiment.endDate)}" /></div>
        <div class="field"><label>Approved cash cap (C$)</label><input name="budgetCap" type="number" min="0" step="0.01" value="${Number(experiment.budgetCap) || 0}" /></div>
        <div class="field"><label>Actual spend (C$)</label><input name="actualSpend" type="number" min="0" step="0.01" value="${Number(experiment.actualSpend) || 0}" /></div>
        <div class="field"><label>Target qualified actions</label><input name="targetQualifiedActions" type="number" min="0" value="${Number(experiment.targetQualifiedActions) || 0}" /></div>
        <div class="field"><label>Qualified actions</label><input name="qualifiedActions" type="number" min="0" value="${Number(experiment.qualifiedActions) || 0}" /></div>
        <div class="field"><label>Target reusable assets</label><input name="assetsTarget" type="number" min="2" value="${Math.max(2, Number(experiment.assetsTarget) || 2)}" /></div>
        <div class="field"><label>Reusable assets earned</label><input name="assetsEarned" type="number" min="0" value="${Number(experiment.assetsEarned) || 0}" /></div>
        <div class="field"><label>Approval status${approvalRequired ? ' · required before run' : ''}</label><select name="approvalStatus"${approvalRequired ? '' : ' disabled'}>
          ${edgeOption('not-required', experiment.approvalStatus, 'Not required')}${edgeOption('pending', experiment.approvalStatus, 'Pending')}${edgeOption('approved', experiment.approvalStatus, 'Approved')}${edgeOption('rejected', experiment.approvalStatus, 'Rejected')}
        </select></div>
        <div class="field"><label>Approved by</label><input name="approvedBy" value="${escapeAttr(experiment.approvedBy)}" placeholder="Required for Yellow / Orange" /></div>
        <div class="field field-wide"><label><input name="counselReviewed" type="checkbox"${experiment.counselReviewed ? ' checked' : ''} /> Counsel review recorded (required for Orange)</label></div>
        <div class="field field-wide"><label>Primary metric</label><textarea name="primaryMetric">${escapeAttr(experiment.primaryMetric)}</textarea></div>
        <div class="field field-wide"><label>Baseline or comparison</label><textarea name="baseline" placeholder="Record the pre-test baseline or state that this test establishes it.">${escapeAttr(experiment.baseline)}</textarea></div>
        <div class="field field-wide"><label>Success threshold · lock before run</label><textarea name="successThreshold">${escapeAttr(experiment.successThreshold)}</textarea></div>
        <div class="field field-wide"><label>Kill condition · lock before run</label><textarea name="killCondition">${escapeAttr(experiment.killCondition)}</textarea></div>
      </div>
      <section class="edge-subsection">
        <h4>Prerequisite gate</h4>
        <div class="edge-prerequisite-list">
          ${(experiment.prerequisites || []).map(item => `<label class="edge-prerequisite"><input type="checkbox" data-edge-prerequisite="${escapeAttr(item.id)}"${item.cleared ? ' checked' : ''} /> <span>${escapeAttr(item.label)}</span></label>`).join('')}
        </div>
      </section>
      <section class="edge-subsection">
        <h4>Seven-day run</h4>
        <ol class="edge-day-plan">${(experiment.sevenDayPlan || []).map(item => `<li>${escapeAttr(item)}</li>`).join('')}</ol>
      </section>
      <div class="edge-form-grid">
        <div class="field"><label>Decision</label><select name="decision">
          ${edgeOption('pending', experiment.decision)}${edgeOption('adopt', experiment.decision)}${edgeOption('adapt', experiment.decision)}${edgeOption('retest', experiment.decision)}${edgeOption('reject', experiment.decision)}
        </select></div>
        <div class="field"><label>Result evidence URL or repo path</label><input name="evidenceUrl" value="${escapeAttr(experiment.evidenceUrl)}" placeholder="Required to complete" /></div>
        <div class="field field-wide"><label>Result summary</label><textarea name="resultSummary" placeholder="What happened, against which unchanged threshold, under what conditions?">${escapeAttr(experiment.resultSummary)}</textarea></div>
      </div>
      <p class="edge-dialog-note"><strong>Control rule:</strong> planned catalog items score zero. Adopt/adapt requires linked evidence, qualified action, at least two reusable assets, cleared prerequisites, approval where required, and spend inside cap. Reject/retest still enters learning memory when the receipt is linked.</p>
      <div class="edge-dialog-actions">
        <button class="top-btn outline" type="button" data-edge-close>Cancel</button>
        <button class="btn-primary" type="submit">Save control card</button>
      </div>
    </form>
  `;
  qsa('[data-edge-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  qs('#edgeExperimentForm')?.addEventListener('submit', saveEdgeExperiment);
  dialog.showModal();
  refreshIcons();
}

function numericFormValue(formData, name) {
  const value = Number(formData.get(name));
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function saveEdgeExperiment(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const experiment = getEdgeExperiment(form.dataset.edgeForm);
  if (!experiment) return;
  const data = new FormData(form);
  const status = String(data.get('status') || 'planned');
  const decision = String(data.get('decision') || 'pending');
  const owner = String(data.get('owner') || '').trim();
  const startDate = String(data.get('startDate') || '');
  const endDate = String(data.get('endDate') || '');
  const budgetCap = numericFormValue(data, 'budgetCap');
  const actualSpend = numericFormValue(data, 'actualSpend');
  const qualifiedActions = numericFormValue(data, 'qualifiedActions');
  const assetsEarned = numericFormValue(data, 'assetsEarned');
  const assetsTarget = Math.max(2, numericFormValue(data, 'assetsTarget'));
  const resultSummary = String(data.get('resultSummary') || '').trim();
  const evidenceUrl = String(data.get('evidenceUrl') || '').trim();
  const approvalStatus = experiment.risk === 'Green'
    ? 'not-required'
    : String(data.get('approvalStatus') || 'pending');
  const approvedBy = String(data.get('approvedBy') || '').trim();
  const counselReviewed = data.get('counselReviewed') === 'on';
  const prerequisites = (experiment.prerequisites || []).map(item => ({
    ...item,
    cleared: Boolean(form.querySelector(`[data-edge-prerequisite="${CSS.escape(item.id)}"]`)?.checked)
  }));
  const prerequisitesCleared = prerequisites.every(item => item.cleared);
  const runningOrComplete = status === 'running' || status === 'completed';
  const approvalRequired = experiment.risk === 'Yellow' || experiment.risk === 'Orange';
  const priorApprovalRecorded = experiment.approvalStatus === 'approved' &&
    Boolean(String(experiment.approvedBy || '').trim()) &&
    Number.isFinite(Date.parse(String(experiment.approvedAt || '')));
  const priorCounselRecorded = experiment.counselReviewed === true &&
    Number.isFinite(Date.parse(String(experiment.counselReviewedAt || '')));

  if ((status === 'ready' || runningOrComplete) && !prerequisitesCleared) {
    window.alert('Clear every prerequisite before this experiment can be ready, running, or completed.');
    return;
  }
  if (runningOrComplete && (!owner || !startDate || !endDate)) {
    window.alert('Assign a named owner plus start and end dates before running the experiment.');
    return;
  }
  if (startDate && endDate && endDate < startDate) {
    window.alert('The experiment end date cannot be earlier than its start date.');
    return;
  }
  if (runningOrComplete && experiment.risk === 'Red') {
    window.alert('Red-risk tactics cannot run. Forge a defensible alternative.');
    return;
  }
  if (runningOrComplete && approvalRequired && (approvalStatus !== 'approved' || !approvedBy)) {
    window.alert('Yellow and Orange experiments require action-time approval and the approver name before they run.');
    return;
  }
  if (runningOrComplete && approvalRequired && !priorApprovalRecorded) {
    window.alert('Record and save approval while the experiment is planned or ready. Then move it to running or completed in a later save.');
    return;
  }
  if (runningOrComplete && experiment.risk === 'Orange' && !counselReviewed) {
    window.alert('Orange experiments require recorded counsel review before they run.');
    return;
  }
  if (runningOrComplete && experiment.risk === 'Orange' && !priorCounselRecorded) {
    window.alert('Record and save counsel review before moving an Orange experiment to running or completed.');
    return;
  }
  if (actualSpend > 0 && (budgetCap <= 0 || actualSpend > budgetCap)) {
    window.alert('Actual spend cannot exceed—or exist without—the founder-approved experiment cap.');
    return;
  }
  if (status === 'completed' && (decision === 'pending' || !resultSummary || !SCORE_ENGINE.hasEvidenceReference(evidenceUrl))) {
    window.alert('Completion requires a decision, result summary, and valid evidence URL or repo path.');
    return;
  }
  if ((decision === 'adopt' || decision === 'adapt') && (status !== 'completed' || qualifiedActions < 1 || assetsEarned < 2)) {
    window.alert('Adopt/adapt requires completed status, at least one qualified action, and at least two reusable assets.');
    return;
  }
  if (status !== 'completed' && decision !== 'pending') {
    window.alert('Record adopt, adapt, retest, or reject only when status is completed.');
    return;
  }

  const now = new Date().toISOString();
  Object.assign(experiment, {
    owner,
    status,
    decision,
    startDate,
    endDate,
    budgetCap,
    actualSpend,
    targetQualifiedActions: numericFormValue(data, 'targetQualifiedActions'),
    qualifiedActions,
    assetsTarget,
    assetsEarned,
    primaryMetric: String(data.get('primaryMetric') || '').trim(),
    baseline: String(data.get('baseline') || '').trim(),
    successThreshold: String(data.get('successThreshold') || '').trim(),
    killCondition: String(data.get('killCondition') || '').trim(),
    resultSummary,
    evidenceUrl,
    approvalStatus,
    approvedBy,
    approvedAt: approvalStatus === 'approved' ? (experiment.approvedAt || now) : '',
    counselReviewed,
    counselReviewedAt: counselReviewed ? (experiment.counselReviewedAt || now) : '',
    prerequisites,
    createdAt: experiment.createdAt || now,
    updatedAt: now
  });
  saveState();
  qs('#edgeExperimentDialog')?.close();
  renderCampaignProof();
  refreshIcons();
}

function renderCampaignProof() {
  const scores = calculateScores();

  qs('#campaignScoreValue').textContent = scores.tacticScore;

  qs('#campaignGate').innerHTML = `
    <i data-lucide="alert-triangle"></i>
    <span>Hold bulk until campaign proof clears. ${scores.verifiedTactics} linked campaign win${scores.verifiedTactics === 1 ? '' : 's'}; Edge Lab ${scores.edgeValidatedExperiments} validated / ${scores.edgeCompletedExperiments} completed; combined score ${scores.tacticScore}/100.</span>
  `;

  renderEdgeLab(scores);

  qs('#tacticList').innerHTML = state.tactics.map(tactic => `
    <article class="tactic-card">
      <div>
        <h3>${tactic.name}</h3>
        <p>${tactic.body}</p>
        <div class="tactic-meta">
          <span class="pill">${tactic.risk} risk</span>
          <span class="pill">${tactic.proof}</span>
        </div>
        <input class="tactic-proof-input" type="text" value="${escapeAttr(tactic.evidenceUrl)}" data-tactic-proof="${tactic.id}" placeholder="Proof URL or repo path required for approval" aria-label="${escapeAttr(tactic.name)} proof reference" />
      </div>
      <button class="tactic-action${tactic.status === 'approved' ? ' active' : ''}" type="button" data-tactic-id="${tactic.id}">
        ${tactic.status === 'approved' ? 'Approved' : 'Approve'}
      </button>
    </article>
  `).join('');

  qsa('[data-tactic-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tactic = state.tactics.find(t => t.id === btn.dataset.tacticId);
      if (tactic.status !== 'approved' && !SCORE_ENGINE.hasEvidenceReference(tactic.evidenceUrl)) {
        window.alert('Attach a proof URL or repo path before approving this tactic.');
        qs(`[data-tactic-proof="${tactic.id}"]`)?.focus();
        return;
      }
      tactic.status = tactic.status === 'approved' ? 'draft' : 'approved';
      saveState();
      renderCampaignProof();
      refreshIcons();
    });
  });

  qsa('[data-tactic-proof]').forEach(input => {
    input.addEventListener('change', () => {
      const tactic = state.tactics.find(t => t.id === input.dataset.tacticProof);
      if (!tactic) return;
      tactic.evidenceUrl = input.value.trim();
      if (tactic.status === 'approved' && !SCORE_ENGINE.hasEvidenceReference(tactic.evidenceUrl)) tactic.status = 'ready';
      saveState();
      renderCampaignProof();
      refreshIcons();
    });
  });
}

/* ═══════════════════════════════════════════════════
   Sales Forecast Lab
   Separate from readiness: predicts ranges; never authorizes spend.
   ═══════════════════════════════════════════════════ */
function parseForecastVariants(raw, productName) {
  const text = String(raw || '').trim();
  if (!text) return { variants: [], errors: [] };
  const errors = [];
  const variants = text.split(/[\n,]+/).map((part, index) => {
    const [labelRaw, inventoryRaw, weightRaw] = part.split(':').map(value => value.trim());
    const inventory = Number(inventoryRaw);
    const weight = weightRaw ? Number(weightRaw) : undefined;
    if (!labelRaw || !Number.isInteger(inventory) || inventory < 0 || (weightRaw && (!Number.isFinite(weight) || weight <= 0))) {
      errors.push(`${productName}: size entry ${index + 1} must use Label:units or Label:units:weight.`);
    }
    return { label: labelRaw, inventory: inventoryRaw, weight };
  });
  return { variants, errors };
}

function forecastField(override, key, fallback = '') {
  const value = override?.[key];
  return value !== undefined && value !== null && String(value).trim() !== '' ? value : fallback;
}

function buildForecastInput() {
  state.forecast = normalizeForecastState(state.forecast);
  const inputs = state.forecast.inputs;
  const externalPrior = inputs.priorProfile === PUBLIC_COMMERCE_PRIORS.profileId
    ? {
        id: PUBLIC_COMMERCE_PRIORS.profileId,
        modelVersion: PUBLIC_COMMERCE_PRIORS.modelVersion,
        checkedOn: PUBLIC_COMMERCE_PRIORS.checkedOn,
        directConversionStrength: PUBLIC_COMMERCE_PRIORS.engineProfile.directConversionStrength,
        refundStrength: PUBLIC_COMMERCE_PRIORS.engineProfile.refundStrength,
        sourceUrls: PUBLIC_COMMERCE_PRIORS.sources.map(source => source.url)
      }
    : undefined;
  const parseErrors = [];
  const products = getForecastProductCatalog(inputs).map(product => {
    const override = inputs.productOverrides?.[product.id] || {};
    const parsedVariants = parseForecastVariants(override.sizeInventory, product.name);
    parseErrors.push(...parsedVariants.errors);
    return {
      id: product.id,
      name: product.name,
      active: true,
      inventory: forecastField(override, 'inventory', product.units),
      price: forecastField(override, 'price', product.price),
      landedCogs: forecastField(override, 'landedCogs', product.manufacturing?.landedCogs),
      weight: forecastField(override, 'weight', 1),
      variants: parsedVariants.variants
    };
  });
  return {
    input: {
      ...inputs,
      externalPrior,
      asOf: inputs.asOf || new Date().toISOString(),
      dropId: inputs.evidenceMode === 'synthetic' ? String(inputs.dropId || 'SYNTHETIC') : String(getDrop().id || 'unrecorded'),
      productionSpendCap: getDrop().productionSpendCap,
      products
    },
    parseErrors
  };
}

function getCurrentForecast() {
  const { input, parseErrors } = buildForecastInput();
  const output = FORECAST_ENGINE.calculateForecast(input);
  if (parseErrors.length) {
    output.status = 'blocked';
    output.errors.push(...parseErrors);
  }
  return { input, output };
}

function forecastMoney(value) {
  const amount = Number(value || 0);
  return `${amount < 0 ? '-' : ''}C$${Math.abs(amount).toLocaleString('en-CA', { maximumFractionDigits: 0 })}`;
}

function forecastRange(range, formatter = value => Number(value || 0).toLocaleString('en-CA')) {
  return `${formatter(range.p10)} / ${formatter(range.p50)} / ${formatter(range.p90)}`;
}

function forecastMetric(value) {
  return value === null || value === undefined ? '—' : `${Math.round(Number(value) * 100)}%`;
}

function renderForecastSnapshot(snapshot) {
  const actual = snapshot.actual || {};
  const output = snapshot.forecast;
  const linked = FORECAST_ENGINE.hasEvidenceReference(actual.evidenceUrl);
  const synthetic = output?.status === 'synthetic-test' || output?.evidenceMode === 'synthetic' || FORECAST_ENGINE.isSyntheticEvidenceReference(actual.evidenceUrl);
  return `
    <article class="forecast-snapshot-card">
      <div class="forecast-snapshot-head">
        <div>
          <strong>${escapeAttr(snapshot.label || snapshot.dropId || 'Frozen forecast')}</strong>
          <span>${escapeAttr(new Date(snapshot.frozenAt).toLocaleString('en-CA'))} · ${escapeAttr(output?.status || 'unknown')}</span>
        </div>
        <span class="forecast-status-pill ${synthetic ? 'synthetic-test' : linked ? 'evidence-anchored' : 'scenario'}">${synthetic ? linked ? 'Synthetic outcome linked' : 'Synthetic test' : linked ? 'Outcome linked' : 'Awaiting actual'}</span>
      </div>
      <div class="forecast-frozen-call">
        <span>Revenue P10 / P50 / P90</span>
        <strong>${forecastRange(output.summary.revenue, forecastMoney)}</strong>
        <span>Units P10 / P50 / P90</span>
        <strong>${forecastRange(output.summary.soldUnits)}</strong>
      </div>
      <form class="forecast-actual-form" data-forecast-actual="${escapeAttr(snapshot.id)}">
        <div class="field"><label>Actual net revenue (C$)</label><input name="revenue" type="number" min="0" step="0.01" value="${escapeAttr(actual.revenue ?? '')}" required /></div>
        <div class="field"><label>Actual net units sold</label><input name="unitsSold" type="number" min="0" step="1" value="${escapeAttr(actual.unitsSold ?? '')}" required /></div>
        <div class="field"><label>Actual sell-through (%)</label><input name="sellThroughPct" type="number" min="0" max="100" step="0.1" value="${escapeAttr(actual.sellThroughPct ?? '')}" /></div>
        <div class="field field-wide"><label>Outcome evidence URL or repo path</label><input name="evidenceUrl" value="${escapeAttr(actual.evidenceUrl || '')}" placeholder="Shopify/GA4 export or reports/drop-001-actuals.csv" required /></div>
        <button class="top-btn outline" type="submit">Save linked outcome</button>
      </form>
    </article>
  `;
}

function renderForecastLab() {
  state.forecast = normalizeForecastState(state.forecast);
  const inputs = state.forecast.inputs;
  const { input, output } = getCurrentForecast();
  const stressScenarios = output.status === 'blocked' ? [] : FORECAST_ENGINE.calculateStressSuite(input);
  const calibration = FORECAST_ENGINE.calculateCalibration(state.forecast.snapshots, 'live');
  const syntheticCalibration = FORECAST_ENGINE.calculateCalibration(state.forecast.snapshots, 'synthetic');
  const banner = qs('#forecastTruthBanner');
  const summary = qs('#forecastSummary');
  const workbench = qs('#forecastWorkbench');
  const calibrationPanel = qs('#forecastCalibration');
  if (!banner || !summary || !workbench || !calibrationPanel) return;

  const truth = output.status === 'blocked'
    ? ['Forecast blocked', 'Complete the missing inventory, price, and demand-driver inputs. No number is safer than a fabricated number.']
    : output.status === 'synthetic-test'
      ? ['Synthetic evidence test', 'Generated receipts are exercising the engine. These numbers contribute zero launch proof, readiness, or live calibration.']
    : output.status === 'evidence-anchored'
      ? ['Evidence-anchored range', 'The range uses linked first-party funnel and traffic receipts. It is still uncertain and cannot authorize production.']
      : output.priorProfile === 'public-transfer-v1'
        ? ['Public-transfer scenario', 'Licensed external company data widens cold-start uncertainty around the entered VORG mean rate. It contributes zero VORG proof and never supplies that mean; P50 can still move as the distribution becomes more skewed.']
        : ['Scenario range', 'This is a planning scenario driven partly by internal cold-start priors. Link first-party receipts before treating it as evidence-anchored.'];
  banner.className = `forecast-truth-banner ${output.status}`;
  const scenario = state.forecast.scenario || DEFAULT_FORECAST_STATE.scenario;
  banner.innerHTML = `<i data-lucide="${output.status === 'blocked' ? 'octagon-x' : output.status === 'scenario' ? 'triangle-alert' : output.status === 'synthetic-test' ? 'flask-conical' : 'shield-check'}"></i><div><strong>${truth[0]}</strong><span>${truth[1]}</span><small>Loaded input set: ${escapeAttr(scenario.label)} · ${escapeAttr(scenario.source)} · ${escapeAttr(scenario.truth)}</small></div>`;

  summary.innerHTML = `
    <article class="forecast-kpi"><span>Revenue · P10 / P50 / P90</span><strong>${output.status === 'blocked' ? 'Blocked' : forecastRange(output.summary.revenue, forecastMoney)}</strong></article>
    <article class="forecast-kpi"><span>Net units · P10 / P50 / P90</span><strong>${output.status === 'blocked' ? 'Blocked' : forecastRange(output.summary.soldUnits)}</strong></article>
    <article class="forecast-kpi"><span>Sell-through · P10 / P50 / P90</span><strong>${output.status === 'blocked' ? 'Blocked' : forecastRange(output.summary.sellThrough, value => `${value}%`)}</strong></article>
    <article class="forecast-kpi"><span>Chance of ≥70% sell-through</span><strong>${output.status === 'blocked' ? 'Blocked' : `${output.summary.sellThrough70Probability}%`}</strong></article>
    <article class="forecast-kpi"><span>Chance of ≥85% sell-through</span><strong>${output.status === 'blocked' ? 'Blocked' : `${output.summary.sellThrough85Probability}%`}</strong></article>
    <article class="forecast-kpi"><span>Any SKU stockout risk</span><strong>${output.status === 'blocked' ? 'Blocked' : `${output.summary.anyStockoutProbability}%`}</strong></article>
    <article class="forecast-kpi"><span>Data completeness</span><strong>${output.dataCompleteness}/100</strong></article>
    <article class="forecast-kpi"><span>Full inventory buy · landed COGS</span><strong>${output.summary.inventoryCost === null ? 'Missing COGS' : forecastMoney(output.summary.inventoryCost)}</strong></article>
    <article class="forecast-kpi"><span>Revenue less inventory buy · P10 / P50 / P90</span><strong>${output.status === 'blocked' ? 'Blocked' : output.summary.merchandiseCashRecovery === null ? 'Missing COGS' : forecastRange(output.summary.merchandiseCashRecovery, forecastMoney)}</strong></article>
    <article class="forecast-kpi"><span>Chance revenue recovers inventory buy</span><strong>${output.status === 'blocked' ? 'Blocked' : output.summary.inventoryCashRecoveryProbability === null ? 'Missing COGS' : `${output.summary.inventoryCashRecoveryProbability}%`}</strong></article>
    <article class="forecast-kpi"><span>Revenue less full committed plan · P10 / P50 / P90</span><strong>${output.status === 'blocked' ? 'Blocked' : output.summary.committedLaunchCash === null ? 'Missing COGS' : forecastRange(output.summary.committedLaunchCash, forecastMoney)}</strong></article>
    <article class="forecast-kpi"><span>Chance revenue recovers full committed plan</span><strong>${output.status === 'blocked' ? 'Blocked' : output.summary.launchCashRecoveryProbability === null ? 'Missing COGS' : `${output.summary.launchCashRecoveryProbability}%`}</strong></article>
    <article class="forecast-kpi"><span>Online order model</span><strong>${output.status === 'synthetic-test' ? 'Synthetic funnel' : output.onlineConversionMode === 'planning-prior' ? 'Planning prior' : 'Observed funnel'} · ${output.unitsPerOrder} units/order</strong></article>
    <article class="forecast-kpi"><span>Cold-start profile</span><strong>${output.priorProfile === 'public-transfer-v1' ? 'Public transfer uncertainty' : 'Internal weak priors'}</strong></article>
  `;

  const observed = inputs.observed;
  const productRows = getForecastProductCatalog(inputs).map(product => {
    const override = inputs.productOverrides?.[product.id] || {};
    return `
      <tr>
        <th scope="row">${escapeAttr(product.name)}</th>
        <td><input name="inventory__${escapeAttr(product.id)}" type="number" min="0" step="1" value="${escapeAttr(override.inventory ?? product.units ?? '')}" aria-label="${escapeAttr(product.name)} inventory" /></td>
        <td><input name="price__${escapeAttr(product.id)}" type="text" value="${escapeAttr(override.price ?? product.price ?? '')}" aria-label="${escapeAttr(product.name)} price" /></td>
        <td><input name="landedCogs__${escapeAttr(product.id)}" type="number" min="0" step="0.01" value="${escapeAttr(override.landedCogs ?? product.manufacturing?.landedCogs ?? '')}" aria-label="${escapeAttr(product.name)} landed COGS" /></td>
        <td><input name="weight__${escapeAttr(product.id)}" type="number" min="0.1" step="0.1" value="${escapeAttr(override.weight ?? 1)}" aria-label="${escapeAttr(product.name)} demand weight" /></td>
        <td><input name="sizeInventory__${escapeAttr(product.id)}" type="text" value="${escapeAttr(override.sizeInventory ?? '')}" placeholder="S:4, M:8, L:4" aria-label="${escapeAttr(product.name)} size inventory" /></td>
      </tr>`;
  }).join('');

  const issueHtml = [...output.errors.map(message => `<li class="forecast-error">${escapeAttr(message)}</li>`), ...output.warnings.map(message => `<li>${escapeAttr(message)}</li>`)].join('');
  const rateRows = output.rates.map(rate => `<tr><td>${escapeAttr(rate.label)}</td><td>${rate.mean}%</td><td><span class="forecast-rate-source ${rate.evidence}">${rate.evidence}</span></td><td>${rate.trials ? `${rate.successes} / ${rate.trials}` : rate.evidence === 'external' ? 'Public transfer · zero VORG counts' : 'Internal weak prior'}</td></tr>`).join('');
  const productOutputs = output.products.length ? output.products.map(product => `
    <tr>
      <th scope="row">${escapeAttr(product.name)}</th>
      <td>${product.inventory}</td><td>${forecastRange(product.demand)}</td><td>${forecastRange(product.sold)}</td>
      <td>${forecastRange(product.sellThrough, value => `${value}%`)}</td><td>${product.stockoutProbability}%</td>
      <td>${forecastRange(product.revenue, forecastMoney)}</td>
    </tr>`).join('') : '<tr><td colspan="7">Complete inputs to unlock SKU ranges.</td></tr>';
  const stressRows = output.status === 'blocked' ? '<tr><td colspan="8">Resolve blockers to run launch stresses.</td></tr>' : [
    { key: 'base', label: 'Current plan', description: 'The saved live scenario.', forecast: output },
    ...stressScenarios
  ].map(item => {
    const result = item.forecast;
    return `<tr class="forecast-stress-row ${escapeAttr(item.key)}">
      <th scope="row"><strong>${escapeAttr(item.label)}</strong><small>${escapeAttr(item.description)}</small></th>
      <td>${forecastMoney(result.summary.revenue.p50)}</td>
      <td>${result.summary.soldUnits.p50}</td>
      <td>${result.summary.sellThrough.p50}%</td>
      <td>${result.summary.sellThrough85Probability}%</td>
      <td>${result.summary.excessInventory.p50}</td>
      <td>${result.summary.committedLaunchCash === null ? '—' : forecastMoney(result.summary.committedLaunchCash.p10)}</td>
      <td>${result.summary.launchCashRecoveryProbability === null ? '—' : `${result.summary.launchCashRecoveryProbability}%`}</td>
    </tr>`;
  }).join('');

  workbench.innerHTML = `
    <form id="forecastAssumptionsForm" class="forecast-form">
      <section class="forecast-section">
        <div class="forecast-section-head"><div><p class="eyebrow">Demand plan</p><h3>Traffic, reservations, event footfall</h3></div><span>${output.simulations.toLocaleString()} deterministic simulations</span></div>
        <div class="forecast-input-grid">
          <div class="field"><label>Forecast horizon (days)</label><input name="horizonDays" type="number" min="1" max="90" value="${escapeAttr(inputs.horizonDays)}" /></div>
          <div class="field"><label>Planned online sessions</label><input name="plannedOnlineSessions" type="number" min="0" step="1" value="${escapeAttr(inputs.plannedOnlineSessions)}" /></div>
          <div class="field"><label>Planned pop-up visitors</label><input name="plannedPopupVisitors" type="number" min="0" step="1" value="${escapeAttr(inputs.plannedPopupVisitors)}" /></div>
          <div class="field"><label>Online conversion planning prior (%)</label><input name="plannedOnlineConversionRate" type="number" min="0.01" max="100" step="0.01" value="${escapeAttr(inputs.plannedOnlineConversionRate)}" /></div>
          <div class="field"><label>Cold-start uncertainty profile</label><select name="priorProfile"><option value="public-transfer-v1"${inputs.priorProfile === 'public-transfer-v1' ? ' selected' : ''}>Licensed public data · transfer stress</option><option value="internal-weak"${inputs.priorProfile === 'internal-weak' ? ' selected' : ''}>Internal weak priors</option></select></div>
          <div class="field"><label>Units per order assumption</label><input name="unitsPerOrderAssumption" type="number" min="1" max="4" step="0.01" value="${escapeAttr(inputs.unitsPerOrderAssumption)}" /></div>
          <div class="field"><label>Committed non-inventory spend (C$)</label><input name="committedNonInventorySpend" type="number" min="0" step="0.01" value="${escapeAttr(inputs.committedNonInventorySpend)}" /></div>
          <div class="field"><label>Qualified reservations</label><input name="reservations" type="number" min="0" step="1" value="${escapeAttr(inputs.reservations)}" /></div>
          <div class="field"><label>Reservation conversion assumption (%)</label><input name="reservationConversionRate" type="number" min="0" max="100" step="0.1" value="${escapeAttr(inputs.reservationConversionRate)}" /></div>
          <div class="field"><label>Traffic plan / receipt</label><input name="trafficEvidenceUrl" value="${escapeAttr(inputs.trafficEvidenceUrl)}" placeholder="URL or repo path" /></div>
          <div class="field"><label>Traffic proof type</label><select name="trafficEvidenceClass"><option value="plan"${inputs.trafficEvidenceClass === 'plan' ? ' selected' : ''}>Plan only</option><option value="historical"${inputs.trafficEvidenceClass === 'historical' ? ' selected' : ''}>Historical receipt</option></select></div>
          <div class="field"><label>Funnel export / receipt</label><input name="funnelEvidenceUrl" value="${escapeAttr(inputs.funnelEvidenceUrl)}" placeholder="URL or repo path" /></div>
          <div class="field"><label>Reservation receipt</label><input name="reservationEvidenceUrl" value="${escapeAttr(inputs.reservationEvidenceUrl)}" placeholder="URL or repo path" /></div>
        </div>
      </section>
      <details class="forecast-section" open>
        <summary><span><span class="eyebrow">${output.status === 'synthetic-test' ? 'Generated test evidence' : 'First-party evidence'}</span><strong>${output.status === 'synthetic-test' ? 'Synthetic funnel-count fixture' : 'Observed funnel counts'}</strong></span><small>Aggregate only · never paste customer PII</small></summary>
        <div class="forecast-input-grid compact">
          ${[
            ['sessions', 'Sessions'], ['productViews', 'Product views'], ['addsToCart', 'Adds to cart'],
            ['checkouts', 'Checkouts'], ['purchases', 'Purchase orders'], ['unitsPurchased', 'Purchased units'],
            ['refunds', 'Refunded units'], ['popupVisitors', 'Pop-up visitors'], ['popupPurchases', 'Pop-up purchases']
          ].map(([key, label]) => `<div class="field"><label>${label}</label><input name="observed__${key}" type="number" min="0" step="1" value="${escapeAttr(observed[key])}" /></div>`).join('')}
        </div>
        <p class="forecast-calibration-note">Session + purchase orders update the planning prior without a full funnel. That does not make the call evidence-anchored or authorize spend.</p>
      </details>
      <section class="forecast-section">
        <div class="forecast-section-head"><div><p class="eyebrow">Merchandise model</p><h3>Inventory, price, unit cost, mix</h3></div><span>Size totals override SKU inventory; blank size weights use equal weak priors</span></div>
        <div class="forecast-table-wrap"><table class="forecast-input-table"><thead><tr><th>SKU</th><th>Inventory</th><th>Price C$</th><th>Landed COGS</th><th>Demand weight</th><th>Size inventory · Label:units[:demand weight]</th></tr></thead><tbody>${productRows}</tbody></table></div>
      </section>
      <div class="forecast-form-actions">
        <p><strong>Control:</strong> saving assumptions recalculates the current ${output.status === 'synthetic-test' ? 'synthetic test' : 'live scenario'}. Freezing creates an audit copy that later edits cannot rewrite.</p>
        <button class="btn-primary" type="submit"><i data-lucide="calculator"></i><span>Save + recalculate</span></button>
        <button class="top-btn outline" type="button" id="freezeForecastBtn"${output.status === 'blocked' ? ' disabled' : ''}><i data-lucide="snowflake"></i><span>${output.status === 'synthetic-test' ? 'Freeze synthetic call' : 'Freeze pre-launch call'}</span></button>
        <button class="top-btn outline synthetic" type="button" id="loadSyntheticForecastBtn"><i data-lucide="flask-conical"></i><span>Run synthetic evidence test</span></button>
        <button class="top-btn outline" type="button" id="loadProofBuyScenarioBtn"><i data-lucide="rotate-ccw"></i><span>Reload 126-unit scenario</span></button>
      </div>
    </form>
    <section class="forecast-section forecast-diagnostics">
      <div><p class="eyebrow">Model diagnostics</p><h3>What the range is using</h3><ul class="forecast-issues">${issueHtml || '<li>No active model warnings.</li>'}</ul></div>
      <div><div class="forecast-table-wrap"><table><thead><tr><th>Rate</th><th>Posterior mean</th><th>Source</th><th>Counts</th></tr></thead><tbody>${rateRows}</tbody></table></div>${output.priorProfile === 'public-transfer-v1' ? `<p class="forecast-calibration-note"><strong>${escapeAttr(PUBLIC_COMMERCE_PRIORS.modelVersion)}</strong> · 12,330 labeled sessions, 541,909 transaction rows, 165,474 clothing clicks. Random holdout AUC ${PUBLIC_COMMERCE_PRIORS.sessionPurchaseModel.randomHoldout.auc}; blocked-month AUC ${PUBLIC_COMMERCE_PRIORS.sessionPurchaseModel.blockedMonthHoldout.auc}. These are within-source diagnostics, not VORG accuracy.</p>` : ''}</div>
    </section>
    <section class="forecast-section">
      <div class="forecast-section-head"><div><p class="eyebrow">SKU risk</p><h3>Product-level forecast</h3></div><span>P10 / P50 / P90</span></div>
      <div class="forecast-table-wrap"><table><thead><tr><th>SKU</th><th>Stock</th><th>Demand</th><th>Net sold</th><th>Sell-through</th><th>Stockout</th><th>Revenue</th></tr></thead><tbody>${productOutputs}</tbody></table></div>
    </section>
    <section class="forecast-section">
      <div class="forecast-section-head"><div><p class="eyebrow">Launch stress matrix</p><h3>What breaks the current call?</h3></div><span>Base uses saved simulations · challengers use 700-1,200 deterministic runs</span></div>
      <div class="forecast-table-wrap"><table class="forecast-stress-table"><thead><tr><th>Scenario</th><th>P50 revenue</th><th>P50 units</th><th>P50 sell-through</th><th>Chance ≥85%</th><th>P50 excess</th><th>P10 cash vs full plan</th><th>Chance full-plan recovery</th></tr></thead><tbody>${stressRows}</tbody></table></div>
      <p class="forecast-calibration-note">Stress cases are controlled counterfactuals, not predictions. They expose sensitivity to traffic, conversion, event dependence, and cost drift while inventory remains fixed.</p>
    </section>
  `;

  calibrationPanel.innerHTML = `
    <div class="forecast-section-head"><div><p class="eyebrow">Learning loop</p><h3>Frozen calls + actual outcomes</h3></div><span class="forecast-status-pill ${escapeAttr(calibration.status)}">${escapeAttr(calibration.status)}</span></div>
    <div class="forecast-calibration-grid">
      <article><span>Independent drops</span><strong>${calibration.uniqueDrops}</strong></article>
      <article><span>Linked forecasts</span><strong>${calibration.completedForecasts}</strong></article>
      <article><span>Revenue WAPE</span><strong>${forecastMetric(calibration.revenueWape)}</strong></article>
      <article><span>Units WAPE</span><strong>${forecastMetric(calibration.unitsWape)}</strong></article>
      <article><span>Revenue P10–P90 coverage</span><strong>${forecastMetric(calibration.revenueCoverage80)}</strong></article>
      <article><span>Revenue median bias</span><strong>${forecastMetric(calibration.revenueMedianBias)}</strong></article>
    </div>
    <p class="forecast-calibration-note">${escapeAttr(calibration.warnings.join(' '))}</p>
    ${syntheticCalibration.completedForecasts ? `
      <div class="forecast-synthetic-calibration">
        <div><span class="eyebrow">Synthetic harness · isolated</span><strong>${escapeAttr(syntheticCalibration.status)}</strong></div>
        <span>${syntheticCalibration.uniqueDrops} test outcome${syntheticCalibration.uniqueDrops === 1 ? '' : 's'} · revenue WAPE ${forecastMetric(syntheticCalibration.revenueWape)} · P10–P90 coverage ${forecastMetric(syntheticCalibration.revenueCoverage80)}</span>
        <small>${escapeAttr(syntheticCalibration.warnings.join(' '))}</small>
      </div>` : ''}
    <div class="forecast-snapshot-list">${state.forecast.snapshots.length ? state.forecast.snapshots.slice().reverse().map(renderForecastSnapshot).join('') : '<div class="edge-empty"><strong>No frozen call yet.</strong><br />Set the scenario, freeze it before launch, then link real outcomes after the drop.</div>'}</div>
  `;

  qs('#forecastAssumptionsForm')?.addEventListener('submit', saveForecastInputs);
  qs('#freezeForecastBtn')?.addEventListener('click', freezeCurrentForecast);
  qs('#loadSyntheticForecastBtn')?.addEventListener('click', loadSyntheticForecastScenario);
  qs('#loadProofBuyScenarioBtn')?.addEventListener('click', loadProofBuyForecastScenario);
  qsa('.forecast-actual-form').forEach(form => form.addEventListener('submit', saveForecastActual));
}

function saveForecastInputs(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const inputs = state.forecast.inputs;
  ['horizonDays', 'plannedOnlineSessions', 'plannedPopupVisitors', 'plannedOnlineConversionRate', 'priorProfile', 'unitsPerOrderAssumption', 'committedNonInventorySpend', 'reservations', 'reservationConversionRate', 'trafficEvidenceUrl', 'trafficEvidenceClass', 'funnelEvidenceUrl', 'reservationEvidenceUrl'].forEach(key => {
    inputs[key] = String(data.get(key) ?? '').trim();
  });
  Object.keys(inputs.observed).forEach(key => {
    inputs.observed[key] = String(data.get(`observed__${key}`) ?? '').trim();
  });
  const overrides = {};
  getForecastProductCatalog(inputs).forEach(product => {
    overrides[product.id] = {};
    ['inventory', 'price', 'landedCogs', 'weight', 'sizeInventory'].forEach(key => {
      overrides[product.id][key] = String(data.get(`${key}__${product.id}`) ?? '').trim();
    });
  });
  inputs.productOverrides = overrides;
  inputs.asOf = new Date().toISOString();
  saveState();
  renderForecastLab();
  refreshIcons();
}

function loadProofBuyForecastScenario() {
  if (!window.confirm('Replace the current live forecast inputs with the source-linked 126-unit working scenario? Frozen forecasts will be preserved.')) return;
  const snapshots = Array.isArray(state.forecast?.snapshots) ? state.forecast.snapshots : [];
  state.forecast = clone(DEFAULT_FORECAST_STATE);
  state.forecast.snapshots = snapshots;
  state.forecast.inputs.asOf = new Date().toISOString();
  saveState();
  renderForecastLab();
  refreshIcons();
}

function loadSyntheticForecastScenario() {
  if (!window.confirm('Load clearly marked synthetic receipts, run the forecast, and add one linked synthetic outcome? Live calibration and readiness will remain untouched.')) return;
  const fixture = clone(SYNTHETIC_FORECAST_FIXTURE);
  const preservedSnapshots = (Array.isArray(state.forecast?.snapshots) ? state.forecast.snapshots : [])
    .filter(snapshot => snapshot.fixtureId !== fixture.scenario.version);
  const { products, ...fixtureInputs } = fixture.input;
  const productOverrides = {};
  products.forEach(product => {
    productOverrides[product.id] = {
      inventory: String(product.inventory),
      price: String(product.price),
      landedCogs: String(product.landedCogs),
      weight: String(product.weight),
      sizeInventory: (product.variants || []).map(variant => `${variant.label}:${variant.inventory}:${variant.weight}`).join(', ')
    };
  });
  state.forecast = {
    scenario: fixture.scenario,
    inputs: {
      ...clone(DEFAULT_FORECAST_STATE.inputs),
      ...fixtureInputs,
      asOf: new Date().toISOString(),
      observed: { ...clone(DEFAULT_FORECAST_STATE.inputs.observed), ...(fixtureInputs.observed || {}) },
      productOverrides
    },
    snapshots: preservedSnapshots
  };
  const { input, output } = getCurrentForecast();
  const frozenAt = new Date().toISOString();
  state.forecast.snapshots.push({
    id: `forecast-${fixture.scenario.version}`,
    fixtureId: fixture.scenario.version,
    dropId: fixture.input.dropId,
    label: fixture.scenario.label,
    frozenAt,
    input: clone(input),
    forecast: clone(output),
    actual: { ...fixture.actual, recordedAt: frozenAt }
  });
  saveState();
  renderForecastLab();
  refreshIcons();
}

function freezeCurrentForecast() {
  const { input, output } = getCurrentForecast();
  if (output.status === 'blocked') {
    window.alert('Resolve the forecast blockers before freezing a call.');
    return;
  }
  const frozenAt = new Date().toISOString();
  const synthetic = output.status === 'synthetic-test' || output.evidenceMode === 'synthetic';
  state.forecast.snapshots.push({
    id: `forecast-${Date.now()}`,
    dropId: synthetic ? String(input.dropId || 'SYNTHETIC') : String(getDrop().id || 'unrecorded'),
    label: `${synthetic ? 'SYNTHETIC · Engine test' : getDrop().label || `Drop ${getDrop().id}`} · ${new Date(frozenAt).toLocaleDateString('en-CA')}`,
    frozenAt,
    input: clone(input),
    forecast: clone(output),
    actual: {}
  });
  saveState();
  renderForecastLab();
  refreshIcons();
}

function saveForecastActual(event) {
  event.preventDefault();
  const snapshot = state.forecast.snapshots.find(item => item.id === event.currentTarget.dataset.forecastActual);
  if (!snapshot) return;
  const data = new FormData(event.currentTarget);
  const revenue = String(data.get('revenue') ?? '').trim();
  const unitsSold = String(data.get('unitsSold') ?? '').trim();
  const sellThroughPct = String(data.get('sellThroughPct') ?? '').trim();
  const evidenceUrl = String(data.get('evidenceUrl') ?? '').trim();
  if (revenue === '' || unitsSold === '' || Number(revenue) < 0 || !Number.isInteger(Number(unitsSold)) || Number(unitsSold) < 0) {
    window.alert('Actual revenue and whole net units sold must be non-negative.');
    return;
  }
  if (sellThroughPct !== '' && (Number(sellThroughPct) < 0 || Number(sellThroughPct) > 100)) {
    window.alert('Actual sell-through must be between 0% and 100%.');
    return;
  }
  if (!FORECAST_ENGINE.hasEvidenceReference(evidenceUrl)) {
    window.alert('Link an outcome receipt before this result can enter calibration.');
    return;
  }
  if (snapshot.actual?.recordedAt) {
    if (!Array.isArray(snapshot.actualHistory)) snapshot.actualHistory = [];
    snapshot.actualHistory.push(clone(snapshot.actual));
  }
  snapshot.actual = {
    revenue: Number(revenue),
    unitsSold: Number(unitsSold),
    sellThroughPct: sellThroughPct === '' ? '' : Number(sellThroughPct),
    evidenceUrl,
    recordedAt: new Date().toISOString()
  };
  saveState();
  renderForecastLab();
  refreshIcons();
}

/* ═══════════════════════════════════════════════════
   Production / Launch / Events Checklists
   ═══════════════════════════════════════════════════ */
function renderChecklist(containerId, group) {
  const checklist = CHECKLISTS[group];
  if (!checklist) return;
  const items = checklist.items;
  const progress = checklistProgress(group, items);
  qs(`#${containerId}`).innerHTML = `
    <div class="checklist-summary">
      <div>
        <span class="eyebrow">${checklist.label}</span>
        <strong>${progress.done}/${progress.total} cleared</strong>
        <p>${progress.pct}% ready — tap cards as proof lands.</p>
      </div>
      <div class="checklist-ring" style="--pct:${progress.pct}%">${progress.pct}%</div>
    </div>
    ${items.map(item => {
      const key = checklistItemKey(item);
      const done = isChecklistDone(group, item);
      return `<button class="checklist-item${done ? ' checked' : ''}" type="button" data-checklist-group="${group}" data-checklist-key="${key}" aria-pressed="${done}">
        <span class="checklist-dot${done ? ' filled' : ''}"></span>
        <div>
          <span class="checklist-label">${item.label}</span>
          <span class="checklist-note">${item.note}</span>
        </div>
      </button>`;
    }).join('')}
  `;

  qsa(`#${containerId} [data-checklist-group]`).forEach(btn => {
    btn.addEventListener('click', () => toggleChecklistItem(btn.dataset.checklistGroup, btn.dataset.checklistKey));
  });
}

function renderProductionReadiness() {
  renderManufacturingBoard();
  renderChecklist('productionChecklist', 'production');
}

function renderManufacturingBoard() {
  const el = qs('#manufacturingBoard');
  if (!el) return;
  const products = getProducts();
  const activeId = state.manufacturingSkuId || state.activeProductId || products[0]?.id;
  const product = getProduct(activeId) || products[0];
  if (!product) return;
  const mfg = { ...clone(MANUFACTURING_TEMPLATE), ...(product.manufacturing || {}) };
  const tier = mfg.evidenceTier || computeManufacturingTier(mfg);
  const score = getManufacturingScore();

  el.innerHTML = `
    <div class="manufacturing-head">
      <div>
        <span class="eyebrow">Manufacturing truth</span>
        <h3>Vendor quotes &amp; PP sample — ${score}/100</h3>
        <p>Factory gate math uses quote + sample proof tiers, not vibes. ${formatEvidenceBadge(tier)} on active SKU.</p>
      </div>
      <div class="manufacturing-nav">
        ${products.map(p => `<button type="button" class="product-nav-btn${p.id === product.id ? ' active' : ''}" data-mfg-sku="${p.id}">${p.name}</button>`).join('')}
      </div>
    </div>
    <form id="manufacturingForm" class="manufacturing-form stack-form" data-product-id="${product.id}">
      <div class="field-row">
        <div class="field"><label>Vendor</label><input name="vendorName" value="${mfg.vendorName}" placeholder="Factory name" /></div>
        <div class="field"><label>Quote ref</label><input name="quoteRef" value="${mfg.quoteRef}" placeholder="RFQ-001" /></div>
        <div class="field"><label>Quote date</label><input name="quoteDate" type="date" value="${mfg.quoteDate}" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>MOQ</label><input name="moq" value="${mfg.moq}" placeholder="150" /></div>
        <div class="field"><label>Landed COGS</label><input name="landedCogs" value="${mfg.landedCogs}" placeholder="C$42" /></div>
        <div class="field"><label>Lead time (days)</label><input name="leadTimeDays" value="${mfg.leadTimeDays}" placeholder="45" /></div>
      </div>
      <div class="field"><label>Quote proof URL</label><input name="quoteUrl" value="${mfg.quoteUrl}" placeholder="Drive PDF or Alibaba thread" /></div>
      <div class="field-row">
        <div class="field"><label>Sample stage</label>
          <select name="sampleStage">
            ${['none', 'ordered', 'lab', 'pp', 'approved'].map(s => `<option value="${s}"${mfg.sampleStage === s ? ' selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Sample proof URL</label><input name="sampleProofUrl" value="${mfg.sampleProofUrl}" placeholder="Photo or lab report link" /></div>
      </div>
      <label class="check-inline"><input type="checkbox" name="ppApproved" ${mfg.ppApproved ? 'checked' : ''} /> PP sample approved for bulk</label>
      <button class="btn-primary compact" type="submit">Save manufacturing proof</button>
    </form>
  `;

  qsa('[data-mfg-sku]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.manufacturingSkuId = btn.dataset.mfgSku;
      renderManufacturingBoard();
      refreshIcons();
    });
  });
  qs('#manufacturingForm')?.addEventListener('submit', saveManufacturing);
}

function saveManufacturing(e) {
  e.preventDefault();
  const form = e.target;
  const productId = form.dataset.productId;
  const product = getProduct(productId);
  if (!product) return;
  const mfg = {
    vendorName: form.vendorName.value.trim(),
    quoteRef: form.quoteRef.value.trim(),
    quoteUrl: form.quoteUrl.value.trim(),
    moq: form.moq.value.trim(),
    landedCogs: form.landedCogs.value.trim(),
    leadTimeDays: form.leadTimeDays.value.trim(),
    quoteDate: form.quoteDate.value,
    sampleStage: form.sampleStage.value,
    sampleProofUrl: form.sampleProofUrl.value.trim(),
    ppApproved: Boolean(form.ppApproved?.checked)
  };
  mfg.evidenceTier = computeManufacturingTier(mfg);
  product.manufacturing = mfg;
  saveState();
  renderManufacturingBoard();
  if (state.activeWorkspace === 'command') renderCommandCenter();
  refreshIcons();
}

function renderLaunchReadiness() {
  renderChecklist('launchChecklist', 'launch');
}

function renderEvents() {
  const tab = state.eventsTab || 'popup';

  qsa('#eventsTabToggle .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  const popupEl = qs('#popupContent');
  const vorgEl = qs('#vorgAfterContent');

  if (tab === 'popup') {
    popupEl.hidden = false;
    vorgEl.hidden = true;
    renderChecklist('popupContent', 'popup');
  } else {
    popupEl.hidden = true;
    vorgEl.hidden = false;
    renderChecklist('vorgAfterContent', 'vorgafter');
  }
}

/* ═══════════════════════════════════════════════════
   City Expansion
   ═══════════════════════════════════════════════════ */
function renderPositioningForecast() {
  const el = qs('#positioningForecast');
  if (!el) return;
  const marketRuntime = window.VORG_MARKET_POSITIONING_RUNTIME;
  const strategyRuntime = window.VORG_STRATEGY_RUNTIME;
  const market = marketRuntime?.result;
  const strategy = strategyRuntime?.result;

  if (!market?.provisionalWinner) {
    el.innerHTML = `
      <div class="positioning-empty">
        <span class="eyebrow">U.S. position forecast</span>
        <h3>No generated market result loaded</h3>
        <p>Run <code>npm run generate:strategy</code> in <code>site/</code>. Forecast output never changes Drop OS GO.</p>
      </div>`;
    return;
  }

  const lead = market.provisionalWinner;
  const coFinalists = market.provisionalWinners || [lead];
  const strategyWinners = strategy?.winnerSet || (strategy?.winner ? [strategy.winner] : []);
  const openUsHardStops = (market.blindSpotGates || []).filter(gate =>
    gate.hardStop && gate.state !== 'cleared-with-evidence' && String(gate.region || '').toUpperCase().includes('US')
  );

  el.innerHTML = `
    <div class="positioning-hero">
      <div>
        <span class="eyebrow">Forecast authority only · ${escapeAttr(market.version)}</span>
        <h3>${escapeAttr(lead.metro)} is the operating lead — not a proven exclusive winner</h3>
        <p>${coFinalists.length} co-finalist${coFinalists.length === 1 ? '' : 's'} sit inside the near-tie rule. No metro-specific search or VORG GA4 evidence is loaded, so the engine keeps the recommendation fragile.</p>
      </div>
      <div class="positioning-score">
        <strong>${Number(lead.posteriorScore).toFixed(1)}</strong>
        <span>forecast / 100</span>
        <small>${Number(lead.confidence).toFixed(1)} confidence · ${escapeAttr(market.rankingStrength)}</small>
      </div>
    </div>
    <div class="positioning-strip">
      <div>
        <span>Market co-finalists</span>
        <strong>${coFinalists.map(candidate => escapeAttr(candidate.metro)).join(' · ')}</strong>
      </div>
      <div>
        <span>Strategy co-winners</span>
        <strong>${strategyWinners.length ? strategyWinners.map(candidate => escapeAttr(candidate.label)).join(' · ') : 'Generate strategy result'}</strong>
      </div>
      <div>
        <span>U.S. hard stops</span>
        <strong>${openUsHardStops.length} open · spend stays locked</strong>
      </div>
    </div>
    <div class="positioning-ranking">
      ${(market.rankedCandidates || []).map((candidate, index) => `
        <div class="positioning-rank-row">
          <span>${index + 1}</span>
          <strong>${escapeAttr(candidate.metro)}</strong>
          <em>${Number(candidate.posteriorScore).toFixed(1)}</em>
          <small>${escapeAttr(candidate.selectionRole || 'challenger')}</small>
        </div>`).join('')}
    </div>
    <p class="positioning-footnote">Prediction can guide a small learning plan. It cannot raise manufacturing proof, financial proof, campaign proof, or Drop OS readiness.</p>
  `;
}

function renderMarketEntryGate() {
  const el = qs('#marketEntryGate');
  if (!el) return;
  const market = getMarketEntry();
  const shopify = market.channels.find(channel => channel.platform === 'Shopify') || {};
  const tiktok = market.channels.find(channel => channel.platform === 'TikTok') || {};
  const metrics = SCORE_ENGINE.calculateMarketEntryMetrics(state.marketEntry || undefined);
  const status = metrics.required
    ? `${metrics.score}/100 · ${metrics.goReady ? 'all market controls linked' : `${metrics.violations.length} controls open`}`
    : 'Not configured · existing domestic plan remains unchanged';

  const proofField = (label, name, value, placeholder) => `
    <div class="field"><label>${label}</label><input name="${name}" value="${escapeAttr(value || '')}" placeholder="${placeholder}" /></div>`;

  el.innerHTML = `
    <div class="manufacturing-head">
      <div>
        <span class="eyebrow">Primary-market gate</span>
        <h3>Route-to-market proof — ${status}</h3>
        <p>Only complete this when a drop changes its primary market. A country name, a platform name, or a creator list alone earns no readiness credit.</p>
      </div>
    </div>
    <form id="marketEntryForm" class="manufacturing-form stack-form">
      <div class="field-row">
        <div class="field"><label>Primary market</label><input name="primaryMarket" value="${escapeAttr(market.primaryMarket)}" placeholder="United States" /></div>
        <div class="field"><label>Operating market</label><input name="operatingMarket" value="${escapeAttr(market.operatingMarket)}" placeholder="Canada" /></div>
        <div class="field"><label>Checkout currency</label><input name="salesCurrency" value="${escapeAttr(market.salesCurrency)}" placeholder="USD" /></div>
      </div>
      <div class="field"><label>Fulfilment model</label><input name="fulfillmentModel" value="${escapeAttr(market.fulfillmentModel)}" placeholder="US 3PL or Canada-to-US DDP carrier" /></div>
      <div class="field-row">
        <label class="check-inline"><input name="popupEnabled" type="checkbox" ${market.popupEnabled ? 'checked' : ''} /> Physical pop-up is part of this plan</label>
        <div class="field"><label>Pop-up city</label><input name="popupCity" value="${escapeAttr(market.popupCity)}" placeholder="Named U.S. city" /></div>
        <div class="field"><label>Pop-up market</label><input name="popupMarket" value="${escapeAttr(market.popupMarket)}" placeholder="United States" /></div>
      </div>
      <details${metrics.required ? ' open' : ''}>
        <summary>Evidence links, channel ownership, and commercial route</summary>
        <div class="field-row">
          ${proofField('Primary-market demand receipt', 'primaryMarketEvidenceUrl', market.primaryMarketEvidenceUrl, 'Dated U.S. demand / selection receipt')}
          ${proofField('USD economics proof', 'marketEconomicsEvidenceUrl', market.marketEconomicsEvidenceUrl, 'Price, fees, FX, and contribution sheet')}
        </div>
        <div class="field-row">
          ${proofField('Fulfilment proof', 'fulfillmentEvidenceUrl', market.fulfillmentEvidenceUrl, 'Carrier / 3PL quote or operating SOP')}
          ${proofField('Cross-border treatment', 'crossBorderEvidenceUrl', market.crossBorderEvidenceUrl, 'Importer, broker, carrier, and Incoterm decision')}
        </div>
        <div class="field-row">
          ${proofField('Duties and tax treatment', 'dutiesAndTaxEvidenceUrl', market.dutiesAndTaxEvidenceUrl, 'Market configuration / specialist review')}
          ${proofField('Shipping promise', 'shippingEvidenceUrl', market.shippingEvidenceUrl, 'Published U.S. shipping policy / test')}
          ${proofField('Returns path', 'returnsEvidenceUrl', market.returnsEvidenceUrl, 'Published U.S. returns policy / operator')}
        </div>
        <div class="field-row">
          ${proofField('Product label + care review', 'productComplianceEvidenceUrl', market.productComplianceEvidenceUrl, 'SKU-level compliance preflight')}
          ${proofField('Privacy + SMS consent review', 'privacyAndConsentEvidenceUrl', market.privacyAndConsentEvidenceUrl, 'US consent and privacy decision')}
          ${proofField('Creator rights + disclosure', 'creatorRightsEvidenceUrl', market.creatorRightsEvidenceUrl, 'UGC release and disclosure control')}
        </div>
        <div class="field-row">
          ${proofField('Pop-up permission plan', 'popupEvidenceUrl', market.popupEvidenceUrl, 'Venue / city permission and run-of-show')}
        </div>
        <div class="field-row">
          <div class="field"><label>Shopify owner</label><input name="shopifyOwner" value="${escapeAttr(shopify.owner || '')}" placeholder="Ecommerce lead" /></div>
          <div class="field"><label>Shopify commercial route</label><input name="shopifyCommerceRoute" value="${escapeAttr(shopify.commerceRoute || '')}" placeholder="Shopify checkout" /></div>
          ${proofField('Shopify attribution evidence', 'shopifyMeasurementEvidenceUrl', shopify.measurementEvidenceUrl, 'Event map / tagged test')}
          ${proofField('Shopify policy evidence', 'shopifyPolicyEvidenceUrl', shopify.policyEvidenceUrl, 'Checkout / policy review')}
        </div>
        <label class="check-inline"><input name="shopifyActive" type="checkbox" ${shopify.active ? 'checked' : ''} /> Shopify is an active commercial channel</label>
        <div class="field-row">
          <div class="field"><label>TikTok owner</label><input name="tiktokOwner" value="${escapeAttr(tiktok.owner || '')}" placeholder="Campaign lead" /></div>
          <div class="field"><label>TikTok commercial route</label><input name="tiktokCommerceRoute" value="${escapeAttr(tiktok.commerceRoute || '')}" placeholder="TikTok to Shopify checkout or TikTok Shop" /></div>
          ${proofField('TikTok attribution evidence', 'tiktokMeasurementEvidenceUrl', tiktok.measurementEvidenceUrl, 'Tagged landing / source map')}
          ${proofField('TikTok policy evidence', 'tiktokPolicyEvidenceUrl', tiktok.policyEvidenceUrl, 'Commercial-content / music review')}
        </div>
        <label class="check-inline"><input name="tiktokActive" type="checkbox" ${tiktok.active ? 'checked' : ''} /> TikTok is an active commercial channel</label>
      </details>
      <button class="btn-primary compact" type="submit">Save market-entry gate</button>
    </form>
  `;
  qs('#marketEntryForm')?.addEventListener('submit', saveMarketEntry);
}

function saveMarketEntry(e) {
  e.preventDefault();
  const form = e.target;
  state.marketEntry = {
    primaryMarket: form.primaryMarket.value.trim(),
    operatingMarket: form.operatingMarket.value.trim(),
    salesCurrency: form.salesCurrency.value.trim(),
    fulfillmentModel: form.fulfillmentModel.value.trim(),
    primaryMarketEvidenceUrl: form.primaryMarketEvidenceUrl.value.trim(),
    marketEconomicsEvidenceUrl: form.marketEconomicsEvidenceUrl.value.trim(),
    fulfillmentEvidenceUrl: form.fulfillmentEvidenceUrl.value.trim(),
    crossBorderEvidenceUrl: form.crossBorderEvidenceUrl.value.trim(),
    dutiesAndTaxEvidenceUrl: form.dutiesAndTaxEvidenceUrl.value.trim(),
    shippingEvidenceUrl: form.shippingEvidenceUrl.value.trim(),
    returnsEvidenceUrl: form.returnsEvidenceUrl.value.trim(),
    productComplianceEvidenceUrl: form.productComplianceEvidenceUrl.value.trim(),
    privacyAndConsentEvidenceUrl: form.privacyAndConsentEvidenceUrl.value.trim(),
    creatorRightsEvidenceUrl: form.creatorRightsEvidenceUrl.value.trim(),
    popupEnabled: Boolean(form.popupEnabled.checked),
    popupCity: form.popupCity.value.trim(),
    popupMarket: form.popupMarket.value.trim(),
    popupEvidenceUrl: form.popupEvidenceUrl.value.trim(),
    channels: [
      {
        platform: 'Shopify', active: Boolean(form.shopifyActive.checked), owner: form.shopifyOwner.value.trim(),
        commerceRoute: form.shopifyCommerceRoute.value.trim(), measurementEvidenceUrl: form.shopifyMeasurementEvidenceUrl.value.trim(),
        policyEvidenceUrl: form.shopifyPolicyEvidenceUrl.value.trim()
      },
      {
        platform: 'TikTok', active: Boolean(form.tiktokActive.checked), owner: form.tiktokOwner.value.trim(),
        commerceRoute: form.tiktokCommerceRoute.value.trim(), measurementEvidenceUrl: form.tiktokMeasurementEvidenceUrl.value.trim(),
        policyEvidenceUrl: form.tiktokPolicyEvidenceUrl.value.trim()
      }
    ]
  };
  saveState();
  renderMarketEntryGate();
  if (state.activeWorkspace === 'command') renderCommandCenter();
  refreshIcons();
}

function renderCityExpansion() {
  renderPositioningForecast();
  renderMarketEntryGate();
  const byCity = new Map(CITIES.map(c => [c, []]));
  state.signals.forEach(sig => {
    const list = byCity.get(sig.city);
    if (list) list.push(sig);
  });
  const cityScores = SCORE_ENGINE.scoreCitySignals(state.signals, CITIES);

  qs('#cityGrid').innerHTML = cityScores.map(({ city, score, count }) => {
    const sigs = byCity.get(city);
    const isHome = city === 'Ottawa/Gatineau';

    return `<div class="city-card">
      <h3 class="city-card-name">${city}</h3>
      <div class="city-card-score">
        <strong>${score}</strong>
        <span>/ 100</span>
      </div>
      <div class="city-card-detail">
        <strong>${count}</strong> signal${count === 1 ? '' : 's'} tracked<br />
        ${isHome ? 'Home wedge — Drop 001 target' : score > 50 ? 'Strong signal — potential next city' : 'Early signal — needs more data'}<br />
        ${sigs.length ? `Strongest: ${sigs.sort((a, b) => b.strength - a.strength)[0].item}` : 'No signals yet'}
      </div>
    </div>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════
   Postmortem
   ═══════════════════════════════════════════════════ */
function renderPostmortem() {
  const stage = state.stages.find(s => s.id === 'postmortem') || state.stages[9];
  const pm = { ...clone(DEFAULT_STATE).postmortem, ...(state.postmortem || {}) };
  const sellThrough = pm.sellThroughPct || (
    pm.unitsSold && pm.unitsPlanned
      ? Math.round((Number(pm.unitsSold) / Number(pm.unitsPlanned)) * 100)
      : ''
  );

  qs('#postmortemContent').innerHTML = `
    <div class="postmortem-section">
      <h3>Gate context</h3>
      <p>January 2027 business-quality gate — ${formatStatus(stage.status)} · ${stage.owner}</p>
      <p class="card-body">${stage.known}</p>
    </div>
    <form id="postmortemForm" class="postmortem-form stack-form">
      <div class="field-row">
        <div class="field">
          <label for="pmRevenueForecast">Revenue forecast (working)</label>
          <input id="pmRevenueForecast" name="revenueForecast" type="text" value="${pm.revenueForecast}" placeholder="e.g. C$28,500" />
        </div>
        <div class="field">
          <label for="pmRevenueActual">Revenue actual</label>
          <input id="pmRevenueActual" name="revenueActual" type="text" value="${pm.revenueActual}" placeholder="After drop closes" />
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="pmUnitsPlanned">Units planned</label>
          <input id="pmUnitsPlanned" name="unitsPlanned" type="number" min="1" value="${pm.unitsPlanned || ''}" />
        </div>
        <div class="field">
          <label for="pmUnitsSold">Units sold</label>
          <input id="pmUnitsSold" name="unitsSold" type="number" min="0" value="${pm.unitsSold}" placeholder="Total across SKUs" />
        </div>
        <div class="field">
          <label for="pmSellThrough">Sell-through %</label>
          <input id="pmSellThrough" name="sellThroughPct" type="number" min="0" max="100" value="${sellThrough}" placeholder="Auto if units filled" />
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="pmMarginTarget">Margin target</label>
          <input id="pmMarginTarget" name="marginTarget" type="text" value="${pm.marginTarget}" placeholder="e.g. 62%" />
        </div>
        <div class="field">
          <label for="pmMarginActual">Margin achieved</label>
          <input id="pmMarginActual" name="marginActual" type="text" value="${pm.marginActual}" placeholder="Landed COGS proof required" />
        </div>
        <div class="field">
          <label for="pmTopSku">Top SKU</label>
          <input id="pmTopSku" name="topSku" type="text" value="${pm.topSku}" placeholder="Highest sell-through" />
        </div>
      </div>
      <div class="field">
        <label for="pmCampaign">Campaign highlight</label>
        <input id="pmCampaign" name="campaignHighlight" type="text" value="${pm.campaignHighlight}" placeholder="Clip, tactic, or channel that moved units" />
      </div>
      <div class="field">
        <label for="pmCityPull">City pull after drop</label>
        <input id="pmCityPull" name="cityPull" type="text" value="${pm.cityPull}" placeholder="Waitlist, next-city signal, pop-up turnout" />
      </div>
      <div class="field">
        <label for="pmVerdict">Verdict</label>
        <select id="pmVerdict" name="verdict">
          <option value="pending"${pm.verdict === 'pending' ? ' selected' : ''}>Pending — drop not closed</option>
          <option value="repeat"${pm.verdict === 'repeat' ? ' selected' : ''}>Repeat — run it back with proof</option>
          <option value="revise"${pm.verdict === 'revise' ? ' selected' : ''}>Revise — fix SKU, price, or ops</option>
          <option value="scale"${pm.verdict === 'scale' ? ' selected' : ''}>Scale — next city / bigger run</option>
        </select>
      </div>
      <div class="field">
        <label for="pmNotes">Team notes</label>
        <textarea id="pmNotes" name="teamNotes" rows="4" placeholder="What surprised you, what broke, what to keep">${pm.teamNotes}</textarea>
      </div>
      <div class="evidence-section">
        <h3>Investor-grade proof tiers</h3>
        <p class="card-body">Mark metrics <strong>Known</strong> only with a proof URL (Shopify export, bank deposit, margin sheet).</p>
        <div class="field-row">
          <div class="field"><label>Revenue proof URL</label><input name="revenueProofUrl" value="${pm.revenueProofUrl}" placeholder="Shopify orders export or bank CSV" /></div>
          <div class="field"><label>Revenue tier</label>
            <select name="revenueTier">${['unresolved', 'assumed', 'known'].map(t => `<option value="${t}"${pm.revenueTier === t ? ' selected' : ''}>${t}</option>`).join('')}</select>
          </div>
        </div>
        <div class="field-row">
          <div class="field"><label>Margin proof URL</label><input name="marginProofUrl" value="${pm.marginProofUrl}" placeholder="Landed COGS worksheet" /></div>
          <div class="field"><label>Margin tier</label>
            <select name="marginTier">${['unresolved', 'assumed', 'known'].map(t => `<option value="${t}"${pm.marginTier === t ? ' selected' : ''}>${t}</option>`).join('')}</select>
          </div>
        </div>
        <div class="field-row">
          <div class="field"><label>Sell-through proof URL</label><input name="sellThroughProofUrl" value="${pm.sellThroughProofUrl}" placeholder="Inventory + sales reconciliation" /></div>
          <div class="field"><label>Sell-through tier</label>
            <select name="sellThroughTier">${['unresolved', 'assumed', 'known'].map(t => `<option value="${t}"${pm.sellThroughTier === t ? ' selected' : ''}>${t}</option>`).join('')}</select>
          </div>
        </div>
        <div class="field-row">
          <div class="field"><label>Verified by</label><input name="verifiedBy" value="${pm.verifiedBy}" placeholder="Finance lead name" /></div>
          <div class="field"><label>Verified at</label><input name="verifiedAt" type="date" value="${(pm.verifiedAt || '').slice(0, 10)}" /></div>
        </div>
      </div>
      <button class="btn-primary compact" type="submit">Save debrief</button>
    </form>
    <div class="postmortem-section">
      <h3>Unresolved</h3>
      <p>${stage.unresolved}</p>
      <p><strong>Next:</strong> ${stage.next}</p>
    </div>
  `;

  qs('#postmortemForm')?.addEventListener('submit', savePostmortem);
}

function savePostmortem(e) {
  e.preventDefault();
  const form = e.target;
  const unitsSold = form.unitsSold.value;
  const unitsPlanned = form.unitsPlanned.value;
  let sellThroughPct = form.sellThroughPct.value;
  if (!sellThroughPct && unitsSold && unitsPlanned) {
    sellThroughPct = String(Math.round((Number(unitsSold) / Number(unitsPlanned)) * 100));
  }
  state.postmortem = {
    revenueForecast: form.revenueForecast.value.trim(),
    revenueActual: form.revenueActual.value.trim(),
    unitsPlanned: unitsPlanned ? clamp(Number(unitsPlanned), 1, 999999) : '',
    unitsSold: unitsSold,
    marginTarget: form.marginTarget.value.trim(),
    marginActual: form.marginActual.value.trim(),
    sellThroughPct,
    topSku: form.topSku.value.trim(),
    campaignHighlight: form.campaignHighlight.value.trim(),
    cityPull: form.cityPull.value.trim(),
    verdict: form.verdict.value,
    teamNotes: form.teamNotes.value.trim(),
    revenueProofUrl: form.revenueProofUrl.value.trim(),
    revenueTier: form.revenueTier.value,
    marginProofUrl: form.marginProofUrl.value.trim(),
    marginTier: form.marginTier.value,
    sellThroughProofUrl: form.sellThroughProofUrl.value.trim(),
    sellThroughTier: form.sellThroughTier.value,
    verifiedBy: form.verifiedBy.value.trim(),
    verifiedAt: form.verifiedAt.value
  };
  saveState();
  renderPostmortem();
  refreshIcons();
}

/* ═══════════════════════════════════════════════════
   Data / Export
   ═══════════════════════════════════════════════════ */
function renderDataExport() {
  renderBackupRitual();
  renderSyncPanel();

  qs('#dataActions').innerHTML = `
    <button class="data-btn" id="newDropBtn" type="button">
      <i data-lucide="plus-circle"></i>
      <span class="data-btn-label">Start next drop</span>
      <span class="data-btn-note">Fresh tracker — snapshot Drop 001 first</span>
    </button>
    <button class="data-btn" id="importBtn" type="button">
      <i data-lucide="upload"></i>
      <span class="data-btn-label">Import stage CSV</span>
      <span class="data-btn-note">Update milestones from a spreadsheet</span>
    </button>
    <button class="data-btn" id="importJsonBtn" type="button">
      <i data-lucide="file-input"></i>
      <span class="data-btn-label">Import snapshot</span>
      <span class="data-btn-note">Restore a teammate's full backup</span>
    </button>
    <button class="data-btn" id="exportBtn" type="button">
      <i data-lucide="download"></i>
      <span class="data-btn-label">Export stage CSV</span>
      <span class="data-btn-note">Milestone tracker for sheets</span>
    </button>
    <button class="data-btn" id="snapshotBtn" type="button">
      <i data-lucide="copy"></i>
      <span class="data-btn-label">Copy snapshot</span>
      <span class="data-btn-note">Full drop state + SKU photos (JSON)</span>
    </button>
    <button class="data-btn" id="downloadSnapshotBtn" type="button">
      <i data-lucide="hard-drive-download"></i>
      <span class="data-btn-label">Download snapshot</span>
      <span class="data-btn-note">Save JSON file to Drive or desktop</span>
    </button>
    <button class="data-btn" id="investorBtn" type="button">
      <i data-lucide="briefcase"></i>
      <span class="data-btn-label">Investor read</span>
      <span class="data-btn-note">Conservative proof summary — not hype</span>
    </button>
    <button class="data-btn danger" id="resetBtn" type="button">
      <i data-lucide="refresh-cw"></i>
      <span class="data-btn-label">Reset Drop 001 demo</span>
      <span class="data-btn-note">Back to sample data</span>
    </button>
  `;

  qs('#newDropBtn').addEventListener('click', () => qs('#newDropDialog').showModal());
  qs('#importBtn').addEventListener('click', () => qs('#csvInput').click());
  qs('#importJsonBtn').addEventListener('click', () => qs('#jsonImportInput').click());
  qs('#exportBtn').addEventListener('click', exportCSV);
  qs('#snapshotBtn').addEventListener('click', copySnapshot);
  qs('#downloadSnapshotBtn').addEventListener('click', downloadSnapshot);
  qs('#investorBtn').addEventListener('click', renderInvestorSnapshot);
  qs('#resetBtn').addEventListener('click', () => {
    if (window.confirm('Reset to Drop 001 demo defaults on this browser?')) {
      state = clone(DEFAULT_STATE);
      state.products = clone(DEFAULT_PRODUCTS);
      state.activeProductId = DEFAULT_PRODUCTS[0].id;
      saveState();
      switchWorkspace('command');
    }
  });

  refreshIcons();
}

function renderSyncPanel() {
  const el = qs('#syncPanel');
  if (!el) return;
  const sync = window.DropOSSync?.getStatus?.() || { mode: 'local' };
  const configured = Boolean(window.DROP_OS_CONFIG?.supabase?.url);
  const last = sync.lastSyncAt
    ? new Date(sync.lastSyncAt).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Not yet';

  let headline = 'Browser-only mode';
  let blurb = 'Copy drop-os-config.example.js → drop-os-config.js and run site/supabase/schema-v2.sql to enable squad sync.';
  let canSync = false;

  if (configured) {
    if (sync.auth === 'member' && sync.mode === 'cloud') {
      headline = 'Squad sync live';
      blurb = `Signed in${sync.userEmail ? ` as ${sync.userEmail}` : ''}. State debounces to Supabase; SKU photos upload to Storage when signed in.`;
      canSync = true;
    } else if (sync.auth === 'needs_invite') {
      headline = 'Invite required';
      blurb = 'You are signed in but not on the drop squad yet. Redeem the invite code from Sign in.';
    } else {
      headline = 'Sign in to sync';
      blurb = 'Drop 001 uses email magic link + squad invite — no shared PIN. SKU photos stay in-browser until you sign in.';
    }
  }

  el.innerHTML = `
    <div class="sync-panel-copy">
      <span class="eyebrow">Squad sync v2</span>
      <h3>${headline}</h3>
      <p>${blurb}</p>
      ${sync.lastError ? `<p class="sync-error">${sync.lastError}</p>` : ''}
      ${sync.conflict ? `<p class="sync-error">Conflict — pull squad state or force your version below.</p>` : ''}
      ${configured && sync.auth !== 'member' ? `<button class="top-btn primary compact" type="button" id="syncSignInBtn">Sign in</button>` : ''}
    </div>
    <div class="sync-panel-status">
      <strong>${canSync ? 'Cloud' : 'Local'}</strong>
      <span>Last sync: ${last}</span>
      ${canSync ? `
        <div class="sync-panel-actions">
          <button class="top-btn outline compact" type="button" id="syncPullBtn">Pull now</button>
          <button class="top-btn primary compact" type="button" id="syncPushBtn">Push now</button>
          ${sync.conflict ? `<button class="top-btn outline compact" type="button" id="syncForceBtn">Force my version</button>` : ''}
        </div>
      ` : ''}
    </div>
  `;

  qs('#syncSignInBtn')?.addEventListener('click', () => window.DropOSAuth?.open?.());
  qs('#syncPullBtn')?.addEventListener('click', async () => {
    await window.DropOSSync?.pullNow?.();
    switchWorkspace(state.activeWorkspace);
  });
  qs('#syncPushBtn')?.addEventListener('click', async () => {
    await window.DropOSSync?.pushNow?.();
    renderSyncPanel();
    renderSyncStatusPill();
    renderSyncConflictBanner();
  });
  qs('#syncForceBtn')?.addEventListener('click', async () => {
    if (!window.confirm('Overwrite the cloud row with this browser state?')) return;
    await window.DropOSSync?.pushForce?.();
    renderSyncPanel();
    renderSyncStatusPill();
    renderSyncConflictBanner();
    switchWorkspace(state.activeWorkspace);
  });
  renderSyncStatusPill();
}

function renderBackupRitual() {
  const el = qs('#backupRitual');
  if (!el) return;
  const backup = state.backup || clone(DEFAULT_STATE).backup;
  const last = backup.lastSnapshotAt ? new Date(backup.lastSnapshotAt) : null;
  const today = new Date().toLocaleDateString('en-CA');
  const backedUpToday = last && last.toLocaleDateString('en-CA') === today;
  const lastLabel = last ? last.toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';

  el.innerHTML = `
    <div class="backup-ritual-copy">
      <span class="eyebrow">Daily backup ritual</span>
      <h3>${backedUpToday ? 'Snapshot done today' : 'Snapshot needed today'}</h3>
      <p>Before you switch laptops, add SKUs, or spin up the next drop: copy a snapshot and drop it in the shared Drive.</p>
    </div>
    <div class="backup-ritual-status ${backedUpToday ? 'done' : 'due'}">
      <strong>${backedUpToday ? 'Done' : 'Due'}</strong>
      <span>Last snapshot: ${lastLabel}</span>
    </div>
  `;
}

function renderInvestorSnapshot() {
  const scores = calculateScores();
  const citySignal = getNextCitySignal();
  const complete = state.stages.filter(s => s.status === 'done').length;
  const rollup = getReadinessRollup();
  const pm = { ...clone(DEFAULT_STATE).postmortem, ...(state.postmortem || {}) };
  const mfgScore = getManufacturingScore();
  const verdictLabels = {
    pending: 'Pending',
    repeat: 'Repeat',
    revise: 'Revise',
    scale: 'Scale'
  };
  const sellThroughDisplay = pm.sellThroughPct
    ? `${pm.sellThroughPct}%`
    : (pm.unitsSold && pm.unitsPlanned
      ? `${Math.round((Number(pm.unitsSold) / Number(pm.unitsPlanned)) * 100)}%`
      : '');

  qs('#investorSnapshot').innerHTML = `
    <div class="investor-header">
      <h2>Investor read</h2>
      <p>Conservative drop proof — ${new Date().toLocaleDateString('en-CA')}. Working scores below; verified metrics need proof URLs.</p>
    </div>
    <div class="investor-section">
      <span class="eyebrow">Working desk scores</span>
      <div class="investor-row"><span class="investor-row-label">Bag check</span><span class="investor-row-value">${formatGateLabel(scores.gate)}</span></div>
      <div class="investor-row"><span class="investor-row-label">Drop energy</span><span class="investor-row-value">${scores.confidence}% ${formatEvidenceBadge('assumed')}</span></div>
      <div class="investor-row"><span class="investor-row-label">Campaign outlook</span><span class="investor-row-value">${scores.campaignIndex}/100 (${formatStatus(scores.campaignBand)}) ${formatEvidenceBadge('assumed')}</span></div>
      <div class="investor-row"><span class="investor-row-label">Edge experiment proof</span><span class="investor-row-value">${scores.edgeScore}/100 · ${scores.edgeValidatedExperiments}/${scores.edgeCompletedExperiments} validated ${formatEvidenceBadge(scores.edgeValidatedExperiments ? 'known' : 'unresolved')}</span></div>
      <div class="investor-row"><span class="investor-row-label">Edge experiment spend</span><span class="investor-row-value">${formatMoney(scores.edgeExperimentSpend)} / ${formatMoney(scores.edgeExperimentBudgetCap)} (${formatStatus(scores.edgeBudgetStatus)})</span></div>
      <div class="investor-row"><span class="investor-row-label">Manufacturing proof</span><span class="investor-row-value">${mfgScore}/100 ${formatEvidenceBadge(mfgScore >= 80 ? 'known' : mfgScore >= 45 ? 'assumed' : 'unresolved')}</span></div>
      <div class="investor-row"><span class="investor-row-label">Checklists</span><span class="investor-row-value">${rollup.pct}% (${rollup.done}/${rollup.total})</span></div>
      <div class="investor-row"><span class="investor-row-label">Launch ops (eff.)</span><span class="investor-row-value">${scores.operationsEffective ?? getOperationsEffective()}</span></div>
      <div class="investor-row"><span class="investor-row-label">Stage progress</span><span class="investor-row-value">${complete} / ${state.stages.length}</span></div>
      <div class="investor-row"><span class="investor-row-label">Proof check</span><span class="investor-row-value">${scores.evidenceFloor}</span></div>
      <div class="investor-row"><span class="investor-row-label">What's giving mid</span><span class="investor-row-value">${scores.bottleneck}</span></div>
      <div class="investor-row"><span class="investor-row-label">Next city signal</span><span class="investor-row-value">${citySignal.city} (${citySignal.score}/100)</span></div>
      <div class="investor-row"><span class="investor-row-label">Risk drag</span><span class="investor-row-value">${scores.riskDrag}</span></div>
      <div class="investor-row"><span class="investor-row-label">Debrief verdict</span><span class="investor-row-value">${verdictLabels[pm.verdict] || 'Pending'}</span></div>
      <div class="investor-row"><span class="investor-row-label">Next spend move</span><span class="investor-row-value">${decisionText(scores.gate)}</span></div>
    </div>
    <div class="investor-section">
      <span class="eyebrow">Verified debrief metrics</span>
      ${investorMetric('Revenue actual', pm.revenueActual, pm.revenueTier, pm.revenueProofUrl)}
      ${investorMetric('Margin achieved', pm.marginActual, pm.marginTier, pm.marginProofUrl)}
      ${investorMetric('Sell-through', sellThroughDisplay, pm.sellThroughTier, pm.sellThroughProofUrl)}
      ${pm.unitsSold ? investorMetric('Units sold', `${pm.unitsSold} / ${pm.unitsPlanned || 'TBD'}`, pm.sellThroughTier, pm.sellThroughProofUrl) : ''}
      ${pm.verifiedBy ? `<div class="investor-row"><span class="investor-row-label">Verified by</span><span class="investor-row-value">${pm.verifiedBy}${pm.verifiedAt ? ` · ${pm.verifiedAt}` : ''}</span></div>` : ''}
    </div>
  `;
}

/* ═══════════════════════════════════════════════════
   CSV Import / Export (preserved from v1)
   ═══════════════════════════════════════════════════ */
function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function exportCSV() {
  const drop = getDrop();
  const header = ['drop', 'city', 'season', 'stage', 'owner', 'status', 'evidence_link', 'gate_score', 'gate_result', 'next_action', 'due_date'];
  const rows = state.stages.map(s => [
    drop.label, drop.city, drop.season,
    `${s.order} ${s.name}`, s.owner, s.status, s.evidence, s.score, s.gate, s.next, ''
  ]);
  const csv = [header, ...rows].map(r => r.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vorg-drop-os-tracker.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], nx = text[i + 1];
    if (ch === '"' && quoted && nx === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && nx === '\n') i++;
      row.push(cell);
      if (row.some(v => v.trim())) rows.push(row);
      row = []; cell = '';
    } else cell += ch;
  }
  row.push(cell);
  if (row.some(v => v.trim())) rows.push(row);
  return rows;
}

function importCSV(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCSV(String(reader.result || ''));
    const [header, ...dataRows] = rows;
    if (!header) return;
    const idx = Object.fromEntries(header.map((n, i) => [n.trim(), i]));
    dataRows.forEach(row => {
      const stageText = row[idx.stage] || '';
      const order = Number(stageText.match(/^\d+/)?.[0]);
      const stage = state.stages.find(s => s.order === order);
      if (!stage) return;
      stage.owner = row[idx.owner] || stage.owner;
      stage.status = row[idx.status] || stage.status;
      stage.evidence = row[idx.evidence_link] || stage.evidence;
      stage.score = Number(row[idx.gate_score]) || stage.score;
      stage.gate = row[idx.gate_result] || stage.gate;
      stage.next = row[idx.next_action] || stage.next;
    });
    saveState();
    switchWorkspace(state.activeWorkspace);
  };
  reader.readAsText(file);
}

function buildSnapshotPayload() {
  const scores = calculateScores();
  const drop = getDrop();
  const currentForecast = getCurrentForecast();
  const forecastCalibration = FORECAST_ENGINE.calculateCalibration(state.forecast?.snapshots || [], 'live');
  const syntheticForecastCalibration = FORECAST_ENGINE.calculateCalibration(state.forecast?.snapshots || [], 'synthetic');
  return {
    snapshotSchemaVersion: 4,
    checked: new Date().toISOString(),
    drop,
    city: drop.city,
    season: drop.season,
    algorithmVersion: scores.version,
    readinessIndex: scores.confidence,
    readinessBand: scores.confidenceBand,
    campaignOutlook: { index: scores.campaignIndex, band: scores.campaignBand, calibratedProbability: false },
    gate: scores.gate,
    scoreBreakdown: {
      evidenceFloor: scores.evidenceFloor,
      evidenceCoverage: scores.evidenceCoverage,
      manufacturingTruth: scores.manufacturingScore,
      financialProof: scores.financialProofScore,
      stageIntegrity: scores.stageScore,
      verifiedDemand: scores.signalHeat,
      campaignProof: scores.tacticScore,
      edgeExperimentProof: scores.edgeScore,
      edgeExperimentLearning: scores.edgeLearningScore,
      riskDrag: scores.riskDrag,
      bottleneck: scores.bottleneck
    },
    spendGate: {
      level: scores.spendAuthorization.level,
      budgetStatus: scores.budgetStatus,
      plannedProductionSpend: scores.plannedProductionSpend,
      productionSpendCap: scores.productionSpendCap,
      bulkReady: scores.bulkReady,
      productionPrerequisitesCleared: scores.productionPrerequisitesCleared,
      hardStops: scores.hardStops,
      approvalCaps: scores.gateCaps
    },
    edgeCommerce: {
      catalogVersion: EDGE_LIBRARY.CATALOG_VERSION,
      sourceCheckDate: EDGE_LIBRARY.CHECKED_ON,
      libraryVersion: SOURCE_LIBRARY.libraryVersion,
      libraryCheckedOn: SOURCE_LIBRARY.checkedOn,
      freeSourceCount: SOURCE_LIBRARY.sources.length,
      atomicClaimCount: SOURCE_LIBRARY.claims.length,
      libraryTruthBoundary: SOURCE_LIBRARY.truthBoundary,
      score: scores.edgeScore,
      learningScore: scores.edgeLearningScore,
      evidenceCoverage: scores.edgeEvidenceCoverage,
      validatedExperiments: scores.edgeValidatedExperiments,
      completedExperiments: scores.edgeCompletedExperiments,
      runningExperiments: scores.edgeRunningExperiments,
      actualSpend: scores.edgeExperimentSpend,
      budgetCap: scores.edgeExperimentBudgetCap,
      budgetStatus: scores.edgeBudgetStatus,
      frontierSpendShare: scores.edgeFrontierSpendShare,
      violations: scores.edgeViolations
    },
    salesForecast: {
      engineVersion: FORECAST_ENGINE.FORECAST_VERSION,
      priorVersion: FORECAST_ENGINE.PRIOR_VERSION,
      readinessIndependent: true,
      currentInput: currentForecast.input,
      current: currentForecast.output,
      calibration: forecastCalibration,
      syntheticTestCalibration: syntheticForecastCalibration,
      frozenForecasts: state.forecast?.snapshots || []
    },
    forecast: state.forecast || clone(DEFAULT_FORECAST_STATE),
    stages: state.stages,
    signals: state.signals,
    tactics: state.tactics,
    edgeExperiments: state.edgeExperiments,
    marketEntry: state.marketEntry || {},
    tasks: state.tasks,
    products: getProducts(),
    activeProductId: state.activeProductId,
    readinessChecks: state.readinessChecks || {},
    backup: state.backup || {},
    syncMeta: state.syncMeta || {},
    postmortem: state.postmortem || {},
    productImages: state.productImages || {},
    productImageMeta: state.productImageMeta || {},
    manufacturingScore: getManufacturingScore()
  };
}

function markSnapshotBackup() {
  state.backup = { ...(state.backup || {}), lastSnapshotAt: new Date().toISOString(), dailyReminder: true };
  saveState();
  renderBackupRitual();
  if (state.activeWorkspace === 'command') renderBackupNudge();
}

async function copySnapshot() {
  markSnapshotBackup();
  const text = JSON.stringify(buildSnapshotPayload(), null, 2);
  qs('#snapshotText').value = text;
  try { await navigator.clipboard.writeText(text); } catch (e) { console.warn('Clipboard write failed.', e); }
  qs('#snapshotDialog').showModal();
  refreshIcons();
}

function downloadSnapshot() {
  markSnapshotBackup();
  const text = JSON.stringify(buildSnapshotPayload(), null, 2);
  const drop = getDrop();
  const slug = (drop.label || `drop-${drop.id}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vorg-drop-os_${slug}_${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
  qs('#snapshotText').value = text;
  qs('#snapshotDialog').showModal();
  refreshIcons();
}

/* ═══════════════════════════════════════════════════
   Signal + Task Forms
   ═══════════════════════════════════════════════════ */
function addSignal(e) {
  e.preventDefault();
  const item = qs('#signalItem').value.trim();
  const source = qs('#signalSource')?.value.trim() || 'Team input';
  const city = qs('#signalCity').value;
  const strength = clamp(Number(qs('#signalStrength').value), 0, 100);
  const evidenceUrl = qs('#signalEvidence')?.value.trim() || '';
  if (!item) return;
  state.signals.push({
    id: `sig-${Date.now()}`, item, city, strength,
    source, evidenceUrl, action: 'Flag for next founder table / heat review.'
  });
  qs('#signalForm').reset();
  qs('#signalStrength').value = 55;
  saveState();
  renderSignalRadar();
  refreshIcons();
}

function addTask(e) {
  e.preventDefault();
  const title = qs('#taskTitle').value.trim();
  const stageId = qs('#taskStage').value;
  if (!title) return;
  const stage = getStage(stageId);
  state.tasks.push({
    id: `task-${Date.now()}`,
    stageId,
    title,
    owner: stage.owner.split('/')[0].trim(),
    done: false
  });
  saveState();
  renderCommandCenter();
  refreshIcons();
}

function toggleTask(id, done) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.done = done;
  saveState();
  renderCommandCenter();
  refreshIcons();
}

function startNewDrop(e) {
  e.preventDefault();
  const label = qs('#newDropLabel').value.trim();
  const city = qs('#newDropCity').value.trim();
  const season = qs('#newDropSeason').value.trim();
  const productionSpendCap = clamp(
    Number(qs('#newDropSpendCap')?.value) || SCORE_ENGINE.DEFAULT_PRODUCTION_SPEND_CAP,
    1,
    SCORE_ENGINE.DEFAULT_PRODUCTION_SPEND_CAP
  );
  const id = label.replace(/\D/g, '') || String(Date.now()).slice(-3);
  const fresh = clone(DEFAULT_STATE);
  fresh.drop = { id, label, city, season, target: '', productionSpendCap };
  fresh.helpSeen = true;
  fresh.productImages = {};
  fresh.products = clone(DEFAULT_PRODUCTS);
  fresh.activeProductId = DEFAULT_PRODUCTS[0].id;
  fresh.signals = [];
  fresh.tasks = fresh.tasks.map(t => ({ ...t, done: false }));
  fresh.stages = fresh.stages.map(s => ({
    ...s,
    status: s.order < 2 ? 'in progress' : 'not started',
    score: s.order < 2 ? s.score : 0,
    gate: 'test'
  }));
  state = fresh;
  saveState();
  qs('#newDropDialog').close();
  switchWorkspace('command');
}

function importJsonSnapshot(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || '{}'));
      const products = normalizeProducts(parsed.products);
      const parsedDrop = typeof parsed.drop === 'object' && parsed.drop
        ? parsed.drop
        : { label: parsed.drop || parsed.label, city: parsed.city, season: parsed.season };
      state = {
        ...clone(DEFAULT_STATE),
        ...parsed,
        products,
        edgeExperiments: normalizeEdgeExperiments(parsed.edgeExperiments),
        drop: { ...clone(DEFAULT_STATE).drop, ...parsedDrop },
        edgeFilters: { ...clone(DEFAULT_STATE).edgeFilters, ...(parsed.edgeFilters || {}) },
        libraryFilters: { ...clone(DEFAULT_STATE).libraryFilters, ...(parsed.libraryFilters || {}) },
        productImageMeta: { ...(parsed.productImageMeta || {}) },
        productImages: migrateProductImages(parsed.productImages, products, parsed.activeProduct),
        activeProductId: resolveActiveProductId(parsed, products),
        readinessChecks: { ...(parsed.readinessChecks || {}) },
        backup: { ...clone(DEFAULT_STATE).backup, ...(parsed.backup || {}) },
        syncMeta: { ...clone(DEFAULT_STATE).syncMeta, ...(parsed.syncMeta || {}) },
        postmortem: { ...clone(DEFAULT_STATE).postmortem, ...(parsed.postmortem || {}) },
        forecast: normalizeForecastState(parsed.forecast || (parsed.salesForecast ? { snapshots: parsed.salesForecast.frozenForecasts } : null)),
        stress: { ...clone(DEFAULT_STATE).stress, ...(parsed.stress || {}) },
        helpSeen: true
      };
      saveState();
      switchWorkspace(state.activeWorkspace || 'command');
    } catch (err) {
      window.alert('Could not read snapshot JSON.');
    }
  };
  reader.readAsText(file);
}

let onboardIndex = 0;

function renderOnboardStep() {
  const step = ONBOARD_STEPS[onboardIndex];
  const body = qs('#onboardBody');
  const nextBtn = qs('#onboardNextBtn');
  if (!step || !body) return;
  body.innerHTML = `<h3>${step.title}</h3><p>${step.body}</p>`;
  if (nextBtn) nextBtn.textContent = onboardIndex === ONBOARD_STEPS.length - 1 ? 'Open drop desk' : 'Next';
}

function showOnboarding() {
  if (state.helpSeen) return;
  onboardIndex = 0;
  renderOnboardStep();
  qs('#onboardDialog')?.showModal();
}

function finishOnboarding() {
  state.helpSeen = true;
  saveState();
  qs('#onboardDialog')?.close();
}

function renderHelpQuick() {
  const el = qs('#helpQuickContent');
  if (!el) return;
  el.innerHTML = `
    <section class="help-block">
      <h3>Every session (2 min)</h3>
      <ol>
        <li><strong>Drop desk</strong> — read bag check + bag lock banner.</li>
        <li>Tap your <strong>gate</strong> → update status, bag check, proof link.</li>
        <li><strong>This week's run</strong> — finish a move or add one for the squad.</li>
      </ol>
    </section>
    <section class="help-block">
      <h3>Drop moves</h3>
      <ul>
        <li><strong>Log heat</strong> — Heat radar → DMs, saves, waitlist, city pull</li>
        <li><strong>SKU pic</strong> — SKU room → sample / hanger / table still</li>
        <li><strong>Search commerce knowledge</strong> — Edge Commerce Lab → Free library → ${SOURCE_LIBRARY.claims.length} claims / ${SOURCE_LIBRARY.sources.length} sources</li>
        <li><strong>Run an edge test</strong> — Edge Commerce Lab → prerequisites, spend cap, receipt, decision</li>
        <li><strong>Range sales</strong> — Forecast Lab → set traffic + SKU assumptions → freeze the pre-launch call → link actuals</li>
        <li><strong>Approve tactic</strong> — Campaign receipts → only when linked proof is real</li>
        <li><strong>Next drop</strong> — Handoff → snapshot first → Start next drop</li>
        <li><strong>Sync squad</strong> — Handoff → CSV or snapshot</li>
      </ul>
    </section>
    <section class="help-block limits">
      <h3>Real talk</h3>
      <p>Local-first by default — export snapshots daily. Add <code>drop-os-config.js</code> for Supabase squad sync. Guru ideas contribute zero proof until tested; working scores are not factory guarantees.</p>
    </section>
  `;
}

/* ═══════════════════════════════════════════════════
   Boot
   ═══════════════════════════════════════════════════ */
function bindEvents() {
  qsa('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchWorkspace(btn.dataset.workspace));
  });

  qs('#signalForm').addEventListener('submit', addSignal);
  qs('#newDropForm')?.addEventListener('submit', startNewDrop);

  document.addEventListener('submit', e => {
    if (e.target?.id === 'taskForm') addTask(e);
    if (e.target?.id === 'productAddForm') addProduct(e);
  });

  document.addEventListener('click', e => {
    const doneBtn = e.target.closest('[data-task-done]');
    if (doneBtn) toggleTask(doneBtn.dataset.taskDone, true);

    const copyBtn = e.target.closest('[data-copy-proof]');
    if (copyBtn) {
      const text = copyBtn.dataset.copyProof || '';
      navigator.clipboard?.writeText(text).catch(() => {});
    }
  });

  qsa('#eventsTabToggle .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.eventsTab = btn.dataset.tab;
      saveState();
      renderEvents();
      refreshIcons();
    });
  });

  qs('#csvInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importCSV(file);
    e.target.value = '';
  });

  qs('#jsonImportInput')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importJsonSnapshot(file);
    e.target.value = '';
  });

  qs('#productImageInput')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file && state.pendingUploadId) {
      handleProductImageUpload(file, state.pendingUploadId);
    }
    e.target.value = '';
  });

  qs('#closeDialogButton').addEventListener('click', () => qs('#snapshotDialog').close());
  qs('#downloadDialogBtn')?.addEventListener('click', downloadSnapshot);
  qs('#helpOpenBtn')?.addEventListener('click', () => {
    renderHelpQuick();
    qs('#helpDialog').showModal();
    refreshIcons();
  });
  qs('#helpCloseBtn')?.addEventListener('click', () => qs('#helpDialog').close());
  qs('#newDropCloseBtn')?.addEventListener('click', () => qs('#newDropDialog').close());
  qs('#onboardSkipBtn')?.addEventListener('click', finishOnboarding);
  qs('#onboardNextBtn')?.addEventListener('click', () => {
    if (onboardIndex >= ONBOARD_STEPS.length - 1) {
      finishOnboarding();
      switchWorkspace('command');
      return;
    }
    onboardIndex += 1;
    renderOnboardStep();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  window.DropOSBridge = {
    getState: () => state,
    setState: (next) => { state = next; },
    refresh: () => switchWorkspace(state.activeWorkspace || 'command')
  };
  window.renderSyncPanel = renderSyncPanel;
  window.renderSyncStatusPill = renderSyncStatusPill;
  window.renderSyncConflictBanner = renderSyncConflictBanner;

  bindEvents();
  renderHelpQuick();
  updateDropMetaUI();
  const ws = state.activeWorkspace || 'command';
  switchWorkspace(ws);
  showOnboarding();

  if (window.DropOSSync?.init) {
    await window.DropOSSync.init();
    if (window.DropOSSync.getStatus().mode === 'cloud') {
      switchWorkspace(state.activeWorkspace || 'command');
    }
    renderSyncStatusPill();
    renderSyncConflictBanner();
  }
});
