"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/test/StatsCard";
import { ScheduleCard } from "@/components/dashboard/test/ScheduleCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useEffect } from "react";
import { fetchTest } from "@/feature/test/testService";
import { delay } from "framer-motion/dom";
import TestCard from "@/components/dashboard/test/TestCard";
import { fetchResults, fetchSingleResult } from "@/feature/result/resultService";
import TestCardSkeleton from "@/components/dashboard/test/TestCardSkeleton";
import NoDataFound from "@/components/common/NoDataFound.";

export default function MockTestPage() {
  const dispatch = useAppDispatch()
  const { tests, loading } = useAppSelector((state) => state.test)
  const { results } = useAppSelector((state) => state.result)


  useEffect(() => {
    dispatch(fetchTest())
    dispatch(fetchResults())

  }, [dispatch,dispatch])


  const testCompleted = results.filter((result) => result.score !== null).length
  const avrageScore =Math.floor( results.reduce((acc, result) => acc + (result.score || 0), 0) / (testCompleted || 1))


 return (
  <div className="p-6 space-y-6 min-h-screen bg-background text-foreground">

    {/* HEADER */}
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Mock Tests</h1>
      <p className="text-muted-foreground text-sm">
        Take realistic tests to simulate placement exams
      </p>
    </div>

    {/* ================= LOADING FULL PAGE ================= */}
    {loading.getAll ? (
      <>
        {/* STATS SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>

        {/* MAIN GRID SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((_, i) => (
              <TestCardSkeleton key={i} />
            ))}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>

        </div>
      </>
    ) : tests.length === 0 ? (

      /* ================= EMPTY STATE ================= */
      <div className="flex items-center justify-center h-[60vh]">
        <NoDataFound text="No Tests Found" />
      </div>

    ) : (

      /* ================= REAL DATA ================= */
      <>
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Tests Completed" value={testCompleted} sub="+3 this week" />
          <StatsCard title="Average Score" value={avrageScore}sub="+5% improvement" />
          <StatsCard title="Total Time Spent" value="24h" sub="Last 30 days" />
          <StatsCard title="Best Score" value="92%" sub="Database & SQL" />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg">Available Tests</h2>

            {tests.map((test: any) => (
              <TestCard key={test._id} test={test} />
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">

            <h2 className="font-semibold text-lg">Scheduled Tests</h2>

            <ScheduleCard
              title="JavaScript Fundamentals Test"
              time="Tomorrow • 10:00 AM"
              duration="60 min"
            />

            <ScheduleCard
              title="Data Structures Mock Test"
              time="Mar 8, 2026 • 2:00 PM"
              duration="90 min"
            />

            <Button variant="outline" className="w-full">
              View All Schedules →
            </Button>

            <Card className="bg-card border">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Test Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Read questions carefully</li>
                  <li>• Manage time wisely</li>
                  <li>• Review before submit</li>
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      </>
    )}
  </div>
);
}