"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { MonacoCodeEditor } from '@/components/dashboard/monaco-code-editor'
import { BrainCircuit, Info, Sparkles } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/**
 * Professional Coding Scratchpad / Practice Page.
 * Specialized for free-form coding and experimentation.
 */
const CodingPracticePage = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4 pb-4 overflow-hidden">

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Coding Preactic</h1>
          </div>
          <p className="text-muted-foreground text-sm ml-10">
            Write, test, and prototype your logic in a professional IDE environment.
          </p>
        </div>

        <Alert className="max-w-md bg-indigo-500/5 border-indigo-500/10 hidden lg:flex">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <div className="ml-2">
            <AlertTitle className="text-xs font-black uppercase tracking-wider text-indigo-500">Fast Prototyping</AlertTitle>
            <AlertDescription className="text-[11px] font-medium">
              Select a language to load its starter template instantly.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {/* Main Workspace */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 min-h-0 rounded-2xl overflow-hidden"
      >
        <MonacoCodeEditor
          initialCode={""}
          language="javascript"
          flex={true}
        />
      </motion.div>


    </div>
  )
}

export default CodingPracticePage