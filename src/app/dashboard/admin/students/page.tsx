"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  MoreVertical,
  Download,
  ArrowUpDown,
  CheckCircle2,
  Clock
} from "lucide-react"

/**
 * Admin: Student Management Page.
 * Features a high-performance table for monitoring and managing student progress.
 */
export default function AdminStudentsPage() {

  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/admin/students")
        const data = await res.json()
        if (data.success) {
          setStudents(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch students", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Monitor and manage all enrolled students on the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
          <Button className="bg-primary hover:bg-primary/90">Add New Student</Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-md">
        <CardHeader className="border-b border-border/50 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students by name or email..." className="pl-10 bg-background/50" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter className="mr-2 h-3 w-3" /> Filters</Button>
              <Button variant="outline" size="sm"><ArrowUpDown className="mr-2 h-3 w-3" /> Sort</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b border-border/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Student</th>
                  <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Status</th>
                  <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Prep Progress</th>
                  <th className="h-12 px-6 text-left align-middle font-semibold text-muted-foreground">Last Activity</th>
                  <th className="h-12 px-6 text-right align-middle font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border/50 transition-colors hover:bg-accent/30 group">
                    <td className="p-6 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{student.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</span>
                          <span className="text-xs text-muted-foreground">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 align-middle">
                      <Badge
                        variant="secondary"
                        className={`
                          font-bold tracking-tight border-none
                          ${student.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                            student.status === 'At Risk' ? 'bg-red-500/10 text-red-500' : 'bg-muted/50 text-muted-foreground'}
                        `}
                      >
                        {student.status}
                      </Badge>
                    </td>
                    <td className="p-6 align-middle max-w-[200px]">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{student.progress}%</span>
                          {student.progress >= 90 && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${student.progress}%` }}
                            className={`h-full rounded-full ${student.progress >= 90 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-primary'}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-6 align-middle">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs font-medium">{student.lastActive}</span>
                      </div>
                    </td>
                    <td className="p-6 align-middle text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

