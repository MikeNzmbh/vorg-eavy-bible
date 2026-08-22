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
assert.equal(algorithm.ALGORITHM_VERSION, 'VORG Drop OS score v1.3');
assert.equal(algorithm.DEFAULT_PRODUCTION_SPEND_CAP, 6000);
assert.equal(algorithm.hasEvidenceReference('docs/proof.md'), true);
assert.equal(algorithm.hasEvidenceReference('https://example.com/proof'), true);
assert.equal(algorithm.hasEvidenceReference('/'), false);
assert.equal(algorithm.hasEvidenceReference('https://'), false);

function manufacturing(overrides = {}) {
  return {
    vendorName: 'Proof Factory',
    quoteUrl: 'https://example.com/quote.pdf',
    landedCogs: 50,
    moq: 20,
    leadTimeDays: 45,
    quoteDate: '2026-07-10',
    sampleStage: 'approved',
    sampleProofUrl: 'https://example.com/sample.jpg',
    ppApproved: true,
    ...overrides
  };
}

function product(id, units, price, landedCogs) {
  return {
    id,
    name: id,
    units,
    price,
    priceEvidenceUrl: `launch/${id}-price-proof.md`,
    manufacturing: manufacturing({
      quoteUrl: `https://example.com/${id}-quote.pdf`,
      sampleProofUrl: `https://example.com/${id}-sample.jpg`,
      landedCogs
    })
  };
}

const strongProducts = [
  product('jacket', 20, 180, 60),
  product('denim', 20, 140, 50)
];

function completeUsMarketEntry(overrides = {}) {
  return {
    primaryMarket: 'United States',
    operatingMarket: 'Canada',
    primaryMarketEvidenceUrl: 'launch/us-demand-receipt.md',
    salesCurrency: 'USD',
    marketEconomicsEvidenceUrl: 'finance/us-market-economics.md',
    fulfillmentModel: 'Canada-to-US DDP carrier',
    fulfillmentEvidenceUrl: 'ops/us-fulfillment-quote.md',
    crossBorderEvidenceUrl: 'ops/us-importer-carrier-review.md',
    dutiesAndTaxEvidenceUrl: 'ops/us-duties-tax-check.md',
    shippingEvidenceUrl: 'site/us-shipping-policy.md',
    returnsEvidenceUrl: 'site/us-returns-policy.md',
    productComplianceEvidenceUrl: 'product/us-label-care-preflight.md',
    privacyAndConsentEvidenceUrl: 'ops/us-privacy-sms-review.md',
    creatorRightsEvidenceUrl: 'launch/us-creator-rights-disclosure.md',
    channels: [
      {
        id: 'shopify', platform: 'Shopify', active: true, owner: 'Ecommerce lead',
        commerceRoute: 'Shopify checkout', measurementEvidenceUrl: 'site/us-shopify-event-map.md',
        policyEvidenceUrl: 'site/us-storefront-policy-check.md'
      },
      {
        id: 'tiktok', platform: 'TikTok', active: true, owner: 'Campaign lead',
        commerceRoute: 'TikTok to Shopify checkout', measurementEvidenceUrl: 'launch/us-tiktok-attribution-plan.md',
        policyEvidenceUrl: 'launch/us-tiktok-commercial-content-policy.md'
      }
    ],
    popupEnabled: true,
    popupCity: 'New York',
    popupMarket: 'United States',
    popupEvidenceUrl: 'ops/new-york-popup-permission-plan.md',
    ...overrides
  };
}

const strongInput = {
  stress: {
    demand: 92,
    product: 100,
    campaign: 90,
    operations: 86,
    margin: 84,
    evidence: 90,
    risk: 24
  },
  operationsEffective: 88,
  productionSpendCap: 6000,
  products: strongProducts,
  stages: [
    { id: 'signal', order: 0, status: 'done', gate: 'approve', score: 92, evidence: 'research/signal.md' },
    { id: 'concept', order: 1, status: 'done', gate: 'approve', score: 90, evidence: 'product/concept.md' },
    { id: 'sample', order: 2, status: 'done', gate: 'approve', score: 88, evidence: 'https://example.com/sample' },
    { id: 'campaign-proof', order: 3, status: 'done', gate: 'approve', score: 86, evidence: 'launch/proof.md' }
  ],
  tactics: [
    { id: 'a', status: 'approved', evidenceUrl: 'https://example.com/a' },
    { id: 'b', status: 'approved', evidenceUrl: 'https://example.com/b' },
    { id: 'c', status: 'approved', evidenceUrl: 'https://example.com/c' }
  ],
  signals: [
    { id: 'm1', item: 'M1', city: 'Montreal', source: 'Waitlist', strength: 75, evidenceUrl: 'https://example.com/m1' },
    { id: 'm2', item: 'M2', city: 'Montreal', source: 'Waitlist', strength: 75, evidenceUrl: 'https://example.com/m2' },
    { id: 'm3', item: 'M3', city: 'Montreal', source: 'Waitlist', strength: 75, evidenceUrl: 'https://example.com/m3' },
    { id: 'm4', item: 'M4', city: 'Montreal', source: 'Waitlist', strength: 75, evidenceUrl: 'https://example.com/m4' },
    { id: 'm5', item: 'M5', city: 'Montreal', source: 'Waitlist', strength: 75, evidenceUrl: 'https://example.com/m5' },
    { id: 't1', item: 'T1', city: 'Toronto', source: 'DM', strength: 83, evidenceUrl: 'https://example.com/t1' },
    { id: 'o1', item: 'O1', city: 'Ottawa/Gatineau', source: 'DM', strength: 82, evidenceUrl: 'https://example.com/o1' }
  ]
};

const strongScore = algorithm.calculateScores(strongInput);
assert.equal(strongScore.gate, 'approve');
assert.ok(strongScore.confidence >= 85);
assert.deepEqual({ ...strongScore.confidenceBand }, { low: strongScore.confidence, high: strongScore.confidence });
assert.equal(strongScore.evidenceCoverage, 100);
assert.equal(strongScore.evidenceFloor, 88);
assert.equal(strongScore.manufacturingScore, 100);
assert.equal(strongScore.financialProofScore, 100);
assert.equal(strongScore.budgetStatus, 'within-cap');
assert.equal(strongScore.plannedProductionSpend, 2200);
assert.equal(strongScore.bulkReady, true);
assert.equal(strongScore.productionPrerequisitesCleared, true);
assert.equal(strongScore.verifiedTactics, 3);
assert.equal(strongScore.edgeScore, 0);
assert.equal(strongScore.edgeValidatedExperiments, 0);
assert.equal(strongScore.edgeBudgetStatus, 'unknown');
assert.equal(strongScore.marketEntryRequired, false);
assert.equal(strongScore.marketEntryGoReady, true);
assert.equal(strongScore.spendAuthorization.level, 'major-spend');
assert.ok(strongScore.gateReason.includes('clears every'));
assert.ok(strongScore.campaignIndex >= 85);
assert.equal(strongScore.campaignBand, 'strong');
assert.equal(strongScore.campaignRate, undefined, 'uncalibrated campaign score is not exposed as a rate');

// A cross-border U.S.-first thesis must prove the route to market; a country name
// and channel names cannot convert into readiness.
const usPlanOnly = {
  primaryMarket: 'United States',
  operatingMarket: 'Canada',
  salesCurrency: 'USD',
  channels: [
    { platform: 'Shopify', active: true },
    { platform: 'TikTok', active: true }
  ],
  popupEnabled: true
};
const unreadyUsMarket = algorithm.calculateMarketEntryMetrics(usPlanOnly);
assert.equal(unreadyUsMarket.required, true);
assert.equal(unreadyUsMarket.crossBorder, true);
assert.equal(unreadyUsMarket.score, 7);
assert.equal(unreadyUsMarket.evidenceCoverage, 0);
assert.equal(unreadyUsMarket.goReady, false);
assert.ok(unreadyUsMarket.violations.some(item => item.includes('cross-border')));
assert.ok(unreadyUsMarket.violations.some(item => item.includes('Shopify')));
assert.ok(unreadyUsMarket.violations.some(item => item.includes('TikTok')));

const usPlanOnlyScore = algorithm.calculateScores({ ...strongInput, marketEntry: usPlanOnly });
assert.equal(usPlanOnlyScore.marketEntryScore, 7);
assert.equal(usPlanOnlyScore.marketEntryEvidenceCoverage, 0);
assert.equal(usPlanOnlyScore.marketEntryGoReady, false);
assert.notEqual(usPlanOnlyScore.gate, 'approve');
assert.ok(usPlanOnlyScore.gateCaps.some(item => item.includes('Market-entry readiness')));

const completeUsMarket = algorithm.calculateMarketEntryMetrics(completeUsMarketEntry());
assert.equal(completeUsMarket.score, 100);
assert.equal(completeUsMarket.evidenceCoverage, 100);
assert.equal(completeUsMarket.goReady, true);
assert.equal(completeUsMarket.crossBorder, true);

const completeUsScore = algorithm.calculateScores({ ...strongInput, marketEntry: completeUsMarketEntry() });
assert.equal(completeUsScore.marketEntryScore, 100);
assert.equal(completeUsScore.marketEntryGoReady, true);
assert.equal(completeUsScore.gate, 'approve');

const missingCrossBorder = algorithm.calculateScores({
  ...strongInput,
  marketEntry: completeUsMarketEntry({ crossBorderEvidenceUrl: '' })
});
assert.equal(missingCrossBorder.marketEntryGoReady, false);
assert.notEqual(missingCrossBorder.gate, 'approve');
assert.ok(missingCrossBorder.marketEntryViolations.some(item => item.includes('cross-border')));

// Perfect sliders and clicks must not substitute for evidence.
const subjectiveOnly = algorithm.calculateScores({
  stress: { demand: 100, product: 100, campaign: 100, operations: 100, margin: 100, evidence: 100, risk: 0 },
  operationsEffective: 100,
  productionSpendCap: 6000,
  products: [
    { id: 'a', units: '', price: 'TBD', manufacturing: {} },
    { id: 'b', units: '', price: 'TBD', manufacturing: {} }
  ],
  stages: [
    { order: 0, status: 'done', gate: 'approve', score: 100 },
    { order: 1, status: 'done', gate: 'approve', score: 100 }
  ],
  tactics: [
    { id: 'a', status: 'approved' },
    { id: 'b', status: 'approved' },
    { id: 'c', status: 'approved' }
  ],
  signals: [
    { item: 'Heat', city: 'Montreal', source: 'Team input', strength: 100 },
    { item: 'More heat', city: 'Toronto', source: 'Team input', strength: 100 }
  ]
});

assert.equal(subjectiveOnly.gate, 'revise');
assert.equal(subjectiveOnly.evidenceCoverage, 0);
assert.equal(subjectiveOnly.manufacturingScore, 0);
assert.equal(subjectiveOnly.financialProofScore, 0);
assert.equal(subjectiveOnly.verifiedTactics, 0);
assert.ok(subjectiveOnly.confidence < 45);
assert.equal(subjectiveOnly.spendAuthorization.level, 'proof-only');
assert.ok(subjectiveOnly.levers.some(lever => lever.id === 'manufacturing-proof'));

// Missing PP/sample truth may support tests, but can never unlock bulk.
const noPpInput = {
  ...strongInput,
  products: strongProducts.map(item => ({
    ...item,
    manufacturing: { ...item.manufacturing, sampleStage: 'lab', ppApproved: false }
  }))
};
const noPpScore = algorithm.calculateScores(noPpInput);
assert.notEqual(noPpScore.gate, 'approve');
assert.equal(noPpScore.bulkReady, false);
assert.ok(noPpScore.gateCaps.some(reason => reason.includes('PP approval')));
assert.notEqual(noPpScore.spendAuthorization.level, 'major-spend');

// The founder-stated C$6,000 production ceiling is a hard stop.
const overBudgetScore = algorithm.calculateScores({
  ...strongInput,
  products: strongProducts.map(item => ({ ...item, units: 100 }))
});
assert.equal(overBudgetScore.budgetStatus, 'over-cap');
assert.equal(overBudgetScore.gate, 'kill');
assert.equal(overBudgetScore.spendAuthorization.level, 'paused');
assert.ok(overBudgetScore.hardStops.some(reason => reason.includes('exceeds')));

const exactCapFinancial = algorithm.calculateFinancialProof([
  product('cap', 100, 100, 60)
], 6000);
assert.equal(exactCapFinancial.plannedProductionSpend, 6000);
assert.equal(exactCapFinancial.budgetStatus, 'within-cap');

// Numeric price tests and COGS placeholders cannot pose as financial proof.
const unprovenPriceScore = algorithm.calculateScores({
  ...strongInput,
  products: strongProducts.map(item => ({ ...item, priceEvidenceUrl: '' }))
});
assert.notEqual(unprovenPriceScore.gate, 'approve');
assert.ok(unprovenPriceScore.gateCaps.some(item => item.includes('unit, price, landed-COGS')));

const partialOverBudget = algorithm.calculateScores({
  ...strongInput,
  products: [
    product('known-over', 101, 100, 60),
    { id: 'still-unknown', units: '', price: 'TBD', manufacturing: {} }
  ]
});
assert.equal(partialOverBudget.budgetStatus, 'over-cap');
assert.equal(partialOverBudget.gate, 'kill');
assert.equal(partialOverBudget.plannedProductionSpend, 6060);

// Stage ordering is checked instead of averaging future, unreached work into momentum.
const sequenceScore = algorithm.calculateScores({
  ...strongInput,
  stages: [
    { order: 0, status: 'in progress', gate: 'test', score: 70, evidence: 'docs/current.md' },
    { order: 1, status: 'done', gate: 'approve', score: 100, evidence: 'docs/future.md' }
  ]
});
assert.equal(sequenceScore.sequenceViolations, 1);
assert.equal(sequenceScore.productionPrerequisitesCleared, false);
assert.notEqual(sequenceScore.gate, 'approve');
assert.ok(sequenceScore.gateCaps.some(reason => reason.includes('Later stages')));

const stageChainIncomplete = algorithm.calculateScores({
  ...strongInput,
  stages: strongInput.stages.map(stage => stage.id === 'campaign-proof'
    ? { ...stage, status: 'in progress', gate: 'test', score: 90 }
    : { ...stage })
});
assert.equal(stageChainIncomplete.productionPrerequisitesCleared, false);
assert.notEqual(stageChainIncomplete.gate, 'approve');
assert.ok(stageChainIncomplete.gateCaps.some(reason => reason.includes('pre-production stage chain')));

// Empty campaign work starts at zero; approval without a proof reference is discounted.
const emptyCampaign = algorithm.calculateScores({ ...strongInput, tactics: [] });
assert.equal(emptyCampaign.tacticScore, 0);
assert.equal(emptyCampaign.verifiedTactics, 0);
assert.notEqual(emptyCampaign.gate, 'approve');

const clickOnlyCampaign = algorithm.calculateScores({
  ...strongInput,
  tactics: [{ id: 'a', status: 'approved' }, { id: 'b', status: 'approved' }]
});
assert.equal(clickOnlyCampaign.tacticScore, 35);
assert.equal(clickOnlyCampaign.verifiedTactics, 0);
assert.notEqual(clickOnlyCampaign.gate, 'approve');

// Repeating the same receipt cannot manufacture demand depth.
const duplicateSignals = Array.from({ length: 6 }, (_, index) => ({
  id: `dup-${index}`,
  item: 'Same waitlist export',
  city: 'Montreal',
  source: 'Waitlist',
  strength: 90,
  evidenceUrl: 'https://example.com/same-receipt'
}));
assert.equal(algorithm.calculateSignalHeat(duplicateSignals), 78);
const duplicateCity = algorithm.scoreCitySignals(duplicateSignals)[0];
assert.equal(duplicateCity.count, 1);
assert.equal(duplicateCity.verifiedCount, 1);

const cityScores = algorithm.scoreCitySignals(strongInput.signals);
assert.equal(cityScores.find(city => city.city === 'Montreal').score, 80);
assert.equal(cityScores.find(city => city.city === 'Toronto').score, 75);
const nextCity = algorithm.getNextCitySignal(strongInput.signals);
assert.equal(nextCity.city, 'Montreal');
assert.equal(nextCity.score, 80);
assert.equal(nextCity.count, 5);
assert.equal(nextCity.verifiedCount, 5);

const emptyNextCity = algorithm.getNextCitySignal([]);
assert.deepEqual({ ...emptyNextCity }, { city: 'Montreal', score: 0, count: 0, verifiedCount: 0 });

// Malformed money values stay unresolved instead of coercing to zero-dollar proof.
const malformedFinancial = algorithm.calculateFinancialProof([
  { id: 'bad', units: '-5', price: 'TBD', manufacturing: { landedCogs: 'free-ish' } }
], 6000);
assert.equal(malformedFinancial.score, 0);
assert.equal(malformedFinancial.budgetStatus, 'unknown');
assert.equal(malformedFinancial.plannedProductionSpend, null);

function edgeExperiment(overrides = {}) {
  return {
    id: 'X01',
    tacticId: 'E01',
    name: 'Comment Becomes The Ad',
    sourceEvidenceTier: 'A',
    sourceProvenanceVerified: true,
    risk: 'Green',
    status: 'completed',
    decision: 'adopt',
    owner: 'Founder',
    budgetCap: 30,
    actualSpend: 20,
    targetQualifiedActions: 10,
    qualifiedActions: 12,
    assetsTarget: 2,
    assetsEarned: 3,
    resultSummary: 'Two objection assets beat the baseline and created qualified actions.',
    evidenceUrl: 'https://example.com/edge-result',
    approvalStatus: 'not-required',
    approvedBy: '',
    approvedAt: '',
    counselReviewed: false,
    counselReviewedAt: '',
    prerequisites: [
      { id: 'sample', label: 'Sample', cleared: true },
      { id: 'tracking', label: 'Tracking', cleared: true }
    ],
    ...overrides
  };
}

const emptyEdge = algorithm.calculateEdgeExperimentMetrics([]);
assert.equal(emptyEdge.score, 0);
assert.equal(emptyEdge.completedCount, 0);
assert.equal(emptyEdge.budgetStatus, 'unknown');

// Catalog presence and planned experiments are not campaign proof.
const plannedEdge = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment({ status: 'planned', decision: 'pending', resultSummary: '', evidenceUrl: '', qualifiedActions: 0, assetsEarned: 0, actualSpend: 0 })
]);
assert.equal(plannedEdge.score, 0);
assert.equal(plannedEdge.completedCount, 0);
assert.equal(plannedEdge.validatedCount, 0);
assert.equal(plannedEdge.violations.length, 0);

const validatedEdge = algorithm.calculateEdgeExperimentMetrics([edgeExperiment()]);
assert.equal(validatedEdge.score, 95);
assert.equal(validatedEdge.learningScore, 100);
assert.equal(validatedEdge.evidenceCoverage, 100);
assert.equal(validatedEdge.validatedCount, 1);
assert.equal(validatedEdge.budgetStatus, 'within-cap');
assert.equal(validatedEdge.totalSpend, 20);
assert.equal(validatedEdge.violations.length, 0);

const frontierEdge = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment({ id: 'X03', tacticId: 'E10', sourceEvidenceTier: 'F', risk: 'Yellow', approvalStatus: 'approved', approvedBy: 'Mike', approvedAt: '2026-07-20T12:00:00Z' })
]);
assert.equal(frontierEdge.score, 75);
assert.equal(frontierEdge.frontierSpendShare, 100);

// A Yellow experiment cannot run before approval or prerequisites.
const unapprovedEdgeScore = algorithm.calculateScores({
  ...strongInput,
  edgeExperiments: [edgeExperiment({
    risk: 'Yellow', status: 'running', decision: 'pending', approvalStatus: 'pending', approvedBy: '',
    resultSummary: '', evidenceUrl: '', qualifiedActions: 0, assetsEarned: 0, actualSpend: 0,
    prerequisites: [{ id: 'tracking', cleared: false }]
  })]
});
assert.notEqual(unapprovedEdgeScore.gate, 'approve');
assert.equal(unapprovedEdgeScore.edgeRunningExperiments, 1);
assert.ok(unapprovedEdgeScore.edgeViolations.some(item => item.includes('action-time approval')));
assert.ok(unapprovedEdgeScore.gateCaps.some(item => item.includes('without action-time approval')));
assert.ok(unapprovedEdgeScore.gateCaps.some(item => item.includes('prerequisites')));

const redEdgeScore = algorithm.calculateScores({
  ...strongInput,
  edgeExperiments: [edgeExperiment({ risk: 'Red' })]
});
assert.equal(redEdgeScore.gate, 'kill');
assert.ok(redEdgeScore.hardStops.some(item => item.includes('Red-risk')));

const overCapEdgeScore = algorithm.calculateScores({
  ...strongInput,
  edgeExperiments: [edgeExperiment({ actualSpend: 31, budgetCap: 30 })]
});
assert.equal(overCapEdgeScore.gate, 'kill');
assert.equal(overCapEdgeScore.edgeBudgetStatus, 'over-cap');
assert.ok(overCapEdgeScore.hardStops.some(item => item.includes('Edge Lab experiment exceeded')));

const missingResultEdge = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment({ resultSummary: '', evidenceUrl: '' })
]);
assert.equal(missingResultEdge.validatedCount, 0);
assert.equal(missingResultEdge.evidenceViolations, 1);
assert.equal(missingResultEdge.evidenceCoverage, 0);

// Imported decisions cannot convert planned work into completed proof.
const outOfSequenceDecision = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment({ status: 'planned', decision: 'adopt' })
]);
assert.equal(outOfSequenceDecision.completedCount, 0);
assert.equal(outOfSequenceDecision.validatedCount, 0);
assert.equal(outOfSequenceDecision.score, 0);
assert.equal(outOfSequenceDecision.evidenceViolations, 1);
assert.ok(outOfSequenceDecision.violations.some(item => item.includes('invalid until status is completed')));

// A claimed A-tier source is treated as frontier evidence until catalog provenance is verified.
const unverifiedTier = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment({ sourceProvenanceVerified: false })
]);
assert.equal(unverifiedTier.score, 75);
assert.equal(unverifiedTier.frontierSpendShare, 100);

// Active experiments need a real prerequisite contract, not vacuous empty-array truth.
const missingPrerequisites = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment({ prerequisites: [] })
]);
assert.equal(missingPrerequisites.validatedCount, 0);
assert.equal(missingPrerequisites.prerequisiteViolations, 1);

// Approval requires an audit timestamp; typing an approver name is not action-time proof.
const missingApprovalTimestamp = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment({ risk: 'Yellow', approvalStatus: 'approved', approvedBy: 'Mike', approvedAt: '' })
]);
assert.equal(missingApprovalTimestamp.validatedCount, 0);
assert.equal(missingApprovalTimestamp.approvalViolations, 1);

const missingCounselTimestamp = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment({
    risk: 'Orange',
    approvalStatus: 'approved',
    approvedBy: 'Mike',
    approvedAt: '2026-07-20T12:00:00Z',
    counselReviewed: true,
    counselReviewedAt: ''
  })
]);
assert.equal(missingCounselTimestamp.validatedCount, 0);
assert.equal(missingCounselTimestamp.approvalViolations, 1);

// Reusing one receipt across legacy and Edge records counts as one campaign proof.
const sharedReceiptScore = algorithm.calculateScores({
  ...strongInput,
  tactics: [{ id: 'legacy', status: 'approved', evidenceUrl: 'https://example.com/edge-result' }],
  edgeExperiments: [edgeExperiment()]
});
assert.equal(sharedReceiptScore.verifiedTactics, 1);
assert.notEqual(sharedReceiptScore.gate, 'approve');

// Duplicate records cannot manufacture repeated experiment proof.
const duplicateEdge = algorithm.calculateEdgeExperimentMetrics([
  edgeExperiment(),
  edgeExperiment({ evidenceUrl: 'https://example.com/another-result' })
]);
assert.equal(duplicateEdge.completedCount, 1);
assert.equal(duplicateEdge.validatedCount, 1);

console.log('drop-os-algorithm: ok');
