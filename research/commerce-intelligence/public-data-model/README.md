# Public Commerce Transfer Model

Checked: 2026-07-25

## Decision supported

Use lawfully licensed data from other ecommerce companies to improve the shape of VORG-EAVY's cold-start uncertainty before VORG has launch history, without presenting another company's base rate as VORG demand.

This is an **external-public transfer prior**, not first-party evidence and not a calibrated VORG sales model.

## Sources used

| Dataset | Public rows | Rights | What it can teach | Transfer decision |
| --- | ---: | --- | --- | --- |
| [UCI Online Shoppers Purchasing Intention](https://archive.ics.uci.edu/dataset/468/online+shoppers+purchasing+intention+dataset) | 12,330 sessions | CC BY 4.0 | Purchase propensity and month/traffic volatility inside one store | Use only to weaken direct-conversion prior strength; do not import its 15.47% rate |
| [UCI Online Retail](https://archive.ics.uci.edu/dataset/352/online+retail) | 541,909 transaction lines | CC BY 4.0 | Cancellation variability and basket-transfer checks | Use only to weaken refund-prior strength; reject its wholesale-heavy basket level |
| [UCI clothing clickstream](https://archive.ics.uci.edu/dataset/553/clickstream+data+for+online+shopping) | 165,474 clicks | CC BY 4.0 | Fashion browsing sequence and feature-schema research | Exclude from sales training because there is no purchase label |

The raw downloads are ignored by Git. The canonical derived artifact records source URLs, licences, local file hashes, row counts, model metrics, rejected transfers, and accepted engine controls.

## What was trained

The trainer fits an L2 logistic purchase classifier to the 12,330 labeled sessions.

- `PageValues` is excluded because it is derived using transaction value and would leak the target.
- A deterministic 20% session holdout measures within-store discrimination and probability error; the constant-rate baseline is fitted on the corresponding training split, not the holdout.
- A tie-aware rank calculation is used for holdout AUC.
- An October-November-December blocked holdout exposes seasonal distribution shift.
- The classifier is retained as research only because VORG does not yet emit an equivalent feature vector and there is no out-of-company validation set.

The engine does **not** use the classifier's raw purchase rate. It uses between-month variation to derive a weak effective sample strength, then applies a 75% transfer discount. The resulting strength shapes uncertainty around the operator-entered VORG planning rate.

Online Retail is separately analyzed for cancellation variation and units per order. Its basket level fails the transfer gate because the source contains many wholesalers: median units per order is 151 and only 3.99% of orders contain four units or fewer.

## Current outputs

| Diagnostic | Result |
| --- | ---: |
| Random 20% holdout AUC | 0.758938 |
| Random 20% holdout Brier | 0.121621 |
| Random baseline Brier | 0.137117 |
| Blocked-month holdout AUC | 0.684304 |
| Blocked-month holdout Brier | 0.158559 |
| Blocked-month baseline Brier | 0.172366 |
| Engine direct-conversion strength | 7.75785 effective observations |
| Engine refund strength | 4 effective observations |

These are within-source model diagnostics. They are not VORG forecast accuracy.

## Reproduce

From `site/`:

```powershell
npm run train:public-priors
npm run test:public-priors
npm run test:forecast
```

The npm wrapper selects the bundled Codex Python runtime when available, then falls back to a compatible system Python. If the free data packages are missing, install the pinned environment first:

```powershell
python -m pip install -r ../research/commerce-intelligence/public-data-model/requirements.txt
```

The trainer downloads the three official UCI archives when missing and generates:

- `public-commerce-priors.json` - canonical model card and coefficients;
- `../../../site/public-commerce-priors.js` - deeply frozen browser artifact.

## Optional next source

Google publishes an obfuscated GA4 ecommerce event sample through the BigQuery public-data program. It requires a free BigQuery Sandbox or Cloud project and Google warns that obfuscation limits internal consistency. The compatible aggregate query is in `queries/google-ga4-public-funnel.sql`; it has not been represented as executed.

## Truth and operating controls

- The public-transfer profile cannot create `evidence-anchored` status.
- It contributes zero readiness, production approval, or calibration credit.
- First-party VORG funnel observations override the direct planning model.
- A frozen call records the profile and model version used at decision time.
- The engine pins the approved version, date, strengths, and source set; a regenerated or edited artifact fails closed until it is explicitly reviewed and promoted in the forecast engine.
- External base conversion, cancellation, units per order, revenue, and assortment mix remain source statistics, not VORG defaults.

## Next agent

Add another source only when its item-level licence permits the intended use and its outcome definition can be reconciled. Re-run the trainer, review transfer gates, regenerate both artifacts, and rerun forecast and browser tests. Do not loosen the transfer discounts merely to make the forecast look more confident.
