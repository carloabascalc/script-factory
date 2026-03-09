import { useState } from "react";

const SYSTEM_PROMPT = `You are a script writer for viral YouTube Shorts. You write "What if you brought [object] to [place]?" videos.

OUTPUT FORMAT — follow this exactly, no exceptions:

HOOK: What if you brought a [object] to [place]?
DAY1: [2-3 sentences]
DAY2: [2-3 sentences]
DAY3: [2-3 sentences]
DAY4: [2-3 sentences]
DAY5: [2-3 sentences]
DAY6: [2-3 sentences]
DAY7: [2-3 sentences]

RULES:
- Output exactly the 8 lines above. Nothing before HOOK. Nothing after DAY7. No extra lines.
- Each DAY line is a single line starting with DAY1:, DAY2:, etc.
- DAY7 always ends badly for the viewer — imprisoned, condemned, executed, exiled
- Total word count across all lines: 170-190 words
- Tone: calm, flat, deadpan. Like a nature documentary. Short sentences. No drama in the narration.
- Historical reactions must be realistic human behavior — greed, fear, desire, violence. No gods, no prophecies.
- Never reference anything modern inside the historical world. No phones, no subscribing, no modern concepts.
- The viewer is always "you" — second person throughout.
- Somewhere between Day 3 and Day 5, a famous real historical figure OR landmark must appear naturally in the story. Examples: Caesar summons you, Socrates examines it, Cleopatra hears about it, a gladiator fight breaks out over it in the Colosseum, Aristotle demands to study it. Use whoever fits the era. This is the emotional peak of the story — the moment that makes people react.`;

const DAY_COLORS = ["#f97316","#eab308","#22c55e","#3b82f6","#a78bfa","#ec4899","#ef4444"];

export default function ScriptFactory() {
  const [concept, setConcept] = useState("");
  const [hook, setHook] = useState("");
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const parseScript = (text) => {
    const hookMatch = text.match(/HOOK:\s*(.+)/i);
    const parsedHook = hookMatch ? hookMatch[1].trim() : "";

    const parsedDays = [];
    for (let i = 1; i <= 7; i++) {
      const match = text.match(new RegExp(`DAY${i}:\\s*(.+?)(?=DAY${i+1}:|$)`, "is"));
      if (match) parsedDays.push(match[1].trim());
    }

    return { parsedHook, parsedDays };
  };

  const generate = async () => {
    if (!concept.trim()) return;
    setLoading(true);
    setHook("");
    setDays([]);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Write the script for: "${concept}"` }]
        })
      });

      const data = await response.json();
      const raw = data.content?.[0]?.text || "";
      const { parsedHook, parsedDays } = parseScript(raw);

      if (!parsedHook || parsedDays.length === 0) {
        setError("Generation failed — try again.");
      } else {
        setHook(parsedHook);
        setDays(parsedDays.slice(0, 7)); // hard limit, always
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const fullScript = hook
    ? [hook, ...days.map((d, i) => `Day ${i + 1}: ${d}`)].join("\n\n")
    : "";

  const wordCount = fullScript.split(/\s+/).filter(Boolean).length;
  const readTime = Math.round(wordCount / 2.6);

  const copy = () => {
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: "#07070f",
      minHeight: "100vh",
      padding: "28px 20px",
      fontFamily: "'Courier New', monospace",
      color: "#e0e0e0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        textarea:focus { outline: none; }
        textarea::placeholder { color: #2a2a3a; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 640, margin: "0 auto 28px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: 800,
          color: "#fff",
          marginBottom: 6,
        }}>
          Script <span style={{ color: "#f97316" }}>Factory</span>
        </div>
        <p style={{ color: "#333", fontSize: 10, letterSpacing: 2, margin: 0 }}>
          ONE LINE IN → FULL DAY 1–7 SCRIPT OUT
        </p>
      </div>

      {/* Input */}
      <div style={{ maxWidth: 640, margin: "0 auto 20px" }}>
        <div style={{
          background: "#0d0d1a",
          border: `1px solid ${concept ? "#f9731640" : "#1a1a2e"}`,
          borderRadius: 12,
          padding: "4px 4px 4px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "border-color 0.2s",
        }}>
          <textarea
            value={concept}
            onChange={e => setConcept(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); }}}
            placeholder="fidget spinner, ancient rome"
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontFamily: "'Courier New', monospace",
              resize: "none",
              padding: "12px 0",
            }}
          />
          <button
            onClick={generate}
            disabled={loading || !concept.trim()}
            style={{
              background: loading ? "#1a1a2e" : concept.trim() ? "linear-gradient(135deg, #f97316, #ec4899)" : "#1a1a2e",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              color: loading || !concept.trim() ? "#333" : "#fff",
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: loading || !concept.trim() ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {loading
              ? <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:10, height:10, border:"2px solid #f97316", borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />
                  WRITING
                </span>
              : "GENERATE ↵"}
          </button>
        </div>
        <p style={{ color: "#1e1e2e", fontSize: 10, letterSpacing: 1, marginTop: 6, textAlign: "center" }}>
          try: "iphone, ancient egypt" · "microwave, medieval castle" · "sunglasses, mongol empire"
        </p>
      </div>

      {error && (
        <div style={{ maxWidth: 640, margin: "0 auto 12px", color: "#ef4444", fontSize: 12, textAlign: "center" }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ maxWidth: 640, margin: "40px auto", textAlign: "center", color: "#2a2a3a", fontSize: 11, letterSpacing: 2 }}>
          WRITING YOUR SCRIPT...
        </div>
      )}

      {/* Output */}
      {hook && !loading && (
        <div style={{ maxWidth: 640, margin: "0 auto", animation: "fadeUp 0.3s ease" }}>

          {/* Stats */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, padding:"0 2px" }}>
            <div style={{ display:"flex", gap:14 }}>
              <span style={{ fontSize:10, color: wordCount >= 170 && wordCount <= 190 ? "#22c55e" : "#f97316", letterSpacing:1 }}>
                {wordCount} words
              </span>
              <span style={{ fontSize:10, color: readTime >= 65 && readTime <= 75 ? "#22c55e" : "#f97316", letterSpacing:1 }}>
                ~{readTime}s
              </span>
              {readTime >= 60 && (
                <span style={{ fontSize:10, color:"#22c55e", letterSpacing:1 }}>✓ MONETIZABLE</span>
              )}
            </div>
            <button
              onClick={copy}
              style={{
                background: copied ? "#22c55e20" : "#1a1a2e",
                border: `1px solid ${copied ? "#22c55e40" : "#2a2a3e"}`,
                borderRadius: 6,
                padding: "4px 12px",
                color: copied ? "#22c55e" : "#444",
                fontFamily: "'Courier New', monospace",
                fontSize: 10,
                letterSpacing: 1,
                cursor: "pointer",
              }}
            >
              {copied ? "✓ COPIED" : "COPY ALL"}
            </button>
          </div>

          {/* Hook */}
          <div style={{
            background: "#0d0d1a",
            border: "1px solid #f9731630",
            borderRadius: "10px 10px 0 0",
            padding: "14px 18px",
          }}>
            <div style={{ fontSize:9, color:"#f97316", letterSpacing:2, marginBottom:6 }}>HOOK</div>
            <div style={{ fontSize:14, color:"#fff", lineHeight:1.6, fontWeight:600 }}>{hook}</div>
          </div>

          {/* Days */}
          {days.map((text, i) => {
            const num = i + 1;
            const color = DAY_COLORS[i];
            const isLast = num === 7;
            return (
              <div key={i} style={{
                background: isLast ? `${color}12` : "#0a0a16",
                border: `1px solid ${isLast ? color+"40" : "#13131f"}`,
                borderTop: "none",
                borderRadius: num === days.length ? "0 0 10px 10px" : 0,
                padding: "12px 18px",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:800, color, letterSpacing:1 }}>
                    DAY {num}
                  </span>
                  {isLast && (
                    <span style={{ fontSize:9, color, background:`${color}20`, padding:"2px 8px", borderRadius:10, letterSpacing:1 }}>
                      ⚡ THE TWIST
                    </span>
                  )}
                </div>
                <div style={{ fontSize:13, color: isLast ? "#ddd" : "#888", lineHeight:1.75 }}>
                  {text}
                </div>
              </div>
            );
          })}

          {/* Regenerate */}
          <div style={{ marginTop:12, textAlign:"center" }}>
            <button
              onClick={generate}
              style={{
                background:"transparent",
                border:"1px solid #1a1a2e",
                borderRadius:8,
                padding:"8px 20px",
                color:"#333",
                fontFamily:"'Courier New',monospace",
                fontSize:10,
                letterSpacing:2,
                cursor:"pointer",
              }}
              onMouseEnter={e => { e.target.style.borderColor="#f9731640"; e.target.style.color="#f97316"; }}
              onMouseLeave={e => { e.target.style.borderColor="#1a1a2e"; e.target.style.color="#333"; }}
            >
              ↺ REGENERATE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
