"use strict";
var VorgDropAlgorithm;
(function (VorgDropAlgorithm) {
    VorgDropAlgorithm.ALGORITHM_VERSION = "VORG Drop OS score v0.3";
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
            operationsEffective
        };
    }
    VorgDropAlgorithm.calculateScores = calculateScores;
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
