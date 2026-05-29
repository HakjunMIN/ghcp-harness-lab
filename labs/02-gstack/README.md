# Lab 02: gstack (GHCP 어댑테이션)

> gstack의 23개 전문가 역할 슬래시 커맨드를 GHCP 컨텍스트로 가져와, 한 가지 기능을 끝까지 출시해보는 실습.

원본: <https://github.com/garrytan/gstack>

핵심: `/office-hours` → `/plan-ceo-review` → `/plan-eng-review` → `/review` → `/qa` → `/ship`. **"제품 방향을 다시 묻는" CEO/디자이너/QA/보안 전문가 역할**.

> gstack은 본래 Claude Code용입니다. 이 랩에서는 gstack을 로컬에 클론해 두고, 스킬 마크다운 파일을 **GHCP에서 컨텍스트로 참조**하는 방식으로 어댑테이션합니다. 공식 `--host copilot` 옵션은 (작성 시점에) 없습니다.

---

## 1. Prereq

- `git`
- `copilot` CLI
- (선택) `bun`, `node`, `claude` — gstack의 일부 슬래시 커맨드가 Bun 기반 도구를 호출합니다. 이 랩의 샘플 앱 자체는 Bun 없이 진행 가능합니다.

```bash
make prereqs
```

## 2. Install

`install.sh`는 다음을 수행합니다.

1. `~/.gstack` 에 gstack을 얕은 클론
2. 스킬 마크다운을 이 샘플 앱 폴더의 `.gstack/skills/`로 심볼릭 링크
3. `sample-app/AGENTS.md`에 gstack 역할 사용 규칙이 적힌 섹션이 존재하는지 확인

```bash
bash labs/02-gstack/install.sh
```

> gstack의 자체 `setup` 스크립트는 Claude Code 디렉토리를 대상으로 합니다. 이 랩은 그 스크립트를 호출하지 않고, 마크다운 스킬을 GHCP가 읽을 수 있는 위치로만 가져옵니다.

## 3. Configure

샘플 앱에는 다음이 준비되어 있습니다.

- `sample-app/AGENTS.md` — gstack 역할(슬래시 커맨드 = 마크다운 스킬)을 호출하는 규칙
- `sample-app/BRIEF.md` — 모호한 한 줄 요구사항 (의도적으로 흐릿함)

세션 진입:

```bash
cd labs/02-gstack/sample-app
copilot
```

## 4. Brief

만들 것: **"하루 한 줄 회고 웹 페이지"**

- 한 줄로만 적었습니다. `/office-hours` 단계에서 진짜로 무엇을 만들어야 하는지가 드러나야 합니다.

자세한 모호한 사양: [`sample-app/BRIEF.md`](sample-app/BRIEF.md)

## 5. Design (`/office-hours` + `/plan-ceo-review` + `/plan-eng-review`)

[`prompts.md`](prompts.md)의 **Office Hours → CEO Review → Eng Review** 섹션을 차례대로 붙여넣습니다.

각 단계의 산출물:

- `/office-hours` → `DESIGN.md` (실제 통증, 5가지 능력, 추천 wedge)
- `/plan-ceo-review` → `DESIGN.md`에 4가지 모드 중 하나로 스코프 조정
- `/plan-eng-review` → `PLAN.md`에 데이터 흐름, 상태 머신, 테스트 매트릭스

## 6. Implement

gstack의 슬래시 커맨드는 본래 Claude Code의 `/...` 트리거지만, GHCP에서는 다음과 같이 사용합니다.

```
Apply the /autoplan skill (see .gstack/skills/autoplan/SKILL.md) to PLAN.md and
implement it step by step. Use only the standard libraries listed in BRIEF.md.
```

샘플 앱은 정적 HTML + 한 개의 작은 Python 백엔드(`http.server`)로 구성해 추가 의존성을 피합니다.

## 7. Verify & Retrospect (`/review` + `/qa` + `/retro`)

검증:

```bash
cd labs/02-gstack/sample-app
python3 -m unittest discover -s tests -v
```

브라우저 실제 동작 확인:

```bash
python3 -m http.server 5173 --directory web
# 브라우저에서 http://localhost:5173 열기
```

회고는 `/retro` 스킬 규칙에 따라 `sample-app/RETRO.md`에 기록합니다.

## 제거

```bash
rm -rf ~/.gstack
rm -rf labs/02-gstack/sample-app/.gstack
```
