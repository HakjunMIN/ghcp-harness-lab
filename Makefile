.PHONY: help prereqs test verify clean

help:
	@echo "GHCP Skill Labs"
	@echo ""
	@echo "  make prereqs   - 사전 도구(node, python3, gh, copilot 등) 확인"
	@echo "  make test      - 랩 구조 단위 테스트 (python3 -m unittest)"
	@echo "  make verify    - 랩 파일 무결성 셸 스크립트 검증"
	@echo "  make clean     - 샘플 앱이 생성한 가상환경, node_modules 정리"
	@echo ""
	@echo "각 랩을 진행하려면 labs/<번호>-<이름>/README.md 를 따라가세요."

prereqs:
	@bash scripts/check_prereqs.sh

test:
	@python3 -m unittest discover -s tests -v

verify:
	@bash scripts/verify_labs.sh

clean:
	@find labs -type d \( -name node_modules -o -name .venv -o -name __pycache__ \) -prune -exec rm -rf {} +
	@echo "Cleaned generated artifacts."
