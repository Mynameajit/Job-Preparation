import { connectDB } from "@/lib/db";
import { response } from "@/lib/response";
import Result from "@/models/result";
import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import "@/models/Test"
import "@/models/Question"


export async function GET(req: NextRequest,
       { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        await connectDB()
        const { id } = await params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response(false, 400, "Invalid Test ID");
        }
        const result = await Result.findById(id).populate({
            path: "testId",
            populate: {
                path: "questions",
            },
        });

        if (!result) {
            return response(false, 404, "result not found");
        }

        return response(true, 200, "get single result successfully", result);

    } catch (error) {
        console.log("Getting Result Error:", error);
        return response(false, 500, "Internal Server Error");
    }
}

