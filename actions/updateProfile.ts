import { db } from "@/lib/db";
import { auth } from "@/auth";

export type UpdateInformationType = {
    field: "name" | "email" | "picture" | "organization";
    value: string;
}


export const updateUserInformation = async (request: UpdateInformationType) => {

    const session = await auth();
    if(!session?.user) {
        return {error: "User not signed in"}
    }


    const email = session.user.email
    if(!email) {
        return {error: "Unable to find user by email"};
    }

    const updateData: {[key: string]: string} = {};
    updateData[request.field] = request.value;
    
    try {
        const data = await db.user.update({
            where: {
                email: email,
            },
            data: updateData,
        })
        return {data};
    } catch(error) {
        return {error: error};
    }
}
