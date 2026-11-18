import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>VibeCode Express</title>
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
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
          }
          h1 { margin-top: 0; font-size: 1.6rem; color: #38bdf8; }
          p { color: #94a3b8; font-size: 0.95rem; }
          code { background: #0f172a; padding: 4px 8px; border-radius: 4px; color: #f43f5e; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 Express Server Running</h1>
          <p>Powered by <strong>WebContainers</strong> inside your browser!</p>
          <p>Test the JSON API at: <code>GET /api/status</code></p>
        </div>
      </body>
    </html>
  `);
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    message: "Express backend running inside browser WebContainer!",
    runtime: "Node.js (WebContainer)",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
