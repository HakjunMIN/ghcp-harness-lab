# Lab 01: Superpowers (GHCP)

> Superpowers를 GHCP에 설치하고, 그 워크플로우로 작은 샘플 앱을 TDD로 만들어보는 실습.

원본: <https://github.com/obra/superpowers>

핵심: 브레인스토밍 → 워크트리 → 플랜 → 서브에이전트 실행 → TDD → 코드 리뷰 → 브랜치 마감의 **자동 트리거 스킬**.

---

## 1. Prereq

```bash
# 저장소 루트에서
make prereqs
```

다음이 필요합니다.
- `copilot` CLI (GitHub Copilot CLI)
- `git`
- `gh` (인증 필요 시)

## 2. Install

`install.sh`는 다음을 수행합니다.

1. `copilot plugin marketplace add obra/superpowers-marketplace`
2. `copilot plugin install superpowers@superpowers-marketplace`
3. `copilot plugin list`로 설치 확인

```bash
bash labs/01-superpowers/install.sh
```

> 실행 전 스크립트를 열어 의도를 먼저 확인하세요. 마켓플레이스 등록은 사용자 GHCP 설정에 영향을 줍니다.

## 3. Configure

이 랩의 샘플 앱 디렉토리에서 Superpowers가 컨텍스트를 제대로 인식하도록 다음 파일이 준비되어 있습니다.

- `sample-app/AGENTS.md` — GHCP 세션 진입 시 자동으로 읽힙니다.
- `sample-app/BRIEF.md` — 사용자가 만들고 싶은 것을 한 문장으로 정의.

세션 진입:

```bash
cd labs/01-superpowers/sample-app
copilot
```

## 4. Brief

만들 것: **마크다운 할 일 CLI** (`mdtodo`)

- 입력: `tasks.md` 파일 (체크박스 형식)
- 명령:
  - `mdtodo add "할 일"` — 새 항목 추가
  - `mdtodo done <N>` — N번 항목 완료 처리
  - `mdtodo list` — 미완료 목록 출력
- 비목표: 마감일, 우선순위, 동기화

자세한 사양: [`sample-app/BRIEF.md`](sample-app/BRIEF.md)

## 5. Design (Superpowers `brainstorming` 스킬)

GHCP 세션에서 [`prompts.md`](prompts.md)의 **Brainstorm** 섹션을 그대로 붙여넣으세요. Superpowers가 자동으로 `brainstorming` 스킬을 활성화해 설계 문서를 만들어 줍니다.

결과를 `sample-app/DESIGN.md`로 저장합니다.

## 6. Implement (Superpowers `writing-plans` + `subagent-driven-development` + `test-driven-development`)

[`prompts.md`](prompts.md)의 **Plan → Execute → TDD** 섹션을 순서대로 실행합니다.

- `writing-plans` 스킬이 작은 단위 태스크 목록을 만들고
- `subagent-driven-development`가 태스크별로 서브에이전트를 띄워 실행하며
- `test-driven-development` 스킬이 RED → GREEN → REFACTOR를 강제합니다.

이 랩의 샘플 앱은 Python으로 구현하도록 BRIEF에서 지정합니다. 표준 라이브러리만 사용해 추가 의존성을 피합니다.

## 7. Verify & Retrospect

검증:

```bash
cd labs/01-superpowers/sample-app
python3 -m unittest discover -s tests -v   # 구현이 끝난 뒤
```

회고: 무엇이 잘 작동했는가, 어떤 스킬이 가장 도움이 되었는가를 `sample-app/RETRO.md`에 기록합니다. 이 파일은 다음 랩(gstack, Ouroboros)의 비교 입력이 됩니다.

## 제거

```bash
copilot plugin remove superpowers
```
