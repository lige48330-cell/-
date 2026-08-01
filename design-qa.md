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

## Follow-up polish

- The next planned iteration is a separate AI full-stack project section derived from a sanitized inventory of Codex projects; it is deliberately not populated until that evidence has been reviewed.

final result: passed
