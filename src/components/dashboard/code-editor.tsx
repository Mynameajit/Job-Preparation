"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Play, RotateCcw, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * A sleek, lightweight Code Editor component for practice.
 * Uses a styled textarea with a simulated output window for premium look.
 */
export function CodeEditor({ 
  initialCode = "", 
  language = "javascript",
  onRun
}: { 
  initialCode?: string;
  language?: string;
  onRun?: (code: string) => void;
}) {
  const [code, setCode] = React.useState(initialCode)
  const [output, setOutput] = React.useState<string | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  // Update code when initialCode changes (e.g. when switching questions)
  React.useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  /**
   * Simulates code execution with a realistic delay and premium feedback.
   */
  const handleRunCode = () => {
    setIsRunning(true)
    setOutput(null)
    
    if (onRun) {
      onRun(code)
    }

    // Simulating thinking time and execution
    setTimeout(() => {
      setIsRunning(false)
      setOutput("Success: All test cases passed!\nRuntime: 12ms\nMemory: 4.2 MB")
    }, 1500)
  }

  /**
   * Copies code to clipboard
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full border border-border/50 rounded-xl overflow-hidden bg-slate-950 shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-border/30">
         <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-4">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400 capitalize">{language === 'javascript' ? 'solution.js' : `solution.${language}`}</span>
         </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={handleCopy}>
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => setCode(initialCode)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Code Input Area */}
      <div className="relative flex-1 group">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-sm resize-none outline-none focus:ring-0"
          style={{ lineHeight: "1.6" }}
        />
        
        {/* Line Numbers Simulation */}
        <div className="absolute left-0 top-0 w-10 h-full flex flex-col items-center pt-4 text-slate-600 text-xs font-mono select-none border-r border-slate-800/50 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="h-[1.6rem]">{i + 1}</span>
          ))}
        </div>
      </div>

      {/* Output Console & Controls */}
      <div className="bg-slate-900/80 border-t border-border/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Console Output</span>
          <Button 
            className="bg-green-600 hover:bg-green-500 text-white font-bold transition-all duration-300 transform active:scale-95"
            size="sm"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full" />
                Running...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Play className="h-3 w-3 fill-current" /> Run Simulation</span>
            )}
          </Button>
        </div>

        <div className={`
          min-h-[80px] p-3 rounded-lg font-mono text-sm transition-all duration-500
          ${output ? (output.includes("Success") ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20") : "bg-slate-950/50 text-slate-500 italic"}
        `}>
          {output || "Run your code to see the results here..."}
        </div>
      </div>
    </div>
  )
}
