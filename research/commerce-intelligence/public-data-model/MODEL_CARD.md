# VORG Public-Data Transfer Priors v1.0

Checked: 2026-07-25

## Intended use

Shape cold-start uncertainty when VORG has an entered conversion planning rate but no complete first-party funnel. This profile is a challenge prior for range width, not a substitute for the central VORG assumption.

“Center” means the beta-distribution mean. Lower strength increases skew as well as width at a low conversion rate, so simulated P50 sales can move even though the external source never supplies a replacement mean.

## Model and evaluation

- Model: L2 logistic regression.
- Training source: 12,330 one-user sessions from one ecommerce company.
- Target: session ended in revenue.
- Leakage exclusion: `PageValues` is not a feature.
- Random holdout: AUC 0.758938, Brier 0.121621 versus 0.137117 training-rate baseline.
- Blocked Oct-Dec holdout: AUC 0.684304, Brier 0.158559 versus 0.172366 training-rate baseline.

The blocked-month degradation is treated as evidence of distribution-shift risk. The model has not passed out-of-company or fashion-launch validation.

## Engine transfer

| Component | Raw external observation | Engine use |
| --- | --- | --- |
| Session purchase | 15.474453% | Raw level rejected; month variation becomes 7.75785 effective observations around the VORG-entered rate |
| Cancelled unit activity | 7.978568% | Raw level rejected; variability weakens the existing 5% refund center to four effective observations |
| Units per order | Median 151 | Rejected as wholesale-heavy and incompatible |
| Clothing clickstream | 165,474 rows | Sales training rejected because no purchase outcome exists |

## Known limitations

- All labeled data come from businesses other than VORG.
- Sources are old and from different countries, categories, channels, price points, and customer mixes.
- The session classifier has no VORG-compatible live feature feed.
- Cancellation events are not identical to settled refunds or returns.
- Public company filings and platform case studies are unsuitable as row-level launch training labels.
- Wider intervals can be more honest without being more accurate.

## Promotion gate

Do not describe this model as VORG-trained. Promotion requires equivalent VORG event definitions, untouched frozen forecasts, settled outcomes, independent-drop evaluation, and acceptable WAPE, bias, Brier score, and P10-P90 coverage.
