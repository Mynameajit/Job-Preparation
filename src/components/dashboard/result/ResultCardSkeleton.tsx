import { Card, CardContent } from "@/components/ui/card";

export function ResultCardSkeleton() {
  return (
    <Card className="rounded-2xl border bg-muted/20 animate-pulse">
      <CardContent className="p-6 space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>

          <div className="h-6 w-14 bg-muted rounded-full" />
        </div>

        {/* SCORE */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-8 w-20 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>

          <div className="space-y-2 text-right">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-6 w-12 bg-muted rounded" />
          </div>
        </div>

        {/* PROGRESS */}
        <div className="h-2 w-full bg-muted rounded-full" />

        {/* BUTTONS */}
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 bg-muted rounded" />
          <div className="h-9 flex-1 bg-muted rounded" />
        </div>

      </CardContent>
    </Card>
  );
}


export function SummaryCardSkeleton() {
  return (
    <Card className="rounded-2xl border bg-muted/20 animate-pulse">
      <CardContent className="flex items-center justify-between p-5">

        <div className="space-y-2">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-6 w-12 bg-muted rounded" />
        </div>

        <div className="h-10 w-10 bg-muted rounded-xl" />
      </CardContent>
    </Card>
  );
}