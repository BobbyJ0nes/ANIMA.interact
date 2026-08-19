/* ai-use: written by Claude (Fable 5) under direction, 19.08.26 — export tooling
   only, no artwork content. Renders PROCESS.md and README.md to PDF for the
   Moodle bundle (the brief asks for the process doc "exported to a PDF or MD"). */
const { chromium } = require('playwright');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const DOCS = [
  ['PROCESS.md', 'PROCESS.pdf', 'ANIMA — process record'],
  ['README.md', 'README_LOG.pdf', 'ANIMA — living log'],
  ['GUIDE.md', 'GUIDE.pdf', 'ANIMA — the walker’s guide'],
];
const style = `<style>
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.6 Georgia, serif; color: #1d1b16; background: #faf7f0;
    max-width: 172mm; margin: 0 auto; padding: 14mm 0 18mm; }
  h1, h2, h3 { font-weight: 400; line-height: 1.25; }
  h1 { font-size: 20pt; margin: 0 0 4mm; }
  h2 { font-size: 13pt; margin: 8mm 0 2.5mm; border-bottom: 1px solid #1d1b16; padding-bottom: 1.2mm; }
  h3 { font-size: 11pt; margin: 5mm 0 1.5mm; color: #4a453b; }
  p, li { margin: 0 0 2.2mm; }
  ul, ol { padding-left: 6mm; }
  code { font: 8.5pt Consolas, monospace; background: #f0ece1; padding: .3mm 1.2mm; border-radius: 1mm; }
  pre { background: #f0ece1; border: 1px solid #ddd4c0; padding: 3mm; overflow-x: hidden;
    white-space: pre-wrap; font-size: 8pt; line-height: 1.5; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 2px solid #b3a482; margin: 2.5mm 0; padding: .5mm 0 .5mm 4mm;
    color: #6f6a5d; font-style: italic; }
  table { border-collapse: collapse; width: 100%; font-size: 9pt; margin: 2.5mm 0; }
  th, td { border-bottom: 1px solid #ddd4c0; text-align: left; padding: 1.4mm 2mm; vertical-align: top; }
  th { border-bottom: 2px solid #1d1b16; font-size: 8pt; text-transform: uppercase; letter-spacing: .06em; }
  hr { border: none; border-top: 1px dotted #b3a482; margin: 5mm 0; }
  .stamp { font: 7.5pt Consolas, monospace; letter-spacing: .12em; text-transform: uppercase;
    color: #98917f; margin-bottom: 6mm; }
</style>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [src, out, title] of DOCS) {
    const md = fs.readFileSync(path.join(__dirname, '..', src), 'utf8');
    const html = `<!doctype html><meta charset="utf-8"><title>${title}</title>${style}
      <div class="stamp">${title} · exported 19.08.2026 · anima.interact</div>` + marked.parse(md);
    const tmp = path.join(__dirname, '_' + src.replace('.md', '.html'));
    fs.writeFileSync(tmp, html);
    await page.goto('file:///' + tmp.replace(/\\/g, '/'), { waitUntil: 'load' });
    await page.pdf({ path: path.join(__dirname, out), format: 'A4', printBackground: true,
      margin: { top: '14mm', bottom: '14mm', left: '16mm', right: '16mm' } });
    fs.unlinkSync(tmp);
    console.log('OK', out);
  }
  await browser.close();
})();
