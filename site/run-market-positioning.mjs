// Runs the canonical market-positioning engine against current repo inputs.
// Writes the dated forecast report and a browser-safe runtime result for Drop OS.
import vm from 'node:vm';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const readJson = (relativePath) => JSON.parse(readFileSync(join(root, relativePath), 'utf8'));

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(here, 'market-positioning-prediction.js'), 'utf8'), sandbox, {
  filename: 'market-positioning-prediction.js'
});
const engine = sandbox.VorgMarketPositioning;

const candidatesPack = readJson('research/market-positioning/candidates.json');
const ledger = readJson('research/market-positioning/source-ledger.json');
const mechanisms = readJson('research/market-positioning/mechanism-cards.json');
const gatesPack = readJson('research/market-positioning/route-to-market-gates.json');

const input = {
  generatedAt: '2026-08-22T20:00:00.000Z',
  candidates: candidatesPack.candidates,
  sources: ledger.sources,
  signals: ledger.signals,
  mechanisms: mechanisms.cards,
  gates: gatesPack.gates,
  receipts: []
};
const result = engine.recommendPosition(input);

const runtime = {
  generatedBy: engine.ENGINE_VERSION,
  inputCheckedOn: ledger.checkedOn,
  result
};
writeFileSync(
  join(here, 'market-positioning-runtime.js'),
  `window.VORG_MARKET_POSITIONING_RUNTIME = ${JSON.stringify(runtime, null, 2)};\n`,
  'utf8'
);

const lines = [];
const push = (line = '') => lines.push(line);
const winnerNames = result.provisionalWinners.map((candidate) => candidate.metro);
const lead = result.provisionalWinner;

push('# U.S. Market Positioning Forecast Report');
push('');
push('Checked: 2026-08-22');
push(`Engine: \`${result.version}\``);
push(`Status: **${result.decisionStatus}** — public-prior forecast only; no Drop OS GO or production authority.`);
push('');
push('## Decision');
push('');
push(lead
  ? `Use **${lead.metro}** as the operating lead hypothesis. The ranking is **${result.rankingStrength}**, not an exclusive proven win.`
  : 'No defensible metro lead exists yet.');
push('');
push(`Co-finalist set under the engine's 1-point near-tie rule: **${winnerNames.join(', ') || 'none'}**.`);
push('');
push('The scores are deliberately lower than v1 because v1.1 discounts vendor case studies, internal assumptions, generic national signals, repeated sources, and inference-only inputs. No metro-specific Google Trends or VORG GA4 data is present, so confidence remains low.');
push('');
push('## Ranking');
push('');
push('| Rank | Metro | Forecast score | Score band | Confidence | Role |');
push('| ---: | --- | ---: | ---: | ---: | --- |');
result.rankedCandidates.forEach((candidate, index) => {
  push(`| ${index + 1} | ${candidate.metro} | ${candidate.posteriorScore.toFixed(1)} | ${candidate.scoreBand.low.toFixed(1)}–${candidate.scoreBand.high.toFixed(1)} | ${candidate.confidence.toFixed(1)} | ${candidate.selectionRole} |`);
});
push('');
push('## Strategy Implication');
push('');
push('- Online scope: U.S.-national Shopify education and checkout, with the lead metro used as the first content/community learning wedge.');
push('- Physical scope: no U.S. pop-up booking until metro-tagged actions, a venue package, POS/inventory reconciliation, insurance, and permissions exist.');
push('- Product sequence: Firm Jacket as the cold-weather identity lead only after sample truth; women’s and men’s denim as fit-content anchors; top and scarf as supporting entry points.');
push('- Distribution: founder product-truth first, governed nano/micro UGC second, paid amplification only after a qualifying creative receipt.');
push('- Strategy co-winner: community-first named circle + honest-capacity drop, with founder-story-led + honest-capacity drop close enough to combine operationally rather than pretend the evidence separates them cleanly.');
push('');
push('## Why This Is Not A Clear City Win');
push('');
push('- The five metros are separated by less than two forecast points.');
push('- The only search signal is a national fashion outlook, not metro-level query demand for the five VORG silhouettes.');
push('- Comparable-brand evidence describes mechanisms, not VORG conversion or contribution margin.');
push('- Cross-border shipping, duties, returns, USD contribution, and tax review remain unresolved.');
push('- There are no first-party VORG U.S. receipts yet.');
push('');
push('## Hard Stops Before Selling');
push('');
for (const gate of result.blindSpotGates.filter((gate) => {
  const region = String(gate.region || '').toUpperCase();
  return gate.hardStop && region.includes('US') && gate.state !== 'cleared-with-evidence';
})) {
  push(`- **${gate.label}** — ${gate.state}. ${gate.notes || ''}`);
}
push('');
push('## Reversal Conditions');
push('');
for (const condition of result.reversalConditions) push(`- ${condition}`);
push('');
push('## Next Proof');
push('');
push('Capture the same exact silhouette-term Google Trends/query method for all five metros, then add the first metro-tagged product/size action receipts. Re-run without changing weights.');

const reportPath = join(root, 'research/market-positioning/forecast-report-2026-08-22.md');
writeFileSync(reportPath, lines.join('\n') + '\n', 'utf8');
console.log(`Wrote ${reportPath}`);
console.log(`Lead: ${lead?.metro || 'none'}; co-finalists: ${winnerNames.join(', ') || 'none'}; strength=${result.rankingStrength}`);
