# buzzer-game

> Buzzer 問答（Phase 1）+ 偵探解謎（Phase 2）monorepo。
> Phase 3 麻將在另一個 repo：`buzzer-mahjong`。

## 當前狀態（2026-04-17）

- ✅ 專案骨架（npm workspaces：client / server / shared）
- ✅ Evidence Pack V2 模組（Phase 1 Quiz + Phase 2 Detective）
- ✅ 劇本 A《老街失蹤疑雲》Chapter 0 draft（inkle/ink 格式，4 場景、3 線索、2 結局）
- ✅ Phase 2 inkjs runtime + scene renderer 骨架
- 🔜 Phase 1（問答）延後 — 依 Ace 指示先做 Phase 2

## 快速啟動

```bash
cd "/Users/aceku/Documents/Claude/Projects/My Team/buzzer-game"
npm install
npm run license-check        # 白名單前置檢查
npm run build:ink            # 需要 inklecate CLI（Apache-2.0）
npm run dev                  # client 3000 + server 4120
```

## 安裝 inklecate（Phase 2 必備）

```bash
brew install inkle/tools/inklecate
# 或從 https://github.com/inkle/ink/releases 下載對應平台
```

## 架構

```
client/   (Vite + vanilla JS)      → Phase 1 問答 UI + Phase 2 偵探 UI
server/   (Express)                → Evidence Pack 簽章 + 章節 API
shared/   (純 JS)                   → Evidence Pack V2 + 型別
scenarios/                         → ink 劇本 + manifest
scripts/                           → license-check, compile-ink
```

## Evidence Pack V2

每一次完整遊戲會話結束時，產出一份：

```json
{
  "evidence_version": "detective.v2",
  "session_id": "...",
  "player_id": "...",
  "behavior_sequence": [...],
  "clues_collected": [...],
  "reasoning_trace": [...],     // ★ 企業客戶最看重
  "outcomes": { ... },
  "evidence_tags": [...],
  "signature": "HMAC-SHA256"
}
```

`signature` 由 server 端以 `EVIDENCE_SECRET` 計算。

## LICENSE

- 專案本身：UNLICENSED（內部）
- 依賴必須通過 `npm run license-check`（白名單：MIT / Apache-2.0 / BSD / ISC / CC0 / CC-BY-4.0）
- 劇本內容：原創，版權歸 Buzzer Team

詳見 `docs/LICENSES-REVIEW.md`。

## Git 初始化（首次）

```bash
cd "/Users/aceku/Documents/Claude/Projects/My Team/buzzer-game"
git init
git add .
git commit -m "🎬 Initial scaffold: Phase 2 detective engine (劇本 A)"
# 在 GitHub 建立 private repo jesmk522/buzzer-game 後
git remote add origin https://github.com/jesmk522/buzzer-game.git
git branch -M main
git push -u origin main
```

## 協作

- Daily dev agent：`Scheduled/buzzer-quiz-daily-dev/SKILL.md`（每日 06:10）
- 姊妹 repo：`buzzer-mahjong`（Phase 3）
- War Room 共用欄位：`metrics.json.buzzer_game`（本 repo 只 patch `quiz_*` / `detective_*`）
