# GHCP Cheatsheet

이 랩을 진행할 때 자주 쓰는 GitHub Copilot CLI 명령입니다.

## 인증

```bash
gh auth status                  # GitHub 인증 상태 확인
gh auth login                   # 필요 시 로그인 (Ouroboros 랩에서 사용)
```

## 플러그인 마켓플레이스

```bash
copilot plugin marketplace add <owner>/<repo>
copilot plugin marketplace list
copilot plugin install <name>@<marketplace>
copilot plugin list
copilot plugin remove <name>
```

## 세션 진입

```bash
copilot                         # 인터랙티브 세션 시작
copilot --help                  # 옵션 확인
```

## MCP 서버 확인

GHCP MCP 설정은 보통 `~/.copilot/mcp-config.json`에 위치합니다.

```bash
cat ~/.copilot/mcp-config.json 2>/dev/null || echo "MCP config 없음"
```

## 흔한 문제

| 증상 | 해결 |
| --- | --- |
| `copilot: command not found` | `npm i -g @github/copilot-cli` 또는 공식 가이드 참고 |
| `plugin install` 실패 | `gh auth login`으로 재인증 |
| MCP 서버가 보이지 않음 | GHCP 세션을 재시작 |
