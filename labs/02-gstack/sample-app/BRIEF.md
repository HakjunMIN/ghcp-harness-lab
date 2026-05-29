# BRIEF — "하루 한 줄 회고"

## 한 줄 (의도적으로 모호함)

> "매일 한 줄 회고를 적을 수 있는 웹 페이지가 있으면 좋겠어요."

`/office-hours`가 이 한 줄을 다시 캐묻게 하세요. 무엇을 진짜로 해결하려고 하는지, 더 큰 제품이 숨어 있지 않은지 노출되어야 합니다.

## 알고 있는 제약

- 혼자 쓸 도구입니다. 인증/멀티 유저 없음.
- 로컬에서 정적 파일 서버로 실행되어야 합니다 (`python3 -m http.server`).
- 데이터는 로컬 파일이나 브라우저 `localStorage`에 보관.
- 회고 한 줄에 날짜와 한 단어 감정 태그를 묶고 싶다는 직감.

## 비목표 (초기 가정)

- 모바일 앱, PWA, 푸시 알림.
- 차트나 시각화.
- 백엔드 인증.

`/plan-ceo-review`가 이 비목표 중 일부를 다시 끌어올 수 있습니다. 그 결과는 DESIGN.md에 명시적으로 기록하세요.

## 구현 제약 (어떤 모드에서도 유지)

- 정적 `web/index.html`, `web/styles.css`, `web/main.js`
- (선택) Python 표준 라이브러리만 사용하는 작은 백엔드. 추가 패키지 금지.
- 테스트는 `tests/` 폴더의 `python3 -m unittest`로 실행 가능해야 합니다.

## 완료 정의

- DESIGN.md, PLAN.md, RETRO.md 가 채워짐
- `python3 -m unittest discover -s tests` 통과
- `python3 -m http.server 5173 --directory web` 후 브라우저에서 한 줄 회고 입력/조회 동작
