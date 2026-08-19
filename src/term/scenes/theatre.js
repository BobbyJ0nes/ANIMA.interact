// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-theatre — folio register. an amphitheatre bowl; the stage is the
// flamingos' layered canvas. "They've cut three of four sheets of card in
// different colours and have them situated at different heights. I can't
// tell if the turquise one is moving or not - it seems to be swaying a
// little bit, maybe that's part of it."
// behind the first blue panel: a small wooden boat with two ores.
// sources, all 06.06.26.txt — :49 the gaze margin · :51 the otter's memories,
// spoken as written · :54,:57,:59,:63-80 intro/applause/storks/menu ·
// :89,:95,:99 sip, flamingos, drink · :110,:112 drifting off + the jacket ·
// :120 the rerun line · :5 the ledge dangle, trimmed at the clause
// (LEDGE_DANGLE) · :124-147 gecko, stairs, water, rock, leap.
// v2: the left otter answers a held gaze; the menu carries the night's only
// cursor and serves the same drink whatever it rests on; refusing to stand
// reruns the show for as long as you sit; the first step off the ledge
// refuses you and the stairs finish the leap from their end. the one liminal
// coupling: the curtain gap breathes wider as the night deepens.
import {
  h2i, vnoise, dream, markDream, condense, inDream, signal, signals, setMoveLock,
  keyDown, narrate, speak, speakingAt, facing, cardShow, cardHide, choose, liminal,
} from '../engine.js';
const OTTER_LINE = '“ … and so it is with great pleasure that we introduce the cast of tonight’s dream.”';
// his memories, watched with him — the entry's own prose, spoken as written
const OTTER_MEM = [
  'He misses her much.',
  'He’s remembering the night she met him under the apple tree two streams away from his favourite fishing spot, they always met there on nights like this.',
  'He’s not really a big reader, but when he sees her - he feels inspired to start after watching her read the stars for some time.',
];
// the entry's own dangle, trimmed at the clause (that sentence goes on to a
// dragon — another paragraph). null runs the ledge's refusal silent.
const LEDGE_DANGLE = 'i close my eyes as my feet dangle';
const LET = 'abcdefghijklmnopqrstuvwxyz';
// the menu — passed out by the storks; the one earned full-frame text
const MENU = [
  'Entree',
  '',
  'Un petit larme sure une bisque',
  'de ’l’embrace de ma mere’',
  '',
  'Main',
  '',
  'Parsnips cut extra short',
  '',
  'Desert',
  '',
  'Sahara.',
  '(recommended pairing: Mirage 73,',
  'served next to the rock-pool)',
  '',
  'Catch of the evening:',
  '',
  'The word which escaped you in that',
  'conversation from the morning.',
  'Served with crude-tons',
];
// the four courses and the one drink they all serve: the order only decides
// which side it comes from, how long it is held out, and how much of it is
// still letters when it lands.
const COURSE = [
  { row: 0, k: 'entree', side: -1, hold: 1.2, shim: 3 },
  { row: 5, k: 'main', side: 1, hold: 2.8, shim: 2 },
  { row: 9, k: 'desert', side: 1, hold: 4.6, shim: 0 },
  { row: 15, k: 'catch', side: -1, hold: 0.6, shim: 6 },
];
const DECIDED = { k: 'none', side: 0, hold: 2.2, shim: 1 }; // nobody ordered; they did
// the show's clock — set on the first seated frame of the night
let showT0 = null, loopT0 = 0, lastBT = -9;
let menuOpen = false, menuDone = false, menuClosedT = 0, menuOpenedT = 0;
let cursor = 0, adHeld = false, menuLines = null, order = null, leaveRec = null;
let gazeT = 0, gazeSeenT = 0, gazeSaid = false;
let standing = false, stairsT0 = null, ledge = null;
const cued = {};
function cue(k, line) { if (!cued[k]) { cued[k] = true; narrate(line); } }
const H_STAGE = 2.4;
const OTTER_Z = -14.6, OTTER_X = -3.7; // the left-most one, staring away
const GECKO = { x: -7.6, z: 3.2 };
const JACKET_SEAT = { x: 4.8, z: 4.1 };
const MARTINI = { x: -2.6, z: -1.8 };
const box = (v, lo, hi, e) => Math.max(0, Math.min(1, Math.min((v - lo) / e, (hi - v) / e)));

function heightRaw(x, z) {
  const r = Math.hypot(x, z + 6);
  let h = 0.4 + vnoise(x * 0.07, z * 0.07) * 0.4;
  if (z > -10) h += Math.max(0, Math.floor((z + 10) / 3.2)) * 0.62; // the rake
  const st = box(x, -17, 17, 2.5) * box(z, -31, -12, 2.5);          // the stage
  h = Math.max(h, 0.25 + st * (H_STAGE - 0.25));
  const wr = (r - 40) / 7;  // the house walls ring the bowl, falling away outside
  if (wr > 0) h += 16 * Math.max(0, Math.min(wr, 1) - Math.max(0, (r - 47) / 11));
  return h;
}

// a card sheet — flat grid of cells, '░' edges, '▒' body
function card(x0, x1, z, y0, y1, band, lift) {
  const pts = [];
  for (let x = x0; x <= x1; x += 0.15)
    for (let y = y0; y <= y1; y += 0.14)
      pts.push({ x, bx: x, y, z, ch: (x < x0 + 0.16 || x > x1 - 0.16 || y > y1 - 0.15) ? '░' : '▒', band, lift });
  return pts;
}

// a silver-suit otter — small capsule, '▓' head
function otter(cx, headOut, glint, hanker) {
  const pts = [];
  for (const dx of [-0.09, 0.09])
    for (let y = H_STAGE; y <= H_STAGE + 1.0; y += 0.1)
      pts.push({ x: cx + dx, y, z: OTTER_Z, ch: '▒', band: 7, lift: 0 });
  pts.push({ x: cx + headOut, y: H_STAGE + 1.14, z: OTTER_Z, ch: '▓', band: 7, lift: 1 });
  // the glint in the glare on his beady eyes — watching someone not in the crowd
  if (glint) pts.push({ x: cx + headOut - 0.3, y: H_STAGE + 1.14, z: OTTER_Z - 0.02, ch: '·', band: 9, lift: 2 });
  // a red hanker-chief folded into his breast pocket
  if (hanker) pts.push({ x: cx + 0.16, y: H_STAGE + 0.72, z: OTTER_Z - 0.02, ch: '·', band: 5, lift: 2 });
  return pts;
}

let STATIC = null;
let lapis = null; // the first blue panel — the one that might be moving

function buildStatic() {
  const pts = [];
  // proscenium — beam and posts the curtains hang from
  for (let x = -17; x <= 17; x += 0.11) pts.push({ x, y: 5.65, z: -12.7, ch: '═', band: 2, lift: 0 });
  for (const px of [-17, 17])
    for (let y = H_STAGE; y <= 5.65; y += 0.11) pts.push({ x: px, y, z: -12.7, ch: '║', band: 2, lift: 0 });
  // the flamingos' canvas — four sheets, different colours, different heights
  lapis = card(-7.5, -1.2, -20.0, H_STAGE, 5.4, 0, 1);
  pts.push(...lapis, ...card(0.4, 7.2, -23.2, H_STAGE, 4.4, 4, 0));
  pts.push(...card(-4.5, 3.4, -26.4, H_STAGE, 6.0, 5, 0), ...card(-11, -3.8, -28.6, H_STAGE, 5.0, 2, 0));
  // three otters. the left-most is ~1.5 too far and faces outwards slightly
  pts.push(...otter(OTTER_X, -0.2, true, false), ...otter(0, 0, false, true), ...otter(2.2, 0, false, false));
  // the small wooden boat with two ores, behind the first blue panel
  const bx0 = -6.1;
  for (let i = 0; i <= 16; i++) {
    const u = i / 16, hy = H_STAGE + 0.55 - 0.35 * (1 - Math.pow(2 * u - 1, 2));
    pts.push({ x: bx0 + u * 3.6, y: hy, z: -21.6, ch: i === 0 ? '(' : i === 16 ? ')' : '—', band: 2, lift: 1 });
    if (i > 1 && i < 15) pts.push({ x: bx0 + u * 3.6, y: hy + 0.16, z: -21.6, ch: '·', band: 2, lift: 0 });
  }
  for (let y = 0; y <= 0.9; y += 0.15)
    pts.push({ x: bx0 + 1.8, y: H_STAGE + 0.7 + y, z: -21.6, ch: '│', band: 2, lift: 1 });
  pts.push({ x: bx0 + 0.6, y: H_STAGE + 0.5, z: -21.3, ch: '\\', band: 2, lift: 1 });
  pts.push({ x: bx0 + 3.0, y: H_STAGE + 0.5, z: -21.3, ch: '/', band: 2, lift: 1 });
  return pts;
}

// the gecko with a top-hat, at the end of the row — his cigar never goes out
function geckoPts(t) {
  const gy = heightRaw(GECKO.x, GECKO.z);
  const pts = [];
  for (let y = 0.15; y <= 0.62; y += 0.15) pts.push({ x: GECKO.x, y: gy + y, z: GECKO.z, ch: '▒', band: 2, lift: 0 });
  pts.push({ x: GECKO.x + 0.18, y: gy + 0.5, z: GECKO.z + 0.1, ch: '·', band: 2, lift: 0 }); // snout
  const nod = Math.sin(t * 0.5) > 0.92 ? -0.08 : 0; // the top-hat nods a reception
  pts.push({ x: GECKO.x - 0.13, y: gy + 0.78 + nod, z: GECKO.z, ch: '—', band: 8, lift: 0 });
  pts.push({ x: GECKO.x + 0.13, y: gy + 0.78 + nod, z: GECKO.z, ch: '—', band: 8, lift: 0 });
  pts.push({ x: GECKO.x, y: gy + 0.95 + nod, z: GECKO.z, ch: '▓', band: 8, lift: 0 });
  pts.push({ x: GECKO.x + 0.3, y: gy + 0.42, z: GECKO.z + 0.12, ch: '·', band: 6, lift: 2 }); // the ember
  for (let i = 0; i < 3; i++) { // and the smoke, clearing upward
    const u = (t * 0.28 + i * 0.75) % 2.4;
    const x = GECKO.x + 0.32 + Math.sin(t * 0.7 + i * 2.1 + u * 2) * 0.18;
    pts.push({ x, y: gy + 0.55 + u, z: GECKO.z + 0.12, ch: u > 1.6 ? '·' : ':', band: 9, lift: -1 });
  }
  return pts;
}

// madder curtains — the gap breathes with focus, the show draws them wide,
// and the night's own deepening opens them a little further still
function curtains(t, env, gapOverride) {
  const pts = [];
  const gap = (gapOverride ?? 4.5 + env.ch.focus * 6) + 2.2 * liminal();
  for (const side of [-1, 1])
    for (let x = gap; x <= 16.6; x += 0.42) {
      const drape = Math.sin(x * 2.7 + side) * 0.12;
      for (let y = H_STAGE; y <= 5.5; y += 0.16)
        pts.push({ x: side * x, y: y + drape, z: -12.85, ch: y > 5.3 ? '░' : '▓', band: 5, lift: 0 });
    }
  return pts;
}

// the cursor — the night's only one. it moves; the drink does not change.
function paintCursor() {
  for (let i = 0; i < COURSE.length; i++)
    menuLines[COURSE[i].row] = (i === cursor ? '▸ ' : '  ') + MENU[COURSE[i].row];
}

// the drink the menu always serves: reminisces in a Martini glass. a stork
// carries it in from the ordered side, holds it out as long as that course
// is worth, then sets it down where the word will land later.
function drinkPts(t) {
  if (!order) return [];
  const u = t - menuClosedT, gy = heightRaw(MARTINI.x, MARTINI.z);
  const done = Math.max(0, u - 2.2 - order.hold);            // held out, then set down
  const off = 1.5 + 7 * ((1 - Math.min(1, u / 2.2)) + Math.min(1, done / 1.8));
  const away = Math.min(1, done / 1.8), set = Math.min(1, done / 0.7);
  const sx = MARTINI.x + order.side * off, sz = MARTINI.z - (order.side ? 0 : off);
  const gx = MARTINI.x + (1 - set) * (sx - MARTINI.x) * 0.3;
  const gz = MARTINI.z + (1 - set) * (sz - MARTINI.z) * 0.3, gyy = gy + 0.55 + (1 - set) * 0.95;
  const pts = [];
  if (away < 1) { // the stork — long legs, a folded neck, the beak held out
    for (let y = 0; y <= 1.05; y += 0.13) {
      pts.push({ x: sx - 0.06, y: gy + y, z: sz, ch: '│', band: 4, lift: 0 });
      pts.push({ x: sx + 0.06, y: gy + y, z: sz + 0.06, ch: '│', band: 4, lift: 0 });
    }
    for (let y = 1.12; y <= 1.62; y += 0.12)
      pts.push({ x: sx, y: gy + y, z: sz, ch: y < 1.3 ? '▒' : '│', band: 4, lift: 1 });
    pts.push({ x: sx + (Math.sign(MARTINI.x - sx) || 1) * 0.09, y: gy + 1.7, z: sz, ch: '—', band: 4, lift: 1 });
  }
  pts.push({ x: gx - 0.07, y: gyy + 0.26, z: gz, ch: '\\', band: 7, lift: 1 },
    { x: gx + 0.07, y: gyy + 0.26, z: gz, ch: '/', band: 7, lift: 1 },
    { x: gx, y: gyy + 0.13, z: gz, ch: '│', band: 7, lift: 1 },
    { x: gx, y: gyy, z: gz, ch: '—', band: 7, lift: 1 });
  for (let i = 0; i < order.shim; i++) { // the reminisces, still rising as letters
    const v = (t * 0.35 + i * 0.41) % 1;
    const x = gx + Math.sin(t * 0.9 + i * 2.2) * 0.18;
    pts.push({ x, y: gyy + 0.36 + v * 0.8, z: gz, ch: LET[(i * 7 + Math.floor(t * 0.4)) % 26], band: 7, lift: v > 0.62 ? -1 : 1 });
  }
  return pts;
}

export default {
  id: 'theatre',
  title: 'the theatre',
  register: 'folio',
  // every char the show emits — the menu's capitals, the cursor, his memories
  notation: { extra: ['…', '’', '“', '”', '/', '\\', 'C', 'E', 'U', 'P', 'D', 'M', 'O', 'H', '▸', '║', '═', '1', '3', '7', '9', '*'] },
  world: {
    far: 220, waterLevel: 0, islandR: 58, center: { x: 0, z: -6 },
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t, env) {
      const r = Math.hypot(wx, wz + 6);
      if (r > 39) { g.band = 3; g.lum *= 0.85; return; }
      // the stage — gold boards, footlights, spark in the lamps
      if (hS > 2.0 && wz < -11.5 && wz > -32 && Math.abs(wx) < 18) {
        g.band = 6;
        g.lum += 0.1 + env.ch.spark * 0.06 * Math.sin(t * 11 + wx * 2.1);
        if (wz > -14.4 && wz < -13.5) g.lum += 0.18;
        return;
      }
      if (wz > -10) {
        if (Math.abs(wx) < 1.35) { g.band = 5; g.lum *= 0.8; return; } // the aisle
        const d = h2i(Math.floor(wx * 2) + 31, Math.floor(wz * 2) + 17); // dialogue dust
        if (d < 0.012) { g.letter = true; g.letterSeed = d < 0.004 ? 43 : d < 0.008 ? 45 : 44; }
      }
    },
  },
  spawn: { x: 0, z: 27, yaw: 0 },
  // she looks slightly sad today — waning, haloed, and not quite steady
  sky: { moon: { phase: 0.6, halo: true, waver: 0.2 } },
  beings(t, cam, env) {
    if (!STATIC) STATIC = buildStatic();
    const dtF = Math.min(0.06, Math.max(0, t - lastBT));
    // re-entry (a later fold): the show plays again from the top
    if (t - lastBT > 2.5) {
      showT0 = null; menuOpen = false; menuDone = false; standing = false;
      stairsT0 = null; ledge = null; order = null; leaveRec = null; cursor = 0;
      gazeT = 0; gazeSeenT = 0; gazeSaid = false;
      for (const k of Object.keys(cued)) delete cued[k];
    }
    lastBT = t;
    // the show begins when the night seats you
    const show = inDream();
    if (show && showT0 === null) showT0 = t;
    const st = show ? t - showT0 : -1;
    const lt = stairsT0 === null ? -1 : t - stairsT0;
    const heldBreath = lt > 4.2 && lt < 9.8; // the ledge refuses; the world stills
    // the turquise one — is it moving or not; the flamingos' dance turns the
    // doubt up after the menu, and again at every rerun
    if (!heldBreath) {
      const sw = 0.055 * (menuDone && t - loopT0 < 9 ? 4 : 1) * (1 + 1.1 * env.ch.crossing);
      for (const p of lapis) p.x = p.bx + sw * Math.sin(t * 0.33 + p.y * 0.55);
    }
    const gapO = show ? Math.min(11, 4.5 + Math.max(0, st - 1.5) * 0.85) : undefined;
    const pts = [...STATIC, ...curtains(t, env, gapO), ...geckoPts(t), ...drinkPts(t)];
    // the gaze-witness — "I study the glint in the glare on his beady eyes
    // and watch the memories with him." attention is the only key it takes.
    if (!gazeSaid && !standing) {
      const od = Math.hypot(cam.x - OTTER_X, cam.z - OTTER_Z);
      if (od < 26 && facing(OTTER_X, OTTER_Z, 0.12)) gazeT += dtF; else gazeT = Math.max(0, gazeT - dtF * 0.8);
      if (gazeT > 3 && !gazeSeenT) { gazeSeenT = t; narrate('i study the glint in the glare on his beady eyes and watch the memories with him.'); }
      if (gazeSeenT && t - gazeSeenT > 5.2) {
        gazeSaid = true;
        speak(OTTER_MEM.map((text) => ({ text, at: { x: OTTER_X, z: OTTER_Z, radius: 26 }, hold: 1.4 })));
      }
    }
    if (speakingAt()?.x === OTTER_X) // whose letters are in the air: his
      for (let i = 0; i < 4; i++) {
        const v = (t * 0.22 + i * 0.29) % 1;
        pts.push({ x: OTTER_X - 0.3 + Math.sin(t * 0.5 + i * 2.4) * 0.5, y: H_STAGE + 1.4 + v * 1.5, z: OTTER_Z + 0.4, ch: LET[(i * 5 + Math.floor(t * 0.3)) % 26], band: 9, lift: v > 0.7 ? -1 : 1 });
      }
    if (show) {
      if (st > 2) cue('curtains', "the curtains draw. this time it's three little silver-suit wearing otter's doing the introduction.");
      if (st > 12 && st < 14) { // * applause ensues *
        cue('applause', '* applause ensues *');
        for (let i = 0; i < 36; i++) {
          if (h2i(i, Math.floor(t * 7)) < 0.5) continue;
          const ax = -16 + h2i(i, 733) * 32, az = -4 + h2i(i, 734) * 26;
          pts.push({ x: ax, y: heightRaw(ax, az) + 0.6, z: az, ch: '·', band: 4, lift: 1 });
        }
      }
      // the menus get passed out — handed objects arrive whole
      if (st > 15.5 && !menuDone && !menuOpen) {
        menuOpen = true; menuOpenedT = t; cursor = 0;
        menuLines = MENU.slice(); paintCursor(); cardShow(menuLines, 'menu');
        cue('storks', 'the menus get passed out by the storks. clever one that.');
      }
      if (menuOpen) {
        // the cursor: A/D across the courses, Space accepts. it exists in
        // order not to matter — the same drink comes whichever it rests on.
        const d = (keyDown('KeyD') ? 1 : 0) - (keyDown('KeyA') ? 1 : 0);
        if (d && !adHeld) { cursor = (cursor + d + COURSE.length) % COURSE.length; paintCursor(); }
        adHeld = !!d;
        if (signals.menuClosed) {          // Space — a witnessed order
          signals.menuClosed = false; order = COURSE[cursor]; choose('menu', order.k);
        } else if (t - menuOpenedT > 16) { cardHide(); order = DECIDED; } // nobody ordered; nothing is read
        if (order) { menuOpen = false; menuDone = true; menuClosedT = t; loopT0 = t; }
      }
      if (menuDone) {
        const dw = t - loopT0;
        if (dw > 0.5) cue('sip', 'anyways, i take a sip of my reminisces in a martini glass.');
        if (dw > 5) cue('flam', 'the flamingos are coming onto the stage now.');
        if (dw > 9) cue('drink', 'this drink is strong.');
        if (dw > 12.5) cue('drift', 'i can feel myself drifting off now.');
        if (dw > 16) cue('jacket', "i'll pick up my jacket, fold it onto my left arm and get up and walk.");
        if (!standing && dw > 21) { // refusing to stand: the night plays it again
          if (!leaveRec) { leaveRec = 'sat-rerun'; choose('leave', 'sat-rerun'); }
          narrate("the show was great, besides i've seen it before.");
          loopT0 = t;
          for (const k of ['flam', 'drink', 'drift', 'jacket']) delete cued[k];
        }
        // leaving is the only verb, and it is allowed from the first cue
        if (!standing && (keyDown('KeyW') || keyDown('KeyA') || keyDown('KeyS') || keyDown('KeyD'))) {
          standing = true; setMoveLock(null);
          if (!leaveRec) { leaveRec = 'stood-early'; choose('leave', 'stood-early'); }
        }
        // the unregistered black cat, three rows over, not looking at you
        const cu = (t - menuClosedT - 4) / 7;
        if (dream.chosen?.cats === 'unregistered' && cu > 0 && cu < 1) {
          const cz = 12 - cu * 20, cx = 1.55 + Math.sin(cu * 9) * 0.12, cy = heightRaw(cx, cz);
          pts.push({ x: cx, y: cy + 0.18, z: cz, ch: '█', band: 8, lift: 0 },
            { x: cx, y: cy + 0.18, z: cz + 0.13, ch: '█', band: 8, lift: 0 },
            { x: cx, y: cy + 0.42, z: cz - 0.24, ch: '▓', band: 8, lift: 0 },
            { x: cx + 0.09, y: cy + 0.56, z: cz - 0.24, ch: ',', band: 8, lift: 0 },
            { x: cx - 0.09, y: cy + 0.56, z: cz - 0.24, ch: ',', band: 8, lift: 0 }); // no glint: she does not look at you
        }
      }
      // the gecko at the end of the row, on the way out
      if (standing && Math.hypot(cam.x - GECKO.x, cam.z - GECKO.z) < 3.2)
        cue('gecko', '" my apologies sir " under my breath in a whisper.');
      // the walk to the stage; the endless stairs begin to float
      if (standing && !stairsT0 && cam.z < -9.5 && Math.abs(cam.x) < 9) {
        stairsT0 = t;
        ledge = { x: cam.x, z: cam.z, y: Math.max(heightRaw(cam.x, cam.z), 0) };
        narrate('i look at the ground as i walk to the stage.');
        narrate('the trumpets blow and the endless stairs begin to float');
      }
      if (stairsT0) {
        for (let k = 0; k < Math.floor(Math.min(1, lt / 2.4) * 9); k++)
          for (let dx = -0.5; dx <= 0.51; dx += 0.17)
            pts.push({ x: dx + Math.sin(k * 2.1) * 0.3, y: H_STAGE + 1 + k * 1.1, z: -13.5 - k * 1.6, ch: '═', band: 4, lift: 1 });
        if (lt > 3) cue('end', 'i reach the end and stare down to the water. 23 meters and 19 feet');
        // the first step off refuses you: the body drops below the lip and
        // hangs, and nothing in the world moves while it does
        if (heldBreath) {
          cam.buoy = -1.25 * Math.min(1, (lt - 4.2) / 1.3) * Math.min(1, (9.8 - lt) / 0.9);
          cam.pitch += (-0.3 - cam.pitch) * 0.04; // and the eyes go down with it
          if (lt > 4.7 && LEDGE_DANGLE) cue('dangle', LEDGE_DANGLE);
        }
        if (lt > 6.6) cue('rock', 'i toss a rock below');
        if (lt > 8.8) cue('splash', "there's never a splash");
        // then the stairs finish it from their end — step after step out of
        // the dark, until the last one is under you
        if (lt > 10.2 && ledge) {
          const cu = Math.min(1, (lt - 10.2) / 5);
          for (let j = 0; j < Math.floor(cu * 7); j++) {
            const v = 1 - j / 7, ny = ledge.y + 0.4, nz = ledge.z - 2.2; // v=1 far, 0 at your feet
            const px = ledge.x + (0.3 - ledge.x) * v, py = ny + (7.8 - ny) * v, pz = nz + (-19.9 - nz) * v;
            for (let dx = -0.5; dx <= 0.51; dx += 0.17)
              pts.push({ x: px + dx, y: py, z: pz, ch: '═', band: 4, lift: 1 });
          }
          if (lt > 13.6) cue('leap', 'i take a leap of faith anyways');
          if (cu >= 1) signal('leapt');
        }
      }
    }
    // the jacket, folded on a seat — only if the cloakroom holds your deposit
    if (dream.jacket === 'stored') {
      const jy = heightRaw(JACKET_SEAT.x, JACKET_SEAT.z);
      if (Math.hypot(cam.x - JACKET_SEAT.x, cam.z - JACKET_SEAT.z) < 3.2) markDream('jacket', 'carried');
      else for (const [dx, dy] of [[-0.2, 0.3], [0, 0.34], [0.2, 0.3], [-0.1, 0.18], [0.1, 0.18]])
        pts.push({ x: JACKET_SEAT.x + dx, y: jy + dy, z: JACKET_SEAT.z, ch: '▒', band: 5, lift: 0 });
    }
    // the word which escaped you — found, if fate saw you first
    const md = Math.hypot(cam.x - MARTINI.x, cam.z - MARTINI.z);
    if (dream.visited.gate && md < 6) {
      const word = 'Contrarian', my = heightRaw(MARTINI.x, MARTINI.z);
      const n = Math.floor(Math.min(1, (6 - md) / 2.4) * word.length);
      for (let i = 0; i < n; i++)
        pts.push({ x: MARTINI.x + (i - word.length / 2) * 0.12, y: my + 1.5 + (h2i(i * 7, 9) - 0.5) * 0.08, z: MARTINI.z, ch: word[i], band: 7, lift: 1 });
    }
    // the middle otter's introduction — show-timed in the night, proximity in
    // the lab. signs type, beings condense.
    let rv;
    if (show) rv = st < 5.5 ? 0 : st > 11.5 ? Math.max(0, 1 - (st - 11.5) / 3) : Math.min(1, (st - 5.5) / 4);
    else rv = Math.max(0, Math.min(1, (16 - Math.hypot(cam.x, cam.z - OTTER_Z)) / 6.4));
    pts.push(...condense(OTTER_LINE, 0, 4.35, OTTER_Z, rv, t, 21));
    return pts;
  },
};
