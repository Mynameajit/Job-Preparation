import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        let categories = await prisma.category.findMany({
            orderBy: { name: "asc" }
        });

        // Auto-seed default categories so dropdown always has options
        const defaultCategories = [
            { name: "Frontend", slug: "frontend" },
            { name: "Backend", slug: "backend" },
            { name: "Data Structures", slug: "data-structures" },
            { name: "System Design", slug: "system-design" },
            { name: "General", slug: "general" }
        ];
        
        await prisma.category.createMany({
            data: defaultCategories,
            skipDuplicates: true,
        });

        // Refetch after seeding to ensure we have all categories
        categories = await prisma.category.findMany({
            orderBy: { name: "asc" }
        });

        return sendResponse(true, 200, "Categories fetched successfully", { categories });
    } catch (error: any) {
        return sendResponse(false, 500, "Internal server error", error.message);
    }
}
