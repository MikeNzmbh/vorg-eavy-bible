# Drop 001 Traffic Channel Plan

> **Superseded for market direction on 2026-08-22.** This file freezes the old Ottawa/Gatineau arithmetic for forecast comparison only. Do not use its 2,160 sessions, paid-geo line or pop-up location as the live U.S. plan. Current direction: `omnichannel-demand-system-2026-08-22.md`; current goal engine: `../finance/growth-finance-engine-v3.md`.

Checked: 2026-08-19

Status: named working plan; not a historical acquisition receipt and not spend authorization.

## Decision this supports

Name every qualified-session bucket that is allowed to help cover 85% of 126 units (about 107 units / 86 orders). Cut unnamed traffic. Treat paid ads as an owned Ottawa/Gatineau channel with a cap and a receipt path. Forecast Lab and Drop OS still cannot authorize spend.

## Known

- 85% of 126 units is about 107 units. At 1.25 units per order that is 86 orders.
- The 21 Jul 2026 launch report split those 86 orders as 30 waitlist, 10 connector, 26 other ecommerce, 20 pop-up.
- “Other qualified ecommerce” had no owner or tracked source and is removed.
- Founder decision 19 Aug 2026: VORG will buy ads. Ads replace that hole only as a named paid channel. No autonomous media-buyer skill. No autopilot spend.
- Drop OS TEST allows a small paid content proof. Large campaigns stay blocked until campaign receipts exist.
- Production / inventory spend remains C$5,000–C$6,000. A tiny paid test may come only from non-inventory launch cash, with founder action-time approval.
- No first-party session, purchase, or ad-account export is in the repo. CAC is unknown.

## Channel table

| Channel | Keep? | Planned qualified sessions | Working order coverage | Owner | Mechanism | Evidence class |
| --- | --- | ---: | ---: | --- | --- | --- |
| Waitlist email / SMS (deduped) | Keep as plan | 980 | 30 | Founder / ecommerce | Consented list, launch sequence, unique tagged landing | Plan only |
| Connector / creator attribution | Keep as plan | 330 | 10 | Campaign lead | Unique links or codes; disclosure where paid | Plan only |
| Paid ads · Ottawa/Gatineau | Keep as named plan | 850 | 26 | Founder (action-time spend) | Ads Manager, one geo, one tagged landing, Edge Lab receipt | Plan only · CAC unknown |
| Other qualified ecommerce | Cut | 0 | 0 | None | None named | Removed |
| **Online total** |  | **2,160** | **66** |  |  | Plan only |
| Pop-up visitors | Keep as plan | 135 visitors | 20 | Event lead | Venue, RSVP, POS; not online sessions | Plan only |

SMS people already on email are not extra sessions. Connector or paid clicks that are also waitlist members count once, in the first-touch channel recorded at capture.

The 850 paid sessions are coverage arithmetic (`26 / 0.0306`), not a bought media plan. They stay in Forecast Lab so the 85% goal has a named path. They do not mean the ads are approved, priced, or live.

Practice fill for the empty CPC/CTR/CVR fields lives in [`../research/commerce-intelligence/ads-public-priors/`](../research/commerce-intelligence/ads-public-priors/) and [`drop-001-paid-ads-practice-readout.md`](drop-001-paid-ads-practice-readout.md). That practice says WordStream apparel CPC (~C$1.18) would need ~C$1,001 to buy all 850 sessions, which blows the C$450 paid-social working line. Use it to set a TEST cap, not to publish spend.

## Paid ads operating box

- Geo: Ottawa/Gatineau first.
- Offer / landing: one VORG landing with product, size, colour, city, and `utm` / unique link.
- Daily and total cap: founder-set, from non-inventory cash only; not from the production cap.
- Creative: original VORG work. Do not copy protected competitor ads.
- Measurement: unique qualified sessions and purchases into Forecast Lab; experiment receipt into Edge Lab.
- Supervision: agent may draft copy, targeting notes, and a cap recommendation. Publish, budget, pixel, and scale require founder action-time approval in Ads Manager or an official Ads API. Daily recap is not approval.
- Kill: pause if the cap is hit, if landing truth fails, or if Drop OS is not in TEST for a small proof / GO for anything larger.

## What this is not

- Not historical traffic. Forecast Lab traffic CV stays plan-only (0.35) until a classified historical receipt exists.
- Not a CAC, ROAS, or media-buyer model.
- Not restoration of unnamed “other ecommerce.”
- Not authorization to spend.

## Replacement receipts

| Plan field | Receipt that can replace it |
| --- | --- |
| 980 waitlist sessions | Unique tagged landing sessions from the consented list |
| 330 connector sessions | Unique link/code sessions, deduped against waitlist |
| 850 paid sessions | Ad-account unique landing sessions inside the approved cap, after bot/bounce filters |
| Paid CAC | Spend ÷ unique attributed purchases, after returns settle |
| 135 pop-up visitors | Venue capacity + RSVP/show-rate plan, then door count |
| Session → purchase rate | Aggregate purchases / sessions with one written dedup policy |

Enter real aggregates only. Session + purchase orders update the planning prior without a full funnel. That does not freeze the call, clear readiness, or raise P(85%) by assumption.

## Next gate

1. Stand up the consented waitlist with product, size, colour, city, and source fields.
2. Issue connector codes before counting connector sessions as historical.
3. Founder sets a TEST paid cap and one landing before any ad is published. Re-check the practice cash geometry in `drop-001-paid-ads-practice-readout.md` first.
4. Do not treat the 850-session paid line as live until tagged sessions exist.
5. Do not build an unattended Hermes media buyer from public CPC/CVR averages.
