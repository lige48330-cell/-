# Design QA — Control Room Narrative

## Comparison target

- Source visual truth: `C:\Users\12982\.codex\generated_images\019fbd97-9850-7430-b502-f4185408b414\exec-cf4f7a68-8f17-4cf1-81a3-150bb271b880.png`
- Browser-rendered implementation: `C:\Users\12982\.codex\visualizations\2026\08\01\019fbd97-9850-7430-b502-f4185408b414\portfolio-option-2-implementation-2.png`
- Full-view comparison: `C:\Users\12982\.codex\visualizations\2026\08\01\019fbd97-9850-7430-b502-f4185408b414\portfolio-qa-comparison-2.png`
- Mobile responsive capture: `C:\Users\12982\.codex\visualizations\2026\08\01\019fbd97-9850-7430-b502-f4185408b414\portfolio-mobile.png`
- AI full-stack section capture: `C:\Users\12982\.codex\visualizations\2026\08\01\019fbd97-9850-7430-b502-f4185408b414\portfolio-ai-work.png`
- State: desktop default selection is the IoT equipment-monitoring case; mobile screenshot is the home hero before scrolling.

## Viewport and normalization

- Browser CSS viewport for desktop capture: `1440 × 1024` at device scale factor `1`.
- Source raster pixels: `1487 × 1058`.
- Implementation raster pixels: `1425 × 1013`.
- The full-view comparison normalizes both renders to `1440 × 1024`, with browser chrome excluded.
- Browser CSS viewport for responsive capture: `390 × 844`; output raster is `375 × 811` after browser capture scaling.

## Findings

- [Resolved P1] Hero type was materially larger and wrapped into five lines in the first browser capture.
  - Evidence: `portfolio-qa-comparison-1.png` shows the initial implementation drifting from the compact hierarchy of the selected visual.
  - Fix: reduced the display type scale and increased the available headline line width in `portfolio.css`.
  - Post-fix evidence: `portfolio-qa-comparison-2.png` shows a balanced two-column hero; the project evidence control room remains visible above the fold.

- [Intentional, accepted] The implementation shows a single real, sanitized project screenshot in the selected evidence panel rather than the three fabricated dashboard screens in the concept mock.
  - Reason: the public portfolio must use authorized evidence and must not invent business metrics or customer data.
  - Result: the three case buttons retain the concept's project-control behavior while each switch exposes an actual project artifact.

## Required fidelity surfaces

- Fonts and typography: native Chinese sans-serif stack, strong display weight, restrained monospace labels, and legible body copy. The initial oversized headline was corrected.
- Spacing and layout rhythm: glass navigation, left narrative/right evidence split, clear gutters, single-level panels, and mobile single-column collapse are visible in the comparison captures.
- Colors and visual tokens: charcoal base, muted text, fine low-contrast rules, and emerald signal color match the selected direction without overusing neon effects.
- Image quality and asset fidelity: the rendered panel uses an authorized monitoring screenshot, existing ERP and ESP32 visuals, and a generated non-branded atlas texture. No placeholder boxes, custom SVG artwork, fake dashboards, passwords, or company/customer data were added.
- Copy and content: each case distinguishes a participation boundary from ownership; ERP is explicitly aquaculture/fisheries, and the mini program is explicitly linked to farm deodorization equipment.
- AI full-stack extension: the AI section is a later user-requested addition, so it follows the established dark card system rather than inventing an unrelated visual language. Its claims are grounded in local project metadata for the knowledge base, reusable Codex workflows, and cross-stack project work.

## Interaction and technical checks

- Project tab interaction verified: selecting `02 养殖渔业 ERP` changes `aria-selected`, title, image, description, tags, and case anchor.
- AI full-stack navigation verified: the `AI 全栈` navigation link reaches `#ai-work` and exposes the new semantic heading.
- Desktop DOM exposes semantic navigation, tablist, tabpanel, headings, image alt text, and skip link.
- Mobile check: no horizontal overflow at a `390px` CSS viewport.
- Browser console errors: none.
- Edited text-file credential scan: no matches for the supplied passwords, phone number, `token`, `secret`, or API-key literals.

## Project-radar extension — 2026-08-01

- Source visual truth: `C:\Users\12982\.codex\generated_images\019fbd97-9850-7430-b502-f4185408b414\exec-cf4f7a68-8f17-4cf1-81a3-150bb271b880.png`
- Browser-rendered desktop capture: `C:\Users\12982\.codex\visualizations\2026\08\01\019fbd97-9850-7430-b502-f4185408b414\portfolio-desktop-current.png`
- Browser-rendered project-radar capture: `C:\Users\12982\.codex\visualizations\2026\08\01\019fbd97-9850-7430-b502-f4185408b414\portfolio-radar-anchor.png`
- Browser-rendered mobile capture: `C:\Users\12982\.codex\visualizations\2026\08\01\019fbd97-9850-7430-b502-f4185408b414\portfolio-radar-mobile-anchor.png`
- Same-input visual comparison: `C:\Users\12982\.codex\visualizations\2026\08\01\019fbd97-9850-7430-b502-f4185408b414\portfolio-design-comparison-radar.png`
- State: desktop default project tab; all eight public project records visible. Mobile capture is anchored to `#project-radar`.

### Extension findings and fixes

- [Resolved P1] The initial project-radar background extended beyond its container and caused desktop horizontal overflow.
  - Evidence: the first desktop viewport displayed a horizontal scrollbar after the radar section was added.
  - Fix: constrained `.project-radar::before` to the section bounds rather than using negative horizontal insets.
  - Post-fix evidence: browser measurement reports `scrollWidth === clientWidth` on desktop and mobile.

- [Intentional, accepted] The selected concept is adapted from a centered showcase page into a narrative left/right hero plus a project-radar section.
  - Reason: the live portfolio needs readable case evidence above the fold and a distinct surface for the user's Codex project inventory.
  - Evidence: the same-input comparison retains the charcoal/emerald palette, fine rules, high-contrast display type, atlas texture, project-control framing, and low-density panel rhythm of the selected direction.

### Extension fidelity surfaces

- Fonts and typography: desktop hero remains high-contrast and compact; radar heading scales from a two-column desktop composition to a readable mobile hierarchy.
- Spacing and layout rhythm: the toolbar, two-column featured card, and three-column project matrix collapse to one column without clipping.
- Colors and visual tokens: the existing charcoal, muted gray, emerald signal, amber-boundary, and atlas-image language is reused consistently.
- Image quality and asset fidelity: ERP now uses `smartagri-erp-public.png`, a de-identified derivative of the user-specified ERP screenshot. The mini-program image remains labeled as a control-chain illustration; no live control screen, source code, credentials, customer details, or device identifiers are published.
- Copy and content: eight cards distinguish private extension, personal work, open-source adaptation, and research context. Mailbox/credential-oriented local utilities are explicitly excluded from the public inventory.

### Extension interactions and checks

- Project-radar filters verified: selecting `研究实验` shows three relevant records and updates the accessible selected state and count; returning to `全部` shows all eight cards.
- Desktop overflow check: passed at the browser default desktop viewport (`scrollWidth === clientWidth`).
- Mobile overflow check: passed at `390 × 844` CSS viewport; rendered capture is `375 × 811` pixels.
- Desktop implementation capture: `1425 × 1013` pixels from a `1440 × 1024` CSS viewport; selected visual source is `1487 × 1058` pixels. The same-input comparison normalizes each into a `720 × 512` panel.
- Browser console errors: none.
- Static JavaScript syntax, Git whitespace, asset-reference, and supplied-credential literal scans: passed.

## Follow-up polish

- Replace the mini-program chain illustration with a user-approved, de-identified mobile capture when one is supplied. The source control page was intentionally not driven because it polls backend device status and exposes physical-control actions.

final result: passed
