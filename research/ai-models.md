# AI Model Research Notes

Last updated: 2026-05-13

These are candidates for VORG-EAVY Atelier, not confirmed production dependencies.

## Recommended Integration Order

1. Segmentation and part masks.
2. Photoreal virtual try-on.
3. Optional visual 3D concept generation.
4. Blender cleanup / retopo worker.

## Candidate Stack

### SAM2 + GroundingDINO

Role:

Promptable segmentation and garment part masks.

Use case:

Detect garment, collar, sleeve, pocket, hardware, and other part regions before template fitting.

Risk:

Still needs workflow glue and local performance testing.

### FASHN VTON

Role:

Photoreal virtual try-on.

Use case:

Generate realistic model-worn previews from a garment source and fit/reference image.

Risk:

Useful for visual output, but not a substitute for tech packs, fit samples, or manufacturing proof.

### TripoSR / Stable Fast 3D

Role:

Image-to-3D concept generation.

Use case:

Could support visual concept GLBs after segmentation and source review.

Risk:

Image-to-3D output may look impressive while being geometrically wrong for garment production.

## Rule

Do not integrate a model because it demos well. Integrate only when it improves the evidence pipeline:

`source image -> mask/part evidence -> template fit -> material recipe -> review artifact`
