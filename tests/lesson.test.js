// Playwright tests for lesson/index.html.  Run: node tests/lesson.test.js
// Every expected learner-facing string below is wrapped in S(), which also checks it appears word for word in the spec.
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'lesson', 'index.html');
const SPEC = fs.readFileSync(path.join(ROOT, 'docs', 'Seeing-the-Rule-Interactive-Lesson-Plan.md'), 'utf8');
const HANDOFF = fs.readFileSync(path.join(ROOT, 'HANDOFF.md'), 'utf8');
const SHOTS = path.join(ROOT, 'test-results', 'screenshots');
const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 800 };

/* ---------------- reporting ---------------- */
const results = [];
let section = 'spec text';
function ok(cond, msg) {
  results.push({ section, ok: !!cond, msg });
  if (!cond) console.log(`  FAIL  ${msg}`);
}
function S(text) { ok(SPEC.includes(text), `spec contains: "${text}"`); return text; }
function H(text) { ok(HANDOFF.includes(text), `handoff contains: "${text}"`); return text; }

/* ---------------- page helpers ---------------- */
const step = (p, id) => p.locator(`[data-step="${id}"]`);
const screenEl = p => p.locator('section.screen:not([hidden])');
async function fill(p, id, values) {
  const inputs = step(p, id).locator(':scope input[data-input]');
  const vals = [].concat(values);
  for (let i = 0; i < vals.length; i++) await inputs.nth(i).fill(String(vals[i]));
}
async function check(p, id) { await step(p, id).locator(':scope .check').first().click(); }
async function feedback(p, id) {
  const fb = step(p, id).locator(':scope > .fb');
  const kind = await fb.locator('.note').getAttribute('data-kind').catch(() => null);
  const says = (await fb.locator('.say').allTextContents()).map(t => t.trim());
  const tests = (await fb.locator('.test').allTextContents()).map(t => t.trim());
  return { kind, says, tests };
}
// Type, Check, and confirm the response kind and text.
async function expectTyped(p, id, values, kind, say, label) {
  await fill(p, id, values);
  await check(p, id);
  const fb = await feedback(p, id);
  const tag = `${label || 'Screen ' + id} typed ${JSON.stringify(values)}`;
  ok(fb.kind === kind, `${tag}: outcome is ${kind} (got ${fb.kind})`);
  if (say !== undefined) ok(say === null ? fb.says.length === 0 : fb.says.includes(say), `${tag}: says "${say}" (got ${JSON.stringify(fb.says)})`);
  return fb;
}
async function choose(p, id, index) { await step(p, id).locator(`:scope [data-choice="${index}"]`).click(); }
async function expectChoice(p, id, index, kind, say) {
  await choose(p, id, index);
  await check(p, id);
  const fb = await feedback(p, id);
  ok(fb.kind === kind, `Screen ${id} choice ${index}: outcome is ${kind} (got ${fb.kind})`);
  if (say !== undefined) ok(say === null ? fb.says.length === 0 : fb.says.includes(say), `Screen ${id} choice ${index}: says "${say}" (got ${JSON.stringify(fb.says)})`);
}
async function next(p) { await p.click('#next'); }
async function whyVisible(p) { return screenEl(p).locator('.why-btn').isVisible(); }
async function openWhy(p) {
  const b = screenEl(p).locator('.why-btn');
  if (await b.isVisible() && (await b.getAttribute('aria-expanded')) !== 'true') await b.click();
}
async function whyText(p) { return (await screenEl(p).locator('.why').innerText()).trim(); }
async function tapPlace(p, id, pieceSel, targetSel) {
  await step(p, id).locator(`:scope ${pieceSel || '.piece'}`).first().click();
  await step(p, id).locator(`:scope ${targetSel || '.drop'}`).first().click();
}
// Mouse drag from the centre of one element to the centre of another.
async function mouseDrag(p, from, to) {
  await from.evaluate(el => el.scrollIntoView({ block: 'center' }));
  const a = await from.boundingBox(), b = await to.boundingBox();
  await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await p.mouse.down();
  await p.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2 + 10, { steps: 3 });
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
  await p.mouse.up();
}
// Touch drag through the Chrome DevTools protocol (Playwright has no touch-drag helper).
async function touchDrag(p, from, to) {
  const cdp = await p.context().newCDPSession(p);
  await from.evaluate(el => el.scrollIntoView({ block: 'center' }));
  const a = await from.boundingBox(), b = await to.boundingBox();
  const ax = a.x + a.width / 2, ay = a.y + a.height / 2, bx = b.x + b.width / 2, by = b.y + b.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: ax, y: ay }] });
  for (let i = 1; i <= 10; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: ax + (bx - ax) * i / 10, y: ay + (by - ay) * i / 10 }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}
async function screenshot(p, name) {
  // The sticky header and fixed nav are made static for full-page captures only, so they don't repeat mid-page.
  const tag = await p.addStyleTag({ content: '.top,.nav{position:static!important}' });
  await p.waitForTimeout(150);
  await p.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: true });
  await tag.evaluate(el => el.remove());
}
// No horizontal page scroll, and no text box whose content is wider than the box.
async function overflowProblems(p) {
  return p.evaluate(() => {
    const out = [];
    const vw = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > vw + 1) out.push(`page scrolls sideways: ${document.documentElement.scrollWidth} > ${vw}`);
    const sec = document.querySelector('section.screen:not([hidden])');
    sec.querySelectorAll('p, h1, button, label, td, th, .say, .test, .prompt, figcaption, .field, .choice').forEach(el => {
      if (el.closest('.tablewrap') && (el.tagName === 'TD' || el.tagName === 'TH')) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto') out.push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 40)}" content wider than box`);
      if (r.right > vw + 1 || r.left < -1) out.push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 40)}" outside the viewport`);
    });
    sec.querySelectorAll('.tablewrap').forEach(el => { if (el.scrollWidth > el.clientWidth + 1) out.push(`table "${el.textContent.trim().slice(0, 30)}" needs sideways scroll`); });
    return out;
  });
}
// Every visible control is at least 44 px in both directions.
async function smallTargets(p) {
  return p.evaluate(() => {
    const out = [];
    const sec = document.querySelector('section.screen:not([hidden])');
    const els = [...sec.querySelectorAll('button, input, textarea, [role="button"], .hit'), ...document.querySelectorAll('.nav button')];
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0 || el.disabled || el.closest('[hidden]')) return;
      if (el.type === 'checkbox') return; // checked through its label
      if (r.width < 44 - 0.5 || r.height < 44 - 0.5) out.push(`${el.tagName}.${el.getAttribute('class')} ${Math.round(r.width)}×${Math.round(r.height)}`);
    });
    sec.querySelectorAll('label.tick').forEach(el => { const r = el.getBoundingClientRect(); if (r.height < 44 - 0.5) out.push(`label ${Math.round(r.width)}×${Math.round(r.height)}`); });
    return out;
  });
}

/* =====================================================================
   SCREEN SCRIPTS. correct(p): the correct path.  wrong(p): every predicted wrong answer, then the correct path.
   ===================================================================== */
const SCREENS = {
  1: {
    async correct(p) {
      await expectTyped(p, '1A', '4n + 3', 'correct', S('Right. Each term adds 4, and the value at n = 0 is 3.'));
      ok(!(await whyVisible(p)), 'Screen 1: Why? hidden until the last step is checked');
      await expectTyped(p, '1B', '25', 'correct', S('4n + 3 = 103 gives 4n = 100, so n = 25. 103 is the 25th term.'));
      ok(await whyVisible(p), 'Screen 1: Why? appears after the last step is checked');
    },
    async wrong(p) {
      await expectTyped(p, '1A', 'n +', 'format', H('Type a rule using n, such as 2n + 5.'));
      await expectTyped(p, '1A', '103', 'format', 'Type a rule using n, such as 2n + 5.');
      await expectTyped(p, '1A', 'T = 3n +', 'format', 'Type a rule using n, such as 2n + 5.');
      const r7 = S('Test it at n = 1: it gives 11, but the first term is 7. 7 is the term at n = 1. The constant is the value at n = 0.');
      await expectTyped(p, '1A', '7 + 4n', 'wrong', r7);
      ok((await step(p, '1A').locator(':scope > .demo').innerText()).trim() === '', 'Screen 1A: no demonstration after one miss');
      await expectTyped(p, '1A', 'T = 4n + 7', 'wrong', r7, 'Screen 1A (same error, other spelling)');
      ok((await step(p, '1A').locator(':scope > .demo table').count()) === 1, 'Screen 1A: second miss shows the row comparison');
      await p.waitForTimeout(3000);
      const rows = await step(p, '1A').locator(':scope > .demo tr').evaluateAll(trs => trs.map(tr => [...tr.children].map(td => td.textContent.trim())));
      ok(JSON.stringify(rows) === JSON.stringify([
        ['n', '0', '1', '2', '3', '4'], ['Pattern', '3', '7', '11', '15', '19'],
        ['"Normal" row (4n)', '0', '4', '8', '12', '16'], ['How far off', '3', '3', '3', '3', '3']]),
        `Screen 1A: row comparison table matches the spec (got ${JSON.stringify(rows)})`);
      await expectTyped(p, '1A', '4 × n', 'wrong', S('4n gives 4, 8, 12, 16. Every term of the pattern is 3 more.'));
      await expectTyped(p, '1A', '5n + 3', 'hint', S('What does each term add? Then find the value at n = 0.'));
      await expectTyped(p, '1A', 'T = 3 + 4n', 'correct', 'Right. Each term adds 4, and the value at n = 0 is 3.', 'Screen 1A (equivalent form)');
      ok(!(await whyVisible(p)), 'Screen 1: Why? still hidden before Step B');
      await expectTyped(p, '1B', 'twenty', 'format', 'Type a number.');
      const r26 = S('Solve 4n + 3 = 103. Undo the + 3 first, then the × 4.');
      await expectTyped(p, '1B', '26', 'wrong', r26);
      ok(await whyVisible(p), 'Screen 1: Why? appears after a predicted error on the last step');
      await expectTyped(p, '1B', '100', 'wrong', r26);
      ok((await step(p, '1B').locator(':scope > .demo .val').innerText()).trim() === 'n = 25', 'Screen 1B: second miss shows the answer');
      ok((await screenEl(p).locator('.why').isVisible()), 'Screen 1B: second miss opens the Why? text');
      await expectTyped(p, '1B', 'n = 25', 'correct', '4n + 3 = 103 gives 4n = 100, so n = 25. 103 is the 25th term.');
    },
    why: S('Each term adds 4, so the coefficient is 4. The pattern is always 3 more than the 4 times table, and at n = 0 it would be 3, so the constant is 3. The rule is T = 4n + 3. To find which term is 103, solve 4n + 3 = 103: n = 25.'),
  },
  2: {
    async correct(p) {
      await expectTyped(p, '2A', '2', 'correct', S('The same 2 tiles, in every figure.'));
      await expectTyped(p, '2B', '3', 'correct', S('Each figure adds one group of 3 in the second colour.'));
      await tapPlace(p, '2C1');
      await expectTyped(p, '2C2', '14', 'correct', S('4 groups of 3, plus the 2 fixed tiles: 14.'));
    },
    async wrong(p) {
      await expectTyped(p, '2A', '5', 'wrong', S('5 is all of Figure 1. Count only the colour that stays the same size.'));
      await expectTyped(p, '2A', '2 tiles', 'correct', 'The same 2 tiles, in every figure.');
      await expectTyped(p, '2B', '5', 'wrong', S('5 is the whole of Figure 1. Compare Figure 1 and Figure 2: what was added?'));
      await expectTyped(p, '2B', '3', 'correct', 'Each figure adds one group of 3 in the second colour.');
      await mouseDrag(p, step(p, '2C1').locator('.piece'), step(p, '2C1').locator('.drop'));
      ok(await step(p, '2C2').isVisible(), 'Screen 2C: a mouse drag places the group');
      await expectTyped(p, '2C2', '12', 'wrong', S('You counted the groups. The 2 fixed tiles are in every figure too.'));
      await expectTyped(p, '2C2', '20', 'wrong', S('Figure 1 has 5 tiles, but only 3 of them repeat.'));
      await expectTyped(p, '2C2', '14.0', 'correct', '4 groups of 3, plus the 2 fixed tiles: 14.');
    },
    why: S('Every figure has the same 2 fixed tiles. Each new figure adds one group of 3. So Figure 4 has 4 groups of 3 and the 2 fixed tiles: 12 + 2 = 14.'),
  },
};

/* =====================================================================
   CHECKS ON THE ANSWER CHECKER ITSELF
   ===================================================================== */
async function checkerTests(p) {
  section = 'answer checker';
  const r = await p.evaluate(() => {
    const same = (a, b) => { const x = parseRule(a), y = parseRule(b); return !!(x && y && sameRule(x, y)); };
    const simp = a => isSimplified(parseRule(a));
    return {
      equivalent: [
        same('3n + 2', '2 + 3n'), same('T = 3n + 2', '3n+2'), same('S = 4 + 3(n − 1)', '3n + 1'), same('4+3(n-1)', '3*n+1'),
        same('3 × n + 1', '3n + 1'), same('P = 24 + 6n', '6(n + 4)'), same('3n + 3', '3 + 3n'), same('t = 4n+3', '4n + 3'),
        same('−3 + 3n + 4', '3n + 1'), same('(3n + 1)', '3n + 1'), same('3n–1 + 2', '3n + 1'),
      ],
      notEquivalent: [same('3n + 2', '5n'), same('3n + 1', '3n + 3'), same('7n − 7', '3n + 1')],
      unparseable: ['', 'n +', '3x + 2', 'abc', '42', '3n + 1 2', 'y = 3n'].map(v => parseRule(v) === null),
      simplified: [simp('3n + 1'), simp('1 + 3n'), simp('3 × n + 1'), simp('S = 3n+1')],
      notSimplified: [simp('4 + 3n − 3'), simp('4 + 3(n − 1)'), simp('n + 2n + 1'), simp('3n + 1 + 0')],
      numbers: ['6.5', '6.50', ' 6.5 ', '6.5 m/s', '13 sticks', 'n = 25', 'Figure 7', '25th', '−3'].map(parseNumber),
      notNumbers: ['six', '3.25 m in 0.5 s', ''].map(parseNumber),
    };
  });
  ok(r.equivalent.every(Boolean), `equivalent rules match at n = 0, 1, 2, 3, 7, 1.5: ${JSON.stringify(r.equivalent)}`);
  ok(r.notEquivalent.every(x => !x), `different rules don't match: ${JSON.stringify(r.notEquivalent)}`);
  ok(r.unparseable.every(Boolean), `unparseable input is recognized: ${JSON.stringify(r.unparseable)}`);
  ok(r.simplified.every(Boolean), `simplified forms: ${JSON.stringify(r.simplified)}`);
  ok(r.notSimplified.every(x => !x), `unsimplified forms: ${JSON.stringify(r.notSimplified)}`);
  ok(JSON.stringify(r.numbers) === JSON.stringify([6.5, 6.5, 6.5, 6.5, 13, 25, 7, 25, -3]), `numbers parse with units and spaces: ${JSON.stringify(r.numbers)}`);
  ok(r.notNumbers.every(x => x === null), `non-numbers are rejected: ${JSON.stringify(r.notNumbers)}`);
}

/* =====================================================================
   RUNS
   ===================================================================== */
async function newPage(browser, viewport, extra = {}) {
  const ctx = await browser.newContext({ viewport, ...extra });
  const p = await ctx.newPage();
  p.errors = [];
  p.on('pageerror', e => p.errors.push(e.message));
  p.on('console', m => { if (m.type() === 'error') p.errors.push(m.text()); });
  p.on('request', req => { if (!req.url().startsWith('file:')) p.errors.push('network request: ' + req.url()); });
  await p.goto(URL);
  return p;
}
const screenCount = p => p.evaluate(() => LESSON.screens.length);
const pad = n => String(n).padStart(2, '0');

async function correctPath(browser, label, viewport, extra) {
  section = `correct path (${label})`;
  const p = await newPage(browser, viewport, extra);
  const total = await screenCount(p);
  for (let n = 1; n <= total; n++) {
    ok((await p.locator('#where').innerText()).trim() === `Screen ${n} of ${total}`, `${label}: progress shows Screen ${n} of ${total}`);
    await screenshot(p, `${label}-${pad(n)}-start`);
    await SCREENS[n].correct(p);
    if (SCREENS[n].why) {
      await openWhy(p);
      ok((await whyText(p)).includes(SCREENS[n].why), `Screen ${n}: Why? text matches the spec`);
    }
    await p.waitForTimeout(400);
    ok((await overflowProblems(p)).length === 0, `${label} Screen ${n}: no overflow ${JSON.stringify(await overflowProblems(p))}`);
    ok((await smallTargets(p)).length === 0, `${label} Screen ${n}: targets ≥ 44 px ${JSON.stringify(await smallTargets(p))}`);
    await screenshot(p, `${label}-${pad(n)}-done`);
    if (n < total) {
      ok(await p.locator('#next').isEnabled(), `Screen ${n}: Next is enabled once done`);
      await next(p);
    }
  }
  ok(p.errors.length === 0, `${label}: no console errors or network requests ${JSON.stringify(p.errors)}`);
  return p;
}

async function wrongPath(browser) {
  section = 'predicted wrong answers';
  const p = await newPage(browser, PHONE, { hasTouch: true });
  const total = await screenCount(p);
  for (let n = 1; n <= total; n++) {
    await SCREENS[n].wrong(p);
    if (n < total) await next(p);
  }
  ok(p.errors.length === 0, `wrong-answer run: no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}

async function navigationTests(browser) {
  section = 'navigation';
  const p = await newPage(browser, PHONE);
  ok(await p.locator('#back').isDisabled(), 'Back is disabled on Screen 1');
  ok(await p.locator('#next').isDisabled(), 'Next is disabled until the screen is done');
  await SCREENS[1].correct(p);
  await next(p);
  await p.click('#back');
  ok((await p.locator('#where').innerText()).includes('Screen 1 of'), 'Back shows Screen 1');
  ok(await step(p, '1A').locator('input').isDisabled(), 'Back: earlier answers can be seen but not changed');
  ok(await screenEl(p).locator('.why-btn').isEnabled(), 'Back: the Why? text can still be opened');
  await next(p);
  ok((await p.locator('#where').innerText()).includes('Screen 2 of'), 'Next returns to the current screen');
  ok(await step(p, '2A').locator('input').isEnabled(), 'The current screen is still answerable after looking back');
  await p.context().close();
}

async function touchTests(browser) {
  section = 'touch drags at phone size';
  const p = await newPage(browser, PHONE, { hasTouch: true, isMobile: true });
  await SCREENS[1].correct(p); await next(p);
  await fill(p, '2A', '2'); await check(p, '2A');
  await fill(p, '2B', '3'); await check(p, '2B');
  await touchDrag(p, step(p, '2C1').locator('.piece'), step(p, '2C1').locator('.drop'));
  ok(await step(p, '2C2').isVisible(), 'Screen 2C: a touch drag places the group');
  ok(p.errors.length === 0, `touch run: no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const p0 = await newPage(browser, PHONE);
  await checkerTests(p0);
  await p0.context().close();
  const phone = await correctPath(browser, 'phone', PHONE, { hasTouch: true, isMobile: true });
  await phone.context().close();
  const desk = await correctPath(browser, 'desktop', DESKTOP);
  await desk.context().close();
  const dark = await correctPath(browser, 'phone-dark', PHONE, { colorScheme: 'dark', hasTouch: true, isMobile: true });
  await dark.context().close();
  await wrongPath(browser);
  await navigationTests(browser);
  await touchTests(browser);
  await browser.close();

  const failed = results.filter(r => !r.ok);
  const bySection = {};
  for (const r of results) { bySection[r.section] = bySection[r.section] || { pass: 0, fail: 0 }; bySection[r.section][r.ok ? 'pass' : 'fail']++; }
  console.log('\nSummary');
  for (const [k, v] of Object.entries(bySection)) console.log(`  ${k}: ${v.pass} passed, ${v.fail} failed`);
  console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
  fs.writeFileSync(path.join(ROOT, 'test-results', 'results.json'), JSON.stringify({ bySection, failed }, null, 2));
  process.exit(failed.length ? 1 : 0);
})();
