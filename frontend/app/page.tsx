"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  ClipboardList,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  LayoutDashboard,
} from "lucide-react"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    // Check for existing session in localStorage
    const token = localStorage.getItem("access_token")
    const role = localStorage.getItem("user_role")
    setIsLoggedIn(!!token)
    setUserRole(role || "")
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(74,222,128,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              Smart Housing Society
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Complaint Management Made{" "}
              <span className="text-accent">Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive system for residents to submit complaints and track
              their status, while admins efficiently manage and resolve issues
              with full transparency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                // Show Dashboard button if logged in
                <Button asChild size="lg" className="gap-2 bg-accent hover:bg-accent/90">
                  <Link href={userRole === "admin" ? "/admin" : "/resident"}>
                    Go to Your Dashboard
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                // Show Auth options for guests
                <>
                  <Button asChild size="lg" className="gap-2 bg-accent hover:bg-accent/90">
                    <Link href="/login">
                      Resident Portal
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10">
                    <Link href="/admin/login">
                      Admin Access
                      <Shield className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our streamlined process ensures your complaints are handled
              efficiently from submission to resolution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card border-border relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent/50" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>1. Submit</CardTitle>
                <CardDescription>
                  File your complaint with details. Our system automatically categorizes and prioritizes it.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle>2. Track</CardTitle>
                <CardDescription>
                  Monitor your complaint status in real-time. Get updates as admins review and work on your issue.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle>3. Resolve</CardTitle>
                <CardDescription>
                  Receive resolution updates and view a complete history of actions taken by the management.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Conditional CTA Section: Only show if NOT logged in */}
      {!isLoggedIn && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-card border-border max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-muted-foreground mb-6">
                      Choose your role and start using the complaint management system today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                      <Button asChild>
                        <Link href="/signup">I&apos;m a Resident</Link>
                      </Button>
                      <Button asChild variant="secondary">
                        <Link href="/admin/signup">I&apos;m an Admin</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-accent" />
            <span className="text-sm text-muted-foreground">Smart Housing Society Management</span>
          </div>
          <p className="text-sm text-muted-foreground">Built for modern housing societies</p>
        </div>
      </footer>
    </div>
  )
}