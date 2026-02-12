"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/status-badge"
import type { Complaint } from "@/lib/types"
import { Clock, User, Building, MessageSquare, CheckCircle2 } from "lucide-react"

interface ComplaintDetailProps {
  complaint: Complaint
}

export function ComplaintDetail({ complaint }: ComplaintDetailProps) {
  return (
    <div className="space-y-6">
      {/* Main Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={complaint.category} />
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
            <CardTitle className="text-foreground text-xl">
              {complaint.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{complaint.description}</p>

          {complaint.imageUrl && (
            <div className="rounded-lg overflow-hidden border border-border">
              <img
                src={complaint.imageUrl || "/placeholder.svg"}
                alt="Complaint"
                className="w-full max-h-64 object-cover"
              />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Submitted by</p>
                <p className="text-foreground font-medium">
                  {complaint.residentName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Submitted on</p>
                <p className="text-foreground font-medium">
                  {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            {complaint.assignedDepartment && (
              <div className="flex items-center gap-3 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Assigned to</p>
                  <p className="text-foreground font-medium">
                    {complaint.assignedDepartment}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Category Explanation */}
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm text-accent font-medium mb-1">
              Category Classification
            </p>
            <p className="text-sm text-muted-foreground">
              {complaint.categoryExplanation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Comment */}
      {complaint.resolutionComment && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Resolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{complaint.resolutionComment}</p>
          </CardContent>
        </Card>
      )}

      {/* Status Timeline */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-accent" />
            Status History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 space-y-6">
            {/* Timeline line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

            {complaint.statusHistory.map((update, index) => (
              <div key={update.id} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 ${
                    index === complaint.statusHistory.length - 1
                      ? "bg-accent border-accent"
                      : "bg-background border-border"
                  }`}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={update.status} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(update.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{update.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    By {update.updatedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
