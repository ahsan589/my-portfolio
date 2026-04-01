# Fixed React JSX Warning + AI Chat Navbar

✅ JSX warning fixed in Portfolio.jsx (`jsx="true"`).

**New Task: Add AI Chat to Navbar**
- Widget renders static button only (no chat UI yet).
- Steps:
  1. Add `showAIChat` state + toggle in Portfolio.jsx
  2. Add "AI Chat" nav link: `<a href="#ai-chat" onClick={toggleAIChat}>AI Assistant</a>`
  3. Render `<PortfolioAIChat expanded={showAIChat} />` conditionally large/fullscreen.

Current: Ready to edit Portfolio.jsx navbar + state.
