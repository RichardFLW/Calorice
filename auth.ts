// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * ✅ Important: JWT côté middleware (Edge) → pas d’appel DB dans le middleware.
   * L’adapter Prisma reste utilisé côté Node (callbacks, verification tokens, etc.).
   */
  session: { strategy: "jwt" },

  adapter: PrismaAdapter(prisma),

  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "Calorice <onboarding@resend.dev>",
    }),
  ],

  callbacks: {
    // Redirige vers le dashboard après login (si pas de callbackUrl fourni)
    async redirect({ url, baseUrl }) {
      try {
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        const u = new URL(url);
        if (u.origin === baseUrl) return u.toString();
      } catch {}
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    // Redirige les erreurs d’Auth.js vers notre page
    error: "/auth/error",
  },
});
