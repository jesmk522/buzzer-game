# buzzer-game — Claude Code 專案設定

> 本檔案給 Claude Code CLI 讀取，作為 Buzzer 問答（Phase 1）+ 偵探解謎（Phase 2）每日自動開發的專案層規則。
> 全域規則見 `/Users/aceku/Documents/Claude/Projects/Claude/CLAUDE.md`。
> Daily dev 排程見 `/Users/aceku/Documents/Claude/Projects/Claude/Scheduled/buzzer-quiz-daily-dev/SKILL.md`。

---

## 專案定位

Buzzer 行為驗證基礎設施（behavioral verification infrastructure）的 Phase 1（問答，防詐首發）與 Phase 2（偵探解謎）遊戲層。

- **Phase 1（問答）**：輕量入口，vanilla JS，0 依賴，用於快速 SEO + 流量入口
- **Phase 2（偵探）**：中等複雜度，使用 `inkjs` 跑 ink 腳本，產生更豐厚的 reasoning_trace 證據
- **Phase 3（麻將）**：獨立 repo `buzzer-mahjong`，不在本 repo

**核心規則**：每一次會話結束（問答答完 / 偵探章節結束）都要產出 Evidence Pack V2 JSON（含 HMAC-SHA256 簽章）。

---

## 監護規則（HARD RULES — Claude Code 不得違反）

1. **LICENSE 白名單**：新增 npm 套件、ink 範例、素材只能是 `MIT / Apache-2.0 / BSD / ISC / CC0 / CC BY 4.0`。黑名單：`GPL / AGPL / LGPL / CC BY-SA / SSPL / 未授權`。每次 commit 前跑 `npm run license-check`。
2. **不使用 Open Trivia DB 等 CC-BY-SA 資料**：ShareAlike 會污染整個問答題庫。題目自行撰寫或使用 CC-BY-4.0 / MIT 來源。
3. **劇本內容合規**：
   - 所有角色姓名 **原創**，與真實人物雷同須立即修改 + alert
   - 反詐情境只寫「如何識別」，不寫「如何實施」
   - 不提供法律 / 投資建議（只寫「請洽專業人士」）
   - 企業 / 品牌名稱若未授權 → 暫停 deploy + alert
4. **Evidence Pack schema 變更要先 alert**：`shared/evidence-pack/` 是 protocol 層，改 schema 要 Ace 確認。
5. **不暴露 secrets**：`.env`、`EVIDENCE_SECRET`、`DATABASE_URL` 不得 commit。
6. **不購買付費服務**：AdSense、第三方 API key 由 Ace 申請。
7. **代碼註解英文、commit 繁體中文、docs 繁體中文**。

---

## 目錄結構

```
buzzer-game/
├── client/                 # Vite + vanilla JS（問答 UI + 偵探 UI）
│   ├── index.html
│   ├── src/
│   │   ├── main.js
│   │   └── engine/
│   │       ├── detective-runtime.js   # inkjs 橋接 Evidence Pack
│   │       └── scene-renderer.js      # 場景 DOM 渲染
│   └── public/scenes/                 # SVG 背景圖（待建）
├── server/                 # Express — Evidence Pack 簽章 + 章節 API
│   └── src/index.js
├── shared/
│   ├── evidence-pack/      # ★ Phase 1 + Phase 2 Evidence Pack V2
│   └── types/              # JSDoc 型別定義
├── scenarios/              # ink 腳本原檔 + 編譯後 JSON
│   └── detective-a-missing-elder/
│       ├── chapter-0.ink
│       ├── chapter-0.ink.json  (跑 npm run build:ink 後產生)
│       └── manifest.json
├── scripts/
│   ├── check-licenses.js   # LICENSE 白名單掃描
│   └── compile-ink.js      # inklecate 編譯包裝器
├── docs/
│   ├── QUIZ-DEV-LOG.md     # 每日進度（待建）
│   ├── LICENSES-REVIEW.md  # LICENSE 審查
│   └── CHANGELOG.md
└── CLAUDE.md               # 本檔案
```

---

## 每次 session 開頭（Claude Code 必讀）

```bash
cd "/Users/aceku/Documents/Claude/Projects/My Team/buzzer-game"
git status
git pull --rebase
npm install                # 若有變更
npm run license-check      # 失敗立即停止
ls docs/QUIZ-DEV-LOG.md docs/LICENSES-REVIEW.md
git log --oneline -5
```

若 `license-check` 失敗 → 回報 Ace，**不執行任何開發**。

---

## 當前進度（2026-04-17）

- ✅ 專案骨架建立（client / server / shared 三 workspace）
- ✅ Evidence Pack V2 模組（Quiz + Detective）
- ✅ 劇本 A《老街失蹤疑雲》Chapter 0（draft v1）：4 場景、3 條線索、2 個結局
- ✅ inkjs runtime 橋接 + scene renderer 骨架
- 📍 **下一步（Phase 2 首發）**：跑 `npm install` → `npm run build:ink`（需 inklecate）→ 本機測試整輪
- 🔜 Phase 1（問答）延後 — Ace 指示先做 Phase 2

## Phase 2 路線圖（劇本 A）

| Day | 任務 |
|---|---|
| D1  | ✅ inkjs runtime + Evidence Pack 橋接 |
| D2  | ✅ Scene renderer 骨架 |
| D3  | 線索收集系統強化（UI 點擊展開、決定性線索標記） |
| D4  | 推理筆記（reasoning_trace）正式 UI（取代目前的 prompt） |
| D5  | 劇本 A Chapter 0 完整跑通 + 2 個結局 QA |
| D6–10 | 劇本 A Chapter 1–3 補完（擴增 8 個場景、2 條新證據鏈） |
| D11 | Evidence Pack V2 後端簽章整合測試 |
| D12+ | Node.js 後端進度儲存（DB schema：sessions / runs / evidence_packs） |

## Phase 1 路線圖（延後，Ace 指示 Phase 1 最後）

| Day | 任務 |
|---|---|
| Q1 | 題庫 JSON schema（含 evidence_tag）+ 第一批 30 題防詐題 |
| Q2 | 問答單題 UI（vanilla JS，0 依賴） |
| Q3 | localStorage 排行榜 + 每日挑戰（date hash 選題） |
| Q4 | Evidence Pack V1 輸出器（QuizEvidenceBuilder） |
| Q5 | AdSense 整合（Ace 提供帳號） |
| Q6 | GitHub Pages 部署 + GA4 |

---

## 劇本合規檢查清單（每次碰劇本都要跑）

- [ ] 所有人名原創（不對應真實人物）
- [ ] 不含真實企業 / 品牌名（若要用，改虛構 + 後綴「X」「XX」）
- [ ] 反詐情境只寫「如何識別」，不寫「如何實施」
- [ ] 不提供法律 / 投資 / 醫療建議（必要時改為「請洽專業人士」）
- [ ] 未成年角色不涉及感情 / 暴力 / 金錢細節
- [ ] 避免敏感族群刻板印象

---

## 與其他 agent 協作

- `buzzer-quiz-daily-dev`（06:10 排程）：每日自動推進本 repo，路線圖見 Scheduled/buzzer-quiz-daily-dev/SKILL.md
- `buzzer-mahjong-daily-dev`（06:03 排程）：另一個 repo `buzzer-mahjong`，**只共用 `metrics.json.buzzer_game` object** — 本 repo 只 patch `quiz_*` / `detective_*` 欄位，不覆寫 `mahjong_*`
- `war-room-sync`（每小時）：唯一的 War Room push 閘門，本 repo metrics 更新只寫檔不 push
- `buzzer-content-weekly-review`（週六 07:00，待建）：本 repo 劇本每週一次由 Ace 檢閱

## 相關文件

- 專案總計劃：`/Users/aceku/Documents/Claude/Projects/My Team/Buzzer/buzzer-game-project-plan.html`
- 內容藍圖：`/Users/aceku/Documents/Claude/Projects/My Team/Buzzer/buzzer-game-content-blueprint.html`
- 麻將 repo：`/Users/aceku/Documents/Claude/Projects/My Team/buzzer-mahjong/`
- AceHQ 核心設定：`/Users/aceku/Documents/Claude/Projects/Claude/CLAUDE.md`
