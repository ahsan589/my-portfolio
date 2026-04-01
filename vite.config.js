import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    root: ".",
    base: "/",
    server: {
      proxy: {
        "/api/chat": {
          target: "https://openrouter.ai",
          changeOrigin: true,
          rewrite: () => "/api/v1/chat/completions",
          headers: {
            Authorization: env.OPENROUTER_API_KEY ? `Bearer ${env.OPENROUTER_API_KEY}` : "",
            "HTTP-Referer": env.OPENROUTER_SITE_URL || "http://localhost:5173",
            "X-Title": env.OPENROUTER_SITE_NAME || "Portfolio AI Chat"
          },
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.removeHeader("cookie");
              proxyReq.removeHeader("authorization");

              if (env.OPENROUTER_API_KEY) {
                proxyReq.setHeader("Authorization", `Bearer ${env.OPENROUTER_API_KEY}`);
              }
            });
          }
        }
      }
    }
  };
});
