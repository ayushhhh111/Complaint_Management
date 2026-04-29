"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/status-badge"
import type { Complaint } from "@/lib/types"
import { Clock, User, Building, MessageSquare, CheckCircle2, Info,HardHat,ShieldCheck, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface ComplaintDetailProps {
  complaint: Complaint
}

export function ComplaintDetail({ complaint }: ComplaintDetailProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="overflow-hidden border-none shadow-md bg-zinc-900/50 backdrop-blur-sm">
          {complaint.image && (
            <div className="relative aspect-video w-full overflow-hidden group">
              <img
                src={complaint.image}
                alt={complaint.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start mb-2">
              <CategoryBadge category={complaint.department as any} />
              <div className="flex gap-2">
                <PriorityBadge priority={complaint.is_urgent ? "high" : "medium"} />
                <StatusBadge status={complaint.status as any} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              {complaint.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed text-lg italic mb-6">
                &quot;{complaint.description}&quot;
              </p>
            </div>
            
            {complaint.resolutionComment && (
              <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Resolution Summary</span>
                </div>
                <p className="text-zinc-300">{complaint.resolutionComment}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: Sidebar */}
      <div className="lg:col-span-2 space-y-6">
        {/* Info Card */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-zinc-500">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={<User />} label="Submitted by" value={complaint.residentName} />
            <DetailItem icon={<Clock />} label="Date" value={new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
            <DetailItem icon={<Building />} label="Department" value={complaint.department} />
            
            <Separator className="bg-zinc-800" />

            {/* ASSIGNED WORKER SECTION */}
            <div className="pt-2">
              <p className="text-zinc-500 text-[10px] uppercase font-bold mb-3">Assigned Personnel</p>
              {complaint.assigned_worker ? (
                <div className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/40 border border-zinc-700/50 transition-all hover:bg-zinc-800/60">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <HardHat className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-100">{complaint.assigned_worker.worker_name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300 uppercase tracking-tighter">
                        Contact no: {complaint.assigned_worker.phone_no}
                      </span>
                      <span className="text-[10px] text-zinc-500"></span>
                      <span className="text-[10px] text-zinc-400">{complaint.assigned_worker.role}</span>
                    </div>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-emerald-500/50" />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-zinc-800">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                    <User className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-zinc-500 italic">No worker assigned yet</p>
                </div>
              )}
            </div>

            <Separator className="bg-zinc-800" />
            
            <div className="flex items-start gap-3">
               <Info className="h-4 w-4 mt-0.5 text-blue-400" />
               <p className="text-xs text-zinc-400 leading-snug">
                 This request is marked as <span className="text-zinc-200">{complaint.is_urgent ? "Urgent" : "Standard"}</span> priority.
               </p>
            </div>
          </CardContent>
        </Card>

        {/* History Card */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-zinc-500 flex items-center gap-2">
               <MessageSquare className="h-4 w-4" /> Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-2 before:w-[1px] before:bg-zinc-800">
              {/* Dynamic Assignment Item in Timeline */}
              {complaint.assigned_worker && (
                <TimelineItem 
                  status="Assigned" 
                  date={complaint.createdAt} // Ideally you'd have an 'assigned_at' field
                  comment={`Task assigned to ${complaint.assigned_worker.worker_name} for resolution.`}
                />
              )}
              
              <TimelineItem 
                status="Created" 
                date={complaint.createdAt} 
                comment="Request created and submitted to the portal." 
                isLatest={!complaint.assigned_worker}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-zinc-500 h-4 w-4">{icon}</div>
      <div className="text-sm">
        <p className="text-zinc-500 text-[10px] uppercase font-bold">{label}</p>
        <p className="text-zinc-200 font-medium">{value || "Not Specified"}</p>
      </div>
    </div>
  )
}

function TimelineItem({ status, date, comment, isLatest }: any) {
  return (
    <div className="relative pl-6">
      <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-zinc-900 ${isLatest ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
      <div className="space-y-1">
        <p className="text-xs font-bold text-zinc-200 uppercase">{status}</p>
        <p className="text-[10px] text-zinc-500">{new Date(date).toLocaleString()}</p>
        <p className="text-sm text-zinc-400 leading-tight">{comment}</p>
      </div>
    </div>
  )
}