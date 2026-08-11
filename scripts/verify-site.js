const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const base = "/-/";
const files = ["index.html", "styles/site.css", "scripts/site.js", "scripts/portfolio.js", "404.html", "robots.txt", "sitemap.xml"];
const banned = ["Codex" + "Cont"];

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
  if (content.includes("\uFFFD") || content.includes('\\"')) throw new Error(`${file} contains broken text`);
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

// verify all images referenced in index.html exist
const homeContent = read("index.html");
for (const img of homeContent.match(/src="[^"]+\.(?:png|svg|jpg|jpeg)"/g) || []) {
  const src = img.replace(/^src="/, "").replace(/"$/, "").replace(/^\/-\//, "");
  if (!fs.existsSync(path.join(root, src))) throw new Error(`index.html references missing image: ${src}`);
}

console.log("Portfolio site verified.");