'use strict';

/* ═══════════════════════════════════════════════════════════════
   VORG-EAVY Drop OS v2 — Drop desk architecture
   Algorithm: VORG Drop OS score v0.3
   Preserves: localStorage, CSV import/export, snapshot, all state
   ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'vorgDropOS.v1';
const MAX_IMAGE_BYTES = 900000;
const SCORE_ENGINE = window.VorgDropAlgorithm;

if (!SCORE_ENGINE) {
  throw new Error('Drop OS algorithm bundle is missing. Run npm run build:algorithm in site/.');
}

/* ─── Default State ─── */
const DEFAULT_STATE = {
  activeWorkspace: 'command',
  activeStageId: 'campaign-proof',
  activeProductId: 'sku-jacket',
  activeProduct: 0,
  eventsTab: 'popup',
  helpSeen: false,
  drop: {
    id: '001',
    label: 'Drop 001',
    city: 'Ottawa/Gatineau',
    season: 'FW26',
    target: 'September 2026'
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
    { id: 'sig-1', item: 'Founder table breakdown questions', city: 'Ottawa/Gatineau', source: 'Comments, saves, and DMs', strength: 62, action: 'Turn top questions into product-page sections.' },
    { id: 'sig-2', item: 'Montreal next-city pull', city: 'Montreal', source: 'VORG After QR votes', strength: 58, action: 'Capture city rank after pop-up.' },
    { id: 'sig-3', item: 'Structured fit anxiety', city: 'Ottawa/Gatineau', source: 'Fit proof relay', strength: 46, action: 'Shoot 5 body types before final production.' }
  ],
  tactics: [
    { id: 'founder-table', name: 'Founder Table', risk: 'Green', status: 'ready', proof: 'Trust comments, saves, product questions', body: 'Founder explains fit, fabric, construction, corrections, and honest tradeoffs on a table.' },
    { id: 'firm-sightings', name: 'The Firm Sightings', risk: 'Green', status: 'ready', proof: 'Tagged sightings, DMs, consented street photos', body: 'Seed real samples to local connectors who actually wear the product in the city.' },
    { id: 'city-clue-trail', name: 'City Clue Trail', risk: 'Yellow', status: 'draft', proof: 'QR scans by location and city waitlist growth', body: 'Permissioned clue cards or displays at partner locations, with no unsafe rush mechanics.' },
    { id: 'exchange', name: 'The Exchange', risk: 'Yellow', status: 'draft', proof: 'RSVP fill, attendance, exchange receipt, content quality', body: 'Capacity-controlled exchange tied to donation, repair, alteration credit, or priority fitting.' },
    { id: 'hanger-wall', name: 'Empty Hanger Wall', risk: 'Green', status: 'ready', proof: 'Real inventory movement and size-level sell-through', body: 'Hangers leave the wall only when real units are sold, claimed, or picked up.' }
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

const PRODUCT_TEMPLATE = {
  image: 'assets/hero_top.png',
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
  campaign: { crumb: 'Campaign proof', heading: 'Campaign proof', sub: 'Content before bulk — no cap' },
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
    title: 'Prove it before bulk',
    steps: [
      'Approve a tactic only when it\'s real: consented sightings, founder table clips, hanger movement.',
      '<strong>No bulk production</strong> until Campaign Proof clears — content earns the bag first.',
      'Content score ≠ drop energy on the desk. Both matter, different math.'
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
    body: 'You don\'t need every tab. Campaign lives in Campaign proof. Fit + samples in SKU room. Factory quotes in Factory gate. Open your lane — the playbook strip tells you what to do.'
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
  const products = getProducts();
  if (!products.length) return 0;
  const scores = products.map(p => {
    const tier = p.manufacturing?.evidenceTier || computeManufacturingTier(p.manufacturing);
    if (tier === 'known') return 100;
    if (tier === 'assumed') return 58;
    return 22;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function getProductProofScore() {
  const rollup = getManufacturingScore();
  return Math.round(state.stress.product * 0.35 + rollup * 0.65);
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

/* ─── Algorithm (v0.3 — manufacturing + investor tiers) ─── */
function calculateScores() {
  return SCORE_ENGINE.calculateScores({
    stress: state.stress,
    stages: state.stages,
    tactics: state.tactics,
    signals: state.signals,
    operationsEffective: getOperationsEffective(),
    productProofScore: getProductProofScore()
  });
}

function getNextCitySignal() {
  return SCORE_ENGINE.getNextCitySignal(state.signals, 'Ottawa/Gatineau');
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

function getProduct(id) {
  return getProducts().find(p => p.id === id) || getProducts()[0];
}

function getActiveProduct() {
  return getProduct(state.activeProductId);
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
      drop: { ...clone(DEFAULT_STATE).drop, ...(parsed.drop || {}) },
      activeProductId: resolveActiveProductId(parsed, products),
      readinessChecks: { ...(parsed.readinessChecks || {}) },
      backup: { ...clone(DEFAULT_STATE).backup, ...(parsed.backup || {}) },
      syncMeta: { ...clone(DEFAULT_STATE).syncMeta, ...(parsed.syncMeta || {}) },
      postmortem: { ...clone(DEFAULT_STATE).postmortem, ...(parsed.postmortem || {}) },
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
  qs('#cmdCampaignRate').textContent = scores.campaignRate;

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
  if (scores.evidenceFloor < 50) {
    return `Proof check is at ${scores.evidenceFloor}. Need 50+ to unlock small tests and 64+ for GO on major spend. Stack sample proof, vendor quotes, or stronger campaign content.`;
  }
  return `${scores.bottleneck} is the weakest link at ${scores.weakness.value}. Level it up to move the bag check forward.`;
}

function renderAlgorithmBreakdown(scores) {
  if (!scores) scores = calculateScores();
  const versionEl = qs('#cmdAlgorithmVersion');
  if (versionEl) versionEl.textContent = scores.version.replace('VORG Drop OS score ', '');
  qs('#algorithmBreakdown').innerHTML = [
    { label: 'Proof check', value: scores.evidenceFloor, note: 'Lowest of proof, SKU, launch ops' },
    { label: 'Milestone pace', value: scores.stageScore, note: 'Status and gate weighted' },
    { label: 'Market heat', value: scores.signalHeat, note: 'Logged pull + depth' },
    { label: 'Content proof', value: scores.tacticScore, note: 'Approved tactics & readiness' },
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
          <strong>+${lever.deltaConfidence}</strong>
          <small>${lever.current} â†’ ${lever.target} · ${formatGateLabel(lever.projectedGate)}</small>
        </div>
      </article>
    `).join('') : '<p class="card-body">The desk needs new evidence, not slider movement. Add real proof and rerun the gate.</p>'}
  `;
}

function renderStressControls() {
  const wrap = qs('#stressControls');
  const rollup = getReadinessRollup();
  wrap.innerHTML = STRESS_LABELS.map(item => {
    const effective = item.key === 'operations' ? getOperationsEffective() : state.stress[item.key];
    const hint = item.key === 'operations'
      ? `<small class="slider-hint">Effective ${effective} — 65% checklists (${rollup.pct}%) + 35% slider</small>`
      : '';
    return `
    <div class="slider-row">
      <label for="stress-${item.key}">${item.label}</label>
      <input id="stress-${item.key}" type="range" min="0" max="100" value="${state.stress[item.key]}" data-stress-key="${item.key}" />
      <output>${item.key === 'operations' ? effective : state.stress[item.key]}</output>
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

  qs('#signalCityBar').innerHTML = cityScores.map(({ city, score, count }) => {
    return `<div class="city-bar-item">
      <span class="city-bar-name">${city}</span>
      <span class="city-bar-score">${score}</span>
      <span class="city-bar-count">${count} signal${count === 1 ? '' : 's'}</span>
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
function renderCampaignProof() {
  const scores = calculateScores();

  qs('#campaignScoreValue').textContent = scores.tacticScore;

  qs('#campaignGate').innerHTML = `
    <i data-lucide="alert-triangle"></i>
    <span>Hold bulk units until campaign proof clears. Current content score: ${scores.tacticScore}/100 — not a sell-through guarantee.</span>
  `;

  qs('#tacticList').innerHTML = state.tactics.map(tactic => `
    <article class="tactic-card">
      <div>
        <h3>${tactic.name}</h3>
        <p>${tactic.body}</p>
        <div class="tactic-meta">
          <span class="pill">${tactic.risk} risk</span>
          <span class="pill">${tactic.proof}</span>
        </div>
      </div>
      <button class="tactic-action${tactic.status === 'approved' ? ' active' : ''}" type="button" data-tactic-id="${tactic.id}">
        ${tactic.status === 'approved' ? 'Approved' : 'Approve'}
      </button>
    </article>
  `).join('');

  qsa('[data-tactic-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tactic = state.tactics.find(t => t.id === btn.dataset.tacticId);
      tactic.status = tactic.status === 'approved' ? 'draft' : 'approved';
      saveState();
      renderCampaignProof();
      refreshIcons();
    });
  });
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
function renderCityExpansion() {
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
      <div class="investor-row"><span class="investor-row-label">Sell-through vibe</span><span class="investor-row-value">${scores.campaignRate}% ${formatEvidenceBadge('assumed')}</span></div>
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
  return {
    checked: new Date().toISOString(),
    drop,
    city: drop.city,
    season: drop.season,
    algorithmVersion: scores.version,
    confidence: scores.confidence,
    campaignSuccessRate: scores.campaignRate,
    gate: scores.gate,
    scoreBreakdown: {
      evidenceFloor: scores.evidenceFloor,
      stageMomentum: scores.stageScore,
      signalHeat: scores.signalHeat,
      campaignProof: scores.tacticScore,
      riskDrag: scores.riskDrag,
      bottleneck: scores.bottleneck
    },
    stages: state.stages,
    signals: state.signals,
    tactics: state.tactics,
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
  if (!item) return;
  state.signals.push({
    id: `sig-${Date.now()}`, item, city, strength,
    source, action: 'Flag for next founder table / heat review.'
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
  const id = label.replace(/\D/g, '') || String(Date.now()).slice(-3);
  const fresh = clone(DEFAULT_STATE);
  fresh.drop = { id, label, city, season, target: '' };
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
        drop: { ...clone(DEFAULT_STATE).drop, ...parsedDrop },
        productImageMeta: { ...(parsed.productImageMeta || {}) },
        productImages: migrateProductImages(parsed.productImages, products, parsed.activeProduct),
        activeProductId: resolveActiveProductId(parsed, products),
        readinessChecks: { ...(parsed.readinessChecks || {}) },
        backup: { ...clone(DEFAULT_STATE).backup, ...(parsed.backup || {}) },
        syncMeta: { ...clone(DEFAULT_STATE).syncMeta, ...(parsed.syncMeta || {}) },
        postmortem: { ...clone(DEFAULT_STATE).postmortem, ...(parsed.postmortem || {}) },
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
        <li><strong>Approve tactic</strong> — Campaign proof → only when proof is real</li>
        <li><strong>Next drop</strong> — Handoff → snapshot first → Start next drop</li>
        <li><strong>Sync squad</strong> — Handoff → CSV or snapshot</li>
      </ul>
    </section>
    <section class="help-block limits">
      <h3>Real talk</h3>
      <p>Local-first by default — export snapshots daily. Add <code>drop-os-config.js</code> for Supabase squad sync. Working scores, not factory guarantees.</p>
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
