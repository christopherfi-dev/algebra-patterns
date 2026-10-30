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
const FALLBACK = 'Not yet. Try again.';   // not spec text: used where a step has no written hint (see REPORT.md)

/* ---------------- reporting ---------------- */
const results = [];
let section = 'spec text';
function ok(cond, msg) {
  results.push({ section, ok: !!cond, msg });
  if (!cond) console.log(`  FAIL [${section}] ${msg}`);
}
function S(text) { ok(SPEC.includes(text), `spec contains: "${text}"`); return text; }
function H(text) { ok(HANDOFF.includes(text), `handoff contains: "${text}"`); return text; }
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

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
  const kind = (await fb.locator('.note').count()) ? await fb.locator('.note').first().getAttribute('data-kind') : null;
  const says = (await fb.locator('.say').allTextContents()).map(t => t.trim());
  const tests = (await fb.locator('.test').allTextContents()).map(t => t.trim());
  const okmark = await step(p, id).locator(':scope > div .okmark, :scope > .row .okmark').count();
  return { kind, says, tests, okmark };
}
// Type, Check, and confirm the outcome and the exact response text.
async function typed(p, id, values, kind, say, label) {
  await fill(p, id, values);
  await check(p, id);
  const fb = await feedback(p, id);
  const tag = `${label || 'Screen ' + id} typed ${JSON.stringify(values)}`;
  if (kind === 'correct' && say === null) ok(fb.okmark > 0 && fb.says.length === 0, `${tag}: accepted with a tick (got ${JSON.stringify(fb)})`);
  else ok(fb.kind === kind, `${tag}: outcome is ${kind} (got ${fb.kind})`);
  if (say) ok(fb.says.includes(say), `${tag}: says "${say}" (got ${JSON.stringify(fb.says)})`);
  return fb;
}
async function chose(p, id, index, kind, say) {
  await step(p, id).locator(`:scope [data-choice="${index}"]`).first().click();
  await check(p, id);
  const fb = await feedback(p, id);
  const tag = `Screen ${id} choice ${index}`;
  if (kind === 'correct' && say === null) ok(fb.okmark > 0 && fb.says.length === 0, `${tag}: accepted with a tick (got ${JSON.stringify(fb)})`);
  else ok(fb.kind === kind, `${tag}: outcome is ${kind} (got ${fb.kind})`);
  if (say) ok(fb.says.includes(say), `${tag}: says "${say}" (got ${JSON.stringify(fb.says)})`);
  return fb;
}
async function answerCard(p, id) {
  const c = step(p, id).locator(':scope > .demo .answer-card .val');
  return (await c.count()) ? (await c.innerText()).trim() : null;
}
async function next(p) { await p.click('#next'); }
async function whyVisible(p) { return screenEl(p).locator('.why-btn').isVisible(); }
async function whyOpen(p) { return screenEl(p).locator('.why').isVisible(); }
async function openWhy(p) {
  const b = screenEl(p).locator('.why-btn');
  if (await b.isVisible() && (await b.getAttribute('aria-expanded')) !== 'true') await b.click();
}
async function whyText(p) { return (await screenEl(p).locator('.why').innerText()).trim(); }
const lines = async (p, id) => (await step(p, id).locator(':scope > .line').allTextContents()).map(t => t.trim());
async function touchLine(p, a, b) {
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a.x, y: a.y }] });
  for (let i = 1; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: a.x + (b.x - a.x) * i / 12, y: a.y + (b.y - a.y) * i / 12 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}
// Move a slider to its start (Home) or end (End): by keyboard, or by dragging the thumb with a finger.
async function slideTo(p, id, key, mode) {
  const sl = step(p, id).locator(':scope input[type="range"]').first();
  if (mode === 'touch' && (key === 'Home' || key === 'End')) {
    await sl.evaluate(el => el.scrollIntoView({ block: 'center' }));
    const b = await sl.boundingBox();
    const v = await sl.evaluate(el => (el.value - el.min) / (el.max - el.min));
    const y = b.y + b.height / 2, x0 = b.x + 16 + v * (b.width - 32);
    await touchLine(p, { x: x0, y }, { x: key === 'Home' ? b.x - 30 : b.x + b.width + 30, y });
    await p.waitForTimeout(50);
    return;
  }
  await sl.focus();
  await p.keyboard.press(key);
}
// Scroll so that both elements sit in the middle of the screen, clear of the header and nav bars.
async function bringIntoView(p, a, b) {
  const box = loc => loc.evaluate(el => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY }; });
  const ra = await box(a), rb = await box(b);
  const mid = (Math.min(ra.top, rb.top) + Math.max(ra.bottom, rb.bottom)) / 2;
  await p.evaluate(m => window.scrollTo(0, m - innerHeight / 2), mid);
}
// Place a piece on a target: by tapping both (a real touch tap where the page has touch), by mouse drag, or by touch drag.
async function place(p, mode, piece, target) {
  if (mode === 'tap') {
    if (p.touch) { await piece.tap(); await target.tap(); } else { await piece.click(); await target.click(); }
    return;
  }
  await bringIntoView(p, piece, target);
  const pa = await piece.boundingBox(), tb = await target.boundingBox();
  const a = { x: pa.x + pa.width / 2, y: pa.y + pa.height / 2 }, b = { x: tb.x + tb.width / 2, y: tb.y + tb.height / 2 };
  if (mode === 'mouse') {
    await p.mouse.move(a.x, a.y);
    await p.mouse.down();
    await p.mouse.move(a.x + 12, a.y - 12, { steps: 3 });
    await p.mouse.move(b.x, b.y, { steps: 10 });
    await p.mouse.up();
  } else {
    await touchLine(p, a, b);
  }
  await p.waitForTimeout(50);
}
const piece = (p, id, sel = '.piece') => step(p, id).locator(`:scope ${sel}`).first();
async function screenshot(p, name) {
  // The sticky header and fixed nav are made static for full-page captures only, so they don't repeat mid-page.
  const tag = await p.addStyleTag({ content: '.top,.nav{position:static!important}' });
  await p.waitForTimeout(150);
  await p.screenshot({ path: path.join(SHOTS, name + '.png'), fullPage: true });
  await tag.evaluate(el => el.remove());
}
// No sideways page scroll, and no text wider than its box or outside the screen.
async function overflowProblems(p) {
  return p.evaluate(() => {
    const out = [];
    const vw = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > vw + 1) out.push(`page scrolls sideways: ${document.documentElement.scrollWidth} > ${vw}`);
    const sec = document.querySelector('section.screen:not([hidden])');
    sec.querySelectorAll('p, h1, button, label, td, th, figcaption, .field, .choice, .student, .mark-row, .answer-card, .note, svg, input, textarea').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      const tag = `${el.tagName}.${el.getAttribute('class') || ''} "${(el.textContent || '').trim().slice(0, 40)}"`;
      if (el.tagName !== 'svg' && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto') out.push(`${tag} content wider than its box`);
      if (r.right > vw + 0.5 || r.left < -0.5) out.push(`${tag} outside the screen`);
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
    const els = [...sec.querySelectorAll('button, input:not([type="checkbox"]), textarea, [role="button"], .hit'), ...document.querySelectorAll('.nav button')];
    els.forEach(el => {
      if (el.disabled || el.closest('[hidden]')) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.width < 43.5 || r.height < 43.5) out.push(`${el.tagName}.${el.getAttribute('class')} ${el.getAttribute('aria-label') || el.textContent.trim().slice(0, 20)} ${Math.round(r.width)}×${Math.round(r.height)}`);
    });
    sec.querySelectorAll('label.tick').forEach(el => { const r = el.getBoundingClientRect(); if (r.height < 43.5) out.push(`checkbox label ${Math.round(r.width)}×${Math.round(r.height)}`); });
    return out;
  });
}

/* =====================================================================
   SCREEN SCRIPTS
   correct(p, mode): the correct path (mode = how pieces are placed: 'tap', 'mouse' or 'touch').
   wrong(p): every predicted wrong answer in the spec, then the correct answer.
   ===================================================================== */
const SCREENS = {
  1: {
    async correct(p) {
      await typed(p, '1A', '4n + 3', 'correct', S('Right. Each term adds 4, and the value at n = 0 is 3.'));
      ok(!(await whyVisible(p)), 'Screen 1: Why? hidden until the last step is checked');
      await typed(p, '1B', '25', 'correct', S('4n + 3 = 103 gives 4n = 100, so n = 25. 103 is the 25th term.'));
      ok(await whyVisible(p), 'Screen 1: Why? appears after the last step is checked');
    },
    async wrong(p) {
      const fmtMsg = H('Type a rule using n, such as 2n + 5.');
      for (const v of ['n +', '103', 'T = 3n +', '3x + 2']) await typed(p, '1A', v, 'format', fmtMsg);
      const r7 = S('Test it at n = 1: it gives 11, but the first term is 7. 7 is the term at n = 1. The constant is the value at n = 0.');
      await typed(p, '1A', '7 + 4n', 'wrong', r7);
      ok((await step(p, '1A').locator(':scope > .demo').innerText()).trim() === '', 'Screen 1A: no demonstration after one miss; unparseable input is not a miss');
      ok(!(await whyVisible(p)), 'Screen 1A: Why? stays hidden on a non-final step');
      await typed(p, '1A', 'T = 4n + 7', 'wrong', r7, 'Screen 1A (same error, other spelling)');
      ok((await step(p, '1A').locator(':scope > .demo table').count()) === 1, 'Screen 1A: second miss shows the row comparison');
      await p.waitForTimeout(3000);
      const rows = await step(p, '1A').locator(':scope > .demo tr').evaluateAll(trs => trs.map(tr => [...tr.children].map(td => td.textContent.trim())));
      ok(same(rows, [['n', '0', '1', '2', '3', '4'], ['Pattern', '3', '7', '11', '15', '19'],
        [S('"Normal" row (4n)'), '0', '4', '8', '12', '16'], [S('How far off'), '3', '3', '3', '3', '3']]),
        `Screen 1A: row comparison table matches the spec (got ${JSON.stringify(rows)})`);
      await typed(p, '1A', '4 × n', 'wrong', S('4n gives 4, 8, 12, 16. Every term of the pattern is 3 more.'));
      await typed(p, '1A', '5n + 3', 'hint', S('What does each term add? Then find the value at n = 0.'));
      await typed(p, '1A', 'T = 3 + 4n', 'correct', 'Right. Each term adds 4, and the value at n = 0 is 3.', 'Screen 1A (equivalent form)');
      ok(!(await whyVisible(p)), 'Screen 1: Why? still hidden before Step B');
      await typed(p, '1B', 'twenty', 'format', 'Type a number.');
      const r26 = S('Solve 4n + 3 = 103. Undo the + 3 first, then the × 4.');
      await typed(p, '1B', '26', 'wrong', r26);
      ok(await whyVisible(p), 'Screen 1: Why? appears after a predicted error on the last step');
      await typed(p, '1B', '100', 'wrong', r26);
      ok((await answerCard(p, '1B')) === 'n = 25', 'Screen 1B: second miss shows the answer');
      ok(await whyOpen(p), 'Screen 1B: second miss opens the Why? text');
      await typed(p, '1B', 'n = 25', 'correct', '4n + 3 = 103 gives 4n = 100, so n = 25. 103 is the 25th term.');
    },
    why: S('Each term adds 4, so the coefficient is 4. The pattern is always 3 more than the 4 times table, and at n = 0 it would be 3, so the constant is 3. The rule is T = 4n + 3. To find which term is 103, solve 4n + 3 = 103: n = 25.'),
  },

  2: {
    async correct(p, mode) {
      await typed(p, '2A', '2', 'correct', S('The same 2 tiles, in every figure.'));
      await typed(p, '2B', '3', 'correct', S('Each figure adds one group of 3 in the second colour.'));
      await place(p, mode, piece(p, '2C1'), step(p, '2C1').locator('.drop'));
      ok(await step(p, '2C2').isVisible(), `Screen 2C: the group is placed by ${mode}`);
      ok((await step(p, '2C1').locator('rect.t-coef').count()) === 12 && (await step(p, '2C1').locator('rect.t-const').count()) === 2, 'Screen 2C: Figure 4 is drawn with 2 fixed tiles and 4 groups of 3');
      await typed(p, '2C2', '14', 'correct', S('4 groups of 3, plus the 2 fixed tiles: 14.'));
    },
    async wrong(p) {
      await typed(p, '2A', '5', 'wrong', S('5 is all of Figure 1. Count only the colour that stays the same size.'));
      await typed(p, '2A', '2 tiles', 'correct', 'The same 2 tiles, in every figure.');
      await typed(p, '2B', '5', 'wrong', S('5 is the whole of Figure 1. Compare Figure 1 and Figure 2: what was added?'));
      await typed(p, '2B', '3', 'correct', 'Each figure adds one group of 3 in the second colour.');
      await place(p, 'mouse', piece(p, '2C1'), step(p, '2C1').locator('.drop'));
      ok(await step(p, '2C2').isVisible(), 'Screen 2C: a mouse drag places the group');
      await typed(p, '2C2', '12', 'wrong', S('You counted the groups. The 2 fixed tiles are in every figure too.'));
      await typed(p, '2C2', '20', 'wrong', S('Figure 1 has 5 tiles, but only 3 of them repeat.'));
      ok((await answerCard(p, '2C2')) === '14', 'Screen 2C: second miss shows the answer');
      await typed(p, '2C2', '14.0', 'correct', '4 groups of 3, plus the 2 fixed tiles: 14.');
    },
    why: S('Every figure has the same 2 fixed tiles. Each new figure adds one group of 3. So Figure 4 has 4 groups of 3 and the 2 fixed tiles: 12 + 2 = 14.'),
  },

  3: {
    async correct(p, mode) {
      ok(!(await step(p, '3A2').count()), 'Screen 3: the count question waits for the slider');
      await slideTo(p, '3A1', 'Home', mode);
      ok((await step(p, '3A1').locator('figcaption').innerText()).trim() === 'Figure 0', 'Screen 3A: slider reaches Figure 0');
      ok((await step(p, '3A1').locator('rect.t-const').count()) === 2 && (await step(p, '3A1').locator('rect.t-coef').count()) === 0, 'Screen 3A: Figure 0 is the 2 fixed tiles');
      await typed(p, '3A2', '2', 'correct', S('Figure 0 has no groups, only the 2 fixed tiles.'));
      await typed(p, '3B', 'T = 3n + 2', 'correct', S('Right. Slide to check any figure.'));
      await slideTo(p, '3A1', 'End', mode);
      const ro = (await step(p, '3A1').locator('.readout').innerText()).trim();
      ok(ro === 'T = 3 × 10 + 2 = 32', `Screen 3B: sliding checks any figure (got "${ro}")`);
    },
    async wrong(p) {
      await slideTo(p, '3A1', 'Home');
      await typed(p, '3A2', '5', 'wrong', S('5 is Figure 1. Take away its group of 3.'));
      await typed(p, '3A2', '0', 'wrong', S('The groups are gone, but look at the picture: the fixed tiles stay.'));
      await typed(p, '3A2', '2', 'correct', 'Figure 0 has no groups, only the 2 fixed tiles.');
      const fb1 = await typed(p, '3B', '3n + 5', 'wrong', S('5 is the total for Figure 1. The constant is the value at Figure 0.'));
      ok(same(fb1.tests, ['n = 1: 8, not 5']) && SPEC.includes('n = 1: 8, not 5'), `Screen 3B: tests 5 + 3n at n = 1 (got ${JSON.stringify(fb1.tests)})`);
      ok((await step(p, '3A1').locator('figcaption').innerText()).trim() === 'Figure 1', 'Screen 3B: the picture moves to Figure 1 for the test');
      const fb2 = await typed(p, '3B', '5 × n', 'wrong', S('Only 3 tiles repeat in each figure, not 5.'));
      ok(same(fb2.tests, ['n = 2: 10, not 8']) && SPEC.includes('n = 2: 10, not 8'), `Screen 3B: tests 5n at n = 2 (got ${JSON.stringify(fb2.tests)})`);
      ok((await answerCard(p, '3B')) === 'T = 3n + 2' && (await whyOpen(p)), 'Screen 3B: second miss shows the answer and the Why? text');
      await typed(p, '3B', 'n + 2', 'hint', S('How many tiles does each figure add, and how many are there at Figure 0?'));
      await typed(p, '3B', '2 + 3n', 'correct', 'Right. Slide to check any figure.');
    },
    why: S("The coefficient 3 counts the tiles in each group, so it multiplies the figure number n. The constant 2 counts the fixed tiles, which are there even at Figure 0. You can also see it in a table, the way you'd compare rows:"),
    async extra(p) {
      const rows = await screenEl(p).locator('.why tr').evaluateAll(trs => trs.map(tr => [...tr.children].map(td => td.textContent.trim())));
      ok(same(rows, [['n', '0', '1', '2', '3', '4'], ['Tiles', '2', '5', '8', '11', '14'], [S('"Normal" row (3n)'), '0', '3', '6', '9', '12'], ['How far off', '2', '2', '2', '2', '2']]),
        `Screen 3: Why? table matches the spec (got ${JSON.stringify(rows)})`);
      ok((await whyText(p)).includes(S('The picture and the table give the same constant. T = 3n + 2.')), 'Screen 3: Why? closing line');
    },
  },

  4: {
    async correct(p) { await chose(p, '4A', 1, 'correct', null); },
    async wrong(p) {
      await chose(p, '4A', 0, 'wrong', S('Check it: 3 × 1 + 2 = 5. The rule is right. The first total and the constant are different things.'));
      await chose(p, '4A', 2, 'wrong', S("It isn't coincidence. The first total always includes one group; the constant is what's there before any group."));
      ok((await step(p, '4A').locator('.choice.is-answer').count()) === 1 && (await whyOpen(p)), 'Screen 4: second miss marks the answer and opens Why?');
      await chose(p, '4A', 1, 'correct', null);
    },
    why: S('The first total includes one group, so it is the constant plus the coefficient: 2 + 3 = 5. The constant is the value at Figure 0, before any groups are added. Reading the first total as the constant is the most common mistake with these rules.'),
    async extra(p) {
      const opts = await step(p, '4A').locator('.choice').allTextContents();
      ok(opts.map(t => t.trim()).every(t => SPEC.includes(t)), 'Screen 4: the three explanations are the spec\'s');
    },
  },

  5: {
    async correct(p) { await typed(p, '5A', 'Figure 7', 'correct', S('3n + 2 = 23 gives 3n = 21, so n = 7.')); },
    async wrong(p) {
      const hint = S('Undo the + 2 first, then the × 3.');
      await typed(p, '5A', '8', 'hint', hint);
      await typed(p, '5A', '23', 'hint', hint);
      ok((await answerCard(p, '5A')) === 'Figure 7', 'Screen 5: second miss shows the answer');
      await typed(p, '5A', '7', 'correct', '3n + 2 = 23 gives 3n = 21, so n = 7.');
    },
    why: S('The rule turns a figure number into a total. To go backwards, set the rule equal to the total and solve: 3n + 2 = 23, so 3n = 21 and n = 7. Figure 7 has 23 tiles: 7 groups of 3, plus the 2 fixed tiles.'),
    async extra(p) { ok((await screenEl(p).locator('.why rect.t-coef').count()) === 21, 'Screen 5: Why? draws Figure 7 with 7 groups of 3'); },
  },

  6: {
    async correct(p) {
      await typed(p, '6A1', '5', 'correct', null);
      await chose(p, '6A2', 1, 'correct', S('Maybe. Always try another one.'));
      ok(!(await step(p, '6B').locator('[data-count]').first().isVisible()), 'Screen 6B: real counts appear only after Check');
      await typed(p, '6B', [0, 50], 'correct', S('Figure 0 has 2 tiles, not 0. Figure 10 has 32, not 50. The rule is wrong.'));
      const counts = (await step(p, '6B').locator('[data-count]').allTextContents()).map(t => t.trim());
      ok(same(counts, ['· 2 tiles', '· 32 tiles']), `Screen 6B: the pictures show the real counts (got ${JSON.stringify(counts)})`);
      await typed(p, '6C', [2, 5, 32], 'correct', S('It works for all three, including Figure 0 and a figure far away.'));
      await chose(p, '6D', 1, 'correct', null);
    },
    async wrong(p) {
      await typed(p, '6A1', '6', 'hint', FALLBACK);
      await typed(p, '6A1', '5', 'correct', null);
      await chose(p, '6A2', 0, 'wrong', S("It works for Figure 1, but one figure isn't enough. Try another one."));
      await chose(p, '6A2', 1, 'correct', 'Maybe. Always try another one.');
      await typed(p, '6B', [2, 32], 'hint', FALLBACK);
      await typed(p, '6B', [0, 50], 'correct', 'Figure 0 has 2 tiles, not 0. Figure 10 has 32, not 50. The rule is wrong.');
      await typed(p, '6C', [2, 5, 30], 'wrong', S('Substitute again: 3 × n, then add 2.'));
      await typed(p, '6C', [2, 5, 32], 'correct', 'It works for all three, including Figure 0 and a figure far away.');
      await chose(p, '6D', 0, 'wrong', S('So did 5n. One figure can fit a wrong rule.'));
      await chose(p, '6D', 1, 'correct', null);
    },
    why: S('One figure can fit a wrong rule: 5n and 3n + 2 both give 5 at Figure 1. Another check exposes the wrong one. Figure 0 is a good test because it checks the constant, the tiles there before any group. A figure far away, like Figure 10, checks the coefficient, because a wrong coefficient drifts further off with every figure. When a pattern adds the same amount every time and a straight-line rule works for three figures, it works for all of them.'),
  },

  7: {
    async correct(p, mode) {
      const counts = await screenEl(p).locator('.card').first().locator('svg').evaluateAll(svgs => svgs.map(s => s.querySelectorAll('line.stick').length));
      ok(same(counts, [4, 7, 10]), `Screen 7: Figures 1 to 3 have 4, 7 and 10 sticks (got ${JSON.stringify(counts)})`);
      for (const e of ['t3', 'b3', 'v4']) await place(p, mode, piece(p, '7A1'), step(p, '7A1').locator(`[data-hit="${e}"]`));
      ok(await step(p, '7A2').isVisible(), `Screen 7A: Figure 4 is built by ${mode}`);
      await typed(p, '7A2', '13', 'correct', S('Each new square needs only 3 sticks. It shares one with its neighbour.'));
      await typed(p, '7B', '31', 'correct', S('1 + 3 × 10 = 31.'));
    },
    async wrong(p) {
      const taken = S('That edge is already there.');
      await place(p, 'mouse', piece(p, '7A1'), step(p, '7A1').locator('[data-hit="v3"]'));
      ok(same((await feedback(p, '7A1')).says, [taken]), 'Screen 7A: a stick dropped (mouse) on an existing edge is rejected');
      await place(p, 'tap', piece(p, '7A1'), step(p, '7A1').locator('[data-hit="t0"]'));
      ok(same((await feedback(p, '7A1')).says, [taken]), 'Screen 7A: a stick tapped onto an existing edge is rejected');
      for (const e of ['t3', 'b3', 'v4']) await place(p, 'mouse', piece(p, '7A1'), step(p, '7A1').locator(`[data-hit="${e}"]`));
      ok((await step(p, '7A1').locator('line.stick').count()) === 13, 'Screen 7A: Figure 4 has 13 sticks once built');
      await typed(p, '7A2', '16', 'hint', FALLBACK);
      await typed(p, '7A2', '13 sticks', 'correct', 'Each new square needs only 3 sticks. It shares one with its neighbour.');
      await typed(p, '7B', '30', 'wrong', S("3 for each square. Now look at Figure 1: does it follow the same pattern? It's 1 + 3."));
      await typed(p, '7B', '40', null);
      ok((await answerCard(p, '7B')) === null, 'Screen 7B: 40 starts Marc\'s move, not the default second miss');
      ok(!(await whyVisible(p)), 'Screen 7B: Why? stays hidden during Marc\'s move');
      await screen7Path(p, '11');
      ok(await whyVisible(p), 'Screen 7B: Why? appears when Marc\'s move ends');
    },
    why: S('Every square after the first adds only 3 sticks, because it shares an edge with the square before it. The first square follows the same pattern if you see it as 1 stick plus 3. So Figure 1 is 1 + 3, Figure 2 is 1 + two 3s, Figure 3 is 1 + three 3s, and Figure 10 is 1 + ten 3s = 31.'),
  },

  8: {
    async correct(p, mode) {
      await typed(p, '8A', [4, 7, 10, 4, 7, 10], 'correct', S('The same values for all three. Are they the same for every n? Simplify the second rule to find out.'));
      ok((await step(p, '8B').locator('.reminder').innerText()).trim() === S('The distributive property: 3(n − 1) = 3 × n − 3 × 1.'), 'Screen 8B: reminder card');
      await typed(p, '8B', 'S = 3n + 1', 'correct', S('4 + 3n − 3 = 3n + 1. The two rules are the same.'));
      await slideTo(p, '8C1', 'Home', mode);
      ok((await step(p, '8C1').locator('line.stick').count()) === 1 && (await step(p, '8C1').locator('line.stick.const').count()) === 1, 'Screen 8C: Figure 0 is one lone stick in the constant colour');
      await typed(p, '8C2', '1', 'correct', S('One lone stick: the constant in 3n + 1.'));
    },
    async wrong(p) {
      await typed(p, '8A', [4, 7, 10, 4, 7, 11], 'wrong', S('Work inside the bracket first, then multiply by 3, then add 4.'));
      await typed(p, '8A', [4, 7, 9, 4, 7, 10], 'hint', FALLBACK);
      ok(((await answerCard(p, '8A')) || '').includes('4, 7, 10'), 'Screen 8A: second miss shows the values');
      await typed(p, '8A', [4, 7, 10, 4, 7, 10], 'correct', 'The same values for all three. Are they the same for every n? Simplify the second rule to find out.');
      await typed(p, '8B', '4 + 3n − 3', 'partial', S('Correct so far. Now combine the numbers 4 and −3.'));
      await typed(p, '8B', '3n + 4 - 3', 'partial', 'Correct so far. Now combine the numbers 4 and −3.', 'Screen 8B (other order)');
      let fb = await typed(p, '8B', '3n + 3', 'wrong', S('The 3 multiplies both terms in the bracket. You multiplied the n but not the 1.'));
      ok(same(fb.tests, [S('Test at n = 1: 6, but the original gives 4.')]), `Screen 8B 3n + 3: substitution test (got ${JSON.stringify(fb.tests)})`);
      fb = await typed(p, '8B', '3 + 3n', 'wrong', 'The 3 multiplies both terms in the bracket. You multiplied the n but not the 1.', 'Screen 8B (3 + 3n, same error)');
      fb = await typed(p, '8B', '3n + 7', 'wrong', S('3 × (−1) is −3, not +3.'));
      ok(same(fb.tests, [S('Test at n = 1: 10, but the original gives 4.')]), `Screen 8B 3n + 7: substitution test (got ${JSON.stringify(fb.tests)})`);
      fb = await typed(p, '8B', '7n − 7', 'wrong', S('You added 4 + 3 before multiplying. Multiply 3(n − 1) first.'));
      ok(same(fb.tests, [S('Test: at n = 2 both give 7, but at n = 1 yours gives 0 and the original gives 4.')]), `Screen 8B 7n − 7: substitution test (got ${JSON.stringify(fb.tests)})`);
      ok(fb.says.includes(S("It matched one figure. One substitution isn't enough.")), 'Screen 8B 7n − 7: "One substitution isn\'t enough."');
      fb = await typed(p, '8B', '7(n − 1)', 'wrong', 'You added 4 + 3 before multiplying. Multiply 3(n − 1) first.', 'Screen 8B (7(n − 1), same error)');
      fb = await typed(p, '8B', '7n − 3', 'wrong', S("4 and 3n aren't like terms. Only the numbers 4 and −3 combine."));
      ok(same(fb.tests, [S('Test: at n = 1 both give 4, but at n = 2 yours gives 11 and the original gives 7.')]), `Screen 8B 7n − 3: substitution test (got ${JSON.stringify(fb.tests)})`);
      fb = await typed(p, '8B', '2n + 2', 'hint', S('Distribute first: 3 × n and 3 × (−1). Then combine the numbers.'));
      ok(same(fb.tests, ['Test at n = 2: 6, but the original gives 7.']), `Screen 8B unpredicted: tested by substitution where it breaks (got ${JSON.stringify(fb.tests)})`);
      await typed(p, '8B', '4 + 3(n − 1)', 'hint', 'Distribute first: 3 × n and 3 × (−1). Then combine the numbers.', 'Screen 8B (unchanged)');
      await typed(p, '8B', 'S = 1 + 3n', 'correct', '4 + 3n − 3 = 3n + 1. The two rules are the same.');
      await slideTo(p, '8C1', 'Home');
      await typed(p, '8C2', '4', 'wrong', S('4 is Figure 1. Take away its three sticks.'));
      await typed(p, '8C2', '1', 'correct', 'One lone stick: the constant in 3n + 1.');
    },
    why: S('Substituting n = 1, 2 and 3 showed the two rules agree for three figures. Simplifying shows why they agree for every figure: 4 + 3(n − 1) = 4 + 3n − 3 = 3n + 1. In the picture, 4 + 3(n − 1) counts the first full square, then 3 sticks for each square after it. 3n + 1 counts one starting stick, then 3 for every square. Same sticks, grouped differently.'),
  },

  9: {
    async correct(p) {
      await typed(p, '9A', '121', 'correct', S('3 × 40 + 1 = 121.'));
      await typed(p, '9B', '33', 'correct', S('3n + 1 = 100 gives 3n = 99, so n = 33.'));
    },
    async wrong(p) {
      await typed(p, '9A', '160', 'hint', FALLBACK);
      await typed(p, '9A', '121 sticks', 'correct', '3 × 40 + 1 = 121.');
      await typed(p, '9B', '34', 'hint', S('Undo the + 1 first, then the × 3.'));
      await typed(p, '9B', 'Figure 33', 'correct', '3n + 1 = 100 gives 3n = 99, so n = 33.');
    },
    why: S('Forward, the rule takes a figure number and gives the sticks: Figure 40 needs 3 × 40 + 1 = 121. Backward, set the rule equal to the sticks and solve: 3n + 1 = 100, so n = 33.'),
  },

  10: {
    async correct(p, mode) {
      const area = id => step(p, id).locator('.buildarea');
      await place(p, mode, piece(p, '10A', '[data-piece="stick"]'), area('10A'));
      ok(await piece(p, '10A', '[data-piece="stick"]').isDisabled(), 'Screen 10A: Mina\'s rule takes exactly 1 constant stick');
      await place(p, mode, piece(p, '10A', '[data-piece="group"]'), area('10A'));
      ok(same((await feedback(p, '10A')).says, [S("That's Figure 1.")]), `Screen 10A: Mina's build is Figure 1 (by ${mode})`);
      ok((await step(p, '10A').locator('line.stick.const').count()) === 1 && (await step(p, '10A').locator('line.stick.coef').count()) === 3, 'Screen 10A: 1 constant stick, 1 group of 3');
      for (let i = 0; i < 4; i++) await place(p, mode, piece(p, '10B1', '[data-piece="stick"]'), area('10B1'));
      await place(p, mode, piece(p, '10B1', '[data-piece="group"]'), area('10B1'));
      ok((await step(p, '10B1').locator('line.stick').count()) === 7, 'Screen 10B: Arun\'s build has 7 sticks: two squares');
      await typed(p, '10B2', '2', 'correct', null);
      await typed(p, '10B3', 'Figure 2', 'correct', S("Arun's rule built Figure 2 when it should have built Figure 1."));
      ok(await piece(p, '10C', '[data-piece="group"]').isDisabled(), 'Screen 10C: Nina adds 3 × (1 − 1) = 0 groups');
      for (let i = 0; i < 4; i++) await place(p, mode, piece(p, '10C', '[data-piece="stick"]'), area('10C'));
      ok(same((await feedback(p, '10C')).says, ["That's Figure 1."]), 'Screen 10C: Nina\'s build is Figure 1');
      for (const m of ['0-0', '1-1', '2-0']) await step(p, '10D').locator(`[data-mark="${m}"]`).click();
      await check(p, '10D');
      ok((await feedback(p, '10D')).okmark > 0, 'Screen 10D: Mina correct, Arun incorrect, Nina correct');
      ok(!(await whyVisible(p)), 'Screen 10: Why? waits for the explanation');
      await step(p, '10E').locator('textarea').fill('His 4 is already a square, so he is one square ahead.');
      await step(p, '10E').locator('button').click();
      ok((await step(p, '10E').locator('.model').innerText()).trim() === S("Arun's 4 is already a whole square. Then he adds 3 more sticks for every square, so he counts one square too many."), 'Screen 10E: model explanation beside the learner\'s');
      await step(p, '10E').locator('label.tick').click();
      ok(await step(p, '10E').locator('input[type="checkbox"]').isChecked(), 'Screen 10E: the learner can tick that theirs says the same thing');
    },
    async wrong(p) {
      await SCREENS[10].buildOnly(p, 'mouse');
      await typed(p, '10B2', '1', 'hint', FALLBACK);
      await typed(p, '10B2', '2', 'correct', null);
      await typed(p, '10B3', '1', 'hint', FALLBACK);
      await typed(p, '10B3', '2', 'correct', "Arun's rule built Figure 2 when it should have built Figure 1.");
      for (let i = 0; i < 4; i++) await place(p, 'mouse', piece(p, '10C', '[data-piece="stick"]'), step(p, '10C').locator('.buildarea'));
      for (const m of ['0-0', '1-0', '2-0']) await step(p, '10D').locator(`[data-mark="${m}"]`).click();
      await check(p, '10D');
      ok(same((await feedback(p, '10D')).says, [S('Build his rule for Figure 1 again and count the squares.')]), 'Screen 10D: Arun marked correct');
      for (const m of ['0-1', '1-1', '2-0']) await step(p, '10D').locator(`[data-mark="${m}"]`).click();
      await check(p, '10D');
      ok((await feedback(p, '10D')).kind === 'hint', 'Screen 10D: Mina marked incorrect gets the general response');
      for (const m of ['0-0', '1-1', '2-0']) await step(p, '10D').locator(`[data-mark="${m}"]`).click();
      await check(p, '10D');
      ok((await feedback(p, '10D')).okmark > 0, 'Screen 10D: correct after two misses');
      ok(await step(p, '10E').locator('button').isDisabled(), 'Screen 10E: Compare waits for the learner to write something');
      await step(p, '10E').locator('textarea').fill('He starts with a whole square.');
      await step(p, '10E').locator('button').click();
    },
    async buildOnly(p, mode) {
      const area = id => step(p, id).locator('.buildarea');
      await place(p, mode, piece(p, '10A', '[data-piece="group"]'), area('10A'));
      await place(p, mode, piece(p, '10A', '[data-piece="stick"]'), area('10A'));
      ok(same((await feedback(p, '10A')).says, ["That's Figure 1."]), `Screen 10A: pieces in either order build Figure 1 (by ${mode})`);
      for (let i = 0; i < 4; i++) await place(p, mode, piece(p, '10B1', '[data-piece="stick"]'), area('10B1'));
      await place(p, mode, piece(p, '10B1', '[data-piece="group"]'), area('10B1'));
    },
    why: S("Arun's constant, 4, is already a complete square. His 3n then adds a three-stick piece for every square, so at n = 1 he builds two squares: Figure 2. Mina starts from 1 stick, so n pieces of 3 make exactly n squares. Nina keeps the full first square but uses (n − 1), so she only adds pieces for the squares after the first. Her rule simplifies to Mina's: equivalent rules can look different and still give the same value for every n."),
  },

  11: {
    async correct(p, mode) {
      await typed(p, '11A', '16', 'correct', null);
      for (let i = 0; i < 3; i++) await place(p, mode, piece(p, '11B1'), step(p, '11B1').locator('.drop'));
      const chips = (await step(p, '11B1').locator('.chip b').allTextContents()).map(t => t.trim());
      ok(same(chips, ['3', '5', '7']), `Screen 11B: the borders appear 3, 5, 7 (got ${JSON.stringify(chips)})`);
      await typed(p, '11B2', '9', 'correct', S('Each border is 2 tiles longer than the one before.'));
      await chose(p, '11C', 1, 'correct', null);
    },
    async wrong(p) {
      await typed(p, '11A', '12', 'wrong', S("That's adding 3 again. Build it: a 4-by-4 square."));
      ok((await step(p, '11A').locator('rect.slot').count()) === 16, 'Screen 11A: a 4-by-4 outline appears to build');
      await typed(p, '11A', '16', 'correct', null);
      for (let i = 0; i < 3; i++) await place(p, 'mouse', piece(p, '11B1'), step(p, '11B1').locator('.drop'));
      await typed(p, '11B2', '7', 'wrong', S("That's the border from 3 × 3 to 4 × 4. The next one turns 4 × 4 into 5 × 5."));
      await typed(p, '11B2', '9 tiles', 'correct', 'Each border is 2 tiles longer than the one before.');
      await chose(p, '11C', 0, 'hint', FALLBACK);
      await chose(p, '11C', 1, 'correct', null);
    },
    why: S("Each new square adds an L-shaped border around two sides. The borders are 3, 5, 7, 9: they grow by 2 every time, because each side of the square is 1 longer. With no common difference, this pattern can't be arithmetic."),
  },

  12: {
    async correct(p) {
      ok(!(await whyVisible(p)), 'Screen 12: Why? hidden before trying');
      await step(p, '12A').locator('[data-cant]').click();
      await SCREENS[12].revealed(p);
    },
    async wrong(p) {
      const dial = async (name, value) => step(p, '12A').locator(`[data-dial="${name}"]`).evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
      await dial('a', 3); await dial('b', -2);
      ok((await step(p, '12A').locator('.formula').innerText()).trim() === 'T = 3n − 2', 'Screen 12: the dials set T = an + b');
      await check(p, '12A');
      ok((await step(p, '12A').locator('circle.ring:not([hidden])').count()) === 2, 'Screen 12: T = 3n − 2 passes through two points');
      await dial('a', 7); await dial('b', -12);
      await check(p, '12A');
      ok(!(await whyVisible(p)), 'Screen 12: border row not back after two tries');
      await check(p, '12A');
      await SCREENS[12].revealed(p);
    },
    async revealed(p) {
      ok(await whyVisible(p), 'Screen 12: Why? appears with the border row');
      const chips = (await step(p, '12A').locator('.chip b').allTextContents()).map(t => t.trim());
      ok(same(chips, ['3', '5', '7']), `Screen 12: the border row reappears: 3, 5, 7 (got ${JSON.stringify(chips)})`);
      const rises = (await step(p, '12A').locator('text.rl').allTextContents()).map(t => t.trim());
      ok(same(rises, ['+3', '+5', '+7']), `Screen 12: the graph shows the steps 3, 5, 7 (got ${JSON.stringify(rises)})`);
    },
    why: S('A straight-line rule adds the same amount every step. These figures add 3, then 5, then 7. No single a works, so no line passes through every point.'),
  },

  13: {
    async correct(p) {
      ok((await screenEl(p).locator('[data-ring="4"].lit').count()) === 0, 'Screen 13: the border is not lit before the answer');
      await typed(p, '13A', '7', 'correct', S('7 metres in 1 second, the same 7 as the border.'));
      ok((await screenEl(p).locator('[data-ring="4"].lit rect').count()) === 7, 'Screen 13: the 7-tile border from 3 × 3 to 4 × 4 lights up');
    },
    async wrong(p) {
      await typed(p, '13A', '16', 'wrong', S("That's how far it has rolled after 4 seconds. Speed is distance travelled ÷ time taken."));
      await typed(p, '13A', '4 m/s', 'wrong', S("That's the average from 0 to 4 seconds. We want 3 to 4."));
      ok((await answerCard(p, '13A')) === '7 m/s', 'Screen 13: second miss shows the answer');
      await typed(p, '13A', '7 m/s', 'correct', '7 metres in 1 second, the same 7 as the border.');
    },
    why: S("Average speed = distance travelled ÷ time taken. From 3 to 4 seconds the ball goes from 9 m to 16 m, 7 m in 1 second. It's the same 7 as the border, because d = t² is the square pattern with time allowed to be any number."),
    async extra(p) {
      const rows = await screenEl(p).locator('table.t').first().evaluate(t => [...t.rows].map(r => [...r.cells].map(c => c.textContent.trim())));
      ok(same(rows, [['t (s)', '0', '1', '2', '3', '4'], ['d (m)', '0', '1', '4', '9', '16']]), `Screen 13: the table matches the spec (got ${JSON.stringify(rows)})`);
    },
  },

  14: {
    async correct(p, mode) {
      ok(same(await SCREENS[14].table(p), ['7', '?', '', '']), 'Screen 14: the table starts 7, ?');
      ok((await step(p, '14A').locator('.prompt').innerText()).includes(S('distance at 3.5 s: 12.25 m')), 'Screen 14A: distance at 3.5 s is 12.25 m');
      await typed(p, '14A', '6.5', 'correct', S('3.25 m in 0.5 s.'));
      await slideTo(p, '14B1', 'End', mode);
      ok(same(await SCREENS[14].table(p), ['7', '6.5', '6.1', '6.01']), `Screen 14: the speeds are 7, 6.5, 6.1, 6.01 (got ${JSON.stringify(await SCREENS[14].table(p))})`);
      await typed(p, '14B2', '6', 'correct', S("6 m/s, the ball's speed at the instant t = 3."));
    },
    async wrong(p) {
      await typed(p, '14A', '3.25', 'wrong', S("That's the distance travelled. It took 0.5 seconds. Divide."));
      await typed(p, '14A', '6.50 m/s', 'correct', '3.25 m in 0.5 s.');
      ok(!(await step(p, '14B2').count()), 'Screen 14B: the question waits until h has been slid toward 0');
      await slideTo(p, '14B1', 'PageUp');
      await slideTo(p, '14B1', 'End');
      await typed(p, '14B2', '6.01', 'wrong', S("That's the average over a tiny gap. What number are these closing in on?"));
      await typed(p, '14B2', '0', 'wrong', S("The border shrinks, but border ÷ h doesn't. Look at 6.5, 6.1, 6.01."));
      ok((await answerCard(p, '14B2')) === '6 m/s' && (await whyOpen(p)), 'Screen 14B: second miss shows the answer and Why?');
      await typed(p, '14B2', '6', 'correct', "6 m/s, the ball's speed at the instant t = 3.");
    },
    async table(p) { return screenEl(p).locator('table.t tr').nth(1).locator('td').allTextContents().then(a => a.map(t => t.trim())); },
    why: S('The border is two strips, each 3 × h, plus a corner, h × h, so its area is 6h + h². Divide by the time h: the average speed is 6 + h. As h shrinks, the corner vanishes and the average closes in on 6. That number is the speed at a single instant, the first idea of calculus.'),
  },

  15: {
    async correct(p) {
      ok(!(await whyVisible(p)), 'Screen 15: no Why? before submitting');
      ok((await screenEl(p).locator('.hint, .demo .answer-card').count()) === 0, 'Screen 15: no hints');
      await SCREENS[15].fillAll(p, ['P = 24 + 6n', '24', '66', '18', 'P = 30 + 6(n − 1)', 0, 1]);
      await screenEl(p).locator('[data-submit]').click();
      const marks = await screenEl(p).locator('.item .okmark').count();
      ok(marks === 7, `Screen 15: all seven items correct (got ${marks})`);
      ok((await screenEl(p).locator('.item .note').count()) === 0, 'Screen 15: no responses when all correct');
    },
    async wrong(p) {
      await SCREENS[15].fillAll(p, ['abc', '30', '60', '24', '24 + 6n', 1, 0]);
      await screenEl(p).locator('[data-submit]').click();
      ok(same((await screenEl(p).locator('[data-item="1"] .say').allTextContents()), [H('Type a rule using n, such as 2n + 5.')]) && await screenEl(p).locator('[data-item="1"] input').isEnabled(),
        'Screen 15: an unreadable rule is flagged and the ticket is not submitted');
      await screenEl(p).locator('[data-item="1"] input').fill('6n + 30');
      await screenEl(p).locator('[data-submit]').click();
      const expect = [
        S("The 24 plants are there before any beds: that's the constant. Each bed adds 6: that's the coefficient."),
        S('With no new beds, only the starting plants are there.'),
        S('24 + 6 × 7 = 24 + 42.'),
        S("24 + 6(0 − 1) = 18, not 24: it's shifted by one bed, like Arun's rule."),
        S('Counting from the first bed, start from its total: 30.'),
        S('Only that one adds the same amount each step.'),
        S("That checks two cases. It doesn't explain why it works for every n."),
      ];
      for (let i = 0; i < 7; i++) {
        const got = (await screenEl(p).locator(`[data-item="${i + 1}"] .say`).allTextContents()).map(t => t.trim());
        ok(same(got, [expect[i]]), `Screen 15 item ${i + 1}: response after submission (got ${JSON.stringify(got)})`);
      }
      ok((await screenEl(p).locator('[data-item="6"] .choice.is-answer').innerText()).trim() === '6, 10, 14, 18', 'Screen 15 item 6: "that one" is marked: 6, 10, 14, 18');
      ok(!(await whyVisible(p)), 'Screen 15: the spec gives no Why? text for the exit ticket');
    },
    async fillAll(p, vals) {
      for (let i = 0; i < vals.length; i++) {
        const item = screenEl(p).locator(`[data-item="${i + 1}"]`);
        if (typeof vals[i] === 'number') await item.locator(`[data-choice="${vals[i]}"]`).click();
        else await item.locator('input').fill(vals[i]);
      }
    },
    async extra(p) {
      const opts = (await screenEl(p).locator('[data-item="6"] .choice').allTextContents()).map(t => t.trim());
      ok(same(opts, ['6, 10, 14, 18', '1, 4, 9, 16', '2, 4, 8, 16']), `Screen 15 item 6: the three patterns (got ${JSON.stringify(opts)})`);
    },
  },

  16: {
    async correct(p) {
      const t = await SCREENS[16].ticks(p);
      ok(t.length === 8 && t.every(Boolean), `Screen 16: all eight items ticked on the correct path (got ${JSON.stringify(t)})`);
      ok(await p.locator('#next').isHidden(), 'Screen 16: no Next on the last screen');
    },
    async wrong(p) {
      // Second-miss demonstrations happened on Screens 2, 3, 4, 5, 8 and 14 in this run; 6 and 11 had misses but no second miss.
      const t = await SCREENS[16].ticks(p);
      ok(same(t, [false, false, false, false, true, false, true, false]), `Screen 16: ticks follow what the learner did (got ${JSON.stringify(t)})`);
    },
    async ticks(p) { return screenEl(p).locator('.checklist li').evaluateAll(li => li.map(x => x.dataset.ticked === 'true')); },
    async extra(p) {
      const items = (await screenEl(p).locator('.checklist li').allTextContents()).map(t => t.trim());
      ok(items.every(t => SPEC.includes(t)), `Screen 16: the eight items are the spec's (got ${JSON.stringify(items)})`);
    },
  },
};

// Screen 7, answer 40: Marc's move, step by step. prediction = the learner's answer for Figure 3.
async function screen7Path(p, prediction) {
  await typed(p, '7·1', '8', 'correct', null, 'Screen 7 move step 1');
  ok((await step(p, '7·1').locator('.prompt').innerText()).trim() === S('If each square has 4 sticks, how many would Figure 2 have?'), 'Screen 7 move step 1 prompt');
  ok(same(await lines(p, '7·2'), [S('Count them.')]), 'Screen 7 move step 2: "Count them."');
  await step(p, '7·3').waitFor({ timeout: 15000 });
  ok((await step(p, '7·2').locator('.counter').innerText()).trim() === '7', 'Screen 7 move step 2: Figure 2\'s sticks light up one by one: 7');
  ok(same(await lines(p, '7·2'), ['Count them.', S('Why?')]), 'Screen 7 move step 2: "Why?"');
  ok((await step(p, '7·2').locator('line.flash').count()) === 1, 'Screen 7 move step 2: the shared edge flashes');
  ok((await step(p, '7·3').locator('.prompt').innerText()).trim() === S('Then how many does Figure 3 have?'), 'Screen 7 move step 3 prompt');
  if (prediction === '10') {
    await typed(p, '7·3', '10', 'correct', S('Right.'), 'Screen 7 move step 3');
  } else {
    await typed(p, '7·3', prediction, null, undefined, 'Screen 7 move step 3');
    await step(p, '7·4').waitFor({ timeout: 15000 });
    ok((await step(p, '7·3b').locator('.counter').innerText()).trim() === '10', 'Screen 7 move step 3: the sticks light up: 10');
    ok(same(await lines(p, '7·3b'), ['Count them.', S("So it didn't add 4 new ones. Why not?")]), 'Screen 7 move step 3: "So it didn\'t add 4 new ones. Why not?"');
    ok((await step(p, '7·3b').locator('line.flash').count()) === 2, 'Screen 7 move step 3: the shared edges flash');
  }
  ok((await step(p, '7·4').locator('.prompt').innerText()).trim() === S('How many sticks did the 2nd square add? The 3rd?'), 'Screen 7 move step 4 prompt');
  await typed(p, '7·4', [3, 3], 'correct', null, 'Screen 7 move step 4');
  ok(same(await lines(p, '7·5'), [S('Does the first one follow the same pattern? If so, Figure 1 is 1 + 3.')]), 'Screen 7 move step 5 line');
  ok((await step(p, '7·5').locator('.prompt').innerText()).trim() === S('Figure 2 is 1 + two 3s. Figure 3 is…?'), 'Screen 7 move step 5 prompt');
  await typed(p, '7·5', '10', 'correct', S('1 + three 3s. That matches the count.'), 'Screen 7 move step 5');
  ok((await step(p, '7·6').locator('.prompt').innerText()).trim() === S('So how many does Figure 10 have?'), 'Screen 7 move step 6 prompt');
  await typed(p, '7·6', '31', 'correct', '1 + 3 × 10 = 31.', 'Screen 7 move step 6');
}

/* =====================================================================
   CHECKS ON THE ANSWER CHECKER AND THE COMPUTED NUMBERS
   ===================================================================== */
async function checkerTests(p) {
  section = 'answer checker';
  const r = await p.evaluate(() => {
    const eq = (a, b) => { const x = parseRule(a), y = parseRule(b); return !!(x && y && sameRule(x, y)); };
    const simp = a => isSimplified(parseRule(a));
    return {
      equivalent: [
        eq('3n + 2', '2 + 3n'), eq('T = 3n + 2', '3n+2'), eq('S = 4 + 3(n − 1)', '3n + 1'), eq('4+3(n-1)', '3*n+1'),
        eq('3 × n + 1', '3n + 1'), eq('P = 24 + 6n', '6(n + 4)'), eq('3n + 3', '3 + 3n'), eq('t = 4n+3', '4n + 3'),
        eq('−3 + 3n + 4', '3n + 1'), eq('(3n + 1)', '3n + 1'), eq('3n–1 + 2', '3n + 1'), eq('P = 30 + 6(n - 1)', '24 + 6n'),
      ],
      notEquivalent: [eq('3n + 2', '5n'), eq('3n + 1', '3n + 3'), eq('7n − 7', '3n + 1'), eq('n² ', '3n + 1')],
      unparseable: ['', 'n +', '3x + 2', 'abc', '42', '3n + 1 2', 'y = 3n', '3n + (1'].map(v => parseRule(v) === null),
      simplified: [simp('3n + 1'), simp('1 + 3n'), simp('3 × n + 1'), simp('S = 3n+1'), simp('-3 + 3n')],
      notSimplified: [simp('4 + 3n − 3'), simp('4 + 3(n − 1)'), simp('n + 2n + 1'), simp('3n + 1 + 0')],
      bracket: [usesBracket(parseRule('30 + 6(n − 1)'), 'n − 1'), usesBracket(parseRule('24 + 6n'), 'n − 1'), usesBracket(parseRule('6(n-1)+30'), 'n − 1')],
      numbers: ['6.5', '6.50', ' 6.5 ', '6.5 m/s', '13 sticks', 'n = 25', 'Figure 7', '25th', '−3', '6,5'].map(parseNumber),
      notNumbers: ['six', '3.25 m in 0.5 s', ''].map(parseNumber),
    };
  });
  ok(r.equivalent.every(Boolean), `equivalent rules match at n = 0, 1, 2, 3, 7, 1.5: ${JSON.stringify(r.equivalent)}`);
  ok(r.notEquivalent.every(x => !x), `different rules don't match: ${JSON.stringify(r.notEquivalent)}`);
  ok(r.unparseable.every(Boolean), `unparseable input is recognized: ${JSON.stringify(r.unparseable)}`);
  ok(r.simplified.every(Boolean), `simplified forms: ${JSON.stringify(r.simplified)}`);
  ok(r.notSimplified.every(x => !x), `unsimplified forms: ${JSON.stringify(r.notSimplified)}`);
  ok(same(r.bracket, [true, false, true]), `"uses (n − 1)" check: ${JSON.stringify(r.bracket)}`);
  ok(same(r.numbers, [6.5, 6.5, 6.5, 6.5, 13, 25, 7, 25, -3, 6.5]), `numbers parse with units and spaces: ${JSON.stringify(r.numbers)}`);
  ok(r.notNumbers.every(x => x === null), `non-numbers are rejected: ${JSON.stringify(r.notNumbers)}`);
}

async function numberTests(p) {
  section = 'computed numbers';
  const n = await p.evaluate(() => ({
    sequence: [1, 2, 3, 4].map(ruleFn('4n + 3')),
    tiles: [0, 1, 2, 3, 4, 7, 10].map(tileCount),
    sticks: [0, 1, 2, 3, 4, 10, 40].map(stickCount),
    stickFor100: range(0, 100).find(k => stickCount(k) === 100),
    borders: [2, 3, 4, 5].map(borderTiles),
    squares: [1, 2, 3, 4].map(squareTiles),
    d: [0, 1, 2, 3, 4, 3.5].map(dist),
    speeds: SHRINK.table.map(h => +fmt(avgSpeed(3, h))),
    instant: stripsPerH(),
    arun: completeSquares(builtEdges(4, 1).map(x => x.e)),
    mina: completeSquares(builtEdges(1, 1).map(x => x.e)),
    nina: completeSquares(builtEdges(4, 0).map(x => x.e)),
    garden: [0, 7].map(ruleFn('24 + 6n')).concat(ruleFn('24 + 6(n − 1)')(0)),
    maxHits: Math.max(...range(0, 10).flatMap(a => range(-15, 10).map(b => [1, 2, 3, 4].filter(k => close(a * k + b, squareTiles(k))).length))),
  }));
  ok(same(n.sequence, [7, 11, 15, 19]), `Screen 1 sequence 7, 11, 15, 19: ${n.sequence}`);
  ok(same(n.tiles, [2, 5, 8, 11, 14, 23, 32]), `tiles: Figures 0–4 = 2, 5, 8, 11, 14; Figure 7 = 23; Figure 10 = 32: ${n.tiles}`);
  ok(same(n.sticks, [1, 4, 7, 10, 13, 31, 121]), `sticks: Figure 0 = 1, Figures 1–4 = 4, 7, 10, 13, Figure 10 = 31, Figure 40 = 121: ${n.sticks}`);
  ok(n.stickFor100 === 33, `Figure 33 uses exactly 100 sticks: ${n.stickFor100}`);
  ok(same(n.borders, [3, 5, 7, 9]), `borders 3, 5, 7, 9: ${n.borders}`);
  ok(same(n.squares, [1, 4, 9, 16]), `squares 1, 4, 9, 16: ${n.squares}`);
  ok(same(n.d, [0, 1, 4, 9, 16, 12.25]), `d = t²: 0, 1, 4, 9, 16 and 12.25 at 3.5 s: ${n.d}`);
  ok(same(n.speeds, [7, 6.5, 6.1, 6.01]), `shrinking-border speeds 7, 6.5, 6.1, 6.01: ${n.speeds}`);
  ok(n.instant === 6, `speed at t = 3 is 6: ${n.instant}`);
  ok(n.arun === 2 && n.mina === 1 && n.nina === 1, `builds: Mina 1 square, Arun 2, Nina 1: ${n.mina}, ${n.arun}, ${n.nina}`);
  ok(same(n.garden, [24, 66, 18]), `garden: P(0) = 24, P(7) = 66, 24 + 6(0 − 1) = 18: ${n.garden}`);
  ok(n.maxHits === 2, `Screen 12: no dial setting passes through more than two points: ${n.maxHits}`);
}

// Every response, hint, Why? and other quoted text in the data block is word for word in the spec.
async function dataTextTests(p) {
  section = 'data block text';
  const strings = await p.evaluate(() => {
    const out = [];
    const KEYS = ['say', 'hint', 'notCombined', 'result', 'model', 'ifWrong', 'ifChosen', 'ifMarkedCorrect', 'title', 'q', 'reminder', 'text'];
    const walk = (x, key) => {
      if (typeof x === 'string') { if (KEYS.includes(key) || ['why', 'intro', 'lines', 'after'].includes(key)) out.push(plain(x)); return; }
      if (Array.isArray(x)) { x.forEach(v => walk(v, key)); return; }
      if (x && typeof x === 'object') Object.entries(x).forEach(([k, v]) => walk(v, k));
    };
    walk(LESSON.screens, 'screens');
    LESSON.screens.forEach(sc => (sc.steps || []).forEach(st => (st.wrong || []).forEach(w => (w.path || []).forEach(ps => { if (ps.prompt) out.push(plain(ps.prompt)); }))));
    out.push(...Object.values(LESSON.parts));
    return out;
  });
  const missing = strings.filter(t => !SPEC.includes(t));
  ok(missing.length === 0, `${strings.length} strings checked; not in the spec: ${JSON.stringify(missing)}`);
}

/* =====================================================================
   RUNS
   ===================================================================== */
async function newPage(browser, viewport, extra = {}) {
  const ctx = await browser.newContext({ viewport, ...extra });
  const p = await ctx.newPage();
  p.touch = !!extra.hasTouch;
  p.errors = [];
  p.on('pageerror', e => p.errors.push(e.message));
  p.on('console', m => { if (m.type() === 'error') p.errors.push(m.text()); });
  p.on('request', req => { if (!req.url().startsWith('file:')) p.errors.push('network request: ' + req.url()); });
  await p.goto(URL);
  return p;
}
const screenCount = p => p.evaluate(() => LESSON.screens.length);
const pad = n => String(n).padStart(2, '0');

async function correctPath(browser, label, viewport, extra, mode, shots) {
  section = `correct path (${label})`;
  const p = await newPage(browser, viewport, extra);
  const total = await screenCount(p);
  ok(total === 16, `the lesson has 16 screens (got ${total})`);
  for (let n = 1; n <= total; n++) {
    ok((await p.locator('#where').innerText()).trim() === `Screen ${n} of ${total}`, `${label}: progress shows Screen ${n} of ${total}`);
    ok(await p.locator('#next').isDisabled() || n === total, `${label} Screen ${n}: Next waits until the screen is done`);
    if (shots) await screenshot(p, `${label}-${pad(n)}-start`);
    await SCREENS[n].correct(p, mode);
    if (SCREENS[n].why) {
      await openWhy(p);
      ok((await whyText(p)).includes(SCREENS[n].why), `Screen ${n}: Why? text matches the spec`);
    }
    if (SCREENS[n].extra) await SCREENS[n].extra(p);
    await p.waitForTimeout(600);
    const of = await overflowProblems(p);
    ok(of.length === 0, `${label} Screen ${n}: nothing overflows ${JSON.stringify(of)}`);
    const st = await smallTargets(p);
    ok(st.length === 0, `${label} Screen ${n}: every target is at least 44 px ${JSON.stringify(st)}`);
    if (shots) await screenshot(p, `${label}-${pad(n)}-done`);
    if (n < total) {
      ok(await p.locator('#next').isEnabled(), `${label} Screen ${n}: Next is enabled once done`);
      await next(p);
    }
  }
  ok(p.errors.length === 0, `${label}: no console errors and no network requests ${JSON.stringify(p.errors)}`);
  ok(await p.evaluate(() => localStorage.length === 0 && document.cookie === ''), `${label}: nothing stored about the learner`);
  await p.context().close();
}

async function wrongPath(browser) {
  section = 'predicted wrong answers';
  const p = await newPage(browser, PHONE, { hasTouch: true });
  const total = await screenCount(p);
  for (let n = 1; n <= total; n++) {
    await SCREENS[n].wrong(p);
    await p.waitForTimeout(300);
    await screenshot(p, `phone-wrong-${pad(n)}`);
    if (n < total) await next(p);
  }
  ok(p.errors.length === 0, `wrong-answer run: no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}

// Screen 7 again, answering 40 and then predicting 10 for Figure 3.
async function screen7Ten(browser) {
  section = 'Screen 7: 40, then 10';
  const p = await newPage(browser, PHONE);
  for (let n = 1; n <= 6; n++) { await SCREENS[n].correct(p, 'tap'); await next(p); }
  for (const e of ['t3', 'b3', 'v4']) await place(p, 'tap', piece(p, '7A1'), step(p, '7A1').locator(`[data-hit="${e}"]`));
  await typed(p, '7A2', '13', 'correct');
  await typed(p, '7B', '40', null);
  await screen7Path(p, '10');
  ok(await p.locator('#next').isEnabled(), 'Screen 7: done after the move');
  ok(p.errors.length === 0, `no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}

async function navigationTests(browser) {
  section = 'navigation';
  const p = await newPage(browser, PHONE);
  ok(await p.locator('#back').isDisabled(), 'Back is disabled on Screen 1');
  ok(await p.locator('#next').isDisabled(), 'Next is disabled until the screen is done');
  await SCREENS[1].correct(p);
  await next(p);
  await SCREENS[2].correct(p, 'tap');
  await next(p);
  await p.click('#back');
  ok((await p.locator('#where').innerText()).includes('Screen 2 of'), 'Back shows Screen 2');
  await p.click('#back');
  ok((await p.locator('#where').innerText()).includes('Screen 1 of'), 'Back again shows Screen 1');
  ok(await step(p, '1A').locator('input').isDisabled(), 'Back: earlier answers can be seen but not changed');
  ok((await step(p, '1A').locator('input').inputValue()) === '4n + 3', 'Back: the earlier answer is still shown');
  ok(await screenEl(p).locator('.why-btn').isEnabled(), 'Back: the Why? text can still be opened');
  await next(p); await next(p);
  ok((await p.locator('#where').innerText()).includes('Screen 3 of'), 'Next returns to the current screen');
  ok(await step(p, '3A1').locator('input').isEnabled(), 'The current screen is still answerable after looking back');
  ok(p.errors.length === 0, `no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}

async function keyboardTests(browser) {
  section = 'keyboard';
  const p = await newPage(browser, DESKTOP);
  await SCREENS[1].correct(p); await next(p);
  await typed(p, '2A', '2', 'correct'); await typed(p, '2B', '3', 'correct');
  await piece(p, '2C1').focus();
  await p.keyboard.press('Enter');
  await step(p, '2C1').locator('.drop').focus();
  await p.keyboard.press('Enter');
  ok(await step(p, '2C2').isVisible(), 'Screen 2C: the group can be placed with the keyboard');
  await step(p, '2C2').locator('input').fill('14');
  await step(p, '2C2').locator('input').press('Enter');
  ok((await feedback(p, '2C2')).kind === 'correct', 'Enter checks a typed answer');
  await p.context().close();
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const p0 = await newPage(browser, PHONE);
  await checkerTests(p0);
  await numberTests(p0);
  await dataTextTests(p0);
  await p0.context().close();
  await correctPath(browser, 'phone', PHONE, { hasTouch: true, isMobile: true }, 'tap', true);
  await correctPath(browser, 'desktop', DESKTOP, {}, 'mouse', true);
  await correctPath(browser, 'phone-touch', PHONE, { hasTouch: true, isMobile: true }, 'touch', false);
  await correctPath(browser, 'phone-dark', PHONE, { colorScheme: 'dark', hasTouch: true, isMobile: true }, 'tap', false);
  await correctPath(browser, 'desktop-dark', DESKTOP, { colorScheme: 'dark' }, 'mouse', false);
  await wrongPath(browser);
  await screen7Ten(browser);
  await navigationTests(browser);
  await keyboardTests(browser);
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
