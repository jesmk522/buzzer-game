/**
 * Phase 2 偵探 — 入口。
 *
 * 流程：
 *   1. 載入劇本 A 的編譯後 ink JSON（scenarios/.../chapter-0.ink.json）
 *   2. 建立 DetectiveRuntime + SceneRenderer
 *   3. 開始玩
 */

import { DetectiveRuntime } from './engine/detective-runtime.js';
import { SceneRenderer } from './engine/scene-renderer.js';

const SCENARIO = 'detective-a-missing-elder';
const CHAPTER = 'chapter-0'; // compiled ink file: chapter-0.ink.json

async function main() {
  const root = document.getElementById('app');
  root.innerHTML = '<p>載入劇本中…</p>';

  const resp = await fetch(`/scenarios/${SCENARIO}/${CHAPTER}.ink.json`);
  if (!resp.ok) {
    root.innerHTML = '<p>❌ 找不到編譯後的 ink。請先跑 <code>npm run build:ink</code>。</p>';
    return;
  }
  const compiledInk = await resp.json();

  const sessionId = `sess_${crypto.randomUUID()}`;
  const playerId = localStorage.getItem('buzzer_player_id') || (() => {
    const id = `guest_${crypto.randomUUID()}`;
    localStorage.setItem('buzzer_player_id', id);
    return id;
  })();

  const runtime = new DetectiveRuntime({
    compiledInk,
    sessionId,
    playerId,
    scenario: SCENARIO,
    chapterId: CHAPTER,
  });

  new SceneRenderer(root, runtime);
  runtime.start();
}

main().catch((err) => {
  console.error(err);
  document.getElementById('app').innerHTML = `<pre style="color:red">${err.stack}</pre>`;
});
