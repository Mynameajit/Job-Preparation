import { v2 as cloudinary } from "cloudinary";
import { sendResponse } from "@/lib/sendResponse";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return sendResponse(false, 400, "No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "profile_photos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    return sendResponse(true, 200, "Image uploaded successfully", { url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return sendResponse(false, 500, "Internal server error", error);
  }
}
