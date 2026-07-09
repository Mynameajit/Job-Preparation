"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminResultsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const { data: resultsResponse, isLoading } = useQuery({
    queryKey: ["admin-results"],
    queryFn: async () => {
      const res = await api.get("/admin/results")
      return res.data
    }
  })

  const results = resultsResponse?.data?.results || []

  const filteredResults = React.useMemo(() => {
    return results.filter((result: any) => 
      result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [results, searchQuery])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Test <span className="text-primary italic">Results</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Monitor and manage all student test performances.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by student or test..." 
              className="pl-9 h-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-bold text-xs uppercase tracking-wider">Student</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Test Title</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Score</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Percentage</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Status</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No results found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((result: any) => (
                  <TableRow key={result.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground">{result.studentName}</span>
                        <span className="text-[10px] text-muted-foreground">{result.studentEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {result.testTitle}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {result.score} <span className="text-muted-foreground text-xs font-normal">/ {result.total}</span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {result.percentage.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={result.status === "Passed" ? "default" : "destructive"} className="uppercase text-[9px] font-black tracking-widest">
                        {result.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-medium">
                      {new Date(result.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
