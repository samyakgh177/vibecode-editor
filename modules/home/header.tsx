import Link from "next/link";
import Image from "next/image";
import UserButton from "../auth/components/user-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LayoutDashboard, Sparkles, Github } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/logo.svg"
                alt="VibeCode Logo"
                height={34}
                width={34}
                className="rounded-lg shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                VibeCode
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-400 border border-indigo-500/20">
                IDE
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/#starters"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Starters
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </nav>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Open Editor
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
