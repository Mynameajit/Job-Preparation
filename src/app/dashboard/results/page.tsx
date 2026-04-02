
"use client";
import NoDataFound from "@/components/common/NoDataFound.";
import ResultCard from "@/components/dashboard/result/ResultCard";
import { ResultCardSkeleton, SummaryCardSkeleton } from "@/components/dashboard/result/ResultCardSkeleton";
import SummaryCard from "@/components/dashboard/result/SummaryCard";
import { fetchResults, fetchSingleResult } from "@/feature/result/resultService";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Trophy, BarChart, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect } from "react";

export default function ResultsPage() {
    const dispatch = useAppDispatch()
    const { results, loading } = useAppSelector((state) => state.result)

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchResults()).unwrap()
        }
        fetchData();
    }, [dispatch, results.length])


    if (!results.length) {
        return <p className="text-center mt-10">No results found</p>;
    }

    const total = results.length;
    const avg =
        results.reduce((acc: number, r: any) => acc + r.score, 0) / total;

    const highest = Math.max(...results.map((r: any) => r.score));
    const lowest = Math.min(...results.map((r: any) => r.score));


    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Your Results
                </h1>
                <p className="text-muted-foreground text-sm">
                    Track your performance and analyze your test results
                </p>
            </div>

            {/* 🔥 LOADING STATE */}
            {loading.getAll ? (
                <>
                    {/* SUMMARY SKELETON */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <SummaryCardSkeleton key={i} />
                        ))}
                    </div>

                    {/* RESULT SKELETON */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <ResultCardSkeleton key={i} />
                        ))}
                    </div>
                </>
            ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <NoDataFound text="No Results Found" />
                </div>

            ) : (
                <>
                    {/* ✅ SUMMARY */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total Tests" value={total} icon={BarChart} color="text-yellow-500" />
                        <SummaryCard title="Average Score" value={avg.toFixed(1)} icon={TrendingUp} color="text-green-500" />
                        <SummaryCard title="Highest Score" value={highest} icon={Trophy} color="text-purple-500" />
                        <SummaryCard title="Lowest Score" value={lowest} icon={TrendingDown} color="text-red-500" />
                    </div>

                    {/* ✅ RESULTS */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((r: any) => (
                            <ResultCard key={r._id} result={r} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}