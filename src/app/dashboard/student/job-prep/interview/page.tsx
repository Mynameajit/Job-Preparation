"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Square, Play, Loader2, Volume2, VolumeX, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Message {
  role: 'user' | 'ai'
  content: string
}

export default function MockInterviewPage() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }
          
          setCurrentTranscript(interimTranscript)
          
          if (finalTranscript) {
            handleUserMessage(finalTranscript)
          }
        }

        recognitionRef.current.onend = () => {
          // Auto-restart if we are supposed to be active and not processing
          if (isActive && !isProcessing && !isAiSpeaking) {
             try {
                recognitionRef.current.start()
             } catch(e) {}
          } else {
            setIsListening(false)
          }
        }
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          if (event.error === 'not-allowed') {
            toast.error("Microphone access denied. Please allow microphone access to use this feature.")
            stopInterview()
          }
        }
      } else {
        toast.error("Speech Recognition is not supported in this browser. Please use Chrome or Edge.")
      }
    }
    
    return () => {
      stopInterview()
    }
  }, [isActive, isProcessing, isAiSpeaking])

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentTranscript])

  const handleUserMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    // Stop listening temporarily while processing
    if (recognitionRef.current) {
       recognitionRef.current.stop()
    }
    setIsListening(false)
    setCurrentTranscript("")

    const newMessages = [...messages, { role: 'user', content: trimmed } as Message]
    setMessages(newMessages)
    setIsProcessing(true)

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, topic: "Frontend Engineering" })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response")
      }
      
      const aiReply = data.reply
      setMessages(prev => [...prev, { role: 'ai', content: aiReply }])
      speakAiResponse(aiReply)
      
    } catch (error: any) {
      toast.error(error.message)
      setIsProcessing(false)
      // Resume listening if error
      if (isActive && recognitionRef.current) {
        try { recognitionRef.current.start() } catch(e) {}
        setIsListening(true)
      }
    }
  }

  const speakAiResponse = (text: string) => {
    if (!synthesisRef.current) return
    
    setIsAiSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Try to find a good English voice
    const voices = synthesisRef.current.getVoices()
    const preferredVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google')) || voices.find(v => v.lang.includes('en-'))
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
    
    utterance.rate = 1.0 // Normal speed
    utterance.pitch = 1.0
    
    utterance.onend = () => {
      setIsAiSpeaking(false)
      setIsProcessing(false)
      // Automatically resume listening after AI finishes speaking
      if (isActive && recognitionRef.current) {
        try {
           recognitionRef.current.start()
           setIsListening(true)
        } catch(e) {}
      }
    }
    
    synthesisRef.current.speak(utterance)
  }

  const startInterview = () => {
    setIsActive(true)
    setMessages([])
    
    // Initial greeting from AI
    const greeting = "Hello! I am your AI Interviewer. I'll be conducting your technical interview today. To start, could you please introduce yourself and tell me a bit about your background?"
    setMessages([{ role: 'ai', content: greeting }])
    speakAiResponse(greeting)
  }

  const stopInterview = () => {
    setIsActive(false)
    setIsListening(false)
    setIsAiSpeaking(false)
    setIsProcessing(false)
    
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col bg-[#0a0a0a] text-slate-100 rounded-3xl overflow-hidden border border-slate-800">
      
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 backdrop-blur-sm z-10">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Live AI Mock Interview
          </h1>
          <p className="text-slate-400 text-sm mt-1">Frontend Engineering Track</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()} className="border-slate-700 text-slate-300 hover:bg-slate-800">
            End Session
          </Button>
          {!isActive ? (
            <Button onClick={startInterview} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <Play className="mr-2 h-4 w-4" /> Start Interview
            </Button>
          ) : (
            <Button onClick={stopInterview} variant="destructive" className="bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <Square className="mr-2 h-4 w-4" /> Pause
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Side: Avatar/Visualizer */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r border-slate-800 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-[#0a0a0a]">
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer rings (Pulse when AI speaks) */}
            <AnimatePresence>
              {isAiSpeaking && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
                    className="absolute inset-0 rounded-full border border-purple-500/20"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Core Avatar */}
            <motion.div 
              animate={{ 
                scale: isAiSpeaking ? [1, 1.05, 1] : 1,
                boxShadow: isAiSpeaking 
                  ? ["0 0 20px rgba(99,102,241,0.2)", "0 0 40px rgba(99,102,241,0.6)", "0 0 20px rgba(99,102,241,0.2)"]
                  : "0 0 0px rgba(99,102,241,0)",
              }}
              transition={{ repeat: isAiSpeaking ? Infinity : 0, duration: 1 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg relative z-10"
            >
              <div className="w-28 h-28 rounded-full bg-slate-900 flex items-center justify-center">
                {isProcessing && !isAiSpeaking ? (
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                ) : (
                  <MessageSquare className="w-10 h-10 text-indigo-400" />
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-12 text-center z-10 h-20">
            {isAiSpeaking ? (
              <p className="text-indigo-400 font-medium animate-pulse">AI is speaking...</p>
            ) : isProcessing ? (
              <p className="text-slate-400 font-medium">AI is thinking...</p>
            ) : isListening ? (
              <div className="flex flex-col items-center">
                <span className="flex h-3 w-3 relative mb-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className="text-emerald-400 font-medium">Listening to you...</p>
              </div>
            ) : isActive ? (
              <p className="text-slate-500">Waiting...</p>
            ) : (
              <p className="text-slate-500">Click Start Interview to begin</p>
            )}
          </div>
        </div>

        {/* Right Side: Transcript */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-950/30">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 && !isActive && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-4">
                <MessageSquare className="w-12 h-12 opacity-20" />
                <p className="max-w-[250px]">Your conversation transcript will appear here.</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs font-semibold text-slate-500 mb-1 ml-1">
                  {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                </span>
                <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed text-[15px]">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Real-time speech transcript placeholder */}
            {currentTranscript && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-end"
              >
                <span className="text-xs font-semibold text-slate-500 mb-1 ml-1">You</span>
                <div className="px-5 py-3.5 rounded-2xl max-w-[85%] bg-indigo-600/50 text-white/70 rounded-br-none border border-indigo-500/30">
                  <p className="leading-relaxed text-[15px] italic">{currentTranscript}...</p>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Fallback Text Input (If they don't want to use voice) */}
          {isActive && (
            <div className="p-4 border-t border-slate-800 bg-slate-900">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = (e.target as any).message
                  if (input.value) {
                    handleUserMessage(input.value)
                    input.value = ''
                  }
                }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  name="message"
                  placeholder={isAiSpeaking ? "Wait for AI to finish..." : isProcessing ? "AI is typing..." : "Type your answer or speak..."}
                  disabled={isAiSpeaking || isProcessing}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  autoComplete="off"
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (isListening) {
                      recognitionRef.current?.stop()
                      setIsListening(false)
                    } else if (isActive && !isProcessing && !isAiSpeaking) {
                      try {
                        recognitionRef.current?.start()
                        setIsListening(true)
                      } catch(e) {}
                    }
                  }}
                  className={`h-auto aspect-square p-3 border-slate-700 hover:bg-slate-800 ${isListening ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-slate-400'}`}
                  title={isListening ? "Stop Listening" : "Start Listening"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isAiSpeaking || isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700 h-auto px-6 rounded-xl"
                >
                  Send
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
