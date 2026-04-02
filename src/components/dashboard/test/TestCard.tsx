"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CalendarDays, BookOpen, } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useRedux";

type Test = {
  _id: string;
  title: string;
  description?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  questions: string[];
  lastDate?: string;
  isActive: boolean;
};

export default function TestCard({ test }: { test: Test }) {
  const { results } = useAppSelector((state) => state.result);

console.log(results);


  const isExpired =
    !!test.lastDate && new Date(test.lastDate) < new Date();

  const testDone = results.some((r) => r.testId._id === test._id)

  const difficultyColor = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          {test.title}
        </CardTitle>

        <Badge className={difficultyColor[test.difficulty]}>
          {test.difficulty}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {test.description}
        </p>

        {/* Info Row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {test.duration} min
          </div>

          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            {test.questions.length} Questions
          </div>

          {test.lastDate && (
            <div className="flex items-center gap-1">
              <CalendarDays size={16} />
              {new Date(test.lastDate).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex justify-between items-center">
          <span
            className={`text-xs px-2 py-1 rounded-full ${isExpired
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
              }`}
          >
            {isExpired ? "Expired" :testDone ? "Completed" : "Active"}
          </span>

          {
            isExpired ? (
              <Button disabled className="rounded-xl px-5">
                Closed
              </Button>
            ) : !testDone ? (

              <Link href={`/dashboard/tests/${test._id}`}>
                <Button className="rounded-xl px-5 w-full cursor-pointer">
                  Start Test
                </Button>
              </Link>
            ) : (
              <Link href={`/dashboard/tests/${test._id}`}>
                <Button className="rounded-xl px-5 w-full cursor-pointer">
                  Re-attempt
                </Button>
              </Link>
            )
          }
        </div>
      </CardContent>
    </Card>
  );
}