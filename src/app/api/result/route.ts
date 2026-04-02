import { connectDB } from "@/lib/db";
import { response } from "@/lib/response";
import Result from "@/models/result";
import { i } from "framer-motion/client";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import "@/models/Test"
import "@/models/Question"


export async function GET(req: NextRequest) {

    try {
        await connectDB();
        const cookiesStore = await cookies()
        const token = cookiesStore.get("token")?.value
        if (!token) {
            return response(false, 400, "Unauthorized User")
        }
        const secret = process.env.JWT_SECRET!
        const decoded: any = jwt.verify(token, secret)
        const userId = decoded.userId;
        console.log(userId);

        if (!userId) {
            return response(false, 401, "Unauthorized");
        }

        const result = await Result.find({ userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "testId",
                populate: {
                    path: "questions", 
                },
            });

        if (!result.length) {
            return response(false, 404, "No results found");
        }

        return response(true, 200, "Result retrieved successfully", result);

    } catch (error) {
        console.log("Getting Result Error:", error);
        return response(false, 500, "Internal Server Error");
    }
}