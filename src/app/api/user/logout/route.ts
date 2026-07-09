import { sendResponse } from "@/lib/sendResponse";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("token");

        return sendResponse(true, 200, "Logged out successfully");
    } catch (error) {
        console.error("Logout error:", error);
        return sendResponse(false, 500, "Internal server error", error);
    }
}
