"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { Trophy, RotateCcw, Eye, Calendar } from "lucide-react";

export default function ResultCard({ result }: any) {
  const router = useRouter();

  // ✅ SAFE percentage (score already 0-100 hai)
  const percentage = Number(result.score) || 0;

  const status = percentage >= 33 ? "Pass" : "Fail";

  return (
    <Card className="rounded-2xl border bg-gradient-to-br from-background to-muted/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6 space-y-5">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold line-clamp-1">
              {result.testId?.title || "Untitled Test"}
            </h3>

            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {dayjs(result.createdAt).format("DD MMM YYYY")}
            </p>
          </div>

          <Badge
            className={`px-3 py-1 text-xs ${
              status === "Pass"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </Badge>
        </div>

        {/* 🔥 SCORE */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {result.score}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Correct</p>
             {result.correctAnswers || 0} /{" "}
      {result.testId?.questions?.length || 0} 
            <p className="text-lg font-semibold">
            </p>
          </div>
        </div>

        {/* 🔥 PROGRESS */}
        <Progress value={percentage} />

        {/* 🔥 BUTTONS */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 flex items-center gap-2"
            onClick={() =>
              router.push(`/dashboard/results/${result._id}`)
            }
          >
            <Eye className="w-4 h-4" />
            View
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="flex-1 flex items-center gap-2"
            onClick={() =>
              router.push(`/dashboard/tests/${result.testId?._id}`)
            }
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}