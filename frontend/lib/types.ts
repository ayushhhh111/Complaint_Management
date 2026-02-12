export type ComplaintStatus = "pending" | "in-progress" | "resolved"
export type ComplaintPriority = "urgent" | "normal"
export type ComplaintCategory =
  | "maintenance"
  | "security"
  | "parking"
  | "noise"
  | "cleanliness"
  | "other"

export interface StatusUpdate {
  id: string
  status: ComplaintStatus
  comment: string
  updatedBy: string
  updatedAt: string
}

export interface Complaint {
  id: string
  title: string
  description: string
  department:string
  user:User
  is_urgent:boolean
  category: ComplaintCategory
  priority: ComplaintPriority
  status: ComplaintStatus
  categoryExplanation: string
  imageUrl?: string
  residentId: string
  created_at: string
  updatedAt: string
  assignedDepartment?: string
  resolutionComment?: string
  statusHistory: StatusUpdate[]
}

export interface AnalyticsData {
  complaintsByCategory: {
    category: string
    count: number
  }[]
  complaintsByPriority: {
    priority: string
    count: number
  }[]
  monthlyTrends: {
    month: string
    count: number
  }[]
}
export interface User {
  id: number;
  username: string;
  email: string;
}