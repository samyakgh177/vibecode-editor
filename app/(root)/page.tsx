import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative z-20 flex flex-col items-center justify-start min-h-screen px-4 pb-20 pt-8 max-w-6xl mx-auto">
      {/* Announcement Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Powered by Groq LPUs & WebContainers</span>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-4xl space-y-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
          Code, Run & Vibe in the Browser
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          A blazing-fast cloud IDE running full Node.js runtimes right inside Chrome.
          Featuring sub-100ms inline code completions and intelligent debugging powered by Groq.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-16">
        <Link href="/dashboard">
          <Button
            size="lg"
            className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
          >
            Launch Playground
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/auth/sign-in">
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-6 border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 font-semibold rounded-xl backdrop-blur-sm transition-all"
          >
            1-Click Recruiter Demo
          </Button>
        </Link>
      </div>

      {/* Mock IDE Window Preview */}
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl backdrop-blur-xl overflow-hidden mb-20">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-xs text-zinc-500 font-mono">App.tsx — VibeCode Editor</span>
          <div className="text-xs text-zinc-500 font-mono">Groq Llama 3.1 • 540 tok/s</div>
        </div>

        {/* Mock Code & Terminal Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 p-4 font-mono text-xs sm:text-sm">
          <div className="p-4 space-y-2 text-zinc-300">
            <p className="text-zinc-500">{"// Real-time React + TypeScript in WebContainer"}</p>
            <p>
              <span className="text-purple-400">import</span> React, &#123; useState &#125;{" "}
              <span className="text-purple-400">from</span>{" "}
              <span className="text-green-400">&quot;react&quot;</span>;
            </p>
            <p>
              <span className="text-purple-400">export default function</span>{" "}
              <span className="text-blue-400">App</span>() &#123;
            </p>
            <p className="pl-4">
              <span className="text-purple-400">const</span> [state, setState] ={" "}
              <span className="text-blue-400">useState</span>(&quot;ready&quot;);
            </p>
            <p className="pl-4 text-zinc-500">
              {"// ✨ Groq AI Suggestion (press Tab to accept)"}
            </p>
            <p className="pl-4 text-blue-400/90 bg-blue-500/10 py-1 px-2 rounded border border-blue-500/20">
              return &lt;div className=&quot;editor&quot;&gt;Hello VibeCode!&lt;/div&gt;;
            </p>
            <p>&#125;</p>
          </div>
          <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-400 space-y-1">
            <p className="text-emerald-400">✔ WebContainer booted in 180ms</p>
            <p className="text-zinc-500">$ npm run start</p>
            <p className="text-zinc-300">&gt; vite --host</p>
            <p className="text-emerald-400">
              ⚡ Local: http://localhost:5173/
            </p>
            <p className="text-zinc-500">✔ Terminal ready. Listening for edits...</p>
          </div>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Groq LPU Acceleration</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Ghost text inline completions at 500+ tokens per second powered by Groq Llama 3.1 & 3.3.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Full Browser Sandbox</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Spawn real Node.js processes, run npm install, and preview full-stack servers with WebContainers.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Multi-Framework Starters</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            One-click templates for React TypeScript, Next.js, Express, and Hono.
          </p>
        </div>
      </div>
    </div>
  );
}
