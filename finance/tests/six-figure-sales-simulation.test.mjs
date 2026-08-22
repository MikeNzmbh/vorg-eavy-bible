import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const script = join(here, '..', 'simulate-six-figure-path.mjs');
const output = JSON.parse(execFileSync(process.execPath, [script], {
  encoding: 'utf8',
  maxBuffer: 20 * 1024 * 1024,
  windowsHide: true
}));

assert.equal(output.truthClass, 'working-simulation');
assert.equal(output.schemaVersion, 2);
assert.equal(output.sourceContract.startingCash, 10000);
assert.equal(output.sourceContract.firstDropCommittedCost, 8412);
assert.equal(output.sourceContract.retainedReserve, 1588);
assert.equal(output.sourceContract.simulations, 50000);
assert.equal(output.engineCrossCheck.matchesForecastLab, true);
assert.deepEqual(output.engineCrossCheck.revenue, { p10: 831, p50: 4299, p90: 12060 });

const current = output.publicTransferPaths.find(path => path.id === 'current-cost-repeat');
const lean = output.publicTransferPaths.find(path => path.id === 'lean-repeat');
assert.ok(current.probabilityStallAfterFirstDropPct > 70);
assert.ok(current.probabilityCumulativeNetSales100k.within48MonthsPct < 1);
assert.ok(lean.probabilityStallAfterFirstDropPct > 55);
assert.ok(lean.probabilityCumulativeNetSales100k.within48MonthsPct < 3);
assert.equal(lean.firstDropEconomics.endingCash.p50, 5218);

const path70 = output.thresholdPaths.find(path => path.id === 'lean-repeat-70pct');
const path85 = output.thresholdPaths.find(path => path.id === 'lean-repeat-85pct');
const tax85 = output.thresholdPaths.find(path => path.id === 'lean-repeat-tax-included-85pct');
assert.equal(path70.targetDrop, 13);
assert.equal(path70.annualPaceDate, null, '70% fixed-scale path does not become a C$100k annual business');
assert.equal(path85.targetDrop, 6);
assert.equal(path85.targetDate, '2027-10-24');
assert.equal(path85.inventoryUnitsAtTarget, 365);
assert.equal(tax85.targetDrop, 7);
assert.equal(tax85.targetDate, '2028-01-02');

for (let index = 1; index < path85.ledger.length; index += 1) {
  assert.ok(path85.ledger[index].inventoryUnits <= Math.ceil(path85.ledger[index - 1].inventoryUnits * 1.25), 'baseline unit growth is capped at 25% after whole-unit rounding');
  assert.ok(path85.ledger[index].endingCash >= 1500, 'reserve floor survives every funded drop');
  assert.ok(path85.ledger[index].variableLaunchCost > path85.ledger[index - 1].variableLaunchCost, 'variable launch cost scales with inventory');
}

assert.equal(path85.ledger[0].fixedOverhead, 3750);
assert.equal(path85.ledger[0].variableLaunchCost, 950);
assert.equal(path85.ledger[1].fixedOverhead, 1550);

assert.equal(output.financingThresholds.taxAddedAtCheckout.preserveStartingCash, 80.4);
assert.equal(output.financingThresholds.taxAddedAtCheckout.fundLeanFullRepeat, 58.5);
assert.equal(output.financingThresholds.taxAddedAtCheckout.fundLeanMinimumRepeat, 47.5);
assert.equal(output.financingThresholds.ontarioHstIncludedInStickerPrice.preserveStartingCash, 90.9);
assert.equal(output.financingThresholds.ontarioHstIncludedInStickerPrice.fundLeanMinimumRepeat, 53.7);
assert.equal(output.financingThresholds.priceUpliftNeededAt85PctSellThroughToPreserveC10k.ontarioHstIncludedPct, 6.9);

const funded = output.ownerFundedGrowth45;
assert.equal(funded.contributionContract.amount, 2000);
assert.equal(funded.contributionContract.firstDate, '2026-09-28');
assert.equal(funded.contributionContract.intervalCalendarMonths, 2);
assert.equal(funded.growthContract.targetNetSalesGrowthPctPerDrop, 45);
assert.equal(funded.firstDropSurvivalThresholds.taxAddedAtCheckout.fundLeanFullRepeatAndReserve, 20.3);
assert.equal(funded.firstDropSurvivalThresholds.ontarioHstIncludedInStickerPrice.fundLeanFullRepeatAndReserve, 23);

const funded70 = funded.thresholdPaths.find(path => path.id === 'owner-funded-growth-45-70pct');
const funded85 = funded.thresholdPaths.find(path => path.id === 'owner-funded-growth-45-85pct');
const fundedTax85 = funded.thresholdPaths.find(path => path.id === 'owner-funded-growth-45-tax-included-85pct');
assert.equal(funded70.allCompletedGrowthStepsMeetTarget, false, 'owner cash cannot clear the 85% demand gate');
assert.equal(funded70.inventoryUnitsAtTarget, 126, '70% sell-through holds the original inventory scale');
assert.equal(funded85.targetDrop, 5);
assert.equal(funded85.targetDate, '2027-08-15');
assert.equal(funded85.annualPaceDate, '2027-08-15');
assert.equal(funded85.netSalesAtTarget, 119191.85);
assert.equal(funded85.ownerCapitalAtTarget, 12000);
assert.equal(funded85.totalOwnerCapitalAtTarget, 22000);
assert.equal(funded85.inventoryUnitsAtTarget, 570);
assert.equal(funded85.allCompletedGrowthStepsMeetTarget, true);
assert.ok(funded85.netSalesGrowthPctByDrop.every(rate => rate >= 45));
assert.deepEqual(funded85.ledger.map(entry => entry.ownerCapitalAddedBeforeDrop), [2000, 2000, 4000, 2000, 2000]);
assert.equal(fundedTax85.targetDrop, 5);
assert.equal(fundedTax85.targetDate, '2027-08-15');

const fundingOnly = funded.causalSensitivityAt85PctSellThrough.ownerFundingWithOriginal25PctScaleCap;
const growthOnly = funded.causalSensitivityAt85PctSellThrough.growth45WithoutAdditionalOwnerFunding;
assert.equal(fundingOnly.targetDate, '2027-10-24', 'owner funding alone does not advance the 85% threshold date');
assert.equal(growthOnly.targetDate, '2027-08-15');
assert.equal(growthOnly.ownerCapitalAtTarget, 0);
assert.equal(funded85.netSalesAtTarget, growthOnly.netSalesAtTarget, 'owner contributions never count as net sales');
assert.equal(Math.round((funded85.cashAtTarget - growthOnly.cashAtTarget) * 100) / 100, 12000);

const fundedPublic = funded.publicTransferPath;
const fundingOnlyPublic = funded.causalSensitivityPublicTransfer.ownerFundingWithOriginal25PctScaleCap;
const growthOnlyPublic = funded.causalSensitivityPublicTransfer.growth45WithoutAdditionalOwnerFunding;
assert.equal(fundedPublic.probabilityCumulativeNetSales100k.within48MonthsPct, 9.7);
assert.equal(fundedPublic.probabilityFirstFiveDropsMeetGrowthTargetPct, 0.2);
assert.equal(fundingOnlyPublic.probabilityCumulativeNetSales100k.within48MonthsPct, 2.9);
assert.equal(growthOnlyPublic.probabilityCumulativeNetSales100k.within48MonthsPct, 3.2);
assert.ok(fundedPublic.probabilityCumulativeNetSales100k.within48MonthsPct > fundingOnlyPublic.probabilityCumulativeNetSales100k.within48MonthsPct);
assert.ok(fundedPublic.probabilityCumulativeNetSales100k.within48MonthsPct > growthOnlyPublic.probabilityCumulativeNetSales100k.within48MonthsPct);

console.log('six-figure-sales-simulation: forecast parity, owner-capital separation, growth gates, cash controls, ok');
