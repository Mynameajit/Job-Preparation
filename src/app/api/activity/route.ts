import { response } from "@/lib/response";
import { ActivityModel } from "@/models/Activity";
import type { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { title, type, description, meta, userId } = body;

        if (!title || !type || !userId) {
            return response(false, 400, "Title and Type are required");
        }

        const isExist = await ActivityModel.findOne({
            userId,
            title,
        });

        if (isExist) {
            return response(false, 400, "Activity already exists");
        }

        const activity = await ActivityModel.create({
            userId,
            title,
            type,
            description,
            meta,
        });

        return response(true, 201, "Activity created successfully", activity);

    } catch (error) {
        console.log("Activity error", error);
        return response(false, 500, "Internal server error");
    }
}