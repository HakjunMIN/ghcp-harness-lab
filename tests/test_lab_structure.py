"""랩 폴더 구조 단위 테스트.

이 테스트는 외부 도구 설치를 검증하지 않습니다. 다음만 검증합니다.
- 각 랩의 필수 파일 존재
- README/BRIEF 내용에 핵심 키워드 포함
- install.sh 스크립트가 실행 가능 권한을 가짐
- install.sh가 해당 도구의 공식 설치 명령을 포함
"""
import os
import stat
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LABS = {
    "01-superpowers": {
        "tool_name": "Superpowers",
        "install_must_contain": [
            "copilot plugin marketplace add obra/superpowers-marketplace",
            "copilot plugin install superpowers@superpowers-marketplace",
        ],
        "readme_must_contain": ["brainstorming", "writing-plans", "test-driven-development"],
    },
    "02-gstack": {
        "tool_name": "gstack",
        "install_must_contain": [
            "github.com/garrytan/gstack.git",
        ],
        "readme_must_contain": ["/office-hours", "/plan-ceo-review", "/review", "/qa"],
    },
    "03-ouroboros": {
        "tool_name": "Ouroboros",
        "install_must_contain": [
            "ouroboros-ai[mcp]",
            "ouroboros setup --runtime copilot",
        ],
        "readme_must_contain": ["ooo interview", "Seed", "evaluation"],
    },
}

REQUIRED_FILES = [
    "README.md",
    "install.sh",
    "prompts.md",
    "sample-app/BRIEF.md",
    "sample-app/AGENTS.md",
]

SHARED_DOCS = [
    "README.md",
    "Makefile",
    "docs/sdlc-overview.md",
    "docs/ghcp-cheatsheet.md",
    "docs/comparison.md",
    "scripts/check_prereqs.sh",
    "scripts/verify_labs.sh",
]


class SharedStructureTest(unittest.TestCase):
    def test_shared_docs_exist(self):
        for rel in SHARED_DOCS:
            with self.subTest(file=rel):
                self.assertTrue((ROOT / rel).is_file(), f"missing {rel}")

    def test_root_readme_lists_three_labs(self):
        text = (ROOT / "README.md").read_text(encoding="utf-8")
        for name in ("Superpowers", "gstack", "Ouroboros"):
            with self.subTest(name=name):
                self.assertIn(name, text)

    def test_scripts_executable(self):
        for rel in ("scripts/check_prereqs.sh", "scripts/verify_labs.sh"):
            path = ROOT / rel
            mode = path.stat().st_mode
            self.assertTrue(mode & stat.S_IXUSR, f"{rel} not executable")


class LabStructureTest(unittest.TestCase):
    def test_each_lab_has_required_files(self):
        for lab in LABS:
            lab_dir = ROOT / "labs" / lab
            for rel in REQUIRED_FILES:
                with self.subTest(lab=lab, file=rel):
                    self.assertTrue(
                        (lab_dir / rel).is_file(),
                        f"missing {lab}/{rel}",
                    )

    def test_install_scripts_executable(self):
        for lab in LABS:
            path = ROOT / "labs" / lab / "install.sh"
            mode = path.stat().st_mode
            self.assertTrue(mode & stat.S_IXUSR, f"{lab}/install.sh not executable")

    def test_install_scripts_contain_official_commands(self):
        for lab, spec in LABS.items():
            content = (ROOT / "labs" / lab / "install.sh").read_text(encoding="utf-8")
            for fragment in spec["install_must_contain"]:
                with self.subTest(lab=lab, fragment=fragment):
                    self.assertIn(fragment, content)

    def test_lab_readme_contains_key_concepts(self):
        for lab, spec in LABS.items():
            content = (ROOT / "labs" / lab / "README.md").read_text(encoding="utf-8")
            self.assertIn(spec["tool_name"], content)
            for keyword in spec["readme_must_contain"]:
                with self.subTest(lab=lab, keyword=keyword):
                    self.assertIn(keyword, content)

    def test_lab_readme_uses_sdlc_phases(self):
        sdlc_phases = ["Prereq", "Install", "Configure", "Brief", "Design",
                       "Implement", "Verify"]
        for lab in LABS:
            content = (ROOT / "labs" / lab / "README.md").read_text(encoding="utf-8")
            for phase in sdlc_phases:
                with self.subTest(lab=lab, phase=phase):
                    self.assertIn(phase, content)

    def test_brief_has_completion_definition(self):
        for lab in LABS:
            content = (ROOT / "labs" / lab / "sample-app" / "BRIEF.md").read_text(encoding="utf-8")
            with self.subTest(lab=lab):
                self.assertIn("완료 정의", content)


if __name__ == "__main__":
    unittest.main()
