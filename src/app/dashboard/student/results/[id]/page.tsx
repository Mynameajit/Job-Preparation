"use client"

import React, { use } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, CheckCircle2, XCircle, FileText, Target } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DetailedResultPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()

  const { data: resultResponse, isLoading } = useQuery({
    queryKey: ["result", id],
    queryFn: async () => {
      const res = await api.get(`/user/results/${id}`)
      return res.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const result = resultResponse?.data?.result
  if (!result) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Result not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-primary underline">Go back</button>
      </div>
    )
  }

  const mockTest = result.mockTest
  const questions = mockTest?.questions || []
  const userAnswers = result.answers || {}

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 pb-12">
      <div className="space-y-4">
        <button onClick={() => router.push("/dashboard/student/results")} className="flex items-center gap-2 text-primary hover:underline font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Results
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tight">{mockTest.title}</h1>
          <Badge variant={result.percentage >= 70 ? "default" : "destructive"} className="text-sm px-4 py-1 uppercase tracking-widest">
            {result.percentage >= 70 ? "Passed" : "Failed"}
          </Badge>
        </div>
        
        <div className="flex gap-6 bg-muted/30 p-4 rounded-xl border border-border/40">
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Score</span>
            <span className="text-xl font-black">{result.score} <span className="text-sm font-medium text-muted-foreground">/ {result.total}</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Percentage</span>
            <span className="text-xl font-black text-primary">{result.percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b pb-2">Question Breakdown</h2>
        {questions.map((question: any, idx: number) => {
          const userSelectedIdx = userAnswers[question.id]
          const options = question.options as Array<{text: string, isCorrect: boolean}> || []
          
          return (
            <Card key={question.id} className="shadow-sm border-border/50">
              <CardHeader className="pb-3 bg-muted/10">
                <CardTitle className="text-base font-semibold leading-relaxed flex items-start gap-3">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm shrink-0">Q{idx + 1}</span>
                  {question.title}
                </CardTitle>
                {question.description && (
                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap pl-10">
                    {question.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {options.map((option, optIdx) => {
                  const isSelected = userSelectedIdx === optIdx
                  const isCorrect = option.isCorrect
                  
                  let optionClass = "border-slate-200 bg-white text-slate-700"
                  let Icon = null
                  
                  if (isSelected && isCorrect) {
                    optionClass = "border-green-500 bg-green-500/10 text-green-700"
                    Icon = <CheckCircle2 className="h-4 w-4 text-green-600" />
                  } else if (isSelected && !isCorrect) {
                    optionClass = "border-red-500 bg-red-500/10 text-red-700"
                    Icon = <XCircle className="h-4 w-4 text-red-600" />
                  } else if (isCorrect) {
                    optionClass = "border-green-500 bg-green-500/10 text-green-700"
                    Icon = <CheckCircle2 className="h-4 w-4 text-green-600" />
                  }
                  
                  return (
                    <div key={optIdx} className={`w-full p-3 rounded-xl border flex justify-between items-center transition-all ${optionClass}`}>
                      <span className="font-medium text-sm">{option.text}</span>
                      {Icon && <span className="shrink-0">{Icon}</span>}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
