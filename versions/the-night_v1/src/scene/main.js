// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// scene/main.js — scene_01: the shop's scenes, walkable in the browser.
// gate + fate at the origin; the strawberry field a walk away; the lamp's
// blender keyframes playing live; the glyph field as ambient dream-matter.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createPlayer } from '../player.js';
import { createField } from '../field/field.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070e);
scene.fog = new THREE.FogExp2(0x05070e, 0.026);

const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 300);
const player = createPlayer(camera, renderer.domElement);
player.place(new THREE.Vector3(0, 0, 12), 0, 1.65);

// night light
scene.add(new THREE.HemisphereLight(0x3a4a63, 0x0a0c10, 0.5));
const moon = new THREE.DirectionalLight(0x9fb4cc, 1.0);
moon.position.set(-8, 14, 6);
scene.add(moon);
const gateCold = new THREE.PointLight(0x9fb4cc, 16, 22, 1.7);
gateCold.position.set(2.2, 2.6, -1.5);
scene.add(gateCold);

// floor of the between — the walk from scene to scene needs ground
const between = new THREE.Mesh(
  new THREE.CircleGeometry(120, 48),
  new THREE.MeshStandardMaterial({ color: 0x070a0d, roughness: 1 })
);
between.rotation.x = -Math.PI / 2;
between.position.y = -0.08;
scene.add(between);

// the glyph field, as atmosphere only — quieter than the field study
const field = createField(scene, { max: 16000, initial: 11000 });
field.uniforms.uAmbFloor.value = 0.16;
field.uniforms.uAmbAmp.value = 0.12;
field.uniforms.uAmbScale.value = 0.85;

// the scenes, from the shop
const loader = new GLTFLoader();
let mixer = null;

loader.load('/td/scene_gate.glb', (g) => {
  scene.add(g.scene);
});

loader.load('/td/scene_streetlamp.glb', (g) => {
  // exported 80m out along x — bring the field within walking distance
  g.scene.position.set(-46, 0, -6); // lamp lands ≈ (34, 0, -6)
  scene.add(g.scene);
  window.__clips = g.animations?.map((c) => `${c.name} ${c.duration.toFixed(1)}s [${c.tracks.map((t) => t.name).join(',')}]`) ?? [];
  if (g.animations?.length) {
    mixer = new THREE.AnimationMixer(g.scene);
    for (const clip of g.animations) mixer.clipAction(clip).play();
  }
  // hang a real light on the bulb so the lean carries the glow with it
  g.scene.traverse((o) => {
    if (o.name === 'lamp_bulb') {
      const warm = new THREE.PointLight(0xffa14d, 70, 26, 1.6);
      o.add(warm);
    }
  });
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const raw = clock.getDelta();
  const dt = Math.min(raw, 0.05); // clamp protects the walk, not the clock
  player.update(dt);
  mixer?.update(raw);             // the lamp gets tired in wall-time
  field.update(clock.elapsedTime);
  renderer.render(scene, camera);
});

// dev handle — not part of the dream
window.sceneDev = {
  cam(x, y, z, tx, ty, tz) {
    camera.position.set(x, y, z);
    camera.lookAt(tx, ty, tz);
  },
  rot(name) {
    let out = null;
    scene.traverse((o) => { if (o.name === name) out = o.rotation.toArray(); });
    return out;
  },
  anim() {
    return {
      hasMixer: !!mixer,
      time: mixer?.time ?? null,
      clips: window.__clips ?? null,
    };
  },
};
