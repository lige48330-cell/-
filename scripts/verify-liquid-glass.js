const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredPages = ["index.html", "404.html", "projects/ai-career-ops.html"];
const requiredHomeSnippets = [
  'id="capability-map"',
  'id="team-collaboration"',
  'id="project-map"',
  'id="project-radar"',
  "AI 工具开发与评测",
];
const requiredCssSnippets = [
  ".capability-proof-grid",
  ".collaboration-proof",
  ".source-map-grid",
  ".prototype-evidence-strip",
];
const requiredJsSnippets = ["radarCards.length", "radarCount.textContent"];

function assertContains(filePath, content, snippet) {
  if (!content.includes(snippet)) {
    throw new Error(`${filePath} is missing ${snippet}`);
  }
}

for (const page of requiredPages) {
  const filePath = path.join(root, page);
  if (!fs.existsSync(filePath)) throw new Error(`Missing required page: ${page}`);
}

const homeHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const snippet of requiredHomeSnippets) {
  assertContains("index.html", homeHtml, snippet);
}

const css = fs.readFileSync(path.join(root, "portfolio.css"), "utf8");
for (const snippet of requiredCssSnippets) {
  assertContains("portfolio.css", css, snippet);
}

const js = fs.readFileSync(path.join(root, "portfolio.js"), "utf8");
for (const snippet of requiredJsSnippets) {
  assertContains("portfolio.js", js, snippet);
}

for (const asset of ["images/aquaculture-erp-workflow.svg", "images/agent-workflow.svg"]) {
  if (!fs.existsSync(path.join(root, asset))) throw new Error(`Missing evidence asset: ${asset}`);
}

const radarCount = (homeHtml.match(/<article class="radar-card/g) || []).length;
if (radarCount !== 17) throw new Error(`Expected 17 radar cards, found ${radarCount}`);
if (/([A-Za-z]:\\|password|passwd|api[_-]?key|bearer\s+[A-Za-z0-9._-]+)/i.test(homeHtml)) {
  throw new Error("Homepage contains a local path or credential-like text");
}

console.log("Portfolio structure verified.");
