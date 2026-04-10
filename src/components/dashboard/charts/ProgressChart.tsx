"use client"

import { useEffect, useState } from "react"
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart
} from "recharts"

export function ProgressChart({ data = [] }: { data?: any[] }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null // 🔥 MUST

  return (
    <div className="p-6 rounded-xl border bg-card w-full h-full flex flex-col">
      <h2 className="font-semibold mb-4 shrink-0">
        Progress Overview
      </h2>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="solved"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}