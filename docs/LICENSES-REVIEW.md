# LICENSE 審查紀錄（buzzer-game）

> 白名單：`MIT / Apache-2.0 / BSD-2/3-Clause / ISC / CC0-1.0 / CC-BY-4.0 / Unlicense / 0BSD`
> 黑名單：`GPL / AGPL / LGPL / CC-BY-SA / SSPL / Commons-Clause / BUSL / 未授權`
>
> 自動檢查：`npm run license-check`（CI 阻擋點）

---

## 已確認白名單

| Package | Version | License | 來源 | 確認日期 |
|---|---|---|---|---|
| inkjs | ^2.2.2 | MIT | https://github.com/y-lohse/inkjs | 2026-04-17 |
| spdx-exceptions | 2.5.0 | CC-BY-3.0 | https://github.com/jslicense/spdx-exceptions.json | 2026-04-17 |
| inklecate（CLI tool）| N/A | Apache-2.0 | https://github.com/inkle/ink | 2026-04-17 |
| express | ^4 | MIT | https://github.com/expressjs/express | 2026-04-17 |
| vite | ^5 | MIT | https://github.com/vitejs/vite | 2026-04-17 |
| vitest | ^1 | MIT | https://github.com/vitest-dev/vitest | 2026-04-17 |
| npm-run-all | ^4 | MIT | https://github.com/mysticatea/npm-run-all | 2026-04-17 |

### inkle/ink 整合說明

- **引擎 repo**（`inkle/ink`）：Apache-2.0 — 僅用 CLI 編譯器 `inklecate`，不把整個 repo 原始碼納入
- **JS runtime**（`inkjs`，y-lohse 維護）：MIT — 安裝成 `inkjs` npm 套件
- **劇本內容**（`scenarios/*.ink`）：Buzzer 原創，版權歸 Buzzer Team

→ 三者授權相容，可商用。

---

## 黑名單拒絕紀錄

| Package / Source | 理由 | 替代方案 |
|---|---|---|
| Open Trivia DB (`opentdb.com`) | CC-BY-SA 4.0（ShareAlike 會污染整個題庫） | 自行撰寫防詐題庫，或採用 CC-BY-4.0 的政府開放資料 |
| `okaybenji/text-engine`（若誤選） | GPL-3.0 | `inkjs` (MIT) |
| 任何「All Rights Reserved」ink 劇本範例 | 無授權，不可商用 | 原創劇本（劇本 A《老街失蹤疑雲》） |

---

## 題目來源清單（Phase 1 問答，延後處理）

| 來源 | LICENSE | 可用性 |
|---|---|---|
| 政府開放資料（165 反詐 API） | CC-BY-4.0 | ✅ 可用（需標示來源） |
| 金管會統計資料 | 公共領域 | ✅ 可用 |
| 內政部警政署詐騙類型 | 公共領域 | ✅ 可用 |
| Open Trivia DB | CC-BY-SA | ❌ 拒絕 |
| 各銀行官方防詐文宣 | © 各銀行 | ⚠️ 需授權洽談 |

---

## 素材授權（待建立）

- SVG 背景圖、icon、字型：另維護 `client/public/ASSETS-LICENSE.md`
- 字型建議：Noto Serif TC（SIL Open Font License 1.1，屬於白名單相容）
- 圖示：Font Awesome Free（CC-BY-4.0）或 Lucide（ISC）

---

## 審查原則

1. **僅看架構**、不複製代碼：禁用 repo 只作為思路參考
2. **LICENSE 文字必須明示**：README 提一句「MIT」不算，必須有實際 LICENSE 檔
3. **雙重授權**：若 `MIT OR GPL-3.0`，以 MIT 為準並註記
4. **CC-BY-4.0 可商用，但 CC-BY-SA 不可**（ShareAlike viral）
5. **Apache-2.0 可商用，需保留 NOTICE 檔案**
