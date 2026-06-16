# React UI Shell and Chat UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a minimal ChatGPT-like React frontend shell with a working send flow that appends user messages.

**Architecture:** Keep the frontend intentionally small: a Vite React app with one stateful `App` component, three presentational shell components, and a tiny API helper module for message types and request stubs. The UI should render a left conversation rail, a main chat timeline, and a bottom composer, while the test focuses on the one behavior that matters for this task: typing a prompt and seeing the user message appear.

**Tech Stack:** React + TypeScript + Vite, Vitest, Testing Library, basic CSS.

---

### Task 1: Create the frontend scaffold

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/tsconfig.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/vite-env.d.ts`

- [ ] **Step 1: Add the Vite app entry files**

Create a minimal React + TypeScript scaffold that can mount `App` and run Vitest in jsdom.

- [ ] **Step 2: Install the dependencies**

Run `npm install` inside `frontend/` so the test command can resolve React, Vite, Testing Library, Vitest, and TypeScript.

- [ ] **Step 3: Verify the scaffold starts cleanly**

Run: `cd frontend && npm run test -- --help`
Expected: Vitest prints its help output without module resolution errors.

### Task 2: Implement the shell and composer flow

**Files:**
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/components/ConversationNav.tsx`
- Create: `frontend/src/components/ChatPanel.tsx`
- Create: `frontend/src/components/Composer.tsx`
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/styles/chatgpt.css`

- [ ] **Step 1: Add the shell components**

Build a three-column shell with a fixed left conversation rail, a scrollable chat panel, and a bottom composer form.

- [ ] **Step 2: Add minimal message state**

Store messages in `App` and append a user message when the composer submits text. Keep the data model to `{ role, content }` only.

- [ ] **Step 3: Add the dark ChatGPT-like styles**

Add baseline layout, colors, spacing, bubbles, and composer treatment so the app reads as a ChatGPT-style shell without adding extra product polish.

### Task 3: Add the interaction test and verify

**Files:**
- Create: `frontend/src/__tests__/App.test.tsx`

- [ ] **Step 1: Write the failing interaction test**

Render `App`, type a prompt into the composer, click send, and assert the user message text appears in the chat panel.

- [ ] **Step 2: Run the focused test**

Run: `cd frontend && npm run test -- App.test.tsx`
Expected: the test passes once the shell and send flow are wired.

- [ ] **Step 3: Commit the frontend task**

Run:

```bash
git add frontend
git commit -m "feat: add chatgpt-style frontend shell" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
