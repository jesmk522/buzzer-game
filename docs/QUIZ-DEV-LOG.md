# buzzer-game 開發日誌

本檔由 `buzzer-quiz-daily-dev` agent 每日自動 append。格式：`## [YYYY-MM-DD] Phase N · Day M — 任務`。

---

## [2026-04-17] Phase 2 · Day 0 — 專案骨架初始化

手動初始化：
- npm workspaces（client / server / shared）
- Evidence Pack V2 模組（Quiz + Detective builder）
- 劇本 A《老街失蹤疑雲》Chapter 0 draft v1（inkle/ink 格式）
- inkjs runtime 橋接 Evidence Pack
- Scene renderer 骨架（vanilla JS + SVG 背景）
- Server stub（Express，Evidence Pack 簽章 + 章節 API）
- license-check + compile-ink 腳本

**待辦（Day 1）**：
- 跑 `npm install` 驗證依賴全白名單
- 安裝 `inklecate` CLI → `npm run build:ink`
- 本機 `npm run dev` 走完 Chapter 0 一輪
- 寫第一份 Evidence Pack JSON 範本（作為企業客戶 pitch 附件）

---
