// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// field/main.js — field_01: the field takes form.
// a navigable night of coloured characters; forms condense out of the drift,
// hold, dissolve, elsewhere. the she_dream move, both directions, forever.

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { createField } from './field.js';
import { lady, rose, lamp, willow, textLine, loadShopForm } from './forms.js';
import { createTune } from './tune.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04060c);
const camera = new THREE.PerspectiveCamera(66, innerWidth / innerHeight, 0.1, 300);
camera.position.set(0, 2.2, 6);

// —— fly rig: slow, dreamlike, inertial
const controls = new PointerLockControls(camera, renderer.domElement);
renderer.domElement.addEventListener('click', () => controls.lock());
const keys = {};
addEventListener('keydown', (e) => (keys[e.code] = true));
addEventListener('keyup', (e) => (keys[e.code] = false));
const vel = new THREE.Vector3();
const dir = new THREE.Vector3();

function fly(dt) {
  if (!controls.isLocked) return;
  dir.set(
    (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0),
    (keys.Space ? 1 : 0) - (keys.ShiftLeft ? 1 : 0),
    (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0)
  );
  if (dir.lengthSq() > 0) {
    dir.normalize();
    const acc = 9;
    // move in look-plane
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    const right = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
    vel.addScaledVector(right, dir.x * acc * dt);
    vel.addScaledVector(fwd, -dir.z * acc * dt);
    vel.y += dir.y * acc * dt;
  }
  vel.multiplyScalar(Math.exp(-2.2 * dt));
  camera.position.addScaledVector(vel, dt);
  camera.position.y = Math.max(0.5, Math.min(26, camera.position.y));
  const r = Math.hypot(camera.position.x, camera.position.z);
  if (r > 60) { camera.position.x *= 60 / r; camera.position.z *= 60 / r; }
}

// —— the field
const field = createField(scene, { max: 60000, initial: 28000 });
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  fly(dt);
  field.update(t);
  renderer.render(scene, camera);
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// —— choreography: one form at a time, around the volume; anchors drift per cycle
const wait = (s) => new Promise((r) => setTimeout(r, s * 1000));
const marker = document.getElementById('marker');

const SEQ = [
  { name: 'the white lady', make: (a) => lady(a), at: new THREE.Vector3(0, 0, -12), hold: 22 },
  { name: 'the line', make: (a) => textLine(a, "We're all here and gone and gone again.", camera, 1.0), at: new THREE.Vector3(0, 2.6, -12), hold: 13 },
  { name: 'the rose', make: (a) => rose(a), at: new THREE.Vector3(26, 1.2, 6), hold: 19 },
  { name: 'the streetlamp', make: (a) => lamp(a), at: new THREE.Vector3(-22, 0, 10), hold: 24 },
  { name: 'the willow', make: (a) => willow(a), at: new THREE.Vector3(4, 0, 30), hold: 21 },
];

(async () => {
  // forms from the shop — blender-authored, surface-sampled. they lead the cycle.
  const shop = [];
  const tryLoad = async (name, url, opts, at, hold) => {
    try {
      const f = await loadShopForm(url, opts);
      if (f) shop.push({ name, make: f, at, hold });
    } catch { /* the shop hasn't made this one yet */ }
  };
  await tryLoad('the lady, from the shop', 'forms/lady_v1.glb',
    { height: 3.4 }, new THREE.Vector3(0, 0, -12), 20);
  await tryLoad('fate, from the shop', 'forms/fate_v1.glb',
    { height: 3.7, base: 0x8fa2c8, bright: 0xd8e2f5, count: 1200 }, new THREE.Vector3(3.6, 0, -11), 16);
  await tryLoad('the gate, from the shop', 'forms/gate_v1.glb',
    { height: 5.0, base: 0x55627e, bright: 0x8a9ab8, count: 1700 }, new THREE.Vector3(-5, 0, -13), 16);
  if (new URLSearchParams(location.search).has('shop')) {
    SEQ.length = 0;
    SEQ.push(...shop.map((s) => ({ ...s, hold: 11 })));
  } else {
    SEQ.unshift(...shop);
  }

  // the material-lock instrument (press T) — pauses the cycle, summons on demand
  let paused = false;
  const summon = (name) => {
    const ev = SEQ.find((e) => e.name === name);
    if (!ev) return;
    marker.textContent = `anima.interact · field_01 · ${ev.name}`;
    const h = field.condense(ev.at.clone(), ev.make(ev.at.clone()), clock.elapsedTime);
    setTimeout(() => h.release(clock.elapsedTime), 24000);
  };
  window.field.tune = createTune({
    field,
    summonNames: () => SEQ.map((e) => e.name),
    summon,
    setPaused: (v) => (paused = v),
  });
  window.field.summon = summon;

  await wait(2.5);
  for (let cycle = 0; ; cycle++) {
    for (const ev of SEQ) {
      while (paused) await wait(0.8);
      const a = ev.at.clone();
      if (cycle > 0 && ev.name !== 'the line') {
        a.x += (Math.random() - 0.5) * 5;
        a.z += (Math.random() - 0.5) * 5;
      }
      marker.textContent = `anima.interact · field_01 · ${ev.name}`;
      const h = field.condense(a, ev.make(a), clock.elapsedTime);
      await wait(ev.hold);
      h.release(clock.elapsedTime);
      await wait(5.5);
    }
  }
})();

// dev handle — not part of the dream
window.field = {
  cam(x, y, z, tx, ty, tz) {
    camera.position.set(x, y, z);
    camera.lookAt(tx, ty, tz);
  },
};
