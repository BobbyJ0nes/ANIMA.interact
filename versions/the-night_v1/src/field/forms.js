// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// forms.js — what the field condenses into. every sampler returns points
// sorted bottom-up so forms rise into being. likeness is sampled fresh each
// time (drifts); hue is locked per form (sentiment).

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { indexOf } from './glyphs.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rnd = (a = 1) => (Math.random() - 0.5) * 2 * a;

function pt(pos, color, opts = {}) {
  return { pos, color, glyph: opts.glyph ?? -1, scale: opts.scale };
}

function bySorted(points) {
  points.sort((a, b) => a.pos.y - b.pos.y);
  return points;
}

// —— the white lady — she glows white like moonlight.
// the she_dream image reversed: symbols gather back into the figure.
export function lady(anchor) {
  const pts = [];
  const pale = new THREE.Color(0xa8b8d8);
  const bright = new THREE.Color(0xdde6f8);
  const col = () => (Math.random() < 0.1 ? bright : pale);
  // skirt — cone, ground to waist
  for (let i = 0; i < 640; i++) {
    const t = Math.random();
    const r = (1.05 - 0.55 * t) * (0.92 + Math.random() * 0.16);
    const a = Math.random() * Math.PI * 2;
    pts.push(pt(V(anchor.x + Math.cos(a) * r, anchor.y + t * 1.75, anchor.z + Math.sin(a) * r), col()));
  }
  // torso — ellipsoid shell
  for (let i = 0; i < 390; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1);
    pts.push(pt(V(
      anchor.x + 0.5 * Math.sin(v) * Math.cos(u),
      anchor.y + 2.32 + 0.62 * Math.cos(v),
      anchor.z + 0.42 * Math.sin(v) * Math.sin(u)
    ), col()));
  }
  // head
  for (let i = 0; i < 210; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1);
    pts.push(pt(V(
      anchor.x + 0.35 * Math.sin(v) * Math.cos(u),
      anchor.y + 3.32 + 0.35 * Math.cos(v),
      anchor.z + 0.35 * Math.sin(v) * Math.sin(u)
    ), col()));
  }
  // a loose halo of stray symbols around her — she is never fully contained
  for (let i = 0; i < 300; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.2 + Math.random() * 1.4;
    pts.push(pt(V(anchor.x + Math.cos(a) * r, anchor.y + Math.random() * 3.8, anchor.z + Math.sin(a) * r),
      pale, { scale: 0.26 }));
  }
  return bySorted(pts);
}

// —— the rose — À toi. layered petal shells at golden angles.
export function rose(anchor) {
  const pts = [];
  const head = V(anchor.x, anchor.y + 2.5, anchor.z);
  const GOLDEN = 2.39996;
  for (let shell = 0; shell < 9; shell++) {
    const rp = 0.32 + shell * 0.115;
    const tilt = 0.22 + shell * 0.1;
    const phi = shell * GOLDEN;
    const c = new THREE.Color().lerpColors(new THREE.Color(0xb84858), new THREE.Color(0x701220), shell / 8);
    for (let i = 0; i < 95; i++) {
      const a = Math.random() * Math.PI * 2;
      const t = Math.pow(Math.random(), 0.6);
      const local = V(Math.cos(a) * rp * t, Math.pow(t, 1.6) * rp * 0.9 - rp * 0.25, Math.sin(a) * rp * t);
      local.applyAxisAngle(V(1, 0, 0), tilt * (shell % 2 ? 1 : -1) * 0.6);
      local.applyAxisAngle(V(0, 1, 0), phi);
      pts.push(pt(local.add(head.clone()), c.clone().offsetHSL(0, 0, rnd(0.05))));
    }
  }
  // stem — a slight s-curve, with two leaves
  const green = new THREE.Color(0x2f5a34);
  for (let i = 0; i < 170; i++) {
    const t = Math.random();
    pts.push(pt(V(
      anchor.x + Math.sin(t * 3.1) * 0.16 + rnd(0.05),
      anchor.y + t * 2.35,
      anchor.z + Math.cos(t * 2.2) * 0.1 + rnd(0.05)
    ), green));
  }
  for (const [ly, side] of [[0.9, 1], [1.5, -1]]) {
    for (let i = 0; i < 70; i++) {
      const t = Math.random(), a = Math.random() * Math.PI;
      pts.push(pt(V(
        anchor.x + side * (0.15 + t * 0.55),
        anchor.y + ly + Math.sin(a) * 0.12 + t * 0.22,
        anchor.z + Math.cos(a) * 0.18 * t
      ), green.clone().offsetHSL(0, 0, rnd(0.06))));
    }
  }
  return bySorted(pts);
}

// —— the streetlamp — his tired warm glow, the light itself made of characters.
export function lamp(anchor) {
  const pts = [];
  const iron = new THREE.Color(0x2a3040);
  const ironHead = new THREE.Color(0x333b4e);
  const amber = new THREE.Color(0xd8944f);
  const dimAmber = new THREE.Color(0x5e3d18);
  for (let i = 0; i < 260; i++) {
    const a = Math.random() * Math.PI * 2;
    pts.push(pt(V(anchor.x + Math.cos(a) * 0.1, anchor.y + Math.random() * 4.1, anchor.z + Math.sin(a) * 0.1), iron));
  }
  for (let i = 0; i < 160; i++) {
    pts.push(pt(V(anchor.x + rnd(0.3), anchor.y + 4.15 + rnd(0.16), anchor.z + rnd(0.3)), ironHead));
  }
  // the bulb halo
  for (let i = 0; i < 220; i++) {
    const r = Math.pow(Math.random(), 0.5) * 0.6;
    const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1);
    pts.push(pt(V(
      anchor.x + r * Math.sin(v) * Math.cos(u),
      anchor.y + 4.05 + r * Math.cos(v) * 0.8,
      anchor.z + r * Math.sin(v) * Math.sin(u)
    ), amber, { scale: 0.3 }));
  }
  // the cone of lamplight, sparse, falling to the ground
  for (let i = 0; i < 520; i++) {
    const t = Math.pow(Math.random(), 0.8);
    const r = t * 3.0 * Math.sqrt(Math.random());
    const a = Math.random() * Math.PI * 2;
    pts.push(pt(V(anchor.x + Math.cos(a) * r, anchor.y + 4.0 - t * 3.9, anchor.z + Math.sin(a) * r),
      dimAmber, { scale: 0.27 }));
  }
  // strawberries at the pool's edge
  const berry = new THREE.Color(0x6e1c2a);
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.2 + Math.random() * 1.6;
    pts.push(pt(V(anchor.x + Math.cos(a) * r, anchor.y + 0.06 + Math.random() * 0.1, anchor.z + Math.sin(a) * r), berry));
  }
  return bySorted(pts);
}

// —— the willow, the mage's lantern behind its curtain
export function willow(anchor) {
  const pts = [];
  const bark = new THREE.Color(0x483a28);
  for (let i = 0; i < 300; i++) {
    const t = Math.random();
    const a = Math.random() * Math.PI * 2;
    pts.push(pt(V(
      anchor.x + Math.cos(a) * (0.5 - t * 0.15) + t * 0.55,
      anchor.y + t * 4.4,
      anchor.z + Math.sin(a) * (0.5 - t * 0.15)
    ), bark));
  }
  for (let s = 0; s < 36; s++) {
    const a = (s / 36) * Math.PI * 2;
    const r = 2.4 + Math.random() * 0.9;
    const len = 2.6 + Math.random() * 1.5;
    const c = new THREE.Color().lerpColors(new THREE.Color(0x3f7a44), new THREE.Color(0x9a8a4a), Math.random());
    for (let i = 0; i < 24; i++) {
      const t = i / 24;
      pts.push(pt(V(
        anchor.x + Math.cos(a) * r * (1 - t * 0.12),
        anchor.y + 4.5 - t * len,
        anchor.z + Math.sin(a) * r * (1 - t * 0.12)
      ), c.clone().offsetHSL(0, 0, rnd(0.04))));
    }
  }
  // the lantern — gold, behind the strands
  const gold = new THREE.Color(0xc0a860);
  for (let i = 0; i < 120; i++) {
    const r = Math.pow(Math.random(), 0.6) * 0.4;
    const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1);
    pts.push(pt(V(
      anchor.x + r * Math.sin(v) * Math.cos(u),
      anchor.y + 1.15 + r * Math.cos(v),
      anchor.z - 1.3 + r * Math.sin(v) * Math.sin(u)
    ), gold, { scale: 0.3 }));
  }
  return bySorted(pts);
}

// —— a form from the shop: any blender-authored GLB, surface-sampled into
// condensation targets. the pipeline: sculpt there, condense here.
export async function loadShopForm(url, opts = {}) {
  const { count = 1300, height = 3.4, base = 0xa8b8d8, bright = 0xdde6f8, brightP = 0.1 } = opts;
  const gltf = await new GLTFLoader().loadAsync(url);
  let mesh = null;
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse((o) => { if (o.isMesh && !mesh) mesh = o; });
  if (!mesh) return null;
  const sampler = new MeshSurfaceSampler(mesh).build();
  const p = new THREE.Vector3();
  const raw = [];
  let minY = Infinity, maxY = -Infinity;
  let cx = 0, cz = 0;
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    const v = p.clone().applyMatrix4(mesh.matrixWorld);
    raw.push(v);
    minY = Math.min(minY, v.y);
    maxY = Math.max(maxY, v.y);
    cx += v.x; cz += v.z;
  }
  cx /= count; cz /= count;   // recentre — blender placement offsets don't travel
  const s = height / (maxY - minY);
  const baseC = new THREE.Color(base), brightC = new THREE.Color(bright);
  return (anchor) => {
    const pts = raw.map((v) => ({
      pos: new THREE.Vector3((v.x - cx) * s + anchor.x, (v.y - minY) * s + anchor.y, (v.z - cz) * s + anchor.z),
      color: Math.random() < brightP ? brightC : baseC,
      glyph: -1,
    }));
    return bySorted(pts);
  };
}

// —— a line of the writing, typeset from the field's own letters
export function textLine(anchor, str, camera, scale = 1.0) {
  const cream = new THREE.Color(0xe8e2d5);
  const toCam = camera.position.clone().sub(anchor).setY(0).normalize();
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), toCam).normalize();
  const adv = 0.58 * scale;
  const chars = str.split('');
  const pts = [];
  chars.forEach((ch, i) => {
    if (ch === ' ') return;
    const off = (i - chars.length / 2) * adv;
    pts.push({
      pos: anchor.clone().add(right.clone().multiplyScalar(off)),
      color: cream,
      glyph: indexOf(ch),
      scale: 0.9 * scale,
    });
  });
  // a text line settles left-to-right, not bottom-up
  return pts;
}
