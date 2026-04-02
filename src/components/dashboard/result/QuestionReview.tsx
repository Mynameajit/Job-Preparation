import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

type Props = {
    q: {
        title: string;
        options: string[];
        correctAnswer: string;
        selectedAnswer: string;
    };
    index: number;
    answers: Record<number, string>; // ✅ FIX TYPE
};

export default function QuestionReview({ q, index, answers }: Props) {
    // ✅ Correct selected value
    const selected = answers?.[index] ?? q.selectedAnswer;

    return (
        <Card className="transition hover:shadow-md rounded-xl">
            <CardContent className="p-5 space-y-4">

                {/* Question */}
                <h4 className="font-semibold text-base">
                    Q{index + 1}. {q.title}
                </h4>

                {/* Options */}
                <div className="space-y-2">
                    {q.options.map((opt, i) => {
                        const isSelected = selected === opt;
                        const isCorrect = q.correctAnswer === opt;

                        return (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-3 rounded-lg border transition

                                    ${isSelected && isCorrect
                                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                        : isSelected && !isCorrect
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"

                                            : ""} `}
                            >
                                <span>{opt}</span>

                                {/* ICON LOGIC */}
                                {isSelected && isCorrect && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                )}

                                {isSelected && !isCorrect && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}

                                {/* Show correct icon if not selected */}
                                {!isSelected && isCorrect && (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-sm">
                        Answer: {q.correctAnswer}
                    </Badge>


                </div>

            </CardContent>
        </Card>
    );
}