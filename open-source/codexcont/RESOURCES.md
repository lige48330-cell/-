# CodexCont Learning Resources

## Knowledge

- [Local source: CodexCont streaming parser](../middleware/sse.py)
  Primary evidence for this course. Use for: how this project turns arbitrary HTTP byte chunks into SSE events.
- [Local source: CodexCont fold state machine](../middleware/proxy.py)
  Primary evidence for this course. Use for: what is forwarded live, buffered, discarded, or committed.
- [Python documentation: Coroutines and Tasks](https://docs.python.org/3/library/asyncio-task.html)
  Official Python reference. Use for: verifying `async def`, `await`, and task/coroutine terminology when a lesson needs language beyond this repository.
- [MDN: Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
  Standards-oriented browser documentation. Use for: SSE event framing and `data:` line concepts.
- [OpenAI developer documentation: Streaming responses](https://developers.openai.com/api/docs/guides/streaming-responses)
  Official upstream context. Use for: checking current Responses streaming semantics; do not infer future API behavior from this repository alone.

## Wisdom (Communities)

- Local evidence first: the project test suite and safely captured, redacted local logs.
  Use for: resolving behavior of this specific middleware before consulting generic advice.

## Gaps

- The external documentation URLs could not be fetched from this workspace during lesson setup because the network requests failed. They are retained as high-trust references, but any version-sensitive API claim must be re-checked before acting on it.
