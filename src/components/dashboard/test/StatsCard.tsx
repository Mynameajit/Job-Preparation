export function StatsCard({ title, value, sub }: any) {
  return (
    <div className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-muted-foreground">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}