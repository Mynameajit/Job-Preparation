"use client"

import React from "react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Award, FileText, Calendar, Target } from "lucide-react"

export default function StudentResultsPage() {
  const { data: resultsResponse, isLoading } = useQuery({
    queryKey: ["student-results"],
    queryFn: async () => {
      const res = await api.get("/user/results")
      return res.data
    }
  })

  const results = resultsResponse?.data?.results || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          My <span className="text-primary italic">Results</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Review your past test performances and track your progress.
        </p>
      </div>

      {results.length === 0 ? (
        <Card className="border-dashed border-2 bg-background/50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Award className="h-16 w-16 mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold uppercase tracking-widest">No Results Yet</h3>
            <p className="text-sm">You haven't completed any mock tests yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result: any, index: number) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer group" onClick={() => window.location.href = `/dashboard/student/results/${result.id}`}>
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-base font-bold leading-tight group-hover:text-primary transition-colors">
                      {result.testTitle}
                    </CardTitle>
                    <Badge variant={result.status === "Passed" ? "default" : "destructive"} className="uppercase text-[9px] font-black tracking-widest">
                      {result.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                        <Target className="h-3 w-3" /> Score
                      </span>
                      <p className="text-lg font-black text-foreground">
                        {result.score} <span className="text-muted-foreground text-sm font-medium">/ {result.total}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Percentage
                      </span>
                      <p className="text-lg font-black text-primary">
                        {result.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border/30 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.date).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
