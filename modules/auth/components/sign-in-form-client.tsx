import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Sparkles, UserCheck } from "lucide-react";
import { signIn } from "@/auth";

async function handleGithubSignIn() {
  "use server";
  await signIn("github", { redirectTo: "/dashboard" });
}

async function handleRecruiterSignIn() {
  "use server";
  await signIn("recruiter-login", { redirectTo: "/dashboard" });
}

const SignInFormClient = () => {
  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-md">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">
          Welcome to VibeCode
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Sign in to access your cloud playgrounds and AI features
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* GitHub Sign In */}
        <form action={handleGithubSignIn}>
          <Button
            type="submit"
            className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-medium transition-all"
          >
            <Github className="mr-2 h-4 w-4" />
            <span>Continue with GitHub</span>
          </Button>
        </form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-3 text-zinc-500 font-semibold tracking-wider">
              Or Instant Demo
            </span>
          </div>
        </div>

        {/* 1-Click Recruiter / Demo Login */}
        <form action={handleRecruiterSignIn}>
          <Button
            type="submit"
            variant="default"
            className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 border-0 transition-all hover:scale-[1.01]"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            <span>1-Click Recruiter / Guest Demo</span>
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-center text-zinc-500 w-full leading-relaxed">
          Recruiter demo logs in instantly with full workspace access — no personal credentials required.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInFormClient;
