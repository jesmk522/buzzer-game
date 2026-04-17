/**
 * Scene Renderer — 偵探場景 DOM 渲染（vanilla JS，無 framework）。
 *
 * 渲染責任：
 *   1. 背景 SVG（由 scene 的 tag 指定 /scenes/*.svg）
 *   2. 對白段落（逐段淡入）
 *   3. 選項按鈕（tag 中含 evidence_tags 會顯示標籤圖示）
 *   4. 線索欄（玩家收集到的線索即時顯示）
 *   5. 推理面板（玩家可記錄 hypothesis → 寫進 reasoning_trace）
 */

export class SceneRenderer {
  constructor(rootElement, runtime) {
    this.root = rootElement;
    this.runtime = runtime;
    this.collectedClues = new Set();
    this._build();
    this._hookRuntime();
  }

  _build() {
    this.root.innerHTML = `
      <div class="detective-layout">
        <div class="bg" id="scene-bg"></div>
        <div class="scene-title" id="scene-title"></div>
        <div class="paragraphs" id="paragraphs"></div>
        <div class="choices" id="choices"></div>
        <aside class="clues-panel">
          <h3>🔍 線索</h3>
          <ul id="clues-list"></ul>
          <button id="open-deduction">推理筆記</button>
        </aside>
      </div>
    `;
    this.bg = this.root.querySelector('#scene-bg');
    this.titleEl = this.root.querySelector('#scene-title');
    this.paragraphsEl = this.root.querySelector('#paragraphs');
    this.choicesEl = this.root.querySelector('#choices');
    this.cluesListEl = this.root.querySelector('#clues-list');
    this.root.querySelector('#open-deduction').addEventListener('click', () => this._openDeductionPanel());
  }

  _hookRuntime() {
    this.runtime.onSceneChange = ({ paragraphs, scene }) => this._renderScene({ paragraphs, scene });
    this.runtime.onChoicesAvailable = (choices) => this._renderChoices(choices);
    this.runtime.onEnd = (pack) => this._renderEnding(pack);

    // Intercept clue collection to update UI side panel
    const origCollect = this.runtime.builder.collectClue.bind(this.runtime.builder);
    this.runtime.builder.collectClue = (clue) => {
      origCollect(clue);
      if (!this.collectedClues.has(clue.clueId)) {
        this.collectedClues.add(clue.clueId);
        this._renderClue(clue);
      }
    };
  }

  _renderScene({ paragraphs, scene }) {
    if (scene) {
      this.titleEl.textContent = scene.title || '';
      // Look for background tag
      const firstParaWithBg = paragraphs.find((p) => p.tags.some((t) => t.startsWith('background:')));
      if (firstParaWithBg) {
        const bgTag = firstParaWithBg.tags.find((t) => t.startsWith('background:'));
        const bgUrl = bgTag.replace(/^background:\s*/, '').trim();
        this.bg.style.backgroundImage = `url("${bgUrl}")`;
      }
    }
    this.paragraphsEl.innerHTML = '';
    for (const p of paragraphs) {
      const el = document.createElement('p');
      el.textContent = p.text;
      this.paragraphsEl.appendChild(el);
    }
  }

  _renderChoices(choices) {
    this.choicesEl.innerHTML = '';
    for (const c of choices) {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.textContent = c.text;
      const evTags = c.tags.filter((t) => t.startsWith('evidence_tags:'));
      if (evTags.length > 0) {
        const badge = document.createElement('span');
        badge.className = 'ev-badge';
        badge.textContent = '📋';
        badge.title = evTags.map((t) => t.replace('evidence_tags:', '')).join(', ');
        btn.appendChild(badge);
      }
      btn.addEventListener('click', () => this.runtime.choose(c.index));
      this.choicesEl.appendChild(btn);
    }
  }

  _renderClue(clue) {
    const li = document.createElement('li');
    li.textContent = `🔖 ${clue.name}${clue.isDecisive ? ' ★' : ''}`;
    this.cluesListEl.appendChild(li);
  }

  _openDeductionPanel() {
    const hyp = prompt('你目前的推論是什麼？（可隨時更新）');
    if (!hyp) return;
    const ids = prompt('支持這個推論的線索 ID（逗號分隔）？') || '';
    this.runtime.recordReasoning({
      hypothesis: hyp,
      supportingClueIds: ids.split(',').map((s) => s.trim()).filter(Boolean),
      confidence: 0.5,
    });
    alert('已寫入推理序列。');
  }

  _renderEnding(pack) {
    this.choicesEl.innerHTML = '';
    const summary = document.createElement('div');
    summary.className = 'ending-summary';
    summary.innerHTML = `
      <h2>📦 Evidence Pack 已產出</h2>
      <p>結局：<strong>${pack.ending || 'unknown'}</strong></p>
      <p>收集線索：${pack.outcomes.clues_total} 個（決定性：${pack.outcomes.decisive_clues_found}）</p>
      <p>推理步驟：${pack.reasoning_trace.length}</p>
      <p>行為標籤：${pack.evidence_tags.join('、')}</p>
      <button id="download-pack">下載我的 Evidence Pack</button>
    `;
    this.paragraphsEl.appendChild(summary);
    summary.querySelector('#download-pack').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidence-pack-${pack.session_id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
