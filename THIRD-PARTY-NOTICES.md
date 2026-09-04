# Third-party notices

UNI Made EZ is proprietary (see [LICENSE](LICENSE)), but it is not written from
nothing. The components below are other people's work, each under its own
licence. Those licences govern those components — the UNI Made EZ licence does
not restrict your rights in them, and this file exists because most of them
require their notices to be kept with any copy.

Two of them are **bundled into the built page**, so a copy of `index.html` is a
copy of them too. Two more are **fetched at run time** and are never part of the
file.

---

## Bundled into index.html

### PDF.js — `pdfjs-dist` 3.11.174
Reads PDFs: text with its position on the page, and the figures.
Copyright © Mozilla Foundation and contributors.
Licensed under the **Apache License, Version 2.0**.
<https://www.apache.org/licenses/LICENSE-2.0> · <https://github.com/mozilla/pdf.js>

> Apache-2.0 requires that this notice, the copyright notice and the licence
> text travel with any redistribution, and that changed files are marked. The
> files are bundled unmodified.

### JSZip — 3.10.1
Unpacks `.docx`, `.pptx` and `.epub`, which are zip archives underneath.
Copyright © Stuart Knightley and contributors.
Dual-licensed **MIT or GPL-3.0-or-later**; used here under the **MIT** licence.
<https://github.com/Stuk/jszip/blob/main/LICENSE.markdown>

---

## Fetched at run time (not part of the file)

### Tesseract.js — 6.0.1
The scan reader (OCR), downloaded from cdnjs the first time a scan is read, with
its WebAssembly core from jsDelivr and its English model from
`tessdata.projectnaptha.com`. It runs on the reader's own device.
Licensed under the **Apache License, Version 2.0**.
<https://github.com/naptha/tesseract.js>

### Google Fonts — Inter, Inter Tight, JetBrains Mono, Atkinson Hyperlegible
Loaded from `fonts.googleapis.com`. Each is licensed under the **SIL Open Font
License 1.1**. <https://scripts.sil.org/OFL>

---

## Development only (never shipped)

### axe-core — 4.10.2
Used by the accessibility test suite. Licensed under the **Mozilla Public
License 2.0**. It is a development dependency and is not included in any built
file.

### Playwright
Drives the eighteen test suites. Licensed under the **Apache License, Version
2.0**. Development only.

---

## What this means in practice

- Keeping this file, and the copyright headers inside the bundled libraries, is
  what keeps the build compliant. Do not strip comments out of the vendored
  library files during any minification step.
- None of these licences are "viral" as used here. Apache-2.0 and MIT are
  permissive: they let a proprietary application include them, provided the
  notices are kept. The MPL-2.0 component (axe-core) is never shipped, and
  JSZip is taken under its MIT option, not its GPL option.
- If a component is ever swapped for one under a copyleft licence such as
  GPL-3.0, that would change what UNI Made EZ itself can be licensed as. Check
  the licence before adding a dependency.

Last reviewed: 4 September 2026, build v2.9.
