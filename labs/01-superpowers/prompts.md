# Superpowers 실습 프롬프트

GHCP 세션(`copilot`) 안에서 아래 블록을 차례대로 붙여 넣습니다. Superpowers는 키워드를 보고 자동으로 적절한 스킬을 트리거합니다.

## Brainstorm

```
Use the brainstorming skill. I want to design a small CLI called `mdtodo` that
manages a markdown todo file. Goals and non-goals are in BRIEF.md. Ask me one
question at a time, present the design in short sections I can validate, and
when we're done, save the result to DESIGN.md.
```

## Plan

```
Use the writing-plans skill. Based on DESIGN.md, break the implementation into
2-5 minute tasks. Each task must list exact file paths, the code to write,
and the verification command. Save the plan as PLAN.md.
```

## Execute (서브에이전트)

```
Use the subagent-driven-development skill to execute PLAN.md. Strictly follow
test-driven-development: write a failing test, watch it fail, write the minimum
code to pass, commit. Use only the Python standard library. After each task,
run `python3 -m unittest discover -s tests` and report the result.
```

## Review

```
Use the requesting-code-review skill. Review the implementation against
PLAN.md. Report issues by severity. Stop and ask me before fixing critical ones.
```

## Finish

```
Use the finishing-a-development-branch skill. Verify all tests pass, summarize
what changed, and propose next actions in RETRO.md.
```
