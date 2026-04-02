import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"


type StatsCardProps = {
    title: string
    value: string
    color: string
    icon: LucideIcon
}

export default function StatsCard({ title, value, color, icon: Icon }:StatsCardProps) {
    return (
        <Card>
            <div className="py-3 px-7 w-full flex items-center justify-between gap-6">
                
                <div>
                    <p className="text-xs text-muted-foreground">
                        {title}
                    </p>

                    <h2 className="text-xl font-bold">
                        {value}
                    </h2>
                </div>

                <div className={`${color} text-white p-2 rounded-md`}>
                    <Icon size={18} />
                </div>

            </div>
        </Card>
    )
}