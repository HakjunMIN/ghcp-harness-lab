# gstack 실습 프롬프트

GHCP 세션에서 차례로 붙여 넣습니다. gstack 슬래시 커맨드는 본래 Claude Code용이라, GHCP에서는 **마크다운 스킬을 명시적으로 참조**합니다.

## Office Hours

```
Read .gstack/skills/office-hours/SKILL.md (or its closest equivalent inside
.gstack/skills) and act as the "YC Office Hours" specialist described there.
Run the six forcing questions on BRIEF.md. Push back on my framing. Save the
resulting design document to DESIGN.md.
```

## CEO Review

```
Read .gstack/skills/plan-ceo-review/SKILL.md and act as the CEO/Founder.
Review DESIGN.md, pick one of the four modes (Expansion, Selective Expansion,
Hold Scope, Reduction), and rewrite the relevant section of DESIGN.md
accordingly.
```

## Eng Review

```
Read .gstack/skills/plan-eng-review/SKILL.md and act as the Eng Manager.
Produce PLAN.md from DESIGN.md with ASCII data flow, state diagrams, error
paths, and a test matrix. Keep the implementation to Python standard library
and static HTML/CSS/JS.
```

## Autoplan + Implement

```
Read .gstack/skills/autoplan/SKILL.md. Apply it to PLAN.md and implement the
plan step by step. Keep dependencies to the standard libraries listed in
BRIEF.md.
```

## Review + QA

```
Read .gstack/skills/review/SKILL.md and run the Staff Engineer review on the
diff so far. Auto-fix the obvious issues, flag the rest. Then read
.gstack/skills/qa/SKILL.md and run a manual QA pass against
http://localhost:5173 after I start `python3 -m http.server 5173 --directory web`.
Record findings and fixes.
```

## Retro

```
Read .gstack/skills/retro/SKILL.md and produce RETRO.md: what shipped, what
slipped, and the next iteration's candidate work.
```
