// src/App.jsx
import React, { useEffect, useState } from "react";
import Portfolio from "./Pages/Portfolio.jsx";
import AIChatPage from "./Pages/AIChatPage.jsx";

function App() {
  const [route, setRoute] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  if (route.startsWith("#/ai-chat")) return <AIChatPage />;
  return <Portfolio />;
}

export default App;
