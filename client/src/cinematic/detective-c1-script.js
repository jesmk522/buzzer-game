/**
 * 偵探模組 Chapter 1《數字遊戲》
 *
 * 主題：LINE 投資群組詐騙（假股票 / 假平台 / 殺豬盤）
 * 委託人：劉先生，35 歲工程師，已投入 NT$800,000，無法出金
 *
 * Behavioral probes：
 *   - 面對「已投入大量資金」的受害者，你的優先目標是止損還是追回？
 *   - 能否識別「假投資平台」的具體話術特徵？
 *   - 當受害者不相信自己被騙時，如何應對？
 *
 * 行為標籤：
 *   loss_aversion_detection    — 識別受害者的沉沒成本心理
 *   fraud_pattern_recognition  — 辨識假投資平台特徵
 *   de_escalation              — 面對抗拒受害者的溝通策略
 *
 * 路線：
 *   A（聊天記錄路線）intro → chat_log → [platform_check | ask_intro]
 *                        → platform_check → bank → police_c1
 *   B（直接查帳路線）intro → bank → [platform_check | police_c1]
 */

export const DETECTIVE_C1_START = 'c1_intro';

export const DETECTIVE_C1_SCENES = {

  c1_intro: {
    id: 'c1_intro',
    title: '第一場 · 辦公室 · 報案',
    sceneKey: 'office',
    beats: [
      { type: 'narrate',  text: '劉先生，35 歲，軟體工程師，月薪 12 萬。他不像會被騙的人。',                                                   ms: 2600 },
      { type: 'narrate',  text: '但他坐在你對面，手機螢幕上是一個叫做「臺灣精英投資圈」的 LINE 群組。',                                       ms: 3000 },
      { type: 'dialogue', speaker: '劉先生', text: '「我加入了八個月。老師說我的帳戶裡有 160 萬，但我要出金，他說要先繳稅。繳完稅又說要繳手續費。」', ms: 4500 },
      { type: 'dialogue', speaker: '劉先生', text: '「我已經匯出去 80 萬了。那 160 萬是真的，我自己在平台上看得到。」',                       ms: 3800 },
      { type: 'narrate',  text: '他把手機遞給你。',                                                                                           ms: 1600 },
    ],
    choice: {
      prompt: '你先看什麼？',
      options: [
        { label: '翻看他跟「老師」的 LINE 對話記錄',     icon: '💬', next: 'c1_chat_log' },
        { label: '要他說明匯款的帳號和時間',              icon: '🏦', next: 'c1_bank_first' },
      ],
    },
  },

  // ── 路線 A：先看聊天記錄 ──────────────────────────────────

  c1_chat_log: {
    id: 'c1_chat_log',
    title: '第二場 · LINE 聊天記錄',
    sceneKey: 'data',
    clueUnlock: {
      label: '線索解鎖：話術模式',
      icon: '💬',
      detail: '「限時優惠」+ 「老師帶單」+ 「先繳費才能出金」',
    },
    beats: [
      { type: 'narrate',    text: '你滑過幾百則訊息。格式很熟悉。',                                                                           ms: 2000 },
      { type: 'annotation', text: '老師：「今天是窗口期，不買就沒了。」',                                                                     ms: 2200 },
      { type: 'annotation', text: '老師：「你的帳戶已入帳 NT$1,600,000，出金前需完成稅務認證。」',                                           ms: 2800 },
      { type: 'annotation', text: '老師：「很多人不信任，但他們錯過了。你不會是那種人吧？」',                                                 ms: 3000 },
      { type: 'narrate',    text: '你認出了三個詞：限時壓力、身份認同、預付費用才能拿回錢。',                                                 ms: 3200 },
    ],
    choice: {
      prompt: '你要劉先生做什麼？',
      options: [
        { label: '「先去查這個平台是否有合法登記」',      icon: '🔍', next: 'c1_platform_check' },
        { label: '「先停止匯款，不管老師說什麼」',        icon: '🛑', next: 'c1_stop_first' },
      ],
    },
  },

  c1_stop_first: {
    id: 'c1_stop_first',
    title: '第二場 · 緊急處置',
    sceneKey: 'data',
    beats: [
      { type: 'dialogue', speaker: '劉先生', text: '「但老師說如果我不繼續，帳戶會被凍結，我那 160 萬也拿不回來了。」',                       ms: 4000 },
      { type: 'narrate',  text: '你知道那 160 萬根本不存在。但現在不是說這句話的時候。',                                                     ms: 2800 },
      { type: 'narrate',  text: '你讓他先把「老師」的號碼記下來，不要再匯錢，然後一起去查帳。',                                               ms: 2800 },
    ],
    next: 'c1_bank_first',
  },

  c1_platform_check: {
    id: 'c1_platform_check',
    title: '第三場 · 查驗平台',
    sceneKey: 'data',
    clueUnlock: {
      label: '線索解鎖：假平台特徵',
      icon: '🖥️',
      detail: '網域 3 個月 · 無金管會登記 · UI 可偽造餘額',
    },
    beats: [
      { type: 'narrate',    text: '你在金管會「金融機構基本資料查詢」輸入平台名稱。',                                                         ms: 2600 },
      { type: 'annotation', text: '查詢結果：無符合資料。',                                                                                   ms: 1800 },
      { type: 'narrate',    text: '網域查詢：建立於 3 個月前。伺服器在境外。',                                                               ms: 2200 },
      { type: 'narrate',    text: '「帳戶餘額 160 萬」那個畫面，只是一個可以被後台任意修改的數字。',                                           ms: 3000 },
    ],
    next: 'c1_confront',
  },

  c1_confront: {
    id: 'c1_confront',
    title: '第三場 · 告知受害者',
    sceneKey: 'office',
    beats: [
      { type: 'narrate',  text: '你把查到的資料放在劉先生面前。',                                                                             ms: 1800 },
      { type: 'dialogue', speaker: '劉先生', text: '「不可能。老師說他們是合法的。而且我真的看到帳戶裡有 160 萬——』',                         ms: 3600 },
      { type: 'narrate',  text: '他的聲音在最後幾個字有點裂開。',                                                                             ms: 2000 },
    ],
    choice: {
      prompt: '你怎麼回應劉先生？',
      options: [
        { label: '直接說：「那 160 萬是假的，平台是詐騙」', icon: '🎯', next: 'c1_direct_truth' },
        { label: '「我們一起去銀行，把記錄拿出來對照」',    icon: '🤝', next: 'c1_bank_together' },
      ],
    },
  },

  c1_direct_truth: {
    id: 'c1_direct_truth',
    title: '第三場 · 告知（直接）',
    sceneKey: 'office',
    beats: [
      { type: 'narrate',  text: '你說了。',                                                                                                   ms: 1200 },
      { type: 'narrate',  text: '劉先生沉默了很久。然後把手機翻過去，不看那個「160 萬」的畫面。',                                             ms: 3200 },
      { type: 'dialogue', speaker: '劉先生', text: '「我是工程師。我怎麼會……』',                                                              ms: 2800 },
      { type: 'narrate',  text: '你不回答這個問題。現在最重要的是去派出所，拿到凍結帳戶的文件。',                                             ms: 3000 },
    ],
    next: 'c1_police',
  },

  c1_bank_together: {
    id: 'c1_bank_together',
    title: '第三場 · 銀行（陪同）',
    sceneKey: 'bank',
    beats: [
      { type: 'narrate',  text: '銀行的對帳單打印出來：八個月，共 25 筆，合計 NT$800,000。',                                                  ms: 3200 },
      { type: 'narrate',  text: '每一筆都是「投資入金」。每一筆都匯到境外人頭帳戶。',                                                         ms: 2800 },
      { type: 'narrate',  text: '劉先生盯著那張紙看了很久，沒有說話。',                                                                       ms: 2600 },
    ],
    next: 'c1_police',
  },

  // ── 路線 B：先查帳 ────────────────────────────────────────

  c1_bank_first: {
    id: 'c1_bank_first',
    title: '第二場 · 銀行對帳單',
    sceneKey: 'bank',
    clueUnlock: {
      label: '線索解鎖：匯款記錄',
      icon: '🏦',
      detail: '25 筆 · 8 個月 · 境外人頭帳戶',
    },
    beats: [
      { type: 'narrate',  text: '對帳單上，25 筆。第一筆 NT$5,000，最後一筆 NT$100,000。',                                                    ms: 3000 },
      { type: 'narrate',  text: '每次帳戶「獲利」，對方就說現在是追加的好時機。',                                                             ms: 2600 },
      { type: 'narrate',  text: '你注意到所有收款帳戶都不同，但都是同一家外資銀行的台灣分行。',                                               ms: 3000 },
    ],
    choice: {
      prompt: '你下一步怎麼做？',
      options: [
        { label: '去查這個投資平台有沒有金管會登記',      icon: '🔍', next: 'c1_platform_check' },
        { label: '直接帶劉先生去派出所報案',              icon: '🚔', next: 'c1_police' },
      ],
    },
  },

  // ── 派出所 ────────────────────────────────────────────────

  c1_police: {
    id: 'c1_police',
    title: '第四場 · 派出所',
    sceneKey: 'police',
    beats: [
      { type: 'narrate',  text: '刑事組的林警官看著你整理的資料。',                                                                           ms: 2200 },
      { type: 'dialogue', speaker: '林警官', text: '「殺豬盤，標準流程。假平台 + 人頭帳戶 + 出金手續費。今年已經第 47 案了。」',               ms: 3800 },
      { type: 'narrate',  text: '她停了一下。',                                                                                               ms: 1400 },
      { type: 'dialogue', speaker: '林警官', text: '「你的委託人有沒有把平台的截圖留下來？那是唯一可能追到背後架構的東西。」',                 ms: 4000 },
    ],
    choice: {
      prompt: '你跟劉先生說了什麼？',
      options: [
        { label: '「你所有跟老師的對話和截圖，一張都不能刪」', icon: '📱', next: 'c1_ending_good' },
        { label: '「先讓警官記錄你的損失，其他之後再說」',     icon: '📝', next: 'c1_ending_neutral' },
      ],
    },
  },

  // ── 結局 ──────────────────────────────────────────────────

  c1_ending_good: {
    id: 'c1_ending_good',
    title: '結局 · 數位足跡',
    sceneKey: 'reunion',
    beats: [
      { type: 'narrate',  text: '劉先生的截圖，保留了「老師」的帳號背後的 IP 記錄。',                                                         ms: 3000 },
      { type: 'narrate',  text: '這個帳號還在詐騙另外 12 個受害者，警方根據 IP 追到了同一個機房。',                                           ms: 3400 },
      { type: 'dialogue', speaker: '劉先生', text: '「我覺得自己很蠢。」',                                                                     ms: 2200 },
      { type: 'narrate',  text: '你說：「這不是智商的問題。他們研究的是人的心理，不是你的弱點。」',                                           ms: 3200 },
      { type: 'epilogue', text: '〔行為紀錄〕本案中，偵探優先識別話術模式，並協助受害者保全數位證據，展現「詐騙結構拆解能力」與「受害者溝通技巧」。', ms: 4500 },
    ],
    outcome: 'good',
  },

  c1_ending_neutral: {
    id: 'c1_ending_neutral',
    title: '結局 · 已知的結果',
    sceneKey: 'reunion',
    beats: [
      { type: 'narrate',  text: '案子立了案。NT$800,000 的損失，警方說追回機率很低。',                                                         ms: 3200 },
      { type: 'narrate',  text: '那個「老師」的 LINE 帳號，三天後換了號碼，繼續在另一個群組出現。',                                           ms: 3400 },
      { type: 'dialogue', speaker: '劉先生', text: '「如果當初……」',                                                                          ms: 2000 },
      { type: 'narrate',  text: '你沒有說「早點來就好了」。但你都知道。',                                                                     ms: 2800 },
      { type: 'epilogue', text: '〔行為紀錄〕本案中，偵探完成了基本程序，但未優先保全關鍵數位證據。詐騙者在 72 小時內轉移，追查中斷。', ms: 4500 },
    ],
    outcome: 'neutral',
  },
};
