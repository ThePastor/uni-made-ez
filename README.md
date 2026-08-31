# UNI Made EZ

Turn your own lecture PDFs, slides and notes into **flash cards, a summary, the key information and a quiz** — built in your browser. Nothing is uploaded anywhere: your files are read on your own device and never leave it.

**Live app:** https://thepastor.github.io/uni-made-ez/
*(replace with your real address once GitHub Pages is switched on)*

---

## What it does

Add a subject for each course, drop in the week's material, and study it four ways.

- **Upload & scan** — PDF, EPUB, Word (.docx), PowerPoint (.pptx), text, Markdown, HTML, RTF. Read entirely in the browser; the text is kept in the browser's own storage so a subject's materials are still there next time on the same device.
- **Flash cards** — definitions, acronyms and fill-the-gap cards with **spaced repetition**: rate Again / Good / Easy and each card is scheduled (10 min → 1 d → 3 d → 7 d → ×ease, capped at six months). Deck filters for Due / New / Weak / Mine / All, a printable cut-out sheet, and a copy button for Anki or Quizlet.
- **Summary** — a short brief, key definitions, section-by-section points with each section's terms, takeaways, "By the numbers", a clickable outline and a "Test yourself" list. Short / Medium / Long.
- **Key information** — definitions, terms to know, acronyms, formulas, processes and steps, cause and effect, comparisons, examples, a section map, a timeline, figures and stats, names, and the lists found in the material. Tap anything for the full text in context.
- **Quiz** — multiple choice, true/false, fill-in-the-blank and order-the-steps. **Practice** marks as you go; **Exam** is timed, hides feedback until you submit and auto-submits at zero. Results show a per-type breakdown, a full review and your last twelve attempts.
- **Match game, formula sheet and concept map** — pair terms against the clock, print a one-page cram sheet of every equation with its symbols, and see which terms the material keeps mentioning together.
- **Exam date and study plan** — set an exam date and the subject page shows a countdown, cards due, mastery and how many cards a day you need.
- **Weak spots** — every wrong answer and every "Again" is tracked per term, with one tap to practise or quiz just those.
- **Make it yours** — add your own cards, edit any card the engine got wrong (its review schedule carries over), star / note / hide anything, and label files by type, week and read status so a subject can hold the whole term while you study one week at a time.
- **Search** — press `/` to search every file in the subject.
- **Print** — a print stylesheet drops the interface and prints light-on-white.

## Accessibility

Built to WCAG 2.1 AA and tested for it. Text size (Normal / Large / Larger), a **Comfort reading** mode using Atkinson Hyperlegible with looser spacing and a shorter line length, light / dark / match-device themes and a reduce-motion switch all live behind the **Aa** button. Read-aloud buttons use the browser's own offline voice. "Skip to the main content" is the first tab stop, `?` lists every keyboard shortcut, and pop-ups trap and return focus properly.

## Privacy

Your course files never leave your device. There is no server, no analytics and no tracking — the whole app is this one HTML file. Subjects, progress and notes live in your browser's local storage, so they stay on the device you used and clearing site data removes them.

**Sign-ups:** Summary and Quiz ask for a name and email once. The page then opens a pre-filled email in your own mail app for you to send — the page cannot send anything itself.

## How it's built

One self-contained `index.html`: no build step to serve it, no dependencies to install, no network calls except the web fonts. The study material is produced by a **built-in extractive study engine**, not by a language model — it finds definitions, terms, numbers, dates, names and procedures in your actual sentences. Quality depends on how the material is written: textbook chapters and structured notes work best, and scanned PDFs with no text layer need OCR first.

To change it, edit the sources in the parent project (`src/app.js`, `src/engine.js`, `src/parsers.js`, `src/styles.css`), run `node build.js`, and copy the new `dist/index.html` over this one.

## Licence

Personal project — all rights reserved unless stated otherwise.
