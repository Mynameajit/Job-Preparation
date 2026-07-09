import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const isUserAdmin = await isAdmin();
        if (!isUserAdmin) {
            return sendResponse(false, 401, "Unauthorized");
        }

        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                profilePhoto: true,
            },
            orderBy: { createdAt: "desc" },
        });

        // Add some mock progress and status since we don't have them in db yet
        const enrichedStudents = students.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            progress: Math.floor(Math.random() * 100), // mock
            status: "Active", // mock
            lastActive: student.createdAt.toLocaleDateString(), // using createdAt as proxy
            avatar: student.name.substring(0, 2).toUpperCase()
        }));

        return sendResponse(true, 200, "Students fetched successfully", enrichedStudents);
    } catch (error) {
        console.error(error);
        return sendResponse(false, 500, "Internal server error");
    }
}
