import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({where: {email}, include: {expenses: false, Company: true}})
        return user
    }
    catch {
        return null;
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({where: {id}, include: {expenses: false}})
        return user
    }
    catch {
        return null;
    }
}
