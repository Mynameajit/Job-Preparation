import { log } from 'console';
import { cookies } from "next/headers"
import { response } from "@/lib/response"
import jwt from "jsonwebtoken"
import User from '@/models/User';
import { connectDB } from '@/lib/db';

export async function GET() {
    try {
        await connectDB()
        const cookiesStore = await cookies()
        const token = cookiesStore.get("token")?.value

        if (!token) {
            return response(false, 400, "Unauthorized User")
        }

        const secret = process.env.JWT_SECRET!

        const decoded: any = jwt.verify(token, secret)
        
        const user = await User.findById(decoded.userId).select("-password")

        return response(true, 200, "user fetch Successfully", user)


    } catch (error) {
        console.log("get user error", error);
        return response(false, 500, "Internal Server Error")
    }
}