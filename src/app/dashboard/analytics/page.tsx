"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, RadarChart,
    PolarGrid, PolarAngleAxis, Radar
} from "recharts"

const weeklyData = [
    { day: "Mon", value: 8 },
    { day: "Tue", value: 12 },
    { day: "Wed", value: 10 },
    { day: "Thu", value: 15 },
    { day: "Fri", value: 9 },
    { day: "Sat", value: 18 },
    { day: "Sun", value: 14 }
]

const monthlyData = [
    { month: "Jan", easy: 20, medium: 15, hard: 5 },
    { month: "Feb", easy: 30, medium: 20, hard: 8 },
    { month: "Mar", easy: 35, medium: 25, hard: 10 },
    { month: "Apr", easy: 40, medium: 30, hard: 12 },
    { month: "May", easy: 50, medium: 35, hard: 15 },
    { month: "Jun", easy: 60, medium: 45, hard: 18 }
]

const pieData = [
    { name: "Arrays", value: 25 },
    { name: "Strings", value: 18 },
    { name: "Trees", value: 16 },
    { name: "Graphs", value: 14 },
    { name: "DP", value: 11 },
    { name: "Others", value: 17 }
]

const radarData = [
    { subject: "DSA", value: 75 },
    { subject: "JavaScript", value: 85 },
    { subject: "React", value: 70 },
    { subject: "Node", value: 65 },
    { subject: "SQL", value: 60 },
    { subject: "System", value: 68 }
]

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899", "#64748B"]

export default function ProgressAnalytics() {
    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold">Progress Analytics</h1>
                <p className="text-muted-foreground text-sm">
                    Track your performance and improvement over time
                </p>
            </div>

            {/* TOP CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Problems", value: "234", sub: "+12 this week" },
                    { title: "Current Streak", value: "12 days", sub: "Best this week" },
                    { title: "Average Score", value: "78%", sub: "+5%" },
                    { title: "Rank", value: "#1,234", sub: "+150" }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="hover:shadow-lg transition">
                            <CardHeader>
                                <CardTitle className="text-sm">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h2 className="text-2xl font-bold">{item.value}</h2>
                                <p className="text-green-500 text-sm">{item.sub}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* CHARTS */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* WEEKLY */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} >
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    radius={[6, 6, 0, 0]}
                                    fill="#6366F1" // Indigo (best for UI)
                                    className="hover:opacity-80"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* MONTHLY */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area dataKey="easy" stackId="1" />
                                <Area dataKey="medium" stackId="1" />
                                <Area dataKey="hard" stackId="1" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>



            {/* LOWER SECTION */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* PIE */}
                <Card>
                    <CardHeader>
                        <CardTitle>Problems by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} dataKey="value">
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* RADAR */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <Radar dataKey="value" fill="#6366F1" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>

            {/* ACHIEVEMENTS */}
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    "100 Problems Solved",
                    "Weekly Warrior",
                    "Speed Demon"
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="p-4 hover:shadow-lg transition">
                            <h3 className="font-semibold">{item}</h3>
                            <p className="text-sm text-muted-foreground">
                                Achievement unlocked 🚀
                            </p>
                        </Card>
                    </motion.div>
                ))}
            </div>

        </div>
    )
}