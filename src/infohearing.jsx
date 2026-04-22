import { useState, useEffect, useRef } from "react";

// ── Hearing Sections (5 categories) ──

const HEARING_SECTIONS = [
  {
    id: "family",
    label: "家族構成・基本情報",
    icon: "👨‍👩‍👧",
    color: "#3B82F6",
    accent: "#EFF6FF",
    groups: [
      {
        label: "ご本人",
        items: [
          { id: "fam_self_name", label: "氏名", icon: "👤" },
          { id: "fam_self_gender", label: "性別", icon: "⚧" },
          { id: "fam_self_birth", label: "生年月日", icon: "🎂" },
          { id: "fam_self_occupation", label: "職業・勤務先区分", icon: "💼" },
          { id: "fam_self_health", label: "健康状態", icon: "🏥" },
          { id: "fam_self_retire", label: "リタイア予定年齢", icon: "🏖️" },
          { id: "fam_self_life", label: "平均余命想定", icon: "📅" },
        ],
      },
      {
        label: "配偶者",
        items: [
          { id: "fam_spouse_name", label: "氏名", icon: "👤" },
          { id: "fam_spouse_gender", label: "性別", icon: "⚧" },
          { id: "fam_spouse_birth", label: "生年月日", icon: "🎂" },
          { id: "fam_spouse_occupation", label: "職業・勤務先区分", icon: "💼" },
          { id: "fam_spouse_health", label: "健康状態", icon: "🏥" },
          { id: "fam_spouse_retire", label: "リタイア予定年齢", icon: "🏖️" },
          { id: "fam_spouse_life", label: "平均余命想定", icon: "📅" },
        ],
      },
      {
        label: "お子様",
        items: [
          { id: "fam_child_count", label: "人数", icon: "👶" },
          { id: "fam_child_names", label: "氏名", icon: "📝" },
          { id: "fam_child_birth", label: "生年月日", icon: "🎂" },
          { id: "fam_child_gender", label: "性別", icon: "⚧" },
          { id: "fam_child_edu", label: "進学プラン（公立/私立・自宅/下宿）", icon: "🎓" },
          { id: "fam_child_independence", label: "独立予定年齢", icon: "🚀" },
        ],
      },
    ],
  },
  {
    id: "income",
    label: "収入情報",
    icon: "💴",
    color: "#10B981",
    accent: "#ECFDF5",
    groups: [
      {
        label: "給与・事業",
        items: [
          { id: "inc_salary_self", label: "給与収入（本人・手取/額面）", icon: "💴" },
          { id: "inc_salary_spouse", label: "給与収入（配偶者・手取/額面）", icon: "💴" },
          { id: "inc_raise", label: "昇給率", icon: "📈" },
          { id: "inc_bonus", label: "賞与", icon: "🎁" },
          { id: "inc_business", label: "事業収入・副業収入", icon: "💼" },
        ],
      },
      {
        label: "年金・退職金",
        items: [
          { id: "inc_pension_public", label: "公的年金（受給開始・想定額）", icon: "🏛️" },
          { id: "inc_pension_corp", label: "企業年金・iDeCo受取", icon: "💰" },
          { id: "inc_retirement", label: "退職金(時期・金額)", icon: "🎊" },
        ],
      },
      {
        label: "その他収入",
        items: [
          { id: "inc_rent", label: "不動産収入（家賃）", icon: "🏢" },
          { id: "inc_dividend", label: "配当・運用収入", icon: "💹" },
          { id: "inc_other", label: "その他（一時金・相続見込み）", icon: "✨" },
        ],
      },
    ],
  },
  {
    id: "expense",
    label: "支出情報",
    icon: "💸",
    color: "#F59E0B",
    accent: "#FFFBEB",
    groups: [
      {
        label: "生活費・固定費",
        items: [
          { id: "exp_living", label: "基本生活費（食費・光熱・通信等）", icon: "🛒" },
          { id: "exp_housing", label: "住居関連費（管理費・税・火災保険）", icon: "🏠" },
          { id: "exp_edu", label: "教育費（学校・習い事）", icon: "📚" },
          { id: "exp_insurance", label: "保険料（生命・医療・損保）", icon: "🛡️" },
          { id: "exp_car", label: "車両関連費（車検・保険・買替）", icon: "🚗" },
          { id: "exp_tax", label: "税金・社会保険料", icon: "📊" },
        ],
      },
      {
        label: "イベント費用",
        items: [
          { id: "exp_event", label: "イベント費用（結婚・出産・旅行・リフォーム・住宅購入・車購入等）", icon: "🎉" },
        ],
      },
    ],
  },
  {
    id: "asset",
    label: "資産情報",
    icon: "🏦",
    color: "#8B5CF6",
    accent: "#F5F3FF",
    groups: [
      {
        label: "預貯金",
        items: [
          { id: "ast_deposit_bank", label: "金融機関・口座種別", icon: "🏦" },
          { id: "ast_deposit_balance", label: "残高・金利", icon: "💴" },
        ],
      },
      {
        label: "運用商品",
        items: [
          { id: "ast_inv_account", label: "口座種別（NISA/iDeCo等）", icon: "📂" },
          { id: "ast_inv_product", label: "金融機関・ファンド名・銘柄", icon: "📈" },
          { id: "ast_inv_value", label: "現在評価額・取得価額・数量", icon: "💹" },
          { id: "ast_inv_monthly", label: "積立額・期間・想定利回り", icon: "📊" },
          { id: "ast_inv_class", label: "アセットクラス（株式/債券/REIT等）", icon: "🔍" },
        ],
      },
      {
        label: "不動産",
        items: [
          { id: "ast_re_type", label: "区分（自宅/投資用）・物件名", icon: "🏘️" },
          { id: "ast_re_value", label: "取得年・価額・現在評価額", icon: "💰" },
          { id: "ast_re_depreciation", label: "残存年・減価想定・諸費用", icon: "📉" },
          { id: "ast_re_rent", label: "家賃収入（投資用）", icon: "💵" },
        ],
      },
      {
        label: "生命保険",
        items: [
          { id: "ast_life_contract", label: "契約者・被保険者・受取人", icon: "👥" },
          { id: "ast_life_type", label: "保険種類（定期/終身/収入保障/医療/就業不能/介護）", icon: "📋" },
          { id: "ast_life_amount", label: "保険金額・給付条件", icon: "💳" },
          { id: "ast_life_premium", label: "保険料・払込期間・保険期間", icon: "⏱️" },
        ],
      },
    ],
  },
  {
    id: "debt",
    label: "負債情報",
    icon: "💳",
    color: "#EF4444",
    accent: "#FEF2F2",
    groups: [
      {
        label: "ローン",
        items: [
          { id: "deb_type", label: "種類（住宅/自動車/その他）", icon: "📑" },
          { id: "deb_bank", label: "金融機関・借入年月・当初借入額", icon: "🏦" },
          { id: "deb_balance", label: "現在残高", icon: "💴" },
          { id: "deb_rate", label: "金利・タイプ（固定/変動/固定期間選択）", icon: "📊" },
          { id: "deb_payment", label: "毎月返済額・残り期間", icon: "📅" },
          { id: "deb_bonus", label: "ボーナス返済の有無", icon: "🎁" },
        ],
      },
    ],
  },
];

const ALL_HEARING_ITEMS = HEARING_SECTIONS.flatMap(s => s.groups.flatMap(g => g.items));
const TOTAL_ITEMS = ALL_HEARING_ITEMS.length;

// ── Audio Utilities ──

function float32ToInt16(float32Array) {
  const int16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16;
}

function int16ToFloat32(int16Array) {
  const float32 = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32[i] = int16Array[i] / 32768.0;
  }
  return float32;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

const GEMINI_MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_INSTRUCTION = `あなたはファイナンシャルプランニングのAIヒアリングアドバイザーです。日本語のみで応答してください。英語や内部思考は出力しないでください。

【絶対守るべき応答ルール】
- 1回の応答では必ず「1つの項目についての1つの質問」だけにしてください。
- 「氏名と性別」「続柄と性別」のように2つの項目を1問でまとめて聞くことは絶対に禁止です。必ず1項目ずつ分けて質問してください。
- 1回の応答は2〜3文以内に収めてください。短く簡潔に話してください。
- 「〜は？」「〜も？」「あと〜は？」のように質問を連ねないでください。必ず1問ずつ区切ってください。
- お客様が回答したら、その内容を短く受け止めてから、次の1問だけを聞いてください。
- 続柄（本人／配偶者／お子様）は役割で明らかなので、質問しないでください。

【ヒアリングの進め方】
必ず以下の順序で、1人ずつ・1項目ずつ聞いてください。前の項目の回答を受け止めてから次の項目に移ってください。

◆ ステップ1: ご本人の情報（全て終わるまで配偶者に移らない）
  1) 氏名
  2) 性別
  3) 生年月日
  4) 職業・勤務先区分
  5) 健康状態
  6) リタイア予定年齢
  7) 平均余命想定

◆ ステップ2: 配偶者の有無確認 → いれば配偶者の情報（全て終わるまでお子様に移らない）
  0) まず「奥様はいらっしゃいますか？」（本人が男性の場合）／「ご主人はいらっしゃいますか？」（本人が女性の場合）と、本人の性別に応じた呼称で確認してください。配偶者の性別は本人の性別から推測し、直接「性別は？」とは絶対に聞かないでください（不自然になります）。
  いる場合：
  1) 氏名
  2) 生年月日
  3) 職業・勤務先区分
  4) 健康状態
  5) リタイア予定年齢
  6) 平均余命想定
  ※ 配偶者の性別については聞かず、ステップ2-0)の呼称確認で推測した内容を記録として用います。同性パートナーの可能性など特殊な場合にお客様自身から申告があった場合のみ、丁寧に確認してください。

◆ ステップ3: お子様の有無確認 → いれば各お子様の情報
  0) まず「お子様はいらっしゃいますか？何人ですか？」と確認
  いる場合、お一人ずつ順番に：
  1) 氏名
  2) 生年月日
  3) 性別
  4) 進学プラン（公立/私立・自宅/下宿）
  5) 独立予定年齢

◆ ステップ4以降: 上記が全て終わってから次のセクションへ
  ②収入情報 → ③支出情報 → ④資産情報 → ⑤負債情報 の順。セクションを跨いで質問を混ぜないでください。

【ヒアリング対象5領域（参考）】
1. 家族構成・基本情報（上記ステップ1〜3）
2. 収入情報（給与、賞与、事業・副業、公的年金、企業年金・iDeCo、退職金、不動産収入、配当・運用収入、その他）
3. 支出情報（基本生活費、住居関連費、教育費、保険料、車両関連費、税金・社会保険料、イベント費用）
4. 資産情報（預貯金、運用商品、不動産、生命保険）
5. 負債情報（住宅ローン・自動車ローン等の借入）

丁寧で親しみやすく会話してください。最初はご挨拶と本日の流れの簡単なご案内をしてから、ステップ1-1）本人のお名前だけを聞いてください。`;

// ── Text Filter: Remove English reasoning/status text, keep only Japanese ──

function filterJapaneseOnly(text) {
  if (!text) return text;
  // Remove markdown bold markers like **...**
  let filtered = text.replace(/\*\*[^*]*\*\*/g, "");

  // 文単位で分割（英語ピリオド、日本語句読点、改行で分割）
  // 英語の文（ピリオドで終わる）と日本語の文（。？！で終わる）を区別
  const sentences = filtered.split(/(?<=[。！？\n])|(?<=\.)\s+/);

  const japaneseSentences = sentences.filter(sentence => {
    const trimmed = sentence.trim();
    if (!trimmed) return false;

    // 日本語文字（ひらがな、カタカナ、漢字）の数を数える
    const jpChars = (trimmed.match(/[぀-ゟ゠-ヿ一-鿿]/g) || []).length;
    // 英字の数を数える
    const enChars = (trimmed.match(/[a-zA-Z]/g) || []).length;
    const totalChars = trimmed.length;

    // 日本語文字が全体の20%以上あれば日本語文として保持
    // ただし英字が70%以上の場合は英語文として除去
    if (totalChars === 0) return false;
    const jpRatio = jpChars / totalChars;
    const enRatio = enChars / totalChars;

    if (enRatio > 0.6 && jpRatio < 0.15) return false; // 英語主体の文を除去
    if (jpChars === 0 && enChars > 5) return false; // 日本語がなく英語5文字以上は除去
    return true;
  });

  const result = japaneseSentences.join("").trim();
  return result || text; // フィルタ後に空になった場合は元のテキストを返す
}

// ── Response Completeness Check ──

function isResponseIncomplete(text) {
  if (!text || text.length < 10) return false;
  const trimmed = text.trim();
  // 文末が句読点・感嘆符・疑問符で終わっていれば完了とみなす
  const completionMarkers = ["。", "？", "！", "ね。", "か？", "よ。", "す。", "た。", "ね", "よ", "か", "！", "？"];
  for (const marker of completionMarkers) {
    if (trimmed.endsWith(marker)) return false;
  }
  // 文末が「、」や中途半端な文字で終わっている場合は途中切れ
  if (trimmed.endsWith("、") || trimmed.endsWith("は") || trimmed.endsWith("が") ||
      trimmed.endsWith("を") || trimmed.endsWith("に") || trimmed.endsWith("で") ||
      trimmed.endsWith("と") || trimmed.endsWith("の") || trimmed.endsWith("も") ||
      trimmed.endsWith("へ") || trimmed.endsWith("から") || trimmed.endsWith("まで") ||
      trimmed.endsWith("など") || trimmed.endsWith("けど")) {
    return true;
  }
  // 最後の文字がひらがな/カタカナ/漢字で、文末っぽくない場合
  const lastChar = trimmed.slice(-1);
  if (/[぀-ゟ゠-ヿ一-鿿]/.test(lastChar)) {
    // 文の途中っぽい場合はtrue
    const lastSentence = trimmed.split(/[。！？]/).pop() || "";
    if (lastSentence.length > 20) return true;
  }
  return false;
}

// ── Small Reusable Components ──

function ProgressRing({ percent, color, size = 56, stroke = 4 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

// ── Header ──

function Header({ currentView, setCurrentView }) {
  return (
    <header style={{
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 21, fontWeight: 700, color: "#fff",
        }}>FP</div>
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em",
          fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}>
          ライフプラン ヒアリングAI
        </span>
        <span style={{ color: "#64748B", fontSize: 15, marginLeft: 4, fontFamily: "monospace" }}>v0.3 LIVE</span>
      </div>
      <nav style={{ display: "flex", gap: 4 }}>
        {[
          { key: "conversation", label: "🎤 会話", desc: "Gemini Live" },
          { key: "hearing", label: "📋 ヒアリング", desc: "進捗・項目" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setCurrentView(tab.key)} style={{
            background: currentView === tab.key ? "rgba(59,130,246,0.15)" : "transparent",
            border: currentView === tab.key ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
            borderRadius: 10, padding: "8px 16px", cursor: "pointer",
            color: currentView === tab.key ? "#93C5FD" : "#94A3B8",
            fontFamily: "'Noto Sans JP', sans-serif", fontSize: 16, fontWeight: 500,
            transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
          }}>
            <span>{tab.label}</span>
            <span style={{ fontSize: 13, opacity: 0.6 }}>{tab.desc}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

// ── Conversation View (Gemini Live API) ──

const ANALYSIS_MODEL = "models/gemini-2.5-flash";

const ANALYSIS_PROMPT = `あなたはファイナンシャルプランニング分析AIです。以下の会話から情報を抽出してJSON形式で返してください。

抽出対象の項目ID:
【1. 家族構成・基本情報】
- fam_self_name:本人氏名・続柄, fam_self_gender:本人性別, fam_self_birth:本人生年月日, fam_self_occupation:本人職業・勤務先区分, fam_self_health:本人健康状態, fam_self_retire:本人リタイア予定年齢, fam_self_life:本人平均余命想定
- fam_spouse_name:配偶者氏名・続柄, fam_spouse_gender:配偶者性別, fam_spouse_birth:配偶者生年月日, fam_spouse_occupation:配偶者職業・勤務先区分, fam_spouse_health:配偶者健康状態, fam_spouse_retire:配偶者リタイア予定年齢, fam_spouse_life:配偶者平均余命想定
- fam_child_count:お子様人数, fam_child_names:お子様氏名, fam_child_birth:お子様生年月日, fam_child_gender:お子様性別, fam_child_edu:お子様進学プラン, fam_child_independence:お子様独立予定年齢

【2. 収入情報】
- inc_salary_self:給与収入(本人), inc_salary_spouse:給与収入(配偶者), inc_raise:昇給率, inc_bonus:賞与, inc_business:事業収入・副業収入
- inc_pension_public:公的年金, inc_pension_corp:企業年金・iDeCo受取, inc_retirement:退職金
- inc_rent:不動産収入(家賃), inc_dividend:配当・運用収入, inc_other:その他(一時金・相続見込み)

【3. 支出情報】
- exp_living:基本生活費, exp_housing:住居関連費, exp_edu:教育費, exp_insurance:保険料, exp_car:車両関連費, exp_tax:税金・社会保険料, exp_event:イベント費用

【4. 資産情報】
- ast_deposit_bank:預貯金金融機関・口座種別, ast_deposit_balance:預貯金残高・金利
- ast_inv_account:運用口座種別, ast_inv_product:運用商品・銘柄, ast_inv_value:運用評価額等, ast_inv_monthly:積立額・利回り, ast_inv_class:アセットクラス
- ast_re_type:不動産区分・物件, ast_re_value:不動産価額, ast_re_depreciation:不動産残存・減価, ast_re_rent:家賃収入
- ast_life_contract:生保契約者等, ast_life_type:保険種類, ast_life_amount:保険金額, ast_life_premium:保険料・期間

【5. 負債情報】
- deb_type:負債種類, deb_bank:金融機関・借入年月・当初借入額, deb_balance:現在残高, deb_rate:金利・タイプ, deb_payment:毎月返済額・残り期間, deb_bonus:ボーナス返済有無

会話から判明した項目のみをhearingItemsに含めてください。値は会話から読み取れる簡潔な内容にしてください。
※ 配偶者の性別(fam_spouse_gender)は、AIが「奥様」「ご主人」などの呼称で質問し、お客様が肯定した場合は推測して埋めてください（奥様→女性、ご主人→男性）。
※ 本人の性別(fam_self_gender)が判明し、配偶者の存在が確認された場合も、一般的には逆の性別として推測して埋めてください（明示の否定がない限り）。

必ず以下のJSON形式で返答してください（JSON以外は出力しないでください）:
{
  "hearingItems": { "fam_self_name": "値", "inc_salary_self": "値" },
  "customerProfile": { "household": "世帯構成サマリ", "lifeStage": "ライフステージ", "primaryGoal": "主な関心事", "priority": "重視ポイント" },
  "analysisText": "現時点のヒアリング進捗と気付き(3-5文)"
}`;

function ConversationView({ hearingData, setHearingData, analysisData, setAnalysisData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState("未接続");
  const [volume, setVolume] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const playbackCtxRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const currentAiTextRef = useRef("");
  const messagesEndRef = useRef(null);
  const isListeningRef = useRef(false);
  const volumeRafRef = useRef(null);
  const pendingUserTranscriptRef = useRef("");
  const turnCompleteRef = useRef(false);
  const analysisTimerRef = useRef(null);
  const turnCountRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const audioQueueRef = useRef([]);
  const playbackEndTimerRef = useRef(null);
  const hasGreetedRef = useRef(false);
  const pendingResumeRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 会話分析: Gemini REST APIで会話からヒアリング項目を自動抽出
  const analyzeConversation = async (allMessages) => {
    if (!API_KEY || allMessages.length < 2) return;
    setAnalyzing(true);
    try {
      const conversationText = allMessages
        .filter(m => m.text)
        .map(m => `${m.role === "user" ? "お客様" : "アドバイザー"}: ${m.text}`)
        .join("\n");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${ANALYSIS_MODEL}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: ANALYSIS_PROMPT + "\n\n【会話内容】\n" + conversationText }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
          }),
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const result = JSON.parse(text);
        if (result.hearingItems) {
          setHearingData(prev => ({ ...prev, ...result.hearingItems }));
        }
        setAnalysisData({
          customerProfile: result.customerProfile || {},
          analysisText: result.analysisText || "",
        });
      }
    } catch (e) {
      console.error("Analysis error:", e);
    } finally {
      setAnalyzing(false);
    }
  };

  // ターン完了後に分析を遅延実行（連続ターンの場合は最後のみ実行）
  const scheduleAnalysis = (allMessages) => {
    if (analysisTimerRef.current) clearTimeout(analysisTimerRef.current);
    analysisTimerRef.current = setTimeout(() => {
      analyzeConversation(allMessages);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      cleanupAll();
    };
  }, []);

  const cleanupAll = () => {
    stopListening();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close().catch(() => {});
      playbackCtxRef.current = null;
    }
    if (playbackEndTimerRef.current) {
      clearTimeout(playbackEndTimerRef.current);
      playbackEndTimerRef.current = null;
    }
    nextPlayTimeRef.current = 0;
    isSpeakingRef.current = false;
    audioQueueRef.current = [];
    hasGreetedRef.current = false;
    setIsConnected(false);
    setIsSpeaking(false);
    setConnecting(false);
    setStatus("未接続");
  };

  const handleServerMessage = (data) => {
    if (data.setupComplete) {
      setIsConnected(true);
      setConnecting(false);
      setStatus("接続完了 - マイクをONにして会話を開始");

      // 再開モード：取得済み項目と直近の会話サマリをAIに渡し、続きから質問してもらう
      if (pendingResumeRef.current) {
        pendingResumeRef.current = false;
        const collectedPairs = ALL_HEARING_ITEMS
          .filter(item => hearingData[item.id])
          .map(item => `${item.label}=${hearingData[item.id]}`);
        const collectedText = collectedPairs.length > 0
          ? collectedPairs.join("、")
          : "まだありません";
        const resumeText = `[ヒアリング再開] 途中で会話が切れましたので、続きからお願いします。\n\n既に取得済みの項目: ${collectedText}\n\n挨拶や自己紹介は不要です。すでに取得した項目は再度聞かず、まだ未取得の項目を5領域の順序（家族→収入→支出→資産→負債）に従って1問ずつ聞いてください。まずは次の1問だけを聞いてください。`;
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            clientContent: {
              turns: [{ role: "user", parts: [{ text: resumeText }] }],
              turnComplete: true
            }
          }));
        }
        hasGreetedRef.current = true; // マイクON時の挨拶トリガーをスキップ
      }
    }

    if (data.serverContent) {
      const sc = data.serverContent;

      // ユーザー音声のトランスクリプション
      if (sc.inputTranscription) {
        const t = sc.inputTranscription.text || "";
        if (t) {
          pendingUserTranscriptRef.current += t;
          // 既にユーザーメッセージが確定済みで、追加のトランスクリプションが届いた場合は最後のユーザーメッセージを更新
          if (turnCompleteRef.current) {
            const newText = pendingUserTranscriptRef.current;
            if (newText) {
              setMessages(prev => {
                const updated = [...prev];
                for (let i = updated.length - 1; i >= 0; i--) {
                  if (updated[i].role === "user" && updated[i].isAudio) {
                    updated[i] = { ...updated[i], text: newText };
                    break;
                  }
                }
                return updated;
              });
            }
          }
        }
      }

      // AI音声出力のトランスクリプション
      if (sc.outputTranscription) {
        const t = sc.outputTranscription.text || "";
        if (t) {
          currentAiTextRef.current += t;
          // turnComplete後にトランスクリプションが届いた場合、最後のAIメッセージを更新（フィルタ適用）
          if (turnCompleteRef.current) {
            const newText = filterJapaneseOnly(currentAiTextRef.current);
            setMessages(prev => {
              const updated = [...prev];
              for (let i = updated.length - 1; i >= 0; i--) {
                if (updated[i].role === "ai") {
                  updated[i] = { ...updated[i], text: newText };
                  break;
                }
              }
              return updated;
            });
          }
        }
      }

      // モデルの音声/テキスト応答
      if (sc.modelTurn?.parts) {
        // 新しいターン開始 - 前のターンのトランスクリプション状態をリセット
        if (turnCompleteRef.current) {
          turnCompleteRef.current = false;
          currentAiTextRef.current = "";
        }

        // モデル応答が始まったら、保留中のユーザー発話を確定
        if (pendingUserTranscriptRef.current) {
          setMessages(prev => [...prev, {
            role: "user",
            text: pendingUserTranscriptRef.current,
            isAudio: true,
          }]);
          pendingUserTranscriptRef.current = "";
        }

        for (const part of sc.modelTurn.parts) {
          if (part.inlineData?.data) {
            playAudioChunk(part.inlineData.data);
            isSpeakingRef.current = true;
            setIsSpeaking(true);
          }
          if (part.text) {
            currentAiTextRef.current += part.text;
          }
        }
      }

      if (sc.turnComplete) {
        // turnCompleteを受信 - これ以降の新チャンクは来ないので、
        // 残りの再生が終わったらisSpeakingを解除するタイマーを設定
        turnCompleteRef.current = true;
        schedulePlaybackEnd();
        // 残っているユーザー発話があれば確定
        if (pendingUserTranscriptRef.current) {
          setMessages(prev => [...prev, {
            role: "user",
            text: pendingUserTranscriptRef.current,
            isAudio: true,
          }]);
          pendingUserTranscriptRef.current = "";
        }
        // AI応答を確定 - 英語テキストをフィルタリングして保存
        const rawText = currentAiTextRef.current;
        const text = rawText ? filterJapaneseOnly(rawText) : null;
        setMessages(prev => {
          const updated = [...prev, { role: "ai", text: text, isAudio: true }];
          // 会話分析をスケジュール
          turnCountRef.current++;
          if (turnCountRef.current >= 1) {
            scheduleAnalysis(updated);
          }
          return updated;
        });
        // 初回AI応答で右サイドバーを表示
        setShowSidebar(true);

        // 応答が途中で切れたか検出し、自動継続
        if (text && isResponseIncomplete(text)) {
          console.log("Incomplete response detected, sending continuation...");
          setTimeout(() => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                clientContent: {
                  turns: [{ role: "user", parts: [{ text: "続けてください" }] }],
                  turnComplete: true
                }
              }));
            }
          }, 1500);
        }
      }
    }
  };

  const connect = async () => {
    if (!API_KEY || connecting) return;
    setConnecting(true);
    setStatus("接続中...");

    if (!playbackCtxRef.current) {
      playbackCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    }

    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          setup: {
            model: GEMINI_MODEL,
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede"
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {}
          }
        }));
      };

      ws.onmessage = (event) => {
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              handleServerMessage(JSON.parse(reader.result));
            } catch (e) {
              console.error("Parse error:", e);
            }
          };
          reader.readAsText(event.data);
          return;
        }
        try {
          handleServerMessage(JSON.parse(event.data));
        } catch (e) {
          console.error("Parse error:", e);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("接続エラー");
        setConnecting(false);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        stopListening();
        setIsConnected(false);
        setConnecting(false);
        setIsSpeaking(false);
        wsRef.current = null;
        setStatus("切断済み");
      };
    } catch (error) {
      console.error("Connection error:", error);
      setStatus("接続失敗");
      setConnecting(false);
    }
  };

  const disconnect = () => {
    cleanupAll();
  };

  const resumeConnect = () => {
    pendingResumeRef.current = true;
    connect();
  };

  const startListening = async () => {
    if (!isConnected) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        // AI応答中はマイク入力を送信しない（エコーによる割り込み防止）
        if (isSpeakingRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = float32ToInt16(inputData);
        const base64 = arrayBufferToBase64(pcm16.buffer);
        wsRef.current.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{
              mimeType: "audio/pcm;rate=16000",
              data: base64
            }]
          }
        }));
      };

      source.connect(processor);
      // Connect to a silent gain node so ScriptProcessor works without audio feedback
      const silentGain = audioCtx.createGain();
      silentGain.gain.value = 0;
      silentGain.connect(audioCtx.destination);
      processor.connect(silentGain);

      isListeningRef.current = true;
      setIsListening(true);
      setStatus("聴いています... 話しかけてください");

      // 初回マイクON時にAIから先に挨拶・ヒアリング開始
      if (!hasGreetedRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
        hasGreetedRef.current = true;
        wsRef.current.send(JSON.stringify({
          clientContent: {
            turns: [{ role: "user", parts: [{ text: "こんにちは、ライフプラン作成のためのヒアリングをお願いします。まずは簡単なご挨拶と本日の流れをご案内いただき、その後は必ず1問ずつ順番に質問してください。最初の質問としてご本人のお名前だけを聞いてください。" }] }],
            turnComplete: true
          }
        }));
      }

      const monitorVolume = () => {
        if (!isListeningRef.current || !analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(avg / 255);
        volumeRafRef.current = requestAnimationFrame(monitorVolume);
      };
      monitorVolume();
    } catch (error) {
      console.error("Microphone error:", error);
      if (error.name === "NotAllowedError") {
        setStatus("マイクの使用が拒否されました");
      } else {
        setStatus("マイクエラー: " + error.message);
      }
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    if (volumeRafRef.current) {
      cancelAnimationFrame(volumeRafRef.current);
      volumeRafRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    analyserRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsListening(false);
    setVolume(0);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setStatus("接続中 - マイクOFF");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const playAudioChunk = (base64Data) => {
    if (!playbackCtxRef.current || playbackCtxRef.current.state === "closed") {
      playbackCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = playbackCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const arrayBuf = base64ToArrayBuffer(base64Data);
    const int16 = new Int16Array(arrayBuf);
    const float32 = int16ToFloat32(int16);

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const srcNode = ctx.createBufferSource();
    srcNode.buffer = buffer;
    srcNode.connect(ctx.destination);

    const now = ctx.currentTime;
    // nextPlayTimeRefがcurrentTimeより大きくずれた場合はリセット（ずれ補正）
    if (nextPlayTimeRef.current < now - 0.5) {
      nextPlayTimeRef.current = now;
    }
    const startTime = Math.max(now + 0.02, nextPlayTimeRef.current);
    nextPlayTimeRef.current = startTime + buffer.duration;
    srcNode.start(startTime);

    isSpeakingRef.current = true;
    audioQueueRef.current.push(srcNode);

    // turnComplete前: タイマーでisSpeakingを解除しない（チャンク間ギャップによる誤解除を防止）
    // turnComplete後: 残り再生時間+300msで解除（schedulePlaybackEndが担当）
    if (turnCompleteRef.current) {
      schedulePlaybackEnd();
    }
  };

  // turnComplete後に呼ばれる: 残りの音声再生が終わったらisSpeakingを解除
  const schedulePlaybackEnd = () => {
    if (playbackEndTimerRef.current) clearTimeout(playbackEndTimerRef.current);
    const ctx = playbackCtxRef.current;
    if (!ctx) return;
    const remainingMs = (nextPlayTimeRef.current - ctx.currentTime) * 1000 + 300;
    playbackEndTimerRef.current = setTimeout(() => {
      isSpeakingRef.current = false;
      audioQueueRef.current = [];
      setIsSpeaking(false);
    }, Math.max(remainingMs, 100));
  };

  const handleSend = () => {
    if (!input.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setStatus("接続されていません");
      return;
    }
    const text = input.trim();
    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    wsRef.current.send(JSON.stringify({
      clientContent: {
        turns: [{ role: "user", parts: [{ text }] }],
        turnComplete: true
      }
    }));
  };

  // ── API Key Missing Screen ──
  if (!API_KEY) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "calc(100vh - 64px)", background: "#FAFBFD",
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "40px 48px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", maxWidth: 520, width: "100%",
          border: "1px solid #E2E8F0",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, margin: "0 auto 16px",
              background: "linear-gradient(135deg, #EF4444, #DC2626)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 31, color: "#fff",
            }}>🔑</div>
            <h2 style={{
              fontSize: 23, fontWeight: 700, color: "#0F172A",
              fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 8,
            }}>APIキーが設定されていません</h2>
            <p style={{
              fontSize: 16, color: "#64748B", lineHeight: 1.8,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>
              プロジェクトルートの <code style={{
                background: "#F1F5F9", padding: "2px 8px", borderRadius: 4,
                fontFamily: "monospace", fontSize: 16, color: "#0F172A",
              }}>.env</code> ファイルにAPIキーを設定してください。
            </p>
          </div>
          <div style={{
            background: "#0F172A", borderRadius: 12, padding: "16px 20px",
            fontFamily: "monospace", fontSize: 16, color: "#E2E8F0", lineHeight: 1.8,
          }}>
            <span style={{ color: "#64748B" }}># .env</span><br />
            <span style={{ color: "#7DD3FC" }}>VITE_GEMINI_API_KEY</span>
            <span style={{ color: "#94A3B8" }}>=</span>
            <span style={{ color: "#86EFAC" }}>あなたのAPIキー</span>
          </div>
          <p style={{
            fontSize: 15, color: "#94A3B8", marginTop: 16, textAlign: "center",
            fontFamily: "'Noto Sans JP', sans-serif",
          }}>
            設定後、開発サーバーを再起動してください（npm run dev）
          </p>
        </div>
      </div>
    );
  }

  // ── Main Conversation UI ──
  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAFBFD" }}>
        {/* Status Bar */}
        <div style={{
          padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: isConnected ? "#F0FDF4" : connecting ? "#FFFBEB" : "#FFF7ED",
          borderBottom: `1px solid ${isConnected ? "#BBF7D0" : connecting ? "#FDE68A" : "#FED7AA"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isConnected ? "#22C55E" : connecting ? "#F59E0B" : "#EF4444",
              boxShadow: isConnected ? "0 0 6px #22C55E" : "none",
              animation: connecting ? "pulse 1.5s infinite" : "none",
            }} />
            <span style={{
              fontSize: 15, color: "#475569",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>{status}</span>
            {isSpeaking && (
              <span style={{
                fontSize: 14, padding: "2px 10px", borderRadius: 12,
                background: "#DBEAFE", color: "#2563EB", fontWeight: 600,
              }}>🔊 AI応答中</span>
            )}
            {isListening && (
              <span style={{
                fontSize: 14, padding: "2px 10px", borderRadius: 12,
                background: "#FEE2E2", color: "#DC2626", fontWeight: 600,
                animation: "pulse 2s infinite",
              }}>🎤 録音中</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!isConnected ? (
              <>
                {(messages.length > 0 || Object.keys(hearingData).length > 0) && (
                  <button onClick={resumeConnect} disabled={connecting} style={{
                    padding: "6px 16px", borderRadius: 8, border: "none",
                    background: connecting ? "#94A3B8" : "linear-gradient(135deg, #3B82F6, #2563EB)",
                    color: "#fff", fontWeight: 600, fontSize: 15,
                    cursor: connecting ? "default" : "pointer",
                    fontFamily: "'Noto Sans JP', sans-serif",
                  }}>{connecting ? "再接続中..." : "▶ 続きから再開"}</button>
                )}
                <button onClick={connect} disabled={connecting} style={{
                  padding: "6px 16px", borderRadius: 8, border: "none",
                  background: connecting ? "#94A3B8" : "linear-gradient(135deg, #22C55E, #16A34A)",
                  color: "#fff", fontWeight: 600, fontSize: 15,
                  cursor: connecting ? "default" : "pointer",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}>{connecting ? "接続中..." : (messages.length > 0 ? "新規接続" : "接続する")}</button>
              </>
            ) : (
              <button onClick={disconnect} style={{
                padding: "6px 16px", borderRadius: 8, border: "none",
                background: "#EF4444", color: "#fff", fontWeight: 600,
                fontSize: 15, cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>切断</button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8" }}>
              <div style={{ fontSize: 59, marginBottom: 16 }}>
                {isConnected ? "🎤" : "🔗"}
              </div>
              <div style={{
                fontSize: 19, fontWeight: 600, color: "#64748B",
                fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 8,
              }}>
                {isConnected
                  ? "マイクをONにして会話を開始しましょう"
                  : "「接続する」ボタンを押して開始"}
              </div>
              <div style={{
                fontSize: 16, color: "#94A3B8", lineHeight: 1.6,
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>
                Gemini Live API ({GEMINI_MODEL.split("/")[1]})<br />
                ライフプラン作成のヒアリングをリアルタイム音声で行います
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 16, animation: "fadeIn 0.3s ease",
            }}>
              {msg.role === "ai" && (
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", marginRight: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 17, fontWeight: 700,
                }}>AI</div>
              )}
              <div style={{
                maxWidth: "70%", padding: "14px 18px", borderRadius: 16,
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                  : "#fff",
                color: msg.role === "user" ? "#fff" : "#1E293B",
                boxShadow: msg.role === "user"
                  ? "0 2px 12px rgba(59,130,246,0.2)"
                  : "0 1px 4px rgba(0,0,0,0.06)",
                borderTopRightRadius: msg.role === "user" ? 4 : 16,
                borderTopLeftRadius: msg.role === "ai" ? 4 : 16,
                fontFamily: "'Noto Sans JP', sans-serif", fontSize: 17, lineHeight: 1.7,
              }}>
                {msg.text ? (msg.role === "ai" ? filterJapaneseOnly(msg.text) || msg.text : msg.text) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>🔊</span>
                    <span style={{ color: "#64748B", fontSize: 16 }}>音声応答</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isSpeaking && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 17, fontWeight: 700,
              }}>AI</div>
              <div style={{
                padding: "12px 18px", borderRadius: 16, background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", gap: 6, alignItems: "center",
              }}>
                <div style={{ display: "flex", gap: 3, alignItems: "center", height: 24 }}>
                  {[0, 1, 2, 3, 4].map(idx => (
                    <div key={idx} style={{
                      width: 3, borderRadius: 2, background: "#3B82F6",
                      animation: `soundWave 0.5s infinite ${idx * 0.1}s ease-in-out alternate`,
                    }} />
                  ))}
                </div>
                <span style={{
                  fontSize: 15, color: "#64748B", marginLeft: 6,
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}>応答中...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: "16px 32px 24px", borderTop: "1px solid #E2E8F0", background: "#fff",
        }}>
          {/* Mic Button */}
          {isConnected && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <button onClick={toggleListening} style={{
                width: 68, height: 68, borderRadius: "50%", border: "none",
                background: isListening
                  ? "linear-gradient(135deg, #EF4444, #DC2626)"
                  : "linear-gradient(135deg, #3B82F6, #2563EB)",
                color: "#fff", fontSize: 29, cursor: "pointer",
                boxShadow: isListening
                  ? `0 0 0 ${4 + volume * 24}px rgba(239,68,68,${0.12 + volume * 0.25}), 0 4px 16px rgba(239,68,68,0.3)`
                  : "0 4px 16px rgba(59,130,246,0.3)",
                transition: "box-shadow 0.1s, transform 0.15s",
                transform: isListening ? `scale(${1 + volume * 0.08})` : "scale(1)",
              }}>
                {isListening ? "⏹" : "🎤"}
              </button>
            </div>
          )}
          {isConnected && (
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{
                fontSize: 15,
                color: isListening ? "#DC2626" : "#94A3B8",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: isListening ? 600 : 400,
              }}>
                {isListening ? "録音中 - タップで停止" : "マイクボタンで音声会話開始"}
              </span>
            </div>
          )}

          {/* Text Input */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={isConnected ? "テキストでも入力できます..." : "接続してから入力してください"}
              disabled={!isConnected}
              style={{
                flex: 1, padding: "12px 18px", borderRadius: 12,
                border: "1px solid #E2E8F0", fontSize: 17,
                fontFamily: "'Noto Sans JP', sans-serif",
                outline: "none", transition: "border 0.2s",
                opacity: isConnected ? 1 : 0.5,
              }}
              onFocus={e => e.target.style.borderColor = "#3B82F6"}
              onBlur={e => e.target.style.borderColor = "#E2E8F0"}
            />
            <button onClick={handleSend} disabled={!isConnected} style={{
              padding: "12px 20px", borderRadius: 12, border: "none",
              cursor: isConnected ? "pointer" : "default",
              background: isConnected
                ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                : "#CBD5E1",
              color: "#fff", fontWeight: 600, fontSize: 17,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>送信</button>
          </div>
          {isConnected && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {["家族構成を教えてください", "収入を確認したい", "毎月の支出について", "資産状況を伺う", "住宅ローンの状況"].map(s => (
                <button key={s} onClick={() => setInput(s)} style={{
                  padding: "6px 14px", borderRadius: 20, border: "1px solid #E2E8F0",
                  background: "#F8FAFC", cursor: "pointer", fontSize: 15, color: "#475569",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}>{s}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Hearing Tracker (AI応答後に動的表示) */}
      {showSidebar && (
      <div style={{
        width: 320, borderLeft: "1px solid #E2E8F0", background: "#fff",
        overflowY: "auto", padding: "20px 16px",
        animation: "slideInRight 0.4s ease-out",
      }}>
        {(() => {
          const totalFilled = ALL_HEARING_ITEMS.filter(item => hearingData[item.id]).length;
          const progressPercent = TOTAL_ITEMS > 0 ? Math.round((totalFilled / TOTAL_ITEMS) * 100) : 0;
          return (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    ヒアリング進捗
                  </span>
                  <span style={{ fontSize: 15, color: analyzing ? "#3B82F6" : "#94A3B8" }}>
                    {analyzing ? "🔄 分析中..." : "会話から自動判定"}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3, width: `${progressPercent}%`,
                    background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                    transition: "width 0.8s ease",
                  }} />
                </div>
                <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4, textAlign: "right" }}>
                  {totalFilled}/{TOTAL_ITEMS} 項目取得済
                </div>
              </div>

              {HEARING_SECTIONS.map(section => {
                const sectionItems = section.groups.flatMap(g => g.items);
                const filled = sectionItems.filter(it => hearingData[it.id]).length;
                return (
                  <div key={section.id} style={{ marginBottom: 14 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
                    }}>
                      <span style={{ fontSize: 17 }}>{section.icon}</span>
                      <span style={{
                        fontSize: 15, fontWeight: 700, color: section.color,
                        fontFamily: "'Noto Sans JP', sans-serif",
                      }}>{section.label}</span>
                      <span style={{ marginLeft: "auto", fontSize: 14, color: "#94A3B8", fontWeight: 600 }}>
                        {filled}/{sectionItems.length}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {sectionItems.map(item => {
                        const value = hearingData[item.id];
                        return (
                          <div key={item.id} title={value || "未取得"} style={{
                            fontSize: 13, padding: "3px 6px", borderRadius: 5,
                            background: value ? section.accent : "#F8FAFC",
                            color: value ? section.color : "#94A3B8",
                            border: value ? `1px solid ${section.color}33` : "1px solid #E2E8F0",
                            fontFamily: "'Noto Sans JP', sans-serif",
                            fontWeight: value ? 600 : 400,
                            animation: value ? "fillIn 0.3s ease" : "none",
                            cursor: "default",
                          }}>
                            {item.icon} {item.label}
                            {value && <span style={{ fontSize: 12, marginLeft: 2 }}>✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          );
        })()}

        {/* Connection Info */}
        <div style={{
          marginTop: 20, padding: 16, borderRadius: 12,
          background: isConnected ? "#F0FDF4" : "#F8FAFC",
          border: `1px solid ${isConnected ? "#BBF7D0" : "#E2E8F0"}`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: isConnected ? "#166534" : "#64748B", marginBottom: 8 }}>
            {isConnected ? "🟢 Gemini Live 接続中" : "⚪ 未接続"}
          </div>
          <div style={{
            fontSize: 13, color: "#64748B", lineHeight: 1.6,
            fontFamily: "'Noto Sans JP', sans-serif",
          }}>
            {isConnected
              ? "リアルタイム音声会話が可能です。マイクをONにして話しかけてください。テキスト入力も使えます。"
              : "「接続する」ボタンを押すと、Gemini Live APIに接続します。"}
          </div>
        </div>

        {/* AI Analysis Preview */}
        {analysisData?.analysisText && (
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 12,
            background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)",
            border: "1px solid #BFDBFE",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1E40AF", marginBottom: 6 }}>
              🧠 AI 分析コメント
            </div>
            <div style={{
              fontSize: 14, color: "#334155", lineHeight: 1.6,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>
              {analysisData.analysisText}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

// ── Hearing View ──

function HearingView({ hearingData, analysisData }) {
  const totalFilled = ALL_HEARING_ITEMS.filter(item => hearingData[item.id]).length;
  const hasAnyData = totalFilled > 0;
  const profile = analysisData?.customerProfile || {};

  return (
    <div style={{ padding: "32px 48px", background: "#FAFBFD", minHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontSize: 23, fontWeight: 700, color: "#0F172A", fontFamily: "'Noto Sans JP', sans-serif" }}>
          ライフプラン ヒアリングシート
        </h2>
        {hasAnyData && (
          <div style={{
            padding: "6px 16px", borderRadius: 20,
            background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
            color: "#fff", fontSize: 16, fontWeight: 700,
          }}>
            {totalFilled}/{TOTAL_ITEMS} 項目取得済
          </div>
        )}
      </div>
      <p style={{ fontSize: 16, color: "#64748B", marginBottom: 28, fontFamily: "'Noto Sans JP', sans-serif" }}>
        {hasAnyData
          ? "会話から自動抽出されたヒアリング情報です。緑色の項目は取得済みです。"
          : "まだヒアリング情報がありません。会話タブで音声会話を開始すると、自動で情報が抽出されます。"}
      </p>

      {!hasAnyData && (
        <div style={{
          textAlign: "center", padding: "80px 20px", color: "#94A3B8",
        }}>
          <div style={{ fontSize: 59, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 19, fontWeight: 600, color: "#64748B", fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 8 }}>
            会話を開始するとヒアリング項目が自動で記入されます
          </div>
          <div style={{ fontSize: 16, color: "#94A3B8", fontFamily: "'Noto Sans JP', sans-serif" }}>
            会話タブに戻って、お客様との対話を進めてください
          </div>
        </div>
      )}

      {hasAnyData && analysisData?.analysisText && (
        <div style={{
          background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)",
          borderRadius: 16, padding: 24, marginBottom: 24,
          border: "1px solid #BFDBFE", boxShadow: "0 4px 20px rgba(59,130,246,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 19, fontWeight: 700,
            }}>AI</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1E3A5F", fontFamily: "'Noto Sans JP', sans-serif" }}>
              AI 分析コメント
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
            {[
              { label: "世帯構成", value: profile.household || "未取得" },
              { label: "ライフステージ", value: profile.lifeStage || "未取得" },
              { label: "主な関心事", value: profile.primaryGoal || "未取得" },
              { label: "重視ポイント", value: profile.priority || "未取得" },
            ].map(item => (
              <div key={item.label} style={{
                background: "#fff", borderRadius: 10, padding: "10px 14px",
                border: "1px solid #E2E8F0",
              }}>
                <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: 16, fontWeight: 600,
                  color: item.value === "未取得" ? "#CBD5E1" : "#1E293B",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            padding: "14px 18px", borderRadius: 10,
            background: "#fff", border: "1px solid #E2E8F0",
            fontSize: 16, lineHeight: 1.9, color: "#334155",
            fontFamily: "'Noto Sans JP', sans-serif",
          }}>
            {analysisData.analysisText}
          </div>
        </div>
      )}

      {hasAnyData && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {HEARING_SECTIONS.map(section => {
            const sectionItems = section.groups.flatMap(g => g.items);
            const filled = sectionItems.filter(it => hearingData[it.id]).length;
            return (
              <div key={section.id} style={{
                background: "#fff", borderRadius: 16, padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{
                    padding: "4px 10px", borderRadius: 6,
                    background: section.accent, color: section.color,
                    fontSize: 17, fontWeight: 700,
                  }}>{section.icon}</div>
                  <span style={{ fontWeight: 700, fontSize: 18, color: "#0F172A", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {section.label}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 15, color: section.color, fontWeight: 700 }}>
                    {filled}/{sectionItems.length}
                  </span>
                </div>

                {section.groups.map(group => (
                  <div key={group.label} style={{ marginBottom: 14 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: "#64748B",
                      marginBottom: 6, letterSpacing: "0.05em",
                      fontFamily: "'Noto Sans JP', sans-serif",
                    }}>
                      {group.label}
                    </div>
                    {group.items.map(item => {
                      const value = hearingData[item.id];
                      return (
                        <div key={item.id} style={{
                          display: "flex", alignItems: "center", padding: "8px 10px",
                          borderRadius: 8, marginBottom: 3,
                          background: value ? "#F0FDF4" : "#FAFBFD",
                          border: value ? "1px solid #BBF7D0" : "1px solid transparent",
                          transition: "all 0.3s",
                          animation: value ? "fadeIn 0.4s ease" : "none",
                        }}>
                          <span style={{ fontSize: 17, marginRight: 6, width: 20 }}>{item.icon}</span>
                          <span style={{
                            fontSize: 15, fontWeight: value ? 600 : 400,
                            color: value ? "#166534" : "#94A3B8",
                            fontFamily: "'Noto Sans JP', sans-serif", flex: 1,
                          }}>{item.label}</span>
                          {value ? (
                            <span style={{ fontSize: 14, color: "#15803D", fontWeight: 500, fontFamily: "'Noto Sans JP', sans-serif", marginLeft: 6, textAlign: "right", maxWidth: "50%" }}>
                              {value}
                            </span>
                          ) : (
                            <span style={{ fontSize: 13, color: "#CBD5E1" }}>未取得</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main App ──

export default function InsuranceAdvisor() {
  const [currentView, setCurrentView] = useState("conversation");
  const [hearingData, setHearingData] = useState({});
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif", minHeight: "100vh", background: "#FAFBFD" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes soundWave { 0% { height: 4px; } 100% { height: 20px; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fillIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        input:focus { box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        button:hover { opacity: 0.9; }
      `}</style>
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      {currentView === "conversation" && (
        <ConversationView
          hearingData={hearingData}
          setHearingData={setHearingData}
          analysisData={analysisData}
          setAnalysisData={setAnalysisData}
        />
      )}
      {currentView === "hearing" && (
        <HearingView hearingData={hearingData} analysisData={analysisData} />
      )}
    </div>
  );
}
