"use client"

import { cn } from "@/lib/utils"
import type { ComplaintStatus, ComplaintPriority } from "@/lib/types"

// --- Status Badge ---
interface StatusBadgeProps {
  status: ComplaintStatus | undefined | null // Added safety
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        {
          "bg-amber-500/20 text-amber-400": status === "pending",
          "bg-blue-500/20 text-blue-400": status === "in-progress",
          "bg-emerald-500/20 text-emerald-400": status === "resolved",
        }
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full", {
          "bg-amber-400": status === "pending",
          "bg-blue-400": status === "in-progress",
          "bg-emerald-400": status === "resolved",
        })}
      />
      {status === "in-progress"
        ? "In Progress"
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// --- Priority Badge ---
interface PriorityBadgeProps {
  priority: ComplaintPriority | undefined | null // Added safety
}

// components/priority-badge.tsx
export function PriorityBadge({ priority }: { priority: boolean }) {
  const isUrgent = priority ;
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${
      isUrgent ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
    }`}>
      {isUrgent ? "Urgent" : "Normal"}
    </span>
  );
}
// --- Category Badge ---
interface CategoryBadgeProps {
  category?: string 
}

// REMOVED DUPLICATE FUNCTION HERE
export function CategoryBadge({ category }: CategoryBadgeProps) {
  // Guard clause to prevent the 'charAt' error
  if (!category) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
        General
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  )
}