import { useState, useEffect, useRef } from "react";

const INSURERS = {
  sompo: {
    name: "損保ジャパン",
    short: "損保J",
    color: "#0055A4",
    accent: "#E8F0FE",
    logo: "🛡️",
    strengths: ["入院生活サポート日額1.5万", "退院時諸費用", "交通乗用具の幅広いカバー", "車両新価特約充実"],
  },
  tokio: {
    name: "東京海上日動",
    short: "東京海上",
    color: "#C41E3A",
    accent: "#FDE8EC",
    logo: "⚓",
    strengths: ["他車搭乗中の家族補償", "レンタカー費用補償", "示談代行あり", "受託物補償"],
  },
  mitsui: {
    name: "三井住友海上",
    short: "三井住友",
    color: "#00875A",
    accent: "#E6F5EE",
    logo: "🌿",
    strengths: ["入院時諸費用充実", "リハビリ120万・福祉機器500万", "海外賠償3億円", "同乗者全員サポート"],
  },
};

const RECOMMENDATIONS = {
  "推奨01": { insurer: "sompo", title: "入院生活サポート", desc: "入院時に日額15,000円の生活サポート費用保険金が180日以内で支給されるのは損保ジャパンだけです。個室利用や身の回りの品を揃える費用を重視されるなら、こちらが最適です。" },
  "推奨02": { insurer: "sompo", title: "退院時諸費用", desc: "5日以上の入院で退院時諸費用が支給されるのは損保ジャパンだけです。退院後の生活立て直しに手厚いサポートが必要な方に推奨します。" },
  "推奨03": { insurer: "sompo", title: "交通乗用具カバー", desc: "自動車だけでなく、ロープウェー・エレベーター・エスカレーター・動く歩道・船舶・航空機まで、業界最多の交通乗用具事故をカバーできます。幅広い移動手段を使われる方に最適です。" },
  "推奨04": { insurer: "sompo", title: "車両新価特約", desc: "再取得時諸費用保険金が新車価格の20％（40万円限度）と手厚く、代替自動車の取得期間も事故翌日から1年以内と最長です。新車購入間もない方に推奨します。" },
  "推奨05": { insurer: "tokio", title: "他車搭乗中補償", desc: "記名被保険者およびご家族が他車搭乗中でも人身傷害が補償されるのは東京海上の強みです。複数の車に乗る機会が多いご家庭に最適です。" },
  "推奨06": { insurer: "tokio", title: "レンタカー補償", desc: "事故時30日・故障時15日のレンタカー費用が補償されるのは東京海上だけです。車が使えなくなるリスクに最も強い設計です。" },
  "推奨07": { insurer: "tokio", title: "示談代行・受託物", desc: "個人賠償責任特約で示談代行サービスがあり、さらに他人から借りた物の損害まで補償できるのは東京海上の強みです。" },
  "推奨08": { insurer: "mitsui", title: "入院時諸費用充実", desc: "ホームヘルパー・ベビーシッター・ペットシッターそれぞれ1日2万円限度と、入院時の生活支援が3社で最も充実しています。ご家族やペットのケアを重視される方に最適です。" },
  "推奨09": { insurer: "mitsui", title: "重度障害支援", desc: "リハビリテーション訓練120万円、福祉機器等取得500万円、住宅改造500万円と業界屈指の補償額です。万が一の際の自立支援を最優先される方に推奨します。" },
  "推奨10": { insurer: "mitsui", title: "同乗者全員サポート", desc: "ロードサービスの宿泊費用（1人1.5万円）・帰宅費用（1人2万円）が同乗者全員分支払われます。ご家族や友人との長距離ドライブに最も安心な設計です。" },
  "推奨11": { insurer: "mitsui", title: "海外賠償3億円", desc: "国外での個人賠償責任が3億円と、他社（1億円）の3倍の設定です。海外旅行や将来の海外生活も見据えるなら、こちらを推奨します。" },
};

const HEARING_ITEMS_A = [
  { id: "a1", label: "主な運転者", icon: "👤", category: "A" },
  { id: "a2", label: "運転者の年齢", icon: "🎂", category: "A" },
  { id: "a3", label: "運転者の範囲", icon: "👨‍👩‍👧‍👦", category: "A" },
  { id: "a4", label: "等級・事故有係数", icon: "📊", category: "A" },
  { id: "a5", label: "事故歴（過去3年）", icon: "⚠️", category: "A" },
  { id: "a6", label: "年間走行距離", icon: "🛣️", category: "A" },
  { id: "a7", label: "使用目的", icon: "🎯", category: "A" },
  { id: "a8", label: "車両情報", icon: "🚗", category: "A" },
  { id: "a9", label: "車両保険の希望", icon: "🔧", category: "A" },
  { id: "a10", label: "車両価格・現在価値", icon: "💰", category: "A" },
  { id: "a11", label: "車両保険タイプ", icon: "📋", category: "A" },
  { id: "a12", label: "対人・対物賠償", icon: "🤝", category: "A" },
  { id: "a13", label: "人身傷害補償", icon: "🏥", category: "A" },
  { id: "a14", label: "弁護士費用特約", icon: "⚖️", category: "A" },
  { id: "a15", label: "ロードサービス重視度", icon: "🚨", category: "A" },
];

const HEARING_ITEMS_B = [
  { id: "b1", label: "自宅の駐車環境", icon: "🏠", category: "B" },
  { id: "b2", label: "お住まいの地域", icon: "📍", category: "B" },
  { id: "b3", label: "セカンドカー割引", icon: "🚙", category: "B" },
  { id: "b4", label: "他保険の加入状況", icon: "📑", category: "B" },
  { id: "b5", label: "契約形態", icon: "📝", category: "B" },
  { id: "b6", label: "支払方法の希望", icon: "💳", category: "B" },
  { id: "b7", label: "現在の保険会社", icon: "🏢", category: "B" },
  { id: "b8", label: "現在の保険料", icon: "¥", category: "B" },
  { id: "b9", label: "今の保険の不満点", icon: "😤", category: "B" },
  { id: "b10", label: "将来の車買替予定", icon: "🔄", category: "B" },
  { id: "b11", label: "家事・介護支援", icon: "🧹", category: "B" },
  { id: "b12", label: "入院・通院一時金", icon: "💊", category: "B" },
  { id: "b13", label: "入院時の生活品質", icon: "🛏️", category: "B" },
  { id: "b14", label: "レッカー搬送距離", icon: "🚛", category: "B" },
  { id: "b15", label: "リハビリ・住宅改造等", icon: "♿", category: "B" },
];

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

const SYSTEM_INSTRUCTION = `あなたは保険比較推奨アドバイザーのAIアシスタントです。日本語のみで応答してください。英語や内部思考は出力しないでください。

【応答ルール】
- 1回の応答は2〜3文以内に収めてください。短く簡潔に話してください。
- 長い説明が必要な場合は、複数のターンに分けて話してください。
- 一度に全てを説明せず、1つのポイントだけ伝えてから相手の反応を待ってください。

比較対象3社: 損保ジャパン、東京海上日動、三井住友海上

自然な会話でお客様から以下を聞き出してください：
運転者情報、年齢、運転者範囲、等級・事故歴、走行距離、使用目的、車両情報、車両保険希望、ロードサービス重視度、家族構成、現在の不満点

一度に多くの質問をせず、1つずつ聞いてください。丁寧で親しみやすく会話してください。最初の挨拶から始めてください。`;

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
    const jpChars = (trimmed.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g) || []).length;
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
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(lastChar)) {
    // 文の途中っぽい場合はtrue
    const lastSentence = trimmed.split(/[。！？]/).pop() || "";
    if (lastSentence.length > 20) return true;
  }
  return false;
}

// ── Small Reusable Components ──

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{display}</span>;
}

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
          fontSize: 18, fontWeight: 700, color: "#fff",
        }}>比</div>
        <span style={{ color: "#F8FAFC", fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em",
          fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}>
          保険比較推奨アドバイザー
        </span>
        <span style={{ color: "#64748B", fontSize: 12, marginLeft: 4, fontFamily: "monospace" }}>v0.2 LIVE</span>
      </div>
      <nav style={{ display: "flex", gap: 4 }}>
        {[
          { key: "conversation", label: "🎤 会話", desc: "Gemini Live" },
          { key: "hearing", label: "📋 ヒアリング", desc: "進捗管理" },
          { key: "comparison", label: "📊 3社比較", desc: "比較表" },
          { key: "recommendation", label: "🏆 推奨理由", desc: "トーク" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setCurrentView(tab.key)} style={{
            background: currentView === tab.key ? "rgba(59,130,246,0.15)" : "transparent",
            border: currentView === tab.key ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
            borderRadius: 10, padding: "8px 16px", cursor: "pointer",
            color: currentView === tab.key ? "#93C5FD" : "#94A3B8",
            fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13, fontWeight: 500,
            transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
          }}>
            <span>{tab.label}</span>
            <span style={{ fontSize: 10, opacity: 0.6 }}>{tab.desc}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

// ── Conversation View (Gemini Live API) ──

const ANALYSIS_MODEL = "models/gemini-2.5-flash";

const ANALYSIS_PROMPT = `あなたは保険ヒアリングの分析AIです。以下の会話から情報を抽出してJSON形式で返してください。

抽出対象の項目IDと項目名:
【A】標準項目: a1:主な運転者, a2:運転者の年齢, a3:運転者の範囲, a4:等級・事故有係数, a5:事故歴（過去3年）, a6:年間走行距離, a7:使用目的, a8:車両情報, a9:車両保険の希望, a10:車両価格・現在価値, a11:車両保険タイプ, a12:対人・対物賠償, a13:人身傷害補償, a14:弁護士費用特約, a15:ロードサービス重視度
【B】差別化項目: b1:自宅の駐車環境, b2:お住まいの地域, b3:セカンドカー割引, b4:他保険の加入状況, b5:契約形態, b6:支払方法の希望, b7:現在の保険会社, b8:現在の保険料, b9:今の保険の不満点, b10:将来の車買替予定, b11:家事・介護支援, b12:入院・通院一時金, b13:入院時の生活品質, b14:レッカー搬送距離, b15:リハビリ・住宅改造等

会話から判明した項目のみをhearingItemsに含めてください。値は会話から読み取れる簡潔な内容にしてください。
また、現時点での3社（損保ジャパン/東京海上日動/三井住友海上）の推奨スコア(0-100)と分析コメントを返してください。

必ず以下のJSON形式で返答してください（JSON以外は出力しないでください）:
{
  "hearingItems": { "a1": "値", "a7": "値" },
  "scores": { "sompo": 30, "tokio": 35, "mitsui": 35 },
  "customerProfile": { "driver": "運転者情報", "vehicle": "車両情報", "purpose": "使用目的", "priority": "重視ポイント" },
  "analysisText": "現時点の分析コメント（3-5文）",
  "topInsurer": "sompo or tokio or mitsui",
  "topReason": "最も推奨する理由（2-3文）"
}`;

function ConversationView({ hearingData, setHearingData, recommendationData, setRecommendationData }) {
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
        setRecommendationData({
          scores: result.scores || { sompo: 0, tokio: 0, mitsui: 0 },
          customerProfile: result.customerProfile || {},
          analysisText: result.analysisText || "",
          topInsurer: result.topInsurer || "",
          topReason: result.topReason || "",
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
              fontSize: 28, color: "#fff",
            }}>🔑</div>
            <h2 style={{
              fontSize: 20, fontWeight: 700, color: "#0F172A",
              fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 8,
            }}>APIキーが設定されていません</h2>
            <p style={{
              fontSize: 13, color: "#64748B", lineHeight: 1.8,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>
              プロジェクトルートの <code style={{
                background: "#F1F5F9", padding: "2px 8px", borderRadius: 4,
                fontFamily: "monospace", fontSize: 13, color: "#0F172A",
              }}>.env</code> ファイルにAPIキーを設定してください。
            </p>
          </div>
          <div style={{
            background: "#0F172A", borderRadius: 12, padding: "16px 20px",
            fontFamily: "monospace", fontSize: 13, color: "#E2E8F0", lineHeight: 1.8,
          }}>
            <span style={{ color: "#64748B" }}># .env</span><br />
            <span style={{ color: "#7DD3FC" }}>VITE_GEMINI_API_KEY</span>
            <span style={{ color: "#94A3B8" }}>=</span>
            <span style={{ color: "#86EFAC" }}>あなたのAPIキー</span>
          </div>
          <p style={{
            fontSize: 12, color: "#94A3B8", marginTop: 16, textAlign: "center",
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
              fontSize: 12, color: "#475569",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>{status}</span>
            {isSpeaking && (
              <span style={{
                fontSize: 11, padding: "2px 10px", borderRadius: 12,
                background: "#DBEAFE", color: "#2563EB", fontWeight: 600,
              }}>🔊 AI応答中</span>
            )}
            {isListening && (
              <span style={{
                fontSize: 11, padding: "2px 10px", borderRadius: 12,
                background: "#FEE2E2", color: "#DC2626", fontWeight: 600,
                animation: "pulse 2s infinite",
              }}>🎤 録音中</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!isConnected ? (
              <button onClick={connect} disabled={connecting} style={{
                padding: "6px 16px", borderRadius: 8, border: "none",
                background: connecting ? "#94A3B8" : "linear-gradient(135deg, #22C55E, #16A34A)",
                color: "#fff", fontWeight: 600, fontSize: 12,
                cursor: connecting ? "default" : "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>{connecting ? "接続中..." : "接続する"}</button>
            ) : (
              <button onClick={disconnect} style={{
                padding: "6px 16px", borderRadius: 8, border: "none",
                background: "#EF4444", color: "#fff", fontWeight: 600,
                fontSize: 12, cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>切断</button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>
                {isConnected ? "🎤" : "🔗"}
              </div>
              <div style={{
                fontSize: 16, fontWeight: 600, color: "#64748B",
                fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 8,
              }}>
                {isConnected
                  ? "マイクをONにして会話を開始しましょう"
                  : "「接続する」ボタンを押して開始"}
              </div>
              <div style={{
                fontSize: 13, color: "#94A3B8", lineHeight: 1.6,
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>
                Gemini Live API ({GEMINI_MODEL.split("/")[1]})<br />
                リアルタイム音声会話で保険のヒアリングを行います
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
                  color: "#fff", fontSize: 14, fontWeight: 700,
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
                fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14, lineHeight: 1.7,
              }}>
                {msg.text ? (msg.role === "ai" ? filterJapaneseOnly(msg.text) || msg.text : msg.text) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>🔊</span>
                    <span style={{ color: "#64748B", fontSize: 13 }}>音声応答</span>
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
                color: "#fff", fontSize: 14, fontWeight: 700,
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
                  fontSize: 12, color: "#64748B", marginLeft: 6,
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
                color: "#fff", fontSize: 26, cursor: "pointer",
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
                fontSize: 12,
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
                border: "1px solid #E2E8F0", fontSize: 14,
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
              color: "#fff", fontWeight: 600, fontSize: 14,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>送信</button>
          </div>
          {isConnected && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {["車両保険について聞く", "家族構成を確認", "現在の不満点を深掘り"].map(s => (
                <button key={s} onClick={() => setInput(s)} style={{
                  padding: "6px 14px", borderRadius: 20, border: "1px solid #E2E8F0",
                  background: "#F8FAFC", cursor: "pointer", fontSize: 12, color: "#475569",
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
        width: 300, borderLeft: "1px solid #E2E8F0", background: "#fff",
        overflowY: "auto", padding: "20px 16px",
        animation: "slideInRight 0.4s ease-out",
      }}>
        {(() => {
          const countA = HEARING_ITEMS_A.filter(item => hearingData[item.id]).length;
          const countB = HEARING_ITEMS_B.filter(item => hearingData[item.id]).length;
          const totalFilled = countA + countB;
          const progressPercent = Math.round((totalFilled / 30) * 100);
          return (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    意向把握 進捗
                  </span>
                  <span style={{ fontSize: 12, color: analyzing ? "#3B82F6" : "#94A3B8" }}>
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
                <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 4, textAlign: "right" }}>
                  {totalFilled}/30 項目取得済
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 8, letterSpacing: "0.05em" }}>
                  【A】標準項目 ({countA}/15)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {HEARING_ITEMS_A.map(item => {
                    const value = hearingData[item.id];
                    return (
                      <div key={item.id} title={value || "未取得"} style={{
                        fontSize: 11, padding: "4px 8px", borderRadius: 6,
                        background: value ? "#F0FDF4" : "#F8FAFC",
                        color: value ? "#166534" : "#94A3B8",
                        border: value ? "1px solid #BBF7D0" : "1px solid #E2E8F0",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontWeight: value ? 600 : 400,
                        animation: value ? "fillIn 0.3s ease" : "none",
                        cursor: "default",
                      }}>
                        {item.icon} {item.label}
                        {value && <span style={{ fontSize: 9, marginLeft: 2 }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 8, letterSpacing: "0.05em" }}>
                  【B】差別化項目 ({countB}/15)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {HEARING_ITEMS_B.map(item => {
                    const value = hearingData[item.id];
                    return (
                      <div key={item.id} title={value || "未取得"} style={{
                        fontSize: 11, padding: "4px 8px", borderRadius: 6,
                        background: value ? "#F0FDF4" : "#F8FAFC",
                        color: value ? "#166534" : "#94A3B8",
                        border: value ? "1px solid #BBF7D0" : "1px solid #E2E8F0",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontWeight: value ? 600 : 400,
                        animation: value ? "fillIn 0.3s ease" : "none",
                        cursor: "default",
                      }}>
                        {item.icon} {item.label}
                        {value && <span style={{ fontSize: 9, marginLeft: 2 }}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })()}

        {/* Connection Info */}
        <div style={{
          marginTop: 20, padding: 16, borderRadius: 12,
          background: isConnected ? "#F0FDF4" : "#F8FAFC",
          border: `1px solid ${isConnected ? "#BBF7D0" : "#E2E8F0"}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: isConnected ? "#166534" : "#64748B", marginBottom: 8 }}>
            {isConnected ? "🟢 Gemini Live 接続中" : "⚪ 未接続"}
          </div>
          <div style={{
            fontSize: 10, color: "#64748B", lineHeight: 1.6,
            fontFamily: "'Noto Sans JP', sans-serif",
          }}>
            {isConnected
              ? "リアルタイム音声会話が可能です。マイクをONにして話しかけてください。テキスト入力も使えます。"
              : "「接続する」ボタンを押すと、Gemini Live APIに接続します。"}
          </div>
        </div>

        {/* Recommendation Preview */}
        {(() => {
          const scores = recommendationData?.scores || { sompo: 0, tokio: 0, mitsui: 0 };
          const hasScores = scores.sompo > 0 || scores.tokio > 0 || scores.mitsui > 0;
          return (
            <div style={{
              marginTop: 16, padding: 16, borderRadius: 12,
              background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
              border: "1px solid #BBF7D0",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", marginBottom: 8 }}>
                🎯 推奨傾向{hasScores ? "" : "（会話後に更新）"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {Object.entries(INSURERS).map(([key, ins]) => (
                  <div key={key} style={{ flex: 1, textAlign: "center" }}>
                    <ProgressRing percent={scores[key] || 0} color={ins.color} size={48} stroke={4} />
                    <div style={{ fontSize: 10, fontWeight: 600, color: ins.color, marginTop: 4 }}>
                      {ins.short}
                    </div>
                    {hasScores && (
                      <div style={{ fontSize: 9, color: "#64748B", marginTop: 2 }}>{scores[key]}%</div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{
                fontSize: 10, color: "#64748B", marginTop: 8, lineHeight: 1.5,
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>
                {hasScores && recommendationData?.topInsurer
                  ? `${INSURERS[recommendationData.topInsurer]?.name || ""}が現時点で最有力`
                  : "会話を進めると推奨傾向が表示されます"}
              </div>
            </div>
          );
        })()}
      </div>
      )}
    </div>
  );
}

// ── Hearing Progress View ──

function HearingView({ hearingData }) {
  const countA = HEARING_ITEMS_A.filter(item => hearingData[item.id]).length;
  const countB = HEARING_ITEMS_B.filter(item => hearingData[item.id]).length;
  const totalFilled = countA + countB;
  const hasAnyData = totalFilled > 0;

  return (
    <div style={{ padding: "32px 48px", background: "#FAFBFD", minHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", fontFamily: "'Noto Sans JP', sans-serif" }}>
          ヒアリングシート
        </h2>
        {hasAnyData && (
          <div style={{
            padding: "6px 16px", borderRadius: 20,
            background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
            color: "#fff", fontSize: 13, fontWeight: 700,
          }}>
            {totalFilled}/30 項目取得済
          </div>
        )}
      </div>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 28, fontFamily: "'Noto Sans JP', sans-serif" }}>
        {hasAnyData
          ? "会話から自動抽出された意向情報です。緑色の項目は取得済みです。"
          : "まだヒアリング情報がありません。会話タブで音声会話を開始すると、自動で情報が抽出されます。"}
      </p>

      {!hasAnyData && (
        <div style={{
          textAlign: "center", padding: "80px 20px", color: "#94A3B8",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#64748B", fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 8 }}>
            会話を開始するとヒアリング項目が自動で記入されます
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8", fontFamily: "'Noto Sans JP', sans-serif" }}>
            会話タブに戻って、お客様との対話を進めてください
          </div>
        </div>
      )}

      {hasAnyData && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Section A */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{
                padding: "4px 10px", borderRadius: 6,
                background: "#EFF6FF", color: "#2563EB",
                fontSize: 12, fontWeight: 700,
              }}>A</div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", fontFamily: "'Noto Sans JP', sans-serif" }}>
                標準的な意向確認項目
              </span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "#3B82F6", fontWeight: 700 }}>
                {countA}/15
              </span>
            </div>
            {HEARING_ITEMS_A.map(item => {
              const value = hearingData[item.id];
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", padding: "10px 12px",
                  borderRadius: 8, marginBottom: 4,
                  background: value ? "#F0FDF4" : "#FAFBFD",
                  border: value ? "1px solid #BBF7D0" : "1px solid transparent",
                  transition: "all 0.3s",
                  animation: value ? "fadeIn 0.4s ease" : "none",
                }}>
                  <span style={{ fontSize: 16, marginRight: 8, width: 24 }}>{item.icon}</span>
                  <span style={{
                    fontSize: 13, fontWeight: value ? 600 : 400,
                    color: value ? "#166534" : "#94A3B8",
                    fontFamily: "'Noto Sans JP', sans-serif", flex: 1,
                  }}>{item.label}</span>
                  {value ? (
                    <span style={{ fontSize: 12, color: "#15803D", fontWeight: 500, fontFamily: "'Noto Sans JP', sans-serif" }}>
                      {value}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#CBD5E1" }}>未取得</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Section B */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{
                padding: "4px 10px", borderRadius: 6,
                background: "#FFF7ED", color: "#EA580C",
                fontSize: 12, fontWeight: 700,
              }}>B</div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", fontFamily: "'Noto Sans JP', sans-serif" }}>
                差別化のための深掘り項目
              </span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "#EA580C", fontWeight: 700 }}>
                {countB}/15
              </span>
            </div>
            {HEARING_ITEMS_B.map(item => {
              const value = hearingData[item.id];
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", padding: "10px 12px",
                  borderRadius: 8, marginBottom: 4,
                  background: value ? "#F0FDF4" : "#FAFBFD",
                  border: value ? "1px solid #BBF7D0" : "1px solid transparent",
                  transition: "all 0.3s",
                  animation: value ? "fadeIn 0.4s ease" : "none",
                }}>
                  <span style={{ fontSize: 16, marginRight: 8, width: 24 }}>{item.icon}</span>
                  <span style={{
                    fontSize: 13, fontWeight: value ? 600 : 400,
                    color: value ? "#166534" : "#94A3B8",
                    fontFamily: "'Noto Sans JP', sans-serif", flex: 1,
                  }}>{item.label}</span>
                  {value ? (
                    <span style={{ fontSize: 12, color: "#15803D", fontWeight: 500, fontFamily: "'Noto Sans JP', sans-serif" }}>
                      {value}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#CBD5E1" }}>未取得</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Comparison View ──

function ComparisonView() {
  const categories = [
    {
      name: "人身傷害 基本補償",
      items: [
        { label: "入通院定額給付金", sompo: "5日以上で10万円", tokio: "5日以上で10万円または20万円", mitsui: "1日以上5日未満：1万円、5日以上：10万円（倍額払で2倍可）", highlight: "mitsui" },
        { label: "入院生活サポート費用保険金", sompo: "180日以内、日額15,000円限度 ✨", tokio: "記載なし", mitsui: "記載なし", highlight: "sompo" },
        { label: "死亡・後遺障害定額給付金特約", sompo: "あり（死亡：保険金額全額、後遺障害：4～100％）", tokio: "記載なし", mitsui: "搭乗者傷害（死亡・後遺障害）特約あり", highlight: "sompo" },
        { label: "被保険者範囲（他車搭乗中）", sompo: "記載なし", tokio: "記名被保険者および家族は他車搭乗中も補償 ✨", mitsui: "自動車事故特約セットで他車搭乗中も補償", highlight: "tokio" },
      ],
    },
    {
      name: "人身傷害 交通乗用具事故特約",
      items: [
        { label: "特約名称", sompo: "人身傷害交通乗用具事故特約", tokio: "人身傷害乗用具事故補償特約", mitsui: "自転車・車いす・ベビーカー・シニアカー事故傷害定額払特約", highlight: "" },
        { label: "特約の概要", sompo: "他の自動車・交通乗用具搭乗中や歩行中の事故に拡大 ✨", tokio: "契約車以外の乗用具搭乗中や歩行中の接触事故も補償", mitsui: "自転車等搭乗中事故で傷害定額払保険金を支払", highlight: "sompo" },
        { label: "対象乗用具の範囲", sompo: "自動車、自転車、車椅子、ベビーカー、電車、ロープウェー、航空機、船舶、エレベーター等 ✨", tokio: "契約車以外の車、自転車、トロリーバス、そり、車いす、ベビーカー等", mitsui: "自転車・車いす・ベビーカー・シニアカー", highlight: "sompo" },
      ],
    },
    {
      name: "人身傷害 入院時諸費用特約",
      items: [
        { label: "特約名称", sompo: "人身傷害入院時諸費用特約", tokio: "入院時選べるアシスト特約", mitsui: "入院・後遺障害時における人身傷害諸費用特約", highlight: "" },
        { label: "ヘルパー費用（家事・介護）", sompo: "家事・介護のヘルパー費用", tokio: "ホームヘルパー派遣", mitsui: "ホーム/介護ヘルパー雇入費用：各1日2万円限度 ✨", highlight: "mitsui" },
        { label: "保育施設預け入れ等費用", sompo: "保育施設預け入れ等費用", tokio: "記載なし", mitsui: "ベビーシッター・保育施設：合計1日2万円限度 ✨", highlight: "mitsui" },
        { label: "ペット預け入れ等費用", sompo: "ペット預け入れ等費用", tokio: "記載なし", mitsui: "ペットシッター・専用施設：合計1日2万円限度 ✨", highlight: "mitsui" },
        { label: "退院時諸費用", sompo: "5日以上入院の場合支給 ✨", tokio: "記載なし", mitsui: "記載なし", highlight: "sompo" },
      ],
    },
    {
      name: "その他の諸費用",
      items: [
        { label: "転院移送費用", sompo: "記載なし", tokio: "記載なし", mitsui: "転院1回分かつ100万円限度 ✨", highlight: "mitsui" },
        { label: "差額ベッド費用", sompo: "記載なし", tokio: "差額ベッド代提供", mitsui: "1日2万円限度 ✨", highlight: "mitsui" },
        { label: "リハビリテーション訓練等保険金", sompo: "記載なし", tokio: "記載なし", mitsui: "1名につき120万円 ✨", highlight: "mitsui" },
        { label: "福祉機器等取得費用保険金", sompo: "記載なし", tokio: "記載なし", mitsui: "1名につき500万円限度、住宅改造500万円限度 ✨", highlight: "mitsui" },
      ],
    },
    {
      name: "車両新価特約",
      items: [
        { label: "支払要件", sompo: "全損または修理費が新車価格の50％以上", tokio: "修理不能、車両保険金額以上、または協定新価の50％以上", mitsui: "新車保険金額の50％以上の損害等", highlight: "" },
        { label: "再取得時諸費用保険金", sompo: "新車価格の20％（40万円限度）or 20万円の高い方 ✨", tokio: "協定新価×20％（上限40万円、下限20万円）", mitsui: "記載なし", highlight: "sompo" },
        { label: "代替自動車の再取得・修理期間", sompo: "事故翌日から1年以内 ✨", tokio: "記載なし", mitsui: "記載なし", highlight: "sompo" },
      ],
    },
    {
      name: "ロードアシスタンス特約",
      items: [
        { label: "セット要件", sompo: "すべてのご契約（自動セット）", tokio: "自動セット（車両保険なしでも可）", mitsui: "原則すべてのご契約に自動セット", highlight: "" },
        { label: "故障も支払対象か", sompo: "あり", tokio: "あり", mitsui: "あり", highlight: "" },
        { label: "運搬費用", sompo: "事前連絡あり：無制限、なし：15万円限度", tokio: "15万円限度（事前承認時は無制限）", mitsui: "距離無制限 ✨", highlight: "mitsui" },
        { label: "臨時宿泊費用", sompo: "2万円限度／1被保険者", tokio: "記載なし", mitsui: "同乗者全員分・1人1.5万円限度 ✨", highlight: "mitsui" },
        { label: "臨時帰宅（移動）費用", sompo: "2万円限度／1被保険者", tokio: "代替交通費用5万円限度（タクシー3万円限度）", mitsui: "同乗者全員分・1人2万円限度 ✨", highlight: "mitsui" },
        { label: "引取費用", sompo: "15万円限度", tokio: "記載なし", mitsui: "15万円限度", highlight: "" },
        { label: "レンタカー費用", sompo: "記載なし", tokio: "補償日額限度（事故30日、故障15日） ✨", mitsui: "記載なし", highlight: "tokio" },
      ],
    },
    {
      name: "個人賠償責任特約",
      items: [
        { label: "示談代行", sompo: "記載なし", tokio: "あり ✨", mitsui: "日本国内事故のみ", highlight: "tokio" },
        { label: "国内保険金額", sompo: "日本国内：無制限", tokio: "国内：無制限", mitsui: "日本国内：無制限", highlight: "" },
        { label: "国外の補償", sompo: "1事故につき1億円", tokio: "1億円限度", mitsui: "3億円 ✨", highlight: "mitsui" },
        { label: "受託物に対する補償", sompo: "記載なし", tokio: "他人から借りた物の損害も補償 ✨", mitsui: "1個または1組あたり100万円限度", highlight: "tokio" },
        { label: "電車等運行不能賠償補償", sompo: "あり", tokio: "記載なし", mitsui: "あり", highlight: "" },
      ],
    },
  ];

  return (
    <div style={{ padding: "32px 48px", background: "#FAFBFD", minHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>
        3社比較ダッシュボード
      </h2>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 28, fontFamily: "'Noto Sans JP', sans-serif" }}>
        保険商品比較表に基づく3社の差別化ポイント。背景色は各項目の最優位社を示します。
      </p>

      {/* Insurer Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {Object.entries(INSURERS).map(([key, ins]) => (
          <div key={key} style={{
            background: "#fff", borderRadius: 16, padding: 20, position: "relative",
            border: `2px solid ${ins.color}20`, overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: ins.color,
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{ins.logo}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: ins.color, fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {ins.name}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {ins.strengths.map(s => (
                <span key={s} style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 20,
                  background: ins.accent, color: ins.color, fontWeight: 500,
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Tables */}
      {categories.map(cat => (
        <div key={cat.name} style={{
          background: "#fff", borderRadius: 16, marginBottom: 20, overflow: "hidden",
          border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            padding: "14px 24px", background: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
          }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", fontFamily: "'Noto Sans JP', sans-serif" }}>
              {cat.name}
            </span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ width: "25%", padding: "12px 24px", textAlign: "left", fontSize: 12, color: "#64748B",
                  fontWeight: 600, borderBottom: "1px solid #E2E8F0", fontFamily: "'Noto Sans JP', sans-serif" }}>項目</th>
                {Object.entries(INSURERS).map(([key, ins]) => (
                  <th key={key} style={{
                    width: "25%", padding: "12px 16px", textAlign: "center", fontSize: 12,
                    color: ins.color, fontWeight: 700, borderBottom: "1px solid #E2E8F0",
                    fontFamily: "'Noto Sans JP', sans-serif",
                  }}>{ins.logo} {ins.short}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cat.items.map((item, i) => (
                <tr key={i}>
                  <td style={{
                    padding: "12px 24px", fontSize: 13, color: "#334155",
                    borderBottom: "1px solid #F1F5F9", fontFamily: "'Noto Sans JP', sans-serif",
                  }}>{item.label}</td>
                  {["sompo", "tokio", "mitsui"].map(key => (
                    <td key={key} style={{
                      padding: "12px 16px", textAlign: "center", fontSize: 13,
                      borderBottom: "1px solid #F1F5F9",
                      background: item.highlight === key ? INSURERS[key].accent : "transparent",
                      color: item.highlight === key ? INSURERS[key].color : "#475569",
                      fontWeight: item.highlight === key ? 700 : 400,
                      fontFamily: "'Noto Sans JP', sans-serif",
                    }}>{item[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ── Recommendation View ──

function RecommendationView({ recommendationData }) {
  const [selectedRec, setSelectedRec] = useState("推奨01");
  const rec = RECOMMENDATIONS[selectedRec];
  const insurer = INSURERS[rec.insurer];

  const hasAnalysis = recommendationData && recommendationData.analysisText;
  const scores = recommendationData?.scores || { sompo: 0, tokio: 0, mitsui: 0 };
  const profile = recommendationData?.customerProfile || {};
  const topInsurer = recommendationData?.topInsurer;
  const topInsurerInfo = topInsurer ? INSURERS[topInsurer] : null;

  return (
    <div style={{ padding: "32px 48px", background: "#FAFBFD", minHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>
        推奨理由 & トークスクリプト
      </h2>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 28, fontFamily: "'Noto Sans JP', sans-serif" }}>
        {hasAnalysis
          ? "会話分析に基づく推奨結果です。AI分析と推奨パターンを確認できます。"
          : "ヒアリング結果から最適な推奨パターンを選択。会話を進めるとAI分析結果が表示されます。"}
      </p>

      {/* AI Analysis Result - 会話分析結果 */}
      {hasAnalysis && (
        <div style={{
          background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)",
          borderRadius: 16, padding: 28, marginBottom: 24,
          border: "1px solid #BFDBFE", boxShadow: "0 4px 20px rgba(59,130,246,0.08)",
          animation: "fadeIn 0.5s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 18, fontWeight: 700,
            }}>AI</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1E3A5F", fontFamily: "'Noto Sans JP', sans-serif" }}>
                AI分析結果
              </div>
              <div style={{ fontSize: 11, color: "#64748B" }}>会話内容をリアルタイム分析</div>
            </div>
            {topInsurerInfo && (
              <div style={{
                marginLeft: "auto", padding: "8px 20px", borderRadius: 10,
                background: topInsurerInfo.color, color: "#fff",
                fontWeight: 700, fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
              }}>
                {topInsurerInfo.logo} {topInsurerInfo.name}を推奨
              </div>
            )}
          </div>

          {/* Scores */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {Object.entries(INSURERS).map(([key, ins]) => {
              const score = scores[key] || 0;
              const isTop = key === topInsurer;
              return (
                <div key={key} style={{
                  flex: 1, background: "#fff", borderRadius: 12, padding: 16,
                  border: isTop ? `2px solid ${ins.color}` : "1px solid #E2E8F0",
                  textAlign: "center", position: "relative",
                  boxShadow: isTop ? `0 4px 12px ${ins.color}20` : "none",
                }}>
                  {isTop && (
                    <div style={{
                      position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                      padding: "2px 12px", borderRadius: 10,
                      background: ins.color, color: "#fff",
                      fontSize: 10, fontWeight: 700,
                    }}>最推奨</div>
                  )}
                  <ProgressRing percent={score} color={ins.color} size={64} stroke={5} />
                  <div style={{ fontSize: 20, fontWeight: 800, color: ins.color, marginTop: 4 }}>{score}%</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: ins.color }}>{ins.name}</div>
                </div>
              );
            })}
          </div>

          {/* Analysis Text */}
          <div style={{
            padding: "16px 20px", borderRadius: 12,
            background: "#fff", border: "1px solid #E2E8F0",
            fontSize: 14, lineHeight: 1.9, color: "#334155",
            fontFamily: "'Noto Sans JP', sans-serif",
          }}>
            {recommendationData.analysisText}
          </div>

          {/* Top Reason */}
          {recommendationData.topReason && (
            <div style={{
              marginTop: 12, padding: "12px 20px", borderRadius: 12,
              background: topInsurerInfo ? `${topInsurerInfo.color}10` : "#F8FAFC",
              border: `1px solid ${topInsurerInfo ? `${topInsurerInfo.color}30` : "#E2E8F0"}`,
              fontSize: 13, lineHeight: 1.8, color: "#1E293B",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>
              <strong style={{ color: topInsurerInfo?.color }}>推奨理由：</strong>{recommendationData.topReason}
            </div>
          )}
        </div>
      )}

      {/* Customer Profile Summary - 動的データ */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: 24, marginBottom: 24,
        border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 12, letterSpacing: "0.05em" }}>
          👤 お客様プロファイル
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "運転者", value: profile.driver || "未取得" },
            { label: "車両", value: profile.vehicle || "未取得" },
            { label: "使用目的", value: profile.purpose || "未取得" },
            { label: "重視ポイント", value: profile.priority || "未取得" },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 600,
                color: item.value === "未取得" ? "#CBD5E1" : "#1E293B",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No analysis yet - empty state */}
      {!hasAnalysis && (
        <div style={{
          textAlign: "center", padding: "60px 20px", color: "#94A3B8",
          background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🧠</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#64748B", fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 8 }}>
            AI分析結果はここに表示されます
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8", fontFamily: "'Noto Sans JP', sans-serif" }}>
            会話タブでお客様との対話を進めると、自動で分析が実行されます
          </div>
        </div>
      )}

      {/* 既存の推奨パターン一覧（常に表示） */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, marginTop: 24 }}>
        {/* Recommendation Selector */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: 20,
          border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 12, letterSpacing: "0.05em" }}>
            推奨パターン一覧
          </div>
          {Object.entries(RECOMMENDATIONS).map(([key, r]) => {
            const ins = INSURERS[r.insurer];
            const isActive = key === selectedRec;
            const isAiTop = topInsurer && r.insurer === topInsurer;
            return (
              <button key={key} onClick={() => setSelectedRec(key)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, marginBottom: 4,
                  background: isActive ? ins.accent : "transparent",
                  border: isActive ? `1px solid ${ins.color}40` : "1px solid transparent",
                  cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                }}>
                <span style={{
                  fontSize: 10, padding: "2px 6px", borderRadius: 4,
                  background: ins.color, color: "#fff", fontWeight: 700,
                  fontFamily: "monospace", flexShrink: 0,
                }}>{key.replace("推奨", "")}</span>
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? ins.color : "#475569",
                    fontFamily: "'Noto Sans JP', sans-serif",
                  }}>{r.title}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>{ins.name}</div>
                </div>
                {isAiTop && (
                  <span style={{
                    marginLeft: "auto", fontSize: 10, padding: "2px 8px",
                    borderRadius: 20, background: "#FEF3C7", color: "#92400E", fontWeight: 600,
                  }}>AI推奨</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Recommendation Detail */}
        <div>
          <div style={{
            borderRadius: 16, overflow: "hidden",
            border: `2px solid ${insurer.color}30`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            marginBottom: 20,
          }}>
            <div style={{
              padding: "24px 32px", color: "#fff",
              background: `linear-gradient(135deg, ${insurer.color}, ${insurer.color}CC)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 32 }}>{insurer.logo}</span>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{selectedRec}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {insurer.name}を推奨
                  </div>
                </div>
                <div style={{
                  marginLeft: "auto", padding: "8px 20px", borderRadius: 10,
                  background: "rgba(255,255,255,0.2)", fontWeight: 700, fontSize: 14,
                  backdropFilter: "blur(10px)",
                }}>
                  {rec.title}
                </div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: "28px 32px" }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 12, letterSpacing: "0.05em",
              }}>
                📋 推奨トークスクリプト
              </div>
              <div style={{
                padding: "20px 24px", borderRadius: 12,
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                fontSize: 15, lineHeight: 2, color: "#1E293B",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>
                「{rec.desc}」
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button style={{
                  padding: "10px 24px", borderRadius: 10, border: "none",
                  background: insurer.color, color: "#fff", fontWeight: 600,
                  fontSize: 13, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
                }}>📎 提案書に反映</button>
                <button style={{
                  padding: "10px 24px", borderRadius: 10,
                  border: `1px solid ${insurer.color}40`,
                  background: "transparent", color: insurer.color, fontWeight: 600,
                  fontSize: 13, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
                }}>📄 PDF出力</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──

export default function InsuranceAdvisor() {
  const [currentView, setCurrentView] = useState("conversation");
  const [hearingData, setHearingData] = useState({});
  const [recommendationData, setRecommendationData] = useState(null);

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
      {currentView === "conversation" && <ConversationView hearingData={hearingData} setHearingData={setHearingData} recommendationData={recommendationData} setRecommendationData={setRecommendationData} />}
      {currentView === "hearing" && <HearingView hearingData={hearingData} />}
      {currentView === "comparison" && <ComparisonView />}
      {currentView === "recommendation" && <RecommendationView recommendationData={recommendationData} />}
    </div>
  );
}
