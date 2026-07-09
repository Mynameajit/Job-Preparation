import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateTokenAndSetCookie } from "@/lib/generateToken";
import { sendResponse } from "@/lib/sendResponse";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, bio, profilePhoto } = await req.json();

    // 1. Basic Validation
    if (!name || !email || !password) {
      return sendResponse(false, 400, "Name, email, and password are required");
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendResponse(false, 400, "User already exists with this email");
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
        bio,
        profilePhoto,
      },
    });

    // 5. Generate token and set cookie
    await generateTokenAndSetCookie(user.id);

    // 6. Return success response (don't send password)
    const { password: _, ...userWithoutPassword } = user;
    
    return sendResponse(true, 201, "User registered successfully", userWithoutPassword);

  } catch (error: any) {
    console.error("Registration Error:", error);
    return sendResponse(false, 500, "Internal Server Error", error.message);
  }
}
