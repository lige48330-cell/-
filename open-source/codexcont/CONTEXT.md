# CodexCont

CodexCont is a single-user, local middleware context. It mediates one developer's Responses API traffic and selectively continues interrupted reasoning.

## Language

**Local Operator**:
The single developer who runs CodexCont on their own machine and controls its configuration and credentials.
_Avoid_: Tenant, end user, customer

**Local Middleware**:
The loopback-only CodexCont process used by the Local Operator between an agent client and an upstream Responses API.
_Avoid_: Shared proxy, gateway, hosted service

**Conservative Continuation**:
The Local Middleware automatically requests another reasoning round only after a recognized interruption signal, within defined round and token limits; uncertainty or processing failure ends continuation rather than retrying.
_Avoid_: Aggressive continuation, unconditional continuation
