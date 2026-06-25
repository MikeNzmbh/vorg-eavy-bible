'use strict';

const STORAGE_KEY = 'vorgDropOS.v1';

const DEFAULT_STATE = {
  activeStageId: 'campaign-proof',
  activeProduct: 0,
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
      id: 'signal',
      order: 0,
      name: 'Signal',
      owner: 'Founder / signal lead',
      status: 'in progress',
      gate: 'test',
      score: 58,
      evidence: '../research/trend-radar-industry-benchmark.md',
      known: 'Trend radar and industry benchmark exist.',
      assumed: 'Ottawa/Gatineau can generate enough local signal for the first wedge.',
      unresolved: 'Final SKU thesis still needs stronger buyer proof.',
      next: 'Lock final SKU thesis.'
    },
    {
      id: 'concept',
      order: 1,
      name: 'Concept',
      owner: 'Founder / product lead',
      status: 'in progress',
      gate: 'revise',
      score: 54,
      evidence: '../product/README.md',
      known: 'Drop 001 direction is narrowed to three SKUs and 150 planned units.',
      assumed: 'The collection can balance access, polish, and local story.',
      unresolved: 'Second and third SKU paths still need sharper proof.',
      next: 'Confirm the final SKU trio.'
    },
    {
      id: 'sample',
      order: 2,
      name: 'Sample',
      owner: 'Product lead',
      status: 'not started',
      gate: 'test',
      score: 0,
      evidence: '',
      known: 'Tech pack direction is forming.',
      assumed: 'Suppliers can produce a sample that supports the target price.',
      unresolved: 'No approved physical sample yet.',
      next: 'Build tech pack v1 and supplier tracker.'
    },
    {
      id: 'campaign-proof',
      order: 3,
      name: 'Campaign Proof',
      owner: 'Campaign lead',
      status: 'not started',
      gate: 'test',
      score: 0,
      evidence: '../launch/campaign-proof-playbook.md',
      known: 'Real-proof campaign mechanics and red lines are documented.',
      assumed: 'Sample content can create trust before production spend.',
      unresolved: 'No sample proof sprint has been shot yet.',
      next: 'Shoot the 7-day sample proof sprint once samples arrive.'
    },
    {
      id: 'production',
      order: 4,
      name: 'Production',
      owner: 'Production / finance',
      status: 'not started',
      gate: 'test',
      score: 0,
      evidence: '',
      known: 'Planned run is 150 units.',
      assumed: 'MOQ, landed COGS, and timeline will stay inside the working model.',
      unresolved: 'No vendor quote or approved production sample yet.',
      next: 'Quote MOQ, landed COGS, and production calendar.'
    },
    {
      id: 'campaign-build',
      order: 5,
      name: 'Campaign Build',
      owner: 'Campaign lead',
      status: 'not started',
      gate: 'test',
      score: 0,
      evidence: '../launch/drop-001-campaign-board.md',
      known: 'Campaign board defines the first proof tactics.',
      assumed: 'Founder-led content and city mechanics can carry the campaign.',
      unresolved: 'Trailer, cutdowns, model shoots, and content calendar are not built.',
      next: 'Build trailer and short-form content board.'
    },
    {
      id: 'online-drop',
      order: 6,
      name: 'Open Online Drop',
      owner: 'Ecommerce lead',
      status: 'not started',
      gate: 'test',
      score: 0,
      evidence: '../launch/drop-001.md',
      known: 'Launch is open online, not password-gated.',
      assumed: 'Waitlist and release timing can create pressure without blocking access.',
      unresolved: 'Shopify launch state and product pages are not complete.',
      next: 'Build open Shopify launch state.'
    },
    {
      id: 'popup',
      order: 7,
      name: 'Pop-Up',
      owner: 'Event lead',
      status: 'not started',
      gate: 'test',
      score: 0,
      evidence: '../ops/popup-blueprint.md',
      known: 'Pop-up must be controlled, indoor, and permissioned.',
      assumed: 'A safe Ottawa/Gatineau venue can carry day-to-night energy.',
      unresolved: 'Venue, staffing, and run-of-show are not confirmed.',
      next: 'Scout approved venue and capacity.'
    },
    {
      id: 'vorg-after',
      order: 8,
      name: 'VORG After',
      owner: 'Event / campaign',
      status: 'not started',
      gate: 'test',
      score: 0,
      evidence: '',
      known: 'The party closes content and opens the next-city story.',
      assumed: 'A controlled themed night can produce national expansion signal.',
      unresolved: 'Theme, consent flow, and next-city capture are not defined.',
      next: 'Define VORG After theme and city capture.'
    },
    {
      id: 'postmortem',
      order: 9,
      name: 'Postmortem',
      owner: 'Finance / founder',
      status: 'not started',
      gate: 'test',
      score: 0,
      evidence: '',
      known: 'January 2027 is a business-quality gate.',
      assumed: 'Drop data can explain whether to repeat, revise, or scale.',
      unresolved: 'Proof report template still needs final metrics.',
      next: 'Prepare the proof report template.'
    }
  ],
  signals: [
    {
      id: 'sig-1',
      item: 'Founder table breakdown questions',
      city: 'Ottawa/Gatineau',
      source: 'Comments, saves, and DMs',
      strength: 62,
      action: 'Turn top questions into product-page sections.'
    },
    {
      id: 'sig-2',
      item: 'Montreal next-city pull',
      city: 'Montreal',
      source: 'VORG After QR votes',
      strength: 58,
      action: 'Capture city rank after pop-up.'
    },
    {
      id: 'sig-3',
      item: 'Structured fit anxiety',
      city: 'Ottawa/Gatineau',
      source: 'Fit proof relay',
      strength: 46,
      action: 'Shoot 5 body types before final production.'
    }
  ],
  tactics: [
    {
      id: 'founder-table',
      name: 'Founder Table',
      risk: 'Green',
      status: 'ready',
      proof: 'Trust comments, saves, product questions',
      body: 'Founder explains fit, fabric, construction, corrections, and honest tradeoffs on a table.'
    },
    {
      id: 'firm-sightings',
      name: 'The Firm Sightings',
      risk: 'Green',
      status: 'ready',
      proof: 'Tagged sightings, DMs, consented street photos',
      body: 'Seed real samples to local connectors who actually wear the product in the city.'
    },
    {
      id: 'city-clue-trail',
      name: 'City Clue Trail',
      risk: 'Yellow',
      status: 'draft',
      proof: 'QR scans by location and city waitlist growth',
      body: 'Permissioned clue cards or displays at partner locations, with no unsafe rush mechanics.'
    },
    {
      id: 'exchange',
      name: 'The Exchange',
      risk: 'Yellow',
      status: 'draft',
      proof: 'RSVP fill, attendance, exchange receipt, content quality',
      body: 'Capacity-controlled exchange tied to donation, repair, alteration credit, or priority fitting.'
    },
    {
      id: 'hanger-wall',
      name: 'Empty Hanger Wall',
      risk: 'Green',
      status: 'ready',
      proof: 'Real inventory movement and size-level sell-through',
      body: 'Hangers leave the wall only when real units are sold, claimed, or picked up.'
    }
  ],
  tasks: [
    { id: 'task-1', stageId: 'signal', title: 'Lock final SKU thesis.', owner: 'Founder', done: false },
    { id: 'task-2', stageId: 'concept', title: 'Confirm the final SKU trio.', owner: 'Product lead', done: false },
    { id: 'task-3', stageId: 'sample', title: 'Build tech pack v1 and supplier tracker.', owner: 'Product lead', done: false },
    { id: 'task-4', stageId: 'campaign-proof', title: 'Shoot the 7-day sample proof sprint once samples arrive.', owner: 'Campaign lead', done: false },
    { id: 'task-5', stageId: 'production', title: 'Quote MOQ, landed COGS, and production calendar.', owner: 'Production / finance', done: false },
    { id: 'task-6', stageId: 'campaign-build', title: 'Build trailer and short-form content board.', owner: 'Campaign lead', done: false },
    { id: 'task-7', stageId: 'online-drop', title: 'Build open Shopify launch state.', owner: 'Ecommerce lead', done: false },
    { id: 'task-8', stageId: 'popup', title: 'Scout approved venue and capacity.', owner: 'Event lead', done: false },
    { id: 'task-9', stageId: 'vorg-after', title: 'Define VORG After theme and city capture.', owner: 'Event / campaign', done: false },
    { id: 'task-10', stageId: 'postmortem', title: 'Prepare proof report template.', owner: 'Finance / founder', done: false }
  ]
};

const PRODUCTS = [
  {
    name: 'The Firm Jacket',
    units: 36,
    price: 'C$295',
    proof: 'Hero authority item',
    image: 'assets/hero_jacket.png',
    note: 'Needs table breakdown, fit proof, and sample correction evidence before production.'
  },
  {
    name: 'Structured Rib Top',
    units: 84,
    price: 'C$95',
    proof: 'Entry item',
    image: 'assets/hero_top.png',
    note: 'Needs body-type fit relay and wash/shape confidence before product-page copy.'
  },
  {
    name: 'Signature Cap',
    units: 30,
    price: 'C$65',
    proof: 'Access signal',
    image: 'assets/hero_cap.png',
    note: 'Needs real city sightings and inventory movement proof during the pop-up.'
  }
];

const STRESS_LABELS = [
  { key: 'demand', label: 'Demand pull' },
  { key: 'product', label: 'Product proof' },
  { key: 'campaign', label: 'Campaign heat' },
  { key: 'operations', label: 'Ops readiness' },
  { key: 'margin', label: 'Margin room' },
  { key: 'evidence', label: 'Evidence quality' },
  { key: 'risk', label: 'Risk pressure' }
];

let state = loadState();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return clone(DEFAULT_STATE);
    const parsed = JSON.parse(saved);
    return {
      ...clone(DEFAULT_STATE),
      ...parsed,
      stress: { ...clone(DEFAULT_STATE).stress, ...(parsed.stress || {}) }
    };
  } catch (error) {
    console.warn('Could not load saved Drop OS state.', error);
    return clone(DEFAULT_STATE);
  }
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatStatus(value) {
  return value.replace(/-/g, ' ');
}

function getStage(id = state.activeStageId) {
  return state.stages.find((stage) => stage.id === id) || state.stages[0];
}

function calculateScores() {
  const stress = state.stress;
  const weighted =
    stress.demand * 0.2 +
    stress.product * 0.18 +
    stress.campaign * 0.18 +
    stress.operations * 0.15 +
    stress.margin * 0.12 +
    stress.evidence * 0.17;
  const riskPenalty = Math.max(0, stress.risk - 45) * 0.24;
  const confidence = clamp(Math.round(weighted - riskPenalty), 0, 100);
  const campaignRate = clamp(Math.round(22 + confidence * 0.58 + stress.campaign * 0.2 - stress.risk * 0.12), 5, 92);
  const gate = confidence >= 78 ? 'approve' : confidence >= 60 ? 'test' : confidence >= 44 ? 'revise' : 'kill';
  const weakness = STRESS_LABELS
    .filter((item) => item.key !== 'risk')
    .map((item) => ({ label: item.label, value: stress[item.key] }))
    .sort((a, b) => a.value - b.value)[0];

  return { confidence, campaignRate, gate, weakness };
}

function render() {
  renderStageNav();
  renderStageDetail();
  renderMetrics();
  renderProductPreview();
  renderStressControls();
  renderSignals();
  renderTactics();
  renderTaskControls();
  renderTasks();
  refreshIcons();
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderStageNav() {
  const nav = qs('#stageNav');
  nav.innerHTML = state.stages.map((stage) => `
    <button class="stage-nav-button ${stage.id === state.activeStageId ? 'active' : ''}" type="button" data-stage-id="${stage.id}">
      <span class="stage-index">${stage.order}</span>
      <span>
        <span class="stage-nav-title">${stage.name}</span>
        <span class="stage-nav-owner">${stage.owner}</span>
      </span>
      <span class="mini-dot ${stage.status} ${stage.gate}" aria-hidden="true"></span>
    </button>
  `).join('');

  qsa('.stage-nav-button').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeStageId = button.dataset.stageId;
      saveState();
      render();
    });
  });
}

function renderStageDetail() {
  const stage = getStage();
  qs('#stageDetail').innerHTML = `
    <div class="stage-heading">
      <div>
        <p class="eyebrow">Gate ${stage.order}</p>
        <h2>${stage.name}</h2>
        <p>${stage.owner} owns this stage until the gate result is clear and evidence is attached.</p>
      </div>
      <span class="status-badge ${stage.gate}">${formatStatus(stage.gate)}</span>
    </div>

    <div class="stage-controls">
      <div class="field">
        <label for="stageStatus">Status</label>
        <select id="stageStatus">
          ${['not started', 'in progress', 'blocked', 'done'].map((status) => `<option ${stage.status === status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="stageGate">Gate result</label>
        <select id="stageGate">
          ${['test', 'revise', 'approve', 'kill'].map((gate) => `<option ${stage.gate === gate ? 'selected' : ''}>${gate}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="stageScore">Gate score <span id="stageScoreValue">${stage.score}</span></label>
        <input id="stageScore" type="range" min="0" max="100" value="${stage.score}" />
      </div>
    </div>

    <div class="evidence-row">
      <div>
        <h3>Known</h3>
        <p>${stage.known}</p>
      </div>
      <div>
        <h3>Assumed</h3>
        <p>${stage.assumed}</p>
      </div>
      <div>
        <h3>Unresolved</h3>
        <p>${stage.unresolved}</p>
      </div>
    </div>

    <div class="stage-next">
      <i data-lucide="arrow-up-right"></i>
      <div>
        <span>Next action</span>
        <strong>${stage.next}</strong>
      </div>
    </div>
  `;

  qs('#stageStatus').addEventListener('change', (event) => {
    stage.status = event.target.value;
    saveState();
    render();
  });
  qs('#stageGate').addEventListener('change', (event) => {
    stage.gate = event.target.value;
    saveState();
    render();
  });
  qs('#stageScore').addEventListener('input', (event) => {
    stage.score = Number(event.target.value);
    qs('#stageScoreValue').textContent = stage.score;
    saveState();
    renderMetrics();
  });
}

function renderMetrics() {
  const scores = calculateScores();
  const complete = state.stages.filter((stage) => stage.status === 'done').length;
  const city = state.signals
    .slice()
    .sort((a, b) => Number(b.strength) - Number(a.strength))[0]?.city || 'Montreal';

  qs('#metricConfidence').textContent = `${scores.confidence}%`;
  qs('#metricGate').textContent = `${formatStatus(scores.gate)} before major spend`;
  qs('#metricCampaign').textContent = `${scores.campaignRate}%`;
  qs('#metricProgress').textContent = `${complete}/${state.stages.length}`;
  qs('#metricProgressText').textContent = complete === 0 ? 'No stages complete' : `${complete} stages complete`;
  qs('#metricCity').textContent = city;
  qs('#metricCityText').textContent = 'Highest signal strength';
  qs('#stressBadge').className = `status-badge ${scores.gate}`;
  qs('#stressBadge').textContent = formatStatus(scores.gate);
  qs('#decisionText').textContent = decisionText(scores.gate);
  qs('#weaknessText').textContent = scores.weakness.label;
}

function decisionText(gate) {
  if (gate === 'approve') return 'Approve next spend gate';
  if (gate === 'test') return 'Run a controlled test';
  if (gate === 'revise') return 'Revise before spend';
  return 'Kill or rebuild the idea';
}

function renderProductPreview() {
  const product = PRODUCTS[state.activeProduct % PRODUCTS.length];
  qs('#productPreview').innerHTML = `
    <div class="product-shot">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="product-meta">
      <div>
        <p class="eyebrow">${product.proof}</p>
        <h2>${product.name}</h2>
      </div>
      <p>${product.note}</p>
      <div class="proof-kpis">
        <div>
          <span>Units</span>
          <strong>${product.units}</strong>
        </div>
        <div>
          <span>Price</span>
          <strong>${product.price}</strong>
        </div>
        <div>
          <span>Gate</span>
          <strong>Proof</strong>
        </div>
      </div>
    </div>
  `;
}

function renderStressControls() {
  const wrap = qs('#stressControls');
  wrap.innerHTML = STRESS_LABELS.map((item) => `
    <div class="slider-row">
      <label for="stress-${item.key}">${item.label}</label>
      <input id="stress-${item.key}" type="range" min="0" max="100" value="${state.stress[item.key]}" data-stress-key="${item.key}" />
      <output>${state.stress[item.key]}</output>
    </div>
  `).join('');

  qsa('[data-stress-key]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const key = event.target.dataset.stressKey;
      state.stress[key] = Number(event.target.value);
      event.target.nextElementSibling.textContent = event.target.value;
      saveState();
      renderMetrics();
    });
  });
}

function renderSignals() {
  const list = qs('#signalList');
  const sorted = state.signals.slice().sort((a, b) => Number(b.strength) - Number(a.strength));
  list.innerHTML = sorted.map((signal) => `
    <article class="signal-item">
      <div class="signal-item-head">
        <div>
          <h3>${signal.item}</h3>
          <p>${signal.source}</p>
        </div>
        <span class="pill blue">${signal.strength}</span>
      </div>
      <div class="strength-bar" aria-label="Signal strength ${signal.strength}">
        <span style="width: ${clamp(Number(signal.strength), 0, 100)}%"></span>
      </div>
      <div class="signal-meta">
        <span class="pill">${signal.city}</span>
        <span class="pill green">${signal.action}</span>
      </div>
    </article>
  `).join('');
}

function renderTactics() {
  qs('#tacticList').innerHTML = state.tactics.map((tactic) => `
    <article class="tactic-item">
      <div>
        <div class="tactic-item-head">
          <div>
            <h3>${tactic.name}</h3>
            <p>${tactic.body}</p>
          </div>
        </div>
        <div class="tactic-meta">
          <span class="pill ${tactic.risk === 'Green' ? 'green' : 'yellow'}">${tactic.risk} risk</span>
          <span class="pill">${tactic.proof}</span>
        </div>
      </div>
      <button class="tactic-action ${tactic.status === 'approved' ? 'active' : ''}" type="button" data-tactic-id="${tactic.id}">
        ${tactic.status === 'approved' ? 'Approved' : 'Approve'}
      </button>
    </article>
  `).join('');

  qsa('[data-tactic-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const tactic = state.tactics.find((item) => item.id === button.dataset.tacticId);
      tactic.status = tactic.status === 'approved' ? 'draft' : 'approved';
      saveState();
      renderTactics();
    });
  });
}

function renderTaskControls() {
  const options = state.stages.map((stage) => `<option value="${stage.id}">${stage.order} ${stage.name}</option>`).join('');
  const filter = qs('#taskFilter');
  const selected = filter.value || 'all';
  filter.innerHTML = `<option value="all">All stages</option>${options}`;
  filter.value = state.stages.some((stage) => stage.id === selected) ? selected : 'all';
  qs('#taskStageInput').innerHTML = options;
  qs('#taskStageInput').value = state.activeStageId;
}

function renderTasks() {
  const filter = qs('#taskFilter').value || 'all';
  const tasks = state.tasks.filter((task) => filter === 'all' || task.stageId === filter);
  qs('#taskList').innerHTML = tasks.map((task) => {
    const stage = getStage(task.stageId);
    return `
      <article class="task-item">
        <label class="task-check">
          <input type="checkbox" ${task.done ? 'checked' : ''} data-task-check="${task.id}" />
          <span>
            <span class="task-title ${task.done ? 'done' : ''}">${task.title}</span>
            <span class="task-meta">${stage.name} - ${task.owner}</span>
          </span>
        </label>
        <button class="delete-task" type="button" data-task-delete="${task.id}" aria-label="Delete task">
          <i data-lucide="trash-2"></i>
        </button>
      </article>
    `;
  }).join('');

  qsa('[data-task-check]').forEach((input) => {
    input.addEventListener('change', () => {
      const task = state.tasks.find((item) => item.id === input.dataset.taskCheck);
      task.done = input.checked;
      saveState();
      renderTasks();
    });
  });

  qsa('[data-task-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      state.tasks = state.tasks.filter((item) => item.id !== button.dataset.taskDelete);
      saveState();
      renderTasks();
    });
  });

  refreshIcons();
}

function addSignal(event) {
  event.preventDefault();
  const item = qs('#signalItem').value.trim();
  const city = qs('#signalCity').value;
  const strength = clamp(Number(qs('#signalStrength').value), 0, 100);
  if (!item) return;
  state.signals.push({
    id: `sig-${Date.now()}`,
    item,
    city,
    strength,
    source: 'Team input',
    action: 'Review in next signal meeting.'
  });
  qs('#signalForm').reset();
  qs('#signalStrength').value = 55;
  saveState();
  renderSignals();
  renderMetrics();
}

function addTask(event) {
  event.preventDefault();
  const title = qs('#taskTitleInput').value.trim();
  const stageId = qs('#taskStageInput').value;
  if (!title) return;
  state.tasks.push({
    id: `task-${Date.now()}`,
    stageId,
    title,
    owner: getStage(stageId).owner,
    done: false
  });
  qs('#taskTitleInput').value = '';
  saveState();
  renderTasks();
}

function exportCSV() {
  const header = ['drop', 'city', 'season', 'stage', 'owner', 'status', 'evidence_link', 'gate_score', 'gate_result', 'next_action', 'due_date'];
  const rows = state.stages.map((stage) => [
    'Drop 001',
    'Ottawa/Gatineau',
    'FW26',
    `${stage.order} ${stage.name}`,
    stage.owner,
    stage.status,
    stage.evidence,
    stage.score,
    stage.gate,
    stage.next,
    ''
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vorg-drop-os-tracker.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function importCSV(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCSV(String(reader.result || ''));
    const [header, ...dataRows] = rows;
    if (!header) return;
    const index = Object.fromEntries(header.map((name, i) => [name.trim(), i]));
    dataRows.forEach((row) => {
      const stageText = row[index.stage] || '';
      const order = Number(stageText.match(/^\d+/)?.[0]);
      const stage = state.stages.find((item) => item.order === order);
      if (!stage) return;
      stage.owner = row[index.owner] || stage.owner;
      stage.status = row[index.status] || stage.status;
      stage.evidence = row[index.evidence_link] || stage.evidence;
      stage.score = Number(row[index.gate_score]) || stage.score;
      stage.gate = row[index.gate_result] || stage.gate;
      stage.next = row[index.next_action] || stage.next;
    });
    saveState();
    render();
  };
  reader.readAsText(file);
}

async function copySnapshot() {
  const scores = calculateScores();
  const snapshot = {
    checked: new Date().toISOString(),
    drop: 'Drop 001',
    city: 'Ottawa/Gatineau',
    confidence: scores.confidence,
    campaignSuccessRate: scores.campaignRate,
    gate: scores.gate,
    stages: state.stages,
    signals: state.signals,
    tactics: state.tactics,
    tasks: state.tasks
  };
  const text = JSON.stringify(snapshot, null, 2);
  qs('#snapshotText').value = text;
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.warn('Clipboard write failed.', error);
  }
  qs('#snapshotDialog').showModal();
}

function bindEvents() {
  qs('#cycleProductButton').addEventListener('click', () => {
    state.activeProduct = (state.activeProduct + 1) % PRODUCTS.length;
    saveState();
    renderProductPreview();
    refreshIcons();
  });
  qs('#signalForm').addEventListener('submit', addSignal);
  qs('#taskForm').addEventListener('submit', addTask);
  qs('#taskFilter').addEventListener('change', renderTasks);
  qs('#exportButton').addEventListener('click', exportCSV);
  qs('#importButton').addEventListener('click', () => qs('#csvInput').click());
  qs('#csvInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) importCSV(file);
    event.target.value = '';
  });
  qs('#snapshotButton').addEventListener('click', copySnapshot);
  qs('#closeDialogButton').addEventListener('click', () => qs('#snapshotDialog').close());
  qs('#resetButton').addEventListener('click', () => {
    const shouldReset = window.confirm('Reset the Drop OS demo data on this browser?');
    if (!shouldReset) return;
    state = clone(DEFAULT_STATE);
    saveState();
    render();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  render();
});
