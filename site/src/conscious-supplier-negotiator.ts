namespace VorgConsciousNegotiation {
  export const ALGORITHM_VERSION = "VORG Human-Aware Supplier Negotiation v1.0";

  export type NegotiationStage =
    | "listen"
    | "clarify"
    | "challenge"
    | "co-solve"
    | "bargain"
    | "hold"
    | "exit";
  export type Tone = "warm" | "warm-firm" | "calm-firm";
  export type ClaimState = "claimed" | "linked" | "verified" | "contradicted";
  export type Language = "english" | "chinese" | "bilingual";

  export interface NegotiationSignals {
    answerCompletenessPct: number;
    evidenceCoveragePct: number;
    technicalSpecificityPct: number;
    commercialClarityPct: number;
    reciprocityPct: number;
    statesLimitations: boolean;
    asksUsefulQuestions: boolean;
    priceGapPct?: number;
    contradictions?: number;
    evasiveAnswers?: boolean;
    pressureForBulk?: boolean;
    requestsPersonalPayment?: boolean;
    requestsOffPlatformPayment?: boolean;
    refusesInspection?: boolean;
    hiddenSubcontracting?: boolean;
  }

  export interface SupplierConstraint {
    id: string;
    statement: string;
    verified: boolean;
    negotiable: boolean;
  }

  export interface Concession {
    id: string;
    owner: "VORG-EAVY" | "supplier";
    description: string;
    valuePoints?: number;
    conditionalOn?: string;
    status: "proposed" | "accepted" | "rejected" | "withdrawn";
  }

  export interface NegotiationContext {
    supplierName: string;
    contactName?: string;
    styleId: string;
    signals: NegotiationSignals;
    constraints?: SupplierConstraint[];
    concessions?: Concession[];
    unresolvedClaims?: Array<{ key: string; value: string; state: ClaimState }>;
  }

  export interface NegotiationDecision {
    algorithmVersion: string;
    stage: NegotiationStage;
    tone: Tone;
    relationshipIntent: string;
    primaryObjective: string;
    acknowledge: string[];
    verify: string[];
    tradeOptions: string[];
    holdLines: string[];
    hardStops: string[];
    nextMessageRule: string;
    requiresActionTimeApproval: true;
    mayAutoSend: false;
    mayCommitSpend: false;
  }

  export interface NegotiationDraft {
    language: Language;
    stage: NegotiationStage;
    body: string;
    claimsNotToMake: string[];
    requiresActionTimeApproval: true;
  }

  const clampPct = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

  export function decideNegotiation(context: NegotiationContext): NegotiationDecision {
    const signals = normalizeSignals(context.signals);
    const hardStops = collectHardStops(signals);
    const contradictions = Math.max(0, Math.round(signals.contradictions || 0));
    const constraints = context.constraints || [];
    const acknowledge = constraints
      .filter(item => item.statement.trim().length > 0)
      .map(item => item.statement.trim());
    const verify = buildVerificationList(context, signals);
    const holdLines = [
      "No bulk deposit before the controlled sample ladder is complete.",
      "No material, trim, facility or subcontractor substitution without written approval.",
      "No personal or off-platform payment; protected order terms must control.",
      "No volume promise or invented competitor quote will be used as leverage."
    ];

    let stage: NegotiationStage;
    let tone: Tone;
    let primaryObjective: string;

    if (hardStops.length > 0) {
      stage = "exit";
      tone = "calm-firm";
      primaryObjective = "End the negotiation without further disclosure or commitment and preserve the evidence record.";
    } else if (contradictions > 0) {
      stage = "challenge";
      tone = "calm-firm";
      primaryObjective = "Resolve one material contradiction with dated, attributable evidence before discussing price.";
    } else if (signals.answerCompletenessPct < 70 || signals.evidenceCoveragePct < 45 || signals.evasiveAnswers) {
      stage = "clarify";
      tone = signals.statesLimitations ? "warm" : "warm-firm";
      primaryObjective = "Close the most important evidence gap with a short numbered follow-up.";
    } else if (signals.technicalSpecificityPct < 65) {
      stage = "challenge";
      tone = "warm-firm";
      primaryObjective = "Move the conversation from sales language to a technician-owned construction answer.";
    } else if ((signals.priceGapPct || 0) > 0 && signals.commercialClarityPct >= 70) {
      stage = "bargain";
      tone = "warm-firm";
      primaryObjective = "Reduce landed sample or unit cost through reciprocal, truthful trade-offs without weakening quality gates.";
    } else if (signals.commercialClarityPct < 75) {
      stage = "co-solve";
      tone = "warm";
      primaryObjective = "Build a transparent cost and timing model with the supplier before asking for a concession.";
    } else if (signals.reciprocityPct < 40) {
      stage = "hold";
      tone = "calm-firm";
      primaryObjective = "Stop giving unilateral concessions and ask the supplier to reciprocate in a measurable way.";
    } else {
      stage = "listen";
      tone = "warm";
      primaryObjective = "Confirm shared understanding and invite the supplier to identify the next real production risk.";
    }

    return {
      algorithmVersion: ALGORITHM_VERSION,
      stage,
      tone,
      relationshipIntent: relationshipIntent(stage, signals.statesLimitations),
      primaryObjective,
      acknowledge,
      verify,
      tradeOptions: stage === "bargain" || stage === "co-solve" ? buildTradeOptions(context) : [],
      holdLines,
      hardStops,
      nextMessageRule: "One message, one primary objective: acknowledge the real constraint, ask for attributable evidence, offer only conditional reciprocal value, and leave the supplier a dignified way to say no or propose an alternative.",
      requiresActionTimeApproval: true,
      mayAutoSend: false,
      mayCommitSpend: false
    };
  }

  export function draftNegotiationMessage(
    context: NegotiationContext,
    decision = decideNegotiation(context),
    language: Language = "bilingual"
  ): NegotiationDraft {
    const contact = context.contactName || `${context.supplierName} team`;
    const greeting = language === "english" ? `Hello ${contact},` : `${contact} 您好：`;
    const chineseOpening = `感谢您的回复。我们希望把这次沟通做得认真、透明，也尊重贵司真实的生产限制。${decision.acknowledge[0] ? `我们理解您提到的情况：${decision.acknowledge[0]}。` : ""}`;
    const englishOpening = `Thank you for the reply. We want this conversation to be serious, transparent and respectful of your real production constraints.${decision.acknowledge[0] ? ` We understand the constraint you described: ${decision.acknowledge[0]}.` : ""}`;
    const objective = decision.primaryObjective;
    const asks = decision.verify.slice(0, 3).map((item, index) => `${index + 1}. ${item}`).join("\n");
    const trades = decision.tradeOptions.length
      ? `\n\nPossible fair trades for discussion—not promises:\n${decision.tradeOptions.map((item, index) => `${index + 1}. ${item}`).join("\n")}`
      : "";
    const close = "\n\nAn honest limitation will not count against you. A clear alternative with its cost, timing and quality effect is more useful than a general ‘no problem’ answer.\n\nThank you,\nVORG-EAVY Product Team\nCanada";

    let body: string;
    if (decision.stage === "exit") {
      body = `${greeting}\n\nThank you for your time. Based on the unresolved risk, VORG-EAVY will not advance this sourcing review. We are not authorizing payment, sampling or bulk production.\n\nThank you,\nVORG-EAVY Product Team\nCanada`;
    } else if (language === "chinese") {
      body = `${greeting}\n\n${chineseOpening}\n\n本轮只处理一个目标：${objective}\n\n请逐项提供：\n${asks}${trades}${close}`;
    } else if (language === "english") {
      body = `${greeting}\n\n${englishOpening}\n\nThis round has one objective: ${objective}\n\nPlease answer these points:\n${asks}${trades}${close}`;
    } else {
      body = `${greeting}\n\n${chineseOpening} 您可以用中文回复。\n\n${englishOpening}\n\nThis round has one objective: ${objective}\n\nPlease answer these points:\n${asks}${trades}${close}`;
    }

    return {
      language,
      stage: decision.stage,
      body,
      claimsNotToMake: [
        "A promised future volume that VORG-EAVY has not approved.",
        "A fabricated competing quote or deadline.",
        "Production readiness before sample, test and approval gates pass.",
        "Agreement to price, payment, bulk quantity or substitution."
      ],
      requiresActionTimeApproval: true
    };
  }

  export function concessionBalance(concessions: Concession[] = []): {
    vorgAccepted: number;
    supplierAccepted: number;
    balanced: boolean;
    warning?: string;
  } {
    const accepted = concessions.filter(item => item.status === "accepted");
    const value = (owner: Concession["owner"]): number => accepted
      .filter(item => item.owner === owner)
      .reduce((total, item) => total + Math.max(1, item.valuePoints || 1), 0);
    const vorgAccepted = value("VORG-EAVY");
    const supplierAccepted = value("supplier");
    const balanced = vorgAccepted === 0 || supplierAccepted >= vorgAccepted * 0.7;
    return {
      vorgAccepted,
      supplierAccepted,
      balanced,
      warning: balanced ? undefined : "VORG-EAVY has conceded materially more value; pause and request measurable reciprocity."
    };
  }

  function normalizeSignals(signals: NegotiationSignals): NegotiationSignals {
    return {
      ...signals,
      answerCompletenessPct: clampPct(signals.answerCompletenessPct),
      evidenceCoveragePct: clampPct(signals.evidenceCoveragePct),
      technicalSpecificityPct: clampPct(signals.technicalSpecificityPct),
      commercialClarityPct: clampPct(signals.commercialClarityPct),
      reciprocityPct: clampPct(signals.reciprocityPct),
      priceGapPct: Math.max(0, signals.priceGapPct || 0),
      contradictions: Math.max(0, signals.contradictions || 0)
    };
  }

  function collectHardStops(signals: NegotiationSignals): string[] {
    const stops: string[] = [];
    if (signals.requestsPersonalPayment) stops.push("Supplier requested payment to a personal account.");
    if (signals.requestsOffPlatformPayment) stops.push("Supplier requested off-platform payment.");
    if (signals.refusesInspection) stops.push("Supplier refused reasonable independent inspection.");
    if (signals.hiddenSubcontracting) stops.push("Supplier concealed a production subcontractor.");
    if (signals.pressureForBulk) stops.push("Supplier pressured VORG-EAVY to fund bulk before sample approval.");
    return stops;
  }

  function buildVerificationList(context: NegotiationContext, signals: NegotiationSignals): string[] {
    const asks: string[] = [];
    for (const claim of context.unresolvedClaims || []) {
      if (claim.state !== "verified") asks.push(`Support the ${claim.key} statement with a dated source or mark it unavailable.`);
    }
    if (signals.answerCompletenessPct < 100) asks.push("Reply to every unanswered numbered question; write ‘not available’ where necessary.");
    if (signals.evidenceCoveragePct < 80) asks.push("Connect each important claim to an original, client-authorized, platform or third-party evidence item.");
    if (signals.technicalSpecificityPct < 80) asks.push("Have the patternmaker or production technician explain the construction, likely failure points and prevention controls.");
    if (signals.commercialClarityPct < 90) asks.push("Separate sample, material, trim, specialist process, revision, testing, packing and freight costs with quote validity.");
    if (asks.length === 0) asks.push("Confirm the single largest remaining production risk and the evidence that will close it.");
    return dedupe(asks);
  }

  function buildTradeOptions(context: NegotiationContext): string[] {
    const options = [
      "VORG-EAVY can return consolidated technical feedback within an agreed review window if the supplier includes one clearly defined revision round.",
      "VORG-EAVY can accept available in-stock development materials for the first fit shell if the final-material differences are documented and no bulk equivalence is claimed.",
      "VORG-EAVY can simplify sample packaging if the supplier itemizes the saved cost and preserves garment protection.",
      "The supplier can credit an agreed portion of the sample or pattern fee against a later order only if that later order is separately approved."
    ];
    const negotiableConstraint = (context.constraints || []).find(item => item.negotiable);
    if (negotiableConstraint) {
      options.unshift(`For the stated constraint “${negotiableConstraint.statement}”, propose two alternatives showing cost, time and quality impact.`);
    }
    return options;
  }

  function relationshipIntent(stage: NegotiationStage, statesLimitations: boolean): string {
    if (stage === "exit") return "Close respectfully without accusation; preserve the record and disclose no further commercial detail.";
    if (stage === "challenge") return "Be specific without humiliation: challenge the claim, not the person, and give a clean path to correct the record.";
    if (stage === "bargain") return "Treat price as a design problem shared by both sides; trade real value instead of demanding a naked discount.";
    if (statesLimitations) return "Reward candour, invite a workable alternative, and keep manufacturing truth ahead of optimism.";
    return "Stay warm and curious while requiring concrete evidence before trust or money advances.";
  }

  function dedupe(values: string[]): string[] {
    return values.filter((value, index) => values.indexOf(value) === index);
  }
}
