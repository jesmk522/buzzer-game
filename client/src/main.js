/**
 * Buzzer — 互動行為驗證模組
 *
 * 偵探系列（反詐騙識別）
 *   C0 老街失蹤疑雲  — 假親情詐騙
 *   C1 數字遊戲      — LINE 投資 / 殺豬盤
 *   C2 電話那頭      — 假冒公務員
 *
 * 經濟學家系列（金融危機決策）
 *   C0 信號·2007     — 次貸 / 雷曼
 *   C1 泰銖的骨牌    — 1997 亞洲金融風暴
 *   C2 黑天鵝的重量  — COVID-19 2020
 */

import { CinematicPlayer } from './cinematic/renderer.js';

// 偵探系列
import { SCENES       as DET_C0, SCENE_START              as DET_C0_START } from './cinematic/script.js';
import { DETECTIVE_C1_SCENES,    DETECTIVE_C1_START }                        from './cinematic/detective-c1-script.js';
import { DETECTIVE_C2_SCENES,    DETECTIVE_C2_START }                        from './cinematic/detective-c2-script.js';

// 經濟學家系列
import { ECONOMIST_SCENES    as ECO_C0, ECONOMIST_SCENE_START  as ECO_C0_START } from './cinematic/economist-script.js';
import { ECONOMIST_C1_SCENES,           ECONOMIST_C1_START }                      from './cinematic/economist-c1-script.js';
import { ECONOMIST_C2_SCENES,           ECONOMIST_C2_START }                      from './cinematic/economist-c2-script.js';

// ── 模組清單 ─────────────────────────────────────────────────
const MODULES = {
  detective: [
    {
      id:    'det_c0',
      title: '老街失蹤疑雲',
      sub:   'Chapter 0',
      tag:   '假親情詐騙 · 推理判斷',
      scenes: DET_C0,
      start:  DET_C0_START,
    },
    {
      id:    'det_c1',
      title: '數字遊戲',
      sub:   'Chapter 1',
      tag:   'LINE 投資詐騙 · 話術識別',
      scenes: DETECTIVE_C1_SCENES,
      start:  DETECTIVE_C1_START,
    },
    {
      id:    'det_c2',
      title: '電話那頭',
      sub:   'Chapter 2',
      tag:   '假冒公務員 · 機構權威解除',
      scenes: DETECTIVE_C2_SCENES,
      start:  DETECTIVE_C2_START,
    },
  ],
  economist: [
    {
      id:    'eco_c0',
      title: '信號 · 2007',
      sub:   'Chapter 0',
      tag:   '次貸危機 · 早期預警',
      scenes: ECO_C0,
      start:  ECO_C0_START,
    },
    {
      id:    'eco_c1',
      title: '泰銖的骨牌',
      sub:   'Chapter 1',
      tag:   '1997 亞洲金融風暴 · 傳染效應',
      scenes: ECONOMIST_C1_SCENES,
      start:  ECONOMIST_C1_START,
    },
    {
      id:    'eco_c2',
      title: '黑天鵝的重量',
      sub:   'Chapter 2',
      tag:   'COVID-19 2020 · 不確定下的判斷',
      scenes: ECONOMIST_C2_SCENES,
      start:  ECONOMIST_C2_START,
    },
  ],
};

// ── 選擇器 ───────────────────────────────────────────────────
const root = document.getElementById('app');

function showSelector() {
  const detCards = MODULES.detective.map(m => cardHTML(m)).join('');
  const ecoCards  = MODULES.economist.map(m => cardHTML(m)).join('');

  root.innerHTML = `
    <div id="module-selector">
      <div class="ms-bg"></div>
      <div class="ms-scroll">
        <div class="ms-panel">
          <div class="ms-logo">🔍 Buzzer</div>
          <h1 class="ms-title">選擇模組</h1>
          <p class="ms-sub">每個模組蒐集不同向度的行為數據</p>

          <div class="ms-group">
            <div class="ms-group-header">
              <span class="ms-group-icon">🕵️</span>
              <span class="ms-group-name">偵探系列</span>
              <span class="ms-group-desc">反詐騙識別 · 推理判斷</span>
            </div>
            <div class="ms-cards">${detCards}</div>
          </div>

          <div class="ms-group">
            <div class="ms-group-header">
              <span class="ms-group-icon">📈</span>
              <span class="ms-group-name">經濟學家系列</span>
              <span class="ms-group-desc">金融危機決策 · 風險識別</span>
            </div>
            <div class="ms-cards">${ecoCards}</div>
          </div>
        </div>
      </div>
    </div>
    ${selectorCSS()}
  `;

  root.querySelectorAll('.ms-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const mod = [...MODULES.detective, ...MODULES.economist].find(m => m.id === id);
      if (!mod) return;
      root.innerHTML = '';
      new CinematicPlayer(root, { scenes: mod.scenes, startId: mod.start }).start();
    });
  });
}

function cardHTML(m) {
  return `
    <button class="ms-card" data-id="${m.id}">
      <div class="ms-card-meta">${m.sub}</div>
      <div class="ms-card-title">${m.title}</div>
      <div class="ms-card-tag">${m.tag}</div>
      <span class="ms-card-arrow">→</span>
    </button>`;
}

function selectorCSS() {
  return `<style>
    #module-selector {
      position: fixed; inset: 0;
      font-family: 'Noto Serif TC', Georgia, serif;
      z-index: 100;
    }
    .ms-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 35% 30%, #0f1e38 0%, #060c18 100%);
    }
    .ms-scroll {
      position: relative; z-index: 1;
      height: 100%; overflow-y: auto;
      display: flex; justify-content: center;
      padding: 2.5rem 1rem 3rem;
    }
    .ms-panel {
      width: min(520px, 100%);
      display: flex; flex-direction: column; gap: 0;
    }
    .ms-logo {
      font-size: 0.78rem; letter-spacing: .18em; text-transform: uppercase;
      color: rgba(180,150,100,.5); margin-bottom: 1rem;
    }
    .ms-title {
      font-size: 1.9rem; font-weight: 700; margin: 0 0 .4rem;
      color: rgba(225,205,175,.93);
    }
    .ms-sub {
      font-size: .8rem; color: rgba(160,140,110,.5);
      margin: 0 0 2.4rem; font-style: italic;
    }
    .ms-group { margin-bottom: 2rem; }
    .ms-group-header {
      display: flex; align-items: center; gap: .6rem;
      margin-bottom: .9rem;
    }
    .ms-group-icon { font-size: 1.1rem; }
    .ms-group-name {
      font-size: .95rem; font-weight: 700;
      color: rgba(210,190,155,.85);
    }
    .ms-group-desc {
      font-size: .72rem; color: rgba(140,120,90,.55);
      margin-left: .3rem; font-style: italic;
    }
    .ms-cards { display: flex; flex-direction: column; gap: .65rem; }
    .ms-card {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto auto;
      gap: .12rem .8rem;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(180,150,100,.12);
      border-radius: 9px; padding: .85rem 1.1rem;
      cursor: pointer; text-align: left; color: inherit;
      transition: background .2s, border-color .2s, transform .15s;
    }
    .ms-card:hover {
      background: rgba(180,150,100,.07);
      border-color: rgba(180,150,100,.35);
      transform: translateX(4px);
    }
    .ms-card-meta {
      font-size: .68rem; letter-spacing: .06em; text-transform: uppercase;
      color: rgba(140,170,120,.55); grid-column: 1;
    }
    .ms-card-title {
      font-size: .98rem; font-weight: 700;
      color: rgba(220,200,170,.9); grid-column: 1;
    }
    .ms-card-tag {
      font-size: .73rem; color: rgba(160,140,110,.55);
      font-style: italic; grid-column: 1;
    }
    .ms-card-arrow {
      grid-column: 2; grid-row: 1 / 4;
      align-self: center; font-size: 1.1rem;
      color: rgba(180,150,100,.3);
      transition: color .2s, transform .2s;
    }
    .ms-card:hover .ms-card-arrow {
      color: rgba(180,150,100,.75); transform: translateX(3px);
    }
  </style>`;
}

showSelector();
