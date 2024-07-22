import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const resetPasswordToken = await db.passwordResetToken.findUnique({
            where: {token},
        })
        return resetPasswordToken;
    } catch {
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const resetPasswordToken = await db.passwordResetToken.findFirst({
            where: {email},
        })
        return resetPasswordToken;
    } catch {
        return null;
    }
}