import { NextResponse } from "next/server"
import { success } from "zod"

// Common API response handler
export const response = (
    success: boolean = false,
    status: number = 200,
    message: string,
    data: any = null
) => {

    return NextResponse.json(
        {
            success,
            message,
            data
        },
        { status }
    )

}