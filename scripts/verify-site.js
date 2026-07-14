const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const base = "/-/";
const files = ["index.html", "projects/esp32-iot-platform.html", "projects/ai-supervisor.html", "projects/aquaculture-prototype.html", "404.html", "styles/site.css", "scripts/site.js", "robots.txt", "sitemap.xml"];
const banned = ["Smart" + "Agri", "smart" + "agri", "Career" + "Ops", "career" + "ops", "Codex" + "Cont", "codex" + "cont"];

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
  for (const term of banned) if (content.includes(term)) throw new Error(`${file} contains removed project reference: ${term}`);
  if (file.endsWith(".html")) {
    for (const link of links(content)) {
      if (link.startsWith("#") || /^(mailto:|tel:|https?:\/\/)/.test(link)) continue;
      if (!link.startsWith(base)) throw new Error(`${file} contains non-GitHub-Pages path: ${link}`);
      const relative = link.slice(base.length).split(/[?#]/)[0] || "index.html";
      if (!fs.existsSync(path.join(root, relative))) throw new Error(`${file} links to missing target: ${link}`);
    }
  }
}

const home = read("index.html");
for (const text of ["把业务流程、物联网设备与 AI 工程实践，落成可验证的软件系统。", "ESP32 IoT 平台", "AI Supervisor", "智慧水产养殖应用套件", "AI Agent 编程学习平台", "开发服务展示小程序"]) {
  if (!home.includes(text)) throw new Error(`Homepage is missing: ${text}`);
}

for (const file of ["index.html", "projects/esp32-iot-platform.html", "projects/ai-supervisor.html", "projects/aquaculture-prototype.html"]) {
  if (!read(file).includes('data-site-version="2026-07-14"')) throw new Error(`${file} has an unexpected site version`);
}

console.log("Portfolio site verified.");
