import assert from 'node:assert/strict';
import {
  CHANNELS,
  CONFIG,
  PRODUCTS,
  PREDICTION_STACK,
  buildEngine,
  minimumWorkingCapitalBridge,
  simulateScenario
} from '../growth-finance-engine-v3.mjs';

const output = buildEngine();

assert.equal(output.schemaVersion, 3);
assert.equal(output.truthClass, 'goal-seeking-working-simulation');
assert.equal(output.goalContract.august2027NetSalesCad, 100000);
assert.equal(output.goalContract.sellThroughPctInside30Days, 85);
assert.equal(output.goalContract.perDropGrowthFloorPct, 45);
assert.equal(output.goalContract.perDropGrowthTargetPct, 50);
assert.equal(output.goalContract.plannedCadenceDays, 40);
assert.equal(output.goalContract.founderSalaryEnvelopeCadPerMonth, 3000);

assert.equal(PRODUCTS.reduce((total, product) => total + product.units, 0), 126);
assert.equal(PRODUCTS.reduce((total, product) => total + product.units * product.workingLandedCogs, 0), 3712);
assert.ok(PRODUCTS.reduce((total, product) => total + product.units * product.workingLandedCogs, 0) <= CONFIG.maximumInitialProductionSpend);
assert.equal(CHANNELS.reduce((total, channel) => total + channel.targetSharePct, 0), 100);
assert.ok(PREDICTION_STACK.some(method => method.id === 'newsvendor'));
assert.ok(PREDICTION_STACK.some(method => method.id === 'thompson-bandit'));
assert.ok(PREDICTION_STACK.some(method => method.id === 'mmm'));

const floor = output.scenarios.find(scenario => scenario.id === 'winner-floor-45');
assert.equal(floor.completed, true);
assert.equal(floor.goalMet, true);
assert.equal(floor.ledger.length, 8);
assert.equal(floor.ledger.at(-1).date, '2027-08-15');
assert.equal(floor.augustNetSales, 112386.92);
assert.equal(floor.augustOrders, 989);
assert.equal(floor.dividendPaid, 0);
assert.ok(floor.ledger.every(drop => drop.sellThroughPct === 85));
assert.ok(floor.ledger.every(drop => drop.availableEndingCash >= CONFIG.minimumCashFloor));

for (let index = 1; index < floor.ledger.length; index += 1) {
  const growth = floor.ledger[index].netSales / floor.ledger[index - 1].netSales - 1;
  assert.ok(growth >= 0.44, 'whole-unit rounding must preserve approximately 45% drop growth');
}

const target = output.scenarios.find(scenario => scenario.id === 'winner-target-50');
assert.equal(target.goalMet, true);
assert.equal(target.augustNetSales, 142331.36);
assert.equal(target.augustOrders, 1253);

const paidFromLaunch = output.scenarios.find(scenario => scenario.id === 'salary-paid-from-launch');
assert.equal(paidFromLaunch.completed, false);
assert.equal(paidFromLaunch.stalledOnDrop, 1);
assert.equal(paidFromLaunch.augustNetSales, 0);

const slower = output.scenarios.find(scenario => scenario.id === 'slower-cadence-45-days');
assert.equal(slower.completed, true);
assert.equal(slower.goalMet, false);
assert.ok(slower.augustNetSales < 100000);

const miss = output.scenarios.find(scenario => scenario.id === 'demand-miss-35-growth-75-sell-through');
assert.equal(miss.goalMet, false);
assert.ok(miss.augustNetSales < 70000);

const bridge = minimumWorkingCapitalBridge({ growthRate: 0.45, sellThrough: 0.85, cadenceDays: 40 });
assert.equal(bridge, 11465);
const bridged = simulateScenario({
  id: 'test-bridge',
  growthRate: 0.45,
  sellThrough: 0.85,
  cadenceDays: 40,
  salaryPolicy: 'guaranteed',
  initialCash: CONFIG.initialCash + bridge
});
assert.equal(bridged.goalMet, true);
assert.equal(bridged.salaryPaid, 30000);
assert.equal(bridged.salaryDeferred, 0);
assert.equal(bridged.dividendPaid, 0);

const targetBridge = minimumWorkingCapitalBridge({ growthRate: 0.50, sellThrough: 0.85, cadenceDays: 40 });
assert.equal(targetBridge, 12258);
const bridgedTarget = output.scenarios.find(scenario => scenario.id === 'winner-target-50-salary-bridge');
assert.equal(bridgedTarget.goalMet, true);
assert.equal(bridgedTarget.salaryPaid, 30000);
assert.equal(bridgedTarget.salaryDeferred, 0);

assert.ok(output.blindSpots.length >= 20);
assert.ok(output.evidenceRules.antiGaming.includes('Tax collected never counts as net sales.'));

console.log('growth-finance-engine-v3: goal math, salary bridge, channel dedupe, model ladder and anti-gaming controls, ok');
