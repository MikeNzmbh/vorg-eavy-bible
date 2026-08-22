import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const siteDir = resolve(import.meta.dirname);
const trainer = resolve(siteDir, '../research/commerce-intelligence/public-data-model/train_external_priors.py');
const requirements = resolve(siteDir, '../research/commerce-intelligence/public-data-model/requirements.txt');
const bundledPython = join(homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', 'python.exe');
const candidates = [
  ...(process.platform === 'win32' && existsSync(bundledPython) ? [{ command: bundledPython, prefix: [] }] : []),
  ...(process.platform === 'win32' ? [{ command: 'py', prefix: ['-3'] }] : [{ command: 'python3', prefix: [] }]),
  { command: 'python', prefix: [] }
];

let selected;
for (const candidate of candidates) {
  const check = spawnSync(candidate.command, [...candidate.prefix, '-c', 'import numpy, pandas, openpyxl'], {
    cwd: siteDir,
    encoding: 'utf8',
    windowsHide: true
  });
  if (check.status === 0) {
    selected = candidate;
    break;
  }
}

if (!selected) {
  console.error('No Python runtime with numpy, pandas, and openpyxl was found.');
  console.error(`Install the free pinned dependencies with: python -m pip install -r "${requirements}"`);
  process.exit(1);
}

console.log(`Training with ${selected.command}`);
const result = spawnSync(
  selected.command,
  [...selected.prefix, trainer, ...process.argv.slice(2)],
  { cwd: siteDir, stdio: 'inherit', windowsHide: true }
);
process.exit(result.status ?? 1);
