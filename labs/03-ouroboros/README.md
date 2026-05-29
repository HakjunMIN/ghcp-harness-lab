# Lab 03: Ouroboros (GHCP runtime)

> Ouroboros를 GHCP runtime으로 설치하고, `ooo` 명령으로 모호한 아이디어를 명세 → 실행 → 평가 루프로 빌드해보는 실습.

원본: <https://github.com/Q00/ouroboros>

핵심: `ooo interview` → Seed → `ooo execute` → 3단계 evaluation gate → Evolve. **명세 우선, replay 가능한 에이전트 OS**.

---

## 1. Prereq

- `python3` >= 3.12 (Ouroboros 요구사항)
- `pipx` 또는 `uv`
- `gh` (인증 필요)
- `copilot` CLI

```bash
make prereqs
gh auth status     # 인증되지 않았다면 `gh auth login`
```

## 2. Install

`install.sh`는 다음을 수행합니다.

1. `pipx install 'ouroboros-ai[mcp]'` (`pipx`가 없으면 `uv tool install` 대안 안내)
2. `ouroboros setup --runtime copilot` — 모델 라이브 디스커버리 후 MCP 서버를 `~/.copilot/mcp-config.json`에 등록
3. `ouroboros --version` 으로 설치 확인

```bash
bash labs/03-ouroboros/install.sh
```

> 이 스크립트는 사용자 글로벌 환경에 설치합니다. 실행 전 내용을 확인하세요. Ouroboros는 Python 3.12 이상을 요구합니다.

## 3. Configure

- `~/.copilot/mcp-config.json` 에 `ouroboros` MCP 서버가 추가되었는지 확인
- `sample-app/AGENTS.md` 에 Ouroboros 워크플로우 규칙이 적혀 있음
- `sample-app/BRIEF.md` 에 모호한 아이디어 한 줄

```bash
cat ~/.copilot/mcp-config.json | python3 -m json.tool | head
```

세션 진입 (반드시 설치 후 GHCP 재시작):

```bash
cd labs/03-ouroboros/sample-app
copilot
```

## 4. Brief

만들 것: **"오늘 할 일을 자연어로 받아서 우선순위를 매겨주는 CLI"** — 의도적으로 모호.

자세한 사양: [`sample-app/BRIEF.md`](sample-app/BRIEF.md)

## 5. Design (`ooo interview` → Seed)

[`prompts.md`](prompts.md)의 **Interview** 섹션을 GHCP 세션에서 그대로 입력합니다.

```
ooo interview "오늘 할 일을 자연어로 받아 우선순위를 매겨주는 CLI"
```

Ouroboros가 Socratic 인터뷰로 모호한 가정을 노출하고, Seed 명세(불변 specification)를 생성합니다. Seed는 `.ouroboros/seeds/`에 저장됩니다.

## 6. Implement (`ooo execute`)

```
ooo execute --seed <생성된-seed-id>
```

Ledger에 모든 액션이 기록되어 다른 LLM/런타임에서 replay 가능합니다.

이 랩에서도 Python 표준 라이브러리만 사용하도록 BRIEF에서 제한합니다.

## 7. Verify & Retrospect (3-stage gate + Evolve)

Ouroboros 자체가 3단계 평가 게이트를 돌립니다.

1. Mechanical — lint/test (무료)
2. Semantic — Seed 대비 의미 일치
3. Multi-Model Consensus — 다른 모델로 교차 검증

추가로:

```bash
cd labs/03-ouroboros/sample-app
python3 -m unittest discover -s tests -v
```

Evolve 단계의 결과는 `sample-app/RETRO.md`에 기록합니다. 다음 반복의 입력 Seed가 됩니다.

## 제거

```bash
ouroboros uninstall
pipx uninstall ouroboros-ai || true
```
