import { Card, CardContent } from "@/components/ui/card";

export default function TestCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex gap-3">
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 w-20 bg-muted rounded-full" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}