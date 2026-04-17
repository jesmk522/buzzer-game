/**
 * 經濟學家模組 Chapter 2《黑天鵝的重量》
 *
 * 主題：COVID-19 市場崩盤 2020
 * 時間：2020 年 1 月（疫情消息出現）→ 3 月 20 日（美股第四次熔斷）
 * 玩家：資產管理公司助理，協助基金經理許總
 *
 * Behavioral probes：
 *   - 面對「前所未有」的黑天鵝，你傾向定錨在歷史還是接受未知？
 *   - 1 月的疫情消息，你多快認真對待？（早 = 低確認偏誤）
 *   - 流動性危機 vs 基本面惡化：你能分辨嗎？
 *   - 在極度不確定中，你對自己的判斷有多少信心？
 *
 * dashboard 指標：
 *   sp500  — S&P 500 指數
 *   vix    — VIX 恐慌指數
 *   tnote  — 10 年期美債殖利率（%）
 *
 * 結局：
 *   early_signal  — 在 2 月前識別系統性風險並調整部位
 *   late_pivot     — 跟隨市場，3 月後才大幅調整
 */

export const ECONOMIST_C2_START = 'ec2_intro';

export const ECONOMIST_C2_SCENES = {

  ec2_intro: {
    id: 'ec2_intro',
    title: '第一場 · 基金公司 · 2020 年 1 月',
    sceneKey: 'office',
    dashboard: { sp500: 3329, vix: 12.1, tnote: 1.88 },
    beats: [
      { type: 'narrate',  text: '2020 年 1 月 21 日。美股剛創歷史新高。',                                                                     ms: 2200 },
      { type: 'narrate',  text: '你打開晨報，有一條小新聞在第 8 頁：「中國武漢出現不明肺炎，WHO 關注中。」',                                  ms: 3200 },
      { type: 'dialogue', speaker: '許總', text: '「SARS 當年也這樣，三個月就過了。別影響你的報告。」',                                       ms: 3400 },
      { type: 'narrate',  text: '你把那條新聞存了起來，繼續整理一月的配置報告。',                                                             ms: 2600 },
    ],
    choice: {
      prompt: '你在報告裡加入了什麼？',
      options: [
        { label: '加一個「尾部風險：新興傳染病」的低機率情境', icon: '⚠️', next: 'ec2_tail_risk' },
        { label: '配置報告維持原樣，等疫情明朗再評估',          icon: '📄', next: 'ec2_wait' },
      ],
    },
  },

  // ── 路線 A：早期識別 ──────────────────────────────────────

  ec2_tail_risk: {
    id: 'ec2_tail_risk',
    title: '第二場 · 情境分析 · 1 月底',
    sceneKey: 'data',
    dashboard: { sp500: 3295, vix: 15.8, tnote: 1.68 },
    clueUnlock: {
      label: '訊號解鎖：R0 初始估值',
      icon: '🦠',
      detail: '初步 R0 估值 2.0-3.5 · 高於 SARS（0.8-1.2）',
    },
    beats: [
      { type: 'narrate',    text: '你查了 SARS 的 R0 值：0.8 到 1.2。',                                                                      ms: 2200 },
      { type: 'annotation', text: 'COVID-19 初步 R0 估值：2.0–3.5（Imperial College London，1/24）',                                        ms: 3000 },
      { type: 'narrate',    text: '傳播力是 SARS 的兩到三倍。武漢已封城。',                                                                   ms: 2400 },
      { type: 'narrate',    text: '你做了一個非常簡單的計算：如果這是全球性的，供應鏈 + 需求 + 流動性會同時受衝擊。',                         ms: 3400 },
    ],
    choice: {
      prompt: '你把這個分析給許總看了嗎？',
      options: [
        { label: '是。建議把波動率敞口和現金比例往上調',        icon: '📈', next: 'ec2_adjust_early' },
        { label: '沒有。數據還不夠確定，不想用尾部情境嚇到他', icon: '📭', next: 'ec2_wait_feb' },
      ],
    },
  },

  ec2_adjust_early: {
    id: 'ec2_adjust_early',
    title: '第二場 · 提前調整',
    sceneKey: 'data',
    dashboard: { sp500: 3282, vix: 17.2, tnote: 1.58 },
    beats: [
      { type: 'dialogue', speaker: '許總', text: '「這個……我不確定。市場還在新高，你確定現在調嗎？」',                                        ms: 3400 },
      { type: 'narrate',  text: '你說：不確定。但如果這個尾部情境發生，現在的調整成本很低，不調整的成本很高。',                               ms: 3600 },
      { type: 'dialogue', speaker: '許總', text: '「好。現金比例提高 5%，VIX 期貨小量建倉。」',                                               ms: 3000 },
    ],
    next: 'ec2_february',
  },

  ec2_wait_feb: {
    id: 'ec2_wait_feb',
    title: '第二場 · 等待',
    sceneKey: 'office',
    dashboard: { sp500: 3320, vix: 14.5, tnote: 1.72 },
    beats: [
      { type: 'narrate',  text: '一月過去了。二月第一週，市場還在高位。',                                                                     ms: 2400 },
      { type: 'narrate',  text: '你告訴自己：等數據更確定再說。',                                                                             ms: 2000 },
      { type: 'narrate',  text: '2 月 12 日，韓國確診人數一天跳了 400%。',                                                                    ms: 2600 },
    ],
    next: 'ec2_february',
  },

  // ── 路線 B：等待再評估 ────────────────────────────────────

  ec2_wait: {
    id: 'ec2_wait',
    title: '第二場 · 二月 · 疫情擴散',
    sceneKey: 'newsroom',
    dashboard: { sp500: 3349, vix: 13.7, tnote: 1.74 },
    beats: [
      { type: 'narrate',  text: '一月報告出去了，客戶滿意。',                                                                                 ms: 1800 },
      { type: 'narrate',  text: '二月初，義大利出現社區感染。韓國封城。',                                                                     ms: 2400 },
      { type: 'dialogue', speaker: '陳分析師', text: '「你有沒有想過，這次可能不像 SARS？」',                                                  ms: 2800 },
    ],
    choice: {
      prompt: '你的看法是？',
      options: [
        { label: '「有，我去更新一下風險情境」',              icon: '🔄', next: 'ec2_late_update' },
        { label: '「市場沒有明顯反應，再等等看」',            icon: '⏳', next: 'ec2_february' },
      ],
    },
  },

  ec2_late_update: {
    id: 'ec2_late_update',
    title: '第二場 · 遲來的更新',
    sceneKey: 'data',
    dashboard: { sp500: 3225, vix: 22.4, tnote: 1.46 },
    clueUnlock: {
      label: '訊號解鎖：跨市場流動性收縮',
      icon: '💧',
      detail: '美元急升 + 新興市場資金外流 + 公司債利差擴大',
    },
    beats: [
      { type: 'narrate',    text: '你這次看了更多數字：美元在升、新興市場有資金外流的跡象。',                                                  ms: 2800 },
      { type: 'annotation', text: '高收益債利差：+85bp · 美元指數：+1.8% · 黃金：+4.2%',                                                    ms: 3000 },
      { type: 'narrate',    text: '這不只是疫情恐慌，已經有流動性收縮的早期信號了。',                                                         ms: 3000 },
    ],
    next: 'ec2_february',
  },

  // ── 共同場景：2 月底大跌 ──────────────────────────────────

  ec2_february: {
    id: 'ec2_february',
    title: '第三場 · 新聞室 · 2020 年 2 月 24 日',
    sceneKey: 'newsroom',
    dashboard: { sp500: 2972, vix: 28.7, tnote: 1.38 },
    beats: [
      { type: 'narrate',  text: '2 月 24 日，美股開盤下跌 3.4%。這是 2 年來最大單日跌幅。',                                                  ms: 3200 },
      { type: 'narrate',  text: '許總走進來，臉色比市場還難看：',                                                                             ms: 2200 },
      { type: 'dialogue', speaker: '許總', text: '「客戶在問我們的曝險。你有沒有先做過壓力測試？」',                                           ms: 3400 },
    ],
    choice: {
      prompt: '你的準備狀況？',
      options: [
        { label: '「有。1 月的尾部情境已經覆蓋了這個情況」',   icon: '✅', next: 'ec2_prepared' },
        { label: '「沒有做過完整的壓力測試，現在馬上做」',     icon: '🔥', next: 'ec2_crisis_mode' },
      ],
    },
  },

  ec2_prepared: {
    id: 'ec2_prepared',
    title: '第三場 · 壓力測試（已備）',
    sceneKey: 'data',
    dashboard: { sp500: 2882, vix: 34.2, tnote: 1.22 },
    beats: [
      { type: 'narrate',  text: '你打開 1 月底做的尾部情境分析。',                                                                           ms: 2000 },
      { type: 'narrate',  text: '「情境 B：全球性傳染病，VIX 升至 35，S&P 500 下跌 20-25%」',                                               ms: 3000 },
      { type: 'narrate',  text: '現在的數字，還在情境 B 的預測範圍內。',                                                                     ms: 2400 },
      { type: 'dialogue', speaker: '許總', text: '「你一月就做了這個？」',                                                                    ms: 2400 },
    ],
    next: 'ec2_lehman_moment',
  },

  ec2_crisis_mode: {
    id: 'ec2_crisis_mode',
    title: '第三場 · 緊急壓力測試',
    sceneKey: 'crisis',
    dashboard: { sp500: 2746, vix: 41.8, tnote: 1.04 },
    beats: [
      { type: 'narrate',  text: '你開始做壓力測試。但市場沒有在等你。',                                                                       ms: 2600 },
      { type: 'narrate',  text: '每隔 20 分鐘，Bloomberg 的數字就跳一次。',                                                                   ms: 2400 },
      { type: 'narrate',  text: '你做完的時候，實際跌幅已經超出你的模型範圍。',                                                               ms: 2800 },
    ],
    next: 'ec2_lehman_moment',
  },

  ec2_lehman_moment: {
    id: 'ec2_lehman_moment',
    title: '第四場 · 交易室 · 3 月 16 日第四次熔斷',
    sceneKey: 'crisis',
    dashboard: { sp500: 2386, vix: 82.7, tnote: 0.73 },
    beats: [
      { type: 'narrate',  text: '3 月 16 日，美股開盤即觸發熔斷。這是三週內第四次。',                                                        ms: 3000 },
      { type: 'narrate',  text: 'VIX 衝到 82.7，超過 2008 年金融海嘯的高點。',                                                              ms: 2800 },
      { type: 'narrate',  text: '許總把所有人叫進會議室：',                                                                                   ms: 1800 },
      { type: 'dialogue', speaker: '許總', text: '「現在的問題不是跌多少，是有沒有流動性。告訴我你對接下來 30 天的判斷。」',                  ms: 4200 },
    ],
    choice: {
      prompt: '你的評估是？',
      options: [
        { label: '「這是流動性危機，Fed 必須出手，30 天內會看到政策底」', icon: '🏛️', next: 'ec2_ending_early' },
        { label: '「基本面崩壞，不確定性極高，建議繼續降低風險部位」',   icon: '🛡️', next: 'ec2_ending_late' },
      ],
    },
  },

  // ── 結局 ──────────────────────────────────────────────────

  ec2_ending_early: {
    id: 'ec2_ending_early',
    title: '結局 · 政策底',
    sceneKey: 'aftermath',
    dashboard: { sp500: 2584, vix: 57.1, tnote: 0.88 },
    beats: [
      { type: 'narrate',  text: '3 月 23 日，Fed 宣布無限量 QE。',                                                                          ms: 2600 },
      { type: 'narrate',  text: '那一天是這次崩盤的最低點。S&P 500 在接下來 12 個月漲了 78%。',                                              ms: 3200 },
      { type: 'narrate',  text: '許總說：「你一月就做了尾部情境，三月又看到了政策反轉的時機。」',                                             ms: 3400 },
      { type: 'narrate',  text: '你說：「我不確定是對的，只是把能看到的信號都放進來了。」',                                                   ms: 3200 },
      { type: 'epilogue', text: '〔行為紀錄〕本次模擬中，玩家在資訊極度不確定時，優先識別結構性信號（流動性 vs 基本面）。在黑天鵝情境下展現「系統性思維」與「信號分離能力」。', ms: 5000 },
    ],
    outcome: 'early_signal',
  },

  ec2_ending_late: {
    id: 'ec2_ending_late',
    title: '結局 · 保守的代價',
    sceneKey: 'aftermath',
    dashboard: { sp500: 2387, vix: 80.2, tnote: 0.75 },
    beats: [
      { type: 'narrate',  text: '你的建議被採納了。部位繼續降低，現金比例提高到 35%。',                                                       ms: 2800 },
      { type: 'narrate',  text: '3 月 23 日，Fed 宣布無限量 QE。市場開始反彈。',                                                            ms: 2800 },
      { type: 'narrate',  text: '你的基金那天持有太多現金，錯過了反彈的第一波，也是最大的一波。',                                             ms: 3200 },
      { type: 'dialogue', speaker: '陳分析師', text: '「在最不確定的時候，你需要一個判斷方向。謹慎本身不是方向。」',                           ms: 3800 },
      { type: 'epilogue', text: '〔行為紀錄〕本次模擬中，玩家在極度不確定的情境下傾向保守避險，未能區分「基本面風險」與「流動性危機」的政策反應差異。屬於「系統性不確定厭惡型」決策模式。', ms: 5000 },
    ],
    outcome: 'late_pivot',
  },
};
