import { Clock } from "lucide-react"

export function RecentActivity({ activities = [] }) {
  const defaultActivities = [
    { title: "No recent activity found.", createdAt: new Date() }
  ]

  const displayActivities = activities && activities.length > 0 ? activities : defaultActivities;

  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const actDate = new Date(date);
    const diffTime = now.getTime() - actDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return `Today, ${actDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return `Yesterday, ${actDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    return actDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  };

  return (
    <div className="p-6 rounded-xl border bg-card h-full flex flex-col">
      <h2 className="font-semibold mb-4 shrink-0">
        Recent Activity
      </h2>
      <div className="space-y-4 overflow-auto flex-1">
        {displayActivities.map((item, i) => (
          <div key={i} className="flex gap-3 items-start">
            <Clock size={18} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(item.createdAt || new Date())}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}