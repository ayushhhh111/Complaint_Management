import type { Complaint, AnalyticsData, ComplaintStatus } from "./types"

const API_BASE_URL = "/api"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const token = localStorage.getItem("access_token"); // Ensure this matches your login key
// Mock data for demonstration
const mockComplaints: Complaint[] = [
  {
    id: "1",
    title: "Water leakage in basement parking",
    description:
      "There is significant water leakage in the basement parking area near slot B-15. This has been ongoing for 3 days.",
    category: "maintenance",
    priority: "urgent",
    status: "in-progress",
    categoryExplanation:
      "Classified as maintenance due to infrastructure-related water damage requiring repair work.",
    residentId: "R001",
    residentName: "Amit Sharma",
    created_at: "2026-01-20T10:30:00Z",
    updated_at: "2026-01-21T14:00:00Z",
    assignedDepartment: "Maintenance",
    statusHistory: [
      {
        id: "sh1",
        status: "pending",
        comment: "Complaint received",
        updatedBy: "System",
        updatedAt: "2026-01-20T10:30:00Z",
      },
      {
        id: "sh2",
        status: "in-progress",
        comment: "Maintenance team dispatched to assess the situation",
        updatedBy: "Admin",
        updatedAt: "2026-01-21T14:00:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Unauthorized parking in visitor area",
    description:
      "Unknown vehicle parked in visitor parking for over a week. Vehicle number: MH-02-AB-1234",
    category: "parking",
    priority: "normal",
    status: "pending",
    categoryExplanation:
      "Classified as parking due to unauthorized vehicle occupying designated visitor spaces.",
    residentId: "R002",
    residentName: "Priya Patel",
    createdAt: "2026-01-22T09:15:00Z",
    updatedAt: "2026-01-22T09:15:00Z",
    statusHistory: [
      {
        id: "sh3",
        status: "pending",
        comment: "Complaint received",
        updatedBy: "System",
        updatedAt: "2026-01-22T09:15:00Z",
      },
    ],
  },
  {
    id: "3",
    title: "Loud music from flat 501",
    description:
      "Continuous loud music playing till late night from flat 501, Tower A. This has been happening every weekend.",
    category: "noise",
    priority: "normal",
    status: "resolved",
    categoryExplanation:
      "Classified as noise complaint due to disturbance caused by excessive sound levels.",
    residentId: "R003",
    residentName: "Rajesh Kumar",
    createdAt: "2026-01-15T22:00:00Z",
    updatedAt: "2026-01-18T16:30:00Z",
    assignedDepartment: "Security",
    resolutionComment:
      "Spoken with the resident of flat 501. They have agreed to maintain reasonable noise levels.",
    statusHistory: [
      {
        id: "sh4",
        status: "pending",
        comment: "Complaint received",
        updatedBy: "System",
        updatedAt: "2026-01-15T22:00:00Z",
      },
      {
        id: "sh5",
        status: "in-progress",
        comment: "Security team notified",
        updatedBy: "Admin",
        updatedAt: "2026-01-16T09:00:00Z",
      },
      {
        id: "sh6",
        status: "resolved",
        comment:
          "Spoken with the resident of flat 501. They have agreed to maintain reasonable noise levels.",
        updatedBy: "Admin",
        updatedAt: "2026-01-18T16:30:00Z",
      },
    ],
  },
  {
    id: "4",
    title: "Broken CCTV camera at main gate",
    description:
      "The CCTV camera at the main entrance gate has been non-functional for 2 days. This is a security concern.",
    category: "security",
    priority: "urgent",
    status: "in-progress",
    categoryExplanation:
      "Classified as security due to malfunctioning surveillance equipment affecting building safety.",
    residentId: "R004",
    residentName: "Meena Desai",
    createdAt: "2026-01-21T11:45:00Z",
    updatedAt: "2026-01-22T10:00:00Z",
    assignedDepartment: "Security",
    statusHistory: [
      {
        id: "sh7",
        status: "pending",
        comment: "Complaint received",
        updatedBy: "System",
        updatedAt: "2026-01-21T11:45:00Z",
      },
      {
        id: "sh8",
        status: "in-progress",
        comment: "Vendor contacted for camera repair",
        updatedBy: "Admin",
        updatedAt: "2026-01-22T10:00:00Z",
      },
    ],
  },
  {
    id: "5",
    title: "Garbage not collected for 2 days",
    description:
      "The garbage from Tower B has not been collected for the past 2 days. The bins are overflowing.",
    category: "cleanliness",
    priority: "urgent",
    status: "resolved",
    categoryExplanation:
      "Classified as cleanliness due to waste management issues affecting hygiene standards.",
    residentId: "R005",
    residentName: "Sunita Verma",
    createdAt: "2026-01-19T08:00:00Z",
    updatedAt: "2026-01-20T12:00:00Z",
    assignedDepartment: "Housekeeping",
    resolutionComment:
      "Garbage collection resumed. Vendor was facing vehicle issues which have been resolved.",
    statusHistory: [
      {
        id: "sh9",
        status: "pending",
        comment: "Complaint received",
        updatedBy: "System",
        updatedAt: "2026-01-19T08:00:00Z",
      },
      {
        id: "sh10",
        status: "in-progress",
        comment: "Contacted housekeeping vendor",
        updatedBy: "Admin",
        updatedAt: "2026-01-19T14:00:00Z",
      },
      {
        id: "sh11",
        status: "resolved",
        comment:
          "Garbage collection resumed. Vendor was facing vehicle issues which have been resolved.",
        updatedBy: "Admin",
        updatedAt: "2026-01-20T12:00:00Z",
      },
    ],
  },
]

const mockAnalytics: AnalyticsData = {
  complaintsByCategory: [
    { category: "Maintenance", count: 45 },
    { category: "Security", count: 28 },
    { category: "Parking", count: 32 },
    { category: "Noise", count: 18 },
    { category: "Cleanliness", count: 22 },
    { category: "Other", count: 12 },
  ],
  complaintsByPriority: [
    { priority: "Urgent", count: 42 },
    { priority: "Normal", count: 115 },
  ],
  monthlyTrends: [
    { month: "Aug", count: 23 },
    { month: "Sep", count: 31 },
    { month: "Oct", count: 28 },
    { month: "Nov", count: 35 },
    { month: "Dec", count: 42 },
    { month: "Jan", count: 38 },
  ],
}

// API Functions
export async function fetchComplaints(): Promise<Complaint[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  const response = await fetch("http://127.0.0.1:8000/api/complaints/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return response.json();
}

export async function fetchComplaintById(
  id: string
): Promise<Complaint | null> {
  await delay(500)
  return mockComplaints.find((c) => c.id === id) || null
}

export async function createComplaint(data: { title: string; description: string }): Promise<Complaint> {
  const token = localStorage.getItem("access_token");
  const response = await fetch("http://127.0.0.1:8000/api/complaints/", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create complaint");
  return response.json();
}


// frontend/lib/api.ts
export async function updateComplaint(id: number, data: any) {
  const response = await fetch(`http://127.0.0.1:8000/api/complaints/${id}/`, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update complaint");
  }

  return response.json();
}

// frontend/lib/api.ts
export async function fetchAnalytics(): Promise<AnalyticsData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/analytics/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

// frontend/lib/types.ts

export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';

// frontend/lib/types.ts

export interface Complaint {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  createdAt: string; // Matches the serializer source
  residentName: string; // Matches the serializer source
}

export interface AnalyticsData {
  complaintsByCategory: { category: string; count: number }[];
  complaintsByPriority: { priority: string; count: number }[];
  monthlyTrends: { month: string; count: number }[];
}