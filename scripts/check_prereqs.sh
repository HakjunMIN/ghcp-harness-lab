#!/usr/bin/env bash
# GHCP Skill Labs - 사전 도구 확인 스크립트
# 외부 도구를 설치하지 않습니다. 존재 여부와 버전만 보고합니다.

set -u

ok=0
warn=0

check() {
  local name="$1"
  local cmd="$2"
  local required="$3"   # required | optional
  if command -v "$cmd" >/dev/null 2>&1; then
    local ver
    ver="$("$cmd" --version 2>&1 | head -n1)"
    printf "  [OK]    %-10s %s\n" "$name" "$ver"
    ok=$((ok+1))
  else
    if [ "$required" = "required" ]; then
      printf "  [MISS]  %-10s (필수)\n" "$name"
    else
      printf "  [SKIP]  %-10s (선택)\n" "$name"
      warn=$((warn+1))
    fi
  fi
}

echo "== Required =="
check git     git     required
check bash    bash    required
check python3 python3 required

echo
echo "== Lab-specific =="
check node    node    optional
check npm     npm     optional
check pipx    pipx    optional
check uv      uv      optional
check gh      gh      optional
check copilot copilot optional
check bun     bun     optional

echo
echo "총 OK: $ok, 선택 누락: $warn"
echo
echo "랩별 실제 요구 도구:"
echo "  - 01-superpowers : copilot CLI"
echo "  - 02-gstack      : git + (선택) claude code, bun"
echo "  - 03-ouroboros   : python3 >= 3.12, pipx 또는 uv, gh, copilot"
