import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getAccountByUserId, getUserById } from "./modules/auth/actions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    /**
     * Handle user creation and account linking after a successful sign-in
     */
    async signIn({ user, account }) {
      if (!user) return false;

      // Handle 1-Click Recruiter Demo Login
      if (account?.provider === "recruiter-login") {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            const created = await db.user.create({
              data: {
                id: "demo-recruiter-id",
                email: user.email!,
                name: user.name || "Demo Recruiter",
                image: user.image || "/logo.svg",
                role: "USER",
              },
            });
            user.id = created.id;
          } else {
            user.id = existingUser.id;
          }
          return true;
        } catch (error) {
          console.error("Recruiter sign-in error:", error);
          return true; // Still allow session even if DB sync has temporary issues
        }
      }

      // Handle OAuth (GitHub)
      if (account && user.email) {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            const newUser = await db.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: "USER",
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refreshToken: account.refresh_token,
                    accessToken: account.access_token,
                    expiresAt: account.expires_at,
                    tokenType: account.token_type,
                    scope: account.scope,
                    idToken: account.id_token,
                    sessionState: account.session_state as string | undefined,
                  },
                },
              },
            });
            user.id = newUser.id;
          } else {
            user.id = existingUser.id;

            const existingAccount = await db.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });

            if (!existingAccount) {
              await db.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refreshToken: account.refresh_token,
                  accessToken: account.access_token,
                  expiresAt: account.expires_at,
                  tokenType: account.token_type,
                  scope: account.scope,
                  idToken: account.id_token,
                  sessionState: account.session_state as string | undefined,
                },
              });
            }
          }
        } catch (err) {
          console.error("OAuth sign-in error:", err);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role || "USER";
        token.name = user.name;
        token.email = user.email;
        return token;
      }

      if (!token.sub) return token;

      try {
        const existingUser = await getUserById(token.sub);
        if (existingUser) {
          token.name = existingUser.name;
          token.email = existingUser.email;
          token.role = existingUser.role;
        }
      } catch (err) {
        console.error("JWT fetch error:", err);
      }

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as any;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
