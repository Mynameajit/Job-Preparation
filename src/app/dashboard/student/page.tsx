"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  FileText,
  CheckCircle2,
  Code2,
  BrainCircuit,
  BarChart3,
  Activity,
  Loader2
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell
} from 'recharts'
import { useUser } from "@/hooks/api/useUser"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

function UpcomingTaskItem({ task, idx, router }: { task: any, idx: number, router: any }) {
  const [resumeTimeLeft, setResumeTimeLeft] = useState<number | null>(null)

  React.useEffect(() => {
    const startTimeStr = localStorage.getItem(`test_startTime_${task.id}`)
    if (startTimeStr) {
      const startTime = parseInt(startTimeStr, 10)
      const durationSeconds = task.duration * 60

      const updateTimer = () => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
        const remaining = durationSeconds - elapsedSeconds
        if (remaining > 0) {
          setResumeTimeLeft(remaining)
        } else {
          setResumeTimeLeft(0)
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [task.id, task.duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isResuming = resumeTimeLeft !== null && resumeTimeLeft > 0

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border relative overflow-hidden group cursor-pointer ${idx === 0 || isResuming ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-muted/30 border-border/50 opacity-80'}`} onClick={() => router.push(`/dashboard/student/mock-tests/${task.id}`)}>
      {(idx === 0 || isResuming) && <div className="absolute right-0 top-0 h-full w-1 bg-indigo-500 opacity-50" />}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${idx === 0 || isResuming ? 'bg-indigo-500/10 text-indigo-600' : 'bg-muted text-muted-foreground'}`}>
        {(idx === 0 || isResuming) ? <Clock className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-black mb-0.5">{task.title}</p>
        <p className="text-xs text-muted-foreground font-medium">{task.difficulty} Difficulty</p>
      </div>

      {isResuming ? (
        <div className="flex flex-col items-end gap-1">
          <Badge variant="default" className="bg-red-500 text-white font-black text-[9px] uppercase px-2 animate-pulse">Resume</Badge>
          <span className="text-[10px] font-bold text-red-500">{formatTime(resumeTimeLeft)}</span>
        </div>
      ) : idx === 0 ? (
        <Badge variant="default" className="bg-indigo-600 text-white font-black text-[9px] uppercase px-2">Take Now</Badge>
      ) : (
        <Badge variant="outline" className="text-[9px] uppercase font-black">Upcoming</Badge>
      )}
    </div>
  )
}

/**
 * Student Dashboard Overview Page.
 * Displays progress, statistics, analytics, and activity.
 */
export default function StudentDashboardPage() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const router = useRouter()

  const { data: dashboardResponse, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: async () => {
      const res = await api.get("/user/dashboard")
      return res.data
    }
  })

  const dashboard = dashboardResponse?.data

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  if (isUserLoading || isDashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const nextTestDate = dashboard?.stats?.nextTest
    ? new Date(dashboard.stats.nextTest.createdAt).toLocaleDateString(undefined, dateOptions)
    : "No Upcoming";

  const stats = [
    { title: "Preparation Score", value: `${dashboard?.stats?.prepScore || 0}%`, description: "Average across all tests", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Problems Solved", value: `${dashboard?.stats?.problemsSolved || 0}`, description: "Total correct answers", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Daily Streak", value: `${dashboard?.stats?.streak || 0} Days`, description: "Consecutive testing days", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Next Mock Test", value: nextTestDate, description: dashboard?.stats?.nextTest?.title || "All Caught Up!", icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" }
  ]

  const weeklyData = dashboard?.weeklyData || []
  const skillData = dashboard?.skillData || []
  const recentActivity = dashboard?.recentActivity || []
  const upcomingTasks = dashboard?.upcomingTasks || []

  return (
    <motion.div
      className="space-y-8 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl text-foreground">
          Welcome back, <span className="text-primary italic">{user?.data?.user?.name}!</span>
        </h1>
        <p className="text-muted-foreground text-xs">
          Your preparation analytics are looking sharp today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium uppercase tracking-wider">{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="text-[11px] text-muted-foreground mt-1 font-medium">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-7">

        {/* Performance Chart */}
        <Card className="lg:col-span-4 border-border/40 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" /> Weekly Solvability
              </CardTitle>
              <CardDescription>Number of problems solved in the last 7 days.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                  cursor={{ fill: '#88888810' }}
                />
                <Bar
                  dataKey="problems"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Radar Chart */}
        <Card className="lg:col-span-3 border-border/40 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-purple-500" /> Skill Distribution
            </CardTitle>
            <CardDescription>Overview of your current technical strengths.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] flex items-center justify-center pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#88888840" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Activity & Upcoming */}
      <div className="grid gap-6 lg:grid-cols-7">

        {/* Recent Activity */}
        <Card className="lg:col-span-4 border-border/40 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-xl">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Real-time updates of your progress.</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-indigo-500 font-bold uppercase text-[10px] tracking-widest">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 && (
                <div className="text-center p-6 text-muted-foreground border border-dashed rounded-xl">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-medium">No activity yet</p>
                </div>
              )}
              {recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors group cursor-pointer" onClick={() => router.push(`/dashboard/student/results/${activity.id}`)}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all ${activity.type === 'code' ? 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20' :
                      activity.type === 'test' ? 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20' :
                        'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20'
                      }`}>
                      {activity.type === 'code' ? <Code2 className="h-5 w-5" /> :
                        activity.type === 'test' ? <Target className="h-5 w-5" /> :
                          <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm tracking-tight">{activity.title}</h5>
                      <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {activity.score && <Badge variant="secondary" className="font-bold text-xs">{activity.score}</Badge>}
                    <CheckCircle2 className="h-4 w-4 text-emerald-500/50" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="lg:col-span-3 border-border/40 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pink-500" /> Upcoming Tasks
            </CardTitle>
            <CardDescription>Don't miss these scheduled activities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.length === 0 && (
              <div className="text-center p-6 text-muted-foreground border border-dashed rounded-xl">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">All caught up!</p>
              </div>
            )}
            {upcomingTasks.map((task: any, idx: number) => (
              <UpcomingTaskItem key={task.id} task={task} idx={idx} router={router} />
            ))}

            <Button className="w-full h-11 mt-4 rounded-xl bg-slate-900 border-border hover:bg-slate-800 font-bold uppercase tracking-widest text-xs" variant="secondary">
              View Calendar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

    </motion.div>
  )
}
