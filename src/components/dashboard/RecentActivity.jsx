import { Clock } from "lucide-react"

export function RecentActivity() {

  const activities = [
    { text: "Completed 'Two Sum' problem", time: "2 hours ago" },
    { text: "Attempted Mock Test #18", time: "5 hours ago" },
    { text: "Reviewed React Interview Questions", time: "1 day ago" },
    { text: "Updated Resume", time: "2 days ago" },
    { text: "Solved 5 problems in Arrays category", time: "3 days ago" }
  ]

  return (
    <div className="p-6 rounded-xl border bg-card h-full flex flex-col">

      <h2 className="font-semibold mb-4 shrink-0">
        Recent Activity
      </h2>

      <div className="space-y-4 overflow-auto flex-1">
        {activities.map((item, i) => (
          <div key={i} className="flex gap-3 items-start">
            <Clock size={18} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{item.text}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}