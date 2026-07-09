import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { isAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return sendResponse(false, 403, "Forbidden: Admin access only");
        }

        const body = await req.json();
        const { questions } = body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return sendResponse(false, 400, "Questions array is required");
        }

        const createdQuestions = await prisma.$transaction(
            questions.map((q: any) => prisma.question.create({
                data: {
                    title: q.title,
                    slug: q.slug,
                    description: q.description,
                    content: q.content,
                    type: q.type || "CODING",
                    difficulty: q.difficulty || "MEDIUM",
                    categoryId: parseInt(q.categoryId),
                }
            }))
        );

        return sendResponse(true, 201, `${createdQuestions.length} questions created successfully`, { count: createdQuestions.length });
    } catch (error: any) {
        console.error("Bulk Question Creation Error:", error);
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
