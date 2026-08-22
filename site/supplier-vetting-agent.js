"use strict";
var VorgSupplierVetting;
(function (VorgSupplierVetting) {
    VorgSupplierVetting.ALGORITHM_VERSION = "VORG Supplier Vetting v1.0";
    VorgSupplierVetting.PRIMARY_PLATFORM = "Alibaba.com";
    VorgSupplierVetting.REQUIREMENTS = [
        { requirement: "legal-identity", category: "identity", points: 4, label: "Legal entity and licence reconcile" },
        { requirement: "bank-entity-match", category: "identity", points: 4, label: "Invoice, order and beneficiary entity match" },
        { requirement: "assessment-report", category: "identity", points: 3, label: "Current platform assessment report reviewed" },
        { requirement: "live-facility", category: "identity", points: 4, label: "Live dated facility challenge passed" },
        { requirement: "process-map", category: "capability", points: 4, label: "Exact process map supplied" },
        { requirement: "machine-list", category: "capability", points: 3, label: "Relevant equipment shown and listed" },
        { requirement: "style-capability", category: "capability", points: 4, label: "Style-specific capability demonstrated" },
        { requirement: "subcontractor-map", category: "capability", points: 4, label: "Subcontractors and addresses disclosed" },
        { requirement: "similar-front-back-inside", category: "similar-work", points: 5, label: "Comparable front, back and inside views" },
        { requirement: "similar-detail-closeups", category: "similar-work", points: 3, label: "Comparable construction close-ups" },
        { requirement: "similar-ownership-context", category: "similar-work", points: 4, label: "When, where, quantity and factory role stated" },
        { requirement: "current-proof-code", category: "similar-work", points: 3, label: "Current unique-code image or live proof" },
        { requirement: "construction-answer", category: "spec-comprehension", points: 4, label: "Construction challenge answered correctly" },
        { requirement: "risk-answer", category: "spec-comprehension", points: 3, label: "Supplier names real technical risks" },
        { requirement: "consumption-estimate", category: "spec-comprehension", points: 3, label: "Reasoned consumption or process estimate" },
        { requirement: "material-traceability", category: "supply-chain", points: 3, label: "Material article, mill and lot traceability" },
        { requirement: "wash-or-specialist-site", category: "supply-chain", points: 3, label: "Wash or specialist site identified" },
        { requirement: "no-substitution-commitment", category: "supply-chain", points: 2, label: "No substitution without written approval" },
        { requirement: "quality-control-record", category: "supply-chain", points: 2, label: "Anonymized QC or nonconformance record" },
        { requirement: "custom-moq", category: "commercial", points: 2, label: "Custom MOQ separated from stock MOQ" },
        { requirement: "quantity-breaks", category: "commercial", points: 2, label: "Comparable quantity-break pricing" },
        { requirement: "exw-fob", category: "commercial", points: 2, label: "EXW and named-port FOB quotes" },
        { requirement: "lead-time-calendar", category: "commercial", points: 2, label: "Calendar from sample to packed goods" },
        { requirement: "trade-assurance-order", category: "commercial", points: 2, label: "Protected online order accepted" },
        { requirement: "answer-completeness", category: "communication", points: 3, label: "Numbered questions answered completely" },
        { requirement: "claim-consistency", category: "communication", points: 4, label: "Repeated claims remain consistent" },
        { requirement: "states-limitations", category: "communication", points: 3, label: "Supplier states limits instead of bluffing" },
        { requirement: "proto-measurement", category: "sample", points: 4, label: "Proto measurement report passes" },
        { requirement: "sample-construction", category: "sample", points: 4, label: "Sample construction and workmanship pass" },
        { requirement: "physical-fit", category: "sample", points: 3, label: "Physical fit and wear test pass" },
        { requirement: "test-results", category: "sample", points: 2, label: "Required material and garment tests pass" },
        { requirement: "pp-sample", category: "sample", points: 2, label: "Bulk-intended PP sample sealed" }
    ];
    VorgSupplierVetting.STYLE_CHALLENGES = {
        "VE-FJ-001": {
            label: "a cropped quilted jacket with a genuine leather collar and a straight continuous no-cuff sleeve",
            proofAsk: "Show front, back, inside, leather-collar attachment, quilt intersection and sleeve-end close-ups.",
            technicalAsk: "Explain how you will make the quilted shell continue to the wrist with no separate cuff, taper, elastic or closure, while holding a 3 cm internal turnback and 16 cm half-opening. State how the collar leather is skived and attached, and which work is subcontracted."
        },
        "VE-WD-001": {
            label: "a women's low-rise washed-black relaxed jean on a dedicated women's block",
            proofAsk: "Show front, back, inside waistband, fly, crotch, pocket, hem and before/after-wash views.",
            technicalAsk: "Explain how you control back-waist gaping, shrinkage, wet/dry crocking, leg twist and wash repeatability. Name the wash plant and confirm this is not a men's or generic unisex block."
        },
        "VE-MD-001": {
            label: "a men's midnight-indigo relaxed-straight jean on a dedicated men's block",
            proofAsk: "Show front, back, inside waistband, fly, seat/crotch, pocket, hem and before/after-wash views.",
            technicalAsk: "Explain how you balance the men's rise and seat, control shrinkage, crocking, leg twist and wash repeatability. Name the wash plant and confirm the block is separate from the women's jean."
        },
        "VE-WT-001": {
            label: "a fitted long-sleeve lyocell/modal-rich stretch jersey top",
            proofAsk: "Show front, back, inside neckline, shoulder, side seam and sleeve/hem close-ups.",
            technicalAsk: "Explain your stitch and stabilisation plan for neckline recovery and stretch seams, plus how you test growth, pilling, black dye transfer and white opacity under daylight and flash."
        },
        "VE-SC-001": {
            label: "a brushed wool-blend scarf with controlled fringe and low shedding",
            proofAsk: "Show full scarf, both sides, edge, fringe root, label area and surface close-ups.",
            technicalAsk: "State exact fibre composition and gsm, how you prove fibre content, and how you control pilling, shedding, colourfastness and fringe security. Do not use a cashmere claim unless independently proven."
        }
    };
    const MATERIAL_CONTRADICTION_KEYS = [
        "legal-name",
        "factory-role",
        "production-site",
        "bank-beneficiary",
        "subcontractor",
        "wash-plant",
        "material-composition"
    ];
    const SAMPLE_REQUIREMENTS = [
        "proto-measurement",
        "sample-construction",
        "physical-fit",
        "test-results",
        "pp-sample"
    ];
    function evaluateSupplier(record) {
        const categoryScores = emptyCategoryScores();
        const missingRequirements = [];
        let rawScore = 0;
        for (const definition of VorgSupplierVetting.REQUIREMENTS) {
            const candidates = (record.evidence || []).filter(item => item.requirement === definition.requirement);
            const best = candidates.reduce((score, item) => Math.max(score, evidenceValue(item)), 0);
            const awarded = definition.points * best;
            categoryScores[definition.category] += awarded;
            rawScore += awarded;
            if (best < 0.8)
                missingRequirements.push(definition.requirement);
        }
        const contradictions = findContradictions(record.claims || []);
        const hardStops = collectHardStops(record.risks || {}, contradictions);
        const warnings = collectWarnings(record, contradictions);
        let score = Math.round(rawScore);
        const hasIndependentEvidence = (record.evidence || []).some(item => item.status === "verified" && ["platform-report", "live-challenge", "third-party", "physical-sample"].includes(item.authority));
        const hasCompleteSampleProof = SAMPLE_REQUIREMENTS.every(requirement => requirementIsStrong(record, requirement));
        if (!hasIndependentEvidence)
            score = Math.min(score, 44);
        if (!hasCompleteSampleProof)
            score = Math.min(score, 74);
        if (contradictions.length > 0 && hardStops.length === 0)
            score = Math.min(score, 49);
        if (hardStops.length > 0)
            score = 0;
        const gate = determineGate(record, score, hardStops, contradictions);
        const maxAuthorizedAction = actionForGate(gate);
        return {
            algorithmVersion: VorgSupplierVetting.ALGORITHM_VERSION,
            supplierId: record.id,
            score,
            rawScore: Math.round(rawScore),
            evidenceCoveragePct: Math.round((rawScore / 100) * 100),
            categoryScores: roundCategoryScores(categoryScores),
            gate,
            maxAuthorizedAction,
            hardStops,
            warnings,
            contradictions,
            missingRequirements,
            founderApprovalRequired: true,
            bulkAuthorized: false
        };
    }
    VorgSupplierVetting.evaluateSupplier = evaluateSupplier;
    function nextAction(record) {
        const evaluation = evaluateSupplier(record);
        if (evaluation.gate === "reject") {
            return action("stop", "Stop contact and preserve the record", evaluation.hardStops.join(" "), []);
        }
        if (!usable(record.profileUrl)) {
            return action("audit-profile", "Audit the supplier page", "Capture the company profile, business type, main products, assessment report, factory video, Trade Assurance status and contradictions before relying on chat claims.", ["assessment-report"]);
        }
        if (!requirementIsPresent(record, "similar-front-back-inside") || !requirementIsPresent(record, "similar-ownership-context")) {
            return action("request-similar-work", "Ask for comparable work first", "Comparable work is the fastest truthful screen, but catalogue photos alone do not prove the supplier made the garment.", ["similar-front-back-inside", "similar-detail-closeups", "similar-ownership-context"]);
        }
        if (!requirementIsPresent(record, "construction-answer") || !requirementIsPresent(record, "risk-answer")) {
            return action("technical-challenge", "Run the style-specific construction challenge", "A real production team should explain the difficult construction, name the failure modes and admit what requires development.", ["construction-answer", "risk-answer", "consumption-estimate"]);
        }
        if (!requirementIsPresent(record, "legal-identity") || !requirementIsPresent(record, "assessment-report")) {
            return action("request-identity", "Reconcile legal identity", "Profile, licence, invoice entity, production site and later beneficiary must describe the same commercial counterparty.", ["legal-identity", "assessment-report"]);
        }
        if (!requirementIsStrong(record, "live-facility") || !requirementIsStrong(record, "current-proof-code")) {
            return action("live-verification", "Run a unique-code live facility check", "Current proof makes recycled factory footage and borrowed portfolio assets harder to pass off as present capability.", ["live-facility", "current-proof-code", "machine-list"]);
        }
        if (!requirementIsPresent(record, "process-map") || !requirementIsPresent(record, "subcontractor-map")) {
            return action("request-process-map", "Map every production handoff", "VORG needs the legal name, address and responsibility of each facility touching the goods.", ["process-map", "subcontractor-map", "wash-or-specialist-site", "material-traceability"]);
        }
        if (!requirementIsPresent(record, "custom-moq") || !requirementIsPresent(record, "quantity-breaks") || !requirementIsPresent(record, "trade-assurance-order")) {
            return action("request-commercial-quote", "Request a controlled RFQ response", "Custom MOQ, full cost, timing and protected-order acceptance must be comparable across suppliers.", ["custom-moq", "quantity-breaks", "exw-fob", "lead-time-calendar", "trade-assurance-order"]);
        }
        if (evaluation.gate === "sample-candidate" && !requirementIsPresent(record, "proto-measurement")) {
            return action("prepare-sample-order", "Prepare one protected prototype order", "The supplier has enough verified evidence to ask the founder for a one-sample decision, not a bulk commitment.", ["proto-measurement", "sample-construction"]);
        }
        if (!SAMPLE_REQUIREMENTS.every(requirement => requirementIsStrong(record, requirement))) {
            return action("review-sample", "Complete physical sample and test review", "Images and conversation cannot prove fit, handfeel, wash consistency or production workmanship.", SAMPLE_REQUIREMENTS);
        }
        return action("prepare-founder-review", "Prepare the founder bulk-review packet", "The evidence gate is strong enough for a founder decision, but the algorithm never authorizes spend or bulk itself.", []);
    }
    VorgSupplierVetting.nextAction = nextAction;
    function draftNextMessage(record, now = new Date()) {
        const next = nextAction(record);
        const styleId = record.styleIds[0] || "VE-FJ-001";
        const style = VorgSupplierVetting.STYLE_CHALLENGES[styleId];
        const greeting = `Hello ${record.contactName ? record.contactName : record.name} team,`;
        const close = "\n\nThank you,\nVORG-EAVY Product Team\nCanada";
        let subject = `VORG-EAVY ${styleId} supplier review`;
        let body = "";
        let attachments = [];
        if (next.kind === "stop") {
            body = `${greeting}\n\nThank you for your time. We are not advancing this sourcing review. We will keep the existing platform record for our files.${close}`;
        }
        else if (next.kind === "audit-profile") {
            body = `${greeting}\n\nBefore we discuss pricing, please send the direct link to your Alibaba company profile and current factory assessment report. Please also confirm your exact legal company name, whether you are the direct manufacturer, trading company, or both, and the address where ${style.label} would be cut and sewn.\n\nWe are at supplier-screening stage only. There is no bulk commitment.${close}`;
        }
        else if (next.kind === "request-similar-work") {
            subject = `Comparable-production proof for ${styleId}`;
            body = `${greeting}\n\nBefore pricing, has your team personally produced ${style.label} within the last 24 months?\n\nPlease send 3-5 original or client-authorized images covering front, back and inside construction. ${style.proofAsk}\n\nFor each example, state: (1) month/year, (2) approximate order quantity, (3) production-site city, and (4) what your company performed in-house versus subcontracted. You may remove client logos. Please do not share anything restricted by a client NDA.\n\nIf you have not made a close match, say so clearly and identify which operations would be new for your team. We rank evidence and sample accuracy above the lowest price. There is no bulk commitment at this stage.${close}`;
        }
        else if (next.kind === "technical-challenge") {
            subject = `${styleId} construction check`;
            body = `${greeting}\n\nThank you for the examples. Please have your pattern or production technician answer this directly:\n\n${style.technicalAsk}\n\nAlso tell us the two most likely failure points in a first prototype and how you would prevent them. A clear limitation is more useful to us than a general “no problem” answer.${close}`;
        }
        else if (next.kind === "request-identity") {
            body = `${greeting}\n\nTo continue our supplier review, please provide: (1) current business licence, (2) exact legal name in Chinese and English, (3) registered and operating addresses, (4) downloadable Alibaba factory assessment report, and (5) legal names of any facility that would subcontract this style.\n\nThe profile, quotation, online order and payment beneficiary will need to reconcile before VORG-EAVY can approve a sample.${close}`;
        }
        else if (next.kind === "live-verification") {
            const code = proofCode(record, now);
            subject = `${styleId} live capability check / ${code}`;
            body = `${greeting}\n\nPlease arrange a short live video call. At the start, show today's handwritten proof code: ${code}. Then show, in one continuous walk: exterior company signage, sample room, cutting, the relevant sewing/equipment area, QC table, packing area, and the specific similar item you referenced.\n\nPlease show the inside construction and the relevant machine working where practical. Worker faces do not need to be filmed. Name anything performed at another facility and give that facility's legal name and city. A prerecorded marketing tour cannot replace this check.${close}`;
        }
        else if (next.kind === "request-process-map") {
            body = `${greeting}\n\nPlease map this style from fabric receipt to packed carton. For every step, state whether it is in-house or subcontracted, the legal company name and city, the normal QC record, and the expected queue time. Include pattern, cutting, specialist material work, sewing, washing/finishing where relevant, inspection, labels and packing.\n\nPlease also identify the proposed fabric mill/article/lot-control method and confirm that no material, trim, wash, facility or subcontractor can change without written VORG-EAVY approval.${close}`;
        }
        else if (next.kind === "request-commercial-quote") {
            attachments = ["VORG-EAVY_Drop-001_Supplier-Packet_v0.2.pdf", "VORG-EAVY_Drop-001_Tech-Pack_RFQ_v0.2.xlsx"];
            body = `${greeting}\n\nPlease complete the attached controlled RFQ for ${styleId}. Quote custom production separately from ready-stock quantities. Return sample cost and timing; EXW and named-port FOB prices at 30, 50 and 100 units; custom MOQ per colour and size; material/trim costs; development, wash, label, testing and packing costs; production calendar after approved PP sample; carton estimates; payment terms; defect remedy; and confirmation that you accept an Alibaba Trade Assurance online order and independent pre-shipment inspection.\n\nDo not substitute materials, trims, wash, production site or subcontractors without written approval. This request is for comparison and does not authorize production.${close}`;
        }
        else if (next.kind === "prepare-sample-order") {
            attachments = ["VORG-EAVY_Drop-001_Supplier-Packet_v0.2.pdf"];
            body = `${greeting}\n\nWe are considering one prototype, subject to founder approval of the exact Alibaba Trade Assurance sample order. Please draft the order with the attached tech-pack version, sample material/trim list, measured-spec return, dated construction photos, delivery date, revision entitlement, shipping method, and no-substitution/no-undisclosed-subcontracting terms.\n\nDo not start work or request payment until VORG-EAVY approves the final platform order in writing.${close}`;
        }
        else if (next.kind === "review-sample") {
            body = `${greeting}\n\nThe next step is evidence correction, not bulk. Please return the numbered deviation report, complete measurement sheet, material/trim lot details, construction close-ups, and test results requested in the tech pack. Mark each point pass, fail, or proposed correction. Do not change any material, wash, trim, facility or construction without written approval.${close}`;
        }
        else {
            body = `${greeting}\n\nThank you. VORG-EAVY has completed the evidence and sample review and is preparing an internal founder decision. This message is not a bulk authorization. Please hold the quoted capacity and do not purchase materials or begin production unless a final protected online order is approved in writing.${close}`;
        }
        return {
            platform: VorgSupplierVetting.PRIMARY_PLATFORM,
            channel: "Message Center",
            status: "approval-required",
            supplierId: record.id,
            action: next.kind,
            subject,
            body,
            attachments,
            evidenceToLog: next.requiredEvidence,
            doNotSendIf: [
                "The founder has not approved this exact outgoing message",
                "The supplier record or intended recipient is ambiguous",
                "The attachment version is not the controlled active version",
                "The message would make a price, quantity, payment or bulk commitment"
            ]
        };
    }
    VorgSupplierVetting.draftNextMessage = draftNextMessage;
    function findContradictions(claims) {
        const groups = new Map();
        for (const claim of claims) {
            const key = normalize(claim.key);
            if (!key || !normalize(claim.value))
                continue;
            const list = groups.get(key) || [];
            list.push(claim);
            groups.set(key, list);
        }
        const contradictions = [];
        for (const [key, group] of groups.entries()) {
            const unresolved = group.filter(claim => !claim.resolutionEvidenceId);
            const values = Array.from(new Set(unresolved.map(claim => normalize(claim.value))));
            if (values.length < 2)
                continue;
            contradictions.push({
                key,
                values,
                material: MATERIAL_CONTRADICTION_KEYS.includes(key),
                claimIds: unresolved.map(claim => claim.id)
            });
        }
        return contradictions;
    }
    VorgSupplierVetting.findContradictions = findContradictions;
    function proofCode(record, now = new Date()) {
        const date = Number.isFinite(now.getTime()) ? now.toISOString().slice(0, 10).replace(/-/g, "") : "DATE";
        const suffix = normalize(record.id).replace(/[^a-z0-9]/g, "").slice(-5).toUpperCase() || "VORG";
        return `VE-${date}-${suffix}`;
    }
    VorgSupplierVetting.proofCode = proofCode;
    function determineGate(record, score, hardStops, contradictions) {
        if (hardStops.length > 0)
            return "reject";
        const hasMaterialContradiction = contradictions.some(item => item.material);
        if (hasMaterialContradiction)
            return "reject";
        const rfqCore = ["legal-identity", "similar-front-back-inside", "construction-answer"];
        const sampleCore = [
            "legal-identity",
            "live-facility",
            "subcontractor-map",
            "similar-front-back-inside",
            "similar-ownership-context",
            "construction-answer",
            "custom-moq",
            "trade-assurance-order"
        ];
        if (score >= 75 && SAMPLE_REQUIREMENTS.every(requirement => requirementIsStrong(record, requirement)) && requirementIsStrong(record, "bank-entity-match")) {
            return "founder-review";
        }
        if (score >= 50 && sampleCore.every(requirement => requirementIsStrong(record, requirement)) && contradictions.length === 0) {
            return "sample-candidate";
        }
        if (score >= 25 && rfqCore.every(requirement => requirementIsPresent(record, requirement))) {
            return "rfq-ready";
        }
        return "screening";
    }
    function actionForGate(gate) {
        if (gate === "reject")
            return "none";
        if (gate === "screening")
            return "draft-message";
        if (gate === "rfq-ready")
            return "request-rfq";
        if (gate === "sample-candidate")
            return "prepare-sample-order";
        return "prepare-bulk-review";
    }
    function evidenceValue(item) {
        if (item.status === "contradicted")
            return 0;
        const statusMultiplier = {
            claimed: 0.15,
            linked: 0.55,
            verified: 1,
            contradicted: 0
        };
        const authorityMultiplier = {
            "supplier-claim": 0.7,
            "platform-report": 0.85,
            "live-challenge": 0.95,
            "third-party": 1,
            "physical-sample": 1
        };
        let provenance = 1;
        if (!usable(item.capturedAt))
            provenance *= 0.7;
        if ((item.status === "linked" || item.status === "verified") && !usable(item.sourceUrl) && !usable(item.details))
            provenance *= 0.4;
        return clamp(statusMultiplier[item.status] * authorityMultiplier[item.authority] * provenance, 0, 1);
    }
    function requirementIsPresent(record, requirement) {
        return (record.evidence || []).some(item => item.requirement === requirement && evidenceValue(item) >= 0.35);
    }
    function requirementIsStrong(record, requirement) {
        return (record.evidence || []).some(item => item.requirement === requirement && evidenceValue(item) >= 0.8);
    }
    function collectHardStops(risks, contradictions) {
        const hardStops = [];
        if (risks.identityMismatch)
            hardStops.push("Legal identity does not reconcile across the profile, licence or quotation.");
        if (risks.beneficiaryMismatch)
            hardStops.push("The requested payment beneficiary does not match the approved commercial entity or platform order.");
        if (risks.refusesLiveVerification)
            hardStops.push("Supplier refused a reasonable live dated capability check.");
        if (risks.refusesInspection)
            hardStops.push("Supplier refused independent inspection.");
        if (risks.hiddenSubcontracting)
            hardStops.push("Supplier concealed or refused to identify a production subcontractor.");
        if (risks.pressuresBulkBeforeSample)
            hardStops.push("Supplier pressured VORG-EAVY to commit to bulk before the sample ladder.");
        if (risks.requestsPersonalPayment)
            hardStops.push("Supplier requested payment to a personal or undocumented account.");
        if (risks.requestsOffPlatformPayment)
            hardStops.push("Supplier requested payment outside the protected Alibaba order path.");
        if (risks.fabricatedEvidence)
            hardStops.push("Supplier evidence appears fabricated or materially misrepresented.");
        if (risks.unapprovedSubstitution)
            hardStops.push("Supplier made or proposed an unapproved substitution as if it were equivalent.");
        for (const contradiction of contradictions.filter(item => item.material)) {
            hardStops.push(`Unresolved material contradiction: ${contradiction.key}.`);
        }
        return unique(hardStops);
    }
    function collectWarnings(record, contradictions) {
        const risks = record.risks || {};
        const warnings = [];
        if (risks.wantsOffPlatformChatOnly)
            warnings.push("Supplier wants key discussion off-platform; preserve the controlling record in Alibaba Message Center.");
        if (risks.evasiveAnswers)
            warnings.push("Supplier did not answer numbered questions directly.");
        if (risks.impossibleLeadTime)
            warnings.push("Claimed lead time needs a capacity and milestone reality check.");
        if (risks.customMoqUnclear)
            warnings.push("Listed MOQ may be stock or blank MOQ rather than the custom style MOQ.");
        if (risks.catalogImagesOnly)
            warnings.push("Catalogue images do not prove that this entity or facility made the garments.");
        if ((record.evidence || []).filter(item => item.requirement.startsWith("similar-")).every(item => item.authority === "supplier-claim")) {
            warnings.push("Comparable-work evidence has no independent, live or physical corroboration.");
        }
        for (const contradiction of contradictions.filter(item => !item.material)) {
            warnings.push(`Unresolved claim contradiction: ${contradiction.key}.`);
        }
        return unique(warnings);
    }
    function action(kind, label, rationale, requiredEvidence) {
        return { kind, label, rationale, requiredEvidence, requiresActionTimeApproval: true };
    }
    function emptyCategoryScores() {
        return {
            identity: 0,
            capability: 0,
            "similar-work": 0,
            "spec-comprehension": 0,
            "supply-chain": 0,
            commercial: 0,
            communication: 0,
            sample: 0
        };
    }
    function roundCategoryScores(scores) {
        return {
            identity: Math.round(scores.identity),
            capability: Math.round(scores.capability),
            "similar-work": Math.round(scores["similar-work"]),
            "spec-comprehension": Math.round(scores["spec-comprehension"]),
            "supply-chain": Math.round(scores["supply-chain"]),
            commercial: Math.round(scores.commercial),
            communication: Math.round(scores.communication),
            sample: Math.round(scores.sample)
        };
    }
    function normalize(value) {
        return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
    }
    function usable(value) {
        const normalized = normalize(value);
        return Boolean(normalized) && !["tbd", "unknown", "none", "n/a", "-"].includes(normalized);
    }
    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
    }
    function unique(values) {
        return Array.from(new Set(values));
    }
})(VorgSupplierVetting || (VorgSupplierVetting = {}));
