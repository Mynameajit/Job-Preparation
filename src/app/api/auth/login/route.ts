import bcrypt from 'bcryptjs';
import { response } from "@/lib/response"
import { loginSchema } from "@/lib/ZodSchema"
import User from "@/models/User"
import { NextResponse } from 'next/server';
import { sendToken } from '@/lib/createToken';
import { connectDB } from '@/lib/db';


export async function POST(req: Request) {
    try {
        await connectDB()
        const body = await req.json()

        // validation
        const validation = loginSchema.safeParse(body)
        if (!validation.success) {
            const error = validation.error.flatten().fieldErrors
            return response(false, 400, "Validation error", error)
        }

        const { email, password } = validation.data

        //user check

        const user = await User.findOne({ email })

        // existing user check

        if (!user) {
            return response(false, 400, "Invalid credentials")
        }
        // password check

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return response(false, 400, "Invalid credentials")
        }

        // create response
        const res = NextResponse.json({
            success: true,
            message: "Login successful",
            user
        })

        // send token
        const token = sendToken(user, res)

        if (!token) {
            response(false, 500, "Error generating token")
        }

        return res


    } catch (error) {
        console.error("Error in login API:", error)
        return response(false, 500, "Error in login API")
    }
}