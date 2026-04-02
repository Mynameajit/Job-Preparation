import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SkillsSection({ skills }: any) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <h3 className="font-semibold">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills?.map((s: string, i: number) => (
            <Badge key={i}>{s}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}