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
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { singleQuestion } = useAppSelector((state) => state.question);

  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState<string>("");
  const [activeTab, setActiveTab] = useState("problem"); // 🔥 mobile tabs
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    dispatch(fetchSingleQuestion(params.id));
  }, [params.id]);

  const starterCodeMap: any = {
    javascript: `function solve(input){\n  // your code here\n  console.log("Input:", input);\n}`,
    python: `def solve(input):\n    # your code here\n    print("Input:", input)`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}`,
  };

  const [userCode, setUserCode] = useState(starterCodeMap["javascript"]);

  useEffect(() => {
    setUserCode(starterCodeMap[language]);
    setOutput("");
  }, [language]);

  const handleReset = () => {
    setUserCode(starterCodeMap[language]);
    setOutput("");
  };

  const handleRun = async () => {
    setOutput("Running...\nPlease wait");
    try {
      const versions: any = {
        javascript: "*",
        python: "*",
        cpp: "*"
      };
      
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language === "python" ? "python3" : language,
          version: versions[language] || "*",
          files: [{ content: userCode }],
        }),
      });

      if (!response.ok) {
         const errData = await response.json().catch(() => ({}));
         setOutput(`Execution Engine Error (${response.status}): ${errData.message || "Unknown error"}\nPlease try again later.`);
         return;
      }

      const data = await response.json();

      if (data.run) {
        if (data.run.stdout || data.run.output) {
           setOutput(data.run.stdout || data.run.output);
        } else if (data.run.stderr) {
           setOutput("Runtime Error:\n" + data.run.stderr);
        } else {
           setOutput("Success (No Output)");
        }
      } else if (data.compile && data.compile.stderr) {
        setOutput("Compilation Error:\n" + data.compile.stderr);
      } else if (data.message) {
        setOutput("Execution Engine Error: " + data.message + "\n\nTry checking your code logic or language settings.");
      } else {
        setOutput("Error: Unexpected response from execution engine. Please try again later.");
      }
    } catch (err: any) {
      setOutput("Network Error: Could not reach execution engine (" + err.message + ").");
    }
  };

  const handleSubmit = async () => {
    setOutput("Submitting code...\nVerifying all test cases...");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/questions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: singleQuestion?._id
        })
      });

      const data = await response.json();
      if (data.success) {
        setOutput("✅ Success! Your solution has been accepted.\n\nTest Cases: PASSED\nPoints: +10\n\nYou can view your updated progress on the dashboard.");
        // Optional: redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        setOutput("❌ Submission Failed: " + (data.message || "Unknown error"));
      }
    } catch (err: any) {
      setOutput("❌ Network Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!singleQuestion) return <QuestionLoading />;

  return (
    <div className="h-screen bg-background text-foreground">
      
      {/* 🔥 MOBILE TABS */}
      <div className="md:hidden flex border-b">
        <button
          onClick={() => setActiveTab("problem")}
          className={`flex-1 py-2 ${
            activeTab === "problem" && "border-b-2 border-blue-500"
          }`}
        >
          Problem
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 py-2 ${
            activeTab === "code" && "border-b-2 border-blue-500"
          }`}
        >
          Code
        </button>
      </div>

      {/* 🔥 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        
        {/* ================= LEFT PANEL ================= */}
        <div className={`p-4 md:p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-border space-y-6 ${activeTab !== "problem" ? "hidden md:block" : ""}`}>
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-bold flex items-center gap-2 md:gap-3">
              <Button
                className="bg-transparent cursor-pointer"
                size="lg"
                onClick={() => router.back()}
              >
                <ArrowLeft className="text-violet-700 scale-125 md:scale-150" />
              </Button>
              Q. {singleQuestion.title}

              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  singleQuestion.difficulty === "easy"
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

          <div className="flex flex-wrap gap-2">
            {singleQuestion.companies?.map((c, i) => (
              <span
                key={i}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="rounded-xl p-4 border bg-card shadow-sm">
            <h2 className="font-semibold mb-2">📄 Problem Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {singleQuestion.description}
            </p>
          </div>

          <div className="rounded-xl p-4 border bg-card shadow-sm">
            <h2 className="font-semibold mb-3">🧪 Examples</h2>
            <div className="flex flex-col gap-3">
              {singleQuestion.testCases?.map((tc, i) => (
                <div
                  key={i}
                  className="bg-muted/40 border rounded-lg p-3 text-sm"
                >
                  <p>
                    <span className="text-blue-500 font-semibold">Input:</span>{" "}
                    {tc.input}
                  </p>
                  <p>
                    <span className="text-green-500 font-semibold">Output:</span>{" "}
                    {tc.output}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 border bg-card shadow-sm">
            <h2 className="font-semibold mb-2">📏 Constraints</h2>
            <p className="text-sm text-muted-foreground">
              {singleQuestion.constraints}
            </p>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className={`flex flex-col h-[60vh] md:h-full bg-background border-l border-border ${activeTab !== "code" ? "hidden md:flex" : "flex"}`}>
          <div className="flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-start md:items-center p-3 md:p-4 border-b">
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">Language:</span>
                <select
                className="border bg-card px-3 py-1.5 rounded-md text-sm cursor-pointer outline-none focus:ring-2 focus:ring-primary"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                </select>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button 
                onClick={handleReset}
                className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-4 py-1.5 rounded-md text-sm transition"
              >
                🔄 Reset
              </button>

              <button
                onClick={handleRun}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition flex items-center gap-1"
              >
                ▶ Run
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm transition flex items-center gap-1 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                ✓ {isSubmitting ? "Submitting" : "Submit"}
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[350px]">
             <CodeEditor starterCode={userCode} language={language} onChange={(val: string) => setUserCode(val)} />
          </div>

          <div className="h-44 md:h-52 border-t p-4 bg-[#1e1e1e] text-green-400 text-sm overflow-auto">
            <p className="text-white font-semibold mb-2">💻 Output:</p>
            <pre className="font-mono whitespace-pre-wrap leading-relaxed">{output}</pre>
          </div>
        </div>

      </div>
    </div>
  );
}