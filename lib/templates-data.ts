import type { TemplateFolder } from "@/modules/playground/lib/path-to-json";

export const STATIC_TEMPLATES: Record<string, TemplateFolder> = {
  "REACT": {
    "folderName": "Root",
    "items": [
      {
        "filename": "index",
        "fileExtension": "html",
        "content": "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>React + TypeScript</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n"
      },
      {
        "filename": "package",
        "fileExtension": "json",
        "content": "{\n  \"name\": \"react-ts-starter\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"start\": \"vite --host\",\n    \"dev\": \"vite --host\",\n    \"build\": \"tsc && vite build\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\",\n    \"lucide-react\": \"^0.344.0\"\n  },\n  \"devDependencies\": {\n    \"@types/react\": \"^18.3.3\",\n    \"@types/react-dom\": \"^18.3.0\",\n    \"@vitejs/plugin-react\": \"^4.3.1\",\n    \"typescript\": \"^5.5.3\",\n    \"vite\": \"^5.4.1\"\n  }\n}\n"
      },
      {
        "folderName": "src",
        "items": [
          {
            "filename": "App",
            "fileExtension": "tsx",
            "content": "import React, { useState } from \"react\";\nimport { Sparkles, Code2, Zap } from \"lucide-react\";\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div style={{\n      display: \"flex\",\n      flexDirection: \"column\",\n      alignItems: \"center\",\n      justifyContent: \"center\",\n      minHeight: \"100vh\",\n      padding: \"2rem\",\n      boxSizing: \"border-box\"\n    }}>\n      <div style={{\n        background: \"rgba(30, 41, 59, 0.8)\",\n        border: \"1px solid rgba(51, 65, 85, 0.8)\",\n        borderRadius: \"16px\",\n        padding: \"2.5rem\",\n        textAlign: \"center\",\n        maxWidth: \"480px\",\n        boxShadow: \"0 20px 25px -5px rgba(0, 0, 0, 0.3)\"\n      }}>\n        <div style={{ display: \"flex\", justifyContent: \"center\", gap: \"10px\", marginBottom: \"1rem\" }}>\n          <Sparkles color=\"#38bdf8\" size={28} />\n          <Code2 color=\"#a855f7\" size={28} />\n          <Zap color=\"#f59e0b\" size={28} />\n        </div>\n        <h1 style={{ margin: \"0 0 0.5rem 0\", fontSize: \"1.75rem\", fontWeight: \"700\" }}>\n          VibeCode Editor\n        </h1>\n        <p style={{ color: \"#94a3b8\", fontSize: \"0.95rem\", margin: \"0 0 1.5rem 0\" }}>\n          React + TypeScript running live in your browser powered by WebContainers & Groq AI.\n        </p>\n        <button\n          onClick={() => setCount((c) => c + 1)}\n          style={{\n            background: \"linear-gradient(to right, #3b82f6, #6366f1)\",\n            color: \"#ffffff\",\n            border: \"none\",\n            borderRadius: \"8px\",\n            padding: \"0.75rem 1.5rem\",\n            fontSize: \"1rem\",\n            fontWeight: \"600\",\n            cursor: \"pointer\",\n            transition: \"transform 0.1s ease\"\n          }}\n        >\n          Clicked {count} times\n        </button>\n      </div>\n    </div>\n  );\n}\n"
          },
          {
            "filename": "index",
            "fileExtension": "css",
            "content": "body {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n  background-color: #0b0f19;\n  color: #f8fafc;\n}\n"
          },
          {
            "filename": "main",
            "fileExtension": "tsx",
            "content": "import React from \"react\";\nimport ReactDOM from \"react-dom/client\";\nimport App from \"./App\";\nimport \"./index.css\";\n\nReactDOM.createRoot(document.getElementById(\"root\")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n"
          }
        ]
      },
      {
        "filename": "tsconfig",
        "fileExtension": "json",
        "content": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"useDefineForClassFields\": true,\n    \"lib\": [\"ES2020\", \"DOM\", \"DOM.Iterable\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n    \"moduleResolution\": \"bundler\",\n    \"resolveJsonModule\": true,\n    \"isolatedModules\": true,\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\",\n    \"strict\": true\n  },\n  \"include\": [\"src\"]\n}\n"
      },
      {
        "filename": "vite.config",
        "fileExtension": "ts",
        "content": "import { defineConfig } from \"vite\";\nimport react from \"@vitejs/plugin-react\";\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    host: true,\n    port: 5173,\n  },\n});\n"
      }
    ]
  },
  "NEXTJS": {
    "folderName": "Root",
    "items": [
      {
        "folderName": "app",
        "items": [
          {
            "filename": "layout",
            "fileExtension": "tsx",
            "content": "export const metadata = {\n  title: \"Next.js in WebContainer\",\n  description: \"Next.js running inside browser WebContainer\",\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang=\"en\">\n      <body style={{ margin: 0, background: \"#0b0f19\", color: \"#f8fafc\", fontFamily: \"sans-serif\" }}>\n        {children}\n      </body>\n    </html>\n  );\n}\n"
          },
          {
            "filename": "page",
            "fileExtension": "tsx",
            "content": "export default function HomePage() {\n  return (\n    <main style={{\n      display: \"flex\",\n      alignItems: \"center\",\n      justifyContent: \"center\",\n      minHeight: \"100vh\",\n      padding: \"2rem\"\n    }}>\n      <div style={{\n        background: \"#1e293b\",\n        border: \"1px solid #334155\",\n        borderRadius: \"14px\",\n        padding: \"2.5rem\",\n        textAlign: \"center\",\n        maxWidth: \"440px\"\n      }}>\n        <h1 style={{ margin: \"0 0 1rem 0\" }}>▲ Next.js App Router</h1>\n        <p style={{ color: \"#94a3b8\" }}>\n          Next.js running entirely inside WebContainers in your browser!\n        </p>\n      </div>\n    </main>\n  );\n}\n"
          }
        ]
      },
      {
        "filename": "package",
        "fileExtension": "json",
        "content": "{\n  \"name\": \"nextjs-starter\",\n  \"version\": \"0.1.0\",\n  \"private\": true,\n  \"scripts\": {\n    \"start\": \"next dev\",\n    \"dev\": \"next dev\",\n    \"build\": \"next build\"\n  },\n  \"dependencies\": {\n    \"next\": \"14.2.5\",\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\"\n  }\n}\n"
      }
    ]
  },
  "EXPRESS": {
    "folderName": "Root",
    "items": [
      {
        "filename": "index",
        "fileExtension": "js",
        "content": "import express from \"express\";\nimport cors from \"cors\";\n\nconst app = express();\nconst port = process.env.PORT || 3000;\n\napp.use(cors());\napp.use(express.json());\n\napp.get(\"/\", (req, res) => {\n  res.send(`\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>VibeCode Express</title>\n        <style>\n          body {\n            font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n            background: #0b0f19;\n            color: #f8fafc;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            height: 90vh;\n            margin: 0;\n          }\n          .card {\n            background: #1e293b;\n            padding: 2.5rem;\n            border-radius: 14px;\n            border: 1px solid #334155;\n            text-align: center;\n            max-width: 440px;\n            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);\n          }\n          h1 { margin-top: 0; font-size: 1.6rem; color: #38bdf8; }\n          p { color: #94a3b8; font-size: 0.95rem; }\n          code { background: #0f172a; padding: 4px 8px; border-radius: 4px; color: #f43f5e; font-family: monospace; }\n        </style>\n      </head>\n      <body>\n        <div class=\"card\">\n          <h1>🚀 Express Server Running</h1>\n          <p>Powered by <strong>WebContainers</strong> inside your browser!</p>\n          <p>Test the JSON API at: <code>GET /api/status</code></p>\n        </div>\n      </body>\n    </html>\n  `);\n});\n\napp.get(\"/api/status\", (req, res) => {\n  res.json({\n    status: \"online\",\n    message: \"Express backend running inside browser WebContainer!\",\n    runtime: \"Node.js (WebContainer)\",\n    timestamp: new Date().toISOString(),\n  });\n});\n\napp.listen(port, () => {\n  console.log(`Express server listening at http://localhost:${port}`);\n});\n"
      },
      {
        "filename": "package",
        "fileExtension": "json",
        "content": "{\n  \"name\": \"express-starter\",\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"start\": \"node index.js\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.19.2\",\n    \"cors\": \"^2.8.5\"\n  }\n}\n"
      }
    ]
  },
  "HONO": {
    "folderName": "Root",
    "items": [
      {
        "filename": "index",
        "fileExtension": "js",
        "content": "import { Hono } from \"hono\";\nimport { serve } from \"@hono/node-server\";\n\nconst app = new Hono();\n\napp.get(\"/\", (c) => {\n  return c.html(`\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>VibeCode Hono</title>\n        <style>\n          body {\n            font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n            background: #0b0f19;\n            color: #f8fafc;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            height: 90vh;\n            margin: 0;\n          }\n          .card {\n            background: #1e293b;\n            padding: 2.5rem;\n            border-radius: 14px;\n            border: 1px solid #334155;\n            text-align: center;\n            max-width: 440px;\n          }\n          h1 { margin-top: 0; color: #f97316; }\n          p { color: #94a3b8; }\n        </style>\n      </head>\n      <body>\n        <div class=\"card\">\n          <h1>🔥 Hono Web Framework</h1>\n          <p>Ultra-fast server running in your browser via WebContainers!</p>\n        </div>\n      </body>\n    </html>\n  `);\n});\n\nconst port = 3000;\nconsole.log(`Hono server running at http://localhost:${port}`);\nserve({ fetch: app.fetch, port });\n"
      },
      {
        "filename": "package",
        "fileExtension": "json",
        "content": "{\n  \"name\": \"hono-starter\",\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"start\": \"node index.js\"\n  },\n  \"dependencies\": {\n    \"hono\": \"^4.5.8\",\n    \"@hono/node-server\": \"^1.12.0\"\n  }\n}\n"
      }
    ]
  }
};
