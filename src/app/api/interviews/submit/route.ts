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
        const { answers } = body; // Array of { questionId: number, answer: string }

        if (!answers || !Array.isArray(answers)) {
            return sendResponse(false, 400, "Invalid answers format");
        }

        const submissions = [];

        for (const item of answers) {
            if (item.questionId && item.answer) {
                const submission = await prisma.submission.create({
                    data: {
                        userId: user.id,
                        questionId: item.questionId,
                        answer: item.answer,
                        status: "PENDING",
                    }
                });
                submissions.push(submission);
            }
        }

        return sendResponse(true, 201, "Interview submitted successfully", { submissions });
    } catch (error: any) {
        console.error("Submit Interview Error:", error);
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
