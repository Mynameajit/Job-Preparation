import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return sendResponse(false, 401, "Unauthorized");
        }

        // Fetch random questions of type INTERVIEW.
        // Prisma doesn't have a native "random" select, so we fetch a bunch and shuffle.
        const questions = await prisma.question.findMany({
            where: {
                type: "INTERVIEW",
            },
            take: 50, 
            select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                category: {
                    select: { name: true }
                }
            }
        });

        if (questions.length === 0) {
            return sendResponse(false, 404, "No interview questions found in the database.");
        }

        // Shuffle and pick 5
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 5);

        return sendResponse(true, 200, "Interview questions fetched successfully", { questions: selectedQuestions });
    } catch (error: any) {
        console.error("Fetch Interview Questions Error:", error);
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
