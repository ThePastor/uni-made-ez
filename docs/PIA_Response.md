# Privacy Impact Assessment — Vendor Response

**Application:** UNI Made EZ · <https://thepastor.github.io/uni-made-ez/>
**Vendor / publisher:** JohnsonXCorp (Anndy Johnson), British Columbia, Canada
**Contact:** johnsonandy242@gmail.com
**Version assessed:** v2.27, 14 September 2026
**Prepared for:** Thompson Rivers University — Information Security Office and Privacy and Access
Office, whose published PIA process is led by the Director of Information Security with input from
the Privacy and Access Office.

> **Threshold question first.** TRU's PIA process is triggered when TRU implements a new initiative
> or system. Nothing is being implemented here: no contract, no integration, no TRU system, no TRU
> account, no TRU data. A student visits a public web page on their own device. **No personal
> information in TRU's custody or control is collected, used, disclosed or stored by this
> application**, so neither FIPPA s. 33 nor the s. 30.1 assessment for sensitive personal information
> stored outside Canada is engaged — and in any case nothing is stored outside Canada.
>
> This document is provided so the university can close the question on the record rather than
> having to establish it.

---

## 1. Initiative

**1.1 Purpose and objectives.** A free study application. Students may (a) study authored courses in
Precalculus and Business Law, and (b) turn their own lecture files into flash cards, a summary, a
key-information list and quizzes, reviewed on a spaced-repetition schedule.

**1.2 Who operates it.** JohnsonXCorp, a sole publisher in British Columbia. No employees, no
sub-contractors with data access.

**1.3 What TRU would do.** Permit instructors to mention it as an optional study aid. Nothing else.

**1.4 Authority to collect.** BC PIPA, on the basis of the individual's **consent**, given directly
to the publisher. No collection is made on TRU's behalf or under TRU's authority.

## 2. Information elements

**2.1 Personal information collected.**

| Element | When | Necessary for | Consent |
|---|---|---|---|
| Name | Only if the individual submits the optional sign-up form | Knowing who uses the app; contacting them about it | Express, at the point of collection, with purposes stated on screen |
| Email address | As above | As above | As above |

**2.2 Non-identifying operational data** (an open counter, sent at most hourly): a random
browser-generated device id, an open count, a subject count, a signed-up boolean, a device-family
string, an IANA time-zone name. Server-side timestamp. **No IP address is stored.** Full table in
[`Privacy_Notice.md`](Privacy_Notice.md) §2.1.

**2.3 Is the collection necessary and minimal?** Yes, and it was reduced in v2.27. Two features had
been gated behind sign-up; the gate was removed so that **nothing is withheld from a student who
declines**, on the reasoning that consent given to unlock study material is not meaningful consent
and would not satisfy PIPA's "reasonable person" standard.

**2.4 Information explicitly NOT collected.** Course files or any text from them; cards; quiz
answers or scores; study progress; notes; exam dates; search terms; student number; institution;
enrolment; IP address; location; browsing history; biometrics; device fingerprints. No cookies, no
analytics service, no advertising identifiers, **no third-party requests of any kind**.

**2.5 Sensitive personal information.** None is collected. There is therefore no s. 30.1-style
assessment to make, and none is stored outside Canada in any event.

## 3. Collection

**3.1 Method and source.** Directly from the individual, typed into a form in their browser.
**3.2 Notice at collection.** Purposes, storage location, non-disclosure, and the deletion right
are stated on screen at both points where the form appears, with a link to the full account.
**3.3 Indirect collection.** None.

## 4. Use and disclosure

**4.1 Uses.** (a) To know who is using the application; (b) to contact the individual about it.
**4.2 Disclosures.** None, to anyone, for any purpose. Not sold, not licensed, not shared, not used
for advertising, profiling or scoring.
**4.3 Sub-processors.**

| Party | Role | Data reached | Location |
|---|---|---|---|
| Supabase Inc. | Managed PostgreSQL | Sign-up rows and counter rows | **`ca-central-1` (Canada)** |
| GitHub, Inc. (GitHub Pages) | Static web hosting | Ordinary web-server request logs, as any host receives. **No application data.** | GitHub infrastructure |

**4.4 Cross-border.** Personal information is stored in Canada. Serving a web page necessarily means
a request reaches the host; no personal information is in that request.

## 5. Storage, security and access

| Control | Implementation |
|---|---|
| Encryption in transit | HTTPS/TLS only |
| Encryption at rest | Platform-managed |
| Access control | Row-level security. The publishable key embedded in the page may **INSERT**; it has **no SELECT policy** on the table containing names and emails. The device counter writes through a `SECURITY DEFINER` function so the counter table is not readable by that key either. |
| Administrative access | The publisher alone, authenticated to the database |
| Privilege of the public key | Write-only, by design — the key ships in a public page and is treated as public |
| Owner statistics view | Returns **counts only**; it cannot return a name or an email |
| Verification | Tested against the live database by attempting to read rows with the key from the published page and being refused. Empirical, not inferred from a settings screen. |
| Segregation | No other application shares the database |

**5.1 On-device data.** Everything a student studies is held in their browser's local storage on
their device, under their sole control, and is deleted instantly and permanently by clearing site
data. The publisher cannot reach it, restore it, or be compelled to produce it.

## 6. Retention and disposal

| Data | Retention | Disposal |
|---|---|---|
| Name, email | Until deletion is requested; in any event on retirement of the app | Row deleted within 30 days of request |
| Counter rows | While the app is published | Deleted on retirement; contain no personal information |
| On-device data | Controlled by the individual | Clearing browser site data |

## 7. Individual rights

Access, correction, deletion and withdrawal of consent, by email to the published privacy contact —
no form, no fee, no reason required — answered within **30 business days** (BC PIPA). Escalation to
the Office of the Information and Privacy Commissioner for BC is stated in the application itself.

## 8. Breach management

Any suspected breach: contain, assess, notify every affected individual directly, and notify the
OIPC. BC does not presently mandate that report for private organisations; it would be made anyway.
Given §2.4 and §5.1, the maximum exposure from a total compromise of the database is the set of
names and email addresses voluntarily submitted — no course material, no student work, no academic
record, no credential, and nothing linkable to an institution.

## 9. Risk assessment

| # | Risk | Likelihood | Impact | Level | Response |
|---|---|---|---|---|---|
| 1 | Sign-up table compromised, exposing names and emails | Low | Low | **Low** | Minimal data set; write-only public key; RLS verified; encryption; notification undertaken |
| 2 | Student course material exposed | **Not possible** | — | **None** | Files never leave the device; no transmission path exists in the code; asserted by automated test on every build |
| 3 | Re-identification from counter data | Very low | Very low | **Low** | Random id, no IP, coarse device family, time-zone name only |
| 4 | Data leaving Canada | Very low | Low | **Low** | Canadian region selected; single sub-processor; no analytics or CDN calls at all since v2.27 |
| 5 | Student mistakes generated material for authoritative content | Medium | Medium | **Medium** | Disclosed prominently as extracted rather than understood; low-confidence flags; every card links to its source passage; academic-integrity guidance in the student's reading path |
| 6 | Vendor discontinuity | Medium | Low | **Low** | Static single-file app that works offline; public source; no student data stranded because none is held |

**Overall residual risk: LOW.** The dominant risk in a study-tool assessment is normally the
wholesale transfer of course content and student work to a vendor. That risk is absent here by
construction, not by policy.

## 10. Assurance

Evidence the university can inspect without relying on this document:

- The full application is delivered as one readable page; the source is public.
- Open developer tools, add a file, generate cards: no request is made. Turn off the network: it
  still works.
- [`test/legal.js`](../test/legal.js) records every outbound request and request body while real
  documents are loaded and used, then asserts that nothing left the origin, that no request body
  existed, and that no word of the material appeared anywhere. It also reconciles the seven-item
  disclosure table in the app against the fields the code actually transmits, so an undisclosed
  eighth field fails the build.
- Contrast (AAA), accessibility, structure, reflow and offline suites run on every build.

## 11. Attestation

The answers above describe v2.27 as built on 14 September 2026. The publisher will notify TRU of any
change that would alter section 2, 4 or 5, will complete any additional security or accessibility
questionnaire in writing, and will answer follow-up questions from the Information Security Office or
the Privacy and Access Office.

**JohnsonXCorp** · johnsonandy242@gmail.com · 14 September 2026
