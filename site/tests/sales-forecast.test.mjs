import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const bundlePath = join(here, '..', 'sales-forecast.js');
const syntheticFixturePath = join(here, '..', 'forecast-synthetic-fixture.js');
const publicPriorPath = join(here, '..', '..', 'research', 'commerce-intelligence', 'public-data-model', 'public-commerce-priors.json');
const source = readFileSync(bundlePath, 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: bundlePath });
vm.runInContext(readFileSync(syntheticFixturePath, 'utf8'), sandbox, { filename: syntheticFixturePath });

const forecast = sandbox.VorgSalesForecast;
const syntheticFixture = sandbox.VorgSyntheticForecastFixture;
const publicPriorArtifact = JSON.parse(readFileSync(publicPriorPath, 'utf8'));
const publicPriorInput = {
  id: publicPriorArtifact.profileId,
  modelVersion: publicPriorArtifact.modelVersion,
  checkedOn: publicPriorArtifact.checkedOn,
  directConversionStrength: publicPriorArtifact.engineProfile.directConversionStrength,
  refundStrength: publicPriorArtifact.engineProfile.refundStrength,
  sourceUrls: publicPriorArtifact.sources.map(source => source.url)
};
assert.ok(forecast, 'forecast global exists');
assert.ok(syntheticFixture?.synthetic, 'synthetic forecast fixture exists and self-identifies');
assert.equal(Object.isFrozen(syntheticFixture.input.products[0].variants), true, 'synthetic fixture is deeply immutable');
assert.equal(forecast.FORECAST_VERSION, 'VORG Sales Forecast v1.1');
assert.equal(forecast.hasEvidenceReference('https://example.com/receipt'), true);
assert.equal(forecast.hasEvidenceReference('launch/traffic-plan.md'), true);
assert.equal(forecast.hasEvidenceReference('TBD'), false);
assert.equal(forecast.isSyntheticEvidenceReference('fixtures/synthetic-forecast/traffic-receipt.csv'), true);
assert.equal(forecast.isSyntheticEvidenceReference('reports/drop-001-actuals.csv'), false);

const parseCsv = relativePath => {
  const rows = readFileSync(join(here, '..', relativePath), 'utf8').trim().split(/\r?\n/).map(line => line.split(','));
  const headers = rows.shift();
  return rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
};
const syntheticTrafficRows = parseCsv('fixtures/synthetic-forecast/traffic-receipt.csv');
const syntheticFunnelRow = parseCsv('fixtures/synthetic-forecast/funnel-receipt.csv')[0];
const syntheticReservationRow = parseCsv('fixtures/synthetic-forecast/reservation-receipt.csv')[0];
const syntheticOutcomeRow = parseCsv('fixtures/synthetic-forecast/outcome-receipt.csv')[0];
assert.equal(Number(syntheticTrafficRows.find(row => row.channel === 'total').sessions), syntheticFixture.input.observed.sessions);
assert.equal(Number(syntheticFunnelRow.product_views), syntheticFixture.input.observed.productViews);
assert.equal(Number(syntheticFunnelRow.purchases), syntheticFixture.input.observed.purchases);
assert.equal(Number(syntheticReservationRow.qualified_reservations), syntheticFixture.input.reservations);
assert.equal(Number(syntheticOutcomeRow.net_revenue_cad), syntheticFixture.actual.revenue);

const clone = value => JSON.parse(JSON.stringify(value));
const baseInput = {
  asOf: '2026-07-22T12:00:00.000Z',
  dropId: '001',
  horizonDays: 30,
  plannedOnlineSessions: 1500,
  plannedPopupVisitors: 180,
  reservations: 20,
  reservationConversionRate: 60,
  simulations: 800,
  seed: 260722,
  products: [
    { id: 'jacket', name: 'Jacket', inventory: 20, price: 220, landedCogs: 75, weight: 2 },
    { id: 'denim', name: 'Denim', inventory: 30, price: 150, landedCogs: 52, weight: 3 }
  ]
};

const blank = forecast.calculateForecast({ products: [{ id: 'x', name: 'X', inventory: '', price: '' }] });
assert.equal(blank.status, 'blocked');
assert.ok(blank.errors.some(error => error.includes('inventory')));
assert.ok(blank.errors.some(error => error.includes('price')));
assert.ok(blank.errors.some(error => error.includes('planned online sessions')));

const before = clone(baseInput);
const first = forecast.calculateForecast(baseInput);
const second = forecast.calculateForecast(baseInput);
assert.equal(first.status, 'scenario');
assert.equal(JSON.stringify(first), JSON.stringify(second), 'same seed is deterministic');
assert.deepEqual(baseInput, before, 'input is not mutated');
assert.ok(first.summary.revenue.p10 <= first.summary.revenue.p50);
assert.ok(first.summary.revenue.p50 <= first.summary.revenue.p90);
assert.ok(first.summary.soldUnits.p90 <= 50, 'inventory caps sales');
assert.ok(first.summary.revenue.p90 <= (20 * 220) + (30 * 150), 'revenue cannot exceed inventory retail value');
assert.equal(first.summary.inventoryRetailValue, (20 * 220) + (30 * 150));
assert.equal(first.summary.inventoryCost, (20 * 75) + (30 * 52));
assert.equal(first.summary.merchandiseCashRecovery.p50, first.summary.revenue.p50 - first.summary.inventoryCost);
assert.ok(first.summary.inventoryCashRecoveryProbability >= 0 && first.summary.inventoryCashRecoveryProbability <= 100);
assert.equal(first.summary.committedNonInventorySpend, 0);
assert.equal(first.summary.committedLaunchCash.p50, first.summary.merchandiseCashRecovery.p50);
assert.ok(first.summary.sellThrough85Probability <= first.summary.sellThrough70Probability);
assert.ok(first.summary.demandUnits.p90 >= first.summary.soldUnits.p90);
assert.ok(first.summary.lostDemand.p10 >= 0);
assert.ok(first.warnings.some(warning => warning.includes('weak cold-start priors')));

const canadianPrice = forecast.calculateForecast({
  ...baseInput,
  products: [{ id: 'jacket', name: 'Jacket', inventory: 10, price: 'C$220', landedCogs: 'C$75' }]
});
assert.notEqual(canadianPrice.status, 'blocked');
assert.equal(canadianPrice.products[0].price, 220);

const evidenced = forecast.calculateForecast({
  ...baseInput,
  trafficEvidenceUrl: 'launch/traffic-plan.md',
  trafficEvidenceClass: 'historical',
  funnelEvidenceUrl: 'https://example.com/analytics-receipt',
  reservationEvidenceUrl: 'https://example.com/reservations.csv',
  observed: {
    sessions: 1000,
    productViews: 620,
    addsToCart: 95,
    checkouts: 55,
    purchases: 34,
    unitsPurchased: 39,
    refunds: 2,
    popupVisitors: 120,
    popupPurchases: 14
  }
});
assert.equal(evidenced.status, 'evidence-anchored');
assert.ok(evidenced.dataCompleteness > first.dataCompleteness);
assert.equal(evidenced.rates.find(rate => rate.key === 'sessionToView').evidence, 'observed');
assert.equal(evidenced.rates.find(rate => rate.key === 'reservationConversion').evidence, 'prior');

const syntheticForecast = forecast.calculateForecast(syntheticFixture.input);
assert.equal(syntheticForecast.status, 'synthetic-test');
assert.equal(syntheticForecast.evidenceMode, 'synthetic');
assert.equal(syntheticForecast.dataCompleteness, 100);
assert.equal(syntheticForecast.onlineConversionMode, 'funnel');
assert.ok(syntheticForecast.rates.every(rate => rate.evidence === 'synthetic'));
assert.ok(syntheticForecast.products.every(product => product.variants.length > 0));
assert.ok(syntheticForecast.warnings.some(warning => warning.includes('zero launch proof')));
assert.ok(forecast.calculateStressSuite(syntheticFixture.input).every(item => item.forecast.status === 'synthetic-test'));
const syntheticSnapshot = {
  dropId: syntheticFixture.input.dropId,
  frozenAt: '2026-07-22T12:00:00.000Z',
  forecast: syntheticForecast,
  actual: syntheticFixture.actual
};
assert.equal(forecast.calculateCalibration([syntheticSnapshot]).status, 'uncalibrated', 'synthetic outcomes cannot enter live calibration');
assert.equal(forecast.calculateCalibration([syntheticSnapshot], 'synthetic').status, 'first-outcome');
assert.equal(forecast.calculateCalibration([syntheticSnapshot], 'synthetic').uniqueDrops, 1);
const liveForecastWithSyntheticOutcome = {
  dropId: '001', frozenAt: '2026-07-22T12:00:00.000Z', forecast: first, actual: syntheticFixture.actual
};
assert.equal(forecast.calculateCalibration([liveForecastWithSyntheticOutcome]).status, 'uncalibrated', 'a synthetic outcome path also fails closed on a live forecast');
assert.equal(forecast.calculateCalibration([liveForecastWithSyntheticOutcome], 'synthetic').status, 'first-outcome');
const autoSynthetic = forecast.calculateForecast({ ...syntheticFixture.input, evidenceMode: 'live' });
assert.equal(autoSynthetic.status, 'synthetic-test', 'synthetic paths fail closed even if evidence mode is relabelled live');

const planOnlyTraffic = forecast.calculateForecast({
  ...baseInput,
  trafficEvidenceUrl: 'launch/traffic-plan.md',
  trafficEvidenceClass: 'plan'
});
assert.equal(planOnlyTraffic.status, 'scenario');
assert.ok(planOnlyTraffic.warnings.some(warning => warning.includes('linked plan but no historical receipt')));

const partialFunnel = forecast.calculateForecast({
  ...baseInput,
  trafficEvidenceUrl: 'launch/traffic-plan.md',
  funnelEvidenceUrl: 'reports/partial-funnel.csv',
  reservationEvidenceUrl: 'reports/reservations.csv',
  observed: { sessions: 1000 }
});
assert.equal(partialFunnel.status, 'scenario');
assert.equal(partialFunnel.rates.find(rate => rate.key === 'sessionToView').evidence, 'prior', 'blank product views are not treated as observed zero');
assert.ok(partialFunnel.summary.demandUnits.p50 > 0);

const directPlanningInput = {
  ...baseInput,
  plannedOnlineConversionRate: 3.06,
  unitsPerOrderAssumption: 1.25,
  committedNonInventorySpend: 4700
};
const directPlanningPrior = forecast.calculateForecast(directPlanningInput);
assert.equal(directPlanningPrior.onlineConversionMode, 'planning-prior');
assert.equal(directPlanningPrior.unitsPerOrder, 1.25);
assert.ok(directPlanningPrior.rates.some(rate => rate.key === 'plannedSessionPurchase' && rate.evidence === 'prior'));
assert.ok(directPlanningPrior.summary.demandUnits.p50 > first.summary.demandUnits.p50);
assert.equal(directPlanningPrior.summary.committedNonInventorySpend, 4700);
assert.equal(directPlanningPrior.summary.committedLaunchCash.p50, directPlanningPrior.summary.revenue.p50 - directPlanningPrior.summary.inventoryCost - 4700);
const publicTransferPrior = forecast.calculateForecast({
  ...directPlanningInput,
  priorProfile: 'public-transfer-v1',
  externalPrior: publicPriorInput
});
assert.equal(publicTransferPrior.status, 'scenario');
assert.equal(publicTransferPrior.priorProfile, 'public-transfer-v1');
assert.ok(publicTransferPrior.priorVersion.includes(publicPriorArtifact.modelVersion));
assert.equal(publicTransferPrior.rates.find(rate => rate.key === 'plannedSessionPurchase').mean, 3.06, 'external data does not replace the VORG planning center');
assert.equal(publicTransferPrior.rates.find(rate => rate.key === 'plannedSessionPurchase').evidence, 'external');
assert.equal(publicTransferPrior.rates.find(rate => rate.key === 'refundRate').evidence, 'external');
assert.ok(publicTransferPrior.warnings.some(warning => warning.includes('zero VORG proof')));
assert.ok(publicTransferPrior.summary.demandUnits.p10 <= directPlanningPrior.summary.demandUnits.p10, 'public transfer profile widens downside uncertainty');
assert.ok(publicTransferPrior.summary.demandUnits.p90 >= directPlanningPrior.summary.demandUnits.p90, 'public transfer profile widens upside uncertainty');
const invalidPublicTransfer = forecast.calculateForecast({
  ...directPlanningInput,
  priorProfile: 'public-transfer-v1',
  externalPrior: { ...publicPriorInput, directConversionStrength: 200 }
});
assert.equal(invalidPublicTransfer.status, 'blocked');
assert.ok(invalidPublicTransfer.errors.some(error => error.includes('conversion strength')));
const spoofedPublicTransfer = forecast.calculateForecast({
  ...directPlanningInput,
  priorProfile: 'public-transfer-v1',
  externalPrior: { ...publicPriorInput, modelVersion: 'VORG public-data transfer priors v999', sourceUrls: ['https://example.com/a', 'https://example.com/b', 'https://example.com/c'] }
});
assert.equal(spoofedPublicTransfer.status, 'blocked');
assert.ok(spoofedPublicTransfer.errors.some(error => error.includes('model version')));
assert.ok(spoofedPublicTransfer.errors.some(error => error.includes('source records')));
const missingPublicTransfer = forecast.calculateForecast({ ...directPlanningInput, priorProfile: 'public-transfer-v1' });
assert.equal(missingPublicTransfer.status, 'blocked');
assert.ok(missingPublicTransfer.errors.some(error => error.includes('canonical public-transfer-v1')));

const partialSessionPurchase = forecast.calculateForecast({
  ...directPlanningInput,
  priorProfile: 'public-transfer-v1',
  externalPrior: publicPriorInput,
  observed: { sessions: 200, purchases: 20 }
});
assert.equal(partialSessionPurchase.status, 'scenario');
assert.equal(partialSessionPurchase.onlineConversionMode, 'planning-prior');
const updatedPlanning = partialSessionPurchase.rates.find(rate => rate.key === 'plannedSessionPurchase');
assert.equal(updatedPlanning.evidence, 'observed');
assert.equal(updatedPlanning.successes, 20);
assert.equal(updatedPlanning.trials, 200);
assert.ok(updatedPlanning.mean > 3.06, 'real purchase counts must pull the planning prior toward the observed rate');
assert.ok(partialSessionPurchase.summary.sellThrough85Probability >= publicTransferPrior.summary.sellThrough85Probability, 'observed conversion strength must not lower the 85% sell-through chance versus the unupdated public-transfer prior');
assert.ok(partialSessionPurchase.warnings.some(warning => warning.includes('updated the session-to-purchase planning prior')));
assert.ok(partialSessionPurchase.warnings.some(warning => warning.includes('zero VORG proof')));

const purchasesExceedSessions = forecast.calculateForecast({
  ...directPlanningInput,
  observed: { sessions: 10, purchases: 11 }
});
assert.equal(purchasesExceedSessions.status, 'blocked');
assert.ok(purchasesExceedSessions.errors.some(error => error.includes('Purchases cannot exceed observed sessions')));

const stressInputBefore = clone(directPlanningInput);
const stressSuite = forecast.calculateStressSuite(directPlanningInput);
assert.equal(stressSuite.length, 5);
assert.deepEqual(directPlanningInput, stressInputBefore, 'stress suite does not mutate the base input');
const combinedDownside = stressSuite.find(item => item.key === 'combined-downside').forecast;
const controlledUpside = stressSuite.find(item => item.key === 'upside').forecast;
assert.ok(combinedDownside.summary.revenue.p50 < directPlanningPrior.summary.revenue.p50);
assert.ok(combinedDownside.summary.launchCashRecoveryProbability < directPlanningPrior.summary.launchCashRecoveryProbability);
assert.ok(controlledUpside.summary.revenue.p50 >= directPlanningPrior.summary.revenue.p50);

const observedOverridesPlanningPrior = forecast.calculateForecast({
  ...baseInput,
  plannedOnlineConversionRate: 12,
  unitsPerOrderAssumption: 1.25,
  trafficEvidenceUrl: 'launch/traffic-plan.md',
  trafficEvidenceClass: 'historical',
  funnelEvidenceUrl: 'reports/funnel.csv',
  reservationEvidenceUrl: 'reports/reservations.csv',
  observed: { sessions: 1000, productViews: 500, addsToCart: 80, checkouts: 45, purchases: 25, unitsPurchased: 30 }
});
assert.equal(observedOverridesPlanningPrior.onlineConversionMode, 'funnel');
assert.equal(observedOverridesPlanningPrior.unitsPerOrder, 1.2);
assert.ok(!observedOverridesPlanningPrior.rates.some(rate => rate.key === 'plannedSessionPurchase'));
assert.ok(observedOverridesPlanningPrior.warnings.some(warning => warning.includes('ignored')));
const observedStressSuite = forecast.calculateStressSuite(observedOverridesPlanningPrior);
assert.ok(observedStressSuite.find(item => item.key === 'combined-downside').forecast.summary.revenue.p50 < observedOverridesPlanningPrior.summary.revenue.p50, 'conversion stress still applies after observed funnel replaces the planning prior');

const impossibleFunnel = forecast.calculateForecast({
  ...baseInput,
  observed: { sessions: 100, productViews: 110, addsToCart: 111, checkouts: 20, purchases: 30, unitsPurchased: 20 }
});
assert.equal(impossibleFunnel.status, 'blocked');
assert.ok(impossibleFunnel.errors.length >= 3);

const negative = forecast.calculateForecast({ ...baseInput, plannedOnlineSessions: -5, observed: { sessions: -2 } });
assert.equal(negative.status, 'blocked');
assert.ok(negative.errors.some(error => error.includes('Planned online sessions')));
assert.ok(negative.errors.some(error => error.includes('Observed sessions')));
const invalidReservationRate = forecast.calculateForecast({ ...baseInput, reservationConversionRate: 120 });
assert.equal(invalidReservationRate.status, 'blocked');
assert.ok(invalidReservationRate.errors.some(error => error.includes('between 0 and 100')));
const invalidPlanningRate = forecast.calculateForecast({ ...baseInput, plannedOnlineConversionRate: 0, unitsPerOrderAssumption: 8 });
assert.equal(invalidPlanningRate.status, 'blocked');
assert.ok(invalidPlanningRate.errors.some(error => error.includes('online conversion')));
assert.ok(invalidPlanningRate.errors.some(error => error.includes('Units per order')));
const invalidCommittedSpend = forecast.calculateForecast({ ...baseInput, committedNonInventorySpend: -1 });
assert.equal(invalidCommittedSpend.status, 'blocked');
assert.ok(invalidCommittedSpend.errors.some(error => error.includes('Committed non-inventory')));
const invalidTrafficClass = forecast.calculateForecast({ ...baseInput, trafficEvidenceUrl: 'launch/traffic-plan.md', trafficEvidenceClass: 'wishful' });
assert.equal(invalidTrafficClass.status, 'blocked');
assert.ok(invalidTrafficClass.errors.some(error => error.includes('Traffic proof type')));
const invalidStressMultiplier = forecast.calculateForecast({ ...baseInput, onlineConversionStressMultiplier: 8 });
assert.equal(invalidStressMultiplier.status, 'blocked');
assert.ok(invalidStressMultiplier.errors.some(error => error.includes('stress multiplier')));
const invalidEvidenceMode = forecast.calculateForecast({ ...baseInput, evidenceMode: 'pretend-live' });
assert.equal(invalidEvidenceMode.status, 'blocked');
assert.ok(invalidEvidenceMode.errors.some(error => error.includes('Evidence mode')));

const noCosts = forecast.calculateForecast({
  ...baseInput,
  products: baseInput.products.map(({ landedCogs, ...product }) => product)
});
assert.equal(noCosts.summary.grossProfit, null);
assert.equal(noCosts.summary.inventoryCost, null);
assert.equal(noCosts.summary.merchandiseCashRecovery, null);

const overCap = forecast.calculateForecast({ ...baseInput, productionSpendCap: 1000 });
assert.ok(overCap.warnings.some(warning => warning.includes('exceeds the active production cap')));

const sized = forecast.calculateForecast({
  ...baseInput,
  products: [{
    id: 'top', name: 'Top', inventory: '', price: 110, landedCogs: 30,
    variants: [
      { label: 'S', inventory: 5 },
      { label: 'M', inventory: 8 },
      { label: 'L', inventory: 4 }
    ]
  }]
});
assert.notEqual(sized.status, 'blocked');
assert.equal(sized.products[0].inventory, 17);
assert.equal(sized.products[0].variants.length, 3);
assert.ok(sized.products[0].variants.every(variant => variant.sold.p90 <= variant.inventory));
assert.ok(sized.warnings.some(warning => warning.includes('equal weak weights')));

const sizeConstrained = forecast.calculateForecast({
  ...baseInput,
  plannedOnlineSessions: 100000,
  plannedPopupVisitors: 0,
  reservations: 0,
  simulations: 500,
  products: [{
    id: 'skewed', name: 'Skewed size curve', inventory: 100, price: 100, landedCogs: 30,
    variants: [
      { label: 'XS', inventory: 1, weight: 100 },
      { label: 'XL', inventory: 99, weight: 1 }
    ]
  }]
});
assert.ok(sizeConstrained.products[0].sold.p50 < 50, 'size stockouts constrain SKU sales even when aggregate stock remains');
assert.ok(sizeConstrained.products[0].lostDemand.p50 > 0);
const invalidVariant = forecast.calculateForecast({
  ...baseInput,
  products: [{ id: 'bad', name: 'Bad', inventory: 10, price: 100, variants: [{ label: 'S', inventory: -1 }] }]
});
assert.equal(invalidVariant.status, 'blocked');
assert.ok(invalidVariant.errors.some(error => error.includes('variant 1')));

const higherTraffic = forecast.calculateForecast({ ...baseInput, plannedOnlineSessions: 6000 });
assert.ok(higherTraffic.summary.demandUnits.p50 >= first.summary.demandUnits.p50);
const moreReservations = forecast.calculateForecast({ ...baseInput, reservations: 200 });
assert.ok(moreReservations.summary.demandUnits.p50 >= first.summary.demandUnits.p50);

function assertFiniteTree(value, path = 'result') {
  if (typeof value === 'number') assert.ok(Number.isFinite(value), `${path} is finite`);
  else if (Array.isArray(value)) value.forEach((item, index) => assertFiniteTree(item, `${path}[${index}]`));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => assertFiniteTree(item, `${path}.${key}`));
}
assertFiniteTree(evidenced);

const noProof = forecast.calculateCalibration([{
  dropId: '001', forecast: first, actual: { revenue: first.summary.revenue.p50, unitsSold: first.summary.soldUnits.p50 }
}]);
assert.equal(noProof.status, 'uncalibrated');
const malformedSnapshot = forecast.calculateCalibration([{ dropId: 'bad', forecast: {}, actual: { revenue: 1, unitsSold: 1, evidenceUrl: 'reports/bad.csv' } }]);
assert.equal(malformedSnapshot.status, 'uncalibrated');

const linkedActual = (dropId, output = first) => ({
  dropId,
  frozenAt: `2026-07-${String(Number(dropId) || 1).padStart(2, '0')}T12:00:00.000Z`,
  forecast: { ...output, dropId },
  actual: {
    revenue: output.summary.revenue.p50,
    unitsSold: output.summary.soldUnits.p50,
    sellThroughPct: output.summary.sellThrough.p50,
    evidenceUrl: `reports/${dropId}-actuals.csv`
  }
});
const duplicateDrop = forecast.calculateCalibration([linkedActual('001'), linkedActual('001')]);
assert.equal(duplicateDrop.completedForecasts, 2);
assert.equal(duplicateDrop.uniqueDrops, 1);
assert.equal(duplicateDrop.revenueWape, 0);
assert.ok(duplicateDrop.warnings.some(warning => warning.includes('earliest timestamped')));

const provisional = forecast.calculateCalibration(['001', '002', '003', '004'].map(id => linkedActual(id)));
assert.equal(provisional.uniqueDrops, 4);
assert.equal(provisional.status, 'provisional');
assert.equal(provisional.revenueCoverage80, 1);

console.log('Sales forecast tests passed.');
