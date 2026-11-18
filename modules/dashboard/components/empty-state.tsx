import React from "react";
import { FolderCode, Sparkles } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 w-full max-w-2xl mx-auto my-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 shadow-sm">
        <FolderCode className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-100">No playgrounds found</h3>
      <p className="text-sm text-zinc-400 max-w-sm mt-1 mb-6">
        Choose a starter template above to spin up your first in-browser coding sandbox with Groq AI assistance.
      </p>
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        Supports React, Next.js, Express, and Hono runtimes
      </div>
    </div>
  );
};

export default EmptyState;
