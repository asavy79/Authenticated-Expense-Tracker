import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DEFAULT_LOGIN_REDIRECT } from "./routes";

import { db } from "@/lib/db"
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";

export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
    },
    events: {
      async linkAccount({user}) {
        await db.user.update({
          where: {id: user.id},
          data: {emailVerified: new Date()},
        })
      }
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {

          if(!user || !user.id) return false;

          const existingUser = await getUserById(user.id);
          if(!existingUser?.emailVerified) return false;

          return true;
          },
          async redirect() {
            return DEFAULT_LOGIN_REDIRECT;
          },
          async session({ session, user, token }) {
            
            if(session?.user) {
              session.user.name = token.name;
              session.user.email = token.email as string;
              session.user.id = token.id as string;
            }
            return session
          },
          async jwt({ token, user, account, profile, isNewUser }) {

            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;

            token.name = existingUser.name;
            token.email = existingUser.email;
            token.id = existingUser.id;

            return token
          }
    },
    adapter: PrismaAdapter(db),
    session: {strategy: "jwt"},
    ...authConfig});