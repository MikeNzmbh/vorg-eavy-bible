# Ads Public Practice Priors v1.0

Checked: 2026-08-20

## Decision supported

Fill the empty paid-ads fields (CTR, CPC, fashion session conversion, cost-per-session, cash fit) with **free public samples** so Forecast Lab and the traffic plan can be practiced before VORG has an ad-account export.

This is **external public practice**, not VORG evidence, not CAC truth, and not spend authorization.

## Sources used

| ID | Source | What we took | Rights |
| --- | --- | --- | --- |
| S-ADS-001 | [WordStream Facebook Ads Benchmarks 2025](https://www.wordstream.com/blog/facebook-ads-benchmarks-2025) / [PDF](https://www.wordstream.com/wp-content/uploads/2025/09/ws-guide-2025-fb-benchmarks.pdf) | Apparel / Fashion & Jewelry traffic CTR **1.29%**, CPC **USD 0.86** (1,180 campaigns, Apr 2024–Jun 2025) | Public citation |
| S-ADS-002 | [IRP Fashion Clothing & Accessories](https://www.irpcommerce.com/en/gb/ecommercemarketdata.aspx?Market=3) | July 2026 session conversion **1.74%**, cost/session **£0.11**, CPA **9.06% of revenue** | Free with attribution to IRP Commerce |
| S-ADS-003 | UCI Online Shoppers (already in `public-data-model/`) | Uncertainty strength only; raw 15.47% purchase rate stays rejected | CC BY 4.0 |

Canonical numbers: [`ads-public-priors.json`](ads-public-priors.json).

## What was not transferred

- WordStream / IRP rates are **not** written into Drop OS readiness or as the live Forecast Lab planning center.
- Synthetic Nigerian retail campaign rows and Criteo attribution dumps were rejected as wrong geography / schema for Ottawa Meta traffic.
- No Hermes or other agent may spend from these priors unattended.

## Reproduce

```powershell
node launch/simulate-paid-ads-practice.mjs
```

Practice readout: [`../../launch/drop-001-paid-ads-practice-readout.md`](../../launch/drop-001-paid-ads-practice-readout.md).

## Truth boundary

Practice numbers can set a TEST cap and a kill rule. Only tagged VORG ad sessions and purchases update the live planning prior for real decisions.
