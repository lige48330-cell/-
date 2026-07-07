const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteOrigin = "https://lige48330-cell.github.io";
const siteBase = "/-/";

const files = {
  home: "index.html",
  smartagri: "projects/smartagri-erp.html",
  careerOps: "projects/ai-career-ops.html",
  esp32: "projects/esp32-iot-platform.html",
  supervisor: "projects/ai-supervisor.html",
  notFound: "404.html",
  css: "styles/site.css",
  js: "scripts/site.js",
  server: "scripts/serve-pages.js",
  readme: "README.md",
  deployment: "DEPLOYMENT.md",
  robots: "robots.txt",
  sitemap: "sitemap.xml",
};

const publicPages = [
  files.home,
  files.smartagri,
  files.careerOps,
  files.esp32,
  files.supervisor,
];

const pageLabels = {
  [files.home]: "home",
  [files.smartagri]: "smartagri",
  [files.careerOps]: "careerOps",
  [files.esp32]: "esp32",
  [files.supervisor]: "supervisor",
  [files.notFound]: "notFound",
};

const forbiddenMarkers = [
  "�",
  "锟",
  "涓",
  "娴",
  "鑳",
  "鐩",
  "缁",
  "閫",
  "楠",
  "宸",
  "杩",
  "漏 ",
];

function fullPath(relativePath) {
  return path.join(root, relativePath);
}

function readRequired(relativePath) {
  const target = fullPath(relativePath);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(target, "utf8");
}

function assertIncludes(label, content, snippet) {
  if (!content.includes(snippet)) {
    throw new Error(`${label} is missing required snippet: ${snippet}`);
  }
}

function assertCleanText(label, content) {
  for (const marker of forbiddenMarkers) {
    if (content.includes(marker)) {
      throw new Error(`${label} contains mojibake marker: ${marker}`);
    }
  }
}

function assertNoBotchedEscapes(label, content) {
  if (content.includes('\\"') || content.includes("\\n- ")) {
    throw new Error(`${label} contains botched shell escaping`);
  }
}

function assertNoRootRelativeSiteLinks(label, content) {
  const badLinks = [
    'href="/styles/',
    'href="/scripts/',
    'href="/images/',
    'src="/scripts/',
    'src="/images/',
    'href="/projects/',
  ];

  for (const bad of badLinks) {
    if (content.includes(bad)) {
      throw new Error(`${label} contains non-GitHub-Pages path: ${bad}`);
    }
  }
}

function extractAttrValues(content, attr) {
  const values = [];
  const pattern = new RegExp(`\\b${attr}=["']([^"']+)["']`, "g");
  let match;

  while ((match = pattern.exec(content)) !== null) {
    values.push(match[1]);
  }

  return values;
}

function stripHashAndQuery(urlPath) {
  return urlPath.split("#")[0].split("?")[0];
}

function sitePathToFile(urlPath) {
  const cleanPath = stripHashAndQuery(urlPath);

  if (cleanPath === siteBase) {
    return files.home;
  }

  if (!cleanPath.startsWith(siteBase)) {
    return null;
  }

  return decodeURIComponent(cleanPath.slice(siteBase.length));
}

function assertLocalTargetExists(label, urlValue) {
  if (
    urlValue.startsWith("#") ||
    urlValue.startsWith("mailto:") ||
    urlValue.startsWith("tel:") ||
    urlValue.startsWith("data:")
  ) {
    return;
  }

  let targetUrl = urlValue;

  if (targetUrl.startsWith(siteOrigin)) {
    targetUrl = targetUrl.slice(siteOrigin.length);
  }

  if (!targetUrl.startsWith(siteBase)) {
    if (/^https?:\/\//.test(targetUrl)) {
      return;
    }
    throw new Error(`${label} contains unsupported relative URL: ${urlValue}`);
  }

  const targetFile = sitePathToFile(targetUrl);

  if (!targetFile || !fs.existsSync(fullPath(targetFile))) {
    throw new Error(`${label} links to missing local target: ${urlValue}`);
  }
}

function assertAnchorsExist(label, content) {
  for (const href of extractAttrValues(content, "href")) {
    if (!href.startsWith("#")) {
      continue;
    }

    const id = href.slice(1);

    if (id && !content.includes(`id="${id}"`)) {
      throw new Error(`${label} links to missing section id: ${href}`);
    }
  }
}

function assertPageLinks(label, content) {
  assertNoRootRelativeSiteLinks(label, content);
  assertAnchorsExist(label, content);

  for (const value of [...extractAttrValues(content, "href"), ...extractAttrValues(content, "src")]) {
    assertLocalTargetExists(label, value);
  }
}

const loaded = Object.fromEntries(
  Object.entries(files).map(([label, relativePath]) => [label, readRequired(relativePath)])
);

for (const [label, content] of Object.entries(loaded)) {
  assertCleanText(label, content);
  assertNoBotchedEscapes(label, content);
}

assertIncludes("home", loaded.home, 'data-site-version="2026-07-07"');
assertIncludes("home", loaded.home, '<link rel="stylesheet" href="/-/styles/site.css"');
assertIncludes("home", loaded.home, '<script src="/-/scripts/site.js" defer></script>');
assertIncludes("home", loaded.home, "从业务流程到可运行系统");
assertIncludes("home", loaded.home, "智慧养殖 ERP");
assertIncludes("home", loaded.home, "证据等级：已验证主线");
assertIncludes("home", loaded.home, "证据等级：推进中 / 待联调");
assertIncludes("home", loaded.home, "证据等级：原型流程");
assertIncludes("home", loaded.home, "证据等级：工具化实验");
assertIncludes("home", loaded.home, 'rel="canonical"');
assertIncludes("home", loaded.home, 'property="og:title"');
assertIncludes("home", loaded.home, 'name="twitter:card"');
assertIncludes("home", loaded.home, 'href="/-/projects/smartagri-erp.html"');
assertIncludes("home", loaded.home, 'href="/-/projects/ai-career-ops.html"');
assertIncludes("home", loaded.home, 'href="/-/projects/esp32-iot-platform.html"');
assertIncludes("home", loaded.home, 'href="/-/projects/ai-supervisor.html"');

assertIncludes("smartagri", loaded.smartagri, 'data-site-version="2026-07-07"');
assertIncludes("smartagri", loaded.smartagri, "智慧养殖 ERP");
assertIncludes("smartagri", loaded.smartagri, "证据等级：已验证主线");
assertIncludes("smartagri", loaded.smartagri, "菜单权限");
assertIncludes("smartagri", loaded.smartagri, "主从保存");
assertIncludes("smartagri", loaded.smartagri, "审批库存");
assertIncludes("smartagri", loaded.smartagri, "反审批回滚");
assertIncludes("smartagri", loaded.smartagri, 'href="/-/"');

assertIncludes("careerOps", loaded.careerOps, 'data-site-version="2026-07-07"');
assertIncludes("careerOps", loaded.careerOps, "AI 求职自动化系统");
assertIncludes("careerOps", loaded.careerOps, "证据等级：原型流程");
assertIncludes("careerOps", loaded.careerOps, "中国平台适配");
assertIncludes("careerOps", loaded.careerOps, "Portal 扫描");
assertIncludes("careerOps", loaded.careerOps, "Offer 评估");
assertIncludes("careerOps", loaded.careerOps, 'href="/-/"');
assertIncludes("careerOps", loaded.careerOps, 'src="/-/images/ai-career-ops.png"');

assertIncludes("esp32", loaded.esp32, 'data-site-version="2026-07-07"');
assertIncludes("esp32", loaded.esp32, "ESP32 IoT 平台");
assertIncludes("esp32", loaded.esp32, "证据等级：推进中 / 待联调");
assertIncludes("esp32", loaded.esp32, "ESP32 固件");
assertIncludes("esp32", loaded.esp32, ".NET 8 云平台");
assertIncludes("esp32", loaded.esp32, "uni-app 小程序");
assertIncludes("esp32", loaded.esp32, 'href="/-/"');

assertIncludes("supervisor", loaded.supervisor, 'data-site-version="2026-07-07"');
assertIncludes("supervisor", loaded.supervisor, "AI Supervisor");
assertIncludes("supervisor", loaded.supervisor, "证据等级：工具化实验");
assertIncludes("supervisor", loaded.supervisor, "spec");
assertIncludes("supervisor", loaded.supervisor, "review");
assertIncludes("supervisor", loaded.supervisor, "guard");
assertIncludes("supervisor", loaded.supervisor, "hook");
assertIncludes("supervisor", loaded.supervisor, 'href="/-/"');

assertIncludes("notFound", loaded.notFound, 'data-site-version="2026-07-07"');
assertIncludes("notFound", loaded.notFound, "页面未找到");
assertIncludes("notFound", loaded.notFound, 'href="/-/"');

assertIncludes("css", loaded.css, ".capability-grid");
assertIncludes("css", loaded.css, ".project-card");
assertIncludes("css", loaded.css, "@media (max-width: 760px)");
assertIncludes("js", loaded.js, "data-current-year");
assertIncludes("server", loaded.server, "application/xml; charset=utf-8");
assertIncludes("readme", loaded.readme, "业务流程数字化作品集");
assertIncludes("readme", loaded.readme, "证据说明");
assertIncludes("readme", loaded.readme, "node scripts/serve-pages.js");
assertIncludes("deployment", loaded.deployment, "GitHub Pages");
assertIncludes("deployment", loaded.deployment, "/-/");
assertIncludes("robots", loaded.robots, "Sitemap: https://lige48330-cell.github.io/-/sitemap.xml");

for (const relativePath of publicPages) {
  const publicUrl = `${siteOrigin}${siteBase}${relativePath === files.home ? "" : relativePath}`;
  assertIncludes("sitemap", loaded.sitemap, publicUrl);
}

for (const relativePath of [...publicPages, files.notFound]) {
  const label = pageLabels[relativePath];
  assertPageLinks(label, loaded[label]);
}

console.log("Portfolio site verified.");
