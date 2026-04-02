import { connectDB } from "@/lib/db";
import { response } from "@/lib/response";
import "@/models/Question";
import Test from "@/models/Test";
import mongoose from "mongoose";
import type { NextRequest } from "next/server";


export async function GET(req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { id } = await params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response(false, 400, "Invalid Test ID");
        }
        const test = await Test.findById(id).populate({
            path: "questions",
            select: "-correctAnswer",
        });

        if (!test) {
            return response(false, 404, "Test not found");
        }

        return response(true, 200, "get single test successfully", test);

    } catch (error) {
        console.log("Getting Test Error:", error);
        return response(false, 500, "Internal Server Error");
    }
}

