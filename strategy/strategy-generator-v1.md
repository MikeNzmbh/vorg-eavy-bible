# VORG Strategy Generator v1.1 — Contract

Status: built and tested 2026-08-22. Code: `site/src/strategy-generator.ts` (bundle `site/strategy-generator.js`). Tests: `site/tests/strategy-generator.test.mjs`. Seed evidence: `research/market-positioning/strategy-mechanism-library-2026-08-22.json`. Demo output: `research/market-positioning/generated-strategy-plan-2026-08-22.md`.

## 1. What decision does this support?

Which go-to-market strategy a clothing brand runs and what the full staged plan is — **picked and compiled by the algorithm itself**, without being told the steps. The founder mandate it encodes: no sales yet is fine; the prediction engine draws up the play from public-prior evidence cards (how mechanisms worked or failed for other companies and why, cross-industry allowed), then real VORG results plug in and steer the plan toward the pre-existing 85% sell-through goal. Motto: *we don't fear failure, we fear unpreparedness.*

## 2. What the algorithm does (pipeline stages)

Each stage is explicit and covered by tests.

1. **Input contract.** Brand profile (SKUs, prices, production ceiling, operating market, sell-through goal defaulting to 85%, configurable test cash pool), evidence-card library (mechanism, industry, `sourceUrl`, `dateChecked`, `workedOrFailed` + why, transferability conditions), ranked market candidates, gate states, optional existing plan (remix), optional macro context, optional first-party results (empty at start — engine must and does still work).
2. **Strategy space generation.** Enumerates candidate strategies from the mechanism library: seven base archetypes (founder-story-led, community-first, creator-seeding, scarcity-drop, event/pop-up-led, wholesale-assisted, paid-performance-led) plus generated hybrid combos of compatible archetypes where both halves have supporting evidence. Cross-industry evidence is allowed with an explicit transferability adjustment: same-industry ×1.0, adjacent (beauty DTC, sneakers, accessories) ×0.8, distant (restaurant, gaming, music, events) ×0.6, plus a mandatory tweak note describing the adaptation ("check if it worked there, tweak it, try it here").
3. **Stress test.** Every candidate is scored against public-prior evidence cards: supporting evidence (worked elsewhere + why + similarity weight), contradicting evidence (failed elsewhere + why, including documented anti-patterns like wholesale-before-DTC-proof and hype-before-ops), and an unpreparedness audit (which strategy-relevant gates are open, what breaks first, which capabilities are frozen). **Failure evidence lowers a score with reasons; it never zeroes a supported strategy.** Repeated use of the same source URL earns no extra independent evidence credit.
4. **Winner selection.** Rank = evidence score (0-100 from weighted public-prior cards) × preparedness (0-1 from market-scoped gate states) × goal-fit (0-1 documented heuristic toward the sell-through goal). Returns a lead, runner-up, reversal conditions, and a co-winner set using an explicit scale-aware threshold: the greater of 0.5 total points or 3% of the leader's score. It can select an operating hypothesis with **zero first-party sales**, but output remains forecast-only and cannot claim VORG demand proof.
5. **Plan compilation.** Expands the winner into a staged plan automatically: phases (P0 gate clearance → P1 organic signal waves → P2 conversion proof/drop staging → P3 drop window → P4 recalibration) → waves → concrete action items, each with owner-role, budget cap drawn from the test cash pool (never the production ceiling), a measurement contract (receipt required), success threshold, kill rule, and gate dependencies. From-scratch mode and remix mode both work.
6. **Calibration loop.** When first-party results arrive (sessions, purchases, sell-through by SKU, wave outcomes with receipt URLs): recomputes the posterior strategy score, kills failing waves and reallocates their freed budget to passing waves (pool ceiling respected), tracks distance-to-goal overall and per SKU, and emits an audit trail (prior → evidence → posterior → change made → why). Receipt-less outcomes are ignored with an audit note. Deterministic given identical inputs.
7. **Safety invariants.** See below.

## 3. Invariants (enforced in code, proven in tests)

- Never claims demand proof from priors (`safety.demandProofClaim === false`).
- Never authorizes production spend (`safety.productionSpendAuthorizedCad === 0`) or Drop OS GO (`safety.dropOsImpact === "none"`).
- Open hard-stop gates freeze affected plan branches (frozen status + reason on waves/items; drop window frozen until every hard stop clears).
- Sum of budget caps never exceeds the test cash pool, before or after calibration; the production ceiling is recorded but never drawn from.
- Every plan line traces to at least one usable evidence card or is labeled `working-assumption`.
- Output always includes an unpreparedness report (open gates + consequences).
- Inputs are never mutated; identical inputs give byte-identical outputs.
- Cards without a usable `sourceUrl` earn nothing; an empty library means the engine refuses to pick a winner and says what to add.
- Invalid dates are unusable; source age, source class, inference basis, duplicate URLs, and evidence diversity all affect weight or confidence.
- Country/region applicability is explicit. Canada-only gates cannot freeze a U.S. plan, while U.S. and shared cross-border gates remain active.

## 4. How to run it

```
cd site
npm run test:strategy      # compile + full test suite
npm run generate:strategy  # regenerate the VORG demo plan artifact
```

Or without npm scripts: `npx tsc -p tsconfig.strategy-generator.json` then `node run-strategy-generator.mjs`.

## 5. How to plug results in later (steering to 85%)

Add `firstPartyResults` to the engine input:

```json
{
  "asOf": "2026-11-01",
  "sessions": 900,
  "purchases": 12,
  "sellThroughBySku": [{ "skuId": "VE-FJ-001", "unitsPlanned": 12, "unitsSold": 5 }],
  "waveOutcomes": [
    { "waveId": "wave-named-community-drops", "receiptUrl": "https://…", "qualifiedActions": 25, "spendCad": 100, "outcome": "pass" }
  ]
}
```

The calibration report then shows: overall and per-SKU sell-through, distance to the 85% goal, killed/scaled waves with reallocated budgets, the posterior strategy score, and the full audit trail. If receipts repeatedly favor the runner-up's mechanisms, the stated reversal condition fires: switch strategies and re-run the generator.

## 6. How remix mode works

Pass any existing plan JSON as `existingPlan` (tolerant of missing fields). The engine keeps what is sound and mutates the rest **with cited reasons**: freezes waves that depend on open hard-stop gates, clamps budgets exceeding the pool, adds missing kill rules/measurement contracts, relabels "evidence-backed" claims that cite no usable card, and adds waves for winner mechanisms the plan does not cover (with evidence card citations). Output mode becomes `remix` with an improvements list.

## 7. Versatility scope

- Works for **any clothing brand**: the brand profile, evidence library, markets, and gates are all inputs; nothing VORG-specific is hard-coded in the pipeline (VORG data lives in the repo JSON files the runner loads).
- Cross-industry evidence is a first-class input with explicit discounts and tweak notes — the seed library already carries sneaker raffles (Nike SNKRS), restaurant scarcity (Popeyes 2019), beauty community co-creation and a failed sub-brand (Glossier / Glossier Play), gaming undersupply (NES Classic), an artist collab drop (Travis Scott x McDonald's), and hype-without-ops collapse (Fyre Festival).
- Can start a full build from scratch or remix an existing plan, whichever is convenient.

## 8. What is known / assumed / unresolved

- **Known:** the v1.1 engine, tests, seed library, and generated runtime exist and pass. After source-class and age weighting, the current VORG run returns a co-winner set: *Hybrid: founder-story-led world building + honest-capacity scarcity drop* (10.12) and *Hybrid: community-first named circle + honest-capacity scarcity drop* (9.94). The associated market engine keeps Brooklyn as lead hypothesis with Chicago, Los Angeles, and Atlanta inside the near-tie set. Twelve U.S.-relevant hard-stop gates remain open, and the drop-window branch is frozen.
- **Assumed:** goal-fit weights per archetype are documented heuristics; the C$500 test cash pool in the demo is a working assumption pending founder confirmation; wedge metro comes from the positioning engine's ranking (forecast only).
- **Unresolved:** no first-party receipts exist yet; every open gate in the unpreparedness report; the mechanism library should keep growing (each new card automatically reshapes ranking on the next run).

## 9. What should the next agent do?

1. Get the founder to confirm or change `testCashPoolCad`, then regenerate.
2. Clear P0 gates with evidence and re-run — preparedness and the ranking update automatically.
3. When the first wave receipts exist, feed them through `firstPartyResults` and commit the recalibrated artifact next to this one.
4. Add new evidence cards (with sourceUrl + dateChecked) as research lands; never edit scores by hand.
