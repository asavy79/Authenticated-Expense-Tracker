"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { db} from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { auth } from "@/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const session = await auth();

    const user = session?.user;

    if(!user) {
        return {error: "Unauthorized"}
    }

    const dbUser = await getUserById(user.id);

    if(!dbUser) {
        return {error: "Unauthorized"}
    }

    if(values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if(existingUser && existingUser.id !== user.id) {
            return {error: "Email already in use!"}
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return {success: "Verification email sent!"}
    }

    if(values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password,);

        if(!passwordsMatch) {
            return {error: "Passwords do not match!"}
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);

        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    await db.user.update({
        where: {id: dbUser.id},
        data: {
            ...values,
        },
    })

    return {success: "Settings Updated!"}
}