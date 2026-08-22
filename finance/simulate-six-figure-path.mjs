import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const publicPrior = JSON.parse(readFileSync(join(here, '..', 'research', 'commerce-intelligence', 'public-data-model', 'public-commerce-priors.json'), 'utf8'));

const CONFIG = Object.freeze({
  checkedOn: '2026-07-28',
  seed: 260727,
  paths: 50000,
  startDate: '2026-07-28',
  firstLaunchDate: '2026-11-08',
  repeatCycleWeeks: 10,
  maxDrops: 20,
  startingCash: 10000,
  reserveFloor: 1500,
  targetNetSales: 100000,
  ownerContributionAmount: 2000,
  ownerContributionStartDate: '2026-09-28',
  ownerContributionIntervalMonths: 2,
  fundedGrowthTargetRate: 0.45,
  firstDropFixedOverhead: 3750,
  currentRepeatFixedOverhead: 3750,
  leanRepeatFixedOverhead: 1550,
  variableLaunchCostAtBaseScale: 950,
  paymentPercent: 0.028,
  paymentPerOrder: 0.30,
  unitsPerOrder: 1.25,
  additionalRevenueLeakageRate: 0.05,
  includedShippingRate: 0.05,
  ontarioTaxRate: 0.13,
  plannedSessions: 2160,
  plannedPopupVisitors: 135,
  plannedConversionMean: 0.0306,
  trafficCv: 0.35,
  popupTrafficCv: 0.40,
  scaleGrowthCap: 1.25,
  scaleStep: 0.05
});

const PRODUCTS = Object.freeze([
  Object.freeze({ id: 'jacket', units: 12, price: 249, landedCogs: 85 }),
  Object.freeze({ id: 'womens-denim', units: 24, price: 128, landedCogs: 38 }),
  Object.freeze({ id: 'mens-denim', units: 20, price: 128, landedCogs: 38 }),
  Object.freeze({ id: 'scarf', units: 40, price: 35, landedCogs: 12 }),
  Object.freeze({ id: 'womens-top', units: 30, price: 68, landedCogs: 18 })
]);

const BASE = Object.freeze({
  units: sum(PRODUCTS.map(product => product.units)),
  inventoryCost: sum(PRODUCTS.map(product => product.units * product.landedCogs)),
  inventoryRetail: sum(PRODUCTS.map(product => product.units * product.price))
});

const POLICIES = Object.freeze({
  currentCost: Object.freeze({
    id: 'current-cost-repeat',
    label: 'Current cost architecture',
    repeatFixedOverhead: CONFIG.currentRepeatFixedOverhead,
    minimumScale: 1,
    taxIncluded: false
  }),
  leanRepeat: Object.freeze({
    id: 'lean-repeat',
    label: 'Lean repeat architecture',
    repeatFixedOverhead: CONFIG.leanRepeatFixedOverhead,
    minimumScale: 0.75,
    taxIncluded: false
  }),
  leanTaxIncluded: Object.freeze({
    id: 'lean-repeat-tax-included',
    label: 'Lean repeat with Ontario tax inside sticker price',
    repeatFixedOverhead: CONFIG.leanRepeatFixedOverhead,
    minimumScale: 0.75,
    taxIncluded: true
  }),
  fundedGrowth45: Object.freeze({
    id: 'owner-funded-growth-45',
    label: 'C$2,000 every two months with 45% proof-gated growth',
    repeatFixedOverhead: CONFIG.leanRepeatFixedOverhead,
    minimumScale: 0.75,
    taxIncluded: false,
    ownerContributionAmount: CONFIG.ownerContributionAmount,
    ownerContributionStartDate: CONFIG.ownerContributionStartDate,
    ownerContributionIntervalMonths: CONFIG.ownerContributionIntervalMonths,
    netSalesGrowthTargetRate: CONFIG.fundedGrowthTargetRate
  }),
  fundedGrowth45TaxIncluded: Object.freeze({
    id: 'owner-funded-growth-45-tax-included',
    label: 'C$2,000 every two months with 45% proof-gated growth and Ontario HST inside price',
    repeatFixedOverhead: CONFIG.leanRepeatFixedOverhead,
    minimumScale: 0.75,
    taxIncluded: true,
    ownerContributionAmount: CONFIG.ownerContributionAmount,
    ownerContributionStartDate: CONFIG.ownerContributionStartDate,
    ownerContributionIntervalMonths: CONFIG.ownerContributionIntervalMonths,
    netSalesGrowthTargetRate: CONFIG.fundedGrowthTargetRate
  }),
  ownerFundedBaseGrowth: Object.freeze({
    id: 'owner-funded-base-growth',
    label: 'C$2,000 every two months with the original 25% scale cap',
    repeatFixedOverhead: CONFIG.leanRepeatFixedOverhead,
    minimumScale: 0.75,
    taxIncluded: false,
    ownerContributionAmount: CONFIG.ownerContributionAmount,
    ownerContributionStartDate: CONFIG.ownerContributionStartDate,
    ownerContributionIntervalMonths: CONFIG.ownerContributionIntervalMonths
  }),
  growth45NoContributions: Object.freeze({
    id: 'growth-45-no-owner-contributions',
    label: '45% proof-gated growth without additional owner contributions',
    repeatFixedOverhead: CONFIG.leanRepeatFixedOverhead,
    minimumScale: 0.75,
    taxIncluded: false,
    netSalesGrowthTargetRate: CONFIG.fundedGrowthTargetRate
  })
});

validateInputs();

const engineCrossCheck = crossCheckSingleDrop();
const publicCurrent = simulatePortfolio(POLICIES.currentCost, 'public-transfer');
const publicLean = simulatePortfolio(POLICIES.leanRepeat, 'public-transfer');
const proof70 = deterministicPath(POLICIES.leanRepeat, 0.70);
const proof85 = deterministicPath(POLICIES.leanRepeat, 0.85);
const soldOut = deterministicPath(POLICIES.leanRepeat, 1.00);
const proof85TaxIncluded = deterministicPath(POLICIES.leanTaxIncluded, 0.85);
const publicFundedGrowth45 = simulatePortfolio(POLICIES.fundedGrowth45, 'public-transfer');
const fundedGrowth45At70 = deterministicPath(POLICIES.fundedGrowth45, 0.70);
const fundedGrowth45At85 = deterministicPath(POLICIES.fundedGrowth45, 0.85);
const fundedGrowth45SoldOut = deterministicPath(POLICIES.fundedGrowth45, 1.00);
const fundedGrowth45TaxIncludedAt85 = deterministicPath(POLICIES.fundedGrowth45TaxIncluded, 0.85);
const ownerFundingOnlyAt85 = deterministicPath(POLICIES.ownerFundedBaseGrowth, 0.85);
const growth45OnlyAt85 = deterministicPath(POLICIES.growth45NoContributions, 0.85);
const publicOwnerFundingOnly = simulatePortfolio(POLICIES.ownerFundedBaseGrowth, 'public-transfer');
const publicGrowth45Only = simulatePortfolio(POLICIES.growth45NoContributions, 'public-transfer');
const financingThresholds = calculateFinancingThresholds();
const fundedFirstDropSurvivalThresholds = calculateFundedFirstDropSurvivalThresholds();

const output = {
  schemaVersion: 2,
  checkedOn: CONFIG.checkedOn,
  truthClass: 'working-simulation',
  decision: 'Estimate the cash-constrained path from C$10,000 starting cash to C$100,000 cumulative net sales and a C$100,000 trailing-12-month sales pace, including a separately reported C$2,000 bi-monthly owner-funding policy and a proof-gated 45% net-sales growth target.',
  definition: {
    target: 'C$100,000 cumulative net sales, excluding collected sales tax and after modeled unit refunds plus an additional discount/allowance leakage.',
    customerPriceTreatment: 'Listed prices must fund landed COGS, launch overhead, payment fees, and included shipping. Base cases add Ontario HST at checkout and charge the percentage payment fee on the tax-inclusive card total; the tax-inclusive stress removes Ontario HST from the same sticker price.',
    founderPay: 'C$0 withdrawn during compounding, matching the existing reinvest-first rule.',
    incomeTax: 'Excluded because entity structure, taxable profit, and deductions are unresolved.'
  },
  sourceContract: {
    startingCash: CONFIG.startingCash,
    firstDropCommittedCost: BASE.inventoryCost + CONFIG.firstDropFixedOverhead + CONFIG.variableLaunchCostAtBaseScale,
    retainedReserve: CONFIG.startingCash - BASE.inventoryCost - CONFIG.firstDropFixedOverhead - CONFIG.variableLaunchCostAtBaseScale,
    baseUnits: BASE.units,
    baseInventoryRetail: BASE.inventoryRetail,
    baseInventoryCost: BASE.inventoryCost,
    publicPriorVersion: publicPrior.modelVersion,
    publicConversionStrength: publicPrior.engineProfile.directConversionStrength,
    publicRefundStrength: publicPrior.engineProfile.refundStrength,
    simulations: CONFIG.paths,
    seed: CONFIG.seed
  },
  engineCrossCheck,
  financingThresholds,
  publicTransferPaths: [publicCurrent, publicLean],
  thresholdPaths: [proof70, proof85, soldOut, proof85TaxIncluded],
  ownerFundedGrowth45: {
    contributionContract: {
      amount: CONFIG.ownerContributionAmount,
      firstDate: CONFIG.ownerContributionStartDate,
      intervalCalendarMonths: CONFIG.ownerContributionIntervalMonths,
      treatment: 'Owner capital is credited to cash when due and reported separately; it never counts as sales or demand proof.'
    },
    growthContract: {
      targetNetSalesGrowthPctPerDrop: CONFIG.fundedGrowthTargetRate * 100,
      scaleGate: 'Capacity can target 45% net-sales growth only after the preceding drop reaches at least 85% sell-through.',
      measurement: 'Reconciled net sales versus the immediately preceding drop.'
    },
    firstDropSurvivalThresholds: fundedFirstDropSurvivalThresholds,
    publicTransferPath: publicFundedGrowth45,
    thresholdPaths: [fundedGrowth45At70, fundedGrowth45At85, fundedGrowth45SoldOut, fundedGrowth45TaxIncludedAt85],
    causalSensitivityAt85PctSellThrough: {
      ownerFundingWithOriginal25PctScaleCap: ownerFundingOnlyAt85,
      growth45WithoutAdditionalOwnerFunding: growth45OnlyAt85
    },
    causalSensitivityPublicTransfer: {
      ownerFundingWithOriginal25PctScaleCap: publicOwnerFundingOnly,
      growth45WithoutAdditionalOwnerFunding: publicGrowth45Only
    }
  },
  limitations: [
    'VORG has no first-party launch history; public-transfer paths are uncertainty tests, not calibrated forecasts.',
    'Every simulated drop resamples the same cold-start profile; no VORG posterior learning is claimed before first-party outcomes exist.',
    'Traffic is assumed to scale in proportion to inventory. That is optimistic until channel capacity is evidenced.',
    'Inventory scale may rise by at most 25% only after the preceding drop reaches at least 85% sell-through; 70%-84.9% holds scale and lower outcomes force a 20% downshift.',
    'Unsold inventory remains an asset but is assigned zero immediate cash recovery, so it cannot fund the next purchase order.',
    'The lean C$2,500 base-scale repeat overhead is a working redesign target, not a quoted operating fact.',
    'C$950 of launch cost at the 126-unit base scale is treated as variable packaging and paid-demand capacity and scales with inventory.',
    'The base checkout-fee calculation uses Ontario HST; the Ottawa/Gatineau customer mix and exact destination-tax handling remain unresolved.',
    'The new C$2,000 owner contribution is a scenario input, not revenue; the first modeled contribution is September 28, 2026 and timing changes will alter cash availability.',
    'The 45% figure is a target, not an observed growth rate. Owner capital cannot clear the 85% sell-through proof gate.',
    'Vendor MOQs, size-level stock, tax registration, input-tax credits, founder compensation, income tax, and product returns timing remain unresolved.'
  ]
};

console.log(JSON.stringify(output, null, 2));

function validateInputs() {
  if (publicPrior.profileId !== 'public-transfer-v1') throw new Error('Canonical public-transfer-v1 artifact is required.');
  if (publicPrior.engineProfile.directConversionStrength !== 7.75785 || publicPrior.engineProfile.refundStrength !== 4) {
    throw new Error('Public prior strengths drifted; review and update the growth simulation explicitly.');
  }
  if (BASE.units !== 126 || BASE.inventoryCost !== 3712 || BASE.inventoryRetail !== 12060) {
    throw new Error('Drop 001 base merchandise contract drifted.');
  }
  if (BASE.inventoryCost + CONFIG.firstDropFixedOverhead + CONFIG.variableLaunchCostAtBaseScale !== 8412) {
    throw new Error('First-drop committed cost must remain C$8,412.');
  }
  if (CONFIG.ownerContributionAmount !== 2000 || CONFIG.ownerContributionIntervalMonths !== 2 ||
    CONFIG.fundedGrowthTargetRate !== 0.45) {
    throw new Error('Owner-funding or 45% growth contract drifted; review the scenario explicitly.');
  }
}

function crossCheckSingleDrop() {
  const rng = mulberry32(260722);
  const trials = Array.from({ length: 10000 }, () => simulateDemand(1, rng, 'public-transfer'));
  const revenue = percentileTriplet(trials.map(trial => trial.displayedRevenue));
  const units = percentileTriplet(trials.map(trial => trial.unitsSold));
  const sellThrough = percentileTriplet(trials.map(trial => trial.sellThroughPct), 1);
  const expected = {
    revenue: { p10: 831, p50: 4299, p90: 12060 },
    units: { p10: 9, p50: 45, p90: 126 },
    sellThrough: { p10: 7.1, p50: 35.7, p90: 100 }
  };
  const matches = JSON.stringify({ revenue, units, sellThrough }) === JSON.stringify(expected);
  if (!matches) throw new Error(`Single-drop simulation drifted from Forecast Lab: ${JSON.stringify({ revenue, units, sellThrough })}`);
  return { simulations: 10000, seed: 260722, matchesForecastLab: true, revenue, units, sellThrough };
}

function simulatePortfolio(policy, demandMode) {
  const paths = [];
  for (let pathIndex = 0; pathIndex < CONFIG.paths; pathIndex += 1) {
    paths.push(simulatePath(policy, demandMode, mulberry32(CONFIG.seed + pathIndex * 7919)));
  }
  return summarizePaths(policy, demandMode, paths);
}

function simulatePath(policy, demandMode, rng, fixedSellThrough = null, stopOnTarget = false) {
  let cash = CONFIG.startingCash;
  let scale = 1;
  let cumulativeNetSales = 0;
  let cumulativeDisplayedSales = 0;
  let strandedInventoryCost = 0;
  let targetDrop = null;
  let annualPaceDrop = null;
  let stalledAfterDrop = null;
  let previousSellThroughPct = null;
  let previousInventoryRetail = BASE.inventoryRetail;
  let previousDropDate = null;
  let contributionIndex = 0;
  let ownerCapitalContributed = 0;
  const ledger = [];

  const creditContributionsThrough = dateValue => {
    let credited = 0;
    while (policy.ownerContributionAmount > 0) {
      const dueDate = ownerContributionDate(policy, contributionIndex);
      if (dueDate === null || dueDate > dateValue) break;
      cash += policy.ownerContributionAmount;
      credited += policy.ownerContributionAmount;
      ownerCapitalContributed += policy.ownerContributionAmount;
      contributionIndex += 1;
    }
    return credited;
  };

  for (let dropNumber = 1; dropNumber <= CONFIG.maxDrops; dropNumber += 1) {
    let date = dropNumber === 1
      ? CONFIG.firstLaunchDate
      : addWeeks(previousDropDate, CONFIG.repeatCycleWeeks);
    let ownerCapitalAddedBeforeDrop = creditContributionsThrough(date);
    const fixedOverhead = dropNumber === 1 ? CONFIG.firstDropFixedOverhead : policy.repeatFixedOverhead;
    if (dropNumber > 1) {
      const proofMultiplier = previousSellThroughPct >= 85
        ? CONFIG.scaleGrowthCap
        : previousSellThroughPct >= 70
          ? 1
          : 0.8;
      const growthGateCleared = previousSellThroughPct >= 85 && policy.netSalesGrowthTargetRate > 0;
      const desiredScale = growthGateCleared
        ? minimumScaleForRetailGrowth(previousInventoryRetail, 1 + policy.netSalesGrowthTargetRate)
        : scale * proofMultiplier;
      const requiredScale = growthGateCleared ? desiredScale : policy.minimumScale;
      let affordableScale = affordableInventoryScale(cash, fixedOverhead);

      while (!canFundScale(cash, fixedOverhead, requiredScale) && policy.ownerContributionAmount > 0) {
        const dueDate = ownerContributionDate(policy, contributionIndex);
        if (dueDate === null) break;
        date = dueDate;
        ownerCapitalAddedBeforeDrop += creditContributionsThrough(date);
        affordableScale = affordableInventoryScale(cash, fixedOverhead);
      }

      scale = growthGateCleared && canFundScale(cash, fixedOverhead, desiredScale)
        ? desiredScale
        : floorToStep(Math.min(desiredScale, affordableScale), CONFIG.scaleStep);
      while (scale >= policy.minimumScale && !canFundScale(cash, fixedOverhead, scale)) {
        scale = floorToStep(scale - CONFIG.scaleStep, CONFIG.scaleStep);
      }
      if (scale < policy.minimumScale) {
        stalledAfterDrop = dropNumber - 1;
        break;
      }
    }

    const products = scaledProducts(scale);
    const actualScale = sum(products.map(product => product.units)) / BASE.units;
    const inventoryRetail = sum(products.map(product => product.units * product.price));
    const inventoryCost = sum(products.map(product => product.units * product.landedCogs));
    const variableLaunchCost = CONFIG.variableLaunchCostAtBaseScale * actualScale;
    const upfrontCost = inventoryCost + fixedOverhead + variableLaunchCost;
    if (cash - upfrontCost < CONFIG.reserveFloor - 0.01) {
      stalledAfterDrop = dropNumber - 1;
      break;
    }

    const openingCash = cash;
    cash -= upfrontCost;
    const demand = fixedSellThrough === null
      ? simulateDemand(actualScale, rng, demandMode, products)
      : deterministicDemand(products, fixedSellThrough);
    const economics = accountForSale(demand, policy.taxIncluded ? CONFIG.ontarioTaxRate : 0);
    cash += economics.cashReceipt;
    cumulativeNetSales += economics.netSales;
    cumulativeDisplayedSales += demand.displayedRevenue;
    strandedInventoryCost += demand.unsoldInventoryCost;

    ledger.push({
      dropNumber,
      date,
      scale: round(actualScale, 3),
      inventoryUnits: demand.inventoryUnits,
      inventoryRetail: round(inventoryRetail, 2),
      unitsSold: demand.unitsSold,
      sellThroughPct: round(demand.sellThroughPct, 1),
      displayedRevenue: round(demand.displayedRevenue, 2),
      netSales: round(economics.netSales, 2),
      fixedOverhead: round(fixedOverhead, 2),
      variableLaunchCost: round(variableLaunchCost, 2),
      upfrontCost: round(upfrontCost, 2),
      ownerCapitalAddedBeforeDrop: round(ownerCapitalAddedBeforeDrop, 2),
      cumulativeOwnerCapital: round(ownerCapitalContributed, 2),
      endingCash: round(cash, 2),
      cumulativeNetSales: round(cumulativeNetSales, 2)
    });

    if (targetDrop === null && cumulativeNetSales >= CONFIG.targetNetSales) targetDrop = dropNumber;
    const trailingNetSales = ledger
      .filter(entry => daysBetween(entry.date, date) <= 365)
      .reduce((total, entry) => total + entry.netSales, 0);
    if (annualPaceDrop === null && trailingNetSales >= CONFIG.targetNetSales) annualPaceDrop = dropNumber;
    if (stopOnTarget && targetDrop !== null) break;
    previousSellThroughPct = demand.sellThroughPct;
    previousInventoryRetail = inventoryRetail;
    previousDropDate = date;
    scale = actualScale;

    if (cash < 0 || !Number.isFinite(cash)) throw new Error(`Invalid cash state after drop ${dropNumber}.`);
    if (openingCash < upfrontCost + CONFIG.reserveFloor - 0.01) throw new Error(`Reserve rule failed before drop ${dropNumber}.`);
  }

  return {
    targetDrop,
    targetDate: targetDrop === null ? null : ledger[targetDrop - 1].date,
    targetWeeks: targetDrop === null ? null : weeksFromStart(ledger[targetDrop - 1].date),
    annualPaceDrop,
    annualPaceDate: annualPaceDrop === null ? null : ledger[annualPaceDrop - 1].date,
    stalledAfterDrop,
    completedDrops: ledger.length,
    cumulativeNetSales: round(cumulativeNetSales, 2),
    cumulativeDisplayedSales: round(cumulativeDisplayedSales, 2),
    endingCash: round(cash, 2),
    ownerCapitalContributed: round(ownerCapitalContributed, 2),
    strandedInventoryCost: round(strandedInventoryCost, 2),
    ledger
  };
}

function summarizePaths(policy, demandMode, paths) {
  const success24 = paths.filter(path => path.targetWeeks !== null && path.targetWeeks <= 104.36).length;
  const success36 = paths.filter(path => path.targetWeeks !== null && path.targetWeeks <= 156.54).length;
  const success48 = paths.filter(path => path.targetWeeks !== null && path.targetWeeks <= 208.71).length;
  const annual48 = paths.filter(path => path.annualPaceDrop !== null && weeksFromStart(path.annualPaceDate) <= 208.71).length;
  const successfulWeeks = paths.map(path => path.targetWeeks).filter(value => value !== null).sort((a, b) => a - b);
  const successfulDrops = paths.map(path => path.targetDrop).filter(value => value !== null).sort((a, b) => a - b);
  const firstDrops = paths.map(path => path.ledger[0]).filter(Boolean);
  const growthTargetPct = policy.netSalesGrowthTargetRate > 0 ? policy.netSalesGrowthTargetRate * 100 : null;
  const pathsMeetingFirstFiveGrowthTarget = growthTargetPct === null ? null : paths.filter(path => {
    if (path.ledger.length < 5) return false;
    const rates = netSalesGrowthRates(path.ledger.slice(0, 5));
    return rates.length === 4 && rates.every(rate => rate !== null && rate + 1e-9 >= growthTargetPct);
  }).length;
  const successfulOwnerCapital = paths
    .filter(path => path.targetDrop !== null)
    .map(path => path.ledger[path.targetDrop - 1].cumulativeOwnerCapital);
  return {
    id: policy.id,
    label: policy.label,
    demandMode,
    repeatOverheadAtBaseScale: policy.repeatFixedOverhead + CONFIG.variableLaunchCostAtBaseScale,
    repeatFixedOverhead: policy.repeatFixedOverhead,
    variableLaunchCostAtBaseScale: CONFIG.variableLaunchCostAtBaseScale,
    minimumScale: policy.minimumScale,
    taxIncluded: policy.taxIncluded,
    ownerContributionAmount: policy.ownerContributionAmount ?? 0,
    ownerContributionStartDate: policy.ownerContributionStartDate ?? null,
    ownerContributionIntervalMonths: policy.ownerContributionIntervalMonths ?? null,
    targetNetSalesGrowthPctPerDrop: growthTargetPct,
    paths: paths.length,
    probabilityCumulativeNetSales100k: {
      within24MonthsPct: percent(success24, paths.length),
      within36MonthsPct: percent(success36, paths.length),
      within48MonthsPct: percent(success48, paths.length)
    },
    probabilityAnnualPace100kWithin48MonthsPct: percent(annual48, paths.length),
    probabilityStallAfterFirstDropPct: percent(paths.filter(path => path.stalledAfterDrop === 1).length, paths.length),
    probabilityFirstFiveDropsMeetGrowthTargetPct: pathsMeetingFirstFiveGrowthTarget === null
      ? null
      : percent(pathsMeetingFirstFiveGrowthTarget, paths.length),
    firstDropEconomics: {
      netSales: percentileTriplet(firstDrops.map(entry => entry.netSales), 0),
      endingCash: percentileTriplet(firstDrops.map(entry => entry.endingCash), 0),
      sellThroughPct: percentileTriplet(firstDrops.map(entry => entry.sellThroughPct), 1)
    },
    conditionalTimeAmongSuccessfulPaths: successfulWeeks.length ? {
      drops: percentileTriplet(successfulDrops, 0),
      weeks: percentileTriplet(successfulWeeks, 1),
      medianDate: dateFromWeeks(quantileSorted(successfulWeeks, 0.5)),
      ownerCapitalAtTarget: percentileTriplet(successfulOwnerCapital, 0)
    } : null,
    terminalOutcomesBy48Months: {
      cumulativeNetSales: percentileTriplet(paths.map(path => path.cumulativeNetSales), 0),
      endingCash: percentileTriplet(paths.map(path => path.endingCash), 0),
      completedDrops: percentileTriplet(paths.map(path => path.completedDrops), 0),
      ownerCapitalContributed: percentileTriplet(paths.map(path => path.ownerCapitalContributed), 0)
    }
  };
}

function deterministicPath(policy, sellThrough) {
  const path = simulatePath(policy, 'fixed-threshold', mulberry32(CONFIG.seed), sellThrough, true);
  const targetEntry = path.targetDrop === null ? null : path.ledger[path.targetDrop - 1];
  const growthRates = netSalesGrowthRates(path.ledger);
  const growthTargetPct = policy.netSalesGrowthTargetRate > 0 ? policy.netSalesGrowthTargetRate * 100 : null;
  return {
    id: `${policy.id}-${Math.round(sellThrough * 100)}pct`,
    label: `${policy.label} at ${Math.round(sellThrough * 100)}% sell-through every drop`,
    sellThroughPct: sellThrough * 100,
    repeatOverheadAtBaseScale: policy.repeatFixedOverhead + CONFIG.variableLaunchCostAtBaseScale,
    taxIncluded: policy.taxIncluded,
    ownerContributionAmount: policy.ownerContributionAmount ?? 0,
    ownerContributionStartDate: policy.ownerContributionStartDate ?? null,
    targetNetSalesGrowthPctPerDrop: growthTargetPct,
    reachesCumulativeNetSales100k: path.targetDrop !== null,
    targetDrop: path.targetDrop,
    targetDate: path.targetDate,
    targetWeeks: path.targetWeeks,
    annualPaceDrop: path.annualPaceDrop,
    annualPaceDate: path.annualPaceDate,
    stalledAfterDrop: path.stalledAfterDrop,
    netSalesAtTarget: targetEntry?.cumulativeNetSales ?? null,
    cashAtTarget: targetEntry?.endingCash ?? null,
    ownerCapitalAtTarget: targetEntry?.cumulativeOwnerCapital ?? null,
    totalOwnerCapitalAtTarget: targetEntry === undefined || targetEntry === null
      ? null
      : CONFIG.startingCash + targetEntry.cumulativeOwnerCapital,
    inventoryUnitsAtTarget: targetEntry?.inventoryUnits ?? null,
    netSalesGrowthPctByDrop: growthRates,
    allCompletedGrowthStepsMeetTarget: growthTargetPct === null
      ? null
      : growthRates.every(rate => rate !== null && rate + 1e-9 >= growthTargetPct),
    ledger: path.ledger
  };
}

function simulateDemand(scale, rng, demandMode, products = scaledProducts(scale)) {
  if (demandMode !== 'public-transfer') throw new Error(`Unsupported demand mode: ${demandMode}`);
  const sessions = Math.max(0, Math.round(sampleLogNormalMean(CONFIG.plannedSessions * scale, CONFIG.trafficCv, rng)));
  const popupVisitors = Math.max(0, Math.round(sampleLogNormalMean(CONFIG.plannedPopupVisitors * scale, CONFIG.popupTrafficCv, rng)));
  const sessionToView = sampleBeta(2, 3, rng);
  const viewToCart = sampleBeta(1, 9, rng);
  const cartToCheckout = sampleBeta(2, 3, rng);
  sampleBeta(2, 3, rng); // checkout-to-purchase draw retained for Forecast Lab RNG parity.
  const refundRate = sampleBeta(0.05 * publicPrior.engineProfile.refundStrength, 0.95 * publicPrior.engineProfile.refundStrength, rng);
  const popupPurchaseRate = sampleBeta(1.5, 8.5, rng);
  sampleBeta(3, 2, rng); // reservation conversion draw; reservations are zero.
  const futureViews = sampleBinomial(sessions, sessionToView, rng);
  const futureCarts = sampleBinomial(futureViews, viewToCart, rng);
  sampleBinomial(futureCarts, cartToCheckout, rng); // checkout count retained for RNG parity.
  const directStrength = publicPrior.engineProfile.directConversionStrength;
  const directConversion = sampleBeta(CONFIG.plannedConversionMean * directStrength, (1 - CONFIG.plannedConversionMean) * directStrength, rng);
  const onlineOrders = sampleBinomial(sessions, directConversion, rng);
  const onlineGrossUnits = onlineOrders + samplePoisson(Math.max(0, CONFIG.unitsPerOrder - 1) * onlineOrders, rng);
  const onlineDemandUnits = Math.max(0, onlineGrossUnits - sampleBinomial(onlineGrossUnits, refundRate, rng));
  const popupOrders = sampleBinomial(popupVisitors, popupPurchaseRate, rng);
  const popupGrossUnits = popupOrders + samplePoisson(Math.max(0, CONFIG.unitsPerOrder - 1) * popupOrders, rng);
  const popupDemandUnits = Math.max(0, popupGrossUnits - sampleBinomial(popupGrossUnits, refundRate, rng));
  const weights = products.map(product => product.units);
  const onlineAllocation = allocateCount(onlineDemandUnits, weights, rng);
  const popupAllocation = allocateCount(popupDemandUnits, weights, rng);
  return demandFromAllocations(products, onlineAllocation, popupAllocation);
}

function demandFromAllocations(products, onlineAllocation, popupAllocation) {
  let unitsSold = 0;
  let displayedRevenue = 0;
  let unsoldInventoryCost = 0;
  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    const demand = (onlineAllocation[index] || 0) + (popupAllocation[index] || 0);
    const sold = Math.min(demand, product.units);
    unitsSold += sold;
    displayedRevenue += sold * product.price;
    unsoldInventoryCost += Math.max(0, product.units - sold) * product.landedCogs;
  }
  const inventoryUnits = sum(products.map(product => product.units));
  return {
    inventoryUnits,
    unitsSold,
    sellThroughPct: inventoryUnits > 0 ? (unitsSold / inventoryUnits) * 100 : 0,
    displayedRevenue,
    unsoldInventoryCost
  };
}

function deterministicDemand(products, sellThrough) {
  const inventoryUnits = sum(products.map(product => product.units));
  const displayedRevenue = sum(products.map(product => product.units * product.price)) * sellThrough;
  const unsoldInventoryCost = sum(products.map(product => product.units * product.landedCogs)) * (1 - sellThrough);
  return {
    inventoryUnits,
    unitsSold: inventoryUnits * sellThrough,
    sellThroughPct: sellThrough * 100,
    displayedRevenue,
    unsoldInventoryCost
  };
}

function accountForSale(demand, includedTaxRate = 0) {
  const preTaxDisplayedRevenue = includedTaxRate > 0
    ? demand.displayedRevenue / (1 + includedTaxRate)
    : demand.displayedRevenue;
  const additionalRevenueLeakage = preTaxDisplayedRevenue * CONFIG.additionalRevenueLeakageRate;
  const netSales = preTaxDisplayedRevenue - additionalRevenueLeakage;
  const includedShippingCost = preTaxDisplayedRevenue * CONFIG.includedShippingRate;
  const orders = demand.unitsSold / CONFIG.unitsPerOrder;
  const cardCharge = includedTaxRate > 0
    ? netSales * (1 + includedTaxRate)
    : netSales * (1 + CONFIG.ontarioTaxRate);
  const paymentFees = cardCharge * CONFIG.paymentPercent + orders * CONFIG.paymentPerOrder;
  return {
    preTaxDisplayedRevenue,
    netSales,
    additionalRevenueLeakage,
    includedShippingCost,
    paymentFees,
    cashReceipt: netSales - includedShippingCost - paymentFees
  };
}

function calculateFinancingThresholds() {
  const openingCashAfterCommittedSpend = CONFIG.startingCash - BASE.inventoryCost - CONFIG.firstDropFixedOverhead - CONFIG.variableLaunchCostAtBaseScale;
  const fullDemand = deterministicDemand(PRODUCTS, 1);
  const leanMinimumInventoryCost = sum(scaledProducts(POLICIES.leanRepeat.minimumScale).map(product => product.units * product.landedCogs));
  const requirements = {
    preserveStartingCash: CONFIG.startingCash,
    fundCurrentFullRepeat: CONFIG.reserveFloor + CONFIG.currentRepeatFixedOverhead + CONFIG.variableLaunchCostAtBaseScale + BASE.inventoryCost,
    fundLeanFullRepeat: CONFIG.reserveFloor + CONFIG.leanRepeatFixedOverhead + CONFIG.variableLaunchCostAtBaseScale + BASE.inventoryCost,
    fundLeanMinimumRepeat: CONFIG.reserveFloor + CONFIG.leanRepeatFixedOverhead +
      CONFIG.variableLaunchCostAtBaseScale * POLICIES.leanRepeat.minimumScale + leanMinimumInventoryCost
  };
  const thresholdsForTax = taxRate => {
    const fullSellThroughCashReceipt = accountForSale(fullDemand, taxRate).cashReceipt;
    return Object.fromEntries(Object.entries(requirements).map(([key, requiredEndingCash]) => [
      key,
      round((requiredEndingCash - openingCashAfterCommittedSpend) / fullSellThroughCashReceipt * 100, 1)
    ]));
  };
  return {
    taxAddedAtCheckout: thresholdsForTax(0),
    ontarioHstIncludedInStickerPrice: thresholdsForTax(CONFIG.ontarioTaxRate),
    priceUpliftNeededAt85PctSellThroughToPreserveC10k: {
      taxAddedAtCheckoutPct: priceUpliftForEndingCash(0.85, 0, CONFIG.startingCash),
      ontarioHstIncludedPct: priceUpliftForEndingCash(0.85, CONFIG.ontarioTaxRate, CONFIG.startingCash),
      quebecGstQstIncludedPct: priceUpliftForEndingCash(0.85, 0.14975, CONFIG.startingCash)
    }
  };
}

function calculateFundedFirstDropSurvivalThresholds() {
  const capitalBeforeFirstDrop = CONFIG.ownerContributionAmount;
  const capitalBeforeSecondDrop = CONFIG.ownerContributionAmount;
  const openingCashAfterCommittedSpend = CONFIG.startingCash + capitalBeforeFirstDrop -
    BASE.inventoryCost - CONFIG.firstDropFixedOverhead - CONFIG.variableLaunchCostAtBaseScale;
  const fullDemand = deterministicDemand(PRODUCTS, 1);
  const leanMinimumInventoryCost = sum(scaledProducts(POLICIES.leanRepeat.minimumScale).map(product => product.units * product.landedCogs));
  const requirementsBeforeNextContribution = {
    preserveCumulativeOwnerCapitalBeforeLaunch: CONFIG.startingCash + capitalBeforeFirstDrop,
    fundCurrentFullRepeatAndReserve: CONFIG.reserveFloor + CONFIG.currentRepeatFixedOverhead +
      CONFIG.variableLaunchCostAtBaseScale + BASE.inventoryCost - capitalBeforeSecondDrop,
    fundLeanFullRepeatAndReserve: CONFIG.reserveFloor + CONFIG.leanRepeatFixedOverhead +
      CONFIG.variableLaunchCostAtBaseScale + BASE.inventoryCost - capitalBeforeSecondDrop,
    fundLeanMinimumRepeatAndReserve: CONFIG.reserveFloor + CONFIG.leanRepeatFixedOverhead +
      CONFIG.variableLaunchCostAtBaseScale * POLICIES.leanRepeat.minimumScale + leanMinimumInventoryCost -
      capitalBeforeSecondDrop
  };
  const thresholdsForTax = taxRate => {
    const fullSellThroughCashReceipt = accountForSale(fullDemand, taxRate).cashReceipt;
    return Object.fromEntries(Object.entries(requirementsBeforeNextContribution).map(([key, requiredEndingCash]) => [
      key,
      Math.max(0, round((requiredEndingCash - openingCashAfterCommittedSpend) / fullSellThroughCashReceipt * 100, 1))
    ]));
  };
  return {
    capitalBeforeFirstDrop,
    capitalBeforeSecondDrop,
    explanation: 'The September contribution is available before Drop 001; the November contribution is counted only when testing whether the January repeat can be funded.',
    taxAddedAtCheckout: thresholdsForTax(0),
    ontarioHstIncludedInStickerPrice: thresholdsForTax(CONFIG.ontarioTaxRate)
  };
}

function priceUpliftForEndingCash(sellThrough, includedTaxRate, targetEndingCash) {
  const baseDemand = deterministicDemand(PRODUCTS, sellThrough);
  let low = 0.5;
  let high = 3;
  for (let iteration = 0; iteration < 80; iteration += 1) {
    const multiplier = (low + high) / 2;
    const demand = { ...baseDemand, displayedRevenue: baseDemand.displayedRevenue * multiplier };
    const endingCash = CONFIG.startingCash - BASE.inventoryCost - CONFIG.firstDropFixedOverhead - CONFIG.variableLaunchCostAtBaseScale +
      accountForSale(demand, includedTaxRate).cashReceipt;
    if (endingCash >= targetEndingCash) high = multiplier;
    else low = multiplier;
  }
  return Math.max(0, round((high - 1) * 100, 1));
}

function scaledProducts(scale) {
  const targetUnits = Math.max(1, Math.round(BASE.units * scale));
  return productsForUnitCount(targetUnits);
}

function productsForUnitCount(targetUnits) {
  const exactUnits = PRODUCTS.map(product => product.units / BASE.units * targetUnits);
  const units = exactUnits.map(Math.floor);
  let remainder = targetUnits - sum(units);
  exactUnits
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((left, right) => right.fraction - left.fraction || left.index - right.index)
    .forEach(item => {
      if (remainder <= 0) return;
      units[item.index] += 1;
      remainder -= 1;
    });
  return PRODUCTS.map((product, index) => ({ ...product, units: units[index] }));
}

function minimumScaleForRetailGrowth(previousInventoryRetail, multiplier) {
  const targetRetail = previousInventoryRetail * multiplier;
  let targetUnits = Math.max(1, Math.ceil(BASE.units * targetRetail / BASE.inventoryRetail));
  while (sum(productsForUnitCount(targetUnits).map(product => product.units * product.price)) + 1e-9 < targetRetail) {
    targetUnits += 1;
  }
  return targetUnits / BASE.units;
}

function affordableInventoryScale(cash, fixedOverhead) {
  return (cash - CONFIG.reserveFloor - fixedOverhead) /
    (BASE.inventoryCost + CONFIG.variableLaunchCostAtBaseScale);
}

function canFundScale(cash, fixedOverhead, scale) {
  const products = scaledProducts(scale);
  const actualScale = sum(products.map(product => product.units)) / BASE.units;
  const inventoryCost = sum(products.map(product => product.units * product.landedCogs));
  const variableLaunchCost = CONFIG.variableLaunchCostAtBaseScale * actualScale;
  return cash - inventoryCost - fixedOverhead - variableLaunchCost >= CONFIG.reserveFloor - 0.01;
}

function ownerContributionDate(policy, contributionIndex) {
  if (!(policy.ownerContributionAmount > 0) || !policy.ownerContributionStartDate || !(policy.ownerContributionIntervalMonths > 0)) {
    return null;
  }
  const date = new Date(`${policy.ownerContributionStartDate}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + contributionIndex * policy.ownerContributionIntervalMonths);
  return date.toISOString().slice(0, 10);
}

function addWeeks(dateValue, weeks) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + weeks * 7);
  return date.toISOString().slice(0, 10);
}

function dropDate(dropNumber) {
  const date = new Date(`${CONFIG.firstLaunchDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + (dropNumber - 1) * CONFIG.repeatCycleWeeks * 7);
  return date.toISOString().slice(0, 10);
}

function weeksFromStart(dateValue) {
  return round(daysBetween(CONFIG.startDate, dateValue) / 7, 1);
}

function dateFromWeeks(weeks) {
  const date = new Date(`${CONFIG.startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Math.round(weeks * 7));
  return date.toISOString().slice(0, 10);
}

function daysBetween(leftValue, rightValue) {
  const left = new Date(`${leftValue}T00:00:00Z`);
  const right = new Date(`${rightValue}T00:00:00Z`);
  return Math.abs((right - left) / 86400000);
}

function percentileTriplet(values, digits = 0) {
  const sorted = values.slice().sort((left, right) => left - right);
  return {
    p10: round(quantileSorted(sorted, 0.1), digits),
    p50: round(quantileSorted(sorted, 0.5), digits),
    p90: round(quantileSorted(sorted, 0.9), digits)
  };
}

function netSalesGrowthRates(ledger) {
  return ledger.slice(1).map((entry, index) => {
    const previousNetSales = ledger[index].netSales;
    return previousNetSales > 0
      ? round((entry.netSales / previousNetSales - 1) * 100, 1)
      : null;
  });
}

function quantileSorted(sorted, q) {
  if (!sorted.length) return null;
  if (sorted.length === 1) return sorted[0];
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const remainder = position - base;
  const next = sorted[base + 1];
  return next === undefined ? sorted[base] : sorted[base] + remainder * (next - sorted[base]);
}

function allocateCount(count, weights, rng) {
  let remainingCount = Math.max(0, Math.round(count));
  let remainingWeight = sum(weights);
  const result = weights.map(() => 0);
  weights.forEach((weight, index) => {
    if (index === weights.length - 1) {
      result[index] = remainingCount;
      return;
    }
    const probability = remainingWeight > 0 ? weight / remainingWeight : 1 / (weights.length - index);
    const allocated = sampleBinomial(remainingCount, probability, rng);
    result[index] = allocated;
    remainingCount -= allocated;
    remainingWeight -= weight;
  });
  return result;
}

function sampleBinomial(n, p, rng) {
  const trials = Math.max(0, Math.round(n));
  const probability = clamp(p, 0, 1);
  if (trials === 0 || probability === 0) return 0;
  if (probability === 1) return trials;
  if (trials <= 500) {
    let successes = 0;
    for (let index = 0; index < trials; index += 1) if (rng() < probability) successes += 1;
    return successes;
  }
  const mean = trials * probability;
  const standardDeviation = Math.sqrt(trials * probability * (1 - probability));
  return Math.round(clamp(mean + standardDeviation * sampleNormal(rng), 0, trials));
}

function samplePoisson(lambda, rng) {
  if (!Number.isFinite(lambda) || lambda <= 0) return 0;
  if (lambda >= 30) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * sampleNormal(rng)));
  const limit = Math.exp(-lambda);
  let product = 1;
  let count = 0;
  do {
    count += 1;
    product *= rng();
  } while (product > limit);
  return count - 1;
}

function sampleBeta(a, b, rng) {
  const left = sampleGamma(Math.max(0.01, a), rng);
  const right = sampleGamma(Math.max(0.01, b), rng);
  return left + right > 0 ? left / (left + right) : 0;
}

function sampleGamma(shape, rng) {
  if (shape < 1) return sampleGamma(shape + 1, rng) * Math.pow(Math.max(rng(), Number.EPSILON), 1 / shape);
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    const normal = sampleNormal(rng);
    const vBase = 1 + c * normal;
    if (vBase <= 0) continue;
    const v = vBase ** 3;
    const uniform = rng();
    if (uniform < 1 - 0.0331 * normal ** 4) return d * v;
    if (Math.log(uniform) < 0.5 * normal ** 2 + d * (1 - v + Math.log(v))) return d * v;
  }
}

function sampleNormal(rng) {
  const first = Math.max(rng(), Number.EPSILON);
  const second = Math.max(rng(), Number.EPSILON);
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
}

function sampleLogNormalMean(mean, coefficientOfVariation, rng) {
  if (mean <= 0) return 0;
  const variance = Math.log(1 + coefficientOfVariation ** 2);
  const sigma = Math.sqrt(variance);
  const mu = Math.log(mean) - variance / 2;
  return Math.exp(mu + sigma * sampleNormal(rng));
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function floorToStep(value, step) {
  return Math.floor((Math.max(0, value) + 1e-9) / step) * step;
}

function percent(count, total) {
  return total > 0 ? round(count / total * 100, 1) : 0;
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function round(value, digits = 0) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}
