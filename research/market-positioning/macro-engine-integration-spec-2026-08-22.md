# Macro Engine Integration Spec — MacroContext for Prediction Engine v2

Checked: 2026-08-22
Status: **specification only — no engine code was modified.** Target: next iteration of `site/src/market-positioning-prediction.ts` (namespace-bundle style, `tsconfig.market-positioning.json`, validated via `npm run test:positioning`).
Data source for first values: `research/market-positioning/macro-economy-nowcast-2026-08-22.md` + `macro-economy-ledger-2026-08-22.json`.

## 1. What Decision Does This Support?

Lets the engine's forecast react to macro consumer health, FX, and tariff scenarios instead of treating the economy as static — while preserving the engine's truth discipline (forecast authority only, never Drop OS GO).

## 2. Design Rules

1. `MacroContext` is an **optional** input. Absent → engine behaves exactly as v1 (backward compatible; all v1 tests must still pass).
2. Macro data can only **dampen or contextualize** scores and budgets. It must never raise a candidate above what public priors + receipts justify (upside scenario relaxes macro dampening back toward 1.0; it never multiplies above 1.0).
3. Every macro field carries `sourceId` + `checkedOn` referencing the macro ledger; stale entries (older than `macroExpiryDays`, default 45 — macro data rots faster than the 180-day signal expiry) are ignored with a red flag, not silently reused.
4. Fabricated or unsourced macro values must be impossible: fields without a resolvable `sourceId` in the ledger are dropped and flagged.

## 3. Suggested TypeScript Types

```typescript
export type SpendingScenario = "base" | "upside" | "downside";
export type OriginCode = "CN" | "VN" | "other";
export type MarketCode = "US" | "CA";

export interface MacroSourceRef {
  sourceId: string;      // must exist in macro-economy-ledger-*.json
  checkedOn: string;     // ISO date
}

export interface ConsumerHealthIndex {
  market: MarketCode;
  /** 0-100 composite; 50 = neutral. Derivation must be documented in the ledger entry. */
  index: number;
  direction: "improving" | "flat" | "worsening";
  ref: MacroSourceRef;
}

export interface FxRate {
  pair: "USDCAD";
  rate: number;          // e.g. 1.3745
  ref: MacroSourceRef;
}

export interface TariffScenario {
  origin: OriginCode;
  market: MarketCode;
  /** Ad valorem decimal on entered value, e.g. 0.365 for ~36.5% China→US typical. */
  dutyRate: number;
  dutyLayers: string[];  // e.g. ["MFN 16.5%", "S301 List4A 7.5%", "S301-2026 12.5%"]
  brokerVerified: boolean; // false until a customs broker confirms per HTS code
  ref: MacroSourceRef;
}

export interface MacroContext {
  asOf: string;
  consumerHealth: ConsumerHealthIndex[];   // one per market
  fx: FxRate;
  tariffs: TariffScenario[];               // per origin x market
  activeScenario: SpendingScenario;
  scenarioWeights?: Partial<Record<SpendingScenario, number>>; // working weights, sum<=1
  macroExpiryDays?: number;                // default 45
}

/** New output block appended to PositionRecommendation. */
export interface MacroAdjustmentReport {
  applied: boolean;
  staleFields: string[];
  commerceDampener: number;                // multiplier actually applied, 0.6-1.0
  usdContribution?: UsdContributionEstimate[];
  budgetCaps: WaveBudgetCap[];
  macroReversalConditions: string[];
}

export interface UsdContributionEstimate {
  skuId: string;
  origin: OriginCode;
  workingPriceUsd: number;       // founder-set USD price, NOT spot-converted CAD
  landedDutyUsd: number;         // enteredValue * dutyRate
  contributionCadAfterFx: number;
  evidenceClass: "working-assumption" | "broker-verified";
}

export interface WaveBudgetCap {
  wave: 1 | 2 | 3;
  capCad: number;
  evidenceRequired: string;      // e.g. "≥N metro purchase receipts"
}
```

## 4. Required Behaviors

### 4a. Commerce feasibility component

- `downside` scenario **or** target-market `consumerHealth.index < 40` → multiply the candidate's commerce component score by **0.75** before the existing hard-stop cap logic (cap-to-35 still applies afterwards; order matters — dampen, then cap).
- `base` → multiplier 1.0 with a note; `upside` → 1.0 (never >1.0, rule 2).
- If the tariff scenario used for the candidate's market has `brokerVerified: false`, append red flag: `"Tariff stack unverified — commerce feasibility is working analysis."`

### 4b. USD contribution math

- Compute `UsdContributionEstimate` per SKU using `TariffScenario.dutyRate` for the chosen origin and `fx.rate` for CAD conversion of contribution.
- Refuse to emit estimates (return empty array + red flag) if `workingPriceUsd` is absent — spot-converting CAD working prices is explicitly disallowed (matches `gate-usd-contribution` discipline).
- All estimates carry `evidenceClass: "working-assumption"` until `brokerVerified` is true **and** a quote artifact URL exists.

### 4c. Budget-cap recommendations per wave

- Bankroll = production ceiling C$5,000-6,000 (from `sku-inventory.json`).
- `base`: wave 1 cap ≤ 60% of ceiling minimum (≤ C$3,000); wave 2 unlocked by metro-tagged purchase receipts.
- `downside`: wave 1 cap ≤ 40% (≤ C$2,000), SKU list narrowed to hero + one core; wave 2 requires purchase receipts **and** a macro re-read no older than 30 days.
- `upside`: caps unchanged (rule 2); only the wave-2 evidence threshold may be met sooner.

### 4d. New reversal conditions (append to `reversalConditions`)

- `"Downside consumer scenario active — proof buy shrinks to wave-1 downside cap."` (when `activeScenario === "downside"`)
- `"Consumer health index for target market fell below 40 — re-run sizing before any PO."`
- `"USD/CAD below 1.30 — USD contribution sheet void; rebuild before US spend."`
- `"Tariff regime change detected (dutyLayers mismatch vs ledger) — landed costs stale."`

## 5. Test Cases (for `npm run test:positioning`)

1. **Backward compatibility:** `recommendPosition(input)` with no `macroContext` → output deep-equals v1 behavior; `macroAdjustments.applied === false`.
2. **Downside dampening:** identical input ±`macroContext` with `activeScenario: "downside"`, US `consumerHealth.index = 35` → US candidates' commerce component = v1 score × 0.75 (pre-cap), red flags include the downside reversal condition, wave-1 cap = C$2,000.
3. **No-upside-inflation guard:** `activeScenario: "upside"` → no component score or confidence exceeds its v1 value; budget caps unchanged.
4. **Stale macro rejection:** `consumerHealth.ref.checkedOn` 60 days older than `generatedAt` (default expiry 45) → field ignored, `staleFields` lists it, commerce dampener = 1.0, red flag emitted.
5. **USD contribution refusal:** `tariffs` present but no `workingPriceUsd` on SKUs → `usdContribution` empty, red flag `"USD prices absent — refusing spot-conversion of CAD working prices."`; with `workingPriceUsd: 185`, CN→US `dutyRate: 0.365`, `fx.rate: 1.3745` → `landedDutyUsd` = enteredValue × 0.365 and `evidenceClass: "working-assumption"` (exact expected numbers to be pinned when entered-value basis is broker-confirmed; test may assert formula, not constants).

## 6. First Real Values (from ledger, checked 2026-08-22 — working, not broker-verified)

| Field | Value | Ledger source |
| --- | --- | --- |
| consumerHealth US | index ~42, "worsening" (UMich 51.0 near record low; savings 2.7%; nominal apparel +5% YoY) | `mac-umich-aug2026`, `mac-bea-savings`, `mac-census-marts-jul2026` |
| consumerHealth CA | index ~50, "flat" (retail +5.2% YoY, BoC 2.25% hold, July flash -0.8%) | `mac-statcan-retail-jun2026`, `mac-boc-fsr-2026` |
| fx USDCAD | 1.3745 | `mac-fx-usdcad` |
| tariff CN→US | 0.365 typical, layers ["MFN ~16.5%","S301 List4A 7.5%","S301-2026 12.5%"], brokerVerified: false | `mac-tariff-cn-us` |
| tariff VN→US | 0.29 typical, brokerVerified: false | `mac-tariff-vn-us` |
| tariff CN→CA | 0.18 + 5% GST, brokerVerified: false | `mac-tariff-ca-mfn` |
| tariff VN→CA | 0.0 if CPTPP-qualified else 0.18, brokerVerified: false | `mac-tariff-vn-ca-cptpp` |
| activeScenario | "base" (weights base 0.55 / up 0.20 / down 0.25 — founder-judgment working weights) | nowcast §6 |

The composite index derivations (42/50) are working judgment blends documented here, not measured indices — the next engine iteration may replace them with an explicit formula, but must keep the source-per-field rule.

## 7. Unresolved / Next Agent

- Implement in `site/src/` only after coordinating with the agent currently working there; run full `npm run test:positioning`.
- Pin USD contribution test constants once the entered-value basis (FOB vs retail DDP) is broker-confirmed.
- Decide whether consumer health index becomes a computed formula (weighted sentiment/savings/delinquency/retail) — if so, document weights in the ledger.
