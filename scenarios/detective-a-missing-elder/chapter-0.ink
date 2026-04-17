// ============================================================
// 劇本 A《老街失蹤疑雲》Chapter 0 — 開場篇
//
// 授權：原創劇本（Buzzer Team, 2026）
// Engine: inkle/ink (MIT) — https://github.com/inkle/ink
// 目標：4 個場景、3 條線索路徑、2 個結局
// Evidence Pack：每個 choice 帶 evidence_tags，由 engine 解析後送進 Builder
// 角色皆為虛構，如有雷同純屬巧合
// ============================================================

VAR chose_financial_angle = false
VAR chose_family_angle = false
VAR chose_neighbor_angle = false
VAR collected_pawn_receipt = false
VAR collected_bank_slip = false
VAR collected_grandson_message = false

-> intro

// ------------------------------------------------------------
// 場景 1：老街茶行前（開場）
// scene_id: ch0_s1_intro
// ------------------------------------------------------------

=== intro ===
# scene_id: ch0_s1_intro
# scene_title: 老街茶行前的失蹤報案
# background: /scenes/old-street-teahouse-dawn.svg

清晨的永和老街，霧氣還未散盡。茶行老闆娘陳秀蘭慌張地拉住你的袖子。

「偵探小姐，我阿公三天沒回家了。警察說他『可能只是出去散心』，可是我知道不對勁——他從不帶手機出門，可是這次連存摺都帶走了。」

她遞給你一本寫滿密密麻麻字跡的小冊子，封面寫著「阿公日記」。

你先看哪一頁？
+ [翻到最近的財務記錄那頁] # evidence_tags: evidence_seeking
    ~ chose_financial_angle = true
    -> financial_page
+ [翻到家人互動的記錄] # evidence_tags: evidence_seeking
    ~ chose_family_angle = true
    -> family_page
+ [直接問鄰居] # evidence_tags: evidence_seeking
    ~ chose_neighbor_angle = true
    -> neighbor_scene

=== financial_page ===
# clue_unlock: pawn_receipt
~ collected_pawn_receipt = true

日記最後一頁貼著一張**當鋪收據**，金額 NT$80,000，當的是一只金錶。
日期是失蹤前一天。

旁邊用紅筆寫著：「要把錢給小寶，他說再不處理，就來不及了。」

你的直覺是什麼？
+ [去當鋪查金錶下落] # evidence_tags: deductive_reasoning
    -> pawn_shop
+ [問陳秀蘭誰是『小寶』] # evidence_tags: evidence_seeking
    -> who_is_xiaobao

=== family_page ===
# clue_unlock: grandson_message
~ collected_grandson_message = true

翻到一週前的頁面，阿公貼了一張 LINE 截圖。
發訊人名字是「寶寶❤️」，內容：

> 阿公我現在很急，公司帳戶被凍結了，我下禮拜就要被告上法庭
> 先借我 80 萬好不好 我月底一定還你
> 千萬不要跟爸媽說 不然他們會看不起我

阿公在頁邊寫：「小寶是我從小看著長大的，怎麼可能騙我。但這個語氣……不像他。」

+ [追查小寶是否真的是阿公孫子] # evidence_tags: critical_thinking
    -> who_is_xiaobao
+ [去當鋪看阿公當了什麼] # evidence_tags: evidence_seeking
    -> pawn_shop

=== neighbor_scene ===
# scene_id: ch0_s2_neighbor
# scene_title: 隔壁早餐店的老闆

早餐店老闆阿明邊打蛋邊說：

「阿伯那三天有接到好幾通電話，每次都走到巷口小聲講。有一次我聽到他說『好好好，我馬上去銀行』，臉色很差。」

+ [去銀行調查] # evidence_tags: evidence_seeking
    -> bank_scene
+ [翻回日記的財務頁] # evidence_tags: evidence_seeking
    ~ chose_financial_angle = true
    -> financial_page

// ------------------------------------------------------------
// 場景 2：當鋪
// ------------------------------------------------------------

=== pawn_shop ===
# scene_id: ch0_s2_pawn
# scene_title: 永樂當鋪

當鋪的王老闆翻著帳本：

「是啊，老陳三天前來當金錶，我跟他說『老客人，這錶你存了 40 年，當起來只有 8 萬不划算』。他說『不行，我今天一定要 8 萬現金』。」

「我問他幹嘛，他說孫子公司出事。我說這要不要先跟家裡人講，他一直搖頭，說『不能讓秀蘭知道，她會罵』。」

+ [詢問王老闆有沒有看到阿公離開後去哪] # evidence_tags: deductive_reasoning
    -> pawn_shop_exit
+ [順路去銀行問問] # evidence_tags: evidence_seeking
    -> bank_scene

=== pawn_shop_exit ===
「他往郵局那邊走去。」王老闆指著北方。「手上拿著現金袋。」

你心裡有個底了。
-> bank_scene

=== who_is_xiaobao ===
# scene_id: ch0_s2_verify
# scene_title: 回頭找陳秀蘭求證

你回頭問陳秀蘭：「你有個弟弟或表弟，小名叫『小寶』嗎？」

陳秀蘭愣了好久，然後慢慢搖頭：「我阿公沒有叫小寶的孫子。我就是獨生女。小時候他確實有一個乾孫叫小寶，但那小孩 20 年前全家搬去加拿大，十幾年沒聯絡了。」

她倒抽一口氣。

+ [「那 LINE 上的『小寶』是誰？」——這是典型假親情詐騙] # evidence_tags: fraud_recognition, deductive_reasoning
    -> realize_scam
+ [先按住不說，去銀行確認] # evidence_tags: critical_thinking
    -> bank_scene

=== realize_scam ===
你的腦中閃過警察宣導單上的字：「假孫子詐騙（假親情詐騙）是近年成長最快的詐騙類型。」

但現在最重要的是——阿公**現在**在哪？他失蹤三天了。
-> bank_scene

// ------------------------------------------------------------
// 場景 3：銀行
// ------------------------------------------------------------

=== bank_scene ===
# scene_id: ch0_s3_bank
# scene_title: 土地銀行老街分行
# clue_unlock: bank_slip
~ collected_bank_slip = true

大堂經理林小姐調出監視器：

「您好偵探小姐，陳先生三天前上午 10:42 來辦理電匯，匯款 80 萬到一個陌生帳戶，戶名是『弘 X 信用代辦有限公司』。」

「我們行員當下有攔阻，請他打 165，他有打。165 說『這是高風險帳戶』，但他堅持『是孫子的事業要救急』，最後我們依法只能放行，**因為客戶堅持並簽了切結書**。」

她遞給你一張影本，帳號末 4 碼 `2046`。

+ [「165 有建議他去哪裡嗎？」] # evidence_tags: critical_thinking, evidence_seeking
    -> bank_follow_up
+ [直接去警察局報案] # evidence_tags: deductive_reasoning
    -> police_station

=== bank_follow_up ===
「165 建議他就近到所轄派出所做筆錄、凍結帳戶追溯。但他說『秀蘭會擔心』，沒去。」

林小姐壓低聲音：「其實這種長輩經常發生——錢匯出去後，他們會**羞愧得不敢回家**。」
-> police_station

// ------------------------------------------------------------
// 場景 4：派出所 + 結局
// ------------------------------------------------------------

=== police_station ===
# scene_id: ch0_s4_police
# scene_title: 老街派出所

所長老張嘆了口氣：「已經第三個案例了，同一個帳戶，這個月匯進去 400 多萬。你有沒有線索知道老伯現在人在哪？」

你手上的證據：
{collected_pawn_receipt: · 當鋪收據（證明提款意圖）|}
{collected_bank_slip: · 銀行電匯紀錄（證明錢流向）|}
{collected_grandson_message: · 假孫子 LINE 訊息（證明詐騙手法）|}

+ {collected_bank_slip and (collected_pawn_receipt or collected_grandson_message)} [提交完整證據鏈：「這是假親情詐騙，阿公一定在市區某家旅館不敢回家。請發布協尋+凍結帳戶。」] # evidence_tags: deductive_reasoning, critical_thinking
    # deduction: correct
    -> ending_good
+ [「我不確定，先請家屬發尋人啟事。」] # evidence_tags: evidence_seeking
    # deduction: incorrect
    -> ending_neutral

=== ending_good ===
# scene_id: ch0_ending_good
# ending_id: full_solve
# scene_title: 結局 · 老街重逢

警方透過旅館查詢系統，下午 3 點在市立旅社找到阿公。他沒吃飯、沒睡覺，手上還捏著已經發不出訊息的電話。

陳秀蘭衝上去抱住他，一句話都說不出來。阿公只是低著頭說：「我對不起妳……我以為那真的是小寶。」

〔警方備註〕本案資料已提交 165 詐騙通報系統，供後續案例比對。匯出帳戶已凍結，追回 NT$620,000。

— Chapter 0 完 —

本章線索收集：{collected_pawn_receipt}{collected_bank_slip}{collected_grandson_message}

-> END

=== ending_neutral ===
# scene_id: ch0_ending_neutral
# ending_id: partial_solve
# scene_title: 結局 · 遲來的線索

尋人啟事發出三天後，阿公在桃園某家便宜旅社被遊民通報。他瘦了 3 公斤，但人平安。

匯出的錢已經轉了第二手，**追不回**。

陳秀蘭抱著阿公哭。阿公只是呆呆地看著窗外：「我對不起妳。」

〔偵探筆記〕下次若能更早將『當鋪 → 銀行 → 假親情訊息』這三條線串起來，也許能攔住那 80 萬。

— Chapter 0 完（神秘結局） —

-> END
