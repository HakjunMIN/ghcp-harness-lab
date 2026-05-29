# BRIEF — mdtodo

## 한 문장

마크다운 체크박스 형식의 할 일 파일을 관리하는 작은 Python CLI.

## 사용자 시나리오

```
$ mdtodo add "랩 02 진행"
Added #3: 랩 02 진행

$ mdtodo list
- [ ] 1. 랩 01 README 읽기
- [ ] 2. Superpowers 설치
- [ ] 3. 랩 02 진행

$ mdtodo done 2
Done: 랩 02 진행 의 이전 #2

$ mdtodo list
- [ ] 1. 랩 01 README 읽기
- [ ] 2. 랩 02 진행
```

## 요구사항

- 파일 경로: 환경변수 `MDTODO_FILE` 또는 기본값 `./tasks.md`
- 항목은 `- [ ] 텍스트` 또는 `- [x] 텍스트` 형식
- `add` 는 파일 끝에 항목을 추가
- `done <N>` 은 미완료 항목 중 N번째를 완료로 표시
- `list` 는 미완료 항목을 1부터 다시 매겨 출력
- 잘못된 N에는 stderr로 메시지, 종료코드 1

## 비목표

- 마감일, 우선순위
- 원격 동기화
- TUI

## 구현 제약

- Python 3.10+ 표준 라이브러리만 사용
- 단일 모듈 `mdtodo.py` + 진입점 `python3 -m mdtodo ...`
- 테스트는 `tests/test_mdtodo.py`에 작성하고 `python3 -m unittest discover -s tests`로 실행

## 완료 정의

- 위 모든 시나리오가 통과하는 단위 테스트 존재
- README 짧게(<= 30줄) 작성
- DESIGN.md, PLAN.md, RETRO.md 가 모두 채워짐
