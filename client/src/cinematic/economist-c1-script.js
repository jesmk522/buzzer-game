/**
 * 經濟學家模組 Chapter 1《泰銖的骨牌》
 *
 * 主題：1997 亞洲金融風暴
 * 背景：1997年7月2日泰銖貶值 → 區域連鎖崩盤 → 台灣 10 月受波及
 * 玩家：台灣投資銀行研究部助理，協助首席分析師張博士
 *
 * Behavioral probes：
 *   - 「台灣有外匯存底保護，不一樣」的信念 vs 數據，你選哪個？
 *   - 區域傳染效應（contagion）是否被低估？
 *   - 面對「這次不一樣」的樂觀敘事，你如何評估？
 *
 * dashboard 指標：
 *   twd    — 台幣匯率（NT$/USD，越高越弱）
 *   taiex  — 台股加權指數
 *   fx     — 外匯存底（億美元）
 *
 * 結局：
 *   contrarian — 早期識別傳染風險，質疑「台灣例外論」
 *   consensus  — 跟隨主流敘事，危機後才調整
 */

export const ECONOMIST_C1_START = 'ec1_intro';

export const ECONOMIST_C1_DASHBOARD_META = {
  twd:   { label: '台幣匯率',     fmt: v => v.toFixed(1),                      higherIsBad: true  },
  taiex: { label: '台股加權',     fmt: v => Math.round(v).toLocaleString(),     higherIsBad: false },
  fx:    { label: '外匯存底(億)', fmt: v => Math.round(v).toString(),           higherIsBad: false },
};

export const ECONOMIST_C1_SCENES = {

  ec1_intro: {
    id: 'ec1_intro',
    title: '第一場 · 研究部 · 1997 年 7 月',
    sceneKey: 'office',
    dashboard: { twd: 27.8, taiex: 9608, fx: 884 },
    beats: [
      { type: 'narrate',  text: '1997 年 7 月 2 日早上，泰銖貶值 15%。',                                                                     ms: 2400 },
      { type: 'narrate',  text: '張博士把報紙丟在你桌上，說了一句話就進會議室：',                                                             ms: 2000 },
      { type: 'dialogue', speaker: '張博士', text: '「泰國跟台灣不一樣。我們有 880 億外匯存底，做一個說明，讓客戶安心。」',                   ms: 3800 },
      { type: 'narrate',  text: '你打開彭博，看著馬來西亞林吉特、印尼盾、菲律賓披索的即時報價。',                                             ms: 3000 },
      { type: 'narrate',  text: '它們都在動。',                                                                                               ms: 1600 },
    ],
    choice: {
      prompt: '你先做哪個分析？',
      options: [
        { label: '整理亞洲各國外匯存底 vs 短期外債比率',    icon: '📊', next: 'ec1_fx_analysis' },
        { label: '照指示，先準備「台灣穩健」的客戶說帖',    icon: '📄', next: 'ec1_client_note' },
      ],
    },
  },

  // ── 路線 A：先做傳染分析 ──────────────────────────────────

  ec1_fx_analysis: {
    id: 'ec1_fx_analysis',
    title: '第二場 · 數據室 · 傳染效應',
    sceneKey: 'data',
    dashboard: { twd: 28.1, taiex: 9240, fx: 884 },
    clueUnlock: {
      label: '訊號解鎖：資金外流指標',
      icon: '📉',
      detail: '外資連 5 日淨賣超 · 台幣小幅走貶 · 銀行間拆借利率升',
    },
    beats: [
      { type: 'narrate',    text: '你比較了六個亞洲經濟體的數字。',                                                                           ms: 2000 },
      { type: 'annotation', text: '泰國：外匯存底 / 短期外債 = 0.7（不足） · 台灣：3.2（健康）',                                            ms: 3000 },
      { type: 'narrate',    text: '台灣的數字確實比泰國好。但你注意到另一件事：',                                                             ms: 2400 },
      { type: 'annotation', text: '外資過去一週淨賣超台股 NT$420 億，台幣出現小幅貶值壓力',                                                  ms: 3000 },
      { type: 'narrate',    text: '傳染效應不需要基本面一樣，只需要資金恐慌一樣。',                                                           ms: 2800 },
    ],
    choice: {
      prompt: '你把這個分析結果做了什麼？',
      options: [
        { label: '附在報告裡，標注「傳染風險：中等」',      icon: '⚠️', next: 'ec1_flag_risk' },
        { label: '張博士說台灣不一樣，先把這段拿掉',        icon: '📭', next: 'ec1_suppress' },
      ],
    },
  },

  ec1_flag_risk: {
    id: 'ec1_flag_risk',
    title: '第二場 · 風險標注',
    sceneKey: 'data',
    dashboard: { twd: 28.3, taiex: 9105, fx: 884 },
    beats: [
      { type: 'narrate',  text: '張博士看到了那段「傳染風險：中等」的標注，皺了一下眉。',                                                     ms: 2600 },
      { type: 'dialogue', speaker: '張博士', text: '「別嚇客戶。加一個備注：台灣基本面健全，外匯存底充裕。」',                               ms: 3400 },
      { type: 'narrate',  text: '你加了。但風險標注還在那裡。',                                                                               ms: 2200 },
    ],
    next: 'ec1_september',
  },

  ec1_suppress: {
    id: 'ec1_suppress',
    title: '第二場 · 說帖',
    sceneKey: 'data',
    dashboard: { twd: 28.3, taiex: 9105, fx: 884 },
    beats: [
      { type: 'narrate',  text: '報告發出去了。乾淨、樂觀、沒有讓人不安的字眼。',                                                             ms: 2200 },
      { type: 'narrate',  text: '你把那份傳染效應分析存在自己的桌面資料夾，沒有給任何人看。',                                                 ms: 2800 },
    ],
    next: 'ec1_september',
  },

  // ── 路線 B：先做說帖 ──────────────────────────────────────

  ec1_client_note: {
    id: 'ec1_client_note',
    title: '第二場 · 客戶說帖 · 1997 Q3',
    sceneKey: 'meeting',
    dashboard: { twd: 27.9, taiex: 9408, fx: 884 },
    beats: [
      { type: 'narrate',  text: '說帖做好了：台灣外匯存底充裕、出口競爭力強、金融體系穩健。',                                                 ms: 2800 },
      { type: 'narrate',  text: '張博士滿意地點頭。客戶看了也安心了。',                                                                       ms: 2200 },
      { type: 'narrate',  text: '八月，韓元開始搖晃。九月，印尼盾崩了。',                                                                     ms: 2400 },
      { type: 'dialogue', speaker: '陳姐', text: '「你有沒有把外資流出的數字放進去？」她走過你桌邊。',                                         ms: 3000 },
    ],
    choice: {
      prompt: '你怎麼回應陳姐？',
      options: [
        { label: '「我去查一下，加進下一版」',              icon: '🔍', next: 'ec1_fx_analysis' },
        { label: '「張博士說不要嚇客戶」',                  icon: '💼', next: 'ec1_september' },
      ],
    },
  },

  // ── 共同場景：10 月台股崩盤 ───────────────────────────────

  ec1_september: {
    id: 'ec1_september',
    title: '第三場 · 新聞室 · 1997 年 10 月',
    sceneKey: 'newsroom',
    dashboard: { twd: 29.6, taiex: 7851, fx: 831 },
    beats: [
      { type: 'narrate',  text: '10 月 17 日。台灣中央銀行宣布放棄保衛台幣。',                                                               ms: 2800 },
      { type: 'narrate',  text: '台幣單日貶值 3.2%，台股下跌 6.1%。',                                                                        ms: 2400 },
      { type: 'narrate',  text: '三個月前你的客戶說帖裡，有一句「台灣基本面健全，外匯存底充裕」。',                                           ms: 3200 },
      { type: 'dialogue', speaker: '張博士', text: '「召集所有客戶，要有一個說法。」',                                                         ms: 2600 },
    ],
    choice: {
      prompt: '你在會議前準備了什麼？',
      options: [
        { label: '回顧你存的傳染效應分析，整理成新的風險評估',  icon: '🔬', next: 'ec1_reassess' },
        { label: '準備「短期波動，長期仍看好台灣」的說帖',      icon: '📋', next: 'ec1_client_meeting' },
      ],
    },
  },

  ec1_reassess: {
    id: 'ec1_reassess',
    title: '第三場 · 重新評估',
    sceneKey: 'data',
    dashboard: { twd: 30.1, taiex: 7612, fx: 820 },
    clueUnlock: {
      label: '訊號解鎖：區域傳染路徑',
      icon: '🌏',
      detail: '泰銖→林吉特→印尼盾→韓元→台幣：32 天傳染鏈',
    },
    beats: [
      { type: 'narrate',    text: '你把七月那份分析拿出來，加上現在的實際數字。',                                                              ms: 2400 },
      { type: 'annotation', text: '傳染路徑：泰銖（7/2）→ 林吉特（7/11）→ 印尼盾（8/14）→ 韓元（9/2）→ 台幣（10/17）',                     ms: 3600 },
      { type: 'narrate',    text: '32 天的間隔，非常規律。資金的邏輯比基本面快。',                                                            ms: 2800 },
      { type: 'narrate',    text: '你帶著這份分析走進會議室。',                                                                               ms: 1800 },
    ],
    next: 'ec1_client_meeting',
  },

  ec1_client_meeting: {
    id: 'ec1_client_meeting',
    title: '第四場 · 客戶會議 · 危機中',
    sceneKey: 'meeting',
    dashboard: { twd: 30.4, taiex: 7418, fx: 815 },
    beats: [
      { type: 'narrate',  text: '客戶的臉色不好看。',                                                                                         ms: 1800 },
      { type: 'dialogue', speaker: '客戶', text: '「你們七月說台灣不一樣。現在台幣跌了 8%，我的部位損失了 15%。」',                           ms: 3800 },
      { type: 'narrate',  text: '張博士轉向你。',                                                                                             ms: 1600 },
    ],
    choice: {
      prompt: '你的回應是？',
      options: [
        { label: '「傳染效應比我們預期的快，我們七月的評估低估了資金流動的速度」', icon: '⚠️', next: 'ec1_ending_contrarian' },
        { label: '「台灣基本面仍然健全，這是短暫的市場情緒波動」',               icon: '🟢', next: 'ec1_ending_consensus' },
      ],
    },
  },

  // ── 結局 ──────────────────────────────────────────────────

  ec1_ending_contrarian: {
    id: 'ec1_ending_contrarian',
    title: '結局 · 32 天',
    sceneKey: 'aftermath',
    dashboard: { twd: 32.7, taiex: 6882, fx: 792 },
    beats: [
      { type: 'narrate',  text: '客戶沉默了。然後問：「那你現在的評估是什麼？」',                                                              ms: 3000 },
      { type: 'narrate',  text: '你把那份傳染路徑分析翻出來。32 天的規律，韓元之後是誰？',                                                    ms: 3000 },
      { type: 'narrate',  text: '張博士沒有打斷你。',                                                                                         ms: 1800 },
      { type: 'dialogue', speaker: '張博士', text: '「你七月就做了這個分析？」',                                                               ms: 2400 },
      { type: 'narrate',  text: '你沒有回答。',                                                                                               ms: 1400 },
      { type: 'epilogue', text: '〔行為紀錄〕本次模擬中，玩家在區域危機初期即識別傳染效應，並在機構敘事（台灣例外論）與數據信號之間，優先選擇數據。屬於「反向思維型」決策模式。', ms: 4800 },
    ],
    outcome: 'contrarian',
  },

  ec1_ending_consensus: {
    id: 'ec1_ending_consensus',
    title: '結局 · 市場情緒',
    sceneKey: 'aftermath',
    dashboard: { twd: 32.7, taiex: 6882, fx: 792 },
    beats: [
      { type: 'narrate',  text: '客戶點點頭，但眼神裡有什麼東西你沒有辦法解讀。',                                                              ms: 2800 },
      { type: 'narrate',  text: '台幣在接下來兩個月繼續貶。台股最低跌到 5,422 點。',                                                          ms: 3000 },
      { type: 'narrate',  text: '陳姐後來說：「七月的時候，外資流出的數字就已經說了一切。」',                                                  ms: 3200 },
      { type: 'epilogue', text: '〔行為紀錄〕本次模擬中，玩家傾向跟隨機構主流敘事，在面對「台灣例外論」時未充分質疑傳染效應。屬於「共識跟隨型」決策模式。', ms: 4800 },
    ],
    outcome: 'consensus',
  },
};
