"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Terminal,
  CheckCircle2,
  Circle,
  ArrowRight,
  Code2,
  Zap,
  Flame,
  Target,
  Loader2,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useQution } from "@/hooks/api/useQution"

// --- Constants & Configs ---
const STATS_CONFIG = [
  { id: "total", label: "Total Problems", icon: Code2, color: "bg-blue-500", text: "text-blue-500" },
  { id: "solved", label: "Solved", icon: CheckCircle2, color: "bg-emerald-500", text: "text-emerald-500" },
  { id: "easy", label: "Easy", icon: Zap, color: "bg-green-400", text: "text-green-400" },
  { id: "medium", label: "Medium", icon: Target, color: "bg-amber-500", text: "text-amber-500" },
  { id: "hard", label: "Hard", icon: Flame, color: "bg-red-500", text: "text-red-500" }
]

const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All Difficulties" },
  { value: "EASY", label: "Easy", color: "text-green-500" },
  { value: "MEDIUM", label: "Medium", color: "text-amber-500" },
  { value: "HARD", label: "Hard", color: "text-red-500" }
]

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Topics" },
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "data-structures", label: "Data Structures" }
]

export default function ProblemSolvingHubPage() {
  // --- States ---
  const [page, setPage] = useState(1)
  const [difficulty, setDifficulty] = useState("all")
  const [category, setCategory] = useState("all")
  const [tempSearch, setTempSearch] = useState("")
  const [activeSearch, setActiveSearch] = useState("")

  // --- Data Fetching ---
  const { data: questionData, isLoading, isFetching } = useQution({
    page,
    search: activeSearch,
    difficulty,
    category,
    type: "CODING"
  })

  const questions = questionData?.data?.questions || [];
  const pagination = questionData?.data?.pagination;

  // --- Derived Data ---
  const statsValues = useMemo(() => ({
    total: pagination?.total || 0,
    solved: questions.filter((q: any) => q.isSolved).length, // In production, this comes from the user profile/API
    easy: questions.filter((q: any) => q.difficulty === "EASY").length,
    medium: questions.filter((q: any) => q.difficulty === "MEDIUM").length,
    hard: questions.filter((q: any) => q.difficulty === "HARD").length,
  }), [questions, pagination])

  // --- Handlers ---
  const handleSearch = () => {
    setActiveSearch(tempSearch)
    setPage(1)
  }

  const getDifficultyStyles = (diff: string) => {
    const option = DIFFICULTY_OPTIONS.find(o => o.value === diff.toUpperCase())
    return option?.color || ""
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4">

      {/* 1. Statistics Row */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS_CONFIG.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/30 transition-all group overflow-hidden rounded-2xl">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{stat.label}</p>
                  <h4 className="text-2xl font-bold tracking-tight">{(statsValues as any)[stat.id]}</h4>
                </div>
                <div className={`${stat.color} h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-xl shadow-${stat.id}/20 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* 2. Enhanced Filter Bar */}
      <section className="bg-card/30 backdrop-blur-xl p-3 rounded-3xl border border-border/40 flex flex-col lg:flex-row items-center gap-3 shadow-2xl shadow-black/5">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search problems by title..."
            className="pl-11 h-14 bg-background/50 border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40 font-medium"
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            className="absolute right-2 top-2 bottom-2 rounded-xl  px-6 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
          >
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Select value={difficulty} onValueChange={(val) => { setDifficulty(val); setPage(1); }}>
            <SelectTrigger className="w-full lg:w-[170px] h-14 bg-background/50 rounded-2xl border-transparent font-bold text-[11px] uppercase tracking-wider">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/40 backdrop-blur-2xl">
              {DIFFICULTY_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="rounded-xl my-1">
                  <span className={opt.color}>{opt.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
            <SelectTrigger className="w-full lg:w-[170px] h-14 bg-background/50 rounded-2xl border-transparent font-bold text-[11px] uppercase tracking-wider">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border/40 backdrop-blur-2xl">
              {CATEGORY_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="rounded-xl my-1">{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* 3. Premium Table Listing */}
      <section className="rounded-[2.5rem] border border-border/30 bg-card/20 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-black/10">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/20 h-16 hover:bg-transparent">
              <TableHead className="w-20 pl-8 text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-40">#</TableHead>
              <TableHead className="min-w-[350px] text-[10px] font-black uppercase tracking-[0.2em]">Problem Title</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Difficulty</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Topic</TableHead>
              <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em]">Status</TableHead>
              <TableHead className="text-right pr-12 text-[10px] font-black uppercase tracking-[0.2em]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <TableSkeleton rows={6} />
              ) : questions.length > 0 ? (
                questions.map((q: any, i: number) => (
                  <motion.tr
                    key={q.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-border/10 hover:bg-primary/[0.03] transition-colors group cursor-default h-16"
                  >
                    <TableCell className="text-center pl-8 font-black text-[10px] text-muted-foreground/30 italic">
                      {(page - 1) * 10 + i + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[14px] tracking-tight group-hover:text-primary transition-colors">
                          {q.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 line-clamp-1 max-w-[400px]">
                          {q.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${getDifficultyStyles(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-lg font-bold text-[9px] uppercase tracking-widest px-2.5 py-0.5 bg-muted/20 border-border/50 text-muted-foreground">
                        {q.category?.name || "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {q.isSolved ? (
                          <div className="h-8 w-24 flex items-center justify-center gap-1.5 text-emerald-500 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase">Solved</span>
                          </div>
                        ) : (
                          <div className="h-8 w-24 flex items-center justify-center gap-1.5 text-muted-foreground/30 rounded-full border border-border/30">
                            <Circle className="h-2 w-2" />
                            <span className="text-[9px] font-black uppercase">Open</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Link href={`/dashboard/student/problem-solving/${q.id}`}>
                        <Button size="sm" className="rounded-2xl px-6 bg-foreground text-background hover:bg-foreground/90 font-bold uppercase tracking-widest text-[9px] h-9 shadow-lg">
                          {q.isSolved ? "Re-practice" : "Start"} <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <EmptyState />
              )}
            </AnimatePresence>
          </TableBody>
        </Table>

        {/* 4. Elegant Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-muted/20 border-t border-border/20 p-6 flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Showing <span className="text-foreground">{questions.length}</span> of <span className="text-foreground">{pagination.total}</span> problems
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-border/40 bg-background/50 hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "ghost"}
                    size="sm"
                    className={`h-9 w-9 rounded-xl font-bold text-[11px] ${page === i + 1 ? "shadow-lg shadow-primary/20" : "hover:bg-primary/10"}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-border/40 bg-background/50 hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

// --- Helper Components ---

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="animate-pulse border-border/10 h-16">
          <TableCell colSpan={6}>
            <div className="flex items-center gap-4 px-4">
              <div className="h-4 w-8 bg-muted/40 rounded-md" />
              <div className="h-4 w-64 bg-muted/40 rounded-md" />
              <div className="h-4 w-20 bg-muted/40 rounded-md ml-auto" />
              <div className="h-4 w-20 bg-muted/40 rounded-md" />
              <div className="h-4 w-24 bg-muted/40 rounded-full" />
              <div className="h-8 w-24 bg-muted/40 rounded-2xl" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-80 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 opacity-30"
        >
          <div className="p-6 rounded-full bg-muted/50">
            <Terminal className="h-14 w-14" />
          </div>
          <div className="space-y-1">
            <p className="font-black uppercase tracking-[0.2em] text-xs">No matching problems</p>
            <p className="text-[10px] tracking-wide">Try adjusting your filters or search query</p>
          </div>
        </motion.div>
      </TableCell>
    </TableRow>
  )
}

