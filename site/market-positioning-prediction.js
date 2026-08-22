"use strict";
/**
 * VORG Market Positioning & Prediction Engine v1
 * Forecast authority only — never writes Drop OS GO / production proof.
 */
var VorgMarketPositioning;
(function (VorgMarketPositioning) {
    VorgMarketPositioning.ENGINE_VERSION = "VORG Market Positioning Prediction v1";
    const WEIGHTS = {
        search: 20,
        buyer: 15,
        content: 20,
        comparable: 10,
        commerce: 20,
        popup: 5,
        product: 10
    };
    const FAMILY_TO_COMPONENT = {
        search: "search",
        buyer: "buyer",
        creator: "content",
        content: "content",
        comparable: "comparable",
        commerce: "commerce",
        popup: "popup",
        product: "product"
    };
    const REQUIRED_FAMILIES = ["search", "buyer", "creator", "comparable", "commerce", "product"];
    const RECEIPT_WEIGHT = {
        purchase: 12,
        checkout: 8,
        "content-qualified-action": 4,
        "product-selection": 3,
        waitlist: 2,
        popup: 5
    };
    function clamp(n, lo = 0, hi = 100) {
        return Math.max(lo, Math.min(hi, n));
    }
    function hasEvidenceReference(value) {
        if (!value)
            return false;
        const t = value.trim();
        if (!t || t.toUpperCase() === "TBD" || t === "-")
            return false;
        return /^(https?:\/\/|[\w.-]+\/)/i.test(t) || t.includes("/");
    }
    function sourceMap(sources) {
        return new Map(sources.map((s) => [s.id, s]));
    }
    function daysBetween(a, b) {
        const da = Date.parse(a);
        const db = Date.parse(b);
        if (Number.isNaN(da) || Number.isNaN(db))
            return 0;
        return Math.abs(db - da) / (1000 * 60 * 60 * 24);
    }
    function average(nums) {
        if (!nums.length)
            return 0;
        return nums.reduce((s, n) => s + n, 0) / nums.length;
    }
    function linkedSignalsFor(candidateId, family, signals, sources) {
        return signals.filter((sig) => {
            if (sig.family !== family)
                return false;
            if (!sig.candidateIds.includes(candidateId))
                return false;
            if (!Number.isFinite(sig.normalizedScore))
                return false;
            const linked = sig.sourceIds.filter((id) => {
                const src = sources.get(id);
                return src && hasEvidenceReference(src.url);
            });
            return linked.length > 0;
        });
    }
    function componentScore(candidateId, component, signals, sources, mechanisms, asOf, expiryDays) {
        const families = Object.keys(FAMILY_TO_COMPONENT).filter((f) => FAMILY_TO_COMPONENT[f] === component);
        const matched = [];
        for (const family of families) {
            matched.push(...linkedSignalsFor(candidateId, family, signals, sources));
        }
        const sourceIds = new Set();
        const values = [];
        const confBits = [];
        for (const sig of matched) {
            let score = clamp(sig.normalizedScore);
            // Generic US-wide search macros cannot dominate metro ranking.
            if (sig.family === "search" && /united states/i.test(sig.geography) && !/metro|brooklyn|los angeles|chicago|atlanta|miami/i.test(sig.geography)) {
                score = Math.min(score, 50);
            }
            for (const sid of sig.sourceIds) {
                const src = sources.get(sid);
                if (!src || !hasEvidenceReference(src.url))
                    continue;
                sourceIds.add(sid);
                const age = daysBetween(src.checkedOn, asOf);
                const decay = age > expiryDays ? 0.6 : age > expiryDays / 2 ? 0.85 : 1;
                confBits.push(src.confidence * decay);
            }
            values.push(score);
        }
        if (component === "comparable") {
            const usable = mechanisms.filter((m) => m.sourceIds.some((id) => sources.get(id) && hasEvidenceReference(sources.get(id).url)));
            if (usable.length < 3) {
                return { score: Math.min(average(values) || 0, 25), sourceIds: [...sourceIds], confidenceBits: confBits };
            }
            // Mechanism count alone earns nothing beyond presence; require mapped hypotheses.
            const withHypothesis = usable.filter((m) => m.transferableMechanism && m.vorgHypothesis);
            values.push(clamp(40 + withHypothesis.length * 8));
            for (const m of withHypothesis)
                m.sourceIds.forEach((id) => sourceIds.add(id));
        }
        if (!values.length)
            return { score: 0, sourceIds: [], confidenceBits: [] };
        return { score: clamp(average(values)), sourceIds: [...sourceIds], confidenceBits: confBits };
    }
    function commerceCap(gates, base) {
        const flags = [];
        const hardOpen = gates.filter((g) => g.hardStop && g.state !== "cleared-with-evidence");
        if (hardOpen.length) {
            flags.push(`Commerce capped: ${hardOpen.length} hard-stop gate(s) not cleared with evidence.`);
            return { score: Math.min(base, 35), flags };
        }
        return { score: base, flags };
    }
    function coverage(candidateId, signals, sources) {
        const missing = [];
        for (const family of REQUIRED_FAMILIES) {
            if (!linkedSignalsFor(candidateId, family, signals, sources).length)
                missing.push(family);
        }
        return { complete: missing.length === 0, missing };
    }
    function applyReceipts(ranked, receipts, asOf, expiryDays) {
        const adjustments = [];
        const byId = new Map(ranked.map((r) => [r.candidateId, { ...r, componentScores: { ...r.componentScores } }]));
        const seenArtifacts = new Set();
        for (const receipt of receipts) {
            if (!hasEvidenceReference(receipt.artifactUrl))
                continue;
            if (seenArtifacts.has(receipt.artifactUrl))
                continue;
            seenArtifacts.add(receipt.artifactUrl);
            const row = byId.get(receipt.candidateId);
            if (!row)
                continue;
            const age = daysBetween(receipt.countedAt, asOf);
            if (age > expiryDays)
                continue;
            let delta = RECEIPT_WEIGHT[receipt.kind] * Math.max(1, Math.min(receipt.quantity, 20)) / 4;
            if (receipt.geoPrecision === "country")
                delta *= 0.35;
            if (receipt.geoPrecision === "unknown")
                delta *= 0.15;
            if (receipt.kind === "purchase" || receipt.kind === "checkout") {
                // purchases/checkouts matter more already via weight
            }
            const prior = row.posteriorScore;
            const posterior = clamp(prior + delta);
            const confDelta = receipt.geoPrecision === "metro" ? 6 : 2;
            row.posteriorScore = posterior;
            row.confidence = clamp(row.confidence + confDelta);
            row.decisionStatus = "recalibrated";
            adjustments.push({
                receiptId: receipt.id,
                candidateId: receipt.candidateId,
                priorScore: prior,
                adjustment: posterior - prior,
                posteriorScore: posterior,
                confidenceDelta: confDelta,
                reason: `${receipt.kind} receipt x${receipt.quantity} (${receipt.geoPrecision}) via ${receipt.artifactUrl}`
            });
        }
        const next = [...byId.values()].sort((a, b) => b.posteriorScore - a.posteriorScore || b.confidence - a.confidence);
        return { ranked: next, adjustments };
    }
    function buildWinnerPlan(winner, alt, candidate) {
        const jacketLead = /chicago|new york|brooklyn|los angeles/i.test(winner.metro);
        return {
            position: candidate.positionStatement,
            onlineScope: candidate.onlineScope,
            firstMetro: winner.metro,
            closestAlternative: alt ? alt.metro : null,
            skuSequence: jacketLead
                ? ["VE-FJ-001 (hero content — TBD sample proof)", "VE-WD-001 / VE-MD-001 (fit truth)", "VE-WT-001", "VE-SC-001"]
                : ["VE-WD-001 / VE-MD-001 (lead in warm metro)", "VE-WT-001", "VE-SC-001", "VE-FJ-001 (secondary — seasonality risk)"],
            contentSystem: {
                tiktok: "Original native shorts from sample/product truth; measure qualified product/size/city actions, not views.",
                founderYoutube: "Durable fit/fabric/process library; cut shorts for TikTok; no conversion promise from long-form alone.",
                shopify: "USD education PDPs, size/fit, email/SMS consent, checkout + first-party measurement after duties path exists.",
                ugc: "Signed brief, material-connection disclosure, claim guardrails, commercial-music clearance, outcome receipt.",
                popup: "Later evidence-capture only after metro receipts; zero assumed sales until venue/POS/RSVP are real."
            },
            learningRoute90d: [
                "Lock DDP vs U.S. 3PL and rebuild USD contribution by SKU.",
                "Run no-fake-proof creative sprint on one U.S. landing with kill rules.",
                "Collect metro-tagged Trends/query snapshots for silhouette terms.",
                "Ingest first-party receipts to recalibrate ranking."
            ],
            cashPolicy: "Test spend stays founder-capped and separate from the C$5,000–C$6,000 production ceiling; kill if no qualified actions.",
            compliancePath: [
                "Tax counsel/accountant review before U.S. sale (nexus).",
                "Customs/broker review for HS/origin/IOR.",
                "FTC label/care evidence on final SKUs.",
                "Creator disclosure + TikTok commercial-content/music preflight."
            ]
        };
    }
    function recommendPosition(input) {
        var _a;
        const generatedAt = input.generatedAt || new Date().toISOString();
        const asOf = generatedAt.slice(0, 10);
        const expiryDays = (_a = input.signalExpiryDays) !== null && _a !== void 0 ? _a : 180;
        const sources = sourceMap(input.sources || []);
        const signals = input.signals || [];
        const mechanisms = input.mechanisms || [];
        const gates = (input.gates || []).map((g) => ({ ...g }));
        const hardStopsOpen = gates.filter((g) => g.hardStop && g.state !== "cleared-with-evidence");
        const ranked = [];
        const globalFlags = [];
        for (const raw of input.candidates || []) {
            const candidate = { ...raw };
            if (!candidate.metro || !String(candidate.metro).trim()) {
                ranked.push({
                    candidateId: candidate.id || "invalid",
                    metro: "",
                    country: candidate.country || "",
                    coverageComplete: false,
                    missingFamilies: ["metro"],
                    componentScores: { search: 0, buyer: 0, content: 0, comparable: 0, commerce: 0, popup: 0, product: 0 },
                    priorScore: 0,
                    posteriorScore: 0,
                    confidence: 0,
                    decisionStatus: "research-incomplete",
                    redFlags: ["Whole-country / missing metro candidates are invalid."],
                    sourceIdsUsed: [],
                    reversalConditions: ["Provide a named metro before ranking."]
                });
                continue;
            }
            const cov = coverage(candidate.id, signals, sources);
            const comps = {
                search: 0,
                buyer: 0,
                content: 0,
                comparable: 0,
                commerce: 0,
                popup: 0,
                product: 0
            };
            const sourceIdsUsed = new Set();
            const confBits = [];
            Object.keys(comps).forEach((key) => {
                const part = componentScore(candidate.id, key, signals, sources, mechanisms, asOf, expiryDays);
                comps[key] = part.score;
                part.sourceIds.forEach((id) => sourceIdsUsed.add(id));
                confBits.push(...part.confidenceBits);
            });
            const commerce = commerceCap(gates, comps.commerce);
            comps.commerce = commerce.score;
            let prior = 0;
            prior += (comps.search * WEIGHTS.search) / 100;
            prior += (comps.buyer * WEIGHTS.buyer) / 100;
            prior += (comps.content * WEIGHTS.content) / 100;
            prior += (comps.comparable * WEIGHTS.comparable) / 100;
            prior += (comps.commerce * WEIGHTS.commerce) / 100;
            prior += (comps.popup * WEIGHTS.popup) / 100;
            prior += (comps.product * WEIGHTS.product) / 100;
            prior = clamp(prior);
            if (!cov.complete) {
                // Incomplete research does not get a default competitive score.
                prior = 0;
            }
            const confidence = cov.complete ? clamp(average(confBits) * 100) : clamp(average(confBits) * 40);
            const redFlags = [...commerce.flags];
            if (!cov.complete)
                redFlags.push(`Research incomplete: missing ${cov.missing.join(", ")}`);
            if (hardStopsOpen.length)
                redFlags.push("Route-to-market hard stops open — forecast only; no spend escalation.");
            let status = !cov.complete ? "research-incomplete" : hardStopsOpen.length ? "forecast-only" : "testable";
            ranked.push({
                candidateId: candidate.id,
                metro: candidate.metro,
                country: candidate.country,
                coverageComplete: cov.complete,
                missingFamilies: cov.missing,
                componentScores: comps,
                priorScore: prior,
                posteriorScore: prior,
                confidence,
                decisionStatus: status,
                redFlags,
                sourceIdsUsed: [...sourceIdsUsed],
                reversalConditions: [
                    "Metro-tagged first-party purchases favoring another city",
                    "Carrier/3PL quote proving contribution margin negative after duties/returns",
                    "Silhouette search evidence concentrated elsewhere"
                ]
            });
        }
        ranked.sort((a, b) => b.posteriorScore - a.posteriorScore || b.confidence - a.confidence);
        const receiptPass = applyReceipts(ranked, input.receipts || [], asOf, expiryDays);
        const finalRanked = receiptPass.ranked;
        const complete = finalRanked.filter((r) => r.coverageComplete && r.metro);
        let provisionalWinner = complete[0] || null;
        if (!provisionalWinner) {
            globalFlags.push("No defensible winner yet — minimum public-prior coverage not met for any metro.");
        }
        const winnerCandidate = provisionalWinner
            ? (input.candidates || []).find((c) => c.id === provisionalWinner.candidateId) || null
            : null;
        const alt = provisionalWinner ? complete.find((c) => c.candidateId !== provisionalWinner.candidateId) || null : null;
        const decisionStatus = !provisionalWinner
            ? "research-incomplete"
            : receiptPass.adjustments.length
                ? "recalibrated"
                : provisionalWinner.decisionStatus;
        const winnerPlan = provisionalWinner && winnerCandidate ? buildWinnerPlan(provisionalWinner, alt, winnerCandidate) : null;
        const confidenceBand = provisionalWinner
            ? {
                low: clamp(provisionalWinner.confidence - 12),
                high: clamp(provisionalWinner.confidence + 8)
            }
            : { low: 0, high: 0 };
        const nextActions = [
            { priority: "P0", action: "Choose DDP carrier vs U.S. 3PL and attach quote + USD contribution sheet", ownerHint: "founder + ops" },
            { priority: "P0", action: "Capture metro Google Trends / query snapshots for exact silhouette terms", ownerHint: "research" },
            { priority: "P1", action: "Choose TikTok→Shopify vs TikTok Shop and name channel owners", ownerHint: "founder" },
            { priority: "P1", action: "Draft signed creator brief/release + disclosure checklist", ownerHint: "founder" },
            { priority: "P2", action: "Only after receipts: shortlist one venue path in the winning metro", ownerHint: "ops" }
        ];
        return {
            version: VorgMarketPositioning.ENGINE_VERSION,
            generatedAt,
            provisionalWinner,
            rankedCandidates: finalRanked,
            winnerRationale: provisionalWinner
                ? [
                    `${provisionalWinner.metro} leads on posterior forecast score ${provisionalWinner.posteriorScore.toFixed(1)} with confidence ${provisionalWinner.confidence.toFixed(1)}.`,
                    "Ranking uses public priors only unless VORG receipts were supplied.",
                    "This is a prediction, not observed VORG demand, and does not authorize Drop OS GO."
                ]
                : ["Coverage incomplete — refuse default city selection."],
            confidenceBand,
            decisionStatus,
            redFlags: [...globalFlags, ...((provisionalWinner === null || provisionalWinner === void 0 ? void 0 : provisionalWinner.redFlags) || [])],
            assumptions: [
                "Operating market remains Canada until U.S. entity/3PL evidence exists.",
                "Working C$ merchandise plan is planning data, not vendor truth.",
                "GA4 unavailable; no fabricated analytics.",
                "Launch wedge direction is highest-gain market route (currently U.S./Brooklyn forecast), pending hard-stop gates; Ottawa/Gatineau is Canadian fallback / parallel proof."
            ],
            receiptAdjustments: receiptPass.adjustments,
            reversalConditions: (provisionalWinner === null || provisionalWinner === void 0 ? void 0 : provisionalWinner.reversalConditions) || ["Complete required public-prior families for at least one metro."],
            nextActions,
            winnerPlan,
            blindSpotGates: gates,
            dropOsImpact: "none"
        };
    }
    VorgMarketPositioning.recommendPosition = recommendPosition;
    // Exported for tests
    VorgMarketPositioning.__test = {
        hasEvidenceReference,
        clamp,
        WEIGHTS,
        REQUIRED_FAMILIES
    };
})(VorgMarketPositioning || (VorgMarketPositioning = {}));
