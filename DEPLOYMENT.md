# Deployment

This repository is published as a GitHub Pages site under the repository path `/-/`.

Public URL:

```text
https://lige48330-cell.github.io/-/
```

## Local Preview

Run from the repository root:

```bash
node scripts/serve-pages.js
```

Open:

```text
http://127.0.0.1:4173/-/
```

The preview server redirects `/` to `/-/` and maps `/-/path` to files in the repository root. This mirrors the GitHub Pages path used by the repository named `-`.

## Verification

Before publishing:

```bash
node scripts/verify-site.js
```

The verifier checks:

- Required files exist.
- Homepage and project page contain the portfolio positioning.
- Links and assets use the `/-/` base path.
- SEO tags are present.
- Edited HTML, CSS, JS, and docs do not contain obvious mojibake markers.

## GitHub Pages Path Rules

Use absolute site paths with the repository prefix:

```html
<link rel="stylesheet" href="/-/styles/site.css">
<script src="/-/scripts/site.js" defer></script>
<a href="/-/projects/ai-career-ops.html">CareerOps</a>
<img src="/-/images/smartagri-erp.png" alt="...">
```

Do not use root paths such as `/styles/site.css` or `/projects/...`; those can break on GitHub Pages because the site is served below `/-/`.

## Suggested Publish Flow

Check current state:

```bash
git status --short --branch
node scripts/verify-site.js
```

Then commit and push according to the branch configured for GitHub Pages:

```bash
git add index.html 404.html projects styles scripts README.md DEPLOYMENT.md docs
git commit -m "feat: rebuild portfolio capability site"
git push origin merge/latest-worktree
```

If GitHub Pages is configured to publish from `gh-pages`, merge or cherry-pick the verified changes into that branch before pushing.

