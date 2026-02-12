import { Complaint } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function ComplaintCard({ complaint, href }: { complaint: Complaint, href: string }) {
  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <Link href={href}>
      <Card className="hover:border-accent transition-colors bg-card cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">{complaint.title}</CardTitle>
          <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
            {complaint.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {complaint.description}
          </p>
          <p className="text-xs text-zinc-500">
            Submitted: {new Date(complaint.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}