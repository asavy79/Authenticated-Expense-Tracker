import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DEFAULT_LOGIN_REDIRECT } from "./routes";


import { db } from "@/lib/db"
import authConfig from "@/auth.config";

export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth({
    callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
        console.log({user, account, profile, email, credentials});
          if (user) return true;
            return false;
          },
          async redirect() {
            return DEFAULT_LOGIN_REDIRECT;
          },
          async session({ session, user, token }) {
            
            if(session?.user) {
              session.user.id = token.id;
            }
            return session
          },
          async jwt({ token, user, account, profile, isNewUser }) {
            if(user) {
              token.id = user.id;
            }
            return token
          }
    },
    adapter: PrismaAdapter(db),
    session: {strategy: "jwt"},
    ...authConfig});