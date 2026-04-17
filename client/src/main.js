/**
 * Buzzer — 互動動畫模組入口
 *
 * 支援多個劇本模組，透過首頁選擇器切換：
 *   Module 0：偵探《老街失蹤疑雲》
 *   Module 1：經濟學家《信號 · 2007》
 */

import { CinematicPlayer } from './cinematic/renderer.js';
import { SCENES, SCENE_START } from './cinematic/script.js';
import { ECONOMIST_SCENES, ECONOMIST_SCENE_START } from './cinematic/economist-script.js';

const root = document.getElementById('app');

// ── 場景選擇器 ──────────────────────────────────────────────
function showSelector() {
  root.innerHTML = `
    <div id="module-selector">
      <div class="ms-backdrop"></div>
      <div class="ms-panel">
        <div class="ms-logo">🔍 Buzzer</div>
        <h1 class="ms-title">選擇模組</h1>
        <p class="ms-sub">每個模組蒐集不同的行為數據</p>
        <div class="ms-cards">
          <button class="ms-card" data-module="detective">
            <span class="ms-card-icon">🕵️</span>
            <div class="ms-card-body">
              <div class="ms-card-title">偵探模組</div>
              <div class="ms-card-desc">老街失蹤疑雲 · Chapter 0</div>
              <div class="ms-card-tag">反詐騙識別 · 推理判斷</div>
            </div>
            <span class="ms-card-arrow">→</span>
          </button>
          <button class="ms-card" data-module="economist">
            <span class="ms-card-icon">📈</span>
            <div class="ms-card-body">
              <div class="ms-card-title">經濟學家模組</div>
              <div class="ms-card-desc">信號 · 2007 → 2008 · Chapter 0</div>
              <div class="ms-card-tag">早期預警能力 · 系統性思維</div>
            </div>
            <span class="ms-card-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
    <style>
      #module-selector {
        position: fixed; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Noto Serif TC', Georgia, serif;
        z-index: 100;
      }
      .ms-backdrop {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at 40% 40%, #0f1e35 0%, #070d18 100%);
      }
      .ms-panel {
        position: relative; z-index: 1;
        width: min(480px, 92vw);
        text-align: center;
        padding: 2.5rem 2rem;
      }
      .ms-logo {
        font-size: 1rem; letter-spacing: .15em;
        color: rgba(180,150,100,.6); margin-bottom: 1.2rem;
        text-transform: uppercase;
      }
      .ms-title {
        font-size: 1.8rem; font-weight: 700;
        color: rgba(220,200,170,.92);
        margin: 0 0 .5rem;
      }
      .ms-sub {
        font-size: .82rem; color: rgba(160,140,110,.55);
        margin: 0 0 2.2rem; font-style: italic;
      }
      .ms-cards { display: flex; flex-direction: column; gap: 1rem; }
      .ms-card {
        display: flex; align-items: center; gap: 1.1rem;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(180,150,100,.15);
        border-radius: 10px; padding: 1.1rem 1.3rem;
        cursor: pointer; text-align: left;
        transition: background .2s, border-color .2s, transform .15s;
        color: inherit;
      }
      .ms-card:hover {
        background: rgba(180,150,100,.08);
        border-color: rgba(180,150,100,.4);
        transform: translateY(-2px);
      }
      .ms-card-icon { font-size: 1.8rem; flex-shrink: 0; }
      .ms-card-body { flex: 1; }
      .ms-card-title {
        font-size: 1rem; font-weight: 700;
        color: rgba(220,200,170,.92); margin-bottom: .25rem;
      }
      .ms-card-desc {
        font-size: .8rem; color: rgba(170,150,120,.7); margin-bottom: .3rem;
      }
      .ms-card-tag {
        font-size: .72rem; color: rgba(140,180,120,.6);
        font-style: italic;
      }
      .ms-card-arrow {
        font-size: 1.2rem; color: rgba(180,150,100,.4);
        transition: color .2s, transform .2s;
      }
      .ms-card:hover .ms-card-arrow {
        color: rgba(180,150,100,.8); transform: translateX(4px);
      }
    </style>
  `;

  root.querySelectorAll('.ms-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const mod = btn.dataset.module;
      root.innerHTML = '';
      if (mod === 'detective') {
        new CinematicPlayer(root, { scenes: SCENES, startId: SCENE_START }).start();
      } else {
        new CinematicPlayer(root, { scenes: ECONOMIST_SCENES, startId: ECONOMIST_SCENE_START }).start();
      }
    });
  });
}

showSelector();
