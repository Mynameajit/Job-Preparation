import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfileHeader({ user }: any) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">

        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatar || "/avatar.png"} />
        </Avatar>

        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-sm">{user.role}</p>
          <p className="text-sm">{user.college}</p>
          <p className="text-sm">{user.location}</p>
          <p className="text-sm">📞 {user.phone}</p>
        </div>

        <Button>Edit Profile</Button>

      </CardContent>
    </Card>
  );
}