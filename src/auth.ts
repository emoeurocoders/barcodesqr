import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { env } from "@/lib/env";

/**
 * Email + password sign-in, matching what the product's login page offers.
 *
 * Sessions are JWT rather than database rows: Auth.js only supports the
 * database strategy for providers that go through the adapter, and Credentials
 * deliberately does not. The adapter is still wired up so user records live in
 * Neon and an OAuth provider can be added later without a migration.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // slide the expiry at most once a day
  },

  secret: env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const email = String(raw?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(raw?.password ?? "");
        if (!email || !password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        // Compare even when the account is missing or has no password, so the
        // response time doesn't reveal which emails are registered.
        const hash =
          user?.passwordHash ??
          "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvaliduO";
        const ok = await bcrypt.compare(password, hash);

        if (!ok || !user?.passwordHash) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // With JWT sessions the token is the only thing carried between requests,
    // so the user id has to be stashed on it to reach the session.
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
