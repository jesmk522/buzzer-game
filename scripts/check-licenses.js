#!/usr/bin/env node
/**
 * Buzzer License Whitelist Checker（buzzer-game 版本，與 buzzer-mahjong 共用邏輯）。
 *
 * Whitelist: MIT, Apache-2.0, BSD-*, ISC, CC0-1.0, CC-BY-4.0, Unlicense, 0BSD
 * Blacklist: GPL*, AGPL*, LGPL*, CC-BY-SA*, SSPL*, Commons-Clause, BUSL
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const WHITELIST_REGEX = [
  /^MIT(-0)?$/i, /^Apache-2\.0$/i, /^BSD-(2|3)-Clause$/i, /^BSD$/i,
  /^ISC$/i, /^CC0-1\.0$/i, /^CC-BY-4\.0$/i, /^CC-BY-3\.0$/i, /^Unlicense$/i,
  /^0BSD$/i, /^Python-2\.0$/i, /^WTFPL$/i, /^Zlib$/i,
];
const BLACKLIST_REGEX = [
  /^GPL/i, /^AGPL/i, /^LGPL/i, /^CC-BY-SA/i, /^SSPL/i, /Commons-Clause/i, /^BUSL/i,
];
const INTERNAL_PACKAGES = new Set([
  'buzzer-game', '@buzzer-game/shared', '@buzzer-game/client', '@buzzer-game/server',
]);

function collectPackageJsons(root) {
  const results = [];
  const dirs = [
    path.join(root, 'node_modules'),
    path.join(root, 'client', 'node_modules'),
    path.join(root, 'server', 'node_modules'),
    path.join(root, 'shared', 'node_modules'),
  ];
  for (const nm of dirs) {
    if (fs.existsSync(nm)) walk(nm, results);
  }
  return results;
}

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === '.bin' || entry.name === '.cache') continue;
    const subpath = path.join(dir, entry.name);
    if (entry.name.startsWith('@')) { walk(subpath, out); continue; }
    const pkgPath = path.join(subpath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try { out.push({ pkgPath, json: JSON.parse(fs.readFileSync(pkgPath, 'utf8')) }); } catch {}
    }
    const nested = path.join(subpath, 'node_modules');
    if (fs.existsSync(nested)) walk(nested, out);
  }
}

function normalizeLicense(pkg) {
  if (!pkg) return 'UNKNOWN';
  if (typeof pkg.license === 'string') return pkg.license;
  if (pkg.license?.type) return pkg.license.type;
  if (Array.isArray(pkg.licenses) && pkg.licenses[0]?.type) return pkg.licenses[0].type;
  return 'UNKNOWN';
}

function testLicense(lic) {
  if (/\s(OR|AND)\s/i.test(lic) || lic.startsWith('(')) {
    const parts = lic.replace(/[()]/g, '').split(/\s(?:OR|AND)\s/i).map((s) => s.trim());
    if (parts.some((p) => BLACKLIST_REGEX.some((rx) => rx.test(p)))) return 'blacklisted';
    if (parts.every((p) => WHITELIST_REGEX.some((rx) => rx.test(p)))) return 'whitelisted';
    return 'unknown';
  }
  if (BLACKLIST_REGEX.some((rx) => rx.test(lic))) return 'blacklisted';
  if (WHITELIST_REGEX.some((rx) => rx.test(lic))) return 'whitelisted';
  return 'unknown';
}

function main() {
  const pkgs = collectPackageJsons(REPO_ROOT);
  const blacklisted = [], unknown = [];
  let whitelistedCount = 0;
  for (const { pkgPath, json } of pkgs) {
    const name = json.name || path.basename(path.dirname(pkgPath));
    if (INTERNAL_PACKAGES.has(name)) continue;
    const lic = normalizeLicense(json);
    const status = testLicense(lic);
    if (status === 'blacklisted') blacklisted.push({ name, version: json.version, license: lic });
    else if (status === 'unknown') unknown.push({ name, version: json.version, license: lic });
    else whitelistedCount++;
  }
  console.log(`\n🔐 Buzzer-game License Check`);
  console.log(`   Scanned ${pkgs.length} packages`);
  console.log(`   ✅ Whitelisted: ${whitelistedCount}`);
  console.log(`   ⚠️  Unknown:    ${unknown.length}`);
  console.log(`   🚫 Blacklisted: ${blacklisted.length}\n`);
  if (blacklisted.length) {
    console.log(`🚫 Blacklisted — BLOCKING:`);
    for (const p of blacklisted) console.log(`   - ${p.name}@${p.version} → ${p.license}`);
    process.exit(1);
  }
  if (unknown.length) {
    console.log(`\n⚠️  Unknown licenses (Ace review needed):`);
    for (const p of unknown.slice(0, 30)) console.log(`   - ${p.name}@${p.version} → ${p.license}`);
    if (unknown.length > 30) console.log(`   ... (${unknown.length - 30} more)`);
    console.log(`\n→ 更新 docs/LICENSES-REVIEW.md 後再 commit。`);
  }
  process.exit(0);
}

main();
