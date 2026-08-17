const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const base = "/-/";
const files = [
  "index.html",
  "resume.html",
  "404.html",
  "portfolio.css",
  "portfolio-premium.css",
  "fde.css",
  "portfolio.js",
  "images/aquaculture-erp-public.png",
  "images/erp-prototype-map.svg",
  "images/iot-monitoring-dashboard-public.png",
  "images/esp32-miniapp-public.png",
  "images/cockpit-runtime-flow.svg",
];

function read(file) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) throw new Error(`Missing required file: ${file}`);
  return fs.readFileSync(target, "utf8");
}

function links(content) {
  return [...content.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);
}

for (const file of files) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) throw new Error(`Missing required file: ${file}`);
  if (!/\.(?:png|ico|woff2)$/.test(file)) {
    const content = read(file);
    if (content.includes("�") || content.includes('\\"')) throw new Error(`${file} contains broken text`);
  }
}

for (const file of ["index.html", "resume.html", "404.html"]) {
  const content = read(file);
  for (const link of links(content)) {
    if (link.startsWith("#") || /^(mailto:|tel:|https?:\/\/|data:)/.test(link)) continue;
    const clean = link.split(/[?#]/)[0];
    const isPagesPath = clean.startsWith(base);
    const relative = isPagesPath ? clean.slice(base.length) : clean.replace(/^\//, "");
    const target = path.resolve(isPagesPath ? root : path.dirname(path.join(root, file)), relative || "index.html");
    if (!target.startsWith(root) || !fs.existsSync(target)) throw new Error(`${file} links to missing target: ${link}`);
  }
}

const home = read("index.html");
for (const text of [
  "Lige · Forward Deployed Engineer",
  "进入业务现场，",
  "三个现场：我判断什么、推动什么、留下什么",
  "FDE 如何收敛四类",
  "现场</strong><small>角色 / 场景 / 约束",
  "把 Agent 变成可观察、可审查、可接管的交付协作者",
  "公开工程证明：快速进入陌生栈",
  "真实项目界面 · AI 辅助脱敏",
  "case-cockpit-tools",
]) {
  if (!home.includes(text)) throw new Error(`Homepage is missing: ${text}`);
}

const flagshipCount = (home.match(/<article\b[^>]*\bclass=["'][^"']*\bflagship-case\b/g) || []).length;
if (flagshipCount !== 3) throw new Error(`Expected 3 flagship cases, found ${flagshipCount}`);
if (home.includes('href="resume.html"')) throw new Error("Incomplete resume must not be linked from the homepage");
if ((home.match(/class="mobile-nav"/g) || []).length !== 1) throw new Error("Mobile navigation is missing");

const css = read("fde.css");
for (const selector of [".case-evidence-grid", ".delivery-spine", ".responsibility-matrix", ".agent-delivery-grid", ".supporting-grid"]) {
  if (!css.includes(selector)) throw new Error(`fde.css is missing ${selector}`);
}

const js = read("portfolio.js");
for (const snippet of ["cockpit-runtime-flow.svg", "ArrowLeft", "revealTargets", "pointerTargets"]) {
  if (!js.includes(snippet)) throw new Error(`portfolio.js is missing ${snippet}`);
}

const forbiddenPublicPatterns = [
  ["credential assignment", /(?:password|passwd|密码|账号|用户名|api[\s_-]?key)\s*[:：=]\s*[^\s<>"']+/i],
  ["bearer token", /bearer\s+[A-Za-z0-9._-]{12,}/i],
  ["phone number", /\b1[3-9]\d{9}\b/],
  ["Windows absolute path", /\b[A-Za-z]:\\[^\r\n<>"']+/],
];

for (const file of ["index.html", "resume.html", "portfolio.js", "images/cockpit-runtime-flow.svg", "images/erp-prototype-map.svg"]) {
  const content = read(file);
  for (const [label, pattern] of forbiddenPublicPatterns) {
    if (pattern.test(content)) throw new Error(`${file} contains ${label}`);
  }
}

console.log("FDE portfolio site verified.");
