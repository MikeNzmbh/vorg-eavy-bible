# VORG-EAVY Site Access

Checked: 2026-06-25

## What Exists

- `index.html` - public-facing Drop 001 site/lookbook prototype.
- `drop-os.html` - team-facing Drop Operating System dashboard.
- `drop-os.css` - dashboard styling.
- `drop-os.js` - dashboard interactions, local storage, CSV import/export, snapshot copy.

## How People Access It

For local review, open `site/drop-os.html` in a browser.

For team sharing, host the `site/` folder through a static host such as Vercel, Netlify, GitHub Pages, or an internal company file share. No Codex access is required because the dashboard is plain HTML, CSS, and JavaScript.

## How People Interact With It

- Use the left stage rail to move between Signal, Concept, Sample, Campaign Proof, Production, Campaign Build, Open Online Drop, Pop-Up, VORG After, and Postmortem.
- Update each stage's status, gate result, and gate score directly in the stage detail view.
- Use Stress Test sliders to estimate whether the current idea should be approved, tested, revised, or killed before major spend.
- Add signals in Signal Teller when the team sees product interest, DMs, saves, city pull, or fit concerns.
- Approve or unapprove campaign tactics in Campaign Lab.
- Add and complete next actions in the Execution Board.
- Export CSV when the team needs a spreadsheet version.
- Import CSV when a team lead wants to refresh stage status from a spreadsheet.
- Copy Snapshot when sharing the current state with an investor, founder update, or team recap.

The browser saves changes with local storage. A shared production version should eventually connect to a real backend or shared spreadsheet so all teammates see the same state.

## Design References

Used for inspiration only, not copied.

- Behance project-management dashboard search results, checked 2026-06-25: https://www.behance.net/search/projects/project%20management%20dashboard
- Behance ecommerce dashboard UI search results, checked 2026-06-25: https://www.behance.net/search/projects/ecommerce%20dashboard%20ui
- LOOP fashion ecommerce concept, checked 2026-06-25: https://www.behance.net/gallery/241787329/LOOP-Fashion-E-commerce-Branding-Web-Design
- Maison 24 fashion ecommerce concept, checked 2026-06-25: https://www.behance.net/gallery/249435623/Maison-24-E-commerce

## Current Limit

This is a working static prototype. It is usable by non-Codex teammates, but it is not yet a multi-user authenticated app. For a real team rollout, connect it to Google Sheets, Airtable, Supabase, Firebase, or a private admin backend.
