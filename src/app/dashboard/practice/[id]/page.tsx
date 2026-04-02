"use client";

import CodeEditor from "@/components/dashboard/practice/CodeEditor";
import QuestionLoading from "@/components/dashboard/practice/QuestionLoading";
import { Button } from "@/components/ui/button";
import { fetchSingleQuestion } from "@/feature/question/questionService";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router=useRouter()
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { singleQuestion, loading } = useAppSelector(
    (state) => state.question
  );

  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    if (!params?.id) return;
    dispatch(fetchSingleQuestion(params.id));
  }, [params.id]);

  // 🔥 starter code based on language
  const starterCodeMap: any = {
    javascript: `function solve(input){
  // your code here
}`,
    python: `def solve(input):
    # your code here
    pass`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

void solve(){
    
}`,
  };

  const starterCode = starterCodeMap[language];

  // 🔥 Run Code (dummy for now)
  const handleRun = () => {
    setOutput("Running...\nOutput will appear here");
  };

  const handleSubmit = () => {
    setOutput("Submitting...\nChecking all test cases...");
  };

  if (!singleQuestion) return<QuestionLoading/>;

  return (
    <div className="grid grid-cols-2 h-screen bg-background text-foreground">

      {/* LEFT PANEL */}
      <div className="p-6 overflow-y-auto border-r border-border space-y-6">

        {/* 🔥 Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-3">
            <div >
              <Button className="bg-transparent cursor-pointer " size="lg" onClick={() => router.back()}>
                <ArrowLeft className="text-violet-700 scale-150 " />
              </Button>
            </div>
            Q.  {singleQuestion.title}

            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${singleQuestion.difficulty === "easy"
                ? "bg-green-500/10 text-green-500"
                : singleQuestion.difficulty === "medium"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
                }`}
            >
              {singleQuestion.difficulty}
            </span>
          </h1>
        </div>

        {/* 🔥 Companies */}
        <div className="flex flex-wrap gap-2">
          {singleQuestion.companies?.map((c, i) => (
            <span
              key={i}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
            >
              {c}
            </span>
          ))}
        </div>

        {/* 🔥 Description */}
        <div className="rounded-xl p-4 border border-border bg-card shadow-sm hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
            📄 Problem Description
          </h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {singleQuestion.description}
          </p>
        </div>

        {/* 🔥 Example */}
        <div className="rounded-xl p-4 border border-border bg-card shadow-sm hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            🧪 Examples
          </h2>

          <div className="flex flex-col gap-4">
            {singleQuestion.testCases?.map((tc, i) => (
              <div
                key={i}
                className="bg-muted/40 border border-border rounded-lg p-3 text-sm shadow-inner"
              >
                <p>
                  <span className="font-semibold text-blue-500">Input:</span>{" "}
                  {tc.input}
                </p>
                <p>
                  <span className="font-semibold text-green-500">Output:</span>{" "}
                  {tc.output}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 Constraints */}
        <div className="rounded-xl p-4 border border-border bg-card shadow-sm hover:shadow-md transition">
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
            📏 Constraints
          </h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {singleQuestion.constraints}
          </p>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col h-full bg-background">

        {/* 🔥 Top Bar */}
        <div className="flex justify-between items-center p-4 border-b border-border  shadow-sm">

          <select
            className="border border-border bg-background px-3 py-1.5 rounded-md text-sm focus:outline-none"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          <div className="flex gap-2">
            <button
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition text-sm px-4 py-1.5 rounded-md shadow-sm hover:shadow-md"
            >
              🔄 Reset
            </button>

            <button
              onClick={handleRun}
              className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-1.5 rounded-md text-sm shadow-sm hover:shadow-md"
            >
              ▶ Run
            </button>

            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-1.5 rounded-md text-sm shadow-sm hover:shadow-md"
            >
              ✓ Submit
            </button>
          </div>
        </div>

        {/* 🔥 Editor */}
        <div className="flex-1">
          <CodeEditor starterCode={starterCode} language={language} />
        </div>

        {/* 🔥 Output */}
        <div className="h-44 border-t border-border p-4 bg-black text-green-400 text-sm overflow-auto">
          <p className="font-semibold mb-2 text-white">💻 Output:</p>
          <pre>{output}</pre>
        </div>

      </div>
    </div>
  );
}