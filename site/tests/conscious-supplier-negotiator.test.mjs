import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bundlePath = join(__dirname, '..', 'conscious-supplier-negotiator.js');
const source = readFileSync(bundlePath, 'utf8');
const sandbox = {};

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: bundlePath });

const engine = sandbox.VorgConsciousNegotiation;
assert.ok(engine, 'human-aware negotiation namespace exists');
assert.equal(engine.ALGORITHM_VERSION, 'VORG Human-Aware Supplier Negotiation v1.0');

function context(signals = {}, overrides = {}) {
  return {
    supplierName: 'Dongguan City Topshow Garment Co., Ltd.',
    contactName: 'Judy',
    styleId: 'VE-FJ-001',
    signals: {
      answerCompletenessPct: 80,
      evidenceCoveragePct: 70,
      technicalSpecificityPct: 75,
      commercialClarityPct: 65,
      reciprocityPct: 50,
      statesLimitations: true,
      asksUsefulQuestions: true,
      ...signals
    },
    constraints: [],
    concessions: [],
    unresolvedClaims: [],
    ...overrides
  };
}

const honestGap = engine.decideNegotiation(context({ answerCompletenessPct: 55, evidenceCoveragePct: 35 }));
assert.equal(honestGap.stage, 'clarify');
assert.equal(honestGap.tone, 'warm');
assert.equal(honestGap.requiresActionTimeApproval, true);
assert.equal(honestGap.mayAutoSend, false);
assert.equal(honestGap.mayCommitSpend, false);

const contradiction = engine.decideNegotiation(context({ contradictions: 1 }));
assert.equal(contradiction.stage, 'challenge');
assert.match(contradiction.primaryObjective, /contradiction/i);

const priceDiscussion = engine.decideNegotiation(context({
  answerCompletenessPct: 100,
  evidenceCoveragePct: 85,
  technicalSpecificityPct: 90,
  commercialClarityPct: 90,
  reciprocityPct: 70,
  priceGapPct: 18
}, {
  constraints: [{ id: 'c1', statement: 'Leather collar MOQ increases sample material cost', verified: false, negotiable: true }]
}));
assert.equal(priceDiscussion.stage, 'bargain');
assert.ok(priceDiscussion.tradeOptions.length >= 4);
assert.match(priceDiscussion.relationshipIntent, /trade real value/i);

const dangerous = engine.decideNegotiation(context({ requestsPersonalPayment: true, pressureForBulk: true }));
assert.equal(dangerous.stage, 'exit');
assert.equal(dangerous.hardStops.length, 2);

const draft = engine.draftNegotiationMessage(context({ answerCompletenessPct: 50 }), honestGap, 'bilingual');
assert.match(draft.body, /Judy/);
assert.match(draft.body, /感谢您的回复/);
assert.match(draft.body, /not available/i);
assert.equal(draft.requiresActionTimeApproval, true);
assert.ok(draft.claimsNotToMake.some(item => /volume/i.test(item)));

const unbalanced = engine.concessionBalance([
  { id: 'v1', owner: 'VORG-EAVY', description: 'Fast approval', valuePoints: 100, status: 'accepted' },
  { id: 's1', owner: 'supplier', description: 'Small credit', valuePoints: 20, status: 'accepted' }
]);
assert.equal(unbalanced.balanced, false);
assert.match(unbalanced.warning, /pause/i);

const balanced = engine.concessionBalance([
  { id: 'v1', owner: 'VORG-EAVY', description: 'Fast approval', valuePoints: 100, status: 'accepted' },
  { id: 's1', owner: 'supplier', description: 'Included revision', valuePoints: 80, status: 'accepted' }
]);
assert.equal(balanced.balanced, true);

console.log('conscious-supplier-negotiator: ok');
