import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RecentActivity({ results }: any) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <h3 className="font-semibold">Recent Activity</h3>

        {results?.map((r: any, i: number) => (
          <div key={i} className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.date}</p>
            </div>

            <div className="flex items-center gap-3">
              <span>{r.score}</span>
              <Button size="sm">View</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}