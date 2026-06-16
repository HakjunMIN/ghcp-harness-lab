# ChatGPT-style MVP Retrospective

## What Worked Well

- **Clear component boundaries:** Separating API layer, repository, and agent service made testing straightforward.
- **SSE-first design:** Streaming architecture forced early thinking about state management on both frontend and backend.
- **Test-driven approach:** Writing integration tests before persistence logic revealed edge cases early (missing message storage).
- **FastAPI + Pydantic:** Strong validation caught API contract issues immediately.

## Hard Parts / Challenges

- **Streaming lifecycle:** Coordinating when to persist user input vs. assistant output during SSE response required careful placement of side effects.
- **Agent Framework integration seam:** The `AgentService.stream_reply()` interface needed to be simple enough to mock in tests while remaining compatible with real Azure OpenAI calls.
- **SQLite in tests:** Ensuring database state isolation between test runs required fixture setup with temporary databases.
- **Frontend testing:** React state updates and async API calls required careful use of `waitFor` and test utilities to avoid flaky tests.

## Key Decisions

1. **Optional conversation_id in stream request:** Allows both new-conversation and existing-conversation flows without API versioning.
2. **Repository + Service separation:** Makes it easy to replace Agent Framework implementation later without touching API tests.
3. **Stubbed agent responses:** `AgentService` returns fixed tokens for MVP; swaps to real Azure OpenAI in production.

## Next Steps Beyond MVP

1. **Replace stubbed agent:** Wire Microsoft Agent Framework + Azure OpenAI SDK with proper configuration.
2. **Real API integration:** Implement actual HTTP calls in frontend; currently stubbed for testing.
3. **Auth + multi-user:** Add Microsoft Entra ID authentication and per-user conversation isolation.
4. **Error handling paths:** SSE `error` events and graceful stream interruption for network failures.
5. **UI polish:** Keyboard navigation, auto-scroll behavior, loading states, retry UI for failed submissions.
6. **Deployment:** Container packaging, environment configuration, and cloud deployment (e.g., Azure App Service).
