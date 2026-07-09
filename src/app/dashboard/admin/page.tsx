"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Activity, 
  BookOpen, 
  TrendingUp, 
  UserCheck,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Admin Dashboard Overview Page.
 * Specialized UI for administrators to monitor platform health and student progress.
 */
export default function AdminDashboardPage() {
  
  /**
   * Animation variants for premium entry
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  }

  const globalStats = [
    { title: "Total Students", value: "12,840", icon: Users, change: "+14%", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Prep Sessions", value: "2,420", icon: Activity, change: "+8%", color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Problems Solved", value: "842k", icon: BookOpen, change: "+24%", color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Placement Rate", value: "92.4%", icon: UserCheck, change: "+2%", color: "text-amber-500", bg: "bg-amber-500/10" }
  ]

  return (
    <motion.div 
      className="space-y-8 pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary fill-current" /> High-level overview of platform performance.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">Export Reports</Button>
           <Button className="bg-primary hover:bg-primary/90">Platform Settings</Button>
        </div>
      </motion.div>

      {/* Global Metrics Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {globalStats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs font-medium text-green-500 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> {stat.change} <span className="text-muted-foreground font-normal ml-1">since last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Complex Data Visualization Areas (Simulated) */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>User Growth Analysis</CardTitle>
            <CardDescription>Daily active users (DAU) over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-2 pt-6">
            {/* Simulated Bar Chart */}
            {[40, 60, 45, 80, 55, 90, 75, 40, 100, 85, 60, 70].map((height, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="w-full bg-primary/20 hover:bg-primary/50 rounded-t-sm transition-colors cursor-help"
                title={`Day ${i+1}: ${height * 10 } users`}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
             <CardTitle>Peak Activity Times</CardTitle>
             <CardDescription>Heatmap of system usage by hour of the day.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-6 grid grid-cols-6 grid-rows-4 gap-2">
            {/* Simulated Heatmap */}
            {Array.from({ length: 24 }).map((_, i) => {
              const opacities = [0.1, 0.2, 0.4, 0.7, 0.9, 0.8, 0.5, 0.3];
              const opacity = opacities[i % opacities.length];
              return (
                <div 
                  key={i} 
                  className="rounded-md transition-all duration-300"
                  style={{ backgroundColor: `rgba(var(--primary), ${opacity})` }} 
                />
              )
            })}
          </CardContent>
        </Card>
      </div>

    </motion.div>
  )
}
