import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return sendResponse(false, 401, "Unauthorized", null);
        }

        const results = await prisma.testResult.findMany({
            where: {
                userId: user.id
            },
            include: {
                mockTest: {
                    select: {
                        title: true,
                        difficulty: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Format for the frontend
        const formattedResults = results.map(result => ({
            id: result.id,
            testId: result.testId,
            testTitle: result.mockTest.title,
            score: result.score,
            total: result.total,
            percentage: result.percentage,
            date: result.createdAt,
            status: result.percentage >= 70 ? "Passed" : "Failed"
        }));

        return sendResponse(true, 200, "Results fetched successfully", { results: formattedResults });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
