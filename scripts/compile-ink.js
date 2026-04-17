#!/usr/bin/env node
/**
 * compile-ink — 將 scenarios/<name>/*.ink 編譯成 *.ink.json 供 client 執行。
 *
 * 依賴：inklecate（inkle 官方 CLI，Apache-2.0）
 *   brew install inkle/tools/inklecate  （macOS）
 *   或從 https://github.com/inkle/ink/releases 下載對應平台的 binary
 *
 * 若找不到 inklecate，會 fallback 輸出說明訊息但不阻擋 build。
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const SCENARIOS = path.join(REPO_ROOT, 'scenarios');

// Candidate locations: PATH + common local install paths
const INKLECATE_CANDIDATES = [
  'inklecate',
  path.join(process.env.HOME || '', 'bin', 'inklecate'),
  '/usr/local/bin/inklecate',
  '/opt/homebrew/bin/inklecate',
];

function findInklecate() {
  for (const cmd of INKLECATE_CANDIDATES) {
    // For absolute paths, check if the file exists first.
    if (cmd.startsWith('/') || cmd.startsWith(process.env.HOME || '~')) {
      if (!fs.existsSync(cmd)) continue;
      return cmd; // file exists → assume it's inklecate
    }
    // For bare command names, try spawning and check for exit (inklecate exits 1 with no args).
    try {
      execSync(`command -v "${cmd}"`, { stdio: 'ignore' });
      return cmd;
    } catch { /* not in PATH */ }
  }
  return null;
}

const INKLECATE = findInklecate();

function compileAll() {
  if (!fs.existsSync(SCENARIOS)) {
    console.log('No scenarios directory.');
    return;
  }
  const entries = fs.readdirSync(SCENARIOS, { withFileTypes: true });
  let compiled = 0;
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(SCENARIOS, e.name);
    const inkFiles = fs.readdirSync(dir).filter((f) => f.endsWith('.ink'));
    for (const ink of inkFiles) {
      const full = path.join(dir, ink);
      const out = full.replace(/\.ink$/, '.ink.json');
      try {
        execSync(`"${INKLECATE}" -o "${out}" "${full}"`, { stdio: 'inherit' });
        compiled++;
      } catch (err) {
        console.error(`Failed to compile ${full}`);
      }
    }
  }
  console.log(`✅ Compiled ${compiled} ink file(s)`);
}

if (!INKLECATE) {
  console.log(`
⚠️  inklecate CLI not found — skipping ink compile.
    安裝方式：
      macOS:  brew install inkle/tools/inklecate
      或從 https://github.com/inkle/ink/releases 下載 inklecate_mac.zip
      解壓後將 inklecate binary 放到 ~/bin/inklecate 並 chmod +x

    本次跳過，但 Day 11 之前必須安裝才能測試劇本 A。
`);
  process.exit(0);
}

compileAll();
