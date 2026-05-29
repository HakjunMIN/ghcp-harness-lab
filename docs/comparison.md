# 세 도구 비교

| 항목 | Superpowers | gstack | Ouroboros |
| --- | --- | --- | --- |
| 만든 사람 | Jesse Vincent (obra) | Garry Tan (YC) | Q00 |
| 핵심 비유 | "스킬 라이브러리" | "전문가 23명 팀" | "Agent OS" |
| 워크플로우 형태 | 자동 트리거 스킬 | 슬래시 커맨드 | `ooo` 명령 + Seed/Ledger |
| 강점 | TDD 강제, 서브에이전트 검토 | 역할별 깊은 리뷰, /qa 브라우저 테스트 | 명세 불변성, replay 가능 |
| GHCP 설치 방식 | 공식 plugin marketplace | git clone (수동 통합) | `ouroboros setup --runtime copilot` |
| 산출물 위치 | 스킬이 작업 디렉터리 안에 직접 기록 | `.claude/`, `CLAUDE.md` | Seed/Ledger 파일 |
| 적합한 작업 | 신규 기능 TDD 구현 | 제품 방향 재정의 + 출시 | 모호한 아이디어 명세화 |

## 언제 무엇을 쓸까

- **요구사항이 흐릿하다** → Ouroboros `ooo interview` 또는 gstack `/office-hours`
- **TDD로 안전하게 구현하고 싶다** → Superpowers `test-driven-development`
- **출시 직전 종합 검토가 필요하다** → gstack `/review` + `/cso` + `/qa`
- **여러 LLM에서 같은 결과를 재현하고 싶다** → Ouroboros Seed + Ledger

## 함께 쓸 수 있는가

가능합니다. 한 저장소에서 다음과 같이 조합하는 것이 자연스럽습니다.

1. Ouroboros로 명세를 잠그고 (Seed 생성)
2. Superpowers로 TDD 구현을 진행하고
3. gstack `/review`, `/cso`, `/qa`로 출시 직전 검토를 수행
