import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/sendResponse";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return sendResponse(false, 401, "Not authenticated");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        if (!decoded || !decoded.userId) {
            return sendResponse(false, 401, "Invalid token");
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return sendResponse(false, 404, "User not found");
        }

        // Exclude password from the response
        const { password, ...userWithoutPassword } = user;

        return sendResponse(true, 200, "User profile fetched successfully", { user: userWithoutPassword });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return sendResponse(false, 500, "Internal server error");
    }
}

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return sendResponse(false, 401, "Not authenticated");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const body = await req.json();
        console.log("Profile Update Request Body:", JSON.stringify(body, null, 2));

        const { 
            name, 
            bio, 
            profilePhoto, 
            location, 
            githubUrl, 
            linkedinUrl, 
            websiteUrl,
            skills
        } = body;

        // Construct update data, avoiding undefined values
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
        if (location !== undefined) updateData.location = location;
        if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
        if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
        if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
        if (skills !== undefined) updateData.skills = skills;

        console.log("Updating User with Data:", JSON.stringify(updateData, null, 2));

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: updateData
        });

        const { password, ...userWithoutPassword } = updatedUser;

        return sendResponse(true, 200, "Profile updated successfully", { user: userWithoutPassword });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return sendResponse(false, 500, error.message || "Internal server error");
    }
}