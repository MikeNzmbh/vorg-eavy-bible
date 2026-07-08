# VORG-EAVY Agent Handoff

Last updated: 2026-07-07

## What This Repo Is

This repo is the VORG-EAVY Bible: the operating memory for the brand, product system, launch, finance assumptions, research, and agent handoffs.

Path:

`C:\Users\mbaho\OneDrive\Documents\vorg-eavy-bible`

## What The Project Is

VORG-EAVY is currently being shaped as a direct-to-consumer fashion micro-label, not a broad marketplace.

The immediate thesis:

- Start in Ottawa/Gatineau.
- Build a status-driven brand world before broad catalog.
- Launch with a small controlled drop.
- Use scarcity, community, product quality, and local pop-up proof.
- Reinvest first before founder withdrawal.

## Active Launch Shape

- Launch window: September 2026.
- Drop 001 founder-stated product set: The Firm Jacket, women's low-rise denim jean, men's denim jean, scarf, women's top / bodysuit.
- Initial inventory / production spend ceiling: C$5,000-C$6,000 max.
- Planned units: TBD after vendor quotes.
- Target revenue: TBD after prices and units are rebuilt.
- Channel: direct-to-consumer only.
- Storefront: open online drop at launch; no password gate.
- Event: one controlled day-to-night pop-up.

## Important Adjacent Work

The app repo lives at:

`C:\Users\mbaho\OneDrive\Documents\New project`

That app is VORG-EAVY Atelier. It is an internal AI garment studio for concept reconstruction, material editing, and artifact export.

Current app truth:

- It supports image intake, capture QA, material extraction, parametric garment concepts, and export.
- It has a Python worker contract at `workers/scan_worker.py`.
- It should be treated as concept tooling, not a production manufacturing system.
- Recent backend work improved silhouette safety by isolating the largest connected garment component and blending weak one-image evidence conservatively.

## Best Agent Pattern To Preserve

Borrowed from the Atelier repo:

- Artifact-first documentation.
- Confidence-banded claims.
- Explicit review gates.
- Source evidence attached to outputs.
- Human review before production truth.
- Worker contracts that can later be upgraded without changing the whole system.

Apply that mindset to strategy too. Do not let docs drift into hype without evidence.

## Drop OS (internal squad desk)

Checked: 2026-07-01

- **Live:** https://site-blond-kappa.vercel.app/drop-os
- **Guide:** https://site-blond-kappa.vercel.app/guide
- **Code:** `site/drop-os.html`, `site/drop-os.js`, `site/drop-os-supabase.js`
- **Supabase project:** `vorg-eavy-drop-os` (`ca-central-1`) — `site/supabase/schema-v2.sql` (auth + Storage)
- **Squad sync v2:** email magic link + invite redemption — no shared PIN on `drop-001` (`auth_only = true`)
- **Vercel env:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DROP_SYNC_SLUG` (`drop-001`); optional `DROP_INVITE_CODE` for onboarding hint only
- **Squad invite (seed):** `ve-invite-drop001-2026` — rotate in Supabase if leaked
- **Storage:** bucket `drop-sku-images` — SKU photos upload when signed in as squad member
- **QA:** `python -m http.server 4182` in `site/`, then `node site/test-drop-os-flow.mjs` (34 tests)
- **Manufacturing truth:** Factory lane — vendor quote + PP sample proof URLs per SKU
- **Investor read:** working desk scores vs verified debrief metrics (Known / Assumed / Unresolved)

## Current Open Questions

- Which vendor mix can produce jacket, women's denim, men's denim, scarf, and top / bodysuit inside the C$5,000-C$6,000 inventory / production cap?
- What unit split preserves the drop story without overextending cash?
- Is the women's top a bodysuit, rib top, tee, or long-sleeve after fit proof?
- What exact rise, fit, wash, and measurement spec define the women's low-rise denim jean?
- What exact fit block defines the men's denim jean?
- Which exact Ottawa/Gatineau venue is safest for the first pop-up?
- Which Shopify theme and content model should be used for the open online launch?
- Which AI garment stack is worth integrating first into Atelier?
- What legal/compliance checklist should be locked before event deposits?

## Next Useful Tasks

1. Rebuild the Drop 001 unit, price, and COGS model around the corrected founder pick and C$5,000-C$6,000 production cap.
2. Turn the corrected product set into vendor-ready tech-pack outlines.
3. Replace financial assumptions with vendor quotes as they arrive.
4. Build a venue shortlist with compliance notes.
5. Build a Shopify information architecture doc.
6. Create a decision log for every major strategic choice.
7. Keep this repo synced with the Atelier app when technical capabilities change.
8. Run Drop 001 milestones in Drop OS and keep Supabase state backed up via Handoff snapshots.
