"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check storage on mount to determine login and role status
    const token = localStorage.getItem("access_token")
    const staffStatus = localStorage.getItem("is_staff") === "true"
    
    setIsLoggedIn(!!token)
    setIsAdmin(staffStatus)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("is_staff")
    window.location.href = "/"
  }

  return (
    <header className="border-b border-zinc-800 bg-black/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Building2 className="h-5 w-5 text-green-500" />
          <span>SmartHousing</span>
        </Link>

        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <nav className="hidden md:flex gap-6 text-sm font-medium">
                {/* SHARED LINK: Home is visible to both */}
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
                
                {/* RESIDENT VIEW: Shows only if NOT admin */}
                {!isAdmin && (
                  <Link href="/resident" className="text-zinc-400 hover:text-white transition-colors">Resident</Link>
                )}
                
                {/* ADMIN VIEW: Analytics and Admin Panel only for staff */}
                {isAdmin && (
                  <>
                    <Link href="/admin" className="text-green-500 font-bold hover:text-green-400 transition-colors">
                      Admin Panel
                    </Link>
                    <Link href="/analytics" className="text-zinc-400 hover:text-white transition-colors">
                      Analytics
                    </Link>
                  </>
                )}
              </nav>

              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white">
                Login
              </Link>
              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}