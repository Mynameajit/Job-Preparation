import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const hasAccess = await isAdmin();
        if (!hasAccess) {
            return sendResponse(false, 403, "Forbidden", null);
        }

        const results = await prisma.testResult.findMany({
            include: {
                mockTest: {
                    select: {
                        title: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // We also need the user details. But TestResult has userId (String).
        // Let's fetch the users to attach their names and emails.
        const userIds = [...new Set(results.map(r => r.userId))];
        const users = await prisma.user.findMany({
            where: {
                id: { in: userIds }
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        
        const userMap = new Map(users.map(u => [u.id, u]));

        // Format for the frontend
        const formattedResults = results.map(result => {
            const student = userMap.get(result.userId);
            return {
                id: result.id,
                testId: result.testId,
                testTitle: result.mockTest.title,
                studentName: student?.name || "Unknown",
                studentEmail: student?.email || "Unknown",
                score: result.score,
                total: result.total,
                percentage: result.percentage,
                date: result.createdAt,
                status: result.percentage >= 70 ? "Passed" : "Failed"
            }
        });

        return sendResponse(true, 200, "Admin results fetched successfully", { results: formattedResults });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
