# Curriculum spine — eleven disciplines, forty-four course slots

**Status: all five decisions taken. Decisions 1–3 shipped in v2.37; 4 and 5 answered 15 September 2026.**
Prepared 14 September 2026 against build v2.36; updated 16 September 2026 for v2.42.

This is step 1 of the tutoring expansion brief. It is a map, not a course. Its job is to let you
reject a shape before several hundred lessons are written to it.

---

## What is already built

| Discipline | Course | Level | Prereq | Units | Lessons | Practice |
|---|---|---|---|---|---|---|
| Mathematics | Precalculus | `Preparatory` | — | 6 | 25 | 77 |
| Law | BLAW 2910 Commercial Law | `Intermediate` | — | 6 | 15 | 32 |
| Law | BLAW 3930 Environmental Law | `Advanced` | BLAW 2910 | 5 | 11 | 24 |
| Accounting | Financial Accounting | `Foundation` | — | 9 | 27 | 81 |
| Physics | Mechanics | `Foundation` | Precalculus | 4 | 12 | 39 |
| Chemistry | General Chemistry | `Foundation` | — | 4 | 12 | 40 |
| Economics | ECON 1950 Principles of Macroeconomics | `Foundation` | — | 9 | 27 | 99 |

Seven courses across six disciplines. Four disciplines still have nothing: Biology, Computer
Science, Statistics and Marketing. English was taken off the list — see decision 5. At the fidelity of those four
— roughly 600 to 1,000 lines of authored data each — forty courses is on the order of 30,000 lines.
That is the number that makes the staging non-negotiable.

The Accounting course is the first one built to the shape this document proposes: a level from the
one vocabulary, a `prereq` field, and a `gaps` list that names on the page what the course does not
teach. It is also the first transferred rather than authored here — see the twelve-module table in
the Accounting section below.

As of v2.40 it is the first course to be **finished**: all twelve modules of its outline are built.
Precalculus and the two Law courses were completed in v2.39. The remaining depth work is Physics and
Chemistry, each of which teaches four units of a longer syllabus, with the rest named in their gaps.

---

## Five decisions that need your call before authoring starts

These are the things I would otherwise have to guess at, and guessing costs a rebuild. All five are
now answered; each decision keeps its original wording, with the answer recorded underneath it, so
the reasoning that led to the call is still readable rather than replaced by its outcome.

### 1. There is no prerequisite field. One has to be added.

The brief requires every course to state its prerequisite "so the progression is a real chain a test
can walk rather than a claim in a blurb". The schema has no such field today. This needs:

- `prereq: '<course id>'` (or `null` for an entry point) on the course object;
- the course card and course page to render it, with the prerequisite's **title** resolved from its
  id rather than retyped, so a rename cannot desynchronise them;
- a test that every non-null `prereq` resolves to a registered course, and that the chain has no
  cycles and no orphans.

**Proposed.** Small app change, belongs in the exemplar release.

**✅ Done in v2.37.** `prereq` is on the course object; the course page renders a *Comes after* note
that resolves the prerequisite's title from its id and links to it; `test/courses-acct.js` asserts
every `prereq` resolves, that no course is its own ancestor, that at least one course has none, and
that a course never sits at or below the level of the course it comes after.

### 2. "Foundation" would mean two different things

You chose Foundation → Intermediate → Advanced → Professional for Law, Accounting and Marketing.
Precalculus is already labelled `Foundation`, where it means *below first year* — preparatory. If
both ship, "Foundation" means "level 1 of 4" in Accounting and "level 0, before we start" in
Mathematics. Same word, two meanings, side by side on one page.

**Proposed:** rename Precalculus's level to **`Preparatory`**. One word on one existing course,
and it makes "Foundation" unambiguous everywhere else.

**✅ Done in v2.37.** Precalculus is `Preparatory`; the Law courses moved off "Second year"/"Third
year" to `Intermediate`/`Advanced`; the new Accounting course is `Foundation`. The test asserts every
course's level comes from the one five-word vocabulary, so a fifth wording cannot appear quietly.

### 3. The two existing Law courses carry TRU codes, and you chose generic numbering

You chose "no TRU codes anywhere — portable to any student at any institution". BLAW 2910 and
BLAW 3930 predate that decision and were built from real outlines; their codes are effectively part
of their identity, and a TRU student searching "BLAW 2910" finds them.

**Proposed:** new courses are generic; those two keep their codes. If you would rather be consistent,
say so and they become "Commercial Law" and "Environmental Law" — it is a two-line change, and I would
rather ask than quietly do either.

**✅ Taken as proposed in v2.37.** The two Law courses keep their TRU codes. Financial Accounting
carries no code — its `code` is the plain words "Financial Accounting" — even though it was built
from a real ACCT 2210 outline. Still reversible in two lines if you want consistency.

### 4. Four disciplines cannot ask a numeric question, and two of them should be able to

`src/subjects.js` switches `numeric` **off** for `cs`, `law`, `mktg` and `eng`, and `order` off for
`eng`. Checked in code, not from memory:

| Discipline | numeric | mc | order | spot | Practice kinds available to a course |
|---|---|---|---|---|---|
| math, physics, chem, bio, stats, acct, econ | yes | yes | yes | yes | **numeric, mc, order, spot** |
| cs, law, mktg | **no** | yes | yes | yes | **mc, order, spot** |
| eng | **no** | yes | **no** | yes | **mc, spot** |

For Law that is right — Law genuinely has no arithmetic. For **Marketing** and **Computer Science**
it is a real loss. Marketing has customer lifetime value, break-even, market share and return on
marketing investment; Computer Science has running times, bit arithmetic and Big-O comparisons. Under
the profile as it stands, a marketing course cannot ask you to *compute* a lifetime value — it can
only offer four numbers and ask which is right, which trains recognition rather than the calculation.

That flag was designed for a different job: deciding what to extract from a student's *uploaded
document*, where marketing slides genuinely rarely contain meaningful arithmetic. Applying it
unchanged to *authored courses* is a category error.

**Three ways out, and I recommend the third:**

- **(a) Honour it strictly.** The brief's non-negotiable #1, taken literally. Self-consistent app;
  Marketing and CS practice is weaker than it should be.
- **(b) Change the profile** so `mktg` and `cs` allow numeric. Fixes courses and changes how every
  *uploaded* marketing document is read — a much larger blast radius, for a reason that has nothing
  to do with uploaded documents.
- **(c) Let an authored course carry `types` of its own**, defaulting to the profile and overriding
  it only where the course states a reason. Uploaded documents keep the profile untouched; an
  authored Marketing course may ask for a CLV. The test asserts that any override is explicit and
  carries its reason, so it cannot happen by accident.

This is the only one of the five I feel strongly about.

**✅ Decided 15 September 2026: option (c) — a course-level `types` override, with a stated reason.**
An authored course may carry its own `types`, defaulting to the subject profile and overriding it
only where the course says why. Uploaded documents keep the profile untouched, so how the engine
reads a marketing slide deck is unchanged. A test asserts that every override is explicit and
carries its reason, so it cannot happen by accident or spread quietly. Built alongside the Computer
Science and Marketing courses, which are the two that need it.

### 5. English is the discipline this app can help least with

With `numeric` and `order` both off, English practice is **mc and spot only**. That is workable for
"which reading does this evidence actually support" and "spot the unsupported claim", and useless for
anything resembling an essay — which is how English is assessed. I can build four honest courses of
close reading, rhetoric and argument analysis. I cannot build something that improves your essay mark,
and the course pages will say so. If you would rather I skip English entirely than ship something
that can only help around the edges, that is a defensible call — tell me now rather than after it is
written.

**✅ Decided 15 September 2026: skip English for now.** Nine profiles get authored courses; English
keeps the general upload engine, which reads an English handout as English and builds cards, a
summary, key information and a quiz from it exactly as before. Nothing is taken away — what is not
added is a set of authored courses that could only have helped around the edges of how the subject
is actually assessed. Being honest by omission is better here than shipping four courses with a
disclaimer at the top of each saying what they cannot do. Revisit if a way to mark writing appears:
the profile change needed would be the same course-level `types` override that decision 4 introduces,
applied to `eng`.

---

## The level vocabulary

You chose **one vocabulary throughout** — no year numbers, no institution's course codes — so a
student at any university reads the same five words:

| Level | Means | Built at this level today |
|---|---|---|
| `Preparatory` | Below the first course: what you need before the sequence starts | Precalculus |
| `Foundation` | Level 1 of 4: the methods named and practised | Financial Accounting · General Chemistry · Mechanics · Principles of Macroeconomics |
| `Intermediate` | Level 2 of 4: you choose the method, it is not handed to you | BLAW 2910 Commercial Law |
| `Advanced` | Level 3 of 4: you justify the choice against alternatives | BLAW 3930 Environmental Law |
| `Professional` | Level 4 of 4: the edges, the disputes, and what the method cannot settle | — |

This replaces the two-vocabulary split an earlier draft of this document proposed. As of v2.37 it is
enforced rather than documented: `test/courses-acct.js` fails the build if any course carries a level
outside those five words, and fails it again if a course sits at or below the level of the course it
says it comes after.

The rubric from the brief applies identically in every discipline: **level 1** names the method,
**level 2** makes you choose it, **level 3** makes you justify it, **level 4** takes you to the edges
where the standard answer stops working. The difference has to show up in the questions, not the prose.

---

## The eleven disciplines

Entries marked **exists** are already built. Everything else is a slot, not a promise.

### Mathematics — `math` · numeric, mc, order, spot

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Preparatory | **Precalculus** *(exists)* | — | Functions; Linear functions; Polynomial and rational functions |
| Foundation | **Calculus for Business and Economics** ← *exemplar* | Precalculus | Limits and continuity; The derivative and its rules; Marginal analysis; Optimisation; Exponentials, logarithms and growth; The integral as accumulation |
| Intermediate | **Linear Algebra** | Calculus for Business and Economics | Systems and row reduction; Matrix algebra and inverses; Vector spaces, basis and rank; Determinants; Eigenvalues and diagonalisation |
| Advanced | **Real Analysis** | Linear Algebra | The real numbers and completeness; Sequences and limits done properly; Continuity and uniform continuity; Differentiation theorems; The Riemann integral |
| Professional | **Probability and Measure** | Real Analysis | Measure and σ-algebras; Integration and convergence theorems; Random variables and independence; Laws of large numbers; The central limit theorem |

**Honest note.** Fourth-year pure mathematics is a seminar and a problem set, not a quiz. Practice
items in this format can check that you can *state* a theorem's hypotheses and spot where a proof
uses them — which is genuinely useful — but they cannot make you construct a proof, and the course
page will say so. The first three levels are well served by this format.

### Physics — `physics` · numeric, mc, order, spot

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Mechanics** ✅ **built, v2.38** | Precalculus | Measurement, units and estimation; Describing motion; Newton's laws and free-body diagrams; Work, energy and power |
| Intermediate | **Electromagnetism** | Mechanics | Electrostatics and Coulomb's law; Fields, potential and energy; Capacitance and dielectrics; Current, resistance and circuits; Magnetic fields and forces; Induction and Faraday's law |
| Advanced | **Quantum Mechanics** | Electromagnetism | The failures of classical physics; The wavefunction and Schrödinger's equation; The infinite well and the harmonic oscillator; Operators, eigenvalues and measurement; Angular momentum and spin; The hydrogen atom |
| Professional | **Statistical Mechanics** | Quantum Mechanics | Microstates, entropy and the Boltzmann distribution; Ensembles and partition functions; Classical and quantum ideal gases; Bose–Einstein and Fermi–Dirac statistics; Phase transitions and critical behaviour |

**Honest note.** Units and significant figures are where authored numeric answers actually go wrong,
which is why Physics is the sharpest test of the `verify` requirement. Every numeric item states its
units in the prompt and the SymPy restatement carries them.

### Chemistry — `chem` · numeric, mc, order, spot

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **General Chemistry** ✅ **built, v2.38** | — | Atoms, the mole and stoichiometry; Reactions in solution; Gases; Thermochemistry |
| Intermediate | **Organic Chemistry** | General Chemistry | Structure, hybridisation and nomenclature; Stereochemistry; Substitution and elimination; Addition to alkenes and alkynes; Aromaticity and aromatic substitution; Carbonyl chemistry |
| Advanced | **Physical Chemistry** | Organic Chemistry | The laws of thermodynamics; Chemical and phase equilibria; Chemical kinetics and rate laws; Reaction mechanisms and catalysis; Electrochemistry |
| Professional | **Structure Determination** | Physical Chemistry | Mass spectrometry; Infrared spectroscopy; Nuclear magnetic resonance — proton; NMR — carbon and two-dimensional; Combined-technique problems; X-ray crystallography in outline |

**Honest note.** Half of a chemistry degree is laboratory work and none of it can be taught here.
The course pages say so. Fourth-year structure determination was chosen deliberately as the level-4
course because reading real spectra is exactly the "problems are under-specified on purpose" property
the rubric asks for — and it is the one fourth-year chemistry topic this format serves well.

### Biology — `bio` · numeric, mc, order, spot

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Cell and Molecular Biology** | — | Biological molecules; Cell structure and organelles; Membranes and transport; Energy, enzymes and metabolism; Cellular respiration and photosynthesis; The cell cycle and division |
| Intermediate | **Genetics** | Cell and Molecular Biology | Mendelian inheritance and extensions; Linkage and mapping; DNA replication and repair; Transcription, translation and the genetic code; Regulation of gene expression; Mutation and genome variation |
| Advanced | **Ecology and Evolution** | Genetics | Population growth and regulation; Hardy–Weinberg and the forces of evolution; Natural selection and adaptation; Speciation and phylogeny; Community interactions; Ecosystems and nutrient cycling |
| Professional | **Molecular Mechanisms** | Ecology and Evolution | Signal transduction; Cell cycle control and its failures; Development and pattern formation; Immunology in outline; Genomics and the limits of current methods |

**Honest note.** Same laboratory caveat as Chemistry. Fourth-year Biology is where the literature
moves fastest and where a study app is most likely to go stale — that course will carry a date and a
statement that it reflects settled mechanism, not current findings.

### Computer Science — `cs` · mc, order, spot **(no numeric — see decision 4)**

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Programming and Problem Solving** | — | Values, types and variables; Control flow; Functions and scope; Collections; Recursion; Reading a program you did not write |
| Intermediate | **Data Structures and Algorithms** | Programming and Problem Solving | Asymptotic analysis; Arrays, lists, stacks and queues; Trees and balanced trees; Hash tables; Sorting; Graphs and traversal |
| Advanced | **Operating Systems** | Data Structures and Algorithms | Processes and threads; Scheduling; Concurrency and synchronisation; Deadlock; Memory and virtual memory; File systems |
| Professional | **Distributed Systems** | Operating Systems | Time, clocks and ordering; Replication and consistency models; Consensus; Fault tolerance and failure detection; The CAP trade-off and what it does and does not say |

**Honest note, and it is a large one.** Computer Science is learned by writing and running code, and
this app cannot run code. What it can do is the part students most often skip: reading a program
closely, predicting what it does, ordering the steps of an algorithm, and spotting the bug. That is
genuinely valuable and it is not a substitute for a compiler. Every CS course page will say so in its
first paragraph. Decision 4 matters most here — without numeric, "what is the running time" has to
become "which of these four is the running time".

### Statistics — `stats` · numeric, mc, order, spot

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Business Statistics** | — | Describing data; Probability; Random variables and distributions; The normal distribution and sampling; Confidence intervals; One-sample tests |
| Intermediate | **Inference and Regression** | Business Statistics | Two-sample and paired inference; Simple linear regression; Multiple regression; Diagnostics and violated assumptions; Categorical data and chi-square; ANOVA |
| Advanced | **Experimental Design** | Inference and Regression | Randomisation, blocking and control; Factorial designs; Interaction and confounding; Power and sample size; Repeated measures; Observational data and what it cannot show |
| Professional | **Statistical Learning** | Experimental Design | The bias–variance trade-off; Cross-validation and model selection; Regularisation; Classification; Trees and ensembles; Where prediction and inference part company |

**Honest note.** Statistics has the richest numeric surface of the ten and the highest risk of
teaching a ritual instead of a method. Every test in these courses states its assumptions in the
prompt, and level 3 and 4 practice includes items where the correct answer is "this test does not
apply here".

### Accounting — `acct` · numeric, mc, order, spot

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Financial Accounting** ✅ **complete, v2.40** | — | The equation and the statements; Recording transactions; Adjusting and closing entries; Receivables; Cash and inventory systems; Costing inventory; Property, plant and equipment; Liabilities and equity; Cash flows and analysis |
| Intermediate | **Intermediate Financial Reporting** | Financial Accounting | Revenue recognition; Property, plant and equipment; Intangibles and impairment; Liabilities and provisions; Leases; Income taxes and deferred tax |
| Advanced | **Advanced Financial Reporting** | Intermediate Financial Reporting | Business combinations; Consolidation; Investments and equity accounting; Foreign currency; Financial instruments; Statement of cash flows, prepared not read |
| Professional | **Assurance and Professional Judgement** | Advanced Financial Reporting | The assurance engagement; Risk and materiality; Evidence and sampling; Internal control; The audit report; Ethics and independence |

**Disclaimer required.** These courses teach accounting as examined in a degree. They are **not**
professional advice, and completing them is not progress toward a CPA designation — in Canada that
runs through CPA PEP after the degree. Stated in the discipline's own words on every course page,
the way Law already says "not legal advice".

#### The Foundation course as actually built — the real twelve-module outline

The generic row above was written before there was anything to compare it against. The Foundation
course was then built from a real first-year outline (twelve modules), transferred from a separate
project rather than invented. This is that outline, with what shipped in v2.37 and what did not.
Keeping the unbuilt modules on the page — rather than quietly narrowing the course to what exists —
is the same discipline as the "Not covered here" note the app now prints on the course itself.

| # | Module | v2.37 | Where it went |
|---|---|---|---|
| 1 | Introduction and the accounting equation | ✅ | Unit 1 — *The equation and the statements* (lessons a1–a3) |
| 2 | Recording transactions: debits, credits, journals, T-accounts, trial balance | ✅ | Unit 2 — *Recording transactions* (b1–b3) |
| 3 | Adjusting entries: accruals, deferrals, depreciation, closing the year | ✅ | Unit 3 — *Adjusting and closing entries* (c1–c3) |
| 4 | Cash: bank reconciliation, internal control, petty cash | ❌ | Named in `gaps` |
| 5 | Receivables: why bad debts are estimated, the two methods, write-offs and recoveries | ✅ | Unit 4 — *Receivables* (d1–d3) |
| 6 | Inventory systems: perpetual and periodic, returns, discount terms, freight | ❌ | Named in `gaps` |
| 7 | Cost of inventory: FIFO, weighted average, specific identification, LCNRV | ❌ | Named in `gaps` — **see the LIFO warning below** |
| 8 | Property, plant and equipment: capitalisation, depreciation methods, partial years, disposal | ❌ | Named in `gaps` |
| 9 | Liabilities: notes payable, warranty provisions, bonds at discount or premium | ❌ | Named in `gaps` |
| 10 | Equity: common and preferred shares, dividends, share issuance | ❌ | Named in `gaps` |
| 11 | Statement of cash flows (indirect method) | ❌ | Named in `gaps` |
| 12 | Ratios and financial statement analysis | ❌ | Named in `gaps` |

Four of twelve modules, 12 lessons, 18 worked examples, 31 practice questions, 24 identified
misconceptions. Every one of the eight unbuilt modules is printed by name on the course page under
**Not covered here**, so a student meets the gap on day one rather than the night before the exam.

**The LIFO warning — the one content risk the accuracy audit cannot catch.** LIFO appears in the
table of contents of widely used Canadian workbooks, and it is **prohibited under IAS 2.25 and
ASPE 3031**. A LIFO question's arithmetic is perfectly correct, so SymPy would verify it, every
numeric check would pass, and the app would ship a method a Canadian student may not use. The
protection is therefore editorial, not computational: module 7's gap line names LIFO explicitly and
says why it is excluded, and `test/courses-acct.js` asserts that if the string "LIFO" appears
anywhere in the course data, IAS 2 and ASPE 3031 appear with it.

**Misconceptions carry ids.** Each of the 24 pitfalls has a stable id (`acct-dividends-as-expense`,
`acct-ageing-ignores-balance`, …) rather than being loose prose. That is a design transferred with
the curriculum: a wrong answer can later be tied to the specific belief behind it, instead of only
to the question that exposed it. The ids are asserted unique across the whole library so they stay
usable as keys when that day comes.

### Law — `law` · mc, order, spot **(no numeric — correct for this discipline)**

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Introduction to Canadian Law** | — | Where law comes from; The constitution and the division of powers; The court system; The Charter in outline; Reading a case; Statutory interpretation |
| Intermediate | **BLAW 2910 Commercial Law** *(exists)* | Introduction to Canadian Law | Foundations and the court system; Tort law; Contracts; *(6 units built)* |
| Advanced | **BLAW 3930 Environmental Law** *(exists)* | BLAW 2910 Commercial Law | Sources and jurisdiction; Common law tools; Regulatory instruments; International tools; Sectoral and planning *(5 units built)* |
| Professional | **Business Law in Practice** | BLAW 3930 Environmental Law | Risk allocation in commercial agreements; Corporate governance and directors' duties; Employment and the workplace; Regulatory compliance programmes; Dispute resolution strategy |

**Honest note.** Law in Canada is a professional degree taken *after* an undergraduate degree. These
are business-school law courses and the four levels describe depth within that stream, not a path to
practising law. Both existing courses already carry the "not legal advice" disclaimer and the new two
will. The existing two were moved from `Second year` / `Third year` to `Intermediate` / `Advanced`
in v2.37, and BLAW 3930 now names BLAW 2910 as its prerequisite on the page — see decision 3 for
their codes.

### Marketing — `mktg` · mc, order, spot **(no numeric — see decision 4)**

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Introduction to Marketing** | — | What marketing is and is not; The marketing environment; Segmentation, targeting and positioning; The four Ps; Consumer decision-making; Marketing ethics |
| Intermediate | **Consumer Behaviour and Research** | Introduction to Marketing | Perception, learning and memory; Motivation and attitudes; Social and cultural influence; Research design; Qualitative methods; Survey and experimental methods |
| Advanced | **Marketing Strategy** | Consumer Behaviour and Research | Competitive analysis; Value proposition and differentiation; Pricing strategy; Channel and distribution strategy; Product portfolios and the life cycle; Metrics that matter |
| Professional | **Brand and Digital Practice** | Marketing Strategy | Brand equity and architecture; Integrated communications; Digital channels and attribution; Analytics and measurement; Crisis and reputation |

**Honest note.** Marketing is the discipline where decision 4 costs most. "Metrics that matter" and
"Analytics and measurement" are arithmetic units, and without numeric practice they can only be
taught by recognition. Marketing is also the discipline most prone to confident-sounding emptiness,
so every framework in these courses is introduced with what it predicts and what would falsify it,
and the units on strategy present competing schools rather than picking one.

### Economics — `econ` · numeric, mc, order, spot

Added in v2.42 as the **eleventh** profile. It was not in the original ten, and the omission showed
the moment a macroeconomics lecture series arrived: the app had no profile that put identities and
rates first, and a student typing "Economics" into the *Other* box was the queue this was meant to
answer.

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Principles of Macroeconomics** ✅ **built, v2.42** | — | Scarcity, choice and trade; Measuring output; Unemployment and inflation; Aggregate demand and aggregate supply; Classical and Keynesian analysis; The Keynesian model and the multiplier; Public debt and fiscal policy; Money and the banking system; The Bank of Canada and monetary policy |
| Foundation | **Principles of Microeconomics** | — | Demand, supply and equilibrium; Elasticity; Consumer choice and utility; Production and cost; Perfect competition; Monopoly and imperfect competition |
| Intermediate | **Intermediate Macroeconomics** | Principles of Macroeconomics | The IS–LM model; Aggregate demand with a price level; The Phillips curve and expectations; Open-economy macro and exchange rates; Growth theory; Consumption and investment theory |
| Advanced | **Econometrics** | Intermediate Macroeconomics | The classical linear regression model; Inference and specification; Heteroskedasticity and autocorrelation; Instrumental variables and endogeneity; Panel data; Time series and stationarity |
| Professional | **Monetary Theory and Policy** | Econometrics | Money demand and supply theory; Central bank objectives and rules; The transmission mechanism; Inflation targeting and its critics; The zero lower bound and unconventional policy |

**Honest note.** Macroeconomics is the built course because that is the lecture series that existed.
Microeconomics is listed at the same level rather than below it, because neither is a prerequisite
for the other and most programmes teach them in either order. The macro course's own `gaps` list
names what it leaves out, and the first item on it is the whole of microeconomics — which is the
next course in this ladder and not a hole in this one.

### English — `eng` · mc, spot **(no numeric, no order — see decision 5)**

| Level | Title | Prerequisite | Units |
|---|---|---|---|
| Foundation | **Composition and Rhetoric** | — | The sentence and the paragraph; Thesis and structure; Evidence and citation; Rhetorical appeals; Common fallacies; Revision |
| Intermediate | **Reading Literature** | Composition and Rhetoric | Close reading; Narrative and point of view; Poetic form and metre; Drama and performance; Genre and convention; Context and the limits of biography |
| Advanced | **Critical Theory** | Reading Literature | Formalism and New Criticism; Structuralism and after; Marxist and materialist readings; Feminist and gender criticism; Postcolonial criticism; Reading a theory against a text |
| Professional | **The Essay as Argument** | Critical Theory | Finding a question worth asking; The literature and where you stand in it; Constructing a reading; Counter-argument and concession; Style and the sentence at length |

**Honest note.** See decision 5. With two practice kinds, English practice is close reading and
argument analysis, and nothing more. The fourth-year course teaches how an essay is *built* and
cannot mark one. If that is not worth shipping, I would rather know before writing it.

---

## Where four levels do not map cleanly

| Discipline | The problem | What I propose |
|---|---|---|
| Law | A professional degree taken after a bachelor's; the existing courses are business-school courses | Foundation → Professional describes depth within the business-law stream, stated plainly on every page. No pretence of being a path to practice. |
| Accounting | The designation (CPA PEP) sits beyond the degree entirely | "Professional" means degree-level assurance and judgement, with an explicit statement that it is not progress toward CPA. |
| Marketing | A business major; "fourth year" is specialisation, not depth | Foundation → Professional, where Professional means applied practice rather than a further year. |
| Mathematics | Precalculus is below first year, so the discipline has five levels | Keep it, rename its level to `Preparatory` (decision 2). |
| Mathematics (level 4) | Fourth-year pure maths is proof-based; this format cannot mark a proof | Ship it, scoped to stating hypotheses and spotting where a proof uses them, and say what it cannot do. |
| Computer Science | Cannot run code | Ship it, scoped to reading, predicting and debugging, and say so first thing. |
| Chemistry, Biology | Laboratory work is half the degree | Not attempted. Said on the course page. |
| English | Assessed by essay; two practice kinds available | Decision 5 — your call whether to ship at all. |

---

## Staging, and what happens next

Nothing is authored until you have answered the five decisions above.

1. **This document** — the gate you are at.
2. **The exemplar: Calculus for Business and Economics** (Mathematics, first year, prerequisite
   Precalculus). Chosen because it makes the prerequisite chain real on the first course rather than
   claimed, and because you sit Midterm 1 on 14 October. Full units, lessons, worked examples, named
   pitfalls, SymPy-verified numeric practice, its own test file, shipped to both surfaces and
   SHA-verified. This is the quality bar; if it is wrong, it is cheaper to find out here than at
   course thirty.
3. **Then one discipline-level per batch**, each built, tested, shipped and verified before the next
   starts, with a report of what it actually contains — counts of lessons, examples and practice
   items, and which topics were deliberately left out.

Proposed order after the exemplar, on the grounds that your own term comes first: Business Statistics
(first year), Financial Accounting (Foundation), Introduction to Marketing (Foundation) — the three
remaining profiles your Fall 2026 courses map onto. Then the cold-start disciplines.

**One thing this document cannot tell you.** Whether 200 authored lessons across ten disciplines is
better than 40 lessons in four disciplines you can actually check. I have laid out what you asked
for; my own view is that the four subjects you are studying are the ones where an error will be
caught, and the other six are where a confident-sounding mistake could sit unnoticed in someone's
revision for a term. That is an argument for going slowly through the cold-start disciplines, not for
skipping them — but it is worth saying before the first line is written.
