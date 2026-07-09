"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Code,
  ListChecks,
  MessageSquare,
  ChevronRight,
  BrainCircuit,
  Trash2,
  Edit,
  Loader2,
  Settings2,
  FileJson,
  Check
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminQuestionsPage() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  
  // Dynamic form states
  const [selectedType, setSelectedType] = useState("CODING")
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  
  // MCQ states
  const [mcqOptions, setMcqOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ])

  // Coding states
  const [markdown, setMarkdown] = useState("")
  const [testCases, setTestCases] = useState("")

  const queryClient = useQueryClient()

  // Fetch Questions
  const { data: questionsResponse, isLoading, isFetching } = useQuery({
    queryKey: ["admin-questions", page, activeSearch, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("limit", "15")
      if (activeSearch) params.append("search", activeSearch)
      if (typeFilter !== "ALL") params.append("type", typeFilter)
      
      const res = await api.get(`/admin/questions?${params.toString()}`)
      return res.data
    }
  })

  // Fetch Categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ["admin-categories", "v2"],
    queryFn: async () => {
      const res = await api.get("/categories")
      return res.data
    }
  })

  console.log("categoriesResponse:", categoriesResponse)
  const categories = categoriesResponse?.data?.categories || []
  const questions = questionsResponse?.data?.questions || []
  const pagination = questionsResponse?.data?.pagination

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/admin/questions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] })
      toast.success("Question created successfully")
      setIsDialogOpen(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.patch("/admin/questions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] })
      toast.success("Question updated successfully")
      setIsDialogOpen(false)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/questions?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] })
      toast.success("Question deleted successfully")
    }
  })

  const handleOpenDialog = (question: any = null) => {
    setEditingQuestion(question)
    
    if (question) {
        setSelectedType(question.type || "CODING")
        setSelectedCategoryId(question.categoryId?.toString() || "")
        
        if (question.type === "MCQ" && question.options) {
            setMcqOptions(question.options)
        } else {
            setMcqOptions([
                { text: "", isCorrect: true },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false }
            ])
        }

        if (question.content) {
            setMarkdown(question.content.markdown || "")
            setTestCases(question.content.testCases ? JSON.stringify(question.content.testCases, null, 2) : "")
        } else {
            setMarkdown("")
            setTestCases("")
        }
    } else {
        setSelectedType("CODING")
        setSelectedCategoryId(categories.length > 0 ? categories[0].id.toString() : "")
        setMcqOptions([
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ])
        setMarkdown("")
        setTestCases("")
    }
    
    setIsDialogOpen(true)
  }

  const handleMcqOptionChange = (index: number, text: string) => {
      const newOptions = [...mcqOptions]
      newOptions[index].text = text
      setMcqOptions(newOptions)
  }

  const setCorrectMcqOption = (index: number) => {
      const newOptions = mcqOptions.map((opt, i) => ({
          ...opt,
          isCorrect: i === index
      }))
      setMcqOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedCategoryId) {
        toast.error("Please select a category")
        return
    }

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as any

    data.categoryId = parseInt(selectedCategoryId)
    data.type = selectedType

    // Handle specific payload formats based on type
    if (selectedType === "MCQ") {
        data.options = mcqOptions
        data.content = {} // MCQs might not need detailed JSON content right now
    } else if (selectedType === "CODING") {
        let parsedTestCases = []
        try {
            if (testCases.trim()) {
                parsedTestCases = JSON.parse(testCases)
            }
        } catch (error) {
            toast.error("Test Cases must be valid JSON")
            return
        }
        data.content = {
            markdown: markdown,
            testCases: parsedTestCases
        }
    }

    if (editingQuestion) {
      updateMutation.mutate({ ...data, id: editingQuestion.id })
    } else {
      createMutation.mutate(data)
    }
  }

  const filteredQuestions = questions

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-primary" /> Manage and create interview & coding questions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => window.location.href = '/dashboard/admin/questions/bulk-create'} variant="outline" className="gap-2">
            <FileJson className="h-4 w-4" />
            Bulk Create
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Create Question
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden rounded-3xl">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                <div className="relative w-full max-w-sm flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or description..."
                    className="pl-10 pr-20 bg-background/50 border-border/50 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setActiveSearch(searchQuery)
                        setPage(1)
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    className="absolute right-1 h-8 rounded-lg"
                    onClick={() => {
                        setActiveSearch(searchQuery)
                        setPage(1)
                    }}
                  >
                     Search
                  </Button>
                </div>
                <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setPage(1); }}>
                  <SelectTrigger className="w-[180px] bg-background/50 rounded-xl">
                    <SelectValue placeholder="Filter Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="CODING">Coding</SelectItem>
                    <SelectItem value="MCQ">MCQ</SelectItem>
                    <SelectItem value="INTERVIEW">Interview</SelectItem>
                    <SelectItem value="THEORY">Theory</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">
                {filteredQuestions.length} Questions
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="w-[400px] px-6">Question Detail</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="px-6"><div className="h-14 w-full bg-border/10 animate-pulse rounded-xl" /></TableCell>
                  </TableRow>
                ))
              ) : filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-60 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <Search className="h-8 w-8" />
                      <p>No questions found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map((q: any) => (
                  <TableRow key={q.id} className="group hover:bg-primary/[0.02] transition-colors border-border/50">
                    <TableCell className="px-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">{q.title}</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-md">{q.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-bold text-[9px] px-2 py-0 bg-muted/50 border-border/50 uppercase tracking-wider">{q.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <DifficultyBadge difficulty={q.difficulty} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{q.category?.name || "Uncategorized"}</span>
                        <span className="text-[10px] text-muted-foreground">ID: {q.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                        <Button onClick={() => handleOpenDialog(q)} variant="ghost" size="icon" className="h-9 w-9 rounded-full text-blue-500 hover:bg-blue-500/10">
                          <Edit className="h-4.5 w-4.5" />
                        </Button>
                        <Button
                          onClick={() => {
                            if (confirm("Permanently delete this question?")) {
                              deleteMutation.mutate(q.id)
                            }
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-red-500 hover:bg-red-500/10"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4.5 w-4.5" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs font-medium text-muted-foreground">
            Showing page <span className="font-bold text-foreground">{pagination.page}</span> of <span className="font-bold text-foreground">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "ghost"}
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-lg ${page === i + 1 ? 'shadow-lg shadow-primary/20' : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl bg-card border border-border shadow-xl rounded-xl p-0 overflow-hidden w-[95vw] max-h-[90vh] flex flex-col my-4">
          <div className="bg-muted/30 p-6 border-b border-border">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div className="text-left space-y-0.5">
                  <DialogTitle className="text-xl font-semibold tracking-tight">{editingQuestion ? "Edit Question" : "Create New Question"}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">Fill in the details according to the platform standards.</DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="flex-1 p-6 overflow-y-auto min-h-0">
            <form id="question-form" onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Question Title</Label>
                    <Input id="title" name="title" defaultValue={editingQuestion?.title} placeholder="e.g. Implement a Debounce Function" className="h-11 rounded-lg" required />
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">URL Slug</Label>
                    <Input id="slug" name="slug" defaultValue={editingQuestion?.slug} placeholder="e.g. implement-debounce" className="h-11 rounded-lg" required />
                  </div>

                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category</Label>
                    <Select value={selectedCategoryId || undefined} onValueChange={setSelectedCategoryId}>
                      <SelectTrigger className="h-11 rounded-lg">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                          {categories.map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Question Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="h-11 rounded-lg border-primary/20 bg-primary/5">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CODING">Coding Assessment</SelectItem>
                        <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                        <SelectItem value="INTERVIEW">Interview Question</SelectItem>
                        <SelectItem value="THEORY">Theoretical Concept</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Difficulty Level</Label>
                    <Select name="difficulty" defaultValue={editingQuestion?.difficulty || "MEDIUM"}>
                      <SelectTrigger className="h-11 rounded-lg">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY" className="text-green-500 font-medium">Easy</SelectItem>
                        <SelectItem value="MEDIUM" className="text-amber-500 font-medium">Medium</SelectItem>
                        <SelectItem value="HARD" className="text-red-500 font-medium">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Brief Description</Label>
                    <Textarea id="description" name="description" defaultValue={editingQuestion?.description} placeholder="A short summary of the problem..." className="min-h-[80px] rounded-lg resize-none" required />
                  </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-6">
                   <div className="h-5 w-1 bg-primary rounded-full" /> Detailed Configuration
                </h3>

                <AnimatePresence mode="wait">
                    {selectedType === "CODING" && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Problem Markdown</Label>
                                <Textarea 
                                    value={markdown}
                                    onChange={(e) => setMarkdown(e.target.value)}
                                    placeholder="Write your problem statement in markdown here..." 
                                    className="min-h-[150px] font-mono text-sm rounded-lg border-dashed bg-muted/20" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Test Cases (JSON format)</Label>
                                <Textarea 
                                    value={testCases}
                                    onChange={(e) => setTestCases(e.target.value)}
                                    placeholder='[{"input": "1 2", "output": "3"}]' 
                                    className="min-h-[100px] font-mono text-sm rounded-lg border-dashed bg-muted/20" 
                                />
                            </div>
                        </motion.div>
                    )}

                    {selectedType === "MCQ" && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">MCQ Options</Label>
                                {mcqOptions.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div 
                                            onClick={() => setCorrectMcqOption(idx)}
                                            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${opt.isCorrect ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`}
                                        >
                                            {opt.isCorrect && <Check className="h-3 w-3" />}
                                        </div>
                                        <Input 
                                            value={opt.text}
                                            onChange={(e) => handleMcqOptionChange(idx, e.target.value)}
                                            placeholder={`Option ${idx + 1}`}
                                            className={`flex-1 h-11 ${opt.isCorrect ? 'border-primary/40 bg-primary/5' : ''}`}
                                            required={selectedType === "MCQ"}
                                        />
                                    </div>
                                ))}
                                <p className="text-[10px] text-muted-foreground mt-2 italic">Select the radio circle to mark the correct option.</p>
                            </div>
                        </motion.div>
                    )}
                    
                    {(selectedType === "INTERVIEW" || selectedType === "THEORY") && (
                         <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="p-6 bg-muted/20 rounded-xl border border-dashed text-center text-muted-foreground text-sm"
                        >
                            No specific format required for {selectedType.toLowerCase()} questions. 
                            The brief description above will be used as the problem statement.
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>

            </form>
          </div>

          <div className="p-5 bg-muted/30 border-t border-border flex flex-col sm:flex-row gap-3 sm:justify-end items-center">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-lg px-6 w-full sm:w-auto h-10">Cancel</Button>
            </DialogClose>
            <Button
              form="question-form"
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white rounded-lg px-8 h-10 shadow-sm w-full sm:w-auto"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editingQuestion ? "Update Question" : "Publish Question"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    EASY: "text-green-500 bg-green-500/10 border-green-500/20",
    MEDIUM: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    HARD: "text-red-500 bg-red-500/10 border-red-500/20",
  }
  return (
    <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-tighter ${colors[difficulty]}`}>
      {difficulty}
    </Badge>
  )
}
