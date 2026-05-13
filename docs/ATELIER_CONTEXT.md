# VORG-EAVY Atelier Context

Last updated: 2026-05-13

## Location

The app repo is located at:

`C:\Users\mbaho\OneDrive\Documents\New project`

## Purpose

VORG-EAVY Atelier is an internal AI garment studio. It is meant to support concept reconstruction, material editing, source-evidence review, and export artifacts for the fashion label.

It is not yet a manufacturing-ready reconstruction system.

## Current Capabilities

- React / TypeScript app.
- Babylon.js garment viewport.
- Up to 3 source images.
- Capture QA and confidence grading.
- Duplicate source/view warnings.
- Foreground garment mask heuristics.
- Material color extraction.
- Parametric templates for outerwear, tops, bottoms, and skirts.
- Scan vault and artifact records.
- PNG, GLB, and JSON recipe exports.
- Python worker contract runner in `workers/scan_worker.py`.

## Latest Important Technical Decision

The old silhouette fit was failing because it used full foreground bounding boxes as garment width. That made single front photos inflate sleeve volume and produce unusable silhouettes.

The current fix:

- isolate the largest connected foreground component
- measure core width, shoulder width, hem width, sleeve spread, and compactness
- blend one-image evidence conservatively
- render bomber sleeves as controlled flat panels instead of tubes
- keep one-image outputs as concept only

## Commands

From the app repo:

```bash
npm install
npm run dev
npm run build
python workers/scan_worker.py --demo
```

## Agent Rule

Do not describe Atelier outputs as real garment reconstruction unless a proper model-backed segmentation/reconstruction worker is added and verified.

Correct language:

- concept garment
- parametric reconstruction draft
- evidence-banded artifact
- reviewable template candidate

Incorrect language:

- production-ready mesh
- manufacturing asset
- exact reconstruction
- verified replica
