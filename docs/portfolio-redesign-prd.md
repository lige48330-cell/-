# Portfolio Redesign PRD

## Problem Statement

The current portfolio promotes projects that are not the author's original work. It also mixes work of different evidentiary strength without a clear selection policy. The site needs to present only original work, make project maturity honest, and avoid publishing source repositories or personal contact details.

## Solution

Rebuild the static GitHub Pages portfolio around the positioning: "把业务流程、物联网设备与 AI 工程实践，落成可验证的软件系统。"

The homepage will show three primary cases and two secondary original projects. Each case will use an explicit evidence label, describe only verified capabilities, and omit source links. Content and assets for excluded non-original projects will be removed. The source worktree will be verified before identical site changes are synchronized to the `gh-pages` worktree.

## User Stories

1. As a prospective client, I want to understand the author's core capability in one sentence, so that I can quickly decide whether the portfolio is relevant.
2. As a prospective client, I want to see only original work, so that I can trust authorship claims.
3. As a prospective client, I want the strongest work presented first, so that I can evaluate delivery capability efficiently.
4. As a prospective client, I want ESP32 IoT work explained as a three-end system, so that I can understand the firmware, platform, and mini-program integration.
5. As a prospective client, I want the AI Supervisor case to state its verified and unverified boundaries, so that experimental tooling is not presented as a finished product.
6. As a prospective client, I want the aquaculture application described as a runnable full-stack prototype, so that I do not mistake it for a production deployment.
7. As a visitor, I want secondary original projects clearly distinguished from primary cases, so that I can see breadth without confusing evidence levels.
8. As a visitor, I want diagrams clearly labelled as architecture or process illustrations, so that I do not mistake them for runtime screenshots.
9. As the author, I want no source repository links on project pages, so that code disclosure remains under my control.
10. As the author, I want no phone, email, WeChat, or other personal contact information published, so that contact details remain private.
11. As the author, I want the published GitHub Pages worktree to match the verified source worktree, so that the live site does not drift from the reviewed version.
12. As a maintainer, I want deterministic verification to fail when removed project references or broken links reappear, so that the selection policy remains enforceable.

## Implementation Decisions

- Keep the portfolio as a static GitHub Pages site; do not add a backend, CMS, or client-side data source.
- Use the approved headline: "把业务流程、物联网设备与 AI 工程实践，落成可验证的软件系统。"
- Present three primary cases: ESP32 IoT platform, AI Supervisor, and the aquaculture H5/mini-program/backend prototype.
- Present two secondary original projects: AI Agent programming learning platform as "在研 / 待补证据", and the developer-profile mini program as "个人服务入口".
- Classify the aquaculture application as "可运行全栈原型" and do not claim production launch or real-world operation.
- Preserve the existing honest boundary for the ESP32 and AI Supervisor cases; do not upgrade their evidence claims without new proof.
- Remove all excluded non-original project references, pages, sitemap entries, and media from the public site.
- Retain verified ESP32 screenshots and clearly labelled diagrams. Do not present diagrams as operating screenshots. Use labelled architecture/process illustrations for AI Supervisor and aquaculture until real screenshots are supplied.
- Do not add source links, personal contacts, phone numbers, email addresses, WeChat IDs, or QR codes. The contact section will state that demonstrations and materials are available on request.
- Update the source worktree first, run deterministic verification, then synchronize the resulting static site changes to the `gh-pages` worktree.

## Testing Decisions

- Test public behaviour and published-site integrity rather than internal implementation details.
- Extend the existing deterministic verifier to check the approved positioning, the five selected projects, required public pages, and valid GitHub Pages paths.
- The verifier must fail if excluded non-original project references remain in public pages, sitemap entries, or required assets.
- Verify that all internal links and asset paths resolve beneath the `/-/` GitHub Pages base path.
- Run `node scripts/verify-site.js` in the source worktree before synchronization and again in the `gh-pages` worktree afterward.
- Perform a local preview check using the existing static preview server.

## Out of Scope

- Publishing source code or repository links.
- Adding personal contact information.
- Claiming production deployment, customer usage, or completed integration without evidence.
- Rebuilding the site with a framework, CMS, or backend.
- Adding projects not confirmed as original work.
- Publishing the PRD to GitHub Issues until GitHub CLI or API authentication is available on this machine.

## Further Notes

The GitHub Issues workflow is configured locally and this PRD is ready to publish with the `ready-for-agent` label once authentication is available.
