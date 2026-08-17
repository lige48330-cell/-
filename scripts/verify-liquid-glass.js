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
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const text of [
  "进入业务现场，",
  "三个现场：我判断什么、推动什么、留下什么",
  "FDE 如何收敛四类",
  "把 Agent 变成可观察、可审查、可接管的交付协作者",
  "公开工程证明：快速进入陌生栈",
]) {
  if (!home.includes(text)) throw new Error(`Homepage is missing: ${text}`);
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

for (const file of ["index.html", "resume.html", "portfolio.js", "images/cockpit-runtime-flow.svg", "images/erp-prototype-map.svg"]) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  for (const [label, pattern] of forbiddenPublicPatterns) {
    if (pattern.test(content)) throw new Error(`${file} contains ${label}`);
  }
}

console.log("FDE portfolio structure verified.");
