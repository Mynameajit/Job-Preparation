import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { isAdmin, getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Pagination params
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        // Filter params
        const categorySlug = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");
        const type = searchParams.get("type");
        const search = searchParams.get("search");

        // Build where clause
        const where: any = {};

        if (categorySlug && categorySlug !== "all") {
            where.category = { slug: categorySlug };
        }
        console.log(where);


        if (difficulty && difficulty !== "all") {
            where.difficulty = difficulty.toUpperCase();
        }

        if (type && type !== "all") {
            where.type = type.toUpperCase();
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Fetch data and total count in parallel
        const [questionsData, total] = await Promise.all([
            prisma.question.findMany({
                where,
                include: {
                    category: {
                        select: {
                            name: true,
                            slug: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.question.count({ where }),
        ]);

        const user = await getAuthUser();
        let solvedQuestionIds = new Set<number>();

        if (user) {
            const submissions = await prisma.submission.findMany({
                where: {
                    userId: user.id,
                    status: "ACCEPTED",
                    questionId: {
                        in: questionsData.map(q => q.id)
                    }
                },
                select: { questionId: true }
            });
            submissions.forEach(sub => solvedQuestionIds.add(sub.questionId));
        }

        const questions = questionsData.map(q => ({
            ...q,
            isSolved: solvedQuestionIds.has(q.id)
        }));

        return sendResponse(true, 200, "Questions fetched successfully", {
            questions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error: any) {
        console.error("Fetch Questions Error:", error);
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return sendResponse(false, 403, "Forbidden: Admin access only");
        }

        const body = await req.json();
        const { title, slug, description, content, type, difficulty, categoryId } = body;

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

