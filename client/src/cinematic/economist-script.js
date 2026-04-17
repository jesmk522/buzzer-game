/**
 * 經濟學家模組《信號 · 2007》— Chapter 0
 *
 * 玩家身份：剛入職的研究助理，輔佐首席經濟學家王博士
 * 時間軸：2006 Q4 → 2007 → 2008 Sept 15（雷曼）→ 2009
 *
 * 核心 behavioral probe：
 *   - 玩家在第幾場開始感到不安？
 *   - 面對老闆壓力是否隱藏數據？
 *   - 危機爆發時的第一反應是什麼？
 *
 * 結局 outcome tags：
 *   prescient   — 早期識別系統風險
 *   reactive    — 跟隨共識，危機後才調整
 */

export const ECONOMIST_SCENE_START = 'onboard';

export const ECONOMIST_SCENES = {

  // ── 開場：入職第一天 ──────────────────────────────────────
  onboard: {
    id: 'onboard',
    title: '第一場 · 凱信研究部 · 2006 秋',
    sceneKey: 'office',
    beats: [
      { type: 'narrate',  text: '2006年秋天，你加入凱信金融研究部門，報到第一天。',                                                    ms: 2200 },
      { type: 'narrate',  text: '首席經濟學家王博士遞給你一疊報告，順口說了一句：',                                                    ms: 1800 },
      { type: 'dialogue', speaker: '王博士', text: '「今年 GDP 成長 3.2%，房市還有空間，好好做。」',                                   ms: 2800 },
      { type: 'narrate',  text: '你的桌上有兩份等待處理的任務。',                                                                      ms: 1600 },
    ],
    choice: {
      prompt: '你先處理哪一份？',
      options: [
        { label: '次級貸款違約率統計（過去 12 個月）', icon: '📊', next: 'subprime_data' },
        { label: '協助整理 Q4 樂觀展望報告',           icon: '📄', next: 'quarterly_report' },
      ],
    },
  },

  // ── 路線 A：看到數字 ──────────────────────────────────────

  subprime_data: {
    id: 'subprime_data',
    title: '第二場 · 數據室 · 2007 Q1',
    sceneKey: 'data',
    beats: [
      { type: 'narrate',    text: '數字不太對勁。',                                                                                   ms: 1400 },
      { type: 'narrate',    text: '次貸違約率連續三個月上升，幅度超出模型預期。加州、佛州最明顯。',                                     ms: 2800 },
      { type: 'annotation', text: 'Delinquency rate +0.8% MoM · 三個月前：+0.2%',                                                    ms: 2200 },
      { type: 'narrate',    text: '你把這份數據打印出來，放到王博士桌上。',                                                            ms: 1800 },
      { type: 'dialogue', speaker: '王博士', text: '「正常波動。次貸市場有它自己的季節性。不要放進報告，客戶看到會緊張。」',              ms: 3200 },
    ],
    choice: {
      prompt: '報告要怎麼處理這份數據？',
      options: [
        { label: '附在附錄，標注為「觀察項目」',       icon: '📎', next: 'flagged' },
        { label: '照指示，數據不入本次報告',            icon: '📭', next: 'buried' },
      ],
    },
  },

  flagged: {
    id: 'flagged',
    title: '第二場 · 數據室（續）',
    sceneKey: 'data',
    beats: [
      { type: 'narrate',  text: '你把數據壓在附錄第 14 頁，字級縮小，標注「僅供參考」。',                                             ms: 2400 },
      { type: 'narrate',  text: '沒有人會主動翻到這裡。但記錄在那裡。',                                                               ms: 2000 },
      { type: 'dialogue', speaker: '陳姐', text: '「你留了附錄？」她輕聲說。「好眼力。」',                                             ms: 2400 },
    ],
    next: 'bear_stearns',
  },

  buried: {
    id: 'buried',
    title: '第二場 · 數據室（續）',
    sceneKey: 'data',
    beats: [
      { type: 'narrate',  text: '報告交出去了。乾淨、漂亮、令人安心。',                                                               ms: 1800 },
      { type: 'narrate',  text: '但你心裡有一根刺沒有拔掉。',                                                                         ms: 1600 },
    ],
    next: 'bear_stearns',
  },

  // ── 路線 B：先做展望報告 ──────────────────────────────────

  quarterly_report: {
    id: 'quarterly_report',
    title: '第二場 · 會議室 · 2006 Q4',
    sceneKey: 'meeting',
    beats: [
      { type: 'narrate',  text: '展望報告：12 頁圖表，全是向右上方的箭頭。',                                                          ms: 1800 },
      { type: 'narrate',  text: '你幫忙整理完，送給王博士簽核。',                                                                     ms: 1600 },
      { type: 'dialogue', speaker: '陳姐', text: '「有沒有注意到次貸的違約率？三個月了，數字一直在爬。」她悄悄說。',                   ms: 3000 },
    ],
    choice: {
      prompt: '你怎麼回應陳姐？',
      options: [
        { label: '「我也覺得，我想去查一下」',          icon: '🔍', next: 'subprime_data' },
        { label: '「王博士說是正常波動，應該沒事」',    icon: '💼', next: 'bear_stearns' },
      ],
    },
  },

  // ── 共同場景：Bear Stearns 事件 ──────────────────────────

  bear_stearns: {
    id: 'bear_stearns',
    title: '第三場 · 新聞牆 · 2007 年 8 月',
    sceneKey: 'newsroom',
    beats: [
      { type: 'narrate',  text: '2007年8月1日。',                                                                                     ms: 1200 },
      { type: 'narrate',  text: 'Bloomberg 跑出一行字：Bear Stearns 旗下兩支次貸對沖基金宣告崩潰，損失超過 16 億美元。',              ms: 3200 },
      { type: 'narrate',  text: '辦公室裡安靜了幾秒。然後電話開始響。',                                                               ms: 2000 },
      { type: 'dialogue', speaker: '王博士', text: '「召集大家開會。要給客戶一個說法。」',                                             ms: 2200 },
    ],
    choice: {
      prompt: '你在會議前先做什麼分析？',
      options: [
        { label: '查 Bear Stearns 基金的次貸曝險比例', icon: '🔬', next: 'systemic_check' },
        { label: '準備「市場自我修正」的說帖',          icon: '📋', next: 'client_meeting' },
      ],
    },
  },

  systemic_check: {
    id: 'systemic_check',
    title: '第三場 · 數據室（緊急）',
    sceneKey: 'data',
    clueUnlock: {
      label: '訊號解鎖：系統性擴散指標',
      icon: '📉',
      detail: '次貸曝險跨越 12 家主要機構 · 槓桿比率均值 28x',
    },
    beats: [
      { type: 'narrate',    text: '你拉出跨機構次貸曝險數據。',                                                                       ms: 1600 },
      { type: 'annotation', text: '12 家主要金融機構均持有次貸衍生品 · 平均槓桿 28 倍',                                              ms: 2400 },
      { type: 'narrate',    text: '這不是 Bear Stearns 一家的問題。',                                                                 ms: 1800 },
      { type: 'narrate',    text: '你帶著這份數據走進會議室。',                                                                       ms: 1600 },
    ],
    next: 'client_meeting',
  },

  client_meeting: {
    id: 'client_meeting',
    title: '第四場 · 客戶會議 · 2007 Q3',
    sceneKey: 'meeting',
    beats: [
      { type: 'narrate',  text: '大客戶——一家退休基金的 CIO——直視著你們。',                                                          ms: 2200 },
      { type: 'dialogue', speaker: 'CIO', text: '「Bear Stearns 是個案，還是系統性問題？我需要一個直接的答案。」',                     ms: 3200 },
      { type: 'narrate',  text: '王博士轉向你。你是準備了數據的那個人。',                                                             ms: 2000 },
    ],
    choice: {
      prompt: '你的判斷是？',
      options: [
        { label: '「數據顯示次貸曝險已跨多家機構，這可能不是個案」', icon: '⚠️', next: 'warning_given' },
        { label: '「這是特定基金槓桿過高的問題，整體市場尚穩健」',   icon: '🟢', next: 'reassurance' },
      ],
    },
  },

  warning_given: {
    id: 'warning_given',
    title: '第四場 · 客戶會議（續）',
    sceneKey: 'meeting',
    beats: [
      { type: 'narrate',  text: '沉默持續了大概三秒。',                                                                               ms: 1600 },
      { type: 'dialogue', speaker: '王博士', text: '「我的助理比較謹慎。我們建議減少次貸相關曝險，持續追蹤。」',                       ms: 3000 },
      { type: 'narrate',  text: 'CIO 把你多看了一眼，然後點頭。',                                                                     ms: 1800 },
    ],
    next: 'lehman',
  },

  reassurance: {
    id: 'reassurance',
    title: '第四場 · 客戶會議（續）',
    sceneKey: 'meeting',
    beats: [
      { type: 'narrate',  text: '客戶點點頭，緊張稍微鬆了。',                                                                         ms: 1600 },
      { type: 'narrate',  text: '你說的跟王博士一致。會議順利結束。',                                                                 ms: 1800 },
      { type: 'narrate',  text: '但那份次貸數字，還壓在你的抽屜裡。',                                                                 ms: 1800 },
    ],
    next: 'lehman',
  },

  // ── 危機爆發 ──────────────────────────────────────────────

  lehman: {
    id: 'lehman',
    title: '第五場 · 交易室 · 2008 年 9 月 15 日',
    sceneKey: 'crisis',
    beats: [
      { type: 'narrate',  text: '2008 年 9 月 15 日，星期一，早上 8:47。',                                                           ms: 2000 },
      { type: 'narrate',  text: '你打開 Bloomberg。螢幕是紅的。',                                                                     ms: 1800 },
      { type: 'narrate',  text: '「Lehman Brothers Holdings Inc. files for Chapter 11 bankruptcy protection.」',                      ms: 3200 },
      { type: 'narrate',  text: '辦公室裡所有人都站了起來。',                                                                         ms: 1800 },
      { type: 'dialogue', speaker: '王博士', text: '「現在，你的判斷是什麼？」',                                                       ms: 2200 },
    ],
    choice: {
      prompt: '你的第一個建議是？',
      options: [
        { label: '「立即評估客戶曝險部位，準備最壞情境報告」', icon: '🚨', next: 'ending_prescient' },
        { label: '「等待 Fed 聲明，先穩住客戶情緒」',          icon: '⏳', next: 'ending_reactive' },
      ],
    },
  },

  // ── 結局 ──────────────────────────────────────────────────

  ending_prescient: {
    id: 'ending_prescient',
    title: '結局 · 危機備忘錄',
    sceneKey: 'aftermath',
    beats: [
      { type: 'narrate',  text: '你的建議被採納了。接下來 72 小時，整個團隊徹夜工作。',                                               ms: 2800 },
      { type: 'narrate',  text: '不是每個損失都能避開。但你比多數人早準備了。',                                                       ms: 2400 },
      { type: 'dialogue', speaker: '王博士', text: '「你很早就看到了，對嗎？」',                                                       ms: 2200 },
      { type: 'narrate',  text: '你沒有回答。你想到那份附錄，那份次貸數字，那個你說出來的「可能不是個案」。',                         ms: 3400 },
      { type: 'epilogue', text: '〔行為紀錄〕本次模擬中，玩家在危機爆發前兩個場景即出現風險識別行為，屬於「早期預警型」決策模式。對模糊信號的敏感度高於平均值。', ms: 4500 },
    ],
    outcome: 'prescient',
  },

  ending_reactive: {
    id: 'ending_reactive',
    title: '結局 · 遲來的調整',
    sceneKey: 'aftermath',
    beats: [
      { type: 'narrate',  text: 'Fed 聲明在下午 3 點發出。但市場已經在自由落體。',                                                    ms: 2800 },
      { type: 'narrate',  text: '你的團隊反應不算太慢。但很多視窗已經關閉了。',                                                       ms: 2400 },
      { type: 'narrate',  text: '那天晚上，你翻出了 2007 年 Q1 那份沒有送出去的次貸數字。',                                           ms: 2800 },
      { type: 'dialogue', speaker: '陳姐', text: '「信號一直都在。只是沒有人想看。」',                                                 ms: 2400 },
      { type: 'epilogue', text: '〔行為紀錄〕本次模擬中，玩家傾向在明確事件發生後才調整判斷，屬於「反應型」決策模式。在資訊模糊期偏好跟隨共識。', ms: 4500 },
    ],
    outcome: 'reactive',
  },
};
