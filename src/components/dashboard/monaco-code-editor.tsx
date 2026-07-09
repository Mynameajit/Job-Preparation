"use client"

import React, { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { motion } from "framer-motion"
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Settings,
  Terminal,
  Cpu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import { ScrollArea as ShadcnScrollArea } from "@/components/ui/scroll-area"

interface MonacoCodeEditorProps {
  initialCode?: string;
  language?: string;
  onRun?: (code: string) => void;
  onChange?: (code: string) => void;
  showLanguageSelector?: boolean;
  flex?: boolean
}

/**
 * A professional, full-featured Code Editor using Monaco (VS Code core).
 */
export const CODE_TEMPLATES: Record<string, string> = {
  javascript: `// JavaScript Scratchpad
function main() {
  console.log("Hello World!");
}

main();`,
  typescript: `// TypeScript Scratchpad
const greeting: string = "Hello World!";
console.log(greeting);`,
  python: `# Python Scratchpad
def main():
    print("Hello World!")

if __name__ == "__main__":
    main()`,
  java: `// Java Scratchpad
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
  cpp: `// C++ Scratchpad
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`
};

export function MonacoCodeEditor({
  initialCode = "",
  language = "javascript",
  onRun,
  onChange,
  showLanguageSelector = true,
  flex = false
}: MonacoCodeEditorProps) {
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [codes, setCodes] = useState<Record<string, string>>({
    [language]: initialCode || CODE_TEMPLATES[language] || ""
  })
  const [output, setOutput] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { theme } = useTheme()

  const currentCode = codes[currentLanguage] ?? (CODE_TEMPLATES[currentLanguage] || "");

  useEffect(() => {
    if (initialCode) {
      setCodes(prev => ({ ...prev, [language]: initialCode }))
    }
  }, [initialCode, language])

  const handleLanguageChange = (newLang: string) => {
    setCurrentLanguage(newLang)
    if (codes[newLang] === undefined) {
      setCodes(prev => ({ ...prev, [newLang]: CODE_TEMPLATES[newLang] || "" }))
    }
  }

  const handleCodeChange = (newCode: string) => {
    setCodes(prev => ({ ...prev, [currentLanguage]: newCode }))
    if (onChange) onChange(newCode)
  }

  const handleRunCode = async () => {
    if (!currentCode.trim()) return;

    setIsRunning(true)
    setOutput("Executing...")

    if (onRun) {
      onRun(currentCode)
    }

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: currentLanguage,
          code: currentCode
        })
      });

      const data = await response.json();
      
      let out = "";
      if (response.ok) {
        if (data.stdout) out += data.stdout;
        if (data.stderr) out += `\nError Output:\n${data.stderr}`;
        if (!data.stdout && !data.stderr) out = "Execution completed successfully without output.";
        
        setOutput(`[${new Date().toLocaleTimeString()}] Execution Finished.\n\n${out.trim()}`);
      } else {
        out = data.error || data.stderr || "Failed to execute code";
        if (data.stderr) out += `\n${data.stderr}`;
        if (data.stdout) out += `\n${data.stdout}`;
        setOutput(`[${new Date().toLocaleTimeString()}] Error:\n${out}`);
      }
    } catch (error) {
      setOutput(`[${new Date().toLocaleTimeString()}] Error: Could not reach execution server.`);
    } finally {
      setIsRunning(false);
    }
  }

  const handleReset = () => {
    setCodes(prev => ({ ...prev, [currentLanguage]: CODE_TEMPLATES[currentLanguage] || "" }))
    setOutput(null)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const getLanguageDetails = (lang: string) => {
    switch(lang) {
      case 'javascript': return 'Node.js';
      case 'typescript': return 'TypeScript';
      case 'python': return 'Python';
      case 'java': return 'Java';
      case 'cpp': return 'C++';
      default: return 'Node.js';
    }
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/50 overflow-hidden backdrop-blur-xl">

      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/30">
        <div className="flex items-center gap-4">
          {showLanguageSelector && (
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-8 w-[140px] bg-background/50 border-border/40 text-xs font-mono">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="hidden md:flex items-center gap-1 text-[10px] text-muted-foreground font-mono bg-background/40 px-2 py-1 rounded-md">
            <Cpu className="h-3 w-3" />
            <span>{getLanguageDetails(currentLanguage)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleCopy}>
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <Button
            className="h-8 bg-green-600 hover:bg-green-500 text-white font-bold transition-all px-4"
            disabled={isRunning}
            onClick={handleRunCode}
          >
            {isRunning ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <Play className="h-3.5 w-3.5 mr-2 fill-current" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Editor Workspace */}
      <div className={`flex flex-1 relative min-h-0 ${flex ? 'flex-row' : 'flex-col'}`}>
        <div className={`${flex ? 'flex-[0.75] min-w-0' : 'flex-1'}`}>
          <Editor
            height="100%"
            language={currentLanguage === 'cpp' ? 'cpp' : currentLanguage}
            value={currentCode}
            theme={theme === "dark" ? "vs-dark" : "light"}
            onChange={(value) => handleCodeChange(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              fontFamily: "var(--font-geist-mono)",
              lineHeight: 1.6,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              }
            }}
          />
        </div>

        {/* Console Output Area */}
        <div className={`
           flex flex-col transition-all duration-300
          ${flex ? 'w-[20%] min-w-[250px] border-l border-border/30' : 'h-[200px] border-t border-border/30'}
        `}>
          <div className="flex items-center gap-2 px-4 py-2">
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Console Output</span>
          </div>
          <ScrollArea className="flex-1 p-4">
            <pre className={`font-mono text-xs leading-relaxed whitespace-pre-wrap ${output ? 'text-slate-200' : 'text-slate-500 italic'}`}>
              {output || "Output will be displayed here after you run your code..."}
            </pre>
          </ScrollArea>
        </div>
      </div>

    </div>
  )
}

function Separator({ orientation, className }: { orientation: string, className?: string }) {
  return <div className={`bg-border/50 ${orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full'} ${className}`} />
}

function ScrollArea({ children, className }: { children: React.ReactNode, className?: string }) {
  return <ShadcnScrollArea className={className}>{children}</ShadcnScrollArea>
}
