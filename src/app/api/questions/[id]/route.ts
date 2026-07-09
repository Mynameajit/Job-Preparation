import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const id = params.id;

        if (!id) {
            return sendResponse(false, 400, "Missing question ID");
        }

        const question = await prisma.question.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        if (!question) {
            return sendResponse(false, 404, "Question not found");
        }

        return sendResponse(true, 200, "Question fetched successfully", { question });
    } catch (error: any) {
        console.error("Fetch Question Error:", error);
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
