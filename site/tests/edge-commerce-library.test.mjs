import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoDir = path.resolve(siteDir, '..');
const registry = JSON.parse(await readFile(path.join(repoDir, 'research', 'commerce-intelligence', 'free-source-registry.json'), 'utf8'));
const catalogContext = { window: {} };
vm.createContext(catalogContext);
vm.runInContext(await readFile(path.join(siteDir, 'edge-commerce-catalog.js'), 'utf8'), catalogContext);
const tacticIds = new Set(catalogContext.window.VorgEdgeCommerce.TACTICS.map(tactic => tactic.id));

assert.equal(registry.schemaVersion, 1);
assert.match(registry.libraryVersion, /^VORG Free Commerce Library v/);
assert.match(registry.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
assert.ok(registry.truthBoundary.length >= 120);
assert.ok(registry.sources.length >= 60, 'source portfolio should cover at least 60 free sources');
assert.ok(registry.claims.length >= 25, 'claim library should contain at least 25 atomic claims');

const sourceIds = registry.sources.map(source => source.id);
assert.equal(new Set(sourceIds).size, sourceIds.length, 'source ids must be unique');
const sourceIdSet = new Set(sourceIds);
const allowedAccess = new Set(['open', 'open-limited', 'free-account', 'free-opt-in']);
const allowedRights = new Set(['public-domain', 'open-license', 'public-permitted', 'creator-provided-free', 'open-research']);
const allowedTiers = new Set(['A', 'B', 'C', 'F']);
const allowedRefresh = new Set(['weekly', 'monthly', 'quarterly', 'annual', 'static']);

registry.sources.forEach(source => {
  assert.match(source.id, /^S\d{3}$/);
  assert.ok(source.name && source.publisher && source.lens && source.sourceType);
  const parsedUrl = new URL(source.url);
  assert.equal(parsedUrl.protocol, 'https:', `${source.id} must use https`);
  assert.ok(allowedAccess.has(source.access), `${source.id} has invalid access`);
  assert.ok(allowedRights.has(source.rightsBasis), `${source.id} has invalid rights basis`);
  assert.ok(allowedTiers.has(source.defaultTier), `${source.id} has invalid tier`);
  assert.ok(allowedRefresh.has(source.refresh), `${source.id} has invalid refresh cadence`);
  assert.ok(source.refresh && source.ingestionMode && source.note);
  assert.ok(Array.isArray(source.feedsTactics));
  source.feedsTactics.forEach(id => assert.ok(tacticIds.has(id), `${source.id} maps to missing tactic ${id}`));
  if (source.ingestionMode === 'full-text-allowed') {
    assert.equal(source.rightsBasis, 'public-domain', `${source.id} full text must be public domain`);
  }
  if (source.ingestionMode === 'full-text-license') {
    assert.equal(source.rightsBasis, 'open-license', `${source.id} licensed full text must have an explicit open licence`);
  }
});

assert.ok(registry.sources.some(source => source.sourceType === 'open_library'), 'open-library discovery routes are required');
assert.ok(registry.sources.some(source => source.ingestionMode === 'full-text-license'), 'open-licensed full-text sources are required');
const openStax = registry.sources.find(source => source.id === 'S075');
assert.notEqual(openStax.ingestionMode, 'full-text-license', 'OpenStax AI restriction must block full-text ingestion');
assert.match(openStax.note, /prohibits LLM or generative-AI ingestion/i);
const nonCommercialText = registry.sources.find(source => source.id === 'S077');
assert.notEqual(nonCommercialText.ingestionMode, 'full-text-license', 'noncommercial licence must not imply commercial full-text reuse');
assert.match(nonCommercialText.note, /VORG is commercial/i);

const claimIds = registry.claims.map(claim => claim.id);
assert.equal(new Set(claimIds).size, claimIds.length, 'claim ids must be unique');
const claimFingerprints = registry.claims.map(claim => [claim.claim, claim.mechanism]
  .join('|')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim());
assert.equal(new Set(claimFingerprints).size, claimFingerprints.length, 'atomic claim mechanisms must be deduplicated');

registry.claims.forEach(claim => {
  assert.match(claim.id, /^EC-\d{4}-\d{3}$/);
  assert.ok(claim.title && claim.claim && claim.mechanism && claim.conditions);
  assert.ok(claim.vorgMutation && claim.funnelStage && claim.metric);
  assert.ok(claim.successThreshold && claim.killCondition);
  assert.ok(allowedTiers.has(claim.evidenceTier));
  assert.ok(Number.isFinite(claim.confidence) && claim.confidence >= 0 && claim.confidence <= 100);
  assert.ok(['Green', 'Yellow', 'Orange', 'Red'].includes(claim.risk));
  assert.ok(Array.isArray(claim.sourceIds) && claim.sourceIds.length > 0);
  assert.ok(Array.isArray(claim.feedsTactics) && claim.feedsTactics.length > 0);
  claim.sourceIds.forEach(id => assert.ok(sourceIdSet.has(id), `${claim.id} maps to missing source ${id}`));
  claim.feedsTactics.forEach(id => assert.ok(tacticIds.has(id), `${claim.id} maps to missing tactic ${id}`));
});

const bundleContext = { window: {} };
vm.createContext(bundleContext);
vm.runInContext(await readFile(path.join(siteDir, 'edge-commerce-library.js'), 'utf8'), bundleContext);
assert.equal(bundleContext.window.VorgCommerceLibrary.sources.length, registry.sources.length);
assert.equal(bundleContext.window.VorgCommerceLibrary.claims.length, registry.claims.length);
assert.deepEqual(
  JSON.parse(JSON.stringify(bundleContext.window.VorgCommerceLibrary)),
  registry,
  'generated browser bundle must exactly match the canonical registry'
);
assert.ok(Object.isFrozen(bundleContext.window.VorgCommerceLibrary));
assert.ok(Object.isFrozen(bundleContext.window.VorgCommerceLibrary.sources));
assert.ok(Object.isFrozen(bundleContext.window.VorgCommerceLibrary.sources[0]));
assert.ok(Object.isFrozen(bundleContext.window.VorgCommerceLibrary.claims[0].sourceIds));

console.log(`edge-commerce-library: ${registry.sources.length} sources, ${registry.claims.length} claims, ok`);
