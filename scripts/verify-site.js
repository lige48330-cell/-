const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const base = "/-/";
const files = ["index.html", "styles/site.css", "scripts/site.js", "404.html", "robots.txt", "sitemap.xml"];

function read(file) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) throw new Error(`Missing required file: ${file}`);
  return fs.readFileSync(target, "utf8");
}

function links(content) {
  return [...content.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map((m) => m[1]);
}

for (const file of files) {
  const content = read(file);
  if (content.includes("\uFFFD") || content.includes('\\"')) throw new Error(`${file} contains broken text`);
  if (file.endsWith(".html")) {
    for (const link of links(content)) {
      if (link.startsWith("#") || /^(mailto:|tel:|https?:\/\/)/.test(link)) continue;
      if (!link.startsWith(base)) throw new Error(`${file} contains non-GitHub-Pages path: ${link}`);
      const relative = link.slice(base.length).split(/[?#]/)[0] || "index.html";
      if (!fs.existsSync(path.join(root, relative))) throw new Error(`${file} links to missing target: ${link}`);
    }
  }
}

const homeContent = read("index.html");
for (const img of homeContent.match(/src="[^"]+\.(?:png|svg|jpg|jpeg)"/g) || []) {
  const src = img.replace(/^src="/, "").replace(/"$/, "").replace(/^\/-\//, "");
  if (!fs.existsSync(path.join(root, src))) throw new Error(`index.html references missing image: ${src}`);
}

for (const text of ["CodexCont 流式中间件", "Code Control Stack", "Stable-First", "六段技术链", "项目实证", "六项能力"]) {
  if (!homeContent.includes(text)) throw new Error(`Homepage is missing: ${text}`);
}

console.log("Portfolio site verified.");