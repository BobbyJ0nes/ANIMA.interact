// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// glyphs.js — the character atlas. the field is made of the writing's own letters.
// ambient = letters + light punctuation (the dream-text's population);
// dense = the heavy chars forms condense through (rose-field heritage).

import * as THREE from 'three';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const CAPS = 'WGFTSAI';
const DIGITS = '0682';
const LIGHT = ".,:;·-—'\"()";
const DENSE = '*+@#%&░▒▓█';

export const CHARS = (LETTERS + CAPS + DIGITS + LIGHT + DENSE).split('');
export const AMBIENT_COUNT = LETTERS.length + CAPS.length + DIGITS.length + LIGHT.length; // 48
export const DENSE_START = AMBIENT_COUNT;
export const DENSE_COUNT = DENSE.length;

export function indexOf(ch) {
  const i = CHARS.indexOf(ch);
  return i >= 0 ? i : CHARS.indexOf('·');
}

export function buildAtlas() {
  const cell = 128;
  const grid = 8;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = cell * grid;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '96px Consolas, "Courier New", monospace';
  CHARS.forEach((ch, i) => {
    const col = i % grid;
    const row = Math.floor(i / grid);
    ctx.fillText(ch, col * cell + cell / 2, row * cell + cell / 2);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}
