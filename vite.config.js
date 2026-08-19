/* ai-use: written by Claude (Fable 5) under direction, 19.08.26 — build fix only.
   Without this file Vite builds only index.html (the abandoned three.js circuit v0)
   and THE NIGHT never reaches dist/. Multi-page inputs so the piece and the studies
   all ship; the deploy should point visitors at term.html (the piece). */
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    watch: {
      // evidence and bundle dirs are written while the dev server runs
      // (screenshots, PDFs, the walk video, version freezes) — watching
      // them causes EBUSY crashes and phantom HMR reloads mid-verification
      ignored: ['**/export/**', '**/shots/**', '**/versions/**'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        term: resolve(__dirname, 'term.html'),    // THE NIGHT — the piece
        board: resolve(__dirname, 'board.html'),  // reference board
        field: resolve(__dirname, 'field.html'),  // study
        scene: resolve(__dirname, 'scene.html'),  // study
        circuit: resolve(__dirname, 'circuit.html'), // v0 circuit (superseded; kept as record)
        guide: resolve(__dirname, 'guide.html'),  // the walker's guide (GUIDE.md is canonical)
        index: resolve(__dirname, 'index.html'),  // landing — routes to term.html
      },
    },
  },
})
