import { generateTokenAndSetCookie } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, otp, isOtpMode } = body;

        if (!email || !password) {
            return sendResponse(false, 400, "Email and password are required");
        }
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return sendResponse(false, 404, "User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return sendResponse(false, 401, "Invalid Credentials!");
        }
        await generateTokenAndSetCookie(user.id);
        return sendResponse(true, 200, "Login successful", { role: user.role });


    } catch (error) {

    }
}

