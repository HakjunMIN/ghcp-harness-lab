#!/usr/bin/env bash
# Lab 01 - Superpowers GHCP 설치 스크립트
#
# 공식 설치 절차(README.md 참조):
#   1) marketplace 등록
#   2) plugin 설치
#   3) 설치 확인
#
# 실행 전 내용을 읽어보세요.

set -euo pipefail

if ! command -v copilot >/dev/null 2>&1; then
  echo "Error: copilot CLI가 설치되어 있지 않습니다."
  echo "GitHub Copilot CLI를 먼저 설치하세요."
  exit 1
fi

echo ">> copilot plugin marketplace add obra/superpowers-marketplace"
copilot plugin marketplace add obra/superpowers-marketplace

echo ">> copilot plugin install superpowers@superpowers-marketplace"
copilot plugin install superpowers@superpowers-marketplace

echo ">> copilot plugin list"
copilot plugin list

echo
echo "Superpowers 설치 완료. 샘플 앱 폴더에서 copilot 세션을 시작하세요:"
echo "  cd labs/01-superpowers/sample-app && copilot"
