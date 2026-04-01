import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faPaperclip,
  faRobot,
  faHistory,
  faLightbulb,
  faPlus,
  faTrash,
  faXmark,
  faUser,
  faCodeBranch
} from '@fortawesome/free-solid-svg-icons';

const STORAGE_KEY = 'portfolio_ai_chat_sessions_v2';
const API_URL = '/api/chat';

const suggestedQuestions = [
  'Tell me about your React Native projects',
  'What experience do you have with .NET and Oracle?',
  'Which Android apps have you built with Java or Kotlin?',
  'Explain the PlaySpot booking system project',
  'How do you integrate Firebase into mobile apps?',
  'What services do you offer for business portals?',
  'Show me projects that involve AI or machine learning',
  'What is your hiring process and availability?'
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
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatMessageContent = (content) => {
  const safeContent = escapeHtml(content || '');
  return safeContent
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
};

const normalizeErrorMessage = (value, fallback = 'Please try again.') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value?.message === 'string') return value.message;
  if (typeof value?.error === 'string') return value.error;
  if (typeof value?.error?.message === 'string') return value.error.message;

  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};

const generateFallbackReply = (input) => {
  const question = (input || '').toLowerCase();

  if (question.includes('firebase')) {
    return `Ahsan integrates Firebase in mobile apps for features like authentication, real-time data, storage, and scalable backend workflows. In the portfolio, Firebase is part of projects like **Crypto Market Analysis App** and **JobConnect**, where it supports modern React Native app functionality.`;
  }

  if (question.includes('react native')) {
    return `Ahsan has strong React Native experience across multiple projects, including **Crypto Market Analysis App**, **MoodTunes**, **PlaySpot**, and **JobConnect**. He builds cross-platform apps with React Native, Expo where needed, REST API integrations, Firebase, and production-focused UI flows.`;
  }

  if (question.includes('.net') || question.includes('asp.net') || question.includes('oracle')) {
    return `Ahsan also works on **ASP.NET / .NET MVC systems** and **Oracle-connected enterprise workflows**. At **NRSP Microfinance Bank**, he contributes to mobile initiatives, backend integrations, ASP.NET systems, and Oracle-linked business application features.`;
  }

  if (question.includes('android') || question.includes('java') || question.includes('kotlin')) {
    return `Ahsan builds native Android apps with **Java** and **Kotlin**. Portfolio examples include **Crypto Market App** with Java, **Urdu Audio/Video to Text Converter** with Java and FFmpeg, and **News Reader App** with Kotlin, Jetpack Compose, and MVVM.`;
  }

  if (question.includes('playspot')) {
    return `**PlaySpot** is a full booking platform with React Native apps for Players and Owners plus a React.js Admin Panel. It includes Google Maps venue search, instant booking, payment proof uploads, complaint handling, and owner/admin verification workflows.`;
  }

  if (
    question.includes('fee management') ||
    question.includes('college') ||
    question.includes('university') ||
    question.includes('challan')
  ) {
    return `Ahsan built a **Fee Management System** in both **React.js + Firebase** and **ASP.NET / .NET MVC**. It includes student search and admission, fee and advance challan generation with printing, payment and collections tracking, defaulter and clearance reports, expenses management, and role-based access for **Admin** and **Accountant** users.`;
  }

  if (question.includes('project') || question.includes('portfolio')) {
    return `Featured portfolio work includes **Crypto Market Analysis App**, **MoodTunes**, **PlaySpot**, **Fee Management System** in both **React.js** and **.NET MVC**, **DreamWeaver**, **Crypto Price Predictor API**, **News Reader App**, and **Urdu Audio/Video to Text Converter**. The work spans Android, React Native, React.js, Firebase, AI/ML, .NET, and Oracle-connected business systems.`;
  }

  if (question.includes('hire') || question.includes('contact') || question.includes('availability')) {
    return `Ahsan is available for projects and remote work. For hiring or project discussions, the portfolio directs visitors to **WhatsApp: +92 321 3486272** or **email: ahsam72642@gmail.com**.`;
  }

  return `Ahsan is a **Mobile & Software Developer** with experience in **Android, React Native, React.js, ASP.NET/.NET MVC, Oracle-connected workflows, Firebase, REST APIs, and AI/ML integrations**. Ask about a project, technology, or hiring and I can answer from the portfolio details.`;
};

const createSession = () => {
  const id = Date.now().toString();
  return {
    id,
    title: 'New Chat',
    preview: 'Ask about projects, Android, React Native, .NET, or Oracle.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: []
  };
};

const PortfolioAIChat = ({ inNavbar = false, expanded = false }) => {
  const [theme, setTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(expanded);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setTheme(root.getAttribute('data-theme') || 'dark');
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsOpen(expanded);
  }, [expanded]);

  useEffect(() => {
    try {
      const rawSessions = localStorage.getItem(STORAGE_KEY);
      if (rawSessions) {
        const parsed = JSON.parse(rawSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load portfolio chat sessions:', error);
    }

    const initialSession = createSession();
    setChatSessions([initialSession]);
    setCurrentSessionId(initialSession.id);
  }, []);

  useEffect(() => {
    if (!chatSessions.length) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions));
  }, [chatSessions]);

  const currentSession = useMemo(
    () => chatSessions.find((session) => session.id === currentSessionId) || null,
    [chatSessions, currentSessionId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession, isTyping, isOpen]);

  const updateCurrentSession = (updater) => {
    setChatSessions((previousSessions) =>
      previousSessions.map((session) => {
        if (session.id !== currentSessionId) return session;
        return updater(session);
      })
    );
  };

  const createNewChat = () => {
    const session = createSession();
    setChatSessions((previous) => [session, ...previous]);
    setCurrentSessionId(session.id);
    setMessageInput('');
    setPendingImage(null);
    setShowHistory(false);
    setShowSuggestions(false);
    setIsOpen(true);
  };

  const clearAllChats = () => {
    const session = createSession();
    setChatSessions([session]);
    setCurrentSessionId(session.id);
    setMessageInput('');
    setPendingImage(null);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage({
        name: file.name,
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const buildApiMessages = (messages) =>
    [
      { role: 'system', content: portfolioKnowledge },
      ...messages.map((message) => {
        if (message.role === 'user' && message.image?.dataUrl) {
          return {
            role: 'user',
            content: [
              { type: 'text', text: message.content || 'Please analyze this image in the context of my portfolio.' },
              { type: 'image_url', image_url: { url: message.image.dataUrl } }
            ]
          };
        }

        return {
          role: message.role,
          content: message.content
        };
      })
    ];

  const sendMessage = async (presetQuestion) => {
    if (!currentSession) return;

    const text = (presetQuestion ?? messageInput).trim();
    if ((!text && !pendingImage) || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text || 'Please analyze this image and relate it to my portfolio expertise.',
      image: pendingImage,
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...currentSession.messages, userMessage];

    updateCurrentSession((session) => ({
      ...session,
      messages: nextMessages,
      updatedAt: new Date().toISOString(),
      title: session.title === 'New Chat' && text ? text.slice(0, 34) : session.title,
      preview: text || pendingImage?.name || session.preview
    }));

    setMessageInput('');
    setPendingImage(null);
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          max_tokens: 1024,
          messages: buildApiMessages(nextMessages)
        })
      });

      if (!response.ok) {
        let errorMessage = `API Error ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = normalizeErrorMessage(errorData, errorMessage);
        } catch {
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      const aiContent = data?.choices?.[0]?.message?.content?.trim() || 'No response received.';

      updateCurrentSession((session) => {
        const updatedMessages = [
          ...session.messages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: aiContent,
            timestamp: new Date().toISOString()
          }
        ];

        return {
          ...session,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
          preview: aiContent.slice(0, 64)
        };
      });
    } catch (error) {
      console.error('Portfolio AI error:', error);
      const fallbackReply = `${generateFallbackReply(text)}\n\nConnection note: ${normalizeErrorMessage(error, 'Unable to reach the AI service.')}`;

      updateCurrentSession((session) => {
        const updatedMessages = [
          ...session.messages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: fallbackReply,
            timestamp: new Date().toISOString()
          }
        ];

        return {
          ...session,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
          preview: 'Connection issue while fetching AI response.'
        };
      });
    } finally {
      setIsTyping(false);
    }
  };

  const currentMessages = currentSession?.messages || [];
  const palette =
    theme === 'dark'
      ? {
          bg: 'var(--slate-950)',
          panel: 'rgba(15, 23, 42, 0.96)',
          sidebar: 'rgba(2, 6, 23, 0.92)',
          surface: 'rgba(30, 41, 59, 0.88)',
          bot: 'rgba(15, 23, 42, 0.88)',
          user: 'linear-gradient(135deg, var(--indigo-500), var(--purple-500))',
          text: 'var(--slate-100)',
          muted: 'var(--slate-400)',
          border: 'rgba(255, 255, 255, 0.10)',
          accent: 'var(--indigo-400)',
          accentSoft: 'rgba(99, 102, 241, 0.16)'
        }
      : {
          bg: 'var(--slate-950)',
          panel: 'rgba(255, 255, 255, 0.96)',
          sidebar: 'rgba(248, 250, 252, 0.95)',
          surface: 'rgba(241, 245, 249, 0.96)',
          bot: 'rgba(248, 250, 252, 0.95)',
          user: 'linear-gradient(135deg, var(--indigo-500), var(--purple-500))',
          text: 'var(--slate-100)',
          muted: 'var(--slate-500)',
          border: 'rgba(15, 23, 42, 0.10)',
          accent: 'var(--indigo-500)',
          accentSoft: 'rgba(99, 102, 241, 0.10)'
        };

  return (
    <>
      <style>{`
        .portfolio-ai-shell * { box-sizing: border-box; }
        .portfolio-ai-shell button,
        .portfolio-ai-shell input,
        .portfolio-ai-shell textarea {
          font: inherit;
        }
        .portfolio-ai-shell {
          position: ${expanded ? 'relative' : inNavbar ? 'relative' : 'fixed'};
          right: ${expanded ? 'auto' : inNavbar ? 'auto' : '16px'};
          bottom: ${expanded ? 'auto' : inNavbar ? 'auto' : '16px'};
          left: ${expanded ? 'auto' : 'unset'};
          z-index: ${expanded ? '1' : '9999'};
          color: ${palette.text};
          max-width: ${expanded ? '100%' : inNavbar ? 'none' : 'calc(100vw - 16px)'};
          width: ${expanded ? '100%' : 'auto'};
          min-width: 0;
        }
        .portfolio-ai-window {
          width: ${expanded ? '100%' : 'clamp(340px, 58vw, 720px)'};
          max-width: ${expanded ? '100%' : 'calc(100vw - 24px)'};
          height: ${expanded ? 'min(78vh, 920px)' : 'min(540px, calc(100vh - 28px))'};
          max-height: ${expanded ? 'calc(100vh - 140px)' : 'calc(100vh - 28px)'};
          min-height: ${expanded ? '680px' : 'auto'};
          margin-bottom: ${expanded ? '0' : '10px'};
          border-radius: ${expanded ? '28px' : '20px'};
          overflow: hidden;
          border: 1px solid ${palette.border};
          background:
            radial-gradient(circle at top right, ${palette.accentSoft}, transparent 30%),
            linear-gradient(180deg, ${palette.panel}, ${palette.bg});
          box-shadow: ${expanded ? '0 26px 60px rgba(0, 0, 0, 0.24)' : '0 18px 48px rgba(0, 0, 0, 0.32)'};
          display: grid;
          grid-template-columns: ${expanded ? '260px minmax(0, 1fr)' : '210px minmax(0, 1fr)'};
          align-items: stretch;
          ${expanded ? '' : inNavbar ? 'position: absolute; top: calc(100% + 12px); right: 0;' : ''}
        }
        .portfolio-ai-sidebar {
          background: ${palette.sidebar};
          border-right: 1px solid ${palette.border};
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
        }
        .portfolio-ai-brand {
          padding: 14px;
          border-bottom: 1px solid ${palette.border};
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .portfolio-ai-brand-icon,
        .portfolio-ai-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--indigo-500), var(--purple-500), var(--fuchsia-500));
          color: white;
          flex-shrink: 0;
        }
        .portfolio-ai-actions,
        .portfolio-ai-sidebar-footer {
          padding: 12px 14px;
          border-bottom: 1px solid ${palette.border};
        }
        .portfolio-ai-sidebar-footer {
          border-bottom: 0;
          border-top: 1px solid ${palette.border};
          margin-top: auto;
        }
        .portfolio-ai-btn,
        .portfolio-ai-outline-btn {
          border-radius: 12px;
          padding: 9px 12px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .portfolio-ai-btn {
          border: 0;
          background: linear-gradient(135deg, var(--indigo-500), var(--purple-500), var(--fuchsia-500));
          color: white;
          font-weight: 700;
          box-shadow: 0 14px 34px rgba(99, 102, 241, 0.28);
        }
        .portfolio-ai-btn:hover,
        .portfolio-ai-outline-btn:hover,
        .portfolio-ai-launcher:hover {
          transform: translateY(-2px);
        }
        .portfolio-ai-outline-btn {
          border: 1px solid ${palette.border};
          background: transparent;
          color: ${palette.text};
          font-weight: 600;
        }
        .portfolio-ai-history {
          padding: 10px;
          overflow-y: auto;
          overflow-x: hidden;
          display: grid;
          gap: 8px;
          min-height: 0;
        }
        .portfolio-ai-history-item {
          width: 100%;
          text-align: left;
          border: 1px solid ${palette.border};
          background: ${palette.surface};
          color: ${palette.text};
          border-radius: 14px;
          padding: 10px;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .portfolio-ai-history-item.active,
        .portfolio-ai-history-item:hover {
          transform: translateX(3px);
          border-color: ${palette.accent};
          background: ${palette.accentSoft};
        }
        .portfolio-ai-main {
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
          min-height: 0;
          overflow: hidden;
        }
        .portfolio-ai-header {
          padding: ${expanded ? '18px 22px' : '14px 16px'};
          border-bottom: 1px solid ${palette.border};
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
        }
        .portfolio-ai-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .portfolio-ai-chat {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: ${expanded ? '20px 22px' : '14px'};
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
          min-height: 0;
          scroll-behavior: smooth;
        }
        .portfolio-ai-message {
          max-width: min(76%, 460px);
          display: flex;
          gap: 10px;
          animation: portfolioAiRise 0.25s ease;
          flex-shrink: 0;
        }
        .portfolio-ai-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .portfolio-ai-bubble {
          border-radius: 18px;
          padding: 12px 14px;
          border: 1px solid ${palette.border};
          line-height: 1.6;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
        }
        .portfolio-ai-message.assistant .portfolio-ai-bubble {
          background: ${palette.bot};
        }
        .portfolio-ai-message.user .portfolio-ai-bubble {
          background: ${palette.user};
          color: #ffffff;
          border-color: transparent;
        }
        .portfolio-ai-hero-card {
          border: 1px solid ${palette.border};
          background: linear-gradient(135deg, ${palette.surface}, ${palette.bot});
          border-radius: 18px;
          padding: 14px;
          display: grid;
          gap: 12px;
        }
        .portfolio-ai-pill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .portfolio-ai-pill {
          border: 1px solid ${palette.border};
          border-radius: 999px;
          background: transparent;
          color: ${palette.text};
          padding: 7px 10px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .portfolio-ai-pill:hover {
          transform: translateY(-2px);
          border-color: ${palette.accent};
          background: ${palette.accentSoft};
        }
        .portfolio-ai-input-wrap {
          padding: ${expanded ? '16px 22px 22px' : '12px 14px 14px'};
          border-top: 1px solid ${palette.border};
          display: grid;
          gap: 10px;
          background: rgba(255, 255, 255, 0.02);
          min-width: 0;
          flex-shrink: 0;
        }
        .portfolio-ai-textarea-wrap {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 40px auto;
          gap: 8px;
          align-items: end;
          min-width: 0;
        }
        .portfolio-ai-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid ${palette.border};
          background: ${palette.surface};
          color: ${palette.text};
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .portfolio-ai-textarea {
          width: 100%;
          min-width: 0;
          min-height: 40px;
          max-height: 110px;
          resize: none;
          border-radius: 12px;
          border: 1px solid ${palette.border};
          background: ${palette.surface};
          color: ${palette.text};
          padding: 10px 12px;
          outline: none;
        }
        .portfolio-ai-launcher {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          border: 1px solid ${palette.border};
          background: linear-gradient(135deg, var(--indigo-500), var(--purple-500), var(--fuchsia-500));
          color: white;
          box-shadow: 0 18px 38px rgba(99, 102, 241, 0.32);
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          cursor: pointer;
          font-weight: 800;
          ${inNavbar ? 'width: auto; min-width: 0; height: 46px; border-radius: 14px; padding: 0 14px; flex-direction: row; gap: 8px; box-shadow: 0 12px 28px rgba(99, 102, 241, 0.24);' : ''}
        }
        .portfolio-ai-section {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          min-width: 0;
        }
        .portfolio-ai-muted {
          color: ${palette.muted};
        }
        .portfolio-ai-image-preview {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid ${palette.border};
          background: ${palette.surface};
          border-radius: 12px;
          padding: 8px;
          max-width: 100%;
        }
        .portfolio-ai-image-preview img,
        .portfolio-ai-bubble img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid ${palette.border};
        }
        .portfolio-ai-typing {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .portfolio-ai-typing span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: ${palette.muted};
          animation: portfolioAiTyping 1.2s infinite ease-in-out;
        }
        .portfolio-ai-typing span:nth-child(2) { animation-delay: 0.15s; }
        .portfolio-ai-typing span:nth-child(3) { animation-delay: 0.3s; }
        .portfolio-ai-mobile-toggle {
          display: none;
        }
        @keyframes portfolioAiTyping {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes portfolioAiRise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .portfolio-ai-window {
            grid-template-columns: 1fr;
            position: relative;
            width: ${expanded ? '100%' : 'min(100vw - 24px, 720px)'};
            min-height: ${expanded ? '620px' : 'auto'};
          }
          .portfolio-ai-sidebar {
            position: absolute;
            inset: 0 auto 0 0;
            width: min(300px, 85vw);
            z-index: 2;
            transform: translateX(${showHistory ? '0' : '-105%'});
            transition: transform 0.25s ease;
            box-shadow: 18px 0 40px rgba(0, 0, 0, 0.22);
          }
          .portfolio-ai-mobile-toggle {
            display: inline-flex;
          }
        }
        @media (max-width: 1280px) {
          .portfolio-ai-window {
            width: ${expanded ? '100%' : 'min(680px, calc(100vw - 20px))'};
            height: ${expanded ? 'min(78vh, 860px)' : 'min(520px, calc(100vh - 24px))'};
            max-height: ${expanded ? 'calc(100vh - 120px)' : 'calc(100vh - 24px)'};
            grid-template-columns: ${expanded ? '240px minmax(0, 1fr)' : '200px minmax(0, 1fr)'};
          }
          .portfolio-ai-header {
            padding: 12px 14px;
          }
          .portfolio-ai-chat {
            padding: 12px;
          }
          .portfolio-ai-input-wrap {
            padding: 10px 12px 12px;
          }
          .portfolio-ai-message {
            max-width: min(80%, 420px);
          }
        }
        @media (max-width: 1100px) {
          .portfolio-ai-window {
            grid-template-columns: 1fr;
            width: ${expanded ? '100%' : 'min(620px, calc(100vw - 20px))'};
          }
          .portfolio-ai-sidebar {
            position: absolute;
            inset: 0 auto 0 0;
            width: min(280px, 82vw);
            z-index: 2;
            transform: translateX(${showHistory ? '0' : '-105%'});
            transition: transform 0.25s ease;
            box-shadow: 18px 0 40px rgba(0, 0, 0, 0.22);
          }
          .portfolio-ai-mobile-toggle {
            display: inline-flex;
          }
        }
        @media (max-width: 640px) {
          .portfolio-ai-shell {
            right: ${expanded ? 'auto' : inNavbar ? 'auto' : '8px'};
            bottom: ${expanded ? 'auto' : inNavbar ? 'auto' : '8px'};
            left: ${expanded ? 'auto' : inNavbar ? 'auto' : '8px'};
          }
          .portfolio-ai-window {
            width: ${expanded ? '100%' : inNavbar ? 'min(100vw - 16px, 420px)' : '100%'};
            height: ${expanded ? 'min(82vh, 760px)' : 'min(100dvh - 16px, 720px)'};
            max-height: ${expanded ? 'calc(100vh - 96px)' : 'calc(100dvh - 16px)'};
            min-height: ${expanded ? '560px' : 'auto'};
            border-radius: ${expanded ? '22px' : '18px'};
            margin-bottom: 8px;
            ${expanded ? '' : inNavbar ? 'right: 0; left: auto;' : ''}
          }
          .portfolio-ai-header {
            padding: 12px;
          }
          .portfolio-ai-chat {
            padding: 12px;
          }
          .portfolio-ai-input-wrap {
            padding: 10px;
          }
          .portfolio-ai-message {
            max-width: 92%;
          }
          .portfolio-ai-textarea-wrap {
            grid-template-columns: 40px minmax(0, 1fr) 40px;
          }
          .portfolio-ai-icon-btn,
          .portfolio-ai-btn {
            min-height: 40px;
          }
          .portfolio-ai-send-label {
            display: none;
          }
        }
      `}</style>
      <div className={`portfolio-ai-shell ${expanded ? 'portfolio-ai-section' : ''}`}>
        {isOpen && (
          <div className="portfolio-ai-window">
            <aside className="portfolio-ai-sidebar">
              <div className="portfolio-ai-brand">
                <div className="portfolio-ai-brand-icon">
                  <FontAwesomeIcon icon={faRobot} />
                </div>
                <div>
                  <div style={{ fontWeight: 800 }}>Portfolio AI Assistant</div>
                  <div className="portfolio-ai-muted" style={{ fontSize: 12 }}>
                    Mobile apps, React Native, .NET, Oracle
                  </div>
                </div>
              </div>

              <div className="portfolio-ai-actions">
                <button type="button" className="portfolio-ai-btn" style={{ width: '100%' }} onClick={createNewChat}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                  New Chat
                </button>
              </div>

              <div className="portfolio-ai-history">
                <div className="portfolio-ai-muted" style={{ fontSize: 13, fontWeight: 700 }}>
                  Chat History
                </div>
                {chatSessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className={`portfolio-ai-history-item ${session.id === currentSessionId ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentSessionId(session.id);
                      setShowHistory(false);
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{session.title || 'New Chat'}</div>
                    <div className="portfolio-ai-muted" style={{ fontSize: 12 }}>
                      {session.preview || 'Portfolio and hiring questions'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="portfolio-ai-sidebar-footer">
                <button type="button" className="portfolio-ai-outline-btn" style={{ width: '100%' }} onClick={clearAllChats}>
                  <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8 }} />
                  Clear All
                </button>
              </div>
            </aside>

            <section className="portfolio-ai-main">
              <div className="portfolio-ai-header">
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>Ask About My Work</div>
                  <div className="portfolio-ai-muted" style={{ fontSize: 13 }}>
                    Projects, Android, React Native, ASP.NET, Oracle workflows, hiring
                  </div>
                </div>

                <div className="portfolio-ai-header-actions">
                  <button
                    type="button"
                    className="portfolio-ai-icon-btn portfolio-ai-mobile-toggle"
                    onClick={() => setShowHistory((previous) => !previous)}
                    aria-label="Toggle chat history"
                  >
                    <FontAwesomeIcon icon={faHistory} />
                  </button>
                  <button
                    type="button"
                    className="portfolio-ai-icon-btn"
                    onClick={() => setShowSuggestions((previous) => !previous)}
                    aria-label="Toggle suggestions"
                  >
                    <FontAwesomeIcon icon={faLightbulb} />
                  </button>
                  <button
                    type="button"
                    className="portfolio-ai-icon-btn"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                    style={{ display: expanded ? 'none' : undefined }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </div>

              <div className="portfolio-ai-chat">
                {currentMessages.length === 0 && (
                  <div className="portfolio-ai-hero-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="portfolio-ai-brand-icon">
                        <FontAwesomeIcon icon={faCodeBranch} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 20 }}>Portfolio AI is ready</div>
                        <div className="portfolio-ai-muted">
                          Ask about mobile app development, .NET portals, Oracle-connected workflows, project details, or hiring.
                        </div>
                      </div>
                    </div>

                    <div className="portfolio-ai-pill-grid">
                      {suggestedQuestions.slice(0, 6).map((question) => (
                        <button key={question} type="button" className="portfolio-ai-pill" onClick={() => sendMessage(question)}>
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showSuggestions && (
                  <div className="portfolio-ai-hero-card">
                    <div style={{ fontWeight: 800 }}>Suggested Questions</div>
                    <div className="portfolio-ai-pill-grid">
                      {suggestedQuestions.map((question) => (
                        <button key={question} type="button" className="portfolio-ai-pill" onClick={() => sendMessage(question)}>
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentMessages.map((message) => (
                  <div key={message.id} className={`portfolio-ai-message ${message.role === 'user' ? 'user' : 'assistant'}`}>
                    <div className="portfolio-ai-avatar">
                      <FontAwesomeIcon icon={message.role === 'user' ? faUser : faRobot} />
                    </div>
                    <div>
                      <div className="portfolio-ai-bubble">
                        {message.image?.dataUrl && (
                          <div style={{ marginBottom: message.content ? 10 : 0 }}>
                            <img src={message.image.dataUrl} alt={message.image.name || 'Upload'} />
                          </div>
                        )}
                        {message.content && (
                          <div dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} />
                        )}
                      </div>
                      <div className="portfolio-ai-muted" style={{ fontSize: 11, marginTop: 6 }}>
                        {new Date(message.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="portfolio-ai-message assistant">
                    <div className="portfolio-ai-avatar">
                      <FontAwesomeIcon icon={faRobot} />
                    </div>
                    <div className="portfolio-ai-bubble">
                      <div className="portfolio-ai-typing" aria-label="Assistant is typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="portfolio-ai-input-wrap">
                {pendingImage && (
                  <div className="portfolio-ai-image-preview">
                    <img src={pendingImage.dataUrl} alt={pendingImage.name} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{pendingImage.name}</div>
                      <div className="portfolio-ai-muted" style={{ fontSize: 12 }}>
                        This image will be sent with your next message.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="portfolio-ai-icon-btn"
                      onClick={() => setPendingImage(null)}
                      aria-label="Remove selected image"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                )}

                <div className="portfolio-ai-textarea-wrap">
                  <button
                    type="button"
                    className="portfolio-ai-icon-btn"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach image"
                  >
                    <FontAwesomeIcon icon={faPaperclip} />
                  </button>

                  <textarea
                    className="portfolio-ai-textarea"
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask about projects, Android, React Native, .NET, Oracle, or hiring..."
                  />

                  <button
                    type="button"
                    className="portfolio-ai-icon-btn"
                    onClick={() => setShowSuggestions((previous) => !previous)}
                    aria-label="Show suggestions"
                  >
                    <FontAwesomeIcon icon={faLightbulb} />
                  </button>

                  <button
                    type="button"
                    className="portfolio-ai-btn"
                    onClick={() => sendMessage()}
                    disabled={isTyping || (!messageInput.trim() && !pendingImage)}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: 8 }} />
                    <span className="portfolio-ai-send-label">Send</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageSelect}
                />

                <div className="portfolio-ai-muted" style={{ fontSize: 12 }}>
                  The assistant is grounded in your portfolio, mobile app development, React Native, ASP.NET, Oracle workflows, and featured projects.
                </div>
              </div>
            </section>
          </div>
        )}

        {!expanded && (
          <button
            type="button"
            className="portfolio-ai-launcher"
            onClick={() => setIsOpen((previous) => !previous)}
            aria-label="Toggle Portfolio AI chat"
            title="Portfolio AI Assistant"
          >
            <FontAwesomeIcon icon={faRobot} style={{ fontSize: inNavbar ? 18 : 24 }} />
            <div style={{ fontSize: inNavbar ? 14 : 12 }}>AI Chat</div>
          </button>
        )}
      </div>
    </>
  );
};

export default PortfolioAIChat;
