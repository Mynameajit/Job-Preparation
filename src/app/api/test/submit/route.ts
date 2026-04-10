import { connectDB } from "@/lib/db";
import { response } from "@/lib/response";
import { resultSchema } from "@/lib/ZodSchema";
import Result from "@/models/result";
import Test from "@/models/Test";
import { ActivityModel, ActivityType } from "@/models/Activity";
import type { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const parsed = resultSchema.safeParse(body);

        if (!parsed.success) {
            return response(false, 400, "Invalid data", parsed.error.flatten());
        }

        const { testId, answers, timeTaken, userId } = parsed.data;

        // 🔥 Fetch test (with correctAnswer for scoring)
        const test = await Test.findById(testId).populate({
            path: "questions",
            select: "correctAnswer",
        });

        if (!test) {
            return response(false, 404, "Test not found");
        }

        let correct = 0;

        test.questions.forEach((q: any, index: number) => {
            if (answers[String(index)] === q.correctAnswer) {
                correct++;
            }
        });

        const total = test.questions.length;
        const wrong = total - correct;
        const score = Math.round((correct / total) * 100);


        let existingResult = await Result.findOne({ userId, testId });

        if (existingResult) {
            existingResult.answers = answers;
            existingResult.score = score;
            existingResult.totalQuestions = total;
            existingResult.correctAnswers = correct;
            existingResult.wrongAnswers = wrong;
            existingResult.timeTaken = timeTaken;

            await existingResult.save();

            return response(true, 200, "Test submitted successfully", existingResult);
        }


        const result = await Result.create({
            userId,
            testId,
            answers,
            score,
            totalQuestions: total,
            correctAnswers: correct,
            wrongAnswers: wrong,
            timeTaken,
            status: "completed",
        });

        // 🔥 Create Activity
        await ActivityModel.create({
            userId,
            type: ActivityType.TEST,
            title: `Completed Mock Test: ${test.title}`,
            description: `Scored ${score}% on the mock test.`,
            meta: { testId, score }
        });

        return response(true, 200, "Test submitted successfully", result);

    } catch (error) {
        console.error("Error submitting test:", error);

        return response(false, 500, "Internal Server error");
    }
}