"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  FileText,
  BarChart3,
  Calendar,
  Sparkles,
  Search,
  Edit,
  Trash2,
  Loader2,
  Clock,
  Layout,
  Check
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminTestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<any>(null)

  // State for question assignment
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([])
  const [questionDateSort, setQuestionDateSort] = useState("NEWEST")
  const [questionSearch, setQuestionSearch] = useState("")
  const [questionCategory, setQuestionCategory] = useState("ALL")

  const queryClient = useQueryClient()

  // Fetch Tests
  const { data: testsResponse, isLoading: isLoadingTests } = useQuery({
    queryKey: ["admin-tests"],
    queryFn: async () => {
      const res = await api.get("/admin/tests")
      return res.data
    }
  })

  // Fetch Questions for assignment
  const { data: questionsResponse, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["admin-questions-all"],
    queryFn: async () => {
      const res = await api.get("/questions?limit=500") // Fetch more to ensure we get MCQs
      return res.data
    }
  })

  // Fetch Categories for filter
  const { data: categoriesResponse } = useQuery({
    queryKey: ["admin-categories", "v2"],
    queryFn: async () => {
      const res = await api.get("/categories")
      return res.data
    }
  })

  const tests = testsResponse?.data?.mockTests || []
  const allQuestions = questionsResponse?.data?.questions || []
  const categories = categoriesResponse?.data?.categories || []

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/admin/tests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] })
      toast.success("Test created successfully")
      setIsDialogOpen(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.patch("/admin/tests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] })
      toast.success("Test updated successfully")
      setIsDialogOpen(false)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/tests?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tests"] })
      toast.success("Test deleted successfully")
    }
  })

  const handleOpenDialog = (test: any = null) => {
    setEditingTest(test)
    if (test && test.questions) {
      setSelectedQuestions(test.questions.map((q: any) => q.id))
    } else {
      setSelectedQuestions([])
    }
    setQuestionDateSort("NEWEST")
    setQuestionSearch("")
    setQuestionCategory("ALL")
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as any

    data.questionIds = selectedQuestions

    if (editingTest) {
      updateMutation.mutate({ ...data, id: editingTest.id })
    } else {
      createMutation.mutate(data)
    }
  }

  const toggleQuestionSelection = (id: number) => {
    setSelectedQuestions(prev =>
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    )
  }

  const filteredTests = tests.filter((t: any) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredQuestions = useMemo(() => {
    let filtered = allQuestions.filter((q: any) => {
      const matchesSearch = q.title.toLowerCase().includes(questionSearch.toLowerCase()) ||
        (q.description && q.description.toLowerCase().includes(questionSearch.toLowerCase()));
      const matchesCategory = questionCategory === "ALL" || q.categoryId === parseInt(questionCategory);
      return matchesSearch && matchesCategory;
    })

    // Sort by date
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return questionDateSort === "NEWEST" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [allQuestions, questionSearch, questionDateSort, questionCategory])

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            Mock Tests
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] font-black uppercase">Admin</Badge>
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" /> Create and schedule high-impact mock tests for students.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 gap-2 shadow-xl shadow-primary/20 h-12 px-6 rounded-2xl">
          <Plus className="h-5 w-5" />
          Create Test
        </Button>
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden rounded-[2.5rem]">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by test title..."
              className="pl-11 bg-background/50 border-border/50 h-11 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50">
                <TableHead className="px-8 py-5">Test Title</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Total Questions</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead className="text-right px-8">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingTests ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="px-8"><div className="h-14 w-full bg-border/10 animate-pulse rounded-2xl" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-80 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <BarChart3 className="h-10 w-10" />
                      <p className="text-lg font-medium">No tests found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTests.map((test: any) => (
                  <TableRow key={test.id} className="group hover:bg-primary/[0.01] transition-colors border-border/50">
                    <TableCell className="px-8 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{test.title}</span>
                        {/* <span className="text-xs text-muted-foreground line-clamp-1 italic">{test.description || "Comprehensive evaluation"}</span> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/10 gap-1.5 px-2.5 py-1 rounded-lg">
                        <Clock className="h-3 w-3" />
                        {test.duration} mins
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-500/5 text-purple-400 border-purple-500/10 gap-1.5 px-2.5 py-1 rounded-lg">
                        <Layout className="h-3 w-3" />
                        {test.questions?.length || 0} Questions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 opacity-60" />
                        {new Date(test.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-1 opacity-100 sm:opacity-40 sm:group-hover:opacity-100 transition-all duration-300">
                        <Button onClick={() => handleOpenDialog(test)} variant="ghost" size="icon" className="h-10 w-10 rounded-full text-blue-500 hover:bg-blue-500/10 transition-colors">
                          <Edit className="h-4.5 w-4.5" />
                        </Button>
                        <Button
                          onClick={() => {
                            if (confirm("Confirm deletion of this test?")) {
                              deleteMutation.mutate(test.id)
                            }
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full text-red-500 hover:bg-red-500/10 transition-colors"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Trash2 className="h-4.5 w-4.5" />}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl bg-card border border-border shadow-xl rounded-xl p-0 overflow-hidden w-[95vw] max-h-[90vh] flex flex-col my-4">
          <div className="bg-muted/30 p-6 border-b border-border">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-0.5 text-left">
                  <DialogTitle className="text-xl font-semibold tracking-tight">{editingTest ? "Update Mock Test" : "Create Mock Test"}</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">Design a high-quality mock test experience for your students.</DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 p-6">
            <form id="test-form" onSubmit={handleSubmit} className="space-y-8">

              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="h-5 w-1 bg-primary rounded-full" /> Test Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Test Title</Label>
                    <Input id="title" name="title" defaultValue={editingTest?.title} placeholder="e.g. Frontend Engineering Mastery" className="h-11 rounded-lg" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Time Limit (Minutes)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="duration" name="duration" type="number" defaultValue={editingTest?.duration} placeholder="60" className="h-11 rounded-lg pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Passing Score (%)</Label>
                    <Input id="passingScore" name="passingScore" type="number" min="1" max="100" defaultValue={editingTest?.passingScore || 70} placeholder="70" className="h-11 rounded-lg" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Difficulty</Label>
                    <Select name="difficulty" defaultValue={editingTest?.difficulty || "MEDIUM"}>
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
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Overview / Description</Label>
                    <Textarea id="description" name="description" defaultValue={editingTest?.description} placeholder="Describe the focus and goals of this test..." className="min-h-[80px] rounded-lg resize-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Start Time (Optional)</Label>
                    <Input id="startTime" name="startTime" type="datetime-local" defaultValue={editingTest?.startTime ? new Date(editingTest.startTime).toISOString().slice(0, 16) : ""} className="h-11 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">End Time (Optional)</Label>
                    <Input id="endTime" name="endTime" type="datetime-local" defaultValue={editingTest?.endTime ? new Date(editingTest.endTime).toISOString().slice(0, 16) : ""} className="h-11 rounded-lg" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Max Attempts Allowed</Label>
                    <Input id="maxAttempts" name="maxAttempts" type="number" min="1" defaultValue={editingTest?.maxAttempts || 3} className="h-11 rounded-lg" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Terms & Conditions</Label>
                    <Textarea id="terms" name="terms" defaultValue={editingTest?.terms || "1. Do not exit fullscreen during the exam.\n2. Ensure a stable internet connection.\n3. The test will automatically submit when time expires."} placeholder="Exam rules and regulations..." className="min-h-[100px] rounded-lg resize-none" />
                  </div>
                </div>
              </div>

              {/* Question Assignment */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="h-5 w-1 bg-primary rounded-full" /> Assign Questions
                  </h3>
                  <Badge variant="secondary" className="font-semibold">{selectedQuestions.length} Selected</Badge>
                </div>

                <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-4">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search questions by title or description..."
                        className="h-10 pl-9 rounded-lg bg-background"
                        value={questionSearch}
                        onChange={e => setQuestionSearch(e.target.value)}
                      />
                    </div>
                    <Select value={questionCategory} onValueChange={setQuestionCategory}>
                      <SelectTrigger className="h-10 w-full sm:w-[150px] rounded-lg bg-background">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Topics</SelectItem>
                        {categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={questionDateSort} onValueChange={setQuestionDateSort}>
                      <SelectTrigger className="h-10 w-full sm:w-[140px] rounded-lg bg-background">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEWEST">Newest</SelectItem>
                        <SelectItem value="OLDEST">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question List */}
                  <div className="border border-border rounded-lg bg-background overflow-hidden">
                    <div className="h-[350px] overflow-y-auto">
                      {isLoadingQuestions ? (
                        <div className="flex items-center justify-center h-32">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : filteredQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
                          <FileText className="h-8 w-8 mb-2 opacity-20" />
                          No questions found
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {filteredQuestions.map((q: any) => {
                            const isSelected = selectedQuestions.includes(q.id)
                            return (
                              <div
                                key={q.id}
                                onClick={() => toggleQuestionSelection(q.id)}
                                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                              >
                                <div className={`mt-0.5 h-5 w-5 rounded border flex shrink-0 items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background'}`}>
                                  {isSelected && <Check className="h-3.5 w-3.5" />}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-semibold text-foreground leading-tight">{q.title}</p>
                                    <Badge variant="outline" className="shrink-0 text-[9px] uppercase tracking-wider">{q.category?.name || "Uncategorized"}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{q.description}</p>
                                  <div className="flex items-center gap-3 pt-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-muted/50 px-2 py-0.5 rounded-md">{q.type}</span>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider ${q.difficulty === 'EASY' ? 'text-green-500' :
                                        q.difficulty === 'MEDIUM' ? 'text-amber-500' : 'text-red-500'
                                      }`}>{q.difficulty}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>

          <div className="p-5 bg-muted/30 border-t border-border flex flex-col sm:flex-row gap-3 sm:justify-end items-center">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-lg px-6 w-full sm:w-auto h-10">Cancel</Button>
            </DialogClose>
            <Button
              form="test-form"
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white rounded-lg px-8 h-10 shadow-sm w-full sm:w-auto"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editingTest ? "Save Changes" : "Create Test"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
