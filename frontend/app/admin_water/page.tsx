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

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | "all">("all")
  const searchParams = useSearchParams()

  const loadComplaints = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchComplaints()
      const waterComplaints = data.filter(c => c.department === "water" && c.title.toLowerCase().includes("water"))
      setComplaints(waterComplaints)
      setFilteredComplaints(waterComplaints)
    } catch {
      setError("Failed to load complaints. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  useEffect(() => {
    let result = complaints

    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.residentName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      result = result.filter((c) => c.priority === priorityFilter)
    }

    if (categoryFilter !== "all") {
      result = result.filter((c) => c.category === categoryFilter)
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
  <div className="mb-8">
    <h1 className="text-center text-2xl font-bold text-foreground mb-2">Admin Dashboard</h1>
    <p className="text-center text-muted-foreground">Manage and resolve society complaints</p>
  </div>

  {/* New Wrapper for Sidebar + Table */}
  <div className="flex flex-col lg:flex-row gap-8 items-start">
    
    
    {/* Right Column - Filters & Table (Remaining 50% Width) */}
    <div className="flex-1 w-full">
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
              <SelectItem value="maintenance">Maintenance</SelectItem>
              {/* ... other items */}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[120px] bg-input border-border"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              {/* ... other items */}
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
<div className="w-full lg:w-1/2">
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
