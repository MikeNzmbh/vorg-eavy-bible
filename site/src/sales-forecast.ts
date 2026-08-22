namespace VorgSalesForecast {
  export type ForecastStatus = "blocked" | "scenario" | "evidence-anchored" | "synthetic-test";
  export type EvidenceMode = "live" | "synthetic";
  export type ForecastPriorProfile = "internal-weak" | "public-transfer-v1";
  export type CalibrationStatus = "uncalibrated" | "first-outcome" | "early" | "provisional" | "calibrated" | "needs-work";

  export interface ExternalPriorInput {
    id?: unknown;
    modelVersion?: unknown;
    checkedOn?: unknown;
    directConversionStrength?: unknown;
    refundStrength?: unknown;
    sourceUrls?: unknown;
  }

  export interface ForecastVariantInput {
    id?: string;
    label: string;
    inventory: unknown;
    weight?: unknown;
  }

  export interface ForecastProductInput {
    id: string;
    name: string;
    active?: boolean;
    inventory: unknown;
    price: unknown;
    landedCogs?: unknown;
    weight?: unknown;
    variants?: ForecastVariantInput[];
  }

  export interface FunnelObservationInput {
    sessions?: unknown;
    productViews?: unknown;
    addsToCart?: unknown;
    checkouts?: unknown;
    purchases?: unknown;
    unitsPurchased?: unknown;
    refunds?: unknown;
    popupVisitors?: unknown;
    popupPurchases?: unknown;
  }

  export interface ForecastInput {
    asOf?: string;
    dropId?: string;
    horizonDays?: unknown;
    plannedOnlineSessions?: unknown;
    plannedPopupVisitors?: unknown;
    plannedOnlineConversionRate?: unknown;
    unitsPerOrderAssumption?: unknown;
    committedNonInventorySpend?: unknown;
    onlineConversionStressMultiplier?: unknown;
    evidenceMode?: unknown;
    priorProfile?: unknown;
    externalPrior?: ExternalPriorInput;
    reservations?: unknown;
    reservationConversionRate?: unknown;
    trafficEvidenceUrl?: string;
    trafficEvidenceClass?: unknown;
    funnelEvidenceUrl?: string;
    reservationEvidenceUrl?: string;
    productionSpendCap?: unknown;
    observed?: FunnelObservationInput;
    products?: ForecastProductInput[];
    simulations?: unknown;
    seed?: unknown;
  }

  export interface Percentiles {
    p10: number;
    p50: number;
    p90: number;
  }

  export interface ForecastRateOutput {
    key: string;
    label: string;
    mean: number;
    evidence: "prior" | "external" | "observed" | "synthetic";
    successes: number;
    trials: number;
  }

  export interface ForecastVariantOutput {
    id: string;
    label: string;
    inventory: number;
    demand: Percentiles;
    sold: Percentiles;
    stockoutProbability: number;
  }

  export interface ForecastProductOutput {
    id: string;
    name: string;
    inventory: number;
    price: number;
    landedCogs: number | null;
    demand: Percentiles;
    sold: Percentiles;
    onlineSold: Percentiles;
    popupSold: Percentiles;
    revenue: Percentiles;
    grossProfit: Percentiles | null;
    sellThrough: Percentiles;
    stockoutProbability: number;
    excessInventory: Percentiles;
    lostDemand: Percentiles;
    variants: ForecastVariantOutput[];
  }

  export interface ForecastSummaryOutput {
    revenue: Percentiles;
    grossProfit: Percentiles | null;
    demandUnits: Percentiles;
    soldUnits: Percentiles;
    onlineSoldUnits: Percentiles;
    popupSoldUnits: Percentiles;
    sellThrough: Percentiles;
    excessInventory: Percentiles;
    lostDemand: Percentiles;
    sellThrough50Probability: number;
    sellThrough70Probability: number;
    sellThrough90Probability: number;
    sellThrough85Probability: number;
    sellThrough100Probability: number;
    anyStockoutProbability: number;
    inventoryRetailValue: number;
    inventoryCost: number | null;
    merchandiseCashRecovery: Percentiles | null;
    inventoryCashRecoveryProbability: number | null;
    committedNonInventorySpend: number;
    committedLaunchCash: Percentiles | null;
    launchCashRecoveryProbability: number | null;
  }

  export interface ForecastOutput {
    version: string;
    priorVersion: string;
    priorProfile: ForecastPriorProfile;
    asOf: string;
    dropId: string;
    horizonDays: number;
    status: ForecastStatus;
    evidenceMode: EvidenceMode;
    dataCompleteness: number;
    simulations: number;
    seed: number;
    unitsPerOrder: number;
    onlineConversionMode: "funnel" | "planning-prior";
    summary: ForecastSummaryOutput;
    products: ForecastProductOutput[];
    rates: ForecastRateOutput[];
    errors: string[];
    warnings: string[];
    assumptions: string[];
  }

  export interface ForecastSnapshotInput {
    id?: string;
    dropId?: string;
    frozenAt?: string;
    forecast?: ForecastOutput;
    actual?: {
      revenue?: unknown;
      unitsSold?: unknown;
      sellThroughPct?: unknown;
      evidenceUrl?: string;
    };
  }

  export interface StressScenarioOutput {
    key: "traffic-miss" | "popup-cancelled" | "cost-overrun" | "combined-downside" | "upside";
    label: string;
    description: string;
    forecast: ForecastOutput;
  }

  export interface CalibrationOutput {
    status: CalibrationStatus;
    completedForecasts: number;
    uniqueDrops: number;
    revenueWape: number | null;
    unitsWape: number | null;
    revenueCoverage80: number | null;
    unitsCoverage80: number | null;
    revenueMedianBias: number | null;
    sellThrough70Brier: number | null;
    warnings: string[];
  }

  interface NormalizedVariant {
    id: string;
    label: string;
    inventory: number;
    weight: number;
  }

  interface NormalizedProduct {
    id: string;
    name: string;
    inventory: number;
    price: number;
    landedCogs: number | null;
    weight: number;
    variants: NormalizedVariant[];
    inventoryProvided: boolean;
  }

  interface BetaModel {
    a: number;
    b: number;
    successes: number;
    trials: number;
  }

  interface NormalizedExternalPrior {
    id: "public-transfer-v1";
    modelVersion: string;
    checkedOn: string;
    directConversionStrength: number;
    refundStrength: number;
    sourceUrls: string[];
  }

  interface ProductAccumulator {
    demand: number[];
    sold: number[];
    onlineSold: number[];
    popupSold: number[];
    revenue: number[];
    grossProfit: number[];
    sellThrough: number[];
    excessInventory: number[];
    lostDemand: number[];
    stockouts: number;
    variants: Array<{
      demand: number[];
      sold: number[];
      stockouts: number;
    }>;
  }

  export const FORECAST_VERSION = "VORG Sales Forecast v1.1";
  export const PRIOR_VERSION = "VORG cold-start priors 2026-07.1";
  const INTERNAL_DIRECT_PRIOR_STRENGTH = 20;
  const PUBLIC_TRANSFER_V1 = Object.freeze({
    id: "public-transfer-v1",
    modelVersion: "VORG public-data transfer priors v1.0",
    checkedOn: "2026-07-25",
    directConversionStrength: 7.75785,
    refundStrength: 4,
    sourceUrls: Object.freeze([
      "https://archive.ics.uci.edu/dataset/468/online+shoppers+purchasing+intention+dataset",
      "https://archive.ics.uci.edu/dataset/352/online+retail",
      "https://archive.ics.uci.edu/dataset/553/clickstream+data+for+online+shopping"
    ])
  });

  // Internal cold-start policy, not a universal ecommerce benchmark. These
  // priors are deliberately weak so first-party observations can move them.
  export const DEFAULT_PRIORS = Object.freeze({
    sessionToView: Object.freeze({ a: 2, b: 3 }),
    viewToCart: Object.freeze({ a: 1, b: 9 }),
    cartToCheckout: Object.freeze({ a: 2, b: 3 }),
    checkoutToPurchase: Object.freeze({ a: 2, b: 3 }),
    refundRate: Object.freeze({ a: 1, b: 19 }),
    popupPurchaseRate: Object.freeze({ a: 1.5, b: 8.5 })
  });

  export function hasEvidenceReference(value: unknown): boolean {
    const reference = String(value || "").trim();
    if (!reference || /^(tbd|none|n\/a|unknown|unresolved|-)$/i.test(reference)) return false;
    const webReference = /^https?:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(reference);
    const repoReference = /^(?:\.\.?[\\/]|[\\/])?[a-z0-9_.-]+(?:[\\/][a-z0-9_. -]+)+$/i.test(reference);
    return webReference || repoReference;
  }

  export function isSyntheticEvidenceReference(value: unknown): boolean {
    const reference = String(value || "").trim();
    if (/^synthetic:\/\//i.test(reference)) return true;
    return /(^|[\\/])synthetic(?:[-_](?:forecast|test|fixture|evidence))?(?:[\\/]|$)/i.test(reference);
  }

  function normalizeExternalPrior(input: ExternalPriorInput | undefined, errors: string[]): NormalizedExternalPrior | null {
    if (!input || String(input.id || "").trim() !== "public-transfer-v1") {
      errors.push("Public-transfer prior requires the canonical public-transfer-v1 artifact.");
      return null;
    }
    const modelVersion = String(input.modelVersion || "").trim();
    const checkedOn = String(input.checkedOn || "").trim();
    const directConversionStrength = numberOrNull(input.directConversionStrength);
    const refundStrength = numberOrNull(input.refundStrength);
    const sourceUrls = Array.isArray(input.sourceUrls)
      ? input.sourceUrls.map(value => String(value || "").trim()).filter(Boolean)
      : [];
    if (modelVersion !== PUBLIC_TRANSFER_V1.modelVersion) {
      errors.push("Public-transfer prior model version does not match the engine-approved artifact.");
    }
    if (checkedOn !== PUBLIC_TRANSFER_V1.checkedOn) {
      errors.push("Public-transfer prior checked-on date does not match the engine-approved artifact.");
    }
    if (directConversionStrength === null || Math.abs(directConversionStrength - PUBLIC_TRANSFER_V1.directConversionStrength) > 1e-9) {
      errors.push("Public-transfer conversion strength does not match the engine-approved artifact.");
    }
    if (refundStrength === null || Math.abs(refundStrength - PUBLIC_TRANSFER_V1.refundStrength) > 1e-9) {
      errors.push("Public-transfer refund strength does not match the engine-approved artifact.");
    }
    const uniqueSources = [...new Set(sourceUrls)];
    if (uniqueSources.length !== PUBLIC_TRANSFER_V1.sourceUrls.length ||
      PUBLIC_TRANSFER_V1.sourceUrls.some(url => !uniqueSources.includes(url))) {
      errors.push("Public-transfer source records do not match the engine-approved artifact.");
    }
    if (errors.length || directConversionStrength === null || refundStrength === null) return null;
    return {
      id: "public-transfer-v1",
      modelVersion,
      checkedOn,
      directConversionStrength,
      refundStrength,
      sourceUrls
    };
  }

  export function calculateForecast(input: ForecastInput): ForecastOutput {
    const errors: string[] = [];
    const warnings: string[] = [];
    const assumptions: string[] = [
      "Reservations act as a demand floor so they are not added twice to online-funnel demand.",
      "Sales are capped by recorded inventory; demand above inventory is reported as lost demand.",
      "P10/P50/P90 are simulation quantiles, not guarantees or statistical confidence claims."
    ];
    const requestedPriorProfile = String(input.priorProfile || "internal-weak").trim().toLowerCase();
    if (!["internal-weak", "public-transfer-v1"].includes(requestedPriorProfile)) {
      errors.push("Prior profile must be internal-weak or public-transfer-v1.");
    }
    const priorProfile: ForecastPriorProfile = requestedPriorProfile === "public-transfer-v1"
      ? "public-transfer-v1"
      : "internal-weak";
    const externalPrior = priorProfile === "public-transfer-v1"
      ? normalizeExternalPrior(input.externalPrior, errors)
      : null;
    const priorVersion = externalPrior
      ? `${PRIOR_VERSION} + ${externalPrior.modelVersion}`
      : PRIOR_VERSION;
    if (externalPrior) {
      assumptions.push("Public company data shapes cold-start uncertainty only; the entered VORG planning rate remains the conversion center.");
      warnings.push(`External public-data transfer profile ${externalPrior.modelVersion} is active. It contributes zero VORG proof, readiness, or calibration credit.`);
    } else {
      assumptions.push("Cold-start priors are internal policy, not external conversion benchmarks.");
    }
    const requestedEvidenceMode = String(input.evidenceMode || "live").trim().toLowerCase();
    if (!["live", "synthetic"].includes(requestedEvidenceMode)) {
      errors.push("Evidence mode must be live or synthetic.");
    }
    const horizonDays = integerInRange(input.horizonDays, 1, 90, 30);
    const simulations = integerInRange(input.simulations, 500, 10000, 3000);
    const seed = integerInRange(input.seed, 1, 2147483646, 260722);
    const plannedOnlineSessions = validatedNonNegativeInteger(input.plannedOnlineSessions, "Planned online sessions", errors);
    const plannedPopupVisitors = validatedNonNegativeInteger(input.plannedPopupVisitors, "Planned pop-up visitors", errors);
    const reservations = validatedNonNegativeInteger(input.reservations, "Reservations", errors);
    const plannedOnlineConversionInput = numberOrNull(input.plannedOnlineConversionRate);
    const plannedOnlineConversionProvided = hasEnteredValue(input.plannedOnlineConversionRate);
    if (plannedOnlineConversionProvided &&
      (plannedOnlineConversionInput === null || plannedOnlineConversionInput <= 0 || plannedOnlineConversionInput > 100)) {
      errors.push("Planned online conversion assumption must be greater than 0 and no more than 100 percent.");
    }
    const plannedOnlineConversionRate = plannedOnlineConversionProvided && plannedOnlineConversionInput !== null
      ? clampNumber(plannedOnlineConversionInput, 0.01, 100) / 100
      : null;
    const unitsPerOrderInput = numberOrNull(input.unitsPerOrderAssumption);
    if (hasEnteredValue(input.unitsPerOrderAssumption) &&
      (unitsPerOrderInput === null || unitsPerOrderInput < 1 || unitsPerOrderInput > 4)) {
      errors.push("Units per order assumption must be between 1 and 4.");
    }
    const unitsPerOrderAssumption = clampNumber(unitsPerOrderInput ?? 1.05, 1, 4);
    const committedSpendInput = numberOrNull(input.committedNonInventorySpend);
    if (hasEnteredValue(input.committedNonInventorySpend) && (committedSpendInput === null || committedSpendInput < 0)) {
      errors.push("Committed non-inventory spend must be a non-negative amount.");
    }
    const committedNonInventorySpend = Math.max(0, committedSpendInput ?? 0);
    const conversionStressInput = numberOrNull(input.onlineConversionStressMultiplier);
    if (hasEnteredValue(input.onlineConversionStressMultiplier) &&
      (conversionStressInput === null || conversionStressInput < 0.01 || conversionStressInput > 3)) {
      errors.push("Online conversion stress multiplier must be between 0.01 and 3.");
    }
    const onlineConversionStressMultiplier = clampNumber(conversionStressInput ?? 1, 0.01, 3);
    const reservationRateInput = numberOrNull(input.reservationConversionRate);
    if (String(input.reservationConversionRate ?? "").trim() &&
      (reservationRateInput === null || reservationRateInput < 0 || reservationRateInput > 100)) {
      errors.push("Reservation conversion assumption must be between 0 and 100 percent.");
    }
    const reservationRate = clampNumber(reservationRateInput ?? 60, 0, 100) / 100;
    const observed = normalizeObserved(input.observed || {}, errors);
    const products = normalizeProducts(input.products || [], errors, warnings);
    const totalInventory = products.reduce((sum, product) => sum + product.inventory, 0);
    const inventoryRetailValue = products.reduce((sum, product) => sum + product.inventory * product.price, 0);
    const hasCompleteCosts = products.length > 0 && products.every(product => product.landedCogs !== null);
    const inventoryCost = hasCompleteCosts
      ? products.reduce((sum, product) => sum + product.inventory * (product.landedCogs as number), 0)
      : null;
    const productionSpendCap = numberOrNull(input.productionSpendCap);

    if (!products.length) errors.push("At least one active product with inventory and price is required.");
    if (products.length && totalInventory <= 0) errors.push("Recorded active inventory must be greater than zero.");
    if (plannedOnlineSessions + plannedPopupVisitors + reservations <= 0) {
      errors.push("Add planned online sessions, pop-up visitors, or reservations before forecasting demand.");
    }

    const trafficReference = hasEvidenceReference(input.trafficEvidenceUrl);
    const syntheticReference = [input.trafficEvidenceUrl, input.funnelEvidenceUrl, input.reservationEvidenceUrl]
      .some(isSyntheticEvidenceReference);
    const evidenceMode: EvidenceMode = requestedEvidenceMode === "synthetic" || syntheticReference ? "synthetic" : "live";
    const trafficEvidenceClass = String(input.trafficEvidenceClass || "plan").trim().toLowerCase();
    if (trafficReference && !["plan", "historical"].includes(trafficEvidenceClass)) {
      errors.push("Traffic proof type must be plan or historical.");
    }
    const trafficEvidence = trafficReference && trafficEvidenceClass === "historical";
    const funnelEvidence = hasEvidenceReference(input.funnelEvidenceUrl);
    const reservationEvidence = reservations === 0 || hasEvidenceReference(input.reservationEvidenceUrl);
    const hasObservedFunnel = observed.sessions > 0 && ["sessions", "productViews", "addsToCart", "checkouts", "purchases"]
      .every(key => observed.provided[key as keyof FunnelObservationInput]);
    const evidenceAnchored = trafficEvidence && funnelEvidence && reservationEvidence && hasObservedFunnel;
    const onlineConversionMode = !hasObservedFunnel && plannedOnlineConversionRate !== null
      ? "planning-prior" as const
      : "funnel" as const;

    if (!trafficReference) warnings.push("Planned traffic has no linked plan or historical receipt; traffic uncertainty is widened.");
    else if (!trafficEvidence) warnings.push("Planned traffic has a linked plan but no historical receipt; it remains a scenario input and receives wider uncertainty.");
    if (!hasObservedFunnel) warnings.push("No complete observed VORG core funnel is recorded; missing transitions use weak cold-start priors.");
    else if (!funnelEvidence) warnings.push("Observed funnel counts have no proof reference and remain scenario inputs.");
    if (reservations > 0 && !reservationEvidence) warnings.push("Reservations have no receipt and remain an assumption.");
    if (evidenceMode === "synthetic") {
      warnings.push("Synthetic evidence mode is active. These generated records test the engine and contribute zero launch proof, readiness, or live calibration.");
      assumptions.push("All evidence and observed counts in this run are synthetic test fixtures unless replaced and reclassified under a new live forecast.");
    }
    if (onlineConversionMode === "planning-prior") {
      const hasSessionPurchasePair = Boolean(observed.provided.sessions && observed.provided.purchases && observed.sessions > 0);
      if (hasSessionPurchasePair) {
        warnings.push("Observed session and purchase counts updated the session-to-purchase planning prior. This is not a complete funnel, not evidence-anchored status, and not readiness or calibration credit.");
        assumptions.push(`Online session-to-purchase planning prior starts at ${round((plannedOnlineConversionRate as number) * 100, 2)}% and is updated with ${observed.purchases}/${observed.sessions} first-party orders/sessions.`);
      } else {
        warnings.push("Online orders use the entered session-to-purchase planning prior; it is not observed VORG conversion.");
        assumptions.push(`Online session-to-purchase planning prior: ${round((plannedOnlineConversionRate as number) * 100, 2)}%.`);
      }
    } else if (plannedOnlineConversionRate !== null && hasObservedFunnel) {
      warnings.push("The entered online conversion assumption is ignored because a complete observed funnel is available.");
    }
    if (externalPrior && onlineConversionMode !== "planning-prior") {
      warnings.push("The external session-purchase uncertainty model is inactive because no direct planning rate is controlling; first-party funnel counts or internal stage priors remain controlling.");
    }
    if (products.some(product => product.landedCogs === null)) {
      warnings.push("One or more landed COGS values are missing; gross-profit forecast is withheld.");
    }
    if (inventoryCost !== null && productionSpendCap !== null && productionSpendCap > 0 && inventoryCost > productionSpendCap) {
      warnings.push(`Planned inventory cost ${round(inventoryCost, 2)} exceeds the active production cap ${round(productionSpendCap, 2)}; readiness authorization remains controlling.`);
    }
    if (committedNonInventorySpend > 0) {
      assumptions.push(`Committed non-inventory launch spend: ${round(committedNonInventorySpend, 2)}.`);
    }
    if (onlineConversionStressMultiplier !== 1) {
      assumptions.push(`Purchase-conversion sensitivity multiplier: ${round(onlineConversionStressMultiplier, 3)}x; stress-test only, not evidence.`);
    }
    if (products.some(product => !product.variants.length)) {
      warnings.push("At least one product has no size inventory; its stockout forecast is SKU-level only.");
    }

    const rates = buildRateModels(
      observed,
      reservationRate,
      hasEvidenceReference(input.reservationEvidenceUrl),
      unitsPerOrderAssumption,
      plannedOnlineConversionRate,
      onlineConversionMode === "planning-prior",
      externalPrior
    );
    const rateOutputs = rateSummary(rates).map(rate => {
      if (evidenceMode === "synthetic") return { ...rate, evidence: "synthetic" as const };
      if (externalPrior && rate.evidence === "prior" && ["plannedSessionPurchase", "refundRate"].includes(rate.key)) {
        return { ...rate, evidence: "external" as const };
      }
      return rate;
    });
    const dataCompleteness = completenessScore({
      products,
      plannedOnlineSessions,
      plannedPopupVisitors,
      reservations,
      observed,
      trafficEvidence,
      funnelEvidence,
      reservationEvidence
    });

    if (errors.length) {
      return blockedOutput(input, horizonDays, simulations, seed, dataCompleteness, rates.unitsPerOrder, onlineConversionMode, evidenceMode, priorProfile, priorVersion, rateOutputs, errors, warnings, assumptions);
    }

    const rng = mulberry32(seed);
    const trafficCv = trafficEvidence ? 0.25 : trafficReference ? 0.35 : 0.45;
    const popupTrafficCv = trafficEvidence ? 0.3 : trafficReference ? 0.4 : 0.5;
    const productWeights = products.map(product => product.weight);
    const totalRevenue: number[] = [];
    const totalProfit: number[] = [];
    const totalDemand: number[] = [];
    const totalSold: number[] = [];
    const totalOnlineSold: number[] = [];
    const totalPopupSold: number[] = [];
    const totalSellThrough: number[] = [];
    const totalExcess: number[] = [];
    const totalLostDemand: number[] = [];
    let sellThrough50 = 0;
    let sellThrough70 = 0;
    let sellThrough90 = 0;
    let sellThrough85 = 0;
    let sellThrough100 = 0;
    let anyStockout = 0;
    let inventoryCashRecovered = 0;
    let launchCashRecovered = 0;
    const productAccumulators: ProductAccumulator[] = products.map(product => ({
      demand: [],
      sold: [],
      onlineSold: [],
      popupSold: [],
      revenue: [],
      grossProfit: [],
      sellThrough: [],
      excessInventory: [],
      lostDemand: [],
      stockouts: 0,
      variants: product.variants.map(() => ({ demand: [], sold: [], stockouts: 0 }))
    }));

    for (let iteration = 0; iteration < simulations; iteration += 1) {
      const sessions = plannedOnlineSessions > 0
        ? Math.max(0, Math.round(sampleLogNormalMean(plannedOnlineSessions, trafficCv, rng)))
        : 0;
      const popupVisitors = plannedPopupVisitors > 0
        ? Math.max(0, Math.round(sampleLogNormalMean(plannedPopupVisitors, popupTrafficCv, rng)))
        : 0;
      const sessionToView = sampleBeta(rates.sessionToView.a, rates.sessionToView.b, rng);
      const viewToCart = sampleBeta(rates.viewToCart.a, rates.viewToCart.b, rng);
      const cartToCheckout = sampleBeta(rates.cartToCheckout.a, rates.cartToCheckout.b, rng);
      const checkoutToPurchase = sampleBeta(rates.checkoutToPurchase.a, rates.checkoutToPurchase.b, rng);
      const refundRateSample = sampleBeta(rates.refundRate.a, rates.refundRate.b, rng);
      const popupPurchaseRate = sampleBeta(rates.popupPurchaseRate.a, rates.popupPurchaseRate.b, rng);
      const reservationConversion = sampleBeta(rates.reservationConversion.a, rates.reservationConversion.b, rng);

      const futureViews = sampleBinomial(sessions, sessionToView, rng);
      const futureCarts = sampleBinomial(futureViews, viewToCart, rng);
      const futureCheckouts = sampleBinomial(futureCarts, cartToCheckout, rng);
      const onlineOrders = rates.useDirectPlanningRate && rates.plannedSessionPurchase
        ? sampleBinomial(sessions, clampNumber(sampleBeta(rates.plannedSessionPurchase.a, rates.plannedSessionPurchase.b, rng) * onlineConversionStressMultiplier, 0, 1), rng)
        : sampleBinomial(futureCheckouts, clampNumber(checkoutToPurchase * onlineConversionStressMultiplier, 0, 1), rng);
      const extraUnitLambda = Math.max(0, rates.unitsPerOrder - 1) * onlineOrders;
      const onlineGrossUnits = onlineOrders + samplePoisson(extraUnitLambda, rng);
      const onlineNetUnits = Math.max(0, onlineGrossUnits - sampleBinomial(onlineGrossUnits, refundRateSample, rng));
      const reservationFloor = sampleBinomial(reservations, reservationConversion, rng);
      const onlineDemandUnits = Math.max(onlineNetUnits, reservationFloor);

      const popupOrders = sampleBinomial(popupVisitors, popupPurchaseRate, rng);
      const popupExtraUnits = samplePoisson(Math.max(0, rates.unitsPerOrder - 1) * popupOrders, rng);
      const popupGrossUnits = popupOrders + popupExtraUnits;
      const popupDemandUnits = Math.max(0, popupGrossUnits - sampleBinomial(popupGrossUnits, refundRateSample, rng));

      const onlineAllocation = allocateCount(onlineDemandUnits, productWeights, rng);
      const popupAllocation = allocateCount(popupDemandUnits, productWeights, rng);
      let simulationRevenue = 0;
      let simulationProfit = 0;
      let simulationDemand = 0;
      let simulationSold = 0;
      let simulationOnlineSold = 0;
      let simulationPopupSold = 0;
      let simulationExcess = 0;
      let simulationLost = 0;
      let simulationAnyStockout = false;

      products.forEach((product, productIndex) => {
        const onlineDemand = onlineAllocation[productIndex] || 0;
        const popupDemand = popupAllocation[productIndex] || 0;
        const demand = onlineDemand + popupDemand;
        const variantDemand = product.variants.length
          ? allocateCount(demand, product.variants.map(variant => variant.weight), rng)
          : [];
        const variantSold = product.variants.map((variant, variantIndex) => Math.min(variantDemand[variantIndex] || 0, variant.inventory));
        const sold = product.variants.length
          ? sum(variantSold)
          : Math.min(demand, product.inventory);
        const stockout = product.variants.length
          ? product.variants.some((variant, variantIndex) => (variantDemand[variantIndex] || 0) > 0 && (variantDemand[variantIndex] || 0) >= variant.inventory)
          : demand > 0 && demand >= product.inventory;
        const onlineShare = demand > 0 ? onlineDemand / demand : 0;
        const onlineSold = Math.min(sold, Math.round(sold * onlineShare));
        const popupSold = sold - onlineSold;
        const revenue = sold * product.price;
        const profit = product.landedCogs === null ? 0 : sold * (product.price - product.landedCogs);
        const sellThrough = product.inventory > 0 ? sold / product.inventory : 0;
        const excess = Math.max(0, product.inventory - sold);
        const lost = Math.max(0, demand - sold);
        const acc = productAccumulators[productIndex];

        acc.demand.push(demand);
        acc.sold.push(sold);
        acc.onlineSold.push(onlineSold);
        acc.popupSold.push(popupSold);
        acc.revenue.push(revenue);
        if (product.landedCogs !== null) acc.grossProfit.push(profit);
        acc.sellThrough.push(sellThrough * 100);
        acc.excessInventory.push(excess);
        acc.lostDemand.push(lost);
        if (stockout) acc.stockouts += 1;

        if (product.variants.length) {
          product.variants.forEach((variant, variantIndex) => {
            const demandForVariant = variantDemand[variantIndex] || 0;
            const soldForVariant = variantSold[variantIndex] || 0;
            const variantAcc = acc.variants[variantIndex];
            variantAcc.demand.push(demandForVariant);
            variantAcc.sold.push(soldForVariant);
            if (demandForVariant > 0 && demandForVariant >= variant.inventory) variantAcc.stockouts += 1;
          });
        }

        simulationRevenue += revenue;
        simulationProfit += profit;
        simulationDemand += demand;
        simulationSold += sold;
        simulationOnlineSold += onlineSold;
        simulationPopupSold += popupSold;
        simulationExcess += excess;
        simulationLost += lost;
        if (stockout) simulationAnyStockout = true;
      });

      const simulationSellThrough = totalInventory > 0 ? simulationSold / totalInventory : 0;
      totalRevenue.push(simulationRevenue);
      if (hasCompleteCosts) totalProfit.push(simulationProfit);
      totalDemand.push(simulationDemand);
      totalSold.push(simulationSold);
      totalOnlineSold.push(simulationOnlineSold);
      totalPopupSold.push(simulationPopupSold);
      totalSellThrough.push(simulationSellThrough * 100);
      totalExcess.push(simulationExcess);
      totalLostDemand.push(simulationLost);
      if (simulationSellThrough >= 0.5) sellThrough50 += 1;
      if (simulationSellThrough >= 0.7) sellThrough70 += 1;
      if (simulationSellThrough >= 0.85) sellThrough85 += 1;
      if (simulationSellThrough >= 0.9) sellThrough90 += 1;
      if (simulationSellThrough >= 0.999) sellThrough100 += 1;
      if (simulationAnyStockout) anyStockout += 1;
      if (inventoryCost !== null && simulationRevenue >= inventoryCost) inventoryCashRecovered += 1;
      if (inventoryCost !== null && simulationRevenue >= inventoryCost + committedNonInventorySpend) launchCashRecovered += 1;
    }

    const productOutputs = products.map((product, productIndex): ForecastProductOutput => {
      const acc = productAccumulators[productIndex];
      return {
        id: product.id,
        name: product.name,
        inventory: product.inventory,
        price: product.price,
        landedCogs: product.landedCogs,
        demand: percentiles(acc.demand),
        sold: percentiles(acc.sold),
        onlineSold: percentiles(acc.onlineSold),
        popupSold: percentiles(acc.popupSold),
        revenue: percentiles(acc.revenue, 2),
        grossProfit: product.landedCogs === null ? null : percentiles(acc.grossProfit, 2),
        sellThrough: percentiles(acc.sellThrough, 1),
        stockoutProbability: probability(acc.stockouts, simulations),
        excessInventory: percentiles(acc.excessInventory),
        lostDemand: percentiles(acc.lostDemand),
        variants: product.variants.map((variant, variantIndex) => {
          const variantAcc = acc.variants[variantIndex];
          return {
            id: variant.id,
            label: variant.label,
            inventory: variant.inventory,
            demand: percentiles(variantAcc.demand),
            sold: percentiles(variantAcc.sold),
            stockoutProbability: probability(variantAcc.stockouts, simulations)
          };
        })
      };
    });

    return {
      version: FORECAST_VERSION,
      priorVersion,
      priorProfile,
      asOf: String(input.asOf || "unrecorded"),
      dropId: String(input.dropId || "unrecorded"),
      horizonDays,
      status: evidenceMode === "synthetic" ? "synthetic-test" : evidenceAnchored ? "evidence-anchored" : "scenario",
      evidenceMode,
      dataCompleteness,
      simulations,
      seed,
      unitsPerOrder: round(rates.unitsPerOrder, 3),
      onlineConversionMode,
      summary: {
        revenue: percentiles(totalRevenue, 2),
        grossProfit: hasCompleteCosts ? percentiles(totalProfit, 2) : null,
        demandUnits: percentiles(totalDemand),
        soldUnits: percentiles(totalSold),
        onlineSoldUnits: percentiles(totalOnlineSold),
        popupSoldUnits: percentiles(totalPopupSold),
        sellThrough: percentiles(totalSellThrough, 1),
        excessInventory: percentiles(totalExcess),
        lostDemand: percentiles(totalLostDemand),
        sellThrough50Probability: probability(sellThrough50, simulations),
        sellThrough70Probability: probability(sellThrough70, simulations),
        sellThrough85Probability: probability(sellThrough85, simulations),
        sellThrough90Probability: probability(sellThrough90, simulations),
        sellThrough100Probability: probability(sellThrough100, simulations),
        anyStockoutProbability: probability(anyStockout, simulations),
        inventoryRetailValue: round(inventoryRetailValue, 2),
        inventoryCost: inventoryCost === null ? null : round(inventoryCost, 2),
        merchandiseCashRecovery: inventoryCost === null
          ? null
          : percentiles(totalRevenue.map(revenue => revenue - inventoryCost), 2),
        inventoryCashRecoveryProbability: inventoryCost === null
          ? null
          : probability(inventoryCashRecovered, simulations),
        committedNonInventorySpend: round(committedNonInventorySpend, 2),
        committedLaunchCash: inventoryCost === null
          ? null
          : percentiles(totalRevenue.map(revenue => revenue - inventoryCost - committedNonInventorySpend), 2),
        launchCashRecoveryProbability: inventoryCost === null
          ? null
          : probability(launchCashRecovered, simulations)
      },
      products: productOutputs,
      rates: rateOutputs,
      errors,
      warnings,
      assumptions
    };
  }

  export function calculateCalibration(snapshots: ForecastSnapshotInput[], mode: EvidenceMode = "live"): CalibrationOutput {
    const validCandidates = (Array.isArray(snapshots) ? snapshots : []).filter(snapshot => {
      const actualRevenue = numberOrNull(snapshot.actual?.revenue);
      const actualUnits = numberOrNull(snapshot.actual?.unitsSold);
      const snapshotIsSynthetic = snapshot.forecast?.status === "synthetic-test" || snapshot.forecast?.evidenceMode === "synthetic" ||
        isSyntheticEvidenceReference(snapshot.actual?.evidenceUrl);
      const belongsToMode = mode === "synthetic" ? snapshotIsSynthetic : !snapshotIsSynthetic;
      return belongsToMode && hasCalibratableForecast(snapshot.forecast) && actualRevenue !== null && actualRevenue >= 0 &&
        actualUnits !== null && actualUnits >= 0 && hasEvidenceReference(snapshot.actual?.evidenceUrl);
    });
    // Score one forecast per drop. The earliest timestamped linked call wins,
    // preventing a post-outcome reforecast from replacing the pre-launch call.
    const byDrop = new Map<string, ForecastSnapshotInput>();
    validCandidates.forEach(snapshot => {
      const dropKey = String(snapshot.dropId || snapshot.forecast?.dropId || "unknown");
      const existing = byDrop.get(dropKey);
      if (!existing) {
        byDrop.set(dropKey, snapshot);
        return;
      }
      const candidateTime = Date.parse(String(snapshot.frozenAt || ""));
      const existingTime = Date.parse(String(existing.frozenAt || ""));
      if (Number.isFinite(candidateTime) && (!Number.isFinite(existingTime) || candidateTime < existingTime)) {
        byDrop.set(dropKey, snapshot);
      }
    });
    const valid = Array.from(byDrop.values());
    const uniqueDrops = valid.length;
    const warnings: string[] = [];
    if (!valid.length) {
      return {
        status: "uncalibrated",
        completedForecasts: 0,
        uniqueDrops: 0,
        revenueWape: null,
        unitsWape: null,
        revenueCoverage80: null,
        unitsCoverage80: null,
        revenueMedianBias: null,
        sellThrough70Brier: null,
        warnings: [mode === "synthetic"
          ? "No frozen synthetic forecast has a linked synthetic outcome yet."
          : "No frozen live forecast has a linked actual outcome yet."]
      };
    }

    const revenueErrors: number[] = [];
    const unitErrors: number[] = [];
    let actualRevenueTotal = 0;
    let actualUnitTotal = 0;
    let revenueCovered = 0;
    let unitsCovered = 0;
    let revenueBias = 0;
    const brierScores: number[] = [];

    valid.forEach(snapshot => {
      const forecast = snapshot.forecast as ForecastOutput;
      const actualRevenue = numberOrNull(snapshot.actual?.revenue) as number;
      const actualUnits = numberOrNull(snapshot.actual?.unitsSold) as number;
      revenueErrors.push(Math.abs(actualRevenue - forecast.summary.revenue.p50));
      unitErrors.push(Math.abs(actualUnits - forecast.summary.soldUnits.p50));
      actualRevenueTotal += actualRevenue;
      actualUnitTotal += actualUnits;
      revenueBias += forecast.summary.revenue.p50 - actualRevenue;
      if (actualRevenue >= forecast.summary.revenue.p10 && actualRevenue <= forecast.summary.revenue.p90) revenueCovered += 1;
      if (actualUnits >= forecast.summary.soldUnits.p10 && actualUnits <= forecast.summary.soldUnits.p90) unitsCovered += 1;
      const actualSellThrough = numberOrNull(snapshot.actual?.sellThroughPct);
      if (actualSellThrough !== null) {
        const actualHit = actualSellThrough >= 70 ? 1 : 0;
        const predicted = forecast.summary.sellThrough70Probability / 100;
        brierScores.push((predicted - actualHit) ** 2);
      }
    });

    const revenueWape = actualRevenueTotal > 0 ? sum(revenueErrors) / actualRevenueTotal : null;
    const unitsWape = actualUnitTotal > 0 ? sum(unitErrors) / actualUnitTotal : null;
    const revenueCoverage = revenueCovered / valid.length;
    const unitsCoverage = unitsCovered / valid.length;
    const bias = actualRevenueTotal > 0 ? revenueBias / actualRevenueTotal : null;
    let status: CalibrationStatus = "first-outcome";
    if (uniqueDrops >= 2) status = "early";
    if (uniqueDrops >= 4) {
      const provisionalQuality = revenueWape !== null && unitsWape !== null && revenueWape <= 0.35 && unitsWape <= 0.35 &&
        revenueCoverage >= 0.6 && unitsCoverage >= 0.6;
      status = provisionalQuality ? "provisional" : "needs-work";
    }
    if (uniqueDrops >= 8) {
      const calibratedQuality = revenueWape !== null && unitsWape !== null && revenueWape <= 0.25 && unitsWape <= 0.25 &&
        revenueCoverage >= 0.7 && revenueCoverage <= 0.9 && unitsCoverage >= 0.7 && unitsCoverage <= 0.9;
      status = calibratedQuality ? "calibrated" : "needs-work";
    }
    if (uniqueDrops < 4) warnings.push("Calibration is directional until at least four independent drops have linked outcomes.");
    if (validCandidates.length > uniqueDrops) warnings.push("Multiple snapshots from one drop are useful audits; only the earliest timestamped linked call enters calibration metrics.");
    warnings.push(mode === "synthetic"
      ? "Synthetic calibration validates software behavior only; it cannot establish forecast accuracy or promote model priors."
      : "Calibration thresholds are internal governance policy and must be reviewed after real VORG outcome history accumulates.");

    return {
      status,
      completedForecasts: validCandidates.length,
      uniqueDrops,
      revenueWape: roundNullable(revenueWape, 4),
      unitsWape: roundNullable(unitsWape, 4),
      revenueCoverage80: roundNullable(revenueCoverage, 4),
      unitsCoverage80: roundNullable(unitsCoverage, 4),
      revenueMedianBias: roundNullable(bias, 4),
      sellThrough70Brier: brierScores.length ? roundNullable(sum(brierScores) / brierScores.length, 4) : null,
      warnings
    };
  }

  export function calculateStressSuite(input: ForecastInput): StressScenarioOutput[] {
    const sessions = nonNegativeInteger(input.plannedOnlineSessions, 0);
    const popupVisitors = nonNegativeInteger(input.plannedPopupVisitors, 0);
    const fixedSpend = Math.max(0, numberOrNull(input.committedNonInventorySpend) ?? 0);
    const baseSeed = integerInRange(input.seed, 1, 2147483000, 260722);
    const simulations = Math.min(1200, Math.max(700, integerInRange(input.simulations, 500, 10000, 1200)));
    const scenario = (
      key: StressScenarioOutput["key"],
      label: string,
      description: string,
      overrides: Partial<ForecastInput>,
      productCostScale = 1,
      seedOffset = 1
    ): StressScenarioOutput => {
      const products = (input.products || []).map(product => ({
        ...product,
        landedCogs: productCostScale === 1 || numberOrNull(product.landedCogs) === null
          ? product.landedCogs
          : (numberOrNull(product.landedCogs) as number) * productCostScale,
        variants: (product.variants || []).map(variant => ({ ...variant }))
      }));
      return {
        key,
        label,
        description,
        forecast: calculateForecast({
          ...input,
          ...overrides,
          observed: { ...(input.observed || {}) },
          products,
          simulations,
          seed: baseSeed + seedOffset
        })
      };
    };
    return [
      scenario(
        "traffic-miss",
        "Traffic miss",
        "Online and pop-up traffic finish 30% below plan.",
        { plannedOnlineSessions: Math.round(sessions * 0.7), plannedPopupVisitors: Math.round(popupVisitors * 0.7) },
        1,
        11
      ),
      scenario(
        "popup-cancelled",
        "Pop-up cancelled",
        "The physical event contributes zero visitors or sales.",
        { plannedPopupVisitors: 0 },
        1,
        23
      ),
      scenario(
        "cost-overrun",
        "Cost overrun",
        "Landed COGS rises 20% and committed non-inventory spend rises 10%.",
        { committedNonInventorySpend: fixedSpend * 1.1 },
        1.2,
        37
      ),
      scenario(
        "combined-downside",
        "Combined downside",
        "Traffic misses by 30%, purchase conversion compresses by 35%, the pop-up contributes zero, COGS rises 20%, and other committed spend rises 10%.",
        {
          plannedOnlineSessions: Math.round(sessions * 0.7),
          plannedPopupVisitors: 0,
          onlineConversionStressMultiplier: 0.65,
          committedNonInventorySpend: fixedSpend * 1.1
        },
        1.2,
        51
      ),
      scenario(
        "upside",
        "Controlled upside",
        "Traffic beats plan by 20% and purchase conversion improves by 30%; inventory still caps sales.",
        {
          plannedOnlineSessions: Math.round(sessions * 1.2),
          plannedPopupVisitors: Math.round(popupVisitors * 1.2),
          onlineConversionStressMultiplier: 1.3
        },
        1,
        71
      )
    ];
  }

  function hasCalibratableForecast(value: ForecastOutput | undefined): value is ForecastOutput {
    const summary = value?.summary;
    const required = [
      summary?.revenue?.p10, summary?.revenue?.p50, summary?.revenue?.p90,
      summary?.soldUnits?.p10, summary?.soldUnits?.p50, summary?.soldUnits?.p90,
      summary?.sellThrough70Probability
    ];
    return required.every(item => typeof item === "number" && Number.isFinite(item));
  }

  function normalizeObserved(input: FunnelObservationInput, errors: string[]) {
    const provided = {
      sessions: hasEnteredValue(input.sessions),
      productViews: hasEnteredValue(input.productViews),
      addsToCart: hasEnteredValue(input.addsToCart),
      checkouts: hasEnteredValue(input.checkouts),
      purchases: hasEnteredValue(input.purchases),
      unitsPurchased: hasEnteredValue(input.unitsPurchased),
      refunds: hasEnteredValue(input.refunds),
      popupVisitors: hasEnteredValue(input.popupVisitors),
      popupPurchases: hasEnteredValue(input.popupPurchases)
    };
    const observed = {
      sessions: validatedNonNegativeInteger(input.sessions, "Observed sessions", errors),
      productViews: validatedNonNegativeInteger(input.productViews, "Observed product views", errors),
      addsToCart: validatedNonNegativeInteger(input.addsToCart, "Observed adds to cart", errors),
      checkouts: validatedNonNegativeInteger(input.checkouts, "Observed checkouts", errors),
      purchases: validatedNonNegativeInteger(input.purchases, "Observed purchases", errors),
      unitsPurchased: validatedNonNegativeInteger(input.unitsPurchased, "Observed purchased units", errors),
      refunds: validatedNonNegativeInteger(input.refunds, "Observed refunded units", errors),
      popupVisitors: validatedNonNegativeInteger(input.popupVisitors, "Observed pop-up visitors", errors),
      popupPurchases: validatedNonNegativeInteger(input.popupPurchases, "Observed pop-up purchases", errors)
    };
    const sequence = [
      [provided.productViews && provided.sessions, observed.productViews, observed.sessions, "Product views cannot exceed observed sessions."],
      [provided.addsToCart && provided.productViews, observed.addsToCart, observed.productViews, "Adds to cart cannot exceed product views."],
      [provided.checkouts && provided.addsToCart, observed.checkouts, observed.addsToCart, "Checkouts cannot exceed adds to cart."],
      [provided.purchases && provided.checkouts, observed.purchases, observed.checkouts, "Purchases cannot exceed checkouts."],
      [provided.refunds && provided.unitsPurchased, observed.refunds, observed.unitsPurchased, "Refunded units cannot exceed purchased units."],
      [provided.popupPurchases && provided.popupVisitors, observed.popupPurchases, observed.popupVisitors, "Pop-up purchases cannot exceed pop-up visitors."]
    ] as Array<[boolean, number, number, string]>;
    sequence.forEach(([bothProvided, successes, trials, message]) => {
      if (bothProvided && successes > trials) errors.push(message);
    });
    if (provided.purchases && provided.unitsPurchased && observed.purchases > 0 && observed.unitsPurchased < observed.purchases) {
      errors.push("Purchased units cannot be lower than purchase orders.");
    }
    if (provided.sessions && provided.purchases && observed.purchases > observed.sessions) {
      errors.push("Purchases cannot exceed observed sessions.");
    }
    return { ...observed, provided };
  }

  function normalizeProducts(input: ForecastProductInput[], errors: string[], warnings: string[]): NormalizedProduct[] {
    return input.filter(product => product.active !== false).map((product, index) => {
      const id = String(product.id || `product-${index + 1}`).trim();
      const name = String(product.name || id).trim();
      const baseInventory = integerOrNull(product.inventory);
      const price = numberOrNull(product.price);
      const landedCogs = numberOrNull(product.landedCogs);
      const enteredWeight = String(product.weight ?? "").trim();
      const parsedWeight = positiveNumber(product.weight);
      if (enteredWeight && parsedWeight === null) errors.push(`${name}: demand weight must be greater than zero.`);
      const weight = parsedWeight ?? 1;
      const variants = (product.variants || []).map((variant, variantIndex): NormalizedVariant | null => {
        const inventory = integerOrNull(variant.inventory);
        const variantWeightEntered = String(variant.weight ?? "").trim();
        const parsedVariantWeight = positiveNumber(variant.weight);
        if (!String(variant.label || "").trim() || inventory === null || inventory < 0 ||
          (variantWeightEntered && parsedVariantWeight === null)) {
          errors.push(`${name}: variant ${variantIndex + 1} requires a label, non-negative whole inventory, and optional positive weight.`);
          return null;
        }
        return {
          id: String(variant.id || `${id}-variant-${variantIndex + 1}`),
          label: String(variant.label).trim(),
          inventory,
          weight: parsedVariantWeight ?? 1
        };
      }).filter((variant): variant is NormalizedVariant => variant !== null);
      const variantInventory = variants.reduce((sum, variant) => sum + variant.inventory, 0);
      if (variants.length && variants.some((_, variantIndex) => !String((product.variants || [])[variantIndex]?.weight ?? "").trim())) {
        warnings.push(`${name}: one or more size demand weights are missing; equal weak weights are used instead of inferring demand from the inventory curve.`);
      }
      const inventory = variants.length ? variantInventory : baseInventory;
      const inventoryProvided = variants.length > 0 || (baseInventory !== null && baseInventory >= 0);
      if (!inventoryProvided) errors.push(`${name}: inventory must be a non-negative whole number.`);
      if (price === null || price <= 0) errors.push(`${name}: price must be greater than zero.`);
      if (landedCogs !== null && landedCogs < 0) errors.push(`${name}: landed COGS cannot be negative.`);
      if (landedCogs !== null && price !== null && landedCogs >= price) warnings.push(`${name}: landed COGS is at or above price; forecast profit can be zero or negative.`);
      if (variants.length && baseInventory !== null && variantInventory !== baseInventory) {
        warnings.push(`${name}: size inventory totals ${variantInventory} and overrides the SKU inventory value ${baseInventory}.`);
      }
      return {
        id,
        name,
        inventory: Math.max(0, inventory ?? 0),
        price: Math.max(0, price ?? 0),
        landedCogs: landedCogs === null ? null : Math.max(0, landedCogs),
        weight,
        variants,
        inventoryProvided
      };
    });
  }

  function buildRateModels(
    observed: ReturnType<typeof normalizeObserved>,
    reservationRate: number,
    reservationEvidence: boolean,
    unitsPerOrderAssumption: number,
    plannedOnlineConversionRate: number | null,
    useDirectPlanningRate: boolean,
    externalPrior: NormalizedExternalPrior | null
  ) {
    const unitsPerOrder = observed.purchases > 0 && observed.provided.purchases && observed.provided.unitsPurchased
      ? clampNumber(observed.unitsPurchased / observed.purchases, 1, 4)
      : unitsPerOrderAssumption;
    const reservationStrength = reservationEvidence ? 12 : 5;
    const directStrength = externalPrior?.directConversionStrength ?? INTERNAL_DIRECT_PRIOR_STRENGTH;
    const refundPriorMean = DEFAULT_PRIORS.refundRate.a / (DEFAULT_PRIORS.refundRate.a + DEFAULT_PRIORS.refundRate.b);
    const refundPriorA = externalPrior ? refundPriorMean * externalPrior.refundStrength : DEFAULT_PRIORS.refundRate.a;
    const refundPriorB = externalPrior ? (1 - refundPriorMean) * externalPrior.refundStrength : DEFAULT_PRIORS.refundRate.b;
    return {
      sessionToView: betaPosteriorWhenProvided(observed.productViews, observed.sessions, observed.provided.productViews && observed.provided.sessions, DEFAULT_PRIORS.sessionToView.a, DEFAULT_PRIORS.sessionToView.b),
      viewToCart: betaPosteriorWhenProvided(observed.addsToCart, observed.productViews, observed.provided.addsToCart && observed.provided.productViews, DEFAULT_PRIORS.viewToCart.a, DEFAULT_PRIORS.viewToCart.b),
      cartToCheckout: betaPosteriorWhenProvided(observed.checkouts, observed.addsToCart, observed.provided.checkouts && observed.provided.addsToCart, DEFAULT_PRIORS.cartToCheckout.a, DEFAULT_PRIORS.cartToCheckout.b),
      checkoutToPurchase: betaPosteriorWhenProvided(observed.purchases, observed.checkouts, observed.provided.purchases && observed.provided.checkouts, DEFAULT_PRIORS.checkoutToPurchase.a, DEFAULT_PRIORS.checkoutToPurchase.b),
      refundRate: betaPosteriorWhenProvided(observed.refunds, observed.unitsPurchased, observed.provided.refunds && observed.provided.unitsPurchased, refundPriorA, refundPriorB),
      popupPurchaseRate: betaPosteriorWhenProvided(observed.popupPurchases, observed.popupVisitors, observed.provided.popupPurchases && observed.provided.popupVisitors, DEFAULT_PRIORS.popupPurchaseRate.a, DEFAULT_PRIORS.popupPurchaseRate.b),
      reservationConversion: {
        a: Math.max(0.25, reservationRate * reservationStrength),
        b: Math.max(0.25, (1 - reservationRate) * reservationStrength),
        // The entered reservation conversion rate is a planning assumption.
        // A reference can tighten it, but it is not labelled as an observed outcome.
        successes: -1,
        trials: 0
      } as BetaModel,
      plannedSessionPurchase: plannedOnlineConversionRate === null
        ? null
        : buildPlanningConversion(
          plannedOnlineConversionRate,
          directStrength,
          observed
        ),
      unitsPerOrder,
      useDirectPlanningRate
    };
  }

  function rateSummary(rates: ReturnType<typeof buildRateModels>): ForecastRateOutput[] {
    const items: Array<[string, string, BetaModel]> = [
      ["sessionToView", "Session → product view", rates.sessionToView],
      ["viewToCart", "Product view → cart", rates.viewToCart],
      ["cartToCheckout", "Cart → checkout", rates.cartToCheckout],
      ["checkoutToPurchase", "Checkout → purchase", rates.checkoutToPurchase],
      ["refundRate", "Purchased unit → refund", rates.refundRate],
      ["popupPurchaseRate", "Pop-up visitor → purchase", rates.popupPurchaseRate],
      ["reservationConversion", "Reservation → purchase", rates.reservationConversion]
    ];
    if (rates.useDirectPlanningRate && rates.plannedSessionPurchase) {
      items.push(["plannedSessionPurchase", "Session → purchase (planning prior)", rates.plannedSessionPurchase]);
    }
    return items.map(([key, label, model]) => ({
      key,
      label,
      mean: round((model.a / (model.a + model.b)) * 100, 2),
      evidence: model.trials > 0 && model.successes >= 0 ? "observed" : "prior",
      successes: model.successes,
      trials: model.trials
    }));
  }

  function betaPosterior(successes: number, trials: number, priorA: number, priorB: number): BetaModel {
    return {
      a: priorA + successes,
      b: priorB + Math.max(0, trials - successes),
      successes,
      trials
    };
  }

  function betaPosteriorWhenProvided(successes: number, trials: number, provided: boolean, priorA: number, priorB: number): BetaModel {
    if (!provided || trials <= 0) return { a: priorA, b: priorB, successes: -1, trials: 0 };
    return betaPosterior(successes, trials, priorA, priorB);
  }

  function buildPlanningConversion(
    plannedOnlineConversionRate: number,
    directStrength: number,
    observed: ReturnType<typeof normalizeObserved>
  ): BetaModel {
    const priorA = Math.max(0.01, plannedOnlineConversionRate * directStrength);
    const priorB = Math.max(0.01, (1 - plannedOnlineConversionRate) * directStrength);
    const hasSessionPurchasePair = Boolean(
      observed.provided.sessions && observed.provided.purchases && observed.sessions > 0
    );
    if (!hasSessionPurchasePair) {
      return { a: priorA, b: priorB, successes: -1, trials: 0 };
    }
    return betaPosterior(observed.purchases, observed.sessions, priorA, priorB);
  }

  function completenessScore(input: {
    products: NormalizedProduct[];
    plannedOnlineSessions: number;
    plannedPopupVisitors: number;
    reservations: number;
    observed: ReturnType<typeof normalizeObserved>;
    trafficEvidence: boolean;
    funnelEvidence: boolean;
    reservationEvidence: boolean;
  }): number {
    const productCount = input.products.length || 1;
    const financialCoverage = input.products.reduce((sum, product) => {
      return sum + (product.inventoryProvided ? 1 : 0) + (product.price > 0 ? 1 : 0) + (product.landedCogs !== null ? 1 : 0);
    }, 0) / (productCount * 3);
    const sizeCoverage = input.products.filter(product => product.variants.length > 0).length / productCount;
    const trafficPresent = input.plannedOnlineSessions + input.plannedPopupVisitors + input.reservations > 0 ? 1 : 0;
    const observedFields = ["sessions", "productViews", "addsToCart", "checkouts", "purchases"]
      .filter(key => input.observed.provided[key as keyof FunnelObservationInput]).length / 5;
    const evidenceCoverage = (
      (input.trafficEvidence ? 1 : 0) +
      (input.funnelEvidence ? 1 : 0) +
      (input.reservations === 0 || input.reservationEvidence ? 1 : 0)
    ) / 3;
    return Math.round(clampNumber(
      financialCoverage * 40 + trafficPresent * 15 + observedFields * 25 + evidenceCoverage * 15 + sizeCoverage * 5,
      0,
      100
    ));
  }

  function blockedOutput(
    input: ForecastInput,
    horizonDays: number,
    simulations: number,
    seed: number,
    dataCompleteness: number,
    unitsPerOrder: number,
    onlineConversionMode: "funnel" | "planning-prior",
    evidenceMode: EvidenceMode,
    priorProfile: ForecastPriorProfile,
    priorVersion: string,
    rates: ForecastRateOutput[],
    errors: string[],
    warnings: string[],
    assumptions: string[]
  ): ForecastOutput {
    const zero = { p10: 0, p50: 0, p90: 0 };
    return {
      version: FORECAST_VERSION,
      priorVersion,
      priorProfile,
      asOf: String(input.asOf || "unrecorded"),
      dropId: String(input.dropId || "unrecorded"),
      horizonDays,
      status: "blocked",
      evidenceMode,
      dataCompleteness,
      simulations,
      seed,
      unitsPerOrder: round(unitsPerOrder, 3),
      onlineConversionMode,
      summary: {
        revenue: { ...zero },
        grossProfit: null,
        demandUnits: { ...zero },
        soldUnits: { ...zero },
        onlineSoldUnits: { ...zero },
        popupSoldUnits: { ...zero },
        sellThrough: { ...zero },
        excessInventory: { ...zero },
        lostDemand: { ...zero },
        sellThrough50Probability: 0,
        sellThrough70Probability: 0,
        sellThrough85Probability: 0,
        sellThrough90Probability: 0,
        sellThrough100Probability: 0,
        anyStockoutProbability: 0,
        inventoryRetailValue: 0,
        inventoryCost: null,
        merchandiseCashRecovery: null,
        inventoryCashRecoveryProbability: null,
        committedNonInventorySpend: Math.max(0, numberOrNull(input.committedNonInventorySpend) ?? 0),
        committedLaunchCash: null,
        launchCashRecoveryProbability: null
      },
      products: [],
      rates,
      errors,
      warnings,
      assumptions
    };
  }

  function percentiles(values: number[], digits = 0): Percentiles {
    if (!values.length) return { p10: 0, p50: 0, p90: 0 };
    const sorted = values.slice().sort((left, right) => left - right);
    return {
      p10: round(quantileSorted(sorted, 0.1), digits),
      p50: round(quantileSorted(sorted, 0.5), digits),
      p90: round(quantileSorted(sorted, 0.9), digits)
    };
  }

  function quantileSorted(sorted: number[], q: number): number {
    if (sorted.length === 1) return sorted[0];
    const position = (sorted.length - 1) * q;
    const base = Math.floor(position);
    const remainder = position - base;
    const next = sorted[base + 1];
    return next === undefined ? sorted[base] : sorted[base] + remainder * (next - sorted[base]);
  }

  function allocateCount(count: number, weights: number[], rng: () => number): number[] {
    if (!weights.length) return [];
    const safeWeights = weights.map(weight => Math.max(0, Number.isFinite(weight) ? weight : 0));
    let remainingCount = Math.max(0, Math.round(count));
    let remainingWeight = sum(safeWeights);
    const result = safeWeights.map(() => 0);
    safeWeights.forEach((weight, index) => {
      if (index === safeWeights.length - 1) {
        result[index] = remainingCount;
        return;
      }
      const probabilityValue = remainingWeight > 0 ? weight / remainingWeight : 1 / (safeWeights.length - index);
      const allocated = sampleBinomial(remainingCount, probabilityValue, rng);
      result[index] = allocated;
      remainingCount -= allocated;
      remainingWeight -= weight;
    });
    return result;
  }

  function sampleBinomial(n: number, p: number, rng: () => number): number {
    const trials = Math.max(0, Math.round(n));
    const probabilityValue = clampNumber(p, 0, 1);
    if (trials === 0 || probabilityValue === 0) return 0;
    if (probabilityValue === 1) return trials;
    if (trials <= 500) {
      let successes = 0;
      for (let index = 0; index < trials; index += 1) if (rng() < probabilityValue) successes += 1;
      return successes;
    }
    const mean = trials * probabilityValue;
    const standardDeviation = Math.sqrt(trials * probabilityValue * (1 - probabilityValue));
    return Math.round(clampNumber(mean + standardDeviation * sampleNormal(rng), 0, trials));
  }

  function samplePoisson(lambda: number, rng: () => number): number {
    if (!Number.isFinite(lambda) || lambda <= 0) return 0;
    if (lambda >= 30) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * sampleNormal(rng)));
    const limit = Math.exp(-lambda);
    let product = 1;
    let count = 0;
    do {
      count += 1;
      product *= rng();
    } while (product > limit);
    return count - 1;
  }

  function sampleBeta(a: number, b: number, rng: () => number): number {
    const left = sampleGamma(Math.max(0.01, a), rng);
    const right = sampleGamma(Math.max(0.01, b), rng);
    return left + right > 0 ? left / (left + right) : 0;
  }

  function sampleGamma(shape: number, rng: () => number): number {
    if (shape < 1) return sampleGamma(shape + 1, rng) * Math.pow(Math.max(rng(), Number.EPSILON), 1 / shape);
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    while (true) {
      const normal = sampleNormal(rng);
      const vBase = 1 + c * normal;
      if (vBase <= 0) continue;
      const v = vBase ** 3;
      const uniform = rng();
      if (uniform < 1 - 0.0331 * normal ** 4) return d * v;
      if (Math.log(uniform) < 0.5 * normal ** 2 + d * (1 - v + Math.log(v))) return d * v;
    }
  }

  function sampleNormal(rng: () => number): number {
    const first = Math.max(rng(), Number.EPSILON);
    const second = Math.max(rng(), Number.EPSILON);
    return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
  }

  function sampleLogNormalMean(mean: number, coefficientOfVariation: number, rng: () => number): number {
    if (mean <= 0) return 0;
    const variance = Math.log(1 + coefficientOfVariation ** 2);
    const sigma = Math.sqrt(variance);
    const mu = Math.log(mean) - variance / 2;
    return Math.exp(mu + sigma * sampleNormal(rng));
  }

  function mulberry32(seed: number): () => number {
    let state = seed >>> 0;
    return () => {
      state += 0x6D2B79F5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function probability(count: number, total: number): number {
    return total > 0 ? round((count / total) * 100, 1) : 0;
  }

  function nonNegativeInteger(value: unknown, fallback: number): number {
    const parsed = integerOrNull(value);
    return parsed === null || parsed < 0 ? fallback : parsed;
  }

  function validatedNonNegativeInteger(value: unknown, label: string, errors: string[]): number {
    const raw = String(value ?? "").trim();
    if (!raw) return 0;
    const parsed = integerOrNull(value);
    if (parsed === null || parsed < 0) {
      errors.push(`${label} must be a non-negative whole number.`);
      return 0;
    }
    return parsed;
  }

  function integerOrNull(value: unknown): number | null {
    const parsed = numberOrNull(value);
    if (parsed === null || !Number.isInteger(parsed)) return null;
    return parsed;
  }

  function integerInRange(value: unknown, minimum: number, maximum: number, fallback: number): number {
    const parsed = integerOrNull(value);
    if (parsed === null) return fallback;
    return Math.round(clampNumber(parsed, minimum, maximum));
  }

  function positiveNumber(value: unknown): number | null {
    const parsed = numberOrNull(value);
    return parsed !== null && parsed > 0 ? parsed : null;
  }

  function numberOrNull(value: unknown): number | null {
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    const normalized = String(value ?? "").trim().replace(/[$,]/g, "").replace(/^C\s*/i, "");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function hasEnteredValue(value: unknown): boolean {
    return String(value ?? "").trim() !== "";
  }

  function clampNumber(value: number, minimum: number, maximum: number): number {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function round(value: number, digits: number): number {
    const multiplier = 10 ** digits;
    return Math.round(value * multiplier) / multiplier;
  }

  function roundNullable(value: number | null, digits: number): number | null {
    return value === null ? null : round(value, digits);
  }

  function sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
  }
}
