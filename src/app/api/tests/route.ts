import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser();
        const userId = user?.id;

        const mockTests = await prisma.mockTest.findMany({
            include: {
                _count: {
                    select: { questions: true, results: true }
                },
                questions: {
                    take: 1, // just to peek into category if needed
                    include: {
                        category: true
                    }
                },
                results: userId ? {
                    where: { userId },
                } : false
            },
            orderBy: { createdAt: "desc" },
        });

        // Map to a format frontend expects
        const formattedTests = mockTests.map(test => {
            const categoryName = test.questions[0]?.category?.name || "General";
            return {
                id: test.id,
                title: test.title,
                description: test.description,
                duration: test.duration,
                category: categoryName,
                difficulty: test.difficulty || "MEDIUM",
                questionsCount: test._count.questions,
                attempts: test._count.results, // Total attempts by everyone
                userAttempts: test.results ? test.results.length : 0,
                maxAttempts: test.maxAttempts,
                startTime: test.startTime,
                endTime: test.endTime,
                hasAttempted: test.results ? test.results.length > 0 : false,
            };
        });

        return sendResponse(true, 200, "Tests fetched successfully", { mockTests: formattedTests });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
