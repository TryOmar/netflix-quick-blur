import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const USER_SCRIPT_HEADER = `// ==UserScript==
// @name         Netflix Quick Blur
// @namespace    https://github.com/TryOmar/netflix-quick-blur
// @version      1.0.0
// @description  Instant native-feeling privacy, blur & dimming controls for Netflix.
// @author       TryOmar
// @match        https://www.netflix.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @homepageURL  https://tryomar.github.io/netflix-quick-blur/
// @supportURL   https://github.com/TryOmar/netflix-quick-blur/issues
// @updateURL    https://tryomar.github.io/netflix-quick-blur/downloads/netflix-quick-blur.user.js
// @downloadURL  https://tryomar.github.io/netflix-quick-blur/downloads/netflix-quick-blur.user.js
// @license      MIT
// ==/UserScript==

`;

async function build() {
  const outdir = path.resolve('dist');
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, { recursive: true });
  }

  const outfile = path.join(outdir, 'netflix-quick-blur.user.js');

  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['chrome100', 'firefox100'],
    banner: {
      js: USER_SCRIPT_HEADER,
    },
    outfile,
    sourcemap: false,
    minify: false,
  });

  console.log(`✅ Built Userscript: ${outfile}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
