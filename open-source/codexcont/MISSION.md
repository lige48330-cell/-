# Mission: Safely operate and understand CodexCont

## Why
Learn this local middleware well enough to run it safely, understand what it is doing for each request, and build confidence before making changes. The immediate value is being able to operate the tool without guessing about continuation, streaming, or credentials.

## Success looks like
- Start the local middleware and run its offline test suite without relying on a real upstream API.
- Explain from logs whether a request was passed through, folded, continued, or stopped, and why.
- Safely adjust low-risk continuation settings and verify the result.
- Read the key streaming code paths well enough to make a small, tested maintenance change later.

## Constraints
- The learner knows basic Python but is new to async programming, SSE, streaming proxies, and the Responses API.
- Teach in Chinese, using the actual CodexCont code; explain key functions and branches, not every mechanical line.
- Prefer offline and local experiments; never require credentials or an unknown upstream during learning.

## Out of scope
- Designing a new continuation algorithm or rewriting the SSE state machine now.
- Public/multi-tenant deployment, production operations, and broad OpenAI API training.
