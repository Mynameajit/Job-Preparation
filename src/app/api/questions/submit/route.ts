import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return sendResponse(false, 401, "Unauthorized");
        }

        const body = await req.json();
        const { questionId, code, language } = body;

        if (!questionId || !code) {
            return sendResponse(false, 400, "Missing required fields");
        }

        // Just simulating a compilation/evaluation here
        // We assume it's ACCEPTED for now
        const submission = await prisma.submission.create({
            data: {
                userId: user.id,
                questionId: parseInt(questionId),
                code: code,
                status: "ACCEPTED", // Mock logic: assume correct
                score: 100,
            }
        });

        return sendResponse(true, 201, "Solution submitted successfully", { submission });
    } catch (error: any) {
        console.error("Submit Solution Error:", error);
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
