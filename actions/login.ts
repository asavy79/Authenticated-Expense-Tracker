"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export type LoginResponse = { success: false, error: "Invalid credentials!" | "Something went wrong!" | "Invalid fields!"};

export const login = async (values: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
    console.log(values);
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success) {
        return {success:false,  error: "Invalid fields!" };
    }
    
    const { email, password}  = validatedFields.data;


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

    return redirect(DEFAULT_LOGIN_REDIRECT);


}