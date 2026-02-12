"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ComplaintForm } from "@/components/complaint-form"
import { ComplaintCard } from "@/components/complaint-card"
import { LoadingState } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchComplaints } from "@/lib/api"
import type { Complaint, ComplaintStatus } from "@/lib/types"
import { ClipboardList, Search, Plus, X, AlertTriangle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

export default function ResidentDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all")
  const [showForm, setShowForm] = useState(false)
  const searchParams = useSearchParams()

  const loadComplaints = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchComplaints()
      setComplaints(data)
      setFilteredComplaints(data)
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
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    setFilteredComplaints(result)
  }, [searchQuery, statusFilter, complaints])

  const handleFormSuccess = () => {
    loadComplaints()
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="lg:w-[450px] flex-shrink-0">
            {/* Mobile toggle button */}
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setShowForm(!showForm)}
                className="w-full gap-2"
                variant={showForm ? "secondary" : "default"}
              >
                {showForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Close Form
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    New Complaint
                  </>
                )}
              </Button>
            </div>

            {/* Form - Always visible on desktop, toggleable on mobile */}
            <div className={`${showForm ? "block" : "hidden lg:block"}`}>
              <ComplaintForm onSuccess={handleFormSuccess} />
            </div>
          </div>

          {/* Right Column - Complaints List */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                My Complaints
              </h1>
              <p className="text-muted-foreground">
                Track the status of your submitted complaints
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as ComplaintStatus | "all")
                }
              >
                <SelectTrigger className="w-full sm:w-40 bg-input border-border text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Complaints List */}
            <Suspense fallback={<Loading />}>
              {isLoading ? (
                <LoadingState message="Loading your complaints..." />
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <AlertTriangle className="h-10 w-10 text-destructive" />
                  <p className="text-muted-foreground">{error}</p>
                  <Button onClick={loadComplaints} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
                  title="No complaints found"
                  description={
                    searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters to see more results."
                      : "You haven't submitted any complaints yet. Use the form to create your first complaint."
                  }
                />
              ) : (
                <div className="grid gap-4">
                  {filteredComplaints.map((complaint) => (
                    <ComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      href={`/resident/${complaint.id}`}
                    />
                  ))}
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
