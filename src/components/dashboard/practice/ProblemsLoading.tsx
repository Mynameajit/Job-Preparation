import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemsLoading() {
    return (
        <div className="p-6 space-y-6">

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="p-4 rounded-xl border bg-card shadow-sm space-y-3"
                    >
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                ))}

            </div>

            {/* Table */}
            <TableSkeleton />

        </div>
    )
}


export function TableSkeleton() {
    return (
        <div className="rounded-xl border bg-card shadow-sm p-4 space-y-4">

            {/* 🔍 Search + Filters */}
            <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-40 rounded-md" />
                <Skeleton className="h-10 w-40 rounded-md" />
            </div>

            {/* 🔥 Table Rows */}
            <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[40px_1.5fr_120px_120px_100px_80px_100px] items-center gap-4"
                    >
                        {/* # */}
                        <Skeleton className="h-4 w-6" />

                        {/* Title */}
                        <Skeleton className="h-4 w-[80%]" />

                        {/* Difficulty */}
                        <Skeleton className="h-6 w-16 rounded-full" />

                        {/* Category */}
                        <Skeleton className="h-4 w-20" />

                        {/* Acceptance */}
                        <Skeleton className="h-4 w-12" />

                        {/* Status */}
                        <Skeleton className="h-5 w-5 rounded-full" />

                        {/* Action (Right aligned 🔥) */}
                        <div className="flex justify-end">
                            <Skeleton className="h-8 w-16 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}