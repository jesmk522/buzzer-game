/**
 * @buzzer-game/shared/evidence-pack
 *
 * Evidence Pack V2：涵蓋 Phase 1（問答）與 Phase 2（偵探解謎）。
 *
 * 設計原則：
 *   1. 不可刪欄位（會破壞舊 client）
 *   2. signature 由 server HMAC-SHA256 計算，client 不得偽造
 *   3. behavior_sequence 可延伸 payload，但 action enum 固定
 *   4. Phase 2 新增 `reasoning_trace`：玩家推理決策序列，是企業買家（HR / ESG）最重視的欄位
 */

export const EVIDENCE_VERSIONS = Object.freeze({
  QUIZ: 'quiz.v1',
  DETECTIVE: 'detective.v2',
});

export const SCHEMA_URLS = Object.freeze({
  QUIZ: 'https://buzzer.example/evidence-pack/quiz.v1.schema.json',
  DETECTIVE: 'https://buzzer.example/evidence-pack/detective.v2.schema.json',
});

export const EVIDENCE_TAGS = Object.freeze({
  // 通用
  COMPLETED_SESSION: 'completed_session',
  NO_REAL_MONEY: 'no_real_money',
  COMPLIANT_PLAY: 'compliant_play',
  // Phase 1 問答 — 防詐系列
  FRAUD_RECOGNITION: 'fraud_recognition',
  SCAM_RESISTANCE: 'scam_resistance',
  // Phase 1 問答 — 金融 / ESG
  FINANCIAL_LITERACY: 'financial_literacy',
  ESG_AWARENESS: 'esg_awareness',
  // Phase 2 偵探
  DEDUCTIVE_REASONING: 'deductive_reasoning',
  EVIDENCE_SEEKING: 'evidence_seeking',
  CRITICAL_THINKING: 'critical_thinking',
  RESISTS_CONFIRMATION_BIAS: 'resists_confirmation_bias',
});

export const QUIZ_ACTIONS = Object.freeze({
  VIEW: 'view_question',
  ANSWER: 'answer',
  SKIP: 'skip',
  REVIEW_EXPLANATION: 'review_explanation',
});

export const DETECTIVE_ACTIONS = Object.freeze({
  ENTER_SCENE: 'enter_scene',
  PICK_CHOICE: 'pick_choice',
  COLLECT_CLUE: 'collect_clue',
  REVIEW_CLUES: 'review_clues',
  SUBMIT_DEDUCTION: 'submit_deduction',
  FINISH_CHAPTER: 'finish_chapter',
});

// ---------------- QUIZ ----------------

export class QuizEvidenceBuilder {
  constructor({ sessionId, playerId, deckId, scenario = 'anti_fraud_starter' }) {
    if (!sessionId || !playerId) throw new Error('QuizEvidenceBuilder: sessionId+playerId required');
    this.pack = {
      evidence_version: EVIDENCE_VERSIONS.QUIZ,
      schema_url: SCHEMA_URLS.QUIZ,
      session_id: sessionId,
      player_id: playerId,
      game_meta: {
        phase: 'phase_1_quiz',
        scenario,          // anti_fraud_starter | finance_checkup | esg_daily
        deck_id: deckId || null,
        started_at: new Date().toISOString(),
        ended_at: null,
      },
      behavior_sequence: [],
      outcomes: {
        questions_total: 0,
        questions_correct: 0,
        streak_max: 0,
        avg_think_ms: 0,
      },
      evidence_tags: [EVIDENCE_TAGS.NO_REAL_MONEY, EVIDENCE_TAGS.COMPLIANT_PLAY],
      signature: null,
    };
    this._lastAt = Date.now();
    this._streak = 0;
  }

  recordAnswer({ questionId, category, correct, chosenIndex }) {
    const now = Date.now();
    const thinkMs = now - this._lastAt;
    this._lastAt = now;

    this.pack.behavior_sequence.push({
      t: new Date(now).toISOString(),
      action: QUIZ_ACTIONS.ANSWER,
      question_id: questionId,
      category,
      chosen_index: chosenIndex,
      correct,
      think_ms: thinkMs,
    });

    this.pack.outcomes.questions_total += 1;
    if (correct) {
      this.pack.outcomes.questions_correct += 1;
      this._streak += 1;
      this.pack.outcomes.streak_max = Math.max(this.pack.outcomes.streak_max, this._streak);
    } else {
      this._streak = 0;
    }
    return this;
  }

  addTag(tag) {
    if (!this.pack.evidence_tags.includes(tag)) this.pack.evidence_tags.push(tag);
    return this;
  }

  async finalize(signer) {
    this.pack.game_meta.ended_at = new Date().toISOString();
    const seq = this.pack.behavior_sequence;
    if (seq.length > 0) {
      this.pack.outcomes.avg_think_ms = Math.round(
        seq.reduce((a, b) => a + (b.think_ms || 0), 0) / seq.length
      );
    }
    // 自動補 category-specific 標籤
    const categories = new Set(seq.map((s) => s.category).filter(Boolean));
    if (categories.has('anti_fraud')) this.addTag(EVIDENCE_TAGS.FRAUD_RECOGNITION);
    if (categories.has('finance')) this.addTag(EVIDENCE_TAGS.FINANCIAL_LITERACY);
    if (categories.has('esg')) this.addTag(EVIDENCE_TAGS.ESG_AWARENESS);

    // Accuracy threshold for "scam resistance"
    const accuracy =
      this.pack.outcomes.questions_total === 0
        ? 0
        : this.pack.outcomes.questions_correct / this.pack.outcomes.questions_total;
    if (accuracy >= 0.8 && this.pack.outcomes.questions_total >= 10 && categories.has('anti_fraud')) {
      this.addTag(EVIDENCE_TAGS.SCAM_RESISTANCE);
    }

    const unsigned = { ...this.pack };
    delete unsigned.signature;
    const canonical = canonicalize(unsigned);
    if (typeof signer === 'function') this.pack.signature = await signer(canonical);
    return { ...this.pack };
  }
}

// ---------------- DETECTIVE (Phase 2) ----------------

export class DetectiveEvidenceBuilder {
  constructor({ sessionId, playerId, scenario = 'detective-a-missing-elder', chapterId = 'ch0' }) {
    if (!sessionId || !playerId) throw new Error('DetectiveEvidenceBuilder: sessionId+playerId required');
    this.pack = {
      evidence_version: EVIDENCE_VERSIONS.DETECTIVE,
      schema_url: SCHEMA_URLS.DETECTIVE,
      session_id: sessionId,
      player_id: playerId,
      game_meta: {
        phase: 'phase_2_detective',
        scenario,           // detective-a-missing-elder | detective-b-workplace | detective-c-ai-rumor
        chapter_id: chapterId,
        started_at: new Date().toISOString(),
        ended_at: null,
      },
      behavior_sequence: [],
      clues_collected: [],
      reasoning_trace: [],   // ★ 企業客戶最重視的欄位
      ending: null,          // which ending the player reached
      outcomes: {
        scenes_visited: 0,
        choices_made: 0,
        clues_total: 0,
        decisive_clues_found: 0,
        final_deduction_correct: null,
      },
      evidence_tags: [EVIDENCE_TAGS.NO_REAL_MONEY, EVIDENCE_TAGS.COMPLIANT_PLAY],
      signature: null,
    };
    this._lastAt = Date.now();
  }

  enterScene(sceneId, sceneTitle) {
    const now = Date.now();
    this.pack.behavior_sequence.push({
      t: new Date(now).toISOString(),
      action: DETECTIVE_ACTIONS.ENTER_SCENE,
      scene_id: sceneId,
      scene_title: sceneTitle,
    });
    this.pack.outcomes.scenes_visited += 1;
    this._lastAt = now;
    return this;
  }

  pickChoice({ sceneId, choiceText, gotoKnot }) {
    const now = Date.now();
    const thinkMs = now - this._lastAt;
    this.pack.behavior_sequence.push({
      t: new Date(now).toISOString(),
      action: DETECTIVE_ACTIONS.PICK_CHOICE,
      scene_id: sceneId,
      choice_text: choiceText,
      goto_knot: gotoKnot,
      think_ms: thinkMs,
    });
    this.pack.outcomes.choices_made += 1;
    this._lastAt = now;
    return this;
  }

  collectClue({ clueId, name, isDecisive = false }) {
    if (this.pack.clues_collected.find((c) => c.clue_id === clueId)) return this;
    this.pack.clues_collected.push({
      clue_id: clueId,
      name,
      is_decisive: isDecisive,
      collected_at: new Date().toISOString(),
    });
    this.pack.outcomes.clues_total += 1;
    if (isDecisive) this.pack.outcomes.decisive_clues_found += 1;
    this.pack.behavior_sequence.push({
      t: new Date().toISOString(),
      action: DETECTIVE_ACTIONS.COLLECT_CLUE,
      clue_id: clueId,
    });
    return this;
  }

  /**
   * 玩家的推理路徑 — 企業最重視的欄位。
   * 記錄：玩家「根據哪些線索，得出什麼假設，然後做了什麼行動」。
   */
  addReasoningStep({ hypothesis, supportingClueIds = [], confidence = 0.5 }) {
    this.pack.reasoning_trace.push({
      t: new Date().toISOString(),
      hypothesis,
      supporting_clue_ids: supportingClueIds,
      confidence, // 0..1
    });
    return this;
  }

  submitDeduction({ answer, correct }) {
    this.pack.behavior_sequence.push({
      t: new Date().toISOString(),
      action: DETECTIVE_ACTIONS.SUBMIT_DEDUCTION,
      answer,
      correct,
    });
    this.pack.outcomes.final_deduction_correct = !!correct;
    return this;
  }

  setEnding(endingId) {
    this.pack.ending = endingId;
    this.pack.behavior_sequence.push({
      t: new Date().toISOString(),
      action: DETECTIVE_ACTIONS.FINISH_CHAPTER,
      ending_id: endingId,
    });
    return this;
  }

  addTag(tag) {
    if (!this.pack.evidence_tags.includes(tag)) this.pack.evidence_tags.push(tag);
    return this;
  }

  async finalize(signer) {
    this.pack.game_meta.ended_at = new Date().toISOString();

    // 自動補推理品質標籤
    if (this.pack.reasoning_trace.length >= 3) this.addTag(EVIDENCE_TAGS.DEDUCTIVE_REASONING);
    if (this.pack.outcomes.clues_total >= 5) this.addTag(EVIDENCE_TAGS.EVIDENCE_SEEKING);
    if (this.pack.outcomes.final_deduction_correct) this.addTag(EVIDENCE_TAGS.CRITICAL_THINKING);

    // 「抵抗確認偏誤」：如果玩家在推理過程中 hypothesis 有更新（從一個改到另一個），表示願意根據新證據修正
    const hypotheses = new Set(this.pack.reasoning_trace.map((r) => r.hypothesis));
    if (hypotheses.size >= 2) this.addTag(EVIDENCE_TAGS.RESISTS_CONFIRMATION_BIAS);

    const unsigned = { ...this.pack };
    delete unsigned.signature;
    const canonical = canonicalize(unsigned);
    if (typeof signer === 'function') this.pack.signature = await signer(canonical);
    return { ...this.pack };
  }
}

// ---------------- Utilities ----------------

export function canonicalize(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalize(obj[k])).join(',') + '}';
}

export async function createHmacSigner(secret) {
  const { createHmac } = await import('node:crypto');
  return (canonical) => createHmac('sha256', secret).update(canonical).digest('hex');
}

export function validateEvidencePack(pack) {
  const errors = [];
  if (!pack || typeof pack !== 'object') errors.push('pack is not an object');
  const allowed = Object.values(EVIDENCE_VERSIONS);
  if (!allowed.includes(pack.evidence_version)) errors.push(`evidence_version: ${pack.evidence_version}`);
  if (!pack.session_id) errors.push('missing session_id');
  if (!pack.player_id) errors.push('missing player_id');
  if (!Array.isArray(pack.behavior_sequence)) errors.push('behavior_sequence must be array');
  if (!Array.isArray(pack.evidence_tags)) errors.push('evidence_tags must be array');
  if (pack.evidence_version === EVIDENCE_VERSIONS.DETECTIVE) {
    if (!Array.isArray(pack.clues_collected)) errors.push('clues_collected required for detective');
    if (!Array.isArray(pack.reasoning_trace)) errors.push('reasoning_trace required for detective');
  }
  return { valid: errors.length === 0, errors };
}
