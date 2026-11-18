import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      id: "recruiter-login",
      name: "Recruiter Demo",
      credentials: {},
      async authorize() {
        return {
          id: "demo-recruiter-id",
          name: "Recruiter Demo",
          email: "recruiter@vibecode.dev",
          image: "/logo.svg",
          role: "USER",
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
