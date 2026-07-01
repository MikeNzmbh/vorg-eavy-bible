# Drop OS — Team Playbook

Checked: 2026-07-01

## What this is

Drop OS is VORG-EAVY's internal **drop desk** — one collection, one city wedge, one bag check at a time. Built for sample proof, founder content, controlled units, Shopify launch, pop-up heat, and next-city pull.

- App: `site/drop-os.html`
- **Full walkthrough with screenshots:** `site/drop-os-guide.html`
- Screenshots: `site/assets/guide/` (regenerate with `node site/capture-guide-screenshots.mjs`)
- Smoke tests: `node site/test-drop-os-flow.mjs` (requires local server on port 4182)
- Operating system doc: `strategy/drop-operating-system.md`

## The loop

```text
Heat → Concept → Sample → Campaign Proof → Production → Campaign Build → Online Drop → Pop-Up → VORG After → Debrief
```

**Campaign Proof** gates bulk production. **Drop desk** gates spend (bag check: GO / TEST / FIX IT / HOLD).

## Daily desk (2 min)

1. **Drop desk** — bag check + bag lock banner
2. **Milestone timeline** — status, gate, proof link
3. **This week's run** — complete or add a move
4. **Heat radar** — log new pull if something moved

## Drop lanes

| Lane | Use for |
| --- | --- |
| Drop desk | Bag check, blockers, milestones, readiness model |
| Heat radar | DMs, saves, waitlist, city pull |
| SKU room | Samples, fit risk, reference photos |
| Campaign proof | Content tactics before bulk |
| Factory gate | Quotes, MOQ, COGS, PP sample |
| Online drop | Shopify, sizing, sell-through UX |
| Pop-up | Day room + VORG After night |
| Next city | Expansion read from logged heat |
| Debrief | Post-drop sell-through and margin |
| Handoff | Export, snapshot, import, next drop |

## How-to (see screenshots in guide)

| Move | Path |
| --- | --- |
| Log heat | Heat radar → Log heat |
| Upload SKU pic | SKU room → Upload photo |
| Update gate | Drop desk → timeline → workbench |
| Review proof links | Drop desk → Proof links |
| Add squad move | Drop desk → This week's run |
| Backup | Handoff → Copy snapshot |
| Clear readiness item | Factory / Online drop / Pop-up → tap checklist card |
| Next drop | Handoff → snapshot first → Start next drop |
| Sync squad | Handoff → CSV or snapshot |

## Real talk

- State lives in **this browser** until export
- Factory / launch / pop-up checklists are interactive and saved locally
- Handoff has a daily backup ritual; `Copy snapshot` marks today's backup done
- Drop energy and sell-through vibe are **working models**, not guarantees

## QA status (2026-07-01)

`test-drop-os-flow.mjs` — 22/22 passed: onboarding, bag check, add task, add SKU, log heat, all lanes, interactive checklists, proof links, snapshot, backup ritual, help, new drop, playbook, localStorage.
