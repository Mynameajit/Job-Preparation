import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        if (!id) {
            return sendResponse(false, 400, "Missing test ID");
        }

        const mockTest = await prisma.mockTest.findUnique({
            where: { id: parseInt(id) },
            include: {
                questions: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        content: true,
                        type: true,
                        difficulty: true,
                        options: true,
                    }
                }
            }
        });

        if (!mockTest) {
            return sendResponse(false, 404, "Test not found");
        }

        return sendResponse(true, 200, "Test fetched successfully", { mockTest });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
