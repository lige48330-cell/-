# Deployment

The portfolio is published through GitHub Pages under the repository path `/-/`.

Public URL:

```text
https://lige48330-cell.github.io/-/
```

## Local preview

```bash
node scripts/serve-pages.js
```

Open `http://127.0.0.1:4173/-/`.

## Verification

Before synchronizing the publishing worktree, run:

```bash
node scripts/verify-site.js
```

The verifier checks the selected original projects, expected pages, GitHub Pages paths, and removed-project references.

## Publishing rule

Make and verify changes in the source worktree first. Then synchronize the same static-site files to the `gh-pages` worktree and run the verifier there before committing or pushing.
