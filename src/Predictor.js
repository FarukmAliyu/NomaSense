import React, { useState, useRef, useEffect } from "react";
import { FaUpload, FaRobot, FaLeaf, FaCheckCircle, FaTimes, FaCommentDots } from "react-icons/fa";

/*
  NomaSense predictor
  Drop-in replacement for the previous Predictor component.
  Features kept: image upload and preview, analyze, diagnosis result with
  severity and treatment, and the keyword-based assistant chat.
*/

const diseaseData = [
  {
    name: "Leaf Blight",
    severity: "moderate",
    info: "Brown patches on leaves.",
    treatment: ["Apply fungicide", "Remove infected leaves"],
    color: "#f59e0b"
  },
  {
    name: "Powdery Mildew",
    severity: "moderate",
    info: "White powder on leaves.",
    treatment: ["Use neem oil", "Improve airflow"],
    color: "#eab308"
  },
  {
    name: "Root Rot",
    severity: "severe",
    info: "Roots decay from excess water.",
    treatment: ["Reduce watering", "Improve drainage"],
    color: "#ef4444"
  },
  {
    name: "Healthy Crop",
    severity: "healthy",
    info: "Your crop is healthy.",
    treatment: ["Continue regular monitoring"],
    color: "#22c55e"
  }
];

const severityStyle = {
  healthy: { label: "Healthy", bg: "#dcfce7", fg: "#166534" },
  moderate: { label: "Moderate", bg: "#fef3c7", fg: "#92400e" },
  severe: { label: "Severe", bg: "#fee2e2", fg: "#991b1b" }
};

const css = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

.np {
  --brand: #14532d;
  --brand-hover: #104626;
  --ink: #111827;
  --body: #374151;
  --muted: #6b7280;
  --line: #e5e7eb;
  --page: #f9fafb;
  --surface: #ffffff;
  min-height: 100vh;
  background: var(--page);
  color: var(--body);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.np *, .np *::before, .np *::after { box-sizing: border-box; }
.np h1, .np h2, .np h3, .np h4, .np p { margin: 0; }

/* ---------- Top bar ---------- */
.np-bar { background: var(--surface); border-bottom: 1px solid var(--line); }
.np-bar-inner { max-width: 1280px; margin: 0 auto; padding: 16px 24px; }
.np-bar h1 { font-size: 20px; font-weight: 600; letter-spacing: -0.015em; color: var(--ink); }
.np-bar p { margin-top: 2px; font-size: 14px; color: var(--muted); }

/* ---------- Layout ---------- */
.np-wrap { max-width: 1280px; margin: 0 auto; padding: 24px; }
.np-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.np-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.np-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
}
.np-head h2 { font-size: 16px; font-weight: 600; color: var(--ink); }
.np-head svg { color: var(--brand); }
.np-body { padding: 20px; }

/* ---------- Upload ---------- */
.np-drop {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 36px 20px;
  background: #f9fafb;
  border: 1.5px dashed #b6c4ba;
  border-radius: 10px;
  font: inherit;
  color: var(--body);
  text-align: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.np-drop:hover { background: #f1f7f3; border-color: var(--brand); }
.np-drop svg { color: var(--brand); margin-bottom: 6px; }
.np-drop strong { font-size: 15px; font-weight: 600; color: var(--ink); }
.np-drop span { font-size: 13px; color: var(--muted); }
.np-hidden { display: none; }
.np-preview {
  position: relative;
  margin-top: 16px;
  border-radius: 10px;
  overflow: hidden;
  background: #0b1410;
  border: 1px solid var(--line);
}
.np-preview img { display: block; width: 100%; max-height: 300px; object-fit: contain; }
.np-actions { display: grid; gap: 10px; margin-top: 16px; }
.np-btn {
  height: 44px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: var(--surface);
  color: var(--ink);
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.np-btn:hover:not(:disabled) { background: #f3f4f6; }
.np-btn.primary { background: var(--brand); border-color: var(--brand); color: #fff; font-weight: 600; }
.np-btn.primary:hover:not(:disabled) { background: var(--brand-hover); }
.np-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.np-btn.primary:disabled { opacity: 0.55; }
.np-btn:focus-visible, .np-drop:focus-visible, .np-send:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

/* ---------- Result ---------- */
.np-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 16px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.55;
}
.np-empty svg { color: #cbd5d0; }
.np-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.np-result-name {
  margin-top: 12px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.np-result-info { margin-top: 6px; font-size: 15px; line-height: 1.55; color: var(--body); }
.np-rule { height: 1px; background: var(--line); margin: 20px 0; }
.np-result h3 { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 12px; }
.np-treat { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.np-treat li { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; line-height: 1.5; }
.np-treat svg { flex: none; margin-top: 3px; color: #2a8a52; }
.np-accent { height: 4px; border-radius: 12px 12px 0 0; }
.np-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: np-spin 0.8s linear infinite;
}
@keyframes np-spin { to { transform: rotate(360deg); } }

/* ---------- Chat ---------- */
.np-launcher {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  height: 52px;
  padding: 0 20px 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.22);
  transition: background 0.15s;
}
.np-launcher:hover { background: var(--brand-hover); }
.np-launcher:focus-visible, .np-x:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 3px;
}
.np-panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  width: 380px;
  height: min(560px, calc(100vh - 48px));
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(16, 24, 40, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: np-pop 0.18s ease-out;
}
@keyframes np-pop {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
.np-panel .np-head { justify-content: space-between; }
.np-panel .np-head-title { display: flex; align-items: center; gap: 10px; }
.np-x {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  background: none;
  border: none;
  border-radius: 6px;
  color: var(--muted);
  cursor: pointer;
}
.np-x:hover { background: #f3f4f6; color: var(--ink); }
.np-log {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.np-msg {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.np-msg.bot { align-self: flex-start; background: #f3f4f6; color: var(--ink); border-bottom-left-radius: 4px; }
.np-msg.user { align-self: flex-end; background: var(--brand); color: #fff; border-bottom-right-radius: 4px; }
.np-form {
  display: flex;
  gap: 8px;
  padding: 14px 16px;
  border-top: 1px solid var(--line);
}
.np-input {
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  font: inherit;
  font-size: 14px;
  color: var(--ink);
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.np-input::placeholder { color: #9ca3af; }
.np-input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.16);
}
.np-send {
  height: 42px;
  padding: 0 18px;
  border: none;
  border-radius: 8px;
  background: var(--brand);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.np-send:hover { background: var(--brand-hover); }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .np-grid { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
  .np-bar-inner, .np-wrap { padding: 16px; }
  .np-grid { gap: 16px; }
  .np-launcher { right: 16px; bottom: 16px; }
  .np-panel {
    right: 12px;
    left: 12px;
    bottom: 12px;
    width: auto;
    height: min(560px, calc(100vh - 24px));
  }
}
@media (prefers-reduced-motion: reduce) {
  .np-spinner { animation-duration: 2s; }
  .np-panel { animation: none; }
  .np-drop, .np-btn, .np-input, .np-launcher { transition: none; }
}
`;

function Predictor() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello, I'm the NomaSense assistant. Upload a photo and I'll help diagnose your crop.",
      sender: "bot"
    }
  ]);
  const [input, setInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const logRef = useRef(null);
  const chatInputRef = useRef(null);
  const launcherRef = useRef(null);
  const wasOpenRef = useRef(false);

  // Release the preview URL when the image changes or the page unmounts
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Keep the newest chat message in view
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, chatOpen]);

  // Focus the message box when the chat opens, and return focus to the button when it closes
  useEffect(() => {
    if (chatOpen) {
      chatInputRef.current?.focus();
    } else if (wasOpenRef.current) {
      launcherRef.current?.focus();
    }
    wasOpenRef.current = chatOpen;
  }, [chatOpen]);

  // Close the chat with Escape
  useEffect(() => {
    if (!chatOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setChatOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [chatOpen]);

  // Handle image upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setPrediction(null);
    setIsAnalyzing(false);
    clearTimeout(timerRef.current);
    e.target.value = ""; // allow choosing the same file again
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  // Analyze image
  const analyzeUploadedImage = () => {
    if (!image) return;
    setIsAnalyzing(true);
    setPrediction(null);
    timerRef.current = setTimeout(() => {
      const result = diseaseData[Math.floor(Math.random() * diseaseData.length)];
      setPrediction(result);
      setIsAnalyzing(false);
    }, 1300);
  };

  // Chatbot
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    let botReply = "I'm here to help with crop diseases and treatments.";

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("blight")) botReply = "Leaf Blight: Use fungicide and remove affected leaves immediately.";
    else if (lowerInput.includes("mildew")) botReply = "Powdery Mildew: Apply neem oil and ensure good ventilation.";
    else if (lowerInput.includes("rot")) botReply = "Root Rot: Reduce watering and improve soil drainage.";
    else if (lowerInput.includes("healthy")) botReply = "Great! Keep up the good work maintaining your crops.";

    setMessages((prev) => [...prev, userMessage, { text: botReply, sender: "bot" }]);
    setInput("");
  };

  const sev = prediction ? severityStyle[prediction.severity] : null;

  return (
    <div className="np">
      <style>{css}</style>

      <header className="np-bar">
        <div className="np-bar-inner">
          <h1>Crop disease predictor</h1>
          <p>Upload a leaf photo to get a diagnosis and treatment guidance.</p>
        </div>
      </header>

      <main className="np-wrap">
        <div className="np-grid">
          {/* Vision */}
          <section className="np-card" aria-label="Image analysis">
            <div className="np-head">
              <FaUpload aria-hidden="true" />
              <h2>Image analysis</h2>
            </div>
            <div className="np-body">
              <button type="button" className="np-drop" onClick={triggerFileUpload}>
                <FaUpload size={28} aria-hidden="true" />
                <strong>{image ? "Choose a different photo" : "Upload a leaf photo"}</strong>
                <span>Use a clear, well-lit photo of one affected leaf.</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="np-hidden"
                aria-label="Upload crop photo"
              />

              {image && (
                <div className="np-preview">
                  <img src={image} alt="Uploaded crop leaf" />
                </div>
              )}

              <div className="np-actions">
                <button
                  type="button"
                  onClick={analyzeUploadedImage}
                  disabled={!image || isAnalyzing}
                  className="np-btn primary"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze image"}
                </button>
              </div>
            </div>
          </section>

          {/* Result */}
          <section className="np-card" aria-label="Diagnosis result" aria-live="polite">
            {prediction && (
              <div className="np-accent" style={{ background: prediction.color }} />
            )}
            <div className="np-head">
              <FaLeaf aria-hidden="true" />
              <h2>Diagnosis result</h2>
            </div>
            <div className="np-body">
              {isAnalyzing ? (
                <div className="np-empty">
                  <div className="np-spinner" role="status" aria-label="Analyzing" />
                  <p>Analyzing your image...</p>
                </div>
              ) : prediction ? (
                <div className="np-result">
                  <span className="np-badge" style={{ background: sev.bg, color: sev.fg }}>
                    {sev.label}
                  </span>
                  <h3 className="np-result-name" style={{ marginBottom: 0 }}>{prediction.name}</h3>
                  <p className="np-result-info">{prediction.info}</p>
                  <div className="np-rule" />
                  <h3>Treatment recommendations</h3>
                  <ul className="np-treat">
                    {prediction.treatment.map((t, i) => (
                      <li key={i}>
                        <FaCheckCircle aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="np-empty">
                  <FaLeaf size={44} aria-hidden="true" />
                  <p>No diagnosis yet.<br />Upload a photo and select Analyze image.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Assistant: hidden until opened */}
      {!chatOpen && (
        <button
          type="button"
          ref={launcherRef}
          className="np-launcher"
          onClick={() => setChatOpen(true)}
          aria-expanded="false"
          aria-controls="np-assistant"
        >
          <FaCommentDots size={20} aria-hidden="true" />
  
        </button>
      )}

      {chatOpen && (
        <section
          id="np-assistant"
          className="np-panel"
          role="dialog"
          aria-label="NomaSense assistant"
        >
          <div className="np-head">
            <div className="np-head-title">
              <FaRobot aria-hidden="true" />
              <h2>NomaSense assistant</h2>
            </div>
            <button
              type="button"
              className="np-x"
              onClick={() => setChatOpen(false)}
              aria-label="Close assistant"
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>
          <div className="np-log" ref={logRef} role="log" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={`np-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form className="np-form" onSubmit={handleSend}>
            <input
              ref={chatInputRef}
              className="np-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a disease or treatment"
              aria-label="Message the assistant"
            />
            <button type="submit" className="np-send">Send</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default Predictor;
