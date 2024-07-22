import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    email: string;
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}