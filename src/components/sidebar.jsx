import React, { useEffect, useRef, useState } from "react";
import { askChat, submitAdmission } from "../api";
import Select from "react-select";
import { locationData } from "./locationData";
import Logo from "../assets/Logo.png"

// AI Icon
const CounsellorImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%2300f7ff'/%3E%3Ctext x='50' y='65' text-anchor='middle' fill='%23000' font-size='50' font-weight='bold'%3E🤖%3C/text%3E%3C/svg%3E"

// Stream, Level, and Programme Data
const STREAMS = [
  "Law",
  "Management",
  "Engineering",
  "Medical Sciences",
  "Arts & Humanities",
  "Commerce"
];

const LEVELS = {
  "Law": ["UG", "PG", "Diploma"],
  "Management": ["UG", "PG", "Executive"],
  "Engineering": ["UG", "PG", "Diploma"],
  "Medical Sciences": ["UG", "PG", "Diploma"],
  "Arts & Humanities": ["UG", "PG", "Certificate"],
  "Commerce": ["UG", "PG", "Professional"]
};

const PROGRAMMES = {
  "Law": {
    "UG": ["BA LLB (Hons.)", "BBA LLB (Hons.)", "LLB (3 Years)"],
    "PG": ["LLM (Business Law)", "LLM (Criminal Law)", "LLM (Constitutional Law)", "LLM (International Law)"],
    "Diploma": ["Diploma in Corporate Law", "Diploma in Cyber Law", "Diploma in IPR"]
  },
  "Management": {
    "UG": ["BBA", "BBA (Finance)", "BBA (Marketing)", "BBA (HR)"],
    "PG": ["MBA", "MBA (Finance)", "MBA (Marketing)", "MBA (HR)", "MBA (Operations)"],
    "Executive": ["Executive MBA", "Executive PGDM"]
  },
  "Engineering": {
    "UG": ["B.Tech (CSE)", "B.Tech (ECE)", "B.Tech (Mechanical)", "B.Tech (Civil)"],
    "PG": ["M.Tech (CSE)", "M.Tech (ECE)", "M.Tech (Mechanical)"],
    "Diploma": ["Diploma in Computer Science", "Diploma in Electronics"]
  },
  "Medical Sciences": {
    "UG": ["MBBS", "BDS", "B.Pharm", "Nursing"],
    "PG": ["MD", "MS", "M.Pharm", "M.Sc Nursing"],
    "Diploma": ["Diploma in Medical Lab Technology", "Diploma in Radiology"]
  },
  "Arts & Humanities": {
    "UG": ["BA (English)", "BA (History)", "BA (Psychology)", "BA (Sociology)"],
    "PG": ["MA (English)", "MA (History)", "MA (Psychology)", "MA (Sociology)"],
    "Certificate": ["Certificate in Creative Writing", "Certificate in Journalism"]
  },
  "Commerce": {
    "UG": ["B.Com", "B.Com (Hons.)", "BBA"],
    "PG": ["M.Com", "M.Com (Hons.)"],
    "Professional": ["CA", "CS", "CMA"]
  }
};

const EXPLORE_OPTIONS = [
  "Programme Details",
  "Apply for Admission",
  "Speak with our Counsellor",
  "Go to Main Menu"
];

// Admission Wizard Component
const AdmissionWizard = ({ onSubmit, onCancel, initial = {} }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    country: initial.country || "",
    state: initial.state || "",
    city: initial.city || "",
    fullName: initial.fullName || "",
    email: initial.email || "",
    mobile: initial.mobile || "",
    gender: initial.gender || "",
    address: initial.address || "",
  });

  const countries = Object.keys(locationData).map(c => ({ value: c, label: c }));
  const states =
    form.country && locationData[form.country]
      ? Object.keys(locationData[form.country]).map(s => ({ value: s, label: s }))
      : [];
  const cities =
    form.country && form.state
      ? locationData[form.country][form.state].map(city => ({ value: city, label: city }))
      : [];

  const update = (field, value) => {
    if (field === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (field === "country") {
      setForm(f => ({ ...f, country: value, state: "", city: "" }));
    } else if (field === "state") {
      setForm(f => ({ ...f, state: value, city: "" }));
    } else {
      setForm(f => ({ ...f, [field]: value }));
    }
  };

  const next = () => setStep(s => Math.min(3, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = e => {
    e.preventDefault();
    setError("");

    const emailRegex = "";
    const mobileRegex = /^[0-9]{10}$/;

    if (!form.fullName.trim()) return setError("Full name is required");

    if (!mobileRegex.test(form.mobile)) return setError("Mobile number must be exactly 10 digits");

    onSubmit(form);
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'white',
      borderColor: state.isFocused ? 'var(--primary-blue)' : '#dee2e6',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 61, 92, 0.1)' : 'none',
      borderRadius: '8px',
      padding: '2px',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: 'var(--primary-blue)'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#2c3e50'
    }),
    input: (base) => ({
      ...base,
      color: '#2c3e50'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? 'var(--primary-blue)' : state.isFocused ? 'rgba(0, 61, 92, 0.1)' : 'white',
      color: state.isSelected ? 'white' : '#2c3e50',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    })
  };

  return (
    <div className="wizard">
      {error && (
        <div className="error-msg">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="wizard-step">
          <div className="step-header">
            <h4>📍 Location Information</h4>
            <span className="step-indicator">Step 1 of 2</span>
          </div>

          <label>Country *</label>
          <Select
            options={countries}
            value={form.country ? { value: form.country, label: form.country } : null}
            onChange={opt => update("country", opt.value)}
            placeholder="Select your country"
            styles={customSelectStyles}
          />

          <label>State *</label>
          <Select
            options={states}
            value={form.state ? { value: form.state, label: form.state } : null}
            onChange={opt => update("state", opt.value)}
            placeholder="Select your state"
            isDisabled={!form.country}
            styles={customSelectStyles}
          />

          <label>City *</label>
          <Select
            options={cities}
            value={form.city ? { value: form.city, label: form.city } : null}
            onChange={opt => update("city", opt.value)}
            placeholder="Select your city"
            isDisabled={!form.state}
            styles={customSelectStyles}
          />

          <div className="wizard-controls">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={next}
              disabled={!form.country || !form.state || !form.city}
            >
              Next Step →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-step">
          <div className="step-header">
            <h4>👤 Personal Details</h4>
            <span className="step-indicator">Step 2 of 2</span>
          </div>

          <label>Full Name *</label>
          <input
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={e => update('fullName', e.target.value)}
          />

          <label>Email Address *</label>
          <input
            type="email"
            placeholder="your.email@gmail.com"
            value={form.email}
            onChange={e => update('email', e.target.value)}
          />

          <label>Mobile Number *</label>
          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={form.mobile}
            onChange={e => update('mobile', e.target.value)}
            maxLength="10"
          />

          <label>Gender *</label>
          <select
            value={form.gender}
            onChange={e => update('gender', e.target.value)}
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <label>Address</label>
          <textarea
            placeholder="Enter your complete address"
            value={form.address}
            onChange={e => update('address', e.target.value)}
            rows="3"
          />

          <div className="wizard-controls">
            <button type="button" className="btn-secondary" onClick={prev}>
              ← Back
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!form.fullName || !form.email || !form.mobile || !form.gender}
            >
              Submit Application ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Sidebar Component
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showPostSubmit, setShowPostSubmit] = useState(false);
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [currentStep, setCurrentStep] = useState("initial");
  const [userId, setUserId] = useState(null);
  const scrollRef = useRef();
  const [displayedPresetMessages, setDisplayedPresetMessages] = useState([]);

  const presetMessages = [
    "Hello, I am EDU, your Virtual Admissions Counsellor. Let's Talk!",
    "Welcome to EDUPlus Campus. Click Below options to start the Admission Process",
    "How may I assist you?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, displayedPresetMessages]);

  useEffect(() => {
    if (open && !showPostSubmit && !showWizard) {
      setDisplayedPresetMessages([]);

      presetMessages.forEach((msg, index) => {
        setTimeout(() => {
          setDisplayedPresetMessages(prev => [
            ...prev,
            { from: "bot", text: msg }
          ]);
        }, 500 * (index + 1));
      });
    }
  }, [open, showPostSubmit, showWizard]);

  const addMessage = (text, from = "bot") => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const handleAdmissionSubmit = async (formData) => {
    setLoading(true);
    console.log("Admission Form Data", formData);

    try {
      const resp = await submitAdmission(formData);

      if (resp?.id) {
        setUserId(resp.id);
        console.log("User ID stored:", resp.id);
      }

      setShowWizard(false);
      setShowPostSubmit(true);
      setCurrentStep("fetching");

      setTimeout(() => {
        addMessage("We are fetching something exclusively for you.");
      }, 300);

      setTimeout(() => {
        addMessage("Great! Thank you for sharing your details with us.");
      }, 1500);

      setTimeout(() => {
        addMessage("Which stream are you interested in?");
        setCurrentStep("stream");
      }, 2500);

    } catch (err) {
      addMessage("Error submitting admission: " + (err?.error || err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStreamSelect = (stream) => {
    setSelectedStream(stream);
    addMessage(stream, "user");

    setTimeout(() => {
      addMessage("Which level are you interested in?");
      setCurrentStep("level");
    }, 800);
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    addMessage(level, "user");

    setTimeout(() => {
      addMessage("Which programme are you interested in?");
      setCurrentStep("programme");
    }, 800);
  };

  const handleProgrammeSelect = async (programme) => {
    setSelectedProgramme(programme);
    addMessage(programme, "user");
    setLoading(true);

    try {
      const preferenceData = {
        id: userId,
        stream: selectedStream,
        level: selectedLevel,
        programme: programme
      };

      console.log("Sending preference data:", preferenceData);

      const response = await fetch('/api/new-admission/update-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferenceData)
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      const result = await response.json();
      console.log("Preferences saved successfully:", result);

      setTimeout(() => {
        addMessage("Would you like to explore further?");
        setCurrentStep("explore");
      }, 800);

    } catch (error) {
      console.error("Error saving preferences:", error);
      addMessage("Your selection has been recorded. Would you like to explore further?");
      setTimeout(() => {
        setCurrentStep("explore");
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  const handleExploreOption = (option) => {
    addMessage(option, "user");

    setTimeout(() => {
      if (option === "Programme Details") {
        addMessage(`Here are the programme details for ${selectedProgramme}. You can find more information on our website.`);
        setTimeout(() => {
          window.open("https://www.edupluscampus.com/", "_blank", "noopener,noreferrer");
        }, 500);
      } else if (option === "Apply for Admission") {
        addMessage("Great! Please proceed with your application. Our team will guide you through the process.");
        setTimeout(() => {
          window.open("https://www.edupluscampus.com/", "_blank", "noopener,noreferrer");
        }, 500);
      } else if (option === "Speak with our Counsellor") {
        addMessage("A counsellor will connect with you shortly. Please stay on the line.");
      } else if (option === "Go to Main Menu") {
        setMessages([]);
        setShowPostSubmit(false);
        setCurrentStep("initial");
        setSelectedStream("");
        setSelectedLevel("");
        setSelectedProgramme("");
        setUserId(null);
      }
    }, 800);
  };

  const handleEnquiry = (type) => {
    if (type === 'admission') {
      setShowWizard(true);
      setMessages([]);
      setShowPostSubmit(false);
    } else {
      addMessage("Thank you for your enquiry! Our team will get back to you soon.");
    }
  };

  const getAvailableLevels = () => {
    return selectedStream ? LEVELS[selectedStream] : [];
  };

  const getAvailableProgrammes = () => {
    return selectedStream && selectedLevel ? PROGRAMMES[selectedStream][selectedLevel] : [];
  };

  return (
    <>
      <style>{`
        :root {
          --primary-blue: #003d5c;
          --primary-blue-dark: #002943;
          --orange: #F4991A;
          --orange-hover: #e08810;
          --light-gray: #f8f9fa;
          --border-gray: #dee2e6;
          --text-dark: #2c3e50;
          --success-green: #10b981;
          --error-red: #ef4444;
        }

        * {
          box-sizing: border-box;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(244, 153, 26, 0.4),
                        0 0 40px rgba(244, 153, 26, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(244, 153, 26, 0.6),
                        0 0 60px rgba(244, 153, 26, 0.3);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes typing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* AI Toggle Button */
        .ai-toggle {
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, var(--primary-blue) 0%, #004d73 100%);
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 24px rgba(244, 153, 26, 0.4);
          cursor: pointer;
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .ai-toggle:hover {
          transform: scale(1.1) translateY(-3px);
          box-shadow: 0 12px 32px rgba(244, 153, 26, 0.6),
                      0 0 60px rgba(244, 153, 26, 0.3);
        }

        .ai-toggle.open {
          transform: scale(0.95);
          animation: none;
          background: var(--orange);
        }

        .ai-icon {
          width: 40px;
          height: 40px;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
          animation: float 3s ease-in-out infinite;
        }

        /* Tooltip */
        .counsellor-tooltip {
          position: absolute;
          bottom: calc(100% + 16px);
          margin-left: -150px;
          background: linear-gradient(135deg, var(--primary-blue) 0%, #004d73 100%);
          color: white;
          padding: 10px 16px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          font-weight: 600;
          font-size: 13px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 10000;
        }

        .counsellor-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          right: 24px;
          border: 8px solid transparent;
          border-top-color: var(--primary-blue);
        }

        .ai-toggle:hover .counsellor-tooltip {
          opacity: 1;
          transform: translateY(-4px);
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          right: -420px;
          width: 420px;
          height: calc(100vh - 80px);
          top: 40px;
          background: white;
          border: 1px solid var(--border-gray);
          border-radius: 16px 0 0 16px;
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.15);
          color: var(--text-dark);
          display: flex;
          flex-direction: column;
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-gray);
          background: linear-gradient(135deg, var(--primary-blue) 0%, #004d73 100%);
          flex-shrink: 0;
        }

        .sidebar-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-header h3 {
          margin: 0;
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .header-actions .minimize {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          line-height: 1;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-actions .minimize:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        /* Chat Area */
        .chat-area {
          padding: 24px;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
          gap: 16px;
          color: #333;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .chat-area::-webkit-scrollbar {
          width: 8px;
        }

        .chat-area::-webkit-scrollbar-track {
          background: #e9ecef;
          border-radius: 10px;
        }

        .chat-area::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #adb5bd 0%, #6c757d 100%);
          border-radius: 10px;
        }

        .chat-area::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #6c757d 0%, #495057 100%);
        }

        /* Message Container */
        .message-container {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: slide-in 0.4s ease-out;
        }

        .message-container.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--orange) 0%, var(--orange-hover) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 14px;
          flex-shrink: 0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(244, 153, 26, 0.3);
        }

        .message-container.user .message-avatar {
          background: linear-gradient(135deg, var(--primary-blue) 0%, #004d73 100%);
          box-shadow: 0 4px 12px rgba(0, 61, 92, 0.3);
        }

        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .chat-bubble {
          padding: 14px 18px;
          border-radius: 16px;
          max-width: 75%;
          line-height: 1.6;
          font-size: 0.95rem;
          word-wrap: break-word;
          background: white;
          color: var(--text-dark);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          animation: fade-in 0.3s ease-out;
        }

        .message-container.user .chat-bubble {
          background: linear-gradient(135deg, var(--primary-blue) 0%, #004d73 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(0, 61, 92, 0.3);
          border: none;
        }

        /* Action Buttons */
        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0;
          margin-top: 16px;
        }

        .actions button {
          width: 100%;
          background: white;
          border: 2px solid var(--primary-blue);
          color: var(--primary-blue);
          padding: 14px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .actions button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: var(--primary-blue);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .actions button:hover::before {
          width: 300%;
          height: 300%;
        }

        .actions button:hover {
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 61, 92, 0.3);
          border-color: var(--primary-blue);
        }

        .actions button span {
          position: relative;
          z-index: 1;
        }

        .actions button.primary {
          background: linear-gradient(135deg, var(--primary-blue) 0%, #004d73 100%);
          color: white;
          border: none;
          margin-top: 8px;
          box-shadow: 0 4px 16px rgba(0, 61, 92, 0.3);
        }

        .actions button.primary:hover {
          background: linear-gradient(135deg, #002943 0%, #001f33 100%);
          box-shadow: 0 6px 24px rgba(0, 61, 92, 0.5);
          transform: translateY(-3px);
        }

        /* Option Grid */
        .option-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 12px;
        }

        .option-grid.single-col {
          grid-template-columns: 1fr;
        }

        .option-button {
          background: white;
          border: 2px solid var(--primary-blue);
          color: var(--primary-blue);
          padding: 14px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          position: relative;
          overflow: hidden;
        }

        .option-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: var(--primary-blue);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
        }

        .option-button:hover::before {
          width: 300%;
          height: 300%;
        }

        .option-button:hover {
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 61, 92, 0.3);
        }

        .option-button span {
          position: relative;
          z-index: 1;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 14px 18px;
          background: white;
          border-radius: 16px;
          width: fit-content;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: var(--primary-blue);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Wizard Styles */
        .wizard {
          padding: 0;
          background: transparent;
          animation: slide-in 0.4s ease-out;
        }

        .wizard-step {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-gray);
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--orange);
        }

        .wizard-step h4 {
          font-size: 1.15rem;
          color: var(--primary-blue);
          margin: 0;
          font-weight: 700;
        }

        .step-indicator {
          font-size: 0.85rem;
          color: #6c757d;
          background: var(--light-gray);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
        }

        .wizard-step label {
          display: block;
          margin-bottom: 8px;
          margin-top: 16px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-dark);
        }

        .wizard-step input,
        .wizard-step select,
        .wizard-step textarea {
          width: 100%;
          padding: 12px 16px;
          margin-bottom: 12px;
          border-radius: 10px;
          border: 2px solid var(--border-gray);
          background: white;
          color: var(--text-dark);
          font-size: 0.95rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .wizard-step textarea {
          resize: vertical;
          min-height: 80px;
        }

        .wizard-step input::placeholder,
        .wizard-step textarea::placeholder {
          color: #adb5bd;
        }

        .wizard-step input:focus,
        .wizard-step select:focus,
        .wizard-step textarea:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 4px rgba(0, 61, 92, 0.1);
        }

        .wizard-controls {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
        }

        .wizard-controls button {
          flex: 1;
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary-blue) 0%, #004d73 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(0, 61, 92, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #002943 0%, #001f33 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0, 61, 92, 0.4);
        }

        .btn-secondary {
          background: white;
          color: var(--primary-blue);
          border: 2px solid var(--primary-blue);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--light-gray);
          transform: translateY(-2px);
        }

        .wizard-controls button:disabled {
          background: #e9ecef;
          color: #adb5bd;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .error-msg {
          background: linear-gradient(135deg, #fee 0%, #fdd 100%);
          color: var(--error-red);
          border: 2px solid #fcc;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 16px;
          text-align: center;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          animation: bounce 0.5s ease-out;
        }

        .error-icon {
          font-size: 1.2rem;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .sidebar {
            width: 90%;
            right: -100%;
            height: 85vh;
            top: 7.5vh;
            border-radius: 16px;
          }

          .sidebar.open {
            right: 5%;
          }

          .ai-toggle {
            width: 56px;
            height: 56px;
            right: 16px;
            bottom: 16px;
          }

          .ai-icon {
            width: 34px;
            height: 34px;
          }

          .chat-bubble {
            max-width: 85%;
            font-size: 0.9rem;
          }

          .counsellor-tooltip {
            font-size: 11px;
            padding: 8px 12px;
          }

          .option-grid {
            grid-template-columns: 1fr;
          }

          .sidebar-header {
            padding: 16px 20px;
          }

          .sidebar-header h3 {
            font-size: 1.05rem;
          }

          .chat-area {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .sidebar {
            width: 95%;
            right: -100%;
          }

          .sidebar.open {
            right: 2.5%;
          }

          .chat-area {
            padding: 16px;
            gap: 12px;
          }

          .message-avatar {
            width: 36px;
            height: 36px;
          }

          .chat-bubble {
            font-size: 0.85rem;
            padding: 12px 16px;
          }

          .wizard-step {
            padding: 20px;
          }

          .actions button {
            padding: 12px 16px;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <button
        className={`ai-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle AI Counselor"
      >
        <div className="counsellor-tooltip">I'm your Virtual Counsellor!</div>
        <img src={CounsellorImage} alt="AI" className="ai-icon" />
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="sidebar-header">
          <div className="sidebar-header-left">
            <h3>EDUPLUS CAMPUS</h3>
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
          {!showPostSubmit && !showWizard && displayedPresetMessages.map((msg, i) => (
            <div key={i} className="message-container">
              <div className="message-avatar">
                <img src={Logo} alt="EDUPlus" />
              </div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}

          {messages.map((msg, i) => (
            <div key={i} className={`message-container ${msg.from}`}>
              <div className="message-avatar">
                {msg.from === "bot" ? (
                  <img src={Logo} alt="EDUPlus" />
                ) : (
                  "You"
                )}
              </div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="message-container">
              <div className="message-avatar">
                <img src={Logo} alt="EDUPlus" />
              </div>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}

          {showWizard && (
            <AdmissionWizard
              onCancel={() => setShowWizard(false)}
              onSubmit={handleAdmissionSubmit}
            />
          )}

          {!showWizard && !showPostSubmit && (
            <div className="actions">
              <button onClick={() => handleEnquiry('other')}>
                <span>Any Other Enquiry</span>
              </button>
              <button className="primary" onClick={() => handleEnquiry('admission')}>
                <span>New Admission Enquiry</span>
              </button>
            </div>
          )}

          {showPostSubmit && currentStep === "stream" && (
            <div className="option-grid">
              {STREAMS.map((stream) => (
                <button
                  key={stream}
                  className="option-button"
                  onClick={() => handleStreamSelect(stream)}
                >
                  <span>{stream}</span>
                </button>
              ))}
            </div>
          )}

          {showPostSubmit && currentStep === "level" && (
            <div className="option-grid">
              {getAvailableLevels().map((level) => (
                <button
                  key={level}
                  className="option-button"
                  onClick={() => handleLevelSelect(level)}
                >
                  <span>{level}</span>
                </button>
              ))}
            </div>
          )}

          {showPostSubmit && currentStep === "programme" && (
            <div className="option-grid single-col">
              {getAvailableProgrammes().map((programme) => (
                <button
                  key={programme}
                  className="option-button"
                  onClick={() => handleProgrammeSelect(programme)}
                >
                  <span>{programme}</span>
                </button>
              ))}
            </div>
          )}

          {showPostSubmit && currentStep === "explore" && (
            <div className="option-grid single-col">
              {EXPLORE_OPTIONS.map((option) => (
                <button
                  key={option}
                  className="option-button"
                  onClick={() => handleExploreOption(option)}
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}

          <div ref={scrollRef}></div>
        </div>
      </aside>
    </>
  );
}