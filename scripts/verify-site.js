const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const base = "/-/";
const files = [
  "index.html",
  "projects/esp32-iot-platform.html",
  "projects/ai-supervisor.html",
  "projects/aquaculture-prototype.html",
  "404.html",
  "portfolio.css",
  "portfolio-premium.css",
  "portfolio.js",
  "styles/site.css",
  "scripts/site.js",
  "robots.txt",
  "sitemap.xml",
  "images/aquaculture-erp-workflow.svg",
  "images/agent-workflow.svg",
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
  const content = read(file);
  if (content.includes("�") || content.includes('\\"')) throw new Error(`${file} contains broken text`);
  if (file.endsWith(".html")) {
    for (const link of links(content)) {
      if (link.startsWith("#") || /^(mailto:|tel:|https?:\/\/|data:)/.test(link)) continue;
      const clean = link.split(/[?#]/)[0];
      const isPagesPath = clean.startsWith(base);
      const relative = isPagesPath ? clean.slice(base.length) : clean.replace(/^\//, "");
      const target = path.resolve(isPagesPath ? root : path.dirname(path.join(root, file)), relative || "index.html");
      if (!target.startsWith(root) || !fs.existsSync(target)) throw new Error(`${file} links to missing target: ${link}`);
    }
  }
}

const home = read("index.html");
for (const text of ["AI Agent 工程 · 业务系统交付 · IoT", "让系统真正交得出去。", "核心交付证据", "证据等级", "能力画像", "方案能力", "团队协作", "项目地图", "本地 AI 工具可靠性实验", "有证据等级的工程记录"]) {
  if (!home.includes(text)) throw new Error(`Homepage is missing: ${text}`);
}

const radarCount = (home.match(/<article\b[^>]*\bclass=["'][^"']*\bradar-card\b/g) || []).length;
if (radarCount !== 17) throw new Error(`Expected 17 radar cards, found ${radarCount}`);
if (!read("portfolio.css").includes(".capability-proof-grid")) throw new Error("portfolio.css is missing capability styles");
if (!read("portfolio-premium.css").includes("--signal: #aaff47")) throw new Error("premium visual system is missing signal color");
if (!read("portfolio.js").includes("radarCards.length")) throw new Error("portfolio.js is missing radar count logic");
for (const file of ["index.html", "projects/esp32-iot-platform.html", "projects/ai-supervisor.html", "projects/aquaculture-prototype.html"]) {
  const content = read(file);
  if (/(password|passwd|api[_-]?key|bearer\s+[A-Za-z0-9._-]+)/i.test(content)) {
    throw new Error(`${file} contains credential-like text`);
  }
}

console.log("Portfolio site verified.");
