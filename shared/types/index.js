/**
 * @buzzer-game/shared/types
 * 前後端共用的型別定義（JSDoc 形式，便於 IDE 補全且不需 TS 編譯）
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {string} id
 * @property {string} category         // e.g. "anti_fraud", "finance", "esg"
 * @property {string} question
 * @property {string[]} choices
 * @property {number} answer_index
 * @property {string} explanation
 * @property {string[]} evidence_tags  // ★ Phase 1 Evidence Pack 引用標籤
 * @property {"easy"|"medium"|"hard"} difficulty
 * @property {string} license           // 題目授權，預設 "CC-BY-4.0"
 */

/**
 * @typedef {Object} DetectiveScene
 * @property {string} id                // e.g. "ch0_s1_intro"
 * @property {string} scenario          // e.g. "detective-a-missing-elder"
 * @property {string} title
 * @property {string[]} background_svg
 * @property {DetectiveChoice[]} choices
 * @property {string[]} clue_ids_unlocked
 */

/**
 * @typedef {Object} DetectiveChoice
 * @property {string} text
 * @property {string} goto_knot         // ink knot reference
 * @property {string} [clue_id]
 * @property {string[]} [evidence_tags]
 */

/**
 * @typedef {Object} Clue
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {"physical"|"testimony"|"digital"|"financial"} type
 * @property {boolean} is_decisive      // 是否為推理決定性線索
 */

export {};
