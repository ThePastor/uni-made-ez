# Accessibility Statement — UNI Made EZ

**Publisher:** JohnsonXCorp, British Columbia, Canada
**Application:** UNI Made EZ — <https://thepastor.github.io/uni-made-ez/>
**Version:** v2.27, 14 September 2026
**Standard targeted:** WCAG 2.1 Level AA, with Level AAA contrast for body text
**Feedback / barrier reports:** johnsonandy242@gmail.com

## Conformance

UNI Made EZ **partially conforms** to WCAG 2.1 Level AA. "Partially" is used honestly: the
machine-testable success criteria are tested on every build, and the criteria that require human
judgement have been reviewed by the developer but not by an independent assessor. Section 4 lists
every known gap.

Two provincial contexts are relevant. The *Accessible British Columbia Act* (2021) obliges
prescribed public-sector organisations — including post-secondary institutions — to work on removing
barriers; the province's technical accessibility standards were still being developed when this was
written, so **WCAG 2.1 AA is used as the operative benchmark**, as it is federally under the
*Accessible Canada Act* and in Ontario under the AODA. This statement is written so an institution
can attach it to its own accessibility plan without having to re-derive the facts.

## 1. What is tested automatically, on every build

These are not claims; they are assertions in the repository's test suites, and a failure stops the
build.

| Area | What is enforced | Suite |
|---|---|---|
| **Contrast** | Every rendered text node on twelve representative pages, in **both** the light and the dark theme, is measured against the background it actually composites onto. Small text must reach **7:1 (AAA)**, not the 4.5:1 AA minimum. Decorative elements must be `aria-hidden`, or they are counted as text. | `test/contrast.js` |
| **Structure and semantics** | Heading order, landmark regions, labelled form controls, accessible button names, live regions for results, a document title that changes with the route. | `test/a11y.js`, `test/structure.js` |
| **Reflow** | No horizontal scrolling at 320–375px on any page; tables and diagrams scroll inside their own containers rather than the page. | `test/layout.js`, `test/spacing.js` |
| **Offline** | The installed application starts and works with no network. | `test/pwa.js` |
| **No data leaves the device** | Relevant to accessibility because it is what lets the app work offline and without an account. | `test/legal.js` |

Contrast is the one worth dwelling on. An earlier version passed axe-core, which enforces AA, while
sixteen small-text colour pairs sat between 5.2:1 and 6.9:1 — legal, and harder to read than
necessary. The AAA floor was adopted because most of this interface is small text: labels, tags,
build stamps, footnotes.

## 2. Built-in accommodations

- **Three text sizes** and a **comfort reading mode** (wider spacing, longer line height), both
  persistent, both independent of browser zoom.
- **Light and dark themes**, following the system setting by default and overridable.
- **Full keyboard operation.** Everything clickable is reachable and operable from the keyboard,
  focus is always visible, and every page begins with a skip link to the main content.
- **Never colour alone.** Correct, incorrect, due, overdue and mastery level are each carried by a
  word or a shape as well as a colour (WCAG 1.4.1).
- **Reduced motion** is respected via `prefers-reduced-motion`.
- **Atkinson Hyperlegible** — a typeface designed by the Braille Institute for low-vision readers —
  is the body face, and since v2.27 it is embedded in the page rather than fetched, so it renders
  correctly offline and on a slow connection instead of falling back.
- **Works offline and installs to the home screen**, which matters where network access is
  unreliable or metered.
- **No account, no sign-in, no time limits, no CAPTCHA.**
- **Exports** to plain text, Markdown, CSV and Anki, so material can be taken into whatever
  assistive tooling a student already uses.

## 3. Assistive technology tested

| Technology | Status |
|---|---|
| VoiceOver (macOS, Safari) | Tested by the developer |
| Keyboard-only, no pointer | Tested, automated and manual |
| Browser zoom to 200% and 400% | Tested |
| Reduced-motion and forced-colours preferences | Tested |
| NVDA, JAWS, TalkBack | **Not yet tested** |

## 4. Known limitations, stated rather than hidden

1. **No independent audit.** No third-party accessibility assessor has reviewed this application.
2. **Screen readers other than VoiceOver are untested.** NVDA and JAWS in particular.
3. **Mathematical notation is presented as styled text, not MathML.** A screen reader will read it
   linearly and may mis-speak some expressions in the precalculus material.
4. **Optical character recognition of scanned pages is imperfect.** A student working from a poor
   scan will get poor cards. The application flags low-confidence extractions but cannot fix them.
5. **PDF extraction inherits the source document's accessibility.** A PDF that is an image of text,
   or has no reading order, produces worse results. The application cannot repair an inaccessible
   source file.
6. **Some course diagrams are described in text but are not tactile-ready.**

## 5. Reporting a barrier

Anything in this application that is unusable with a screen reader, a keyboard, a switch device, at
high zoom, or with any other assistive technology is treated as a **defect**, not a feature request.

Email **johnsonandy242@gmail.com**, or open an issue at
<https://github.com/ThePastor/uni-made-ez/issues>. Say what you were trying to do and what happened.
Acknowledgement within 5 business days; a fix or a dated plan within 30.

## 6. If an institution needs more

The publisher will complete an institution's own accessibility questionnaire or VPAT template in
writing on request, and will prioritise a barrier reported by a student through their institution's
accessibility services office.

---

*Last reviewed: 14 September 2026 (v2.27). Reviewed on every release, because the automated portion
runs on every build.*
