# Portfolio Capability Site Design

Date: 2026-07-05

## Goal

Rebuild the GitHub Pages site for `lige48330-cell/-` into a maintainable portfolio that shows the user's ability to turn business workflows, device data, and AI-assisted delivery into verifiable digital systems.

## Positioning

The site should not present the user as a generic "AI/full-stack/low-code" generalist. It should present a sharper profile:

> I turn field workflows, device data, and delivery constraints into modules, fields, forms, states, APIs, dashboards, and validation checklists, then use low-code, IoT backends, and AI agents to push the work toward delivery.

## Audience

- Employers or collaborators looking for ERP, low-code, IoT dashboard, or AI workflow capability.
- Technical reviewers who need proof that the projects are real and inspectable.
- The user, who needs a maintainable site that can be upgraded by multiple agents over time.

## Current State

The repository at `D:\AI\zz\portfolio` is a static Next.js export, not a source project. It contains generated files such as `_next/static`, `__next.*.txt`, and compressed one-line HTML. This is acceptable for GitHub Pages output, but it is weak for ongoing editing.

The new implementation should replace the hard-to-maintain generated HTML with a clean static source structure while keeping GitHub Pages compatibility for the `/-/` base path.

## Content Architecture

The homepage should use this order:

1. Hero: From business workflow to running system.
2. Capability evidence: workflow decomposition, ERP module design, low-code implementation, IoT data dashboards, AI agent delivery.
3. Featured projects:
   - Smart aquaculture ERP and low-code implementation.
   - ESP32 IoT platform and mini-program control loop.
   - CareerOps China adaptation and automation workflow.
   - AI Supervisor quality gate for agent delivery.
4. Working method: clarify, model, configure, integrate, verify.
5. Contact fit: ERP implementation, IoT dashboards, business workflow digitization, internal AI agent tooling.

ReverseLab should be mentioned only as a restrained research lab item, not as a main homepage case.

## Technical Architecture

Use a no-build static architecture:

- `index.html`: clean, readable homepage for GitHub Pages.
- `projects/ai-career-ops.html`: first project detail page.
- `styles/site.css`: maintainable styling.
- `scripts/site.js`: small progressive enhancements.
- `scripts/serve-pages.js`: local server that maps `/-/` to the repository root.
- `scripts/verify-site.js`: deterministic verification of required content, links, SEO tags, and asset references.
- `README.md` and `DEPLOYMENT.md`: operating instructions for future agents.

Keep `.nojekyll` so GitHub Pages can serve underscore directories if old assets remain.

## Visual Direction

Use a restrained operational portfolio style:

- Dense but readable sections.
- No marketing-heavy hero.
- Cards only for repeated project/capability items.
- Use existing images under `images/` as real project evidence.
- Keep accent colors varied but restrained.
- Mobile-first layout with no text overlap.

## Verification Requirements

The site is acceptable only if:

- `node scripts/verify-site.js` passes.
- The homepage contains the core positioning statement and all four primary project names.
- All local links use the `/-/` base path where needed.
- SEO tags include title, description, canonical, Open Graph, and Twitter card metadata.
- No obvious mojibake markers appear in the edited HTML, CSS, JS, or docs.
- `node scripts/serve-pages.js` can preview the site at `http://localhost:4173/-/`.

