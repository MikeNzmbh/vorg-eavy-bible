# Drop OS UI Restructure

Checked: 2026-06-29

## Decision Supported

Restructure the Drop OS from a general dashboard into a team operating cockpit that tells VORG-EAVY what to do next, what to stop, what is blocked, and what proof is missing before spend.

## Current Read

The current OS has the right raw ingredients: stage gates, stress test, signals, campaign mechanics, product proof, tasks, CSV import/export, and snapshot copy.

The UI does not yet feel right because everything is visible at once. It reads like a tracker page, not like an operating system. The team needs one command surface first, then deeper workspaces by role and stage.

## Restructure Principles

1. The first screen should answer: are we allowed to spend, test, revise, or kill?
2. The OS should feel like a command center, not a marketing page.
3. The algorithm must explain the score, not hide behind one percentage.
4. Each teammate should see the lane they own without needing to understand every other lane.
5. Campaign Proof should be treated as the do-or-die stage before bulk production exposure.
6. The UI must separate facts, assumptions, open questions, and required proof.
7. City expansion should be evidence-based, not based on one loud signal.
8. Investor-facing export should show proof and blockers without overstating readiness.

## Algorithm Restructure

The algorithm should move from a simple slider average to a proof-gated model.

### Current Weakness

- Launch confidence can rise even when evidence quality or operations are weak.
- Campaign success rate looks too certain for a working forecast.
- Next-city signal is based on the single strongest signal instead of city-level aggregation.
- Stage progress counts completed stages but does not explain stage momentum.
- Campaign tactics are present but barely affect readiness.
- Risk pressure is only a penalty, not a visible diagnostic.

### Improved Model

The OS now uses `VORG Drop OS score v0.2`.

Inputs:

- Demand pull
- Product proof
- Campaign heat
- Operations readiness
- Margin room
- Evidence quality
- Risk pressure
- Stage momentum
- Signal heat
- Campaign proof/tactic readiness

Outputs:

- Launch confidence
- Campaign success forecast
- Gate result: approve, test, revise, or kill
- Primary bottleneck
- Evidence floor
- Stage momentum
- Signal heat
- Campaign proof
- Risk drag
- Next-city score

Rules:

- Evidence, product proof, and operations create a floor. A weak floor blocks approval even if campaign heat is high.
- Risk above the threshold can force a kill or revise result.
- Campaign tactics improve readiness only when they are approved or ready.
- Stage scores are weighted by status and gate result, so blocked stages drag the score.
- Next-city signal aggregates by city instead of picking one signal.

## Full UI Restructuring List

### 1. Replace The Current Landing With A Command Center

Current issue:

- The top of the OS shows metrics, stage detail, product proof, stress test, signals, campaign, and tasks in one long stack.

Restructure:

- Make the first screen a command center with five zones:
  - Decision now: approve, test, revise, kill.
  - Spend gate: what money or action is allowed next.
  - Biggest blocker: the exact proof gap.
  - Current stage: owner, deadline, status, next action.
  - Next 72 hours: the few tasks that unblock the gate.

### 2. Turn Stage Gates Into A Timeline And Workbench

Current issue:

- Stage navigation lives in the sidebar, but the stage itself is not treated like a workspace.

Restructure:

- Keep a left timeline for the ten stages.
- When a stage is selected, show a stage workbench:
  - decision supported
  - owner
  - required artifacts
  - known facts
  - working assumptions
  - unresolved questions
  - blockers
  - gate score
  - next action
  - proof attachments

### 3. Make The Algorithm A Visible Cockpit

Current issue:

- The score feels like a black box.

Restructure:

- Add a score breakdown module under the stress test:
  - evidence floor
  - stage momentum
  - signal heat
  - campaign proof
  - risk drag
- Add explanation text for why the current gate result was chosen.
- Add a "what would change the score" section.

### 4. Split Signal Teller Into A Real Signal Radar

Current issue:

- Signals are just a list sorted by strength.

Restructure:

- Create a dedicated Signal Radar view with:
  - product/item signals
  - city signals
  - channel source
  - signal type: heat, buy intent, fit concern, creator pull, event pull
  - evidence link
  - confidence level
  - recommended action
- Add city aggregation for Ottawa/Gatineau, Montreal, Toronto, Vancouver, and Halifax.

### 5. Create A Product And Sample Lab

Current issue:

- Product proof is a small preview card.

Restructure:

- Add a Product Lab view for each SKU:
  - item thesis
  - role in drop
  - current sample status
  - tech pack link
  - material risk
  - fit risk
  - margin target
  - supplier asks
  - sample correction list
  - founder table script
- Product proof should include microshots, sample photos, and fit proof when available.

### 6. Promote Campaign Proof To Its Own War Room

Current issue:

- Campaign Lab is just a list of tactics.

Restructure:

- Make Campaign Proof a separate high-priority workspace:
  - hook tests
  - founder table clips
  - model/fit clips
  - styling clips
  - city proof clips
  - creator seeding
  - waitlist/SMS signals
  - content KPIs
  - risk checks
- Show the campaign score separately from launch confidence.
- Add a clear red gate: do not order bulk before Campaign Proof clears.

### 7. Add A Content Production Calendar

Current issue:

- The OS names trailer, TikToks, Reels, model shoot, and founder-led education, but the UI does not schedule them.

Restructure:

- Add a calendar or lane board:
  - trailer
  - teaser cuts
  - founder table
  - fit proof
  - styling proof
  - city proof
  - creator proof
  - ecommerce clips
  - pop-up clips
  - next-city tease
- Each asset should have owner, date, status, platform, hook, and proof metric.

### 8. Rebuild The Task Board Around Bottlenecks

Current issue:

- The execution board is a task list, but it does not prioritize by gate impact.

Restructure:

- Split tasks into:
  - blocking spend
  - blocking sample
  - blocking campaign
  - blocking launch
  - nice to have
- Add "impact on gate" to each task.
- Default view should show only tasks that unblock the current stage.

### 9. Add A Production Readiness View

Current issue:

- Production is represented as one stage and a slider.

Restructure:

- Add a Production Readiness view:
  - vendor quotes
  - MOQ
  - COGS
  - sample approval
  - size set
  - PP sample
  - QC checklist
  - compliance/labeling
  - production calendar
  - cash exposure
- This should block "approve" until proof exists.

### 10. Add Open Online Drop Workspace

Current issue:

- The OS says online launch is open, but the UI does not show store readiness.

Restructure:

- Add an ecommerce checklist:
  - public product pages
  - no password gate at launch
  - size guide
  - policies
  - product education
  - analytics
  - email/SMS
  - low-stock state
  - sold-out state
  - next-city waitlist

### 11. Add Pop-Up And VORG After Ops Views

Current issue:

- Pop-Up and VORG After are stages, but not operational workspaces.

Restructure:

- Pop-Up view:
  - venue
  - capacity
  - RSVP
  - staffing
  - stock plan
  - POS
  - fitting flow
  - content consent
  - day-to-night run of show
- VORG After view:
  - theme
  - guest flow
  - creator list
  - recap shots
  - next-city prompt
  - consent
  - safety/risk controls

### 12. Add A City Expansion Map

Current issue:

- Next city is a metric card only.

Restructure:

- Add a city board:
  - Montreal
  - Toronto
  - Vancouver
  - Halifax
  - Ottawa/Gatineau
- Each city should show:
  - waitlist
  - DMs/comments
  - creator/connectors
  - event feasibility
  - shipping/customer density
  - pop-up venue path
  - score
  - next test

### 13. Add Investor Snapshot Mode

Current issue:

- Copy Snapshot exports raw JSON, useful internally but not investor-ready.

Restructure:

- Add a clean investor snapshot:
  - current gate
  - proof achieved
  - proof missing
  - sales/campaign readiness
  - next spend decision
  - city signal
  - risks
- Keep it conservative. Do not claim production readiness without sample/vendor/test evidence.

### 14. Add Team Role Views

Current issue:

- Everyone sees everything.

Restructure:

- Add role filters:
  - Founder
  - Product
  - Production/Finance
  - Campaign
  - Ecommerce
  - Event
  - Investor/Advisor
- Each role should surface its owned stages, tasks, blockers, and required proof.

### 15. Add Data/Proof Attachments

Current issue:

- Evidence links exist as text, but the UI does not feel artifact-first.

Restructure:

- Every gate should support proof attachments:
  - doc link
  - file path
  - image/video reference
  - metric source
  - owner note
  - approval status
- Until there is a backend, this can be structured local state plus export/import.

## Suggested Navigation

Primary nav:

1. Command Center
2. Signal Radar
3. Product Lab
4. Campaign Proof
5. Production
6. Launch
7. Pop-Up / VORG After
8. City Expansion
9. Postmortem
10. Data / Export

This is cleaner than making the stage list the only navigation. Stages are the operating timeline; nav items are the workspaces.

## First Redesign Pass

The first code pass should not try to build the full app. It should restructure the first screen.

Priority changes:

1. Replace the long dashboard layout with a command center.
2. Keep the stage timeline but make it secondary.
3. Add algorithm breakdown.
4. Add current blocker and next 72 hours.
5. Move product proof, signal list, campaign tactics, and tasks into clearer modules.

## Known Facts

- Drop 001 target is September 2026.
- The launch is open online, not password-gated.
- Ottawa/Gatineau is the first wedge.
- The intended expansion cities include Montreal, Toronto, Vancouver, and possibly Halifax.
- Campaign Proof is the riskiest stage before production spend.
- The OS is currently a static HTML/CSS/JS prototype using local storage.

## Working Assumptions

- Early team members will need simple role-based views more than a complex database.
- The first useful version can remain static if import/export works.
- Later team rollout needs a shared backend or connected spreadsheet.
- Investors need a conservative proof snapshot, not the full internal workbench.

## Open Questions

- Which role should see the OS first: founder, product lead, campaign lead, or investors?
- Should the first full rebuild be one screen or a multi-tab app?
- What proof attachments should be mandatory before Campaign Proof can clear?
- Should VORG After be combined with Pop-Up or treated as its own operational workspace?

## Next Agent

Turn this restructure into a UI rebuild in phases. Do not add fake backend behavior. Keep local storage and CSV export until the team confirms the workflow with real Drop 001 data.
