// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-theatre — folio register. an amphitheatre bowl; the stage is the
// flamingos' layered canvas. "They've cut three of four sheets of card in
// different colours and have them situated at different heights. I can't
// tell if the turquise one is moving or not - it seems to be swaying a
// little bit, maybe that's part of it."
// behind the first blue panel: a small wooden boat with two ores.

import { h2i, vnoise, dream, markDream, condense, inDream, signal, setMoveLock, keyDown, narrate } from '../engine.js';

const OTTER_LINE = '“ … and so it is with great pleasure that we introduce the cast of tonight’s dream.”';
const DRINK_LINE = 'This drink is strong.';

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

// the show's clock — set on the first seated frame of the night
let showT0 = null;
let menuOpen = false, menuDone = false, menuClosedT = 0, menuOpenedT = 0;
let standing = false, stairsT0 = null, lastBT = -9;
const cued = {};
function cue(k, line) { if (!cued[k]) { cued[k] = true; narrate(line); } }

const H_STAGE = 2.4;
const OTTER_Z = -14.6;
const GECKO = { x: -7.6, z: 3.2 };
const JACKET_SEAT = { x: 4.8, z: 4.1 };
const MARTINI = { x: -2.6, z: -1.8 };

function box(v, lo, hi, e) {
  return Math.max(0, Math.min(1, Math.min((v - lo) / e, (hi - v) / e)));
}

function heightRaw(x, z) {
  const r = Math.hypot(x, z + 6);
  let h = 0.4 + vnoise(x * 0.07, z * 0.07) * 0.4;
  // terraced rake — the house descends toward the stage
  if (z > -10) h += Math.max(0, Math.floor((z + 10) / 3.2)) * 0.62;
  // the stage platform
  const st = box(x, -17, 17, 2.5) * box(z, -31, -12, 2.5);
  h = Math.max(h, 0.25 + st * (H_STAGE - 0.25));
  // the house walls — a ridge ringing the bowl, falling away outside
  const wr = (r - 40) / 7;
  if (wr > 0) h += 16 * Math.max(0, Math.min(wr, 1) - Math.max(0, (r - 47) / 11));
  return h;
}

// a card sheet — flat grid of cells, '░' edges, '▒' body
function card(x0, x1, z, y0, y1, band, lift) {
  const pts = [];
  for (let x = x0; x <= x1; x += 0.15)
    for (let y = y0; y <= y1; y += 0.14) {
      const edge = x < x0 + 0.16 || x > x1 - 0.16 || y > y1 - 0.15;
      pts.push({ x, bx: x, y, z, ch: edge ? '░' : '▒', band, lift });
    }
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
  for (let x = -17; x <= 17; x += 0.11)
    pts.push({ x, y: 5.65, z: -12.7, ch: '═', band: 2, lift: 0 });
  for (const px of [-17, 17])
    for (let y = H_STAGE; y <= 5.65; y += 0.11)
      pts.push({ x: px, y, z: -12.7, ch: '║', band: 2, lift: 0 });
  // the flamingos' canvas — four sheets, different colours, different heights
  lapis = card(-7.5, -1.2, -20.0, H_STAGE, 5.4, 0, 1);
  pts.push(...lapis);
  pts.push(...card(0.4, 7.2, -23.2, H_STAGE, 4.4, 4, 0));
  pts.push(...card(-4.5, 3.4, -26.4, H_STAGE, 6.0, 5, 0));
  pts.push(...card(-11, -3.8, -28.6, H_STAGE, 5.0, 2, 0));
  // three otters. the left-most is ~1.5 too far and faces outwards slightly
  pts.push(...otter(-3.7, -0.2, true, false));
  pts.push(...otter(0, 0, false, true));
  pts.push(...otter(2.2, 0, false, false));
  // the small wooden boat with two ores, behind the first blue panel
  const bx0 = -6.1;
  for (let i = 0; i <= 16; i++) {
    const u = i / 16;
    const hy = H_STAGE + 0.55 - 0.35 * (1 - Math.pow(2 * u - 1, 2));
    pts.push({
      x: bx0 + u * 3.6, y: hy, z: -21.6,
      ch: i === 0 ? '(' : i === 16 ? ')' : '—', band: 2, lift: 1,
    });
    if (i > 1 && i < 15)
      pts.push({ x: bx0 + u * 3.6, y: hy + 0.16, z: -21.6, ch: '·', band: 2, lift: 0 });
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
  for (let y = 0.15; y <= 0.62; y += 0.15)
    pts.push({ x: GECKO.x, y: gy + y, z: GECKO.z, ch: '▒', band: 2, lift: 0 });
  pts.push({ x: GECKO.x + 0.18, y: gy + 0.5, z: GECKO.z + 0.1, ch: '·', band: 2, lift: 0 }); // snout
  // the top-hat — brim and crown, nodding a reception
  const nod = Math.sin(t * 0.5) > 0.92 ? -0.08 : 0;
  pts.push({ x: GECKO.x - 0.13, y: gy + 0.78 + nod, z: GECKO.z, ch: '—', band: 8, lift: 0 });
  pts.push({ x: GECKO.x + 0.13, y: gy + 0.78 + nod, z: GECKO.z, ch: '—', band: 8, lift: 0 });
  pts.push({ x: GECKO.x, y: gy + 0.95 + nod, z: GECKO.z, ch: '▓', band: 8, lift: 0 });
  // cigar ember + smoke clearing upward
  pts.push({ x: GECKO.x + 0.3, y: gy + 0.42, z: GECKO.z + 0.12, ch: '·', band: 6, lift: 2 });
  for (let i = 0; i < 3; i++) {
    const u = (t * 0.28 + i * 0.75) % 2.4;
    pts.push({
      x: GECKO.x + 0.32 + Math.sin(t * 0.7 + i * 2.1 + u * 2) * 0.18,
      y: gy + 0.55 + u,
      z: GECKO.z + 0.12,
      ch: u > 1.6 ? '·' : ':', band: 9, lift: -1,
    });
  }
  return pts;
}

// madder curtains — the gap breathes with focus; the show draws them wide
function curtains(t, env, gapOverride) {
  const pts = [];
  const gap = gapOverride ?? 4.5 + env.ch.focus * 6;
  for (const side of [-1, 1]) {
    for (let x = gap; x <= 16.6; x += 0.42) {
      const drape = Math.sin(x * 2.7 + side) * 0.12;
      for (let y = H_STAGE; y <= 5.5; y += 0.16) {
        pts.push({ x: side * x, y: y + drape, z: -12.85, ch: y > 5.3 ? '░' : '▓', band: 5, lift: 0 });
      }
    }
  }
  return pts;
}

export default {
  id: 'theatre',
  title: 'the theatre',
  register: 'folio',
  notation: {
    extra: ['…', '’', '“', '”', '/', '\\', 'C', 'E', 'U', 'P', 'D', 'M', 'O', '║', '═', '1', '3', '7', '9', '*'],
  },
  world: {
    far: 220,
    waterLevel: 0,
    islandR: 58,
    center: { x: 0, z: -6 },
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
        // the madder aisle down the rake
        if (Math.abs(wx) < 1.35) { g.band = 5; g.lum *= 0.8; return; }
        // dialogue marks as dust between the seats
        const d = h2i(Math.floor(wx * 2) + 31, Math.floor(wz * 2) + 17);
        if (d < 0.012) { g.letter = true; g.letterSeed = d < 0.004 ? 43 : d < 0.008 ? 45 : 44; }
      }
    },
  },
  spawn: { x: 0, z: 27, yaw: 0 },
  // she looks slightly sad today — waning, haloed, and not quite steady
  sky: { moon: { phase: 0.6, halo: true, waver: 0.2 } },
  beings(t, cam, env) {
    if (!STATIC) STATIC = buildStatic();
    // re-entry (a later fold): the show plays again from the top
    if (t - lastBT > 2.5) {
      showT0 = null; menuOpen = false; menuDone = false; standing = false; stairsT0 = null;
      for (const k of Object.keys(cued)) delete cued[k];
    }
    lastBT = t;
    // the show begins when the night seats you
    const show = inDream();
    if (show && showT0 === null) showT0 = t;
    const st = show ? t - showT0 : -1;

    // the turquise one — is it moving or not; the flamingos' dance turns
    // the doubt up after the menu
    const dancing = menuDone && t - menuClosedT < 9 ? 4 : 1;
    const sw = 0.055 * dancing * (1 + 1.1 * env.ch.crossing);
    for (const p of lapis) p.x = p.bx + sw * Math.sin(t * 0.33 + p.y * 0.55);

    const gapO = show ? Math.min(11, 4.5 + Math.max(0, st - 1.5) * 0.85) : undefined;
    const pts = [...STATIC, ...curtains(t, env, gapO), ...geckoPts(t)];

    if (show) {
      if (st > 2) cue('curtains', "the curtains draw. this time it's three little silver-suit wearing otter's doing the introduction.");
      // * applause ensues *
      if (st > 12 && st < 14) {
        cue('applause', '* applause ensues *');
        for (let i = 0; i < 36; i++) {
          if (h2i(i, Math.floor(t * 7)) < 0.5) continue;
          const ax = -16 + h2i(i, 733) * 32;
          const az = -4 + h2i(i, 734) * 26;
          pts.push({ x: ax, y: heightRaw(ax, az) + 0.6, z: az, ch: '·', band: 4, lift: 1 });
        }
      }
      // the menus get passed out
      if (st > 15.5 && !menuDone && !menuOpen) {
        menuOpen = true; menuOpenedT = t;
        cue('storks', 'the menus get passed out by the storks. clever one that.');
      }
      if (menuOpen && (keyDown('Space') || t - menuOpenedT > 16)) {
        menuOpen = false; menuDone = true; menuClosedT = t;
      }
      if (menuDone) {
        const dw = t - menuClosedT;
        if (dw > 0.5) cue('sip', 'anyways, i take a sip of my reminisces in a martini glass.');
        if (dw > 5) cue('flam', 'the flamingos are coming onto the stage now.');
        if (dw > 9) cue('drink', 'this drink is strong.');
        if (dw > 12.5) cue('drift', 'i can feel myself drifting off now.');
        if (dw > 16) cue('jacket', "i'll pick up my jacket, fold it onto my left arm and get up and walk.");
        // leaving early is the only verb
        if (!standing && (keyDown('KeyW') || keyDown('KeyA') || keyDown('KeyS') || keyDown('KeyD'))) {
          standing = true;
          setMoveLock(null);
        }
      }
      // the gecko at the end of the row, on the way out
      if (standing && Math.hypot(cam.x - GECKO.x, cam.z - GECKO.z) < 3.2) {
        cue('gecko', '" my apologies sir " under my breath in a whisper.');
      }
      // the walk to the stage; the endless stairs begin to float
      if (standing && !stairsT0 && cam.z < -9.5 && Math.abs(cam.x) < 9) {
        stairsT0 = t;
        narrate('i look at the ground as i walk to the stage.');
        narrate('the trumpets blow and the endless stairs begin to float');
      }
      if (stairsT0) {
        const su = Math.min(1, (t - stairsT0) / 2.4);
        const nSteps = Math.floor(su * 9);
        for (let k = 0; k < nSteps; k++) {
          const sy = H_STAGE + 1 + k * 1.1;
          const sz = -13.5 - k * 1.6;
          for (let dx = -0.5; dx <= 0.51; dx += 0.17) {
            pts.push({ x: dx + Math.sin(k * 2.1) * 0.3, y: sy, z: sz, ch: '═', band: 4, lift: 1 });
          }
        }
        const lt = t - stairsT0;
        if (lt > 3) cue('end', 'i reach the end and stare down to the water. 23 meters and 19 feet');
        if (lt > 6) cue('rock', 'i toss a rock below');
        if (lt > 8) cue('splash', "there's never a splash");
        if (lt > 10) cue('leap', 'i take a leap of faith anyways');
        if (lt > 11.5) signal('leapt');
      }
    }
    // the jacket, folded on a seat — only if the cloakroom holds your deposit
    if (dream.jacket === 'stored') {
      const jy = heightRaw(JACKET_SEAT.x, JACKET_SEAT.z);
      if (Math.hypot(cam.x - JACKET_SEAT.x, cam.z - JACKET_SEAT.z) < 3.2) {
        markDream('jacket', 'carried'); // folded onto the left arm
      } else {
        for (const [dx, dy] of [[-0.2, 0.3], [0, 0.34], [0.2, 0.3], [-0.1, 0.18], [0.1, 0.18]])
          pts.push({ x: JACKET_SEAT.x + dx, y: jy + dy, z: JACKET_SEAT.z, ch: '▒', band: 5, lift: 0 });
      }
    }
    // the word which escaped you — found, if fate saw you first
    if (dream.visited.gate) {
      const d = Math.hypot(cam.x - MARTINI.x, cam.z - MARTINI.z);
      if (d < 6) {
        const word = 'Contrarian';
        const n = Math.floor(Math.min(1, (6 - d) / 2.4) * word.length);
        const my = heightRaw(MARTINI.x, MARTINI.z);
        for (let i = 0; i < n; i++)
          pts.push({
            x: MARTINI.x + (i - word.length / 2) * 0.12,
            y: my + 1.5 + (h2i(i * 7, 9) - 0.5) * 0.08,
            z: MARTINI.z, ch: word[i], band: 7, lift: 1,
          });
      }
    }
    // the middle otter's introduction — show-timed in the night, proximity
    // in the lab. signs type, beings condense.
    let rv;
    if (show) rv = st < 5.5 ? 0 : st > 11.5 ? Math.max(0, 1 - (st - 11.5) / 3) : Math.min(1, (st - 5.5) / 4);
    else {
      const od = Math.hypot(cam.x, cam.z - OTTER_Z);
      rv = Math.max(0, Math.min(1, (16 - od) / 6.4));
    }
    pts.push(...condense(OTTER_LINE, 0, 4.35, OTTER_Z, rv, t, 21));
    return pts;
  },
  screen(t, put, dims) {
    if (!menuOpen) return;
    const W = Math.max(...MENU.map((l) => l.length)) + 6;
    const H = MENU.length + 4;
    const c0 = Math.floor((dims.cols - W) / 2);
    const r0 = Math.floor((dims.rows - H) / 2);
    for (let c = 0; c < W; c++) { put(c0 + c, r0, '═', 6, 1); put(c0 + c, r0 + H - 1, '═', 6, 1); }
    for (let r = 0; r < H; r++) { put(c0, r0 + r, '║', 6, 1); put(c0 + W - 1, r0 + r, '║', 6, 1); }
    MENU.forEach((line, li) => {
      const start = c0 + Math.floor((W - line.length) / 2);
      for (let i = 0; i < line.length; i++) {
        if (line[i] === ' ') continue;
        put(start + i, r0 + 2 + li, line[i], 7, 0);
      }
    });
  },
};
