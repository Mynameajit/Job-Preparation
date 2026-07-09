"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  MessageSquare, 
  Video, 
  Terminal,
  Search,
  ArrowUpRight,
  BrainCircuit,
  Loader2,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"

export default function JobPrepPage() {
  const [activeQuestion, setActiveQuestion] = useState<{title: string, type: string} | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const tracks = [
    {
      id: "frontend",
      title: "Frontend Engineering",
      progress: 65,
      items: [
        { title: "HTML/CSS Mastery", completed: true, question: "How does the CSS box model work and what are its parts?" },
        { title: "JavaScript ES6+", completed: true, question: "Can you explain closures in JavaScript with an example?" },
        { title: "React Hooks", completed: true, question: "What is the difference between useEffect and useLayoutEffect?" },
        { title: "Next.js Core", completed: false, question: "Explain the difference between SSG and SSR in Next.js." },
        { title: "System Design", completed: false, question: "How would you design the frontend for a real-time chat application?" }
      ],
      icon: Terminal,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      glow: "shadow-[0_0_30px_rgba(56,189,248,0.15)]"
    },
    {
      id: "backend",
      title: "Backend Engineering",
      progress: 40,
      items: [
        { title: "Node.js Architecture", completed: true, question: "Explain the Node.js event loop and how it handles asynchronous operations." },
        { title: "SQL vs NoSQL", completed: true, question: "When would you choose a NoSQL database over a SQL database?" },
        { title: "API Design", completed: false, question: "What are the core principles of RESTful API design?" },
        { title: "Microservices", completed: false, question: "What are the main advantages and challenges of microservices architecture?" },
        { title: "Caching Strategies", completed: false, question: "Explain how Redis is used for caching and session management." }
      ],
      icon: BookOpen,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      glow: "shadow-[0_0_30px_rgba(52,211,153,0.15)]"
    }
  ]

  const behaviouralQs = [
    "Tell me about yourself.",
    "What is your biggest weakness?",
    "Describe a time you overcame a major technical challenge.",
    "Where do you see yourself in 5 years?"
  ]

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please type an answer before evaluating.")
      return
    }

    setIsEvaluating(true)
    setFeedback(null)

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuestion?.title,
          answer: userAnswer,
          topic: activeQuestion?.type || "General Software Engineering"
        })
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Evaluation failed")
      
      setFeedback(data.feedback)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsEvaluating(false)
    }
  }

  const closeDialog = () => {
    setActiveQuestion(null)
    setUserAnswer("")
    setFeedback(null)
  }

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Interview Roadmap</h1>
          <p className="text-slate-400">Track your progress and practice real questions interactively.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900">
             <Search className="mr-2 h-4 w-4" /> Find Jobs
           </Button>
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]">
             <BrainCircuit className="mr-2 h-4 w-4" /> Add Custom Track
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Domain Selection & Tracks */}
        <div className="xl:col-span-2 space-y-6">
          {tracks.map((track) => (
            <motion.div whileHover={{ y: -2 }} key={track.id} className="h-full">
              <Card className={`h-full border-slate-800/50 bg-slate-950/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-slate-700 ${track.glow}`}>
                <CardHeader className="flex flex-row items-center gap-5 border-b border-slate-800/50 bg-slate-900/50 p-6">
                  <div className={`${track.bg} ${track.color} p-4 rounded-2xl`}>
                    <track.icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <CardTitle className="text-xl text-slate-100">{track.title}</CardTitle>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-slate-700 text-slate-300 bg-slate-800/50">Core</Badge>
                    </div>
                    <CardDescription className="text-slate-400">Master the art of {track.title.toLowerCase()}</CardDescription>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className={`text-lg font-bold ${track.color} mb-2`}>{track.progress}%</span>
                    <Progress value={track.progress} className="h-2 w-[120px] bg-slate-800" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 gap-4">
                  {track.items.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveQuestion({ title: item.question, type: track.title })}
                      className="flex items-center gap-3 p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/80 cursor-pointer transition-colors group/item relative overflow-hidden"
                    >
                      {/* Active line indicator on hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />

                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-600 shrink-0 group-hover/item:text-indigo-400 transition-colors" />
                      )}
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${item.completed ? 'text-slate-300' : 'text-slate-100'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          Click to practice
                        </span>
                      </div>
                      <ArrowUpRight className="ml-auto h-4 w-4 text-slate-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sidebar: Resources & Mocks */}
        <div className="space-y-6">
          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-slate-950 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.05)]">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-400">
                  <MessageSquare className="h-5 w-5" />
                  Behavioural Prep
                </CardTitle>
                <CardDescription className="text-slate-400">Master "Soft Skill" questions.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                {behaviouralQs.map((q, i) => (
                  <Button 
                    key={i}
                    variant="outline" 
                    onClick={() => setActiveQuestion({ title: q, type: "Behavioural Interview" })}
                    className="w-full justify-start text-xs h-auto py-3.5 px-4 bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-left transition-all whitespace-normal"
                  >
                    <span className="text-indigo-500 font-bold mr-3">{i + 1}.</span> 
                    <span className="text-slate-200">{q}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -2 }}>
            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-slate-950 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.05)]">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-500">
                  <Video className="h-5 w-5" />
                  Live Mock Session
                </CardTitle>
                <CardDescription className="text-slate-400">Step into a real-time voice interview.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <p className="font-semibold text-amber-400 text-sm">Advanced AI Interviewer</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Experience a real-time, voice-enabled mock interview with instant AI feedback.</p>
                </div>
                <Link href="/dashboard/student/job-prep/interview" className="block w-full">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 border-none text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    Start Immersive Interview
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>

      {/* Practice Question Modal */}
      <Dialog open={!!activeQuestion} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-200 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                {activeQuestion?.type}
              </Badge>
              <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">Practice Mode</Badge>
            </div>
            <DialogTitle className="text-xl leading-snug">{activeQuestion?.title}</DialogTitle>
            <DialogDescription className="text-slate-400 pt-2">
              Take your time to think. Write your answer below as you would explain it in a real interview.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Textarea 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[150px] bg-slate-900 border-slate-800 focus-visible:ring-indigo-500 resize-none text-slate-200 placeholder:text-slate-600 p-4"
              disabled={isEvaluating || !!feedback}
            />
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm leading-relaxed text-emerald-100"
              >
                <div className="flex items-center gap-2 mb-2 font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> AI Feedback
                </div>
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter className="sm:justify-between flex-row items-center gap-3 mt-4">
            <Button variant="ghost" onClick={closeDialog} className="text-slate-400 hover:text-white hover:bg-slate-800">
              Close
            </Button>
            {!feedback && (
              <Button 
                onClick={handleEvaluate} 
                disabled={isEvaluating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
              >
                {isEvaluating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</>
                ) : (
                  "Evaluate Answer"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
