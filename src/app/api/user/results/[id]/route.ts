import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return sendResponse(false, 401, "Unauthorized", null);
        }

        const { id } = await context.params;

        const result = await prisma.testResult.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                mockTest: {
                    include: {
                        questions: true
                    }
                }
            }
        });

        if (!result) {
            return sendResponse(false, 404, "Test result not found", null);
        }

        if (result.userId !== user.id) {
            return sendResponse(false, 403, "Forbidden", null);
        }

        return sendResponse(true, 200, "Result fetched successfully", { result });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
