import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Trophy } from "lucide-react";

export default function StatsSection({ stats }: any) {
  if (!stats) return null;

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <StatCard title="Tests" value={stats.totalTests} icon={<BarChart />} />
      <StatCard title="Avg Score" value={stats.avgScore} icon={<BarChart />} />
      <StatCard title="Highest" value={stats.highestScore} icon={<Trophy />} />
      <StatCard title="Solved" value={stats.questionsSolved} icon={<BarChart />} />
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <h2 className="text-xl font-bold">{value}</h2>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}