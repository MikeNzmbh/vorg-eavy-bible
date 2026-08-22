import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const script = join(here, '..', '..', 'launch', 'simulate-paid-ads-practice.mjs');
const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
assert.equal(result.status, 0, result.stderr || 'practice script failed');
const output = JSON.parse(result.stdout);
assert.equal(output.truth, 'external-public-practice');
assert.equal(output.cashGeometry.c450Covers850Sessions, false);
assert.ok(output.cashGeometry.spendToBuy850AtWordstreamCpcCad > 450);
assert.ok(output.cashGeometry.ordersIf850ConvertAtIrpCvr < 26);
assert.equal(output.forecastPractice.fullDropBase.chance85Pct, 25.3);
assert.equal(output.hermesAutopilot.recommendation, 'do-not-build-unattended-buyer');
console.log('ads-public-priors practice: ok');
