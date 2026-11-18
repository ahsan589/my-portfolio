// src/components/PortfolioAIChat.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faPaperclip,
  faPlus,
  faTrash,
  faXmark,
  faClockRotateLeft,
  faCopy,
  faCheck,
  faHouse,
  faSun,
  faMoon,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

const STORAGE_KEY = "portfolio_ai_chat_sessions_v2";
const API_URL = "/api/chat";

const suggestedQuestions = [
  "Tell me about your React Native projects",
  "What experience do you have with .NET and Oracle?",
  "Which Android apps have you built?",
  "Explain the PlaySpot booking system",
  "How do you integrate Firebase?",
  "What is your hiring availability?",
];

const portfolioKnowledge = `
You are Ahsan Hajvari's portfolio AI assistant. Answer as a professional assistant for his portfolio.

Response rules:
- If the user asks about Ahsan's experience, projects, services, skills, hiring, or availability, answer from the portfolio information below.
- If the user asks general technical questions related to mobile app development, Android, React Native, React.js, ASP.NET/.NET MVC, Oracle workflows, Firebase, REST APIs, Java, Kotlin, JavaScript, TypeScript, Jetpack Compose, MVVM, AI/ML, Flask, TensorFlow, Keras, or software development best practices, you may answer with helpful industry guidance.
- When answering general technical questions, keep the response practical, clear, and professional.
- When relevant, connect the answer back to Ahsan's real experience and projects.
- If the user asks something outside both the portfolio scope and those technical areas, briefly say the assistant is mainly focused on Ahsan's portfolio and related software topics.

Owner:
- Name: Ahsan Hajvari
- Role: Mobile & Software Developer
- Location: Pakistan
- Availability: Available for projects, remote ready
- Contact: WhatsApp +92 321 3486272
- Email: ahsam72642@gmail.com
- GitHub: https://github.com/ahsan589

Core skills:
- Android app development
- React Native development
- React.js frontend work
- ASP.NET / .NET MVC web portals
- Oracle-connected enterprise workflows
- Firebase integration
- REST API integration
- Java, Kotlin, JavaScript, TypeScript
- Jetpack Compose and MVVM
- AI/ML integrations using Flask, TensorFlow, Keras, LSTM

Professional experience:
- Mobile Application Developer Intern at THE NIXUS Pvt Ltd (NASTP), Jun 10 2025 to Oct 10 2025, Rawalpindi
- Software Developer (Contract) at NRSP Microfinance Bank, Dec 2025 to present, Islamabad
- At NRSP he works on mobile app development initiatives, ASP.NET systems, backend integrations, Oracle-connected workflows, and enterprise application features.

Services:
- Android App Development with Java, Kotlin, API integration, Firebase integration
- React Native Development for iOS and Android, Expo, custom app features, performance-focused development
- Web Portal Development using ASP.NET MVC, role-based workflows, CRUD modules, and enterprise business portals

Projects:
- Crypto Market Analysis App: React Native, TypeScript, Firebase, REST APIs, AI/ML, real-time crypto data, newsfeed, watchlist, communities, videos, demo trading, AI-based price predictions.
- MoodTunes App: React Native, OpenCV, Deezer API, AI/ML, JavaScript, emotion detection and mood-based song recommendations.
- Crypto Market App: Native Android app with Java, REST APIs, Android Studio, Material Design.
- Crypto Price Predictor API: Flask, TensorFlow, Keras, Pandas, LSTM, CoinGecko API, predictions and risk scores.
- Urdu Audio/Video to Text Converter: Android app with Java, speech recognition, FFmpeg.
- News Reader App: Android app with Kotlin, Jetpack Compose, MVVM, REST APIs.
- DreamWeaver: React app with JavaScript, Chart.js, CSS, local storage, dream tracking and analysis.
- PlaySpot: React Native apps for players and owners plus React admin panel, Google Maps, booking, payment proof uploads, complaint workflows, owner and admin verification.
- Fee Management System: Built in both React.js and ASP.NET / .NET MVC versions. College/university fee management platform with student search, admission and editing, fee and advance challan generation with printing, payments and daily/monthly collections, defaulter and clearance reports, expenses management, and role-based access control for Admin and Accountant.
- Fee Management System React version: React.js + Firebase (Firestore + Auth). GitHub: https://github.com/ahsan589/UniversityFeeManagmentSystem
- Fee Management System .NET version: ASP.NET / .NET MVC implementation. GitHub: https://github.com/ahsan589/studentfeemanagmentsystem
- JobConnect: in-progress React Native + Expo app with JavaScript, Firebase, REST APIs.

Behavior:
- Be confident, concise, and helpful.
- Connect answers to specific projects and services above.
- You can also answer broader software and programming questions related to the technologies listed above.
- For hiring questions, suggest contacting by WhatsApp or email.
- If asked for unavailable details such as undisclosed pricing, say the portfolio does not specify it.
`;

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatMessageContent = (content) => {
  const safe = escapeHtml(content || "");
  return safe
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
};

const normalizeErrorMessage = (value, fallback = "Please try again.") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value?.message === "string") return value.message;
  if (typeof value?.error === "string") return value.error;
  if (typeof value?.error?.message === "string") return value.error.message;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};

const generateFallbackReply = (input) => {
  const q = (input || "").toLowerCase();
  if (q.includes("firebase"))
    return `Ahsan integrates Firebase in mobile apps for authentication, real-time data, storage, and scalable backends. Used in **Crypto Market Analysis App** and **JobConnect**.`;
  if (q.includes("react native"))
    return `Ahsan has strong React Native experience across **Crypto Market Analysis App**, **MoodTunes**, **PlaySpot**, and **JobConnect**: cross-platform apps with Expo, REST APIs, and Firebase.`;
  if (q.includes(".net") || q.includes("asp.net") || q.includes("oracle"))
    return `Ahsan works on **ASP.NET / .NET MVC** and **Oracle-connected enterprise workflows**. At **NRSP Microfinance Bank** he builds mobile initiatives, backend integrations, and Oracle-linked features.`;
  if (q.includes("android") || q.includes("java") || q.includes("kotlin"))
    return `Ahsan builds native Android apps with **Java** and **Kotlin**. Examples: **Crypto Market App**, **Urdu Audio/Video to Text Converter**, and **News Reader App** (Jetpack Compose + MVVM).`;
  if (q.includes("playspot"))
    return `**PlaySpot** is a booking platform with React Native apps for Players and Owners plus a React.js Admin Panel, with Google Maps, booking, payment proofs, and verification workflows.`;
  if (q.includes("fee management") || q.includes("college") || q.includes("university") || q.includes("challan"))
    return `Ahsan built a **Fee Management System** in both **React.js + Firebase** and **ASP.NET / .NET MVC**: student management, challans, payments, reports, and role-based access.`;
  if (q.includes("project") || q.includes("portfolio"))
    return `Featured work includes **Crypto Market Analysis App**, **MoodTunes**, **PlaySpot**, **Fee Management System**, **DreamWeaver**, **Crypto Price Predictor API**, and **News Reader App**.`;
  if (q.includes("hire") || q.includes("contact") || q.includes("availability"))
    return `Ahsan is available for projects and remote work. Contact **WhatsApp: +92 321 3486272** or **email: ahsam72642@gmail.com**.`;
  return `Ahsan is a **Mobile & Software Developer** focused on **Android, React Native, React.js, ASP.NET/.NET MVC, Oracle, Firebase, REST APIs, and AI/ML**. Ask about a project, technology, or hiring.`;
};

const createSession = () => ({
  id: Date.now().toString(),
  title: "New chat",
  preview: "Ask about projects, skills, or hiring",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [],
});

const PortfolioAIChat = ({
  inNavbar = false,
  expanded = false,
  fullPage = false, // kept for API compatibility
  openSignal = 0,
}) => {
  const [isOpen, setIsOpen] = useState(expanded);
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  );
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => setIsOpen(expanded), [expanded]);

  useEffect(() => {
    if (openSignal > 0 && !expanded) {
      setIsOpen(true);
      setShowHistory(false);
    }
  }, [openSignal, expanded]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const s = createSession();
    setChatSessions([s]);
    setCurrentSessionId(s.id);
  }, []);

  useEffect(() => {
    if (!chatSessions.length) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions));
    } catch {
      try {
        const slim = chatSessions.map((s) => ({
          ...s,
          messages: s.messages.map(({ image, ...m }) => m),
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
      } catch {}
    }
  }, [chatSessions]);

  const currentSession = useMemo(
    () => chatSessions.find((s) => s.id === currentSessionId) || null,
    [chatSessions, currentSessionId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [currentSession, isTyping, isOpen]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  }, [messageInput]);

  const updateCurrentSession = (updater) =>
    setChatSessions((prev) => prev.map((s) => (s.id === currentSessionId ? updater(s) : s)));

  const createNewChat = () => {
    const s = createSession();
    setChatSessions((prev) => [s, ...prev]);
    setCurrentSessionId(s.id);
    setMessageInput("");
    setPendingImage(null);
    setShowHistory(false);
    setIsOpen(true);
  };

  const clearAllChats = () => {
    const s = createSession();
    setChatSessions([s]);
    setCurrentSessionId(s.id);
    setMessageInput("");
    setPendingImage(null);
    setShowHistory(false);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const copyMessage = async (m) => {
    try {
      await navigator.clipboard.writeText(m.content);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch {}
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const buildApiMessages = (messages) => [
    { role: "system", content: portfolioKnowledge },
    ...messages.map((m) => {
      if (m.role === "user" && m.image?.dataUrl) {
        return {
          role: "user",
          content: [
            { type: "text", text: m.content || "Please analyze this image in the context of my portfolio." },
            { type: "image_url", image_url: { url: m.image.dataUrl } },
          ],
        };
      }
      return { role: m.role, content: m.content };
    }),
  ];

  const sendMessage = async (preset) => {
    if (!currentSession) return;
    const text = (preset ?? messageInput).trim();
    if ((!text && !pendingImage) || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text || "Please analyze this image and relate it to my portfolio expertise.",
      image: pendingImage,
      timestamp: new Date().toISOString(),
    };
    const nextMessages = [...currentSession.messages, userMessage];

    updateCurrentSession((s) => ({
      ...s,
      messages: nextMessages,
      updatedAt: new Date().toISOString(),
      title: s.title === "New chat" && text ? text.slice(0, 42) : s.title,
      preview: text || pendingImage?.name || s.preview,
    }));

    setMessageInput("");
    setPendingImage(null);
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openrouter/auto",
          max_tokens: 1024,
          messages: buildApiMessages(nextMessages),
        }),
      });

      if (!response.ok) {
        let errorMessage = `API Error ${response.status}`;
        try {
          errorMessage = normalizeErrorMessage(await response.json(), errorMessage);
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const aiContent = data?.choices?.[0]?.message?.content?.trim() || "No response received.";

      updateCurrentSession((s) => ({
        ...s,
        messages: [
          ...s.messages,
          { id: Date.now() + 1, role: "assistant", content: aiContent, timestamp: new Date().toISOString() },
        ],
        updatedAt: new Date().toISOString(),
        preview: aiContent.slice(0, 64),
      }));
    } catch (error) {
      console.error("Portfolio AI error:", error);
      const fallback = `${generateFallbackReply(text)}\n\n*Connection note: ${normalizeErrorMessage(
        error,
        "Unable to reach the AI service."
      )}*`;
      updateCurrentSession((s) => ({
        ...s,
        messages: [
          ...s.messages,
          { id: Date.now() + 1, role: "assistant", content: fallback, timestamp: new Date().toISOString() },
        ],
        updatedAt: new Date().toISOString(),
        preview: "Connection issue",
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const currentMessages = currentSession?.messages || [];
  const isEmpty = currentMessages.length === 0 && !isTyping;

  const rootClass = [
    "gk",
    expanded ? "is-expanded" : inNavbar ? "is-navbar" : "is-floating",
    showHistory ? "history-open" : "",
    isEmpty ? "is-empty" : "",
  ]
    .filter(Boolean)
    .join(" ");

  /* One composer, rendered either centered (empty chat) or docked at the bottom */
  const composer = (
    <div className="gk-composer">
      {pendingImage && (
        <div className="gk-pending">
          <img src={pendingImage.dataUrl} alt={pendingImage.name} />
          <span className="gk-pending-name">{pendingImage.name}</span>
          <button type="button" className="gk-ico-btn" onClick={() => setPendingImage(null)} aria-label="Remove attachment">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
      <div className="gk-box">
        <textarea
          ref={textareaRef}
          className="gk-textarea"
          aria-label="Message"
          rows={1}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="What do you want to know?"
        />
        <div className="gk-bar">
          <button type="button" className="gk-ico-btn round" onClick={() => fileInputRef.current?.click()} aria-label="Attach image">
            <FontAwesomeIcon icon={faPaperclip} />
          </button>
          <button type="button" className="gk-pill" onClick={() => setMessageInput("Tell me about your projects")}>
            Projects
          </button>
          <button type="button" className="gk-pill" onClick={() => setMessageInput("What is your hiring availability?")}>
            Hiring
          </button>
          <button
            type="button"
            className="gk-send"
            onClick={() => sendMessage()}
            disabled={isTyping || (!messageInput.trim() && !pendingImage)}
            aria-label="Send message"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
    </div>
  );

  return (
    <>
      <style>{`
        .gk {
          --c-bg: var(--bg, #0b0d12);
          --c-solid: var(--solid, #12151c);
          --c-surface: var(--surface, #181c25);
          --c-line: var(--line, #262b37);
          --c-fg: var(--fg, #eceff5);
          --c-muted: var(--muted, #8a93a6);
          --c-accent: var(--accent, #eceff5);
          --c-on: var(--on, #0b0d12);
          color: var(--c-fg);
          font-family: "Inter", system-ui, sans-serif;
        }
        .gk *, .gk *::before, .gk *::after { box-sizing: border-box; }
        .gk button, .gk textarea { font: inherit; }
        .gk button:focus-visible, .gk textarea:focus-visible { outline: 2px solid var(--c-muted); outline-offset: 2px; }

        /* Placement */
        .gk.is-floating { position: fixed; right: 16px; bottom: 16px; z-index: 9999; }
        .gk.is-navbar { position: relative; z-index: 9999; }
        .gk.is-expanded { position: relative; width: 100%; height: 100%; flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; }

        /* Window: slim rail + main */
        .gk-window {
          position: relative; width: min(960px, calc(100vw - 24px)); height: min(680px, calc(100dvh - 96px));
          display: grid; grid-template-columns: 64px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr);
          overflow: hidden; background: var(--c-bg); border: 1px solid var(--c-line); border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,.4); margin-bottom: 12px;
        }
        .gk.is-navbar .gk-window { position: absolute; top: calc(100% + 12px); right: 0; margin: 0; }
        .gk.is-expanded .gk-window { width: 100%; height: auto; flex: 1 1 0; min-height: 0; margin: 0; border: 0; border-radius: 0; box-shadow: none; }

        /* Rail */
        .gk-rail { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 0; border-right: 1px solid var(--c-line); background: var(--c-bg); z-index: 5; }
        .gk-logo { width: 36px; height: 36px; border-radius: 50%; background: var(--c-accent); color: var(--c-on); display: grid; place-items: center; font-weight: 800; font-size: .74rem; margin-bottom: 10px; }
        .gk-rail-sp { flex: 1; }
        .gk-ico-btn { width: 40px; height: 40px; border-radius: 12px; border: 0; background: transparent; color: var(--c-muted); display: grid; place-items: center; cursor: pointer; flex-shrink: 0; text-decoration: none; transition: background .15s, color .15s; }
        .gk-ico-btn:hover, .gk-ico-btn.on { background: var(--c-surface); color: var(--c-fg); }
        .gk-ico-btn.round { border-radius: 50%; border: 1px solid var(--c-line); width: 36px; height: 36px; }

        /* History panel slides out from the rail */
        .gk-panel { position: absolute; top: 0; bottom: 0; left: 64px; width: min(300px, calc(100% - 64px)); z-index: 4; display: flex; flex-direction: column;
          background: var(--c-solid); border-right: 1px solid var(--c-line); transform: translateX(-110%); transition: transform .24s cubic-bezier(.2,.8,.2,1); }
        .gk.history-open .gk-panel { transform: translateX(0); box-shadow: 16px 0 40px rgba(0,0,0,.3); }
        .gk-panel-head { padding: 18px 18px 10px; font-weight: 700; font-size: .95rem; }
        .gk-list { flex: 1 1 0; min-height: 0; overflow-y: auto; padding: 0 10px 12px; display: flex; flex-direction: column; gap: 2px; }
        .gk-session { width: 100%; text-align: left; border: 0; background: transparent; color: var(--c-fg); border-radius: 12px; padding: 10px 12px; cursor: pointer; transition: background .12s; }
        .gk-session:hover, .gk-session.active { background: var(--c-surface); }
        .gk-session-t, .gk-session-p { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .gk-session-t { font-weight: 600; font-size: .88rem; }
        .gk-session-p { font-size: 12.5px; color: var(--c-muted); margin-top: 2px; }
        .gk-panel-foot { padding: 12px 14px 16px; border-top: 1px solid var(--c-line); }
        .gk-clear { width: 100%; height: 40px; border: 1px solid var(--c-line); background: transparent; color: var(--c-muted); border-radius: 12px; font-weight: 600; font-size: .86rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background .15s, color .15s; }
        .gk-clear:hover { background: var(--c-surface); color: var(--c-fg); }
        .gk-scrim { display: none; }
        .gk.history-open .gk-scrim { display: block; position: absolute; inset: 0 0 0 64px; z-index: 3; background: rgba(0,0,0,.35); border: 0; padding: 0; cursor: pointer; }

        /* Main */
        .gk-main { position: relative; display: flex; flex-direction: column; min-width: 0; min-height: 0; overflow: hidden; }
        .gk-top { position: absolute; top: 12px; right: 14px; z-index: 2; display: flex; gap: 8px; }
        .gk-chip { border: 1px solid var(--c-line); border-radius: 999px; padding: 5px 13px; font-size: .8rem; color: var(--c-muted); background: var(--c-bg); }

        .gk-scroll { flex: 1 1 0; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
        .gk-thread { width: 100%; max-width: 760px; margin: 0 auto; padding: 56px 24px 12px; display: flex; flex-direction: column; gap: 26px; }

        .gk-msg { animation: gkIn .22s ease; }
        .gk-msg.user { align-self: flex-end; max-width: 82%; }
        .gk-msg.user .gk-bubble { background: var(--c-surface); border: 1px solid var(--c-line); padding: 11px 18px; border-radius: 22px 22px 6px 22px; }
        .gk-msg.assistant { align-self: stretch; }
        .gk-bubble { line-height: 1.7; font-size: .97rem; overflow-wrap: anywhere; }
        .gk-bubble img { max-width: min(240px, 100%); border-radius: 14px; display: block; margin-bottom: 8px; }
        .gk-bubble code { background: var(--c-surface); padding: 2px 6px; border-radius: 6px; font-size: .88em; }
        .gk-actions { display: flex; gap: 2px; margin-top: 6px; }
        .gk-actions .gk-ico-btn { width: 32px; height: 32px; border-radius: 9px; font-size: .8rem; }

        .gk-typing { display: flex; gap: 5px; padding: 8px 0; }
        .gk-typing span { width: 8px; height: 8px; border-radius: 50%; background: var(--c-muted); animation: gkDot 1.2s infinite ease-in-out; }
        .gk-typing span:nth-child(2) { animation-delay: .15s; }
        .gk-typing span:nth-child(3) { animation-delay: .3s; }

        /* Composer */
        .gk-dock { flex: 0 0 auto; padding: 8px 20px calc(14px + env(safe-area-inset-bottom, 0px)); }
        .gk-composer { width: 100%; max-width: 760px; margin: 0 auto; }
        .gk-box { background: var(--c-solid); border: 1px solid var(--c-line); border-radius: 26px; padding: 10px 12px 10px 16px; transition: border-color .15s; }
        .gk-box:focus-within { border-color: var(--c-muted); }
        .gk-textarea { width: 100%; min-height: 40px; max-height: 160px; resize: none; border: 0; outline: 0; background: transparent; color: var(--c-fg); font-size: 16px; line-height: 24px; padding: 6px 2px; display: block; }
        .gk-textarea::placeholder { color: var(--c-muted); }
        .gk-bar { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .gk-pill { border: 1px solid var(--c-line); background: transparent; color: var(--c-muted); border-radius: 999px; padding: 6px 14px; font-size: .82rem; cursor: pointer; transition: background .15s, color .15s; }
        .gk-pill:hover { background: var(--c-surface); color: var(--c-fg); }
        .gk-send { margin-left: auto; width: 38px; height: 38px; border-radius: 50%; border: 0; background: var(--c-accent); color: var(--c-on); display: grid; place-items: center; cursor: pointer; transition: opacity .15s, transform .15s; }
        .gk-send:disabled { opacity: .3; cursor: not-allowed; }
        .gk-send:not(:disabled):hover { transform: scale(1.06); }
        .gk-pending { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding: 6px 8px 6px 6px; border: 1px solid var(--c-line); border-radius: 16px; background: var(--c-solid); }
        .gk-pending img { width: 40px; height: 40px; object-fit: cover; border-radius: 10px; }
        .gk-pending-name { flex: 1; min-width: 0; font-size: .85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .gk-foot { text-align: center; font-size: 12px; color: var(--c-muted); margin-top: 10px; }

        /* Empty state: wordmark + centered composer + chips (Grok-style) */
        .gk-hero { margin: auto; width: 100%; max-width: 720px; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; gap: 26px; }
        .gk-word { text-align: center; font-size: clamp(2.6rem, 7vw, 4.2rem); font-weight: 800; letter-spacing: -.05em; line-height: 1; }
        .gk-word small { display: block; margin-top: 10px; font-size: .95rem; font-weight: 400; letter-spacing: 0; color: var(--c-muted); }
        .gk-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .gk-chips button { border: 1px solid var(--c-line); background: transparent; color: var(--c-muted); border-radius: 999px; padding: 8px 15px; font-size: .84rem; cursor: pointer; transition: background .15s, color .15s, border-color .15s; }
        .gk-chips button:hover { background: var(--c-surface); color: var(--c-fg); border-color: var(--c-muted); }

        /* Launcher */
        .gk-launcher { margin-left: auto; width: 58px; height: 58px; border-radius: 16px; border: 1px solid var(--c-line); background: var(--c-accent); color: var(--c-on); box-shadow: 0 12px 28px rgba(0,0,0,.3); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; font-weight: 700; font-size: 11px; transition: transform .15s; }
        .gk-launcher:hover { transform: translateY(-2px); }
        .gk.is-navbar .gk-launcher { width: auto; height: 40px; border-radius: 12px; padding: 0 14px; flex-direction: row; gap: 8px; font-size: 13px; box-shadow: none; }

        @keyframes gkIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes gkDot { 0%, 80%, 100% { transform: translateY(0); opacity: .4; } 40% { transform: translateY(-4px); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .gk *, .gk *::before, .gk *::after { animation: none !important; transition: none !important; } }

        @media (max-height: 640px) {
          .gk-hero { gap: 16px; padding: 12px 16px; }
          .gk-word { font-size: 2.2rem; }
          .gk-word small, .gk-foot { display: none; }
        }
        @media (max-width: 600px) {
          .gk.is-floating { left: 8px; right: 8px; bottom: 8px; }
          .gk.is-floating .gk-window { width: 100%; height: calc(100dvh - 84px); border-radius: 16px; }
          .gk-window { grid-template-columns: 52px minmax(0, 1fr); }
          .gk-panel { left: 52px; }
          .gk.history-open .gk-scrim { inset: 0 0 0 52px; }
          .gk-thread { padding: 52px 16px 8px; }
          .gk-dock { padding-left: 12px; padding-right: 12px; }
          .gk-chip { display: none; }
        }
      `}</style>

      <div className={rootClass}>
        {isOpen && (
          <div className="gk-window">
            <nav className="gk-rail" aria-label="Chat navigation">
              <div className="gk-logo">AH</div>
              <button type="button" className="gk-ico-btn" onClick={createNewChat} aria-label="New chat" title="New chat">
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                type="button"
                className={`gk-ico-btn ${showHistory ? "on" : ""}`}
                onClick={() => setShowHistory((v) => !v)}
                aria-label="Chat history"
                title="History"
              >
                <FontAwesomeIcon icon={faClockRotateLeft} />
              </button>
              <div className="gk-rail-sp" />
              {expanded && (
                <>
                  <button type="button" className="gk-ico-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
                    <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
                  </button>
                  <a href="#/" className="gk-ico-btn" aria-label="Back to portfolio" title="Back to portfolio">
                    <FontAwesomeIcon icon={faHouse} />
                  </a>
                </>
              )}
              {!expanded && (
                <button type="button" className="gk-ico-btn" onClick={() => setIsOpen(false)} aria-label="Close chat" title="Close">
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </nav>

            <aside className="gk-panel" aria-label="Chat history" aria-hidden={!showHistory}>
              <div className="gk-panel-head">History</div>
              <div className="gk-list">
                {chatSessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`gk-session ${s.id === currentSessionId ? "active" : ""}`}
                    onClick={() => {
                      setCurrentSessionId(s.id);
                      setShowHistory(false);
                    }}
                  >
                    <div className="gk-session-t">{s.title || "New chat"}</div>
                    <div className="gk-session-p">{s.preview || "Portfolio questions"}</div>
                  </button>
                ))}
              </div>
              <div className="gk-panel-foot">
                <button type="button" className="gk-clear" onClick={clearAllChats}>
                  <FontAwesomeIcon icon={faTrash} /> Clear all
                </button>
              </div>
            </aside>
            <button type="button" className="gk-scrim" aria-label="Close history" onClick={() => setShowHistory(false)} />

            <section className="gk-main">
              <div className="gk-top">
                <span className="gk-chip">Portfolio grounded</span>
              </div>

              {isEmpty ? (
                <div className="gk-scroll">
                  <div className="gk-hero">
                    <h1 className="gk-word">
                      Ahsan AI
                      <small>Ask anything about my work</small>
                    </h1>
                    {composer}
                    <div className="gk-chips">
                      {suggestedQuestions.map((q) => (
                        <button key={q} type="button" onClick={() => sendMessage(q)}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="gk-scroll">
                    <div className="gk-thread">
                      {currentMessages.map((m) => (
                        <div key={m.id} className={`gk-msg ${m.role === "user" ? "user" : "assistant"}`}>
                          <div className="gk-bubble">
                            {m.image?.dataUrl && <img src={m.image.dataUrl} alt={m.image.name || "Upload"} />}
                            {m.content && (
                              <div dangerouslySetInnerHTML={{ __html: formatMessageContent(m.content) }} />
                            )}
                          </div>
                          {m.role === "assistant" && (
                            <div className="gk-actions">
                              <button type="button" className="gk-ico-btn" onClick={() => copyMessage(m)} aria-label="Copy reply" title="Copy">
                                <FontAwesomeIcon icon={copiedId === m.id ? faCheck : faCopy} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="gk-msg assistant">
                          <div className="gk-typing" aria-label="Thinking">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  <div className="gk-dock">
                    {composer}
                    <div className="gk-foot">Grounded in Ahsan’s real portfolio data</div>
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {!expanded && (
          <button type="button" className="gk-launcher" onClick={() => setIsOpen((v) => !v)} aria-label="Toggle AI chat">
            <FontAwesomeIcon icon={faRobot} style={{ fontSize: inNavbar ? 15 : 20 }} />
            {inNavbar ? "AI Chat" : "AI"}
          </button>
        )}
      </div>
    </>
  );
};

export default PortfolioAIChat;