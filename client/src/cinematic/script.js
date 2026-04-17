/**
 * 劇本 A《老街失蹤疑雲》— 動畫版腳本
 *
 * 走最佳路徑（good ending），完整收集兩條線索。
 * 每個 beat 的 ms 控制整段停留時間，typewriter 自動按比例計速。
 */

export const CINEMATIC_SCRIPT = [
  // ── 場景 1：老街茶行前 ────────────────────────────────────
  {
    id: 'ch0_s1_intro',
    title: '第一場 · 老街茶行前',
    sceneKey: 'dawn',
    beats: [
      { type: 'narrate',   text: '清晨的永和老街，霧氣還未散盡。',                                                                                          ms: 3500 },
      { type: 'narrate',   text: '茶行老闆娘陳秀蘭慌張地拉住你的袖子。',                                                                                      ms: 3200 },
      { type: 'dialogue',  speaker: '陳秀蘭', text: '「偵探小姐，我阿公三天沒回家了。警察說他可能只是出去散心，可是我知道不對勁——他從不帶手機出門，可是這次連存摺都帶走了。」', ms: 8500 },
      { type: 'narrate',   text: '她遞給你一本寫滿密密麻麻字跡的小冊子，封面寫著「阿公日記」。',                                                                ms: 4500 },
    ],
  },

  // ── 場景 2：阿公日記（財務頁）────────────────────────────
  {
    id: 'ch0_s2_diary',
    title: '第二場 · 阿公日記',
    sceneKey: 'diary',
    clueUnlock: {
      label: '線索解鎖：當鋪收據',
      icon: '📋',
      detail: 'NT$80,000 · 金錶 · 失蹤前一天',
    },
    beats: [
      { type: 'narrate',    text: '日記最後一頁，貼著一張泛黃的當鋪收據。金額 NT$80,000，當的是一只金錶。',  ms: 5500 },
      { type: 'narrate',    text: '日期是失蹤前一天。',                                                    ms: 2500 },
      { type: 'annotation', text: '要把錢給小寶，他說再不處理，就來不及了。',                               ms: 4500 },
    ],
  },

  // ── 場景 3：永樂當鋪 ─────────────────────────────────────
  {
    id: 'ch0_s3_pawn',
    title: '第三場 · 永樂當鋪',
    sceneKey: 'pawn',
    beats: [
      { type: 'narrate',  text: '昏黃的燈光下，王老闆翻著厚重的帳本。',                                                                               ms: 3500 },
      { type: 'dialogue', speaker: '王老闆', text: '「是啊，老陳三天前來當金錶。我說：老客人，這錶你存了 40 年，當起來只有 8 萬不划算啊。」',               ms: 7000 },
      { type: 'dialogue', speaker: '王老闆', text: '「他說：不行，我今天一定要 8 萬現金。問他幹嘛，說孫子公司出事，急著用錢。」',                          ms: 6500 },
      { type: 'dialogue', speaker: '王老闆', text: '「我說要不要先跟家裡人講，他一直搖頭——不能讓秀蘭知道，她會罵。」',                                    ms: 5500 },
      { type: 'dialogue', speaker: '王老闆', text: '「他後來往郵局那邊走去，手上拿著現金袋。」',                                                         ms: 4000 },
    ],
  },

  // ── 場景 4：土地銀行 ─────────────────────────────────────
  {
    id: 'ch0_s4_bank',
    title: '第四場 · 土地銀行老街分行',
    sceneKey: 'bank',
    clueUnlock: {
      label: '線索解鎖：銀行電匯紀錄',
      icon: '🏦',
      detail: '帳號末 4 碼 2046 · 戶名：弘 X 信用代辦',
    },
    beats: [
      { type: 'narrate',  text: '大堂經理林小姐調出監視器畫面——螢幕上，三天前上午 10:42。',                                          ms: 5000 },
      { type: 'dialogue', speaker: '林小姐', text: '「陳先生辦理電匯，匯款 80 萬到陌生帳戶，戶名是弘 X 信用代辦有限公司。」',                ms: 6500 },
      { type: 'dialogue', speaker: '林小姐', text: '「行員攔阻了，請他撥 165。165 說這是高風險帳戶——但他堅持：那是孫子的事業要救急。」',          ms: 7000 },
      { type: 'dialogue', speaker: '林小姐', text: '「客戶簽了切結書，我們依法只能放行。」',                                              ms: 4500 },
      { type: 'dialogue', speaker: '林小姐', text: '「165 建議他到派出所做筆錄、凍結帳戶。但他說秀蘭會擔心，沒去。」',                      ms: 5500 },
      { type: 'narrate',  text: '她壓低聲音。',                                                                                  ms: 2200 },
      { type: 'dialogue', speaker: '林小姐', text: '「這種長輩……錢匯出去後，會羞愧得不敢回家。」',                                        ms: 4800 },
    ],
  },

  // ── 場景 5：老街派出所 ────────────────────────────────────
  {
    id: 'ch0_s5_police',
    title: '第五場 · 老街派出所',
    sceneKey: 'police',
    beats: [
      { type: 'narrate',   text: '所長老張嘆了口氣。',                                                                                    ms: 2500 },
      { type: 'dialogue',  speaker: '所長老張', text: '「已經第三個案例了，同一帳戶，這個月匯進去 400 多萬。你有沒有線索知道老伯現在人在哪？」',    ms: 7000 },
      { type: 'narrate',   text: '你將手上的證據攤開在桌上——',                                                                           ms: 2800 },
      { type: 'deduction', text: '「這是假親情詐騙。阿公一定在市區某家旅館不敢回家。請發布協尋、凍結帳戶。」',                                ms: 6000 },
    ],
  },

  // ── 場景 6：結局 · 老街重逢 ───────────────────────────────
  {
    id: 'ch0_ending_good',
    title: '結局 · 老街重逢',
    sceneKey: 'reunion',
    beats: [
      { type: 'narrate',  text: '警方透過旅館查詢系統，下午 3 點在市立旅社找到阿公。',                                    ms: 5000 },
      { type: 'narrate',  text: '他沒吃飯、沒睡覺，手上還捏著已經發不出訊息的電話。',                                    ms: 5000 },
      { type: 'narrate',  text: '陳秀蘭衝上去抱住他，一句話都說不出來。',                                               ms: 4500 },
      { type: 'dialogue', speaker: '阿公', text: '「我對不起妳……我以為那真的是小寶。」',                                 ms: 5500 },
      { type: 'epilogue', text: '〔警方備註〕本案提交 Evidence Pack 到 165 詐騙資料庫，供後續案例比對。匯出帳戶已凍結，追回 NT$620,000。', ms: 7500 },
    ],
  },
];
