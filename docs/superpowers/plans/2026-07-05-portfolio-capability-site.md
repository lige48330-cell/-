# Portfolio Capability Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the GitHub Pages portfolio into a maintainable static site that demonstrates business workflow digitization, ERP/IoT delivery, and AI agent-enabled verification.

**Architecture:** Replace generated one-line Next export HTML with clean static source files. Keep GitHub Pages `/-/` compatibility, reuse current images, and add deterministic verification and local preview tooling.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js verification scripts, GitHub Pages static hosting.

---

## File Structure

- Modify: `index.html` - clean homepage with hero, capabilities, project cases, delivery method, and contact fit.
- Modify: `projects/ai-career-ops.html` - readable detail page for CareerOps, linked from homepage.
- Modify: `404.html` - clean GitHub Pages-compatible not-found page.
- Create: `styles/site.css` - maintainable responsive styling.
- Create: `scripts/site.js` - small progressive enhancements such as active year and smooth local navigation.
- Create: `scripts/serve-pages.js` - local preview server mapping `/-/` to repo root.
- Create: `scripts/verify-site.js` - deterministic site checks.
- Modify: `README.md` - project maintenance entrypoint.
- Modify: `DEPLOYMENT.md` - local preview, verification, and GitHub Pages deployment notes.

## Task 1: Verification First

**Files:**
- Create: `scripts/verify-site.js`

- [ ] **Step 1: Write failing verifier**

Create a Node script that reads `index.html`, `projects/ai-career-ops.html`, `404.html`, `styles/site.css`, and `scripts/site.js`, then asserts required strings and paths.

- [ ] **Step 2: Run verifier to confirm RED**

Run: `node scripts\verify-site.js`

Expected: failure because the current generated site is missing new maintainability markers such as `data-site-version="2026-07-05"` and `styles/site.css`.

## Task 2: Rebuild Static Pages

**Files:**
- Modify: `index.html`
- Modify: `projects/ai-career-ops.html`
- Modify: `404.html`
- Create: `styles/site.css`
- Create: `scripts/site.js`

- [ ] **Step 1: Implement clean static homepage**

Write a readable homepage using the design spec's content order and existing images.

- [ ] **Step 2: Implement CareerOps detail page**

Write a readable project page that explains the China adaptation, pipeline modules, evidence, and reusable capability.

- [ ] **Step 3: Implement 404 page**

Write a compact not-found page that links back to `/-/`.

- [ ] **Step 4: Add CSS and JS**

Add responsive layout, stable card dimensions, restrained colors, and small progressive enhancement.

- [ ] **Step 5: Run verifier to confirm GREEN**

Run: `node scripts\verify-site.js`

Expected: pass.

## Task 3: Preview and Deployment Tooling

**Files:**
- Create: `scripts/serve-pages.js`
- Modify: `README.md`
- Modify: `DEPLOYMENT.md`

- [ ] **Step 1: Add local preview server**

Create a Node server that redirects `/` to `/-/` and maps `/-/path` to repository files.

- [ ] **Step 2: Add operating docs**

Document preview, verification, GitHub Pages path rules, and safe edit areas.

- [ ] **Step 3: Verify docs and server script**

Run: `node scripts\verify-site.js`

Expected: pass and docs contain the preview command.

## Task 4: Final Verification

**Files:**
- All modified files.

- [ ] **Step 1: Check git diff**

Run: `git diff --name-only`

Expected: only intentional site, docs, and script files changed.

- [ ] **Step 2: Run deterministic verification**

Run: `node scripts\verify-site.js`

Expected: pass.

- [ ] **Step 3: Run existing Liquid Glass verifier if still present**

Run: `node scripts\verify-liquid-glass.js`

Expected: either pass or be documented as superseded by the new site verifier.

