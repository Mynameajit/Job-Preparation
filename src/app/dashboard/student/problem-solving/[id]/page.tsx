"use client"

import React, { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
   ArrowLeft,
   Lightbulb,
   MessageSquare,
   Code2,
   Trophy,
   History,
   Terminal,
   ChevronRight,
   Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { codingQuestions } from "@/data/codingQuestions"
import { MonacoCodeEditor } from "@/components/dashboard/monaco-code-editor"
import { notFound } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { toast } from "sonner"

interface PageProps {
   params: Promise<{ id: string }>
}

/**
 * Problem Solving Workspace.
 * Detailed challenge page with Monaco Editor and split-screen results.
 */
export default function ProblemSolvingWorkspacePage({ params }: PageProps) {
   const { id } = use(params)
   const [code, setCode] = useState("")

   // 1. Try to find the question by ID locally
   const localQuestion = codingQuestions.find(q => q.id === id)

   // 2. Fetch from API if not found locally
   const { data: apiResponse, isLoading, isError } = useQuery({
      queryKey: ["question", id],
      queryFn: async () => {
         const res = await api.get(`/questions/${id}`)
         return res.data
      },
      enabled: !localQuestion,
      retry: false
   })

   let question = localQuestion as any;

   if (!question && apiResponse?.data?.question) {
      const q = apiResponse.data.question;
      question = {
         id: q.id.toString(),
         sNo: q.id,
         title: q.title,
         difficulty: q.difficulty === "HARD" ? "Hard" : q.difficulty === "MEDIUM" ? "Medium" : "Easy",
         language: "JavaScript",
         category: q.category?.name || "Uncategorized",
         description: q.content?.markdown || q.description || "No description provided.",
         examples: q.content?.testCases?.length > 0 ? q.content.testCases : [
            {
               input: "arr = [1, 5, 3, 9, 2]",
               output: "9",
               explanation: "The largest element in the array is 9."
            },
            {
               input: "arr = [-1, -5, -3]",
               output: "-1"
            }
         ],
         constraints: q.content?.constraints?.length > 0 ? q.content.constraints : [
            "1 <= arr.length <= 10^5",
            "-10^9 <= arr[i] <= 10^9"
         ],
         starterCode: q.content?.starterCode || "// Write your code here\n",
         isSolved: false
      };
   }

   useEffect(() => {
      if (question?.starterCode && !code) {
         setCode(question.starterCode);
      }
   }, [question?.starterCode, code]);

   const submitMutation = useMutation({
      mutationFn: async (data: any) => {
         const res = await api.post(`/questions/submit`, data)
         return res.data
      },
      onSuccess: () => {
         toast.success("Solution submitted successfully!")
      },
      onError: (err: any) => {
         toast.error(err?.response?.data?.message || "Failed to submit solution")
      }
   })

   if (!localQuestion && isLoading) {
      return (
         <div className="flex h-[calc(100vh-120px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
         </div>
      )
   }

   if (!localQuestion && (isError || !apiResponse?.data?.question)) {
      notFound()
   }

   const handleSubmit = () => {
      if (!question || submitMutation.isPending) return;
      submitMutation.mutate({
         questionId: question.id,
         code: code,
         language: question.language
      })
   }

   const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
         case "Easy": return "text-green-500 bg-green-500/10 border-green-500/20";
         case "Medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
         case "Hard": return "text-red-500 bg-red-500/10 border-red-500/20";
         default: return "";
      }
   }

   return (
      <div className="flex flex-col h-[calc(100vh-120px)] -m-4 md:-m-6 lg:-m-8 overflow-auto">

         {/* Dynamic Header */}
         <div className="flex items-center justify-between px-6 py-3 bg-card/50 backdrop-blur-xl border-b border-border/50 ">
            <div className="flex items-center gap-6">
               <Link href="/dashboard/student/problem-solving">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-2xl hover:bg-muted bg-muted/20">
                     <ArrowLeft className="h-4 w-4" />
                  </Button>
               </Link>
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                     <h2 className="font-black text-lg tracking-tight">{question.title}</h2>
                     <Badge variant="outline" className={`text-[10px] uppercase font-black px-2 py-0 h-5 rounded-md ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                     </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                     <span>Problem #{question.sNo < 10 ? `0${question.sNo}` : question.sNo}</span>
                     <Separator orientation="vertical" className="h-2" />
                     <span>{question.category}</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <Button variant="outline" size="sm" className="hidden lg:flex h-9 rounded-xl border-border/50 bg-background/50 font-bold text-xs uppercase tracking-wide px-4">
                  <History className="h-4 w-4 mr-2" /> Submissions
               </Button>
               <Separator orientation="vertical" className="h-6 mx-1 hidden lg:block" />
               <Button 
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="h-9 rounded-xl px-6 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/30"
               >
                  {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Solution <ChevronRight className="ml-2 h-4 w-4" />
               </Button>
            </div>
         </div>

         {/* Split Pane Integration */}
         <div className="flex-1 flex flex-col lg:flex-row ">

            {/* Left: Content Area */}
            <div className="w-full lg:w-2/5 flex flex-col border-r border-border/50 bg-background/40">
               <Tabs defaultValue="description" className="flex-1 flex flex-col">
                  <div className="px-6 pt-1 border-b border-border/10">
                     <TabsList className="bg-muted/40 p-1 rounded-xl">
                        <TabsTrigger value="description" className="text-[10px] uppercase tracking-wider font-black rounded-lg">Description</TabsTrigger>
                        <TabsTrigger value="solutions" className="text-[10px] uppercase tracking-wider font-black rounded-lg">Official Solution</TabsTrigger>
                        <TabsTrigger value="hints" className="text-[10px] uppercase tracking-wider font-black rounded-lg">Hints</TabsTrigger>
                     </TabsList>
                  </div>

                  <TabsContent value="description" className="flex-1 overflow-hidden m-0">
                     <ScrollArea className="h-full">
                        <div className="p-8 space-y-6">

                           <section className="space-y-1">
                              <h4 className=" font-black  tracking-widest text-indigo-500">Problem Statement</h4>
                              <div className="text-sm md:text-[13px] leading-relaxed text-muted-foreground/90 font-medium whitespace-pre-wrap">
                                 {question.description}
                              </div>
                           </section>

                           {question.examples && question.examples.length > 0 && (
                              <section className="space-y-6">
                                 <h4 className="text-sm font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                                    <Terminal className="h-4 w-4" /> Examples
                                 </h4>
                                 <div className="space-y-4">
                                    {question.examples.map((ex: any, i: number) => (
                                       <div key={i} className="group space-y-3">
                                          <div className="text-[10px] font-black text-muted-foreground uppercase px-2 mb-1">Case {i + 1}</div>
                                          <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 font-mono text-xs md:text-sm space-y-2 shadow-inner">
                                             <div className="flex gap-4">
                                                <span className="text-indigo-400 font-black">Input:</span>
                                                <span className="text-foreground/80">{ex.input}</span>
                                             </div>
                                             <div className="flex gap-4">
                                                <span className="text-emerald-400 font-black">Output:</span>
                                                <span className="text-foreground/80">{ex.output}</span>
                                             </div>
                                             {ex.explanation && (
                                                <div className="pt-1 border-t border-border/10">
                                                   <p className="text-muted-foreground text-[11px] italic leading-relaxed">{ex.explanation}</p>
                                                </div>
                                             )}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </section>
                           )}

                           {question.constraints && question.constraints.length > 0 && (
                              <section className="space-y-4">
                                 <h4 className="text-[12px] font-black uppercase tracking-widest text-indigo-500">Constraints</h4>
                                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {question.constraints.map((c: string, i: number) => (
                                       <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-muted/40 p-1   rounded-xl border border-border/40">
                                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                          {c}
                                       </li>
                                    ))}
                                 </ul>
                              </section>
                           )}
                        </div>
                     </ScrollArea>
                  </TabsContent>

                  <TabsContent value="solutions" className="p-8 text-center h-full flex flex-col items-center justify-center space-y-4">
                     <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-500">
                        <Trophy className="h-8 w-8" />
                     </div>
                     <h4 className="font-bold text-lg">Solution Unlocked?</h4>
                     <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                        Official solutions are unlocked after your first successful submission. Keep going!
                     </p>
                  </TabsContent>

                  <TabsContent value="hints" className="p-8 space-y-4">
                     <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <h5 className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase mb-2">
                           <Lightbulb className="h-4 w-4" /> Hint #1
                        </h5>
                        <p className="text-sm font-medium text-muted-foreground italic">
                           Consider using a Hash Map to store values as you iterate through the array.
                        </p>
                     </div>
                  </TabsContent>
               </Tabs>
            </div>

            {/* Right: Monaco Workspace */}
            <div className="flex-1 flex flex-col rounded-2xl min-h-[500px]">
               <MonacoCodeEditor
                  initialCode={question.starterCode}
                  language={question.language.toLowerCase()}
                  onChange={(newCode) => setCode(newCode)}
               />
            </div>
         </div>

      </div>
   )
}

function Separator({ orientation, className }: { orientation: string, className?: string }) {
   return <div className={`bg-border/50 ${orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full'} ${className}`} />
}
