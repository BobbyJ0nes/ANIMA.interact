// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// main.js — boot. renderer, camera, the three surfaces, the circuit.

import * as THREE from 'three';
import { createUI } from './prose.js';
import { createPlayer } from './player.js';
import { createCircuit } from './circuit.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 240);

const ui = createUI();
const player = createPlayer(camera, renderer.domElement);
const circuit = createCircuit(scene, { ui, player, camera });

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  player.update(dt);
  circuit.update(dt);
  renderer.render(scene, camera);
});

// the door in
(async () => {
  await ui.black(
    `<div><div class="title">A N I M A</div><div class="sub">the circuit · gate to boat · v0</div><div class="keys">( any key — then click to look · wasd to walk )</div></div>`,
    { holdForKey: true, minMs: 900 }
  );
  await circuit.begin();
})();

// dev handle — not part of the dream
window.anima = circuit;
