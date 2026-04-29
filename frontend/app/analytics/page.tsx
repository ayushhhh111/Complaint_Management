"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { LoadingState } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchAnalytics } from "@/lib/api"
import type { AnalyticsData } from "@/lib/types"
import { AlertTriangle, BarChart3, PieChart, TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts"

// Define colors for charts using actual color values (not CSS vars)
const CATEGORY_COLORS = [
  "#4ade80", // emerald/green for maintenance
  "#60a5fa", // blue for security
  "#fbbf24", // amber for parking
  "#f87171", // red for noise
  "#a78bfa", // purple for cleanliness
  "#94a3b8", // slate for other
]

const PRIORITY_COLORS = {
  Urgent: "#f87171",
  Normal: "#60a5fa",
}

const TREND_COLOR = "#4ade80"

// Custom tooltip component
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string; payload?: { category?: string; priority?: string; month?: string } }>; label?: string }) {
  if (!active || !payload || !payload.length) return null
  
  const data = payload[0]
  const displayLabel = label || data?.payload?.category || data?.payload?.priority || data?.payload?.month || ""
  
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-foreground">{displayLabel}</p>
      <p className="text-sm text-muted-foreground">
        Count: <span className="font-medium text-foreground">{data?.value}</span>
      </p>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchAnalytics()
      setAnalytics(data)
    } catch {
      setError("Failed to load analytics data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
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
      loadAnalytics()
    } else {
      setAuthorized(false)
    }
  }, [])
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
            This page is restricted to administrators only.
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
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingState message="Loading analytics data..." />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={loadAnalytics} variant="outline">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (!analytics) return null

  const totalComplaints = analytics.complaintsByDepartment.reduce(
    (acc, item) => acc + item.count,
    0
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visual insights into complaint trends and patterns
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalComplaints}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Complaints</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <TrendingUp className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.complaintsByUrgency.find((u) => u.is_urgent === true)?.count || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Urgent Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <PieChart className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.complaintsByDepartment.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Departments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.monthlyTrends[analytics.monthlyTrends.length - 1]?.count || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Complaints by Department - Bar Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Complaints by Department</CardTitle>
              <CardDescription>
                Distribution of complaints across different departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.complaintsByDepartment}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="department"
                      tick={{ fill: "#888", fontSize: 12 }}
                      axisLine={{ stroke: "#333" }}
                    />
                    <YAxis
                      tick={{ fill: "#888", fontSize: 12 }}
                      axisLine={{ stroke: "#333" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {analytics.complaintsByDepartment.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Complaints by Urgency - Pie Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Complaints by Urgency</CardTitle>
              <CardDescription>
                Breakdown of urgent vs normal complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={analytics.complaintsByUrgency}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="is_urgent"
                      label={({ is_urgent, count }) => `${is_urgent ? 'Urgent' : 'Normal'}: ${count}`}
                      labelLine={{ stroke: "#888" }}
                    >
                      {analytics.complaintsByUrgency.map((entry) => (
                        <Cell
                          key={`cell-${entry.is_urgent}`}
                          fill={entry.is_urgent ? "#f87171" : "#60a5fa"}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "#f5f5f5" }}>{value}</span>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends - Line Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Monthly Complaint Trends</CardTitle>
            <CardDescription>
              Number of complaints submitted over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.monthlyTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#888", fontSize: 12 }}
                    axisLine={{ stroke: "#333" }}
                  />
                  <YAxis
                    tick={{ fill: "#888", fontSize: 12 }}
                    axisLine={{ stroke: "#333" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={TREND_COLOR}
                    strokeWidth={2}
                    dot={{ fill: TREND_COLOR, strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: TREND_COLOR }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
