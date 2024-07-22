"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export type LoginResponse = { success: false, error: "Invalid credentials!" | "Something went wrong!" | "Invalid fields!" | "Email does not exist!" | "Email not verified! Verification email sent."};

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null): Promise<LoginResponse> => {
    console.log(values);
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success) {
        return {success:false,  error: "Invalid fields!" };
    }
    
    const { email, password}  = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password) {
        return {success: false, error: "Email does not exist!"};
    }


    if(!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return {success: false, error: "Email not verified! Verification email sent."}
    }


    try {
        const response = await signIn("credentials", {redirect: false, email, password});

    }
    catch (error: any) {
        console.log("Error: ", error, error.type)


        if( error instanceof AuthError) {
            switch(error.type) {
                case "CallbackRouteError":
                    return {success: false, error: "Invalid credentials!"}
                default:
                    return {success: false, error: "Something went wrong!"}
            }
        }

        return {success: false, error: "Something went wrong!"}
    }

    if(callbackUrl) {
        return redirect(callbackUrl);
    }
    return redirect(DEFAULT_LOGIN_REDIRECT);


}