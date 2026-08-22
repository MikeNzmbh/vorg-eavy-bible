/**
 * Capture Drop OS guide screenshots — run from repo root:
 *   node site/capture-guide-screenshots.mjs
 *   node site/capture-guide-screenshots.mjs --tail-only
 *   node site/capture-guide-screenshots.mjs --readiness-only
 * Requires: npx playwright (auto-installs chromium on first run)
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'assets', 'guide');
const BASE = 'http://localhost:4182/drop-os.html';
const TAIL_ONLY = process.argv.includes('--tail-only');
const READINESS_ONLY = process.argv.includes('--readiness-only');
const EDGE_ONLY = process.argv.includes('--edge-only');

async function shot(page, name, opts = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, ...opts });
  console.log('  ✓', name);
}

async function clickNav(page, label) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.waitForTimeout(400);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(15000);

  await page.goto(BASE);
  await page.evaluate(() => localStorage.removeItem('vorgDropOS.v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  if (EDGE_ONLY) {
    await page.getByRole('button', { name: 'Skip tour' }).click();
    await clickNav(page, 'Edge Lab');
    await shot(page, '09-campaign');
    await page.locator('[data-edge-view="library"]').click();
    await page.waitForTimeout(300);
    await shot(page, '09b-free-library');
    await browser.close();
    console.log('\nDone — Edge Commerce Lab screenshots in site/assets/guide/');
    return;
  }

  if (READINESS_ONLY) {
    await page.getByRole('button', { name: 'Skip tour' }).click();
    await clickNav(page, 'Drop desk');
    await page.locator('#cmdCockpit').evaluate(element => {
      element.open = true;
      element.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(300);
    await shot(page, '19-readiness-model');
    await browser.close();
    console.log('\nDone — readiness screenshot in site/assets/guide/');
    return;
  }

  if (TAIL_ONLY) {
    await page.getByRole('button', { name: 'Skip tour' }).click();
    await clickNav(page, 'Handoff');
    await shot(page, '15-handoff');
    await page.locator('#snapshotBtn').click();
    await page.waitForTimeout(400);
    await shot(page, '16-snapshot-dialog');
    await page.locator('#snapshotDialog').evaluate(dialog => dialog.close());
    await page.locator('#helpOpenBtn').click();
    await page.waitForTimeout(400);
    await shot(page, '17-help-dialog');
    await page.locator('#helpDialog').evaluate(dialog => dialog.close());
    await clickNav(page, 'Handoff');
    await page.locator('#newDropBtn').click();
    await page.waitForTimeout(400);
    await shot(page, '18-new-drop-dialog');
    await page.locator('#newDropDialog').evaluate(dialog => dialog.close());
    await clickNav(page, 'Drop desk');
    await page.locator('#cmdCockpit').evaluate(element => { element.open = true; });
    await page.waitForTimeout(300);
    await page.locator('#cmdCockpit').evaluate(element => element.scrollIntoView({ block: 'start' }));
    await shot(page, '19-readiness-model');
    await browser.close();
    console.log('\nDone — tail screenshots in site/assets/guide/');
    return;
  }

  // 01 — onboarding
  await shot(page, '01-onboarding');

  // 02 — drop desk (skip tour)
  await page.getByRole('button', { name: 'Skip tour' }).click();
  await page.waitForTimeout(500);
  await shot(page, '02-drop-desk');

  // 03 — playbook visible on desk
  await shot(page, '03-playbook-strip', { clip: { x: 252, y: 72, width: 1188, height: 72 } });

  // 04 — milestone workbench (timeline + detail)
  await page.locator('[data-stage-tl]').first().click();
  await page.waitForTimeout(400);
  await shot(page, '04-milestone-workbench');

  // 05 — add task
  await page.locator('#taskTitle').fill('Book fit relay shoot');
  await shot(page, '05-this-week-task');

  // 06 — heat radar
  await clickNav(page, 'Heat radar');
  await shot(page, '06-heat-radar');

  // 07 — log heat form filled
  await page.locator('#signalItem').fill('Jacket fit DMs after founder table');
  await page.locator('#signalSource').fill('IG DMs');
  await page.locator('#signalStrength').fill('72');
  await shot(page, '07-log-heat-form');
  await page.locator('#signalForm').evaluate(f => f.requestSubmit());
  await page.waitForTimeout(500);
  await shot(page, '07b-heat-logged');

  // 08 — SKU room
  await clickNav(page, 'SKU room');
  await shot(page, '08-sku-room');

  // 08b — SKU edit form
  await page.locator('[data-edit-product="sku-jacket"]').click();
  await page.waitForTimeout(400);
  await shot(page, '08b-sku-edit');

  // 09 — Edge Commerce Lab
  await clickNav(page, 'Edge Lab');
  await shot(page, '09-campaign');
  await page.locator('[data-edge-view="library"]').click();
  await page.waitForTimeout(300);
  await shot(page, '09b-free-library');

  // 10 — factory
  await clickNav(page, 'Factory');
  await shot(page, '10-factory');

  // 11 — online drop
  await clickNav(page, 'Online drop');
  await shot(page, '11-online-drop');

  // 12 — pop-up
  await clickNav(page, 'Pop-up');
  await shot(page, '12-popup');

  // 13 — next city
  await clickNav(page, 'Next city');
  await shot(page, '13-next-city');

  // 14 — debrief
  await clickNav(page, 'Debrief');
  await page.locator('#pmUnitsSold').fill('92');
  await page.locator('#pmVerdict').selectOption('repeat');
  await page.waitForTimeout(300);
  await shot(page, '14-debrief');

  // 15 — handoff
  await clickNav(page, 'Handoff');
  await shot(page, '15-handoff');

  // 16 — snapshot dialog
  await page.locator('#snapshotBtn').click();
  await page.waitForTimeout(400);
  await shot(page, '16-snapshot-dialog');

  // 17 — help dialog
  await page.locator('#snapshotDialog').evaluate(d => d.close());
  await page.locator('#helpOpenBtn').click();
  await page.waitForTimeout(400);
  await shot(page, '17-help-dialog');
  await page.locator('#helpDialog').evaluate(d => d.close());

  // 18 — new drop dialog
  await clickNav(page, 'Handoff');
  await page.locator('#newDropBtn').click();
  await page.waitForTimeout(400);
  await shot(page, '18-new-drop-dialog');

  // 19 — readiness model expanded
  await page.locator('#newDropDialog').evaluate(d => d.close());
  await clickNav(page, 'Drop desk');
  await page.locator('#cmdCockpit').evaluate(el => { el.open = true; });
  await page.waitForTimeout(300);
  await page.locator('#cmdCockpit').evaluate(element => element.scrollIntoView({ block: 'start' }));
  await shot(page, '19-readiness-model');

  await browser.close();
  console.log('\nDone — screenshots in site/assets/guide/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
