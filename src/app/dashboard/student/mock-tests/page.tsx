"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Timer,
  HelpCircle,
  ArrowRight,
  Star,
  Users,
  Search,
  Zap,
  BarChart3,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { mockTests as mockTestsData } from "@/data/mockTestsData"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

/**
 * Mock Test Listing Page.
 * A unified, high-fidelity hub for technical assessments.
 */
function TestCardFooter({ test }: { test: any }) {
  const [resumeTimeLeft, setResumeTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    // Check if test is currently active in localStorage
    const startTimeStr = localStorage.getItem(`test_startTime_${test.id}`)
    if (startTimeStr) {
      const startTime = parseInt(startTimeStr, 10)
      const durationSeconds = test.duration * 60

      const updateTimer = () => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
        const remaining = durationSeconds - elapsedSeconds
        if (remaining > 0) {
          setResumeTimeLeft(remaining)
        } else {
          setResumeTimeLeft(0)
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [test.id, test.duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isResuming = resumeTimeLeft !== null && resumeTimeLeft > 0

  const now = new Date();
  const startTime = test.startTime ? new Date(test.startTime) : null;
  const endTime = test.endTime ? new Date(test.endTime) : null;

  const isNotActiveYet = startTime && now < startTime;
  const isExpired = endTime && now > endTime;
  const maxAttemptsReached = test.userAttempts >= (test.maxAttempts || 3);

  const canStart = !isNotActiveYet && !isExpired && (!maxAttemptsReached || isResuming);

  return (
    <div className="mt-auto pt-4 flex flex-col gap-4 border-t border-border/20">
      {/* Scheduling info */}
      {(startTime || endTime) && (
        <div className="flex flex-col gap-1 text-[10px] text-muted-foreground bg-muted/20 px-3 py-2 rounded-lg border border-border/40">
          {startTime && <span className="flex justify-between"><span>Starts:</span> <span className="font-bold text-foreground">{startTime.toLocaleString()}</span></span>}
          {endTime && <span className="flex justify-between"><span>Ends:</span> <span className="font-bold text-foreground">{endTime.toLocaleString()}</span></span>}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground">
              {(test.attempts || 0).toLocaleString()} <span className="opacity-50 font-medium">TAKEN</span>
            </span>
          </div>
          <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-flex w-fit">
            Attempts: {test.userAttempts || 0} / {test.maxAttempts || 3}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isResuming && (
            <div className="text-red-500 font-bold text-xs flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md animate-pulse">
              <Timer className="h-3 w-3" /> {formatTime(resumeTimeLeft)}
            </div>
          )}
          {isNotActiveYet ? (
            <Badge variant="outline" className="text-amber-500 border-amber-500/30">Not Active</Badge>
          ) : isExpired ? (
            <Badge variant="outline" className="text-red-500 border-red-500/30">Expired</Badge>
          ) : maxAttemptsReached && !isResuming ? (
            <Badge variant="outline" className="text-red-500 border-red-500/30">Max Attempts</Badge>
          ) : (
            <Link href={`/dashboard/student/mock-tests/${test.id}`}>
              <Button
                size="sm"
                variant={test.hasAttempted && !isResuming ? "secondary" : "default"}
                className={`rounded-xl h-9 px-5 bg-violet-900 font-black text-[9px] uppercase tracking-widest shadow-lg group-hover:scale-105 transition-all ${!test.hasAttempted || isResuming ? "bg-violet-900 hover:bg-violet-700 text-white shadow-primary/20" : "bg-violet-800 text-foreground shadow-black/5 hover:bg-muted/80 border border-border/50"
                  }`}
              >
                {isResuming ? "Resume" : test.hasAttempted ? "Retest" : "Start"} <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MockTestsListingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const { data: testsResponse, isLoading } = useQuery({
    queryKey: ["student-tests"],
    queryFn: async () => {
      const res = await api.get("/tests")
      return res.data
    }
  })

  const mockTests = testsResponse?.data?.mockTests || []

  const categories = ["All", "Aptitude", "DSA", "Reasoning", "General"]

  const filteredTests = useMemo(() => {
    if (!mockTests) return []
    return mockTests.filter((test: any) => {
      // Remove the strict hiding of attempted tests. Users should be able to see them to reattempt until maxAttempts is reached.
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === "All" || test.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory, mockTests])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
            <Sparkles className="h-3 w-3" /> Professional Assessments
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Assessment <span className="text-primary italic">Hub</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium max-w-xl">
            Challenge yourself with our curated list of technical mock tests designed to simulate real-world hiring standards.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-card/30 backdrop-blur-xl p-3 rounded-3xl border border-border/40 shadow-2xl shadow-black/5">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search assessments..."
            className="pl-11 h-12 bg-background/50 border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto p-1 bg-background/40 rounded-2xl border border-border/20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Test Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {filteredTests.map((test: any) => (
            <motion.div key={test.id} variants={itemVariants} layout>
              <Card className="h-full border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/40 transition-all duration-500 group relative overflow-hidden flex flex-col rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5">
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-1 h-full ${test.difficulty === "Easy" ? "bg-green-500" :
                  test.difficulty === "Medium" ? "bg-amber-500" : "bg-red-500"
                  }`} />

                <CardContent className="p-6 flex flex-col flex-1 gap-6">
                  {/* Card Header Area */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-primary mb-1">
                        <Layers className="h-3 w-3" /> {test.category}
                      </div>
                      <h3 className="text-lg font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {test.title}
                      </h3>
                    </div>
                    <Badge className={`${test.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      test.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      } text-[9px] font-black uppercase tracking-tighter rounded-lg border`}>
                      {test.difficulty}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-muted-foreground/80 leading-relaxed line-clamp-2 font-medium">
                    {test.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/20 border border-border/20">
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold">{test.questionsCount || test.questions || 0}</span>
                        <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-black">Questions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/20 border border-border/20">
                      <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold">{test.duration}</span>
                        <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-black">Mins</span>
                      </div>
                    </div>
                  </div>

                  <TestCardFooter test={test} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredTests.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center opacity-30"
        >
          <Search className="h-12 w-12 mb-4" />
          <h3 className="text-xl font-bold uppercase tracking-widest">No tests found</h3>
          <p className="text-xs">Try adjusting your search or category filters.</p>
        </motion.div>
      )}
    </div>
  )
}

