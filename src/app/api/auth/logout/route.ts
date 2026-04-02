import { response } from "@/lib/response"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {

    try {
        const response = NextResponse.json({
            success: true,
            message: "Logout successful"
        })
        await response.cookies.delete("token")
        return response
    } catch (error) {
        console.log(error)
        response(false, 500, "Internal server error", error)
    }
}