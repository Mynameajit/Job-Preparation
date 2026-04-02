import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountSection() {
  return (
    <Card>
      <CardContent className="p-5 flex gap-3 flex-wrap">
        <Button variant="outline">Change Password</Button>
        <Button variant="destructive">Logout</Button>
      </CardContent>
    </Card>
  );
}