const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pages = ["index.html", "404.html", "projects/ai-career-ops.html"];

const requiredEveryPageSnippets = [
  'href="/-/liquid-glass.css"',
  'src="/-/liquid-glass.js"',
  "lg-liquid-ready",
];

const requiredCssSnippets = [
  ".lg-card",
  ".lg-button",
  ".lg-nav",
  ".lg-badge",
  ".lg-surface",
  ".lg-shimmer",
  "@media (prefers-reduced-motion: reduce)",
  ".lg-liquid-ready .section-band::before",
  ".lg-liquid-ready .section-band::after",
  ".lg-404-panel",
];

const requiredPageSnippets = {
  'projects/ai-career-ops.html': [
    'section-band',
    'lg-card',
    'lg-surface',
  ],
  '404.html': [
    'lg-404-panel',
  ],
};

const requiredJsSnippets = [
  "initLiquidGlass",
  "data-lg-pointer",
  "pointermove",
  "lg-pointer-active",
];

function assertContains(filePath, content, snippet) {
  if (!content.includes(snippet)) {
    throw new Error(`${filePath} is missing ${snippet}`);
  }
}

for (const page of pages) {
  const filePath = path.join(root, page);
  const html = fs.readFileSync(filePath, "utf8");
  for (const snippet of requiredEveryPageSnippets) {
    assertContains(page, html, snippet);
  }
}

for (const [page, snippets] of Object.entries(requiredPageSnippets)) {
  const filePath = path.join(root, page);
  const html = fs.readFileSync(filePath, "utf8");
  for (const snippet of snippets) {
    assertContains(page, html, snippet);
  }
}

const css = fs.readFileSync(path.join(root, "liquid-glass.css"), "utf8");
for (const snippet of requiredCssSnippets) {
  assertContains("liquid-glass.css", css, snippet);
}

const js = fs.readFileSync(path.join(root, "liquid-glass.js"), "utf8");
for (const snippet of requiredJsSnippets) {
  assertContains("liquid-glass.js", js, snippet);
}

console.log("Liquid Glass integration verified.");
