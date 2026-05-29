const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'GitHub Copilot';
pptx.company = 'GitHub Copilot Skill Labs';
pptx.subject = 'GHCP lab development workflows';
pptx.title = 'GHCP 랩별 개발 워크플로우';
pptx.lang = 'ko-KR';
pptx.theme = {
  headFontFace: 'Apple SD Gothic Neo',
  bodyFontFace: 'Apple SD Gothic Neo',
  lang: 'ko-KR',
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.margin = 0;

const W = 13.333;
const H = 7.5;

const colors = {
  ink: '201D1D',
  charcoal: '302C2C',
  body: '424245',
  mute: '646262',
  ash: '9A9898',
  canvas: 'FDFCFC',
  soft: 'F8F7F7',
  card: 'F1EEEE',
  line: 'D8D2D2',
  blue: '007AFF',
  green: '30D158',
  orange: 'FF9F0A',
  red: 'FF3B30',
  violet: '6D5DF6',
  teal: '028090',
  cream: 'FFF7E6',
};

const font = 'Apple SD Gothic Neo';
const mono = 'Menlo';

function addHeader(slide, lab, title, subtitle, accent) {
  slide.background = { color: colors.canvas };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: 0.18,
    fill: { color: accent },
    line: { color: accent },
  });
  slide.addText(lab, {
    x: 0.55,
    y: 0.42,
    w: 1.35,
    h: 0.28,
    margin: 0,
    fontFace: mono,
    fontSize: 9,
    bold: true,
    color: accent,
    charSpacing: 0.7,
  });
  slide.addText(title, {
    x: 0.55,
    y: 0.68,
    w: 9.7,
    h: 0.5,
    margin: 0,
    fontFace: font,
    fontSize: 23,
    bold: true,
    color: colors.ink,
    breakLine: false,
    fit: 'shrink',
  });
  slide.addText(subtitle, {
    x: 0.56,
    y: 1.18,
    w: 9.2,
    h: 0.3,
    margin: 0,
    fontFace: font,
    fontSize: 10.5,
    color: colors.mute,
    fit: 'shrink',
  });
}

function addLabel(slide, text, x, y, w, color) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.28,
    fill: { color },
    line: { color },
  });
  slide.addText(text, {
    x: x + 0.08,
    y: y + 0.058,
    w: w - 0.16,
    h: 0.13,
    margin: 0,
    fontFace: mono,
    fontSize: 7.5,
    bold: true,
    color: colors.canvas,
    fit: 'shrink',
  });
}

function addStepBox(slide, step, title, desc, x, y, w, h, accent, dark = false) {
  const fill = dark ? colors.ink : colors.soft;
  const line = dark ? colors.ink : colors.line;
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: fill },
    line: { color: line, width: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.12,
    h,
    fill: { color: accent },
    line: { color: accent },
  });
  slide.addText(step, {
    x: x + 0.28,
    y: y + 0.2,
    w: 0.45,
    h: 0.22,
    margin: 0,
    fontFace: mono,
    fontSize: 8,
    bold: true,
    color: accent,
  });
  slide.addText(title, {
    x: x + 0.28,
    y: y + 0.45,
    w: w - 0.5,
    h: 0.25,
    margin: 0,
    fontFace: font,
    fontSize: 13,
    bold: true,
    color: dark ? colors.canvas : colors.ink,
    fit: 'shrink',
  });
  slide.addText(desc, {
    x: x + 0.28,
    y: y + 0.8,
    w: w - 0.5,
    h: h - 0.95,
    margin: 0,
    fontFace: font,
    fontSize: 8.8,
    color: dark ? colors.ash : colors.body,
    fit: 'shrink',
    breakLine: false,
  });
}

function addArrow(slide, x1, y1, x2, y2, color) {
  slide.addShape(pptx.ShapeType.line, {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    line: { color, width: 1.6, beginArrowType: 'none', endArrowType: 'triangle' },
  });
}

function addTerminal(slide, x, y, w, h, title, lines, accent) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: colors.ink },
    line: { color: colors.ink },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.42,
    fill: { color: colors.charcoal },
    line: { color: colors.charcoal },
  });
  slide.addText(title, {
    x: x + 0.24,
    y: y + 0.13,
    w: w - 0.48,
    h: 0.15,
    margin: 0,
    fontFace: mono,
    fontSize: 7.5,
    bold: true,
    color: colors.canvas,
  });
  slide.addText(lines.join('\n'), {
    x: x + 0.28,
    y: y + 0.62,
    w: w - 0.56,
    h: h - 0.85,
    margin: 0,
    fontFace: mono,
    fontSize: 9,
    color: colors.canvas,
    breakLine: false,
    fit: 'shrink',
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: x + 0.28,
    y: y + h - 0.45,
    w: w - 0.56,
    h: 0.06,
    fill: { color: accent },
    line: { color: accent },
  });
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.55,
    y: 7.05,
    w: 7.4,
    h: 0.18,
    margin: 0,
    fontFace: mono,
    fontSize: 7.5,
    color: colors.ash,
  });
}

function superpowersSlide() {
  const accent = colors.blue;
  const slide = pptx.addSlide();
  addHeader(slide, 'LAB 01 / SUPERPOWERS', '자동 트리거 스킬로 TDD 구현 루프 만들기', 'brainstorming → writing-plans → subagent-driven-development → test-driven-development → review', accent);

  addTerminal(slide, 0.55, 1.75, 3.05, 4.55, 'install + session', [
    '$ copilot plugin marketplace add',
    '  obra/superpowers-marketplace',
    '$ copilot plugin install superpowers',
    '',
    '$ cd labs/01-superpowers/sample-app',
    '$ copilot',
    '',
    'BRIEF.md  -> mdtodo CLI',
    'AGENTS.md -> GHCP context',
  ], accent);

  addLabel(slide, 'DEVELOPMENT WORKFLOW', 4.1, 1.75, 2.05, accent);
  const boxes = [
    ['01', 'Brief', 'BRIEF.md에서 mdtodo의 목표와 비목표를 고정', 4.1, 2.18],
    ['02', 'Brainstorm', '질문을 통해 DESIGN.md로 요구사항과 설계를 정리', 6.05, 2.18],
    ['03', 'Plan', '2-5분 단위 태스크와 검증 명령을 PLAN.md에 작성', 8.0, 2.18],
    ['04', 'Subagents', '태스크별 서브에이전트가 구현을 나누어 실행', 8.0, 4.2],
    ['05', 'TDD', '실패 테스트 → 최소 구현 → 리팩터 순서를 유지', 6.05, 4.2],
    ['06', 'Review', 'PLAN.md 기준 코드 리뷰 후 RETRO.md로 마감', 4.1, 4.2],
  ];
  boxes.forEach((box, index) => addStepBox(slide, box[0], box[1], box[2], box[3], box[4], 1.62, 1.35, accent, index === 4));
  addArrow(slide, 5.72, 2.86, 6.0, 2.86, accent);
  addArrow(slide, 7.67, 2.86, 7.95, 2.86, accent);
  addArrow(slide, 8.81, 3.58, 8.81, 4.15, accent);
  addArrow(slide, 7.98, 4.88, 7.72, 4.88, accent);
  addArrow(slide, 6.02, 4.88, 5.75, 4.88, accent);

  slide.addShape(pptx.ShapeType.rect, {
    x: 10.1,
    y: 1.75,
    w: 2.65,
    h: 4.55,
    fill: { color: colors.soft },
    line: { color: colors.line, width: 1 },
  });
  addLabel(slide, 'OUTPUTS', 10.32, 2.05, 1.08, accent);
  const outputs = [
    ['DESIGN.md', '검증 가능한 CLI 설계'],
    ['PLAN.md', '작은 태스크와 명령'],
    ['tests/', 'RED/GREEN 증거'],
    ['RETRO.md', '학습과 다음 액션'],
  ];
  outputs.forEach(([name, desc], i) => {
    const yy = 2.55 + i * 0.72;
    slide.addText(name, { x: 10.35, y: yy, w: 1.0, h: 0.18, margin: 0, fontFace: mono, fontSize: 8.5, bold: true, color: colors.ink });
    slide.addText(desc, { x: 11.42, y: yy, w: 1.05, h: 0.18, margin: 0, fontFace: font, fontSize: 8.2, color: colors.body, fit: 'shrink' });
  });
  slide.addText('검증 명령', { x: 10.35, y: 5.58, w: 0.75, h: 0.18, margin: 0, fontFace: font, fontSize: 8.5, bold: true, color: colors.ink });
  slide.addText('python3 -m unittest discover -s tests -v', { x: 10.35, y: 5.83, w: 2.05, h: 0.2, margin: 0, fontFace: mono, fontSize: 7.2, color: accent, fit: 'shrink' });
  addFooter(slide, 'source: labs/01-superpowers/README.md + prompts.md');
}

function gstackSlide() {
  const accent = colors.orange;
  const slide = pptx.addSlide();
  addHeader(slide, 'LAB 02 / GSTACK', '전문가 역할 체인으로 모호한 기능을 출시 단위로 좁히기', '/office-hours → /plan-ceo-review → /plan-eng-review → /autoplan → /review → /qa → /retro', accent);

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55,
    y: 1.75,
    w: 3.05,
    h: 4.55,
    fill: { color: colors.ink },
    line: { color: colors.ink },
  });
  slide.addText('GHCP 어댑테이션', { x: 0.82, y: 2.03, w: 2.4, h: 0.25, margin: 0, fontFace: font, fontSize: 15, bold: true, color: colors.canvas });
  slide.addText('Claude Code용 슬래시 커맨드를 GHCP에서 마크다운 스킬 컨텍스트로 읽는다.', { x: 0.82, y: 2.43, w: 2.38, h: 0.72, margin: 0, fontFace: font, fontSize: 9.3, color: colors.ash, breakLine: false, fit: 'shrink' });
  slide.addText(['~/.gstack', 'sample-app/.gstack/skills', 'AGENTS.md 규칙'].join('\n'), { x: 0.82, y: 3.42, w: 2.2, h: 0.68, margin: 0, fontFace: mono, fontSize: 9.2, color: colors.canvas, breakLine: false });
  slide.addShape(pptx.ShapeType.rect, { x: 0.82, y: 4.42, w: 2.2, h: 0.04, fill: { color: accent }, line: { color: accent } });
  slide.addText('샘플 앱', { x: 0.82, y: 4.82, w: 0.65, h: 0.18, margin: 0, fontFace: font, fontSize: 8.5, bold: true, color: colors.canvas });
  slide.addText('하루 한 줄 회고 웹 페이지', { x: 0.82, y: 5.12, w: 1.9, h: 0.2, margin: 0, fontFace: font, fontSize: 10.5, color: colors.canvas });

  addLabel(slide, 'ROLE REVIEW PIPELINE', 4.1, 1.75, 2.0, accent);
  const stages = [
    ['01', 'Office Hours', '6개 forcing questions로 실제 사용자 통증을 찾음', 4.1, 2.18, colors.soft],
    ['02', 'CEO Review', 'Expansion / Hold Scope / Reduction 중 방향 선택', 6.05, 2.18, colors.cream],
    ['03', 'Eng Review', '데이터 흐름, 상태 머신, 테스트 매트릭스 작성', 8.0, 2.18, colors.soft],
    ['04', 'Autoplan', 'PLAN.md를 구현 가능한 단계로 쪼개 실행', 4.1, 4.25, colors.soft],
    ['05', 'Review + QA', 'Staff Engineer 리뷰와 브라우저 QA로 문제 수정', 6.05, 4.25, colors.cream],
    ['06', 'Retro', 'what shipped / slipped / next iteration 기록', 8.0, 4.25, colors.soft],
  ];
  stages.forEach(([step, title, desc, x, y, fill], index) => {
    slide.addShape(pptx.ShapeType.rect, { x, y, w: 1.62, h: 1.42, fill: { color: fill }, line: { color: colors.line, width: 1 } });
    slide.addText(step, { x: x + 0.22, y: y + 0.18, w: 0.42, h: 0.18, margin: 0, fontFace: mono, fontSize: 8, bold: true, color: accent });
    slide.addText(title, { x: x + 0.22, y: y + 0.45, w: 1.18, h: 0.22, margin: 0, fontFace: font, fontSize: 12, bold: true, color: colors.ink, fit: 'shrink' });
    slide.addText(desc, { x: x + 0.22, y: y + 0.78, w: 1.2, h: 0.42, margin: 0, fontFace: font, fontSize: 8.2, color: colors.body, fit: 'shrink' });
    if (index === 2) addArrow(slide, 8.8, 3.6, 4.9, 4.25, accent);
  });
  addArrow(slide, 5.72, 2.9, 6.0, 2.9, accent);
  addArrow(slide, 7.67, 2.9, 7.95, 2.9, accent);
  addArrow(slide, 5.72, 4.96, 6.0, 4.96, accent);
  addArrow(slide, 7.67, 4.96, 7.95, 4.96, accent);

  slide.addShape(pptx.ShapeType.rect, { x: 10.1, y: 1.75, w: 2.65, h: 4.55, fill: { color: colors.soft }, line: { color: colors.line, width: 1 } });
  addLabel(slide, 'CHECKPOINTS', 10.32, 2.05, 1.33, accent);
  const checks = [
    ['DESIGN.md', '통증과 wedge'],
    ['PLAN.md', '상태/오류/테스트'],
    ['web/', '정적 HTML/CSS/JS'],
    ['tests/', '백엔드/동작 검증'],
  ];
  checks.forEach(([name, desc], i) => {
    const yy = 2.55 + i * 0.7;
    slide.addText(name, { x: 10.35, y: yy, w: 0.85, h: 0.18, margin: 0, fontFace: mono, fontSize: 8.5, bold: true, color: colors.ink });
    slide.addText(desc, { x: 11.28, y: yy, w: 1.15, h: 0.18, margin: 0, fontFace: font, fontSize: 8.2, color: colors.body, fit: 'shrink' });
  });
  slide.addText('브라우저 QA', { x: 10.35, y: 5.52, w: 0.85, h: 0.18, margin: 0, fontFace: font, fontSize: 8.5, bold: true, color: colors.ink });
  slide.addText('python3 -m http.server 5173 --directory web', { x: 10.35, y: 5.78, w: 2.05, h: 0.22, margin: 0, fontFace: mono, fontSize: 7, color: accent, fit: 'shrink' });
  addFooter(slide, 'source: labs/02-gstack/README.md + prompts.md');
}

function ouroborosSlide() {
  const accent = colors.teal;
  const slide = pptx.addSlide();
  addHeader(slide, 'LAB 03 / OUROBOROS', 'Seed 명세 중심의 실행·평가 루프', 'ooo interview → seed show → execute → evaluate → evolve', accent);

  slide.addShape(pptx.ShapeType.rect, { x: 0.55, y: 1.75, w: 3.05, h: 4.55, fill: { color: colors.soft }, line: { color: colors.line, width: 1 } });
  addLabel(slide, 'RUNTIME SETUP', 0.82, 2.05, 1.35, accent);
  slide.addText(['gh auth login', 'pipx install ouroboros-ai[mcp]', 'ouroboros setup --runtime copilot', 'GHCP 세션 재시작'].join('\n'), {
    x: 0.82,
    y: 2.56,
    w: 2.25,
    h: 1.35,
    margin: 0,
    fontFace: mono,
    fontSize: 8.2,
    color: colors.ink,
    fit: 'shrink',
  });
  slide.addShape(pptx.ShapeType.rect, { x: 0.82, y: 4.2, w: 2.2, h: 0.04, fill: { color: accent }, line: { color: accent } });
  slide.addText('샘플 앱', { x: 0.82, y: 4.6, w: 0.65, h: 0.18, margin: 0, fontFace: font, fontSize: 8.5, bold: true, color: colors.ink });
  slide.addText('자연어 우선순위 CLI npri', { x: 0.82, y: 4.92, w: 1.8, h: 0.22, margin: 0, fontFace: font, fontSize: 10.5, bold: true, color: colors.ink });
  slide.addText('모호한 아이디어를 먼저 Seed로 고정한 뒤 구현한다.', { x: 0.82, y: 5.28, w: 2.25, h: 0.42, margin: 0, fontFace: font, fontSize: 8.7, color: colors.body, fit: 'shrink' });

  slide.addShape(pptx.ShapeType.ellipse, { x: 5.55, y: 2.18, w: 2.2, h: 2.2, fill: { color: colors.ink }, line: { color: colors.ink } });
  slide.addText('SEED', { x: 6.05, y: 2.78, w: 1.2, h: 0.28, margin: 0, fontFace: mono, fontSize: 21, bold: true, color: colors.canvas, align: 'center' });
  slide.addText('acceptance criteria\nontology\nconstraints', { x: 5.96, y: 3.23, w: 1.38, h: 0.5, margin: 0, fontFace: mono, fontSize: 7.8, color: colors.ash, align: 'center', fit: 'shrink' });

  const nodes = [
    ['01', 'Interview', '숨은 가정 노출', 4.05, 1.8],
    ['02', 'Inspect', 'Seed ID 확인', 8.15, 1.8],
    ['03', 'Execute', 'Ledger에 액션 기록', 8.15, 4.62],
    ['04', 'Evaluate', '3단계 게이트 통과', 5.57, 5.05],
    ['05', 'Evolve', '다음 반복 입력 생성', 4.05, 4.62],
  ];
  nodes.forEach(([step, title, desc, x, y]) => addStepBox(slide, step, title, desc, x, y, 1.45, 1.05, accent, false));
  addArrow(slide, 5.5, 2.32, 5.62, 2.7, accent);
  addArrow(slide, 7.72, 2.7, 8.12, 2.32, accent);
  addArrow(slide, 8.85, 2.86, 8.85, 4.58, accent);
  addArrow(slide, 8.12, 5.08, 7.05, 5.38, accent);
  addArrow(slide, 5.55, 5.38, 5.47, 5.08, accent);
  addArrow(slide, 4.75, 4.62, 5.55, 3.85, accent);

  slide.addShape(pptx.ShapeType.rect, { x: 10.1, y: 1.75, w: 2.65, h: 4.55, fill: { color: colors.ink }, line: { color: colors.ink } });
  addLabel(slide, 'EVALUATION GATE', 10.32, 2.05, 1.72, accent);
  const gates = [
    ['1', 'Mechanical', 'lint/test'],
    ['2', 'Semantic', 'Seed 대비 의미 일치'],
    ['3', 'Consensus', '교차 모델 검증'],
  ];
  gates.forEach(([num, name, desc], i) => {
    const yy = 2.65 + i * 0.82;
    slide.addShape(pptx.ShapeType.ellipse, { x: 10.35, y: yy - 0.06, w: 0.34, h: 0.34, fill: { color: accent }, line: { color: accent } });
    slide.addText(num, { x: 10.45, y: yy + 0.015, w: 0.14, h: 0.12, margin: 0, fontFace: mono, fontSize: 7.2, bold: true, color: colors.canvas, align: 'center' });
    slide.addText(name, { x: 10.85, y: yy, w: 0.9, h: 0.18, margin: 0, fontFace: font, fontSize: 10.5, bold: true, color: colors.canvas });
    slide.addText(desc, { x: 10.85, y: yy + 0.28, w: 1.3, h: 0.18, margin: 0, fontFace: font, fontSize: 8.2, color: colors.ash, fit: 'shrink' });
  });
  slide.addShape(pptx.ShapeType.rect, { x: 10.35, y: 5.45, w: 1.94, h: 0.04, fill: { color: accent }, line: { color: accent } });
  slide.addText('ooo evolve --seed <id>', { x: 10.35, y: 5.78, w: 1.95, h: 0.2, margin: 0, fontFace: mono, fontSize: 8, color: colors.canvas, fit: 'shrink' });
  addFooter(slide, 'source: labs/03-ouroboros/README.md + prompts.md');
}

superpowersSlide();
gstackSlide();
ouroborosSlide();

pptx.writeFile({ fileName: 'docs/ghcp-lab-workflows.pptx' });