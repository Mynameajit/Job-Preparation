"use client"

import React, { useState, useEffect, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
  Trophy,
  Activity,
  ArrowLeft,
  XCircle,
  Loader2,
  CheckCircle2,
  Maximize,
  Play,
  LogOut
} from "lucide-react"
import { notFound, useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function MockTestWorkspacePage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()

  const { data: testResponse, isLoading } = useQuery({
    queryKey: ["mock-test", id],
    queryFn: async () => {
      const res = await api.get(`/tests/${id}`)
      return res.data
    },
    retry: false
  })

  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  
  // Strict test state
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const isIntentionallyExiting = React.useRef(false)

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/tests/submit`, data)
      return res.data
    },
    onSuccess: (data) => {
      localStorage.removeItem(`test_answers_${id}`)
      localStorage.removeItem(`test_startTime_${id}`)
      
      // Exit fullscreen safely
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err))
      }
      
      const result = data?.data?.result;
      if (result) {
        toast.success(`Score: ${result.score}/${result.total}`)
      }
      router.push("/dashboard/student/mock-tests")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit test")
      setIsCompleted(false) // Allow them to try again if it failed
    }
  })

  const testInfo = testResponse?.data?.mockTest
  const questions = testInfo?.questions || []

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  
  // Track if they have started the test previously
  const [isResume, setIsResume] = useState(false)

  // Load state from local storage on mount
  useEffect(() => {
    if (!testInfo) return
    
    // Load Answers
    const savedAnswers = localStorage.getItem(`test_answers_${id}`)
    if (savedAnswers) {
      try { setAnswers(JSON.parse(savedAnswers)) } catch (e) {}
    }
    
    // Strict Timer checking
    const startTimeStr = localStorage.getItem(`test_startTime_${id}`)
    if (startTimeStr) {
      setIsResume(true)
      const startTime = parseInt(startTimeStr, 10)
      const durationSeconds = testInfo.duration * 60
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      const remaining = durationSeconds - elapsedSeconds
      
      if (remaining > 0) {
        setTimeLeft(remaining)
      } else {
        setTimeLeft(0)
      }
    } else {
      setTimeLeft(testInfo.duration ? testInfo.duration * 60 : 3600)
    }
  }, [testInfo, id])

  // Save answers to local storage continuously
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`test_answers_${id}`, JSON.stringify(answers))
    }
  }, [answers, id])

  const handleSubmit = (currentAnswers = answers) => {
    if (isCompleted || submitMutation.isPending) return

    setIsCompleted(true) // Prevent multiple submissions

    // convert local answers (idx) to {questionId: optionIndex}
    const submissionAnswers: Record<number, number> = {}
    Object.keys(currentAnswers).forEach((idxStr) => {
      const idx = parseInt(idxStr)
      if (questions[idx]) {
        const qId = questions[idx].id
        submissionAnswers[qId] = currentAnswers[idx]
      }
    })

    submitMutation.mutate({
      testId: id,
      answers: submissionAnswers
    })
  }

  // Strict Timer Tick Logic
  useEffect(() => {
    // Only run if test is active and not finished
    if (isCompleted || !testInfo || !isTestStarted || timeLeft === null) return
    
    let startTimeStr = localStorage.getItem(`test_startTime_${id}`)
    if (!startTimeStr) return; // Should not happen since we set it in startTest
    
    const startTime = parseInt(startTimeStr, 10)
    const durationSeconds = testInfo.duration * 60

    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      const remaining = durationSeconds - elapsedSeconds
      
      if (remaining <= 0) {
        clearInterval(timer)
        setTimeLeft(0)
        handleSubmit() // Auto submit when time runs out!
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isCompleted, testInfo, isTestStarted, answers, id]) // answers included so handleSubmit gets latest state

  useEffect(() => {
    const handleFullscreenChange = () => {
      // If we were in the test and the user exited fullscreen manually
      if (isTestStarted && !document.fullscreenElement && !isCompleted && !isIntentionallyExiting.current) {
        toast.warning("You exited Fullscreen mode. Your timer is still running in the background.")
        router.push("/dashboard/student/mock-tests")
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isTestStarted, isCompleted, router]);

  const startTest = () => {
    // Enforce Fullscreen on a specific container to hide global sidebars
    const elem = document.getElementById("test-workspace-container");
    if (elem?.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        toast.error("Please allow fullscreen mode for the best experience.")
      });
    }

    // Set strict start time if not existing
    if (!localStorage.getItem(`test_startTime_${id}`)) {
      localStorage.setItem(`test_startTime_${id}`, Date.now().toString())
    }
    setIsTestStarted(true)
    
    // Auto submit if they resume but time is already expired
    if (timeLeft !== null && timeLeft <= 0) {
      handleSubmit()
    }
  }

  const handleExitTest = async () => {
    isIntentionallyExiting.current = true;
    setShowExitDialog(false)
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(err => console.log(err))
    }
    router.push("/dashboard/student/mock-tests")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const answeredCount = Object.keys(answers).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!testInfo) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Test not found</h2>
          <Button onClick={() => router.push("/dashboard/student/mock-tests")}>Go Back</Button>
        </div>
      </div>
    )
  }

  // Main Render Wrapper
  return (
    <div id="test-workspace-container" className="bg-slate-50 w-full h-full flex flex-col items-center justify-center">
      {!isTestStarted ? (
        <div className="flex items-center justify-center w-full h-full min-h-[80vh]">
          <Card className="max-w-md w-full border-indigo-500/20 shadow-xl overflow-hidden">
            <div className="h-2 w-full bg-indigo-500" />
          <CardHeader className="text-center space-y-2 pb-4 pt-8">
            <div className="mx-auto bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              {isResume ? <Clock className="h-8 w-8 text-indigo-500" /> : <Play className="h-8 w-8 text-indigo-500 ml-1" />}
            </div>
            <CardTitle className="text-2xl">{isResume ? "Resume Mock Test" : "Ready to Start?"}</CardTitle>
            <CardDescription className="text-sm font-medium">
              {testInfo.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8">
            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Total Questions</span>
                <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Total Duration</span>
                <span className="font-bold">{testInfo.duration} minutes</span>
              </div>
              {isResume && (
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                  <span className="text-indigo-600 font-bold">Time Remaining</span>
                  <span className="font-black text-indigo-600">{timeLeft !== null ? formatTime(timeLeft) : "--:--"}</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground bg-amber-50 p-3 rounded-lg border border-amber-200/50 flex gap-2">
               <Maximize className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
               <p>This test requires <strong>Fullscreen mode</strong>. Please do not exit fullscreen or reload the page while testing.</p>
            </div>
            {testInfo.terms && (
              <div className="text-xs text-muted-foreground bg-slate-100 p-3 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-1">Terms & Conditions</h4>
                <div className="max-h-24 overflow-y-auto whitespace-pre-wrap pr-2">{testInfo.terms}</div>
              </div>
            )}
          </CardContent>
          <CardFooter className="px-8 pb-8 pt-2">
            <Button 
              onClick={startTest} 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              {isResume ? "Resume Fullscreen" : "Start Fullscreen Exam"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      ) : (
      <div className="flex w-full gap-6 h-screen md:h-[calc(100vh-2rem)] font-sans mt-0 p-4 max-w-[1600px] mx-auto overflow-hidden">
        <div className="w-[75%] flex flex-col h-full overflow-hidden">
          {/* 1. Refined Header */}
        <div className="px-10 pt-8 pb-4 space-y-2 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-[#4c1d95]">{testInfo.title}</h1>
            </div>
            <div className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-lg border ${timeLeft !== null && timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
              <Clock className="h-5 w-5" /> {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
            </div>
          </div>

          <div className="space-y-1.5 translate-y-1 mt-4">
            <p className="text-[10px] font-bold text-slate-400 capitalize flex justify-between">
              <span>Answered {answeredCount}/{questions.length}</span>
              <span>{Math.round(questions.length > 0 ? (answeredCount / questions.length) * 100 : 0)}% Completed</span>
            </p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7c3aed] transition-all duration-700 ease-out"
                style={{ width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Workspace Layout */}
        <div className="w-full flex flex-col lg:flex-row min-h-0 overflow-hidden px-10 gap-8 mt-4">
          {/* Left Side: Question Panel */}
          <div className="w-full flex flex-col h-full py-1 pr-4 overflow-hidden">
            <Card className="flex-1 border-slate-100/50 shadow-none rounded-[24px] overflow-hidden flex flex-col ">
              <ScrollArea className="flex-1 px-8 py-4">
                <AnimatePresence mode="wait">
                  {questions.length > 0 && currentIdx < questions.length ? (
                    <motion.div
                      key={currentIdx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-10"
                    >
                      <h3 className="text-[18px] font-semibold leading-[1.5]">
                        <span className="text-indigo-500 mr-2">Q{currentIdx + 1}.</span>
                        {questions[currentIdx].title}
                      </h3>
                      {questions[currentIdx].description && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {questions[currentIdx].description}
                        </p>
                      )}

                      <div className="space-y-4">
                        {questions[currentIdx].options ? (questions[currentIdx].options as any[]).map((option: any, idx: number) => {
                          const isSelected = answers[currentIdx] === idx
                          return (
                            <button
                              key={idx}
                              onClick={() => setAnswers({ ...answers, [currentIdx]: idx })}
                              className={`
                                    w-full p-4 rounded-[16px] border-2 text-left transition-all duration-300 font-semibold text-[15px] flex items-center gap-3
                                    ${isSelected
                                  ? ' border-[#7c3aed] bg-indigo-50/50 text-[#4c1d95] shadow-sm'
                                  : ' border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                                  `}
                            >
                              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#7c3aed]' : 'border-slate-300'}`}>
                                {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#7c3aed]" />}
                              </div>
                              {option.text || option}
                            </button>
                          )
                        }) : (
                          <p className="text-sm text-muted-foreground italic">No options available for this question type.</p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No questions found in this test.</p>
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>

              <div className="px-8 py-6 flex items-center justify-between border-t border-slate-50">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="h-11 px-6 font-bold text-slate-500 hover:text-slate-900 rounded-xl transition-colors text-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  onClick={() => currentIdx < questions.length - 1 && setCurrentIdx(prev => prev + 1)}
                  disabled={currentIdx === questions.length - 1 || questions.length === 0}
                  className="h-11 px-8 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-black/5 text-sm"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Side: Sidebar Information */}
      <div className="flex flex-col h-full overflow-hidden w-[25%] max-w-[320px]">
        <div className="space-y-6 flex flex-col h-full bg-white rounded-[24px] p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="space-y-2">
            <h4 className="text-[15px] font-bold text-slate-800 tracking-tight">Question Palette</h4>
            <div className="flex items-center gap-4 py-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#7c3aed]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full border-2 border-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Not Answered</span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="flex flex-wrap gap-2 p-1">
              {questions.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`
                            aspect-square h-[38px] w-[38px] rounded-xl font-bold transition-all text-sm flex items-center justify-center
                            ${answers[idx] !== undefined
                      ? 'bg-[#7c3aed] text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'}
                            ${idx === currentIdx ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110 z-10' : ''}
                          `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-3 pt-4 border-t border-slate-100 mt-auto">
            <Button
              variant="outline"
              onClick={() => setShowExitDialog(true)}
              className="w-full h-11 rounded-[12px] border-red-200 text-red-600 font-bold hover:bg-red-50 hover:text-red-700 transition-all text-xs"
            >
              <LogOut className="h-4 w-4 mr-2" /> Exit Test
            </Button>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              disabled={submitMutation.isPending || isCompleted}
              className="w-full h-12 py-1 rounded-[12px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              {submitMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Submit Exam
            </Button>
          </div>
        </div>
      </div>

      {/* Submission Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent container={typeof document !== 'undefined' ? document.getElementById("test-workspace-container") : null} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Final Answers?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? You have answered {answeredCount} out of {questions.length} questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                setShowSubmitDialog(false);
                handleSubmit();
              }} 
              disabled={submitMutation.isPending}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Exit Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent container={typeof document !== 'undefined' ? document.getElementById("test-workspace-container") : null} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Exit Test Without Submitting?</DialogTitle>
            <DialogDescription>
              If you exit now, your timer will <strong>continue running in the background</strong>. You can resume later, but you will lose time while you are gone!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleExitTest} 
              variant="destructive"
            >
              Yes, Exit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      )}
    </div>
  )
}
