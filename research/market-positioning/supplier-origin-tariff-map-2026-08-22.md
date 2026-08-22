# Supplier Origin Tax/Tariff Map — China vs Vietnam Origin, Stored/Shipped From Canada

Checked: 2026-08-22
Companion ledger: `research/market-positioning/macro-economy-ledger-2026-08-22.json`
Feeds: `strategy/us-first-cross-border-usd-gate-2026-08-22.md` (via `strategy/us-first-cross-border-usd-gate-addendum-2026-08-22.md`)

**This is research, not customs, tax, or legal advice.** Tariff law moved three times in the last six months alone. Every rate below requires verification by a licensed customs broker / trade counsel against VORG's exact 10-digit HTS codes before any purchase order or customer price promise.

## 1. What Decision Does This Support?

Choosing supplier country-of-origin (China vs Vietnam) for Drop 001 SKUs, given that VORG operates from Canada, may sell into both Canada and the US, and the US duty stack is driven by **origin, not ship-from location**.

## 2. The One Rule That Controls Everything

**Country of origin = where the garment was substantially transformed (cut and sewn), not where it was warehoused or shipped from.**

- For textiles/apparel entering the US, origin is determined under 19 CFR 102.21 tariff-shift rules; for CUSMA preference, apparel must generally satisfy **yarn-forward** rules — yarn spun/extruded and everything after must happen in a CUSMA country ([USTR factsheet](https://shenglufashion.com/2020/07/01/ustr-factsheet-textiles-and-apparel-and-the-us-mexico-canada-free-trade-agreement-usmca/); [ArentFox Schiff summary](https://www.afslaw.com/perspectives/alerts/new-textile-and-apparel-rules-the-usmca); [CUSMA Uniform Regulations](https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/Uniform-regulation-RoO-2021.aspx?lang=eng); checked 2026-08-22).
- A finished jacket cut and sewn in China or Vietnam that is imported into Canada, stored, relabeled, repacked, or "kitted" **remains Chinese or Vietnamese origin** when it later enters the US. Storage and relabeling are minimal operations; they are not substantial transformation.
- **CUSMA non-qualification:** Asian-origin finished garments merely warehoused in Canada get **zero CUSMA benefit** at the US border. "Ships from Canada" ≠ "Product of Canada."
- **Legal risk flag:** declaring Canadian origin (or letting a carrier default to it) for Asian-made goods is a **false origin declaration** — exposure under 19 U.S.C. §1592 penalties and potentially criminal fraud statutes, plus the US has actively policed transshipment (a 40% transshipment duty existed under EO 14326 until Feb 2026, and CBP origin enforcement on Vietnam/China routing continues — [Traverse analysis, 2026-07-18](https://traverseintel.com/analysis/vietnam-transshipment-after-40-percent-tariff)). Never relabel; declare true origin; keep mill/factory origin documents.

## 3. US Import Side — Duty Layers as of 2026-08-22

2026 timeline that produced the current stack:

1. **2026-02-20:** Supreme Court (*Learning Resources v. Trump*) struck down IEEPA reciprocal + fentanyl tariffs (the layers that had pushed China apparel toward ~44-60% and Vietnam to ~20%) ([Eightx](https://eightx.co/blog/apparel-sourcing-tariff-management); [Troutman Pepper](https://www.troutman.com/insights/the-800-free-pass-is-gone-cit-confirms-president-can-eliminate-de-minimis-tariff-exemption/)).
2. **2026-02-24 → 2026-07-24:** temporary 10% Section 122 global surcharge (150-day statutory limit; expired) ([tariffstool.com](https://www.tariffstool.com/tariffs-on-clothing-from-china)).
3. **2026-07-24:** new Section 301 determinations took effect — a **12.5% duty tier covering ~46 economies including both China and Vietnam** (10% standard tier for others), no expiration date (dockets USTR-2026-0265/0266; [Pham Fashion House guide](https://www.phamfashion.com/blog/vietnam-apparel-tariffs-guide); [Portless](https://www.portless.com/blogs/section-301-tariffs-china); [Shapiro current tariffs](https://www.shapiro.com/tariffs/tariff-news/current-tariffs/)).
4. **De minimis is dead:** the $800 exemption is indefinitely suspended for **all modes** (codified 19 CFR 10.151 / 145.31 on 2026-06-24; CIT upheld 2026-08-13; statutory termination 2027-07-01 under OBBBA) ([Federal Register](https://www.govinfo.gov/content/pkg/FR-2026-06-24/html/2026-12670.htm); [KPMG](https://kpmg.com/us/en/taxnewsflash/news/2026/06/cbp-suspends-de-minimis-exemption.html)). Every VORG parcel to a US customer pays full duties regardless of value. This kills any "under-$800 DDP is duty-free" assumption in older planning.

### Duty stack by origin (typical apparel, HTS ch. 61-62; exact rate is per 10-digit code)

| Layer | China origin | Vietnam origin | Source |
| --- | --- | --- | --- |
| MFN base (varies by garment; cotton knit tee 16.5%, denim/woven and coats differ) | ~8-32% | ~8-32% | [HTSUS via tariffstool](https://www.tariffstool.com/tariffs-on-clothing-from-china), [VnEconomy](https://en.vneconomy.vn/exporters-face-differing-obligations.htm) |
| Section 301 List 4A (2020, consumer goods incl. apparel) | +7.5% | — | [USTR via Shapiro](https://www.shapiro.com/tariffs/tariff-news/current-tariffs/) |
| Section 301 2026 determination (effective 2026-07-24) | +12.5% | +12.5% | [Portless](https://www.portless.com/blogs/section-301-tariffs-china); [Pham](https://www.phamfashion.com/blog/vietnam-apparel-tariffs-guide) |
| **Typical all-in (cotton knit example, 16.5% MFN)** | **~36.5%** | **~29%** | derived; verify per HTS |
| Plus per-entry fees | MPF/HMF, brokerage | MPF/HMF, brokerage | broker quote needed |

**Working conclusion:** the China-vs-Vietnam US duty gap collapsed from ~24+ points (2025) to **~7.5 points** (the List 4A layer) after the July 2026 changes. Vietnam is still cheaper into the US, but the gap is no longer decisive by itself. Caveats: (a) a floated lower apparel tier for some countries is unconfirmed; (b) tariff-rate quotas tied to US cotton purchases exist for Bangladesh/Cambodia/Indonesia/Malaysia (not Vietnam confirmed); (c) a second China investigation is open and could add layers ([Portless](https://www.portless.com/blogs/section-301-tariffs-china)). This area is volatile — recheck before any PO.

## 4. Canada Import Side — Duty Layers as of 2026-08-22

| Layer | China origin | Vietnam origin | Source |
| --- | --- | --- | --- |
| Tariff treatment | MFN only (no GPT, no FTA) | MFN **or CPTPP (CPTPT) preferential — potentially 0%** if rules of origin met | [CBSA 2026 country list](https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2026/html/countries-pays-eng.html) |
| Apparel duty (HS 61/62) | **~16-18% MFN** (18% typical) | **0% if CPTPP-qualified**; ~16-18% MFN if not | [dutiable.io Canada apparel](https://dutiable.io/duty-rates/canada/clothing); [Epic Sourcing CPTPP guide](https://www.epicsourcing.ca/post/cptpp-canada-vietnam-vs-china-apparel-sourcing) |
| GST at border | 5% on duty-paid value | 5% on duty-paid value | same |
| CPTPP qualification requirements | n/a | CPTPP Chapter 4 textile rules (largely yarn-forward within CPTPP), certificate of origin, direct-shipment/transit documentation ([CPTPP Tariff Preference Regulations](https://laws.justice.gc.ca/eng/regulations/SOR-2018-223/FullText.html); [Trade Commissioner guide](https://www.tradecommissioner.gc.ca/en/market-industry-info/free-trade-agreements/canada-indo-pacific-comprehensive-progressive-partnership-agreement/step-by-step-guide.html)) | |

**Key trap:** a Vietnamese factory using Chinese fabric likely **fails** CPTPP yarn-forward and pays full 18% MFN into Canada. Before assuming 0%, VORG needs in writing: mill yarn/fabric origin declaration, factory-issued CPTPP certificate of origin, and HS-code-specific rule confirmation ([Epic Sourcing](https://www.epicsourcing.ca/post/cptpp-canada-vietnam-vs-china-apparel-sourcing)). An advance ruling from CBSA is available and binding.

## 5. The Double-Duty Problem (Canada warehouse → US customer)

If VORG imports goods into Canada (paying Canadian duty + GST) and then ships orders to US customers, **US duties apply again on the Asian origin** — de minimis no longer shields any parcel. Mitigations to price with a broker, not assume:

- **Canada Duties Relief / Duty Drawback programs** for goods later exported (recovers Canadian duty, not US duty) — broker/CBSA application required.
- **Bonded warehouse** in Canada (defer Canadian duty on units destined for US customers).
- **US 3PL route** (Option B in the gate file): import once into the US commercially, pay the origin-based US duty on the wholesale/entered value (typically FOB cost, not retail price — materially better than per-parcel DDP on declared retail value; valuation rules need broker confirmation).

## 6. Decision-Relevant Comparison (working analysis; all numbers need broker verification)

Working example uses the Firm Jacket working landed COGS ~C$85 FOB-equivalent (internal planning assumption, unquoted) — illustrative math only.

| Origin → Market | Duty layers named | Rough duty on C$85 FOB | GST/taxes | Working verdict |
| --- | --- | --- | --- | --- |
| **China → Canada** | 18% MFN | ~C$15 | +5% GST at border | Baseline; simple but full duty |
| **Vietnam → Canada (CPTPP-qualified)** | 0% CPTPT | ~C$0 | +5% GST at border | **Best Canada economics — if origin proof is real** |
| **Vietnam → Canada (not qualified)** | 18% MFN | ~C$15 | +5% GST | Same as China |
| **China → US** | MFN (~16.5% typ.) + 7.5% (301 List 4A) + 12.5% (301 2026) ≈ 36.5% | ~C$31 on FOB if 3PL-entered; more if assessed on retail DDP value | State sales tax via nexus rules (separate gate) | Worst US stack |
| **Vietnam → US** | MFN + 12.5% ≈ 29% | ~C$25 on FOB if 3PL-entered | Same | **Better US stack by ~7.5 pts** |
| **Any Asian origin "shipped from Canada" to US** | Same as above — Canada storage changes nothing; CUSMA does not apply | Same + possible double duty (§5) | Same | Never declare Canadian origin — legal risk |

### Direction of recommendation (working, not final)

**Vietnam origin dominates on paper for VORG's two-market reality:** ~7.5 points cheaper into the US **and** potentially 0% vs 18% into Canada via CPTPP. China origin is only preferable if quote/quality/MOQ advantages exceed roughly 7.5 points of US duty plus up to 18 points of Canadian duty. Decision must wait for: real vendor quotes per origin, fabric-origin declarations (CPTPP test), and a broker-verified landed-cost sheet per SKU per market. Tariff volatility (three regime changes in six months) also argues for contract terms that don't lock VORG into one origin.

## 7. Assumed (not proven)

- Working COGS figures are internal planning assumptions; no vendor quotes exist.
- "Typical" MFN rates stand in for VORG's real 10-digit HTS codes (denim, jacket, scarf, bodysuit each differ; scarf may be ch. 61/62/63 depending on construction).
- DDP valuation basis (retail vs FOB) for parcel entries is unverified — big margin swing; broker question #1.

## 8. Unresolved / Next Agent — REQUIRES CUSTOMS BROKER / PROFESSIONAL VERIFICATION

1. Classify all five SKUs to 10-digit HTS (US) and CBSA classification (Canada); get binding/advance rulings where cheap.
2. Broker-verify the current US duty stack per code (Section 301 2026 tier status, any apparel TRQ developments, MPF).
3. Verify CPTPP qualification path with the candidate Vietnamese factory (yarn/fabric origin in writing) or record that it fails.
4. Price the three fulfilment structures (per-parcel DDP from Canada, bonded/drawback, US 3PL) with real quotes — feeds `gate-ddp-or-3pl` and `gate-usd-contribution`.
5. Tax professional confirms GST/HST on imports vs zero-rated exports interplay and US state nexus (existing gates remain review-required).
