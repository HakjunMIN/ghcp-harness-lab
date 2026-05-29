# GHCP Skill Labs

GitHub Copilot CLI(GHCP)에서 유명한 Claude/에이전트 스킬 프레임워크인 **Superpowers**, **gstack**, **Ouroboros**를 실제로 설치하고, 설정하고, 각 프로젝트의 워크플로우로 샘플 앱을 만들어보는 SDLC 실습 랩입니다.

이 저장소의 목적은 세 프로젝트를 단순히 소개하는 것이 아니라, **설치 → GHCP 구성 → 요구사항 정리 → 설계 → 구현 → 검증 → 회고**까지 한 번에 따라 할 수 있는 실습 프로젝트를 제공하는 것입니다.
 
## 실습 대상

| Lab | 프로젝트 | 원본 저장소 | 핵심 컨셉 | GHCP에서의 사용 방식 |
| --- | --- | --- | --- | --- |
| 01 | Superpowers | <https://github.com/obra/superpowers> | TDD, 서브에이전트, 계획 기반 구현을 강제하는 SDLC 스킬 묶음 | 공식 `copilot plugin` marketplace |
| 02 | gstack | <https://github.com/garrytan/gstack> | CEO, 엔지니어링 매니저, 디자이너, QA, 보안 등 전문가 역할 기반 슬래시 커맨드 | Claude Code 스킬을 GHCP 컨텍스트로 어댑테이션 |
| 03 | Ouroboros | <https://github.com/Q00/ouroboros> | `ooo interview` → Seed → 실행 → 평가 → evolve의 spec-first Agent OS | `ouroboros setup --runtime copilot` |

## 현재 구성 상태

기존 파일을 모두 삭제하고, 실제 세 프로젝트를 GHCP에서 설치/설정/샘플 앱 빌드까지 따라가는 랩 구조로 다시 구성했습니다.

```
labs/
├── 01-superpowers/   # copilot plugin marketplace 기반 설치
├── 02-gstack/        # git clone 후 마크다운 스킬을 GHCP 컨텍스트로 어댑테이션
└── 03-ouroboros/     # ouroboros setup --runtime copilot 기반 공식 GHCP runtime
```

각 랩은 같은 파일 구성을 따릅니다.

| 파일 | 역할 |
| --- | --- |
| `README.md` | 랩 진행 가이드. 설치, 설정, 설계, 구현, 검증 단계 설명 |
| `install.sh` | 실제 설치/연결 명령을 담은 스크립트 |
| `prompts.md` | GHCP 세션에 붙여넣을 실습 프롬프트 |
| `sample-app/BRIEF.md` | 해당 랩에서 만들 샘플 앱의 초기 요구사항 |
| `sample-app/AGENTS.md` | GHCP가 샘플 앱 컨텍스트를 이해하도록 돕는 에이전트 지침 |

## SDLC 흐름

모든 랩은 아래 7단계 흐름을 따릅니다.

```
Prereq → Install → Configure → Brief → Design → Implement → Verify & Retrospect
```

| SDLC 단계 | 목적 | Superpowers | gstack | Ouroboros |
| --- | --- | --- | --- | --- |
| Prereq | 로컬 도구 확인 | `copilot`, `git` | `git`, `copilot`, 선택적으로 `bun` | Python 3.12+, `pipx`/`uv`, `gh`, `copilot` |
| Install | 스킬/런타임 설치 | `copilot plugin install` | `git clone` + 스킬 링크 | `pipx install` + `ouroboros setup` |
| Configure | 프로젝트 컨텍스트 연결 | `AGENTS.md`, Superpowers 자동 트리거 | `.gstack/skills`, `AGENTS.md` | MCP 등록, Seed/Ledger 워크플로우 |
| Brief | 만들 앱 정의 | `mdtodo` CLI | 하루 한 줄 회고 웹 | 자연어 우선순위 CLI |
| Design | 요구사항/설계 추출 | `brainstorming` | `/office-hours`, `/plan-ceo-review`, `/plan-eng-review` | `ooo interview`, Seed |
| Implement | 계획 기반 구현 | `writing-plans`, `subagent-driven-development`, TDD | `/autoplan` 후 단계별 구현 | `ooo execute --seed <id>` |
| Verify & Retrospect | 테스트, 리뷰, 다음 반복 | `requesting-code-review`, branch finish | `/review`, `/qa`, `/retro` | `ooo evaluate`, `ooo evolve` |

## 빠른 시작

```bash
# 0. 사전 도구 확인
make prereqs

# 1. 랩 구조와 문서 무결성 검증
make test
make verify

# 2. 원하는 랩 README를 열고 순서대로 진행
open labs/01-superpowers/README.md
open labs/02-gstack/README.md
open labs/03-ouroboros/README.md
```

> **주의**: 각 랩의 `install.sh`는 사용자 환경에 실제 도구를 설치하거나 GHCP 설정을 변경합니다. 먼저 파일 내용을 읽고, 어떤 전역 설정이 바뀌는지 확인한 뒤 실행하세요. 루트의 `make` 타겟은 외부 설치를 자동 실행하지 않습니다.

## Lab 01: Superpowers

Superpowers는 GHCP를 공식 지원합니다. 원본 README의 GHCP 설치 방식은 다음 흐름입니다.

```bash
copilot plugin marketplace add obra/superpowers-marketplace
copilot plugin install superpowers@superpowers-marketplace
```

이 랩에서는 `labs/01-superpowers/install.sh`가 위 명령을 실행하고, 설치 후 `copilot plugin list`로 확인합니다.

샘플 앱은 **마크다운 할 일 CLI (`mdtodo`)** 입니다. Python 표준 라이브러리만 사용하며, Superpowers의 기본 워크플로우를 그대로 실습합니다.

1. `brainstorming`으로 `BRIEF.md`에서 설계 문서 `DESIGN.md` 생성
2. `writing-plans`로 작은 구현 태스크를 `PLAN.md`에 작성
3. `subagent-driven-development`로 태스크 실행
4. `test-driven-development`로 RED → GREEN → REFACTOR 유지
5. `requesting-code-review`와 `finishing-a-development-branch`로 검증과 회고

실행 위치:

```bash
cd labs/01-superpowers/sample-app
copilot
```

## Lab 02: gstack

gstack은 원래 Claude Code용 스킬/슬래시 커맨드 묶음입니다. 공식 README에는 Claude Code에 다음처럼 설치하는 흐름이 소개되어 있습니다.

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack
./setup
```

다만 현재 gstack의 공식 호스트 목록에는 GHCP 전용 `--host copilot`이 명시되어 있지 않습니다. 그래서 이 랩은 gstack을 `~/.gstack`에 클론한 뒤, 샘플 앱의 `.gstack/skills/`로 스킬 마크다운을 링크하고 GHCP가 그 파일을 읽어 역할 프롬프트로 사용하게 합니다.

```bash
bash labs/02-gstack/install.sh
cd labs/02-gstack/sample-app
copilot
```

샘플 앱은 **하루 한 줄 회고 웹 페이지**입니다. 요구사항을 일부러 모호하게 두고, gstack의 제품/엔지니어링 역할이 스코프를 재정의하도록 합니다.

주요 실습 흐름:

1. `/office-hours`: 모호한 요청에서 실제 사용자 통증을 추출
2. `/plan-ceo-review`: Expansion, Selective Expansion, Hold Scope, Reduction 중 하나로 제품 방향 결정
3. `/plan-eng-review`: 데이터 흐름, 상태, 실패 모드, 테스트 매트릭스 작성
4. `/autoplan`: 구현 계획 생성
5. `/review`, `/qa`, `/retro`: 코드 리뷰, 브라우저 QA, 회고

GHCP에서는 `prompts.md`의 프롬프트처럼 `.gstack/skills/<command>/SKILL.md`를 명시적으로 읽게 합니다.

## Lab 03: Ouroboros

Ouroboros는 GHCP runtime을 공식 지원합니다. 원본 README의 GitHub Copilot CLI quick start는 다음 흐름입니다.

```bash
gh auth login
pipx install 'ouroboros-ai[mcp]'
ouroboros setup --runtime copilot
```

`ouroboros setup --runtime copilot`은 모델 카탈로그를 GitHub Copilot API에서 발견하고, MCP 서버를 `~/.copilot/mcp-config.json`에 등록합니다. 설치 후 GHCP 세션을 재시작해야 합니다.

샘플 앱은 **자연어 우선순위 CLI (`npri`)** 입니다. 이 랩은 구현보다 먼저 Seed 명세를 만드는 것이 핵심입니다.

주요 실습 흐름:

1. `ooo interview`: 모호한 아이디어에서 숨은 가정과 acceptance criteria 추출
2. `ooo seed show <seed-id>`: Seed 명세 확인
3. `ooo execute --seed <seed-id>`: Seed 기준으로 구현
4. `ooo evaluate --seed <seed-id>`: mechanical, semantic, multi-model consensus 평가
5. `ooo evolve --seed <seed-id>`: 평가 결과를 다음 반복의 입력으로 전환

실행 위치:

```bash
bash labs/03-ouroboros/install.sh
cd labs/03-ouroboros/sample-app
copilot
```

## 설치 스크립트가 하는 일

| 스크립트 | 실제 변경 |
| --- | --- |
| `labs/01-superpowers/install.sh` | GHCP plugin marketplace 등록, Superpowers plugin 설치 |
| `labs/02-gstack/install.sh` | `~/.gstack`에 gstack 클론, 샘플 앱 `.gstack/skills` 링크 |
| `labs/03-ouroboros/install.sh` | `ouroboros-ai[mcp]` 설치, GHCP runtime 설정, MCP 등록 확인 |

각 스크립트는 외부 도구 설치 또는 사용자 홈 디렉터리 변경을 수행할 수 있으므로, 자동 검증(`make test`, `make verify`)에서는 실행하지 않습니다.

## 디렉토리 구조

```
.
├── README.md
├── Makefile
├── docs/
│   ├── comparison.md
│   ├── ghcp-cheatsheet.md
│   └── sdlc-overview.md
├── labs/
│   ├── 01-superpowers/
│   │   ├── README.md
│   │   ├── install.sh
│   │   ├── prompts.md
│   │   └── sample-app/
│   │       ├── AGENTS.md
│   │       └── BRIEF.md
│   ├── 02-gstack/
│   │   ├── README.md
│   │   ├── install.sh
│   │   ├── prompts.md
│   │   └── sample-app/
│   │       ├── AGENTS.md
│   │       └── BRIEF.md
│   └── 03-ouroboros/
│       ├── README.md
│       ├── install.sh
│       ├── prompts.md
│       └── sample-app/
│           ├── AGENTS.md
│           └── BRIEF.md
├── scripts/
│   ├── check_prereqs.sh
│   └── verify_labs.sh
└── tests/
    └── test_lab_structure.py
```

## 검증

이 저장소 자체의 검증은 외부 설치 없이 실행됩니다.

```bash
make test
make verify
make prereqs
```

현재 검증 항목:

- 필수 파일 존재 여부
- `install.sh` 실행 권한
- 각 설치 스크립트에 공식/의도된 설치 명령 포함 여부
- 각 랩 README가 SDLC 단계와 핵심 워크플로우를 포함하는지
- 각 샘플 앱 `BRIEF.md`에 완료 정의가 있는지

## 도구 선택 가이드

| 상황 | 추천 |
| --- | --- |
| 요구사항이 흐릿하고 먼저 명세를 잠그고 싶다 | Ouroboros `ooo interview` |
| TDD를 강제하고 작은 태스크로 구현하고 싶다 | Superpowers |
| 제품 방향을 더 세게 검토하고 출시 전 QA/보안까지 보고 싶다 | gstack |
| 세 도구를 함께 쓰고 싶다 | Ouroboros로 Seed 생성 → Superpowers로 TDD 구현 → gstack으로 리뷰/QA |

## 현재 환경 참고

이 세션에서 확인된 현재 로컬 환경은 다음과 같았습니다.

- `git`, `bash`, `python3`, `gh` 사용 가능
- `node`, `npm`, `pipx`, `uv`, `copilot`, `bun`은 현재 PATH에서 발견되지 않음
- Ouroboros 랩은 Python 3.12+가 필요하지만 현재 `python3`는 3.9.6으로 감지됨

따라서 이 저장소의 구조/문서 검증은 통과하지만, 실제 Superpowers/Ouroboros/GHCP 실행은 해당 도구 설치 후 진행해야 합니다.

## 라이선스

이 랩 코드와 문서는 MIT로 사용할 수 있습니다. 외부 프로젝트(Superpowers, gstack, Ouroboros)는 각 프로젝트의 라이선스와 설치 지침을 따릅니다.
