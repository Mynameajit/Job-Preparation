"use client"

import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const data = [
  { name: "Arrays", value: 30 },
  { name: "Strings", value: 21 },
  { name: "Trees", value: 19 },
  { name: "Graphs", value: 17 },
  { name: "DP", value: 13 }
]

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899"
]

export function CategoryChart() {
      const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null   // 🔥 MUST



  return (
    <div className="p-6 rounded-xl border bg-card w-full h-full flex flex-col">

      <h2 className="font-semibold mb-4 shrink-0">
        Questions by Category
      </h2>

      <div className="flex-1 ">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={90}
              label
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}