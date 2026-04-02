export function ScheduleCard({ title, time, duration }: any) {
  return (
    <div className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition space-y-2">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{time}</p>
      <span className="text-xs bg-muted px-2 py-1 rounded">
        {duration}
      </span>
    </div>
  );
}