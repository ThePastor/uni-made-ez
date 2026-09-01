# UNI Made EZ

Turn your own lecture PDFs, slides and notes into **flash cards, a summary, the key information and a quiz** — built in your browser. Nothing is uploaded anywhere: your files are read on your own device and never leave it.

**Live app:** https://thepastor.github.io/uni-made-ez/

---

## What it does

Add a subject for each course, drop in the week's material, and study it four ways.

- **Paste text or a link** — a transcript, a reading, your notes, or a web address (Wikipedia is read directly; other sites through a reader service that only sees the address), with no file to save first. ⌘V on the subject page opens the box.
- **Upload & scan** — PDF, EPUB, Word (.docx), PowerPoint (.pptx), text, Markdown, HTML, RTF, and photos of notes (JPG, PNG, WebP). Slide decks are read properly: bullets grouped under their slide title, fragments turned into a sentence, speaker notes included. The same reading uploaded twice — in any format — is caught and not doubled.
- **Figures and diagrams** — pictures and drawn diagrams are pulled out of PDFs with their captions, listed in Key information, and turned into "what does this figure show?" cards and "label the diagram" cards when the caption names the parts. Read entirely in the browser; the text is kept in the browser's own storage so a subject's materials are still there next time on the same device.
- **Scan reader (OCR)** — a scanned PDF with no text layer gets a **Read this scan** button, and a photo of printed notes is read as soon as it is added. The reader (Tesseract, English) is downloaded once — about 15 MB — and runs on your device; the row shows each stage and page as it goes. Sharp, upright print reads well; handwriting is hit-and-miss, and figures are worth checking against the original.
- **Citations** — every card, quiz answer, key-information pop-up, search hit and formula says which file and which page or slide it came from.
- **Free recall and long answers** — explain a concept in your own words, then see the material's version and grade yourself; or write an exam-style answer and mark it against a checklist of the key points (ticked automatically where your words match, self-ticked where they don't).
- **Today** — one deck mixing every subject, due cards first, dealt so consecutive cards come from different courses.
- **Flash cards** — definitions, acronyms and fill-the-gap cards with **spaced repetition (FSRS, the scheduler Anki uses)**: rate Again / Good / Easy and each card comes back when your chance of recalling it is about to fall below 90 % — the buttons show the interval before you press. Deck filters for Due / New / Weak / Mine / All, a printable cut-out sheet, a copy button for Quizlet, and an **Anki** button that downloads a deck file Anki imports directly.
- **Summary** — a short brief, key definitions, section-by-section points with each section's terms, takeaways, "By the numbers", a clickable outline and a "Test yourself" list. Short / Medium / Long.
- **Key information** — definitions, terms to know, acronyms, formulas, processes and steps, cause and effect, comparisons, examples, a section map, a timeline, figures and stats, names, and the lists found in the material. Tap anything for the full text in context.
- **Quiz** — multiple choice, true/false, fill-in-the-blank and order-the-steps, each answered as **Sure** or **Unsure** so the results can show where you were confidently wrong. **Practice** marks as you go; **Exam** is timed, hides feedback until you submit and auto-submits at zero. One control row under every question: **← Back** to revisit what you have already answered (the marking stands), **Restart** to replay the same set from the top, **Question types** to rebuild it with different types, length or mode, and **Settings**. Back, Restart and Question types are on the results screen too. Results show a per-type breakdown, a full review and your last twelve attempts.
- **Match game, formula sheet and concept map** — pair terms against the clock; print a one-page cram sheet of every equation — typeset as proper maths (fractions, roots, subscripts, Greek letters) — whether written in symbols, as a reaction or in words ("power is work divided by time"); and see which terms the material keeps mentioning together, with every concept it defines on the map.
- **Take it with you** — a **revision pack** (summary, key information, formula sheet, every card and a test-yourself list) to print, save as PDF or download as Markdown; the **Anki deck** file; and **backup & restore** — one `.json` file with a subject's files, text and all your progress, to keep safe or move to another device. These are real downloads here on the live site.
- **Install it** — tap **Install** in the top bar (on an iPhone: Share → Add to Home Screen) and UNI Made EZ sits on the home screen with its own icon, opens with no browser bar and works with no connection at all. Everything built into the page — your files, cards, summaries, quizzes and exports — works offline; reading a web address and the scan reader need a connection the first time.
- **Exam date and study plan** — set an exam date and the subject page shows a countdown, cards due, mastery and how many cards a day you need.
- **Semester view** — every subject on one screen: days to each exam, cards due, mastery, when you last studied, plus one dated timeline of every exam, assignment and reading. A subject that's behind is flagged plainly — exam near with low mastery, cards piling up, a week untouched, a deadline overdue.
- **Outcome map** — paste the course outline's learning outcomes and each is checked against your material and cards: **Covered**, **Thin** or **Not covered**, with the evidence quoted and cited — and for a gap, the honest line: *no cards, no material covering this*.
- **Deadlines & readings** — track assignments, readings, labs and quizzes beside the exam countdown, with overdue and due-soon flags and a satisfying done-tick.
- **Study log** — written automatically as you study: what, when, and how it went, day by day. Download the whole term as a `.csv` — dated evidence of the work if you ever need it for accommodations or a scholarship.
- **Confidence flags** — extractions the engine is less sure of (odd phrasing, or anything read by the scan reader) wear a small **check** chip telling you what to verify, instead of everything being presented with equal confidence.
- **Weak spots** — every wrong answer and every "Again" is tracked per term, with one tap to practise or quiz just those.
- **Make it yours** — add your own cards, turn any highlighted sentence into a card, edit any card the engine got wrong (its review schedule carries over — and a card you keep failing is flagged as a leech and offered a reword), star / note / hide anything, and label files by type, week and read status so a subject can hold the whole term while you study one week at a time.
- **Search** — press `/` to search every file in the subject.
- **Print** — a print stylesheet drops the interface and prints light-on-white.

## Accessibility

Built to WCAG 2.1 AA and tested for it. Text size (Normal / Large / Larger), a **Comfort reading** mode using Atkinson Hyperlegible with looser spacing and a shorter line length, light / dark / match-device themes and a reduce-motion switch all live behind the **Aa** button. Read-aloud buttons use the browser's own offline voice. "Skip to the main content" is the first tab stop, `?` lists every keyboard shortcut, and pop-ups trap and return focus properly.

## Privacy

Your course files never leave your device. There is no server, no analytics and no tracking — the whole app is this one HTML file. Subjects, progress and notes live in your browser's local storage, so they stay on the device you used and clearing site data removes them.

**Sign-ups:** Summary and Quiz ask for a name and email once. The page then opens a pre-filled email in your own mail app for you to send — the page cannot send anything itself.

## How it's built

One self-contained `index.html`: no build step to serve it, no dependencies to install, no network calls except the web fonts. The study material is produced by a **built-in extractive study engine**, not by a language model — it finds definitions, terms, numbers, dates, names and procedures in your actual sentences. Quality depends on how the material is written: textbook chapters and structured notes work best, and scanned PDFs and photos go through the built-in scan reader (OCR) first.

To change it, edit the sources in the parent project (`src/app.js`, `src/engine.js`, `src/parsers.js`, `src/styles.css`), run `node build.js`, and copy the new `dist/index.html` over this one.

## Version

The footer of every page shows the build — `v1.8 · 1 September 2026` — so you can tell at a glance which version is actually live after an upload. Hard-reload with `Cmd Shift R` if it still shows the old one.

## Who made it

Built by **Johnson[X]Corp**. The logo and the build stamp sit in the footer of every page.

## Licence

Personal project — all rights reserved unless stated otherwise.
