import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { isAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return sendResponse(false, 403, "Forbidden: Admin access only");
        }

        const mockTests = await prisma.mockTest.findMany({
            include: {
                questions: true,
                _count: {
                    select: { results: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return sendResponse(true, 200, "Mock Tests fetched successfully", { mockTests });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return sendResponse(false, 403, "Forbidden: Admin access only");
        }

        const body = await req.json();
        const { title, description, duration, passingScore, difficulty, questionIds, startTime, endTime, maxAttempts, terms } = body;

        if (!title || !duration) {
            return sendResponse(false, 400, "Missing required fields");
        }

        const mockTest = await prisma.mockTest.create({
            data: {
                title,
                description,
                duration: parseInt(duration),
                passingScore: passingScore ? parseInt(passingScore) : 70,
                difficulty: difficulty || "MEDIUM",
                startTime: startTime ? new Date(startTime) : null,
                endTime: endTime ? new Date(endTime) : null,
                maxAttempts: maxAttempts ? parseInt(maxAttempts) : 3,
                terms: terms || null,
                questions: {
                    connect: questionIds?.map((id: number) => ({ id })) || [],
                },
            },
            include: {
                questions: true,
            },
        });

        return sendResponse(true, 201, "Mock Test created successfully", { mockTest });
    } catch (error: any) {
        console.error("Admin Test Creation Error:", error);
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}

export async function PATCH(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return sendResponse(false, 403, "Forbidden: Admin access only");
        }

        const body = await req.json();
        const { id, title, description, duration, passingScore, difficulty, questionIds, startTime, endTime, maxAttempts, terms } = body;

        if (!id) {
            return sendResponse(false, 400, "Missing test ID");
        }

        const updateData: any = {
            title,
            description,
        };

        if (duration) updateData.duration = parseInt(duration);
        if (passingScore) updateData.passingScore = parseInt(passingScore);
        if (difficulty) updateData.difficulty = difficulty;
        if (startTime !== undefined) updateData.startTime = startTime ? new Date(startTime) : null;
        if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null;
        if (maxAttempts) updateData.maxAttempts = parseInt(maxAttempts);
        if (terms !== undefined) updateData.terms = terms;
        
        if (questionIds) {
            updateData.questions = {
                set: questionIds.map((qid: number) => ({ id: qid })),
            };
        }

        const mockTest = await prisma.mockTest.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { questions: true },
        });

        return sendResponse(true, 200, "Mock Test updated successfully", { mockTest });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return sendResponse(false, 403, "Forbidden: Admin access only");
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return sendResponse(false, 400, "Missing test ID");
        }

        await prisma.mockTest.delete({
            where: { id: parseInt(id) },
        });

        return sendResponse(true, 200, "Mock Test deleted successfully");
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
