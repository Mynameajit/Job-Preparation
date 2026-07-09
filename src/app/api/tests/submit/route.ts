import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return sendResponse(false, 401, "Unauthorized");
        }

        const body = await req.json();
        const { testId, answers } = body; 
        // answers could be an object mapping questionId -> selected option index

        if (!testId || !answers) {
            return sendResponse(false, 400, "Missing required fields");
        }

        const mockTest = await prisma.mockTest.findUnique({
            where: { id: parseInt(testId) },
            include: { questions: true }
        });

        if (!mockTest) {
            return sendResponse(false, 404, "Test not found");
        }

        let score = 0;
        const total = mockTest.questions.length;

        // Calculate score
        for (const question of mockTest.questions) {
            const selectedIdx = answers[question.id];
            if (selectedIdx !== undefined && question.options) {
                const options = question.options as Array<{text: string, isCorrect: boolean}>;
                if (options[selectedIdx]?.isCorrect) {
                    score++;
                }
            }
        }

        const percentage = total > 0 ? (score / total) * 100 : 0;

        const result = await prisma.testResult.create({
            data: {
                userId: user.id,
                testId: parseInt(testId),
                score,
                total,
                percentage,
                answers // Save the student's selected options map
            }
        });

        return sendResponse(true, 201, "Test submitted successfully", { result });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
