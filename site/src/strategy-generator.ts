/**
 * VORG Strategy Generator v1
 * Picks the winner strategy and compiles the full staged plan itself, from external
 * receipts (evidence cards about what worked/failed for others) — with zero first-party
 * sales required. Never claims demand proof. Never authorizes production spend or Drop OS GO.
 * Motto encoded: failure evidence lowers a score with reasons; unpreparedness freezes branches.
 */
namespace VorgStrategyGenerator {
  export const ENGINE_VERSION = "VORG Strategy Generator v1";
  export const DEFAULT_SELL_THROUGH_GOAL_PCT = 85;

  // ---------------------------------------------------------------- input contract

  export type WorkedOrFailed = "worked" | "failed" | "mixed";
  export type GateState = "unknown" | "researching" | "review-required" | "blocked" | "cleared-with-evidence";
  export type OwnerRole = "founder" | "ops" | "research" | "content" | "creator-ops" | "finance";
  export type WaveStatus = "ready" | "frozen" | "killed" | "scaled";
  export type PlanMode = "from-scratch" | "remix";
  export type EvidenceLabel = "evidence-backed" | "working-assumption";

  export interface EvidenceCard {
    id: string;
    mechanism: string;
    reference: string;
    industry: string;
    sourceUrl: string;
    dateChecked: string;
    workedOrFailed: WorkedOrFailed;
    why: string;
    transferabilityConditions: string[];
    tweakNote?: string;
    sourceClass?: string;
    confidence: number; // 0..1
  }

  export interface SkuProfile {
    id: string;
    name: string;
    role: string;
    workingUnits: number;
    workingPriceCad?: number;
    proofStatus: string;
  }

  export interface BrandProfile {
    name: string;
    industry?: string; // defaults to "fashion"
    skus: SkuProfile[];
    productionCeilingCad: { min: number; max: number };
    operatingMarket: string;
    sellThroughGoalPct?: number; // defaults to 85
    testCashPoolCad?: number; // defaults to 0 => all budgets held at C$0
  }

  export interface MarketCandidate {
    id: string;
    metro: string;
    country: string;
  }

  export interface RouteGate {
    id: string;
    label: string;
    state: GateState;
    hardStop: boolean;
    notes?: string;
  }

  export interface MacroContext {
    headwinds?: string[];
    tailwinds?: string[];
    sourceUrls?: string[];
  }

  export interface SkuResult {
    skuId: string;
    unitsPlanned: number;
    unitsSold: number;
  }

  export interface WaveOutcome {
    waveId: string;
    receiptUrl: string;
    qualifiedActions: number;
    spendCad: number;
    outcome: "pass" | "fail" | "inconclusive";
  }

  export interface FirstPartyResults {
    asOf: string;
    sessions?: number;
    purchases?: number;
    sellThroughBySku?: SkuResult[];
    waveOutcomes?: WaveOutcome[];
  }

  // Loosely-typed existing plan input so remix mode can consume imperfect plan JSON.
  export interface ExistingActionItem {
    id?: string;
    action?: string;
    ownerRole?: string;
    budgetCapCad?: number;
    measurement?: { metric?: string; receiptRequired?: boolean; successThreshold?: string; killRule?: string };
    gateDependencies?: string[];
    evidenceCardIds?: string[];
    evidenceLabel?: string;
    status?: string;
  }

  export interface ExistingWave {
    id?: string;
    label?: string;
    mechanism?: string;
    phaseId?: string;
    budgetCapCad?: number;
    status?: string;
    items?: ExistingActionItem[];
  }

  export interface ExistingPlanInput {
    planId?: string;
    strategyId?: string;
    strategyLabel?: string;
    testCashPoolCad?: number;
    waves?: ExistingWave[];
  }

  export interface EngineInput {
    generatedAt?: string;
    brand: BrandProfile;
    library: EvidenceCard[];
    markets: MarketCandidate[];
    gates: RouteGate[];
    existingPlan?: ExistingPlanInput;
    macro?: MacroContext;
    firstPartyResults?: FirstPartyResults; // empty/absent at start — engine must still work
  }

  // ---------------------------------------------------------------- output contract

  export interface EvidenceUse {
    cardId: string;
    reference: string;
    industry: string;
    workedOrFailed: WorkedOrFailed;
    crossIndustry: boolean;
    transferFactor: number;
    weight: number;
    why: string;
    tweakNote?: string;
  }

  export interface UnpreparednessAudit {
    openGateIds: string[];
    breaksFirst: string;
    frozenCapabilities: string[];
  }

  export interface StressReport {
    strategyId: string;
    supporting: EvidenceUse[];
    contradicting: EvidenceUse[];
    unpreparedness: UnpreparednessAudit;
  }

  export interface StrategyAssessment {
    strategyId: string;
    label: string;
    description: string;
    mechanisms: string[];
    hybridOf?: string[];
    evidenceScore: number; // 0..100 from external receipts
    evidenceConfidence: number; // 0..1 share of supporting vs total evidence
    preparedness: number; // 0..1 from gate states
    goalFit: number; // 0..1 heuristic proximity to sell-through goal (documented working assumption)
    totalScore: number; // evidenceScore * preparedness * goalFit
    stress: StressReport;
    reasons: string[];
  }

  export interface Measurement {
    metric: string;
    receiptRequired: true;
    successThreshold: string;
    killRule: string;
  }

  export interface ActionItem {
    id: string;
    action: string;
    ownerRole: OwnerRole;
    budgetCapCad: number;
    measurement: Measurement;
    gateDependencies: string[];
    evidenceCardIds: string[];
    evidenceLabel: EvidenceLabel;
    status: WaveStatus;
    frozenReason?: string;
  }

  export interface PlanWave {
    id: string;
    label: string;
    mechanism: string;
    phaseId: string;
    budgetCapCad: number;
    status: WaveStatus;
    frozenReason?: string;
    items: ActionItem[];
  }

  export interface PlanPhase {
    id: string;
    label: string;
    objective: string;
    waveIds: string[];
  }

  export interface GeneratedPlan {
    planId: string;
    strategyId: string;
    strategyLabel: string;
    wedgeMetro: string | null;
    goalSellThroughPct: number;
    testCashPoolCad: number;
    productionCeilingCad: { min: number; max: number };
    budgetAllocatedCad: number;
    phases: PlanPhase[];
    waves: PlanWave[];
    cashPolicy: string;
  }

  export interface RemixImprovement {
    target: string;
    change: string;
    reason: string;
    evidenceCardIds: string[];
  }

  export interface AuditEntry {
    stage: string;
    subject: string;
    prior: number;
    evidence: string;
    posterior: number;
    changeMade: string;
    why: string;
  }

  export interface CalibrationReport {
    asOf: string;
    overallSellThroughPct: number | null;
    distanceToGoalPct: number | null;
    skuTracker: { skuId: string; sellThroughPct: number; distanceToGoalPct: number }[];
    priorWinnerScore: number;
    posteriorWinnerScore: number;
    auditTrail: AuditEntry[];
  }

  export interface UnpreparednessLine {
    gateId: string;
    label: string;
    state: GateState;
    hardStop: boolean;
    consequence: string;
  }

  export interface SafetyReport {
    demandProofClaim: false;
    dropOsImpact: "none";
    productionSpendAuthorizedCad: 0;
    invariants: string[];
  }

  export interface StrategyRecommendation {
    version: string;
    generatedAt: string;
    mode: PlanMode;
    goalSellThroughPct: number;
    winner: StrategyAssessment | null;
    runnerUp: StrategyAssessment | null;
    rankedStrategies: StrategyAssessment[];
    reversalConditions: string[];
    plan: GeneratedPlan | null;
    remixImprovements: RemixImprovement[];
    calibration: CalibrationReport | null;
    unpreparednessReport: UnpreparednessLine[];
    assumptions: string[];
    safety: SafetyReport;
  }

  // ---------------------------------------------------------------- strategy space catalog

  interface StrategyArchetype {
    id: string;
    label: string;
    description: string;
    mechanisms: string[];
    contraMechanisms: string[]; // mechanisms whose evidence documents this strategy's anti-pattern
    goalFit: number;
    requiresPaidSpend: boolean;
    requiredGateIds: string[];
    hybridCompatible: string[];
  }

  const ARCHETYPES: StrategyArchetype[] = [
    {
      id: "founder-story-led",
      label: "Founder-story-led world building",
      description: "Founder-as-channel product-truth content inside one coherent brand world feeding owned checkout.",
      mechanisms: ["world-building-founder-channel", "founder-content-commerce", "world-coherence", "community-first-content"],
      contraMechanisms: ["off-brand-extension"],
      goalFit: 0.75,
      requiresPaidSpend: false,
      requiredGateIds: [],
      hybridCompatible: ["scarcity-drop", "creator-seeding"]
    },
    {
      id: "community-first",
      label: "Community-first named circle",
      description: "A named small community with real obligations, long-form community media, and product question loops before any paid reach.",
      mechanisms: ["named-community-drops", "community-media-events", "community-first-content", "world-coherence"],
      contraMechanisms: ["off-brand-extension"],
      goalFit: 0.7,
      requiresPaidSpend: false,
      requiredGateIds: [],
      hybridCompatible: ["creator-seeding", "scarcity-drop"]
    },
    {
      id: "creator-seeding",
      label: "Governed creator seeding",
      description: "Nano/micro creator tests inside signed briefs with disclosure, claim, and music controls, measured on qualified actions.",
      mechanisms: ["governed-ugc", "native-short-form", "creator-metro-efficiency", "artist-collab-drop"],
      contraMechanisms: ["hype-before-ops"],
      goalFit: 0.8,
      requiresPaidSpend: false,
      requiredGateIds: ["gate-creator-rights"],
      hybridCompatible: ["founder-story-led", "community-first"]
    },
    {
      id: "scarcity-drop",
      label: "Honest-capacity scarcity drop",
      description: "Drop-as-event with real unit counts, claim restraint, waitlist capture on sell-out, and draws only under true oversubscription.",
      mechanisms: [
        "drop-as-event-temporary-retail",
        "craft-scarcity-integrity",
        "managed-scarcity-raffle",
        "viral-scarcity-stockout",
        "under-supplied-drop"
      ],
      contraMechanisms: ["hype-before-ops"],
      goalFit: 0.9,
      requiresPaidSpend: false,
      requiredGateIds: [],
      hybridCompatible: ["founder-story-led", "community-first"]
    },
    {
      id: "event-popup-led",
      label: "Event / pop-up-led city entry",
      description: "Physical city participation events as the demand engine before online proof.",
      mechanisms: ["city-participation", "drop-as-event-temporary-retail"],
      contraMechanisms: ["hype-before-ops"],
      goalFit: 0.6,
      requiresPaidSpend: false,
      requiredGateIds: ["gate-popup-ops"],
      hybridCompatible: []
    },
    {
      id: "wholesale-assisted",
      label: "Wholesale-assisted distribution",
      description: "Lean on third-party retail/wholesale accounts to move units before DTC proof.",
      mechanisms: [],
      contraMechanisms: ["hero-silhouette-dtc"],
      goalFit: 0.5,
      requiresPaidSpend: false,
      requiredGateIds: [],
      hybridCompatible: []
    },
    {
      id: "paid-performance-led",
      label: "Paid-performance-led acquisition",
      description: "Paid short-form acquisition as the primary demand engine with creative sprints and kill rules.",
      mechanisms: ["native-short-form", "governed-ugc"],
      contraMechanisms: ["hype-before-ops"],
      goalFit: 0.8,
      requiresPaidSpend: true,
      requiredGateIds: ["gate-auth-accounts", "gate-privacy-sms-us", "gate-creator-rights"],
      hybridCompatible: []
    }
  ];

  // Hybrids carry a breadth discount: more mechanisms means more coordination cost, so
  // union evidence is discounted rather than fully additive.
  const HYBRID_EVIDENCE_DISCOUNT = 0.75;

  // ---------------------------------------------------------------- wave templates

  interface WaveTemplate {
    mechanism: string;
    label: string;
    phaseId: string;
    budgetEligible: boolean;
    ownerRole: OwnerRole;
    action: string;
    metric: string;
    successThreshold: string;
    killRule: string;
    gateDependencies: string[];
  }

  const WAVE_TEMPLATES: WaveTemplate[] = [
    {
      mechanism: "world-building-founder-channel",
      label: "Founder world & image rules",
      phaseId: "P1",
      budgetEligible: true,
      ownerRole: "content",
      action: "Lock 3-must / 3-never image rules and ship one founder-led lookbook set that obeys them; cold-test recognition without logo.",
      metric: "logo-off recognition rate in a small cold panel",
      successThreshold: ">=40% recognition in a 20-person cold panel",
      killRule: "If two consecutive shoots fail the image rules review, stop and rewrite the rules before spending again.",
      gateDependencies: []
    },
    {
      mechanism: "founder-content-commerce",
      label: "Founder product-truth library",
      phaseId: "P1",
      budgetEligible: true,
      ownerRole: "founder",
      action: "Ship three founder fit/fabric/process clips, cut shorts for TikTok, land on one priced Shopify page.",
      metric: "qualified product/size/city actions per clip",
      successThreshold: ">=10 qualified actions across the three-clip set",
      killRule: "Kill the format after two sets with zero qualified actions; do not buy reach to rescue it.",
      gateDependencies: []
    },
    {
      mechanism: "community-first-content",
      label: "Community question loop",
      phaseId: "P1",
      budgetEligible: false,
      ownerRole: "content",
      action: "Run fit/sizing/fabric question loops on the five SKUs and visibly use the answers on product pages.",
      metric: "substantive answers per question post",
      successThreshold: ">=15 substantive answers per SKU question",
      killRule: "If three question posts get <3 substantive answers each, pause the loop and change the venue, not the product.",
      gateDependencies: []
    },
    {
      mechanism: "named-community-drops",
      label: "Named seed circle",
      phaseId: "P1",
      budgetEligible: true,
      ownerRole: "founder",
      action: "Define a named 15-20 person seed circle with disclosure and outcome obligations (early access in exchange for fit feedback and receipts).",
      metric: "circle members producing qualified actions",
      successThreshold: ">=8 of 15-20 members complete their outcome obligation",
      killRule: "If under half the circle completes obligations in 30 days, rebuild the circle rules before growing it.",
      gateDependencies: []
    },
    {
      mechanism: "community-media-events",
      label: "Founder long-form series",
      phaseId: "P1",
      budgetEligible: true,
      ownerRole: "founder",
      action: "Publish four founder long-form episodes tied to SKU fit questions; measure waitlist/size captures, not downloads.",
      metric: "waitlist/size captures attributed to episodes",
      successThreshold: ">=20 size-tagged captures across four episodes",
      killRule: "Kill the series format after four episodes with <5 captures; keep the community, change the medium.",
      gateDependencies: []
    },
    {
      mechanism: "world-coherence",
      label: "One-world asset system",
      phaseId: "P1",
      budgetEligible: false,
      ownerRole: "content",
      action: "Publish one product-truth YouTube cut + three TikToks + one PDP set sharing identical fit claims and imagery rules.",
      metric: "claim/imagery consistency audit across assets",
      successThreshold: "zero contradictory fit/fabric claims across published assets",
      killRule: "Any contradictory claim freezes new asset publishing until reconciled.",
      gateDependencies: []
    },
    {
      mechanism: "governed-ugc",
      label: "Governed creator test",
      phaseId: "P1",
      budgetEligible: true,
      ownerRole: "creator-ops",
      action: "Run one signed creator brief with FTC disclosure, claim guardrails, commercial-music clearance, and an outcome receipt.",
      metric: "qualified actions per governed creator post",
      successThreshold: ">=5 qualified actions from the first governed test",
      killRule: "No second creator until the first delivers its outcome receipt; kill the tier after two zero-action tests.",
      gateDependencies: ["gate-creator-rights"]
    },
    {
      mechanism: "native-short-form",
      label: "Native shorts sprint",
      phaseId: "P1",
      budgetEligible: true,
      ownerRole: "content",
      action: "Run a capped native short-form sprint (founder/employee clips) with kill rules on qualified actions, not views.",
      metric: "qualified actions per sprint",
      successThreshold: ">=10 qualified actions per sprint",
      killRule: "Kill any creative angle after 5 posts with zero qualified actions.",
      gateDependencies: []
    },
    {
      mechanism: "creator-metro-efficiency",
      label: "Metro creator sourcing",
      phaseId: "P1",
      budgetEligible: false,
      ownerRole: "research",
      action: "Build the reachable nano/micro creator outreach list for the wedge metro (authorized outreach only, no vanity counts).",
      metric: "reachable, brief-compatible creators listed with contact path",
      successThreshold: ">=10 reachable creators mapped in the wedge metro",
      killRule: "If the wedge metro yields <5 reachable creators, escalate to re-rank metros instead of forcing outreach.",
      gateDependencies: []
    },
    {
      mechanism: "artist-collab-drop",
      label: "Community-ritual creator collab",
      phaseId: "P2",
      budgetEligible: true,
      ownerRole: "creator-ops",
      action: "Partner with one governed nano creator whose community has native rituals/codes; tie one SKU moment to those codes with real unit counts.",
      metric: "ritual-attributed qualified actions",
      successThreshold: ">=15 qualified actions attributed to the collab window",
      killRule: "One collab at a time; kill the format if the first produces <5 qualified actions.",
      gateDependencies: ["gate-creator-rights"]
    },
    {
      mechanism: "craft-scarcity-integrity",
      label: "Claim ladder & capacity honesty",
      phaseId: "P2",
      budgetEligible: false,
      ownerRole: "founder",
      action: "Publish zero unproven materials claims; map every fibre/finish claim to a quote or sample photo; state real unit counts per SKU.",
      metric: "claims with attached proof artifacts",
      successThreshold: "100% of public claims trace to a proof artifact",
      killRule: "Any unproven claim published freezes the claims ladder until corrected.",
      gateDependencies: ["gate-textile-labels"]
    },
    {
      mechanism: "viral-scarcity-stockout",
      label: "Waitlist capture & restock path",
      phaseId: "P2",
      budgetEligible: true,
      ownerRole: "ops",
      action: "Route sold-out demand into size-tagged waitlists that count as receipts; pre-plan the restock/relaunch path.",
      metric: "size-tagged waitlist entries",
      successThreshold: ">=30 size-tagged waitlist entries before drop window",
      killRule: "If waitlist stays <10 after all signal waves complete, do not enlarge the drop; shrink it.",
      gateDependencies: []
    },
    {
      mechanism: "under-supplied-drop",
      label: "Drop sizing & limits disclosure",
      phaseId: "P2",
      budgetEligible: false,
      ownerRole: "ops",
      action: "Size the drop to the production ceiling honestly, state limits upfront, and publish the restock rule fed by waitlist receipts.",
      metric: "published unit counts vs actual planned units",
      successThreshold: "published counts match planned units exactly",
      killRule: "Any mismatch between published and real counts freezes drop comms until corrected.",
      gateDependencies: []
    },
    {
      mechanism: "managed-scarcity-raffle",
      label: "Oversubscription draw protocol",
      phaseId: "P2",
      budgetEligible: false,
      ownerRole: "ops",
      action: "Define the draw protocol used ONLY if a SKU's waitlist truly oversubscribes its real units (one entry per person, honest odds).",
      metric: "oversubscription ratio per SKU at drop",
      successThreshold: "draw triggers only when waitlist > units for a SKU",
      killRule: "Never simulate oversubscription; if none exists, sell first-come with honest counts.",
      gateDependencies: []
    },
    {
      mechanism: "drop-as-event-temporary-retail",
      label: "Drop-as-event calendar",
      phaseId: "P2",
      budgetEligible: true,
      ownerRole: "founder",
      action: "Publish one drop calendar with kill rules; treat the drop as a time-boxed event; pop-up only after metro receipts and a venue package.",
      metric: "calendar milestones hit with receipts",
      successThreshold: "all pre-drop milestones hit with receipt artifacts",
      killRule: "A missed hard milestone slips the drop window rather than skipping the gate.",
      gateDependencies: []
    },
    {
      mechanism: "city-participation",
      label: "RSVP-gated city event (post-receipts)",
      phaseId: "P3",
      budgetEligible: true,
      ownerRole: "ops",
      action: "After online metro receipts, run one RSVP-gated, capacity-capped try-on event with photo consent; no street mobs, no fake queues.",
      metric: "RSVPs honored vs capacity; on-site receipts",
      successThreshold: ">=70% RSVP show-rate at capped capacity",
      killRule: "No event until online receipts exist in that metro; cancel if venue/consent package incomplete.",
      gateDependencies: ["gate-popup-ops"]
    },
    {
      mechanism: "hero-silhouette-dtc",
      label: "Hero silhouette focus",
      phaseId: "P1",
      budgetEligible: false,
      ownerRole: "founder",
      action: "Pick one hero SKU; run all wave-0 content on that hero's fit truth; measure stylist/creator request rate and PDP actions.",
      metric: "hero-attributed requests and PDP actions",
      successThreshold: "hero SKU generates >=60% of qualified actions",
      killRule: "If the hero underperforms other SKUs two waves running, rotate the hero with reasons.",
      gateDependencies: []
    }
  ];

  // ---------------------------------------------------------------- helpers

  function clamp(n: number, lo = 0, hi = 100): number {
    return Math.max(lo, Math.min(hi, n));
  }

  function round2(n: number): number {
    return Math.round(n * 100) / 100;
  }

  function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }

  function hasEvidenceReference(value: string | undefined | null): boolean {
    if (!value) return false;
    const t = value.trim();
    if (!t || t.toUpperCase() === "TBD" || t === "-") return false;
    return /^(https?:\/\/|[\w.-]+\/)/i.test(t) || t.includes("/");
  }

  const SAME_INDUSTRY = ["fashion", "apparel", "streetwear", "luxury-fashion"];
  const ADJACENT_INDUSTRY = ["beauty-dtc", "footwear-sneakers", "accessories"];

  export function transferFactor(cardIndustry: string): number {
    const industry = (cardIndustry || "").toLowerCase();
    if (SAME_INDUSTRY.indexOf(industry) >= 0) return 1.0;
    if (ADJACENT_INDUSTRY.indexOf(industry) >= 0) return 0.8;
    return 0.6;
  }

  function isCrossIndustry(cardIndustry: string): boolean {
    return transferFactor(cardIndustry) < 1.0;
  }

  function usableCard(card: EvidenceCard): boolean {
    return (
      hasEvidenceReference(card.sourceUrl) &&
      !!card.dateChecked &&
      Number.isFinite(card.confidence) &&
      card.confidence > 0
    );
  }

  function gateOpen(g: RouteGate): boolean {
    return g.state !== "cleared-with-evidence";
  }

  function toEvidenceUse(card: EvidenceCard, weight: number): EvidenceUse {
    const use: EvidenceUse = {
      cardId: card.id,
      reference: card.reference,
      industry: card.industry,
      workedOrFailed: card.workedOrFailed,
      crossIndustry: isCrossIndustry(card.industry),
      transferFactor: transferFactor(card.industry),
      weight: round2(weight),
      why: card.why
    };
    if (isCrossIndustry(card.industry)) {
      use.tweakNote =
        card.tweakNote || `Adaptation required: ${card.transferabilityConditions.join(" ")}`;
    } else if (card.tweakNote) {
      use.tweakNote = card.tweakNote;
    }
    return use;
  }

  // ---------------------------------------------------------------- stage: strategy space

  interface CandidateStrategy {
    id: string;
    label: string;
    description: string;
    mechanisms: string[];
    contraMechanisms: string[];
    goalFit: number;
    requiresPaidSpend: boolean;
    requiredGateIds: string[];
    hybridOf?: string[];
  }

  function supportingWeight(archetype: { mechanisms: string[] }, library: EvidenceCard[]): number {
    let w = 0;
    for (const card of library) {
      if (!usableCard(card)) continue;
      if (archetype.mechanisms.indexOf(card.mechanism) < 0) continue;
      const cw = card.confidence * transferFactor(card.industry);
      if (card.workedOrFailed === "worked") w += cw;
      if (card.workedOrFailed === "mixed") w += cw * 0.5;
    }
    return w;
  }

  function generateStrategySpace(library: EvidenceCard[]): CandidateStrategy[] {
    const space: CandidateStrategy[] = ARCHETYPES.map((a) => ({
      id: a.id,
      label: a.label,
      description: a.description,
      mechanisms: [...a.mechanisms],
      contraMechanisms: [...a.contraMechanisms],
      goalFit: a.goalFit,
      requiresPaidSpend: a.requiresPaidSpend,
      requiredGateIds: [...a.requiredGateIds]
    }));

    const byId = new Map(ARCHETYPES.map((a) => [a.id, a] as [string, StrategyArchetype]));
    const seenPairs = new Set<string>();
    for (const a of ARCHETYPES) {
      for (const otherId of a.hybridCompatible) {
        const b = byId.get(otherId);
        if (!b) continue;
        const key = [a.id, b.id].sort().join("+");
        if (seenPairs.has(key)) continue;
        seenPairs.add(key);
        // Only build hybrids where both halves have at least one supporting card.
        if (supportingWeight(a, library) <= 0 || supportingWeight(b, library) <= 0) continue;
        const pair = [a.id, b.id].sort();
        const first = byId.get(pair[0])!;
        const second = byId.get(pair[1])!;
        const mechanisms: string[] = [];
        for (const m of [...first.mechanisms, ...second.mechanisms]) {
          if (mechanisms.indexOf(m) < 0) mechanisms.push(m);
        }
        const contra: string[] = [];
        for (const m of [...first.contraMechanisms, ...second.contraMechanisms]) {
          if (contra.indexOf(m) < 0) contra.push(m);
        }
        const gateIds: string[] = [];
        for (const g of [...first.requiredGateIds, ...second.requiredGateIds]) {
          if (gateIds.indexOf(g) < 0) gateIds.push(g);
        }
        space.push({
          id: `hybrid-${pair[0]}+${pair[1]}`,
          label: `Hybrid: ${first.label} + ${second.label}`,
          description: `${first.description} Combined with: ${second.description}`,
          mechanisms,
          contraMechanisms: contra,
          goalFit: round2(Math.min(0.95, Math.max(first.goalFit, second.goalFit) + 0.05)),
          requiresPaidSpend: first.requiresPaidSpend || second.requiresPaidSpend,
          requiredGateIds: gateIds,
          hybridOf: pair
        });
      }
    }
    space.sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
    return space;
  }

  // ---------------------------------------------------------------- stage: stress test + scoring

  function stressTest(strategy: CandidateStrategy, library: EvidenceCard[], gates: RouteGate[]): StressReport {
    const supporting: EvidenceUse[] = [];
    const contradicting: EvidenceUse[] = [];

    for (const card of library) {
      if (!usableCard(card)) continue;
      const w = card.confidence * transferFactor(card.industry);
      const matches = strategy.mechanisms.indexOf(card.mechanism) >= 0;
      const contraMatch = strategy.contraMechanisms.indexOf(card.mechanism) >= 0;
      if (matches) {
        if (card.workedOrFailed === "worked") supporting.push(toEvidenceUse(card, w));
        else if (card.workedOrFailed === "failed") contradicting.push(toEvidenceUse(card, w));
        else {
          supporting.push(toEvidenceUse(card, w * 0.5));
          contradicting.push(toEvidenceUse(card, w * 0.5));
        }
      } else if (contraMatch) {
        // The source documents this strategy's anti-pattern (e.g., wholesale before DTC proof).
        const use = toEvidenceUse(card, w);
        use.why = `Documented anti-pattern for this strategy: ${card.why}`;
        contradicting.push(use);
      }
    }

    const relevantGateIds = new Set<string>();
    for (const g of gates) {
      if (g.hardStop) relevantGateIds.add(g.id);
    }
    for (const id of strategy.requiredGateIds) relevantGateIds.add(id);

    const openGateIds: string[] = [];
    for (const g of gates) {
      if (relevantGateIds.has(g.id) && gateOpen(g)) openGateIds.push(g.id);
    }
    openGateIds.sort();

    const frozenCapabilities: string[] = [];
    const authGate = gates.filter((g) => g.id === "gate-auth-accounts" && gateOpen(g))[0];
    if (strategy.requiresPaidSpend && authGate) {
      frozenCapabilities.push("paid spend frozen (gate-auth-accounts open)");
    }
    for (const reqId of strategy.requiredGateIds) {
      const g = gates.filter((x) => x.id === reqId && gateOpen(x))[0];
      if (g) frozenCapabilities.push(`${g.label} not cleared (${g.id})`);
    }

    const firstOpenHard = gates.filter((g) => g.hardStop && gateOpen(g))[0];
    const breaksFirst = strategy.requiresPaidSpend && authGate
      ? "Paid spend before account authorization breaks first — spend without consent/authorization evidence."
      : firstOpenHard
        ? `Commerce execution breaks first at open hard stop: ${firstOpenHard.label}.`
        : "No open hard stops — execution risk shifts to creative/measurement quality.";

    return {
      strategyId: strategy.id,
      supporting,
      contradicting,
      unpreparedness: { openGateIds, breaksFirst, frozenCapabilities }
    };
  }

  function assessStrategy(
    strategy: CandidateStrategy,
    library: EvidenceCard[],
    gates: RouteGate[]
  ): StrategyAssessment {
    const stress = stressTest(strategy, library, gates);

    let supportW = 0;
    for (const s of stress.supporting) supportW += s.weight;
    let contraW = 0;
    for (const c of stress.contradicting) contraW += c.weight;

    // Failure evidence lowers the score with reasons but never zeroes a supported strategy.
    let raw = supportW - 0.5 * contraW;
    if (supportW > 0) raw = Math.max(raw, 0.2 * supportW);
    if (supportW <= 0) raw = Math.max(raw, 0);
    let evidenceScore = clamp(raw * 20);
    if (strategy.hybridOf) evidenceScore = clamp(evidenceScore * HYBRID_EVIDENCE_DISCOUNT);

    const evidenceConfidence = supportW + contraW > 0 ? round2(supportW / (supportW + contraW)) : 0;

    const relevant = new Set<string>();
    for (const g of gates) if (g.hardStop) relevant.add(g.id);
    for (const id of strategy.requiredGateIds) relevant.add(id);
    let cleared = 0;
    let total = 0;
    for (const g of gates) {
      if (!relevant.has(g.id)) continue;
      total += 1;
      if (!gateOpen(g)) cleared += 1;
    }
    let preparedness = total > 0 ? 0.25 + 0.75 * (cleared / total) : 1;
    if (strategy.requiresPaidSpend && stress.unpreparedness.frozenCapabilities.some((f) => f.indexOf("paid spend frozen") >= 0)) {
      preparedness *= 0.6;
    }
    preparedness = round2(preparedness);

    const totalScore = round2(evidenceScore * preparedness * strategy.goalFit);

    const reasons: string[] = [
      `${stress.supporting.length} supporting vs ${stress.contradicting.length} contradicting external receipts (support weight ${round2(supportW)}, contradiction weight ${round2(contraW)}).`,
      `Preparedness ${preparedness} from ${cleared}/${total} relevant hard-stop/required gates cleared with evidence.`,
      `Goal-fit heuristic ${strategy.goalFit} toward the sell-through goal (documented working assumption, recalibrated by first-party receipts).`
    ];
    if (stress.contradicting.length) {
      reasons.push(
        `Failure evidence lowered (did not zero) this strategy: ${stress.contradicting.map((c) => c.reference).join("; ")}.`
      );
    }

    const assessment: StrategyAssessment = {
      strategyId: strategy.id,
      label: strategy.label,
      description: strategy.description,
      mechanisms: [...strategy.mechanisms],
      evidenceScore: round2(evidenceScore),
      evidenceConfidence,
      preparedness,
      goalFit: strategy.goalFit,
      totalScore,
      stress,
      reasons
    };
    if (strategy.hybridOf) assessment.hybridOf = [...strategy.hybridOf];
    return assessment;
  }

  // ---------------------------------------------------------------- stage: plan compilation

  function templateFor(mechanism: string): WaveTemplate | null {
    for (const t of WAVE_TEMPLATES) if (t.mechanism === mechanism) return t;
    return null;
  }

  function cardsForMechanism(mechanism: string, library: EvidenceCard[]): EvidenceCard[] {
    return library.filter((c) => usableCard(c) && c.mechanism === mechanism);
  }

  function freezeStateFor(
    gateDependencies: string[],
    gates: RouteGate[]
  ): { status: WaveStatus; frozenReason?: string } {
    const openHard = gates.filter((g) => g.hardStop && gateOpen(g) && gateDependencies.indexOf(g.id) >= 0);
    if (openHard.length) {
      return {
        status: "frozen",
        frozenReason: `Hard-stop gate(s) open: ${openHard.map((g) => g.id).join(", ")} — branch frozen until cleared with evidence.`
      };
    }
    return { status: "ready" };
  }

  function buildActionItem(
    idPrefix: string,
    template: WaveTemplate,
    library: EvidenceCard[],
    gates: RouteGate[],
    budgetCapCad: number
  ): ActionItem {
    const cards = cardsForMechanism(template.mechanism, library);
    const freeze = freezeStateFor(template.gateDependencies, gates);
    const item: ActionItem = {
      id: `${idPrefix}-item-1`,
      action: template.action,
      ownerRole: template.ownerRole,
      budgetCapCad,
      measurement: {
        metric: template.metric,
        receiptRequired: true,
        successThreshold: template.successThreshold,
        killRule: template.killRule
      },
      gateDependencies: [...template.gateDependencies],
      evidenceCardIds: cards.map((c) => c.id),
      evidenceLabel: cards.length ? "evidence-backed" : "working-assumption",
      status: freeze.status
    };
    if (freeze.frozenReason) item.frozenReason = freeze.frozenReason;
    return item;
  }

  function compilePlan(
    winner: StrategyAssessment,
    input: EngineInput,
    generatedAt: string
  ): GeneratedPlan {
    const brand = input.brand;
    const gates = input.gates || [];
    const library = input.library || [];
    const goal = brand.sellThroughGoalPct ?? DEFAULT_SELL_THROUGH_GOAL_PCT;
    const pool = Math.max(0, brand.testCashPoolCad ?? 0);
    const wedgeMetro = input.markets && input.markets.length ? input.markets[0].metro : null;
    const asOf = generatedAt.slice(0, 10);

    const phases: PlanPhase[] = [
      { id: "P0", label: "Preparedness & gate clearance", objective: "Close hard-stop gates with evidence before any spend escalation.", waveIds: [] },
      { id: "P1", label: "Organic signal waves", objective: "Earn qualified actions from the winning mechanisms without paid reach.", waveIds: [] },
      { id: "P2", label: "Conversion proof & drop staging", objective: "Convert signal into size-tagged waitlist/checkout receipts and stage the drop honestly.", waveIds: [] },
      { id: "P3", label: "Drop window execution", objective: `Execute the drop toward the ${goal}% sell-through goal with live instrumentation.`, waveIds: [] },
      { id: "P4", label: "Recalibration loop", objective: "Plug first-party receipts back into the engine; reallocate, kill, or scale with an audit trail.", waveIds: [] }
    ];
    const waves: PlanWave[] = [];

    // P0 — one wave, one item per open hard-stop gate.
    const openHard = gates.filter((g) => g.hardStop && gateOpen(g));
    const prepCards = library.filter((c) => usableCard(c) && c.mechanism === "cross-border-preparedness");
    const p0Items: ActionItem[] = openHard.map((g, i) => ({
      id: `p0-gate-${g.id}`,
      action: `Clear gate "${g.label}" with evidence (current state: ${g.state}).${g.notes ? " " + g.notes : ""}`,
      ownerRole: (g.id.indexOf("tax") >= 0 || g.id.indexOf("gst") >= 0 ? "finance" : "ops") as OwnerRole,
      budgetCapCad: 0,
      measurement: {
        metric: `gate ${g.id} state`,
        receiptRequired: true,
        successThreshold: "state = cleared-with-evidence with artifact attached",
        killRule: "If this gate cannot clear before the drop window, all dependent branches stay frozen — the window slips, the gate does not."
      },
      gateDependencies: [g.id],
      evidenceCardIds: prepCards.map((c) => c.id),
      evidenceLabel: prepCards.length ? "evidence-backed" : "working-assumption",
      status: "ready"
    }));
    if (p0Items.length) {
      waves.push({
        id: "wave-p0-gates",
        label: "Gate clearance",
        mechanism: "cross-border-preparedness",
        phaseId: "P0",
        budgetCapCad: 0,
        status: "ready",
        items: p0Items
      });
    }

    // P1/P2 — mechanism waves from the winning strategy, ranked by supporting evidence weight.
    const mechWeights: { mechanism: string; weight: number }[] = winner.mechanisms
      .map((m) => {
        let w = 0;
        for (const c of cardsForMechanism(m, library)) {
          const cw = c.confidence * transferFactor(c.industry);
          if (c.workedOrFailed === "worked") w += cw;
          if (c.workedOrFailed === "mixed") w += cw * 0.5;
        }
        return { mechanism: m, weight: w };
      })
      .filter((x) => templateFor(x.mechanism) !== null)
      .sort((a, b) => b.weight - a.weight || (a.mechanism < b.mechanism ? -1 : 1));

    const selected = mechWeights.slice(0, 6);
    for (const { mechanism } of selected) {
      const template = templateFor(mechanism)!;
      const freeze = freezeStateFor(template.gateDependencies, gates);
      const wave: PlanWave = {
        id: `wave-${mechanism}`,
        label: template.label,
        mechanism,
        phaseId: template.phaseId,
        budgetCapCad: 0, // allocated below
        status: freeze.status,
        items: []
      };
      if (freeze.frozenReason) wave.frozenReason = freeze.frozenReason;
      wave.items.push(buildActionItem(wave.id, template, library, gates, 0));
      waves.push(wave);
    }

    // P3 — drop window wave, frozen until every hard stop clears.
    const allHardIds = gates.filter((g) => g.hardStop).map((g) => g.id);
    const p3Freeze = freezeStateFor(allHardIds, gates);
    const dropWave: PlanWave = {
      id: "wave-p3-drop-window",
      label: "Drop window execution & sell-through instrumentation",
      mechanism: "drop-window-execution",
      phaseId: "P3",
      budgetCapCad: 0,
      status: p3Freeze.status,
      items: [
        {
          id: "wave-p3-drop-window-item-1",
          action: `Open the drop with published real unit counts per SKU and live sell-through tracking against the ${goal}% goal${wedgeMetro ? `, wedge metro ${wedgeMetro}` : ""}.`,
          ownerRole: "founder",
          budgetCapCad: 0,
          measurement: {
            metric: "sell-through % by SKU vs goal",
            receiptRequired: true,
            successThreshold: `>=${goal}% sell-through across the drop window`,
            killRule: "If overall sell-through tracks >20 points under goal at the window midpoint, trigger recalibration instead of discounting."
          },
          gateDependencies: allHardIds,
          evidenceCardIds: cardsForMechanism("under-supplied-drop", library)
            .concat(cardsForMechanism("viral-scarcity-stockout", library))
            .map((c) => c.id),
          evidenceLabel:
            cardsForMechanism("under-supplied-drop", library).length ||
            cardsForMechanism("viral-scarcity-stockout", library).length
              ? "evidence-backed"
              : "working-assumption",
          status: p3Freeze.status
        }
      ]
    };
    if (p3Freeze.frozenReason) {
      dropWave.frozenReason = p3Freeze.frozenReason;
      dropWave.items[0].frozenReason = p3Freeze.frozenReason;
    }
    waves.push(dropWave);

    // P4 — recalibration wave, always ready, zero budget.
    waves.push({
      id: "wave-p4-recalibration",
      label: "Results ingest & plan recalibration",
      mechanism: "calibration-loop",
      phaseId: "P4",
      budgetCapCad: 0,
      status: "ready",
      items: [
        {
          id: "wave-p4-recalibration-item-1",
          action: "Feed first-party receipts (sessions, purchases, sell-through by SKU, wave outcomes) back into the strategy generator; apply its reallocation/kill/scale output with the audit trail.",
          ownerRole: "research",
          budgetCapCad: 0,
          measurement: {
            metric: "distance to sell-through goal after recalibration",
            receiptRequired: true,
            successThreshold: "distance-to-goal shrinks or a reversal condition fires",
            killRule: "If two recalibrations in a row worsen distance-to-goal, escalate to strategy reversal (runner-up)."
          },
          gateDependencies: [],
          evidenceCardIds: [],
          evidenceLabel: "working-assumption",
          status: "ready"
        }
      ]
    });

    // Budget allocation from the test cash pool — never the production ceiling.
    const eligible = waves.filter((w) => {
      const t = templateFor(w.mechanism);
      return w.status === "ready" && t !== null && t.budgetEligible;
    });
    let allocated = 0;
    if (pool > 0 && eligible.length) {
      const share = Math.floor(pool / eligible.length);
      for (const w of eligible) {
        w.budgetCapCad = share;
        for (const item of w.items) item.budgetCapCad = share;
        allocated += share;
      }
    }

    for (const phase of phases) {
      phase.waveIds = waves.filter((w) => w.phaseId === phase.id).map((w) => w.id);
    }

    return {
      planId: `plan-${winner.strategyId}-${asOf}`,
      strategyId: winner.strategyId,
      strategyLabel: winner.label,
      wedgeMetro,
      goalSellThroughPct: goal,
      testCashPoolCad: pool,
      productionCeilingCad: { ...brand.productionCeilingCad },
      budgetAllocatedCad: allocated,
      phases,
      waves,
      cashPolicy: `Test spend is capped by the C$${pool} test cash pool and is fully separate from the C$${brand.productionCeilingCad.min}-C$${brand.productionCeilingCad.max} production ceiling; no plan line authorizes production spend.`
    };
  }

  // ---------------------------------------------------------------- stage: remix mode

  function remixPlan(
    existing: ExistingPlanInput,
    winner: StrategyAssessment,
    input: EngineInput,
    generatedAt: string
  ): { plan: GeneratedPlan; improvements: RemixImprovement[] } {
    const improvements: RemixImprovement[] = [];
    const gates = input.gates || [];
    const library = input.library || [];
    const brand = input.brand;
    const pool = Math.max(0, brand.testCashPoolCad ?? existing.testCashPoolCad ?? 0);
    const goal = brand.sellThroughGoalPct ?? DEFAULT_SELL_THROUGH_GOAL_PCT;
    const asOf = generatedAt.slice(0, 10);

    const waves: PlanWave[] = [];
    const existingWaves = existing.waves || [];
    let counter = 0;

    for (const raw of existingWaves) {
      counter += 1;
      const waveId = raw.id || `remixed-wave-${counter}`;
      const mechanism = raw.mechanism || "unspecified";
      const items: ActionItem[] = [];
      const rawItems = raw.items && raw.items.length ? raw.items : [{}];
      let itemCounter = 0;

      for (const ri of rawItems) {
        itemCounter += 1;
        const deps = ri.gateDependencies || [];
        const freeze = freezeStateFor(deps, gates);
        const cardIds = ri.evidenceCardIds || [];
        const validCards = cardIds.filter((id) => library.some((c) => c.id === id && usableCard(c)));
        let label: EvidenceLabel = validCards.length ? "evidence-backed" : "working-assumption";

        if (!validCards.length && ri.evidenceLabel === "evidence-backed") {
          improvements.push({
            target: `${waveId}/${ri.id || `item-${itemCounter}`}`,
            change: "Relabeled evidence-backed → working-assumption",
            reason: "Item claimed evidence backing but cited no usable evidence card; every plan line must trace to evidence or be labeled working-assumption.",
            evidenceCardIds: []
          });
        }

        const measurement: Measurement = {
          metric: (ri.measurement && ri.measurement.metric) || "qualified actions with receipt artifact",
          receiptRequired: true,
          successThreshold:
            (ri.measurement && ri.measurement.successThreshold) || "explicit threshold to be set by owner before launch",
          killRule: (ri.measurement && ri.measurement.killRule) || "Kill after two measurement windows with zero qualified actions."
        };
        if (!ri.measurement || !ri.measurement.killRule) {
          improvements.push({
            target: `${waveId}/${ri.id || `item-${itemCounter}`}`,
            change: "Added missing kill rule / measurement contract",
            reason: "Every action item needs a measurement contract with a kill rule; hype without a stop condition is the documented unpreparedness failure mode.",
            evidenceCardIds: cardsForMechanism("hype-before-ops", library).map((c) => c.id)
          });
        }

        let budget = Math.max(0, ri.budgetCapCad || 0);
        if (budget > pool) {
          improvements.push({
            target: `${waveId}/${ri.id || `item-${itemCounter}`}`,
            change: `Clamped budget C$${budget} → C$${pool}`,
            reason: `Item budget exceeded the C$${pool} test cash pool; test spend never draws from the production ceiling.`,
            evidenceCardIds: []
          });
          budget = pool;
        }

        if (freeze.status === "frozen" && ri.status !== "frozen") {
          improvements.push({
            target: `${waveId}/${ri.id || `item-${itemCounter}`}`,
            change: "Froze item on open hard-stop gate(s)",
            reason: freeze.frozenReason || "Open hard-stop gate dependency.",
            evidenceCardIds: cardsForMechanism("cross-border-preparedness", library).map((c) => c.id)
          });
        }

        const item: ActionItem = {
          id: ri.id || `${waveId}-item-${itemCounter}`,
          action: ri.action || "Action carried over from existing plan (was unnamed).",
          ownerRole: (ri.ownerRole as OwnerRole) || "founder",
          budgetCapCad: budget,
          measurement,
          gateDependencies: [...deps],
          evidenceCardIds: validCards,
          evidenceLabel: label,
          status: freeze.status
        };
        if (freeze.frozenReason) item.frozenReason = freeze.frozenReason;
        items.push(item);
      }

      const waveFrozen = items.some((i) => i.status === "frozen");
      let waveBudget = 0;
      for (const i of items) waveBudget += i.budgetCapCad;
      const wave: PlanWave = {
        id: waveId,
        label: raw.label || `Remixed wave ${counter}`,
        mechanism,
        phaseId: raw.phaseId || "P1",
        budgetCapCad: waveBudget,
        status: waveFrozen ? "frozen" : "ready",
        items
      };
      if (waveFrozen) wave.frozenReason = items.filter((i) => i.frozenReason)[0]?.frozenReason;
      waves.push(wave);
    }

    // Add winner mechanisms the existing plan does not cover.
    const covered = new Set(waves.map((w) => w.mechanism));
    const missing = winner.mechanisms.filter((m) => !covered.has(m) && templateFor(m) !== null);
    for (const mechanism of missing.slice(0, 3)) {
      const template = templateFor(mechanism)!;
      const freeze = freezeStateFor(template.gateDependencies, gates);
      const wave: PlanWave = {
        id: `wave-${mechanism}`,
        label: template.label,
        mechanism,
        phaseId: template.phaseId,
        budgetCapCad: 0,
        status: freeze.status,
        items: [buildActionItem(`wave-${mechanism}`, template, library, gates, 0)]
      };
      if (freeze.frozenReason) wave.frozenReason = freeze.frozenReason;
      waves.push(wave);
      improvements.push({
        target: wave.id,
        change: `Added missing wave "${template.label}" (${mechanism})`,
        reason: `Winning strategy "${winner.label}" relies on this mechanism and the existing plan did not cover it.`,
        evidenceCardIds: cardsForMechanism(mechanism, library).map((c) => c.id)
      });
    }

    // Enforce pool ceiling across the whole remixed plan.
    let totalBudget = 0;
    for (const w of waves) totalBudget += w.budgetCapCad;
    if (totalBudget > pool) {
      const scale = pool > 0 ? pool / totalBudget : 0;
      for (const w of waves) {
        const prior = w.budgetCapCad;
        w.budgetCapCad = Math.floor(w.budgetCapCad * scale);
        for (const item of w.items) item.budgetCapCad = Math.floor(item.budgetCapCad * scale);
        if (prior !== w.budgetCapCad) {
          improvements.push({
            target: w.id,
            change: `Scaled wave budget C$${prior} → C$${w.budgetCapCad}`,
            reason: `Total plan budget exceeded the C$${pool} test cash pool; caps rescaled so the pool is never exceeded and the production ceiling is never touched.`,
            evidenceCardIds: []
          });
        }
      }
      totalBudget = 0;
      for (const w of waves) totalBudget += w.budgetCapCad;
    }

    const phaseIds: string[] = [];
    for (const w of waves) if (phaseIds.indexOf(w.phaseId) < 0) phaseIds.push(w.phaseId);
    phaseIds.sort();
    const phases: PlanPhase[] = phaseIds.map((pid) => ({
      id: pid,
      label: pid === "P0" ? "Preparedness & gate clearance" : pid === "P1" ? "Organic signal waves" : pid === "P2" ? "Conversion proof & drop staging" : pid === "P3" ? "Drop window execution" : "Recalibration loop",
      objective: "Remixed phase — see wave measurement contracts.",
      waveIds: waves.filter((w) => w.phaseId === pid).map((w) => w.id)
    }));

    const plan: GeneratedPlan = {
      planId: `plan-remix-${winner.strategyId}-${asOf}`,
      strategyId: winner.strategyId,
      strategyLabel: winner.label,
      wedgeMetro: input.markets && input.markets.length ? input.markets[0].metro : null,
      goalSellThroughPct: goal,
      testCashPoolCad: pool,
      productionCeilingCad: { ...brand.productionCeilingCad },
      budgetAllocatedCad: totalBudget,
      phases,
      waves,
      cashPolicy: `Test spend is capped by the C$${pool} test cash pool and is fully separate from the C$${brand.productionCeilingCad.min}-C$${brand.productionCeilingCad.max} production ceiling; no plan line authorizes production spend.`
    };
    return { plan, improvements };
  }

  // ---------------------------------------------------------------- stage: calibration loop

  function calibrate(
    plan: GeneratedPlan,
    winner: StrategyAssessment,
    results: FirstPartyResults,
    goal: number
  ): CalibrationReport {
    const auditTrail: AuditEntry[] = [];

    // Sell-through tracker.
    const skuTracker: { skuId: string; sellThroughPct: number; distanceToGoalPct: number }[] = [];
    let plannedTotal = 0;
    let soldTotal = 0;
    for (const r of results.sellThroughBySku || []) {
      if (!(r.unitsPlanned > 0)) continue;
      plannedTotal += r.unitsPlanned;
      soldTotal += r.unitsSold;
      const pct = round2((r.unitsSold / r.unitsPlanned) * 100);
      skuTracker.push({ skuId: r.skuId, sellThroughPct: pct, distanceToGoalPct: round2(goal - pct) });
    }
    const overall = plannedTotal > 0 ? round2((soldTotal / plannedTotal) * 100) : null;
    const distance = overall === null ? null : round2(goal - overall);

    // Wave outcomes → kill / scale / reallocate within the pool.
    const byWave = new Map(plan.waves.map((w) => [w.id, w] as [string, PlanWave]));
    let passes = 0;
    let fails = 0;
    let freed = 0;
    const scaledWaves: PlanWave[] = [];

    for (const outcome of results.waveOutcomes || []) {
      const wave = byWave.get(outcome.waveId);
      if (!wave) continue;
      if (!hasEvidenceReference(outcome.receiptUrl)) {
        auditTrail.push({
          stage: "wave-calibration",
          subject: outcome.waveId,
          prior: wave.budgetCapCad,
          evidence: "none",
          posterior: wave.budgetCapCad,
          changeMade: "ignored",
          why: "Wave outcome supplied without a receipt artifact — receipts are required; no change applied."
        });
        continue;
      }
      const prior = wave.budgetCapCad;
      if (outcome.outcome === "fail") {
        fails += 1;
        freed += wave.budgetCapCad;
        wave.status = "killed";
        wave.budgetCapCad = 0;
        for (const item of wave.items) {
          item.status = "killed";
          item.budgetCapCad = 0;
        }
        auditTrail.push({
          stage: "wave-calibration",
          subject: outcome.waveId,
          prior,
          evidence: outcome.receiptUrl,
          posterior: 0,
          changeMade: "killed wave, freed budget",
          why: `First-party receipt shows failure (${outcome.qualifiedActions} qualified actions for C$${outcome.spendCad}); kill rule applied — failure is fine, budget moves toward the ${goal}% goal.`
        });
      } else if (outcome.outcome === "pass") {
        passes += 1;
        wave.status = "scaled";
        scaledWaves.push(wave);
        auditTrail.push({
          stage: "wave-calibration",
          subject: outcome.waveId,
          prior,
          evidence: outcome.receiptUrl,
          posterior: prior,
          changeMade: "marked for scale-up",
          why: `First-party receipt shows success (${outcome.qualifiedActions} qualified actions for C$${outcome.spendCad}); wave earns reallocated budget toward the ${goal}% goal.`
        });
      } else {
        auditTrail.push({
          stage: "wave-calibration",
          subject: outcome.waveId,
          prior,
          evidence: outcome.receiptUrl,
          posterior: prior,
          changeMade: "held",
          why: "Inconclusive receipt — hold budget, rerun the measurement window."
        });
      }
    }

    // Reallocate freed budget to scaled waves, never exceeding the pool.
    if (freed > 0 && scaledWaves.length) {
      const share = Math.floor(freed / scaledWaves.length);
      for (const wave of scaledWaves) {
        const prior = wave.budgetCapCad;
        let currentTotal = 0;
        for (const w of plan.waves) currentTotal += w.budgetCapCad;
        const headroom = Math.max(0, plan.testCashPoolCad - currentTotal);
        const add = Math.min(share, headroom);
        wave.budgetCapCad += add;
        if (wave.items.length) wave.items[0].budgetCapCad += add;
        auditTrail.push({
          stage: "budget-reallocation",
          subject: wave.id,
          prior,
          evidence: "freed budget from killed waves",
          posterior: wave.budgetCapCad,
          changeMade: `reallocated C$${add}`,
          why: `Budget moved from failing to passing waves to close the distance to the ${goal}% sell-through goal; pool ceiling respected.`
        });
      }
    }
    let newAllocated = 0;
    for (const w of plan.waves) newAllocated += w.budgetCapCad;
    plan.budgetAllocatedCad = newAllocated;

    // Posterior strategy score: first-party receipts outweigh priors.
    const prior = winner.totalScore;
    let posterior = prior + passes * 6 - fails * 6;
    if (distance !== null) {
      posterior += distance <= 0 ? 8 : distance < 20 ? 2 : -4;
    }
    posterior = round2(clamp(posterior));
    auditTrail.push({
      stage: "strategy-posterior",
      subject: winner.strategyId,
      prior,
      evidence: `${passes} pass / ${fails} fail wave receipts${overall !== null ? `; overall sell-through ${overall}%` : ""}`,
      posterior,
      changeMade: "recomputed posterior strategy score",
      why: "First-party receipts recalibrate the external-prior score; the plan steers toward the sell-through goal."
    });

    return {
      asOf: results.asOf,
      overallSellThroughPct: overall,
      distanceToGoalPct: distance,
      skuTracker,
      priorWinnerScore: prior,
      posteriorWinnerScore: posterior,
      auditTrail
    };
  }

  // ---------------------------------------------------------------- main entry

  export function generateStrategy(rawInput: EngineInput): StrategyRecommendation {
    // Never mutate caller inputs.
    const input = deepClone(rawInput);
    const generatedAt = input.generatedAt || new Date().toISOString();
    const brand = input.brand;
    const goal = brand.sellThroughGoalPct ?? DEFAULT_SELL_THROUGH_GOAL_PCT;
    const gates = input.gates || [];
    const library = (input.library || []).filter(usableCard);

    // Stage 1-3: strategy space, stress tests, scoring.
    const space = generateStrategySpace(library);
    const ranked = space
      .map((s) => assessStrategy(s, library, gates))
      .sort(
        (a, b) =>
          b.totalScore - a.totalScore ||
          b.evidenceConfidence - a.evidenceConfidence ||
          (a.strategyId < b.strategyId ? -1 : 1)
      );

    // Stage 4: winner selection — public priors are sufficient; zero first-party sales required.
    const winner = ranked.length && ranked[0].stress.supporting.length > 0 ? ranked[0] : null;
    const runnerUp = winner ? ranked.filter((r) => r.strategyId !== winner.strategyId)[0] || null : null;

    const reversalConditions = winner
      ? [
          `If two or more first-party wave receipts show ${runnerUp ? `runner-up (${runnerUp.label})` : "another strategy's"} mechanisms outperforming the winner's, switch strategies and re-run the generator.`,
          "If any hard-stop gate becomes permanently blocked (not just open), freeze the plan and re-rank with that constraint.",
          `If post-drop sell-through tracks more than 20 points under the ${goal}% goal at the window midpoint, trigger recalibration before any new spend.`,
          "If new external failure evidence lands for a core winner mechanism, rescore — failure evidence lowers with reasons, it does not hide."
        ]
      : ["Add at least one usable evidence card (sourceUrl + dateChecked + confidence) so a strategy can earn support."];

    // Stage 5: plan compilation — from scratch or remix.
    let mode: PlanMode = "from-scratch";
    let plan: GeneratedPlan | null = null;
    let remixImprovements: RemixImprovement[] = [];
    if (winner) {
      if (input.existingPlan && input.existingPlan.waves && input.existingPlan.waves.length) {
        mode = "remix";
        const remixed = remixPlan(input.existingPlan, winner, input, generatedAt);
        plan = remixed.plan;
        remixImprovements = remixed.improvements;
      } else {
        plan = compilePlan(winner, input, generatedAt);
      }
    }

    // Stage 6: calibration loop (only when first-party results are supplied).
    let calibration: CalibrationReport | null = null;
    if (winner && plan && input.firstPartyResults) {
      calibration = calibrate(plan, winner, input.firstPartyResults, goal);
    }

    // Stage 7: safety invariants + unpreparedness report.
    const unpreparednessReport: UnpreparednessLine[] = gates
      .filter((g) => gateOpen(g))
      .map((g) => ({
        gateId: g.id,
        label: g.label,
        state: g.state,
        hardStop: g.hardStop,
        consequence: g.hardStop
          ? "Hard stop — plan branches depending on this gate are frozen; no spend escalation through it."
          : "Soft gate — flagged, does not freeze branches by itself."
      }));

    const assumptions: string[] = [
      `Sell-through goal ${goal}% is the pre-existing founder goal; the engine steers toward it but never claims it is achieved.`,
      `Test cash pool C$${Math.max(0, brand.testCashPoolCad ?? 0)} is a founder-configurable working assumption, fully separate from the C$${brand.productionCeilingCad.min}-C$${brand.productionCeilingCad.max} production ceiling.`,
      "Goal-fit weights per strategy archetype are documented heuristics (working assumptions) that first-party receipts recalibrate.",
      "Evidence cards describe what worked/failed for other companies; cross-industry cards carry an explicit transferability discount and tweak note.",
      "Wedge metro is taken from the first supplied market candidate (assumed pre-ranked by the positioning engine)."
    ];
    if (input.macro && (input.macro.headwinds?.length || input.macro.tailwinds?.length)) {
      assumptions.push(
        `Macro context supplied (${(input.macro.headwinds || []).length} headwind(s), ${(input.macro.tailwinds || []).length} tailwind(s)) — treated as planning context, not demand evidence.`
      );
    }

    return {
      version: ENGINE_VERSION,
      generatedAt,
      mode,
      goalSellThroughPct: goal,
      winner,
      runnerUp,
      rankedStrategies: ranked,
      reversalConditions,
      plan,
      remixImprovements,
      calibration,
      unpreparednessReport,
      assumptions,
      safety: {
        demandProofClaim: false,
        dropOsImpact: "none",
        productionSpendAuthorizedCad: 0,
        invariants: [
          "Engine-generated forecast plan from external receipts (public priors); not demand proof.",
          "No production spend is authorized; the production ceiling is untouched by test budgets.",
          "Open hard-stop gates freeze affected plan branches until cleared with evidence.",
          "Every plan line traces to at least one evidence card or is labeled working-assumption.",
          "This output never authorizes Drop OS launch decisions."
        ]
      }
    };
  }

  // Exported for tests
  export const __test = {
    clamp,
    round2,
    transferFactor,
    hasEvidenceReference,
    HYBRID_EVIDENCE_DISCOUNT,
    ARCHETYPE_IDS: ARCHETYPES.map((a) => a.id)
  };
}
