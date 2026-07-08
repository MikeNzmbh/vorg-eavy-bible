import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bundlePath = join(__dirname, '..', 'drop-os-algorithm.js');
const source = readFileSync(bundlePath, 'utf8');
const sandbox = {};

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: bundlePath });

const algorithm = sandbox.VorgDropAlgorithm;

assert.ok(algorithm, 'algorithm global exists');
assert.equal(algorithm.ALGORITHM_VERSION, 'VORG Drop OS score v0.4');

const strongInput = {
  stress: {
    demand: 92,
    product: 88,
    campaign: 90,
    operations: 86,
    margin: 84,
    evidence: 90,
    risk: 24
  },
  operationsEffective: 88,
  productProofScore: 90,
  stages: [
    { status: 'done', gate: 'approve', score: 92 },
    { status: 'done', gate: 'approve', score: 88 },
    { status: 'in progress', gate: 'test', score: 78 }
  ],
  tactics: [
    { status: 'approved' },
    { status: 'approved' },
    { status: 'approved' }
  ],
  signals: [
    { city: 'Montreal', strength: 86 },
    { city: 'Toronto', strength: 79 },
    { city: 'Ottawa/Gatineau', strength: 82 }
  ]
};

const strongScore = algorithm.calculateScores(strongInput);
assert.equal(strongScore.gate, 'approve');
assert.ok(strongScore.confidence >= 80);
assert.equal(strongScore.evidenceFloor, 88);
assert.equal(strongScore.bottleneck, 'Stage momentum');
assert.equal(strongScore.spendAuthorization.level, 'major-spend');
assert.ok(strongScore.gateReason.includes('GO band'));
assert.ok(Array.isArray(strongScore.levers));

const lowProofScore = algorithm.calculateScores({
  ...strongInput,
  stress: { ...strongInput.stress, evidence: 30 },
  operationsEffective: 92,
  productProofScore: 95
});

assert.equal(lowProofScore.gate, 'kill');
assert.equal(lowProofScore.bottleneck, 'Proof check');
assert.equal(lowProofScore.evidenceFloor, 30);
assert.equal(lowProofScore.spendAuthorization.level, 'paused');
assert.ok(lowProofScore.gateReason.includes('hard floor'));
assert.ok(lowProofScore.levers.some(lever => lever.id === 'proof-floor-64'));
assert.ok(lowProofScore.levers[0].deltaConfidence > 0);

const riskyScore = algorithm.calculateScores({
  ...strongInput,
  stress: { ...strongInput.stress, risk: 84 }
});

assert.equal(riskyScore.gate, 'kill');
assert.ok(riskyScore.riskDrag > strongScore.riskDrag);
assert.equal(riskyScore.spendAuthorization.level, 'paused');
assert.ok(riskyScore.levers.some(lever => lever.id === 'risk-32'));

const cityScores = algorithm.scoreCitySignals([
  { city: 'Montreal', strength: 75 },
  { city: 'Montreal', strength: 75 },
  { city: 'Montreal', strength: 75 },
  { city: 'Montreal', strength: 75 },
  { city: 'Montreal', strength: 75 },
  { city: 'Toronto', strength: 83 }
]);

assert.equal(cityScores.find(city => city.city === 'Montreal').score, 78);
assert.equal(cityScores.find(city => city.city === 'Toronto').score, 77);
const nextCity = algorithm.getNextCitySignal(cityScores.flatMap(city =>
  Array.from({ length: city.count }, () => ({ city: city.city, strength: city.city === 'Montreal' ? 75 : 83 }))
));
assert.equal(nextCity.city, 'Montreal');
assert.equal(nextCity.score, 78);
assert.equal(nextCity.count, 5);

const emptyNextCity = algorithm.getNextCitySignal([]);
assert.equal(emptyNextCity.city, 'Montreal');
assert.equal(emptyNextCity.score, 0);
assert.equal(emptyNextCity.count, 0);

console.log('drop-os-algorithm: ok');
