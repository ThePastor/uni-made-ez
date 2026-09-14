# UNI Made EZ — Submission to the Thompson Rivers University Board

**Application:** UNI Made EZ · <https://thepastor.github.io/uni-made-ez/>
**Publisher:** JohnsonXCorp (Anndy Johnson), British Columbia
**Version reviewed:** v2.36, 14 September 2026
**Request:** that TRU permit instructors to recommend UNI Made EZ to students as an optional study
companion.
**Cost to the university and to students:** none. Free, no account, no licence, no procurement.

---

## 1. What is being asked for, precisely

Permission for an instructor to say to a class: *"there is a free study tool you may find useful."*

Not adoption. Not integration. Not a contract. Nothing is asked of TRU's systems, TRU's data, TRU's
identity provider, TRU's LMS, or TRU's budget. A student opens a web page or does not.

The distinction matters legally, and it is the first thing to settle:

> **TRU discloses no personal information to this application, ever.** Nothing flows from the
> university to the publisher. A student's relationship with the application is direct and
> voluntary, on their own device. Recommending the application is not a disclosure of personal
> information by a public body, and therefore does not engage FIPPA s. 33 or the s. 30.1 storage
> provisions at all.

What follows is offered anyway, because a board is entitled to know what it is pointing students at.

## 2. The one-paragraph answer

UNI Made EZ runs **entirely inside the student's browser**. Course files a student adds — lecture
PDFs, slide decks, readings — are read by code already on their device and **are never transmitted
anywhere**. The application makes **no third-party network request of any kind**. It sets no
cookies, loads no analytics, has no advertising, and cannot see a single thing a student studies.
The only information the publisher can ever hold about a student is a **name and email they may
optionally choose to give**, which is stored **in Canada** and deleted on request; **no feature is
withheld** from a student who declines. These are not assurances — they are enforced by automated
tests that fail the build, and they are verifiable by anyone in about two minutes (§7).

## 3. Privacy

**Full notice:** [`docs/Privacy_Notice.md`](Privacy_Notice.md). Summary of the material facts:

| Question a privacy office asks | Answer |
|---|---|
| What personal information is collected? | A name and email address, only if the student types them into an optional form. Nothing else. |
| Is anything else typed by a student ever sent? | One thing, added in v2.34, and only on request: the **name of a subject** — one or two words such as `Nursing` — if a student sets a course to *Other* and chooses to answer one optional question about what they are studying. It is sent **with no device id and no other field**, so there is no column in that table to join it to a visit or a person, and it is filtered to letters and spaces, four words, 40 characters, in the page and again in the database. Skipping sends nothing and withholds nothing. |
| Is providing it a condition of use? | **No.** Since v2.27 every feature works identically without it. |
| What happens to course files and student work? | Read in the browser; never transmitted. Held in that browser's storage on that device. |
| Where is personal information stored? | PostgreSQL on Supabase, **Canadian region `ca-central-1`**. It does not leave Canada. |
| Who can read it? | The publisher only. The key embedded in the public page can write and **cannot read**, enforced twice over — it holds no read *privilege* on the tables, and separately the tables' row rules return nothing to it. Verified empirically by attempting to read, alter and delete with that key and being refused each time. An audit on 14 September 2026 found only the second of those two mechanisms in place and added the first; the finding and the fix are recorded in [`Counter_Security_Hardening.sql.md`](Counter_Security_Hardening.sql.md) rather than quietly corrected. |
| Cookies, analytics, advertising, trackers, third-party scripts? | **None of any kind.** As of v2.27 even the web fonts are embedded rather than fetched, so no visitor's IP address reaches any third party. |
| Retention? | Name and email: deleted within 30 days of request, and when the app is retired. Anonymous counter rows and subject names: while the app is published. On-device data: the student deletes it by clearing site data. |
| Access, correction, deletion? | By email, no form, no fee, no reason needed; answered within the 30 business days BC PIPA requires. Escalation to the OIPC is stated in the app. |
| Which law applies to the publisher? | BC PIPA. The publisher is a BC organisation; a designated privacy contact is published in the app and in the notice. |
| Is a PIA needed? | TRU's PIA process is triggered by TRU implementing a system. Nothing is being implemented, and no TRU data is involved. If the university wishes to document one anyway, [`docs/PIA_Response.md`](PIA_Response.md) answers the standard questions in advance. |

**One thing worth stating plainly**, because it is the usual objection to study tools and it is the
reason this one is built the way it is: the common pattern — upload your readings and slides to a
company's servers — means disclosing the instructor's own copyrighted material, and the publisher's
readings, to a third party. **That does not happen here.** A student using UNI Made EZ discloses
their course material to nobody, including the publisher. This is architectural, not a policy
promise: the code has no path to send it.

**A note on candour.** In August 2026 a visitor counter was added while the app's privacy page still
said nothing at all left the browser. That was untrue for two releases. It was corrected in v2.27,
the correction is described in the application itself rather than quietly edited, and an automated
test now fails the build if the absolute claim ever returns. The board should weigh that both ways:
it is a mistake, and it is the reason the current claims are tested rather than asserted.

## 4. Legality

| Area | Position |
|---|---|
| **Privacy law** | BC PIPA. Consent-based, purpose-limited, minimal collection, retention limit, access/correction/deletion rights, named privacy contact, breach notification undertaken voluntarily. See §3. |
| **Copyright — the app** | Entirely original work of the publisher. `LICENSE`, `TERMS.md` and the in-app **#/rights** page state the position. |
| **Copyright — third-party components** | PDF.js (Apache 2.0), JSZip (MIT), Tesseract.js (Apache 2.0), and four typefaces under the SIL Open Font Licence. Each used under its own licence; notices travel with every copy in `THIRD-PARTY-NOTICES.md`. |
| **Copyright — course material** | **No textbook, reading or publisher's content is reproduced.** The authored Law and Precalculus courses were written from scratch against the *structure* of a course outline. Where a set text is relevant the courses **name it and point at the chapter**; they do not copy it. This was a deliberate refusal at the point the material was built. |
| **Copyright — student uploads** | A student's files never leave their device, so the application never copies, stores, transmits or reproduces anyone's copyrighted material. The app tells students to upload only what they are entitled to use, and says plainly that because the files stay on the device, nobody else can check that for them. |
| **Consumer protection** | Free of charge, no payment, no subscription, no data-for-access trade, no dark patterns. Warranty and liability terms do not purport to limit rights that cannot be limited by agreement. |
| **Governing law** | British Columbia and the federal laws of Canada applying there. |
| **Not legal advice** | The Law courses say so, in the courses and on the legal page. |

## 5. Usefulness

The pedagogy is not decorative, and it is the part most worth an instructor's scepticism.

- **Spaced repetition with FSRS.** Review scheduling uses a modern forgetting-curve scheduler, not
  fixed intervals. Spacing and retrieval practice are among the best-evidenced effects in learning
  science.
- **Retrieval before recognition.** Cards ask the student to produce the answer before seeing it.
- **Hints that cannot leak the answer.** Every generated question offers an optional hint *before*
  answering. The hint is constructed from structure — where the answer comes from, what shape it
  has — and an automated test rejects any hint containing its own answer.
- **Wrong answers are explained as wrong.** Feedback says what the option the student *chose*
  actually is, not merely what the correct one was.
- **Mastery is earned and can be lost — asymmetrically.** Ordinary practice can raise a skill to
  *Proficient* and can **never** lower it (a tool that punishes practice teaches students not to
  practise). Only a spaced *Mastery Challenge* — six questions across three skills, pairs
  deliberately separated, available once every twelve hours — reaches *Mastered* or takes a level
  away.
- **Two kinds of material, honestly distinguished.** Material built from a student's own files is
  **extracted, not understood**: pattern-matched, capable of characteristic errors, and every card
  shows the source passage so the student can check it in one glance. The authored courses were
  written by a person and carry reasons and worked examples. The app never blurs the two.
- **Works offline, installs to a phone, costs nothing, needs no account.** The students for whom
  this matters most are the ones for whom it matters most.

**What it does not do, and says so:** it does not write assignments, does not submit anything
anywhere, promises no mark, and is a companion to a course rather than a source to cite.

## 6. Academic integrity

TRU's *Student Academic Integrity Policy* **ED 5-0** governs, and TRU's guidance — that the use of
AI-assisted tools in coursework is a matter for the instructor, and that students should not upload
instructor-created or copyrighted course content to AI tools without permission — is reproduced
inside the application, in the student's own reading path, at **#/rights → Academic integrity**.

The application is aligned with that guidance by construction:

1. **It produces no submittable work.** It makes cards, summaries, key-information lists and quiz
   questions *from the student's own course material, for the student to revise from*. Handing any
   of it in would be the same problem as handing in the lecturer's slides — and the app says exactly
   that, in those words.
2. **It submits nothing, anywhere, ever.** There is no integration to submit through.
3. **It resolves the upload objection rather than arguing with it.** The concern that using a study
   tool means giving a company the instructor's slides and the publisher's readings does not apply,
   because the files never leave the device.
4. **The order of operations is stated for students**: ask your instructor first, then use it in the
   way they allowed.

An instructor who wishes to prohibit it can, and the application does not encourage a student to
work around that.

## 7. How to verify all of this in two minutes

The board does not have to take any of the above on trust, and should not.

1. Open <https://thepastor.github.io/uni-made-ez/> and press the key that opens developer tools.
2. Open the **Network** tab and clear it.
3. Add any PDF or slide deck as course material, and generate cards, a summary and a quiz from it.
4. **Watch the list.** Nothing is uploaded. Nothing is posted. Nothing goes off-origin.
5. Turn the network off and reload. It still works.

The source is public at <https://github.com/ThePastor/uni-made-ez>. The test that proves step 4 —
loading real documents with every request and request body recorded, then asserting that no request
left the origin and that no word of the material appeared in any of them — is
[`test/legal.js`](../test/legal.js), and it runs on every build alongside contrast, accessibility,
structure and offline suites.

## 8. Professionalism and support

- **Named publisher**, named privacy contact, named accessibility contact — all in the application,
  not buried in a repository.
- **Versioned releases** with a visible build stamp and an in-app changelog, so anyone can tell
  which build they are looking at.
- **Public source** and a public issue tracker.
- **Barrier and defect reports:** acknowledged within 5 business days; fix or dated plan within 30.
- **Privacy requests:** answered within 30 business days, per PIPA.
- **Institutional questionnaires** (privacy, security, accessibility/VPAT) completed in writing on
  request.

## 9. Residual risks, stated by the publisher rather than found by the board

An honest submission names its own weaknesses.

| Risk | Mitigation and current status |
|---|---|
| **Extraction errors.** Generated cards can be wrong — a table run together, a "not" carried into the wrong half. | Disclosed prominently as "extracted, not understood"; low-confidence items flagged; every card links to its source passage. Cannot be eliminated. |
| **Single maintainer.** Continuity depends on one person. | Source is public; the app is a single static file and works offline, so an existing installation keeps working regardless. No student data would be stranded — it is already on their device. |
| **No independent accessibility audit.** | Automated AAA-contrast, structure, keyboard and reflow tests run on every build; known gaps (NVDA/JAWS untested, maths not MathML) are listed in the accessibility statement rather than hidden. |
| **A student may still misuse it.** | No tool can prevent that. The app produces nothing submittable, states the integrity position in the student's path, and points at ED 5-0. |
| **Course content beyond the current chapters is incomplete.** | The authored Law courses are written through the first-midterm material; later chapters are in progress. Coverage is visible in the app; nothing is presented as complete when it is not. |

---

## Attachments

| Document | What it is |
|---|---|
| [`Privacy_Notice.md`](Privacy_Notice.md) | The operative privacy notice |
| [`PIA_Response.md`](PIA_Response.md) | Vendor answers to a standard privacy impact assessment |
| [`Accessibility_Statement.md`](Accessibility_Statement.md) | WCAG 2.1 AA conformance statement with known gaps |
| [`Counter_Subjects.sql.md`](Counter_Subjects.sql.md) | The schema, filter and access rules behind the subject question in §3, so the claims there can be read rather than taken |
| [`Counter_Security_Hardening.sql.md`](Counter_Security_Hardening.sql.md) | A database security audit, what it found, what was changed, and the verification afterwards |
| [`TERMS.md`](../TERMS.md) · [`LICENSE`](../LICENSE) · [`THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md) | Terms, licence, component notices |
| **#/rights** in the application | The same material written for a student |

*Prepared 14 September 2026 for v2.36. Contact: johnsonandy242@gmail.com*
