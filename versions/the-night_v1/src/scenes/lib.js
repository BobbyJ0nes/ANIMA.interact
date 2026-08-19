// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// lib.js — small shared vocabulary for scene-building. crude forms on purpose:
// likenesses stay unresolved (18.05.26 — likeness drifts, sentiment locked).

import * as THREE from 'three';

export const M = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 1, ...opts });

export function ground(color, size = 140) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(size, 48), M(color));
  m.rotation.x = -Math.PI / 2;
  return m;
}

export function box(w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

export function cyl(rTop, rBot, h, mat, seg = 12) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), mat);
}

export function glow(color, r = 0.1, intensity = 1.5) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(r, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: intensity })
  );
}
