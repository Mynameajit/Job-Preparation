import { Calendar } from "lucide-react"

export function UpcomingTests({ tests = [] }: { tests?: any[] }) {
  return (
    <div className="p-6 rounded-xl border bg-card h-full flex flex-col">
      <div className="flex justify-between mb-4 shrink-0">
        <h2 className="font-semibold">Upcoming Tests</h2>
        <button className="text-sm text-primary">View All</button>
      </div>
      <div className="space-y-4 overflow-auto flex-1">
        {tests && tests.length > 0 ? tests.map((test, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div className="flex gap-3 items-center">
              <Calendar size={18} />
              <div>
                <p className="text-sm font-medium">{test.title || "Scheduled Test"}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(test.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})}
                </p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-muted">
              {test.duration ? `${test.duration} min` : "N/A"}
            </span>
          </div>
        )) : (
          <p className="text-sm text-muted-foreground text-center mt-8">No upcoming tests</p>
        )}
      </div>
    </div>
  )
}