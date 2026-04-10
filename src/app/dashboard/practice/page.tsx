"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "@/components/ui/select"
import { Code2, CheckCircle, CircleDot, Flame } from "lucide-react"
import StatsCards from "@/components/dashboard/practice/stats-cards"
import ProblemsTable from "@/components/dashboard/practice/table"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { useEffect, useState } from "react"
import { fetchQuestion } from "@/feature/question/questionService"
import { PaginationBtn } from "@/components/common/paginationBtn"
import StatsCard from "@/components/dashboard/practice/stats-cards"
import { TableSkeleton } from "@/components/dashboard/practice/ProblemsLoading"

export default function CodingPracticePage() {

    const dispatch = useAppDispatch()
    const { questions, totalPages, stars, loading }: any = useAppSelector((state) => state.question)

    const [category, setCategory] = useState("all")
    const [search, setSearch] = useState("")
    const [difficulty, setDifficulty] = useState("all")
    const [page, setPage] = useState(1)

    useEffect(() => {
        const delay = setTimeout(() => {
            dispatch(fetchQuestion({ search, category, difficulty, page, type: "practice" }))
        }, 500)

        return () => clearTimeout(delay)


    }, [search, category, difficulty, page,, dispatch])



    return (
        <div className="space-y-6 p-2 md:p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight"> Coding Practice</h1>
                <p className="text-muted-foreground text-sm">
                    Take realistic Coding Challenges to simulate placement exams
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                <StatsCard
                    title="Total Problems"
                    value={stars?.total || 0}
                    icon={Code2}
                    color="bg-blue-500"
                />

                <StatsCard
                    title="Solved"
                    value={stars?.total || 0}
                    icon={CheckCircle}
                    color="bg-green-500"
                />

                <StatsCard
                    title="Easy"
                    value={stars?.easy || 0}
                    icon={CircleDot}
                    color="bg-green-400"
                />

                <StatsCard
                    title="Medium"
                    value={stars?.medium || 0}
                    icon={CircleDot}
                    color="bg-yellow-500"
                />

                <StatsCard
                    title="Hard"
                    value={stars?.hard || 0}
                    icon={Flame}
                    color="bg-red-500"
                />

            </div>

            {/* 🔍 Search + Filters */}
            <div className="flex flex-col md:flex-row gap-4">

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />

                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search problems..."
                        className="pl-9"
                    />
                </div>

                <div className="flex gap-3">

                    {/* Difficulty */}
                    <Select onValueChange={(val) => setDifficulty(val)}>
                        <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="All Difficulties" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Difficulties</SelectItem>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Category */}
                    <Select onValueChange={(val) => setCategory(val)}>
                        <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="tree">Tree</SelectItem>
                            <SelectItem value="graph">Graph</SelectItem>
                        </SelectContent>
                    </Select>

                </div>

            </div>

            {/* 🔥 Table */}
            <div className="min-h-96">
                {
                    loading.get ? <TableSkeleton /> : (
                        <ProblemsTable />
                    )
                }
            </div>

            {/* 🔥 Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                <PaginationBtn
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />

            </div>

        </div>
    )
}