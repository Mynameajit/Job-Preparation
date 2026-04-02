import { connectDB } from "@/lib/db";
import { response } from "@/lib/response";
import { testSchema } from "@/lib/ZodSchema";
import Test from "@/models/Test";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";



export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        // ✅ Zod Validation
        const parsed = testSchema.safeParse(body);

        if (!parsed.success) {
            return response(
                false,
                400,
                "Validation Error",
                parsed.error.flatten()
            );
        }

        const data = parsed.data;

        // 🔐 Safe regex (important)
        const escapedTitle = data.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const exists = await Test.findOne({
            title: { $regex: `^${escapedTitle}$`, $options: "i" },
        });

        if (exists) {
            return response(false, 400, "Test already exists");
        }

        const cookiesStore = await cookies()
        const token = cookiesStore.get("token")?.value
        console.log("token", token);

        if (!token) {
            return response(false, 400, "Unauthorized User")
        }
        const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);

        const userId = decoded.id;

        // 🧠 Transform data (IMPORTANT)
        const payload = {
            ...data,
            totalQuestions: data.questions.length,
            lastDate: data.lastDate ? new Date(data.lastDate) : undefined,
            createdBy: userId, // 🔥 replace later with auth
        };

        // 🚀 Create Test
        const created = await Test.create(payload);

        return response(true, 201, "Test created successfully", created);
    } catch (error: any) {
        console.error("❌ Creating Test Error:", error);

        return response(
            false,
            500,
            error?.message || "Internal Server Error"
        );
    }
}


export async function GET(req: NextRequest,) {
    try {

        await connectDB()
        const test = await Test.find()

        return response(true, 200, "Tests retrieved successfully", test);
    } catch (error) {
        console.log("Getting Test Error:", error);
        return response(false, 500, "Internal Server Error");
    }


}