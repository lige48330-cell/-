const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pages = ["index.html", "404.html", "projects/ai-career-ops.html"];

const classTransforms = [
  {
    from: '<header class="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-background/82 backdrop-blur-xl"',
    to: '<header class="lg-nav fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-background/82 backdrop-blur-xl" data-lg-pointer="soft"',
  },
  {
    from: 'class="focus-ring min-w-0 overflow-hidden rounded-lg border border-white/12 bg-card/90"',
    to: 'class="lg-card lg-surface focus-ring min-w-0 overflow-hidden rounded-lg border border-white/12 bg-card/90" data-lg-pointer="tilt"',
  },
  {
    from: 'class="group min-w-0 rounded-lg border border-white/10 bg-card/86 p-5 transition-colors hover:border-accent/45 hover:bg-card-hover"',
    to: 'class="lg-card group min-w-0 rounded-lg border border-white/10 bg-card/86 p-5 transition-colors hover:border-accent/45 hover:bg-card-hover" data-lg-pointer="tilt"',
  },
  {
    from: 'class="group grid min-w-0 overflow-hidden rounded-lg border border-white/10 bg-card/88 transition-colors hover:border-accent/45 hover:bg-card-hover',
    to: 'class="lg-card group grid min-w-0 overflow-hidden rounded-lg border border-white/10 bg-card/88 transition-colors hover:border-accent/45 hover:bg-card-hover',
  },
  {
    from: 'class="group block overflow-hidden rounded-lg border border-white/10 bg-card/86 transition-colors hover:border-accent/45 hover:bg-card-hover"',
    to: 'class="lg-card group block overflow-hidden rounded-lg border border-white/10 bg-card/86 transition-colors hover:border-accent/45 hover:bg-card-hover" data-lg-pointer="tilt"',
  },
  {
    from: 'class="rounded-lg border border-white/10 bg-background/70 p-5"',
    to: 'class="lg-surface rounded-lg border border-white/10 bg-background/70 p-5"',
  },
  {
    from: 'class="relative rounded-lg border border-white/10 bg-card/72 p-5 sm:p-8"',
    to: 'class="lg-card relative rounded-lg border border-white/10 bg-card/72 p-5 sm:p-8" data-lg-pointer="tilt"',
  },
  {
    from: 'class="group min-w-0 rounded-lg border border-white/10 bg-card/86 p-6 transition-colors hover:border-accent/45 hover:bg-card-hover"',
    to: 'class="lg-card group min-w-0 rounded-lg border border-white/10 bg-card/86 p-6 transition-colors hover:border-accent/45 hover:bg-card-hover" data-lg-pointer="tilt"',
  },
  {
    from: 'class="mx-auto grid max-w-6xl gap-6 rounded-lg border border-white/10 bg-card/86 p-6 sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center"',
    to: 'class="lg-card mx-auto grid max-w-6xl gap-6 rounded-lg border border-white/10 bg-card/86 p-6 sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center" data-lg-pointer="tilt"',
  },
  {
    from: 'class="rounded-md border border-white/10 bg-background/55 p-3"',
    to: 'class="lg-surface rounded-md border border-white/10 bg-background/55 p-3"',
  },
  {
    from: 'class="rounded-md border border-white/10 bg-background/55 p-4"',
    to: 'class="lg-surface rounded-md border border-white/10 bg-background/55 p-4"',
  },
  {
    from: 'class="rounded-md bg-accent px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-accent-light"',
    to: 'class="lg-button lg-button-primary rounded-md bg-accent px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-accent-light" data-lg-pointer="soft"',
  },
  {
    from: 'class="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/70 hover:bg-accent/10"',
    to: 'class="lg-button rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/70 hover:bg-accent/10" data-lg-pointer="soft"',
  },
  {
    from: 'class="rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:border-accent sm:hidden"',
    to: 'class="lg-button rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-colors hover:border-accent sm:hidden" data-lg-pointer="soft"',
  },
  {
    from: 'class="rounded-full border px-3 py-1.5 font-mono text-xs font-bold transition-colors ',
    to: 'class="lg-button rounded-full border px-3 py-1.5 font-mono text-xs font-bold transition-colors ',
  },
  {
    from: 'class="mb-5 inline-flex rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"',
    to: 'class="lg-badge mb-5 inline-flex rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"',
  },
  {
    from: 'class="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-muted transition-colors hover:border-accent/50 hover:text-accent"',
    to: 'class="lg-badge rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-muted transition-colors hover:border-accent/50 hover:text-accent"',
  },
  {
    from: 'class="inline-flex items-center gap-2 rounded-md bg-accent/10 px-4 py-2.5 font-mono text-sm font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-ink"',
    to: 'class="lg-button inline-flex items-center gap-2 rounded-md bg-accent/10 px-4 py-2.5 font-mono text-sm font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-ink" data-lg-pointer="soft"',
  },
];

function replaceAll(content, from, to) {
  return content.split(from).join(to);
}

function addBodyReadyClass(content) {
  return content.replace(/<body class="([^"]*)"/, (match, className) => {
    const classes = className.split(/\s+/).filter(Boolean);
    if (!classes.includes("lg-liquid-ready")) {
      classes.unshift("lg-liquid-ready");
    }
    return `<body class="${classes.join(" ")}"`;
  });
}

function dedupeClassTokens(content) {
  return content.replace(/class="([^"]*)"/g, (match, className) => {
    const seen = new Set();
    const classes = className.split(/\s+/).filter(Boolean);
    const deduped = classes.filter((classToken) => {
      if (seen.has(classToken)) {
        return false;
      }
      seen.add(classToken);
      return true;
    });
    return `class="${deduped.join(" ")}"`;
  });
}

function addPointerAttribute(content, selectorRegex, pointerMode) {
  return content.replace(selectorRegex, (tag) => {
    if (tag.includes("data-lg-pointer=")) {
      return tag;
    }
    return tag.replace(">", ` data-lg-pointer="${pointerMode}">`);
  });
}

for (const page of pages) {
  const filePath = path.join(root, page);
  let content = fs.readFileSync(filePath, "utf8");

  if (!content.includes('href="/-/liquid-glass.css"')) {
    content = content.replace("</head>", '<link rel="stylesheet" href="/-/liquid-glass.css" /></head>');
  }

  if (!content.includes('src="/-/liquid-glass.js"')) {
    content = content.replace("</body>", '<script src="/-/liquid-glass.js"></script></body>');
  }

  content = addBodyReadyClass(content);

  for (const transform of classTransforms) {
    content = replaceAll(content, transform.from, transform.to);
  }

  content = addPointerAttribute(
    content,
    /<article class="lg-card group grid[^>]*>/g,
    "tilt"
  );

  content = addPointerAttribute(
    content,
    /<button class="lg-button rounded-full[^>]*>/g,
    "soft"
  );

  content = dedupeClassTokens(content);

  fs.writeFileSync(filePath, content);
  console.log(`Applied Liquid Glass classes to ${page}`);
}
