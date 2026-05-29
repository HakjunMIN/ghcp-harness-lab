# Ouroboros 실습 프롬프트

GHCP 세션에서 차례로 입력합니다. Ouroboros는 `ooo` 네임스페이스의 MCP 도구를 통해 동작합니다.

## Interview

```
ooo interview "오늘 할 일을 자연어로 받아 우선순위를 매겨주는 CLI를 만들고 싶다.
제약은 BRIEF.md를 따르고, 모호한 가정을 모두 노출시켜라."
```

인터뷰가 끝나면 Seed가 생성됩니다. Seed ID를 메모하세요.

## Inspect Seed

```
ooo seed show <seed-id>
```

Seed의 acceptance criteria, ontology, constraints를 사람이 읽고 BRIEF.md와 비교합니다. 어긋나는 부분이 있으면 다시 인터뷰합니다.

## Execute

```
ooo execute --seed <seed-id>
```

Ledger에 모든 액션이 기록됩니다. 충돌 시 Ouroboros가 정책 게이트로 차단합니다.

## Evaluate

```
ooo evaluate --seed <seed-id>
```

3단계 게이트:
1. Mechanical — lint/test
2. Semantic — Seed와의 의미 일치
3. Multi-Model Consensus — 교차 모델 검증

## Evolve

```
ooo evolve --seed <seed-id>
```

평가 결과를 다음 반복의 입력으로 다시 묶습니다. 결과를 RETRO.md에 정리합니다.
