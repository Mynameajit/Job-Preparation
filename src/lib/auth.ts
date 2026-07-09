import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

export const getAuthUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        if (!decoded || !decoded.userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        return user;
    } catch (error) {
        return null;
    }
};

export const isAdmin = async () => {
    const user = await getAuthUser();
    return user?.role === "ADMIN";
};
