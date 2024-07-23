
import { updateUserInformation } from "@/actions/updateProfile";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";



export async function PUT(request: NextRequest) {
    const data = await request.json();
    const result = await updateUserInformation(data);

    if(result.error) {
        return NextResponse.json({error: result.error}, {status: 500});
    }

    return NextResponse.json(result, {status: 200});
}