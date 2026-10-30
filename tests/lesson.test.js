// Playwright tests for lesson/index.html.
//   Chromium: node tests/lesson.test.js
//   WebKit:   PLAYWRIGHT_BROWSERS_PATH=<folder with webkit> node tests/lesson.test.js --webkit
// Every expected learner-facing string is wrapped in S(), which also checks it appears word for word in the source of
// truth: the spec, docs/Round-2-Decisions.md, docs/Round-2-Wording.md, ROUND-2-AMENDMENT.md and Marc's answers to it.
'use strict';
const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

const ENGINE = process.argv.includes('--webkit') ? 'webkit' : 'chromium';
const CHROMIUM = ENGINE === 'chromium';
const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'lesson', 'index.html');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const SPEC = read('docs', 'Seeing-the-Rule-Interactive-Lesson-Plan.md');
const TRUTH = [SPEC, read('docs', 'Round-2-Decisions.md'), read('docs', 'Round-2-Wording.md'), read('ROUND-2-AMENDMENT.md'), read('docs', 'Round-2-Amendment-Answers.md')].join('\n');
const HANDOFF = read('HANDOFF.md');
// Round-2-Wording A approves the round 1 prompts "as written" in the round 1 handback (■ marks the colour swatch).
const PROMPTS = read('handback', 'round-1.md').replace(/ ■/g, '');
const SHOTS = path.join(ROOT, 'test-results', 'screenshots', CHROMIUM ? '' : 'webkit');
const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 800 };
const FALLBACK = 'Not yet. Try again.';   // last resort only (see REPORT.md)

/* ---------------- reporting ---------------- */
const results = [];
let section = 'source-of-truth text';
function ok(cond, msg) {
  results.push({ section, ok: !!cond, msg });
  if (!cond) console.log(`  FAIL [${section}] ${msg}`);
}
function S(text) { ok(TRUTH.includes(text), `source of truth contains: "${text}"`); return text; }
function H(text) { ok(HANDOFF.includes(text), `handoff contains: "${text}"`); return text; }
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ---------------- page helpers ---------------- */
const step = (p, id) => p.locator(`[data-step="${id}"]`);
const screenEl = p => p.locator('section.screen:not([hidden])');
const TABLE_ROWS = new Set(['3T1', '3T3']);   // these steps type into the comparison table at the top of Screen 3
async function fill(p, id, values) {
  const inputs = TABLE_ROWS.has(id) ? screenEl(p).locator('.comparetable input:enabled') : step(p, id).locator(':scope input[data-input]:enabled');
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
// Type, Check, and confirm the outcome and the exact response text. kind null = no response box.
async function typed(p, id, values, kind, say, label) {
  await fill(p, id, values);
  await check(p, id);
  const fb = await feedback(p, id);
  const tag = `${label || 'Step ' + id} typed ${JSON.stringify(values)}`;
  ok(fb.kind === kind, `${tag}: outcome is ${kind} (got ${fb.kind})`);
  if (say) ok(fb.says.includes(say), `${tag}: says "${say}" (got ${JSON.stringify(fb.says)})`);
  return fb;
}
async function chose(p, id, index, kind, say) {
  await step(p, id).locator(`:scope [data-choice="${index}"]`).first().click();
  await check(p, id);
  const fb = await feedback(p, id);
  ok(fb.kind === kind, `Step ${id} choice ${index}: outcome is ${kind} (got ${fb.kind})`);
  if (say) ok(fb.says.includes(say), `Step ${id} choice ${index}: says "${say}" (got ${JSON.stringify(fb.says)})`);
  return fb;
}
async function answerCard(p, id) {
  const c = step(p, id).locator(':scope > .demo .answer-card .val');
  return (await c.count()) ? (await c.textContent()).trim() : null;
}
const next = p => p.click('#next');
const whyVisible = p => screenEl(p).locator('.why-btn').isVisible();
const whyOpen = p => screenEl(p).locator('.why').isVisible();
async function openWhy(p) {
  const b = screenEl(p).locator('.why-btn');
  if (await b.isVisible() && (await b.getAttribute('aria-expanded')) !== 'true') await b.click();
}
const whyText = async p => (await screenEl(p).locator('.why').textContent()).trim();
const lines = async (p, id) => (await step(p, id).locator(':scope > .line').allTextContents()).map(t => t.trim());
const texts = async loc => (await loc.allTextContents()).map(t => t.trim());
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
  if (mode === 'touch') {
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
async function bringIntoView(p, a, b) {
  const box = loc => loc.evaluate(el => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY }; });
  const ra = await box(a), rb = await box(b);
  const mid = (Math.min(ra.top, rb.top) + Math.max(ra.bottom, rb.bottom)) / 2;
  await p.evaluate(m => window.scrollTo(0, m - innerHeight / 2), mid);
}
// Place a piece on a target: by tapping both (a real touch tap where the page has touch), by mouse drag, or by touch drag.
async function place(p, mode, piece, target) {
  // Pieces, trays and drop targets exist only mid-screen, so their size is checked here, before each placement.
  const st = await smallTargets(p);
  ok(st.length === 0, `drag pieces and drop targets are at least 44 px ${JSON.stringify(st)}`);
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
      if (!['svg', 'INPUT', 'TEXTAREA'].includes(el.tagName) && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto') out.push(`${tag} content wider than its box`);
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
// Round 2: no rendered text anywhere reads "null" or "undefined" (every screen built so far, Why? panels included).
async function nullText(p) {
  return p.evaluate(() => {
    const txt = ['header', 'main', 'nav'].map(s => document.querySelector(s).textContent).join(' ');
    return (txt.match(/.{0,30}\b(?:null|undefined|NaN)\b.{0,30}/g) || []);
  });
}
// Round 2: no rule or expression breaks across lines. Each math span sits on one line, and so does every
// formula, rule card, readout and caption.
async function wrapProblems(p) {
  return p.evaluate(() => {
    const out = [];
    const sec = document.querySelector('section.screen:not([hidden])');
    sec.querySelectorAll('.math').forEach(el => {
      const rects = el.getClientRects();
      if (!rects.length) return;
      // One line box, and no taller than one line (the spans are inline-blocks, so a wrap would show as height).
      if (rects.length > 1 || rects[0].height > parseFloat(getComputedStyle(el).lineHeight) * 1.4) out.push(`"${el.textContent}" wraps`);
    });
    sec.querySelectorAll('.formula, .student .r, .readout, figcaption').forEach(el => {
      if (!el.getClientRects().length) return;
      // Text nodes only, leaving out the small label hung under Nina's 4.
      const tops = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if (n.parentElement.closest('.fl') || !n.textContent.trim()) continue;
        const r = document.createRange();
        r.selectNodeContents(n);
        tops.push(...[...r.getClientRects()].filter(x => x.width > 0).map(x => Math.round(x.bottom)));
      }
      if (new Set(tops).size > 1 && Math.max(...tops) - Math.min(...tops) > 14) out.push(`"${el.textContent.trim()}" wraps`);
    });
    return out;
  });
}
// Is this expression kept whole inside one math span on the current screen?
const keptWhole = (p, expr) => screenEl(p).locator('.math', { hasText: expr }).evaluateAll((els, e) => els.some(x => x.textContent.replace(/[.,:;?!]$/, '') === e), expr);

/* =====================================================================
   SCREEN SCRIPTS, keyed by the round 1 screen numbers that the step IDs use.
   correct(p, mode): the correct path (mode = how pieces are placed: 'tap', 'mouse' or 'touch').
   wrong(p): every predicted wrong answer, one unpredicted answer per hint, then the correct answer.
   ===================================================================== */
const SCREENS = {
  2: {
    async correct(p, mode) {
      ok((await screenEl(p).locator('.eyebrow').textContent()).trim().toLowerCase() === 'part 1: tiles. see the structure', 'the lesson opens on the tiles, in Part 1');
      await typed(p, '2A', '2', 'correct', S('The same 2 tiles, in every figure.'));
      await typed(p, '2B', '3', 'correct', S('Each figure adds one group of 3 in the second colour.'));
      await place(p, mode, piece(p, '2C1'), step(p, '2C1').locator('.drop'));
      ok(await step(p, '2C2').isVisible(), `2C: the group is placed by ${mode}`);
      ok((await step(p, '2C1').locator('rect.t-coef').count()) === 12 && (await step(p, '2C1').locator('rect.t-const').count()) === 2, '2C: Figure 4 is 2 fixed tiles and 4 groups of 3');
      await typed(p, '2C2', '14', 'correct', S('4 groups of 3, plus the 2 fixed tiles: 14.'));
    },
    async wrong(p) {
      await typed(p, '2A', '5', 'wrong', S('5 is all of Figure 1. Count only the colour that stays the same size.'));
      await typed(p, '2A', '4', 'hint', S('Count only the tiles in the first colour in one figure. Then check another figure.'));
      await typed(p, '2A', '2 tiles', 'correct', 'The same 2 tiles, in every figure.');
      await typed(p, '2B', '5', 'wrong', S('5 is the whole of Figure 1. Compare Figure 1 and Figure 2: what was added?'));
      await typed(p, '2B', '4', 'hint', S('Count the tiles in Figure 1 and in Figure 2. How many more does Figure 2 have?'));
      await typed(p, '2B', '3', 'correct', 'Each figure adds one group of 3 in the second colour.');
      await place(p, 'mouse', piece(p, '2C1'), step(p, '2C1').locator('.drop'));
      await typed(p, '2C2', '12', 'wrong', S('You counted the groups. The 2 fixed tiles are in every figure too.'));
      await typed(p, '2C2', '20', 'wrong', S('Figure 1 has 5 tiles, but only 3 of them repeat.'));
      ok((await answerCard(p, '2C2')) === '14', '2C: second miss shows the answer');
      await typed(p, '2C2', '13', 'hint', S('Count the groups of 3 in Figure 4, then add the fixed tiles.'));
      await typed(p, '2C2', '14.0', 'correct', '4 groups of 3, plus the 2 fixed tiles: 14.');
    },
    why: S('Every figure has the same 2 fixed tiles. Each new figure adds one group of 3. So Figure 4 has 4 groups of 3 and the 2 fixed tiles: 12 + 2 = 14.'),
  },

  3: {
    async correct(p, mode) {
      ok(same(await SCREENS[3].table(p), [['Figure n', '1', '2', '3', '4'], ['Tiles', '5', '8', '11', '14'], ['Skip count by 3', '', '', '', '']]),
        'Screen 3: the table starts with Figure n and Tiles, and the empty skip-count row to fill in; "How many more" waits for its step');
      await typed(p, '3T1', [3, 6], 'correct', S('Right: 3, 6, 9, 12.'));
      ok(same((await SCREENS[3].table(p))[2], [S('Skip count by 3'), '', '', '9', '12']), '3T1: the rest of the skip-count row fills in');
      await typed(p, '3T2', '30', 'correct', S('Right: 10 × 3 = 30. So the skip-count row is 3n.'));
      await typed(p, '3T3', '2', 'correct', S('Right: 2 more every time.'));
      ok(same((await SCREENS[3].table(p))[3], [S('How many more'), '', '2', '2', '2']), '3T3: the rest of the "How many more" row fills in');
      await slideTo(p, '3A1', 'Home', mode);
      ok((await step(p, '3A1').locator('figcaption').textContent()).trim() === 'Figure 0', '3A: slider reaches Figure 0');
      await typed(p, '3A2', '2', 'correct', S('Figure 0 has no groups, only the 2 fixed tiles. The same 2 as in the table.'));
      await typed(p, '3B', 'T = 3n + 2', 'correct', S('Right. Slide to check any figure.'));
      await slideTo(p, '3A1', 'End', mode);
      ok((await step(p, '3A1').locator('.readout').textContent()).trim() === 'T = 3 × 10 + 2 = 32', '3B: sliding checks any figure');
      ok((await step(p, '3B·f').count()) === 0, '3B: no follow-up item on the correct path');
    },
    async wrong(p) {
      await typed(p, '3T1', [5, 8], 'wrong', S('Those are the tiles. Skip count by 3 on its own: 3, 6, …'));
      await typed(p, '3T1', [4, 7], 'hint', S('Count by 3, the number each figure adds.'));
      ok((await answerCard(p, '3T1')) === '3, 6', '3T1: second miss shows the answer');
      await typed(p, '3T1', [3, 6], 'correct', 'Right: 3, 6, 9, 12.');
      await typed(p, '3T2', '32', 'wrong', S("32 is Figure 10's tiles. The skip-count row is only the 3s."));
      await typed(p, '3T2', '20', 'hint', S('The 1st is 1 × 3. The 2nd is 2 × 3.'));
      await typed(p, '3T2', '30', 'correct', 'Right: 10 × 3 = 30. So the skip-count row is 3n.');
      await typed(p, '3T3', '3', 'wrong', S('3 is what each figure adds. Compare the two rows: 5 and 3, then 8 and 6.'));
      await typed(p, '3T3', '1', 'hint', S('Subtract: 5 − 3, then 8 − 6.'));
      await typed(p, '3T3', '2', 'correct', 'Right: 2 more every time.');
      await slideTo(p, '3A1', 'Home');
      await typed(p, '3A2', '5', 'wrong', S('5 is Figure 1. Take away its group of 3.'));
      await typed(p, '3A2', '0', 'wrong', S('The groups are gone, but look at the picture: the fixed tiles stay.'));
      await typed(p, '3A2', '3', 'hint', S('Look at the picture at Figure 0. Which tiles are still there?'));
      await typed(p, '3A2', '2', 'correct', 'Figure 0 has no groups, only the 2 fixed tiles. The same 2 as in the table.');
      const fb1 = await typed(p, '3B', '3n + 5', 'wrong', S('5 is the total for Figure 1. The constant is the value at Figure 0.'));
      ok(same(fb1.tests, ['n = 1: 8, not 5']), `3B: tests 5 + 3n at n = 1 (got ${JSON.stringify(fb1.tests)})`);
      ok((await step(p, '3B·f').count()) === 0, '3B: no follow-up after one miss');
      const fb2 = await typed(p, '3B', '5 × n', 'wrong', S('Only 3 tiles repeat in each figure, not 5.'));
      ok(same(fb2.tests, ['n = 2: 10, not 8']), `3B: tests 5n at n = 2 (got ${JSON.stringify(fb2.tests)})`);
      ok((await answerCard(p, '3B')) === 'T = 3n + 2' && (await whyOpen(p)), '3B: second miss shows the answer and the Why? text');
      ok((await step(p, '3B·f').count()) === 0, '3B: the follow-up waits until the answer is typed');
      await typed(p, '3B', 'n × n', 'hint', S('How many tiles does each figure add, and how many are there at Figure 0?'), '3B (non-linear, rejected)');
      await typed(p, '3B', '2 + 3n', 'correct', 'Right. Slide to check any figure.');
      // The follow-up item (Q3): 4 fixed tiles plus groups of 2.
      ok(await step(p, '3B·f').isVisible(), '3B: the follow-up item appears after the second miss');
      ok(!(await p.locator('#next').isEnabled()), '3B: the follow-up must be answered to continue');
      ok((await step(p, '3B·f').locator('rect.t-const').count()) === 12 && (await step(p, '3B·f').locator('rect.t-coef').count()) === 12, '3B follow-up: Figures 1–3 drawn as 4 fixed tiles plus groups of 2');
      ok((await step(p, '3B·f').locator('.prompt').textContent()).trim() === S('Type the rule for this pattern.'), '3B follow-up prompt');
      const fb3 = await typed(p, '3B·f', '6 + 2n', 'wrong', S('6 is the total for Figure 1. The constant is the value at Figure 0.'));
      ok(same(fb3.tests, ['n = 1: 8, but Figure 1 has 6']) && S('n = 1: 8, but Figure 1 has 6'), `3B follow-up: tests 6 + 2n at n = 1 (got ${JSON.stringify(fb3.tests)})`);
      await typed(p, '3B·f', 'n + 4', 'hint', 'How many tiles does each figure add, and how many are there at Figure 0?');
      await typed(p, '3B·f', '2n + 4', 'correct', S('Right. 4 tiles at Figure 0, and each figure adds 2.'));
      ok(await p.locator('#next').isEnabled(), '3B: Next once the follow-up is answered');
    },
    why: S("The coefficient 3 counts the tiles in each group, so it multiplies the figure number n. The constant 2 counts the fixed tiles, which are there even at Figure 0. You can also see it in a table, the way you'd compare rows:"),
    async extra(p) {
      const rows = await screenEl(p).locator('.why tr').evaluateAll(trs => trs.map(tr => [...tr.children].map(td => td.textContent.trim())));
      ok(same(rows, [['n', '0', '1', '2', '3', '4'], ['Tiles', '2', '5', '8', '11', '14'], [S('Skip count by 3 (3n)'), '0', '3', '6', '9', '12'], [S('How many more'), '2', '2', '2', '2', '2']]),
        `Screen 3: Why? table, with its rows renamed to match the new steps (got ${JSON.stringify(rows)})`);
    },
    table: p => screenEl(p).locator('.comparetable tr').evaluateAll(trs => trs.map(tr => [...tr.cells].map(c => c.textContent.trim()))),
  },

  4: {
    async correct(p) {
      ok((await screenEl(p).locator('.prompt').count()) === 0 && (await nullText(p)).length === 0, 'Screen 4: no prompt, and no "null" in its place');
      await chose(p, '4A', 1, 'correct', S('Right. Figure 1 is the constant plus one group: 2 + 3 = 5.'));
    },
    async wrong(p) {
      await chose(p, '4A', 0, 'wrong', S('Check it: 3 × 1 + 2 = 5. The rule is right. The first total and the constant are different things.'));
      await chose(p, '4A', 2, 'wrong', S("It isn't coincidence. The first total always includes one group; the constant is what's there before any group."));
      ok((await step(p, '4A').locator('.choice.is-answer').count()) === 1 && (await whyOpen(p)), 'Screen 4: second miss marks the answer and opens Why?');
      await chose(p, '4A', 1, 'correct', 'Right. Figure 1 is the constant plus one group: 2 + 3 = 5.');
    },
    why: S('The first total includes one group, so it is the constant plus the coefficient: 2 + 3 = 5. The constant is the value at Figure 0, before any groups are added. Reading the first total as the constant is the most common mistake with these rules.'),
  },

  5: {
    async correct(p) {
      ok((await nullText(p)).length === 0, 'Screen 5: no "null" where the prompt would be');
      await typed(p, '5A', 'Figure 7', 'correct', S('3n + 2 = 23 gives 3n = 21, so n = 7.'));
    },
    async wrong(p) {
      const hint = S('Undo the + 2 first, then the × 3.');
      await typed(p, '5A', '8', 'hint', hint);
      await typed(p, '5A', '23', 'hint', hint);
      ok((await answerCard(p, '5A')) === 'Figure 7', 'Screen 5: second miss shows the answer');
      await typed(p, '5A', '7', 'correct', '3n + 2 = 23 gives 3n = 21, so n = 7.');
    },
    why: S('The rule turns a figure number into a total. To go backwards, set the rule equal to the total and solve: 3n + 2 = 23, so 3n = 21 and n = 7. Figure 7 has 23 tiles: 7 groups of 3, plus the 2 fixed tiles.'),
  },

  6: {
    async correct(p) {
      await typed(p, '6A1', '5', 'correct', S('Right: 5 × 1 = 5. The rule matches Figure 1.'));
      await chose(p, '6A2', 1, 'correct', S('Maybe. Always try another one.'));
      await typed(p, '6B', [0, 50], 'correct', S('Figure 0 has 2 tiles, not 0. Figure 10 has 32, not 50. The rule is wrong.'));
      ok(same(await texts(step(p, '6B').locator('[data-count]')), ['· 2 tiles', '· 32 tiles']), '6B: the pictures show the real counts');
      await typed(p, '6C', [2, 5, 32], 'correct', S('It works for all three, including Figure 0 and a figure far away.'));
      await chose(p, '6D', 1, 'correct', S('Right. Three checks, and a structure that adds the same group every time.'));
    },
    async wrong(p) {
      await typed(p, '6A1', '6', 'hint', S("Replace n with 1 in the student's rule, then multiply."));
      await typed(p, '6A1', '5', 'correct', 'Right: 5 × 1 = 5. The rule matches Figure 1.');
      ok(same(await texts(step(p, '6A2').locator('.choice')), ['Yes', 'Maybe', 'No']), '6A: Yes, Maybe, No, with the correct one not first');
      await chose(p, '6A2', 0, 'wrong', S("It works for Figure 1, but one figure isn't enough. Try another one."));
      await chose(p, '6A2', 2, 'wrong', S("It might be wrong, but one figure can't tell you. Try another one."));
      await chose(p, '6A2', 1, 'correct', 'Maybe. Always try another one.');
      await typed(p, '6B', [2, 32], 'hint', S("Use the student's rule, 5n, not the picture. Replace n with 0, then with 10."));
      await typed(p, '6B', [0, 50], 'correct', 'Figure 0 has 2 tiles, not 0. Figure 10 has 32, not 50. The rule is wrong.');
      await typed(p, '6C', [2, 5, 30], 'wrong', S('Substitute again: 3 × n, then add 2.'));
      await typed(p, '6C', [2, 5, 32], 'correct', 'It works for all three, including Figure 0 and a figure far away.');
      await chose(p, '6D', 0, 'wrong', S('So did 5n. One figure can fit a wrong rule.'));
      await chose(p, '6D', 1, 'correct', 'Right. Three checks, and a structure that adds the same group every time.');
    },
    why: S('One figure can fit a wrong rule: 5n and 3n + 2 both give 5 at Figure 1. Another check exposes the wrong one. Figure 0 is a good test because it checks the constant, the tiles there before any group. A figure far away, like Figure 10, checks the coefficient, because a wrong coefficient drifts further off with every figure. When a pattern adds the same amount every time and a straight-line rule works for three figures, it works for all of them.'),
  },

  7: {
    async correct(p, mode) {
      const counts = await screenEl(p).locator('.card').first().locator('svg').evaluateAll(svgs => svgs.map(s => s.querySelectorAll('line.stick').length));
      ok(same(counts, [4, 7, 10]), `Screen 7: Figures 1 to 3 have 4, 7 and 10 sticks (got ${JSON.stringify(counts)})`);
      for (const e of ['t3', 'b3', 'v4']) await place(p, mode, piece(p, '7A1'), step(p, '7A1').locator(`[data-hit="${e}"]`));
      ok(await step(p, '7A2').isVisible(), `7A: Figure 4 is built by ${mode}`);
      await typed(p, '7A2', '13', 'correct', S('Each new square needs only 3 sticks. It shares one with its neighbour.'));
      await typed(p, '7B', '31', 'correct', S('1 + 3 × 10 = 31.'));
      ok((await step(p, '7B·f').count()) === 0, '7B: no follow-up item on the correct path');
    },
    async wrong(p) {
      const taken = S('That edge is already there.');
      await place(p, 'mouse', piece(p, '7A1'), step(p, '7A1').locator('[data-hit="v3"]'));
      ok(same((await feedback(p, '7A1')).says, [taken]), '7A: a stick dropped on an existing edge is rejected');
      for (const e of ['t3', 'b3', 'v4']) await place(p, 'mouse', piece(p, '7A1'), step(p, '7A1').locator(`[data-hit="${e}"]`));
      await typed(p, '7A2', '16', 'hint', S('Count every stick in Figure 4 once.'));
      await typed(p, '7A2', '13 sticks', 'correct', 'Each new square needs only 3 sticks. It shares one with its neighbour.');
      await typed(p, '7B', '30', 'wrong', S("3 for each square. Now look at Figure 1: does it follow the same pattern? It's 1 + 3."));
      await typed(p, '7B', '40', null);
      ok((await answerCard(p, '7B')) === null && (await step(p, '7B·f').count()) === 0, '7B: 40 starts Marc\'s move, not the Answer card or a follow-up');
      ok(!(await whyVisible(p)), '7B: Why? stays hidden during Marc\'s move');
      await screen7Move(p, { fig2: '8', fig3: '11' });
      ok(await whyVisible(p), '7B: Why? appears when Marc\'s move ends');
    },
    why: S('Every square after the first adds only 3 sticks, because it shares an edge with the square before it. The first square follows the same pattern if you see it as 1 stick plus 3. So Figure 1 is 1 + 3, Figure 2 is 1 + two 3s, Figure 3 is 1 + three 3s, and Figure 10 is 1 + ten 3s = 31.'),
  },

  8: {
    async correct(p, mode) {
      ok(await keptWhole(p, 'S = 4 + 3(n − 1)'), 'Screen 8: "S = 4 + 3(n − 1)" is kept whole');
      await typed(p, '8A', [4, 7, 10, 4, 7, 10], 'correct', S('The same values for all three. Are they the same for every n? Simplify the second rule to find out.'));
      await typed(p, '8B', 'S = 3n + 1', 'correct', S('4 + 3n − 3 = 3n + 1. The two rules are the same.'));
      ok((await step(p, '8B·f').count()) === 0, '8B: no follow-up item on the correct path');
      await slideTo(p, '8C1', 'Home', mode);
      await typed(p, '8C2', '1', 'correct', S('One lone stick: the constant in 3n + 1.'));
    },
    async wrong(p) {
      await typed(p, '8A', [4, 7, 10, 4, 7, 11], 'wrong', S('Work inside the bracket first, then multiply by 3, then add 4.'));
      await typed(p, '8A', [4, 7, 9, 4, 7, 10], 'hint', S('In 3n + 1, multiply n by 3 first, then add 1.'));
      await typed(p, '8A', [4, 7, 10, 4, 7, 10], 'correct', 'The same values for all three. Are they the same for every n? Simplify the second rule to find out.');
      await typed(p, '8B', '4 + 3n − 3', 'partial', S('Correct so far. Now combine the numbers 4 and −3.'));
      let fb = await typed(p, '8B', '3n + 3', 'wrong', S('The 3 multiplies both terms in the bracket. You multiplied the n but not the 1.'));
      ok(same(fb.tests, [S('Test at n = 1: 6, but the original gives 4.')]), `8B 3n + 3: substitution test (got ${JSON.stringify(fb.tests)})`);
      ok((await step(p, '8B·f').count()) === 0, '8B: no follow-up after one miss');
      await typed(p, '8B', '3 + 3n', 'wrong', 'The 3 multiplies both terms in the bracket. You multiplied the n but not the 1.', '8B (3 + 3n, same error)');
      fb = await typed(p, '8B', '3n + 7', 'wrong', S('3 × (−1) is −3, not +3.'));
      ok(same(fb.tests, [S('Test at n = 1: 10, but the original gives 4.')]), `8B 3n + 7: substitution test (got ${JSON.stringify(fb.tests)})`);
      fb = await typed(p, '8B', '7n − 7', 'wrong', S('You added 4 + 3 before multiplying. Multiply 3(n − 1) first.'));
      ok(same(fb.tests, [S('Test: at n = 2 both give 7, but at n = 1 yours gives 0 and the original gives 4.')]) && fb.says.includes(S("It matched one figure. One substitution isn't enough.")), '8B 7n − 7: substitution test');
      fb = await typed(p, '8B', '7n − 3', 'wrong', S("4 and 3n aren't like terms. Only the numbers 4 and −3 combine."));
      ok(same(fb.tests, [S('Test: at n = 1 both give 4, but at n = 2 yours gives 11 and the original gives 7.')]), '8B 7n − 3: substitution test');
      fb = await typed(p, '8B', '2n + 2', 'hint', S('Distribute first: 3 × n and 3 × (−1). Then combine the numbers.'));
      ok(same(fb.tests, ['Test at n = 2: 6, but the original gives 7.']), `8B unpredicted: tested where it breaks (got ${JSON.stringify(fb.tests)})`);
      await typed(p, '8B', 'S = 1 + 3n', 'correct', '4 + 3n − 3 = 3n + 1. The two rules are the same.');
      // The follow-up item (Q3): 5 + 2(n − 1), every wrong answer tested by substitution.
      ok(await step(p, '8B·f').isVisible(), '8B: the follow-up item appears after the second miss');
      ok((await step(p, '8B·f').locator('.prompt').textContent()).trim() === S('Simplify 5 + 2(n − 1).'), '8B follow-up prompt');
      const follow = [
        ['2n + 4', S('The 2 multiplies both terms in the bracket. You multiplied the n but not the 1.'), 'Test at n = 1: 6, but the original gives 5.'],
        ['2n + 7', S('2 × (−1) is −2, not +2.'), 'Test at n = 1: 9, but the original gives 5.'],
        ['7n − 7', S('You added 5 + 2 before multiplying. Multiply 2(n − 1) first.'), 'Test at n = 1: 0, but the original gives 5.'],
        ['7n − 2', S("5 and 2n aren't like terms. Only the numbers 5 and −2 combine."), 'Test at n = 2: 12, but the original gives 7.'],
      ];
      for (const [v, say, test] of follow) {
        fb = await typed(p, '8B·f', v, 'wrong', say);
        ok(same(fb.tests, [test]), `8B follow-up ${v}: tested by substitution (got ${JSON.stringify(fb.tests)})`);
      }
      await typed(p, '8B·f', '5 + 2n − 2', 'partial', FALLBACK, '8B follow-up (not combined; no text in the source of truth)');
      fb = await typed(p, '8B·f', 'n + 1', 'hint', S('Distribute first: 2 × n and 2 × (−1). Then combine the numbers.'));
      ok(same(fb.tests, ['Test at n = 1: 2, but the original gives 5.']), `8B follow-up unpredicted: tested by substitution (got ${JSON.stringify(fb.tests)})`);
      await typed(p, '8B·f', '2n + 3', 'correct', S('Right. 5 + 2n − 2 = 2n + 3.'));
      await slideTo(p, '8C1', 'Home');
      await typed(p, '8C2', '4', 'wrong', S('4 is Figure 1. Take away its three sticks.'));
      await typed(p, '8C2', '2', 'hint', S('At Figure 0 there are no squares. Which stick is still there?'));
      await typed(p, '8C2', '1', 'correct', 'One lone stick: the constant in 3n + 1.');
    },
    why: S('Substituting n = 1, 2 and 3 showed the two rules agree for three figures. Simplifying shows why they agree for every figure: 4 + 3(n − 1) = 4 + 3n − 3 = 3n + 1. In the picture, 4 + 3(n − 1) counts the first full square, then 3 sticks for each square after it. 3n + 1 counts one starting stick, then 3 for every square. Same sticks, grouped differently.'),
    async extra(p) {
      const w = screenEl(p).locator('.why');
      ok((await w.locator('line.stick.first').count()) === 4 && (await w.locator('svg').first().locator('line.stick.const').count()) === 0,
        "Screen 8 Why?: Nina's first square is neutral, not the constant colour (Q2)");
      ok(same(await texts(w.locator('text.flabel')), [S('first square')]), 'Screen 8 Why?: the first square is labelled');
    },
  },

  9: {
    async correct(p) {
      await typed(p, '9A', '121', 'correct', S('3 × 40 + 1 = 121.'));
      await typed(p, '9B', '33', 'correct', S('3n + 1 = 100 gives 3n = 99, so n = 33.'));
    },
    async wrong(p) {
      await typed(p, '9A', '160', 'hint', S('Replace n with 40 in 3n + 1. Multiply first, then add.'));
      await typed(p, '9A', '121 sticks', 'correct', '3 × 40 + 1 = 121.');
      await typed(p, '9B', '34', 'hint', S('Undo the + 1 first, then the × 3.'));
      await typed(p, '9B', 'Figure 33', 'correct', '3n + 1 = 100 gives 3n = 99, so n = 33.');
    },
    why: S('Forward, the rule takes a figure number and gives the sticks: Figure 40 needs 3 × 40 + 1 = 121. Backward, set the rule equal to the sticks and solve: 3n + 1 = 100, so n = 33.'),
  },

  10: {
    async correct(p, mode) {
      const nina = screenEl(p).locator('.student').nth(2);
      ok((await nina.locator('.c').count()) === 0 && (await nina.locator('.first .fl').textContent()).trim() === 'first square', "Screen 10: Nina's 4 is neutral and labelled \"first square\" (Q2)");
      const area = id => step(p, id).locator('.buildarea');
      await place(p, mode, piece(p, '10A', '[data-piece="stick"]'), area('10A'));
      await place(p, mode, piece(p, '10A', '[data-piece="group"]'), area('10A'));
      ok(same((await feedback(p, '10A')).says, [S("That's Figure 1.")]), `10A: Mina's build is Figure 1 (by ${mode})`);
      for (let i = 0; i < 4; i++) await place(p, mode, piece(p, '10B1', '[data-piece="stick"]'), area('10B1'));
      await place(p, mode, piece(p, '10B1', '[data-piece="group"]'), area('10B1'));
      ok((await step(p, '10B1').locator('line.stick.const').count()) === 4, "10B: Arun's 4 is his constant, in the constant colour");
      await typed(p, '10B2', '2', 'correct', S('Right: two squares.'));
      await typed(p, '10B3', 'Figure 2', 'correct', S("Arun's rule built Figure 2 when it should have built Figure 1."));
      ok((await piece(p, '10C', '[data-piece="stick"]').locator('line.stick.const').count()) === 0, "10C: Nina's stick piece is neutral");
      for (let i = 0; i < 4; i++) await place(p, mode, piece(p, '10C', '[data-piece="stick"]'), area('10C'));
      ok((await step(p, '10C').locator('line.stick.first').count()) === 4 && (await step(p, '10C').locator('line.stick.const').count()) === 0, "10C: Nina's first square is neutral");
      ok(same(await texts(step(p, '10C').locator('text.flabel')), ['first square']), "10C: Nina's first square is labelled");
      ok(same((await feedback(p, '10C')).says, ["That's Figure 1."]), "10C: Nina's build is Figure 1");
      for (const m of ['0-0', '1-1', '2-0']) await step(p, '10D').locator(`[data-mark="${m}"]`).click();
      await check(p, '10D');
      ok((await feedback(p, '10D')).says.includes(S("Right. Mina's and Nina's rules build Figure 1. Arun's builds Figure 2.")), '10D: confirmation');
      await step(p, '10E').locator('textarea').fill('His 4 is already a square, so he is one square ahead.');
      await step(p, '10E').locator('button').click();
      ok((await step(p, '10E').locator('.model').textContent()).trim() === S("Arun's 4 is already a whole square. Then he adds 3 more sticks for every square, so he counts one square too many."), '10E: model explanation');
    },
    async wrong(p) {
      const area = id => step(p, id).locator('.buildarea');
      await place(p, 'mouse', piece(p, '10A', '[data-piece="group"]'), area('10A'));
      await place(p, 'mouse', piece(p, '10A', '[data-piece="stick"]'), area('10A'));
      for (let i = 0; i < 4; i++) await place(p, 'mouse', piece(p, '10B1', '[data-piece="stick"]'), area('10B1'));
      await place(p, 'mouse', piece(p, '10B1', '[data-piece="group"]'), area('10B1'));
      await typed(p, '10B2', '1', 'hint', S('Count the squares in your build.'));
      await typed(p, '10B2', '2', 'correct', 'Right: two squares.');
      await typed(p, '10B3', '1', 'hint', S('Figure n has n squares.'));
      await typed(p, '10B3', '2', 'correct', "Arun's rule built Figure 2 when it should have built Figure 1.");
      for (let i = 0; i < 4; i++) await place(p, 'mouse', piece(p, '10C', '[data-piece="stick"]'), area('10C'));
      for (const m of ['0-0', '1-0', '2-0']) await step(p, '10D').locator(`[data-mark="${m}"]`).click();
      await check(p, '10D');
      ok(same((await feedback(p, '10D')).says, [S('Build his rule for Figure 1 again and count the squares.')]), '10D: Arun marked correct');
      for (const m of ['0-1', '1-1', '2-0']) await step(p, '10D').locator(`[data-mark="${m}"]`).click();
      await check(p, '10D');
      ok(same((await feedback(p, '10D')).says, [S('Build that rule for Figure 1 again. Does it make one square?')]), '10D: Mina marked incorrect gets the hint');
      for (const m of ['0-0', '1-1', '2-0']) await step(p, '10D').locator(`[data-mark="${m}"]`).click();
      await check(p, '10D');
      await step(p, '10E').locator('textarea').fill('He starts with a whole square.');
      await step(p, '10E').locator('button').click();
    },
    why: S("Arun's constant, 4, is already a complete square. His 3n then adds a three-stick piece for every square, so at n = 1 he builds two squares: Figure 2. Mina starts from 1 stick, so n pieces of 3 make exactly n squares. Nina keeps the full first square but uses (n − 1), so she only adds pieces for the squares after the first. Her rule simplifies to Mina's: equivalent rules can look different and still give the same value for every n."),
  },

  15: {
    async correct(p) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('Exit ticket'), 'Exit ticket: titled "Exit ticket"');
      ok((await screenEl(p).locator('.eyebrow').textContent()).trim() === 'Part 4: Exit ticket', 'Exit ticket: in Part 4');
      ok((await screenEl(p).locator('.intro').textContent()).trim() === S("Figures 1, 2 and 3 of a new pattern. Answer on your own; you'll see your results when you submit."), 'Exit ticket: intro');
      ok((await screenEl(p).locator('.card').first().locator('rect.t-const').count()) === 15 && (await screenEl(p).locator('.card').first().locator('rect.t-coef').count()) === 24,
        'Exit ticket: Figures 1–3 drawn as 5 fixed tiles plus groups of 4 (9, 13, 17 tiles)');
      const rows = await screenEl(p).locator('table.extable tr').evaluateAll(trs => trs.map(tr => [...tr.cells].map(c => c.querySelector('input') ? '?' : c.textContent.trim())));
      ok(same(rows, [['Figure n', '1', '2', '3', '4', '5'], ['Tiles', '9', '13', '17', '?', '?'], [S('Skip count by 4'), '4', '8', '?', '?', '?']]), `Exit item 1: the table to complete (got ${JSON.stringify(rows)})`);
      ok(!(await whyVisible(p)) && (await screenEl(p).locator('.note').count()) === 0, 'Exit ticket: no Why? and no hints before submitting');
      await SCREENS[15].submit(p, [[21, 25, 12, 16, 20], '4n + 5', '105', '15']);
      ok((await screenEl(p).locator('.item .okmark').count()) === 4 && (await screenEl(p).locator('.item .note').count()) === 0, 'Exit ticket: all four correct');
      ok(!(await whyVisible(p)), 'Exit ticket: no Why? after submitting');
    },
    async wrong(p) {
      // An unreadable rule is flagged and nothing is submitted.
      await SCREENS[15].fillAll(p, [[20, 24, 12, 15, 20], 'abc', '100', '14']);
      await screenEl(p).locator('[data-submit]').click();
      ok(same(await texts(screenEl(p).locator('[data-item="2"] .say')), [H('Type a rule using n, such as 2n + 5.')]) && await screenEl(p).locator('[data-item="2"] input').isEnabled(),
        'Exit ticket: an unreadable rule is flagged and the ticket is not submitted');
      await SCREENS[15].submit(p, [[20, 24, 12, 15, 20], '9 + 4n', '100', '14']);
      await SCREENS[15].expect(p, [
        [S('Each figure adds 4 tiles.'), S('Count by 4: 4, 8, 12, …')],
        [S('9 is the total for Figure 1. The constant is the value at Figure 0.')],
        [S('You counted the groups. Add the 5 fixed tiles.')],
        [S("Start from the 5 fixed tiles, not Figure 1's 9.")],
      ], 'all wrong');
    },
    async fillAll(p, [table, rule, fig25, fig65]) {
      const tableInputs = screenEl(p).locator('[data-item="1"] input');
      for (let i = 0; i < table.length; i++) await tableInputs.nth(i).fill(String(table[i]));
      for (const [i, v] of [[2, rule], [3, fig25], [4, fig65]]) await screenEl(p).locator(`[data-item="${i}"] input`).fill(v);
    },
    async submit(p, vals) {
      await SCREENS[15].fillAll(p, vals);
      await screenEl(p).locator('[data-submit]').click();
    },
    async expect(p, says, label) {
      for (let i = 0; i < 4; i++) {
        const got = await texts(screenEl(p).locator(`[data-item="${i + 1}"] .say`));
        ok(same(got, says[i]), `Exit ticket (${label}) item ${i + 1}: ${says[i].length ? 'responses' : 'right'} ${JSON.stringify(says[i])} (got ${JSON.stringify(got)})`);
      }
    },
  },

  16: {
    async correct(p) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('What you showed on your own'), 'Self-check: title');
      const items = await texts(screenEl(p).locator('.checklist li'));
      ok(same(items, [S('Completed the table'), S('Wrote the rule for a new pattern'), S('Found the total for any figure'), S('Found the figure for a given total')]), `Self-check: the four lines in order (got ${JSON.stringify(items)})`);
      ok(same(await SCREENS[16].ticks(p), [true, true, true, true]), 'Self-check: 4 ticks when every exit item is right');
      ok(await p.locator('#next').isHidden(), 'Self-check: no Next on the last screen');
    },
    async wrong(p) {
      ok(same(await SCREENS[16].ticks(p), [false, false, false, false]), 'Self-check: 0 ticks when every exit item is wrong, whatever happened on the lesson screens');
    },
    ticks: p => screenEl(p).locator('.checklist li').evaluateAll(li => li.map(x => x.dataset.ticked === 'true')),
  },
};

// Screen 7, answer 40: Marc's move, step by step. fig2 / fig3 = the learner's predictions for Figures 2 and 3.
async function screen7Move(p, { fig2, fig3, hints }) {
  ok((await step(p, '7·1').locator('.prompt').textContent()).trim() === S('If each square has 4 sticks, how many would Figure 2 have?'), 'Move step 1 prompt');
  if (hints) await typed(p, '7·1', '9', 'hint', S("Use the student's claim: 4 sticks for each square, and Figure 2 has 2 squares."), 'Move step 1');
  if (fig2 === '7') {
    // Q8: 7 is the real count; straight to the shared edge.
    await typed(p, '7·1', '7', 'wrong', S('7 is the real count. If every square had its own 4 sticks, Figure 2 would have 8. Why only 7?'), 'Move step 1');
    await step(p, '7·3').waitFor({ timeout: 15000 });
    ok((await step(p, '7·2s').locator('line.flash').count()) === 1, 'Move, after 7: Figure 2\'s shared edge flashes');
    ok((await step(p, '7·2').count()) === 0, 'Move, after 7: the counting step is skipped');
  } else {
    await typed(p, '7·1', '8', 'correct', S('Right: 2 squares × 4 sticks = 8, if the claim were true.'), 'Move step 1');
    ok(same(await lines(p, '7·2'), [S('Count them.')]), 'Move step 2: "Count them."');
    await step(p, '7·3').waitFor({ timeout: 15000 });
    ok((await step(p, '7·2').locator('.counter').textContent()).trim() === '7', 'Move step 2: the sticks light up one by one: 7');
    ok(same(await lines(p, '7·2'), ['Count them.', S('Why?')]) && (await step(p, '7·2').locator('line.flash').count()) === 1, 'Move step 2: "Why?" and the shared edge flashes');
  }
  ok((await step(p, '7·3').locator('.prompt').textContent()).trim() === S('Then how many does Figure 3 have?'), 'Move step 3 prompt');
  if (fig3 === '10') {
    await typed(p, '7·3', '10', 'correct', S('Right.'), 'Move step 3');
  } else {
    await typed(p, '7·3', fig3, null, undefined, 'Move step 3');
    await step(p, '7·4').waitFor({ timeout: 15000 });
    ok((await step(p, '7·3b').locator('.counter').textContent()).trim() === '10', 'Move step 3: the sticks light up: 10');
    ok(same(await lines(p, '7·3b'), ['Count them.', S("So it didn't add 4 new ones. Why not?")]), 'Move step 3: "So it didn\'t add 4 new ones. Why not?"');
  }
  ok((await step(p, '7·4').locator('.prompt').textContent()).trim() === S('How many sticks did the 2nd square add? The 3rd?'), 'Move step 4 prompt');
  if (hints) await typed(p, '7·4', [4, 3], 'hint', S('Compare Figure 1 and Figure 2: how many sticks were added? Then compare Figure 2 and Figure 3.'), 'Move step 4');
  await typed(p, '7·4', [3, 3], 'correct', S('Right. Each new square adds only 3 sticks.'), 'Move step 4');
  ok(same(await lines(p, '7·5'), [S('Does the first one follow the same pattern? If so, Figure 1 is 1 + 3.')]), 'Move step 5 line');
  ok((await step(p, '7·5').locator('.prompt').textContent()).trim() === S('Figure 2 is 1 + two 3s. Figure 3 is…?'), 'Move step 5 prompt');
  if (hints) await typed(p, '7·5', '9', 'hint', S('Figure 1 is 1 + 3. Figure 2 is 1 + two 3s. Follow the same pattern.'), 'Move step 5');
  await typed(p, '7·5', '10', 'correct', S('1 + three 3s. That matches the count.'), 'Move step 5');
  ok((await step(p, '7·6').locator('.prompt').textContent()).trim() === S('So how many does Figure 10 have?'), 'Move step 6 prompt');
  if (hints) await typed(p, '7·6', '30', 'hint', S('Figure 10 is 1 plus how many 3s?'), 'Move step 6');
  await typed(p, '7·6', '31', 'correct', '1 + 3 × 10 = 31.', 'Move step 6');
}

/* =====================================================================
   CHECKS ON THE ANSWER CHECKER AND THE COMPUTED NUMBERS
   ===================================================================== */
async function checkerTests(p) {
  section = 'answer checker';
  const r = await p.evaluate(() => {
    const eq = (a, b) => { const x = parseRule(a), y = parseRule(b); return !!(x && y && isLinear(x) && sameRule(x, y)); };
    const simp = a => isSimplified(parseRule(a));
    const linear = a => { const e = parseRule(a); return e ? isLinear(e) : 'unreadable'; };
    // A non-straight-line rule that matches 3n + 2 at all six test points must still be rejected.
    const sneaky = '3n + 2 + n(n − 1)(n − 2)(n − 3)(n − 7)(2n − 3)';
    const st3B = LESSON.screens.find(s => s.n === 3).steps.find(s => s.id === 'B');
    return {
      equivalent: [eq('3n + 2', '2 + 3n'), eq('S = 4 + 3(n − 1)', '3n + 1'), eq('3 × n + 1', '3n + 1'), eq('P = 30 + 6(n - 1)', '24 + 6n'), eq('(n + 1)/2', '0.5n + 0.5')],
      notEquivalent: [eq('3n + 2', '5n'), eq('3n + 1', '3n + 3'), eq('7n − 7', '3n + 1')],
      rejected: ['n × n', 'n*n + 1', 'n²', 'n^2', '3/n + 1', 'n(n + 1)', 'n/n', sneaky].map(linear),
      sneakyMatches: sameRule(parseRule(sneaky), parseRule('3n + 2')),
      sneakyJudged: JUDGE.rule(st3B, [sneaky]).kind,
      unparseable: ['', 'n +', '3x + 2', 'abc', '42', 'y = 3n'].map(v => parseRule(v) === null),
      simplified: [simp('3n + 1'), simp('1 + 3n'), simp('S = 3n+1')],
      notSimplified: [simp('4 + 3n − 3'), simp('4 + 3(n − 1)'), simp('n + 2n + 1')],
      numbers: ['6.5', '6.50', '13 sticks', 'n = 25', 'Figure 7', '−3'].map(parseNumber),
    };
  });
  ok(r.equivalent.every(Boolean), `equivalent straight-line rules match: ${JSON.stringify(r.equivalent)}`);
  ok(r.notEquivalent.every(x => !x), `different rules don't match: ${JSON.stringify(r.notEquivalent)}`);
  ok(r.rejected.every(x => x === false), `n × n, powers of n and n in a denominator are rejected: ${JSON.stringify(r.rejected)}`);
  ok(r.sneakyMatches && r.sneakyJudged === 'hint', `a non-linear rule that matches at every test point is still rejected (${r.sneakyMatches}, ${r.sneakyJudged})`);
  ok(r.unparseable.every(Boolean), `unparseable input is recognized: ${JSON.stringify(r.unparseable)}`);
  ok(r.simplified.every(Boolean) && r.notSimplified.every(x => !x), 'simplified and unsimplified forms');
  ok(same(r.numbers, [6.5, 6.5, 13, 25, 7, -3]), `numbers parse with units: ${JSON.stringify(r.numbers)}`);
}

async function numberTests(p) {
  section = 'computed numbers';
  const n = await p.evaluate(() => ({
    screens: LESSON.screens.length,
    tiles: [0, 1, 2, 3, 4, 7, 10].map(k => tileCount(k)),
    skip: [1, 2, 3, 4, 10].map(k => TILES.group * k),
    followTiles: [1, 2, 3].map(k => tilesIn(TILES_FOLLOW, k)),
    exitTiles: [1, 2, 3, 4, 5, 25, 26].map(k => tilesIn(TILES_EXIT, k)),
    exitSkip: [1, 2, 3, 4, 5].map(k => TILES_EXIT.group * k),
    exit65: solveLinear('4n + 5', 65),
    sticks: [0, 1, 2, 3, 4, 10, 40].map(k => stickCount(k)),
    triangles: [1, 2, 3, 10].map(k => triangleSticks(k)),
    stickFor100: range(0, 100).find(k => stickCount(k) === 100),
    builds: [[1, 1], [4, 1], [4, 0]].map(([c, g]) => completeSquares(builtEdges(c, g).map(x => x.e))),
  }));
  ok(n.screens === 11, `the lesson has 11 screens (got ${n.screens})`);
  ok(same(n.tiles, [2, 5, 8, 11, 14, 23, 32]) && same(n.skip, [3, 6, 9, 12, 30]), `tiles 2, 5, 8, 11, 14…; skip count 3, 6, 9, 12, and 30 at n = 10`);
  ok(same(n.followTiles, [6, 8, 10]), `3B follow-up tiles 6, 8, 10: ${n.followTiles}`);
  ok(same(n.exitTiles, [9, 13, 17, 21, 25, 105, 109]) && same(n.exitSkip, [4, 8, 12, 16, 20]) && n.exit65 === 15,
    `exit pattern: 9, 13, 17, 21, 25; Figure 25 = 105, Figure 26 = 109; skip count 4…20; 65 tiles at Figure 15`);
  ok(same(n.sticks, [1, 4, 7, 10, 13, 31, 121]) && n.stickFor100 === 33, `sticks: Figure 10 = 31, Figure 40 = 121, 100 at Figure 33`);
  ok(same(n.triangles, [3, 5, 7, 21]) && same(n.builds, [1, 2, 1]), 'triangles 3, 5, 7, 21; builds of 1, 2 and 1 squares');
}

// Every response, hint, Why?, title and option in the data block is word for word in the source of truth;
// every prompt is in the source of truth or among the round 1 prompts approved by Round-2-Wording A.
async function dataTextTests(p) {
  section = 'data block text';
  const { strings, prompts, parts } = await p.evaluate(() => {
    const strings = [], prompts = [];
    const KEYS = ['say', 'hint', 'notCombined', 'result', 'model', 'ifWrong', 'ifChosen', 'ifMarkedCorrect', 'title', 'q', 'reminder', 'text', 'moveFirst', 'groupsNote'];
    const walk = (x, key) => {
      if (typeof x === 'string') {
        if (key === 'prompt') prompts.push(plain(x));
        else if (KEYS.includes(key) || ['why', 'intro', 'lines', 'after', 'rows'].includes(key)) strings.push(plain(x));
        return;
      }
      if (Array.isArray(x)) { x.forEach(v => walk(v, key)); return; }
      if (x && typeof x === 'object') Object.entries(x).forEach(([k, v]) => walk(v, k));
    };
    walk(LESSON.screens, 'screens');
    strings.push(LESSON.ui.firstSquare, LESSON.ui.edgeTaken);
    return { strings, prompts, parts: Object.values(LESSON.parts) };
  });
  const names = parts.map(x => x.replace(/^Part (\d+): /, '$1|').split('|'));
  ok(same(names.map(x => x[0]), ['1', '2', '3', '4']) && names.every(([, name]) => new RegExp(`Part \\d+: ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(SPEC)),
    `parts are numbered 1 to 4, each with its name as written in the spec: ${JSON.stringify(parts)}`);
  const missing = strings.filter(t => !TRUTH.includes(t));
  ok(missing.length === 0, `${strings.length} strings checked; not in the source of truth: ${JSON.stringify(missing)}`);
  const unapproved = prompts.filter(t => !TRUTH.includes(t) && !PROMPTS.includes(t));
  ok(unapproved.length === 0, `${prompts.length} prompts checked; not approved: ${JSON.stringify(unapproved)}`);
}

/* =====================================================================
   RUNS
   ===================================================================== */
let browser;
async function newPage(viewport, extra = {}) {
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
const ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16];   // round 1 screen numbers, in lesson order (15 = the new exit ticket)
const pad = n => String(n).padStart(2, '0');

async function correctPath(label, viewport, extra, mode, shots) {
  section = `correct path (${label})`;
  const p = await newPage(viewport, extra);
  for (const [i, n] of ORDER.entries()) {
    const k = i + 1;
    ok((await p.locator('#where').textContent()).trim() === `Screen ${k} of 11`, `${label}: progress shows Screen ${k} of 11`);
    if (shots === 'all') await screenshot(p, `${label}-${pad(k)}-start`);
    await SCREENS[n].correct(p, mode);
    if (SCREENS[n].why) {
      await openWhy(p);
      ok((await whyText(p)).includes(SCREENS[n].why), `Screen ${k}: Why? text matches the spec`);
    }
    if (SCREENS[n].extra) await SCREENS[n].extra(p);
    await p.waitForTimeout(500);
    const checks = { overflow: await overflowProblems(p), targets: await smallTargets(p), nulls: await nullText(p), wraps: await wrapProblems(p) };
    ok(checks.overflow.length === 0, `${label} Screen ${k}: nothing overflows ${JSON.stringify(checks.overflow)}`);
    ok(checks.targets.length === 0, `${label} Screen ${k}: every target is at least 44 px ${JSON.stringify(checks.targets)}`);
    ok(checks.nulls.length === 0, `${label} Screen ${k}: no rendered text reads "null" or "undefined" ${JSON.stringify(checks.nulls)}`);
    ok(checks.wraps.length === 0, `${label} Screen ${k}: no expression wraps ${JSON.stringify(checks.wraps)}`);
    if (shots) await screenshot(p, `${label}-${pad(k)}-done`);
    if (k < ORDER.length) {
      ok(await p.locator('#next').isEnabled(), `${label} Screen ${k}: Next is enabled once done`);
      await next(p);
    }
  }
  ok(p.errors.length === 0, `${label}: no console errors and no network requests ${JSON.stringify(p.errors)}`);
  ok(await p.evaluate(() => { try { return localStorage.length === 0 && document.cookie === ''; } catch (e) { return true; } }), `${label}: nothing stored about the learner`);
  await p.context().close();
}

async function wrongPath() {
  section = 'predicted wrong answers';
  const p = await newPage(PHONE, CHROMIUM ? { hasTouch: true } : {});
  for (const [i, n] of ORDER.entries()) {
    await SCREENS[n].wrong(p);
    ok((await nullText(p)).length === 0 && (await wrapProblems(p)).length === 0, `wrong-answer run Screen ${i + 1}: no "null" text and no wrapped expressions`);
    await p.waitForTimeout(300);
    if (CHROMIUM) await screenshot(p, `phone-wrong-${pad(i + 1)}`);
    if (i < ORDER.length - 1) await next(p);
  }
  ok(p.errors.length === 0, `wrong-answer run: no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}

async function playTo(p, n) {
  for (const s of ORDER) { if (s === n) return; await SCREENS[s].correct(p, 'tap'); await next(p); }
}
// Screen 7's move with the other branches: a 7 for Figure 2 (Q8), 10 for Figure 3, and every step's hint.
async function screen7Seven() {
  section = 'Screen 7: 40, then 7';
  const p = await newPage(PHONE);
  await playTo(p, 7);
  for (const e of ['t3', 'b3', 'v4']) await place(p, 'tap', piece(p, '7A1'), step(p, '7A1').locator(`[data-hit="${e}"]`));
  await typed(p, '7A2', '13', 'correct');
  await typed(p, '7B', '40', null);
  await screen7Move(p, { fig2: '7', fig3: '10', hints: true });
  ok(await p.locator('#next').isEnabled(), 'Screen 7: done after the move');
  ok(p.errors.length === 0, `no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}
// Screen 7's follow-up item: two misses on 7B (neither 40), then the answer, then the triangles.
async function screen7FollowUp() {
  section = 'Screen 7: follow-up item';
  const p = await newPage(PHONE);
  await playTo(p, 7);
  for (const e of ['t3', 'b3', 'v4']) await place(p, 'tap', piece(p, '7A1'), step(p, '7A1').locator(`[data-hit="${e}"]`));
  await typed(p, '7A2', '13', 'correct');
  await typed(p, '7B', '30', 'wrong');
  ok((await step(p, '7B·f').count()) === 0, '7B: no follow-up after one miss');
  await typed(p, '7B', '29', 'hint', S('Start from Figure 1, then count how many sticks each new square adds.'));
  ok((await answerCard(p, '7B')) === '31', '7B: second miss shows the answer');
  await typed(p, '7B', '31', 'correct', '1 + 3 × 10 = 31.');
  ok(await step(p, '7B·f').isVisible() && await p.locator('#next').isDisabled(), '7B: the follow-up item appears and must be answered');
  const counts = await step(p, '7B·f').locator('svg').evaluateAll(svgs => svgs.map(s => s.querySelectorAll('line.stick').length));
  ok(same(counts, [3, 5, 7]), `7B follow-up: triangles drawn with 3, 5 and 7 sticks (got ${JSON.stringify(counts)})`);
  await typed(p, '7B·f', '30', 'wrong', S('Neighbouring triangles share a stick. Each new triangle adds only 2.'));
  await typed(p, '7B·f', '20', 'wrong', S('2 for each triangle, but Figure 1 needs one more stick.'));
  await typed(p, '7B·f', '19', 'hint', S('Count how many sticks each new triangle adds.'));
  await typed(p, '7B·f', '21', 'correct', S('Right. 1 + ten 2s = 21.'));
  ok(await p.locator('#next').isEnabled(), '7B: Next once the follow-up is answered');
  ok(p.errors.length === 0, `no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}

// The exit ticket takes one submission, so each other response needs its own run through the lesson.
async function exitRuns() {
  const runs = [
    { label: 'tile row wrong, 9n, 225, 16.25', vals: [[22, 25, 12, 16, 20], '9n', '225', '16.25'], ticks: [false, false, false, false],
      says: [[S('Each figure adds 4 tiles.')], [S('Only 4 tiles repeat in each figure.')], [S('Only 4 tiles repeat in each figure.')], [S('Undo the + 5 first, then the × 4.')]] },
    { label: 'skip row wrong, 4n, 109, 16', vals: [[21, 25, 12, 16, 24], '4n', '109', '16'], ticks: [false, false, false, false],
      says: [[S('Count by 4: 4, 8, 12, …')], [S('Each figure also has the 5 fixed tiles.')], [S("That's Figure 26.")], [S('Solve 4n + 5 = 65.')]] },
    { label: 'non-linear rule, other answers', vals: [[21, 25, 12, 16, 20], 'n × n + 5', '99', '15'], ticks: [true, false, false, true],
      says: [[], [S('How many tiles does each figure add, and how many are there at Figure 0?')], [S('Replace n with 25 in T = 4n + 5.')], []] },
    { label: 'one blank wrong', vals: [[21, 25, 12, 16, 21], '5 + 4n', '105', 'Figure 15'], ticks: [false, true, true, true],
      says: [[S('Count by 4: 4, 8, 12, …')], [], [], []] },
  ];
  for (const run of runs) {
    section = `exit ticket: ${run.label}`;
    const p = await newPage(PHONE);
    await playTo(p, 15);
    await SCREENS[15].submit(p, run.vals);
    await SCREENS[15].expect(p, run.says, run.label);
    await next(p);
    ok(same(await SCREENS[16].ticks(p), run.ticks), `self-check ticks ${JSON.stringify(run.ticks)} (got ${JSON.stringify(await SCREENS[16].ticks(p))})`);
    ok(p.errors.length === 0, `no console errors ${JSON.stringify(p.errors)}`);
    await p.context().close();
  }
}

async function navigationTests() {
  section = 'navigation';
  const p = await newPage(PHONE);
  ok(await p.locator('#back').isDisabled() && await p.locator('#next').isDisabled(), 'Back and Next disabled at the start');
  await SCREENS[2].correct(p, 'tap'); await next(p);
  await SCREENS[3].correct(p, 'tap'); await next(p);
  await p.click('#back'); await p.click('#back');
  ok((await p.locator('#where').textContent()).includes('Screen 1 of 11'), 'Back twice shows Screen 1');
  ok(await step(p, '2A').locator('input').isDisabled() && (await step(p, '2A').locator('input').inputValue()) === '2', 'Back: earlier answers can be seen but not changed');
  ok(await screenEl(p).locator('.why-btn').isEnabled(), 'Back: the Why? text can still be opened');
  await next(p); await next(p);
  ok((await p.locator('#where').textContent()).includes('Screen 3 of 11') && await step(p, '4A').locator('.choice').first().isEnabled(), 'Next returns to the current screen, still answerable');
  await p.context().close();
}

async function keyboardTests() {
  section = 'keyboard';
  const p = await newPage(DESKTOP);
  await typed(p, '2A', '2', 'correct'); await typed(p, '2B', '3', 'correct');
  await piece(p, '2C1').focus(); await p.keyboard.press('Enter');
  await step(p, '2C1').locator('.drop').focus(); await p.keyboard.press('Enter');
  ok(await step(p, '2C2').isVisible(), 'the group can be placed with the keyboard');
  await step(p, '2C2').locator('input').fill('14');
  await step(p, '2C2').locator('input').press('Enter');
  ok((await feedback(p, '2C2')).kind === 'correct', 'Enter checks a typed answer');
  await p.context().close();
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  browser = await playwright[ENGINE].launch();
  console.log(`${ENGINE} ${browser.version()}`);
  const p0 = await newPage(PHONE);
  await checkerTests(p0);
  await numberTests(p0);
  await dataTextTests(p0);
  await p0.context().close();
  if (process.env.ONLY === 'phone-touch') {   // debugging aid: one run only
    await correctPath('phone-touch', PHONE, { hasTouch: true, isMobile: true }, 'touch', false);
  } else if (CHROMIUM) {
    await correctPath('phone', PHONE, { hasTouch: true, isMobile: true }, 'tap', 'all');
    await correctPath('desktop', DESKTOP, {}, 'mouse', 'all');
    await correctPath('phone-touch', PHONE, { hasTouch: true, isMobile: true }, 'touch', false);
    await correctPath('phone-dark', PHONE, { colorScheme: 'dark', hasTouch: true, isMobile: true }, 'tap', false);
    await correctPath('desktop-dark', DESKTOP, { colorScheme: 'dark' }, 'mouse', false);
  } else {
    // WebKit: touch drags need the Chrome DevTools protocol, so pieces are placed by tap and by mouse drag.
    await correctPath('phone', PHONE, { hasTouch: true, isMobile: true }, 'tap', 'done');
    await correctPath('desktop', DESKTOP, {}, 'mouse', 'done');
    await correctPath('phone-dark', PHONE, { colorScheme: 'dark', hasTouch: true, isMobile: true }, 'tap', false);
  }
  if (!process.env.ONLY) {
  await wrongPath();
  await screen7Seven();
  await screen7FollowUp();
  await exitRuns();
  await navigationTests();
  await keyboardTests();
  }
  const version = browser.version();
  await browser.close();

  const failed = results.filter(r => !r.ok);
  const bySection = {};
  for (const r of results) { bySection[r.section] = bySection[r.section] || { pass: 0, fail: 0 }; bySection[r.section][r.ok ? 'pass' : 'fail']++; }
  console.log(`\nSummary (${ENGINE})`);
  for (const [k, v] of Object.entries(bySection)) console.log(`  ${k}: ${v.pass} passed, ${v.fail} failed`);
  console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
  fs.writeFileSync(path.join(ROOT, 'test-results', `results-${ENGINE}.json`), JSON.stringify({ engine: ENGINE, version, bySection, failed }, null, 2));
  process.exit(failed.length ? 1 : 0);
})();
