/**
 * 偵探模組 Chapter 2《電話那頭》
 *
 * 主題：假冒檢察官 / 公務員詐騙（機房詐騙）
 * 委託人：林美珍的女兒，林美珍 62 歲退休教師
 * 事件：林美珍接到「台北地檢署」電話，被告知涉及洗錢案，
 *        要求轉帳「配合調查保管」，已匯出 NT$1,200,000
 *
 * Behavioral probes：
 *   - 面對「我沒有做錯事，為什麼要配合」的受害者，如何建立信任？
 *   - 機構權威感（檢察官 / 法院）帶來的從眾壓力，你如何幫受害者解除？
 *   - 當事已發生（錢已匯出），論斷的重點是追回還是防止二次損失？
 *
 * 行為標籤：
 *   authority_bias_detection   — 識別假冒機構的話術
 *   secondary_victim_protection — 防止受害者被二次詐騙
 *   institutional_trust_calibration — 機構權威 vs 實際驗證
 *
 * 路線：
 *   A（電話錄音路線）intro → call_record → [verify_id | second_loss]
 *   B（直接調查路線）intro → verify_id → bank → police_c2
 */

export const DETECTIVE_C2_START = 'c2_intro';

export const DETECTIVE_C2_SCENES = {

  c2_intro: {
    id: 'c2_intro',
    title: '第一場 · 茶館 · 女兒報案',
    sceneKey: 'dawn',
    beats: [
      { type: 'narrate',  text: '林小姐看起來沒睡，眼睛是腫的。',                                                                             ms: 2200 },
      { type: 'dialogue', speaker: '林小姐', text: '「我媽昨天下午打電話說她被涉及洗錢案調查，對方說是台北地檢的，叫她不能告訴任何人。」',     ms: 4200 },
      { type: 'dialogue', speaker: '林小姐', text: '「她一個人跑去銀行，匯了 120 萬。我是今天早上從帳單發現的，她還說我不要干涉司法。」',      ms: 4500 },
      { type: 'narrate',  text: '你問她：媽媽現在在哪？',                                                                                     ms: 1800 },
      { type: 'dialogue', speaker: '林小姐', text: '「在家。電話還是響個不停。」',                                                             ms: 2400 },
    ],
    choice: {
      prompt: '你的第一步是？',
      options: [
        { label: '先要到林媽媽接到的那通電話錄音或記錄', icon: '📞', next: 'c2_call_record' },
        { label: '直接去查詢「台北地檢署」的真實聯絡方式', icon: '🔍', next: 'c2_verify_id' },
      ],
    },
  },

  // ── 路線 A：看電話記錄 ────────────────────────────────────

  c2_call_record: {
    id: 'c2_call_record',
    title: '第二場 · 通話記錄',
    sceneKey: 'data',
    clueUnlock: {
      label: '線索解鎖：來電號碼偽造',
      icon: '📞',
      detail: '02-2311-9600（非地檢署真實號碼）· 通話 47 分鐘',
    },
    beats: [
      { type: 'narrate',    text: '手機記錄顯示：昨天下午 2:17，通話 47 分鐘。',                                                              ms: 2200 },
      { type: 'annotation', text: '來電號碼：02-2311-9600',                                                                                   ms: 1800 },
      { type: 'narrate',    text: '台北地檢署的公開電話是 02-2311-9561。差了兩碼，但看起來像。',                                               ms: 3000 },
      { type: 'narrate',    text: '你搜尋 02-2311-9600：這是一個可以偽造顯示號碼的境外 VoIP 服務，詐騙報案紀錄 312 件。',                     ms: 3400 },
    ],
    choice: {
      prompt: '你要怎麼跟林媽媽說？',
      options: [
        { label: '帶著這個查詢結果，去找林媽媽說明',      icon: '🤝', next: 'c2_talk_to_mom' },
        { label: '先讓林小姐去阻止她接下一通電話',        icon: '🛑', next: 'c2_prevent_call' },
      ],
    },
  },

  c2_prevent_call: {
    id: 'c2_prevent_call',
    title: '第二場 · 緊急阻止',
    sceneKey: 'dawn',
    beats: [
      { type: 'narrate',  text: '林小姐趕回去的時候，電話正在響。',                                                                           ms: 2200 },
      { type: 'dialogue', speaker: '林媽媽', text: '「不要接！這是司法程序，你干涉會讓我被移送！」',                                           ms: 3400 },
      { type: 'narrate',  text: '林小姐把手機搶了過來。',                                                                                     ms: 1800 },
      { type: 'narrate',  text: '對方說：「你媽媽不配合，要立即被拘押。」',                                                                   ms: 2800 },
      { type: 'narrate',  text: '林小姐掛掉電話，顫著手打給你。',                                                                             ms: 2200 },
    ],
    next: 'c2_talk_to_mom',
  },

  c2_talk_to_mom: {
    id: 'c2_talk_to_mom',
    title: '第三場 · 林家客廳',
    sceneKey: 'office',
    beats: [
      { type: 'narrate',  text: '林媽媽坐在沙發上，表情是一種很特殊的東西——不是擔心，是羞愧。',                                               ms: 3000 },
      { type: 'dialogue', speaker: '林媽媽', text: '「我是國文老師教了 30 年。我不是那種會被騙的人。」',                                       ms: 3200 },
      { type: 'narrate',  text: '你把號碼查詢結果放在她面前，輕聲說：',                                                                       ms: 2000 },
      { type: 'narrate',  text: '「這不是智識的問題。他們設計這個話術，就是用來對付聰明、認真負責的人。」',                                   ms: 3400 },
    ],
    choice: {
      prompt: '接下來你的重點是？',
      options: [
        { label: '「我們現在去派出所，把他們的號碼舉報」',  icon: '🚔', next: 'c2_police' },
        { label: '「先確認那通電話還沒有人繼續聯繫她」',    icon: '🔒', next: 'c2_secure_first' },
      ],
    },
  },

  c2_secure_first: {
    id: 'c2_secure_first',
    title: '第三場 · 防止二次損失',
    sceneKey: 'office',
    clueUnlock: {
      label: '線索解鎖：二次詐騙預警',
      icon: '⚠️',
      detail: '同一集團通常在 48 小時內以「退款」話術再次聯繫',
    },
    beats: [
      { type: 'narrate',  text: '你知道這類詐騙集團有一個標準後續操作：',                                                                     ms: 2200 },
      { type: 'annotation', text: '「假退款話術」— 以「法院判決，退還保管費」為名，要求受害者再次匯款或提供帳號',                             ms: 3400 },
      { type: 'narrate',  text: '你讓林小姐把媽媽的手機號碼列為「陌生來電自動拒接」，並更換網銀密碼。',                                       ms: 3200 },
      { type: 'dialogue', speaker: '林媽媽', text: '「如果他們真的是真的呢……」',                                                               ms: 2400 },
      { type: 'narrate',  text: '你說：真的地檢署，會有真的公文，也不會在電話裡叫你匯款。',                                                   ms: 3000 },
    ],
    next: 'c2_police',
  },

  // ── 路線 B：直接查驗身份 ──────────────────────────────────

  c2_verify_id: {
    id: 'c2_verify_id',
    title: '第二場 · 驗證機構身份',
    sceneKey: 'data',
    clueUnlock: {
      label: '線索解鎖：機構查驗方法',
      icon: '🏛️',
      detail: '真實地檢署電話：02-2311-9561 · 絕不電話要求匯款',
    },
    beats: [
      { type: 'narrate',    text: '台北地檢署官網上的電話：02-2311-9561。',                                                                   ms: 2000 },
      { type: 'narrate',    text: '林媽媽接到的是 9600，差了兩碼。',                                                                          ms: 1800 },
      { type: 'annotation', text: '法務部公告：檢察官不會透過電話要求人民轉帳配合調查',                                                       ms: 2600 },
      { type: 'narrate',    text: '你打給真實的台北地檢署確認：沒有「林美珍」的任何案件。',                                                   ms: 3000 },
    ],
    next: 'c2_talk_to_mom',
  },

  // ── 派出所 ────────────────────────────────────────────────

  c2_police: {
    id: 'c2_police',
    title: '第四場 · 派出所',
    sceneKey: 'police',
    beats: [
      { type: 'narrate',  text: '刑事組的王警官看著報案資料。',                                                                               ms: 2000 },
      { type: 'dialogue', speaker: '王警官', text: '「機房詐騙，這個月第 22 件。那個 VoIP 號碼我們追過——伺服器在東南亞。」',                   ms: 3800 },
      { type: 'dialogue', speaker: '王警官', text: '「120 萬追回的機率很低，但你阻止了她繼續接電話，有機會攔截下一筆。」',                     ms: 4000 },
      { type: 'narrate',  text: '林媽媽在旁邊做筆錄，聲音很平靜。',                                                                           ms: 2200 },
    ],
    choice: {
      prompt: '報案後，你對林媽媽說什麼？',
      options: [
        { label: '「妳的行為紀錄會幫助警方追查這個集團」',  icon: '🌱', next: 'c2_ending_good' },
        { label: '「案子已經在走了，後面讓警方處理」',       icon: '📋', next: 'c2_ending_neutral' },
      ],
    },
  },

  // ── 結局 ──────────────────────────────────────────────────

  c2_ending_good: {
    id: 'c2_ending_good',
    title: '結局 · 另一個林美珍',
    sceneKey: 'reunion',
    beats: [
      { type: 'narrate',  text: '三週後，警方用林媽媽的通話記錄，追到了同一個詐騙集團的另外兩個受害者。',                                     ms: 3400 },
      { type: 'narrate',  text: '其中一個，是一位正要在今晚匯款的 68 歲婦人。被攔下了。',                                                     ms: 3200 },
      { type: 'dialogue', speaker: '林媽媽', text: '「我沒想到我的案子能幫到別人。」',                                                         ms: 2800 },
      { type: 'narrate',  text: '你沒有說：這本來就是你來報案最大的意義。',                                                                   ms: 2800 },
      { type: 'epilogue', text: '〔行為紀錄〕本案中，偵探優先識別二次損失風險並建立受害者信任感，同時協助保全通話記錄作為跨案追查依據。', ms: 4500 },
    ],
    outcome: 'good',
  },

  c2_ending_neutral: {
    id: 'c2_ending_neutral',
    title: '結局 · 移交案件',
    sceneKey: 'reunion',
    beats: [
      { type: 'narrate',  text: '案子移交警方。NT$1,200,000，追回的可能性不高。',                                                              ms: 3000 },
      { type: 'narrate',  text: '林媽媽在回家的路上一直很安靜。女兒扶著她的手。',                                                             ms: 2800 },
      { type: 'narrate',  text: '你知道這種安靜不是平靜，是一種還沒準備好面對的事情。',                                                       ms: 3000 },
      { type: 'epilogue', text: '〔行為紀錄〕本案完成了基本報案程序。受害者心理狀態與二次損失風險未被充分評估，後續跟進有限。', ms: 4500 },
    ],
    outcome: 'neutral',
  },
};
