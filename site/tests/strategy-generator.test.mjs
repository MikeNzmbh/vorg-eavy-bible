import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const bundlePath = join(here, '..', 'strategy-generator.js');
const source = readFileSync(bundlePath, 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: bundlePath });

const engine = sandbox.VorgStrategyGenerator;
assert.ok(engine, 'engine global exists');
assert.equal(engine.ENGINE_VERSION, 'VORG Strategy Generator v1.1');

// ---------------------------------------------------------------- fixtures

const libraryPack = JSON.parse(
  readFileSync(join(root, 'research/market-positioning/strategy-mechanism-library-2026-08-22.json'), 'utf8')
);
const skuInventory = JSON.parse(readFileSync(join(root, 'research/market-positioning/sku-inventory.json'), 'utf8'));
const gatesPack = JSON.parse(readFileSync(join(root, 'research/market-positioning/route-to-market-gates.json'), 'utf8'));
const candidatesPack = JSON.parse(readFileSync(join(root, 'research/market-positioning/candidates.json'), 'utf8'));

assert.ok(libraryPack.cards.length >= 15, 'seed library has cards');
const crossIndustryCards = libraryPack.cards.filter((c) =>
  ['restaurant-qsr', 'gaming-hardware', 'music-food-collab', 'events-festivals', 'beauty-dtc', 'footwear-sneakers'].includes(c.industry)
);
assert.ok(crossIndustryCards.length >= 5, 'at least 5 cross-industry cards seeded');
for (const card of libraryPack.cards) {
  assert.ok(card.sourceUrl && card.dateChecked, `card ${card.id} has sourceUrl + dateChecked`);
  assert.ok(['worked', 'failed', 'mixed'].includes(card.workedOrFailed), `card ${card.id} has workedOrFailed`);
  assert.ok(card.why && card.transferabilityConditions.length, `card ${card.id} has why + transferability conditions`);
}

const brand = {
  name: 'VORG-EAVY',
  industry: 'fashion',
  skus: skuInventory.skus.map((s) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    workingUnits: s.workingUnits,
    workingPriceCad: s.workingPriceCad,
    proofStatus: s.proofStatus
  })),
  productionCeilingCad: skuInventory.productionCeilingCad,
  operatingMarket: 'Canada',
  sellThroughGoalPct: 85,
  testCashPoolCad: 500
};

const baseInput = {
  generatedAt: '2026-08-22T21:00:00.000Z',
  brand,
  library: libraryPack.cards,
  markets: candidatesPack.candidates.map((c) => ({ id: c.id, metro: c.metro, country: c.country })),
  gates: gatesPack.gates.map((g) => ({
    id: g.id,
    label: g.label,
    state: g.state,
    hardStop: g.hardStop,
    region: g.region,
    appliesToMarkets: g.appliesToMarkets,
    notes: g.notes
  }))
};

// ---------------------------------------------------------------- 1. winner + full plan from scratch, zero first-party results

const frozenCopy = JSON.parse(JSON.stringify(baseInput));
const result = engine.generateStrategy(baseInput);

assert.ok(result.winner, 'picks a winner strategy with zero first-party sales');
assert.ok(result.runnerUp, 'picks a runner-up');
assert.equal(result.winnerSet.length, 2, 'near-tie policy keeps the two operationally indistinguishable leaders');
assert.equal(result.winnerSetThresholdPoints, 0.5, 'near-tie threshold is explicit and scale-aware');
assert.equal(result.rankingStrength, 'co-winners');
assert.notEqual(result.winner.strategyId, result.runnerUp.strategyId);
assert.equal(result.mode, 'from-scratch');
assert.ok(result.rankedStrategies.length >= 7, 'enumerates base archetypes plus hybrids');
assert.ok(result.winner.stress.supporting.length > 0, 'winner is backed by external receipts');
assert.ok(result.reversalConditions.length >= 3, 'reversal conditions stated');

const plan = result.plan;
assert.ok(plan, 'compiles a full plan');
assert.ok(plan.phases.length >= 4, 'plan has staged phases');
assert.ok(plan.waves.length >= 5, 'plan has waves');
for (const wave of plan.waves) {
  assert.ok(wave.items.length >= 1, `wave ${wave.id} has action items`);
  for (const item of wave.items) {
    assert.ok(item.ownerRole, 'item has owner role');
    assert.equal(item.measurement.receiptRequired, true, 'measurement contract requires receipt');
    assert.ok(item.measurement.successThreshold, 'item has success threshold');
    assert.ok(item.measurement.killRule, 'item has kill rule');
    assert.ok(
      item.evidenceCardIds.length > 0 || item.evidenceLabel === 'working-assumption',
      `item ${item.id} traces to evidence or is labeled working-assumption`
    );
  }
}
assert.ok(plan.waves.some((w) => w.phaseId === 'P0'), 'plan includes gate-clearance phase');
assert.ok(result.unpreparednessReport.length > 0, 'unpreparedness report lists open gates');
assert.ok(
  result.unpreparednessReport.every((gate) => !gate.gateId.startsWith('gate-ca-')),
  'Canada-only expansion gates do not freeze the U.S. strategy branch'
);
assert.ok(
  plan.waves.every((wave) => wave.items.every((item) => item.gateDependencies.every((gateId) => !gateId.startsWith('gate-ca-')))),
  'compiled U.S. plan does not reintroduce Canada-only gate dependencies'
);

// ---------------------------------------------------------------- 2. input immutability

assert.equal(JSON.stringify(baseInput), JSON.stringify(frozenCopy), 'engine does not mutate inputs');

// ---------------------------------------------------------------- 3. deterministic outputs

const resultAgain = engine.generateStrategy(baseInput);
assert.equal(JSON.stringify(result), JSON.stringify(resultAgain), 'same input yields identical output');

// ---------------------------------------------------------------- 4. cross-industry transferability discount

assert.equal(engine.__test.transferFactor('fashion'), 1.0);
assert.equal(engine.__test.transferFactor('streetwear'), 1.0);
assert.equal(engine.__test.transferFactor('beauty-dtc'), 0.8);
assert.equal(engine.__test.transferFactor('restaurant-qsr'), 0.6);
assert.equal(engine.__test.transferFactor('gaming-hardware'), 0.6);

const syntheticCard = (industry) => ({
  id: 'syn-1',
  mechanism: 'native-short-form',
  reference: 'Synthetic',
  industry,
  sourceUrl: 'https://example.com/case',
  dateChecked: '2026-08-22',
  workedOrFailed: 'worked',
  why: 'synthetic evidence',
  transferabilityConditions: ['none'],
  sourceClass: 'reputable-editorial',
  confidence: 0.8
});
const scoreFor = (industry) => {
  const r = engine.generateStrategy({ ...baseInput, library: [syntheticCard(industry)] });
  return r.rankedStrategies.find((s) => s.strategyId === 'creator-seeding').evidenceScore;
};
assert.ok(scoreFor('fashion') > scoreFor('restaurant-qsr'), 'cross-industry evidence earns less than same-industry evidence');

const oneSource = engine.generateStrategy({ ...baseInput, library: [syntheticCard('fashion')] });
const duplicatedSource = engine.generateStrategy({
  ...baseInput,
  library: [syntheticCard('fashion'), { ...syntheticCard('fashion'), id: 'syn-duplicate' }]
});
assert.equal(
  duplicatedSource.rankedStrategies.find((s) => s.strategyId === 'creator-seeding').evidenceScore,
  oneSource.rankedStrategies.find((s) => s.strategyId === 'creator-seeding').evidenceScore,
  'duplicate cards from the same source URL cannot amplify strategy evidence'
);

const officialSource = engine.generateStrategy({
  ...baseInput,
  library: [{ ...syntheticCard('fashion'), sourceClass: 'official-regulator' }]
});
const vendorSource = engine.generateStrategy({
  ...baseInput,
  library: [{ ...syntheticCard('fashion'), sourceClass: 'vendor-case-study' }]
});
assert.ok(
  officialSource.rankedStrategies.find((s) => s.strategyId === 'creator-seeding').evidenceScore >
    vendorSource.rankedStrategies.find((s) => s.strategyId === 'creator-seeding').evidenceScore,
  'official sources carry more strategy evidence weight than vendor case studies'
);

const futureOnly = engine.generateStrategy({
  ...baseInput,
  library: [{ ...syntheticCard('fashion'), dateChecked: '2027-01-01' }]
});
assert.equal(futureOnly.winner, null, 'future-dated evidence cannot produce a strategy winner');

const crossUse = result.winner.stress.supporting.find((u) => u.crossIndustry);
assert.ok(crossUse, 'winner uses at least one cross-industry receipt');
assert.ok(crossUse.transferFactor < 1.0, 'cross-industry receipt carries a discount');
assert.ok(crossUse.tweakNote, 'cross-industry receipt carries a tweak note describing the adaptation');

// ---------------------------------------------------------------- 5. failure evidence lowers but does not zero

const withoutFailures = engine.generateStrategy({
  ...baseInput,
  library: libraryPack.cards.filter((c) => c.workedOrFailed !== 'failed')
});
const scarcityWith = result.rankedStrategies.find((s) => s.strategyId === 'scarcity-drop');
const scarcityWithout = withoutFailures.rankedStrategies.find((s) => s.strategyId === 'scarcity-drop');
assert.ok(scarcityWith.totalScore < scarcityWithout.totalScore, 'failure evidence lowers the strategy score');
assert.ok(scarcityWith.totalScore > 0, 'failure evidence does not zero a supported strategy');
assert.ok(scarcityWith.stress.contradicting.length > 0, 'contradicting evidence is reported with reasons');
assert.ok(
  scarcityWith.reasons.some((r) => /lowered \(did not zero\)/i.test(r)),
  'reasons explain the failure-evidence effect'
);

// ---------------------------------------------------------------- 6. open hard-stop gates freeze affected waves (incl. paid)

for (const wave of plan.waves) {
  const openHardDeps = wave.items.flatMap((i) => i.gateDependencies).filter((dep) => {
    const gate = baseInput.gates.find((g) => g.id === dep);
    return gate && gate.hardStop && gate.state !== 'cleared-with-evidence';
  });
  if (openHardDeps.length && wave.phaseId !== 'P0') {
    assert.equal(wave.status, 'frozen', `wave ${wave.id} with open hard-stop deps is frozen`);
    assert.ok(wave.frozenReason, `wave ${wave.id} states its frozen reason`);
  }
}
const dropWave = plan.waves.find((w) => w.phaseId === 'P3');
assert.equal(dropWave.status, 'frozen', 'drop window is frozen while hard stops are open');

const paidStrategy = result.rankedStrategies.find((s) => s.strategyId === 'paid-performance-led');
assert.ok(
  paidStrategy.stress.unpreparedness.frozenCapabilities.some((f) => /paid spend frozen/.test(f)),
  'paid capability is reported frozen while gate-auth-accounts is open'
);
const clearedGates = baseInput.gates.map((g) => (g.hardStop ? { ...g, state: 'cleared-with-evidence' } : g));
const clearedRun = engine.generateStrategy({ ...baseInput, gates: clearedGates });
const paidCleared = clearedRun.rankedStrategies.find((s) => s.strategyId === 'paid-performance-led');
assert.ok(paidCleared.preparedness > paidStrategy.preparedness, 'clearing gates raises preparedness');
assert.equal(clearedRun.plan.waves.find((w) => w.phaseId === 'P3').status, 'ready', 'drop window unfreezes when hard stops clear');

// ---------------------------------------------------------------- 7. budget caps never exceeded, production ceiling untouched

const totalBudget = plan.waves.reduce((s, w) => s + w.budgetCapCad, 0);
assert.ok(totalBudget <= brand.testCashPoolCad, 'sum of wave budgets never exceeds the test cash pool');
assert.equal(plan.budgetAllocatedCad, totalBudget, 'allocated budget reported accurately');
for (const wave of plan.waves) {
  const itemSum = wave.items.reduce((s, i) => s + i.budgetCapCad, 0);
  assert.ok(itemSum <= wave.budgetCapCad || wave.budgetCapCad === 0, `items in ${wave.id} stay within wave cap`);
}
assert.equal(
  JSON.stringify(plan.productionCeilingCad),
  JSON.stringify(brand.productionCeilingCad),
  'production ceiling recorded, not consumed'
);
assert.equal(result.safety.productionSpendAuthorizedCad, 0, 'zero production spend authorized');
assert.ok(/separate from the C\$5000-C\$6000 production ceiling/.test(plan.cashPolicy), 'cash policy separates pool from ceiling');

// Zero pool => zero budgets everywhere.
const zeroPool = engine.generateStrategy({ ...baseInput, brand: { ...brand, testCashPoolCad: 0 } });
assert.ok(zeroPool.plan.waves.every((w) => w.budgetCapCad === 0), 'no pool means no budget allocated');

// ---------------------------------------------------------------- 8. remix mode consumes an existing plan and improves it

const existingPlan = {
  planId: 'legacy-plan-001',
  strategyId: 'creator-seeding',
  testCashPoolCad: 500,
  waves: [
    {
      id: 'legacy-paid-wave',
      label: 'Paid TikTok blast',
      mechanism: 'native-short-form',
      phaseId: 'P1',
      budgetCapCad: 2000,
      status: 'ready',
      items: [
        {
          id: 'legacy-paid-1',
          action: 'Spend on paid TikTok promotion',
          ownerRole: 'content',
          budgetCapCad: 2000,
          gateDependencies: ['gate-auth-accounts'],
          evidenceCardIds: [],
          evidenceLabel: 'evidence-backed'
        }
      ]
    },
    {
      id: 'legacy-organic-wave',
      label: 'Organic posting',
      mechanism: 'community-first-content',
      phaseId: 'P1',
      budgetCapCad: 0,
      status: 'ready',
      items: [
        {
          id: 'legacy-organic-1',
          action: 'Post community questions',
          ownerRole: 'content',
          budgetCapCad: 0,
          gateDependencies: [],
          evidenceCardIds: ['ev-cx-glossier-community']
        }
      ]
    }
  ]
};

const remix = engine.generateStrategy({ ...baseInput, existingPlan });
assert.equal(remix.mode, 'remix', 'remix mode detected');
assert.ok(remix.remixImprovements.length >= 4, 'remix outputs improvements');
for (const imp of remix.remixImprovements) {
  assert.ok(imp.reason && imp.reason.length > 10, `improvement "${imp.change}" cites a reason`);
}
const paidWave = remix.plan.waves.find((w) => w.id === 'legacy-paid-wave');
assert.equal(paidWave.status, 'frozen', 'remix freezes the paid wave on the open hard-stop auth gate');
assert.ok(
  remix.remixImprovements.some((i) => /froze/i.test(i.change) && i.target.includes('legacy-paid')),
  'freeze improvement recorded'
);
assert.ok(
  remix.remixImprovements.some((i) => /clamped budget/i.test(i.change)),
  'over-pool budget clamped'
);
assert.ok(
  remix.remixImprovements.some((i) => /kill rule/i.test(i.change)),
  'missing kill rules added'
);
assert.ok(
  remix.remixImprovements.some((i) => /relabeled/i.test(i.change)),
  'evidence-backed claim without cards relabeled to working-assumption'
);
assert.ok(
  remix.remixImprovements.some((i) => /added missing wave/i.test(i.change) && i.evidenceCardIds.length > 0),
  'missing winner mechanisms added with cited evidence'
);
const remixTotal = remix.plan.waves.reduce((s, w) => s + w.budgetCapCad, 0);
assert.ok(remixTotal <= 500, 'remixed plan respects the pool ceiling');
const legacyOrganic = remix.plan.waves.find((w) => w.id === 'legacy-organic-wave');
assert.equal(legacyOrganic.items[0].evidenceLabel, 'evidence-backed', 'valid cited evidence survives remix');

// ---------------------------------------------------------------- 9. calibration loop with fake first-party results

const readyBudgeted = plan.waves.filter((w) => w.status === 'ready' && w.budgetCapCad > 0);
assert.ok(readyBudgeted.length >= 2, 'at least two budgeted waves to calibrate');
const passWaveId = readyBudgeted[0].id;
const failWaveId = readyBudgeted[1].id;

const calibrated = engine.generateStrategy({
  ...baseInput,
  firstPartyResults: {
    asOf: '2026-10-01',
    sessions: 900,
    purchases: 12,
    sellThroughBySku: [
      { skuId: 'VE-FJ-001', unitsPlanned: 12, unitsSold: 5 },
      { skuId: 'VE-WD-001', unitsPlanned: 24, unitsSold: 14 }
    ],
    waveOutcomes: [
      { waveId: passWaveId, receiptUrl: 'https://example.com/receipts/pass-1', qualifiedActions: 25, spendCad: 100, outcome: 'pass' },
      { waveId: failWaveId, receiptUrl: 'https://example.com/receipts/fail-1', qualifiedActions: 0, spendCad: 100, outcome: 'fail' },
      { waveId: passWaveId, receiptUrl: 'TBD', qualifiedActions: 999, spendCad: 0, outcome: 'pass' }
    ]
  }
});

const cal = calibrated.calibration;
assert.ok(cal, 'calibration report produced');
assert.equal(cal.overallSellThroughPct, Math.round(((5 + 14) / (12 + 24)) * 10000) / 100, 'overall sell-through computed');
assert.equal(cal.distanceToGoalPct, Math.round((85 - cal.overallSellThroughPct) * 100) / 100, 'distance to 85% goal tracked');
assert.equal(cal.skuTracker.length, 2, 'per-SKU tracker present');
assert.ok(cal.auditTrail.length >= 4, 'audit trail records prior -> evidence -> posterior -> change -> why');
for (const entry of cal.auditTrail) {
  assert.ok(entry.why && entry.changeMade, 'audit entries explain the change');
}
assert.notEqual(cal.posteriorWinnerScore, cal.priorWinnerScore, 'posterior differs from prior after receipts');

const calPlan = calibrated.plan;
const killed = calPlan.waves.find((w) => w.id === failWaveId);
assert.equal(killed.status, 'killed', 'failing wave killed');
assert.equal(killed.budgetCapCad, 0, 'killed wave budget freed');
const scaled = calPlan.waves.find((w) => w.id === passWaveId);
assert.equal(scaled.status, 'scaled', 'passing wave scaled');
assert.ok(scaled.budgetCapCad > plan.waves.find((w) => w.id === passWaveId).budgetCapCad, 'budget reallocated toward what works');
const calTotal = calPlan.waves.reduce((s, w) => s + w.budgetCapCad, 0);
assert.ok(calTotal <= brand.testCashPoolCad, 'post-calibration budgets still within pool');
assert.ok(
  cal.auditTrail.some((e) => e.changeMade === 'ignored' && /receipt/.test(e.why)),
  'receipt-less outcomes are ignored with an audit note'
);

// Calibration is deterministic too.
const calibratedAgain = engine.generateStrategy({
  ...baseInput,
  firstPartyResults: {
    asOf: '2026-10-01',
    sessions: 900,
    purchases: 12,
    sellThroughBySku: [
      { skuId: 'VE-FJ-001', unitsPlanned: 12, unitsSold: 5 },
      { skuId: 'VE-WD-001', unitsPlanned: 24, unitsSold: 14 }
    ],
    waveOutcomes: [
      { waveId: passWaveId, receiptUrl: 'https://example.com/receipts/pass-1', qualifiedActions: 25, spendCad: 100, outcome: 'pass' },
      { waveId: failWaveId, receiptUrl: 'https://example.com/receipts/fail-1', qualifiedActions: 0, spendCad: 100, outcome: 'fail' },
      { waveId: passWaveId, receiptUrl: 'TBD', qualifiedActions: 999, spendCad: 0, outcome: 'pass' }
    ]
  }
});
assert.equal(JSON.stringify(calibrated), JSON.stringify(calibratedAgain), 'calibration is deterministic');

// ---------------------------------------------------------------- 10. safety invariants: no Drop OS GO / demand-proof claims

for (const out of [result, remix, calibrated]) {
  assert.equal(out.safety.demandProofClaim, false, 'never claims demand proof');
  assert.equal(out.safety.dropOsImpact, 'none', 'never impacts Drop OS');
  assert.equal(out.safety.productionSpendAuthorizedCad, 0, 'never authorizes production spend');
  for (const wave of out.plan.waves) {
    for (const item of wave.items) {
      assert.ok(!/demand (is )?proven|authorize production|drop os go/i.test(item.action), `no forbidden claims in ${item.id}`);
    }
  }
  assert.ok(out.safety.invariants.length >= 4, 'invariants stated');
}

// Engine still works with an empty library (refuses a winner honestly).
const emptyLib = engine.generateStrategy({ ...baseInput, library: [] });
assert.equal(emptyLib.winner, null, 'refuses a winner with zero usable evidence');
assert.equal(emptyLib.plan, null, 'no plan without a winner');
assert.ok(emptyLib.reversalConditions.some((r) => /evidence card/i.test(r)), 'tells operator what to add');

// Cards without usable source URLs earn nothing.
const unlinked = engine.generateStrategy({
  ...baseInput,
  library: libraryPack.cards.map((c) => ({ ...c, sourceUrl: 'TBD' }))
});
assert.equal(unlinked.winner, null, 'unlinked sources earn no strategy support');

console.log('strategy-generator tests passed');
console.log(`winner: ${result.winner.strategyId} (${result.winner.label}) score=${result.winner.totalScore}`);
console.log(`runner-up: ${result.runnerUp.strategyId} score=${result.runnerUp.totalScore}`);
console.log(`plan waves: ${plan.waves.length}, budget allocated: C$${plan.budgetAllocatedCad} of C$${brand.testCashPoolCad}`);
