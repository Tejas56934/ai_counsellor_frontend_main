// File: src/components/Sidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import { askChat, submitAdmission } from "../api";
import "./Sidebar.css";
import AdmissionWizard from "./admissionWizard";
import CounsellorImage from "../assets/CounsellorImage.png"

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Intro when first opened
 useEffect(() => { if (open && messages.length === 0) {
     setTimeout(() => addBot("Hello from EDUPlus Campus AI Counselor."), 400);
     setTimeout(() => addBot("I'm here to help with admissions, registrations and CRM queries."), 1000);
     setTimeout(() => addBot("Try: 'What are the admission steps?' or click '🎓 Admissions'"), 1500);
     }
 },[open]);

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
      // askChat sends request to backend at port 8080 (see ../api.js)
      const reply = await askChat(text, "CRM");
      // reply is expected to be string; handle objects defensively
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
            <h3>EDUPlus Campus</h3>
            <small>AI Counselor</small>
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
{/*               <button onClick={() => (window.location.href = "/register")}>📝 Register</button> */}
              <button onClick={() => { setMessages([]); addBot("How can I help you today?"); }}>↺ Reset</button>
            </div>
          )}

          <div ref={scrollRef}></div>
        </div>

        {/* Persistent input at bottom */}
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





