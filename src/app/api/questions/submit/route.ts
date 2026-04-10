import { cookies } from "next/headers";
import { response } from "@/lib/response";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { ActivityModel, ActivityType } from "@/models/Activity";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";

export async function POST(req: Request) {
  try {
    await connectDB();
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) {
      return response(false, 401, "Unauthorized User");
    }

    const { questionId } = await req.json();

    if (!questionId) {
      return response(false, 400, "Question ID is required");
    }

    const secret = process.env.JWT_SECRET!;
    const decoded: any = jwt.verify(token, secret);
    const userId = decoded.userId;

    const question = await Question.findById(questionId);
    if (!question) {
       return response(false, 404, "Question not found");
    }

    // Add to user solved array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { solvedQuestions: questionId }
    });

    // Determine recent activity type or find if already exists
    const recentAct = await ActivityModel.findOne({ 
      userId, 
      "meta.questionId": questionId 
    });

    if (!recentAct) {
      // Create new activity for solving questions!
      await ActivityModel.create({
        userId,
        type: ActivityType.CODING,
        title: `Completed '${question.title}'`,
        description: `Successfully passed all test cases for ${question.difficulty} problem.`,
        meta: { questionId }
      });
    }

    return response(true, 200, "Successfully saved submission");
  } catch (error) {
    console.log("Submission error", error);
    return response(false, 500, "Internal Server Error");
  }
}
