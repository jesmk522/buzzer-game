/**
 * CinematicPlayer — 互動動畫播放器
 *
 * 版面：左側 62% 場景動畫（CSS + SVG）／右側 38% 旁白走字
 * 支援分支劇情：場景結束後若有 choice，底部滑出選項卡等用戶點選。
 */

// ─────────────────────────────────────────────────────────────────────────────
// CSS（注入一次）
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500&display=swap');

#cin-stage {
  position: fixed; inset: 0;
  display: flex;
  background: #050d15;
  overflow: hidden;
  z-index: 9999;
  font-family: 'Noto Serif TC', 'Noto Serif', 'PingFang TC', 'Heiti TC', serif;
}

/* ── 場景面板 ─── */
#cin-scene-panel {
  flex: 0 0 62%;
  position: relative;
  overflow: hidden;
}
/* #cin-scene-art 覆蓋整個面板，transition filter 讓整體氛圍可以隨 beat 變化 */
#cin-scene-art {
  position: absolute; inset: 0;
  transition: filter 1.4s ease;
}
#cin-scene-art svg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  display: block;
}

/* ── 場景 × Beat 氛圍調整 ─── */
/* dawn */
#cin-scene-art[data-scene="dawn"][data-beat="2"] { filter: brightness(1.08); }
#cin-scene-art[data-scene="dawn"][data-beat="3"] { filter: brightness(1.12) sepia(0.08); }
/* diary */
#cin-scene-art[data-scene="diary"][data-beat="1"] { filter: brightness(1.18) contrast(1.06); }
#cin-scene-art[data-scene="diary"][data-beat="2"] { filter: brightness(1.14) contrast(1.1) sepia(0.12); }
/* shop */
#cin-scene-art[data-scene="shop"][data-beat="2"] { filter: brightness(0.92) sepia(0.06); }
#cin-scene-art[data-scene="shop"][data-beat="3"] { filter: brightness(1.08) sepia(0.05); }
/* pawn */
#cin-scene-art[data-scene="pawn"][data-beat="1"] { filter: brightness(1.06) sepia(0.08); }
#cin-scene-art[data-scene="pawn"][data-beat="3"] { filter: brightness(1.1) sepia(0.12) saturate(1.1); }
/* bank — 逐漸緊張 */
#cin-scene-art[data-scene="bank"][data-beat="2"] { filter: brightness(0.92) hue-rotate(-6deg); }
#cin-scene-art[data-scene="bank"][data-beat="3"] { filter: brightness(0.87) hue-rotate(-10deg) saturate(1.12); }
#cin-scene-art[data-scene="bank"][data-beat="5"] { filter: brightness(0.83) sepia(0.1); }
/* bank_lite */
#cin-scene-art[data-scene="bank_lite"][data-beat="1"] { filter: brightness(0.9) hue-rotate(-8deg); }
#cin-scene-art[data-scene="bank_lite"][data-beat="2"] { filter: brightness(0.85) sepia(0.1); }
/* police */
#cin-scene-art[data-scene="police_full"][data-beat="2"] { filter: brightness(1.1); }
#cin-scene-art[data-scene="police_full"][data-beat="3"] { filter: brightness(1.18) contrast(1.06); }
#cin-scene-art[data-scene="police_lite"][data-beat="2"] { filter: brightness(1.12) contrast(1.06); }
/* reunion — 逐漸暖場 */
#cin-scene-art[data-scene="reunion"][data-beat="0"] { filter: brightness(0.88); }
#cin-scene-art[data-scene="reunion"][data-beat="2"] { filter: brightness(1.06) sepia(0.1); }
#cin-scene-art[data-scene="reunion"][data-beat="3"] { filter: brightness(1.12) sepia(0.18) saturate(1.12); }
#cin-scene-art[data-scene="reunion"][data-beat="4"] { filter: brightness(1.22) sepia(0.25) saturate(1.2); }
.scene-label-overlay {
  position: absolute;
  bottom: 1.4rem; left: 1.8rem;
  color: rgba(255,255,255,0.28);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  pointer-events: none;
}

/* ── 旁白面板 ─── */
#cin-narration {
  flex: 0 0 38%;
  display: flex;
  flex-direction: column;
  background: rgba(3,10,18,0.88);
  border-left: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
}
#cin-header {
  padding: 1.7rem 1.5rem 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}
#cin-scene-num {
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  color: rgba(200,152,58,0.72);
  text-transform: uppercase;
  margin-bottom: 0.28rem;
}
#cin-scene-title {
  font-size: 1.08rem;
  color: rgba(245,238,222,0.9);
  font-weight: 400;
  letter-spacing: 0.04em;
}
#cin-beats {
  flex: 1;
  overflow-y: auto;
  padding: 1.4rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  scroll-behavior: smooth;
}
#cin-beats::-webkit-scrollbar { width: 2px; }
#cin-beats::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
#cin-progress { height: 2px; background: rgba(255,255,255,0.05); flex-shrink: 0; }
#cin-progress-fill { height: 100%; background: rgba(200,152,58,0.55); transition: width 0.6s linear; width: 0%; }

/* ── Beat 樣式 ─── */
.cin-beat { animation: beatIn 0.4s ease forwards; opacity: 0; }
@keyframes beatIn {
  from { opacity: 0; transform: translateY(7px); }
  to   { opacity: 1; transform: translateY(0); }
}

.b-narrate .cin-text {
  color: rgba(195,205,216,0.9);
  font-size: 0.97rem;
  line-height: 1.95;
}
.b-dialogue .cin-speaker {
  display: block;
  font-size: 0.65rem;
  color: rgba(200,152,58,0.85);
  letter-spacing: 0.18em;
  margin-bottom: 0.32rem;
}
.b-dialogue .cin-text {
  color: rgba(242,236,222,0.94);
  font-size: 1rem;
  line-height: 1.82;
}
.b-annotation {
  padding: 0.68rem 1rem 0.68rem 0.9rem;
  border-left: 2.5px solid rgba(200,58,48,0.65);
  background: rgba(200,58,48,0.06);
  border-radius: 0 5px 5px 0;
}
.b-annotation .cin-text {
  color: rgba(255,172,158,0.92);
  font-size: 0.95rem;
  line-height: 1.85;
}
.b-deduction {
  padding: 0.9rem 1.1rem;
  background: rgba(28,62,108,0.35);
  border: 1px solid rgba(75,138,210,0.22);
  border-radius: 7px;
  animation: deductionIn 0.8s ease forwards;
  opacity: 0;
}
@keyframes deductionIn {
  from { opacity: 0; box-shadow: 0 0 0 rgba(75,138,210,0); }
  to   { opacity: 1; box-shadow: 0 0 20px rgba(75,138,210,0.12); }
}
.b-deduction .cin-text {
  color: rgba(172,215,255,0.94);
  font-size: 0.97rem;
  line-height: 1.85;
}
.b-epilogue {
  padding: 0.8rem 1rem;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 6px;
}
.b-epilogue .cin-text {
  color: rgba(155,155,158,0.82);
  font-size: 0.85rem;
  line-height: 1.9;
  letter-spacing: 0.02em;
}

/* ── 線索卡 ─── */
.cin-clue {
  display: flex; align-items: flex-start; gap: 0.7rem;
  padding: 0.7rem 1rem;
  background: rgba(195,148,38,0.09);
  border: 1px solid rgba(195,148,38,0.28);
  border-radius: 7px;
  animation: clueIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
  opacity: 0;
}
@keyframes clueIn {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}
.cin-clue-icon { font-size: 1.2rem; margin-top: 0.05rem; }
.cin-clue-label { display: block; font-size: 0.68rem; color: rgba(200,152,58,0.88); font-weight: 500; letter-spacing: 0.07em; margin-bottom: 0.18rem; }
.cin-clue-detail { font-size: 0.62rem; color: rgba(170,170,170,0.65); }

/* ── 結局蓋板 ─── */
#cin-ending-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(3,10,18,0.95);
  backdrop-filter: blur(20px);
  animation: fadeIn 1.8s ease forwards;
  z-index: 200;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.cin-ending-card {
  text-align: center;
  padding: 2.5rem 3rem;
  border: 1px solid rgba(200,152,58,0.18);
  border-radius: 14px;
  background: rgba(255,255,255,0.018);
  max-width: 380px;
}
.cin-ending-card h2 { font-size: 1.25rem; color: rgba(200,152,58,0.9); margin-bottom: 1.5rem; letter-spacing: 0.1em; }
.cin-ep-row { display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.78rem; }
.cin-ep-row:last-of-type { border-bottom: none; }
.cin-ep-key { color: rgba(155,155,158,0.7); }
.cin-ep-val { color: rgba(230,224,208,0.9); text-align: right; }
.cin-ep-tag { display: inline-block; margin: 0.25rem 0.15rem 0; padding: 0.18rem 0.5rem; background: rgba(75,138,210,0.12); border: 1px solid rgba(75,138,210,0.25); border-radius: 100px; color: rgba(150,195,255,0.85); font-size: 0.62rem; letter-spacing: 0.04em; }
.cin-ep-badge { display: inline-block; margin-top: 1.2rem; padding: 0.35rem 1rem; background: rgba(60,150,80,0.14); border: 1px solid rgba(80,180,100,0.28); border-radius: 100px; color: rgba(120,200,130,0.9); font-size: 0.72rem; letter-spacing: 0.08em; }
#cin-replay-btn { margin-top: 1.5rem; padding: 0.6rem 1.5rem; background: transparent; border: 1px solid rgba(200,152,58,0.35); border-radius: 6px; color: rgba(200,152,58,0.8); font-size: 0.78rem; font-family: inherit; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; }
#cin-replay-btn:hover { background: rgba(200,152,58,0.1); border-color: rgba(200,152,58,0.6); color: rgba(200,152,58,1); }

/* ── 選項區 ─── */
#cin-choice-area {
  padding: 1rem 1.5rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
  animation: choiceIn 0.5s ease forwards;
}
@keyframes choiceIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
#cin-choice-area.hidden { display: none; }
.cin-choice-prompt {
  font-size: 0.6rem;
  color: rgba(200,152,58,0.72);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.cin-choice-btn {
  display: flex; align-items: flex-start; gap: 0.6rem;
  width: 100%;
  padding: 0.7rem 0.9rem;
  margin-bottom: 0.45rem;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: rgba(228,222,208,0.88);
  font-size: 0.82rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
  line-height: 1.6;
}
.cin-choice-btn:hover {
  background: rgba(200,152,58,0.1);
  border-color: rgba(200,152,58,0.35);
  color: rgba(245,238,222,0.96);
}
.cin-choice-btn.selected {
  background: rgba(200,152,58,0.13);
  border-color: rgba(200,152,58,0.55);
  color: rgba(245,238,222,0.96);
  pointer-events: none;
}
.cin-choice-btn.dimmed { opacity: 0.3; pointer-events: none; }
.cin-choice-icon { font-size: 0.95rem; flex-shrink: 0; margin-top: 0.15rem; }
.cin-chosen-record {
  padding: 0.4rem 0.75rem;
  background: rgba(200,152,58,0.06);
  border-left: 2px solid rgba(200,152,58,0.38);
  border-radius: 0 5px 5px 0;
  font-size: 0.7rem;
  color: rgba(200,152,58,0.68);
  font-style: italic;
  animation: beatIn 0.3s ease forwards;
  opacity: 0;
}

/* ── SVG 動畫 ─── */
@keyframes fogDrift  { 0%,100%{transform:translateX(0);opacity:.045} 50%{transform:translateX(28px);opacity:.08} }
@keyframes fogDrift2 { 0%,100%{transform:translateX(0);opacity:.055} 50%{transform:translateX(-22px);opacity:.09} }
@keyframes fogDrift3 { 0%,100%{transform:translateX(0);opacity:.03}  50%{transform:translateX(18px);opacity:.06} }
@keyframes glowPulse { 0%,100%{opacity:.45} 50%{opacity:.82} }
@keyframes flicker   { 0%,90%,100%{opacity:1} 92%{opacity:.28} 94%{opacity:.9} 96%{opacity:.35} }
@keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes sceneIn   { from{opacity:0} to{opacity:1} }
@keyframes sunrise   { from{opacity:0;transform:scaleY(0.8)} to{opacity:1;transform:scaleY(1)} }
@keyframes embrace   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

@keyframes steamRise {
  0%   { transform: translateY(0)    scaleX(1);   opacity: 0.28; }
  60%  { transform: translateY(-22px) scaleX(1.4); opacity: 0.12; }
  100% { transform: translateY(-42px) scaleX(0.7); opacity: 0; }
}
.steam-1 { animation: steamRise 3.2s ease-in-out infinite; }
.steam-2 { animation: steamRise 3.2s ease-in-out infinite 1.1s; }
.steam-3 { animation: steamRise 3.2s ease-in-out infinite 2.2s; }

.fog-a  { animation: fogDrift  9s  ease-in-out infinite; }
.fog-b  { animation: fogDrift2 13s ease-in-out infinite 2s; }
.fog-c  { animation: fogDrift3 17s ease-in-out infinite 5s; }
.glow   { animation: glowPulse 4s  ease-in-out infinite; }
.lamp   { animation: flicker   11s ease-in-out infinite; }
.float  { animation: float     5s  ease-in-out infinite; }
.scene-in { animation: sceneIn 1.3s ease forwards; }
.sunrise  { animation: sunrise 2s  ease forwards; }
.embrace  { animation: embrace 1.5s ease forwards 0.5s; opacity: 0; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SVG 場景藝術
// ─────────────────────────────────────────────────────────────────────────────
const SCENE_ART = {

  // 老街清晨
  dawn: `<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" class="scene-in" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="d-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#070e1a"/>
      <stop offset="65%"  stop-color="#0d1f35"/>
      <stop offset="100%" stop-color="#0a1525"/>
    </linearGradient>
    <radialGradient id="d-lamp" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#f5c842" stop-opacity=".38"/>
      <stop offset="100%" stop-color="#f5c842" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="d-win" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#2a5a8a" stop-opacity=".7"/>
      <stop offset="100%" stop-color="#1a3a6a" stop-opacity=".3"/>
    </radialGradient>
    <filter id="f-blur"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="f-soft"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>

  <!-- 天空 -->
  <rect width="800" height="520" fill="url(#d-sky)"/>

  <!-- 星 -->
  <circle cx="100" cy="45"  r="1.2" fill="white" opacity=".55"/>
  <circle cx="190" cy="28"  r="1.5" fill="white" opacity=".45"/>
  <circle cx="310" cy="60"  r="1"   fill="white" opacity=".65"/>
  <circle cx="460" cy="35"  r="1.3" fill="white" opacity=".5"/>
  <circle cx="580" cy="52"  r="1"   fill="white" opacity=".6"/>
  <circle cx="680" cy="22"  r="1.5" fill="white" opacity=".42"/>
  <circle cx="740" cy="68"  r="1"   fill="white" opacity=".55"/>

  <!-- 霧 -->
  <ellipse class="fog-a" cx="180" cy="400" rx="240" ry="90"  fill="white" filter="url(#f-blur)"/>
  <ellipse class="fog-b" cx="520" cy="370" rx="300" ry="100" fill="white" filter="url(#f-blur)"/>
  <ellipse class="fog-c" cx="360" cy="440" rx="350" ry="80"  fill="white" filter="url(#f-blur)"/>

  <!-- 左棟建築 -->
  <rect x="0"   y="80"  width="200" height="440" fill="#070e18"/>
  <rect x="0"   y="80"  width="200" height="18"  fill="#0a1620"/>
  <!-- 左窗 -->
  <rect x="18"  y="105" width="26" height="32" fill="url(#d-win)" rx="2"/>
  <rect x="58"  y="105" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".6"/>
  <rect x="98"  y="105" width="26" height="32" fill="#0c1e32" rx="2" opacity=".5"/>
  <rect x="138" y="105" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".75"/>
  <rect x="18"  y="155" width="26" height="32" fill="#0c1e32" rx="2" opacity=".4"/>
  <rect x="58"  y="155" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".85"/>
  <rect x="98"  y="155" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".5"/>
  <rect x="138" y="155" width="26" height="32" fill="#0c1e32" rx="2" opacity=".55"/>
  <rect x="18"  y="205" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".45"/>
  <rect x="98"  y="205" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".65"/>

  <!-- 中間矮房 -->
  <rect x="190" y="240" width="130" height="280" fill="#090e18"/>
  <rect x="195" y="245" width="42"  height="50"  fill="url(#d-win)" rx="2" opacity=".55"/>
  <rect x="250" y="245" width="42"  height="50"  fill="#0c1e32" rx="2" opacity=".4"/>

  <!-- 右棟建築 -->
  <rect x="580" y="55" width="220" height="465" fill="#060c16"/>
  <rect x="580" y="55" width="220" height="16"  fill="#09131f"/>
  <!-- 右窗 -->
  <rect x="596" y="80"  width="26" height="32" fill="url(#d-win)" rx="2" opacity=".65"/>
  <rect x="638" y="80"  width="26" height="32" fill="url(#d-win)" rx="2" opacity=".85"/>
  <rect x="680" y="80"  width="26" height="32" fill="#0c1e32" rx="2" opacity=".55"/>
  <rect x="722" y="80"  width="26" height="32" fill="url(#d-win)" rx="2" opacity=".5"/>
  <rect x="596" y="130" width="26" height="32" fill="#0c1e32" rx="2" opacity=".35"/>
  <rect x="638" y="130" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".7"/>
  <rect x="722" y="130" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".55"/>
  <rect x="596" y="180" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".6"/>
  <rect x="680" y="180" width="26" height="32" fill="url(#d-win)" rx="2" opacity=".4"/>

  <!-- 地面 -->
  <rect x="0" y="435" width="800" height="85" fill="#060c16"/>
  <line x1="0" y1="435" x2="800" y2="435" stroke="#0e2040" stroke-width="1.5"/>
  <!-- 地面反光 -->
  <rect x="0" y="435" width="800" height="18" fill="#091525" opacity=".5"/>

  <!-- 路燈 -->
  <line x1="338" y1="100" x2="338" y2="435" stroke="#253545" stroke-width="6"/>
  <line x1="312" y1="100" x2="364" y2="100" stroke="#253545" stroke-width="5"/>
  <circle class="lamp" cx="312" cy="98" r="7" fill="#f5c842" opacity=".95"/>
  <!-- 燈暈 -->
  <ellipse class="glow" cx="315" cy="102" rx="95" ry="70" fill="url(#d-lamp)" filter="url(#f-soft)"/>
  <!-- 光錐（地面） -->
  <polygon points="285,115 200,435 420,435" fill="#f5c842" opacity=".018"/>

  <!-- 人物：陳秀蘭（左，矮，拉袖子） -->
  <g transform="translate(430,305)">
    <ellipse cx="0" cy="-17" rx="13" ry="16" fill="#040a12"/>
    <path d="M -6,-32 Q 0,-44 6,-32" fill="#040a12"/>
    <rect x="-12" y="-2" width="24" height="52" fill="#040a12" rx="5"/>
    <rect x="-10" y="48" width="9"  height="34" fill="#040a12" rx="3"/>
    <rect x="1"   y="48" width="9"  height="34" fill="#040a12" rx="3"/>
    <!-- 伸手拉袖 -->
    <path d="M 12,8 Q 28,2 42,10" stroke="#040a12" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M -12,8 Q -20,22 -18,38" stroke="#040a12" stroke-width="7" fill="none" stroke-linecap="round"/>
  </g>

  <!-- 人物：偵探（右，稍高，偵探帽） -->
  <g transform="translate(500,285)">
    <ellipse cx="0" cy="-22" rx="14" ry="18" fill="#040a12"/>
    <!-- 帽子 -->
    <rect x="-18" y="-42" width="36" height="8" fill="#040a12" rx="2"/>
    <rect x="-12" y="-58" width="24" height="20" fill="#040a12" rx="4"/>
    <!-- 大衣 -->
    <rect x="-15" y="-4" width="30" height="58" fill="#040a12" rx="5"/>
    <rect x="-10" y="52" width="10" height="38" fill="#040a12" rx="3"/>
    <rect x="2"   y="52" width="10" height="38" fill="#040a12" rx="3"/>
    <!-- 手（接收冊子的姿勢） -->
    <path d="M -15,10 Q -32,18 -42,14" stroke="#040a12" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M 15,10 Q 22,25 20,38" stroke="#040a12" stroke-width="7" fill="none" stroke-linecap="round"/>
  </g>
</svg>`,

  // 阿公日記
  diary: `<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" class="scene-in" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="p-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1a1008"/>
      <stop offset="100%" stop-color="#2a1c0e"/>
    </linearGradient>
    <linearGradient id="p-paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#f5ead8"/>
      <stop offset="100%" stop-color="#e8d8bc"/>
    </linearGradient>
    <radialGradient id="p-light" cx="50%" cy="30%" r="70%">
      <stop offset="0%"   stop-color="#f0c060" stop-opacity=".18"/>
      <stop offset="100%" stop-color="#f0c060" stop-opacity="0"/>
    </radialGradient>
    <filter id="p-shadow"><feDropShadow dx="4" dy="8" stdDeviation="12" flood-opacity=".5"/></filter>
  </defs>

  <rect width="800" height="520" fill="url(#p-bg)"/>
  <!-- 環境光 -->
  <ellipse cx="400" cy="160" rx="360" ry="220" fill="url(#p-light)"/>

  <!-- 書本（打開狀態） -->
  <!-- 左頁 -->
  <rect x="100" y="80" width="270" height="360" fill="#e4d4b4" rx="3" filter="url(#p-shadow)"/>
  <!-- 左頁行線 -->
  <line x1="120" y1="120" x2="352" y2="120" stroke="#c8b898" stroke-width="1" opacity=".6"/>
  <line x1="120" y1="148" x2="352" y2="148" stroke="#c8b898" stroke-width="1" opacity=".5"/>
  <line x1="120" y1="176" x2="352" y2="176" stroke="#c8b898" stroke-width="1" opacity=".5"/>
  <line x1="120" y1="204" x2="352" y2="204" stroke="#c8b898" stroke-width="1" opacity=".5"/>
  <line x1="120" y1="232" x2="352" y2="232" stroke="#c8b898" stroke-width="1" opacity=".5"/>
  <!-- 左頁文字 -->
  <rect x="128" y="113" width="110" height="5" fill="#8a7a62" rx="2" opacity=".5"/>
  <rect x="128" y="141" width="145" height="5" fill="#8a7a62" rx="2" opacity=".45"/>
  <rect x="128" y="169" width="128" height="5" fill="#8a7a62" rx="2" opacity=".5"/>
  <rect x="128" y="197" width="160" height="5" fill="#8a7a62" rx="2" opacity=".42"/>
  <rect x="128" y="225" width="98"  height="5" fill="#8a7a62" rx="2" opacity=".48"/>

  <!-- 右頁 -->
  <rect x="430" y="80" width="270" height="360" fill="url(#p-paper)" rx="3" filter="url(#p-shadow)"/>
  <!-- 右頁行線 -->
  <line x1="450" y1="120" x2="682" y2="120" stroke="#c8b898" stroke-width="1" opacity=".6"/>
  <line x1="450" y1="148" x2="682" y2="148" stroke="#c8b898" stroke-width="1" opacity=".5"/>
  <line x1="450" y1="176" x2="682" y2="176" stroke="#c8b898" stroke-width="1" opacity=".5"/>
  <line x1="450" y1="204" x2="682" y2="204" stroke="#c8b898" stroke-width="1" opacity=".5"/>
  <line x1="450" y1="232" x2="682" y2="232" stroke="#c8b898" stroke-width="1" opacity=".5"/>

  <!-- 當鋪收據（貼在右頁中下方） -->
  <rect x="460" y="250" width="230" height="140" fill="#f8f0dc" rx="4" filter="url(#p-shadow)" opacity=".95"/>
  <rect x="460" y="250" width="230" height="22"  fill="#d4a82a" rx="4" opacity=".7"/>
  <text x="575" y="266" text-anchor="middle" fill="#4a3000" font-size="11" font-family="serif" letter-spacing="2">永 樂 當 鋪</text>
  <!-- 收據內容 -->
  <rect x="475" y="283" width="80"  height="5" fill="#6a5a42" rx="2" opacity=".6"/>
  <rect x="580" y="283" width="95"  height="5" fill="#6a5a42" rx="2" opacity=".6"/>
  <rect x="475" y="300" width="60"  height="5" fill="#6a5a42" rx="2" opacity=".5"/>
  <rect x="475" y="317" width="110" height="5" fill="#6a5a42" rx="2" opacity=".55"/>
  <!-- 金額 -->
  <text x="578" y="358" text-anchor="middle" fill="#8a2000" font-size="16" font-family="serif" font-weight="bold">NT$ 80,000</text>
  <rect x="530" y="365" width="95" height="1.5" fill="#8a2000" opacity=".5"/>

  <!-- 紅筆批注 -->
  <text x="470" y="415" fill="#c02820" font-size="10" font-family="serif" opacity=".9" font-style="italic">要把錢給小寶—</text>
  <!-- 紅色箭頭 -->
  <path d="M 460,395 Q 455,400 462,408" stroke="#c02820" stroke-width="2" fill="none" opacity=".75"/>

  <!-- 書脊（中線） -->
  <rect x="393" y="80" width="34" height="360" fill="#c8a868" opacity=".35"/>
  <line x1="410" y1="80" x2="410" y2="440" stroke="#b89848" stroke-width="2" opacity=".4"/>
</svg>`,

  // 永樂當鋪
  pawn: `<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" class="scene-in" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pw-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1a0e04"/>
      <stop offset="55%"  stop-color="#2a1a08"/>
      <stop offset="100%" stop-color="#180c04"/>
    </linearGradient>
    <radialGradient id="pw-lamp" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#e8a020" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#e8a020" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="pw-watch" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#f5d060" stop-opacity=".95"/>
      <stop offset="60%"  stop-color="#c8a020" stop-opacity=".6"/>
      <stop offset="100%" stop-color="#c8a020" stop-opacity="0"/>
    </radialGradient>
    <filter id="pw-glow"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="pw-soft"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>

  <rect width="800" height="520" fill="url(#pw-bg)"/>

  <!-- 天花板 -->
  <rect x="0" y="0" width="800" height="55" fill="#100805"/>

  <!-- 吊燈 -->
  <line x1="400" y1="0"  x2="400" y2="55" stroke="#3a2818" stroke-width="3"/>
  <ellipse cx="400" cy="62" rx="30" ry="14" fill="#c88818"/>
  <ellipse class="glow" cx="400" cy="62" rx="120" ry="90" fill="url(#pw-lamp)" filter="url(#pw-soft)"/>

  <!-- 展示架（背景） -->
  <rect x="0" y="55" width="800" height="280" fill="#1c1008"/>
  <!-- 展示格架 -->
  <line x1="0"   y1="130" x2="800" y2="130" stroke="#3a2010" stroke-width="2"/>
  <line x1="0"   y1="200" x2="800" y2="200" stroke="#3a2010" stroke-width="2"/>
  <line x1="0"   y1="270" x2="800" y2="270" stroke="#3a2010" stroke-width="2"/>
  <line x1="120" y1="55"  x2="120" y2="335" stroke="#3a2010" stroke-width="1.5"/>
  <line x1="240" y1="55"  x2="240" y2="335" stroke="#3a2010" stroke-width="1.5"/>
  <line x1="360" y1="55"  x2="360" y2="335" stroke="#3a2010" stroke-width="1.5"/>
  <line x1="480" y1="55"  x2="480" y2="335" stroke="#3a2010" stroke-width="1.5"/>
  <line x1="600" y1="55"  x2="600" y2="335" stroke="#3a2010" stroke-width="1.5"/>
  <line x1="720" y1="55"  x2="720" y2="335" stroke="#3a2010" stroke-width="1.5"/>

  <!-- 展示物品（當品） -->
  <!-- 金錶（主焦點，稍大，發光） -->
  <circle class="float" cx="300" cy="170" r="28" fill="none" stroke="#c8a020" stroke-width="5"/>
  <circle class="float" cx="300" cy="170" r="22" fill="#e8c840" opacity=".8"/>
  <circle cx="300" cy="170" r="32" fill="url(#pw-watch)" filter="url(#pw-glow)" opacity=".9"/>
  <!-- 手錶帶 -->
  <rect x="290" y="140" width="20" height="12" fill="#8a6020" rx="2"/>
  <rect x="290" y="196" width="20" height="12" fill="#8a6020" rx="2"/>
  <!-- 錶面指針 -->
  <line x1="300" y1="170" x2="300" y2="157" stroke="#1a0e04" stroke-width="2"/>
  <line x1="300" y1="170" x2="310" y2="175" stroke="#1a0e04" stroke-width="1.5"/>

  <!-- 其他當品（背景） -->
  <rect x="80"  y="90"  width="35" height="28" fill="#3a2828" rx="3" opacity=".6"/>
  <rect x="145" y="85"  width="28" height="35" fill="#382028" rx="3" opacity=".5"/>
  <circle cx="510" cy="100" r="18" fill="none" stroke="#5a4820" stroke-width="3" opacity=".5"/>
  <rect x="640"  y="88"  width="40" height="30" fill="#283040" rx="3" opacity=".55"/>
  <rect x="700"  y="82"  width="28" height="42" fill="#2a1818" rx="2" opacity=".45"/>

  <!-- 當鋪櫃台 -->
  <rect x="0"   y="335" width="800" height="30" fill="#2a1808"/>
  <rect x="0"   y="340" width="800" height="180" fill="#1c1008"/>
  <!-- 玻璃（反光） -->
  <rect x="0" y="335" width="800" height="12" fill="#e8c860" opacity=".06"/>

  <!-- 帳本 -->
  <rect x="310" y="348" width="180" height="120" fill="#1a1208" rx="3"/>
  <rect x="310" y="348" width="180" height="20"  fill="#3a2808" rx="3"/>
  <!-- 帳本行 -->
  <line x1="325" y1="382" x2="475" y2="382" stroke="#3a2808" stroke-width="1.5"/>
  <line x1="325" y1="400" x2="475" y2="400" stroke="#3a2808" stroke-width="1.5"/>
  <line x1="325" y1="418" x2="475" y2="418" stroke="#3a2808" stroke-width="1.5"/>
  <line x1="325" y1="436" x2="475" y2="436" stroke="#3a2808" stroke-width="1.5"/>

  <!-- 人物：王老闆（後方，矮胖） -->
  <g transform="translate(540,320)">
    <ellipse cx="0" cy="-20" rx="18" ry="18" fill="#0e0804"/>
    <rect x="-22" y="-4" width="44" height="55" fill="#0e0804" rx="5"/>
    <path d="M -22,5 Q -38,18 -36,38" stroke="#0e0804" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M  22,5 Q  38,18  36,38" stroke="#0e0804" stroke-width="9" fill="none" stroke-linecap="round"/>
    <rect x="-16" y="49" width="13" height="25" fill="#0e0804" rx="3"/>
    <rect x="3"   y="49" width="13" height="25" fill="#0e0804" rx="3"/>
  </g>

  <!-- 人物：阿公（前方，對著老闆） -->
  <g transform="translate(250,320)">
    <ellipse cx="0" cy="-18" rx="14" ry="17" fill="#080604"/>
    <rect x="-13" y="-2" width="26" height="50" fill="#080604" rx="4"/>
    <path d="M -13,6 Q -28,22 -26,40" stroke="#080604" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M  13,6 Q  28,22  26,40" stroke="#080604" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="-11" y="46" width="9"  height="28" fill="#080604" rx="3"/>
    <rect x="2"   y="46" width="9"  height="28" fill="#080604" rx="3"/>
  </g>

  <!-- 招牌 -->
  <rect x="280" y="58" width="240" height="40" fill="#2a1808" rx="4"/>
  <text x="400" y="84" text-anchor="middle" fill="#e8a020" font-size="16" font-family="serif" letter-spacing="4" opacity=".85">永 樂 當 鋪</text>
</svg>`,

  // 土地銀行
  bank: `<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" class="scene-in" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bk-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0e1520"/>
      <stop offset="100%" stop-color="#0a1018"/>
    </linearGradient>
    <linearGradient id="bk-screen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1a4060"/>
      <stop offset="100%" stop-color="#0e2840"/>
    </linearGradient>
    <radialGradient id="bk-light" cx="50%" cy="0%" r="80%">
      <stop offset="0%"   stop-color="#c8d8e8" stop-opacity=".12"/>
      <stop offset="100%" stop-color="#c8d8e8" stop-opacity="0"/>
    </radialGradient>
    <filter id="bk-glow"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>

  <rect width="800" height="520" fill="url(#bk-bg)"/>
  <!-- 頂燈 -->
  <rect x="80"  y="0" width="180" height="8" fill="#c8d8e8" opacity=".18"/>
  <rect x="320" y="0" width="160" height="8" fill="#c8d8e8" opacity=".18"/>
  <rect x="540" y="0" width="180" height="8" fill="#c8d8e8" opacity=".18"/>
  <!-- 環境冷光 -->
  <rect width="800" height="520" fill="url(#bk-light)"/>

  <!-- 背景牆 -->
  <rect x="0" y="30" width="800" height="280" fill="#0c1318"/>
  <!-- 牆面裝飾線 -->
  <line x1="0" y1="180" x2="800" y2="180" stroke="#182030" stroke-width="1.5"/>
  <line x1="0" y1="240" x2="800" y2="240" stroke="#182030" stroke-width="1"/>

  <!-- 監視器（左上角） -->
  <rect x="40" y="45" width="24" height="16" fill="#182838" rx="3"/>
  <circle cx="52" cy="53" r="5" fill="#0e1e2e"/>
  <circle cx="52" cy="53" r="2.5" fill="#102030" opacity=".9"/>
  <line x1="52" y1="61" x2="52" y2="72" stroke="#182838" stroke-width="2"/>

  <!-- 電腦螢幕（林小姐用） -->
  <rect x="220" y="95" width="200" height="130" fill="url(#bk-screen)" rx="5"/>
  <rect x="220" y="95" width="200" height="16"  fill="#142838" rx="5"/>
  <!-- 螢幕亮光 -->
  <rect x="220" y="95" width="200" height="130" fill="#4a90c8" opacity=".04"/>
  <rect x="230" y="120" width="140" height="5"  fill="#3a80b8" rx="2" opacity=".5"/>
  <rect x="230" y="135" width="160" height="5"  fill="#3a80b8" rx="2" opacity=".45"/>
  <rect x="230" y="150" width="120" height="5"  fill="#3a80b8" rx="2" opacity=".5"/>
  <rect x="230" y="165" width="155" height="5"  fill="#3a80b8" rx="2" opacity=".4"/>
  <rect x="230" y="180" width="100" height="5"  fill="#3a80b8" rx="2" opacity=".45"/>
  <!-- 螢幕邊框反光 -->
  <rect x="220" y="95" width="200" height="3" fill="#5aa0d8" opacity=".2" rx="2"/>

  <!-- 監視器畫面（帳目） -->
  <rect x="500" y="75" width="220" height="160" fill="#0e1e2e" rx="5"/>
  <rect x="500" y="75" width="220" height="14"  fill="#c83020" rx="5" opacity=".7"/>
  <text x="610" y="87" text-anchor="middle" fill="#f0e0d0" font-size="9" font-family="monospace" opacity=".7">監視記錄</text>
  <rect x="512" y="100" width="80"  height="4" fill="#5a8ab8" rx="2" opacity=".55"/>
  <rect x="610" y="100" width="98"  height="4" fill="#c03020" rx="2" opacity=".6"/>
  <rect x="512" y="114" width="195" height="4" fill="#5a8ab8" rx="2" opacity=".45"/>
  <rect x="512" y="128" width="160" height="4" fill="#5a8ab8" rx="2" opacity=".5"/>
  <rect x="512" y="142" width="178" height="4" fill="#c03020" rx="2" opacity=".55"/>
  <rect x="512" y="156" width="140" height="4" fill="#5a8ab8" rx="2" opacity=".45"/>
  <text x="610" y="220" text-anchor="middle" fill="#c03020" font-size="11" font-family="monospace" opacity=".8">高風險帳戶</text>

  <!-- 銀行櫃台 -->
  <rect x="0"   y="310" width="800" height="25" fill="#182838"/>
  <rect x="0"   y="318" width="800" height="202" fill="#0e1520"/>
  <!-- 玻璃分隔線 -->
  <rect x="0"   y="310" width="800" height="5" fill="#3a80b8" opacity=".12"/>
  <!-- 分格 -->
  <line x1="200" y1="310" x2="200" y2="520" stroke="#1a2a3a" stroke-width="1.5"/>
  <line x1="400" y1="310" x2="400" y2="520" stroke="#1a2a3a" stroke-width="1.5"/>
  <line x1="600" y1="310" x2="600" y2="520" stroke="#1a2a3a" stroke-width="1.5"/>

  <!-- 人物：林小姐（左，站在螢幕前） -->
  <g transform="translate(130,285)">
    <ellipse cx="0" cy="-16" rx="13" ry="15" fill="#0a1218"/>
    <rect x="-14" y="-2" width="28" height="50" fill="#0a1218" rx="4"/>
    <!-- 正式服裝（深色） -->
    <path d="M -14,5 Q -26,20 -24,38" stroke="#0a1218" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M  14,5 Q  26,20  24,38" stroke="#0a1218" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="-10" y="46" width="9"  height="28" fill="#0a1218" rx="3"/>
    <rect x="1"   y="46" width="9"  height="28" fill="#0a1218" rx="3"/>
  </g>

  <!-- 人物：偵探（右，站著聽） -->
  <g transform="translate(670,285)">
    <ellipse cx="0" cy="-20" rx="13" ry="17" fill="#080c14"/>
    <rect x="-16" y="-38" width="32" height="7" fill="#080c14" rx="2"/>
    <rect x="-10" y="-52" width="20" height="18" fill="#080c14" rx="3"/>
    <rect x="-14" y="-4" width="28" height="52" fill="#080c14" rx="4"/>
    <path d="M -14,8 Q -28,22 -26,38" stroke="#080c14" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M  14,8 Q  28,22  26,38" stroke="#080c14" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="-10" y="46" width="9"  height="28" fill="#080c14" rx="3"/>
    <rect x="1"   y="46" width="9"  height="28" fill="#080c14" rx="3"/>
  </g>
</svg>`,

  // 派出所
  police: `<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" class="scene-in" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="po-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#080e18"/>
      <stop offset="100%" stop-color="#060c14"/>
    </linearGradient>
    <radialGradient id="po-lamp" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#e8d888" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#e8d888" stop-opacity="0"/>
    </radialGradient>
    <filter id="po-soft"><feGaussianBlur stdDeviation="16"/></filter>
  </defs>

  <rect width="800" height="520" fill="url(#po-bg)"/>

  <!-- 窗（帶百葉窗效果） -->
  <rect x="550" y="60" width="180" height="140" fill="#081828" rx="4"/>
  <line x1="550" y1="80"  x2="730" y2="80"  stroke="#0e2838" stroke-width="3"/>
  <line x1="550" y1="100" x2="730" y2="100" stroke="#0e2838" stroke-width="3"/>
  <line x1="550" y1="120" x2="730" y2="120" stroke="#0e2838" stroke-width="3"/>
  <line x1="550" y1="140" x2="730" y2="140" stroke="#0e2838" stroke-width="3"/>
  <line x1="550" y1="160" x2="730" y2="160" stroke="#0e2838" stroke-width="3"/>
  <line x1="550" y1="180" x2="730" y2="180" stroke="#0e2838" stroke-width="3"/>
  <!-- 夜色透光 -->
  <rect x="550" y="60" width="180" height="140" fill="#1a3a58" opacity=".05"/>

  <!-- 台燈 -->
  <line x1="400" y1="95" x2="400" y2="230" stroke="#1e2838" stroke-width="5"/>
  <ellipse cx="400" cy="88" rx="36" ry="16" fill="#c8b840" opacity=".85"/>
  <ellipse class="glow" cx="400" cy="90" rx="140" ry="100" fill="url(#po-lamp)" filter="url(#po-soft)"/>

  <!-- 辦公桌 -->
  <rect x="100" y="310" width="600" height="28" fill="#141e2a"/>
  <rect x="100" y="330" width="600" height="190" fill="#0e1820"/>
  <!-- 桌腳 -->
  <rect x="120" y="490" width="18" height="30" fill="#0e1820"/>
  <rect x="662" y="490" width="18" height="30" fill="#0e1820"/>

  <!-- 卷宗資料夾 -->
  <rect x="160" y="268" width="90"  height="50" fill="#1e2c3a" rx="3"/>
  <rect x="160" y="268" width="90"  height="10" fill="#c83020" opacity=".6" rx="3"/>
  <rect x="168" y="288" width="74"  height="4"  fill="#3a5870" rx="2" opacity=".6"/>
  <rect x="168" y="300" width="60"  height="4"  fill="#3a5870" rx="2" opacity=".5"/>

  <rect x="268" y="275" width="80"  height="45" fill="#1a2838" rx="3"/>
  <rect x="268" y="275" width="80"  height="10" fill="#c08820" opacity=".55" rx="3"/>
  <rect x="276" y="295" width="65"  height="4"  fill="#3a5870" rx="2" opacity=".55"/>
  <rect x="276" y="307" width="50"  height="4"  fill="#3a5870" rx="2" opacity=".45"/>

  <rect x="365" y="270" width="85"  height="48" fill="#1c2c3c" rx="3"/>
  <rect x="365" y="270" width="85"  height="10" fill="#2a7830" opacity=".6" rx="3"/>

  <!-- 證據展示：當鋪收據 + 電匯紀錄 -->
  <rect x="490" y="258" width="140" height="88" fill="#f5ecd8" rx="3" opacity=".9"/>
  <rect x="490" y="258" width="140" height="16" fill="#c8980a" opacity=".7" rx="3"/>
  <text x="560" y="271" text-anchor="middle" fill="#4a2000" font-size="8" font-family="serif" letter-spacing="1">當鋪收據</text>
  <rect x="500" y="282" width="60"  height="3.5" fill="#8a7052" rx="2" opacity=".5"/>
  <rect x="500" y="294" width="110" height="3.5" fill="#8a7052" rx="2" opacity=".45"/>
  <rect x="500" y="306" width="90"  height="3.5" fill="#8a7052" rx="2" opacity=".5"/>
  <text x="560" y="332" text-anchor="middle" fill="#8a2000" font-size="10" font-family="serif" font-weight="bold">$80,000</text>

  <!-- 人物：所長老張（對面，坐姿） -->
  <g transform="translate(270,278)">
    <ellipse cx="0" cy="-16" rx="15" ry="16" fill="#080e18"/>
    <rect x="-18" y="-2" width="36" height="40" fill="#080e18" rx="4"/>
    <path d="M -18,5 Q -32,18 -28,32" stroke="#080e18" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M  18,5 Q  32,18  28,32" stroke="#080e18" stroke-width="9" fill="none" stroke-linecap="round"/>
    <!-- 手放在桌上 -->
    <path d="M -28,32 Q -30,50 -25,55" stroke="#080e18" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M  28,32 Q  30,50  25,55" stroke="#080e18" stroke-width="8" fill="none" stroke-linecap="round"/>
  </g>

  <!-- 人物：偵探（右，站著，提交證據） -->
  <g transform="translate(620,265)">
    <ellipse cx="0" cy="-22" rx="14" ry="18" fill="#060c14"/>
    <rect x="-18" y="-40" width="36" height="8" fill="#060c14" rx="2"/>
    <rect x="-12" y="-55" width="24" height="20" fill="#060c14" rx="3"/>
    <rect x="-16" y="-4" width="32" height="56" fill="#060c14" rx="5"/>
    <!-- 手伸出，指向證據 -->
    <path d="M -16,8 Q -38,12 -52,8" stroke="#060c14" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M  16,8 Q  24,22  22,38" stroke="#060c14" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="-12" y="50" width="10" height="32" fill="#060c14" rx="3"/>
    <rect x="2"   y="50" width="10" height="32" fill="#060c14" rx="3"/>
  </g>
</svg>`,

  // 阿明早餐店
  shop: `<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" class="scene-in" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sh-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0e0b08"/>
      <stop offset="100%" stop-color="#1a1410"/>
    </linearGradient>
    <radialGradient id="sh-flame" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#f08828" stop-opacity=".75"/>
      <stop offset="100%" stop-color="#f08828" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sh-overhead" cx="50%" cy="0%" r="75%">
      <stop offset="0%"   stop-color="#d0dce8" stop-opacity=".14"/>
      <stop offset="100%" stop-color="#d0dce8" stop-opacity="0"/>
    </radialGradient>
    <filter id="sh-blur"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="sh-soft"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>

  <!-- 背景 -->
  <rect width="800" height="520" fill="url(#sh-bg)"/>
  <!-- 頂燈環境光 -->
  <rect width="800" height="520" fill="url(#sh-overhead)"/>
  <!-- 日光燈管（三條） -->
  <rect x="90"  y="0" width="155" height="5" fill="#c8dce8" opacity=".22"/>
  <rect x="322" y="0" width="155" height="5" fill="#c8dce8" opacity=".22"/>
  <rect x="556" y="0" width="155" height="5" fill="#c8dce8" opacity=".22"/>

  <!-- 牆磚 -->
  <rect x="0" y="45" width="800" height="265" fill="#120f0a"/>
  <line x1="0" y1="95"  x2="800" y2="95"  stroke="#1e1a14" stroke-width="1"/>
  <line x1="0" y1="145" x2="800" y2="145" stroke="#1e1a14" stroke-width="1"/>
  <line x1="0" y1="195" x2="800" y2="195" stroke="#1e1a14" stroke-width="1"/>
  <line x1="0" y1="245" x2="800" y2="245" stroke="#1e1a14" stroke-width="1"/>
  <line x1="80"  y1="45" x2="80"  y2="310" stroke="#1a1610" stroke-width="1"/>
  <line x1="160" y1="45" x2="160" y2="310" stroke="#1a1610" stroke-width="1"/>
  <line x1="240" y1="45" x2="240" y2="310" stroke="#1a1610" stroke-width="1"/>
  <line x1="320" y1="45" x2="320" y2="310" stroke="#1a1610" stroke-width="1"/>
  <line x1="400" y1="45" x2="400" y2="310" stroke="#1a1610" stroke-width="1"/>
  <line x1="480" y1="45" x2="480" y2="310" stroke="#1a1610" stroke-width="1"/>
  <line x1="560" y1="45" x2="560" y2="310" stroke="#1a1610" stroke-width="1"/>
  <line x1="640" y1="45" x2="640" y2="310" stroke="#1a1610" stroke-width="1"/>
  <line x1="720" y1="45" x2="720" y2="310" stroke="#1a1610" stroke-width="1"/>

  <!-- 菜單板 -->
  <rect x="50" y="58" width="195" height="110" fill="#180e08" rx="4"/>
  <rect x="50" y="58" width="195" height="18"  fill="#3a2010" rx="4"/>
  <text x="147" y="72" text-anchor="middle" fill="#e8a028" font-size="11" font-family="serif" letter-spacing="3" opacity=".85">阿 明 早 餐</text>
  <rect x="65"  y="90"  width="75" height="4" fill="#6a5030" rx="2" opacity=".7"/>
  <rect x="148" y="90"  width="82" height="4" fill="#6a5030" rx="2" opacity=".6"/>
  <rect x="65"  y="104" width="90" height="4" fill="#6a5030" rx="2" opacity=".65"/>
  <rect x="163" y="104" width="68" height="4" fill="#6a5030" rx="2" opacity=".55"/>
  <rect x="65"  y="118" width="68" height="4" fill="#6a5030" rx="2" opacity=".6"/>
  <rect x="65"  y="132" width="110" height="4" fill="#6a5030" rx="2" opacity=".55"/>
  <rect x="183" y="132" width="48" height="4" fill="#6a5030" rx="2" opacity=".5"/>
  <rect x="65"  y="146" width="80" height="4" fill="#6a5030" rx="2" opacity=".6"/>

  <!-- 牆上日曆 -->
  <rect x="680" y="62" width="75" height="88" fill="#1c1408" rx="3"/>
  <rect x="680" y="62" width="75" height="16" fill="#c83020" opacity=".65" rx="3"/>
  <text x="718" y="74" text-anchor="middle" fill="#f0e0d8" font-size="9" font-family="serif" opacity=".75">4 月</text>
  <rect x="690" y="88"  width="12" height="10" fill="#3a3028" rx="1" opacity=".5"/>
  <rect x="706" y="88"  width="12" height="10" fill="#3a3028" rx="1" opacity=".5"/>
  <rect x="722" y="88"  width="12" height="10" fill="#c03020" rx="1" opacity=".7"/>
  <rect x="690" y="102" width="12" height="10" fill="#3a3028" rx="1" opacity=".5"/>
  <rect x="706" y="102" width="12" height="10" fill="#3a3028" rx="1" opacity=".5"/>
  <rect x="722" y="102" width="12" height="10" fill="#3a3028" rx="1" opacity=".5"/>
  <rect x="690" y="116" width="12" height="10" fill="#3a3028" rx="1" opacity=".5"/>
  <rect x="706" y="116" width="12" height="10" fill="#3a3028" rx="1" opacity=".5"/>
  <rect x="722" y="116" width="12" height="10" fill="#3a3028" rx="1" opacity=".5"/>
  <rect x="738" y="116" width="6"  height="10" fill="#3a3028" rx="1" opacity=".5"/>

  <!-- 廚台（U 形） -->
  <rect x="0"   y="310" width="800" height="22" fill="#2a2015"/>
  <rect x="0"   y="324" width="800" height="196" fill="#1c1610"/>
  <!-- 台面反光 -->
  <rect x="0" y="310" width="800" height="4" fill="#d8b870" opacity=".08"/>

  <!-- 爐台 -->
  <rect x="170" y="258" width="290" height="60" fill="#1a1610" rx="5"/>
  <!-- 左爐環（大，開火） -->
  <ellipse cx="248" cy="282" rx="50" ry="16" fill="none" stroke="#302420" stroke-width="4"/>
  <ellipse cx="248" cy="282" rx="34" ry="10" fill="none" stroke="#2a1e16" stroke-width="2"/>
  <!-- 火焰光暈 -->
  <ellipse class="glow" cx="248" cy="286" rx="42" ry="28" fill="url(#sh-flame)" filter="url(#sh-blur)" opacity=".9"/>
  <!-- 小火焰 -->
  <path class="lamp" d="M 234 278 Q 239 265 248 274 Q 257 265 262 278" fill="#f09030" opacity=".65"/>
  <!-- 右爐環（小，關火） -->
  <ellipse cx="390" cy="282" rx="38" ry="12" fill="none" stroke="#2a2018" stroke-width="3"/>
  <ellipse cx="390" cy="282" rx="26" ry="8"  fill="none" stroke="#222018" stroke-width="2"/>

  <!-- 炒鍋（左大爐） -->
  <ellipse cx="248" cy="270" rx="56" ry="19" fill="#0e0c08" stroke="#2a2018" stroke-width="3"/>
  <ellipse cx="248" cy="267" rx="48" ry="14" fill="#161210"/>
  <!-- 鍋把 -->
  <line x1="302" y1="268" x2="348" y2="254" stroke="#3a3020" stroke-width="7" stroke-linecap="round"/>
  <!-- 蒸氣 -->
  <path class="steam-1" d="M 232 252 Q 228 238 233 226 Q 238 214 233 202" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path class="steam-2" d="M 248 250 Q 244 236 249 224 Q 254 212 249 200" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path class="steam-3" d="M 264 252 Q 260 238 265 226 Q 270 214 265 202" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- 鐵板（右台） -->
  <rect x="428" y="258" width="110" height="52" fill="#181510" rx="4"/>
  <!-- 煎蛋（太陽蛋） -->
  <ellipse cx="483" cy="284" rx="34" ry="18" fill="#e8dfc8" opacity=".82"/>
  <circle  cx="478" cy="281" r="11"          fill="#e8a020" opacity=".92"/>
  <circle  cx="478" cy="280" r="5"           fill="#f5c040" opacity=".9"/>
  <!-- 吐司 -->
  <rect x="565" y="262" width="50" height="38" fill="#c89848" opacity=".8" rx="3"/>
  <rect x="568" y="265" width="44" height="32" fill="#d8a850" opacity=".7" rx="2"/>
  <line x1="568" y1="280" x2="612" y2="280" stroke="#b07830" stroke-width="1" opacity=".5"/>

  <!-- 人物：阿明（後方，廚師帽，在爐前） -->
  <g transform="translate(268,292)">
    <ellipse cx="0" cy="-19" rx="15" ry="17" fill="#090706"/>
    <!-- 廚師帽 -->
    <rect x="-11" y="-38" width="22" height="8" fill="#0e0c08" rx="2"/>
    <rect x="-8"  y="-56" width="16" height="22" fill="#0e0c08" rx="7"/>
    <!-- 圍裙 -->
    <rect x="-16" y="-3"  width="32" height="52" fill="#090706" rx="4"/>
    <rect x="-4"  y="-3"  width="8"  height="52" fill="#100e0a" rx="2" opacity=".6"/>
    <!-- 左手拿鍋鏟 -->
    <path d="M 16,6 Q 30,12 28,30" stroke="#090706" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="23" y="27" width="16" height="7" fill="#090706" rx="2" transform="rotate(-18 23 27)"/>
    <!-- 右手打蛋 -->
    <path d="M -16,6 Q -30,10 -28,28" stroke="#090706" stroke-width="8" fill="none" stroke-linecap="round"/>
    <rect x="-14" y="46" width="11" height="28" fill="#090706" rx="3"/>
    <rect x="2"   y="46" width="11" height="28" fill="#090706" rx="3"/>
  </g>

  <!-- 人物：偵探（前方，右側，在吧台前） -->
  <g transform="translate(615,292)">
    <ellipse cx="0" cy="-20" rx="13" ry="17" fill="#070504"/>
    <rect x="-16" y="-38" width="32" height="7" fill="#070504" rx="2"/>
    <rect x="-10" y="-52" width="20" height="17" fill="#070504" rx="3"/>
    <rect x="-14" y="-4"  width="28" height="50" fill="#070504" rx="4"/>
    <!-- 手肘放在台上（聽的姿勢） -->
    <path d="M -14,8 Q -22,22 -18,42" stroke="#070504" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M  14,8 Q  22,20  20,36" stroke="#070504" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="-10" y="44" width="9"  height="28" fill="#070504" rx="3"/>
    <rect x="1"   y="44" width="9"  height="28" fill="#070504" rx="3"/>
  </g>
</svg>`,

  // 重逢結局
  reunion: `<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" class="scene-in" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ru-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1a1408"/>
      <stop offset="40%"  stop-color="#2a200c"/>
      <stop offset="100%" stop-color="#100c06"/>
    </linearGradient>
    <radialGradient id="ru-sun" cx="50%" cy="40%" r="55%">
      <stop offset="0%"   stop-color="#f5c040" stop-opacity=".45"/>
      <stop offset="50%"  stop-color="#e89020" stop-opacity=".18"/>
      <stop offset="100%" stop-color="#e89020" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ru-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#f5d060" stop-opacity=".6"/>
      <stop offset="100%" stop-color="#f5d060" stop-opacity="0"/>
    </radialGradient>
    <filter id="ru-blur"><feGaussianBlur stdDeviation="20"/></filter>
    <filter id="ru-soft"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>

  <rect width="800" height="520" fill="url(#ru-bg)"/>

  <!-- 朝陽光芒 -->
  <ellipse class="sunrise" cx="400" cy="210" rx="380" ry="260" fill="url(#ru-sun)" filter="url(#ru-blur)"/>

  <!-- 旅社走廊（背景） -->
  <!-- 牆面 -->
  <rect x="0"   y="0"  width="800" height="520" fill="#120e08" opacity=".3"/>
  <!-- 走廊地板透視線 -->
  <path d="M 0,520 L 350,310 L 450,310 L 800,520 Z" fill="#1c1608" opacity=".6"/>
  <line x1="0"   y1="520" x2="350" y2="310" stroke="#2a2010" stroke-width="1.5"/>
  <line x1="800" y1="520" x2="450" y2="310" stroke="#2a2010" stroke-width="1.5"/>
  <!-- 天花板線 -->
  <line x1="0"   y1="0"   x2="350" y2="310" stroke="#2a2010" stroke-width="1" opacity=".5"/>
  <line x1="800" y1="0"   x2="450" y2="310" stroke="#2a2010" stroke-width="1" opacity=".5"/>

  <!-- 牆上燈（走廊） -->
  <rect x="90"  y="200" width="18" height="28" fill="#c89830" opacity=".6"/>
  <ellipse cx="99"  cy="200" rx="50" ry="38" fill="url(#ru-glow)" filter="url(#ru-soft)" opacity=".7"/>
  <rect x="680" y="200" width="18" height="28" fill="#c89830" opacity=".6"/>
  <ellipse cx="689" cy="200" rx="50" ry="38" fill="url(#ru-glow)" filter="url(#ru-soft)" opacity=".7"/>

  <!-- 門（背景，半開） -->
  <rect x="330" y="120" width="140" height="190" fill="#180e06" rx="3"/>
  <rect x="330" y="120" width="140" height="4" fill="#3a2810" rx="2"/>
  <!-- 門縫透光 -->
  <rect x="470" y="120" width="8" height="190" fill="#f5c040" opacity=".15"/>

  <!-- 擁抱的人物（兩個重疊的剪影） -->
  <g class="embrace" transform="translate(400,270)">
    <!-- 阿公（較矮，被擁抱） -->
    <ellipse cx="-6" cy="-65" rx="16" ry="18" fill="#0e0c08"/>
    <rect    x="-22" y="-48" width="32" height="65" fill="#0e0c08" rx="5"/>
    <rect    x="-18" y="15"  width="12" height="45" fill="#0e0c08" rx="3"/>
    <rect    x="-4"  y="15"  width="12" height="45" fill="#0e0c08" rx="3"/>
    <!-- 低頭 -->
    <ellipse cx="-4" cy="-60" rx="14" ry="16" fill="#0a0806"/>

    <!-- 陳秀蘭（右側，抱著阿公） -->
    <ellipse cx="18" cy="-75" rx="13" ry="15" fill="#0a0806"/>
    <!-- 頭髮 -->
    <ellipse cx="18" cy="-88" rx="9"  ry="7"  fill="#0a0806"/>
    <rect    x="8"  y="-61"  width="26" height="58" fill="#0a0806" rx="4"/>
    <rect    x="10" y="-4"   width="10" height="40" fill="#0a0806" rx="3"/>
    <rect    x="22" y="-4"   width="10" height="40" fill="#0a0806" rx="3"/>
    <!-- 擁抱的手臂 -->
    <path d=" 8,-50 Q -18,-38 -22,-20" stroke="#0a0806" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="34,-50 Q  38,-30  30,-18" stroke="#0a0806" stroke-width="9"  fill="none" stroke-linecap="round"/>

    <!-- 暖光環繞 -->
    <ellipse cx="6" cy="-30" rx="60" ry="70" fill="#f5c040" opacity=".04" filter="url(#ru-soft)"/>
  </g>

  <!-- 地板陰影 -->
  <ellipse cx="400" cy="480" rx="80" ry="18" fill="#0a0806" opacity=".5"/>
</svg>`,
};

// ─────────────────────────────────────────────────────────────────────────────
// CinematicPlayer
// ─────────────────────────────────────────────────────────────────────────────
export class CinematicPlayer {
  /**
   * @param {HTMLElement} root
   * @param {{ scenes: Object, startId: string }} config
   *   scenes  — SCENES map（scene_id → scene object）
   *   startId — 起始 scene id
   */
  constructor(root, { scenes, startId }) {
    this._root    = root;
    this._scenes  = scenes;
    this._startId = startId;
    this._sceneId = startId;   // 當前 scene id
    this._bi      = 0;         // 當前 beat index
    this._timer   = null;
    this._sceneNum = 0;        // 累計場景數（用於標題）
    this._choicesMade = [];    // 記錄用戶選擇（供結局面板顯示）
  }

  // ── 初始化 ──────────────────────────────────────────────
  start() {
    this._injectCSS();
    this._buildLayout();
    this._enterScene(this._startId);
  }

  _injectCSS() {
    if (document.getElementById('cin-css')) return;
    const el = document.createElement('style');
    el.id = 'cin-css';
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  _buildLayout() {
    this._root.innerHTML = `
      <div id="cin-stage">
        <div id="cin-scene-panel">
          <div id="cin-scene-art"></div>
          <div class="scene-label-overlay" id="cin-scene-label"></div>
        </div>
        <div id="cin-narration">
          <div id="cin-header">
            <div id="cin-scene-num"></div>
            <div id="cin-scene-title"></div>
          </div>
          <div id="cin-beats"></div>
          <div id="cin-choice-area" class="hidden"></div>
          <div id="cin-progress">
            <div id="cin-progress-fill"></div>
          </div>
        </div>
      </div>`;
  }

  // ── 場景進入（設定 SVG、標題、清旁白，開始跑 beats）──────
  _enterScene(sceneId) {
    this._sceneId = sceneId;
    this._bi = 0;
    this._sceneNum++;

    const scene = this._scenes[sceneId];
    if (!scene) { this._showEnding(); return; }

    // 更新場景面板
    const art   = document.getElementById('cin-scene-art');
    const label = document.getElementById('cin-scene-label');
    const num   = document.getElementById('cin-scene-num');
    const title = document.getElementById('cin-scene-title');

    art.innerHTML   = SCENE_ART[scene.sceneKey] || '';
    art.dataset.scene = scene.sceneKey;
    art.dataset.beat  = '0';
    label.textContent = scene.title;
    num.textContent   = scene.title.match(/^第.+?場/)?.[0] ?? `第 ${this._sceneNum} 場`;
    title.textContent = scene.title.replace(/^第.+?· /, '');

    // 清旁白 + 隱藏選項區
    document.getElementById('cin-beats').innerHTML = '';
    this._hideChoiceArea();

    // 重設進度條（顯示本場進度）
    this._updateProgress(0, scene.beats.length);

    // 場景開始時若有線索，先顯示
    if (scene.clueUnlock) {
      this._appendClue(scene.clueUnlock);
    }

    this._playBeat();
  }

  // ── Beat 播放迴圈 ────────────────────────────────────────
  _playBeat() {
    const scene = this._scenes[this._sceneId];
    if (!scene) { this._showEnding(); return; }

    const beat = scene.beats[this._bi];

    if (!beat) {
      // 所有 beat 跑完：檢查下一步
      this._onSceneEnd(scene);
      return;
    }

    this._appendBeat(beat);
    this._updateProgress(this._bi + 1, scene.beats.length);

    this._timer = setTimeout(() => {
      this._bi++;
      this._playBeat();
    }, beat.ms);
  }

  // ── 場景結束後的路由邏輯 ─────────────────────────────────
  _onSceneEnd(scene) {
    if (scene.choice) {
      // 有選項：顯示選項卡，等用戶點選
      this._showChoiceArea(scene.choice);
    } else if (scene.next) {
      // 自動推進
      this._enterScene(scene.next);
    } else {
      // 沒有 next 也沒有 choice → 結局
      this._showEnding(scene.outcome);
    }
  }

  // ── 選項區 ───────────────────────────────────────────────
  _showChoiceArea(choice) {
    const area = document.getElementById('cin-choice-area');
    area.classList.remove('hidden');

    // 重新掛載（觸發 choiceIn 動畫）
    area.innerHTML = `
      <div class="cin-choice-prompt">${choice.prompt}</div>
      ${choice.options.map((opt, i) => `
        <button class="cin-choice-btn" data-idx="${i}" data-next="${opt.next}">
          <span class="cin-choice-icon">${opt.icon}</span>
          <span>${opt.label}</span>
        </button>`).join('')}`;

    // 綁定點擊
    area.querySelectorAll('.cin-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => this._onChoiceClick(btn, choice.options));
    });
  }

  _onChoiceClick(btn, options) {
    const idx  = Number(btn.dataset.idx);
    const next = btn.dataset.next;
    const opt  = options[idx];

    // 視覺回饋：選中＋淡出其他
    document.querySelectorAll('.cin-choice-btn').forEach(b => {
      b.classList.add(b === btn ? 'selected' : 'dimmed');
    });

    // 記錄選擇
    this._choicesMade.push(opt.label);

    // 500ms 後：收起選項區，旁白追加「你選擇了…」，推進至下一場
    setTimeout(() => {
      this._hideChoiceArea();
      this._appendChosen(opt);
      setTimeout(() => this._enterScene(next), 600);
    }, 500);
  }

  _hideChoiceArea() {
    const area = document.getElementById('cin-choice-area');
    if (area) { area.classList.add('hidden'); area.innerHTML = ''; }
  }

  _appendChosen(opt) {
    const container = document.getElementById('cin-beats');
    const el = document.createElement('div');
    el.className = 'cin-chosen-record';
    el.textContent = `你選擇了：${opt.label}`;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  // ── 渲染單一 Beat ────────────────────────────────────────
  _appendBeat(beat) {
    const container = document.getElementById('cin-beats');
    const el = document.createElement('div');
    el.className = `cin-beat b-${beat.type}`;

    if (beat.type === 'dialogue') {
      el.innerHTML = `<span class="cin-speaker">${beat.speaker}</span><span class="cin-text"></span>`;
    } else {
      el.innerHTML = `<span class="cin-text"></span>`;
    }

    container.appendChild(el);
    container.scrollTop = container.scrollHeight;

    // beat-reactive 場景動畫：更新 data-beat
    const art = document.getElementById('cin-scene-art');
    if (art) art.dataset.beat = String(this._bi);

    this._typewriter(el.querySelector('.cin-text'), beat.text, beat.ms);
  }

  _appendClue(clue) {
    const container = document.getElementById('cin-beats');
    const el = document.createElement('div');
    el.className = 'cin-clue';
    el.innerHTML = `
      <span class="cin-clue-icon">${clue.icon}</span>
      <div>
        <span class="cin-clue-label">${clue.label}</span>
        <span class="cin-clue-detail">${clue.detail}</span>
      </div>`;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  // ── Typewriter ────────────────────────────────────────────
  _typewriter(el, text, totalMs) {
    const typingMs = Math.min(totalMs * 0.55, text.length * 18, 2400);
    const perChar  = Math.max(typingMs / text.length, 12);
    let i = 0;
    const tick = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(tick);
    }, perChar);
  }

  // ── 進度條（本場 beats 進度） ────────────────────────────
  _updateProgress(done, total) {
    const bar = document.getElementById('cin-progress-fill');
    if (bar) bar.style.width = total > 0 ? `${(done / total) * 100}%` : '0%';
  }

  // ── 結局蓋板 ──────────────────────────────────────────────
  _showEnding(outcome = 'good') {
    const isGood = outcome === 'good';
    const stage  = document.getElementById('cin-stage');
    const overlay = document.createElement('div');
    overlay.id = 'cin-ending-overlay';

    const clues  = isGood ? '📋 當鋪收據 · 🏦 電匯紀錄' : '🏦 電匯紀錄';
    const result = isGood ? '完整破案' : '遲來的線索';
    const money  = isGood ? 'NT$620,000' : '追回 NT$0';
    const badge  = isGood
      ? '<span class="cin-ep-badge">✓ 第零章 完整通關</span>'
      : '<span class="cin-ep-badge" style="background:rgba(180,80,60,0.12);border-color:rgba(200,100,80,0.3);color:rgba(220,150,130,0.9);">第零章 完成（普通結局）</span>';
    const tags   = isGood
      ? `<span class="cin-ep-tag">主動蒐集</span><span class="cin-ep-tag">推理判斷</span><span class="cin-ep-tag">識破詐騙</span>`
      : `<span class="cin-ep-tag">蒐集線索</span><span class="cin-ep-tag">謹慎判斷</span>`;

    overlay.innerHTML = `
      <div class="cin-ending-card">
        <h2>📊 偵探紀錄</h2>
        <div class="cin-ep-row"><span class="cin-ep-key">結局</span><span class="cin-ep-val">${result}</span></div>
        <div class="cin-ep-row"><span class="cin-ep-key">線索收集</span><span class="cin-ep-val">${clues}</span></div>
        <div class="cin-ep-row"><span class="cin-ep-key">行為標籤</span><span class="cin-ep-val">${tags}</span></div>
        <div class="cin-ep-row"><span class="cin-ep-key">追回金額</span><span class="cin-ep-val">${money}</span></div>
        <div>${badge}</div>
        <button id="cin-replay-btn">重新選擇</button>
      </div>`;

    stage.appendChild(overlay);

    document.getElementById('cin-replay-btn').addEventListener('click', () => {
      overlay.remove();
      this._sceneId     = this._startId;
      this._bi          = 0;
      this._sceneNum    = 0;
      this._choicesMade = [];
      this._buildLayout();
      this._enterScene(this._startId);
    });
  }
}
