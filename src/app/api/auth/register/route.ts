import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

import User from "@/models/User"


import { registerSchema } from "@/lib/ZodSchema"
import { connectDB } from "@/lib/db"
import { response } from "@/lib/response"
import { sendToken } from "@/lib/createToken"

export async function POST(req: Request) {

    try {

        // Connect database
        await connectDB()

        // Parse request body
        const body = await req.json()

        // Validate request data using Zod
        const validation = registerSchema.safeParse(body)

        if (!validation.success) {

            const errors = validation.error.flatten().fieldErrors

            return response(false, 400, "Validation error", errors)
        }

        const { name, email, password } = validation.data

        // Check if user already exists
        const isExistingUser = await User.findOne({ email })

        if (isExistingUser) {
            return response(false, 400, "User already exists")
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10)

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        })

        if (!newUser) {
            return response(false, 500, "Error creating user")
        }

        // Create response object
        const res = NextResponse.json({
            success: true,
            message: "User registered successfully"
        })

        // Generate token and set cookie
        sendToken(newUser, res)

        return res

    } catch (error) {

        console.error("Error in register API:", error)

        return response(false, 500, "Error in register API")
    }
}