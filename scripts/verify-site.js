const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const base = "/-/";
const files = ["index.html", "projects/esp32-iot-platform.html", "projects/ai-supervisor.html", "projects/aquaculture-prototype.html", "projects/profile-miniapp.html", "projects/ea-research.html", "404.html", "styles/site.css", "scripts/site.js", "robots.txt", "sitemap.xml"];
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
for (const text of ["把业务流程、物联网设备与 AI 工程实践，落成可验证的软件系统。", "ESP32 IoT 平台", "AI Supervisor", "智慧水产养殖应用套件", "开发服务展示小程序", "XAU 黄金交易研究", "上下文工程实验", "AI Supervisor pytest 93 项通过", "水产后端 API 测试 12 项通过", "93+", "构建 0 警告 0 错误", "pytest 93 项通过", "API 测试 12 项通过"]) {
  if (!home.includes(text)) throw new Error(`Homepage is missing: ${text}`);
}

for (const file of ["index.html", "projects/esp32-iot-platform.html", "projects/ai-supervisor.html", "projects/aquaculture-prototype.html", "projects/profile-miniapp.html", "projects/ea-research.html"]) {
  if (!read(file).includes('data-site-version="2026-08-07"')) throw new Error(`${file} has an unexpected site version`);
}

for (const [file, text] of [["projects/esp32-iot-platform.html", "0 个警告、0 个错误"], ["projects/ai-supervisor.html", "93 项测试，全部通过"], ["projects/aquaculture-prototype.html", "12 项全部通过"]]) {
  if (!read(file).includes(text)) throw new Error(`${file} is missing verification evidence`);
}

console.log("Portfolio site verified.");
