"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { ComplaintDetail } from "@/components/complaint-detail"
import { LoadingState } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { fetchComplaintById } from "@/lib/api"
import type { Complaint } from "@/lib/types"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchComplaintById(id)
        setComplaint(data)
      } catch {
        setError("Failed to load complaint details.")
      } finally {
        setIsLoading(false)
      }
    }

    loadComplaint()
  }, [id])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/resident">
          <Button variant="ghost" className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Complaints
          </Button>
        </Link>

        {isLoading ? (
          <LoadingState message="Loading complaint details..." />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <p className="text-muted-foreground">{error}</p>
            <Link href="/resident">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </div>
        ) : complaint ? (
          <ComplaintDetail complaint={complaint} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertTriangle className="h-10 w-10 text-amber-400" />
            <p className="text-muted-foreground">Complaint not found</p>
            <Link href="/resident">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
