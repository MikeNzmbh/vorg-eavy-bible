import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const assetDir = join(root, 'launch', 'assets', 'fall-drop-launch-report');
const repoOutput = join(root, 'strategy', 'artifacts', 'VORG_100K_August_2027_Growth_Dossier.html');
const userOutputDir = 'C:/Users/mbaho/Documents/Codex/2026-08-22/referenced-chatgpt-conversation-this-is-an/outputs';
const userOutput = join(userOutputDir, 'VORG_100K_August_2027_Growth_Dossier.html');

const img = name => `data:image/jpeg;base64,${readFileSync(join(assetDir, name)).toString('base64')}`;
const images = {
  campaign: img('campaign-burgundy.jpg'),
  denim: img('denim-concept.jpg'),
  jacketFront: img('jacket-black-front.jpg'),
  jacketBack: img('jacket-black-back.jpg'),
  scarfBurgundy: img('scarf-burgundy.jpg'),
  scarfEspresso: img('scarf-espresso.jpg'),
  topBlack: img('top-black.jpg'),
  topWhite: img('top-white.jpg')
};

const tag = (label, cls = '') => `<span class="tag ${cls}">${label}</span>`;
const note = (label, text) => `<div class="truth"><b>${label}</b><span>${text}</span></div>`;
const stat = (value, label, sub = '') => `<div class="stat"><strong>${value}</strong><span>${label}</span>${sub ? `<small>${sub}</small>` : ''}</div>`;
const bars = rows => `<div class="bars">${rows.map(([label, value, max, suffix = '']) => `<div class="bar-row"><span>${label}</span><i><b style="width:${Math.min(100, value / max * 100)}%"></b></i><strong>${value}${suffix}</strong></div>`).join('')}</div>`;
const ladder = rows => `<div class="ladder">${rows.map((row, index) => `<div class="rung" style="--i:${index}"><b>${row[0]}</b><span>${row[1]}</span></div>`).join('')}</div>`;
const flow = rows => `<div class="flow">${rows.map((row, index) => `<div class="flow-node"><em>${String(index + 1).padStart(2, '0')}</em><b>${row[0]}</b><span>${row[1]}</span></div>`).join('<div class="arrow">→</div>')}</div>`;
const grid = rows => `<div class="card-grid">${rows.map(row => `<article><span>${row[0]}</span><h3>${row[1]}</h3><p>${row[2]}</p></article>`).join('')}</div>`;
const table = (headers, rows, cls = '') => `<div class="table-wrap ${cls}"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const source = (label, url) => `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`;

const pages = [
  {
    kicker: 'VORG-EAVY / FOUNDER DOSSIER / 22 AUG 2026',
    title: 'THE 100K<br><span>AUGUST</span><br>MACHINE',
    dek: 'A 55-page operating system for 85% sell-through, 45–50% compounding, founder pay, omnichannel demand and a C$100,000 August 2027 month.',
    theme: 'cover',
    visual: `<div class="cover-collage"><img src="${images.campaign}" alt="Burgundy VORG campaign concept"><img src="${images.jacketFront}" alt="The Firm Jacket front concept"><img src="${images.denim}" alt="Denim concept"></div>`,
    body: `<div class="cover-meta">${tag('U.S. PRIMARY')}${tag('BROOKLYN LEAD HYPOTHESIS')}${tag('GOAL-SEEKING / PROOF-GATED', 'orange')}</div>`
  },
  {
    kicker: '01 / THE ANSWER',
    title: 'Build the house<br>every 40 days.',
    dek: 'The winner is not one platform. It is a controlled compounding rhythm.',
    body: `${grid([
      ['DESIRE', 'Instagram + TikTok', 'Instagram makes the world desirable. TikTok makes it move. Both lead to one product truth.'],
      ['BELIEF', 'Creators + founder YouTube', 'Governed UGC supplies social trust. Founder-led media explains the garment, price and decisions.'],
      ['INTENT', 'Google + Pinterest + Shop', 'Quiet discovery surfaces capture what social attention would otherwise leak.'],
      ['CLOSE', 'Shopify + CRM', 'Fast PDPs, fit proof, checkout, email, SMS and post-purchase turn attention into retained demand.']
    ])}<p class="manifesto">Plan capacity to 50% growth. Authorize the next buy only at the 45% floor after 85% sell-through, contribution, size, supplier, channel and cash gates clear.</p>`
  },
  {
    kicker: '02 / OUTCOME CONTRACT',
    title: 'The destination<br>does not move.',
    dek: 'The plan bends. The founder target stays fixed.',
    visual: `<div class="stat-row">${stat('C$100K', 'August 2027 reconciled net sales')}${stat('85%', 'Sold through inside 30 days')}${stat('45–50%', 'Growth between eligible releases')}${stat('C$3K', 'Monthly founder-pay cash envelope')}</div>`,
    body: `${note('KNOWN GOAL', 'U.S.-first demand, monthly-to-six-week replenishment, seasonal new pieces and occasional filler.')}${note('WORKING INTERPRETATION', 'C$100k means calendar-month net sales—not cumulative GMV, tax collected or platform-attributed overlap. C$3k is treated as the total monthly corporate cash envelope until confirmed.')}${note('NOT PROVEN', 'VORG has no settled launch history. The engine draws the eligible path and replaces assumptions with receipts after every release.')}`
  },
  {
    kicker: '03 / AMBITION WITH CONTROL',
    title: 'Dream big.<br>Bet in waves.',
    dek: 'Ambition chooses the mountain. Evidence chooses the next foothold.',
    visual: ladder([
      ['C$10K', 'Proof machine capital'],
      ['DROP 001', 'Real product + real tracking'],
      ['85% / 30D', 'Scale eligibility'],
      ['45–50%', 'Next capacity step'],
      ['AUGUST', 'C$100k+ month']
    ]),
    body: `<p>The engine does not lower the goal because receipts are missing. It converts missing receipts into a specific research or proof action. The first buy learns. The second release tests repeatability. Each later release earns a larger position.</p><p>That is the hedge-fund translation done correctly: information changes bet size; owner capital never masquerades as demand; a losing signal can shrink the position.</p>`
  },
  {
    kicker: '04 / THE BACKSOLVE',
    title: 'Eight releases.<br>One August window.',
    dek: 'A 10-week cadence reaches cumulative milestones but arrives too slowly for the new calendar-month goal.',
    visual: flow([
      ['08 NOV', 'Proof'], ['18 DEC', 'Repeat'], ['27 JAN', 'Fit'], ['08 MAR', 'Spring'], ['17 APR', 'Direct'], ['27 MAY', 'Scale'], ['06 JUL', 'Runway'], ['15 AUG', 'Moment']
    ]),
    body: `<p>Forty days sits inside the founder's month-to-month-and-a-half rhythm. It places Release 8 on August 15. A front-loaded sales curve recognizes most of the August release inside the calendar month while a final slice of the July release contributes early-August revenue.</p>${note('CONTROL', 'The date is a capacity plan. A missed sample, QC, demand or fulfilment gate delays the release rather than creating fake stock or compressed quality.')}`
  },
  {
    kicker: '05 / SALES CURVE',
    title: 'Make the first<br>14 days matter.',
    dek: 'The August target depends on launch velocity, not only 30-day totals.',
    visual: bars([['Days 0–6', 55, 55, '%'], ['Days 7–13', 22, 55, '%'], ['Days 14–20', 13, 55, '%'], ['Days 21–29', 10, 55, '%']]),
    body: `<p>The planning curve assigns 77% of 30-day net sales to the first two weeks, 13% to week three and 10% to the final nine days. It is a target shape, not a VORG observation.</p><p>Drop 001 must record daily net units, stockouts, cancellations, refunds, size waitlists and channel source. That real product-age curve replaces this planning shape before the engine is trusted at scale.</p>`
  },
  {
    kicker: '06 / 45% FLOOR',
    title: 'The floor clears<br>the month.',
    dek: 'At 85% sell-through and 40-day cadence, the lower approved growth track reaches about C$112k in August.',
    visual: `${stat('C$112,387', 'Modeled August net sales')}${stat('989', 'Approx. August net orders')}${stat('1,698', 'Release 8 inventory units')}`,
    body: table(['Release', 'Date', 'Units', '30-day net sales'], [
      ['01', '08 Nov', '126', 'C$9,738'], ['02', '18 Dec', '183', 'C$14,144'], ['03', '27 Jan', '265', 'C$20,482'], ['04', '08 Mar', '384', 'C$29,679'], ['05', '17 Apr', '557', 'C$43,050'], ['06', '27 May', '808', 'C$62,450'], ['07', '06 Jul', '1,171', 'C$90,506'], ['08', '15 Aug', '1,698', 'C$131,237']
    ], 'compact')
  },
  {
    kicker: '07 / 50% TARGET',
    title: 'The target creates<br>the buffer.',
    dek: 'Plan teams, creative and supply to 50%. Release purchase orders only when the 45% floor is earned.',
    visual: `${stat('C$142,331', 'Modeled August net sales')}${stat('1,253', 'Approx. August net orders')}${stat('2,153', 'Release 8 inventory units')}`,
    body: `<p>The 50% path is not a promise to order 2,153 units. It is the capacity envelope the business must be able to support if receipts keep clearing. Its extra C$42k above the goal absorbs a slower August curve, channel variance or weaker product mix.</p>${note('AUTHORITY', 'The lower bound of the demand interval—not the headline point forecast—must cover the proposed buy.')}`
  },
  {
    kicker: '08 / AUGUST COMPOSITION',
    title: 'July creates the runway.<br>August collects it.',
    dek: 'The C$100k month is not a single-day miracle.',
    visual: `<div class="split-viz"><div><b>JUL 06</b><strong>Release 7</strong><span>audience growth · stock/size proof · August waitlist</span></div><div class="plus">+</div><div class="accent"><b>AUG 15</b><strong>Release 8</strong><span>front-loaded 17 calendar days</span></div></div>`,
    body: `<p>July freezes the August demand range, creative matrix, source-deduped channel order ledger, cash waterfall, supplier capacity and fulfilment plan. The August purchase order is not placed because the calendar says so; it becomes eligible because July proves it.</p><p>Launch-day screenshots are not the end. Returns, customer service and September working capital remain on the August scorecard.</p>`
  },
  {
    kicker: '09 / FOUNDER PAY',
    title: 'Pay the founder.<br>Protect the engine.',
    dek: 'Separate personal liquidity from inventory liquidity.',
    visual: `<div class="versus"><article><span>ROUTE A</span><h3>Cash-gated</h3><p>Pay C$3k only after the next PO, protected cash and floor survive. Deferred months remain recorded.</p></article><article class="accent"><span>ROUTE B / RECOMMENDED IF PAY IS FIXED</span><h3>Protected bridge</h3><p>C$11,465 for the 45% floor or C$12,258 for the 50% target.</p></article></div>`,
    body: `<p>Paying C$3,000 before Drop 001 leaves C$7,000—below the C$8,412 modeled launch commitment plus the C$1,500 bank floor. The bridge can be founder capital, a documented shareholder loan, supplier terms or a professionally reviewed demand-capture mechanism. It never counts as revenue.</p>`
  },
  {
    kicker: '10 / CASH WATERFALL',
    title: 'Every dollar<br>has an order.',
    dek: 'Profit on paper is not free cash.',
    visual: ladder([
      ['01', 'Sales tax · duties · refunds · chargebacks'],
      ['02', 'Landed COGS + next approved PO'],
      ['03', 'C$1,500 floor + operating commitments'],
      ['04', 'Founder C$3,000 envelope'],
      ['05', 'Evidence-backed growth experiments'],
      ['06', 'Year-end dividend after clearance']
    ]),
    body: `${note('DIVIDEND LOCK', 'No cash dividend before month 12. Month 12 still does not create an automatic dividend: tax, payables, returns, next PO, accountant review and director solvency control.')}${note('TAX CONTINGENCY', 'The model protects 15% of positive operating contribution as a planning reserve. It is not a calculated liability.')}`
  },
  {
    kicker: '11 / WORKING UNIT ECONOMICS',
    title: 'Five pieces.<br>One economic truth.',
    dek: 'Vendor quotes and approved samples will replace every working cost.',
    visual: `<div class="product-strip"><img src="${images.jacketFront}" alt="Jacket"><img src="${images.denim}" alt="Denim"><img src="${images.scarfEspresso}" alt="Scarf"><img src="${images.topBlack}" alt="Top"></div>`,
    body: table(['Product', 'Role', 'Units', 'Price', 'Landed COGS'], [
      ['Firm Jacket', 'Hero', '12', 'C$249', 'C$85'], ['Women’s low-rise denim', 'Core', '24', 'C$128', 'C$38'], ['Men’s denim', 'Core', '20', 'C$128', 'C$38'], ['Scarf', 'Entry', '40', 'C$35', 'C$12'], ['Top / bodysuit', 'Seasonal', '30', 'C$68', 'C$18']
    ], 'compact')
  },
  {
    kicker: '12 / ASSORTMENT ARCHITECTURE',
    title: 'Restock the proof.<br>Add newness with taste.',
    dek: 'Growth does not mean multiplying every SKU evenly.',
    visual: `<div class="donut"><div style="--p:70"><b>70%</b><span>Hero + core</span></div><div style="--p:22"><b>22%</b><span>Seasonal</span></div><div style="--p:8"><b>8%</b><span>Filler / entry</span></div></div>`,
    body: `<ul class="big-list"><li>65–75% proven hero/core replenishment by SKU-size velocity.</li><li>15–25% seasonal pieces that preserve image, fit and margin grammar.</li><li>0–10% filler; never used to hide weak hero demand.</li><li>No new category if it breaks the 85% goal, cash turn or content capacity.</li></ul>`
  },
  {
    kicker: '13 / REPLENISHMENT LOGIC',
    title: 'A sellout can<br>hide lost demand.',
    dek: 'Stockouts censor the evidence. Dead sizes trap cash.',
    visual: grid([
      ['SELL', 'Settled unit velocity', 'Daily net units by product age, SKU and size.'],
      ['LOSE', 'Lost-demand proxy', 'Out-of-stock PDP views, cart failures and size waitlists.'],
      ['RETURN', 'Fit truth', 'Too small, too big, quality, expectation and remorse reasons.'],
      ['BUY', 'Risk-adjusted quantity', 'Margin, salvage, stockout cost, demand range and cash-at-risk.']
    ]),
    body: `<p>The next order uses a downside-risk newsvendor decision. “Sold out” is not automatically good; an early stockout can mean the brand under-bought a size, while aggregate 85% can hide a dead tail.</p>`
  },
  {
    kicker: '14 / PREDICTION ENGINE',
    title: 'Eleven engines.<br>One maturity ladder.',
    dek: 'Borrow the best ideas from markets, forecasting and causal science—only when VORG data can support them.',
    visual: grid([
      ['NOW', 'Nowcast + scenarios', 'Public signals, macro, supply, search and bottom-up order capacity.'],
      ['EARLY', 'Bayes + hazard + newsvendor', 'Small-data updating, time-to-sell and quantity decisions.'],
      ['GROW', 'Bandits + ensembles', 'Controlled exploration and reconciled SKU/drop/month forecasts.'],
      ['LATER', 'Causal lift + MMM', 'Incrementality and portfolio budgets after powered history.']
    ]),
    body: `<p>The advanced system is not one magic score. It is a sequence that prevents overfitting: simple methods remain in the contest, uncertainty is visible, source correlation is discounted, and negative receipts can shrink the bet.</p>`
  },
  {
    kicker: '15 / HEDGE-FUND TRANSLATION',
    title: 'Information changes<br>position size.',
    dek: 'The fund mindset is useful when it governs risk—not when it imitates expensive data theatre.',
    visual: flow([
      ['NOWCAST', 'Refresh public/macro/supplier state'], ['CHANNEL CHECK', 'Founder calls + dated memos'], ['EDGE', 'Evidence grade + similarity'], ['POSITION', 'Fractional budget/PO'], ['KILL', 'Pre-committed reversal rule']
    ]),
    body: `<p>VORG’s own Shopify cohort becomes the highest-coverage transaction panel for its business. Manual pop-up counts replace inaccessible foot-traffic panels. Supplier turnaround, MOQ flexibility and production answers become channel checks. Paid hedge-fund data, satellite imagery and unauthorized scraping remain out.</p>`
  },
  {
    kicker: '16 / BAYESIAN SMALL-DATA LAYER',
    title: 'Start wide.<br>Earn precision.',
    dek: 'A posterior is an updated belief—not certainty wearing a formula.',
    visual: `<div class="bayes"><div><span>PRIOR</span><b>Public mechanism + plan</b><small>wide uncertainty</small></div><div class="arrow">+</div><div><span>RECEIPT</span><b>VORG order / return / size</b><small>dated and settled</small></div><div class="arrow">=</div><div class="accent"><span>POSTERIOR</span><b>Updated range</b><small>still honest</small></div></div>`,
    body: `<p>After the first 30 settled orders, update conversion, return and size-rate distributions. After two drops and 100+ orders, pool related products/sizes hierarchically while preserving real differences. Never let one viral post collapse the interval.</p>`
  },
  {
    kicker: '17 / TIME-TO-SELL ENGINE',
    title: 'Forecast when,<br>not only how much.',
    dek: 'The founder target is explicitly a 30-day outcome.',
    visual: `<svg class="chart" viewBox="0 0 800 300" role="img" aria-label="Sell-through curve"><path d="M60 250 H760 M60 250 V30"/><path class="target" d="M60 230 C180 130 300 85 450 62 C560 46 660 40 740 38"/><path class="floor" d="M60 250 L740 50"/><text x="650" y="32">85%</text><text x="680" y="278">DAY 30</text></svg>`,
    body: `<p>A survival/hazard model estimates the probability of crossing 85% by day 30 and identifies where velocity changes. It uses product age, SKU/size availability, channel mix, price, content events and stockout censoring.</p><p>The first version is a simple empirical curve. Complexity arrives only after out-of-sample improvement.</p>`
  },
  {
    kicker: '18 / NEWSVENDOR + KELLY',
    title: 'Quantity is<br>a risk decision.',
    dek: 'Expected revenue is not enough. Cash ruin and leftover risk matter.',
    visual: `<div class="risk-scale"><div><b>UNDERBUY</b><span>lost margin · lost customer · weak launch pressure</span></div><i></i><div><b>OVERBUY</b><span>cash trapped · markdown pressure · brand dilution</span></div></div>`,
    body: `<p>The newsvendor layer chooses the demand quantile using unit contribution, leftover salvage and stockout cost. A downside-risk cap protects the C$1,500 floor. Fractional-Kelly logic then sizes only part of the estimated edge because fashion probabilities are noisy.</p>${note('RULE', 'No full-Kelly inventory or ad bet. The C$5k–C$6k first-production ceiling wins over a score.')}`
  },
  {
    kicker: '19 / CONSTRAINED BANDIT',
    title: 'Explore without<br>burning the drop.',
    dek: 'Thompson sampling belongs after enough attributable orders—not before launch.',
    visual: `<div class="allocation"><div style="--w:82"><b>80–90%</b><span>Exploit qualified winners</span></div><div class="accent" style="--w:18"><b>10–20%</b><span>Explore new creator/creative cells</span></div></div>`,
    body: `<p>At 300+ attributable orders with stable tracking, the engine can sample among qualified creative/creator cells. Reward equals retained incremental contribution, not clicks or platform ROAS. Brand, legal, frequency and total-spend constraints stay hard.</p>`
  },
  {
    kicker: '20 / CAUSAL + MMM',
    title: 'Attribution is a claim.<br>Lift is a test.',
    dek: 'Each platform can claim the same customer. The engine refuses to add them.',
    visual: flow([
      ['HOLDOUT', 'Customer or market control'], ['COUNTERFACTUAL', 'What likely happened without spend'], ['INCREMENT', 'Added settled orders'], ['CALIBRATE', 'Later MMM priors'], ['ALLOCATE', 'Portfolio budget']
    ]),
    body: `<p>Bayesian structural time-series or geo/holdout tests activate only when a credible control and enough statistical power exist. Google Meridian-style MMM waits for 52+ weekly observations with meaningful channel/spend variation. Prelaunch MMM is blocked.</p>`
  },
  {
    kicker: '21 / ACTIVATION LADDER',
    title: 'The model grows<br>with the company.',
    dek: 'Sophistication is earned by receipts.',
    visual: table(['Stage', 'Trigger', 'Active layer'], [
      ['0', 'No sales', 'Nowcast · scenarios · bottom-up capacity'], ['1', '30+ settled orders + full curve', 'Bayes · hazard baseline · return reasons'], ['2', '2 drops + 100+ orders', 'Hierarchical pooling · newsvendor · cohorts'], ['3', '300+ attributable orders', 'Constrained bandit · interval calibration'], ['4', 'Credible control', 'Causal lift'], ['5', '52+ varied weeks', 'MMM · reconciled ensemble']
    ], 'compact'),
    body: `<p>The current truth is Stage 0. The deck shows later engines so the data is collected correctly now—not to pretend they are already calibrated.</p>`
  },
  {
    kicker: '22 / EVIDENCE LADDER',
    title: 'A like is not<br>a purchase.',
    dek: 'Budget authority rises only with evidence quality.',
    visual: ladder([
      ['0 · IDEA', 'Founder instinct / one trend → watch'], ['1 · PRIOR', 'Official/academic/company mechanism → small test'], ['2 · INTENT', 'Qualified PDP / size waitlist / price DM → capped proof'], ['3 · TRANSACTION', 'Settled order / deposit / POS → replenishment candidate'], ['4 · CONTRIBUTION', 'After returns + all variable cost → scale candidate'], ['5 · CAUSAL REPEAT', 'Repeat cohort / holdout / two-drop proof → portfolio scale']
    ]),
    body: `<p>Owner cash, gifted units, collected tax and platform-attributed duplicates never raise sell-through or revenue. Cancelled/refunded orders reverse. A goal allocation never gets relabeled as a forecast.</p>`
  },
  {
    kicker: '23 / CHANNEL PORTFOLIO',
    title: 'Nine acquisition owners.<br>Zero double counting.',
    dek: 'The 50% target path assigns 1,253 August orders as coverage jobs—not forecasts.',
    visual: bars([['Owned CRM', 22, 22, '%'], ['Creator / affiliate', 18, 22, '%'], ['TikTok', 14, 22, '%'], ['Meta paid', 14, 22, '%'], ['Instagram organic', 12, 22, '%'], ['Google intent', 8, 22, '%'], ['YouTube', 4, 22, '%'], ['Pinterest', 3, 22, '%'], ['Offline / earned', 5, 22, '%']]),
    body: `<p>No borrowed or paid platform should own more than 25% of acquisition by August. One order receives one acquisition source; views, assists and retargeting touches live in separate columns.</p>`
  },
  {
    kicker: '24 / INSTAGRAM — ROLE',
    title: 'Instagram becomes<br>a first-class engine.',
    dek: 'Not a TikTok repost folder. Not an aesthetic scrapbook.',
    visual: grid([
      ['REELS', 'Discovery', 'Trial Reels where available; non-follower reach plus qualified downstream intent.'],
      ['CAROUSELS', 'Consideration', 'Fit, movement, details, founder reasoning, price/size/shipping truth.'],
      ['STORIES', 'Control room', 'Polls, questions, countdown, stock-by-size, customer receipts and service.'],
      ['DM', 'Research + close', 'Tagged objections, size/price intent and service—never spam.']
    ]),
    body: `<p>Organic Instagram owns 12% of the August acquisition job; Meta paid owns a separate 14%. The same creative may feed both, but spend, source and marginal contribution remain distinct.</p>`
  },
  {
    kicker: '25 / INSTAGRAM — FRANCHISES',
    title: 'Four series.<br>Infinite episodes.',
    dek: 'Recognizable formats reduce creative chaos without making the brand repetitive.',
    visual: `<div class="poster-grid"><article><b>THE PIECE</b><span>silhouette · motion · styling</span></article><article><b>THE DECISION</b><span>fabric · cut · price · tradeoff</span></article><article><b>THE CITY</b><span>people · place · proof</span></article><article><b>THE ORIGINAL</b><span>customer · creator · identity</span></article></div>`,
    body: `<p>Weekly batch: one clean product-proof Reel, one founder/story Reel and one native social Reel; one save-worthy carousel; daily Stories only when they carry real information. Score on qualified PDP visits, saves, shares, DMs, checkout and settled orders—not reach alone.</p>`
  },
  {
    kicker: '26 / TIKTOK',
    title: 'Discovery meets<br>search intent.',
    dek: 'TikTok keeps its speed, but gains commerce discipline.',
    visual: flow([
      ['HOOK', 'Buyer tension in the first seconds'], ['PROOF', 'Fit · detail · use · founder truth'], ['SEARCH', 'Customer language + product attributes'], ['CLOSE', 'Exact PDP / waitlist / LIVE'], ['RECEIPT', 'Order after returns + fees']
    ]),
    body: `<p>Organic is the rapid-format lab. Search is a separate keyword/query lane. Shop/LIVE becomes a marketplace decision with a channel-specific catalog, fees, returns, inventory reservation and price. Commercial music and branded-content disclosure receive a pre-publish check.</p>`
  },
  {
    kicker: '27 / FOUNDER YOUTUBE',
    title: 'Depth compounds<br>after the feed moves on.',
    dek: 'Founder media should make price and product understandable—not apologize for either.',
    visual: grid([
      ['SERIES 01', 'Building The Firm', 'Weekly operating truth.'], ['SERIES 02', 'Why This Piece Exists', 'Fabric, cut, price and choice.'], ['SERIES 03', 'The Sample Table', 'Failures, revisions and proof.'], ['SERIES 04', 'City Proof / Debrief', 'People, pop-up, receipts and next move.']
    ]),
    body: `<p>One episode becomes Shorts, Reels, TikToks, Pinterest clips, PDP video, email sections and stills. Native title/thumbnail tests use watch-time share where eligible. “No winner” is an acceptable result when impressions are insufficient.</p>`
  },
  {
    kicker: '28 / CREATOR PORTFOLIO',
    title: 'Build a network.<br>Not a gifting pile.',
    dek: 'Creators are creative partners, trust brokers and measurable acquisition cells.',
    visual: `<div class="creator-mix">${stat('40%', 'Product / fit communicators')}${stat('25%', 'City / culture connectors')}${stat('20%', 'Visual world builders')}${stat('10%', 'Adjacent creators')}${stat('5%', 'Experiments')}</div>`,
    body: `<p>Every relationship logs selection logic, audience/market hypothesis, gift/payment, disclosure, deliverables, rights/whitelisting, music, link/code, units, content, settled orders, returns and customer quality. No scripted praise. No undisclosed gifts. No follower-count revenue forecast.</p>`
  },
  {
    kicker: '29 / GOOGLE',
    title: 'Make every product<br>machine-readable.',
    dek: 'Free listings can reach Search, Images, Lens, YouTube, Shopping and other eligible surfaces.',
    visual: flow([
      ['SHOPIFY', 'Canonical SKU/variant truth'], ['MERCHANT', 'Feed approval + diagnostics'], ['SCHEMA', 'Product · price · availability'], ['SEARCH', 'Brand + non-brand intent'], ['ORDER', 'Settled new customer']
    ]),
    body: `<p>Launch the technical store/feed truth early enough to fix errors. Reconcile product/variant URLs, title, type, size/gender, imagery, price, availability, shipping and returns. Free listings precede paid Shopping; visibility is never guaranteed.</p><p>Google Trends remains relative direction: save the query, term/topic choice, geo, period, category and CSV.</p>`
  },
  {
    kicker: '30 / PINTEREST + SHOP',
    title: 'Quiet channels<br>keep working.',
    dek: 'Evergreen visual search and conversational product discovery diversify platform risk.',
    visual: `<div class="versus"><article><span>PINTEREST</span><h3>Visual intent</h3><p>Catalog, vertical product/styling/detail assets, boards built from customer language and exact PDP paths.</p></article><article class="accent"><span>SHOP</span><h3>Product discovery</h3><p>Accurate titles, descriptions, imagery, price, shipping markets, shoppable posts and post-purchase follow-up.</p></article></div>`,
    body: `<p>Both inherit Shopify's canonical product truth. Neither receives made-up reviews, false availability or a separate brand identity. The engine measures outbound/product sessions, saves, assisted touches and settled acquisition orders separately.</p>`
  },
  {
    kicker: '31 / EMAIL + SMS',
    title: 'Attention becomes<br>an owned asset.',
    dek: 'The first flows matter more than sending constant newsletters.',
    visual: flow([
      ['WELCOME', 'World + interest capture'], ['PROOF', 'Sample / fit / price'], ['LAUNCH', 'Timing + stock truth'], ['POST', 'Fit · care · review · UGC'], ['RETURN', 'Restock · seasonal · cohort']
    ]),
    body: `<p>Email and SMS consent stay separate and provable. Canada-facing commercial messages require CASL consent, identification and unsubscribe. U.S. SMS needs vendor/legal review. A referral page captures the referred person's own consent instead of auto-messaging uploaded contacts.</p>`
  },
  {
    kicker: '32 / THE MISSED CHANNELS',
    title: 'Test the edges.<br>Protect the core.',
    dek: 'Not every channel deserves production or a sales quota on day one.',
    visual: table(['Lane', 'Job', 'Gate'], [
      ['Facebook Reels', 'Cheap approved-video reuse', 'No dedicated production before customer quality'], ['Threads', 'Founder POV / conversation', 'No quota before tagged orders'], ['Reddit', 'Manual listening / transparent participation', 'No automation or disguised promotion'], ['Snapchat', 'Audience-specific reuse', 'First-party age/market evidence'], ['Discord / WhatsApp', 'Requested utility / community', 'Real demand + moderation'], ['PR / stylists', 'Earned proof / pulls', 'Track inventory, rights, placement and orders'], ['Marketplaces', 'Selective reach', 'DTC margin, tax, returns and brand control']
    ], 'compact'),
    body: ''
  },
  {
    kicker: '33 / ONE-SHOOT MULTIPLICATION',
    title: 'One production day.<br>A month of proof.',
    dek: 'Every shoot has an asset contract before the camera turns on.',
    visual: `<div class="asset-wheel"><div class="hub">ONE<br>SHOOT</div>${['PDP','REELS','TIKTOK','YOUTUBE','PINS','EMAIL','PAID','ARCHIVE'].map((x,i)=>`<span style="--a:${i*45}deg">${x}</span>`).join('')}</div>`,
    body: `<p>Required outputs: clean front/back/detail/movement; fit/model measurements; founder explanation; native vertical hooks; a long-form episode; carousels/Stories; catalog/search crops; email/post-purchase modules; rights-cleared paid variants; VORGEAVY archive.</p><p>VHS and direct-flash texture are accents. Clean garment evidence remains mandatory.</p>`
  },
  {
    kicker: '34 / WEEKLY OPERATING RHYTHM',
    title: 'Research Monday.<br>Receipt Friday.',
    dek: 'The content system is a decision loop, not a posting calendar.',
    visual: flow([
      ['MON', 'Inventory · cash · curve · search'], ['TUE', '3 hypotheses + creative cells'], ['WED', 'Publish native + sync catalog'], ['THU', 'Quality read + objections'], ['FRI', 'Orders · contribution · decision']
    ]),
    body: `<p>Friday ends in one dated decision: scale, hold, revise or kill. Paid distribution remains founder-controlled. A view spike cannot win if PDP intent or retained contribution deteriorates.</p>`
  },
  {
    kicker: '35 / RELEASE STORY ARC',
    title: 'A drop is a story.<br>Not a date.',
    dek: 'Each 40-day cycle has a narrative and an operating job.',
    visual: ladder([
      ['T−30', 'Signal, sample and founder thesis'], ['T−21', 'Fit/material proof + interest capture'], ['T−14', 'Creator/clean assets + product truth'], ['T−7', 'Price, size, shipping, countdown'], ['T', 'Open DTC release'], ['T+7', 'Velocity / stock-by-size'], ['T+14', '50% trajectory'], ['T+21', '70% trajectory'], ['T+30', '85% + contribution gate']
    ]),
    body: `<p>Scarcity comes from honest capacity. No fake countdown, fake queue, fake customer or hidden delivery condition. Sold-out pages capture size/restock demand and preserve the archive.</p>`
  },
  {
    kicker: '36 / SHOPIFY CLOSE LAYER',
    title: 'The PDP must sell<br>as hard as the film.',
    dek: 'Content creates a promise. The product page resolves every buying objection.',
    visual: grid([
      ['SEE', 'Decisive visual proof', 'Front, back, detail, movement, styling.'], ['FIT', 'Measurements + comparison', 'Model and garment facts; later fit learning.'], ['TRUST', 'Material + construction', 'Care, claim, sample and quality truth.'], ['BUY', 'Price + delivery', 'USD/CAD, duties/tax, shipping, returns, checkout.']
    ]),
    body: `<p>Mobile speed, accelerated checkout and product/feed consistency are growth work. Relevant complete-the-look modules can raise basket size; irrelevant cross-sells dilute trust. Every variant, purchase and refund event is verified before paid scale.</p>`
  },
  {
    kicker: '37 / MEASUREMENT HIERARCHY',
    title: 'Loud is not<br>the same as growing.',
    dek: 'Metrics move from attention to retained economics.',
    visual: ladder([
      ['ATTENTION', 'Reach · watch · saves · shares'], ['INTENT', 'PDP · size · waitlist · checkout'], ['TRANSACTION', 'Settled net orders'], ['CONTRIBUTION', 'After returns + variable cost'], ['QUALITY', 'Repeat · low return · referral'], ['CAUSAL', 'Incremental lift']
    ]),
    body: `<p>The operating dashboard can show all layers, but purchase orders and scale budgets respond to the lower layers. Platform ROAS remains a diagnostic claim until reconciled with Shopify transactions and, later, causal tests.</p>`
  },
  {
    kicker: '38 / ATTRIBUTION CONTRACT',
    title: 'Count the customer once.',
    dek: 'Separate acquisition, assistance and discovery.',
    visual: `<div class="attribution"><div><span>TIKTOK VIEW</span></div><div><span>IG SAVE</span></div><div><span>GOOGLE CLICK</span></div><div class="accent"><b>ONE ORDER</b><small>one acquisition source</small></div><div><span>ASSISTS</span></div></div>`,
    body: `<p>Use transaction ID, UTM/code, customer identity rules and a post-purchase “How did you first hear about us?” answer. Keep first-touch, last-touch and assisted rows. Never sum every platform's purchase column.</p><p>When powered, holdouts estimate what would have happened without the channel.</p>`
  },
  {
    kicker: '39 / COHORT + RETURNS',
    title: 'The second purchase<br>is the hidden winner.',
    dek: 'A channel that buys one high-return order can be worse than a smaller high-quality cohort.',
    visual: table(['Cohort question', 'Receipt'], [
      ['Who came back?', 'First-to-second purchase rate and time'], ['Who spent more?', 'Cumulative net AOV / contribution'], ['Who returned?', 'SKU-size-reason by creator/channel'], ['Who referred?', 'Referral lineage and retained order'], ['Who went direct?', 'Direct/brand/owned share by release']
    ], 'compact'),
    body: `<p>Shopify cohort reporting becomes the in-house transaction panel. The engine ranks channels and creators by retained customer quality, not only first-order CAC.</p>`
  },
  {
    kicker: '40 / TAX + PAYROLL',
    title: 'Tax cash is<br>not growth cash.',
    dek: 'Protect the business by naming every tax question early.',
    visual: grid([
      ['CANADA', 'GST/HST exports', 'Qualifying exports can be zero-rated when conditions and evidence are met.'], ['PAYROLL', 'Founder salary', 'Payroll deductions/remittances and T4 treatment need setup.'], ['DIVIDEND', 'Year-end only', 'T5/classification and lawful distributable surplus require accountant review.'], ['U.S.', 'State + federal', 'Nexus, physical events, inventory/3PL and trade/business exposure require advice.']
    ]),
    body: `<p>The model's 15% income-tax contingency is a protected planning reserve, not a tax calculation. It does not settle corporate tax, credits, payroll, state sales tax or cross-border income treatment.</p>`
  },
  {
    kicker: '41 / CROSS-BORDER GATE',
    title: 'USD revenue needs<br>USD contribution truth.',
    dek: 'Brooklyn demand is irrelevant if duties, returns and fulfilment erase the margin.',
    visual: `<div class="door"><article><span>DOOR A</span><h3>Canada → U.S. DDP</h3><p>Carrier/broker duty, delivery promise, return path and export evidence.</p></article><div>OR</div><article class="accent"><span>DOOR B</span><h3>U.S. 3PL</h3><p>Importer, inventory nexus, pick/pack, storage, return and cash timing.</p></article></div>`,
    body: `<p>Choose the door with quotes. Set founder-approved USD prices from per-SKU contribution; never spot-convert CAD and call it strategy. Confirm HS code, origin, entered value, duty layers, broker, product compliance and customer-facing duties/returns before scale.</p>`
  },
  {
    kicker: '42 / SUPPLIER CADENCE',
    title: 'Forty days requires<br>a faster supply truth.',
    dek: 'A marketing calendar cannot outrun sample, QC and inbound reality.',
    visual: flow([
      ['FORECAST', 'SKU-size range'], ['RESERVE', 'Fabric / trim / capacity'], ['WAVE 1', 'Proof quantity'], ['READ', 'Day 7–14 signal'], ['WAVE 2', 'Reorder if eligible'], ['QC/INBOUND', 'No compressed truth']
    ]),
    body: `<p>Negotiate reorder lead time, material reservation, split-wave MOQ, QC slot, shipping method and failure remedy before growth. The first PO cap remains C$5k–C$6k. A factory “yes” is not proof; quote, sample, measurement, test and shipment artifact control.</p>`
  },
  {
    kicker: '43 / TEAM CAPACITY',
    title: 'The first bottleneck<br>may be the founder.',
    dek: 'Eight releases plus content, service, supply and finance need explicit ownership.',
    visual: grid([
      ['FOUNDER', 'Taste + product + camera', 'Final brand, product, budget and PO authority.'], ['OPS', 'Inventory + supplier + fulfilment', 'First contractor/hire trigger when weekly WIP breaks.'], ['GROWTH', 'Creative ops + measurement', 'Asset matrix, creators, feeds, source ledger, Friday decision.'], ['SERVICE', 'Fit + returns + community', 'Fast answer, reason capture and customer-content consent.']
    ]),
    body: `<p>Trigger help before Release 5 if customer response, content delivery, inventory reconciliation or supplier communication misses its service standard. Growth that destroys founder judgment is not compounding.</p>`
  },
  {
    kicker: '44 / FAILURE MODES',
    title: 'The engine knows<br>how it can break.',
    dek: 'Every failure has an early signal and a designed response.',
    visual: table(['Failure', 'Early signal', 'Designed fix'], [
      ['Traffic, no orders', 'Reach ↑ / PDP flat', 'Buyer/problem/creative/PDP continuity'], ['Orders, no contribution', 'Returns/fees erase ROAS', 'Fix fit/price/ship/fee; stop scale'], ['Inventory outruns demand', 'Audience capacity flat', 'Hold PO; build source order coverage'], ['Salary starves PO', 'Cash below commitment', 'Gate or bridge'], ['Creative fatigue', 'Marginal CAC deteriorates', 'New cells / creator rotation'], ['Platform shock', '>25% dependency', 'Owned/search/direct diversification'], ['Supplier slip', 'Lead time > cadence', 'Split wave / reserve / delay'], ['Forecast vanity', 'Inputs edited after result', 'Freeze/version/publish error']
    ], 'compact'),
    body: ''
  },
  {
    kicker: '45 / FOUNDER DASHBOARD',
    title: 'One screen.<br>Five truths.',
    dek: 'The cockpit should make the next constraint obvious.',
    visual: `<div class="dashboard">${stat('SELL', 'Day 3/7/14/21/30 curve')}${stat('SIZE', 'Stockout + return reasons')}${stat('CASH', 'Available after protected')}${stat('SOURCE', 'One acquisition owner')}${stat('NEXT', 'Gate + required receipt')}</div>`,
    body: `<p>Daily at launch: net units/net sales by SKU-size, stockouts, checkout exceptions, refunds, contribution and available cash. Weekly: new/returning quality, marginal CAC, creative/creator decisions, direct/owned/search share, supplier/PO state, salary/tax cash and forecast error.</p>`
  },
  {
    kicker: '46 / NEXT 30 DAYS',
    title: 'Turn ambiguity<br>into contracts.',
    dek: 'The engine is built. Now replace the highest-leverage unknowns.',
    visual: `<ol class="numbered"><li>Confirm what the C$3k salary means and choose cash gate vs bridge.</li><li>Replace COGS with quotes; choose Door A/B; build USD contribution.</li><li>Build Shopify/GA4/feed/consent/source data contract.</li><li>Run identical Brooklyn/Chicago/LA/Atlanta product-size-price research.</li><li>Lock creator rights/disclosure/music contract.</li><li>Lock four creative franchises and one-shoot asset contract.</li></ol>`,
    body: ''
  },
  {
    kicker: '47 / DAYS 31–60',
    title: 'Make the proof<br>machine launchable.',
    dek: 'Product, supply, data and customer truth converge.',
    visual: `<ol class="numbered"><li>Approve PP samples and size curves—or delay.</li><li>Soft technical Shopify/Google/Shop/Pinterest launch with truthful inventory states.</li><li>Build product/size/market waitlist and post-purchase survey.</li><li>Produce first full product-proof shoot and founder episode.</li><li>Secure 40-day supplier reorder/material/QC capacity.</li><li>Build accountant, tax, broker and state-nexus tracker.</li></ol>`,
    body: ''
  },
  {
    kicker: '48 / DAYS 61–90',
    title: 'Freeze the call.<br>Then earn the launch.',
    dek: 'Do not tune the prediction after the outcome.',
    visual: `<ol class="numbered"><li>Freeze Drop 001 demand range and cash waterfall.</li><li>Run controlled creative/landing tests with founder-set caps.</li><li>Confirm U.S. fulfilment, returns, duties and customer-facing truth.</li><li>Confirm service, packaging, inventory and incident plan.</li><li>Launch only after sample, production, inbound, QC, demand and market-entry gates clear.</li><li>Publish the day-30 error and update one assumption at a time.</li></ol>`,
    body: ''
  },
  {
    kicker: '49 / STUDY PEERS',
    title: 'Borrow mechanisms.<br>Never borrow receipts.',
    dek: 'External growth makes a tactic testable—not a VORG forecast.',
    visual: table(['Brand / case', 'Observed mechanism', 'VORG translation'], [
      ['Scuffers', 'Rapid drops, daily data, direct traffic, online proof before retail', '40-day rhythm + daily dashboard + pop-up after digital proof'], ['Chubbies', 'Lifestyle world, owned list, customer content', 'The Firm franchises + customer-content loop'], ['Represent', 'Founder/product ladder', 'Founder YouTube + product truth'], ['Corteiz', 'Participatory city energy', 'Permitted, controlled, real proof'], ['Telfar', 'Time-boxed preorder', 'Transparent demand capture / split-wave option'], ['Hermès / Jacquemus / Nude / Jaded / EME', 'Craft, world, community, hero, drop event', 'Selective synthesis; no scale imitation']
    ], 'compact'),
    body: `<p>Shopify reports Scuffers at 225% year-over-year and Chubbies at 50% in their respective cases. Those numbers demonstrate that fast product/data and community/world mechanisms can coexist with growth; they are not used as v3 forecast rates.</p>`
  },
  {
    kicker: '50 / CANADA QUEUE',
    title: 'Expand from proof.<br>Not from convenience.',
    dek: 'U.S. is primary. Canada remains a sequenced second engine.',
    visual: flow([
      ['ONTARIO', 'First Canadian demand cluster'], ['QUEBEC', 'French/localization + QST truth'], ['VANCOUVER', 'West-coast demand/fulfilment'], ['HALIFAX', 'Later cultural/community proof']
    ]),
    body: `<p>Every market enters through the same algorithm: search/demand signal → product/size/price intent → settled contribution → permitted physical proof. Ottawa is not the launch focus. Canada-specific tax, language, shipping and creator consent remain explicit.</p>`
  },
  {
    kicker: '51 / SOURCES — CHANNELS',
    title: 'Primary channel<br>evidence.',
    dek: 'Checked 22 August 2026. Platform claims remain mechanism evidence.',
    body: `<div class="sources">
      <p>${source('Meta — Trial Reels', 'https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/')}</p>
      <p>${source('TikTok — supported Shopify events', 'https://ads.tiktok.com/help/article/supported-events-shopify')}</p>
      <p>${source('TikTok — Search Ads Campaign', 'https://ads.tiktok.com/business/en-GB/blog/introducing-search-ads-campaign')}</p>
      <p>${source('YouTube — title/thumbnail A/B testing', 'https://support.google.com/youtube/answer/16391400')}</p>
      <p>${source('YouTube Shopping', 'https://support.google.com/youtube/answer/12257682')}</p>
      <p>${source('Google Merchant Center — free listings', 'https://support.google.com/merchants/answer/13889434')}</p>
      <p>${source('Google Search — Product structured data', 'https://developers.google.com/search/docs/appearance/structured-data/product')}</p>
      <p>${source('Pinterest — Path to Performance', 'https://business.pinterest.com/en-ca/pdf/pinterest-presents/path-to-performance/')}</p>
      <p>${source('Shopify — cohort analysis', 'https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/customers-reports')}</p>
      <p>${source('Shopify — Shop customer discovery', 'https://help.shopify.com/en/manual/online-sales-channels/shop/customer-experience')}</p>
      <p>${source('GA4 — ecommerce events', 'https://support.google.com/analytics/answer/9267735')}</p>
    </div>`
  },
  {
    kicker: '52 / SOURCES — PREDICTION',
    title: 'Research behind<br>the engine.',
    dek: 'Methods are activated only at the stated data thresholds.',
    body: `<div class="sources">
      <p>${source('M5 Accuracy Competition', 'https://www.sciencedirect.com/science/article/pii/S0169207021001874')}</p>
      <p>${source('M5 Uncertainty Competition', 'https://doi.org/10.1016/j.ijforecast.2021.10.009')}</p>
      <p>${source('Contextual Thompson sampling', 'https://arxiv.org/abs/1209.3352')}</p>
      <p>${source('Contextual bandits for causal marketing', 'https://arxiv.org/abs/1810.01859')}</p>
      <p>${source('Google — Bayesian structural time series / CausalImpact', 'https://research.google/pubs/inferring-causal-impact-using-bayesian-structural-time-series-models/')}</p>
      <p>${source('Fashion downside-risk newsvendor', 'https://www.sciencedirect.com/science/article/pii/S092552731000397X')}</p>
      <p>${source('Two-order fashion newsvendor', 'https://www.sciencedirect.com/science/article/pii/S0925527312003192')}</p>
      <p>${source('Kelly — information and capital growth', 'https://onlinelibrary.wiley.com/doi/abs/10.1002/j.1538-7305.1956.tb03809.x')}</p>
      <p>${source('Hierarchical Bayesian fashion sizing', 'https://arxiv.org/abs/1908.00825')}</p>
      <p>${source('Google Meridian MMM', 'https://developers.google.com/meridian')}</p>
    </div>`
  },
  {
    kicker: '53 / SOURCES — TAX + COMPARABLES',
    title: 'Boundaries and<br>mechanism cases.',
    dek: 'Recheck mutable rules at implementation.',
    body: `<div class="sources two-col">
      <p>${source('CRA — GST/HST imports and exports', 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-imports-exports.html')}</p>
      <p>${source('CRA — T4 employer information', 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/completing-filing-information-returns/t4-information-employers/t4-slip.html')}</p>
      <p>${source('CRA — T5 guide', 'https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4015/t5-guide-return-investment-income.html')}</p>
      <p>${source('New York — sales-tax registration', 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/do_i_need_to_register_for_sales_tax.htm')}</p>
      <p>${source('New York — clothing exemption', 'https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/clothing_and_footwear.htm')}</p>
      <p>${source('CRTC — CASL requirements', 'https://crtc.gc.ca/eng/internet/anti/reg.htm')}</p>
      <p>${source('FTC — influencer disclosures', 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers')}</p>
      <p>${source('Shopify — Scuffers case', 'https://www.shopify.com/uk/case-studies/scuffers')}</p>
      <p>${source('Shopify — Chubbies case', 'https://www.shopify.com/case-studies/chubbies')}</p>
      <p>${source('GQ — Corteiz Brooklyn exchange', 'https://www.gq.com/story/corteiz-brooklyn-denim-exchange-scene-report')}</p>
    </div>`
  },
  {
    kicker: '54 / FINAL DECISION',
    title: 'Make the goal<br>eligible.',
    dek: 'The engine can draw the road. The receipts decide how fast VORG travels it.',
    theme: 'final',
    visual: `<div class="final-mark">V</div>`,
    body: `<p class="manifesto">One coherent fashion house compounds every 40 days. Instagram makes the world desirable. TikTok and creators make it move. YouTube makes it believable. Google, Pinterest and Shop make it findable. Shopify makes it buyable. Email, SMS, product quality and post-purchase make it repeat. Finance protects inventory, founder pay and tax cash. Prediction sizes the next bet from receipts.</p><div class="final-stats">${stat('85%', '30-day sell-through gate')}${stat('45%', 'Scale floor')}${stat('50%', 'Target')}${stat('C$100K+', 'August 2027')}</div>`
  }
];

if (pages.length < 30) throw new Error(`Dossier depth gate failed: expected at least 30 pages, got ${pages.length}.`);
if (new Set(pages.map(page => page.kicker)).size !== pages.length) throw new Error('Dossier page labels must be unique.');
if (!pages.some(page => page.kicker.includes('INSTAGRAM'))) throw new Error('Instagram coverage gate failed.');
if (!pages.some(page => page.kicker.includes('SOURCES'))) throw new Error('Evidence-source coverage gate failed.');

const pageHtml = pages.map((page, index) => `
  <section class="page ${page.theme || ''}" id="page-${index + 1}" data-page="${index + 1}">
    <div class="grain"></div>
    <header><span>VORG–EAVY</span><span>${page.kicker}</span></header>
    <div class="page-main">
      <div class="copy">
        <p class="kicker">${page.kicker}</p>
        <h1>${page.title}</h1>
        <p class="dek">${page.dek || ''}</p>
        ${page.body || ''}
      </div>
      ${page.visual ? `<aside class="visual">${page.visual}</aside>` : ''}
    </div>
    <footer><span>A HOME FOR ORIGINALS.</span><b>${String(index + 1).padStart(2, '0')} / ${pages.length}</b></footer>
  </section>`).join('\n');

const rawHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>VORG — The C$100K August Machine</title>
<style>
:root{--black:#0B0B0C;--white:#F5F3EE;--walnut:#6B4C35;--deep:#4B3323;--orange:#F56A1C;--muted:#B7B0A5;--line:rgba(245,243,238,.18)}
*{box-sizing:border-box}html{scroll-behavior:smooth;background:var(--black)}body{margin:0;background:var(--black);color:var(--white);font-family:Arial,Helvetica,sans-serif;overflow-x:hidden}.progress{position:fixed;z-index:50;top:0;left:0;height:4px;background:var(--orange);width:0}.nav{position:fixed;z-index:40;right:20px;top:50%;transform:translateY(-50%);display:grid;gap:8px}.nav button,.top-btn{appearance:none;border:1px solid var(--line);background:rgba(11,11,12,.76);color:var(--white);width:42px;height:42px;border-radius:50%;cursor:pointer;backdrop-filter:blur(12px)}.top-btn{position:fixed;z-index:40;right:20px;bottom:20px}.page{position:relative;min-height:100vh;padding:34px 46px 28px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;overflow:hidden;background:radial-gradient(circle at 85% 15%,rgba(107,76,53,.18),transparent 34%),var(--black)}.page:nth-child(3n){background:radial-gradient(circle at 12% 80%,rgba(245,106,28,.08),transparent 30%),var(--black)}.page header,.page footer{display:flex;justify-content:space-between;gap:20px;text-transform:uppercase;letter-spacing:.16em;font-weight:700;font-size:10px;position:relative;z-index:3}.page header{padding-bottom:18px;border-bottom:1px solid var(--line)}.page footer{margin-top:auto;padding-top:16px;border-top:1px solid var(--line);color:var(--muted)}.page-main{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:54px;align-items:center;flex:1;padding:40px 0;position:relative;z-index:2}.page:not(:has(.visual)) .page-main{grid-template-columns:1fr}.page:not(:has(.visual)) .copy{max-width:1180px}.copy{max-width:800px}.kicker{color:var(--orange);font-size:11px;letter-spacing:.2em;font-weight:800;text-transform:uppercase;margin:0 0 18px}.page h1{font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:clamp(48px,6vw,92px);line-height:.88;letter-spacing:-.055em;margin:0 0 22px}.page h1 span{color:var(--orange);font-style:italic}.dek{font-family:Georgia,'Times New Roman',serif;font-size:clamp(18px,1.65vw,28px);line-height:1.25;color:#d6d0c7;max-width:780px;margin:0 0 24px}.copy>p:not(.kicker):not(.dek):not(.manifesto){font-size:15px;line-height:1.58;color:#d2ccc4;max-width:760px}.manifesto{font-family:Georgia,'Times New Roman',serif;font-size:clamp(20px,2vw,34px);line-height:1.27;border-left:4px solid var(--orange);padding-left:22px;margin:26px 0}.grain{position:absolute;inset:0;opacity:.15;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.14'/%3E%3C/svg%3E")}.visual{min-width:0}.tag{display:inline-block;border:1px solid var(--line);padding:9px 13px;margin:3px;border-radius:99px;font-size:10px;letter-spacing:.12em}.tag.orange{background:var(--orange);border-color:var(--orange);color:var(--black)}.cover{min-height:100vh;background:var(--black)}.cover .page-main{grid-template-columns:.8fr 1.2fr}.cover h1{font-size:clamp(72px,9vw,150px)}.cover-collage{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;height:70vh;gap:8px;transform:rotate(2deg)}.cover-collage img{width:100%;height:100%;object-fit:cover;filter:saturate(.7) contrast(1.08)}.cover-collage img:first-child{grid-row:1/3}.cover-meta{margin-top:24px}.stat-row,.creator-mix,.dashboard,.final-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.stat{border:1px solid var(--line);padding:20px;background:rgba(245,243,238,.025)}.stat strong{font-family:Georgia,serif;font-size:clamp(36px,4vw,70px);font-weight:400;display:block;color:var(--orange);letter-spacing:-.04em}.stat span{display:block;font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:10px}.stat small{display:block;margin-top:9px;color:var(--muted)}.truth{display:grid;grid-template-columns:145px 1fr;gap:18px;border-top:1px solid var(--line);padding:16px 0}.truth b{color:var(--orange);font-size:10px;letter-spacing:.12em}.truth span{color:#d6d0c7;line-height:1.5}.card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.card-grid article{border:1px solid var(--line);padding:18px;min-height:145px;background:linear-gradient(145deg,rgba(245,243,238,.04),transparent)}.card-grid article>span,.versus article>span,.door article>span{color:var(--orange);font-size:9px;letter-spacing:.16em;font-weight:800}.card-grid h3,.versus h3,.door h3{font-family:Georgia,serif;font-size:23px;font-weight:400;margin:8px 0}.card-grid p,.versus p,.door p{color:var(--muted);line-height:1.45;margin:0;font-size:13px}.ladder{display:grid;gap:9px}.rung{margin-left:calc(var(--i)*18px);border:1px solid var(--line);padding:13px 17px;display:grid;grid-template-columns:90px 1fr;gap:14px;background:linear-gradient(90deg,rgba(245,106,28,.16),transparent)}.rung b{color:var(--orange)}.rung span{color:#ddd7ce}.flow{display:flex;align-items:stretch;gap:7px;overflow-x:auto;padding-bottom:8px}.flow-node{min-width:112px;flex:1;border:1px solid var(--line);padding:14px;display:flex;flex-direction:column}.flow-node em{color:var(--orange);font-size:9px;letter-spacing:.14em}.flow-node b{font-family:Georgia,serif;font-size:18px;margin:16px 0 5px}.flow-node span{font-size:10px;color:var(--muted);line-height:1.4}.arrow{align-self:center;color:var(--orange);font-size:22px}.bars{display:grid;gap:11px}.bar-row{display:grid;grid-template-columns:130px 1fr 55px;gap:12px;align-items:center;font-size:11px}.bar-row i{height:19px;background:rgba(245,243,238,.07);display:block}.bar-row i b{height:100%;display:block;background:linear-gradient(90deg,var(--deep),var(--orange))}.bar-row strong{text-align:right;color:var(--orange)}.table-wrap{overflow:auto;border:1px solid var(--line)}table{border-collapse:collapse;width:100%;font-size:12px}th,td{text-align:left;padding:13px;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--orange);font-size:9px;letter-spacing:.1em;text-transform:uppercase}tr:last-child td{border-bottom:0}.compact th,.compact td{padding:9px 10px;font-size:11px}.split-viz{display:flex;align-items:stretch;gap:14px}.split-viz>div:not(.plus){flex:1;border:1px solid var(--line);padding:24px;display:flex;flex-direction:column;justify-content:flex-end;min-height:280px;background:linear-gradient(180deg,transparent,rgba(107,76,53,.25))}.split-viz b{color:var(--orange);font-size:11px;letter-spacing:.15em}.split-viz strong{font-family:Georgia,serif;font-size:32px;margin:10px 0}.split-viz span{color:var(--muted)}.split-viz .plus{align-self:center;font-size:30px}.versus,.door{display:grid;grid-template-columns:1fr 1fr;gap:14px}.versus article,.door article{border:1px solid var(--line);padding:25px;min-height:260px;display:flex;flex-direction:column;justify-content:flex-end}.versus article.accent,.door article.accent{background:var(--orange);color:var(--black)}.versus article.accent span,.versus article.accent p,.door article.accent span,.door article.accent p{color:var(--black)}.product-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;height:330px;margin-bottom:16px}.product-strip img{width:100%;height:100%;object-fit:cover}.donut{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.donut div{aspect-ratio:1;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:conic-gradient(var(--orange) calc(var(--p)*1%),rgba(245,243,238,.07) 0);position:relative}.donut div:after{content:"";position:absolute;inset:22%;background:var(--black);border-radius:50%}.donut b,.donut span{position:relative;z-index:2}.donut b{font-family:Georgia,serif;font-size:30px}.donut span{font-size:9px;text-transform:uppercase}.big-list{list-style:none;padding:0;margin:20px 0}.big-list li{border-top:1px solid var(--line);padding:13px 0;font-size:15px}.bayes{display:flex;gap:9px;align-items:center}.bayes>div:not(.arrow){flex:1;border:1px solid var(--line);padding:18px;min-height:160px}.bayes span{font-size:9px;color:var(--orange);letter-spacing:.15em}.bayes b{display:block;font-family:Georgia,serif;font-weight:400;font-size:21px;margin:28px 0 8px}.bayes small{color:var(--muted)}.chart{width:100%;height:auto}.chart path{fill:none;stroke:var(--line);stroke-width:2}.chart .target{stroke:var(--orange);stroke-width:7}.chart .floor{stroke:var(--walnut);stroke-dasharray:8 9}.chart text{fill:var(--muted);font-size:16px}.risk-scale{display:grid;grid-template-columns:1fr 100px 1fr;align-items:center}.risk-scale>div{border:1px solid var(--line);padding:24px;min-height:180px}.risk-scale i{height:6px;background:linear-gradient(90deg,var(--orange),var(--white),var(--orange))}.risk-scale b{color:var(--orange);display:block}.risk-scale span{display:block;color:var(--muted);margin-top:50px}.allocation{display:flex;gap:12px}.allocation>div{flex:var(--w);min-height:260px;border:1px solid var(--line);padding:20px;display:flex;flex-direction:column;justify-content:flex-end}.allocation .accent{background:var(--orange);color:var(--black)}.allocation b{font-family:Georgia,serif;font-size:42px}.poster-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.poster-grid article{aspect-ratio:1.35;border:1px solid var(--line);padding:18px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(135deg,rgba(245,106,28,.18),transparent)}.poster-grid b{font-family:Georgia,serif;font-size:27px}.poster-grid span{color:var(--muted);font-size:11px}.asset-wheel{width:430px;height:430px;border:1px solid var(--line);border-radius:50%;position:relative;margin:auto}.asset-wheel .hub{position:absolute;inset:34%;border-radius:50%;background:var(--orange);color:var(--black);display:grid;place-items:center;text-align:center;font-family:Georgia,serif;font-size:26px}.asset-wheel span{position:absolute;left:50%;top:50%;transform:rotate(var(--a)) translate(165px) rotate(calc(var(--a)*-1));transform-origin:0 0;font-size:10px;font-weight:800}.attribution{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.attribution div{border:1px solid var(--line);padding:18px;min-height:90px;display:grid;place-items:center;text-align:center}.attribution .accent{grid-column:2/4;background:var(--orange);color:var(--black)}.attribution small{display:block}.door{grid-template-columns:1fr 35px 1fr}.door>div{align-self:center;text-align:center;color:var(--orange)}.numbered{list-style:none;counter-reset:n;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}.numbered li{counter-increment:n;border:1px solid var(--line);padding:18px 18px 18px 58px;position:relative;min-height:100px;display:flex;align-items:center;line-height:1.4}.numbered li:before{content:counter(n,decimal-leading-zero);position:absolute;left:17px;color:var(--orange);font-weight:800}.sources{display:grid;grid-template-columns:1fr 1fr;gap:10px 28px}.sources p{margin:0!important;border-bottom:1px solid var(--line);padding:12px 0}.sources a{color:var(--white);text-decoration:none}.sources a:hover{color:var(--orange)}.final{background:radial-gradient(circle at 70% 40%,rgba(245,106,28,.30),transparent 35%),var(--black)}.final-mark{font-family:Georgia,serif;font-size:360px;color:transparent;-webkit-text-stroke:2px var(--orange);text-align:center;line-height:.8}.final-stats{grid-template-columns:repeat(4,1fr);margin-top:24px}.final-stats .stat strong{font-size:38px}.final .manifesto{font-size:26px}.cover footer,.final footer{color:var(--white)}
@media(max-width:900px){.page{padding:24px 20px}.page-main,.cover .page-main{grid-template-columns:1fr;gap:24px}.visual{order:-1}.cover-collage{height:42vh}.page h1{font-size:52px}.stat-row,.card-grid,.versus,.door,.sources,.numbered{grid-template-columns:1fr}.flow{align-items:stretch}.flow-node{min-width:150px}.product-strip{height:240px}.final-stats{grid-template-columns:1fr 1fr}.nav{display:none}.door>div{display:none}}
@media print{@page{size:16in 9in;margin:0}.progress,.nav,.top-btn{display:none}.page{width:16in;min-height:9in;height:9in;page-break-after:always;break-after:page;padding:.28in .38in .22in}.page-main{padding:.22in 0;gap:.35in}.page h1{font-size:54pt}.dek{font-size:17pt}.copy>p:not(.kicker):not(.dek):not(.manifesto){font-size:10pt}.grain{opacity:.08}.cover-collage{height:6.2in}.flow-node{min-width:0}.rung{padding:8px 12px}.card-grid article{min-height:110px}.sources p{font-size:9pt}.nav{display:none}}
</style>
</head>
<body>
<div class="progress" id="progress"></div>
<nav class="nav" aria-label="Page navigation"><button id="prev" aria-label="Previous page">↑</button><button id="next" aria-label="Next page">↓</button></nav>
<button class="top-btn" id="top" aria-label="Back to top">V</button>
<main>${pageHtml}</main>
<script>
const sections=[...document.querySelectorAll('.page')];
const progress=document.getElementById('progress');
const active=()=>Math.max(0,sections.findIndex((s,i)=>{const r=s.getBoundingClientRect();return r.top<=innerHeight*.45&&(sections[i+1]?.getBoundingClientRect().top??Infinity)>innerHeight*.45}));
const go=d=>sections[Math.min(sections.length-1,Math.max(0,active()+d))].scrollIntoView({behavior:'smooth'});
document.getElementById('prev').onclick=()=>go(-1);document.getElementById('next').onclick=()=>go(1);document.getElementById('top').onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>{progress.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
addEventListener('keydown',e=>{if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();go(1)}if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(-1)}});
</script>
</body>
</html>`;

const html = rawHtml.replace(/[ \t]+$/gm, '').replace(/\n+$/, '\n');

mkdirSync(userOutputDir, { recursive: true });
writeFileSync(repoOutput, html, 'utf8');
writeFileSync(userOutput, html, 'utf8');
console.log(JSON.stringify({ pages: pages.length, repoOutput, userOutput, bytes: Buffer.byteLength(html) }, null, 2));
