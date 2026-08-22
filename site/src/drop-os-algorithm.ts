namespace VorgDropAlgorithm {
  export type StressKey =
    | "demand"
    | "product"
    | "campaign"
    | "operations"
    | "margin"
    | "evidence"
    | "risk";

  export type GateDecision = "approve" | "test" | "revise" | "kill";
  export type StageStatus = "done" | "in progress" | "blocked" | "not started";
  export type StressDirection = "positive" | "negative";
  export type SpendLevel = "major-spend" | "small-test" | "proof-only" | "paused";
  export type BudgetStatus = "within-cap" | "over-cap" | "unknown";
  export type CampaignBand = "insufficient" | "early" | "promising" | "strong";
  export type EvidenceTier = "A" | "B" | "C" | "F";
  export type GrowthRisk = "Green" | "Yellow" | "Orange" | "Red";
  export type ExperimentStatus = "planned" | "ready" | "running" | "completed" | "blocked";
  export type ExperimentDecision = "pending" | "adopt" | "adapt" | "retest" | "reject";

  export interface StressLabel {
    key: StressKey;
    label: string;
    weight: number;
    type: StressDirection;
  }

  export interface StressInput {
    demand: number;
    product: number;
    campaign: number;
    operations: number;
    margin: number;
    evidence: number;
    risk: number;
  }

  export interface StageScoreInput {
    id?: string;
    order?: number;
    status: StageStatus | string;
    gate: GateDecision | string;
    score: number | string;
    evidence?: string;
  }

  export interface TacticScoreInput {
    id?: string;
    name?: string;
    status: string;
    evidenceUrl?: string;
  }

  export interface ExperimentPrerequisiteInput {
    id?: string;
    label?: string;
    cleared?: boolean;
  }

  export interface EdgeExperimentInput {
    id?: string;
    tacticId?: string;
    name?: string;
    sourceEvidenceTier?: EvidenceTier | string;
    sourceProvenanceVerified?: boolean;
    risk?: GrowthRisk | string;
    status?: ExperimentStatus | string;
    decision?: ExperimentDecision | string;
    owner?: string;
    startDate?: string;
    endDate?: string;
    budgetCap?: unknown;
    actualSpend?: unknown;
    targetQualifiedActions?: unknown;
    qualifiedActions?: unknown;
    assetsTarget?: unknown;
    assetsEarned?: unknown;
    resultSummary?: string;
    evidenceUrl?: string;
    approvalStatus?: string;
    approvedBy?: string;
    approvedAt?: string;
    counselReviewed?: boolean;
    counselReviewedAt?: string;
    prerequisites?: ExperimentPrerequisiteInput[];
  }

  export interface SignalScoreInput {
    id?: string;
    item?: string;
    source?: string;
    city?: string;
    strength: number | string;
    evidenceUrl?: string;
  }

  export interface ManufacturingInput {
    vendorName?: unknown;
    quoteUrl?: unknown;
    landedCogs?: unknown;
    moq?: unknown;
    leadTimeDays?: unknown;
    quoteDate?: unknown;
    sampleStage?: unknown;
    sampleProofUrl?: unknown;
    ppApproved?: unknown;
  }

  export interface ProductScoreInput {
    id?: string;
    name?: string;
    active?: boolean;
    units?: unknown;
    price?: unknown;
    priceEvidenceUrl?: string;
    manufacturing?: ManufacturingInput;
  }

  export interface MarketChannelInput {
    id?: string;
    platform?: string;
    active?: boolean;
    owner?: string;
    commerceRoute?: string;
    measurementEvidenceUrl?: string;
    policyEvidenceUrl?: string;
  }

  export interface MarketEntryInput {
    primaryMarket?: string;
    operatingMarket?: string;
    primaryMarketEvidenceUrl?: string;
    salesCurrency?: string;
    marketEconomicsEvidenceUrl?: string;
    fulfillmentModel?: string;
    fulfillmentEvidenceUrl?: string;
    crossBorderEvidenceUrl?: string;
    dutiesAndTaxEvidenceUrl?: string;
    shippingEvidenceUrl?: string;
    returnsEvidenceUrl?: string;
    productComplianceEvidenceUrl?: string;
    privacyAndConsentEvidenceUrl?: string;
    creatorRightsEvidenceUrl?: string;
    channels?: MarketChannelInput[];
    popupEnabled?: boolean;
    popupCity?: string;
    popupMarket?: string;
    popupEvidenceUrl?: string;
  }

  export interface DropScoreInput {
    stress: Partial<StressInput>;
    stages: StageScoreInput[];
    tactics: TacticScoreInput[];
    signals: SignalScoreInput[];
    operationsEffective: number;
    productProofScore?: number;
    products?: ProductScoreInput[];
    productionSpendCap?: number;
    edgeExperiments?: EdgeExperimentInput[];
    marketEntry?: MarketEntryInput;
  }

  export interface Weakness {
    label: string;
    value: number;
  }

  export interface ConfidenceBandOutput {
    low: number;
    high: number;
  }

  export interface FinancialProofOutput {
    score: number;
    dataCoverage: number;
    budgetStatus: BudgetStatus;
    plannedProductionSpend: number | null;
    productionSpendCap: number;
    completeSkuCount: number;
    positiveMarginSkuCount: number;
    activeSkuCount: number;
  }

  export interface ManufacturingProofOutput {
    score: number;
    referenceCoverage: number;
    bulkReady: boolean;
    bulkReadySkuCount: number;
    activeSkuCount: number;
  }

  export interface MarketEntryMetrics {
    required: boolean;
    primaryMarket: string;
    operatingMarket: string;
    crossBorder: boolean;
    score: number;
    evidenceCoverage: number;
    goReady: boolean;
    violations: string[];
  }

  export interface EvidenceCoverageOutput {
    manufacturing: number;
    financial: number;
    stages: number;
    campaign: number;
    signals: number;
  }

  export interface SpendAuthorization {
    level: SpendLevel;
    label: string;
    summary: string;
    reason: string;
    allowed: string[];
    blocked: string[];
  }

  export interface ScoreLever {
    id: string;
    label: string;
    owner: string;
    input: string;
    current: number;
    target: number;
    projectedConfidence: number;
    deltaConfidence: number;
    projectedGate: GateDecision;
    action: string;
    proofNeeded: string;
  }

  export interface ScoreCore {
    version: string;
    confidence: number;
    confidenceBand: ConfidenceBandOutput;
    campaignIndex: number;
    campaignBand: CampaignBand;
    gate: GateDecision;
    weakness: Weakness;
    bottleneck: string;
    evidenceFloor: number;
    evidenceCoverage: number;
    evidenceBreakdown: EvidenceCoverageOutput;
    stageScore: number;
    tacticScore: number;
    edgeScore: number;
    edgeLearningScore: number;
    edgeEvidenceCoverage: number;
    edgeValidatedExperiments: number;
    edgeCompletedExperiments: number;
    edgeRunningExperiments: number;
    edgeExperimentSpend: number;
    edgeExperimentBudgetCap: number;
    edgeBudgetStatus: BudgetStatus;
    edgeFrontierSpendShare: number;
    edgeViolations: string[];
    signalHeat: number;
    financialProofScore: number;
    manufacturingScore: number;
    marketEntryScore: number;
    marketEntryEvidenceCoverage: number;
    marketEntryRequired: boolean;
    marketEntryGoReady: boolean;
    marketEntryViolations: string[];
    riskDrag: number;
    uncertaintyPenalty: number;
    riskPressure: number;
    operationsEffective: number;
    verifiedTactics: number;
    verifiedSignals: number;
    sequenceViolations: number;
    productionPrerequisitesCleared: boolean;
    bulkReady: boolean;
    budgetStatus: BudgetStatus;
    plannedProductionSpend: number | null;
    productionSpendCap: number;
    hardStops: string[];
    gateCaps: string[];
  }

  export interface ScoreOutput extends ScoreCore {
    gateReason: string;
    spendAuthorization: SpendAuthorization;
    levers: ScoreLever[];
  }

  export interface CitySignalScore {
    city: string;
    score: number;
    count: number;
    verifiedCount: number;
  }

  interface StageMetrics {
    score: number;
    evidenceCoverage: number;
    sequenceViolations: number;
    blockedStages: number;
    killedStages: number;
    productionPrerequisitesCleared: boolean;
  }

  interface TacticMetrics {
    score: number;
    verifiedCount: number;
    evidenceCoverage: number;
    proofKeys: string[];
  }

  export interface EdgeExperimentMetrics {
    score: number;
    learningScore: number;
    evidenceCoverage: number;
    validatedCount: number;
    verifiedCompletedCount: number;
    completedCount: number;
    runningCount: number;
    plannedCount: number;
    totalSpend: number;
    totalBudgetCap: number;
    budgetStatus: BudgetStatus;
    frontierSpendShare: number;
    approvalViolations: number;
    prerequisiteViolations: number;
    redRiskViolations: number;
    budgetViolations: number;
    evidenceViolations: number;
    validatedProofKeys: string[];
    violations: string[];
  }

  export const ALGORITHM_VERSION = "VORG Drop OS score v1.3";
  export const DEFAULT_PRODUCTION_SPEND_CAP = 6000;

  // These weights describe the self-assessment sliders only. Objective proof
  // components are weighted separately in calculateCore.
  export const STRESS_LABELS: StressLabel[] = [
    { key: "demand", label: "Market heat", weight: 0.06, type: "positive" },
    { key: "product", label: "SKU proof", weight: 0, type: "positive" },
    { key: "campaign", label: "Content heat", weight: 0.04, type: "positive" },
    { key: "operations", label: "Launch ops", weight: 0.14, type: "positive" },
    { key: "margin", label: "Margin room", weight: 0.04, type: "positive" },
    { key: "evidence", label: "Proof quality", weight: 0.04, type: "positive" },
    { key: "risk", label: "Risk pressure", weight: 0.28, type: "negative" }
  ];

  export function clamp(value: unknown, minimum: number, maximum: number): number {
    const numeric = coerceNumber(value);
    return Math.max(minimum, Math.min(maximum, numeric));
  }

  export function average(values: unknown[]): number {
    if (!values.length) return 0;
    return values.map(coerceNumber).reduce((sum, value) => sum + value, 0) / values.length;
  }

  export function statusMultiplier(status: unknown): number {
    if (status === "done") return 1;
    if (status === "in progress") return 0.68;
    if (status === "blocked") return 0.12;
    return 0.2;
  }

  export function gateMultiplier(gate: unknown): number {
    if (gate === "approve") return 1;
    if (gate === "test") return 0.72;
    if (gate === "revise") return 0.36;
    return 0.05;
  }

  export function hasEvidenceReference(value: unknown): boolean {
    const reference = String(value || "").trim();
    if (!reference || /^(tbd|none|n\/a|unknown|unresolved|-)$/i.test(reference)) return false;
    const webReference = /^https?:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(reference);
    const repoReference = /^(?:\.\.?[\\/]|[\\/])?[a-z0-9_.-]+(?:[\\/][a-z0-9_. -]+)+$/i.test(reference);
    return webReference || repoReference;
  }

  export function calculateScores(input: DropScoreInput): ScoreOutput {
    const core = calculateCore(input);
    const gateReason = gateReasonFor(core);
    return {
      ...core,
      gateReason,
      spendAuthorization: spendAuthorizationFor(core, gateReason),
      levers: buildScoreLevers(input, core)
    };
  }

  function calculateCore(input: DropScoreInput): ScoreCore {
    const stress = normalizeStress(input.stress || {});
    const operationsEffective = clamp(input.operationsEffective, 0, 100);
    const products = activeProducts(input.products || []);
    const manufacturing = products.length
      ? calculateManufacturingProof(products)
      : legacyManufacturingProof(input.productProofScore);
    const financial = calculateFinancialProof(products, input.productionSpendCap);
    const marketEntry = calculateMarketEntryMetrics(input.marketEntry);
    const stages = calculateStageMetrics(input.stages || []);
    const tactics = calculateTacticMetrics(input.tactics || []);
    const edge = calculateEdgeExperimentMetrics(input.edgeExperiments || []);
    const tacticScore = edge.completedCount > 0
      ? Math.round(tactics.score * 0.65 + edge.score * 0.35)
      : tactics.score;
    const verifiedCampaignProof = new Set([...tactics.proofKeys, ...edge.validatedProofKeys]).size;
    const campaignEvidenceCoverage = edge.completedCount > 0
      ? Math.round(tactics.evidenceCoverage * 0.7 + edge.evidenceCoverage * 0.3)
      : tactics.evidenceCoverage;
    const uniqueSignals = deduplicateSignals(input.signals || []);
    const signalHeat = calculateSignalHeat(uniqueSignals);
    const verifiedSignals = uniqueSignals.filter(signal => hasEvidenceReference(signal.evidenceUrl)).length;
    const signalEvidenceCoverage = Math.min(100, (verifiedSignals / 3) * 100);

    const evidenceBreakdown: EvidenceCoverageOutput = {
      manufacturing: manufacturing.referenceCoverage,
      financial: financial.dataCoverage,
      stages: stages.evidenceCoverage,
      campaign: campaignEvidenceCoverage,
      signals: signalEvidenceCoverage
    };
    const coreEvidenceCoverage = Math.round(
      evidenceBreakdown.manufacturing * 0.35 +
      evidenceBreakdown.financial * 0.2 +
      evidenceBreakdown.stages * 0.2 +
      evidenceBreakdown.campaign * 0.15 +
      evidenceBreakdown.signals * 0.1
    );

    const evidenceCoverage = marketEntry.required
      ? Math.round(coreEvidenceCoverage * 0.85 + marketEntry.evidenceCoverage * 0.15)
      : coreEvidenceCoverage;

    const coreReadiness =
      manufacturing.score * 0.18 +
      financial.score * 0.16 +
      operationsEffective * 0.14 +
      stages.score * 0.12 +
      tacticScore * 0.12 +
      signalHeat * 0.1 +
      stress.demand * 0.06 +
      stress.campaign * 0.04 +
      stress.margin * 0.04 +
      stress.evidence * 0.04;
    const rawReadiness = marketEntry.required
      ? coreReadiness * 0.9 + marketEntry.score * 0.1
      : coreReadiness;

    const riskDrag = clamp(
      Math.max(0, stress.risk - 25) * 0.28 +
      stages.blockedStages * 5 +
      stages.sequenceViolations * 6 +
      edge.approvalViolations * 4 +
      edge.prerequisiteViolations * 4 +
      edge.evidenceViolations * 2,
      0,
      35
    );
    const uncertaintyPenalty = Math.round((100 - evidenceCoverage) * 0.1);
    const confidence = Math.round(clamp(rawReadiness - riskDrag - uncertaintyPenalty, 0, 100));
    const uncertainty = 100 - evidenceCoverage;
    const confidenceBand: ConfidenceBandOutput = {
      low: Math.round(clamp(confidence - uncertainty * 0.16, 0, 100)),
      high: Math.round(clamp(confidence + uncertainty * 0.08, 0, 100))
    };

    const campaignIndex = Math.round(clamp(
      edge.completedCount > 0
        ? tacticScore * 0.48 + edge.learningScore * 0.12 + signalHeat * 0.2 + stress.demand * 0.1 + stress.campaign * 0.1
        : tacticScore * 0.55 + signalHeat * 0.25 + stress.demand * 0.1 + stress.campaign * 0.1,
      0,
      100
    ));
    const campaignBand = campaignBandFor(campaignIndex);
    const evidenceFloor = Math.round(Math.min(
      evidenceCoverage,
      manufacturing.score,
      financial.score,
      operationsEffective,
      marketEntry.required ? marketEntry.score : 100
    ));

    const hardStops: string[] = [];
    if (stress.risk >= 85) hardStops.push(`Risk pressure ${stress.risk} is at or above the hard stop of 85.`);
    if (financial.budgetStatus === "over-cap") {
      hardStops.push(`Known planned production spend ${formatCurrency(financial.plannedProductionSpend)} exceeds the ${formatCurrency(financial.productionSpendCap)} cap.`);
    }
    if (stages.killedStages > 0) hardStops.push("A reached stage is explicitly marked kill.");
    if (edge.redRiskViolations > 0) hardStops.push("A Red-risk Edge Lab experiment is active or recorded as completed.");
    if (edge.budgetViolations > 0) hardStops.push("An Edge Lab experiment exceeded its founder-approved cash cap.");

    const gateCaps: string[] = [];
    if (evidenceCoverage < 75) gateCaps.push(`Evidence coverage ${evidenceCoverage}/100 is below the 75 approval floor.`);
    if (manufacturing.score < 75) gateCaps.push(`Manufacturing truth ${manufacturing.score}/100 is below 75.`);
    if (!manufacturing.bulkReady) gateCaps.push("Every active SKU still needs quote, landed COGS, sample proof, and PP approval before bulk.");
    if (
      financial.score < 85 ||
      financial.budgetStatus !== "within-cap" ||
      financial.completeSkuCount !== financial.activeSkuCount
    ) {
      gateCaps.push("The unit, price, landed-COGS, and production-cap model is incomplete.");
    }
    if (marketEntry.required && marketEntry.score < 75) {
      gateCaps.push(`Market-entry readiness ${marketEntry.score}/100 is below the 75 approval floor.`);
    }
    if (marketEntry.required && !marketEntry.goReady) {
      gateCaps.push("Primary-market demand, checkout economics, fulfilment, compliance, channel attribution, or pop-up proof is incomplete.");
    }
    if (operationsEffective < 70) gateCaps.push(`Launch operations ${Math.round(operationsEffective)}/100 are below 70.`);
    if (verifiedCampaignProof < 2 || tacticScore < 50) {
      gateCaps.push("Campaign proof needs at least two linked tactic wins or validated Edge Lab results and a 50+ proof score.");
    }
    if (edge.approvalViolations > 0) gateCaps.push("A Yellow or Orange Edge Lab experiment ran without action-time approval.");
    if (edge.prerequisiteViolations > 0) gateCaps.push("An Edge Lab experiment ran before all prerequisites were cleared.");
    if (edge.evidenceViolations > 0) gateCaps.push("An Edge Lab decision state or proof record is invalid or incomplete.");
    if (stages.sequenceViolations > 0) gateCaps.push("Later stages are marked done before earlier gates are cleared.");
    if (stages.blockedStages > 0) gateCaps.push("A reached stage is blocked.");
    if (!stages.productionPrerequisitesCleared) {
      gateCaps.push("The pre-production stage chain through Campaign Proof is not fully approved with evidence.");
    }
    if (stress.risk > 55) gateCaps.push(`Risk pressure ${stress.risk} is above the 55 approval ceiling.`);

    let gate: GateDecision = "revise";
    if (hardStops.length) {
      gate = "kill";
    } else if (confidence >= 78 && gateCaps.length === 0) {
      gate = "approve";
    } else if (
      confidence >= 45 &&
      evidenceCoverage >= 25 &&
      stress.risk <= 72 &&
      stages.blockedStages === 0
    ) {
      gate = "test";
    }

    const weakness = [
      { label: "Manufacturing truth", value: manufacturing.score },
      { label: "Financial proof", value: financial.score },
      ...(marketEntry.required ? [{ label: "Market entry", value: marketEntry.score }] : []),
      { label: "Launch operations", value: operationsEffective },
      { label: "Stage integrity", value: stages.score },
      { label: "Campaign proof", value: tacticScore },
      { label: "Verified demand", value: signalHeat },
      { label: "Evidence coverage", value: evidenceCoverage },
      { label: "Risk control", value: 100 - stress.risk }
    ].sort((left, right) => left.value - right.value)[0] || { label: "Evidence coverage", value: 0 };

    return {
      version: ALGORITHM_VERSION,
      confidence,
      confidenceBand,
      campaignIndex,
      campaignBand,
      gate,
      weakness,
      bottleneck: hardStops.length ? "Hard stop" : weakness.label,
      evidenceFloor,
      evidenceCoverage,
      evidenceBreakdown,
      stageScore: Math.round(stages.score),
      tacticScore: Math.round(tacticScore),
      edgeScore: edge.score,
      edgeLearningScore: edge.learningScore,
      edgeEvidenceCoverage: edge.evidenceCoverage,
      edgeValidatedExperiments: edge.validatedCount,
      edgeCompletedExperiments: edge.completedCount,
      edgeRunningExperiments: edge.runningCount,
      edgeExperimentSpend: edge.totalSpend,
      edgeExperimentBudgetCap: edge.totalBudgetCap,
      edgeBudgetStatus: edge.budgetStatus,
      edgeFrontierSpendShare: edge.frontierSpendShare,
      edgeViolations: edge.violations,
      signalHeat: Math.round(signalHeat),
      financialProofScore: financial.score,
      manufacturingScore: manufacturing.score,
      marketEntryScore: marketEntry.score,
      marketEntryEvidenceCoverage: marketEntry.evidenceCoverage,
      marketEntryRequired: marketEntry.required,
      marketEntryGoReady: marketEntry.goReady,
      marketEntryViolations: marketEntry.violations,
      riskDrag: Math.round(riskDrag),
      uncertaintyPenalty,
      riskPressure: stress.risk,
      operationsEffective: Math.round(operationsEffective),
      verifiedTactics: verifiedCampaignProof,
      verifiedSignals,
      sequenceViolations: stages.sequenceViolations,
      productionPrerequisitesCleared: stages.productionPrerequisitesCleared,
      bulkReady: manufacturing.bulkReady,
      budgetStatus: financial.budgetStatus,
      plannedProductionSpend: financial.plannedProductionSpend,
      productionSpendCap: financial.productionSpendCap,
      hardStops,
      gateCaps
    };
  }

  export function calculateManufacturingProof(products: ProductScoreInput[]): ManufacturingProofOutput {
    const active = activeProducts(products);
    if (!active.length) {
      return { score: 0, referenceCoverage: 0, bulkReady: false, bulkReadySkuCount: 0, activeSkuCount: 0 };
    }

    const scores: number[] = [];
    let references = 0;
    let bulkReadySkuCount = 0;

    active.forEach(product => {
      const proof = product.manufacturing || {};
      const quote = hasEvidenceReference(proof.quoteUrl);
      const sample = hasEvidenceReference(proof.sampleProofUrl);
      const landedCogs = positiveNumber(proof.landedCogs);
      const stage = String(proof.sampleStage || "").toLowerCase();
      const stageScore = stage === "approved" ? 15 : stage === "pp" ? 12 : stage === "lab" ? 8 : stage === "ordered" ? 4 : 0;
      const ppApproved = proof.ppApproved === true;
      const score =
        (hasUsableValue(proof.vendorName) ? 5 : 0) +
        (quote ? 18 : 0) +
        (landedCogs !== null ? 15 : 0) +
        (positiveNumber(proof.moq) !== null ? 8 : 0) +
        (positiveNumber(proof.leadTimeDays) !== null ? 6 : 0) +
        (hasUsableValue(proof.quoteDate) ? 3 : 0) +
        (sample ? 18 : 0) +
        stageScore +
        (ppApproved ? 12 : 0);
      scores.push(score);
      references += Number(quote) + Number(sample);
      if (quote && sample && landedCogs !== null && ppApproved && (stage === "pp" || stage === "approved")) {
        bulkReadySkuCount += 1;
      }
    });

    return {
      score: Math.round(average(scores)),
      referenceCoverage: Math.round((references / (active.length * 2)) * 100),
      bulkReady: bulkReadySkuCount === active.length,
      bulkReadySkuCount,
      activeSkuCount: active.length
    };
  }

  export function calculateManufacturingScore(products: ProductScoreInput[]): number {
    return calculateManufacturingProof(products).score;
  }

  export function calculateFinancialProof(
    products: ProductScoreInput[],
    productionSpendCap?: number
  ): FinancialProofOutput {
    const active = activeProducts(products);
    const cap = positiveNumber(productionSpendCap) || DEFAULT_PRODUCTION_SPEND_CAP;
    if (!active.length) {
      return {
        score: 0,
        dataCoverage: 0,
        budgetStatus: "unknown",
        plannedProductionSpend: null,
        productionSpendCap: cap,
        completeSkuCount: 0,
        positiveMarginSkuCount: 0,
        activeSkuCount: 0
      };
    }

    let knownFields = 0;
    let completeSkuCount = 0;
    let positiveMarginSkuCount = 0;
    let spend = 0;
    const skuScores: number[] = [];

    active.forEach(product => {
      const units = positiveNumber(product.units);
      const price = positiveNumber(product.price);
      const priceProof = hasEvidenceReference(product.priceEvidenceUrl);
      const landedCogs = positiveNumber(product.manufacturing?.landedCogs);
      const quoteProof = hasEvidenceReference(product.manufacturing?.quoteUrl);
      knownFields += Number(units !== null) + Number(price !== null) + Number(priceProof) + Number(landedCogs !== null) + Number(quoteProof);
      const positiveMargin = price !== null && landedCogs !== null && price > landedCogs;
      if (units !== null && price !== null && priceProof && landedCogs !== null && quoteProof) completeSkuCount += 1;
      if (positiveMargin) positiveMarginSkuCount += 1;
      if (units !== null && landedCogs !== null) spend += units * landedCogs;
      skuScores.push(
        (units !== null ? 20 : 0) +
        (price !== null ? 15 : 0) +
        (priceProof ? 15 : 0) +
        (landedCogs !== null ? 15 : 0) +
        (quoteProof ? 20 : 0) +
        (positiveMargin ? 15 : 0)
      );
    });

    const budgetKnown = active.every(product =>
      positiveNumber(product.units) !== null && positiveNumber(product.manufacturing?.landedCogs) !== null
    );
    const budgetStatus: BudgetStatus = spend > cap ? "over-cap" : !budgetKnown ? "unknown" : "within-cap";
    const score = Math.round(average(skuScores) * 0.85 + (budgetStatus === "within-cap" ? 15 : 0));

    return {
      score,
      dataCoverage: Math.round((knownFields / (active.length * 5)) * 100),
      budgetStatus,
      plannedProductionSpend: budgetKnown || spend > cap ? Math.round(spend * 100) / 100 : null,
      productionSpendCap: cap,
      completeSkuCount,
      positiveMarginSkuCount,
      activeSkuCount: active.length
    };
  }

  export function calculateMarketEntryMetrics(input?: MarketEntryInput): MarketEntryMetrics {
    const plan = input || {};
    const primaryMarket = String(plan.primaryMarket || "").trim();
    const operatingMarket = String(plan.operatingMarket || "").trim();
    const channels = plan.channels || [];
    const required = Boolean(primaryMarket);
    if (!required) {
      return {
        required: false,
        primaryMarket: "",
        operatingMarket,
        crossBorder: false,
        score: 0,
        evidenceCoverage: 0,
        goReady: true,
        violations: []
      };
    }

    const crossBorder = Boolean(operatingMarket) && normalizeMarketName(operatingMarket) !== normalizeMarketName(primaryMarket);
    const primaryIsUnitedStates = isUnitedStatesMarket(primaryMarket);
    const shopify = findActiveMarketChannel(channels, "shopify");
    const tiktok = findActiveMarketChannel(channels, "tiktok");
    const shopifyReady = channelIsReady(shopify);
    const tiktokReady = channelIsReady(tiktok);
    const shopifyEvidence = hasEvidenceReference(shopify?.measurementEvidenceUrl) && hasEvidenceReference(shopify?.policyEvidenceUrl);
    const tiktokEvidence = hasEvidenceReference(tiktok?.measurementEvidenceUrl) && hasEvidenceReference(tiktok?.policyEvidenceUrl);
    const popupRequired = plan.popupEnabled === true;
    const popupReady = !popupRequired || (
      hasUsableValue(plan.popupCity) &&
      normalizeMarketName(plan.popupMarket) === normalizeMarketName(primaryMarket) &&
      hasEvidenceReference(plan.popupEvidenceUrl)
    );

    const controls = [
      { label: "primary market is named", cleared: hasUsableValue(primaryMarket), evidenced: false },
      { label: "primary-market demand receipt", cleared: hasEvidenceReference(plan.primaryMarketEvidenceUrl), evidenced: hasEvidenceReference(plan.primaryMarketEvidenceUrl) },
      {
        label: primaryIsUnitedStates ? "USD checkout economics" : "market-specific checkout economics",
        cleared: hasUsableValue(plan.salesCurrency) && (!primaryIsUnitedStates || String(plan.salesCurrency).trim().toUpperCase() === "USD") && hasEvidenceReference(plan.marketEconomicsEvidenceUrl),
        evidenced: hasEvidenceReference(plan.marketEconomicsEvidenceUrl)
      },
      {
        label: "fulfilment model and operator proof",
        cleared: hasUsableValue(plan.fulfillmentModel) && hasEvidenceReference(plan.fulfillmentEvidenceUrl),
        evidenced: hasEvidenceReference(plan.fulfillmentEvidenceUrl)
      },
      {
        label: "cross-border importer / carrier treatment",
        cleared: !crossBorder || hasEvidenceReference(plan.crossBorderEvidenceUrl),
        evidenced: !crossBorder || hasEvidenceReference(plan.crossBorderEvidenceUrl)
      },
      {
        label: "duties and tax treatment",
        cleared: hasEvidenceReference(plan.dutiesAndTaxEvidenceUrl),
        evidenced: hasEvidenceReference(plan.dutiesAndTaxEvidenceUrl)
      },
      {
        label: "shipping promise",
        cleared: hasEvidenceReference(plan.shippingEvidenceUrl),
        evidenced: hasEvidenceReference(plan.shippingEvidenceUrl)
      },
      {
        label: "returns path",
        cleared: hasEvidenceReference(plan.returnsEvidenceUrl),
        evidenced: hasEvidenceReference(plan.returnsEvidenceUrl)
      },
      {
        label: "product-label and care compliance",
        cleared: hasEvidenceReference(plan.productComplianceEvidenceUrl),
        evidenced: hasEvidenceReference(plan.productComplianceEvidenceUrl)
      },
      {
        label: "privacy, SMS, and consent review",
        cleared: hasEvidenceReference(plan.privacyAndConsentEvidenceUrl),
        evidenced: hasEvidenceReference(plan.privacyAndConsentEvidenceUrl)
      },
      {
        label: "creator rights and disclosure controls",
        cleared: hasEvidenceReference(plan.creatorRightsEvidenceUrl),
        evidenced: hasEvidenceReference(plan.creatorRightsEvidenceUrl)
      },
      { label: "Shopify storefront ownership, attribution, and policy path", cleared: shopifyReady, evidenced: shopifyEvidence },
      { label: "TikTok ownership, attribution, and commercial-content policy path", cleared: tiktokReady, evidenced: tiktokEvidence },
      { label: "pop-up city, market, and permission plan", cleared: popupReady, evidenced: !popupRequired || hasEvidenceReference(plan.popupEvidenceUrl) }
    ];

    const violations = controls
      .filter(control => !control.cleared)
      .map(control => `Market entry: ${control.label} is unresolved.`);
    const score = Math.round((controls.filter(control => control.cleared).length / controls.length) * 100);
    const evidenceControls = controls.filter(control => control.label !== "primary market is named");
    const evidenceCoverage = Math.round((evidenceControls.filter(control => control.evidenced).length / evidenceControls.length) * 100);

    return {
      required: true,
      primaryMarket,
      operatingMarket,
      crossBorder,
      score,
      evidenceCoverage,
      goReady: violations.length === 0,
      violations
    };
  }

  function calculateStageMetrics(stages: StageScoreInput[]): StageMetrics {
    if (!stages.length) {
      return {
        score: 0,
        evidenceCoverage: 0,
        sequenceViolations: 0,
        blockedStages: 0,
        killedStages: 0,
        productionPrerequisitesCleared: false
      };
    }
    const ordered = stages
      .map((stage, index) => ({ stage, index }))
      .sort((left, right) => (left.stage.order ?? left.index) - (right.stage.order ?? right.index))
      .map(item => item.stage);
    const firstOpen = ordered.findIndex(stage => stage.status !== "done");
    const reached = firstOpen === -1 ? ordered : ordered.slice(0, firstOpen + 1);
    const scores = reached.map(stage => {
      const weighted = clamp(stage.score, 0, 100) * statusMultiplier(stage.status) * gateMultiplier(stage.gate);
      return hasEvidenceReference(stage.evidence) ? weighted : Math.min(weighted, 35);
    });
    let sequenceViolations = 0;
    ordered.forEach((stage, index) => {
      if (stage.status === "done" && ordered.slice(0, index).some(prior => prior.status !== "done")) {
        sequenceViolations += 1;
      }
    });
    const requiredForProduction = ordered.slice(0, Math.min(4, ordered.length));
    const productionPrerequisitesCleared = requiredForProduction.length > 0 && requiredForProduction.every(stage =>
      stage.status === "done" && stage.gate === "approve" && hasEvidenceReference(stage.evidence)
    );
    return {
      score: Math.round(average(scores)),
      evidenceCoverage: Math.round((reached.filter(stage => hasEvidenceReference(stage.evidence)).length / reached.length) * 100),
      sequenceViolations,
      blockedStages: reached.filter(stage => stage.status === "blocked").length,
      killedStages: reached.filter(stage => stage.gate === "kill").length,
      productionPrerequisitesCleared
    };
  }

  function calculateTacticMetrics(tactics: TacticScoreInput[]): TacticMetrics {
    const unique = deduplicateBy(tactics, tactic => String(tactic.id || tactic.name || "").trim().toLowerCase());
    if (!unique.length) return { score: 0, verifiedCount: 0, evidenceCoverage: 0, proofKeys: [] };
    let verifiedCount = 0;
    const proofKeys: string[] = [];
    const scores = unique.map(tactic => {
      const verified = tactic.status === "approved" && hasEvidenceReference(tactic.evidenceUrl);
      if (verified) {
        verifiedCount += 1;
        proofKeys.push(normalizeProofKey(tactic.evidenceUrl));
      }
      if (verified) return 100;
      if (tactic.status === "approved") return 35;
      if (tactic.status === "ready") return 30;
      return 0;
    });
    return {
      score: Math.round(average(scores)),
      verifiedCount,
      evidenceCoverage: Math.round(Math.min(1, verifiedCount / Math.min(3, unique.length)) * 100),
      proofKeys
    };
  }

  export function calculateEdgeExperimentMetrics(experiments: EdgeExperimentInput[]): EdgeExperimentMetrics {
    const unique = deduplicateBy(experiments, experiment =>
      String(experiment.id || `${experiment.tacticId || ""}:${experiment.name || ""}`).trim().toLowerCase()
    );
    if (!unique.length) {
      return {
        score: 0,
        learningScore: 0,
        evidenceCoverage: 0,
        validatedCount: 0,
        verifiedCompletedCount: 0,
        completedCount: 0,
        runningCount: 0,
        plannedCount: 0,
        totalSpend: 0,
        totalBudgetCap: 0,
        budgetStatus: "unknown",
        frontierSpendShare: 0,
        approvalViolations: 0,
        prerequisiteViolations: 0,
        redRiskViolations: 0,
        budgetViolations: 0,
        evidenceViolations: 0,
        validatedProofKeys: [],
        violations: []
      };
    }

    let validatedCount = 0;
    let verifiedCompletedCount = 0;
    let completedCount = 0;
    let runningCount = 0;
    let plannedCount = 0;
    let totalSpend = 0;
    let totalBudgetCap = 0;
    let frontierSpend = 0;
    let approvalViolations = 0;
    let prerequisiteViolations = 0;
    let redRiskViolations = 0;
    let budgetViolations = 0;
    let evidenceViolations = 0;
    const proofScores: number[] = [];
    const learningScores: number[] = [];
    const validatedProofKeys: string[] = [];
    const violations: string[] = [];

    unique.forEach((experiment, index) => {
      const id = String(experiment.id || experiment.tacticId || `experiment-${index + 1}`);
      const status = String(experiment.status || "planned").toLowerCase();
      const decision = String(experiment.decision || "pending").toLowerCase();
      const risk = normalizeRisk(experiment.risk);
      const completed = status === "completed";
      const decisionOutsideCompletion = !completed && decision !== "pending";
      const active = status === "running" || completed;
      const evidenceLinked = hasEvidenceReference(experiment.evidenceUrl);
      const resultRecorded = hasUsableValue(experiment.resultSummary);
      const verifiedCompleted = completed && evidenceLinked && resultRecorded && decision !== "pending";
      const prerequisites = experiment.prerequisites || [];
      const prerequisitesCleared = prerequisites.length > 0 && prerequisites.every(item => item.cleared === true);
      const needsApproval = risk === "Yellow" || risk === "Orange";
      const approvalCleared = !needsApproval || (
        experiment.approvalStatus === "approved" &&
        hasUsableValue(experiment.approvedBy) &&
        hasValidTimestamp(experiment.approvedAt)
      );
      const counselCleared = risk !== "Orange" || (
        experiment.counselReviewed === true && hasValidTimestamp(experiment.counselReviewedAt)
      );
      const effectiveEvidenceTier = experiment.sourceProvenanceVerified === true
        ? experiment.sourceEvidenceTier
        : "F";
      const spend = nonNegativeNumber(experiment.actualSpend) || 0;
      const cap = nonNegativeNumber(experiment.budgetCap);
      const qualifiedActions = nonNegativeNumber(experiment.qualifiedActions) || 0;
      const assetsEarned = nonNegativeNumber(experiment.assetsEarned) || 0;
      const assetsTarget = nonNegativeNumber(experiment.assetsTarget) || 2;

      totalSpend += spend;
      if (cap !== null) totalBudgetCap += cap;
      if (String(effectiveEvidenceTier || "").toUpperCase() === "F") frontierSpend += spend;
      if (status === "running") runningCount += 1;
      if (status === "planned" || status === "ready" || status === "blocked") plannedCount += 1;
      if (completed) completedCount += 1;
      if (verifiedCompleted) verifiedCompletedCount += 1;

      if (active && !prerequisitesCleared) {
        prerequisiteViolations += 1;
        violations.push(`${id}: active without a populated, fully cleared prerequisite checklist.`);
      }
      if (active && (!approvalCleared || !counselCleared)) {
        approvalViolations += 1;
        violations.push(`${id}: ${risk} risk requires recorded action-time approval${risk === "Orange" ? " and counsel review" : ""}.`);
      }
      if (active && risk === "Red") {
        redRiskViolations += 1;
        violations.push(`${id}: Red-risk experiment cannot run.`);
      }
      if (spend > 0 && (cap === null || spend > cap)) {
        budgetViolations += 1;
        violations.push(`${id}: actual spend ${formatCurrency(spend)} exceeds or lacks an approved experiment cap.`);
      }
      if (completed && !verifiedCompleted) {
        evidenceViolations += 1;
        violations.push(`${id}: completed decision needs a result summary, valid evidence reference, and decision.`);
      }
      if (decisionOutsideCompletion) {
        evidenceViolations += 1;
        violations.push(`${id}: decision ${decision} is invalid until status is completed.`);
      }

      if (!completed) return;
      if (!verifiedCompleted) {
        learningScores.push(10);
        return;
      }

      const learningBase = decision === "adopt" ? 100
        : decision === "adapt" ? 85
          : decision === "reject" ? 70
            : decision === "retest" ? 45
              : 20;
      learningScores.push(learningBase);

      const assetFloor = Math.min(2, Math.max(1, assetsTarget));
      const positiveDecision = decision === "adopt" || decision === "adapt";
      const validates = positiveDecision && qualifiedActions > 0 && assetsEarned >= assetFloor &&
        prerequisitesCleared && approvalCleared && counselCleared && risk !== "Red" &&
        !(spend > 0 && (cap === null || spend > cap));
      if (!validates) return;

      validatedCount += 1;
      validatedProofKeys.push(normalizeProofKey(experiment.evidenceUrl));
      const decisionScore = decision === "adopt" ? 100 : 82;
      proofScores.push(decisionScore * evidenceTierMultiplier(effectiveEvidenceTier));
    });

    const budgetStatus: BudgetStatus = budgetViolations > 0
      ? "over-cap"
      : totalBudgetCap > 0
        ? "within-cap"
        : "unknown";

    return {
      score: Math.round(average(proofScores)),
      learningScore: Math.round(average(learningScores)),
      evidenceCoverage: completedCount ? Math.round((verifiedCompletedCount / completedCount) * 100) : 0,
      validatedCount,
      verifiedCompletedCount,
      completedCount,
      runningCount,
      plannedCount,
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalBudgetCap: Math.round(totalBudgetCap * 100) / 100,
      budgetStatus,
      frontierSpendShare: totalSpend > 0 ? Math.round((frontierSpend / totalSpend) * 100) : 0,
      approvalViolations,
      prerequisiteViolations,
      redRiskViolations,
      budgetViolations,
      evidenceViolations,
      validatedProofKeys,
      violations
    };
  }

  export function calculateSignalHeat(signals: SignalScoreInput[]): number {
    const unique = deduplicateSignals(signals);
    if (!unique.length) return 0;
    const weighted = unique
      .map(signal => weightedSignalStrength(signal))
      .sort((left, right) => right - left)
      .slice(0, 3);
    const verified = unique.filter(signal => hasEvidenceReference(signal.evidenceUrl)).length;
    return Math.round(clamp(average(weighted) * 0.82 + Math.min(verified, 4) * 4.5, 0, 100));
  }

  export function scoreCitySignals(signals: SignalScoreInput[], cities?: string[]): CitySignalScore[] {
    const byCity = new Map<string, SignalScoreInput[]>();
    if (cities) cities.forEach(city => byCity.set(city, []));

    deduplicateSignals(signals).forEach(signal => {
      const city = signal.city || "Unknown";
      if (cities && !byCity.has(city)) return;
      if (!byCity.has(city)) byCity.set(city, []);
      byCity.get(city)?.push(signal);
    });

    return Array.from(byCity.entries()).map(([city, citySignals]) => {
      const values = citySignals.map(weightedSignalStrength);
      const verifiedCount = citySignals.filter(signal => hasEvidenceReference(signal.evidenceUrl)).length;
      return {
        city,
        score: citySignalScore(values, verifiedCount),
        count: citySignals.length,
        verifiedCount
      };
    });
  }

  export function getNextCitySignal(
    signals: SignalScoreInput[],
    homeCity = "Ottawa/Gatineau",
    fallbackCity = "Montreal"
  ): CitySignalScore {
    const cityScores = scoreCitySignals(signals).filter(city => city.count > 0);
    const expansionCities = cityScores.filter(city => city.city !== homeCity);
    return (expansionCities.length ? expansionCities : cityScores)
      .sort((left, right) => right.score - left.score || right.verifiedCount - left.verifiedCount || right.count - left.count)[0] ||
      { city: fallbackCity, score: 0, count: 0, verifiedCount: 0 };
  }

  function citySignalScore(values: number[], verifiedCount: number): number {
    if (!values.length) return 0;
    return Math.round(clamp(
      average(values) * 0.68 + Math.max(...values) * 0.17 + Math.min(verifiedCount, 4) * 4,
      0,
      100
    ));
  }

  function weightedSignalStrength(signal: SignalScoreInput): number {
    const strength = clamp(signal.strength, 0, 100);
    if (hasEvidenceReference(signal.evidenceUrl)) return strength;
    if (hasUsableValue(signal.source) && String(signal.source).toLowerCase() !== "team input") return strength * 0.35;
    return strength * 0.2;
  }

  function deduplicateSignals(signals: SignalScoreInput[]): SignalScoreInput[] {
    return deduplicateBy(signals, signal => {
      const evidence = String(signal.evidenceUrl || "").trim().toLowerCase();
      if (hasEvidenceReference(evidence)) return `proof:${evidence}`;
      return [signal.item, signal.city, signal.source]
        .map(value => String(value || "").trim().toLowerCase())
        .join("|");
    });
  }

  function deduplicateBy<T>(items: T[], keyFor: (item: T) => string): T[] {
    const seen = new Set<string>();
    return items.filter((item, index) => {
      const rawKey = keyFor(item);
      const key = rawKey || `index:${index}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function gateReasonFor(score: ScoreCore): string {
    if (score.hardStops.length) return score.hardStops.join(" ");
    const band = `${score.confidenceBand.low}-${score.confidenceBand.high}`;
    if (score.gate === "approve") {
      return `Readiness ${score.confidence}/100 (evidence band ${band}) clears every production, finance, campaign, operations, risk, and budget gate.`;
    }
    if (score.gate === "test") {
      return `Readiness ${score.confidence}/100 (evidence band ${band}) supports controlled proof tests only. Bulk remains locked: ${score.gateCaps[0] || "approval proof is incomplete"}`;
    }
    return `Readiness ${score.confidence}/100 (evidence band ${band}) is not ready for spend expansion. ${score.gateCaps[0] || `${score.bottleneck} needs stronger proof.`}`;
  }

  function spendAuthorizationFor(score: ScoreCore, reason: string): SpendAuthorization {
    if (score.gate === "approve") {
      return {
        level: "major-spend",
        label: "Production spend eligible",
        summary: `Bulk can move only inside the verified ${formatCurrency(score.productionSpendCap)} cap.`,
        reason,
        allowed: [
          "Bulk PO matching linked quotes, approved PP samples, units, and landed COGS",
          "Controlled media spend tied to verified campaign proof",
          "Launch commitments already represented in the operations checklist"
        ],
        blocked: [
          "Any PO above the active production cap",
          "Unquoted SKU changes or unsupported readiness claims"
        ]
      };
    }
    if (score.gate === "test") {
      return {
        level: "small-test",
        label: "Controlled tests only",
        summary: "Bulk is locked. Run bounded sample, content, fit, or city tests and attach the receipts.",
        reason,
        allowed: [
          "Quoted single-sample or correction order with an owner-approved cap",
          "Organic or small paid content proof test",
          "Fit relay, waitlist, or city signal test"
        ],
        blocked: [
          "Bulk production PO",
          "Large paid media or venue commitment",
          "Production-readiness claims"
        ]
      };
    }
    if (score.gate === "revise") {
      return {
        level: "proof-only",
        label: "Proof build only",
        summary: "No bulk or fixed launch commitments. Close the first evidence gap and rerun the gate.",
        reason,
        allowed: [
          "RFQs, vendor calls, and quote collection",
          "Unit/price/COGS model work",
          "Founder-approved one-off prototype needed to obtain fit or sample proof"
        ],
        blocked: [
          "Bulk production PO",
          "Large paid launch campaign",
          "Venue deposits or public readiness claims"
        ]
      };
    }
    return {
      level: "paused",
      label: "Hard pause",
      summary: "A hard risk, budget, or explicit kill condition blocks spend until it is resolved.",
      reason,
      allowed: ["Risk removal", "Budget correction", "Decision memo or kill review"],
      blocked: ["Sample deposits", "Bulk production", "Paid campaign spend", "Public readiness claims"]
    };
  }

  function buildScoreLevers(input: DropScoreInput, base: ScoreCore): ScoreLever[] {
    const candidates: Array<{
      id: string;
      label: string;
      owner: string;
      input: string;
      current: number;
      target: number;
      action: string;
      proofNeeded: string;
      mutate: (draft: DropScoreInput) => void;
    }> = [
      {
        id: "manufacturing-proof",
        label: "Close SKU truth",
        owner: "Product / production",
        input: "Manufacturing truth",
        current: base.manufacturingScore,
        target: 75,
        action: "Complete the quote, landed COGS, sample proof, and PP decision for every active SKU.",
        proofNeeded: "Linked supplier quote and sample/fit evidence per SKU; PP approval only after review.",
        mutate: draft => {
          (draft.products || []).forEach((product, index) => {
            product.manufacturing = {
              ...(product.manufacturing || {}),
              vendorName: product.manufacturing?.vendorName || "Proof target",
              quoteUrl: product.manufacturing?.quoteUrl || `https://proof.invalid/quote-${index}`,
              landedCogs: positiveNumber(product.manufacturing?.landedCogs) || 50,
              moq: positiveNumber(product.manufacturing?.moq) || 1,
              leadTimeDays: positiveNumber(product.manufacturing?.leadTimeDays) || 45,
              quoteDate: product.manufacturing?.quoteDate || "2026-01-01",
              sampleStage: "approved",
              sampleProofUrl: product.manufacturing?.sampleProofUrl || `https://proof.invalid/sample-${index}`,
              ppApproved: true
            };
          });
        }
      },
      {
        id: "financial-proof",
        label: "Lock the cash model",
        owner: "Founder / finance",
        input: "Financial proof",
        current: base.financialProofScore,
        target: 85,
        action: "Enter units, price, and landed COGS for every SKU and keep planned production inside the active cap.",
        proofNeeded: "Vendor-backed landed COGS plus founder-approved unit and price table.",
        mutate: draft => {
          const products = activeProducts(draft.products || []);
          const cap = positiveNumber(draft.productionSpendCap) || DEFAULT_PRODUCTION_SPEND_CAP;
          const targetCogs = Math.max(1, Math.floor(cap / Math.max(products.length, 1) / 2));
          products.forEach(product => {
            product.units = positiveNumber(product.units) || 1;
            product.price = positiveNumber(product.price) || targetCogs * 2;
            product.manufacturing = {
              ...(product.manufacturing || {}),
              landedCogs: positiveNumber(product.manufacturing?.landedCogs) || targetCogs
            };
          });
        }
      },
      {
        id: "campaign-proof",
        label: "Verify campaign proof",
        owner: "Campaign lead",
        input: "Campaign proof",
        current: base.tacticScore,
        target: 60,
        action: "Approve tactics only after the live clip, metric, or audience response is linked.",
        proofNeeded: "At least two distinct evidence links from consented content or measured response.",
        mutate: draft => {
          draft.tactics.slice(0, 3).forEach((tactic, index) => {
            tactic.status = "approved";
            tactic.evidenceUrl = tactic.evidenceUrl || `https://proof.invalid/campaign-${index}`;
          });
        }
      },
      {
        id: "edge-experiment-proof",
        label: "Close an Edge Lab loop",
        owner: "Growth / campaign",
        input: "Edge experiment proof",
        current: base.edgeScore,
        target: 60,
        action: "Finish a prerequisite-cleared experiment, attach the result receipt, and record adopt, adapt, retest, or reject.",
        proofNeeded: "Result summary, valid evidence link, qualified-action count, reusable assets, spend, approval, and unchanged threshold.",
        mutate: draft => {
          (draft.edgeExperiments || []).slice(0, 2).forEach((experiment, index) => {
            experiment.status = "completed";
            experiment.decision = "adapt";
            experiment.resultSummary = experiment.resultSummary || "Proof target completed with a qualified result.";
            experiment.evidenceUrl = experiment.evidenceUrl || `https://proof.invalid/edge-${index}`;
            experiment.qualifiedActions = positiveNumber(experiment.qualifiedActions) || 5;
            experiment.assetsEarned = positiveNumber(experiment.assetsEarned) || 2;
            experiment.approvalStatus = "approved";
            experiment.approvedBy = experiment.approvedBy || "Proof target";
            experiment.approvedAt = experiment.approvedAt || "2026-01-01";
            experiment.counselReviewed = true;
            experiment.counselReviewedAt = experiment.counselReviewedAt || "2026-01-01";
            experiment.prerequisites = (experiment.prerequisites || []).map(item => ({ ...item, cleared: true }));
          });
        }
      },
      {
        id: "verified-signals",
        label: "Verify buyer pull",
        owner: "Signal lead",
        input: "Verified demand",
        current: base.signalHeat,
        target: 70,
        action: "Replace self-rated heat with distinct, linked buy-intent or city-demand evidence.",
        proofNeeded: "Three unique proof links: DMs, waitlist analytics, saves/shares, RSVPs, or purchase intent.",
        mutate: draft => {
          for (let index = 0; index < 3; index += 1) {
            draft.signals.push({
              id: `proof-target-${index}`,
              item: `Verified demand ${index + 1}`,
              city: index === 2 ? "Montreal" : "Ottawa/Gatineau",
              source: "Linked evidence",
              strength: 72,
              evidenceUrl: `https://proof.invalid/signal-${index}`
            });
          }
        }
      },
      {
        id: "launch-ops",
        label: "Clear launch operations",
        owner: "Ops / ecommerce",
        input: "Launch operations",
        current: base.operationsEffective,
        target: 70,
        action: "Clear the checklist items that block a clean open online drop.",
        proofNeeded: "Storefront, policies, size guide, analytics, email/SMS, and inventory-state checks.",
        mutate: draft => { draft.operationsEffective = Math.max(clamp(draft.operationsEffective, 0, 100), 75); }
      },
      {
        id: "stage-integrity",
        label: "Clear the reached gate",
        owner: "Current milestone owner",
        input: "Stage integrity",
        current: base.stageScore,
        target: 70,
        action: "Resolve the first unfinished or blocked stage and attach the deciding artifact.",
        proofNeeded: "Gate score, decision, owner, next action, and evidence reference.",
        mutate: draft => {
          const stage = draft.stages.find(item => item.status !== "done") || draft.stages[0];
          if (!stage) return;
          stage.status = "done";
          stage.gate = "approve";
          stage.score = Math.max(clamp(stage.score, 0, 100), 80);
          stage.evidence = stage.evidence || "docs/proof-target.md";
        }
      },
      {
        id: "risk-control",
        label: "Reduce risk pressure",
        owner: "Founder / ops",
        input: "Risk pressure",
        current: base.riskPressure,
        target: 55,
        action: "Remove or own the risk item that blocks the next spend decision.",
        proofNeeded: "Named owner, mitigation, compliance note, or decision to defer the risky move.",
        mutate: draft => { draft.stress.risk = Math.min(clamp(draft.stress.risk, 0, 100), 55); }
      }
    ];

    return candidates
      .map(candidate => {
        const draft = cloneInput(input);
        candidate.mutate(draft);
        const projected = calculateCore(draft);
        return {
          id: candidate.id,
          label: candidate.label,
          owner: candidate.owner,
          input: candidate.input,
          current: Math.round(candidate.current),
          target: Math.round(candidate.target),
          projectedConfidence: projected.confidence,
          deltaConfidence: projected.confidence - base.confidence,
          projectedGate: projected.gate,
          action: candidate.action,
          proofNeeded: candidate.proofNeeded
        };
      })
      .filter(lever => lever.deltaConfidence > 0 || lever.current < lever.target)
      .sort((left, right) => right.deltaConfidence - left.deltaConfidence || left.current - right.current)
      .slice(0, 5);
  }

  function cloneInput(input: DropScoreInput): DropScoreInput {
    return {
      stress: { ...(input.stress || {}) },
      stages: (input.stages || []).map(stage => ({ ...stage })),
      tactics: (input.tactics || []).map(tactic => ({ ...tactic })),
      signals: (input.signals || []).map(signal => ({ ...signal })),
      operationsEffective: clamp(input.operationsEffective, 0, 100),
      productProofScore: clamp(input.productProofScore, 0, 100),
      products: (input.products || []).map(product => ({
        ...product,
        manufacturing: { ...(product.manufacturing || {}) }
      })),
      productionSpendCap: positiveNumber(input.productionSpendCap) || DEFAULT_PRODUCTION_SPEND_CAP,
      edgeExperiments: (input.edgeExperiments || []).map(experiment => ({
        ...experiment,
        prerequisites: (experiment.prerequisites || []).map(item => ({ ...item }))
      })),
      marketEntry: input.marketEntry
        ? { ...input.marketEntry, channels: (input.marketEntry.channels || []).map(channel => ({ ...channel })) }
        : undefined
    };
  }

  function legacyManufacturingProof(productProofScore: unknown): ManufacturingProofOutput {
    const score = clamp(productProofScore, 0, 100);
    return {
      score,
      referenceCoverage: 0,
      bulkReady: false,
      bulkReadySkuCount: 0,
      activeSkuCount: 0
    };
  }

  function campaignBandFor(index: number): CampaignBand {
    if (index >= 75) return "strong";
    if (index >= 55) return "promising";
    if (index >= 35) return "early";
    return "insufficient";
  }

  function activeProducts(products: ProductScoreInput[]): ProductScoreInput[] {
    return products.filter(product => product.active !== false);
  }

  function findActiveMarketChannel(channels: MarketChannelInput[], platform: string): MarketChannelInput | undefined {
    const normalizedPlatform = platform.toLowerCase();
    return channels.find(channel =>
      channel.active === true && String(channel.platform || "").trim().toLowerCase().includes(normalizedPlatform)
    );
  }

  function channelIsReady(channel?: MarketChannelInput): boolean {
    return Boolean(channel &&
      hasUsableValue(channel.owner) &&
      hasUsableValue(channel.commerceRoute) &&
      hasEvidenceReference(channel.measurementEvidenceUrl) &&
      hasEvidenceReference(channel.policyEvidenceUrl)
    );
  }

  function normalizeMarketName(value: unknown): string {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\b(the|of)\b/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  function isUnitedStatesMarket(value: unknown): boolean {
    const normalized = normalizeMarketName(value);
    return normalized === "unitedstates" || normalized === "us" || normalized === "usa";
  }

  function positiveNumber(value: unknown): number | null {
    if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
    const match = String(value || "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    if (!match) return null;
    const numeric = Number(match[0]);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  }

  function nonNegativeNumber(value: unknown): number | null {
    if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? value : null;
    const normalized = String(value ?? "").trim();
    if (!normalized) return null;
    const match = normalized.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    if (!match) return null;
    const numeric = Number(match[0]);
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
  }

  function normalizeRisk(value: unknown): GrowthRisk {
    const normalized = String(value || "").toLowerCase();
    if (normalized === "green") return "Green";
    if (normalized === "yellow") return "Yellow";
    if (normalized === "orange") return "Orange";
    if (normalized === "red") return "Red";
    return "Orange";
  }

  function evidenceTierMultiplier(value: unknown): number {
    const tier = String(value || "F").toUpperCase();
    if (tier === "A") return 0.95;
    if (tier === "B") return 0.9;
    if (tier === "C") return 0.85;
    return 0.75;
  }

  function hasUsableValue(value: unknown): boolean {
    const normalized = String(value || "").trim();
    return Boolean(normalized) && !/^(tbd|none|n\/a|unknown|unresolved|â€”|-)$/i.test(normalized);
  }

  function hasValidTimestamp(value: unknown): boolean {
    return hasUsableValue(value) && Number.isFinite(Date.parse(String(value)));
  }

  function normalizeProofKey(value: unknown): string {
    return String(value || "").trim().toLowerCase();
  }

  function formatCurrency(value: number | null): string {
    if (value === null || !Number.isFinite(value)) return "an unresolved amount";
    return `C$${Math.round(value).toLocaleString("en-CA")}`;
  }

  function normalizeStress(stress: Partial<StressInput>): StressInput {
    return {
      demand: clamp(stress.demand, 0, 100),
      product: clamp(stress.product, 0, 100),
      campaign: clamp(stress.campaign, 0, 100),
      operations: clamp(stress.operations, 0, 100),
      margin: clamp(stress.margin, 0, 100),
      evidence: clamp(stress.evidence, 0, 100),
      risk: clamp(stress.risk, 0, 100)
    };
  }

  function coerceNumber(value: unknown): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }
}
