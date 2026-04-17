# CHANGELOG — buzzer-game

## [0.0.1] - 2026-04-17

### Added
- 專案骨架（npm workspaces：client / server / shared）
- Evidence Pack V2 模組（`shared/evidence-pack/`）— 同時支援 Phase 1 問答與 Phase 2 偵探
  - `QuizEvidenceBuilder`：問答行為 → Evidence Pack quiz.v1
  - `DetectiveEvidenceBuilder`：偵探行為 + reasoning_trace → Evidence Pack detective.v2
  - `createHmacSigner` / `canonicalize` / `validateEvidencePack`
- 劇本 A《老街失蹤疑雲》Chapter 0（draft v1）
  - 4 個場景（老街茶行、當鋪、銀行、派出所）
  - 3 條線索路徑（pawn_receipt / bank_slip / grandson_message）
  - 2 個結局（full_solve / partial_solve）
  - manifest.json 含角色、evidence_tags、企業買家提示、合規註記
- Phase 2 runtime：`client/src/engine/detective-runtime.js`（inkjs 橋接 Evidence Pack Builder）
- Scene renderer：`client/src/engine/scene-renderer.js`（vanilla JS）
- Server stub（Express）：`/api/evidence/sign`、`/api/scenarios`、`/health`
- `scripts/check-licenses.js`：白名單掃描（與 buzzer-mahjong 對齊邏輯）
- `scripts/compile-ink.js`：inklecate CLI 包裝
- 文件：README、CLAUDE.md、LICENSES-REVIEW、QUIZ-DEV-LOG

### Notes
- Phase 1（問答）延後 — 依 Ace 指示先做 Phase 2
- 本版本為 handoff 版，下一步由 Claude Code 或 `buzzer-quiz-daily-dev` agent 接手
