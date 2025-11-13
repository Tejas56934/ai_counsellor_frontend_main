import React, { useEffect, useRef, useState } from "react";
import { askChat, submitAdmission } from "../api";
import AdmissionWizard from "./admissionWizard";
import CounsellorImage from "../assets/CounsellorImage.png";
import Logo from "../assets/Logo.png"

const userStyle = `
  :root {
    --bg: #0b1220;
    --accent: #00f7ff;
    --panel: #0f172a;
    --bot: #111827;
    --user: #0b84ff;
    --text: #eaf2ff;
  }

  /* AI Toggle Button */
  .ai-toggle {
    position: fixed;
    right: clamp(8px, 2vw, 16px);
    bottom: clamp(16px, 4vh, 28px);
    width: clamp(56px, 10vw, 64px);
    height: clamp(56px, 10vw, 64px);
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, rgba(0,247,255,0.1), rgba(10,10,10,0.2));
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 8px 24px rgba(0,0,0,0.6);
    cursor: pointer;
    z-index: 9999;
    transition: transform 0.2s ease;
  }
  .ai-toggle.open { transform: scale(0.98); }
  .ai-toggle:active { transform: scale(0.95); }
  .ai-icon {
    width: clamp(36px, 8vw, 44px);
    height: clamp(36px, 8vw, 44px);
    object-fit: contain;
  }

  /* Tooltip */
  .counsellor-tooltip {
    position: absolute;
    bottom: calc(100% + 12px);
    left: -50%;
    transform: translateX(-50%) translateY(6px);
    background: var(--text);
    color: var(--bot);
    padding: 8px 12px;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.4);
    font-weight: 600;
    font-size: clamp(12px, 2.5vw, 14px);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.28s ease, transform 0.28s ease;
    z-index: 10000;
  }
  .ai-toggle:hover .counsellor-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* Sidebar - Desktop (default) */
  .sidebar {
    position: fixed;
    right: -500px;
    width: 500px;
    height: calc(100vh - 96px);
    top: 8px;
    background: var(--panel);
    border-left: 3px solid var(--accent);
    border-radius: 12px 0 0 12px;
    box-shadow: -8px 20px 60px rgba(0, 0, 0, 0.6);
    color: var(--text);
    display: flex;
    flex-direction: column;
    transition: right 0.36s cubic-bezier(0.2, 0.9, 0.2, 1);
    z-index: 1050;
    overflow: hidden;
  }
  .sidebar.active,
  .sidebar.open {
    right: 0;
  }

  /* Sidebar Header */
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(12px, 3vw, 16px);
    border-bottom: 1px solid rgba(0, 247, 255, 0.1);
    background-color: white;
    flex-shrink: 0;
  }
  .sidebar-header h3 {
    margin: 0;
    color: black;
    font-size: clamp(1rem, 2.5vw, 1.1rem);
    font-weight: 600;
  }
  .logoImage{
        height: 30px;
        width: 60px;
        margin-left: -80px;
      }
  .sidebar-header small {
    color: black;
    opacity: 0.7;
    font-size: clamp(0.75rem, 2vw, 0.875rem);
  }
  .header-actions .minimize {
    background: transparent;
    border: none;
    color: black;
    font-size: clamp(1rem, 2.5vw, 1.1rem);
    cursor: pointer;
    padding: 4px 8px;
    line-height: 1;
  }
  .header-actions .minimize:hover {
    opacity: 0.7;
  }

  /* Chat Area */
  .chat-area {
    padding: clamp(12px, 3vw, 14px);
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 2vw, 10px);
    color: white;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .chat-area::-webkit-scrollbar {
    width: 6px;
  }
  .chat-area::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
  }
  .chat-area::-webkit-scrollbar-thumb {
    background: rgba(0,247,255,0.3);
    border-radius: 3px;
  }

  .empty-state {
    color: rgba(234,242,255,0.7);
    padding: clamp(10px, 2.5vw, 12px);
    border-radius: 8px;
    background: rgba(255,255,255,0.02);
    font-size: clamp(0.875rem, 2vw, 0.95rem);
  }

  /* Chat Bubbles */
  .chat-bubble {
    padding: clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px);
    border-radius: 14px;
    max-width: 82%;
    line-height: 1.4;
    font-size: clamp(0.875rem, 2vw, 0.95rem);
    word-wrap: break-word;
  }
  .chat-bubble.bot {
    align-self: flex-start;
    background: white;
    color: black;
  }
  .chat-bubble.user {
    align-self: flex-end;
    background: linear-gradient(90deg, #0b84ff, #0066ff);
    color: white;
  }

  /* Action Buttons */
  .actions {
    display: flex;
    gap: clamp(8px, 2vw, 10px);
    padding: clamp(6px, 1.5vw, 8px) 2px;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .actions button {
    flex: 1;
    min-width: 100px;
    background: transparent;
    border: 1px solid black;
    color: black;
    padding: clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 10px);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    transition: background 0.2s ease;
  }
  .actions button:hover {
    background: rgba(255,255,255,0.03);
  }

  /* Sidebar Footer */
  .sidebar-footer {
    display: flex;
    gap: clamp(6px, 1.5vw, 8px);
    padding: clamp(10px, 2.5vw, 12px);
    border-top: 1px solid orange;
    background: #f9f8f6;
    flex-shrink: 0;
  }
  .sidebar-footer input {
    flex: 1;
    padding: clamp(8px, 2vw, 10px);
    border-radius: 10px;
    border: 1px solid orange;
    color: black;
    outline: none;
    font-size: clamp(0.875rem, 2vw, 0.95rem);
  }
  .send-btn {
    padding: clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px);
    border-radius: 10px;
    border: 1px solid orange;
    background: linear-gradient(90deg, #f4f4f4, #f4f4f4);
    color: black;
    font-weight: 700;
    cursor: pointer;
    font-size: clamp(0.875rem, 2vw, 0.95rem);
    transition: opacity 0.2s ease;
  }
  .send-btn:hover:not(:disabled) {
    opacity: 0.9;
  }
  .send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Wizard Styles */
  .wizard {
    padding: clamp(12px, 3vw, 16px);
    background: rgba(255,255,255,0.02);
    border: 0.1vmin solid white;
    border-radius: 10px;
  }
  .wizard-step {
    background: #ffffff;
    border-radius: 16px;
    padding: clamp(20px, 4vw, 25px) clamp(25px, 5vw, 30px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    margin-top: 15px;
    transition: transform 0.3s ease;
    color: black;
  }
  .wizard-step:hover {
    transform: translateY(-2px);
  }
  .wizard-step h4 {
    font-size: clamp(1rem, 3vw, 1.125rem);
    color: black;
    margin-bottom: 15px;
    border-bottom: 2px solid #ff6a00;
    display: inline-block;
    padding-bottom: 4px;
  }
  .wizard-step input,
  .wizard-step select {
    width: 100%;
    padding: clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 14px);
    margin: 8px 0 20px 0;
    border-radius: 10px;
    border: 1px solid #d1d1d1;
    background: #fff;
    color: #333;
    font-size: clamp(0.875rem, 2vw, 0.9375rem);
    transition: all 0.25s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  .wizard-step input:focus,
  .wizard-step select:focus {
    outline: none;
    border-color: #ff6a00;
    box-shadow: 0 0 4px rgba(255, 106, 0, 0.4);
    background-color: #fffaf5;
  }
  .wizard-step input:hover,
  .wizard-step select:hover {
    border-color: #ff6a00;
  }
  .wizard-step input:disabled,
  .wizard-step select:disabled {
    background-color: #f9f8f6;
    color: black;
    cursor: not-allowed;
  }
  .wizard-step label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: clamp(0.8rem, 2vw, 0.875rem);
    color: black;
  }

  .wizard-controls {
    display: flex;
    justify-content: space-between;
    gap: clamp(8px, 2vw, 10px);
    margin-top: 20px;
  }
  .wizard-controls button {
    flex: 1;
    padding: clamp(8px, 2vw, 10px) clamp(14px, 3vw, 16px);
    border-radius: 8px;
    border: none;
    background: linear-gradient(90deg, #ff6a00, #ff8e00);
    color: #fff;
    font-weight: 600;
    font-size: clamp(0.875rem, 2vw, 0.9375rem);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .wizard-controls button:hover:not(:disabled) {
    background: linear-gradient(90deg, #ff8e00, #ff6a00);
    box-shadow: 0 2px 8px rgba(255, 106, 0, 0.4);
  }
  .wizard-controls button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  /* Error Message */
  .error-msg {
    background: #ffe6e6;
    color: #b50000;
    border: 1px solid #ffcccc;
    padding: clamp(8px, 2vw, 10px);
    border-radius: 8px;
    margin-bottom: 15px;
    text-align: center;
    font-weight: 600;
    font-size: clamp(0.8rem, 2vw, 0.875rem);
  }

  /* React Select Styling */
  .react-select__control {
    border-radius: 10px !important;
    border: 1px solid #d1d1d1 !important;
    background-color: #fff !important;
    box-shadow: none !important;
    transition: all 0.25s ease;
  }
  .react-select__control--is-focused {
    border-color: #ff6a00 !important;
    box-shadow: 0 0 4px rgba(255, 106, 0, 0.4) !important;
  }
  .react-select__option--is-focused {
    background-color: #fff6ef !important;
    color: #222 !important;
  }
  .react-select__option--is-selected {
    background-color: #ff8e00 !important;
    color: #fff !important;
  }
  .react-select__menu {
    z-index: 9999;
    border-radius: 10px;
    overflow: hidden;
  }

  /* TABLET (601px - 1024px) */
  @media (max-width: 1024px) and (min-width: 601px) {
    .sidebar {
      width: clamp(350px, 50vw, 450px);
      height: 60vh;
      top: 0;
      border-radius: 10px;
      right: calc(-1 * clamp(350px, 50vw, 450px));
    }
    .sidebar.active,
    .sidebar.open {
      right: 0;
    }
    .chat-bubble {
      max-width: 75%;
    }
  }

  /* MOBILE (≤600px) */
  @media (max-width: 600px) {
    .sidebar {
      width: 70%;
      height: 60vh;
      top: 150px;
      margin-left: 100px;
      left: 100%;
      border-radius: 10px;
      box-shadow: none;
    }
    .sidebar.active,
    .sidebar.open {
      right: 0;
    }

    .ai-toggle {
      right: 12px;
      bottom: 12px;
    }

    .chat-area {
      padding: 10px;
      gap: 8px;
    }

    .chat-bubble {
      max-width: 85%;
      font-size: 0.875rem;
      padding: 8px 12px;
    }

    .actions {
      flex-direction: column;
      gap: 8px;
    }
    .actions button {
      width: 100%;
      min-width: unset;
    }

    .sidebar-footer input,
    .send-btn {
      padding: 8px 10px;
      font-size: 0.875rem;
    }

    .wizard-controls {
      flex-direction: column;
    }
    .wizard-controls button {
      width: 100%;
    }

    .wizard-step {
      padding: 16px 20px;
    }

    .counsellor-tooltip {
      font-size: 12px;
      padding: 6px 10px;
    }
  }

  /* EXTRA SMALL (≤360px) */
  @media (max-width: 360px) {
    .ai-toggle {
      width: 48px;
      height: 48px;
      right: 8px;
      bottom: 8px;
    }
    .ai-icon {
      width: 32px;
      height: 32px;
    }
    .sidebar-header {
      padding: 10px;
    }
    .sidebar-header h3 {
      font-size: 0.95rem;
    }
    .sidebar-header small {
      font-size: 0.7rem;
    }
    .chat-bubble {
      font-size: 0.8rem;
      padding: 7px 10px;
    }
    .sidebar-footer {
      padding: 8px;
      gap: 6px;
    }
    .sidebar-footer input {
      padding: 7px 8px;
      font-size: 0.8rem;
    }
    .send-btn {
      padding: 7px 10px;
      font-size: 0.8rem;
    }
    .actions button {
      padding: 6px 8px;
      font-size: 0.75rem;
    }
  }

  /* LANDSCAPE MOBILE */
  @media (max-height: 500px) and (orientation: landscape) {
    .sidebar {
      height: 60vh;
    }
    .chat-area {
      padding: 8px;
    }
    .sidebar-header,
    .sidebar-footer {
      padding: 8px;
    }
    .chat-bubble {
      padding: 6px 10px;
    }
  }
`;

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show intro messages when first opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => addBot("Hello from EDUPlus Campus AI Counselor."), 400);
      setTimeout(() => addBot("I'm here to help with admissions, registrations and CRM queries."), 1000);
      setTimeout(() => addBot("Try: 'What are the admission steps?' or click '🎓 Admissions'"), 1500);
    }
  }, [open]);

  function addBot(text) {
    setMessages((prev) => [...prev, { from: "bot", text }]);
  }

  function addUser(text) {
    setMessages((prev) => [...prev, { from: "user", text }]);
  }

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    addUser(text);
    setInput("");
    setLoading(true);
    try {
      const reply = await askChat(text, "CRM");
      addBot(typeof reply === "string" ? reply : JSON.stringify(reply));
    } catch (err) {
      addBot("Sorry, I could not reach AI. " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleAdmissionSubmit(formData) {
    setLoading(true);
    try {
      const resp = await submitAdmission(formData);
      setShowWizard(false);
      addBot("Thanks — admission submitted. Our team will contact you shortly.");
      if (resp?.redirect) window.location.href = "https://www.goo";
    } catch (err) {
      addBot("Error submitting admission: " + (err?.error || err?.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{userStyle}</style>
      <button
        className={`ai-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle AI Counselor"
      >
        <div className="counsellor-tooltip">I'm your Virtual Assistant!</div>
        <img src={CounsellorImage} alt="AI" className="ai-icon" />
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="sidebar-header">
          <div>
            <h3>AI COUNSELLOR</h3>
            <img src={Logo} alt="logo" className="logoImage"/>
          </div>
          <div className="header-actions">
            <button
              className="minimize"
              onClick={() => setOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="chat-area" role="log" aria-live="polite">
          {messages.length === 0 && (
            <div className="empty-state">Hi 👋 — Ask me anything about admissions or CRM.</div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${msg.from === "bot" ? "bot" : "user"}`}
            >
              {msg.text}
            </div>
          ))}

          {showWizard ? (
            <AdmissionWizard onCancel={() => setShowWizard(false)} onSubmit={handleAdmissionSubmit} />
          ) : (
            <div className="actions">
              <button onClick={() => setShowWizard(true)}>🎓 Admissions</button>
              <button onClick={() => { setMessages([]); addBot("How can I help you today?"); }}>↺ Reset</button>
            </div>
          )}

          <div ref={scrollRef}></div>
        </div>

        <div className="sidebar-footer">
          <input
            type="text"
            placeholder="Type your question related to CRM.."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            aria-label="Message input"
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()} className="send-btn">
            {loading ? "..." : "Send"}
          </button>
        </div>
      </aside>
    </>
  );
}
