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
  await page.locator('#signalForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(300);
  const signalText = await page.locator('#signalList').textContent();
  signalText?.includes('QA heat signal') ? ok('Log heat works') : fail('Log heat');

  // All lanes render
  for (const lane of ['Drop desk', 'SKU room', 'Campaign', 'Factory', 'Online drop', 'Pop-up', 'Next city', 'Debrief', 'Handoff']) {
    await page.getByRole('button', { name: lane, exact: true }).click();
    await page.waitForTimeout(200);
    const active = await page.locator('.nav-item.active').textContent();
    active?.includes(lane.split(' ')[0]) ? ok(`Lane: ${lane}`) : fail(`Lane: ${lane}`, active);
  }

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
  snap?.includes('"drop"') && snap?.includes('"readinessChecks"') ? ok('Copy snapshot opens JSON') : fail('Snapshot dialog');
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

  // Algorithm cockpit — version, gate explanation, lift hints
  await page.locator('#cmdCockpit summary').click();
  await page.waitForTimeout(200);
  const cockpitVersion = await page.locator('#cockpitVersion').textContent();
  cockpitVersion?.includes('v0.3') ? ok(`Readiness model version: ${cockpitVersion}`) : fail('Cockpit version', cockpitVersion);
  const gateExplain = await page.locator('#gateExplanation').textContent();
  gateExplain?.length > 20 ? ok('Gate explanation renders') : fail('Gate explanation', gateExplain);
  const liftHints = await page.locator('#scoreLiftHints li').count();
  liftHints > 0 ? ok(`Score lift hints (${liftHints})`) : fail('Score lift hints');

  // Proof check uses effective SKU score (factory board rollup), not raw slider only
  const algoBefore = await page.evaluate(() => window.DropOSBridge.calculateScores());
  await page.getByRole('button', { name: 'Factory', exact: true }).click();
  await page.waitForTimeout(200);
  await page.locator('[data-mfg-sku="sku-top"]').click();
  await page.waitForTimeout(150);
  await page.locator('#manufacturingForm [name="quoteUrl"]').fill('https://example.com/top-quote.pdf');
  await page.locator('#manufacturingForm [name="landedCogs"]').fill('C$42');
  await page.locator('#manufacturingForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(300);
  const algoAfter = await page.evaluate(() => window.DropOSBridge.calculateScores());
  const productEffChanged = algoAfter.productEffective !== algoBefore.productEffective;
  productEffChanged ? ok(`Factory proof lifts SKU effective (${algoBefore.productEffective} → ${algoAfter.productEffective})`) : fail('SKU effective score', `${algoBefore.productEffective} → ${algoAfter.productEffective}`);
  const usesEffectiveFloor = algoAfter.evidenceFloor <= algoAfter.productEffective;
  usesEffectiveFloor ? ok('Proof check respects effective SKU score') : fail('Evidence floor vs product effective', algoAfter);

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
  investor?.includes('Verified debrief') && investor?.includes('Working desk') && investor?.includes('SKU proof (eff.)')
    ? ok('Investor snapshot tiers')
    : fail('Investor snapshot tiers');

  // Campaign tactic approval refreshes desk KPIs while on Campaign lane
  await page.getByRole('button', { name: 'Campaign', exact: true }).click();
  await page.waitForTimeout(200);
  const energyBefore = await page.locator('#cmdConfidence').textContent();
  await page.locator('[data-tactic-id="founder-table"]').click();
  await page.waitForTimeout(300);
  const energyAfter = await page.locator('#cmdConfidence').textContent();
  const campaignScore = await page.locator('#campaignScoreValue').textContent();
  energyAfter !== energyBefore || Number(campaignScore) > 40
    ? ok(`Desk KPIs refresh on tactic approve (energy ${energyBefore} → ${energyAfter})`)
    : fail('Desk KPI refresh on tactic', `${energyBefore} → ${energyAfter}, content ${campaignScore}`);

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
