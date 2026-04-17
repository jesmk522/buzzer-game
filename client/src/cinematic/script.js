/**
 * 劇本 A《老街失蹤疑雲》— 互動動畫腳本
 *
 * 每場都設有選項，讓玩家全程參與。
 *
 * 路線：
 *   A（財務路線）intro → diary → [pawn | who_is_xiaobao→pawn]
 *                              → [pawn_exit→bank | bank]
 *                              → [bank_followup→police_full | police_full]
 *                              → ending_good / ending_neutral
 *
 *   B（鄰居路線）intro → neighbor → [bank_lite | diary（跨到路線 A）]
 *                               → [bank_lite_followup→police_lite | police_lite]
 *                               → ending_neutral
 */

export const SCENE_START = 'intro';

export const SCENES = {

  // ── 場景 1：老街茶行前（兩路線共用） ──────────────────────
  intro: {
    id: 'intro',
    title: '第一場 · 老街茶行前',
    sceneKey: 'dawn',
    beats: [
      { type: 'narrate',  text: '清晨的永和老街，霧氣還未散盡。',                                                                                                      ms: 1800 },
      { type: 'narrate',  text: '茶行老闆娘陳秀蘭慌張地拉住你的袖子。',                                                                                                ms: 1600 },
      { type: 'dialogue', speaker: '陳秀蘭', text: '「偵探小姐，我阿公三天沒回家了。警察說他可能只是出去散心，可是我知道不對勁——他從不帶手機出門，可是這次連存摺都帶走了。」', ms: 4500 },
      { type: 'narrate',  text: '她遞給你一本寫滿密密麻麻字跡的小冊子，封面寫著「阿公日記」。',                                                                        ms: 2400 },
    ],
    choice: {
      prompt: '你打算從哪裡開始調查？',
      options: [
        { label: '翻開日記的財務記錄那頁', icon: '📖', next: 'diary' },
        { label: '先問問隔壁早餐店老闆',   icon: '☕', next: 'neighbor' },
      ],
    },
  },

  // ── 路線 A：翻日記 ────────────────────────────────────────

  diary: {
    id: 'diary',
    title: '第二場 · 阿公日記',
    sceneKey: 'diary',
    clueUnlock: {
      label: '線索解鎖：當鋪收據',
      icon: '📋',
      detail: 'NT$80,000 · 金錶 · 失蹤前一天',
    },
    beats: [
      { type: 'narrate',    text: '日記最後一頁，貼著一張泛黃的當鋪收據。金額 NT$80,000，當的是一只金錶。', ms: 2800 },
      { type: 'narrate',    text: '日期是失蹤前一天。',                                                     ms: 1300 },
      { type: 'annotation', text: '要把錢給小寶，他說再不處理，就來不及了。',                                ms: 2200 },
    ],
    choice: {
      prompt: '根據日記，你下一步？',
      options: [
        { label: '去永樂當鋪，查金錶下落',     icon: '🏪', next: 'pawn' },
        { label: '先問陳秀蘭——誰是「小寶」？', icon: '🤔', next: 'who_is_xiaobao' },
      ],
    },
  },

  who_is_xiaobao: {
    id: 'who_is_xiaobao',
    title: '第二場 · 身份核實',
    sceneKey: 'diary',
    beats: [
      { type: 'narrate',  text: '你回頭問陳秀蘭：「你阿公有叫小寶的孫子嗎？」',                                                                 ms: 2000 },
      { type: 'dialogue', speaker: '陳秀蘭', text: '「我是獨生女……阿公從前有個乾孫叫小寶，但那家人 20 年前搬去加拿大了，完全沒聯絡。」',          ms: 3500 },
      { type: 'narrate',  text: '她倒抽一口冷氣。你的直覺閃過一個字：詐騙。',                                                                   ms: 2000 },
    ],
    next: 'pawn',
  },

  pawn: {
    id: 'pawn',
    title: '第三場 · 永樂當鋪',
    sceneKey: 'pawn',
    beats: [
      { type: 'narrate',  text: '昏黃的燈光下，王老闆翻著厚重的帳本。',                                                                               ms: 1800 },
      { type: 'dialogue', speaker: '王老闆', text: '「是啊，老陳三天前來當金錶。我說：老客人，這錶你存了 40 年，當起來只有 8 萬不划算啊。」',               ms: 3500 },
      { type: 'dialogue', speaker: '王老闆', text: '「他說：不行，我今天一定要 8 萬現金。問他幹嘛，說孫子公司出事，急著用錢。」',                          ms: 3200 },
      { type: 'dialogue', speaker: '王老闆', text: '「我說要不要先跟家裡人講，他一直搖頭——不能讓秀蘭知道，她會罵。」',                                   ms: 3000 },
    ],
    choice: {
      prompt: '你還想多問什麼？',
      options: [
        { label: '「他拿了錢之後往哪個方向走？」', icon: '👁', next: 'pawn_exit' },
        { label: '謝過王老闆，直接去銀行',          icon: '🏦', next: 'bank' },
      ],
    },
  },

  pawn_exit: {
    id: 'pawn_exit',
    title: '第三場 · 永樂當鋪（續）',
    sceneKey: 'pawn',
    beats: [
      { type: 'dialogue', speaker: '王老闆', text: '「他往郵局那邊走去，手上拿著現金袋。」',   ms: 2200 },
      { type: 'narrate',  text: '你心裡有個底了。郵局旁邊，就是土地銀行。',                   ms: 1800 },
    ],
    next: 'bank',
  },

  bank: {
    id: 'bank',
    title: '第四場 · 土地銀行老街分行',
    sceneKey: 'bank',
    clueUnlock: {
      label: '線索解鎖：銀行電匯紀錄',
      icon: '🏦',
      detail: '帳號末 4 碼 2046 · 戶名：弘 X 信用代辦',
    },
    beats: [
      { type: 'narrate',  text: '大堂經理林小姐調出監視器畫面——螢幕上，三天前上午 10:42。',                                          ms: 2500 },
      { type: 'dialogue', speaker: '林小姐', text: '「陳先生辦理電匯，匯款 80 萬到陌生帳戶，戶名是弘 X 信用代辦有限公司。」',                ms: 3200 },
      { type: 'dialogue', speaker: '林小姐', text: '「行員攔阻了，請他撥 165。165 說這是高風險帳戶——但他堅持：那是孫子的事業要救急。」',          ms: 3500 },
      { type: 'dialogue', speaker: '林小姐', text: '「客戶簽了切結書，我們依法只能放行。」',                                              ms: 2200 },
    ],
    choice: {
      prompt: '林小姐好像還有話說……',
      options: [
        { label: '「165 有建議他去做什麼？」', icon: '📞', next: 'bank_followup' },
        { label: '線索夠了，直接去派出所',      icon: '🚔', next: 'police_full' },
      ],
    },
  },

  bank_followup: {
    id: 'bank_followup',
    title: '第四場 · 土地銀行（續）',
    sceneKey: 'bank',
    beats: [
      { type: 'narrate',  text: '她壓低聲音。',                                                                                  ms: 1200 },
      { type: 'dialogue', speaker: '林小姐', text: '「165 建議他就近到派出所做筆錄、凍結帳戶。但他說秀蘭會擔心，沒去。」',            ms: 3000 },
      { type: 'dialogue', speaker: '林小姐', text: '「這種長輩……錢匯出去後，會羞愧得不敢回家。」',                                  ms: 2400 },
    ],
    next: 'police_full',
  },

  police_full: {
    id: 'police_full',
    title: '第五場 · 老街派出所',
    sceneKey: 'police',
    beats: [
      { type: 'narrate',  text: '所長老張嘆了口氣。',                                                                                              ms: 1400 },
      { type: 'dialogue', speaker: '所長老張', text: '「已經第三個案例了，同一帳戶，這個月匯進去 400 多萬。你有沒有線索知道老伯現在人在哪？」',           ms: 3500 },
      { type: 'narrate',  text: '你將當鋪收據和電匯紀錄攤開在桌上——',                                                                            ms: 1600 },
    ],
    choice: {
      prompt: '手上有兩份線索，你如何論斷？',
      options: [
        { label: '「這是假親情詐騙，阿公一定躲在市區旅館不敢回家——請發布協尋、凍結帳戶。」', icon: '🔍', next: 'ending_good' },
        { label: '「我還不確定，先讓家屬發尋人啟事再說。」',                                 icon: '❓', next: 'ending_neutral' },
      ],
    },
  },

  // ── 路線 B：問鄰居 ───────────────────────────────────────

  neighbor: {
    id: 'neighbor',
    title: '第二場 · 隔壁早餐店',
    sceneKey: 'shop',
    beats: [
      { type: 'narrate',  text: '早餐店老闆阿明邊打蛋邊說。',                                                                                          ms: 1400 },
      { type: 'dialogue', speaker: '阿明', text: '「阿伯那幾天有接到好幾通電話，每次都走到巷口小聲講。有一次我聽到他說——好好好，我馬上去銀行。」',           ms: 3500 },
      { type: 'dialogue', speaker: '阿明', text: '「臉色很差。我問他怎麼了，他說沒事沒事，轉身就走了。」',                                               ms: 2600 },
    ],
    choice: {
      prompt: '你打算怎麼繼續追查？',
      options: [
        { label: '去銀行，查匯款紀錄',   icon: '🏦', next: 'bank_lite' },
        { label: '回頭翻翻阿公的日記',    icon: '📖', next: 'diary' },
      ],
    },
  },

  bank_lite: {
    id: 'bank_lite',
    title: '第三場 · 土地銀行老街分行',
    sceneKey: 'bank',
    clueUnlock: {
      label: '線索解鎖：銀行電匯紀錄',
      icon: '🏦',
      detail: '帳號末 4 碼 2046 · 戶名：弘 X 信用代辦',
    },
    beats: [
      { type: 'narrate',  text: '大堂經理林小姐調出三天前的記錄。',                                                                             ms: 1600 },
      { type: 'dialogue', speaker: '林小姐', text: '「陳先生上午 10:42 辦理電匯，80 萬，匯到高風險帳戶。行員有攔阻，但他堅持要匯，簽了切結書。」',       ms: 3500 },
    ],
    choice: {
      prompt: '你想再多問一句嗎？',
      options: [
        { label: '「165 有建議他去哪裡嗎？」', icon: '📞', next: 'bank_lite_followup' },
        { label: '資訊夠了，去派出所報案',       icon: '🚔', next: 'police_lite' },
      ],
    },
  },

  bank_lite_followup: {
    id: 'bank_lite_followup',
    title: '第三場 · 土地銀行（續）',
    sceneKey: 'bank',
    beats: [
      { type: 'dialogue', speaker: '林小姐', text: '「他沒去派出所做筆錄。這種長輩——錢匯出去後，通常會羞愧得不敢回家。」', ms: 2800 },
    ],
    next: 'police_lite',
  },

  police_lite: {
    id: 'police_lite',
    title: '第四場 · 老街派出所',
    sceneKey: 'police',
    beats: [
      { type: 'narrate',  text: '所長老張嘆了口氣。',                                                                                              ms: 1400 },
      { type: 'dialogue', speaker: '所長老張', text: '「已經第三個案例了，同一帳戶，這個月匯進去 400 多萬。你有沒有線索知道老伯現在人在哪？」',           ms: 3500 },
      { type: 'narrate',  text: '你只有電匯紀錄，沒有追蹤阿公的行蹤——',                                                                          ms: 1600 },
    ],
    choice: {
      prompt: '手上只有電匯紀錄，你如何論斷？',
      options: [
        { label: '「帳戶是詐騙，阿公可能在附近旅館——先試著問問看。」', icon: '💭', next: 'ending_neutral' },
        { label: '「我還不確定，先讓家屬發尋人啟事再說。」',           icon: '❓', next: 'ending_neutral' },
      ],
    },
  },

  // ── 結局 ──────────────────────────────────────────────────

  ending_good: {
    id: 'ending_good',
    title: '結局 · 老街重逢',
    sceneKey: 'reunion',
    beats: [
      { type: 'narrate',  text: '警方透過旅館查詢系統，下午 3 點在市立旅社找到阿公。',                                    ms: 2500 },
      { type: 'narrate',  text: '他沒吃飯、沒睡覺，手上還捏著已經發不出訊息的電話。',                                    ms: 2500 },
      { type: 'narrate',  text: '陳秀蘭衝上去抱住他，一句話都說不出來。',                                               ms: 2200 },
      { type: 'dialogue', speaker: '阿公', text: '「我對不起妳……我以為那真的是小寶。」',                                 ms: 2800 },
      { type: 'epilogue', text: '〔警方備註〕本案資料已提交 165 詐騙通報系統，供後續案例比對。匯出帳戶已凍結，追回 NT$620,000。', ms: 3800 },
    ],
    outcome: 'good',
  },

  ending_neutral: {
    id: 'ending_neutral',
    title: '結局 · 遲來的線索',
    sceneKey: 'reunion',
    beats: [
      { type: 'narrate',  text: '尋人啟事發出三天後，阿公在桃園某家便宜旅社被遊民通報。他瘦了三公斤，但人平安。',     ms: 3200 },
      { type: 'narrate',  text: '匯出的錢已經轉了第二手，追不回。',                                               ms: 1800 },
      { type: 'narrate',  text: '陳秀蘭抱著阿公哭。阿公只是呆呆地看著窗外。',                                     ms: 2200 },
      { type: 'dialogue', speaker: '阿公', text: '「我對不起妳……」',                                            ms: 1800 },
      { type: 'epilogue', text: '〔偵探筆記〕若能更早將當鋪、銀行、假親情訊息這三條線串起來，或許能攔住那 80 萬。', ms: 3200 },
    ],
    outcome: 'neutral',
  },
};
