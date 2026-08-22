# Drop 001 — 100-Supplier Evidence Campaign

**Decision supported:** determine whether VORG-EAVY's current sourcing problem is the tech pack or the supplier funnel, and govern a 100-company first-contact campaign without authorizing spend.

**Campaign date:** 2026-08-04  
**Truth level:** controlled sourcing operation; supplier claims remain unverified until evidence reconciles.  
**Spend authority:** none. No sample, order, deposit, exclusivity or bulk commitment is authorized by this campaign.

## Decision

The current v0.2 pack is not fundamentally wrong. It is a strong RFQ / prototype-control draft: it identifies evidence limits, uses separate women's and men's denim blocks, includes starting POMs with tolerances, separates shell/lining/insulation/trims, asks for testing and legal-facility proof, and does not claim production readiness.

The present weakness is the funnel:

- a 25-page, five-product packet is too broad for a specialist factory's first cold contact;
- most initial replies show that suppliers did not engage with the controlled specification;
- sending the whole packet cold increases cognitive load and exposes unnecessary design/IP detail;
- custom-production capability must be separated from a supplier's ready-stock listing.

The pack therefore stays controlled. First contact is a short product-specific evidence screen with no attachment. Only suppliers that pass the screen receive the relevant style section as a controlled v0.3 issue. The full five-style packet is not sent cold.

## Campaign allocation

| Scope | Unique companies | Why |
|---|---:|---|
| Women's + men's denim | 40 | Two products, separate blocks, wash and leg-twist risk, highest technical burden |
| The Firm Jacket | 25 | Leather collar, low-loft quilting, structured shape and no-cuff sleeve require specialist proof |
| Women's fitted top | 20 | Fibre, GSM, opacity and recovery must be proven; generic cotton/spandex is not a substitute |
| Woven scarf | 15 | Exact fibre, GSM, brushing, fringe and testing claims require evidence |
| **Total** | **100** | One company is counted once even if it can cover more than one scope |

Previously contacted companies are excluded from the 100 fresh contacts: Kaiping Lianwang, Dongguan Meilin, Shandong Sailtek, Shengzhou Xinli, Guangzhou Yiluhong, MC Industrial, Dongguan Designeroon, Dongguan City Topshow and Dongguan Hangyue.

## Execution status

**Completed 2026-08-04:** 100 individually selected companies received a product-specific first-touch message: 40 denim, 25 jacket, 20 women's top and 15 scarf. Ninety-nine contacts are in China and one denim contact is in Pakistan. Alibaba success receipts were captured for 95 sends; four earlier denim sends were verified by the platform success-page state before the automation cell timed out, and the final Pakistan contact is evidenced by its Message Center timestamp and visible sent message.

No tech pack was attached, no sample or order was placed, and no spend or bulk commitment was authorized. One additional denim candidate triggered Alibaba's verification-code gate; the gate was not bypassed and that candidate was replaced by a distinct supplier.

At the completion check, no substantive new response was visible; Alibaba's inbox also displayed a network-disconnected warning, so this is a checkpoint rather than proof that no reply exists. The visible older replies remained below the 60-point follow-up threshold because they were generic, off-spec, unsupported or already rejected by the founder. Therefore **zero follow-ups and zero controlled pack releases** were appropriate at this checkpoint. `SUPPLIER_CAMPAIGN_100_TRACKER_2026-08-04.csv` is the authoritative ledger for response scoring and later follow-up.

## Short first-touch messages

### Denim

> Hello [Name], VORG-EAVY Canada is qualifying a denim factory for women's washed-black true low-rise relaxed-wide and men's midnight-indigo relaxed-straight samples, 12–13.5 oz, with separate patterns. Before the controlled tech packs, please send 2 recent comparable-work images and state sample fee/time, custom MOQ, wash-plant city and Trade Assurance. No bulk commitment.

### The Firm Jacket

> Hello [Name], VORG-EAVY Canada is qualifying an outerwear factory for a cropped black low-loft quilted jacket: structured shoulders, genuine-leather collar, two-way metal zip and straight continuous sleeves with no cuff or taper. Before the tech pack, please send 2 comparable examples and state sample fee/time, custom MOQ, outsourced work and Trade Assurance.

### Women's top

> Hello [Name], VORG-EAVY Canada is qualifying a knit factory for a fitted black long-sleeve sample in 180–220 gsm lyocell/modal-rich jersey with elastane, opacity and strong recovery. Before the tech pack, please send 2 similar examples plus fabric data, sample fee/time, custom MOQ and Trade Assurance. Cotton/spandex-only is not suitable.

### Scarf

> Hello [Name], VORG-EAVY Canada is qualifying a woven-scarf factory for a 30 × 180 cm brushed scarf with 9 cm fringe, 260–320 gsm, espresso/burgundy. Before the tech pack, please send 2 comparable examples and exact fibre/GSM, plus sample fee/time, custom MOQ, testing options and Trade Assurance. No unsupported cashmere claim.

## Evidence gate and score

Score only what the supplier actually supplies. A fast “yes” earns no technical credit.

| Gate | Points | Required evidence |
|---|---:|---|
| Comparable work | 0–20 | Two recent, relevant images or a current product/video tied to the company |
| Technical fit | 0–20 | Product-specific answer to VORG-EAVY's non-negotiables |
| Factory transparency | 0–15 | Legal entity, factory/trader role, site city and outsourced processes |
| Sample path | 0–15 | Itemized sample fee, development sequence, revision rule and lead time |
| Custom commercial fit | 0–10 | Custom-production MOQ, not listing MOQ; credible quantity breaks |
| Material/testing proof | 0–10 | Fabric article/data, wash route or test capability relevant to the style |
| Transaction safety | 0–10 | Trade Assurance, company beneficiary and independent inspection acceptance |

- **75–100:** finalist; release the product-specific controlled pack and request a firm itemized quotation.
- **60–74:** clarify once; advance only if the missing evidence is supplied.
- **Below 60:** archive; do not spend more founder time.
- **Automatic hold:** off-platform payment request, identity/beneficiary mismatch, undisclosed subcontracting, copied/stolen evidence, substitution pressure, refusal to use controlled order terms or unsupported fibre claims.

## Follow-up rule

Only suppliers scoring 60 or above receive a follow-up. The follow-up names no competitor and makes no false volume promise:

> Thank you. Your capability may fit VORG-EAVY. To complete our shortlist, please answer only the missing items below: [maximum four numbered gaps]. If these reconcile, we will release the relevant controlled tech-pack section for an itemized prototype quotation. This is not a bulk commitment.

No supplier is told that it “won,” no fabricated competing quote is used, and no deposit is authorized. Negotiation is based on scope clarity, evidence, payment milestones, revision rights, inspection and total landed risk—not price alone.

## Operating controls

1. Contact individually selected, relevant companies; do not use the unrelated-supplier recommendation checkbox or a platform broadcast.
2. Record supplier, company URL, product evidence, exact message variant, time and visible success proof for every claimed send.
3. Count only confirmed platform sends. Drafts, duplicate contacts, failed forms and platform-generated recommendations do not count.
4. Stop on CAPTCHA, platform warning or sending restriction; do not evade controls.
5. Keep all material terms and payments inside Alibaba Trade Assurance. Reconcile the legal entity, beneficiary, facility and quote before any future sample payment.
6. Release only the relevant product-specific pack after the evidence gate. Watermark/version the issue and maintain a revision log.
7. No full-production order is considered until sample, fit, material, wash, testing, PP-sample, QC, landed-budget and inventory gates pass.

## Known

- The current pack meets the internal supplier-tech-pack standard for an RFQ/prototype specification draft.
- Earlier outreach produced mostly generic or incomplete replies, with no supplier yet approved for payment.
- The initial production/inventory ceiling remains C$5,000–C$6,000 unless the founder explicitly changes it.

## Assumed

- A larger but controlled specialist funnel will improve the number of credible comparisons.
- Platform profile badges, listed MOQs, capabilities and transaction metrics remain supplier/platform claims until reconciled.

## Unresolved

- Which suppliers will provide recent, attributable evidence and a quote that fits the budget.
- Whether any single geography can satisfy quality, timing and landed-cost gates.
- Final fabric/wash/trim availability, sample performance, testing, freight, duties and import treatment.

## Sources

Checked 2026-08-04:

- [Alibaba Buyer Central — How sourcing works](https://buyer.alibaba.com/page/HowItWorks/Page.html)
- [Alibaba Trade Assurance — payment and order protection](https://tradeassurance.alibaba.com/ta/Payment.htm?tracelog=PC_header_payment)
- [Alibaba seller guidance — detailed inquiries and Message Center](https://seller.alibaba.com/learningcenter/content/detail/PX2FWJSX.htm)
- VORG-EAVY internal supplier-tech-pack standard and `VORG-EAVY_Drop-001_Supplier-Packet_v0.2.pdf`

## Next agent

Continue the numbered campaign ledger. Do not convert “contacted” into “vetted.” Review replies against the seven-part score, send at most one missing-evidence follow-up to suppliers at 60+, and release only the product-specific controlled pack to finalists.
