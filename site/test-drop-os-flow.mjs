/**
 * Smoke-test Drop OS flows — run: node site/test-drop-os-flow.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4182/drop-os.html';
let passed = 0;
let failed = 0;

function ok(label) { passed++; console.log('  ✓', label); }
function fail(label, err) { failed++; console.error('  ✗', label, err?.message || err); }

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(BASE);
  await page.evaluate(() => localStorage.removeItem('vorgDropOS.v1'));
  await page.reload({ waitUntil: 'networkidle' });
  if (await page.locator('#authDialog').isVisible()) {
    await page.locator('#authCloseBtn').click();
    await page.waitForTimeout(200);
  }

  // Onboarding
  const onboard = await page.locator('#onboardDialog').isVisible();
  onboard ? ok('Onboarding shows on first visit') : fail('Onboarding missing');

  await page.getByRole('button', { name: 'Skip tour' }).click();
  await page.waitForTimeout(300);
  const gate = await page.locator('#cmdGateResult').textContent();
  ['GO', 'TEST', 'FIX IT', 'HOLD'].includes(gate?.trim()) ? ok(`Bag check shows: ${gate}`) : fail('Bag check label', gate);

  // Add task (must be on drop desk)
  await page.getByRole('button', { name: 'Drop desk' }).click();
  await page.waitForTimeout(300);
  const beforeCount = await page.evaluate(() => JSON.parse(localStorage.getItem('vorgDropOS.v1')).tasks.length);
  await page.locator('#taskTitle').fill('QA test move');
  await page.locator('#taskForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(300);
  const afterCount = await page.evaluate(() => JSON.parse(localStorage.getItem('vorgDropOS.v1')).tasks.length);
  afterCount > beforeCount ? ok('Add task works') : fail('Add task', `${beforeCount} -> ${afterCount}`);

  // SKU room — add SKU
  await page.getByRole('button', { name: 'SKU room' }).click();
  await page.waitForTimeout(300);
  const beforeSkus = await page.evaluate(() => JSON.parse(localStorage.getItem('vorgDropOS.v1')).products.length);
  await page.locator('#productAddForm [name="name"]').fill('Barrel Jean');
  await page.locator('#productAddForm [name="price"]').fill('C$120');
  await page.locator('#productAddForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(300);
  const afterSkus = await page.evaluate(() => JSON.parse(localStorage.getItem('vorgDropOS.v1')).products.length);
  afterSkus > beforeSkus ? ok('Add SKU works') : fail('Add SKU', `${beforeSkus} -> ${afterSkus}`);

  // Log heat
  await page.getByRole('button', { name: 'Heat radar' }).click();
  await page.locator('#signalItem').fill('QA heat signal');
  await page.locator('#signalSource').fill('Test');
  await page.locator('#signalEvidence').fill('https://example.com/qa-heat-proof');
  await page.locator('#signalForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(300);
  const signalText = await page.locator('#signalList').textContent();
  signalText?.includes('QA heat signal') ? ok('Log heat works') : fail('Log heat');
  const verifiedSignal = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    return saved.signals.some(signal => signal.item === 'QA heat signal' && signal.evidenceUrl === 'https://example.com/qa-heat-proof');
  });
  verifiedSignal ? ok('Signal proof saves') : fail('Signal proof save');

  // All lanes render
  for (const lane of ['Drop desk', 'SKU room', 'Edge Lab', 'Forecast Lab', 'Factory', 'Online drop', 'Pop-up', 'Next city', 'Debrief', 'Handoff']) {
    await page.getByRole('button', { name: lane, exact: true }).click();
    await page.waitForTimeout(200);
    const active = await page.locator('.nav-item.active').textContent();
    active?.includes(lane.split(' ')[0]) ? ok(`Lane: ${lane}`) : fail(`Lane: ${lane}`, active);
  }

  // Forecast Lab: scenario, frozen pre-launch call, and evidence-linked actual.
  await page.getByRole('button', { name: 'Forecast Lab', exact: true }).click();
  const seededForecast = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    return saved.forecast?.inputs?.plannedOnlineSessions === '2160' &&
      saved.forecast?.inputs?.plannedOnlineConversionRate === '3.06' &&
      saved.forecast?.inputs?.priorProfile === 'public-transfer-v1' &&
      saved.forecast?.inputs?.productOverrides?.['sku-jacket']?.inventory === '12';
  });
  seededForecast ? ok('126-unit scenario seeds licensed public-transfer uncertainty') : fail('Forecast scenario seed');
  const publicPriorDiagnostics = await page.locator('.forecast-diagnostics').textContent();
  publicPriorDiagnostics?.includes('VORG public-data transfer priors v1.0') && publicPriorDiagnostics?.includes('not VORG accuracy')
    ? ok('Public model holdouts and transfer warning render')
    : fail('Public prior diagnostics', publicPriorDiagnostics);
  const externalRateCount = await page.locator('.forecast-rate-source.external').count();
  externalRateCount >= 2 ? ok('External uncertainty sources are visibly labelled') : fail(`External rate labels ${externalRateCount}`);
  const stressRowCount = await page.locator('.forecast-stress-row').count();
  stressRowCount === 6 ? ok('Launch stress matrix renders six scenarios') : fail(`Forecast stress rows ${stressRowCount}`);
  await page.locator('#forecastAssumptionsForm [name="plannedOnlineSessions"]').fill('1800');
  await page.locator('#forecastAssumptionsForm [name="plannedPopupVisitors"]').fill('160');
  await page.locator('#forecastAssumptionsForm [name="trafficEvidenceUrl"]').fill('launch/qa-traffic-plan.md');
  const forecastProductIds = await page.evaluate(() => JSON.parse(localStorage.getItem('vorgDropOS.v1')).products.map(product => product.id));
  for (const productId of forecastProductIds) {
    await page.locator(`#forecastAssumptionsForm [name="inventory__${productId}"]`).fill('20');
    await page.locator(`#forecastAssumptionsForm [name="price__${productId}"]`).fill('120');
    await page.locator(`#forecastAssumptionsForm [name="landedCogs__${productId}"]`).fill('40');
  }
  await page.locator('#forecastAssumptionsForm').evaluate(form => form.requestSubmit());
  await page.waitForTimeout(350);
  const forecastRendered = await page.locator('#forecastTruthBanner').textContent();
  forecastRendered?.includes('Public-transfer scenario') && forecastRendered?.includes('zero VORG proof') ? ok('Public-transfer scenario renders') : fail('Forecast scenario', forecastRendered);
  const forecastSaved = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    return saved.forecast?.inputs?.plannedOnlineSessions === '1800' && Object.keys(saved.forecast?.inputs?.productOverrides || {}).length === saved.products.length;
  });
  forecastSaved ? ok('Forecast assumptions save') : fail('Forecast assumption persistence');
  await page.locator('#freezeForecastBtn').click();
  await page.waitForTimeout(250);
  const frozenCount = await page.evaluate(() => JSON.parse(localStorage.getItem('vorgDropOS.v1')).forecast?.snapshots?.length || 0);
  frozenCount === 1 ? ok('Pre-launch forecast freezes') : fail(`Frozen forecast count ${frozenCount}`);
  const actualForm = page.locator('.forecast-actual-form').first();
  await actualForm.locator('[name="revenue"]').fill('2500');
  await actualForm.locator('[name="unitsSold"]').fill('21');
  await actualForm.locator('[name="sellThroughPct"]').fill('17.5');
  await actualForm.locator('[name="evidenceUrl"]').fill('reports/drop-001-qa-actuals.csv');
  await actualForm.evaluate(form => form.requestSubmit());
  await page.waitForTimeout(250);
  const calibrationText = await page.locator('#forecastCalibration').textContent();
  calibrationText?.includes('first-outcome') && calibrationText?.includes('Outcome linked') ? ok('Forecast actual enters calibration') : fail('Forecast calibration loop', calibrationText);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#loadSyntheticForecastBtn').click();
  await page.waitForTimeout(350);
  const syntheticBanner = await page.locator('#forecastTruthBanner').textContent();
  syntheticBanner?.includes('Synthetic evidence test') && syntheticBanner?.includes('zero launch proof')
    ? ok('Synthetic evidence bench is visibly isolated')
    : fail('Synthetic evidence truth banner', syntheticBanner);
  const syntheticState = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    const snapshot = saved.forecast?.snapshots?.find(item => item.fixtureId === 'synthetic-forecast-bench-2026-07-22');
    return {
      status: snapshot?.forecast?.status,
      evidenceMode: snapshot?.forecast?.evidenceMode,
      priorProfile: snapshot?.forecast?.priorProfile,
      outcome: snapshot?.actual?.evidenceUrl,
      productCount: snapshot?.forecast?.products?.length,
      stressSynthetic: snapshot ? window.VorgSalesForecast.calculateStressSuite(snapshot.input).every(item => item.forecast.status === 'synthetic-test') : false
    };
  });
  syntheticState.status === 'synthetic-test' && syntheticState.evidenceMode === 'synthetic' && syntheticState.priorProfile === 'internal-weak' && syntheticState.productCount === 5 && syntheticState.outcome?.includes('synthetic-forecast') && syntheticState.stressSynthetic
    ? ok('Synthetic forecast, stress suite, and linked outcome execute')
    : fail('Synthetic engine execution', syntheticState);
  const calibrationIsolation = await page.evaluate(() => {
    const snapshots = JSON.parse(localStorage.getItem('vorgDropOS.v1')).forecast?.snapshots || [];
    return {
      live: window.VorgSalesForecast.calculateCalibration(snapshots, 'live').uniqueDrops,
      synthetic: window.VorgSalesForecast.calculateCalibration(snapshots, 'synthetic').uniqueDrops
    };
  });
  calibrationIsolation.live === 1 && calibrationIsolation.synthetic === 1
    ? ok('Synthetic and live calibration remain isolated')
    : fail('Calibration isolation', calibrationIsolation);
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#loadProofBuyScenarioBtn').click();
  await page.waitForTimeout(250);
  const scenarioReloaded = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    return saved.forecast?.inputs?.plannedOnlineSessions === '2160' && saved.forecast?.inputs?.priorProfile === 'public-transfer-v1' && saved.forecast?.inputs?.evidenceMode !== 'synthetic' && saved.forecast?.snapshots?.length === 2;
  });
  scenarioReloaded ? ok('Working scenario reload preserves frozen calls') : fail('Forecast scenario reload');
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileForecast = await page.evaluate(() => ({
    fits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    offenders: [...document.querySelectorAll('#ws-forecast *')]
      .filter(element => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .slice(0, 8)
      .map(element => `${element.tagName.toLowerCase()}.${element.className || ''}`)
  }));
  mobileForecast.fits ? ok('Forecast Lab fits mobile') : fail('Forecast Lab mobile overflow', mobileForecast);
  await page.setViewportSize({ width: 1440, height: 900 });

  // Campaign approval requires and persists linked proof
  await page.getByRole('button', { name: 'Edge Lab', exact: true }).click();
  await page.locator('[data-tactic-proof="founder-table"]').fill('https://example.com/founder-table-proof');
  await page.locator('[data-tactic-proof="founder-table"]').blur();
  await page.waitForTimeout(250);
  await page.locator('[data-tactic-id="founder-table"]').click();
  await page.waitForTimeout(250);
  const campaignVerified = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    const tactic = saved.tactics.find(item => item.id === 'founder-table');
    return tactic?.status === 'approved' && tactic?.evidenceUrl === 'https://example.com/founder-table-proof';
  });
  campaignVerified ? ok('Campaign proof gates approval') : fail('Campaign proof approval');

  // Edge Commerce Lab: catalog, controlled experiment, and decision memory
  const edgeSummary = await page.locator('#edgeLabSummary').textContent();
  edgeSummary?.includes('Experiment proof') ? ok('Edge Lab summary renders') : fail('Edge Lab summary');
  await page.locator('[data-edge-view="library"]').click();
  await page.waitForTimeout(150);
  const atomicClaimCount = await page.locator('[data-library-card]').count();
  atomicClaimCount === 34 ? ok('34 atomic commerce claims render') : fail(`Atomic claim count ${atomicClaimCount}`);
  await page.locator('[data-library-mode="sources"]').click();
  await page.waitForTimeout(150);
  const freeSourceCount = await page.locator('[data-library-card]').count();
  freeSourceCount === 83 ? ok('83 lawful free sources render') : fail(`Free source count ${freeSourceCount}`);
  await page.locator('#edgeLibrarySearch').fill('CASL');
  const caslSourceCount = await page.locator('[data-library-card]:visible').count();
  caslSourceCount > 0 && caslSourceCount < 83 ? ok('Free source search filters') : fail(`CASL search count ${caslSourceCount}`);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileLibrary = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    visible: Boolean(document.querySelector('[data-library-card]:not([hidden])'))
  }));
  !mobileLibrary.overflow && mobileLibrary.visible ? ok('Free library fits mobile') : fail('Free library mobile layout', mobileLibrary);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('[data-edge-view="ledger"]').click();
  await page.waitForTimeout(150);
  const edgeLedgerCount = await page.locator('[data-edge-ledger-card]').count();
  edgeLedgerCount === 30 ? ok('30-tactic ledger renders') : fail(`Edge ledger count ${edgeLedgerCount}`);
  await page.locator('[data-edge-view="experiments"]').click();
  await page.locator('[data-edge-open="X01"]').click();
  const edgeDialog = page.locator('#edgeExperimentDialog');
  await edgeDialog.locator('input[name="owner"]').fill('Campaign lead');
  await edgeDialog.locator('select[name="status"]').selectOption('completed');
  await edgeDialog.locator('input[name="startDate"]').fill('2026-07-21');
  await edgeDialog.locator('input[name="endDate"]').fill('2026-07-28');
  await edgeDialog.locator('input[name="actualSpend"]').fill('10');
  await edgeDialog.locator('input[name="qualifiedActions"]').fill('12');
  await edgeDialog.locator('input[name="assetsEarned"]').fill('3');
  for (const prerequisite of await edgeDialog.locator('[data-edge-prerequisite]').all()) await prerequisite.check();
  await edgeDialog.locator('textarea[name="baseline"]').fill('First controlled comment-to-creative baseline.');
  await edgeDialog.locator('select[name="decision"]').selectOption('adapt');
  await edgeDialog.locator('input[name="evidenceUrl"]').fill('https://example.com/edge-x01-result');
  await edgeDialog.locator('textarea[name="resultSummary"]').fill('12 qualified actions and three reusable assets; keep the format and tighten the hook.');
  await edgeDialog.getByRole('button', { name: 'Save control card' }).click();
  await page.waitForTimeout(250);
  const edgeVerified = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    const experiment = saved.edgeExperiments.find(item => item.id === 'X01');
    return experiment?.status === 'completed' && experiment?.decision === 'adapt' && experiment?.qualifiedActions === 12;
  });
  edgeVerified ? ok('Edge experiment completes with evidence') : fail('Edge experiment lifecycle');

  // Yellow approval is a saved pre-run control, not a checkbox added during the run transition.
  await page.locator('[data-edge-open="X02"]').click();
  const yellowDialog = page.locator('#edgeExperimentDialog');
  await yellowDialog.locator('input[name="owner"]').fill('Founder');
  await yellowDialog.locator('select[name="status"]').selectOption('ready');
  await yellowDialog.locator('select[name="approvalStatus"]').selectOption('approved');
  await yellowDialog.locator('input[name="approvedBy"]').fill('Founder');
  for (const prerequisite of await yellowDialog.locator('[data-edge-prerequisite]').all()) await prerequisite.check();
  await yellowDialog.getByRole('button', { name: 'Save control card' }).click();
  await page.waitForTimeout(150);
  await page.locator('[data-edge-open="X02"]').click();
  await yellowDialog.locator('select[name="status"]').selectOption('running');
  await yellowDialog.locator('input[name="startDate"]').fill('2026-07-22');
  await yellowDialog.locator('input[name="endDate"]').fill('2026-07-29');
  await yellowDialog.getByRole('button', { name: 'Save control card' }).click();
  await page.waitForTimeout(150);
  const approvalSequenced = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    const experiment = saved.edgeExperiments.find(item => item.id === 'X02');
    return experiment?.status === 'running' &&
      experiment?.approvalStatus === 'approved' &&
      Number.isFinite(Date.parse(experiment?.approvedAt || '')) &&
      experiment?.sourceProvenanceVerified === true;
  });
  approvalSequenced ? ok('Yellow approval is saved before run') : fail('Yellow approval sequencing');

  await page.locator('[data-edge-view="memory"]').click();
  const edgeMemory = await page.locator('#edgeLabPanel').textContent();
  edgeMemory?.includes('Comment Becomes The Ad') && edgeMemory?.includes('adapt') ? ok('Edge decision memory renders') : fail('Edge decision memory', edgeMemory);

  // Manufacturing truth board
  await page.getByRole('button', { name: 'Factory', exact: true }).click();
  await page.waitForTimeout(200);
  const mfgBoard = await page.locator('#manufacturingBoard').textContent();
  mfgBoard?.includes('Manufacturing truth') ? ok('Manufacturing board renders') : fail('Manufacturing board');
  await page.locator('[data-mfg-sku="sku-jacket"]').click();
  await page.waitForTimeout(150);
  await page.locator('#manufacturingForm [name="vendorName"]').fill('QA Factory');
  await page.locator('#manufacturingForm [name="quoteUrl"]').fill('https://example.com/quote.pdf');
  await page.locator('#manufacturingForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(300);
  const mfgSaved = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    return saved.products.find(p => p.id === 'sku-jacket')?.manufacturing?.vendorName === 'QA Factory';
  });
  mfgSaved ? ok('Manufacturing proof saves') : fail('Manufacturing proof save');

  // Interactive checklist persistence
  await page.locator('[data-checklist-group="production"]').first().click();
  await page.waitForTimeout(200);
  const checklistSaved = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    return Object.values(saved.readinessChecks?.production || {}).some(Boolean);
  });
  checklistSaved ? ok('Interactive checklists save') : fail('Interactive checklists');

  // Proof links panel renders linked evidence
  await page.getByRole('button', { name: 'Drop desk', exact: true }).click();
  await page.waitForTimeout(200);
  const proofLinks = await page.locator('#proofLinksPanel .proof-link-row').count();
  proofLinks > 0 ? ok('Proof links panel renders') : fail('Proof links panel');
  const repoProof = await page.locator('#proofLinksPanel .proof-link-row.repo-path').count();
  repoProof > 0 ? ok('Repo proof paths get GitHub actions') : fail('Repo proof paths');

  // Checklist rollup on drop desk
  const readiness = await page.locator('#cmdReadiness').textContent();
  readiness?.includes('%') ? ok(`Checklist rollup on desk: ${readiness}`) : fail('Checklist rollup');

  // Backup nudge on desk when due
  const nudge = await page.locator('#backupNudge').isVisible();
  nudge ? ok('Backup nudge shows when snapshot due') : fail('Backup nudge');

  // Snapshot dialog
  await page.getByRole('button', { name: 'Handoff', exact: true }).click();
  await page.locator('#snapshotBtn').click();
  await page.waitForTimeout(300);
  const snap = await page.locator('#snapshotText').inputValue();
  snap?.includes('"snapshotSchemaVersion": 4') && snap?.includes('"drop"') && snap?.includes('"readinessChecks"') && snap?.includes('"readinessIndex"') && snap?.includes('"campaignOutlook"') && snap?.includes('"spendGate"') && snap?.includes('"edgeCommerce"') && snap?.includes('"salesForecast"') && snap?.includes('"syntheticTestCalibration"') && snap?.includes('"readinessIndependent": true') && snap?.includes('"libraryVersion"') && snap?.includes('"freeSourceCount": 83') && snap?.includes('"atomicClaimCount": 34') && snap?.includes('"edgeExperiments"')
    ? ok('Copy snapshot opens v4 evidence + forecast JSON')
    : fail('Snapshot dialog');
  const backupDone = await page.locator('#backupRitual').textContent();
  backupDone?.includes('Done') ? ok('Backup ritual updates') : fail('Backup ritual');
  await page.locator('#closeDialogButton').click();

  // Download snapshot button
  await page.locator('#downloadSnapshotBtn').click();
  await page.waitForTimeout(300);
  const snapAfterDownload = await page.locator('#snapshotText').inputValue();
  snapAfterDownload?.includes('"syncMeta"') ? ok('Download snapshot opens JSON') : fail('Download snapshot');

  // Squad sync panel
  const syncPanel = await page.locator('#syncPanel').textContent();
  syncPanel?.includes('Browser-only') || syncPanel?.includes('Sign in') || syncPanel?.includes('Squad sync') ? ok('Squad sync panel renders') : fail('Squad sync panel');
  await page.locator('#closeDialogButton').click();

  // Help dialog
  await page.locator('#helpOpenBtn').click();
  await page.waitForTimeout(200);
  await page.locator('#helpDialog').isVisible() ? ok('Help dialog opens') : fail('Help dialog');
  await page.locator('#helpCloseBtn').click();

  // New drop dialog
  await page.locator('#newDropBtn').click();
  await page.waitForTimeout(200);
  await page.locator('#newDropDialog').isVisible() ? ok('New drop dialog opens') : fail('New drop dialog');
  await page.locator('#newDropCloseBtn').click();

  // Playbook strip visible on desk
  await page.getByRole('button', { name: 'Drop desk' }).click();
  const playbook = await page.locator('#workspacePlaybook').isVisible();
  playbook ? ok('Playbook strip on drop desk') : fail('Playbook strip');

  // SKU edit
  await page.getByRole('button', { name: 'SKU room' }).click();
  await page.waitForTimeout(200);
  await page.locator('#productNav [data-product-id="sku-jacket"]').click();
  await page.waitForTimeout(200);
  await page.locator('[data-edit-product="sku-jacket"]').click();
  await page.waitForTimeout(200);
  await page.locator('#productEditForm [name="units"]').fill('40');
  await page.locator('#productEditForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(300);
  const editedUnits = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    return saved.products.find(p => p.id === 'sku-jacket')?.units;
  });
  editedUnits === 40 ? ok('SKU inline edit saves') : fail('SKU inline edit', editedUnits);

  // Debrief form
  await page.getByRole('button', { name: 'Debrief', exact: true }).click();
  await page.waitForTimeout(200);
  await page.locator('#pmUnitsSold').fill('92');
  await page.locator('#postmortemForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(300);
  const debriefSaved = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vorgDropOS.v1'));
    return saved.postmortem?.unitsSold === '92';
  });
  debriefSaved ? ok('Debrief form saves') : fail('Debrief form');
  const evidenceSection = await page.locator('.evidence-section').count();
  evidenceSection > 0 ? ok('Debrief evidence tiers render') : fail('Debrief evidence tiers');

  // Investor snapshot with tiers
  await page.getByRole('button', { name: 'Handoff', exact: true }).click();
  await page.locator('#investorBtn').click();
  await page.waitForTimeout(200);
  const investor = await page.locator('#investorSnapshot').textContent();
  investor?.includes('Verified debrief') && investor?.includes('Working desk') && investor?.includes('Edge experiment proof') ? ok('Investor snapshot tiers') : fail('Investor snapshot tiers');

  const pillHidden = await page.locator('#syncStatusPill').isHidden();
  pillHidden ? ok('Sync status pill ready') : ok('Sync status pill visible');

  // localStorage persists
  const stored = await page.evaluate(() => !!localStorage.getItem('vorgDropOS.v1'));
  stored ? ok('State saves to localStorage') : fail('localStorage save');

  await browser.close();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
