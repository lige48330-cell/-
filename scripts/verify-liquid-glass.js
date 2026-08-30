const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const required = [
  "index.html",
  "fde.css",
  "portfolio.js",
  "images/aquaculture-erp-public.png",
  "images/erp-prototype-map.svg",
  "images/iot-monitoring-dashboard-public.png",
  "images/esp32-miniapp-public.png",
  "images/cockpit-runtime-flow.svg",
  "images/china-job-channels-flow.svg",
  "trace-rag.css",
  "projects/china-job-channels.html",
  "projects/china-job-channels.css",
  "open-source/china-job-channels/README.md",
  "open-source/trace-rag-agent/demo.html",
  "open-source/trace-rag-agent/demo.js",
  "open-source/trace-rag-agent/demo.css",
  "open-source/trace-rag-agent/architecture.svg",
  "open-source/trace-rag-agent/README.md",
  "docs/trace-rag-primary-research.md",
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const text of [
  "进入业务现场，",
  "三个现场 + 一条个人工程：我判断什么、推动什么、留下什么",
  "FDE 如何收敛四类",
  "把 Agent 变成可观察、可审查、可接管的交付协作者",
  "公开工程按能力分层，不用项目数量制造噪声",
  "把 Agent 做成一条能跑、能解释、能交接的系统链",
  "阅读一手资料与边界",
  "China Job Channels / 有界求职运营工作台",
]) {
  if (!home.includes(text)) throw new Error(`Homepage is missing: ${text}`);
}

const traceCss = fs.readFileSync(path.join(root, "trace-rag.css"), "utf8");
if (!traceCss.includes("--faint: var(--fde-faint)")) throw new Error("TraceRAG CSS is missing the FDE faint color alias");
if (/\b(?:left|right):\s*-\d/.test(traceCss)) throw new Error("TraceRAG CSS contains a negative horizontal offset");
for (const endpoint of ["/api/health", "/api/query", "/api/ingest"]) {
  if (!home.includes(endpoint)) throw new Error(`Homepage is missing TraceRAG endpoint: ${endpoint}`);
}

if ((home.match(/class="mobile-nav"/g) || []).length !== 1) throw new Error("Mobile navigation is missing");

const flagshipCount = (home.match(/<article\b[^>]*\bclass=["'][^"']*\bflagship-case\b/g) || []).length;
if (flagshipCount !== 3) throw new Error(`Expected 3 flagship cases, found ${flagshipCount}`);

const forbiddenPublicPatterns = [
  ["credential assignment", /(?:password|passwd|密码|账号|用户名|api[\s_-]?key)\s*[:：=]\s*[^\s<>"']+/i],
  ["bearer token", /bearer\s+[A-Za-z0-9._-]{12,}/i],
  ["phone number", /\b1[3-9]\d{9}\b/],
  ["Windows absolute path", /\b[A-Za-z]:\\[^\r\n<>"']+/],
];

for (const file of ["index.html", "resume.html", "portfolio.js", "projects/china-job-channels.html", "projects/china-job-channels.css", "open-source/china-job-channels/README.md", "images/cockpit-runtime-flow.svg", "images/erp-prototype-map.svg", "images/china-job-channels-flow.svg"]) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  for (const [label, pattern] of forbiddenPublicPatterns) {
    if (pattern.test(content)) throw new Error(`${file} contains ${label}`);
  }
}

console.log("FDE portfolio structure verified.");
