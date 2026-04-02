import { connectDB } from '@/lib/db';
import { response } from '@/lib/response';
import { questionSchema } from '@/lib/ZodSchema';
import Question from '@/models/Question';
import type { NextRequest } from 'next/server';


// ================= get All questions =============

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const difficulty = searchParams.get("difficulty") || "";
        const type = searchParams.get("type") || ""; // 🔥 NEW

        // pagination
        const page = Math.max(Number(searchParams.get("page")) || 1, 1);
        const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);
        const skip = (page - 1) * limit;

        let query: any = {};

        // 🔍 Search
        if (search.trim()) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // 🎯 Category
        if (category && category !== "all") {
            query.category = category;
        }

        // ⚡ Difficulty
        if (difficulty && difficulty !== "all") {
            query.difficulty = difficulty;
        }

        // 🔥 TYPE FILTER (IMPORTANT)
        if (type && type !== "all") {
            query.type = type;
        }

        const questions = await Question.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalQuestions = await Question.countDocuments(query);

        // Total Questions
        const total = await Question.countDocuments()
        const easy = await Question.countDocuments({ difficulty: "easy" })
        const medium = await Question.countDocuments({ difficulty: "medium" })
        const hard = await Question.countDocuments({ difficulty: "hard" })

        const stars = {
            total,
            easy,
            medium,
            hard
        }

        const data = {
            questions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalQuestions,
            stars
        }

        return response(true, 200, "fetch successfully", data);

    } catch (error: any) {
        console.error("API ERROR:", error); // 🔥 DEBUG

        return response(false, 500, error.message || "Failed to fetch questions",)
    }
}

// ================= Create questions =============

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const parsed = questionSchema.safeParse(body);
        if (!parsed.success) {
            return response(false, 400, JSON.stringify(parsed.error.flatten()));
        }

        const data = parsed.data;

        const exists = await Question.findOne({ slug: data.slug });

        if (exists) {
            return response(false, 400, "Question already exists");
        }

        const created = await Question.create(data);

        return response(true, 201, "Question created successfully", created);
    } catch (error) {
        console.log("Creating Question Error:", error);
        return response(false, 500, "Internal Server Error");
    }
}

