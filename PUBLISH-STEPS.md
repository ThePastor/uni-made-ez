# Published — how to update it

UNI Made EZ is live at **https://thepastor.github.io/uni-made-ez/**
Repo: https://github.com/ThePastor/uni-made-ez (public, branch `main`, folder `/ (root)`)
First published 31 August 2026 as build v1.0.

## Checking which build is live

Every page shows the build in its footer, bottom right:

> BUILT BY  **Johnson[X]Corp**  **V1.9 · 1 SEPTEMBER 2026**

That is the way to confirm an upload actually landed. If it still shows the old
version after uploading, it's your browser's cache — reload with `Cmd Shift R`.

## Publishing a new build

Claude rebuilds and leaves the file at `~/Desktop/UNI_Made_EZ/github/index.html`.

**The quick way:** double-click **`Publish to GitHub.command`** in that folder. It
commits and pushes for you, then opens the live site so you can check the footer.
The first run sets git up in the folder; after that it's one double-click.

If git isn't signed in on this Mac, the script falls back automatically — it opens
GitHub's upload page and highlights `index.html` in Finder for you to drag across.

**By hand, if you prefer:**

1. Open https://github.com/ThePastor/uni-made-ez
2. **Add file → Upload files**
3. Drag `index.html` from `~/Desktop/UNI_Made_EZ/github/` into the drop area
   (about 1.8 MB — give it a few seconds)
4. **Commit changes**

Same filename, so it replaces the old one. Live within a minute or two.
Then open the site and check the footer shows the new build.

## On your phone

Open the address in Safari, then **Share → Add to Home Screen**.

The owner access code (`TRU-EZ-2026`) works on the live site — it needs a secure
https page, which GitHub Pages gives you and a local file does not.

## The standing rule

**Every change to this project goes to GitHub Pages as well as the Claude artifact.**
Not on request — by default, every time. Claude rebuilds, bumps the build stamp,
runs the tests and leaves the new `github/index.html` ready to publish.

## For Claude, next time

- Edit `src/`, then `node build.js` — it writes `dist/` **and** `github/index.html`.
- Bump `const BUILD = { v, date }` at the top of `src/app.js` in the same change,
  so the footer proves the upload worked.
- Run the test suites before handing the file over: `fixes`, `mine`, `e2e`,
  `study`, `tools`, `keys2`, `a11y`, `exports`, `ocr`, `input`, `learn`, `structure`, `five`, `pwa`, `update`, `print`, `mobile`, `debug`, `longcard`.
- Publish the Claude artifact from `dist/unimadeez.html` too, so the artifact and
  the live site stay on the same build.
