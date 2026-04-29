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
  assigned_worker?: Worker | null;
  assignedDepartment?: string
  resolutionComment?: string
  statusHistory: StatusUpdate[]
}

export interface AnalyticsData {
  complaintsByDepartment: {
    department: string
    count: number
  }[]
  complaintsByUrgency: {
    is_urgent: boolean
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

export interface Worker {
  id: number;
  worker_name: string;
  worker_id: string;
  phone_no:string;
  assigned_to?: number;
  created_at: string;
}
