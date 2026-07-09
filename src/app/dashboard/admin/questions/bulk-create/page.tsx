"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BrainCircuit, FileJson, Loader2, Save } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function BulkCreateQuestionsPage() {
  const [jsonInput, setJsonInput] = useState("[\n  {\n    \"title\": \"Example Question\",\n    \"slug\": \"example-question\",\n    \"description\": \"Brief description\",\n    \"type\": \"CODING\",\n    \"difficulty\": \"MEDIUM\",\n    \"categoryId\": 1,\n    \"content\": {\n      \"markdown\": \"Problem statement here\",\n      \"testCases\": []\n    }\n  }\n]")
  const router = useRouter()
  const queryClient = useQueryClient()

  const bulkCreateMutation = useMutation({
    mutationFn: (data: any) => api.post("/admin/questions/bulk", data),
    onSuccess: (res) => {
      toast.success(res.data.message || "Questions created successfully")
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] })
      router.push("/dashboard/admin/questions")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create questions")
    }
  })

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      if (!Array.isArray(parsed)) {
        toast.error("Input must be a JSON array")
        return
      }
      bulkCreateMutation.mutate({ questions: parsed })
    } catch (e) {
      toast.error("Invalid JSON format")
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/admin/questions")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Bulk Create Questions</h1>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-2 ml-12">
            <BrainCircuit className="h-4 w-4 text-primary" /> Create 10-20 questions at once using JSON format.
          </p>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={bulkCreateMutation.isPending}
          className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20"
        >
          {bulkCreateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Submit Questions
        </Button>
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden rounded-3xl">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            JSON Input
          </CardTitle>
          <CardDescription>
            Paste your array of questions in JSON format below. Ensure each object has title, slug, description, type, difficulty, and categoryId.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="font-mono text-sm min-h-[500px] bg-muted/10 border-border/50 rounded-xl focus-visible:ring-primary/20"
            placeholder="Paste your JSON array here..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
