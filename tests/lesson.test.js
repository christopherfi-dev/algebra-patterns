// Playwright tests for lesson/index.html.
//   Chromium: node tests/lesson.test.js
//   WebKit:   PLAYWRIGHT_BROWSERS_PATH=<folder with webkit> node tests/lesson.test.js --webkit
// Every expected learner-facing string is wrapped in S(), which also checks it appears word for word in the source of
// truth: the spec, the round 2 files, ROUND-2-AMENDMENT.md with Marc's answers to it, and HANDOFF-ROUND-3.md to -8.md.
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
const TRUTH = [SPEC, read('docs', 'Round-2-Decisions.md'), read('docs', 'Round-2-Wording.md'), read('ROUND-2-AMENDMENT.md'), read('docs', 'Round-2-Amendment-Answers.md'), read('HANDOFF-ROUND-3.md'), read('HANDOFF-ROUND-4.md'), read('HANDOFF-ROUND-5.md'), read('HANDOFF-ROUND-6.md'), read('HANDOFF-ROUND-7.md'), read('HANDOFF-ROUND-8.md')].join('\n');
// "Skip count by 3" and "by 4" carry a non-breaking space in the lesson (HANDOFF-ROUND-4 3).
const NB = s => s.replace(/by (\d)/, 'by\u00A0$1');
const HANDOFF = read('HANDOFF.md');
// Round-2-Wording A approves the round 1 prompts "as written" in the round 1 handback (■ marks the colour swatch).
const PROMPTS = read('handback', 'round-1.md').replace(/ ■/g, '');
const SHOTS = path.join(ROOT, 'test-results', 'screenshots', CHROMIUM ? '' : 'webkit');
const PHONE = { width: 390, height: 844 };
const NARROW = { width: 360, height: 780 };   // a narrow Android phone (HANDOFF-ROUND-4 2)
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
const TABLE_ROWS = new Set(['3T0', '3T1', '3T3', '7R1', '7R3', '7R4']);   // these steps type into the table at the top of their screen
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
// Round 7: select exactly these tiles (by index: the fixed tiles first, then the group), then Check.
async function tapped(p, id, picks, kind, say) {
  const tiles = step(p, id).locator('rect.tap');
  for (let i = 0; i < await tiles.count(); i++) {
    if (((await tiles.nth(i).getAttribute('aria-pressed')) === 'true') === picks.includes(i)) continue;
    if (p.touch) await tiles.nth(i).tap(); else await tiles.nth(i).click();
  }
  await check(p, id);
  const fb = await feedback(p, id);
  ok(fb.kind === kind && fb.says.includes(say), `Step ${id} tapped tiles ${JSON.stringify(picks)}: ${kind}, "${say}" (got ${fb.kind}, ${JSON.stringify(fb.says)})`);
}
const markedTiles = (p, id) => step(p, id).locator('rect.tap').evaluateAll(rs => rs.map((r, i) => (r.classList.contains('is-answer') ? i : -1)).filter(i => i >= 0));
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
    // Any rule or expression anywhere in the text (table headers, row labels, captions, options, prose): an "=" with n,
    // or a bracketed expression in n. Each one must sit on a single line.
    const EXPR = /[\w.()\u00B2\u2212]+(?:\s?[=+\u2212\u00D7\u00F7]\s?[\w.()\u00B2\u2212]+)+/g;
    const hasN = s => /(^|[^A-Za-z])n([^A-Za-z]|$)/.test(s);
    const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.parentElement.getClientRects().length) continue;
      for (const m of node.textContent.matchAll(EXPR)) {
        const e = m[0].replace(/[.,]$/, '');
        if (!hasN(e) || !(e.includes('=') || /\([^)]*n[^)]*\)/.test(e))) continue;
        const r = document.createRange();
        r.setStart(node, m.index);
        r.setEnd(node, m.index + e.length);
        const lines = new Set([...r.getClientRects()].filter(x => x.width > 0).map(x => Math.round(x.top)));
        if (lines.size > 1) out.push(`"${e}" breaks across lines`);
      }
    }
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
// Round 4: at 360 and 390 px, every unbreakable piece (an expression, a formula, a rule card, a caption) and every
// table's narrowest layout leaves at least MARGIN px spare, because real phones use wider fonts than this machine.
const MARGIN = 16;
async function marginProblems(p) {
  return p.evaluate(margin => {
    const out = [];
    const sec = document.querySelector('section.screen:not([hidden])');
    const cs = el => getComputedStyle(el);
    const isItem = el => /(flex|grid)$/.test(cs(el.parentElement).display);
    // The block an element has to fit in: past inline wrappers, and past flex or grid items that shrink to fit their content.
    const container = el => { let b = el.parentElement; while (b && (/^(inline|inline-block|contents)$/.test(cs(b).display) || isItem(b))) b = b.parentElement; return b; };
    const room = b => b.clientWidth - parseFloat(cs(b).paddingLeft) - parseFloat(cs(b).paddingRight);
    const width = el => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; };
    const say = (el, need, have) => `"${el.textContent.trim().slice(0, 40)}" needs ${Math.round(need)} px of ${Math.round(have)}`;
    sec.querySelectorAll('.math, .formula, .student .r, figcaption').forEach(el => {
      if (!el.getClientRects().length || el.closest('td, th')) return;   // table cells are covered by the table check
      const need = el.classList.contains('math') ? el.getBoundingClientRect().width : width(el), have = room(container(el));
      if (need > have - margin) out.push(say(el, need, have));
    });
    sec.querySelectorAll('.tablewrap > table').forEach(tb => {
      if (!tb.getClientRects().length) return;
      const before = tb.style.width;
      tb.style.width = 'min-content';
      const need = tb.getBoundingClientRect().width;
      tb.style.width = before;
      const have = room(tb.parentElement);
      if (need > have - margin) out.push(`table ${say(tb, need, have)}`);
    });
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth) out.push('the page scrolls sideways');
    return out;
  }, MARGIN);
}

// Round 5: the title sits on one line with MARGIN px to spare, and so does the progress text. Where the two share a row
// (420 px and wider), they fit side by side with the margin.
async function headerProblems(p) {
  return p.evaluate(margin => {
    const out = [];
    const inner = document.querySelector('.top-inner'), cs = getComputedStyle(inner);
    const room = inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const range = el => { const r = document.createRange(); r.selectNodeContents(el); return r; };
    const lines = el => new Set([...range(el).getClientRects()].map(x => Math.round(x.top))).size;
    const width = el => range(el).getBoundingClientRect().width;
    const brand = document.getElementById('brand'), where = document.getElementById('where');
    for (const el of [brand, where]) {
      if (lines(el) !== 1) out.push(`"${el.textContent}" takes ${lines(el)} lines`);
      if (width(el) > room - margin) out.push(`"${el.textContent}" needs ${Math.round(width(el))} px of ${Math.round(room)}`);
    }
    const sameRow = Math.abs(brand.getBoundingClientRect().top - where.getBoundingClientRect().top) < 6;
    const both = width(brand) + parseFloat(cs.columnGap) + width(where);
    if (sameRow && both > room - margin) out.push(`title and progress share a row: ${Math.round(both)} px of ${Math.round(room)}`);
    return out;
  }, MARGIN);
}

// Round 6: Figures 1 to 4 above the table on the three table screens. Each is 2 fixed tiles in the constant colour and
// n groups of 3 in the coefficient colour. On phones they take at most two rows, and each row leaves MARGIN px spare.
async function checkTableFigures(p, where) {
  const f = await screenEl(p).evaluate(sec => {
    const colour = v => { const d = document.createElement('div'); d.style.color = `var(${v})`; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; };
    const card = sec.querySelector(':scope > .card'), table = sec.querySelector(':scope > .tablewrap > .comparetable');
    const box = card.querySelector('.figs'), figs = [...box.querySelectorAll('figure')];
    const fills = sel => [...box.querySelectorAll(sel)].map(r => getComputedStyle(r).fill);
    return {
      above: !!table && !!(card.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING),
      figures: figs.map(fg => [fg.querySelector('figcaption').textContent.trim(), fg.querySelectorAll('rect.t-const').length, fg.querySelectorAll('rect.t-coef').length]),
      colours: fills('rect.t-const').every(c => c === colour('--constant')) && fills('rect.t-coef').every(c => c === colour('--coefficient')),
    };
  });
  ok(f.above && f.colours && same(f.figures, [['Figure 1', 2, 3], ['Figure 2', 2, 6], ['Figure 3', 2, 9], ['Figure 4', 2, 12]]),
    `${where}: Figures 1 to 4 above the table, 2 fixed tiles in the constant colour and n groups of 3 in the coefficient colour (got ${JSON.stringify(f)})`);
  await checkFigureRows(p, where);
}
// The figures in a screen's first card: on phones at most two rows, each leaving MARGIN px spare (HANDOFF-ROUND-6 1).
async function checkFigureRows(p, where) {
  if (!(await p.evaluate(() => innerWidth <= 420))) return;
  const f = await screenEl(p).evaluate(sec => {
    const box = sec.querySelector(':scope > .card .figs'), cs = getComputedStyle(box);
    const room = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), rows = {};
    for (const fg of box.querySelectorAll('figure')) {
      const r = fg.getBoundingClientRect(), k = Math.round(r.top);
      rows[k] = [Math.min(r.left, rows[k] ? rows[k][0] : Infinity), Math.max(r.right, rows[k] ? rows[k][1] : -Infinity)];
    }
    return { rows: Object.keys(rows).length, spare: Math.round(Math.min(...Object.values(rows).map(([a, b]) => room - (b - a)))) };
  });
  ok(f.rows <= 2 && f.spare >= MARGIN, `${where}: the figures take at most two rows, each with ${MARGIN} px to spare (got ${f.rows} rows, ${f.spare} px)`);
}
// The completed table, read-only, on the two screens after the table screen.
const DONE_ROWS = [['Figure n', '1', '2', '3', '4'], ['Tiles', '5', '8', '11', '14'], [NB('Skip count by 3'), '3', '6', '9', '12'], ['How many more', '2', '2', '2', '2']];
const carriedTable = p => screenEl(p).locator('.comparetable').evaluate(tb => ({ caption: tb.caption && tb.caption.textContent.trim(), inputs: tb.querySelectorAll('input').length,
  rows: [...tb.rows].map(r => [...r.cells].map(c => c.textContent.trim())) }));

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
      await typed(p, '2B', '3', 'correct', S('Each figure adds one group of 3 in the second colour. That 3 is the coefficient.'));
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
      await typed(p, '2B', '3', 'correct', 'Each figure adds one group of 3 in the second colour. That 3 is the coefficient.');
      await place(p, 'mouse', piece(p, '2C1'), step(p, '2C1').locator('.drop'));
      await typed(p, '2C2', '12', 'wrong', S('You counted the groups. The 2 fixed tiles are in every figure too.'));
      await typed(p, '2C2', '20', 'wrong', S('Figure 1 has 5 tiles, but only 3 of them repeat.'));
      ok((await answerCard(p, '2C2')) === '14', '2C: second miss shows the answer');
      await typed(p, '2C2', '13', 'hint', S('Count the groups of 3 in Figure 4, then add the fixed tiles.'));
      await typed(p, '2C2', '14.0', 'correct', '4 groups of 3, plus the 2 fixed tiles: 14.');
    },
    why: S('Every figure has the same 2 fixed tiles. Each new figure adds one group of 3. So Figure 4 has 4 groups of 3 and the 2 fixed tiles: 12 + 2 = 14.'),
  },

  '3t': {
    async correct(p) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('The skip-count table'), 'The table screen: title (round 3 split)');
      await checkTableFigures(p, 'The table screen');
      ok(same(await SCREENS['3t'].table(p), [['Figure n', '1', '2', '3', '4'], ['Tiles', '', '', '', '']]) && (await screenEl(p).locator('.comparetable tr').nth(1).locator('input').count()) === 4,
        'The table starts with Figure n and four empty Tiles boxes; the other rows wait for their steps');
      await typed(p, '3T0', [5, 8, 11, 14], 'correct', S('Right: 5, 8, 11, 14.'));
      const tilesRow = screenEl(p).locator('.comparetable tr').nth(1);
      ok(same(await tilesRow.locator('input').evaluateAll(ins => ins.map(i => i.value)), ['5', '8', '11', '14']) && (await tilesRow.locator('td.filled').count()) === 0,
        '3T0: the learner typed all four tile counts; nothing filled in');
      await typed(p, '3T1', [3, 6], 'correct', S('Right: 3, 6, 9, 12.'));
      ok(same((await SCREENS['3t'].table(p))[2], [NB(S('Skip count by 3')), '', '', '9', '12']), '3T1: the rest of the skip-count row fills in, its label with a non-breaking space before the 3');
      const fb = await typed(p, '3T2', '30', 'correct', S('Right: 10 × 3 = 30.'));
      ok(!fb.says.join(' ').includes('3n'), '3T2: the confirmation no longer mentions 3n');
      const row = screenEl(p).locator('.comparetable tr').nth(3);
      ok((await row.locator('input').count()) === 4, '3T3: the "How many more" row has four boxes to type');
      await typed(p, '3T3', [2, 2, 2, 2], 'correct', S('Right. Every figure has exactly 2 more.'));
      ok(same(await row.locator('input').evaluateAll(ins => ins.map(i => i.value)), ['2', '2', '2', '2']) && (await row.locator('td.filled').count()) === 0,
        '3T3: the learner typed all four values; nothing filled in');
      ok((await step(p, '3A1').count()) === 0, 'The table screen ends after 3T3; the slider is on the next screen');
    },
    async wrong(p) {
      await typed(p, '3T0', [3, 6, 9, 12], 'wrong', S('Those are only the groups of 3. Count every tile, both colours.'));
      await typed(p, '3T0', [2, 2, 2, 2], 'wrong', S('Those are only the fixed tiles. Count every tile, both colours.'));
      ok((await answerCard(p, '3T0')) === '5, 8, 11, 14', '3T0: second miss shows the answer');
      await typed(p, '3T0', [5, 8, 11, 15], 'hint', S('Count every tile in Figure 1, both colours.'));
      await typed(p, '3T0', [5, 8, 11, 14], 'correct', 'Right: 5, 8, 11, 14.');
      await typed(p, '3T1', [5, 8], 'wrong', S('Those are the tiles. Skip count by 3 on its own: 3, 6, …'));
      await typed(p, '3T1', [4, 7], 'hint', S('Count by 3, the number each figure adds.'));
      ok((await answerCard(p, '3T1')) === '3, 6', '3T1: second miss shows the answer');
      await typed(p, '3T1', [3, 6], 'correct', 'Right: 3, 6, 9, 12.');
      await typed(p, '3T2', '32', 'wrong', S("32 is Figure 10's tiles. The skip-count row is only the 3s."));
      await typed(p, '3T2', '20', 'hint', S('The 1st is 1 × 3. The 2nd is 2 × 3.'));
      await typed(p, '3T2', '30', 'correct', 'Right: 10 × 3 = 30.');
      await typed(p, '3T3', [2, 2, 2], null, null, '3T3 with one box empty (no response)');
      await typed(p, '3T3', [2, 3, 2, 2], 'wrong', S('3 is what each figure adds. Compare the two rows: 5 and 3, then 8 and 6.'), '3T3 with a 3 in one box');
      await typed(p, '3T3', [2, 2, 2, 1], 'hint', S('Subtract in each column: 5 − 3, 8 − 6, 11 − 9, 14 − 12.'));
      ok((await answerCard(p, '3T3')) === '2, 2, 2, 2', '3T3: second miss shows the answer');
      await typed(p, '3T3', [2, 2, 2, 2], 'correct', 'Right. Every figure has exactly 2 more.');
    },
    why: S('Each figure adds 3 tiles, so the tiles grow like the skip count by 3. Every figure has 2 more tiles than the skip count. Those 2 are the fixed tiles.'),
    table: p => screenEl(p).locator('.comparetable tr').evaluateAll(trs => trs.map(tr => [...tr.cells].map(c => c.textContent.trim()))),
  },

  // New in round 6 (HANDOFF-ROUND-6 3).
  '3s': {
    async correct(p) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('Skip count for any figure') &&
        (await screenEl(p).locator('.eyebrow').textContent()).trim().toLowerCase() === 'part 1: tiles. see the structure', 'The new screen: title, in Part 1');
      await checkTableFigures(p, 'The new screen');
      const carried = await carriedTable(p);
      ok(carried.inputs === 0 && same(carried.rows, DONE_ROWS), `The new screen: the completed table beneath the figures, read-only (got ${JSON.stringify(carried)})`);
      await typed(p, '3S1', '15', 'correct', S('Right: 5 × 3 = 15.'));
      const options = await texts(step(p, '3S2').locator('.choice'));
      ok(same(options, ['3 + n', '3 − n', '3 × n', '3 ÷ n']), `3S2: the four options in order, the right one written "3 × n" and not first (got ${JSON.stringify(options)})`);
      ok(same(await lines(p, '3S2'), [S('Let n stand for the figure number. For Figure 5, n = 5.')]), '3S2: the line introducing n sits above the question');
      await chose(p, '3S2', 2, 'correct', S('Right: 3 × n, written 3n: three times the figure number. Figure 5 is 3 × 5 = 15.'));
    },
    async wrong(p) {
      await typed(p, '3S1', '17', 'wrong', S("That's Figure 5's real tiles. The skip count alone is 3, 6, 9, 12, …"));
      await typed(p, '3S1', '8', 'wrong', S("That's 3 + 5. Skip counting by 3 five times is 3 × 5."));
      ok((await answerCard(p, '3S1')) === '15', '3S1: second miss shows the answer');
      await typed(p, '3S1', '12', 'hint', S('Skip count by 3, five times.'));
      await typed(p, '3S1', '15', 'correct', 'Right: 5 × 3 = 15.');
      await chose(p, '3S2', 0, 'wrong', S('3 + n gives 8 at Figure 5, not 15.'));
      await chose(p, '3S2', 1, 'wrong', S('3 − n gives −2 at Figure 5, not 15.'));
      ok((await answerCard(p, '3S2')) === '3 × n', '3S2: second miss shows the answer');
      await chose(p, '3S2', 3, 'wrong', S('3 ÷ n gives 0.6 at Figure 5, not 15.'));
      await chose(p, '3S2', 2, 'correct', 'Right: 3 × n, written 3n: three times the figure number. Figure 5 is 3 × 5 = 15.');
    },
    why: S('In a skip count by 3, the figure number tells you how many 3s there are. Figure 5 is five 3s: 3 × 5 = 15. Call the figure number n, and the skip count is 3 × n, written 3n.'),
  },

  3: {
    async correct(p, mode) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('Figure 0'), 'Screen 4: titled "Figure 0" (round 8)');
      await checkTableFigures(p, 'Screen 4');
      const carried = await carriedTable(p);
      ok(carried.caption === S('From the last screen') && carried.inputs === 0 && same(carried.rows, DONE_ROWS),
        `Screen 4 opens with the completed table, read-only, captioned "From the last screen" (got ${JSON.stringify(carried)})`);
      ok(same(await screenEl(p).locator('[data-step]').evaluateAll(els => els.map(e => e.dataset.step)), ['3R']), '3R is the first step; 3A1 waits for it');
      await typed(p, '3R', '2', 'correct', S('Right. So every figure is 3n, plus 2 more.'));
      ok(await step(p, '3A1').isVisible(), '3A1 follows 3R');
      await slideTo(p, '3A1', 'Home', mode);
      ok((await step(p, '3A1').locator('figcaption').textContent()).trim() === 'Figure 0', '3A: slider reaches Figure 0');
      await typed(p, '3A2', '2', 'correct', S("Figure 0 has no groups, only the 2 fixed tiles. The same 2 as in the table. That 2 is the constant: what's there at Figure 0."));
      ok(same(await screenEl(p).locator('[data-step]').evaluateAll(els => els.map(e => e.dataset.step)), ['3R', '3A1', '3A2']), 'Screen 4 ends after 3A2; the rule is on Screen 6');
    },
    async wrong(p) {
      await typed(p, '3R', '3', 'wrong', S('3 is what each figure adds. Look at the "How many more" row.'));
      await typed(p, '3R', '4', 'hint', S('Look at the "How many more" row in the table.'));
      ok((await answerCard(p, '3R')) === '2', '3R: second miss shows the answer');
      await typed(p, '3R', '2', 'correct', 'Right. So every figure is 3n, plus 2 more.');
      await slideTo(p, '3A1', 'Home');
      await typed(p, '3A2', '5', 'wrong', S('5 is Figure 1. Take away its group of 3.'));
      await typed(p, '3A2', '0', 'wrong', S('The groups are gone, but look at the picture: the fixed tiles stay.'));
      await typed(p, '3A2', '3', 'hint', S('Look at the picture at Figure 0. Which tiles are still there?'));
      await typed(p, '3A2', '2', 'correct', "Figure 0 has no groups, only the 2 fixed tiles. The same 2 as in the table. That 2 is the constant: what's there at Figure 0.");
    },
    why: S("Every figure has 2 more tiles than the skip count by 3. At Figure 0 there are no groups, so only those 2 fixed tiles are left. That's the constant."),
  },

  // New in round 8: "The rule", after the parts are identified (HANDOFF-ROUND-8 3).
  '3b': {
    async correct(p, mode) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('The rule'), 'Screen 6: titled "The rule" (round 8)');
      await checkTableFigures(p, 'Screen 6');
      const carried = await carriedTable(p);
      ok(carried.caption === S('Your table') && carried.inputs === 0 && same(carried.rows, DONE_ROWS), `Screen 6: the completed table, read-only, captioned "Your table" (got ${JSON.stringify(carried)})`);
      ok(same(await lines(p, '3B'), [S('A rule gives the total for any figure. T is the total number of tiles and n is the figure number. The coefficient multiplies n; the constant is added.')]), '3B: the definition line sits above "Type the rule."');
      ok((await step(p, '3B').locator('input[type="range"]').count()) === 1, '3B has its own slider (Marc, round 8)');
      await typed(p, '3B', 'T = 3n + 2', 'correct', S('Right. Slide to check any figure.'));
      await slideTo(p, '3B', 'End', mode);
      ok((await step(p, '3B').locator('.readout').textContent()).trim() === 'T = 3 × 10 + 2 = 32', '3B: sliding checks any figure');
      ok((await step(p, '3B·f').count()) === 0, '3B: no follow-up item (removed in round 8)');
    },
    async wrong(p) {
      const at = async () => (await step(p, '3B').locator('figcaption').textContent()).trim();
      const fb1 = await typed(p, '3B', '3n + 5', 'wrong', S('5 is the total for Figure 1. The constant is the value at Figure 0.'));
      ok(same(fb1.tests, ['n = 1: 8, not 5']) && (await at()) === 'Figure 1', `3B: tests 5 + 3n at n = 1, and the slider shows Figure 1 (got ${JSON.stringify(fb1.tests)}, ${await at()})`);
      const fb2 = await typed(p, '3B', '5 × n', 'wrong', S('Only 3 tiles repeat in each figure, not 5.'));
      ok(same(fb2.tests, ['n = 2: 10, not 8']) && (await at()) === 'Figure 2', `3B: tests 5n at n = 2, and the slider shows Figure 2 (got ${JSON.stringify(fb2.tests)}, ${await at()})`);
      const card = await step(p, '3B').locator(':scope > .demo .answer-card .say').allTextContents();
      ok(same(card.map(x => x.trim()), [S('The skip count is 3n, and every figure has 2 more: T = 3n + 2.')]) && (await whyOpen(p)), `3B: second miss shows the new Answer card and the Why? text (got ${JSON.stringify(card)})`);
      await typed(p, '3B', 'n × n', 'hint', S('Start with the skip count for figure n, then add how many more every figure has.'), '3B (non-linear, rejected)');
      await typed(p, '3B', '2 + 3n', 'correct', 'Right. Slide to check any figure.');
      ok((await step(p, '3B·f').count()) === 0 && await p.locator('#next').isEnabled(), '3B: no follow-up item after the second miss; Next once the rule is typed');
    },
    why: S("The coefficient 3 counts the tiles in each group, so it multiplies the figure number n. The constant 2 counts the fixed tiles, which are there even at Figure 0. You can also see it in a table, the way you'd compare rows:"),
    async extra(p) {
      const rows = await screenEl(p).locator('.why tr').evaluateAll(trs => trs.map(tr => [...tr.children].map(td => td.textContent.trim())));
      ok(same(rows, [['n', '0', '1', '2', '3', '4'], ['Tiles', '2', '5', '8', '11', '14'], [NB(S('Skip count by 3 (3n)')), '0', '3', '6', '9', '12'], [S('How many more'), '2', '2', '2', '2', '2']]),
        `Screen 3: Why? table, with its rows renamed to match the new steps (got ${JSON.stringify(rows)})`);
    },
  },

  4: {
    async correct(p) {
      const sizes = await step(p, '4T1').locator('rect.tap').evaluateAll(rs => rs.map(r => Math.round(Math.min(r.getBoundingClientRect().width, r.getBoundingClientRect().height))));
      ok(sizes.length === 5 && sizes.every(x => x >= 44), `4T1: Figure 1's five tiles are each a target of at least 44 px (got ${sizes})`);
      await tapped(p, '4T1', [0, 1], 'correct', S('Right: the 2 fixed tiles.'));
      await tapped(p, '4T2', [2, 3, 4], 'correct', S('Right: one group of 3. Figure 1 is 2 + 3 = 5.'));
      ok((await screenEl(p).locator(':scope > .card').count()) === 0 && (await step(p, '4A').count()) === 0, 'Screen 5: no small Figure 1 at the top, and no 4A (round 8)');
    },
    async wrong(p) {
      await tapped(p, '4T1', [], 'hint', S('Which tiles are in every figure, even Figure 0?'));   // Check with nothing tapped (Marc, round 7)
      await tapped(p, '4T1', [0, 2], 'wrong', S("Those tiles are a group, which each figure adds. The constant is what's there at Figure 0."));
      ok((await step(p, '4T1').locator(':scope > .demo .answer-card').count()) === 1 && same(await markedTiles(p, '4T1'), [0, 1]), '4T1: second miss shows the Answer card and marks the 2 fixed tiles');
      await tapped(p, '4T1', [1], 'wrong', S("There's one more fixed tile."));
      await tapped(p, '4T1', [0, 1], 'correct', 'Right: the 2 fixed tiles.');
      await tapped(p, '4T2', [0], 'wrong', S('The fixed tiles are the constant. The coefficient counts the tiles in each group.'));
      await tapped(p, '4T2', [2, 3], 'hint', S('Which tiles does each new figure add?'));
      ok((await step(p, '4T2').locator(':scope > .demo .answer-card').count()) === 1 && same(await markedTiles(p, '4T2'), [2, 3, 4]), '4T2: second miss shows the Answer card and marks the group');
      await tapped(p, '4T2', [2, 3, 4], 'correct', 'Right: one group of 3. Figure 1 is 2 + 3 = 5.');
    },
    why: S('The first total includes one group, so it is the constant plus the coefficient: 2 + 3 = 5. The constant is the value at Figure 0, before any groups are added. Reading the first total as the constant is the most common mistake with these rules.'),
  },

  5: {
    async correct(p, mode) {
      await SCREENS[5].build(p, mode);
      ok((await nullText(p)).length === 0, 'Screen 6: no "null" where the prompt would be');
      await typed(p, '5A', 'Figure 7', 'correct', S("Right: 7 groups of 3 on top of the 2 fixed tiles. That's 3n + 2 = 23, so 3n = 21 and n = 7."));
    },
    // 5M: add a group seven times. Before 23 there's no response and 5A waits; at 23, "23 tiles." and the step is done.
    async build(p, mode) {
      const m = step(p, '5M'), totals = [(await m.locator('figcaption').textContent()).trim()];
      let early = 0;
      for (let i = 0; i < 7; i++) {
        if ((await m.locator(':scope > .fb .note').count()) || (await step(p, '5A').count())) early += 1;
        await place(p, mode, piece(p, '5M'), m.locator('.drop'));
        totals.push((await m.locator('figcaption').textContent()).trim());
      }
      ok(same(totals, [2, 5, 8, 11, 14, 17, 20, 23].map(n => `${n} tiles`)) && early === 0, `5M: the running total goes 2, 5, … 23 by ${mode}, and the step isn't done before 23 (got ${JSON.stringify(totals)}, ${early} early)`);
      ok((await feedback(p, '5M')).says.includes(S('23 tiles.')) && (await m.locator('.piece').count()) === 0 && await step(p, '5A').isVisible(), '5M: at 23, "23 tiles." and the step is done');
    },
    async wrong(p) {
      await SCREENS[5].build(p, 'mouse');
      const hint = S('Undo the + 2 first, then the × 3.');
      await typed(p, '5A', '8', 'hint', hint);
      await typed(p, '5A', '23', 'hint', hint);
      ok((await answerCard(p, '5A')) === 'Figure 7', 'Screen 5: second miss shows the answer');
      await typed(p, '5A', '7', 'correct', "Right: 7 groups of 3 on top of the 2 fixed tiles. That's 3n + 2 = 23, so 3n = 21 and n = 7.");
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
      const yes = S("It works for Figure 1, but one figure isn't enough. Try another one.");
      await chose(p, '6A2', 0, 'wrong', yes);
      await chose(p, '6A2', 0, 'wrong', yes);
      ok((await answerCard(p, '6A2')) === 'Maybe\nNo' && (await step(p, '6A2').locator('.choice.is-answer').count()) === 2, '6A2: the second-miss card names both right answers, Maybe and No');
      await chose(p, '6A2', 2, 'correct', S("Right, it's wrong, and the next step shows where. But Figure 1 alone couldn't tell you that. Always try another one."));
      ok(await step(p, '6B').isVisible(), '6A2: "No" leads to Step 6B');
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
      ok((await step(p, '7B·f').count()) === 0, '7B: no follow-up item (removed in round 8)');
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

  // New in round 7 (HANDOFF-ROUND-7 5).
  '7r': {
    async correct(p, mode) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('The rule for the sticks') &&
        (await screenEl(p).locator('.eyebrow').textContent()).trim().toLowerCase() === 'part 2: sticks. two ways to see one rule', 'Screen 9: title, in Part 2');
      const figs = await screenEl(p).locator(':scope > .card svg').evaluateAll(svgs => svgs.map(s => [s.querySelectorAll('line.stick').length, s.querySelectorAll('line.stick.const, line.stick.coef').length]));
      ok(same(figs, [[4, 0], [7, 0], [10, 0], [13, 0]]), `Screen 9: stick Figures 1 to 4, uncoloured (got ${JSON.stringify(figs)})`);
      await checkFigureRows(p, 'Screen 9');
      ok(same(await SCREENS['3t'].table(p), [['Figure n', '1', '2', '3', '4'], ['Sticks', '', '', '', '']]), 'Screen 9: the table starts with Figure n and four empty Sticks boxes');
      await typed(p, '7R1', [4, 7, 10, 13], 'correct', S('Right: 4, 7, 10, 13.'));
      await typed(p, '7R2', '3', 'correct', S('Right. Each new square adds 3 sticks. That 3 is the coefficient.'));
      await typed(p, '7R3', [3, 6], 'correct', S('Right: 3, 6, 9, 12.'));
      ok(same((await SCREENS['3t'].table(p))[2], [NB(S('Skip count by 3')), '', '', '9', '12']), '7R3: the rest of the skip-count row fills in');
      await typed(p, '7R4', [1, 1, 1, 1], 'correct', S('Right. Every figure has exactly 1 more.'));
      ok((await screenEl(p).locator('.comparetable tr').nth(3).locator('td.filled').count()) === 0, '7R4: all four typed; nothing filled in');
      ok((await screenEl(p).locator('[data-step="8C1"]').count()) === 1, 'Screen 9: 8C1 and 8C2 are on this screen');
      await slideTo(p, '8C1', 'Home', mode);
      await typed(p, '8C2', '1', 'correct', S("One lone stick. That's the constant: what's there at Figure 0."));
      ok(same(await lines(p, '7R5'), [S('S is the total number of sticks.')]), '7R5: the line defining S sits above "Type the rule."');
      await typed(p, '7R5', 'S = 3n + 1', 'correct', S('Right: S = 3n + 1.'));
    },
    async wrong(p) {
      await typed(p, '7R1', [4, 8, 12, 16], 'wrong', S('That gives every square its own 4 sticks. Neighbouring squares share one.'));
      await typed(p, '7R1', [4, 7, 10, 12], 'hint', S('Count each stick once, including the ones two squares share.'));
      ok((await answerCard(p, '7R1')) === '4, 7, 10, 13', '7R1: second miss shows the answer');
      await typed(p, '7R1', [4, 7, 10, 13], 'correct', 'Right: 4, 7, 10, 13.');
      await typed(p, '7R2', '4', 'wrong', S('Each new square shares a stick with the square before, so it adds only 3.'));
      await typed(p, '7R2', '5', 'hint', S('Compare Figure 1 and Figure 2: 4 and 7.'));
      ok((await answerCard(p, '7R2')) === '3', '7R2: second miss shows the answer');
      await typed(p, '7R2', '3', 'correct', 'Right. Each new square adds 3 sticks. That 3 is the coefficient.');
      await typed(p, '7R3', [4, 7], 'wrong', S('Those are the sticks. Skip count by 3 on its own: 3, 6, …'));
      await typed(p, '7R3', [2, 4], 'hint', S('Count by 3, the number each figure adds.'));
      ok((await answerCard(p, '7R3')) === '3, 6', '7R3: second miss shows the answer');
      await typed(p, '7R3', [3, 6], 'correct', 'Right: 3, 6, 9, 12.');
      await typed(p, '7R4', [1, 3, 1, 1], 'wrong', S('3 is what each figure adds. Compare the two rows: 4 and 3, then 7 and 6.'), '7R4 with a 3 in one box');
      await typed(p, '7R4', [1, 1, 1, 2], 'hint', S('Subtract in each column: 4 − 3, 7 − 6, 10 − 9, 13 − 12.'));
      ok((await answerCard(p, '7R4')) === '1, 1, 1, 1', '7R4: second miss shows the answer');
      await typed(p, '7R4', [1, 1, 1, 1], 'correct', 'Right. Every figure has exactly 1 more.');
      await slideTo(p, '8C1', 'Home');
      await typed(p, '8C2', '4', 'wrong', S('4 is Figure 1. Take away its three sticks.'));
      await typed(p, '8C2', '2', 'hint', S('At Figure 0 there are no squares. Which stick is still there?'));
      await typed(p, '8C2', '1', 'correct', "One lone stick. That's the constant: what's there at Figure 0.");
      await typed(p, '7R5', '4 + 3n', 'wrong', S("Test it at Figure 1: it gives 7, but Figure 1 has 4 sticks. 4 is Figure 1's total; the constant is what's there at Figure 0."));
      await typed(p, '7R5', '3n', 'wrong', S('Every figure has 1 more than the skip count.'));
      ok((await answerCard(p, '7R5')) === 'S = 3n + 1' && (await whyOpen(p)), '7R5: second miss shows the answer and the Why? text');
      await typed(p, '7R5', '4n', 'wrong', S('Each figure adds 3, not 4.'));
      await typed(p, '7R5', '2n + 1', 'hint', S('Start with the skip count for figure n, then add how many more every figure has.'));
      await typed(p, '7R5', '1 + 3n', 'correct', 'Right: S = 3n + 1.');
    },
    why: S('Each new square adds 3 sticks, so the sticks grow like the skip count by 3: the coefficient is 3. Every figure has 1 more stick than the skip count: the starting stick, there even at Figure 0. That 1 is the constant. So S = 3n + 1.'),
  },

  8: {
    async correct(p, mode) {
      ok(await keptWhole(p, 'S = 4 + 3(n − 1)'), 'Screen 8: "S = 4 + 3(n − 1)" is kept whole');
      const label = await screenEl(p).locator('.gridtable th[scope="row"]').nth(1).evaluate(th => {
        const m = th.querySelector('.math');
        return m && { text: m.textContent, oneLine: m.getClientRects().length === 1 && m.getBoundingClientRect().height <= parseFloat(getComputedStyle(m).lineHeight) * 1.4 };
      });
      ok(label && label.text === 'S = 4 + 3(n − 1)' && label.oneLine, `Screen 8: the row label "S = 4 + 3(n − 1)" is one unit on one line (got ${JSON.stringify(label)})`);
      ok((await screenEl(p).locator('.intro').textContent()).trim() === S('Your rule for the sticks is S = 3n + 1. Another student wrote S = 4 + 3(n − 1). Are these two rules the same?'), 'Screen 10: the new intro');
      ok(same(await lines(p, '8A'), [S('For n = 2: 4 + 3(2 − 1) = 4 + 3 × 1 = 7.')]), '8A: the worked substitution sits above the table');
      const given = await step(p, '8A').locator('[data-given]').evaluateAll(els => els.map(i => ({ value: i.value, disabled: i.disabled, typed: i.hasAttribute('data-input'), label: i.getAttribute('aria-label') })));
      ok(same(given, [{ value: '7', disabled: true, typed: false, label: 'S = 4 + 3(n − 1), n = 2' }]) && (await step(p, '8A').locator('input[data-input]').count()) === 5,
        `8A: the box for S = 4 + 3(n − 1) at n = 2 shows 7, can't be edited and isn't one of the learner's five answers (got ${JSON.stringify(given)})`);
      await typed(p, '8A', [4, 7, 10, 4, 10], 'correct', S('Right. The same values for all three figures.'));
      ok((await step(p, '8B').count()) === 0 && (await screenEl(p).locator('.reminder').count()) === 0, 'Screen 10: no simplification step (cut in round 3)');
      ok(same(await screenEl(p).locator('[data-step]').evaluateAll(els => els.map(e => e.dataset.step)), ['8A']), 'Screen 10: only 8A; 8C1 and 8C2 moved to Screen 9');
    },
    async wrong(p) {
      await typed(p, '8A', [4, 7, 10, 4, 11], 'wrong', S('Work inside the bracket first, then multiply by 3, then add 4.'));
      await typed(p, '8A', [4, 7, 9, 4, 10], 'hint', S('In 3n + 1, multiply n by 3 first, then add 1.'));
      await typed(p, '8A', [4, 7, 10, 4, 10], 'correct', 'Right. The same values for all three figures.');
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
      ok(same(await lines(p, '9B'), [S('To go backwards, take away the constant, then divide by the coefficient.')]), '9B: the method sits above the question');
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
      ok((await step(p, '10E').locator('.frame').textContent()).trim() === S("Arun's 4 is already ___. Then he adds ___ for every square, so ___.") &&
        await step(p, '10E').locator('.frame').evaluate(f => !!(f.compareDocumentPosition(f.parentElement.querySelector('textarea')) & Node.DOCUMENT_POSITION_FOLLOWING)), '10E: the sentence frame sits above the text box');
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

  // New in round 7 (HANDOFF-ROUND-7 7).
  '10p': {
    async correct(p) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('Which rule fits?') &&
        (await screenEl(p).locator('.eyebrow').textContent()).trim() === 'Part 4: Practise', 'Screen 13: title, in the new Part 4, "Practise"');
      ok(same(await SCREENS['10p'].drawn(p, '10P1'), [3, 30, [['Figure n', '1', '2', '3'], ['Tiles', '6', '11', '16']]]), '10P1: Figures 1–3 as 1 fixed tile plus groups of 5, in the two colours, with the table beneath');
      const options = await texts(step(p, '10P1').locator('.choice'));
      ok(same(options, ['T = 6 + 5n', 'T = 5n + 1', 'T = 6n', 'T = n + 5']), `10P1: the four options in order, the right one second (got ${JSON.stringify(options)})`);
      await chose(p, '10P1', 1, 'correct', S("Right: 5 is the coefficient, what each figure adds. 1 is the constant, what's there at Figure 0."));
      ok(same(await SCREENS['10p'].drawn(p, '10P2'), [18, 12, [['Figure n', '1', '2', '3'], ['Tiles', '8', '10', '12']]]), '10P2: Figures 1–3 as 6 fixed tiles plus groups of 2, in the two colours, with the table beneath');
      await typed(p, '10P2', 'T = 2n + 6', 'correct', S('Right: T = 2n + 6. 2 is the coefficient and 6 is the constant.'));
    },
    async wrong(p) {
      await chose(p, '10P1', 0, 'wrong', S("6 is Figure 1's total. The constant is what's there at Figure 0."));
      await chose(p, '10P1', 2, 'wrong', S('Each figure adds 5, not 6. 6n gives 12 at Figure 2, but Figure 2 has 11.'));
      ok((await answerCard(p, '10P1')) === 'T = 5n + 1', '10P1: second miss shows the answer');
      await chose(p, '10P1', 3, 'wrong', S('n + 5 gives 6 at Figure 1, but only 7 at Figure 2. Figure 2 has 11. Each figure adds 5.'));
      await chose(p, '10P1', 1, 'correct', "Right: 5 is the coefficient, what each figure adds. 1 is the constant, what's there at Figure 0.");
      await typed(p, '10P2', '8 + 2n', 'wrong', S("Test it at Figure 1: it gives 10, but Figure 1 has 8. 8 is Figure 1's total; the constant is what's there at Figure 0."));
      await typed(p, '10P2', '2n', 'wrong', S('Every figure also has the 6 fixed tiles.'));
      ok((await answerCard(p, '10P2')) === 'T = 2n + 6' && (await whyOpen(p)), '10P2: second miss shows the answer and the Why? text');
      await typed(p, '10P2', '8n', 'wrong', S('Each figure adds 2, not 8.'));
      await typed(p, '10P2', 'n + 6', 'hint', S("Find what each figure adds, then what's there at Figure 0."));
      await typed(p, '10P2', '6 + 2n', 'correct', 'Right: T = 2n + 6. 2 is the coefficient and 6 is the constant.');
    },
    why: S("Every rule here has two parts: what each figure adds, the coefficient, which multiplies n; and what's there at Figure 0, the constant. Figure 1's total always includes one group, so it is never the constant."),
    drawn: (p, id) => step(p, id).evaluate(el => [el.querySelectorAll('rect.t-const').length, el.querySelectorAll('rect.t-coef').length,
      [...el.querySelectorAll('.comparetable tr')].map(tr => [...tr.cells].map(c => c.textContent.trim()))]),
  },

  15: {
    async correct(p) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('Exit ticket'), 'Exit ticket: titled "Exit ticket"');
      ok((await screenEl(p).locator('.eyebrow').textContent()).trim() === 'Part 5: Exit ticket', 'Exit ticket: in Part 5');
      ok((await screenEl(p).locator('.intro').textContent()).trim() === S("Figures 1, 2 and 3 of a new pattern. Answer on your own; you'll see your results when you submit."), 'Exit ticket: intro');
      ok((await screenEl(p).locator('.card').first().locator('rect.t-const').count()) === 15 && (await screenEl(p).locator('.card').first().locator('rect.t-coef').count()) === 24,
        'Exit ticket: Figures 1–3 drawn as 5 fixed tiles plus groups of 4 (9, 13, 17 tiles)');
      const rows = await screenEl(p).locator('table.extable tr').evaluateAll(trs => trs.map(tr => [...tr.cells].map(c => c.querySelector('input') ? '?' : c.textContent.trim())));
      ok(same(rows, [['Figure n', '1', '2', '3', '4', '5'], ['Tiles', '9', '13', '17', '?', '?'], [NB(S('Skip count by 4')), '4', '8', '?', '?', '?']]), `Exit item 1: the table to complete, its label with a non-breaking space before the 4 (got ${JSON.stringify(rows)})`);
      ok(!(await whyVisible(p)) && (await screenEl(p).locator('.note').count()) === 0, 'Exit ticket: no Why? and no hints before submitting');
      ok(same((await texts(screenEl(p).locator('.item .num'))), ['1.', '2.', '2b.', '3.', '4.']), 'Exit ticket: four numbered questions, with 2b part of question 2');
      ok((await screenEl(p).locator('[data-item="2b"] .q').textContent()).includes(S('What does the constant in the rule count?')), 'Exit item 2b: the question');
      ok(same(await texts(screenEl(p).locator('[data-item="2b"] .choice')), [S('The tiles in Figure 1'), S('The fixed tiles, there even at Figure 0'), S('The tiles added to each new figure')]),
        'Exit item 2b: the three options, the correct one not first');
      await SCREENS[15].submit(p, [[21, 25, 12, 16, 20], '4n + 5', 1, '105', '15']);
      ok((await screenEl(p).locator('.item .okmark').count()) === 5 && (await screenEl(p).locator('.item .note').count()) === 0, 'Exit ticket: all correct, 2b included');
      ok(!(await whyVisible(p)), 'Exit ticket: no Why? after submitting');
    },
    async wrong(p) {
      // An unreadable rule is flagged and nothing is submitted.
      await SCREENS[15].fillAll(p, [[20, 24, 12, 15, 20], 'abc', 0, '100', '14']);
      await screenEl(p).locator('[data-submit]').click();
      ok(same(await texts(screenEl(p).locator('[data-item="2"] .say')), [H('Type a rule using n, such as 2n + 5.')]) && await screenEl(p).locator('[data-item="2"] input').isEnabled(),
        'Exit ticket: an unreadable rule is flagged and the ticket is not submitted');
      await SCREENS[15].submit(p, [[20, 24, 12, 15, 20], '9 + 4n', 0, '100', '14']);
      await SCREENS[15].expect(p, [
        [S('Each figure adds 4 tiles.'), S('Count by 4: 4, 8, 12, …')],
        [S('9 is the total for Figure 1. The constant is the value at Figure 0.')],
        [S("Figure 1 has 9 tiles. The constant is what's there at Figure 0.")],
        [S('You counted the groups. Add the 5 fixed tiles.')],
        [S("Start from the 5 fixed tiles, not Figure 1's 9.")],
      ], 'all wrong');
    },
    // vals: [table blanks, rule, 2b option index, Figure 25, the figure with 65 tiles]
    async fillAll(p, [table, rule, choice2b, fig25, fig65]) {
      const tableInputs = screenEl(p).locator('[data-item="1"] input');
      for (let i = 0; i < table.length; i++) await tableInputs.nth(i).fill(String(table[i]));
      for (const [i, v] of [['2', rule], ['3', fig25], ['4', fig65]]) await screenEl(p).locator(`[data-item="${i}"] input`).fill(v);
      await screenEl(p).locator(`[data-item="2b"] [data-choice="${choice2b}"]`).click();
    },
    async submit(p, vals) {
      await SCREENS[15].fillAll(p, vals);
      await screenEl(p).locator('[data-submit]').click();
    },
    // says: one list per item, in order 1, 2, 2b, 3, 4
    async expect(p, says, label) {
      const ids = ['1', '2', '2b', '3', '4'];
      for (let i = 0; i < ids.length; i++) {
        const got = await texts(screenEl(p).locator(`[data-item="${ids[i]}"] .say`));
        ok(same(got, says[i]), `Exit ticket (${label}) item ${ids[i]}: ${says[i].length ? 'responses' : 'right'} ${JSON.stringify(says[i])} (got ${JSON.stringify(got)})`);
      }
    },
  },

  16: {
    async correct(p) {
      ok((await screenEl(p).locator('h1').textContent()).trim() === S('What you showed on your own'), 'Self-check: title');
      const items = await texts(screenEl(p).locator('.checklist li'));
      ok(same(items, [S('Completed the table'), S('Wrote the rule and identified what the constant counts'), S('Found the total for any figure'), S('Found the figure for a given total')]), `Self-check: the four lines in order (got ${JSON.stringify(items)})`);
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
// Round 5: the new title in the browser tab and the header, and the old one nowhere in the lesson file.
async function titleTests(p) {
  section = 'title';
  const title = S('Growing Patterns: Finding the Rule');
  ok((await p.title()) === title, `the browser tab reads "${title}" (got "${await p.title()}")`);
  ok((await p.locator('#brand').textContent()).trim() === title, 'the header reads the new title');
  ok(!read('lesson', 'index.html').includes('Seeing the Rule'), '"Seeing the Rule" appears nowhere in lesson/index.html');
}

async function checkerTests(p) {
  section = 'answer checker';
  const r = await p.evaluate(() => {
    const eq = (a, b) => { const x = parseRule(a), y = parseRule(b); return !!(x && y && isLinear(x) && sameRule(x, y)); };
    const linear = a => { const e = parseRule(a); return e ? isLinear(e) : 'unreadable'; };
    // A non-straight-line rule that matches 3n + 2 at all six test points must still be rejected.
    const sneaky = '3n + 2 + n(n − 1)(n − 2)(n − 3)(n − 7)(2n − 3)';
    const st3B = LESSON.screens.filter(s => s.n === 3).flatMap(s => s.steps).find(s => s.id === 'B');
    return {
      equivalent: [eq('3n + 2', '2 + 3n'), eq('S = 4 + 3(n − 1)', '3n + 1'), eq('3 × n + 1', '3n + 1'), eq('P = 30 + 6(n - 1)', '24 + 6n'), eq('(n + 1)/2', '0.5n + 0.5')],
      notEquivalent: [eq('3n + 2', '5n'), eq('3n + 1', '3n + 3'), eq('7n − 7', '3n + 1')],
      rejected: ['n × n', 'n*n + 1', 'n²', 'n^2', '3/n + 1', 'n(n + 1)', 'n/n', sneaky].map(linear),
      sneakyMatches: sameRule(parseRule(sneaky), parseRule('3n + 2')),
      sneakyJudged: JUDGE.rule(st3B, [sneaky]).kind,
      unparseable: ['', 'n +', '3x + 2', 'abc', '42', 'y = 3n'].map(v => parseRule(v) === null),
      numbers: ['6.5', '6.50', '13 sticks', 'n = 25', 'Figure 7', '−3'].map(parseNumber),
    };
  });
  ok(r.equivalent.every(Boolean), `equivalent straight-line rules match: ${JSON.stringify(r.equivalent)}`);
  ok(r.notEquivalent.every(x => !x), `different rules don't match: ${JSON.stringify(r.notEquivalent)}`);
  ok(r.rejected.every(x => x === false), `n × n, powers of n and n in a denominator are rejected: ${JSON.stringify(r.rejected)}`);
  ok(r.sneakyMatches && r.sneakyJudged === 'hint', `a non-linear rule that matches at every test point is still rejected (${r.sneakyMatches}, ${r.sneakyJudged})`);
  ok(r.unparseable.every(Boolean), `unparseable input is recognized: ${JSON.stringify(r.unparseable)}`);
  ok(same(r.numbers, [6.5, 6.5, 13, 25, 7, -3]), `numbers parse with units: ${JSON.stringify(r.numbers)}`);
}

async function numberTests(p) {
  section = 'computed numbers';
  const n = await p.evaluate(() => ({
    screens: LESSON.screens.length,
    tiles: [0, 1, 2, 3, 4, 7, 10].map(k => tileCount(k)),
    skip: [1, 2, 3, 4, 10].map(k => TILES.group * k),
    exitTiles: [1, 2, 3, 4, 5, 25, 26].map(k => tilesIn(TILES_EXIT, k)),
    practice: [TILES_P1, TILES_P2].map(P => [1, 2, 3].map(k => tilesIn(P, k))),
    stickSkip: [1, 2, 3, 4].map(stickSkip),
    exitSkip: [1, 2, 3, 4, 5].map(k => TILES_EXIT.group * k),
    exit65: solveLinear('4n + 5', 65),
    sticks: [0, 1, 2, 3, 4, 10, 40].map(k => stickCount(k)),
    stickFor100: range(0, 100).find(k => stickCount(k) === 100),
    builds: [[1, 1], [4, 1], [4, 0]].map(([c, g]) => completeSquares(builtEdges(c, g).map(x => x.e))),
  }));
  ok(n.screens === 16, `the lesson has 16 screens (got ${n.screens})`);
  ok(same(n.tiles, [2, 5, 8, 11, 14, 23, 32]) && same(n.skip, [3, 6, 9, 12, 30]), `tiles 2, 5, 8, 11, 14…; skip count 3, 6, 9, 12, and 30 at n = 10`);
  ok(same(n.practice, [[6, 11, 16], [8, 10, 12]]) && same(n.stickSkip, [3, 6, 9, 12]), `practice patterns 6, 11, 16 and 8, 10, 12; the sticks' skip count 3, 6, 9, 12 (round 7)`);
  ok(same(n.exitTiles, [9, 13, 17, 21, 25, 105, 109]) && same(n.exitSkip, [4, 8, 12, 16, 20]) && n.exit65 === 15,
    `exit pattern: 9, 13, 17, 21, 25; Figure 25 = 105, Figure 26 = 109; skip count 4…20; 65 tiles at Figure 15`);
  ok(same(n.sticks, [1, 4, 7, 10, 13, 31, 121]) && n.stickFor100 === 33, `sticks: Figure 10 = 31, Figure 40 = 121, 100 at Figure 33`);
  ok(same(n.builds, [1, 2, 1]), 'builds of 1, 2 and 1 squares');
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
  // Part 4, "Practise", is new in round 7; the others keep their names as written in the spec.
  ok(same(names.map(x => x[0]), ['1', '2', '3', '4', '5']) && names.every(([, name]) => new RegExp(`Part \\d+: ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(SPEC) || TRUTH.includes(`titled **"${name}"**`)),
    `parts are numbered 1 to 5, each with its name as written in the spec or HANDOFF-ROUND-7: ${JSON.stringify(parts)}`);
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
// Round 1 screen numbers in lesson order: '3t' is the table half of Screen 3, '3s' the screen round 6 added after it, 15 the exit ticket.
// '7r' and '10p' are the screens round 7 added: the sticks rule and the practice screen.
// '3b' is round 8's "The rule", after Screen 5.
const ORDER = [2, '3t', '3s', 3, 4, '3b', 5, 6, 7, '7r', 8, 9, 10, '10p', 15, 16];
const pad = n => String(n).padStart(2, '0');

async function correctPath(label, viewport, extra, mode, shots) {
  section = `correct path (${label})`;
  const p = await newPage(viewport, extra);
  for (const [i, n] of ORDER.entries()) {
    const k = i + 1;
    ok((await p.locator('#where').textContent()).trim() === `Screen ${k} of ${ORDER.length}`, `${label}: progress shows Screen ${k} of ${ORDER.length}`);
    if (shots === 'all') await screenshot(p, `${label}-${pad(k)}-start`);
    await SCREENS[n].correct(p, mode);
    if (SCREENS[n].why) {
      await openWhy(p);
      ok((await whyText(p)).includes(SCREENS[n].why), `Screen ${k}: Why? text matches the spec`);
    }
    if (SCREENS[n].extra) await SCREENS[n].extra(p);
    await p.waitForTimeout(500);
    const checks = { overflow: await overflowProblems(p), targets: await smallTargets(p), nulls: await nullText(p), wraps: await wrapProblems(p),
      margin: viewport.width <= 420 ? await marginProblems(p) : [] };
    ok(checks.margin.length === 0, `${label} Screen ${k}: everything fits with ${MARGIN} px to spare, Why? and responses open ${JSON.stringify(checks.margin)}`);
    const header = await headerProblems(p);
    ok(header.length === 0, `${label} Screen ${k}: the header's title and "Screen ${k} of ${ORDER.length}" each fit on one line with ${MARGIN} px to spare ${JSON.stringify(header)}`);
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

async function wrongPath(viewport = PHONE) {
  section = `predicted wrong answers (${viewport.width} px)`;
  const p = await newPage(viewport, CHROMIUM ? { hasTouch: true } : {});
  for (const [i, n] of ORDER.entries()) {
    await SCREENS[n].wrong(p);
    await openWhy(p);
    ok((await nullText(p)).length === 0 && (await wrapProblems(p)).length === 0, `wrong-answer run Screen ${i + 1}: no "null" text and no wrapped expressions`);
    const margin = await marginProblems(p);
    ok(margin.length === 0, `wrong-answer run Screen ${i + 1} at ${viewport.width} px: everything fits with ${MARGIN} px to spare, every response and the Why? open ${JSON.stringify(margin)}`);
    await p.waitForTimeout(300);
    if (CHROMIUM && viewport === PHONE) await screenshot(p, `phone-wrong-${pad(i + 1)}`);
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
// Screen 7's second miss on 7B (neither 40): the answer, and no follow-up item since round 8.
async function screen7FollowUp() {
  section = 'Screen 7: second miss';
  const p = await newPage(PHONE);
  await playTo(p, 7);
  for (const e of ['t3', 'b3', 'v4']) await place(p, 'tap', piece(p, '7A1'), step(p, '7A1').locator(`[data-hit="${e}"]`));
  await typed(p, '7A2', '13', 'correct');
  await typed(p, '7B', '30', 'wrong');
  await typed(p, '7B', '29', 'hint', S('Start from Figure 1, then count how many sticks each new square adds.'));
  ok((await answerCard(p, '7B')) === '31', '7B: second miss shows the answer');
  await typed(p, '7B', '31', 'correct', '1 + 3 × 10 = 31.');
  ok((await step(p, '7B·f').count()) === 0 && await p.locator('#next').isEnabled(), '7B: no follow-up item after the second miss (removed in round 8); Next once 31 is typed');
  ok(p.errors.length === 0, `no console errors ${JSON.stringify(p.errors)}`);
  await p.context().close();
}

// The exit ticket takes one submission, so each other response needs its own run through the lesson.
async function exitRuns() {
  const runs = [
    { label: 'tile row wrong, 9n, 2b adds, 225, 16.25', vals: [[22, 25, 12, 16, 20], '9n', 2, '225', '16.25'], ticks: [false, false, false, false],
      says: [[S('Each figure adds 4 tiles.')], [S('Only 4 tiles repeat in each figure.')], [S('Each figure adds 4. The constant stays the same in every figure.')], [S('Only 4 tiles repeat in each figure.')], [S('Undo the + 5 first, then the × 4.')]] },
    { label: 'skip row wrong, 4n with 2b right, 109, 16', vals: [[21, 25, 12, 16, 24], '4n', 1, '109', '16'], ticks: [false, false, false, false],
      says: [[S('Count by 4: 4, 8, 12, …')], [S('Each figure also has the 5 fixed tiles.')], [], [S("That's Figure 26.")], [S('Solve 4n + 5 = 65.')]] },
    { label: 'non-linear rule, other answers', vals: [[21, 25, 12, 16, 20], 'n × n + 5', 1, '99', '15'], ticks: [true, false, false, true],
      says: [[], [S('How many tiles does each figure add, and how many are there at Figure 0?')], [], [S('Replace n with 25 in T = 4n + 5.')], []] },
    { label: 'one blank wrong, rule right but 2b wrong', vals: [[21, 25, 12, 16, 21], '5 + 4n', 0, '105', 'Figure 15'], ticks: [false, false, true, true],
      says: [[S('Count by 4: 4, 8, 12, …')], [], [S("Figure 1 has 9 tiles. The constant is what's there at Figure 0.")], [], []] },
  ];
  for (const run of runs) {
    section = `exit ticket: ${run.label}`;
    const p = await newPage(PHONE);
    await playTo(p, 15);
    await SCREENS[15].submit(p, run.vals);
    await SCREENS[15].expect(p, run.says, run.label);
    const margin = await marginProblems(p);
    ok(margin.length === 0, `exit ticket responses fit with ${MARGIN} px to spare ${JSON.stringify(margin)}`);
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
  await SCREENS['3t'].correct(p); await next(p);
  await p.click('#back'); await p.click('#back');
  ok((await p.locator('#where').textContent()).includes('Screen 1 of 16'), 'Back twice shows Screen 1');
  ok(await step(p, '2A').locator('input').isDisabled() && (await step(p, '2A').locator('input').inputValue()) === '2', 'Back: earlier answers can be seen but not changed');
  ok(await screenEl(p).locator('.why-btn').isEnabled(), 'Back: the Why? text can still be opened');
  await next(p); await next(p);
  ok((await p.locator('#where').textContent()).includes('Screen 3 of 16') && await step(p, '3S1').locator('input').isEnabled(), 'Next returns to the current screen, still answerable');
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
  await titleTests(p0);
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
    await correctPath('phone-360', NARROW, { hasTouch: true, isMobile: true }, 'tap', false);
  } else {
    // WebKit: touch drags need the Chrome DevTools protocol, so pieces are placed by tap and by mouse drag.
    await correctPath('phone', PHONE, { hasTouch: true, isMobile: true }, 'tap', 'done');
    await correctPath('desktop', DESKTOP, {}, 'mouse', 'done');
    await correctPath('phone-dark', PHONE, { colorScheme: 'dark', hasTouch: true, isMobile: true }, 'tap', false);
    await correctPath('phone-360', NARROW, { hasTouch: true, isMobile: true }, 'tap', false);
  }
  if (!process.env.ONLY) {
  await wrongPath(PHONE);
  await wrongPath(NARROW);
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
