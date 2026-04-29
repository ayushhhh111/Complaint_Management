"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { AdminComplaintTable } from "@/components/admin-complaint-table"
import { LoadingState } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchComplaints } from "@/lib/api"
import type { Complaint, ComplaintStatus, ComplaintPriority, ComplaintCategory } from "@/lib/types"
import {
  Search,
  AlertTriangle,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { X } from "lucide-react";
export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | "all">("all")
  const searchParams = useSearchParams()
  const [newComplaintsCount, setNewComplaintsCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const loadComplaints = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchComplaints()
      setComplaints(data)
      setFilteredComplaints(data)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const recentComplaints = data.filter((c: Complaint) => {
        // Ensure your API returns a valid date string or object
        const createdAt = new Date(c.created_at); 
        return createdAt > twentyFourHoursAgo && c.status === "pending";
      });

      if (recentComplaints.length > 0) {
        setNewComplaintsCount(recentComplaints.length);
        setShowNotification(true);
      }
    } catch {
      setError("Failed to load complaints. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 1. Specifically check the 'user_role' key
    const role = localStorage.getItem("user_role")
    const savedTheme = localStorage.getItem("theme") || "dark";
  
  // Apply to the <html> element for Tailwind/CSS support
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
    if (role === "admin") {
      setAuthorized(true)
      loadComplaints()
    } else {
      setAuthorized(false)
    }
  }, [])

  useEffect(() => {
    let result = complaints

    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) 
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      result = result.filter((c) => c.is_urgent === priorityFilter)
    }

    if (categoryFilter !== "all") {
      result = result.filter((c) => c.department === categoryFilter)
    }
     if (showRecentOnly) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    result = result.filter((c) => new Date(c.created_at) > twentyFourHoursAgo);
    }
    setFilteredComplaints(result)
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, complaints])

  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }
  if (authorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingState message="Verifying admin access..." />
      </div>
    )
  }
  if (authorized === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-destructive/10 p-6 rounded-2xl flex flex-col items-center border border-destructive/20">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Unauthorized User</h1>
          <p className="text-muted-foreground mt-2 text-center max-w-xs">
            This dashboard is restricted to administrators only.
          </p>
          <Button 
            className="mt-6" 
            onClick={() => window.location.href = "/"}
          >
            Go Back to Login
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />
 {showNotification && (
  <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-right-10 duration-500">
    <Card className="w-80 border-red-500/50 bg-zinc-900 shadow-2xl shadow-red-900/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">New Pending Tasks</h4>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              There are <span className="text-red-400 font-semibold">{newComplaintsCount}</span> new complaints from the last 24 hours awaiting your review.
            </p>
            <div className="mt-3 flex gap-2">
              <Button 
  size="sm" 
  variant="outline" 
  className="h-7 text-[10px] uppercase tracking-wider border-zinc-700 hover:bg-zinc-800"
  onClick={() => {
    setStatusFilter("pending"); // Show only pending
    setShowRecentOnly(true);    // Show only within 24 hours
    setShowNotification(false); // Close popup
  }}
>
  View Now
</Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 text-[10px] uppercase tracking-wider text-zinc-500"
                onClick={() => setShowNotification(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)}
      <main className="container mx-auto px-4 py-8">
  <div className="mb-8">
    <h1 className="text-center text-2xl font-bold text-foreground mb-2">Admin Dashboard</h1>
    <p className="text-center text-muted-foreground">Manage and resolve society complaints</p>
  </div>

  {/* New Wrapper for Sidebar + Table */}
  <div className="flex flex-col lg:flex-row gap-8 items-start">
    
    
    {/* Right Column - Filters & Table (Remaining 50% Width) */}
    <div className="w-full lg:w-[60%]">
      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-input border-border text-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
            <SelectTrigger className="flex-1 bg-input border-border"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="parking">Parking</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="noise">Noise</SelectItem>
              <SelectItem value="cleanliness">Cleanliness</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select 
          // Convert current boolean state to string for the Select component
           value={priorityFilter === "all" ? "all" : priorityFilter.toString()} 
           // Convert string selection back to boolean for your state
           onValueChange={(v) => {
             if (v === "all") {
               setPriorityFilter("all");
             } else {
               setPriorityFilter(v === "true"); // "true" string becomes true boolean
             }
           }}
         >
           <SelectTrigger className="w-[120px] bg-input border-border">
             <SelectValue placeholder="Priority" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Priorities</SelectItem>
             <SelectItem value="false">Normal</SelectItem> {/* false string */}
             <SelectItem value="true">Urgent</SelectItem>  {/* true string */}
           </SelectContent>
</Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[120px] bg-input border-border"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In-progress</SelectItem>
              <SelectItem value="resolved">resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="rounded-md border border-border bg-card">
        {isLoading ? (
          <LoadingState message="Loading complaints..." />
        ) : (
          <AdminComplaintTable complaints={filteredComplaints} onUpdate={loadComplaints} />
        )}
      </div>
    </div>
    {/* Left Column - Stats Cards (50% Width on Desktop) */}
<div className="w-full lg:w-[40%] sticky top-24">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Added grid with 2 columns */}
    
    {/* Row 1: Total & Pending */}
    <Card className="bg-card border-border">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-accent/10">
          <ClipboardList className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Complaints</p>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-card border-border">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-amber-500/10">
          <AlertCircle className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Pending Action</p>
        </div>
      </CardContent>
    </Card>

    {/* Row 2: In Progress & Resolved */}
    <Card className="bg-card border-border">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-blue-500/10">
          <Clock className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">{stats.inProgress}</p>
          <p className="text-sm text-muted-foreground">Currently In Progress</p>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-card border-border">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-emerald-500/10">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">{stats.resolved}</p>
          <p className="text-sm text-muted-foreground">Successfully Resolved</p>
        </div>
      </CardContent>
    </Card>
    
  </div>
</div>

  </div>
</main>
    </div>
  )
}
