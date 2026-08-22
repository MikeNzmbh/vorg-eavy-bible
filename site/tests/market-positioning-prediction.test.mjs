import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const bundlePath = join(here, '..', 'market-positioning-prediction.js');
const source = readFileSync(bundlePath, 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: bundlePath });

const engine = sandbox.VorgMarketPositioning;
assert.ok(engine, 'engine global exists');
assert.equal(engine.ENGINE_VERSION, 'VORG Market Positioning Prediction v1.1');
assert.equal(engine.__test.hasEvidenceReference('https://example.com/x'), true);
assert.equal(engine.__test.hasEvidenceReference('research/foo.json'), true);
assert.equal(engine.__test.hasEvidenceReference('TBD'), false);
assert.equal(engine.__test.hasEvidenceReference(''), false);

const candidates = JSON.parse(readFileSync(join(root, 'research/market-positioning/candidates.json'), 'utf8'));
const ledger = JSON.parse(readFileSync(join(root, 'research/market-positioning/source-ledger.json'), 'utf8'));
const mechanisms = JSON.parse(readFileSync(join(root, 'research/market-positioning/mechanism-cards.json'), 'utf8'));
const gates = JSON.parse(readFileSync(join(root, 'research/market-positioning/route-to-market-gates.json'), 'utf8'));

const baseInput = {
  generatedAt: '2026-08-22T20:00:00.000Z',
  candidates: candidates.candidates,
  sources: ledger.sources,
  signals: ledger.signals,
  mechanisms: mechanisms.cards,
  gates: gates.gates,
  receipts: []
};

const frozenCopy = JSON.parse(JSON.stringify(baseInput));
const result = engine.recommendPosition(baseInput);
assert.equal(JSON.stringify(baseInput), JSON.stringify(frozenCopy), 'engine does not mutate inputs');
assert.equal(result.dropOsImpact, 'none', 'forecast never claims Drop OS impact');
assert.ok(result.provisionalWinner, 'can select provisional winner from public priors with zero receipts');
assert.ok(result.provisionalWinners.length >= 2, 'near-tied markets are returned as a co-finalist set');
assert.equal(result.rankingStrength, 'lead-hypothesis', 'missing metro search and a narrow lead cannot pose as a clear winner');
assert.ok(result.provisionalWinner.metro, 'winner has a metro');
assert.notEqual(result.provisionalWinner.metro.toLowerCase(), 'united states');
assert.equal(result.decisionStatus, 'forecast-only', 'hard-stop gates keep status forecast-only');
assert.ok(result.rankedCandidates.length >= 5, 'ranks at least five candidates');
assert.ok(result.winnerPlan, 'produces winner plan');
assert.ok(result.blindSpotGates.some((g) => g.hardStop && g.state !== 'cleared-with-evidence'));

const wholeUs = engine.recommendPosition({
  ...baseInput,
  candidates: [
    {
      id: 'us-whole',
      country: 'United States',
      metro: '',
      onlineScope: 'national',
      targetBuyer: 'everyone',
      positionStatement: 'bad',
      activeSkuIds: [],
      popUpIntent: 'none',
      operatingMarket: 'Canada'
    }
  ]
});
assert.equal(wholeUs.provisionalWinner, null);
assert.equal(wholeUs.decisionStatus, 'research-incomplete');
assert.ok(wholeUs.rankedCandidates[0].redFlags.some((f) => /metro/i.test(f)));

const incomplete = engine.recommendPosition({
  ...baseInput,
  signals: baseInput.signals.filter((s) => s.family !== 'buyer'),
  mechanisms: baseInput.mechanisms
});
assert.ok(
  incomplete.rankedCandidates.every((c) => !c.metro || c.decisionStatus === 'research-incomplete' || c.priorScore === 0),
  'incomplete candidates do not get default competitive scores'
);
assert.equal(incomplete.provisionalWinner, null, 'refuses winner when coverage incomplete');

const unlinked = engine.recommendPosition({
  ...baseInput,
  sources: baseInput.sources.map((s) => ({ ...s, url: 'TBD' }))
});
assert.equal(unlinked.provisionalWinner, null, 'unlinked sources earn no score credit');

const withFollowers = engine.recommendPosition({
  ...baseInput,
  signals: [
    ...baseInput.signals,
    {
      id: 'fake-followers',
      family: 'creator',
      candidateIds: ['us-miami'],
      sourceIds: [],
      geography: 'Miami',
      definition: '1M followers',
      normalizedScore: 99
    }
  ]
});
const miami = withFollowers.rankedCandidates.find((c) => c.candidateId === 'us-miami');
const miamiBase = result.rankedCandidates.find((c) => c.candidateId === 'us-miami');
assert.ok(miami && miamiBase);
assert.equal(miami.priorScore, miamiBase.priorScore, 'follower-only / unlinked signal grants no credit');

const clearedGates = baseInput.gates.map((g) =>
  g.hardStop ? { ...g, state: 'cleared-with-evidence' } : g
);
const testable = engine.recommendPosition({ ...baseInput, gates: clearedGates });
assert.equal(testable.decisionStatus, 'testable');

const onlyUsCleared = baseInput.gates.map((g) =>
  String(g.region || '').includes('US') && g.hardStop
    ? { ...g, state: 'cleared-with-evidence' }
    : g
);
const scopedGateRun = engine.recommendPosition({ ...baseInput, gates: onlyUsCleared });
assert.equal(scopedGateRun.decisionStatus, 'testable', 'Canada-only expansion gates do not freeze the U.S. market branch');

const invalidDates = engine.recommendPosition({
  ...baseInput,
  sources: baseInput.sources.map((source) => ({ ...source, checkedOn: 'not-a-date' }))
});
assert.equal(invalidDates.provisionalWinner, null, 'invalid source dates cannot be treated as fresh evidence');

const recal = engine.recommendPosition({
  ...baseInput,
  receipts: [
    {
      id: 'r1',
      kind: 'purchase',
      candidateId: 'us-chicago',
      countedAt: '2026-08-20',
      artifactUrl: 'research/market-positioning/fixtures/fake-chicago-purchase-receipt.json',
      quantity: 8,
      geoPrecision: 'metro'
    }
  ]
});
assert.ok(recal.receiptAdjustments.length >= 1);
assert.equal(recal.decisionStatus, 'forecast-only', 'receipts do not erase open route-to-market hard stops');
assert.equal(recal.recalibrated, true, 'receipt adjustment is still disclosed');
assert.ok(recal.rankedCandidates[0].candidateId === 'us-chicago' || recal.receiptAdjustments[0].candidateId === 'us-chicago');
const chicago = recal.rankedCandidates.find((c) => c.candidateId === 'us-chicago');
const chicagoPrior = result.rankedCandidates.find((c) => c.candidateId === 'us-chicago');
assert.ok(chicago.posteriorScore > chicagoPrior.posteriorScore, 'receipts raise posterior');

const negative = engine.recommendPosition({
  ...baseInput,
  receipts: [{
    id: 'r-negative',
    kind: 'checkout',
    candidateId: 'us-nyc-brooklyn',
    countedAt: '2026-08-21',
    artifactUrl: 'research/market-positioning/fixtures/nyc-negative-checkout.json',
    quantity: 4,
    geoPrecision: 'metro',
    outcome: 'negative'
  }]
});
const negativeNyc = negative.rankedCandidates.find((c) => c.candidateId === 'us-nyc-brooklyn');
const baseNyc = result.rankedCandidates.find((c) => c.candidateId === 'us-nyc-brooklyn');
assert.ok(negativeNyc.posteriorScore < baseNyc.posteriorScore, 'negative receipts lower a candidate instead of only allowing upward movement');

const alternatingReceipts = engine.recommendPosition({
  ...baseInput,
  receipts: Array.from({ length: 8 }, (_, index) => ({
    id: `r-cap-${index}`,
    kind: 'purchase',
    candidateId: 'us-nyc-brooklyn',
    countedAt: '2026-08-21',
    artifactUrl: `research/market-positioning/fixtures/cap-${index}.json`,
    quantity: 20,
    geoPrecision: 'metro',
    outcome: index % 2 ? 'negative' : 'positive'
  }))
});
const totalReceiptMagnitude = alternatingReceipts.receiptAdjustments.reduce(
  (sum, adjustment) => sum + Math.abs(adjustment.adjustment),
  0
);
assert.ok(totalReceiptMagnitude <= 20, 'alternating positive/negative receipts cannot bypass the cumulative adjustment cap');

console.log(
  JSON.stringify(
    {
      winner: result.provisionalWinner.metro,
      score: result.provisionalWinner.posteriorScore,
      confidence: result.provisionalWinner.confidence,
      status: result.decisionStatus,
      ranked: result.rankedCandidates.map((c) => ({
        metro: c.metro,
        score: Number(c.posteriorScore.toFixed(1)),
        confidence: Number(c.confidence.toFixed(1)),
        status: c.decisionStatus
      }))
    },
    null,
    2
  )
);
console.log('market-positioning-prediction tests passed');
