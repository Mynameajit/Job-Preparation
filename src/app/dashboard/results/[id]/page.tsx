"use client";

import QuestionReview from "@/components/dashboard/result/QuestionReview";
import { Button } from "@/components/ui/button";
import { fetchSingleResult } from "@/feature/result/resultService";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResultDetail() {
    const params = useParams<{ id: string }>();
    const testId = params?.id;
    const router = useRouter()

    const dispatch = useAppDispatch();
    const { singleResult, loading } = useAppSelector((state) => state.result);

    const result = singleResult?.testId
    const answers = singleResult?.answers || {};


    useEffect(() => {
        if (testId) {
            dispatch(fetchSingleResult(testId));
        }
    }, [dispatch, testId]);

    const totalQuestions = result?.questions?.length || 0;

    const correct =
        result?.questions?.filter(
            (q: any, i: any) => q.correctAnswer === answers[String(i)]
        ).length || 0;

    const incorrect = totalQuestions - correct;


    if (loading.getSingle) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    // ✅ Safety (important)
    if (!result) {
        return <p className="text-center mt-10">No Result Found</p>;
    }

    return (
        <div className="p-6 space-y-6">

            {/* SUMMARY */}
            <div className="flex gap-2">
                <div>
                    <Button className="bg-transparent cursor-pointer " size="lg" onClick={() => router.back()}>
                        <ArrowLeft className="text-violet-700 scale-150 " />
                    </Button>
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold">
                        {result?.title || "Untitled Test"}
                    </h2>

                    <div className="flex gap-4 flex-wrap text-sm text-muted-foreground">
                        <span>Score: {singleResult?.score ?? 0} %</span>
                        <span>Total: {totalQuestions} </span>
                        <span>Correct: {correct}</span>
                        <span>Incorrect: {incorrect}</span>
                    </div>
                </div>
            </div>

            {/* QUESTIONS */}
            <div className="space-y-4">
                {result?.questions?.length > 0 ? (
                    result.questions.map((q: any, i: number) => (
                        <QuestionReview key={i} q={q} index={i} answers={answers} />
                    ))
                ) : (
                    <p className="text-muted-foreground">No questions found</p>
                )}
            </div>
        </div>
    );
}