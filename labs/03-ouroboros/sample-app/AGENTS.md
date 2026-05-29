# Agent context for the Ouroboros sample app

This is lab 03 (Ouroboros). The lab README is at `../README.md`.

## Ouroboros rules

- Use the `ooo` MCP commands provided by the Ouroboros runtime:
  `ooo interview` → `ooo seed show` → `ooo execute` → `ooo evaluate` → `ooo evolve`.
- Never write implementation code before a Seed exists for the current task.
- Treat the Seed as immutable for the duration of one execute/evaluate cycle.
  If acceptance criteria change, run `ooo interview` again to produce a new
  Seed instead of editing the previous one.
- After `ooo evaluate`, write the gate result and next-iteration candidates
  to RETRO.md.

## Implementation rules

- Python 3.12+ standard library only.
- Single module `npri.py`. Entry point `python3 -m npri`.
- Tests under `tests/`. Run with `python3 -m unittest discover -s tests`.
