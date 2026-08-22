# DaVinci Resolve node-tree template

Node numbers describe jobs, not fixed settings.

1. `01_INPUT_COLOR_MANAGEMENT` - confirm input transform and timeline space.
2. `02_NEUTRAL_BALANCE` - exposure and neutral balance before style.
3. `03_CONTRAST_SHAPE` - toe, shoulder, and midtone separation.
4. `04_PRODUCT_PROTECTION` - protect garment/product color and texture.
5. `05_SKIN_PROTECTION` - local correction only where evidence requires it.
6. `06_CAMPAIGN_LOOK` - one restrained shared look.
7. `07_SHOT_MATCH` - per-shot exceptions after the shared look.
8. `08_TEXTURE_GRAIN` - output-aware texture; do not hide integration failures.
9. `09_OUTPUT_TRANSFORM` - delivery color space and level check.

For each node record: purpose, affected region, scopes used, what must remain unchanged, and bypass comparison result.

Required scopes: waveform, RGB parade, and vectorscope. Use scopes to confirm visual judgment, not to replace it.
