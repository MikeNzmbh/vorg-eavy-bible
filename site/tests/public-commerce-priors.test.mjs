import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(here, '..', '..', 'research', 'commerce-intelligence', 'public-data-model', 'public-commerce-priors.json');
const browserPath = join(here, '..', 'public-commerce-priors.js');
const artifact = JSON.parse(readFileSync(jsonPath, 'utf8'));
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(readFileSync(browserPath, 'utf8'), sandbox, { filename: browserPath });
const browserArtifact = sandbox.VorgPublicCommercePriors;

assert.ok(browserArtifact, 'browser prior artifact exists');
assert.equal(JSON.stringify(browserArtifact), JSON.stringify(artifact), 'browser and canonical prior artifacts match');
assert.equal(Object.isFrozen(browserArtifact), true, 'browser prior artifact is frozen');
assert.equal(Object.isFrozen(browserArtifact.engineProfile), true, 'browser prior artifact is deeply frozen');
assert.equal(artifact.profileId, 'public-transfer-v1');
assert.equal(artifact.truthClass, 'external-public-transfer');
assert.equal(artifact.status, 'challenge-prior');
assert.equal(artifact.sources.length, 3);
assert.ok(artifact.sources.every(source => source.license === 'CC BY 4.0'));
assert.ok(artifact.sources.every(source => source.url.startsWith('https://archive.ics.uci.edu/')));
assert.ok(artifact.sources.every(source => source.archivePath.startsWith('raw/') && source.dataPath.startsWith('raw/')), 'artifact paths are repo-relative');
assert.ok(artifact.sources.every(source => !/^[A-Za-z]:/.test(source.archivePath) && !/^[A-Za-z]:/.test(source.dataPath)), 'artifact does not leak a machine-specific absolute path');

assert.equal(artifact.sessionPurchaseModel.rows, 12330);
assert.equal(artifact.sessionPurchaseModel.positiveSessions, 1908);
assert.ok(!artifact.sessionPurchaseModel.model.features.includes('PageValues'), 'transaction-derived PageValues leakage is excluded');
assert.ok(artifact.sessionPurchaseModel.randomHoldout.auc > 0.7);
assert.ok(artifact.sessionPurchaseModel.randomHoldout.brier < artifact.sessionPurchaseModel.randomHoldout.baselineBrier);
assert.ok(artifact.sessionPurchaseModel.blockedMonthHoldout.auc > 0.6);
assert.ok(artifact.sessionPurchaseModel.blockedMonthHoldout.brier < artifact.sessionPurchaseModel.blockedMonthHoldout.baselineBrier);

assert.equal(artifact.transactionModel.rows, 541909);
assert.equal(artifact.transactionModel.unitsPerOrder.adoption, 'rejected', 'wholesale-heavy basket level cannot transfer into VORG');
assert.equal(artifact.clothingClickstream.rows, 165474);
assert.equal(artifact.clothingClickstream.salesTrainingEligibility, 'rejected', 'unlabelled clothing clicks cannot train sales');
assert.ok(artifact.engineProfile.directConversionStrength >= 4 && artifact.engineProfile.directConversionStrength <= 12);
assert.ok(artifact.engineProfile.refundStrength >= 4 && artifact.engineProfile.refundStrength <= 12);
assert.match(artifact.engineProfile.conversionCenterPolicy, /VORG planning rate/);
assert.ok(artifact.transferLimits.some(limit => limit.includes('zero') || limit.includes('cannot')));

console.log('public-commerce-priors: licensed sources, leakage controls, transfer gates, ok');
