import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export const sendToken = (user: any, response: NextResponse) => {

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    )

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    })
    return token
}