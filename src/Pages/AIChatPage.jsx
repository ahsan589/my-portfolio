// src/Pages/AIChatPage.jsx
import React, { useEffect } from "react";
import PortfolioAIChat from "../components/PortfolioAIChat.jsx";

function AIChatPage() {
  // Keep the page in sync with the portfolio theme (dark/light).
  useEffect(() => {
    const apply = () => {
      const theme = localStorage.getItem("theme") || "dark";
      document.documentElement.setAttribute("data-theme", theme);
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("storage", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", apply);
    };
  }, []);

  // The home and theme buttons now live in the chat's left rail.
  return (
    <div className="ai-page">
      <PortfolioAIChat expanded fullPage />

      <style jsx="true">{`
        .ai-page {
          position: fixed;
          inset: 0;
          height: 100vh;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          color: var(--fg);
          font-family: "Inter", system-ui, sans-serif;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default AIChatPage;