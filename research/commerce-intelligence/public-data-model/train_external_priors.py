#!/usr/bin/env python3
"""Train a conservative public-data transfer profile for the VORG forecast.

The trainer deliberately separates three things:

1. Raw external company statistics.
2. Within-source model validation.
3. The much weaker information allowed to transfer into VORG.

External base conversion, cancellation, and basket levels are never imported as
VORG truth. The browser engine may use only the learned uncertainty strength
around a VORG-entered planning rate.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import urllib.request
import zipfile
from pathlib import Path

import numpy as np
import pandas as pd


CHECKED_ON = "2026-07-25"
TRAINING_SEED = 260725
MODEL_VERSION = "VORG public-data transfer priors v1.0"

SOURCES = {
    "online_shoppers": {
        "title": "Online Shoppers Purchasing Intention Dataset",
        "publisher": "UCI Machine Learning Repository",
        "doi": "10.24432/C5F88Q",
        "page": "https://archive.ics.uci.edu/dataset/468/online+shoppers+purchasing+intention+dataset",
        "download": "https://archive.ics.uci.edu/static/public/468/online+shoppers+purchasing+intention+dataset.zip",
        "license": "CC BY 4.0",
        "archive": "online-shoppers.zip",
        "member": "online_shoppers_intention.csv",
    },
    "online_retail": {
        "title": "Online Retail",
        "publisher": "UCI Machine Learning Repository",
        "doi": "10.24432/C5BW33",
        "page": "https://archive.ics.uci.edu/dataset/352/online+retail",
        "download": "https://archive.ics.uci.edu/static/public/352/online+retail.zip",
        "license": "CC BY 4.0",
        "archive": "online-retail.zip",
        "member": "Online Retail.xlsx",
    },
    "clothing_clickstream": {
        "title": "Clickstream Data for Online Shopping",
        "publisher": "UCI Machine Learning Repository",
        "doi": "10.24432/C5QK7X",
        "page": "https://archive.ics.uci.edu/dataset/553/clickstream+data+for+online+shopping",
        "download": "https://archive.ics.uci.edu/static/public/553/clickstream+data+for+online+shopping.zip",
        "license": "CC BY 4.0",
        "archive": "clothing-clickstream.zip",
        "member": "e-shop clothing 2008.csv",
    },
}

NUMERIC_FEATURES = [
    "Administrative",
    "Administrative_Duration",
    "Informational",
    "Informational_Duration",
    "ProductRelated",
    "ProductRelated_Duration",
    "BounceRates",
    "ExitRates",
    "SpecialDay",
]

CATEGORICAL_FEATURES = [
    "Month",
    "OperatingSystems",
    "Browser",
    "Region",
    "TrafficType",
    "VisitorType",
    "Weekend",
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def download_and_extract(raw_dir: Path, force: bool = False) -> dict[str, dict[str, str | int]]:
    raw_dir.mkdir(parents=True, exist_ok=True)
    records: dict[str, dict[str, str | int]] = {}
    for source_id, source in SOURCES.items():
        archive_path = raw_dir / str(source["archive"])
        extracted_dir = raw_dir / source_id.replace("_", "-")
        member_path = extracted_dir / str(source["member"])
        if force or not archive_path.exists():
            request = urllib.request.Request(
                str(source["download"]),
                headers={"User-Agent": "VORG-EAVY public-data prior research/1.0"},
            )
            with urllib.request.urlopen(request, timeout=120) as response, archive_path.open("wb") as output:
                output.write(response.read())
        if force or not member_path.exists():
            extracted_dir.mkdir(parents=True, exist_ok=True)
            with zipfile.ZipFile(archive_path) as archive:
                archive.extract(str(source["member"]), extracted_dir)
        records[source_id] = {
            "archivePath": archive_path.relative_to(raw_dir.parent).as_posix(),
            "archiveBytes": archive_path.stat().st_size,
            "archiveSha256": sha256(archive_path),
            "dataPath": member_path.relative_to(raw_dir.parent).as_posix(),
            "dataBytes": member_path.stat().st_size,
            "dataSha256": sha256(member_path),
        }
    return records


def sigmoid(values: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-np.clip(values, -35, 35)))


def fit_logistic(x: np.ndarray, y: np.ndarray, l2: float = 0.001, max_iter: int = 60) -> np.ndarray:
    design = np.column_stack([np.ones(len(x)), x])
    weights = np.zeros(design.shape[1], dtype=float)
    penalty = np.eye(design.shape[1], dtype=float) * l2
    penalty[0, 0] = 0
    for _ in range(max_iter):
        probabilities = sigmoid(design @ weights)
        variance = np.clip(probabilities * (1 - probabilities), 1e-6, None)
        gradient = (design.T @ (probabilities - y)) / len(y) + penalty @ weights
        hessian = (design.T @ (design * variance[:, None])) / len(y) + penalty
        step = np.linalg.solve(hessian, gradient)
        weights -= step
        if float(np.max(np.abs(step))) < 1e-7:
            break
    return weights


def predict_logistic(x: np.ndarray, weights: np.ndarray) -> np.ndarray:
    return sigmoid(np.column_stack([np.ones(len(x)), x]) @ weights)


def auc_score(y: np.ndarray, probabilities: np.ndarray) -> float:
    order = np.argsort(probabilities, kind="mergesort")
    ranks = np.empty(len(order), dtype=float)
    sorted_probabilities = probabilities[order]
    start = 0
    while start < len(order):
        end = start + 1
        while end < len(order) and sorted_probabilities[end] == sorted_probabilities[start]:
            end += 1
        average_rank = ((start + 1) + end) / 2
        ranks[order[start:end]] = average_rank
        start = end
    positives = y == 1
    positive_count = int(positives.sum())
    negative_count = len(y) - positive_count
    if not positive_count or not negative_count:
        return float("nan")
    return float((ranks[positives].sum() - positive_count * (positive_count + 1) / 2) / (positive_count * negative_count))


def metrics(y: np.ndarray, probabilities: np.ndarray, baseline_rate: float) -> dict[str, float | int]:
    clipped = np.clip(probabilities, 1e-9, 1 - 1e-9)
    baseline = np.full(len(y), baseline_rate)
    return {
        "rows": int(len(y)),
        "positiveRate": round(float(y.mean()), 8),
        "auc": round(auc_score(y, clipped), 6),
        "brier": round(float(np.mean((clipped - y) ** 2)), 6),
        "baselineBrier": round(float(np.mean((baseline - y) ** 2)), 6),
        "logLoss": round(float(-np.mean(y * np.log(clipped) + (1 - y) * np.log(1 - clipped))), 6),
    }


def prepare_matrix(data: pd.DataFrame, train_index: np.ndarray, test_index: np.ndarray):
    numeric = data[NUMERIC_FEATURES].astype(float)
    means = numeric.iloc[train_index].mean()
    stds = numeric.iloc[train_index].std(ddof=0).replace(0, 1)
    numeric_scaled = (numeric - means) / stds
    categorical = pd.get_dummies(
        data[CATEGORICAL_FEATURES].astype(str),
        prefix=CATEGORICAL_FEATURES,
        dtype=float,
    )
    matrix = pd.concat([numeric_scaled, categorical], axis=1)
    return (
        matrix.iloc[train_index].to_numpy(dtype=float),
        matrix.iloc[test_index].to_numpy(dtype=float),
        list(matrix.columns),
        {key: round(float(value), 8) for key, value in means.items()},
        {key: round(float(value), 8) for key, value in stds.items()},
    )


def implied_beta_strength(mean: float, variance: float) -> float:
    if variance <= 0:
        return 0
    return max(0.0, mean * (1 - mean) / variance - 1)


def train_session_model(path: Path) -> dict:
    data = pd.read_csv(path)
    expected = set(NUMERIC_FEATURES + CATEGORICAL_FEATURES + ["PageValues", "Revenue"])
    missing = sorted(expected - set(data.columns))
    if missing:
        raise ValueError(f"Online Shoppers is missing columns: {missing}")
    if len(data) != 12330:
        raise ValueError(f"Online Shoppers row count drifted: expected 12330, found {len(data)}")

    # PageValues is excluded because it is derived using transaction value and
    # would leak outcome information into a model presented as pre-purchase.
    target = data["Revenue"].astype(int).to_numpy(dtype=float)
    rng = np.random.default_rng(TRAINING_SEED)
    permutation = rng.permutation(len(data))
    test_size = int(round(len(data) * 0.2))
    test_index = np.sort(permutation[:test_size])
    train_index = np.sort(permutation[test_size:])
    x_train, x_test, feature_names, means, stds = prepare_matrix(data, train_index, test_index)
    weights = fit_logistic(x_train, target[train_index])
    random_holdout = metrics(
        target[test_index],
        predict_logistic(x_test, weights),
        float(target[train_index].mean()),
    )

    blocked_mask = data["Month"].isin(["Oct", "Nov", "Dec"]).to_numpy()
    blocked_train = np.flatnonzero(~blocked_mask)
    blocked_test = np.flatnonzero(blocked_mask)
    x_block_train, x_block_test, _, _, _ = prepare_matrix(data, blocked_train, blocked_test)
    blocked_weights = fit_logistic(x_block_train, target[blocked_train])
    blocked_holdout = metrics(
        target[blocked_test],
        predict_logistic(x_block_test, blocked_weights),
        float(target[blocked_train].mean()),
    )

    all_index = np.arange(len(data))
    x_all, _, final_features, final_means, final_stds = prepare_matrix(data, all_index, np.array([], dtype=int))
    final_weights = fit_logistic(x_all, target)

    month_rates = data.groupby("Month")["Revenue"].agg(["count", "mean"])
    raw_mean = float(target.mean())
    between_month_variance = float(np.average((month_rates["mean"] - raw_mean) ** 2, weights=month_rates["count"]))
    raw_strength = implied_beta_strength(raw_mean, between_month_variance)
    transfer_discount = 0.25
    transfer_strength = min(12.0, max(4.0, raw_strength * transfer_discount))

    coefficients = {"intercept": round(float(final_weights[0]), 8)}
    coefficients.update({name: round(float(value), 8) for name, value in zip(final_features, final_weights[1:])})
    return {
        "rows": int(len(data)),
        "positiveSessions": int(target.sum()),
        "rawPurchaseRate": round(raw_mean, 8),
        "rawBetweenMonthVariance": round(between_month_variance, 8),
        "rawImpliedBetaStrength": round(raw_strength, 6),
        "transferDiscount": transfer_discount,
        "engineConversionStrength": round(transfer_strength, 6),
        "randomHoldout": random_holdout,
        "blockedMonthHoldout": blocked_holdout,
        "leakageControls": [
            "PageValues excluded because it is transaction-derived.",
            "The split is deterministic and the random holdout contains sessions unseen during fitting.",
            "The Oct-Nov-Dec blocked holdout exposes seasonal transfer weakness inside the same store.",
        ],
        "model": {
            "type": "L2 logistic regression",
            "seed": TRAINING_SEED,
            "features": final_features,
            "numericMeans": final_means,
            "numericStandardDeviations": final_stds,
            "coefficients": coefficients,
            "usePolicy": "Research classifier only until VORG emits the same pre-purchase features and passes out-of-company validation.",
        },
    }


def analyze_transactions(path: Path) -> dict:
    data = pd.read_excel(path)
    if len(data) != 541909:
        raise ValueError(f"Online Retail row count drifted: expected 541909, found {len(data)}")
    invoice = data["InvoiceNo"].astype(str)
    quantity = pd.to_numeric(data["Quantity"], errors="coerce").fillna(0)
    price = pd.to_numeric(data["UnitPrice"], errors="coerce").fillna(0)
    invoice_date = pd.to_datetime(data["InvoiceDate"], errors="coerce")
    cancellation = invoice.str.lower().str.startswith("c") | (quantity < 0)
    sale = (~cancellation) & (quantity > 0) & (price > 0)
    orders = pd.DataFrame({"invoice": invoice[sale], "units": quantity[sale]}).groupby("invoice", as_index=False).sum()
    cancelled_units = float((-quantity[cancellation & (quantity < 0)]).sum())
    gross_units = float(quantity[sale].sum())

    monthly = pd.DataFrame({
        "month": invoice_date.dt.to_period("M").astype(str),
        "sale": np.where(sale, quantity, 0),
        "cancel": np.where(cancellation & (quantity < 0), -quantity, 0),
    }).groupby("month").sum()
    monthly["rate"] = monthly["cancel"] / (monthly["sale"] + monthly["cancel"])
    cancellation_rate = float(monthly["cancel"].sum() / (monthly["sale"].sum() + monthly["cancel"].sum()))
    cancellation_variance = float(np.average(
        (monthly["rate"] - cancellation_rate) ** 2,
        weights=monthly["sale"] + monthly["cancel"],
    ))
    cancellation_strength = implied_beta_strength(cancellation_rate, cancellation_variance)
    transfer_discount = 0.10
    transfer_strength = min(12.0, max(4.0, cancellation_strength * transfer_discount))

    return {
        "rows": int(len(data)),
        "saleInvoices": int(len(orders)),
        "grossSaleUnits": int(gross_units),
        "cancelledUnits": int(cancelled_units),
        "rawCancellationUnitRate": round(cancelled_units / gross_units, 8),
        "rawCancellationShareOfActivity": round(cancellation_rate, 8),
        "rawCancellationImpliedBetaStrength": round(cancellation_strength, 6),
        "transferDiscount": transfer_discount,
        "engineRefundStrength": round(transfer_strength, 6),
        "unitsPerOrder": {
            "mean": round(float(orders["units"].mean()), 4),
            "median": round(float(orders["units"].median()), 4),
            "p10": round(float(orders["units"].quantile(0.1)), 4),
            "p90": round(float(orders["units"].quantile(0.9)), 4),
            "ordersAtOrBelowFour": round(float((orders["units"] <= 4).mean()), 8),
            "adoption": "rejected",
            "reason": "The source contains many wholesalers; its median basket is incompatible with a five-SKU fashion micro-label and the engine's one-to-four-unit contract.",
        },
        "cancellationUsePolicy": "Variability may weaken VORG's refund prior; the external cancellation level must not replace VORG returns data.",
    }


def analyze_clothing_clickstream(path: Path) -> dict:
    data = pd.read_csv(path, sep=";")
    sessions = data.groupby("session ID").size()
    return {
        "rows": int(len(data)),
        "sessions": int(len(sessions)),
        "medianClicksPerSession": round(float(sessions.median()), 4),
        "p90ClicksPerSession": round(float(sessions.quantile(0.9)), 4),
        "salesTrainingEligibility": "rejected",
        "reason": "The clothing clickstream has product and browsing events but no purchase outcome label.",
        "allowedUse": "Fashion browsing stress design and feature-schema research only.",
    }


def build_artifact(raw_dir: Path, file_records: dict) -> dict:
    shoppers_path = raw_dir / "online-shoppers" / str(SOURCES["online_shoppers"]["member"])
    retail_path = raw_dir / "online-retail" / str(SOURCES["online_retail"]["member"])
    clothing_path = raw_dir / "clothing-clickstream" / str(SOURCES["clothing_clickstream"]["member"])
    session_model = train_session_model(shoppers_path)
    retail_model = analyze_transactions(retail_path)
    clothing_model = analyze_clothing_clickstream(clothing_path)

    source_records = []
    for source_id, source in SOURCES.items():
        source_records.append({
            "id": source_id,
            "title": source["title"],
            "publisher": source["publisher"],
            "doi": source["doi"],
            "url": source["page"],
            "downloadUrl": source["download"],
            "license": source["license"],
            "checkedOn": CHECKED_ON,
            **file_records[source_id],
        })

    return {
        "schemaVersion": 1,
        "profileId": "public-transfer-v1",
        "modelVersion": MODEL_VERSION,
        "checkedOn": CHECKED_ON,
        "trainingSeed": TRAINING_SEED,
        "truthClass": "external-public-transfer",
        "status": "challenge-prior",
        "engineProfile": {
            "directConversionStrength": session_model["engineConversionStrength"],
            "refundStrength": retail_model["engineRefundStrength"],
            "conversionCenterPolicy": "Keep the entered VORG planning rate or first-party posterior center; external data changes uncertainty strength only.",
            "refundCenter": 0.05,
            "refundCenterPolicy": "Retain the internal five-percent cold-start center; external cancellation data changes uncertainty strength only.",
        },
        "sessionPurchaseModel": session_model,
        "transactionModel": retail_model,
        "clothingClickstream": clothing_model,
        "sources": source_records,
        "transferLimits": [
            "All training sources describe other companies, countries, periods, assortments, and acquisition mixes.",
            "The Online Shoppers classifier has only within-store holdouts, not out-of-company validation.",
            "The Online Retail company sells giftware and includes many wholesale customers.",
            "The clothing clickstream has no purchase outcome and is excluded from sales training.",
            "This profile cannot create evidence-anchored status, readiness points, production approval, or calibration credit.",
        ],
    }


def javascript_bundle(artifact: dict) -> str:
    payload = json.dumps(artifact, indent=2, ensure_ascii=False)
    return (
        "'use strict';\n\n"
        "(function attachPublicCommercePriors(root) {\n"
        "  function deepFreeze(value) {\n"
        "    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;\n"
        "    Object.values(value).forEach(deepFreeze);\n"
        "    return Object.freeze(value);\n"
        "  }\n\n"
        f"  const artifact = {payload};\n\n"
        "  root.VorgPublicCommercePriors = deepFreeze(artifact);\n"
        "}(typeof window !== 'undefined' ? window : globalThis));\n"
    )


def main() -> None:
    repo_root = Path(__file__).resolve().parents[3]
    model_dir = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-dir", type=Path, default=model_dir / "raw")
    parser.add_argument("--output-json", type=Path, default=model_dir / "public-commerce-priors.json")
    parser.add_argument("--output-js", type=Path, default=repo_root / "site" / "public-commerce-priors.js")
    parser.add_argument("--download", action="store_true", help="Download missing official UCI archives; re-download with --force.")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    if args.download or args.force:
        file_records = download_and_extract(args.raw_dir, force=args.force)
    else:
        file_records = download_and_extract(args.raw_dir, force=False)
    artifact = build_artifact(args.raw_dir, file_records)
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_js.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(artifact, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    args.output_js.write_text(javascript_bundle(artifact), encoding="utf-8")
    print(json.dumps({
        "profileId": artifact["profileId"],
        "sources": len(artifact["sources"]),
        "sessionRows": artifact["sessionPurchaseModel"]["rows"],
        "transactionRows": artifact["transactionModel"]["rows"],
        "clothingRows": artifact["clothingClickstream"]["rows"],
        "randomHoldout": artifact["sessionPurchaseModel"]["randomHoldout"],
        "blockedMonthHoldout": artifact["sessionPurchaseModel"]["blockedMonthHoldout"],
        "engineProfile": artifact["engineProfile"],
    }, indent=2))


if __name__ == "__main__":
    main()
