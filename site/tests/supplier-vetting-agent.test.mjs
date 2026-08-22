import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bundlePath = join(__dirname, '..', 'supplier-vetting-agent.js');
const source = readFileSync(bundlePath, 'utf8');
const sandbox = {};

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: bundlePath });

const agent = sandbox.VorgSupplierVetting;
assert.ok(agent, 'supplier vetting namespace exists');
assert.equal(agent.ALGORITHM_VERSION, 'VORG Supplier Vetting v1.0');
assert.equal(agent.PRIMARY_PLATFORM, 'Alibaba.com');

function supplier(overrides = {}) {
  return {
    id: 'topshow-001',
    name: 'Example Factory',
    contactName: 'Lina',
    platform: 'Alibaba.com',
    profileUrl: 'https://example.com/profile',
    styleIds: ['VE-FJ-001'],
    evidence: [],
    claims: [],
    risks: {},
    ...overrides
  };
}

function evidence(requirement, overrides = {}) {
  return {
    id: `ev-${requirement}`,
    requirement,
    status: 'verified',
    authority: 'third-party',
    sourceUrl: `https://evidence.example/${requirement}`,
    capturedAt: '2026-08-01T12:00:00Z',
    details: 'Reviewed against the supplier record.',
    ...overrides
  };
}

const blank = supplier();
const blankEvaluation = agent.evaluateSupplier(blank);
assert.equal(blankEvaluation.score, 0);
assert.equal(blankEvaluation.gate, 'screening');
assert.equal(blankEvaluation.bulkAuthorized, false);
assert.equal(blankEvaluation.founderApprovalRequired, true);
assert.equal(agent.nextAction(blank).kind, 'request-similar-work');

const firstDraft = agent.draftNextMessage(blank, new Date('2026-08-01T12:00:00Z'));
assert.equal(firstDraft.status, 'approval-required');
assert.equal(firstDraft.platform, 'Alibaba.com');
assert.equal(firstDraft.channel, 'Message Center');
assert.match(firstDraft.body, /personally produced/i);
assert.match(firstDraft.body, /front, back and inside/i);
assert.match(firstDraft.body, /in-house versus subcontracted/i);
assert.match(firstDraft.body, /no bulk commitment/i);
assert.ok(firstDraft.doNotSendIf.some(item => item.includes('founder has not approved')));

const profileMissing = supplier({ profileUrl: '' });
assert.equal(agent.nextAction(profileMissing).kind, 'audit-profile');

const personalPayment = agent.evaluateSupplier(supplier({ risks: { requestsPersonalPayment: true } }));
assert.equal(personalPayment.gate, 'reject');
assert.equal(personalPayment.score, 0);
assert.equal(personalPayment.maxAuthorizedAction, 'none');
assert.ok(personalPayment.hardStops.some(item => item.includes('personal')));

const contradictoryIdentity = supplier({
  claims: [
    { id: 'c1', key: 'legal-name', value: 'Factory A Ltd', capturedAt: '2026-08-01T10:00:00Z' },
    { id: 'c2', key: 'legal-name', value: 'Trading B Ltd', capturedAt: '2026-08-02T10:00:00Z' }
  ]
});
const contradictionEvaluation = agent.evaluateSupplier(contradictoryIdentity);
assert.equal(contradictionEvaluation.gate, 'reject');
assert.equal(contradictionEvaluation.contradictions.length, 1);
assert.equal(contradictionEvaluation.contradictions[0].material, true);

const claimedOnly = supplier({
  evidence: agent.REQUIREMENTS.map(item => evidence(item.requirement, {
    status: 'claimed',
    authority: 'supplier-claim',
    sourceUrl: '',
    details: 'Supplier says yes.'
  }))
});
const claimedOnlyEvaluation = agent.evaluateSupplier(claimedOnly);
assert.ok(claimedOnlyEvaluation.score < 25);
assert.equal(claimedOnlyEvaluation.gate, 'screening');

const nonSampleRequirements = agent.REQUIREMENTS
  .map(item => item.requirement)
  .filter(requirement => !['proto-measurement', 'sample-construction', 'physical-fit', 'test-results', 'pp-sample'].includes(requirement));

const strongDesktopEvidence = nonSampleRequirements.map(requirement => {
  if (requirement === 'assessment-report' || requirement === 'legal-identity' || requirement === 'bank-entity-match') {
    return evidence(requirement, { authority: 'platform-report' });
  }
  if (requirement === 'live-facility' || requirement === 'current-proof-code') {
    return evidence(requirement, { authority: 'live-challenge' });
  }
  return evidence(requirement);
});

const desktopCandidate = agent.evaluateSupplier(supplier({ evidence: strongDesktopEvidence }));
assert.equal(desktopCandidate.score, 74, 'missing physical sample evidence caps the score');
assert.equal(desktopCandidate.gate, 'sample-candidate');
assert.equal(desktopCandidate.maxAuthorizedAction, 'prepare-sample-order');
assert.equal(desktopCandidate.bulkAuthorized, false);
assert.equal(agent.nextAction(supplier({ evidence: strongDesktopEvidence })).kind, 'prepare-sample-order');

const fullEvidence = [
  ...strongDesktopEvidence,
  evidence('proto-measurement', { authority: 'physical-sample' }),
  evidence('sample-construction', { authority: 'physical-sample' }),
  evidence('physical-fit', { authority: 'physical-sample' }),
  evidence('test-results', { authority: 'third-party' }),
  evidence('pp-sample', { authority: 'physical-sample' })
];
const founderReview = agent.evaluateSupplier(supplier({ evidence: fullEvidence }));
assert.equal(founderReview.score, 98, 'platform/live evidence keeps a small confidence discount');
assert.equal(founderReview.gate, 'founder-review');
assert.equal(founderReview.maxAuthorizedAction, 'prepare-bulk-review');
assert.equal(founderReview.bulkAuthorized, false, 'the algorithm never authorizes bulk');
assert.equal(agent.nextAction(supplier({ evidence: fullEvidence })).kind, 'prepare-founder-review');

const technicalRecord = supplier({
  evidence: [
    evidence('similar-front-back-inside'),
    evidence('similar-detail-closeups'),
    evidence('similar-ownership-context')
  ]
});
const technicalDraft = agent.draftNextMessage(technicalRecord);
assert.equal(technicalDraft.action, 'technical-challenge');
assert.match(technicalDraft.body, /no separate cuff, taper, elastic or closure/i);
assert.match(technicalDraft.body, /two most likely failure points/i);

assert.equal(agent.proofCode(blank, new Date('2026-08-01T12:00:00Z')), 'VE-20260801-OW001');

console.log('supplier-vetting-agent: ok');
