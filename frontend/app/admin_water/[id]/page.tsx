"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Complaint } from "@/lib/types"

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/complaints/${id}/`)
        if (!response.ok) throw new Error("Failed to load details")
        const data = await response.json()
        setComplaint(data)
      } catch (err: any) {
        setError(err.message)
      }
    }
    if (id) fetchDetail()
  }, [id])

  if (error) return <div className="p-10 text-red-500">{error}</div>
  if (!complaint) return <div className="p-10">Loading...</div>

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{complaint.title}</h1>
      <div className="bg-card p-6 rounded-lg border">
        <p className="text-muted-foreground mb-4">{complaint.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Status:</strong> {complaint.status}</div>
          <div><strong>Priority:</strong> {complaint.priority}</div>
          <div><strong>Category:</strong> {complaint.category}</div>
          <div><strong>Resident:</strong> {complaint.residentName}</div>
        </div>
      </div>
    </div>
  )
}