import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
};

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  color = "text-blue-500",
}: Props) {
  return (
    <Card className="rounded-2xl border bg-gradient-to-br from-background to-muted/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <CardContent className="flex items-center justify-between p-5">

        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>

        {/* ICON WITH BACKGROUND */}
        <div className={`p-3 rounded-xl bg-muted ${color}`}>
          <Icon className="w-6 h-6" />
        </div>

      </CardContent>
    </Card>
  );
}