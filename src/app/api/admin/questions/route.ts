import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { isAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return sendResponse(false, 403, "Forbidden: Admin access only");
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "15");
        const skip = (page - 1) * limit;
        
        const type = searchParams.get("type");
        const search = searchParams.get("search");

        const where: any = {};

        if (type && type !== "ALL") {
            where.type = type.toUpperCase();
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [questions, total] = await Promise.all([
            prisma.question.findMany({
                where,
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.question.count({ where })
        ]);

        return sendResponse(true, 200, "Questions fetched successfully", { 
            questions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
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
        const { title, slug, description, content, type, difficulty, categoryId, options } = body;

        if (!title || !slug || !description || !categoryId) {
            return sendResponse(false, 400, "Missing required fields");
        }

        const question = await prisma.question.create({
            data: {
                title,
                slug,
                description,
                content,
                type,
                difficulty,
                categoryId: parseInt(categoryId),
                options: options || null,
            },
        });

        return sendResponse(true, 201, "Question created successfully", { question });
    } catch (error: any) {
        console.error("Admin Question Creation Error:", error);
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}

export async function PATCH(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return sendResponse(false, 403, "Forbidden: Admin access only");
        }

        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return sendResponse(false, 400, "Missing question ID");
        }

        if (data.categoryId) {
            data.categoryId = parseInt(data.categoryId);
        }

        const question = await prisma.question.update({
            where: { id: parseInt(id) },
            data,
        });

        return sendResponse(true, 200, "Question updated successfully", { question });
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
            return sendResponse(false, 400, "Missing question ID");
        }

        await prisma.question.delete({
            where: { id: parseInt(id) },
        });

        return sendResponse(true, 200, "Question deleted successfully");
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
