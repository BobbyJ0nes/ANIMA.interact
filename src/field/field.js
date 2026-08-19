// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// field.js — the glyph field itself. one instanced draw, everything lives in the shader:
// drift (the field breathes, sloshes, never migrates), condensation (glyphs fly to a
// form and rise into it bottom-up), release (they scatter back to their drift).

import * as THREE from 'three';
import { buildAtlas, AMBIENT_COUNT, DENSE_START, DENSE_COUNT } from './glyphs.js';

const VERT = /* glsl */ `
attribute vec3 aHome;
attribute float aSeed;
attribute vec3 aBaseColor;
attribute vec3 aFormPos;
attribute vec3 aFormColor;
attribute float aRecruit;
attribute float aRelease;
attribute float aGlyph;      // -1 = cycle through dense chars while condensed
attribute float aScale;
attribute float aFormScale;
uniform float uTime;
uniform vec3 uAmbientTint;
uniform float uAmbientCount;
uniform float uDenseStart;
uniform float uDenseCount;
uniform float uAmbFloor;
uniform float uAmbAmp;
uniform float uAmbScale;
uniform float uFormBright;
uniform float uFormScale;
uniform float uFormAlpha;
uniform float uDrift;
uniform float uCycle;
varying vec2 vQuadUv;
varying vec2 vCellOff;
varying vec3 vColor;
varying float vAlpha;

float hash(float n){ return fract(sin(n)*43758.5453123); }

void main(){
  float h1 = hash(aSeed);
  float h2 = hash(aSeed*1.37);
  float h3 = hash(aSeed*2.11);

  // drift — slosh, breath; the field never leaves
  vec3 drift = aHome;
  float tD = uTime * uDrift;
  float sl = sin(tD*0.05)*2.0;
  drift.x += sin(tD*(0.10+h1*0.14) + aSeed*3.1 + aHome.y*0.21)*0.9 + sl*(0.3+h2*0.3);
  drift.y += sin(tD*(0.07+h2*0.11) + aSeed*1.7 + aHome.x*0.17)*0.55;
  drift.z += sin(tD*(0.09+h3*0.12) + aSeed*2.3 + aHome.x*0.13)*0.9;

  // condensation
  float dIn  = uTime - aRecruit;
  float dOut = uTime - aRelease;
  float w = smoothstep(0.0, 2.4 + h1*1.8, dIn) * (1.0 - smoothstep(0.0, 3.0 + h2*1.6, dOut));
  w = clamp(w, 0.0, 1.0);

  vec3 arc = (vec3(h1,h2,h3)-0.5) * 2.6;
  vec3 pos = mix(drift, aFormPos, w) + arc * sin(w*3.14159);
  pos += w * 0.05 * vec3(sin(uTime*1.3+aSeed), sin(uTime*1.1+aSeed*2.0), sin(uTime*1.7+aSeed*3.0));

  // which character am i right now
  float tick = floor(uTime*uCycle*(0.22+h3*0.6));
  float ambIdx = mod(floor(h1*997.0)+tick, uAmbientCount);
  float denseTick = floor(uTime*uCycle*(0.5+h2));
  float denseIdx = uDenseStart + mod(floor(h2*991.0)+denseTick, uDenseCount);
  float condIdx = aGlyph >= 0.0 ? aGlyph : denseIdx;
  float idx = w > 0.5 ? condIdx : ambIdx;
  float row = floor(idx/8.0);
  vCellOff = vec2(mod(idx,8.0)/8.0, (7.0-row)/8.0);
  vQuadUv = uv;

  // colour: dim breathing ambient -> the form's locked hue
  float flick = uAmbFloor + uAmbAmp*sin(uTime*(0.4+h2*1.3)+h1*6.283);
  vec3 ambient = aBaseColor * uAmbientTint * flick;
  float shimmer = 0.95 + 0.18*sin(uTime*2.2+aSeed);
  vColor = mix(ambient, aFormColor * shimmer * uFormBright, w);

  float scl = mix(aScale * uAmbScale, aFormScale * uFormScale, w);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = -mv.z;
  float fadeFar = clamp(1.0 - (dist-32.0)/26.0, 0.0, 1.0);
  float fadeNear = clamp((dist-1.1)/2.4, 0.0, 1.0);
  vAlpha = fadeFar*fadeNear * mix(0.85, uFormAlpha, w);

  mv.xyz += vec3(position.x, position.y, 0.0) * scl;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
uniform sampler2D uAtlas;
varying vec2 vQuadUv;
varying vec2 vCellOff;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec2 uv = vCellOff + vQuadUv/8.0;
  float a = texture2D(uAtlas, uv).a;
  if (a*vAlpha < 0.02) discard;
  gl_FragColor = vec4(vColor * a, a * vAlpha);
}
`;

// three registers, from his own corpus:
// night — the field study's home; folio — the EEG red-book's gold leaf;
// rose — the à-toi ascii field's green lineage.
export const PALETTES = {
  night: {
    bg: 0x04060c,
    pop: [
      [0x5a74b8, 0.30], [0x3f8a80, 0.22], [0x4f8a56, 0.18],
      [0x46589a, 0.20], [0x9a6070, 0.06], [0xb89040, 0.04],
    ],
  },
  folio: {
    bg: 0x0a0806,
    pop: [
      [0xb89040, 0.24], [0x8a6a3a, 0.20], [0x7a6a52, 0.18],
      [0x5a4632, 0.20], [0x7a2a28, 0.07], [0x4a5a3a, 0.07], [0xd8b860, 0.04],
    ],
  },
  rose: {
    bg: 0x030704,
    pop: [
      [0x1f8a3f, 0.28], [0x155a2c, 0.26], [0x2fae54, 0.18],
      [0x1e6a56, 0.14], [0x7ad890, 0.05], [0x3f8a80, 0.05], [0xb89040, 0.04],
    ],
  },
};

function pickBase(pop) {
  let r = Math.random();
  for (const [hex, p] of pop) { r -= p; if (r <= 0) return new THREE.Color(hex); }
  return new THREE.Color(pop[0][0]);
}

export function createField(scene, { max = 60000, initial = 28000 } = {}) {
  const count = max;
  const plane = new THREE.PlaneGeometry(1, 1);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = plane.index;
  geo.setAttribute('position', plane.attributes.position);
  geo.setAttribute('uv', plane.attributes.uv);
  geo.instanceCount = initial;

  const home = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const baseColor = new Float32Array(count * 3);
  const formPos = new Float32Array(count * 3);
  const formColor = new Float32Array(count * 3);
  const recruit = new Float32Array(count).fill(1e9);
  const release = new Float32Array(count).fill(2e9);
  const glyph = new Float32Array(count).fill(-1);
  const scale = new Float32Array(count);
  const formScale = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // a broad shallow slab — dense near the ground, thinning upward: a luminous meadow-fog
    home[i * 3] = (Math.random() - 0.5) * 84;
    home[i * 3 + 1] = 16 * Math.pow(Math.random(), 2.2) + 0.15;
    home[i * 3 + 2] = (Math.random() - 0.5) * 84;
    seed[i] = Math.random() * 1000;
    const c = pickBase(PALETTES.night.pop);
    baseColor[i * 3] = c.r; baseColor[i * 3 + 1] = c.g; baseColor[i * 3 + 2] = c.b;
    scale[i] = 0.26 + Math.random() * 0.14;
    formScale[i] = 0.38;
  }

  const add = (name, arr, itemSize) => {
    const a = new THREE.InstancedBufferAttribute(arr, itemSize);
    a.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute(name, a);
    return a;
  };
  const attrs = {
    aHome: add('aHome', home, 3),
    aSeed: add('aSeed', seed, 1),
    aBaseColor: add('aBaseColor', baseColor, 3),
    aFormPos: add('aFormPos', formPos, 3),
    aFormColor: add('aFormColor', formColor, 3),
    aRecruit: add('aRecruit', recruit, 1),
    aRelease: add('aRelease', release, 1),
    aGlyph: add('aGlyph', glyph, 1),
    aScale: add('aScale', scale, 1),
    aFormScale: add('aFormScale', formScale, 1),
  };

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uAtlas: { value: buildAtlas() },
      uAmbientTint: { value: new THREE.Vector3(1, 1, 1) },
      uAmbientCount: { value: AMBIENT_COUNT },
      uDenseStart: { value: DENSE_START },
      uDenseCount: { value: DENSE_COUNT },
      uAmbFloor: { value: 0.27 },
      uAmbAmp: { value: 0.18 },
      uAmbScale: { value: 1.0 },
      uFormBright: { value: 1.0 },
      uFormScale: { value: 1.0 },
      uFormAlpha: { value: 1.0 },
      uDrift: { value: 1.0 },
      uCycle: { value: 1.0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const busy = new Uint8Array(count);
  let paletteName = 'night';

  return {
    mesh,
    uniforms: mat.uniforms,
    get density() { return geo.instanceCount; },
    set density(n) { geo.instanceCount = Math.max(1000, Math.min(max, Math.round(n))); },
    get palette() { return paletteName; },
    setPalette(name) {
      const p = PALETTES[name];
      if (!p) return;
      paletteName = name;
      for (let i = 0; i < count; i++) {
        const c = pickBase(p.pop);
        baseColor[i * 3] = c.r; baseColor[i * 3 + 1] = c.g; baseColor[i * 3 + 2] = c.b;
      }
      attrs.aBaseColor.needsUpdate = true;
      scene.background = new THREE.Color(p.bg);
    },
    update(t) {
      mat.uniforms.uTime.value = t;
      // the night's temperature slowly turns
      const s = Math.sin(t * 0.07) * 0.5 + 0.5;
      mat.uniforms.uAmbientTint.value.set(
        1.0 - 0.12 * s, 0.96 + 0.0 * s, 0.9 + 0.22 * s
      );
    },

    // points: [{pos:Vector3, color:Color, glyph:int|-1, scale:number}] sorted bottom-up
    condense(anchor, points, tNow) {
      const order = [];
      for (let i = 0; i < count; i++) {
        if (busy[i]) continue;
        const dx = home[i * 3] - anchor.x, dy = home[i * 3 + 1] - anchor.y, dz = home[i * 3 + 2] - anchor.z;
        order.push([dx * dx + dy * dy + dz * dz, i]);
      }
      order.sort((a, b) => a[0] - b[0]);
      const n = Math.min(points.length, order.length);
      const taken = new Int32Array(n);
      for (let j = 0; j < n; j++) {
        const i = order[j][1];
        const p = points[j];
        taken[j] = i;
        busy[i] = 1;
        formPos[i * 3] = p.pos.x; formPos[i * 3 + 1] = p.pos.y; formPos[i * 3 + 2] = p.pos.z;
        formColor[i * 3] = p.color.r; formColor[i * 3 + 1] = p.color.g; formColor[i * 3 + 2] = p.color.b;
        glyph[i] = p.glyph ?? -1;
        formScale[i] = p.scale ?? 0.38;
        recruit[i] = tNow + j * 0.0035;   // bottom-up: points arrive lowest-first
        release[i] = 2e9;
      }
      for (const k of ['aFormPos', 'aFormColor', 'aGlyph', 'aFormScale', 'aRecruit', 'aRelease'])
        attrs[k].needsUpdate = true;
      return {
        release: (tR) => {
          for (let j = 0; j < n; j++) release[taken[j]] = tR + j * 0.003;
          attrs.aRelease.needsUpdate = true;
          setTimeout(() => { for (let j = 0; j < n; j++) busy[taken[j]] = 0; }, 9000);
        },
      };
    },
  };
}
