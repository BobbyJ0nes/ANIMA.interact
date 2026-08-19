// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// fate-at-the-gate — the reference scene. night register, default notation.
//
// v2 — her whole exchange, excavated. the entry stages six beats; v1 played
// three. nothing here is invented; the unplayed middle was already written.
// i idle: she writes with no pen, the letters give out short of the page ·
// ii notice: the column's bright edge turns, the unfinished letter held aloft
// · iii greeting: the margin's lines, the question, then her answer spoken
// while her letters lift · iv payment: the tongue-tip arcs to her grip, she
// writes with it, the card arrives whole · v refusal: his line cannot be
// said, so it condenses at mouth-height and never settles · vi scold: her
// head flares and the fog flares with her (this scene's ONE liminal
// coupling — gains only, deepened by the dial). the faded hand extends
// mid-exchange; declining is real and absorbed — NOTHING waits on it.
//
// display lines, cited — `98 - Journal/06.06.26.txt`
//   :3 the opening underfoot · :5 the moss · :9,10 margin greeting ·
//   :12 the question (the director asks it on a fold return — night.js —
//   so this scene only asks at fold 0) · :13,14 her spoken lines ·
//   :16 margin, the payment · :17 the card she writes · :19 the refusal,
//   unsayable · :20 the eyes told it · :22 her scold · :26,33 pass + trail
// CROSS-ENTRY — read in their own paragraphs, one moment each, FLAGGED FOR
// BOBBY'S VETO: empty the constant and the line goes silent, mechanics stand.
//   17.08.26.txt:14  XE_DECLINE — trimmed at the clause (flag the trim)
//   2026-04-10.md:31 XE_FOLD2   — her line at the second fold
//   20.07.26.txt:15  XE_FOLD3   — the pass arriving unpaid

import {
  h2i, vnoise, dream, markDream, condense, onWater, signal, narrate,
  speak, speaking, speakingAt, cardShow, cardHide, cardActive, choose, liminal,
} from '../engine.js';
import { makeWake } from './lib/wake.js';
import { makeNarrator } from './lib/narrator.js';
import { makeHand } from './lib/hand.js';

const HILL = { x: 0, z: -220, amp: 26, r: 70 };
const GATE = { x: 0, z: -10 };
const FATE = { x: 2.6, z: -9.2 };
const GRIP = { x: FATE.x + 1.02, y: 1.68, z: FATE.z - 0.06 };
const HAND = { x: FATE.x + 0.95, y: 1.98, z: FATE.z + 1.2 };
const AT = { x: FATE.x, z: FATE.z, radius: 18 };

// her voice — the entry's quoted dialogue, verbatim
const LINE1 = "We're all here and gone and gone again.";
const LINE2 = "What's the date my child? Matter of fact, have you got a pen?";
const CARD = "'jack of all trades, with an Ace up your sleeve'";
const UNSAID = "I don't want those ones anymore"; // never typed — it can't be
const PASS_TEXT = '1 visitors pass to Tomorrow';

// the margin — verbatim, lowercased into the ambient alphabet (convention)
const M_GREET1 = "fate greets me at the gate. it's been some time since we last met - she's growing old.";
const M_GREET2 = "her cold glare doesn't cut me anymore.";
const M_ASK = 'why was i here again?';
const M_PAY = 'i pass her the tip of my tongue to write my cards';
const M_EYES = "i couldn't actually say it without my tongue, but my eyes told it anyways.";
const M_SCOLD = "her's scolded me in response.";
const M_PASS = "'1 visitors pass to tomorrow'";
const M_TRAIL = 'follow the glowing mushrooms to the cloakroom where you can store your memories for the journey.';

// cross-entry, flagged — delete the string, keep the mechanic
const XE_DECLINE = 'every time a faded hand extends itself to me, for some reason i decline';
const XE_FOLD2 = "Many time a do over. how many times til it's done right ?";
const XE_FOLD3 = 'the roulette table wobbles, someone paid off destiny -';

// "The moss on the stones to my right whisper of the silent night."
// the moss murmurs single letters of its own line — words never assemble.
// the stones nearest her hold their tongue: the silent night is hers.
const MOSS_LINE = 'The moss on the stones to my right whisper of the silent night.';
const WA = "abcdefghijklmnopqrstuvwxyzWGFTSAI0682.,:;·-—'\"()";
const MOSS_SEEDS = [...MOSS_LINE].filter((c) => c !== ' ' && WA.indexOf(c) >= 0)
  .map((c) => WA.indexOf(c));
const STONES = [
  { x: 4.6, z: 7.2 }, { x: 6.3, z: 3.1 }, { x: 5.2, z: -0.8 },
  { x: 7.4, z: -4.6 }, { x: 4.9, z: -7.9 },
].map((s) => ({ ...s, quiet: Math.hypot(s.x - FATE.x, s.z - FATE.z) < 6 }));

const wake = makeWake();

// the approach carries the writing's opening — the narrator is the path
const OPENING =
  "A wise man once told me to never look Eagle's in the eye. Fly high over " +
  'the mountain tops amongst the clouds. Soft silk in the cottage on the ' +
  'river ferry. The ripples on the water shines, and the light dances on ' +
  'the top. Crops, trimmed and ready. Diamond tipped pencil on some lined paper.';
const PATH_POLY = [];
for (let z = 20; z >= -9; z -= 3.5) PATH_POLY.push({ x: pathOffset(z), z });
const narrator = makeNarrator(OPENING, PATH_POLY);

// the glowing mushrooms — the pass's own instruction, leading west out of
// the meadow toward the cloakroom
const MUSH_G = [];
for (let i = 0; i < 10; i++) {
  MUSH_G.push({ x: -3.5 - i * 3.1, z: -10 + Math.sin(i * 0.9) * 2.6 + i * 0.3 });
}
const TRAIL_END = MUSH_G[MUSH_G.length - 1];

function typeset(text, x, y, z, reveal) {
  const pts = [];
  const n = Math.floor(Math.max(0, Math.min(1, reveal)) * text.length);
  for (let i = 0; i < n; i++) {
    if (text[i] === ' ') continue;
    pts.push({ x: x + (i - text.length / 2) * 0.12, y: y + (h2i(i * 7, 3) - 0.5) * 0.1,
      z, ch: text[i], band: 7, lift: 1 });
  }
  return pts;
}

function pathOffset(z) { return Math.sin(z * 0.13) * 1.7; }
function ahead(cam, d, dy) {
  return { x: cam.x + Math.sin(cam.yaw) * d, y: cam.y + dy, z: cam.z - Math.cos(cam.yaw) * d };
}

// the ground's own voices — path, narrator underfoot, mushrooms, moss, shore
function groundVoice(wx, wz, hS, g, t) {
  if (wz > -8.5 && wz < 27 && Math.abs(wx - pathOffset(wz)) < 1.4) { g.band = 5; g.lum *= 0.72; }
  if (h2i(Math.floor(wx * 2) + 7, Math.floor(wz * 2) + 3) > 0.9988) { g.band = 6; g.lum += 0.12; }
  // the narrator underfoot — the opening paragraph laid along the path
  if (wz > -9.5 && wz < 21 && narrator.apply(wx, wz, g)) { g.band = 5; return; }
  for (const m of MUSH_G) { // the mushroom trail's warm ground
    const md = Math.hypot(wx - m.x, wz - m.z);
    if (md < 1.1) { g.band = 6; g.lum += (1.1 - md) * 0.4; return; }
  }
  // the whispering moss — near the stones, ~3% of cells surface a letter of
  // the moss's line for a breath; murmur, never caption. the stones in her
  // shadow keep the silent night for her.
  for (const s of STONES) {
    if (Math.hypot(wx - s.x, wz - s.z) >= 2.4) continue;
    g.band = 2;
    g.lum *= 0.86;
    const cellA = Math.floor(wx * 2.2) + 13, cellB = Math.floor(wz * 2.2) + Math.floor(t / 1.6);
    if (h2i(cellA, cellB) < (s.quiet ? 0.006 : 0.03)) {
      g.letter = true;
      g.letterSeed = MOSS_SEEDS[Math.floor(h2i(cellB, cellA) * MOSS_SEEDS.length)];
    }
    return;
  }
  // the south shore — the land dissolves into the text as it sinks
  if (wz > 42 && hS < 1.6) {
    const p = Math.min(1, (1.6 - hS) / 1.6) * Math.min(1, (wz - 42) / 8);
    if (h2i(Math.floor(wx * 1.6) + 5, Math.floor(wz * 1.6) + 8) < p * 0.75) {
      g.letter = true;
      g.letterSeed = Math.floor(h2i(Math.floor(wx * 1.1) + Math.floor(t * 0.4), Math.floor(wz * 1.1)) * 46);
    }
  }
}

function staticPts() {
  const pts = [];
  for (const px of [-1.6, 1.6])
    for (let y = 0; y <= 3.0; y += 0.11)
      pts.push({ x: GATE.x + px, y, z: GATE.z, ch: '║', band: 4, lift: 0 });
  for (const y of [1.2, 2.0])
    for (let x = -1.35; x <= 1.36; x += 0.1)
      pts.push({ x: GATE.x + x, y, z: GATE.z, ch: '═', band: 4, lift: 0 });
  for (let a = 0.06; a < Math.PI; a += 0.07)
    pts.push({ x: GATE.x + 1.6 * Math.cos(a), y: 3.1 + 0.9 * Math.sin(a), z: GATE.z, ch: '·', band: 4, lift: 0 });
  // fate — a pale column, likeness unresolved on purpose
  for (let y = 0; y <= 2.8; y += 0.11)
    pts.push({ x: FATE.x, y, z: FATE.z, ch: '▒', band: 7, lift: 0 });
  // the moss stones — low domes of dream-matter on the right of the path
  for (const s of STONES) {
    const base = heightRaw(s.x, s.z);
    for (let i = 0; i < 10; i++) {
      const a = h2i(i, 71) * Math.PI * 2, r = Math.sqrt(h2i(i, 72)) * 0.9;
      pts.push({ x: s.x + Math.cos(a) * r, y: base + 0.12 + (1 - r) * 0.42 * h2i(i, 73),
        z: s.z + Math.sin(a) * r * 0.8, ch: h2i(i, 74) > 0.6 ? '▓' : '░', band: 2, lift: 0 });
    }
  }
  // the castle on the hill, silhouette — where he met her
  const hy = heightRaw(HILL.x, HILL.z);
  for (let i = 0; i < 14; i++)
    pts.push({ x: HILL.x + (h2i(i, 9) - 0.5) * 16, y: hy + 1 + h2i(i, 6) * 7,
      z: HILL.z + (h2i(i, 4) - 0.5) * 9, ch: '▓█░'[i % 3], band: 8, lift: 2 });
  return pts;
}

function heightRaw(x, z) {
  let h = vnoise(x * 0.02, z * 0.02) * 7 + vnoise(x * 0.055, z * 0.055) * 2.4 - 2.2;
  const dx = x - HILL.x, dz = z - HILL.z;
  h += HILL.amp * Math.exp(-(dx * dx + dz * dz) / (HILL.r * HILL.r));
  const s = (z - 55) / 26;
  if (s > 0) h -= Math.min(1, s) * Math.min(1, s) * 9;
  if (z < 48 && z > -60 && h < 0.4) h = 0.4 + (0.4 - h) * 0.2;
  return h;
}

// ------------------------------------------------------------- the exchange
// beats are proximity-cued and then time-run: once you are near, the night
// keeps talking whether or not you do anything. only the hand reads facing,
// and the hand is optional.

const REFUSE_DUR = 5.4;
let STATIC = null, hand = null, ex = null;
let lastBT = -9, FLARE = 0, NOW = 0;

function freshEx() {
  return { notice: -1, edgeA: 0, held: -1, greet: -1, spoke: -1, pay: -1, from: null, write: -1,
    card: -1, refuse: -1, refAt: null, scold: -1, told: false, passT: -1, trailTold: false,
    marginFree: 0, quiet: -1 };
}
// the margin is one voice at a time; keep our own clock of when it is free
// so her spoken lines never talk over the writing (and are never eaten).
function say(t, text) {
  if (!text) return;
  narrate(text);
  ex.marginFree = Math.max(ex.marginFree, t) + text.length * 0.066 + 2.7;
}
// the band is free only after a beat of real quiet: the single frame between
// two queued spoken lines is not silence, and a margin line dropped into it
// would be typed over and expire unread.
function bandFree(t) {
  if (speaking()) { ex.quiet = -1; return false; }
  if (ex.quiet < 0) ex.quiet = t;
  return t - ex.quiet > 0.5 && t > ex.marginFree;
}

function runExchange(t, cam, fd) {
  const fold = dream.folds || 0;
  const echo = dream.echo || {};
  // ii — notice. her body admits you before any words.
  if (ex.notice < 0 && fd < 22) {
    ex.notice = t;
    ex.edgeA = Math.atan2(cam.x - FATE.x, cam.z - FATE.z);
    // a night that let her hand fall is met glare-first
    if (echo.fate === 'declined-hand') { ex.scold = t; ex.told = true; say(t, M_SCOLD); }
    // fold 3 — the mechanism shows itself: the pass typesets before payment
    if (fold >= 3 && ex.passT < 0) { ex.passT = t; say(t, XE_FOLD3); }
  }
  // the unfinished letter, held aloft while you come
  if (fd < 15 && ex.spoke < 0) { if (ex.held < 0) ex.held = t; } else ex.held = -1;
  // iii — the greeting, then her answer. on a fold she gets in first and the
  // margin waits for her: a returning walker is answered before he is greeted.
  if (ex.greet < 0 && (fold ? ex.spoke > 0 && bandFree(t) : fd < 12)) {
    ex.greet = t;
    say(t, M_GREET1); say(t, M_GREET2);
    if (!fold) say(t, M_ASK); // on a fold the director has already asked
  }
  // fold 1+ — she answers the question unasked, out at the noticing distance
  const early = fold >= 1 && ex.notice > 0 && t - ex.notice > 1.4 && bandFree(t);
  if (ex.spoke < 0 && (early || (ex.greet > 0 && bandFree(t)))) {
    ex.spoke = t;
    speak([{ text: LINE1, at: AT }, { text: LINE2, at: AT }]);
    if (fold >= 2 && XE_FOLD2) speak({ text: XE_FOLD2, at: AT });
  }
  // the faded hand (17.08.26). offered mid-exchange; refusing it changes
  // who you were, never what happens next.
  if (!hand && ex.spoke > 0 && t - ex.spoke > 5.5) {
    hand = makeHand({ x: HAND.x, z: HAND.z, y: HAND.y, radius: 9, cone: 0.45, dwell: 1.5, seed: 17,
      onVerdict(v) {
        if (v === 'taken') choose('fate', 'took-hand');
        else if (v === 'declined') { choose('fate', 'declined-hand'); say(NOW, XE_DECLINE); }
        // 'unwitnessed' — the night keeps nothing. the '…' is the whole record.
      } });
  }
  // iv — the payment. unchanged from v1: crossing the gate pays the tongue
  // and flips dream.pass, on which the night's stage-advance depends.
  if (!dream.pass && cam.z < GATE.z - 0.4 && Math.abs(cam.x) < 4.5) {
    markDream('pass', true);
    choose('tongue', 'gave');
    ex.pay = t;
    ex.from = ahead(cam, 1.4, -0.4);
    say(t, M_PAY);
  } else if (dream.pass && ex.pay < 0 && ex.greet > 0) {
    ex.pay = t - 2.2; // paid before this walk began — pick the beat back up
  }
  // she writes the card with it — "voices type, objects appear": the writing
  // is a gesture in the world, the card itself arrives whole (law 4). it can
  // land while the margin still says the payment; a card is not a voice.
  if (ex.write < 0 && ex.pay > 0 && t - ex.pay > 1.9) ex.write = t;
  if (ex.card < 0 && ex.write > 0 && t - ex.write > 1.5) { ex.card = t; cardShow([CARD], 'cards'); }
  if (ex.card > 0 && cardActive() && t - ex.card > 9) cardHide(); // a walked-away night still turns it
  // v — the refusal. no tongue, so it cannot be typed anywhere: the letters
  // reach for your mouth and give out. the margin says why.
  if (ex.refuse < 0 && ex.card > 0 && !cardActive() && bandFree(t)) {
    ex.refuse = t;
    ex.refAt = ahead(cam, 3.0, -0.3); // mouth-height, where the words would go
    say(t, M_EYES);
  }
  // vi — her scold. the flare and its line land together.
  if (ex.scold < 0 && ex.refuse > 0 && t - ex.refuse > REFUSE_DUR + 0.3 && bandFree(t)) {
    ex.scold = t;
    if (!ex.told) { ex.told = true; say(t, M_SCOLD); }
  }
  // and only then the pass, in the writing's order (keyed off the refusal,
  // not the scold — on an echo night the scold has already been and gone)
  if (ex.passT < 0 && ex.refuse > 0 && t - ex.refuse > REFUSE_DUR + 2.7) ex.passT = t;
  if (!ex.trailTold && ex.passT > 0 && dream.pass && t - ex.passT > 1.5) {
    ex.trailTold = true;
    say(t, M_PASS); say(t, M_TRAIL);
  }
}

// i — she writes with nothing. her pen never came back, so the letters fall
// toward the hand's tip and give out before they settle. the period tightens
// with the body's tension; every ~40s the hand droops and recovers (she is
// growing old). indifferent to the camera. while she speaks, her letters
// lift instead — that is how you know the voice in the band is hers.
function fatePts(t, env, voicing) {
  const pts = [];
  const ten = env ? env.ch.tension : 0.3;
  const dph = (t % 40) / 40;
  const droop = dph > 0.86 ? Math.sin(((dph - 0.86) / 0.14) * Math.PI) * 0.22 : 0;
  const tip = { x: FATE.x + 0.9, y: 1.72 - droop, z: FATE.z - 0.06 };
  for (let i = 0; i < 7; i++)
    pts.push({ x: FATE.x + 0.18 + i * 0.12, y: 2.02 - i * 0.05 - droop * (i / 6),
      z: FATE.z - 0.06, ch: '▒', band: 7, lift: 0 });
  // her head — lifted once she has noticed you, flaring while she scolds
  pts.push({ x: FATE.x, y: 3.05, z: FATE.z, ch: '▓', band: 7, lift: ex.notice > 0 || FLARE > 0.05 ? 2 : 1 });
  if (FLARE > 0.05)
    for (let a = 0; a < 6.28; a += 1.05)
      pts.push({ x: FATE.x + Math.cos(a) * 0.3, y: 3.05 + Math.sin(a) * 0.24, z: FATE.z, ch: '·', band: 7, lift: 1 });
  // ii — the column's bright edge turns to your side, and holds
  if (ex.notice > 0) {
    const near = Math.min(1, (t - ex.notice) / 1.6) * 0.17;
    for (let y = 0.5; y <= 2.6; y += 0.13)
      pts.push({ x: FATE.x + Math.sin(ex.edgeA) * near, y, z: FATE.z + Math.cos(ex.edgeA) * near,
        ch: '▓', band: 7, lift: 1 });
  }
  const held = ex.held > 0 && ex.spoke < 0;
  const per = 3.6 - 1.4 * ten;
  const n = held ? 1 : voicing ? 7 : 2;
  for (let k = 0; k < n; k++) {
    const ph = (held ? ex.held : t) / per + k * 0.41;
    const cyc = Math.floor(ph);
    let e = (ph - cyc) / 0.78;
    if (held) e = 0.58;              // the letter she never finished
    else if (e > 1) continue;        // it gives out short of the page
    const ox = tip.x + (h2i(cyc * 13 + k, 91) - 0.5) * (voicing ? 1.1 : 2.0);
    const oy = tip.y + (voicing ? 2.3 : 1.25) + h2i(cyc * 7 + k, 92) * 0.9;
    const oz = tip.z + (h2i(cyc * 5 + k, 93) - 0.5) * (voicing ? 0.8 : 1.4);
    const s = e * e * (3 - 2 * e);
    pts.push({
      x: ox + (tip.x - ox) * s + Math.sin(t * 11 + k) * 0.03 * ten,
      y: oy + (tip.y - oy) * s, z: oz + (tip.z - oz) * s,
      ch: WA[Math.floor(h2i(cyc, k + 5) * 26)], band: 9, lift: voicing ? 1 : 0,
    });
  }
  return pts;
}

export default {
  id: 'gate',
  title: 'fate at the gate',
  register: 'night',
  notation: { extra: ['M', '?', '1', '3', '4', '5', '7', '9', '/', '\\'] },
  world: {
    far: 300,
    waterLevel: 0,
    islandR: null, // carries its own water at the south edge
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t, env, cam) {
      groundVoice(wx, wz, hS, g, t);
      // vi — her glare, once cold enough to cut, still dims a world. this is
      // the scene's ONE liminal coupling: an authored flare the dial deepens,
      // gains only. env is never written to — the body's weather stays the
      // body's; the fog it lends is hers.
      if (FLARE > 0 && cam) g.lum *= 1 - FLARE * Math.min(1, Math.hypot(wx - cam.x, wz - cam.z) / 26);
    },
    water(wx, wz, w, t) { wake.apply(wx, wz, w, t); },
  },
  spawn: { x: 0, z: 26, yaw: 0 },
  sky: { moon: { phase: 0.94 } }, // near full — the night of the writing
  beings(t, cam, env) {
    if (!STATIC) STATIC = staticPts();
    NOW = t;
    // re-entry (the fold): the exchange happens again, from the top
    if (t - lastBT > 2.5) { ex = freshEx(); hand = null; FLARE = 0; }
    lastBT = t;
    const pts = [...STATIC];
    wake.note(cam, t, onWater());
    const fd = Math.hypot(cam.x - FATE.x, cam.z - FATE.z);
    runExchange(t, cam, fd);
    const sc = ex.scold > 0 ? (t - ex.scold) / 2.4 : 9;
    FLARE = sc < 1 ? Math.sin(sc * Math.PI) * (0.30 + 0.30 * liminal()) : 0;
    // her body — idle, notice, the letters that carry her voice
    const sa = speakingAt();
    const voicing = !!sa && Math.hypot(sa.x - FATE.x, sa.z - FATE.z) < 1.5;
    pts.push(...fatePts(t, env, voicing));
    if (hand) pts.push(...hand.update(t, cam));
    // the glowing mushrooms — the pulse travels outward: this way
    for (let i = 0; i < MUSH_G.length; i++) {
      const m = MUSH_G[i];
      const gy = heightRaw(m.x, m.z);
      const lit = Math.sin(t * 2.2 - i * 0.85) > 0.55;
      pts.push({ x: m.x, y: gy + 0.5, z: m.z, ch: '·', band: 6, lift: lit ? 2 : 1 });
      pts.push({ x: m.x, y: gy + 0.26, z: m.z, ch: ':', band: 6, lift: lit ? 1 : 0 });
    }
    if (dream.pass && Math.hypot(cam.x - TRAIL_END.x, cam.z - TRAIL_END.z) < 3.5) signal('trailEnd');
    // the fold's margin note — gone and gone again
    if (dream.folds > 0) {
      const mark = `gone and gone again · ${dream.folds + 1}`;
      for (let i = 0; i < mark.length; i++) {
        if (mark[i] === ' ') continue;
        pts.push({ x: GATE.x + (i - mark.length / 2) * 0.12, y: 4.55, z: GATE.z - 0.9,
          ch: mark[i], band: 9, lift: 0 });
      }
    }
    // v — the refusal. the reveal peaks below the settling point (0.68 × 1.4
    // < 1): the front of the line gets almost all the way to your mouth, the
    // rest never leaves the sky, and every letter stays band-9 dim and flies
    // home. it is very nearly said. "my eyes told it anyways."
    if (ex.refuse > 0 && ex.refAt && t - ex.refuse < REFUSE_DUR) {
      // in, then a long hold just short of settling, then home again
      const u = (t - ex.refuse) / REFUSE_DUR;
      const a = ex.refAt;
      const un = condense(UNSAID, a.x, a.y, a.z,
        0.68 * Math.max(0, Math.min(1, Math.min(u / 0.22, (1 - u) / 0.3))), t, 23);
      // the whole flight pulled in close — these words never got further
      // than your own mouth, so the sky they fall from is a small one
      for (const q of un) {
        q.x = a.x + (q.x - a.x) * 0.42; q.y = a.y + (q.y - a.y) * 0.5; q.z = a.z + (q.z - a.z) * 0.42;
      }
      pts.push(...un);
    }
    // iv — the tongue-tip arcs to her hand; her grip holds it pale ever after
    if (ex.pay > 0 && t - ex.pay < 1.6 && ex.from) {
      for (let i = 0; i < 5; i++) {
        const u = Math.max(0, Math.min(1, (t - ex.pay) / 1.1 - i * 0.09));
        if (u <= 0 || u >= 1) continue;
        pts.push({
          x: ex.from.x + (GRIP.x - ex.from.x) * u,
          y: ex.from.y + (GRIP.y - ex.from.y) * u + Math.sin(u * Math.PI) * 1.1,
          z: ex.from.z + (GRIP.z - ex.from.z) * u, ch: '·', band: 7, lift: 1,
        });
      }
      pts.push({ ...GRIP, ch: '·', band: 9, lift: 0 });
    } else {
      pts.push({ ...GRIP, ch: dream.pass ? '▒' : '·', band: dream.pass ? 7 : 9, lift: dream.pass ? 1 : 0 });
    }
    // she writes the cards with what you gave her — her pen is your tongue
    if (ex.write > 0 && t - ex.write < 1.5) {
      for (let i = 0; i < 5; i++) {
        const s = Math.max(0, (t - ex.write) - i * 0.09);
        pts.push({ x: GRIP.x + Math.sin(s * 26) * 0.16, y: GRIP.y + 0.12 + Math.sin(s * 41 + 1.3) * 0.1,
          z: GRIP.z, ch: '·', band: 7, lift: i === 0 ? 1 : 0 });
      }
    }
    if (ex.passT > 0 && t - ex.passT < 8)
      pts.push(...typeset(PASS_TEXT, GATE.x, 5.4, GATE.z - 1.2, (t - ex.passT) / 1.6));
    // the flare reaches the world's matter too — the far things step back
    if (FLARE > 0.12)
      for (let i = 0; i < pts.length; i++)
        if (Math.hypot(pts[i].x - cam.x, pts[i].z - cam.z) > 11) pts[i] = { ...pts[i], lift: -1 };
    return pts;
  },
};
