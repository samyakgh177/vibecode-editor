import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>VibeCode Hono</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #0b0f19;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 90vh;
            margin: 0;
          }
          .card {
            background: #1e293b;
            padding: 2.5rem;
            border-radius: 14px;
            border: 1px solid #334155;
            text-align: center;
            max-width: 440px;
          }
          h1 { margin-top: 0; color: #f97316; }
          p { color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🔥 Hono Web Framework</h1>
          <p>Ultra-fast server running in your browser via WebContainers!</p>
        </div>
      </body>
    </html>
  `);
});

const port = 3000;
console.log(`Hono server running at http://localhost:${port}`);
serve({ fetch: app.fetch, port });
