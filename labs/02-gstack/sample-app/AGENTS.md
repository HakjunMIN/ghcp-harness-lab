# Agent context for the gstack sample app

This is lab 02 (gstack adaptation). The lab README is at `../README.md`.

## gstack rules

- Treat `.gstack/skills/<name>/SKILL.md` files as the authoritative spec for
  each slash command. When I say "act as the CEO/Founder" or "/plan-ceo-review",
  load the matching SKILL.md first.
- Run gstack roles in this order for this lab:
  /office-hours → /plan-ceo-review → /plan-eng-review → /autoplan
  → implement → /review → /qa → /retro
- Save design output to DESIGN.md, plan output to PLAN.md, retrospective to
  RETRO.md.

## Implementation rules

- Only Python standard library and static HTML/CSS/JS.
- Static site lives under `web/`. Tests live under `tests/`.
- Run tests with `python3 -m unittest discover -s tests`.
- Run the site with `python3 -m http.server 5173 --directory web`.
