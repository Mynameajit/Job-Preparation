"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Send, 
  Bot, 
  User,
  Loader2,
  CheckCircle2,
  PhoneOff
} from "lucide-react"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export default function InterviewSessionPage() {
  const router = useRouter()
  
  // Webcam states
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [camActive, setCamActive] = useState(true)
  const [micActive, setMicActive] = useState(true)

  // Interview States
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [phase, setPhase] = useState<"intro" | "questions" | "end">("intro")
  const [currentQIndex, setCurrentQIndex] = useState(-1) // -1 means intro
  
  // Collected Answers
  const [collectedAnswers, setCollectedAnswers] = useState<Array<{ questionId: number, answer: string }>>([])
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. Initialize Webcam
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error("Webcam access denied", err)
        toast.error("Please allow camera access for the interview.")
      }
    }
    startWebcam()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, []) // run once

  const toggleCam = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCamActive(videoTrack.enabled)
      }
    }
  }

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMicActive(audioTrack.enabled)
      }
    }
  }

  // 2. Fetch Questions
  const { data: questionsResponse, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["interview-questions"],
    queryFn: async () => {
      const res = await api.get("/interviews/questions")
      return res.data
    },
    retry: false
  })

  const questions = questionsResponse?.data?.questions || []

  // 3. Interview Flow logic
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (isLoadingQuestions) return;

    // Start Intro
    if (phase === "intro" && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([
          {
            id: Date.now().toString(),
            sender: "bot",
            text: "Hello! Welcome to your AI Mock Interview. I am Sarah, your technical interviewer today. To get started, could you please introduce yourself?"
          }
        ])
      }, 2000)
    }
  }, [phase, messages.length, isLoadingQuestions])

  const askNextQuestion = () => {
    const nextIdx = currentQIndex + 1
    if (nextIdx < questions.length) {
      setCurrentQIndex(nextIdx)
      setPhase("questions")
      const q = questions[nextIdx]
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: "bot",
          text: `${q.title}\n${q.description || ''}`
        }])
      }, 1500)
    } else {
      setPhase("end")
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: "bot",
          text: "Thank you for your time. You have answered all the questions. I am now submitting your responses for review..."
        }])
        submitInterview()
      }, 2000)
    }
  }

  const handleSendMessage = () => {
    if (!inputText.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim()
    }
    setMessages(prev => [...prev, userMessage])
    setInputText("")
    setIsTyping(true) // Start bot typing indicator

    // Save answer
    if (phase === "questions" && currentQIndex >= 0 && currentQIndex < questions.length) {
      const q = questions[currentQIndex]
      setCollectedAnswers(prev => [...prev, { questionId: q.id, answer: userMessage.text }])
    }

    // Move to next step
    setTimeout(() => {
      askNextQuestion()
    }, 1000)
  }

  // 4. Submit logic
  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/interviews/submit`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Interview submitted successfully!")
      setTimeout(() => {
        router.push("/dashboard/student/job-prep")
      }, 2000)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit interview")
    }
  })

  const submitInterview = () => {
    submitMutation.mutate({ answers: collectedAnswers })
  }
  
  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    router.push("/dashboard/student/job-prep")
  }

  if (isLoadingQuestions) {
    return <div className="flex items-center justify-center min-h-[80vh]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
  }

  return (
    <div className="flex w-full h-[calc(100vh-2rem)] gap-6 p-4 max-w-[1600px] mx-auto">
      
      {/* Left Panel: Video & Interviewer */}
      <div className="w-[45%] flex flex-col gap-6 h-full">
        {/* Interviewer Persona Card */}
        <Card className="bg-slate-900 border-none text-white overflow-hidden relative shadow-2xl rounded-3xl">
           {/* Abstract AI Background */}
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-50"></div>
           <CardContent className="p-8 flex items-center gap-6 relative z-10">
              <div className="relative">
                 <div className="h-20 w-20 rounded-full bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-400 p-1">
                   <div className="h-full w-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                     <Bot className="h-8 w-8 text-white" />
                   </div>
                 </div>
                 {isTyping && (
                   <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse"></span>
                 )}
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Sarah</h3>
                <p className="text-indigo-300 text-sm font-medium">Senior Engineering Manager (AI)</p>
                {isTyping ? (
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                     <Loader2 className="h-3 w-3 animate-spin" /> Analyzing & Typing...
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                     <CheckCircle2 className="h-3 w-3" /> Listening
                  </p>
                )}
              </div>
           </CardContent>
        </Card>

        {/* Student Webcam */}
        <div className="flex-1 bg-black rounded-3xl overflow-hidden relative shadow-2xl border-4 border-slate-800">
           {/* Recording Dot */}
           <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
             <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
             <span className="text-white text-[10px] font-bold tracking-widest uppercase">REC</span>
           </div>

           {/* Video Element */}
           <video 
             ref={videoRef} 
             autoPlay 
             playsInline 
             muted 
             className={`w-full h-full object-cover ${!camActive ? 'hidden' : ''}`}
             style={{ transform: 'scaleX(-1)' }} // mirror effect
           />
           
           {!camActive && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-900">
               <User className="h-20 w-20 mb-4 opacity-50" />
               <p className="font-semibold uppercase tracking-widest text-sm">Camera Disabled</p>
             </div>
           )}

           {/* Controls overlay */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl p-3 rounded-full border border-white/10">
             <Button 
               size="icon" 
               onClick={toggleMic}
               variant={micActive ? "secondary" : "destructive"} 
               className="rounded-full h-12 w-12"
             >
               {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
             </Button>
             <Button 
               size="icon" 
               onClick={toggleCam}
               variant={camActive ? "secondary" : "destructive"} 
               className="rounded-full h-12 w-12"
             >
               {camActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
             </Button>
             <Button 
               size="icon" 
               onClick={handleEndCall}
               variant="destructive" 
               className="rounded-full h-12 w-12 ml-2"
             >
               <PhoneOff className="h-5 w-5" />
             </Button>
           </div>
        </div>
      </div>

      {/* Right Panel: Chat Interface */}
      <Card className="w-[55%] h-full flex flex-col shadow-2xl border-slate-200 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6 flex flex-row items-center justify-between">
           <div>
             <CardTitle className="text-lg font-bold text-slate-800">Interview Transcript</CardTitle>
             <p className="text-xs text-muted-foreground font-medium mt-1">Please answer clearly and concisely in the chat below.</p>
           </div>
           {phase !== "intro" && phase !== "end" && (
             <div className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full">
               Question {currentQIndex + 1} of {questions.length}
             </div>
           )}
        </CardHeader>
        
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
           <div className="space-y-6 max-w-2xl mx-auto w-full">
             <AnimatePresence>
               {messages.map((msg) => (
                 <motion.div 
                   key={msg.id}
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                 >
                   <div className={`
                     max-w-[80%] rounded-2xl p-4 text-[15px] leading-relaxed
                     ${msg.sender === 'user' 
                       ? 'bg-indigo-600 text-white rounded-tr-sm' 
                       : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200'}
                   `}>
                     {msg.text.split('\n').map((line, i) => (
                       <React.Fragment key={i}>
                         {line}
                         {i !== msg.text.split('\n').length - 1 && <br />}
                       </React.Fragment>
                     ))}
                   </div>
                 </motion.div>
               ))}
               
               {isTyping && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex justify-start"
                 >
                   <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 w-16">
                     <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                     <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                     <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
           <div className="relative max-w-2xl mx-auto">
             <Textarea 
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder={isTyping ? "Wait for interviewer..." : "Type your answer here..."}
               className="min-h-[80px] resize-none pr-16 bg-white border-slate-200 focus-visible:ring-indigo-500 rounded-2xl text-[15px]"
               disabled={isTyping || phase === "end"}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault()
                   handleSendMessage()
                 }
               }}
             />
             <Button 
               onClick={handleSendMessage}
               disabled={!inputText.trim() || isTyping || phase === "end"}
               className="absolute bottom-3 right-3 h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 p-0 shadow-md"
             >
               <Send className="h-4 w-4" />
             </Button>
           </div>
           <p className="text-center text-[10px] text-muted-foreground mt-2 font-medium">Press Enter to send, Shift+Enter for new line.</p>
        </div>
      </Card>

    </div>
  )
}
