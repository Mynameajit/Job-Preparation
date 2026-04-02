import { Skeleton } from "@/components/ui/skeleton"

export default function QuestionLoading() {
  return (
    <div className="grid grid-cols-2 h-screen bg-background text-foreground">

      {/* LEFT PANEL */}
      <div className="p-6 space-y-6 border-r border-border">

        {/* Title */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        {/* Examples */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <Skeleton className="h-5 w-32" />

          {[1, 2].map((_, i) => (
            <div
              key={i}
              className="bg-muted/40 border border-border rounded-lg p-4 space-y-2"
            >
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[40%]" />
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-[60%]" />
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col h-full">

        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <Skeleton className="h-9 w-32 rounded-md" />

          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-3">
          <div className="h-full rounded-xl border border-border bg-card p-3 space-y-3">
            
            {/* Editor Header */}
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Fake code lines */}
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>

          </div>
        </div>

        {/* Output */}
        <div className="h-40 border-t border-border p-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>

      </div>

    </div>
  )
}