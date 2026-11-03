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

### The voice tutor (from v2.78) — downloaded only when the student presses its download button
- **WebLLM** (`@mlc-ai/web-llm` 0.2.84), from jsDelivr, with its compiled model
  library from `raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs`.
  **Apache License 2.0**. <https://github.com/mlc-ai/web-llm>
- **Qwen2.5-1.5B-Instruct** (MLC `q4f16_1` / `q4f32_1` builds), weights from
  Hugging Face (`mlc-ai/Qwen2.5-1.5B-Instruct-*-MLC`). © Alibaba Cloud.
  **Apache License 2.0**. <https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct>
- **kokoro-js** 1.2.1, from jsDelivr. **Apache License 2.0**. It loads
  Transformers.js (**Apache 2.0**) and ONNX Runtime Web (**MIT**).
  <https://github.com/hexgrad/kokoro/tree/main/kokoro.js>
- **Kokoro-82M** voice model (`onnx-community/Kokoro-82M-v1.0-ONNX`), from
  Hugging Face. © hexgrad. **Apache License 2.0**.
  <https://huggingface.co/hexgrad/Kokoro-82M>

All of it runs on the student's own device; nothing the student types or hears
is sent to any of these projects.

### R in the R course (from v2.86) — downloaded only when the student agrees on first Run
- **webR** 0.5.7, from `webr.r-wasm.org`. © Posit Software, PBC. **MIT License**.
  <https://github.com/r-wasm/webr>
- **R**, compiled to WebAssembly as part of webR. © The R Core Team. **GNU GPL
  version 2 or 3**. <https://www.r-project.org/Licenses/> It is fetched as a
  separate program at run time and is not part of this app's file.

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
