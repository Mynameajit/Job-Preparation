"use client"


export function DashboardSummarySkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="h-24 rounded-2xl bg-muted/30 animate-pulse"
                />
            ))}
        </div>
    );
}

export function DashboardUpcomingSkeleton() {
    return (
        <div className="rounded-2xl border p-6 space-y-4 bg-muted/20 animate-pulse">
            <div className="flex justify-between">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
            </div>

            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center border rounded-xl p-4">
                    <div className="space-y-2">
                        <div className="h-3 w-40 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                    </div>

                    <div className="h-6 w-14 bg-muted rounded" />
                </div>
            ))}
        </div>
    );
}

export function DashboardActivitySkeleton() {
    return (
        <div className="rounded-2xl border p-6 space-y-4 bg-muted/20 animate-pulse">
            <div className="h-4 w-40 bg-muted rounded" />

            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="space-y-2">
                        <div className="h-3 w-40 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}



export function DashboardChartSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-2">

            {/* LINE CHART */}
            <div className="rounded-2xl border p-6 space-y-4 bg-muted/20 animate-pulse">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-64 w-full bg-muted rounded-xl" />
            </div>

            {/* PIE CHART */}
            <div className="rounded-2xl border p-6 space-y-4 bg-muted/20 animate-pulse">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-64 w-full bg-muted rounded-full" />
            </div>

        </div>
    );
}