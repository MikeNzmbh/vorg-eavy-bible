"use strict";
var VorgDropAlgorithm;
(function (VorgDropAlgorithm) {
    VorgDropAlgorithm.ALGORITHM_VERSION = "VORG Drop OS score v0.4";
    VorgDropAlgorithm.STRESS_LABELS = [
        { key: "demand", label: "Market heat", weight: 0.15, type: "positive" },
        { key: "product", label: "SKU proof", weight: 0.16, type: "positive" },
        { key: "campaign", label: "Content heat", weight: 0.16, type: "positive" },
        { key: "operations", label: "Launch ops", weight: 0.13, type: "positive" },
        { key: "margin", label: "Margin room", weight: 0.1, type: "positive" },
        { key: "evidence", label: "Proof quality", weight: 0.2, type: "positive" },
        { key: "risk", label: "Risk pressure", weight: 0.1, type: "negative" }
    ];
    function clamp(value, minimum, maximum) {
        const numeric = coerceNumber(value);
        return Math.max(minimum, Math.min(maximum, numeric));
    }
    VorgDropAlgorithm.clamp = clamp;
    function average(values) {
        const usable = values.map(coerceNumber).filter(Number.isFinite);
        if (!usable.length)
            return 0;
        return usable.reduce((sum, value) => sum + value, 0) / usable.length;
    }
    VorgDropAlgorithm.average = average;
    function statusMultiplier(status) {
        if (status === "done")
            return 1;
        if (status === "in progress")
            return 0.65;
        if (status === "blocked")
            return 0.18;
        return 0.25;
    }
    VorgDropAlgorithm.statusMultiplier = statusMultiplier;
    function gateMultiplier(gate) {
        if (gate === "approve")
            return 1;
        if (gate === "test")
            return 0.72;
        if (gate === "revise")
            return 0.38;
        return 0.08;
    }
    VorgDropAlgorithm.gateMultiplier = gateMultiplier;
    function calculateScores(input) {
        const core = calculateCore(input);
        return {
            ...core,
            gateReason: gateReasonFor(core),
            spendAuthorization: spendAuthorizationFor(core),
            levers: buildScoreLevers(input, core)
        };
    }
    VorgDropAlgorithm.calculateScores = calculateScores;
    function calculateCore(input) {
        const stress = normalizeStress(input.stress);
        const operationsEffective = clamp(input.operationsEffective, 0, 100);
        const productProofScore = clamp(input.productProofScore, 0, 100);
        const positiveInputs = VorgDropAlgorithm.STRESS_LABELS.filter(item => item.type === "positive");
        const inputScore = positiveInputs.reduce((sum, item) => sum + getStressValue(stress, operationsEffective, productProofScore, item.key) * item.weight, 0);
        const inputWeight = positiveInputs.reduce((sum, item) => sum + item.weight, 0);
        const normalizedInputScore = inputWeight ? inputScore / inputWeight : 0;
        const evidenceFloor = Math.min(stress.evidence, productProofScore, operationsEffective);
        const stageScore = average(input.stages.map(stage => coerceNumber(stage.score) * statusMultiplier(stage.status) * gateMultiplier(stage.gate)));
        const approvedTactics = input.tactics.filter(tactic => tactic.status === "approved").length;
        const readyTactics = input.tactics.filter(tactic => tactic.status === "ready").length;
        const tacticScore = clamp(40 + approvedTactics * 12 + readyTactics * 4, 0, 100);
        const signalHeat = calculateSignalHeat(input.signals);
        const blockedStages = input.stages.filter(stage => stage.status === "blocked" || stage.gate === "kill").length;
        const lowEvidenceDrag = Math.max(0, 58 - evidenceFloor) * 0.18;
        const riskDrag = clamp(Math.max(0, stress.risk - 32) * 0.32 + blockedStages * 5 + lowEvidenceDrag, 0, 32);
        const confidence = clamp(Math.round(normalizedInputScore * 0.58 + stageScore * 0.13 + signalHeat * 0.1 +
            tacticScore * 0.09 + evidenceFloor * 0.1 - riskDrag), 0, 100);
        const campaignRate = clamp(Math.round(8 + stress.campaign * 0.24 + stress.demand * 0.14 + stress.evidence * 0.16 +
            signalHeat * 0.11 + tacticScore * 0.15 +
            ((operationsEffective + stress.margin) / 2) * 0.1 - stress.risk * 0.12), 5, 88);
        let gate = "kill";
        if (confidence >= 80 && evidenceFloor >= 64 && stress.risk <= 58)
            gate = "approve";
        else if (confidence >= 64 && evidenceFloor >= 50 && stress.risk <= 68)
            gate = "test";
        else if (confidence >= 46 && stress.risk <= 78)
            gate = "revise";
        if (stress.risk >= 82 || evidenceFloor < 34)
            gate = "kill";
        const weakness = [
            ...positiveInputs.map(item => ({
                label: item.label,
                value: getStressValue(stress, operationsEffective, productProofScore, item.key)
            })),
            { label: "Stage momentum", value: stageScore },
            { label: "Signal heat", value: signalHeat },
            { label: "Campaign tactics", value: tacticScore },
            { label: "Risk pressure", value: 100 - stress.risk }
        ].sort((left, right) => left.value - right.value)[0] || { label: "Proof quality", value: 0 };
        const bottleneck = evidenceFloor < 50 ? "Proof check" : weakness.label;
        return {
            version: VorgDropAlgorithm.ALGORITHM_VERSION,
            confidence: Math.round(confidence),
            campaignRate: Math.round(campaignRate),
            gate,
            weakness,
            bottleneck,
            evidenceFloor: Math.round(evidenceFloor),
            stageScore: Math.round(stageScore),
            tacticScore: Math.round(tacticScore),
            signalHeat: Math.round(signalHeat),
            riskDrag: Math.round(riskDrag),
            riskPressure: stress.risk,
            operationsEffective
        };
    }
    function gateReasonFor(score) {
        if (score.evidenceFloor < 34) {
            return `Proof floor is ${score.evidenceFloor}, below the hard floor of 34. The drop stays paused until proof, SKU truth, and launch ops recover.`;
        }
        if (score.riskPressure >= 82) {
            return `Risk pressure is ${score.riskPressure}, above the hard stop of 82. Reduce risk before any spend decision.`;
        }
        if (score.gate === "approve") {
            return `Confidence, proof floor, and risk are all inside the GO band. Treat this as permission to move only on evidence-backed spend.`;
        }
        if (score.gate === "test") {
            return `The drop can run small tests, but proof floor or confidence is not strong enough for bulk exposure.`;
        }
        if (score.gate === "revise") {
            return `${score.bottleneck} is holding the model below the test band. Fix the weakest proof surface before spending.`;
        }
        return `The model is below the revise band. Pause, rebuild the product/campaign proof, or kill the route.`;
    }
    function spendAuthorizationFor(score) {
        if (score.gate === "approve") {
            return {
                level: "major-spend",
                label: "Major spend eligible",
                summary: "Bag unlocked only for proof-backed sample runs, media tests, or production moves.",
                reason: gateReasonFor(score),
                allowed: [
                    "Sample or size-set orders with proof links",
                    "Controlled media tests tied to campaign proof",
                    "Production moves only when vendor quote and PP/sample proof exist"
                ],
                blocked: [
                    "Unquoted bulk PO",
                    "Claims without sample, vendor, or test evidence"
                ]
            };
        }
        if (score.gate === "test") {
            return {
                level: "small-test",
                label: "Small tests only",
                summary: "Bag locked for bulk. Run small proof tests before big money moves.",
                reason: gateReasonFor(score),
                allowed: [
                    "Content proof sprint",
                    "Small sample correction or swatch order",
                    "City signal or waitlist test"
                ],
                blocked: [
                    "Bulk production PO",
                    "Large paid media spend",
                    "Venue or event deposits outside the approved cap"
                ]
            };
        }
        if (score.gate === "revise") {
            return {
                level: "proof-only",
                label: "Proof work only",
                summary: "Bag locked. Close proof gaps before factory spend or paid media.",
                reason: gateReasonFor(score),
                allowed: [
                    "Vendor quote collection",
                    "Tech pack cleanup",
                    "Organic proof content and fit review"
                ],
                blocked: [
                    "Factory deposits",
                    "Paid launch campaign",
                    "Public production-readiness claims"
                ]
            };
        }
        return {
            level: "paused",
            label: "Hard pause",
            summary: "Bag locked. Pause or rebuild before any major spend.",
            reason: gateReasonFor(score),
            allowed: [
                "Research",
                "Risk removal",
                "Decision memo or kill review"
            ],
            blocked: [
                "Sample deposits",
                "Bulk production",
                "Paid campaign spend",
                "Public readiness claims"
            ]
        };
    }
    function buildScoreLevers(input, base) {
        const stress = normalizeStress(input.stress);
        const candidates = [
            {
                id: "proof-floor-64",
                label: "Raise proof floor",
                owner: "Founder / production",
                input: "Evidence + SKU proof + launch ops",
                current: base.evidenceFloor,
                target: 64,
                action: "Attach the missing vendor quote, sample proof, or launch-ops evidence that is holding the floor down.",
                proofNeeded: "Proof URLs for quote, sample/fit, checklist, or campaign evidence.",
                mutate: draft => {
                    draft.stress.evidence = Math.max(clamp(draft.stress.evidence, 0, 100), 64);
                    draft.productProofScore = Math.max(clamp(draft.productProofScore, 0, 100), 64);
                    draft.operationsEffective = Math.max(clamp(draft.operationsEffective, 0, 100), 64);
                }
            },
            {
                id: "product-proof-72",
                label: "Lock SKU proof",
                owner: "Product lead",
                input: "SKU proof",
                current: clamp(input.productProofScore, 0, 100),
                target: 72,
                action: "Move the active SKUs from TBD/spec draft toward quoted sample truth.",
                proofNeeded: "Supplier quote, sample photo, fit notes, landed COGS, or PP/sample evidence.",
                mutate: draft => {
                    draft.productProofScore = Math.max(clamp(draft.productProofScore, 0, 100), 72);
                    draft.stress.product = Math.max(clamp(draft.stress.product, 0, 100), 72);
                }
            },
            {
                id: "launch-ops-72",
                label: "Clear launch ops",
                owner: "Ops / ecommerce",
                input: "Launch ops",
                current: base.operationsEffective,
                target: 72,
                action: "Clear the readiness checklist items that block a clean open online drop.",
                proofNeeded: "Storefront, policies, size guide, analytics, email/SMS, and low-stock/sold-out proof.",
                mutate: draft => {
                    draft.operationsEffective = Math.max(clamp(draft.operationsEffective, 0, 100), 72);
                    draft.stress.operations = Math.max(clamp(draft.stress.operations, 0, 100), 72);
                }
            },
            {
                id: "risk-32",
                label: "Cut risk pressure",
                owner: "Founder / ops",
                input: "Risk pressure",
                current: stress.risk,
                target: 32,
                action: "Remove the risk item that would make the spend call fragile.",
                proofNeeded: "Documented risk owner, mitigation, compliance note, or decision to defer the risky move.",
                mutate: draft => {
                    draft.stress.risk = Math.min(clamp(draft.stress.risk, 0, 100), 32);
                }
            },
            {
                id: "stage-momentum",
                label: "Move the next gate",
                owner: "Current milestone owner",
                input: "Stage momentum",
                current: base.stageScore,
                target: 70,
                action: "Advance the first unfinished milestone with an honest gate score and linked proof.",
                proofNeeded: "Updated gate status, score, next action, and evidence link.",
                mutate: draft => {
                    const stage = draft.stages.find(item => item.status !== "done") || draft.stages[0];
                    if (!stage)
                        return;
                    stage.status = stage.status === "blocked" ? "in progress" : stage.status;
                    stage.gate = stage.gate === "kill" ? "revise" : stage.gate;
                    stage.score = Math.max(clamp(stage.score, 0, 100), 70);
                }
            },
            {
                id: "campaign-proof",
                label: "Approve campaign proof",
                owner: "Campaign lead",
                input: "Content proof",
                current: base.tacticScore,
                target: Math.min(100, base.tacticScore + 24),
                action: "Turn ready tactics into approved tactics only after the proof is real and consented.",
                proofNeeded: "Clip links, waitlist/SMS signal, creator proof, or campaign test results.",
                mutate: draft => {
                    let approvals = 0;
                    draft.tactics.forEach(tactic => {
                        if (approvals >= 2 || tactic.status === "approved")
                            return;
                        tactic.status = "approved";
                        approvals += 1;
                    });
                }
            },
            {
                id: "signal-depth",
                label: "Deepen signal heat",
                owner: "Signal lead",
                input: "Market heat",
                current: base.signalHeat,
                target: 70,
                action: "Log qualified buy-intent or city signals instead of one loud vanity signal.",
                proofNeeded: "DMs, waitlist clicks, saves/shares, creator pull, or city/event demand notes.",
                mutate: draft => {
                    draft.signals = [
                        ...draft.signals,
                        { city: "Ottawa/Gatineau", strength: 72 },
                        { city: "Ottawa/Gatineau", strength: 72 },
                        { city: "Montreal", strength: 72 }
                    ];
                    draft.stress.demand = Math.max(clamp(draft.stress.demand, 0, 100), 72);
                }
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
            .slice(0, 4);
    }
    function cloneInput(input) {
        return {
            stress: { ...input.stress },
            stages: input.stages.map(stage => ({ ...stage })),
            tactics: input.tactics.map(tactic => ({ ...tactic })),
            signals: input.signals.map(signal => ({ ...signal })),
            operationsEffective: clamp(input.operationsEffective, 0, 100),
            productProofScore: clamp(input.productProofScore, 0, 100)
        };
    }
    function calculateSignalHeat(signals) {
        const topSignals = signals
            .slice()
            .sort((left, right) => coerceNumber(right.strength) - coerceNumber(left.strength))
            .slice(0, 3);
        return clamp(average(topSignals.map(signal => signal.strength)) + Math.min(signals.length, 6) * 2, 0, 100);
    }
    VorgDropAlgorithm.calculateSignalHeat = calculateSignalHeat;
    function scoreCitySignals(signals, cities) {
        const byCity = new Map();
        if (cities) {
            cities.forEach(city => byCity.set(city, []));
        }
        signals.forEach(signal => {
            var _a;
            const city = signal.city || "Unknown";
            if (cities && !byCity.has(city))
                return;
            if (!byCity.has(city))
                byCity.set(city, []);
            (_a = byCity.get(city)) === null || _a === void 0 ? void 0 : _a.push(coerceNumber(signal.strength));
        });
        return Array.from(byCity.entries()).map(([city, values]) => ({
            city,
            score: citySignalScore(values),
            count: values.length
        }));
    }
    VorgDropAlgorithm.scoreCitySignals = scoreCitySignals;
    function getNextCitySignal(signals, homeCity = "Ottawa/Gatineau", fallbackCity = "Montreal") {
        const cityScores = scoreCitySignals(signals).filter(city => city.count > 0);
        const expansionCities = cityScores.filter(city => city.city !== homeCity);
        return (expansionCities.length ? expansionCities : cityScores)
            .sort((left, right) => right.score - left.score || right.count - left.count)[0] ||
            { city: fallbackCity, score: 0, count: 0 };
    }
    VorgDropAlgorithm.getNextCitySignal = getNextCitySignal;
    function citySignalScore(values) {
        if (!values.length)
            return 0;
        return clamp(Math.round(average(values) * 0.72 + Math.max(...values) * 0.18 + Math.min(values.length, 5) * 2), 0, 100);
    }
    function getStressValue(stress, operationsEffective, productProofScore, key) {
        if (key === "operations")
            return operationsEffective;
        if (key === "product")
            return productProofScore;
        return stress[key];
    }
    function normalizeStress(stress) {
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
    function coerceNumber(value) {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : 0;
    }
})(VorgDropAlgorithm || (VorgDropAlgorithm = {}));
