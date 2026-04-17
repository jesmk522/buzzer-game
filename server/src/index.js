/**
 * Buzzer 遊戲 server（Phase 1 問答 + Phase 2 偵探）
 *
 * 最小可跑版：提供 Evidence Pack 簽章 endpoint 與章節 ink JSON 靜態檔。
 */

import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHmacSigner, validateEvidencePack, canonicalize } from '@buzzer-game/shared/evidence-pack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const PORT = process.env.PORT || 4120;
const EVIDENCE_SECRET = process.env.EVIDENCE_SECRET || 'dev-only-do-not-use-in-prod';

const app = express();
app.use(express.json({ limit: '1mb' }));

// Serve compiled scenarios
app.use('/scenarios', express.static(path.join(REPO_ROOT, 'scenarios')));

// Health
app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

/**
 * POST /api/evidence/sign
 * body: { pack: <unsigned Evidence Pack> }
 * returns: { signature, signed_pack }
 */
app.post('/api/evidence/sign', async (req, res) => {
  const pack = req.body?.pack;
  const v = validateEvidencePack(pack);
  if (!v.valid) return res.status(400).json({ error: 'invalid_pack', details: v.errors });

  const signer = await createHmacSigner(EVIDENCE_SECRET);
  const unsigned = { ...pack };
  delete unsigned.signature;
  const sig = await signer(canonicalize(unsigned));
  res.json({ signature: sig, signed_pack: { ...unsigned, signature: sig } });
});

/**
 * GET /api/scenarios
 * 列出所有可玩的劇本
 */
app.get('/api/scenarios', async (req, res) => {
  const scenariosDir = path.join(REPO_ROOT, 'scenarios');
  const entries = await fs.readdir(scenariosDir, { withFileTypes: true });
  const manifests = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const manifestPath = path.join(scenariosDir, e.name, 'manifest.json');
    try {
      const raw = await fs.readFile(manifestPath, 'utf8');
      manifests.push(JSON.parse(raw));
    } catch {
      // skip
    }
  }
  res.json({ scenarios: manifests });
});

app.listen(PORT, () => {
  console.log(`[buzzer-game server] listening on http://localhost:${PORT}`);
  if (EVIDENCE_SECRET === 'dev-only-do-not-use-in-prod') {
    console.warn('⚠️  EVIDENCE_SECRET 未設定！僅限本機開發。');
  }
});
