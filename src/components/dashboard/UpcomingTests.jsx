import { Calendar } from "lucide-react"

export function UpcomingTests() {

  const tests = [
    {
      title: "JavaScript Fundamentals Test",
      time: "Tomorrow • 10:00 AM",
      duration: "60 min"
    },
    {
      title: "Data Structures Mock Test",
      time: "Mar 8 • 2:00 PM",
      duration: "90 min"
    },
    {
      title: "System Design Interview",
      time: "Mar 10 • 11:00 AM",
      duration: "45 min"
    }
  ]

  return (
    <div className="p-6 rounded-xl border bg-card h-full flex flex-col">

      <div className="flex justify-between mb-4 shrink-0">
        <h2 className="font-semibold">Upcoming Tests</h2>
        <button className="text-sm text-primary">View All</button>
      </div>

      <div className="space-y-4 overflow-auto flex-1">
        {tests.map((test, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div className="flex gap-3 items-center">
              <Calendar size={18} />
              <div>
                <p className="text-sm font-medium">{test.title}</p>
                <p className="text-xs text-muted-foreground">{test.time}</p>
              </div>
            </div>

            <span className="text-xs px-2 py-1 rounded bg-muted">
              {test.duration}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}