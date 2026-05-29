#!/usr/bin/env bash
# 랩 폴더의 필수 파일 무결성을 확인합니다.

set -eu

cd "$(dirname "$0")/.."

required=(
  "labs/01-superpowers/README.md"
  "labs/01-superpowers/install.sh"
  "labs/01-superpowers/prompts.md"
  "labs/01-superpowers/sample-app/BRIEF.md"
  "labs/02-gstack/README.md"
  "labs/02-gstack/install.sh"
  "labs/02-gstack/prompts.md"
  "labs/02-gstack/sample-app/BRIEF.md"
  "labs/03-ouroboros/README.md"
  "labs/03-ouroboros/install.sh"
  "labs/03-ouroboros/prompts.md"
  "labs/03-ouroboros/sample-app/BRIEF.md"
  "docs/sdlc-overview.md"
  "docs/ghcp-cheatsheet.md"
  "docs/comparison.md"
)

missing=0
for f in "${required[@]}"; do
  if [ ! -f "$f" ]; then
    echo "  [MISS] $f"
    missing=$((missing+1))
  else
    echo "  [OK]   $f"
  fi
done

if [ "$missing" -gt 0 ]; then
  echo
  echo "누락된 파일 $missing개"
  exit 1
fi

echo
echo "모든 필수 파일 확인됨."
