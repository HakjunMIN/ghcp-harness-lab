#!/usr/bin/env bash
# Lab 03 - Ouroboros GHCP runtime 설치 스크립트
#
# 공식 절차(README.md 참조):
#   1) pipx install 'ouroboros-ai[mcp]'   (또는 uv tool install)
#   2) ouroboros setup --runtime copilot
#   3) 버전 확인
#
# 사전: gh auth login (live model discovery에 사용)

set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI가 필요합니다."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: gh 인증되지 않음. 'gh auth login' 먼저 실행하세요."
  exit 1
fi

PY_VER=$(python3 -c 'import sys; print("%d.%d" % sys.version_info[:2])')
PY_MAJOR=${PY_VER%.*}
PY_MINOR=${PY_VER#*.}
if [ "$PY_MAJOR" -lt 3 ] || { [ "$PY_MAJOR" -eq 3 ] && [ "$PY_MINOR" -lt 12 ]; }; then
  echo "Error: Python >= 3.12 가 필요합니다. 현재: $PY_VER"
  exit 1
fi

if command -v pipx >/dev/null 2>&1; then
  echo ">> pipx install 'ouroboros-ai[mcp]'"
  pipx install 'ouroboros-ai[mcp]'
elif command -v uv >/dev/null 2>&1; then
  echo ">> uv tool install 'ouroboros-ai[mcp]'"
  uv tool install 'ouroboros-ai[mcp]'
else
  echo "Error: pipx 또는 uv 중 하나가 필요합니다."
  echo "  brew install pipx  # 또는"
  echo "  brew install uv"
  exit 1
fi

echo ">> ouroboros setup --runtime copilot"
ouroboros setup --runtime copilot

echo ">> ouroboros --version"
ouroboros --version

echo
echo "MCP 등록 확인:"
if [ -f "$HOME/.copilot/mcp-config.json" ]; then
  python3 -m json.tool < "$HOME/.copilot/mcp-config.json" | head -n 20
else
  echo "  ~/.copilot/mcp-config.json 가 아직 없습니다. GHCP를 한 번 실행해 생성될 수 있습니다."
fi

echo
echo "Ouroboros 설치 완료. GHCP 세션을 재시작한 뒤 샘플 앱 폴더에서 시작하세요:"
echo "  cd labs/03-ouroboros/sample-app && copilot"
