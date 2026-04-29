"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/status-badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { updateComplaint, fetchWorkers } from "@/lib/api"
import type { Complaint, Worker } from "@/lib/types"
import { MoreHorizontal, Eye, Settings2, MessageSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface AdminComplaintTableProps {
  complaints: Complaint[]
  onUpdate: () => void
}

export function AdminComplaintTable({
  complaints,
  onUpdate,
}: AdminComplaintTableProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [actionType, setActionType] = useState<"status" | "department" | "comment" | "worker" | null>(null)
  const [newStatus, setNewStatus] = useState<string>("pending")
  const [newDepartment, setNewDepartment] = useState("")
  const [selectedWorker, setSelectedWorker] = useState<string>("")
  const [workers, setWorkers] = useState<Worker[]>([])
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [workersLoading, setWorkersLoading] = useState(false)

  const departments = [
    "Maintenance",
    "Security",
    "Housekeeping",
    "Parking Management",
    "Administration",
  ]

  const openAction = async (complaint: Complaint, type: "status" | "department" | "comment" | "worker") => {
    setSelectedComplaint(complaint)
    setActionType(type)
    if (type === "status") {
      setNewStatus(complaint.status)
    } else if (type === "department") {
      setNewDepartment(complaint.assignedDepartment || "")
    } else if (type === "worker") {
      setSelectedWorker("")
      // Load workers when this action is opened
      try {
        setWorkersLoading(true)
        const data = await fetchWorkers()
        setWorkers(data)
      } catch (error) {
        console.error("Failed to load workers:", error)
      } finally {
        setWorkersLoading(false)
      }
    }
    setComment("")
  }

  const closeDialog = () => {
    setSelectedComplaint(null)
    setActionType(null)
    setNewStatus("pending")
    setNewDepartment("")
    setComment("")
  }

 const handleSubmit = async () => {
  if (!selectedComplaint) return

  setIsSubmitting(true)
  try {
    const updateData: any = {}

    if (actionType === "status") {
      updateData.status = newStatus
      if (comment) updateData.resolution_comment = comment
    } else if (actionType === "department") {
      updateData.assigned_department = newDepartment
    } else if (actionType === "worker") {
      if (selectedWorker) {
        updateData.assigned_worker_id = selectedWorker;
        if (selectedComplaint.status === "pending") {
        updateData.status = "in-progress";
    }
      }
    }
    
    await updateComplaint(selectedComplaint.id, updateData)
    
    onUpdate()
    closeDialog()
  } catch (error) {
    console.error("Failed to update:", error)
  } finally {
    setIsSubmitting(false)
  }
}

 const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) 
    ? "Invalid Date" 
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-muted-foreground font-medium">Title</TableHead>
              <TableHead className="text-muted-foreground font-medium">Category</TableHead>
              <TableHead className="text-muted-foreground font-medium">Priority</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Assigned to</TableHead>
              <TableHead className="text-muted-foreground font-medium">Date</TableHead>
              <TableHead className="text-muted-foreground font-medium w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id} className="hover:bg-secondary/30">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground line-clamp-1">
                      {complaint.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {complaint.residentName|| "Unknown Resident"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <CategoryBadge category={complaint.department} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={complaint.is_urgent} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={complaint.status} />
                </TableCell>
                <TableCell>
             {complaint.assigned_worker ? (
               <div>
                    <div className="font-medium text-foreground line-clamp-1">

                      {complaint.assigned_worker.worker_name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ({complaint.assigned_worker.worker_id|| "Unknown Resident"})
                    </p>
                  </div>
                ) : (
               <span className="text-xs text-muted-foreground italic">
                 Not Assigned
               </span>
                )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(complaint.created_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/${complaint.id}`} className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openAction(complaint, "status")} className="gap-2 cursor-pointer">
                        <Settings2 className="h-4 w-4" />
                        Update Status
                      </DropdownMenuItem>
                      {/*<DropdownMenuItem onClick={() => openAction(complaint, "department")} className="gap-2 cursor-pointer">
                      <Settings2 className="h-4 w-4" />
                       Assign Department
                      </DropdownMenuItem>*/}
                      <DropdownMenuItem onClick={() => openAction(complaint, "worker")} className="gap-2 cursor-pointer">
                        <Settings2 className="h-4 w-4" />
                        Assign Worker
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openAction(complaint, "comment")} className="gap-2 cursor-pointer">
                        <MessageSquare className="h-4 w-4" />
                        Add Comment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => closeDialog()}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {actionType === "status" && "Update Status"}
              {actionType === "department" && "Assign Department"}
              {actionType === "worker" && "Assign Worker"}
              {actionType === "comment" && "Add Resolution Comment"}
            </DialogTitle>
            <DialogDescription>
              {selectedComplaint?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionType === "status" && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">New Status</Label>
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v)}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Comment (Optional)</Label>
                  <Textarea
                    placeholder="Add a comment about this status change..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                    rows={3}
                  />
                </div>
              </>
            )}

            {actionType === "department" && (
              <div className="space-y-2">
                <Label className="text-foreground">Select Department</Label>
                <Select value={newDepartment} onValueChange={setNewDepartment}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Choose a department" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {actionType === "worker" && (
              <div className="space-y-2">
                <Label className="text-foreground">Select Worker</Label>
                {workersLoading ? (
                  <p className="text-muted-foreground">Loading workers...</p>
                ) : workers.length === 0 ? (
                  <p className="text-muted-foreground">No workers available</p>
                ) : (
                  <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Choose a worker" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id.toString()}>
                          {worker.worker_name} ({worker.worker_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {actionType === "comment" && (
              <div className="space-y-2">
                <Label className="text-foreground">Resolution Comment</Label>
                <Textarea
                  placeholder="Enter resolution details..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                  rows={4}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (actionType === "department" && !newDepartment) ||
                (actionType === "worker" && !selectedWorker) ||
                (actionType === "comment" && !comment)
              }
              className="gap-2"
            >
              {isSubmitting && <LoadingSpinner size="sm" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
