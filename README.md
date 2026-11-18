# ⚡ VibeCode Editor – AI-Powered In-Browser IDE

![VibeCode Editor Thumbnail](public/vibe-code-editor-thumbnaail.svg)

**VibeCode Editor** is a blazing-fast, AI-native web development environment running entirely in the browser. Powered by **Next.js 15 (Turbopack)**, **WebContainers**, **Monaco Editor**, and ultra-low-latency **Groq LPUs** (Language Processing Units). 

Edit, build, run, and debug full-stack Node.js and React applications with live terminal execution and a context-aware AI assistant — zero local setup required.

---

## ✨ Key Features

- ⚡ **Ultra-Fast Groq AI Inference** – Powered by GroqCloud LPUs delivering 500+ tokens/second with `openai/gpt-oss-120b` (deep coding & reasoning) and `qwen/qwen3.8-27b` (rapid inline completions).
- 💬 **Context-Aware Unified AI Assistant** – Direct 1-click access from the top toolbar or via `⌘L` / `Ctrl+L`. The assistant automatically receives your currently active file context.
- 🎯 **One-Click Code Actions** – Apply refactored code directly to your open file or insert snippets at your exact editor cursor position.
- 💡 **On-Demand Inline Autocomplete** – Smart code suggestions triggered on `Ctrl + Space` or `Cmd + \`. Accept with `Tab`, dismiss with `Esc`.
- ⚙️ **In-Browser WebContainers** – Run full Node.js runtimes, `npm install`, and development servers completely client-side in secure WebContainer sandboxes.
- 💻 **Interactive Embedded Terminal** – Full xterm.js terminal with ANSI color support, search, clear, and process management.
- 🧱 **Instant Project Starters** – Ready-to-code templates for **React (Vite + TypeScript)**, **Next.js App Router**, **Express Node.js**, and **Hono**.
- 🗂️ **Full File Explorer** – Create, rename, delete, and organize files and folders with auto-saving and dirty-state tracking.
- 🔐 **Flexible Authentication** – GitHub OAuth integration plus a **1-Click Recruiter/Guest Demo Mode** for immediate testing without credentials.
- 🎨 **Modern Dark Aesthetic** – Sleek, minimalist developer interface built with Tailwind CSS, Radix UI, and Shadcn UI.

---

## 🧱 Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) | Server Components, dynamic client-side loading |
| **Runtime** | WebContainers (@webcontainer/api) | Client-side micro-OS running Node.js in browser |
| **Code Editor** | Monaco Editor (@monaco-editor/react) | VS Code-powered editor with syntax highlighting |
| **AI Inference** | Groq API (OpenAI-compatible) | LPU hardware acceleration (`gpt-oss-120b`, `qwen-27b`) |
| **Terminal** | xterm.js (Fit, WebLinks, Search) | Full pseudo-terminal emulator |
| **Styling** | Tailwind CSS + Shadcn UI | Responsive, custom dark theme |
| **Auth** | NextAuth.js v5 | GitHub OAuth & 1-Click Guest Session |
| **Database** | MongoDB (Prisma / Mongoose) | Project persistence and user playground state |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or newer
- **npm** or **pnpm**
- **Groq API Key**: Free API key from [GroqCloud Console](https://console.groq.com)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/vibecode-editor.git
cd vibecode-editor
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory:

```env
# Groq API Configuration
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_CHAT_MODEL=openai/gpt-oss-120b
GROQ_CODE_MODEL=qwen/qwen3.8-27b

# NextAuth Configuration
AUTH_SECRET=your_generated_auth_secret_here
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (Optional for guest login)
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

# Database
DATABASE_URL=your_mongodb_connection_string
```

> **Tip:** You can generate an `AUTH_SECRET` by running:
> ```bash
> npx auth secret
> ```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Scope |
|---|---|---|
| `⌘L` or `Ctrl+L` | Open / Close AI Assistant Panel | Global Playground |
| `Ctrl+Space` | Trigger Inline AI Code Suggestion | Monaco Editor |
| `Cmd+\` / `Ctrl+\` | Trigger Inline AI Code Suggestion | Monaco Editor |
| `Tab` | Accept Code Suggestion | Monaco Editor |
| `Esc` | Dismiss Code Suggestion | Monaco Editor |
| `⌘S` or `Ctrl+S` | Save Active File | Monaco Editor |
| `⌘⇧S` or `Ctrl+Shift+S` | Save All Open Files | Monaco Editor |
| `⌘↵` or `Ctrl+Enter` | Send Message to AI Assistant | AI Chat Input |

---

## 📁 Project Structure

```
vibecode-editor/
├── app/
│   ├── (root)/                 # Landing page & feature showcases
│   ├── api/
│   │   ├── auth/               # NextAuth authentication endpoints
│   │   ├── chat/               # AI Assistant conversation endpoint (Groq)
│   │   ├── code-completion/    # Inline code completion endpoint (Groq)
│   │   └── template/[id]/      # Starter project loader
│   ├── auth/sign-in/           # GitHub & 1-Click Guest sign-in page
│   ├── dashboard/              # Project list, starter grid, and management
│   └── playground/[id]/        # Main IDE workspace (Editor, Preview, AI)
├── components/ui/              # Shadcn UI primitives (Buttons, Dialogs, etc.)
├── lib/
│   ├── groq.ts                 # Groq LPU client, token management & fallbacks
│   └── utils.ts                # Tailwind utility helpers
├── modules/
│   ├── ai-chat/                # AI Assistant side panel & markdown renderers
│   ├── dashboard/              # Dashboard templates, project cards & repo mod
│   ├── playground/             # Monaco editor, file tree & suggestion hooks
│   └── webcontainers/          # WebContainer runner, iframe preview & terminal
├── public/                     # Brand icons, logo.svg, and starter assets
└── vibecode-starters/          # Starter project boilerplates (React, Next, Express, Hono)
```

---

## 🛡️ Production Build

To test and produce an optimized production bundle:

```bash
npm run build
npm run start
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
