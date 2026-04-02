"use client"

import Editor from "@monaco-editor/react"
import { useState } from "react"

type Props = {
  starterCode?: string
}

export default function CodeEditor({ starterCode, language }: any) {
  return (
    <div className="h-full p-3 bg-background">

      {/* 🔥 Editor Container */}
      <div className="h-full rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition overflow-hidden">

        {/* 🔥 Top Bar */}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-muted/40">
          <span className="text-sm text-muted-foreground">
            Code Editor
          </span>

          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
            {language}
          </span>
        </div>

        {/* 🔥 Monaco Editor */}
        <Editor
          height="calc(100% - 40px)"
          theme="vs-dark"
          language={language}
          defaultValue={starterCode}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 10, bottom: 10 }, // 🔥 spacing inside editor
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
          }}
        />
      </div>
    </div>
  )
}