// L · the claims an institution would rely on, checked against the code that has to honour them.
//
// Everything in this suite exists because #/rights now makes specific, checkable promises to a
// reader who is deciding whether a class may be pointed at this app. A privacy notice is only worth
// the code behind it, and the failure mode is silent: the notice keeps saying the true thing long
// after the app stopped doing it. That is exactly how the old "nothing leaves your browser" line
// survived the arrival of the visitor counter for two versions.
//
// So four claims are guarded here, and each is guarded by observing behaviour rather than by
// reading the sentence that makes it:
//
//   · YOUR FILES NEVER LEAVE THE BROWSER. Proved by loading real documents into a real subject
//     with every outbound request recorded, and showing that not one request carried them — and
//     more strongly, that no request went anywhere but this origin at all.
//   · WHAT IS SENT IS EXACTLY THE SEVEN LISTED THINGS. The table on the page and the payload the
//     code builds are compared field by field, so adding an eighth field to the ping without
//     adding a row to the table fails the build.
//   · NOTHING IS WITHHELD FROM SOMEONE WHO DOES NOT SIGN UP. Proved by walking into every gated
//     screen as a signed-out visitor.
//   · THE PAGE DOES NOT OVERCLAIM. The absolute promise the counter falsified must never come
//     back, anywhere in the app.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'src', 'app.js'), 'utf8');
const BASE = 'http://127.0.0.1:8765/dist/standalone.html';

let pass = 0, fail = 0;
const ok = (n, c, d = '') => { (c ? pass++ : fail++); console.log(`${c ? 'PASS' : 'FAIL'}  ${n}${d ? '  — ' + d : ''}`); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));

  /* Every request the page makes, with its body, from the moment it opens. A POST is the only way
     a file could leave, so the bodies are kept, not just the URLs. */
  const reqs = [];
  page.on('request', r => {
    let body = '';
    try { body = r.postData() || ''; } catch (e) { /* some requests have no readable body */ }
    reqs.push({ url: r.url(), method: r.method(), body });
  });

  await page.goto(BASE);
  await page.waitForSelector('.subject-grid', { timeout: 20000 });

  /* ============ 1. the files never leave ============ */
  await page.click('[data-act="new-subject"]');
  await page.fill('#f-name', 'Privacy probe');
  await page.fill('#f-code', 'PRIV 100');
  await page.click('.modal button[type=submit]');
  await page.waitForSelector('#dropzone');
  const FILES = ['test/sample.md', 'test/proc.md'].map(f => path.join(ROOT, f)).filter(fs.existsSync);
  await page.setInputFiles('#file-input', FILES);
  await page.waitForFunction(n => document.querySelectorAll('.mat').length === n && !document.querySelector('.mat.busy'),
    FILES.length, { timeout: 60000 });

  // a distinctive string that is definitely IN the material, to search every outbound byte for
  const needle = fs.readFileSync(FILES[0], 'utf8').split(/\s+/).filter(w => w.length > 7)[0] || 'glycolysis';

  // then use the material for real — build the cards, the summary and the quiz
  const sid = (await page.evaluate(() => location.hash)).split('/')[2];
  for (const kind of ['cards', 'keys', 'summary', 'quiz']) {
    await page.evaluate(h => { location.hash = h; }, `#/s/${sid}/${kind}`);
    await page.waitForTimeout(900);
  }

  const origin = new URL(BASE).origin;
  const offsite = reqs.filter(r => !r.url.startsWith(origin) && !r.url.startsWith('data:') && !r.url.startsWith('blob:'));
  ok(`every request the app made went to its own origin (${reqs.length} requests, ${offsite.length} elsewhere)`,
    offsite.length === 0, offsite.slice(0, 3).map(r => r.method + ' ' + r.url.slice(0, 90)).join(' | '));

  const posted = reqs.filter(r => r.body && r.body.length);
  ok(`nothing was posted anywhere while reading, carding, summarising and quizzing the files (${posted.length} bodies)`,
    posted.length === 0, posted.slice(0, 2).map(r => r.url.slice(0, 60)).join(' | '));

  const carrying = reqs.filter(r => (r.body || '').includes(needle) || r.url.includes(needle));
  ok(`no request carried a word out of the material ("${needle}")`, carrying.length === 0);

  ok('the material really was read (cards exist)',
    await page.evaluate(() => { try { return JSON.stringify(localStorage).length > 400; } catch (e) { return false; } }));

  // and it is genuinely on the device: clearing site data is the delete button the page promises
  ok('the page tells the truth about where it is kept (localStorage holds it)',
    await page.evaluate(() => Object.keys(localStorage).some(k => k.startsWith('unimadeez:'))));

  /* ============ 2. nothing is withheld from a visitor who did not sign up ============ */
  await page.evaluate(() => { try { localStorage.removeItem('unimadeez:unlock'); localStorage.removeItem('unimadeez:unlock:v1'); } catch (e) {} });
  ok('the source no longer conditions any feature on signing up', /const SIGNUP_REQUIRED = false;/.test(SRC));
  ok('and every lock reads that one switch', /LOCKED = \{ summary: SIGNUP_REQUIRED, quiz: SIGNUP_REQUIRED, essay: SIGNUP_REQUIRED \}/.test(SRC));

  for (const kind of ['summary', 'quiz']) {
    await page.evaluate(h => { location.hash = h; }, `#/s/${sid}/${kind}`);
    await page.waitForTimeout(700);
    const where = await page.evaluate(() => location.hash);
    ok(`a signed-out visitor reaches ${kind} instead of a sign-up wall (${where})`, !/signup/.test(where));
  }
  await page.evaluate(h => { location.hash = h; }, `#/s/${sid}`);
  await page.waitForTimeout(500);
  ok('no "Sign-up" lock badge is shown on any tool', (await page.locator('.tool .lock').count()) === 0);

  await page.evaluate(() => { location.hash = '#/signup'; });
  await page.waitForTimeout(400);
  const su = await page.locator('.gate .form').innerText();
  ok('the sign-up page says it unlocks nothing', /nothing is held back|unlocks nothing|already open/i.test(su), su.slice(0, 90));
  ok('and offers a way past it', (await page.locator('.gate .owner-link').count()) >= 1);
  ok('and links to the full account of what is sent', (await page.locator('.gate a[href="#/rights"]').count()) >= 1);

  /* ============ 3. the legal page, section by section ============ */
  await page.evaluate(() => { location.hash = '#/rights'; });
  await page.waitForSelector('.legal');
  await page.waitForTimeout(300);
  const L = await page.evaluate(() => ({
    secs: Array.from(document.querySelectorAll('.legal-sec')).map(e => e.id),
    text: document.querySelector('.legal').innerText,
    rows: document.querySelectorAll('.ping-table tbody tr').length,
    otherRows: document.querySelectorAll('.other-table tbody tr').length,
    hscroll: document.documentElement.scrollWidth > innerWidth + 1
  }));
  for (const need of ['lg-privacy', 'lg-sending', 'lg-personal', 'lg-control', 'lg-integrity',
                      'lg-accuracy', 'lg-access', 'lg-institutions'])
    ok(`the page has a "${need.slice(3)}" section`, L.secs.includes(need));

  ok(`what the app sends is itemised, not summarised (${L.rows} rows)`, L.rows === 7);

  // the table and the code must agree: every field in the ping payload has a row, and vice versa
  const ping = (SRC.match(/rpc\/umez_ping[\s\S]{0,600}?\}\)\s*\n/) || [''])[0];
  const fields = Array.from(new Set((ping.match(/\bp_[a-z_]+\b/g) || [])));
  ok(`the ping sends ${fields.length} fields (${fields.join(', ')})`, fields.length === 6,
    'six sent, plus the time set by the database, is the seven rows in the table');

  /* v2.34 — the second, optional message: the subject a student types after picking Other. It is
     listed in its own table because it is not part of the ping and does not travel with it, and
     the claim that distinguishes it from everything else on this page — that it carries NO device
     id, so it cannot be joined back to a visit — is checked against the payload, not the prose. */
  ok(`the Other message is itemised too (${L.otherRows} row)`, L.otherRows === 1);
  const other = (SRC.match(/rpc\/umez_subject'[\s\S]{0,300}?\}\)\s*;/) || [''])[0];
  const oFields = Array.from(new Set((other.match(/\bp_[a-z_]+\b/g) || [])));
  ok(`it sends ${oFields.length} field (${oFields.join(', ') || 'none found'})`,
    oFields.length === 1 && oFields[0] === 'p_label');
  ok('and carries no device id, which is the claim that makes it unlinkable',
    !/p_id/.test(other) && !/deviceId\(\)/.test(other));
  ok('the page says so in those words', /no device id/i.test(L.text));
  ok('the box is described as optional at the point it is offered',
    /Optional/.test(SRC.match(/data-form="subj-other"[\s\S]{0,900}/)?.[0] || ''));
  // the filter is applied in the page AND stated on the page
  ok('the free-text field is filtered before anything is sent', /function subjLabelClean/.test(SRC));
  ok('and the page states the limit it applies', /40 characters/.test(L.text) && /four words/i.test(L.text));

  const must = [
    [/30 business days/, 'the statutory answer time for a request'],
    [/ca-central-1|in Canada/, 'where personal information is stored'],
    [/Personal Information\s+Protection Act|PIPA/, 'the Act that actually applies'],
    [/oipc\.bc\.ca|Information and Privacy Commissioner/, 'where to complain past the publisher'],
    [/WCAG 2\.1/, 'the accessibility standard being targeted'],
    [/ED 5-0|Academic Integrity/, 'the institution\'s integrity policy'],
    [/extracted, not understood/, 'what the study material actually is'],
    [/deleted within 30 days|have it deleted/, 'the deletion right'],
    [/no cookies|There are .no cookies./i, 'the cookie position']
  ];
  for (const [re, what] of must) ok(`it states ${what}`, re.test(L.text));

  // the absolute claim the counter falsified must never come back
  const OVERCLAIM = /nothing (at all )?leaves your browser|nothing is (ever )?sent anywhere at all|we collect nothing/i;
  ok('the page does not restate the absolute promise the counter falsified', !OVERCLAIM.test(L.text));
  // source COMMENTS are allowed to quote the old promise — the note explaining why it was
  // withdrawn is the most useful comment on the page. Only text a user can see is checked.
  const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const overInSrc = OVERCLAIM.test(code.replace(/sends nothing at all/g, ''));
  ok('and neither does anywhere else in the app', !overInSrc);

  // the narrower promise, which IS true, must still be made
  ok('but the true promise about files is still made plainly', /never leaves? (your|this) device|never leave your browser/i.test(L.text));

  ok('no sideways scroll on the legal page', !L.hscroll);
  await page.setViewportSize({ width: 375, height: 720 });
  await page.waitForTimeout(300);
  ok('none on a phone either (the table scrolls, the page does not)',
    !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)));

  /* ============ 4. no tracking machinery anywhere in the built page ============ */
  const built = fs.readFileSync(path.join(ROOT, 'dist', 'standalone.html'), 'utf8');
  const banned = [
    [/document\.cookie\s*=/, 'sets a cookie'],
    [/google-analytics|googletagmanager|gtag\(|\bfbq\(|hotjar|mixpanel|segment\.com|plausible|posthog/i, 'loads an analytics service'],
    [/navigator\.geolocation/, 'asks for location'],
    [/canvas[\s\S]{0,40}toDataURL[\s\S]{0,80}fingerprint/i, 'fingerprints the device']
  ];
  for (const [re, what] of banned) ok(`the built page never ${what}`, !re.test(built));

  ok('no page errors', errs.length === 0, errs[0] || '');
  await b.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
