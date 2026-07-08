# Agent Instructions

This repo is the internal Bible for VORG-EAVY. Treat it as the strategic source of truth, not as a disposable notes folder.

## Mission

VORG-EAVY is being narrowed into a direct-to-consumer fashion micro-label. The current launch thesis is one city, one drop architecture, one site, one controlled pop-up, and one reinvestment loop until demand is proven.

The near-term business target is Drop 001 in September 2026:

- Founder-stated active product set: The Firm Jacket, women's low-rise denim jean, men's denim jean, scarf, and women's top/bodysuit.
- Units, prices, and revenue must be rebuilt from vendor quotes.
- Initial inventory / production spend ceiling: C$5,000-C$6,000 max unless the founder explicitly revises it.
- Open direct-to-consumer online drop; no password gate at launch.
- One day-to-night pop-up.
- Ottawa/Gatineau as the first wedge.
- Proof before scale.

## How To Work In This Repo

- Preserve the distinction between facts, working assumptions, and open questions.
- Do not turn working financial assumptions into external benchmarks.
- Do not claim production readiness without proof, vendor quotes, or test evidence.
- Keep brand language selective, disciplined, and specific.
- When adding research, include source links and the date checked.
- When adding numbers, include the source or mark them as working assumptions.
- Prefer concise Markdown files over giant mixed notes.
- Update the relevant section README when a major file is added.

## Apparel Tech Pack Visual Standard

- For sketch packs, apparel tech packs, supplier RFQs, Alibaba packets, and manufacturer-facing sample instructions, use `$visual-tech-pack-builder` alongside `$tech-pack-builder`.
- Use GPT Images for detailed garment sketches, construction visuals, stitch/fabric/trim microshots, and label/tag mockups when drawing is required.
- Use approved VORG-EAVY logo assets only. Prefer the white logo on pack covers/brand strips and approved label/tag mockups; do not let image generation redraw or approximate the logo.
- If Canva tools are available, use them to retrieve approved brand assets. If not, search local/Drive assets and clearly mark missing logo proof as blocked.
- Treat generated visuals as visual intent only. Measurements, BOM, construction notes, testing gates, vendor confirmations, and sample evidence control manufacturing truth.

## Canonical Files

- `README.md` - repo entry point and folder map.
- `docs/MASTER_BRIEF.md` - current complete business brief.
- `docs/HANDOFF.md` - what another agent needs to know immediately.
- `docs/ATELIER_CONTEXT.md` - relationship to the adjacent VORG-EAVY Atelier app.
- `strategy/README.md` - operating thesis and decision gates.
- `brand/README.md` - brand idea, palette, voice, and usage rules.
- `product/README.md` - Drop 001 product system.
- `launch/README.md` - launch format and campaign logic.
- `ops/README.md` - pop-up and operating constraints.
- `finance/README.md` - current working economics.
- `research/README.md` - research source index.

## Adjacent Repo

The working app lives here:

`C:\Users\mbaho\OneDrive\Documents\New project`

That repo is VORG-EAVY Atelier, an internal garment reconstruction and material-editing cockpit. Its strongest reusable agent pattern is:

- artifact-first lifecycle
- explicit confidence scores
- review states
- worker contracts
- no fake production claims
- capture evidence gates before approval

Use the same mindset here.

## Documentation Standard

Every important doc should answer:

1. What decision does this support?
2. What is known?
3. What is assumed?
4. What is still unresolved?
5. What should the next agent do?

## Current Truth Boundaries

- VORG-EAVY is not yet proven as a revenue engine.
- The first financial model is a working model, not vendor-quoted truth.
- The September 2026 launch plan is the active target, not a completed event.
- The Atelier app can produce concept garment artifacts, not manufacturing-ready reconstruction.
- AI model candidates in `research/` require license and feasibility review before use.

## Commit Guidance

Use clear commits that describe the strategic/documentation change. Do not mix unrelated changes.

Good examples:

- `Document Drop 001 launch model`
- `Add agent handoff and operating gates`
- `Update AI model research notes`

## Tone

Write like a serious founder/operator artifact. Clear, calm, practical, and ambitious without fantasy.
