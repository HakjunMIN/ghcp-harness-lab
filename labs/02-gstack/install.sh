#!/usr/bin/env bash
# Lab 02 - gstack 어댑테이션 설치 스크립트
#
# gstack은 본래 Claude Code용입니다. 이 스크립트는:
#   1) gstack을 ~/.gstack 에 얕게 클론
#   2) 스킬 마크다운을 샘플 앱의 .gstack/skills 로 심볼릭 링크
# 만 수행합니다. Claude Code 설치 디렉토리는 건드리지 않습니다.

set -euo pipefail

cd "$(dirname "$0")"
LAB_DIR="$(pwd)"
APP_DIR="$LAB_DIR/sample-app"
GSTACK_DIR="$HOME/.gstack"

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git이 필요합니다."
  exit 1
fi

if [ ! -d "$GSTACK_DIR" ]; then
  echo ">> git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git $GSTACK_DIR"
  git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git "$GSTACK_DIR"
else
  echo ">> $GSTACK_DIR 가 이미 존재. git fetch로 최신화"
  (cd "$GSTACK_DIR" && git fetch --depth 1 origin && git reset --hard origin/HEAD)
fi

mkdir -p "$APP_DIR/.gstack"

# 스킬 디렉토리는 저장소 구조에 따라 'skills' 또는 'commands'에 위치할 수 있습니다.
SKILLS_SRC=""
for candidate in skills commands; do
  if [ -d "$GSTACK_DIR/$candidate" ]; then
    SKILLS_SRC="$GSTACK_DIR/$candidate"
    break
  fi
done

if [ -z "$SKILLS_SRC" ]; then
  echo "Warning: gstack 저장소에서 skills/ 또는 commands/ 디렉토리를 찾지 못했습니다."
  echo "         저장소 구조를 직접 확인하세요: $GSTACK_DIR"
else
  ln -sfn "$SKILLS_SRC" "$APP_DIR/.gstack/skills"
  echo ">> 심볼릭 링크 생성: $APP_DIR/.gstack/skills -> $SKILLS_SRC"
fi

if ! grep -q "gstack" "$APP_DIR/AGENTS.md" 2>/dev/null; then
  echo "Warning: $APP_DIR/AGENTS.md 에 gstack 섹션이 없습니다. 랩 README를 따라 추가하세요."
fi

echo
echo "gstack 어댑테이션 준비 완료. 샘플 앱에서 copilot 세션을 시작하세요:"
echo "  cd $APP_DIR && copilot"
