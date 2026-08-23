import { pathToFileURL } from 'node:url';

/**
 * VORG Growth + Finance Engine v3
 *
 * A founder decision aid, not a sales promise, tax return, purchase order, or
 * autonomous media buyer. All unreceipted commercial inputs remain working
 * assumptions and are deliberately exposed below.
 */

export const CONFIG = Object.freeze({
  version: '3.0.0',
  checkedOn: '2026-08-22',
  currency: 'CAD',
  firstLaunchDate: '2026-11-08',
  targetMonth: '2027-08',
  targetNetSales: 100000,
  sellThroughTarget: 0.85,
  sellThroughWindowDays: 30,
  growthFloor: 0.45,
  growthTarget: 0.50,
  cadenceDays: 40,
  initialCash: 10000,
  minimumCashFloor: 1500,
  founderSalaryEnvelopeMonthly: 3000,
  salaryStartMonth: '2026-11',
  dividendLockMonths: 12,
  revenueLeakageRate: 0.05,
  includedShippingRate: 0.05,
  paymentPercent: 0.028,
  paymentPerOrder: 0.30,
  unitsPerOrder: 1.25,
  incomeTaxContingencyRate: 0.15,
  firstDropFixedOverhead: 3750,
  repeatFixedOverhead: 1550,
  variableLaunchCostAtBaseScale: 950,
  maximumInitialProductionSpend: 6000,
  salesCurve: Object.freeze([
    Object.freeze({ startDay: 0, endDay: 6, share: 0.55 }),
    Object.freeze({ startDay: 7, endDay: 13, share: 0.22 }),
    Object.freeze({ startDay: 14, endDay: 20, share: 0.13 }),
    Object.freeze({ startDay: 21, endDay: 29, share: 0.10 })
  ])
});

export const PRODUCTS = Object.freeze([
  Object.freeze({ id: 'firm-jacket', role: 'hero', units: 12, workingPrice: 249, workingLandedCogs: 85 }),
  Object.freeze({ id: 'womens-low-rise-denim', role: 'core', units: 24, workingPrice: 128, workingLandedCogs: 38 }),
  Object.freeze({ id: 'mens-denim', role: 'core', units: 20, workingPrice: 128, workingLandedCogs: 38 }),
  Object.freeze({ id: 'scarf', role: 'entry', units: 40, workingPrice: 35, workingLandedCogs: 12 }),
  Object.freeze({ id: 'womens-top-bodysuit', role: 'seasonal', units: 30, workingPrice: 68, workingLandedCogs: 18 })
]);

export const CHANNELS = Object.freeze([
  channel('owned-crm', 'Email + SMS + waitlist + post-purchase', 'own', 22, 'Every drop', 'Consented subscriber, click, purchase, return, and repeat-order receipts; deduped by customer.'),
  channel('creator-affiliate', 'Creator, UGC, affiliate and stylist network', 'borrow', 18, 'Every drop after contracts', 'Unique link/code orders after returns; fee, gift, usage rights, and disclosure logged.'),
  channel('tiktok', 'TikTok organic + Search + Shop/LIVE tests', 'borrow', 14, 'Organic now; commerce after margin and account gates', 'Search terms, qualified sessions, Shop fees, assisted and first-touch orders kept separate.'),
  channel('meta-paid', 'Instagram/Facebook paid distribution', 'buy', 14, 'Only after creative and contribution gates', 'Ad spend, landing sessions, new-customer orders, blended CAC, marginal CAC, and contribution after returns.'),
  channel('instagram-organic', 'Instagram Reels + carousels + Stories + DMs', 'own', 12, 'Every drop', 'Non-follower reach, saves, shares, profile/PDP visits, DMs, and deduped orders; Trial Reels logged separately.'),
  channel('google-intent', 'Google free listings + Search/Shopping + Images/Lens', 'capture', 8, 'Merchant Center before launch; paid only after feed health', 'Approved feed coverage, non-brand queries, product sessions, new-customer orders, contribution.'),
  channel('youtube-founder', 'Founder-led YouTube + Shorts + product proof', 'own', 4, 'Weekly/biweekly', 'Watch time, returning viewers, tagged PDP sessions, email captures, assisted orders; title/thumbnail test result.'),
  channel('pinterest', 'Pinterest catalog + evergreen visual search', 'capture', 3, 'Catalog after PDP/imagery readiness', 'Outbound clicks, saves, assisted orders, query and board cohorts; conversion tag/API health.'),
  channel('offline-earned', 'Pop-up + referral + PR/editorial + community', 'prove', 5, 'Permission and economics gated', 'Door counts, RSVP show rate, POS orders, referral lineage, earned placements, consented content rights.')
]);

export const EXPERIMENTAL_CHANNELS = Object.freeze([
  experiment('shop-app', 'Shop app discovery and shoppable posts', 'Activate because eligible catalog products can be discoverable; optimize titles, descriptions, imagery, shipping and reviews.'),
  experiment('facebook-reels', 'Facebook Reels', 'Low-cost adaptation lane for approved vertical video; keep reporting separate from Instagram.'),
  experiment('threads', 'Threads', 'Founder POV and conversation testing; do not give it a sales quota until tagged traffic appears.'),
  experiment('reddit', 'Reddit', 'Manual participation and listening only; no disguised promotion or automated spam.'),
  experiment('snapchat', 'Snapchat', 'Test only if first-party age/market evidence supports it and creative can be reused cheaply.'),
  experiment('discord-whatsapp', 'Discord / WhatsApp community', 'Use only with genuine member demand, consent, moderation and a clear service ritual.'),
  experiment('pr-stylist', 'PR, stylist pulls and editorial seeding', 'Track samples, rights, placements, attributed traffic and return of loaned goods; never treat placement as revenue.'),
  experiment('marketplaces', 'Selective marketplaces / wholesale', 'Hold until DTC contribution, brand control, channel margin, returns and tax treatment are proven.')
]);

export const PREDICTION_STACK = Object.freeze([
  method('cross-signal-nowcast', 'Hedge-fund nowcast', 'Now', 'Refresh dated search, platform, macro, creator, supplier and Shopify signals; discount correlated sources.', 'A directional prior, never a purchase receipt.'),
  method('bayesian-update', 'Bayesian prior → posterior', 'From first orders', 'Update conversion, return, size and channel-rate distributions without pretending a tiny sample is certainty.', 'Use wide priors and publish intervals.'),
  method('hierarchical-pooling', 'Hierarchical Bayesian pooling', 'After 2 drops / 100+ orders', 'Share information across related SKUs, sizes, creatives and markets while preserving item differences.', 'Do not pool structurally different products blindly.'),
  method('sell-through-hazard', 'Survival / hazard model', 'After one full 30-day curve', 'Predict probability and timing of 85% sell-through, not only end-of-period unit totals.', 'Stockouts censor demand; record lost-demand signals.'),
  method('newsvendor', 'Risk-adjusted newsvendor', 'Before every PO', 'Choose quantities from demand intervals, margin, salvage value, stockout cost and cash-at-risk.', 'Use downside-risk constraints; do not maximize expected revenue alone.'),
  method('fractional-kelly', 'Fractional-Kelly position sizing', 'Every paid/content/inventory wave', 'Scale only a fraction of the calculated edge; cap exposure by cash floor and evidence grade.', 'Never use full Kelly on noisy fashion priors.'),
  method('thompson-bandit', 'Constrained Thompson sampling', '300+ attributable orders', 'Reserve 10–20% exploration across qualified creative/creator cells; exploit contribution winners.', 'Optimize retained contribution, not clicks.'),
  method('ensemble-reconciliation', 'M5-style ensemble + hierarchy reconciliation', '3+ drops / stable SKU history', 'Blend simple baselines and stronger models; reconcile SKU → role → drop → month totals.', 'Simple baseline must remain in the contest.'),
  method('conformal-range', 'Conformal prediction intervals', 'Enough out-of-sample residuals', 'Wrap the chosen forecast with empirically checked uncertainty bands.', 'Coverage must be back-tested; no interval claim before calibration.'),
  method('causal-impact', 'CausalImpact / holdout / geo lift', 'When a credible control exists', 'Estimate incremental orders versus the counterfactual, not platform-attributed overlap.', 'Pre-register tests and avoid contaminated controls.'),
  method('mmm', 'Bayesian marketing-mix model', '52+ weekly observations with spend variation', 'Later-stage cross-channel budget planning calibrated with experiments.', 'Blocked pre-launch and at tiny sample sizes.')
]);

export function buildEngine() {
  validateStaticInputs();
  const scenarios = [
    simulateScenario({ id: 'winner-floor-45', growthRate: CONFIG.growthFloor, sellThrough: 0.85, cadenceDays: 40, salaryPolicy: 'cash-gated' }),
    simulateScenario({ id: 'winner-target-50', growthRate: CONFIG.growthTarget, sellThrough: 0.85, cadenceDays: 40, salaryPolicy: 'cash-gated' }),
    simulateScenario({ id: 'salary-paid-from-launch', growthRate: CONFIG.growthFloor, sellThrough: 0.85, cadenceDays: 40, salaryPolicy: 'guaranteed' }),
    simulateScenario({ id: 'slower-cadence-45-days', growthRate: CONFIG.growthFloor, sellThrough: 0.85, cadenceDays: 45, salaryPolicy: 'cash-gated' }),
    simulateScenario({ id: 'demand-miss-35-growth-75-sell-through', growthRate: 0.35, sellThrough: 0.75, cadenceDays: 40, salaryPolicy: 'cash-gated' })
  ];
  const minimumBridge = minimumWorkingCapitalBridge({
    growthRate: CONFIG.growthFloor,
    sellThrough: CONFIG.sellThroughTarget,
    cadenceDays: CONFIG.cadenceDays
  });
  const bridgedSalary = simulateScenario({
    id: 'winner-floor-45-salary-bridge',
    growthRate: CONFIG.growthFloor,
    sellThrough: 0.85,
    cadenceDays: 40,
    salaryPolicy: 'guaranteed',
    initialCash: CONFIG.initialCash + minimumBridge
  });
  scenarios.push(bridgedSalary);
  const targetBridge = minimumWorkingCapitalBridge({
    growthRate: CONFIG.growthTarget,
    sellThrough: CONFIG.sellThroughTarget,
    cadenceDays: CONFIG.cadenceDays
  });
  const bridgedTargetSalary = simulateScenario({
    id: 'winner-target-50-salary-bridge',
    growthRate: CONFIG.growthTarget,
    sellThrough: 0.85,
    cadenceDays: 40,
    salaryPolicy: 'guaranteed',
    initialCash: CONFIG.initialCash + targetBridge
  });
  scenarios.push(bridgedTargetSalary);

  const winner = scenarios.find(item => item.id === 'winner-target-50');
  const floorPath = scenarios.find(item => item.id === 'winner-floor-45');
  return {
    schemaVersion: 3,
    engineVersion: CONFIG.version,
    checkedOn: CONFIG.checkedOn,
    truthClass: 'goal-seeking-working-simulation',
    decision: 'Backsolve the operating, demand, inventory and cash path to at least C$100,000 reconciled net sales in August 2027 while targeting 85% sell-through inside 30 days and 45%-50% growth between releases.',
    goalContract: {
      august2027NetSalesCad: CONFIG.targetNetSales,
      sellThroughPctInside30Days: CONFIG.sellThroughTarget * 100,
      perDropGrowthFloorPct: CONFIG.growthFloor * 100,
      perDropGrowthTargetPct: CONFIG.growthTarget * 100,
      plannedCadenceDays: CONFIG.cadenceDays,
      founderSalaryEnvelopeCadPerMonth: CONFIG.founderSalaryEnvelopeMonthly,
      dividendRule: 'No dividend cash leaves the business before month 12 and accountant/director solvency clearance.'
    },
    selectedArchitecture: {
      name: 'The 40-Day Compounding House',
      objective: 'Eight tightly staged releases from November 2026 through August 2027, with 45% as the scale floor and 50% as the operating target.',
      floorPathEligible: floorPath.goalMet,
      targetPathEligible: winner.goalMet,
      targetPathAugustNetSalesCad: winner.augustNetSales,
      targetPathRequiredAugustOrders: winner.augustOrders,
      targetPathDropCount: winner.ledger.length,
      targetPathLastLaunch: winner.ledger.at(-1)?.date ?? null,
      salarySolution: `Either use the cash-gated salary rule or secure a documented working-capital bridge of approximately C$${minimumBridge.toLocaleString('en-CA')} for the 45% floor path / C$${targetBridge.toLocaleString('en-CA')} for the 50% target path so the full C$3,000 monthly envelope never competes with inventory.`,
      nonNegotiableGates: [
        'No scale step unless the prior drop reaches 85% reconciled sell-through inside 30 days.',
        'The lower bound of the demand range must cover the proposed buy; founder enthusiasm cannot fill the gap.',
        'Landed contribution after returns, duties, fulfilment, payment and variable acquisition must remain positive.',
        'The purchase order, protected tax/refund cash, and C$1,500 floor must be funded before salary or discretionary brand spend.',
        'Every channel order is counted once by acquisition source; assisted touches are reported separately.',
        'No dividends before month 12, and none without accountant and solvency clearance.'
      ]
    },
    baseMerchandiseContract: baseContract(),
    scenarios,
    founderCashPolicy: founderCashPolicy(minimumBridge, targetBridge),
    channelPortfolio: channelPortfolio(winner),
    predictionStack: PREDICTION_STACK,
    modelActivationLadder: activationLadder(),
    weeklyDecisionSystem: weeklyDecisionSystem(),
    blindSpots: blindSpots(),
    evidenceRules: evidenceRules(),
    limitations: limitations()
  };
}

export function simulateScenario({ id, growthRate, sellThrough, cadenceDays, salaryPolicy, initialCash = CONFIG.initialCash }) {
  const drops = buildDropCalendar(growthRate, sellThrough, cadenceDays);
  const ledger = [];
  let bankCash = initialCash;
  let protectedTaxCash = 0;
  let salaryPaid = 0;
  let salaryDeferred = 0;
  let stalledOnDrop = null;
  let salaryCursor = monthStart(CONFIG.salaryStartMonth);
  let previousDropDate = null;

  for (const drop of drops) {
    const dropDate = parseDate(drop.date);
    const salaries = [];
    while (salaryCursor <= dropDate) {
      const upcomingCost = drop.upfrontCost;
      const availableAfterProtected = bankCash - protectedTaxCash;
      const canPay = salaryPolicy === 'guaranteed' || availableAfterProtected - CONFIG.founderSalaryEnvelopeMonthly >= upcomingCost + CONFIG.minimumCashFloor;
      if (canPay) {
        bankCash -= CONFIG.founderSalaryEnvelopeMonthly;
        salaryPaid += CONFIG.founderSalaryEnvelopeMonthly;
        salaries.push({ month: isoMonth(salaryCursor), paid: CONFIG.founderSalaryEnvelopeMonthly, deferred: 0 });
      } else {
        salaryDeferred += CONFIG.founderSalaryEnvelopeMonthly;
        salaries.push({ month: isoMonth(salaryCursor), paid: 0, deferred: CONFIG.founderSalaryEnvelopeMonthly });
      }
      salaryCursor = addMonths(salaryCursor, 1);
    }

    const availableBeforeDrop = bankCash - protectedTaxCash;
    if (availableBeforeDrop - drop.upfrontCost < CONFIG.minimumCashFloor - 0.01) {
      stalledOnDrop = drop.dropNumber;
      break;
    }

    const openingCash = bankCash;
    bankCash -= drop.upfrontCost;
    bankCash += drop.cashReceipt;
    const taxReserveAdded = Math.max(0, drop.preSalaryOperatingContribution) * CONFIG.incomeTaxContingencyRate;
    protectedTaxCash += taxReserveAdded;
    const availableEndingCash = bankCash - protectedTaxCash;
    ledger.push({
      ...drop,
      salaryEventsBeforeDrop: salaries,
      openingCash: money(openingCash),
      protectedTaxCash: money(protectedTaxCash),
      availableEndingCash: money(availableEndingCash),
      bankEndingCash: money(bankCash),
      salaryPaidToDate: money(salaryPaid),
      salaryDeferredToDate: money(salaryDeferred)
    });
    previousDropDate = dropDate;
  }

  const targetMonthStart = parseDate(`${CONFIG.targetMonth}-01`);
  const targetMonthEnd = endOfMonth(targetMonthStart);
  const completedDrops = ledger.map(entry => ({ date: entry.date, netSales: entry.netSales }));
  const augustNetSales = money(monthRevenue(completedDrops, targetMonthStart, targetMonthEnd));
  const netAov = baseContract().netAverageOrderValue;
  const augustOrders = Math.ceil(augustNetSales / netAov);
  const dividendPaid = 0;
  return {
    id,
    growthRatePct: growthRate * 100,
    sellThroughPct: sellThrough * 100,
    cadenceDays,
    salaryPolicy,
    initialCash: money(initialCash),
    completed: stalledOnDrop === null,
    stalledOnDrop,
    goalMet: stalledOnDrop === null && augustNetSales + 0.01 >= CONFIG.targetNetSales,
    augustNetSales,
    augustOrders,
    salaryPaid: money(salaryPaid),
    salaryDeferred: money(salaryDeferred),
    protectedTaxCash: money(protectedTaxCash),
    endingAvailableCash: money(bankCash - protectedTaxCash),
    dividendPaid,
    ledger,
    explanation: scenarioExplanation(id, stalledOnDrop, augustNetSales, salaryPaid, salaryDeferred, previousDropDate)
  };
}

export function minimumWorkingCapitalBridge({ growthRate, sellThrough, cadenceDays }) {
  const succeeds = extra => simulateScenario({
    id: 'bridge-search', growthRate, sellThrough, cadenceDays, salaryPolicy: 'guaranteed', initialCash: CONFIG.initialCash + extra
  }).goalMet;
  let low = 0;
  let high = 100000;
  if (!succeeds(high)) throw new Error('Working-capital bridge search ceiling is too low.');
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (succeeds(mid)) high = mid;
    else low = mid;
  }
  return high;
}

function buildDropCalendar(growthRate, sellThrough, cadenceDays) {
  const base = baseContract();
  const firstDate = parseDate(CONFIG.firstLaunchDate);
  const endDate = parseDate(`${CONFIG.targetMonth}-31`);
  const drops = [];
  let date = firstDate;
  let dropNumber = 1;
  while (date <= endDate) {
    const scale = (1 + growthRate) ** (dropNumber - 1);
    const inventoryUnits = Math.max(1, Math.round(base.units * scale));
    const actualScale = inventoryUnits / base.units;
    const inventoryRetail = base.inventoryRetail * actualScale;
    const inventoryCost = base.inventoryCost * actualScale;
    if (dropNumber === 1 && inventoryCost > CONFIG.maximumInitialProductionSpend) throw new Error('Drop 001 production ceiling breached.');
    const fixedOverhead = dropNumber === 1 ? CONFIG.firstDropFixedOverhead : CONFIG.repeatFixedOverhead;
    const variableLaunchCost = CONFIG.variableLaunchCostAtBaseScale * actualScale;
    const upfrontCost = inventoryCost + fixedOverhead + variableLaunchCost;
    const displayedSales = inventoryRetail * sellThrough;
    const netSales = displayedSales * (1 - CONFIG.revenueLeakageRate);
    const unitsSold = inventoryUnits * sellThrough;
    const orders = unitsSold / CONFIG.unitsPerOrder;
    const shipping = netSales * CONFIG.includedShippingRate;
    const paymentFees = netSales * CONFIG.paymentPercent + orders * CONFIG.paymentPerOrder;
    const cashReceipt = netSales - shipping - paymentFees;
    const preSalaryOperatingContribution = cashReceipt - upfrontCost;
    drops.push({
      dropNumber,
      date: isoDate(date),
      scale: number(actualScale, 3),
      inventoryUnits,
      inventoryRetail: money(inventoryRetail),
      inventoryCost: money(inventoryCost),
      fixedOverhead: money(fixedOverhead),
      variableLaunchCost: money(variableLaunchCost),
      upfrontCost: money(upfrontCost),
      unitsSold: number(unitsSold, 1),
      orders: Math.ceil(orders),
      sellThroughPct: sellThrough * 100,
      displayedSales: money(displayedSales),
      netSales: money(netSales),
      shipping: money(shipping),
      paymentFees: money(paymentFees),
      cashReceipt: money(cashReceipt),
      preSalaryOperatingContribution: money(preSalaryOperatingContribution)
    });
    date = addDays(date, cadenceDays);
    dropNumber += 1;
  }
  return drops;
}

function monthRevenue(drops, monthStartDate, monthEndDate) {
  let total = 0;
  for (const drop of drops) {
    const launch = parseDate(drop.date);
    for (const segment of CONFIG.salesCurve) {
      const days = segment.endDay - segment.startDay + 1;
      const perDay = drop.netSales * segment.share / days;
      for (let offset = segment.startDay; offset <= segment.endDay; offset += 1) {
        const saleDate = addDays(launch, offset);
        if (saleDate >= monthStartDate && saleDate <= monthEndDate) total += perDay;
      }
    }
  }
  return total;
}

function baseContract() {
  const units = sum(PRODUCTS.map(product => product.units));
  const inventoryRetail = sum(PRODUCTS.map(product => product.units * product.workingPrice));
  const inventoryCost = sum(PRODUCTS.map(product => product.units * product.workingLandedCogs));
  const averageUnitRetail = inventoryRetail / units;
  const grossAverageOrderValue = averageUnitRetail * CONFIG.unitsPerOrder;
  return {
    evidenceClass: 'working-assumption-pending-vendor-quotes',
    products: PRODUCTS,
    units,
    inventoryRetail: money(inventoryRetail),
    inventoryCost: money(inventoryCost),
    averageUnitRetail: money(averageUnitRetail),
    grossAverageOrderValue: money(grossAverageOrderValue),
    netAverageOrderValue: money(grossAverageOrderValue * (1 - CONFIG.revenueLeakageRate)),
    grossMarginBeforeUnsoldInventoryPct: number((1 - inventoryCost / inventoryRetail) * 100, 1)
  };
}

function channelPortfolio(winner) {
  const sumShare = sum(CHANNELS.map(item => item.targetSharePct));
  if (sumShare !== 100) throw new Error(`Channel acquisition shares must sum to 100, got ${sumShare}.`);
  return {
    countingRule: 'Each order has one acquisition source. Views, assists and retargeting touches are separate columns and never added to acquisition orders.',
    augustOrderCoverageTarget: winner.augustOrders,
    primaryChannels: CHANNELS.map(item => ({
      ...item,
      augustOrderCoverageTarget: Math.round(winner.augustOrders * item.targetSharePct / 100),
      evidenceClass: 'goal-allocation-not-forecast'
    })),
    experimentalChannels: EXPERIMENTAL_CHANNELS,
    portfolioGuardrails: [
      'No single borrowed or paid platform should own more than 25% of target acquisition orders by August.',
      'Owned/returning customer contribution should rise every drop; a paid-only growth curve fails the quality gate.',
      'Channel budgets scale from marginal contribution after returns, not platform ROAS.',
      'Instagram, TikTok and creators share creative inputs but retain separate source receipts.',
      'Google, Pinterest and Shop product data inherit the same SKU, size, price, availability and shipping truth as Shopify.'
    ]
  };
}

function founderCashPolicy(minimumBridge, targetBridge) {
  return {
    salaryInterpretation: 'Working assumption: C$3,000 is the total monthly corporate cash envelope for founder pay. Accountant must confirm gross salary, employer remittances, deductibility and payroll registration.',
    routes: [
      {
        id: 'cash-gated',
        label: 'Reinvestment-first salary gate',
        rule: 'Pay the monthly envelope only after the next PO, protected tax/refund cash and C$1,500 floor are covered; record unpaid months as founder compensation deferred, not as imaginary cash.'
      },
      {
        id: 'bridge-funded',
        label: 'Protected founder-pay route',
        rule: `Ring-fence approximately C$${minimumBridge.toLocaleString('en-CA')} for the 45% floor path or C$${targetBridge.toLocaleString('en-CA')} for the 50% target path so C$3,000 can be paid every month without starving inventory.`
      }
    ],
    cashWaterfall: [
      'Collected sales tax, duties, refunds and chargeback reserves',
      'Landed COGS and next approved purchase order',
      'C$1,500 minimum bank floor plus approved operating commitments',
      'Founder C$3,000 monthly cash envelope',
      'Evidence-backed growth experiments and creator commissions',
      'Year-end dividends only after 12 months, corporate tax provision, accountant review and director solvency test'
    ],
    taxBoundary: 'The 15% income-tax contingency is a planning reserve, not a calculated tax liability. U.S. state sales-tax nexus, U.S. trade/business exposure, Canadian export zero-rating evidence, payroll/T4 and dividend/T5 treatment require professional confirmation.'
  };
}

function activationLadder() {
  return [
    { stage: 0, name: 'Cold start', trigger: 'No VORG sales receipts', active: ['cross-signal-nowcast', 'scenario stress', 'simple bottom-up capacity'], blocked: ['MMM', 'automated bandit', 'narrow confidence claims'] },
    { stage: 1, name: 'First curve', trigger: '30+ settled orders and one 30-day sell-through curve', active: ['bayesian-update', 'sell-through-hazard baseline', 'return/size reason table'], blocked: ['channel MMM'] },
    { stage: 2, name: 'Repeat signal', trigger: '2 drops and 100+ settled orders', active: ['hierarchical-pooling', 'newsvendor quantities', 'cohort repeat analysis'], blocked: ['unconstrained personalization'] },
    { stage: 3, name: 'Controlled learning', trigger: '300+ attributable orders with stable tracking', active: ['constrained Thompson sampling', 'creator/creative portfolio allocation', 'conformal calibration work'], blocked: ['black-box full-budget automation'] },
    { stage: 4, name: 'Causal scale', trigger: 'Credible holdout or market control and enough power', active: ['geo/holdout lift', 'CausalImpact', 'incremental CAC'], blocked: ['platform ROAS as sole truth'] },
    { stage: 5, name: 'Portfolio model', trigger: '52+ weekly observations with meaningful spend/channel variation', active: ['Bayesian MMM', 'M5-style ensembles', 'budget optimization'], blocked: [] }
  ];
}

function weeklyDecisionSystem() {
  return {
    monday: 'Refresh inventory by SKU/size, cash waterfall, 30-day sell-through curve, returns, waitlist and channel ledger.',
    tuesday: 'Write three customer/problem hypotheses and select creative cells; one clean proof asset, one founder asset, one native/UGC asset.',
    wednesday: 'Publish/test on Instagram, TikTok and YouTube; sync product truth to Shopify, Google, Pinterest and Shop.',
    thursday: 'Review qualified sessions, PDP behavior, checkout, comments/DM themes and creator delivery; do not call an early view spike a winner.',
    friday: 'Reconcile orders, contribution, new/returning mix, refund risk and marginal CAC. Scale, hold, revise or kill with a dated receipt.',
    everyDropGate: [
      'Day 3: creative distribution and site-truth check',
      'Day 7: velocity and stock-by-size intervention',
      'Day 14: 50%+ trajectory check and replenishment option',
      'Day 21: 70%+ trajectory check; next PO remains conditional',
      'Day 30: 85% sell-through, contribution, return and cohort decision'
    ]
  };
}

function blindSpots() {
  return [
    gap('definition-drift', 'C$100k must mean reconciled August net sales, not cumulative GMV, tax collected, attributed revenue or inventory at retail.', 'Freeze the definition in Shopify/finance reports.'),
    gap('stockout-censoring', 'Sales stop when sizes stock out, so observed sales can understate demand.', 'Log out-of-stock PDP views, waitlist-by-size and lost-cart signals.'),
    gap('size-curve', 'A drop can reach aggregate sell-through while dead sizes trap cash.', 'Gate reorders by SKU-size weeks of cover and return reason.'),
    gap('returns-lag', 'Fast launch revenue can reverse after the next PO is placed.', 'Use settled contribution and a return reserve before scaling.'),
    gap('channel-overlap', 'Every platform claims the same order.', 'One acquisition source, separate assist table, post-purchase survey and holdouts.'),
    gap('creative-fatigue', '45% more inventory requires more qualified demand, not simply more spend on one winning post.', 'Maintain creative franchises and a weekly renewal quota.'),
    gap('founder-capacity', 'Eight launches plus content, service, logistics and finance can overload one founder.', 'Define operating owner, weekly WIP limit and first hire/contractor trigger.'),
    gap('supplier-lead-time', 'A 40-day cadence fails if approved reorders cannot arrive before the next launch.', 'Negotiate reorder lead time, fabric reservation, QC slot and split-wave PO before scale.'),
    gap('cross-border-cash', 'Duties, DDP/3PL, returns and FX can consume the apparent USD advantage.', 'Maintain Door A/B landed contribution sheet and broker receipts.'),
    gap('tax-nexus', 'Brooklyn pop-ups, creator relationships, inventory location and state thresholds can change obligations.', 'Tax counsel/accountant reviews each operating footprint; do not use a generic nexus assumption.'),
    gap('salary-vs-growth', 'A C$3k monthly founder envelope competes with working capital in the cold start.', 'Use cash gate or ring-fenced bridge; never fund it with sales-tax cash.'),
    gap('dividend-solvency', 'Year-end profit does not automatically equal distributable cash.', 'Accountant/director clearance after tax, payables, returns and next PO.'),
    gap('platform-concentration', 'Algorithm or account shocks can remove a major demand lane.', 'Cap any borrowed/paid platform at 25%; grow owned CRM, search and direct traffic.'),
    gap('brand-dilution', 'Filler frequency can make the house look noisy and train customers to wait.', 'Filler ≤10% of buy unless it passes brand, margin and demand gates.'),
    gap('privacy-consent', 'Pixels, email, SMS, Wi-Fi capture and creator data have consent and retention obligations.', 'Consent ledger, data map, unsubscribe, deletion and vendor-access review.'),
    gap('false-comparables', 'Peer-company sales and platform case studies are mechanisms, not VORG outcomes.', 'Transfer only the mechanism, similarity rationale and a capped VORG test.'),
    gap('prediction-overfit', 'Sophisticated models on tiny data create fake precision.', 'Use the activation ladder; retain simple baseline and frozen forecast.'),
    gap('search-is-not-demand', 'Google/Pinterest/TikTok search movement is interest, not a paid receipt.', 'Require multi-signal confirmation plus VORG click/waitlist/order evidence.'),
    gap('marketplace-margin', 'TikTok Shop or other marketplaces can add fees, returns and price/control risk.', 'Use channel-specific catalog, contribution and inventory policy.'),
    gap('legal-creative', 'Music, disclosures, usage rights and adult casting can block amplification.', 'Commercial music, FTC disclosure, releases and clearly adult talent preflight.')
  ];
}

function evidenceRules() {
  return {
    ladder: [
      { level: 0, name: 'Idea', examples: ['founder instinct', 'one trend'], budgetAuthority: 'watch only' },
      { level: 1, name: 'External prior', examples: ['official platform fact', 'reputable brand case', 'academic mechanism'], budgetAuthority: 'small test design' },
      { level: 2, name: 'VORG intent', examples: ['qualified PDP visit', 'size waitlist', 'DM with product/price'], budgetAuthority: 'sample / capped content test' },
      { level: 3, name: 'VORG transaction', examples: ['settled order', 'deposit', 'POS receipt'], budgetAuthority: 'proof buy / replenishment candidate' },
      { level: 4, name: 'VORG retained contribution', examples: ['order after return window and all variable cost'], budgetAuthority: 'scale candidate' },
      { level: 5, name: 'Repeated causal proof', examples: ['repeat cohort', 'holdout lift', 'two-drop SKU result'], budgetAuthority: 'portfolio scale' }
    ],
    antiGaming: [
      'Owner contributions and loans never count as sales.',
      'Tax collected never counts as net sales.',
      'Gifts, seeded units and exchanges never count as sold-through revenue.',
      'Platform-attributed orders are deduped against Shopify transactions.',
      'Cancelled and refunded orders are reversed.',
      'A goal allocation is never relabeled as a forecast.',
      'Source volume does not replace source independence.'
    ]
  };
}

function limitations() {
  return [
    'The five-SKU unit, price and landed-cost table is still a working assumption pending vendor quotes, samples, size curves and broker-confirmed duties.',
    'The sales curve is a planning shape chosen to backsolve August timing; VORG has not yet observed it.',
    'The C$3,000 founder-pay input is interpreted as a monthly total corporate cash envelope; the founder must confirm if it meant monthly gross salary, net pay, or C$3,000 total for the year.',
    'The 15% income-tax contingency is not a tax calculation. Entity structure, payroll, U.S. trade/business exposure and tax credits remain unresolved.',
    'Channel shares are August order-coverage jobs, not probability estimates or spend authorizations.',
    'No model can manufacture the required product-market fit; the engine makes missing proof visible and changes bet size when receipts arrive.',
    'The result assumes average unit retail and product mix scale proportionally; seasonal and filler pieces must preserve or improve contribution and AOV.',
    'The engine does not authorize production above the founder-stated C$5,000-C$6,000 initial ceiling.'
  ];
}

function scenarioExplanation(id, stalledOnDrop, augustNetSales, salaryPaid, salaryDeferred, previousDropDate) {
  if (stalledOnDrop !== null) return `${id} stalls before Drop ${stalledOnDrop}; cash must be redesigned or bridged before the demand path can continue.`;
  const result = augustNetSales >= CONFIG.targetNetSales ? 'clears' : 'does not clear';
  return `${id} ${result} the August goal at C$${Math.round(augustNetSales).toLocaleString('en-CA')} net sales; salary paid C$${Math.round(salaryPaid).toLocaleString('en-CA')}, deferred C$${Math.round(salaryDeferred).toLocaleString('en-CA')}; last modeled launch ${previousDropDate ? isoDate(previousDropDate) : 'none'}.`;
}

function validateStaticInputs() {
  const base = baseContract();
  if (base.units !== 126 || base.inventoryRetail !== 12060 || base.inventoryCost !== 3712) throw new Error('Base merchandise assumptions drifted.');
  if (CONFIG.growthFloor !== 0.45 || CONFIG.growthTarget !== 0.50) throw new Error('Founder growth contract drifted.');
  if (CONFIG.sellThroughTarget !== 0.85 || CONFIG.targetNetSales !== 100000) throw new Error('Founder outcome contract drifted.');
  const curveShare = sum(CONFIG.salesCurve.map(item => item.share));
  if (Math.abs(curveShare - 1) > 1e-9) throw new Error('Sales curve must sum to 100%.');
}

function channel(id, label, role, targetSharePct, activation, receipt) {
  return Object.freeze({ id, label, role, targetSharePct, activation, receipt });
}

function experiment(id, label, rule) {
  return Object.freeze({ id, label, rule, evidenceClass: 'test-lane-not-forecast' });
}

function method(id, name, activation, translation, guardrail) {
  return Object.freeze({ id, name, activation, translation, guardrail });
}

function gap(id, risk, fix) {
  return Object.freeze({ id, risk, fix });
}

function parseDate(value) {
  return new Date(`${value}T00:00:00Z`);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function isoMonth(date) {
  return date.toISOString().slice(0, 7);
}

function monthStart(value) {
  return parseDate(`${value}-01`);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

function endOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function money(value) {
  return Math.round(value * 100) / 100;
}

function number(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) console.log(JSON.stringify(buildEngine(), null, 2));
