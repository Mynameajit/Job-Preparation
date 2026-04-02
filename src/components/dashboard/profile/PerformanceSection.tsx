import { Card, CardContent } from "@/components/ui/card";

export default function PerformanceSection({ stats }: any) {
  if (!stats) return null;

  const accuracy = stats.avgScore;

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <h3 className="font-semibold">Performance</h3>

        <div>
          <p className="text-sm">Accuracy</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-sm">Completion</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: "70%" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}