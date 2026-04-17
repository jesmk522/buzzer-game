/**
 * Detective Runtime — 串接 inkjs + Evidence Pack V2 的橋樑。
 *
 * inkjs 是 inkle/ink 的 JS port（MIT License）
 *   https://github.com/y-lohse/inkjs
 *
 * 這層負責：
 *   1. 從編譯好的 .ink.json 建立 ink Story
 *   2. 把玩家的所有互動（enter scene / pick choice / collect clue）寫進 DetectiveEvidenceBuilder
 *   3. 解析 ink 標籤（# evidence_tags, # clue_unlock, # scene_id 等）
 *   4. 在章節結束時呼叫 finalize(signer) 取得簽章 Evidence Pack
 */

import { Story } from 'inkjs';
import { DetectiveEvidenceBuilder, EVIDENCE_TAGS } from '@buzzer-game/shared/evidence-pack';

export class DetectiveRuntime {
  /**
   * @param {Object} opts
   * @param {Object} opts.compiledInk     — ink compiler 輸出的 JSON
   * @param {string} opts.sessionId
   * @param {string} opts.playerId
   * @param {string} opts.scenario        — e.g. "detective-a-missing-elder"
   * @param {string} opts.chapterId       — e.g. "ch0"
   * @param {Function} opts.onSceneChange (scene) => void
   * @param {Function} opts.onChoicesAvailable (choices) => void
   * @param {Function} opts.onEnd (finalPack) => void
   */
  constructor({ compiledInk, sessionId, playerId, scenario, chapterId, onSceneChange, onChoicesAvailable, onEnd }) {
    this.story = new Story(compiledInk);
    this.builder = new DetectiveEvidenceBuilder({ sessionId, playerId, scenario, chapterId });
    this.onSceneChange = onSceneChange || (() => {});
    this.onChoicesAvailable = onChoicesAvailable || (() => {});
    this.onEnd = onEnd || (() => {});
    this.currentScene = null;
  }

  start() {
    this.advance();
  }

  /**
   * Pull all available text + tags until we hit a set of choices or the end.
   */
  advance() {
    const paragraphs = [];
    while (this.story.canContinue) {
      const line = this.story.Continue();
      const tags = this.story.currentTags || [];
      this._processTags(tags);
      if (line.trim().length > 0) paragraphs.push({ text: line.trim(), tags });
    }

    if (this.story.currentChoices.length > 0) {
      this.onSceneChange({ paragraphs, scene: this.currentScene });
      this.onChoicesAvailable(
        this.story.currentChoices.map((c, idx) => ({
          index: idx,
          text: c.text,
          tags: c.tags || [],
        }))
      );
    } else {
      // End of chapter
      this.onSceneChange({ paragraphs, scene: this.currentScene });
      this._finalize();
    }
  }

  choose(choiceIndex) {
    const choice = this.story.currentChoices[choiceIndex];
    if (!choice) return;
    this.builder.pickChoice({
      sceneId: this.currentScene?.id || 'unknown',
      choiceText: choice.text,
      gotoKnot: choice.targetPath || null,
    });
    // Evidence tags attached to the choice
    for (const tag of choice.tags || []) {
      const evTag = this._parseEvidenceTag(tag);
      if (evTag) this.builder.addTag(evTag);
    }
    this.story.ChooseChoiceIndex(choiceIndex);
    this.advance();
  }

  /**
   * Allow UI to record reasoning hypothesis from the player (e.g. a notepad widget).
   */
  recordReasoning({ hypothesis, supportingClueIds, confidence }) {
    this.builder.addReasoningStep({ hypothesis, supportingClueIds, confidence });
  }

  _processTags(tags) {
    for (const tag of tags) {
      const [key, ...rest] = tag.split(':').map((s) => s.trim());
      const value = rest.join(':').trim();

      if (key === 'scene_id') {
        this.currentScene = { id: value, title: this.currentScene?.title || '' };
        this.builder.enterScene(value, this.currentScene?.title || '');
      } else if (key === 'scene_title') {
        this.currentScene = { id: this.currentScene?.id || 'unknown', title: value };
      } else if (key === 'clue_unlock') {
        this.builder.collectClue({
          clueId: value,
          name: value.replace(/_/g, ' '),
          isDecisive: this._isDecisiveClue(value),
        });
      } else if (key === 'evidence_tags') {
        value.split(',').map((s) => s.trim()).forEach((raw) => {
          const ev = this._parseEvidenceTag(raw);
          if (ev) this.builder.addTag(ev);
        });
      } else if (key === 'deduction') {
        // Tag set on the final-deduction choice
        this.builder.submitDeduction({
          answer: this.currentScene?.id || 'final',
          correct: value === 'correct',
        });
      } else if (key === 'ending_id') {
        this.builder.setEnding(value);
      }
    }
  }

  _parseEvidenceTag(raw) {
    const normalized = raw.replace(/^evidence_tags:\s*/, '').trim();
    // Match against whitelist
    const whitelist = Object.values(EVIDENCE_TAGS);
    return whitelist.includes(normalized) ? normalized : null;
  }

  _isDecisiveClue(clueId) {
    // In 劇本 A Ch0, bank_slip is decisive; others are supporting.
    return clueId === 'bank_slip';
  }

  async _finalize(signer) {
    const pack = await this.builder.finalize(signer || null);
    this.onEnd(pack);
  }
}
