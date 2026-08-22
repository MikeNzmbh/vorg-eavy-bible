# Drop 001 Paid Ads Practice Readout

Checked: 2026-08-20

Truth: `external-public-practice` — not a freeze, not spend approval, not VORG CAC.

Sources: [`../research/commerce-intelligence/ads-public-priors/`](../research/commerce-intelligence/ads-public-priors/), WordStream 2025 Apparel traffic CPC/CTR, IRP Fashion July 2026 session conversion, existing Forecast Lab public-transfer profile.

Runner: `node launch/simulate-paid-ads-practice.mjs`

FX working assumptions for this practice only: USD→CAD 1.37, GBP→CAD 1.85.

## Empty fields filled (practice)

| Missing field | Practice fill | Source |
| --- | --- | --- |
| Channel | Meta traffic · Apparel / Fashion & Jewelry | WordStream |
| CTR | 1.29% | WordStream |
| CPC | USD 0.86 → ~C$1.18 | WordStream + FX |
| Fashion session CVR | 1.74% | IRP July 2026 |
| Cost per session | £0.11 → ~C$0.20 | IRP |
| Paid working cap | C$450 | Master brief / launch report |
| Planned paid sessions | 850 | Traffic channel plan |
| Planned paid orders at 3.06% | 26 | Coverage arithmetic |

## Practice cash geometry

| Question | Result |
| --- | ---: |
| Cost to buy all 850 plan sessions at WordStream CPC | **~C$1,001** |
| Does C$450 cover those 850 sessions? | **No** |
| Sessions affordable inside C$450 at that CPC | **~382** |
| Orders from 850 sessions if IRP 1.74% holds | **~14.8** (not 26) |
| Sessions needed for 26 orders at IRP CVR | **~1,494** |
| Spend for 26 orders at IRP CVR + WordStream CPC | **~C$1,761** |
| Implied CAC at IRP CVR | **~C$68** |
| Implied CAC if 3.06% somehow holds | **~C$39** |
| Orders inside C$450 at IRP CVR | **~6.6** |
| Orders inside C$450 at 3.06% | **~11.7** |

IRP cost-per-session (~C$0.20) is a UK/Ireland blended ecommerce marketing cost, not Meta CPC. It is kept as a second lens; WordStream CPC is the harder Meta traffic stress for this practice.

## Forecast Lab practice

Full Drop 001 base (unchanged 2,160 sessions, public-transfer):

| Metric | Value |
| --- | ---: |
| Status | scenario |
| P50 sold | 45 units |
| P50 sell-through | 35.7% |
| P(sell-through ≥ 85%) | 25.3% |
| P50 revenue | C$4,299 |

Paid-only practice challenger (850 sessions + invented 15 purchases at IRP 1.74%):

| Metric | Value |
| --- | ---: |
| Status | still `scenario` |
| Planning prior after update | ~1.78% mean, evidence `observed`, 850 trials |
| P50 sold (paid-only inventory stress) | 16 units |
| P(85%) on full bag from paid-only traffic | 0% |

That 0% is the point of practice: **paid alone does not clear 107 units**. Waitlist, connector, and pop-up still have to work. The algorithm is useful when it forces that split, not when it pretends ads can carry the bag.

## Kill rules this practice creates

1. Do not approve an 850-session paid line against a C$450 working paid-social budget if CPC looks like WordStream apparel (~C$1.18). Cap sessions to what the cash can buy (~380) or raise the non-inventory line with an explicit founder decision.
2. Do not count 26 paid orders until tagged landings convert. Public fashion CVR says closer to **15** from 850 sessions.
3. A Hermes / agent media buyer that scales to “fill 850 sessions” from these priors would overspend and still miss 26 orders if IRP-like conversion holds.
4. Replace every practice number with VORG tagged sessions, spend, and purchases before freezing.

## Benefit of the algorithm (without a media-buyer bot)

Without this desk, “buy ads until we hit 85%” is a feeling. With it:

- You see the **cash gap** before you open Ads Manager (C$1,001 needed vs C$450 working line).
- You see the **order gap** if fashion CVR is closer to 1.74% than 3.06%.
- You keep **85% as a coverage goal** across four named channels instead of dumping failure into Meta.
- When real receipts arrive, v1.1 updates the planning prior so P50 and P(85%) move from evidence, not from hope.

A Hermes autopilot buyer is the wrong next product. The right Hermes use, if any, is draft → pause → founder click, reading this practice kill rule and Edge Lab receipts. Unattended spend from public averages is Red.

## Next gate

1. Founder sets a TEST cap ≤ remaining non-inventory paid-social cash.
2. Publish one Ottawa/Gatineau ad with one tagged landing.
3. Enter real sessions + purchases into Forecast Lab.
4. Rerun this script only to compare VORG CAC against the practice band (~C$39–C$68), not to authorize scale.
