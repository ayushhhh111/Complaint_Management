"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation" // 1. Import usePathname
import { Building2, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils" // Utility for merging classes (standard in Shadcn)

export function Header() {
  const pathname = usePathname() // 2. Initialize pathname
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("access_token")
    const role = localStorage.getItem("user_role")
    setIsLoggedIn(!!token)
    setUserRole(role)
  }, [])

  const handleLogout = () => {
    localStorage.clear() // Simpler way to wipe auth
    window.location.href = "/"
  }

  if (!mounted) return null

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <Building2 className="h-5 w-5 text-green-500" />
          <span>SmartHousing</span>
        </Link>

        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <nav className="hidden md:flex gap-6 text-sm font-medium">
                <Link 
                  href="/" 
                  className={cn(
                    "transition-colors hover:text-foreground",
                    pathname === "/" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Home
                </Link>
                
                {userRole === "admin" ? (
                  <>
                    <Link 
                      href="/admin" 
                      className={cn(
                        "transition-colors font-bold",
                        pathname === "/admin" ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Admin Panel
                    </Link>
                    <Link 
                      href="/workers" 
                      className={cn(
                        "transition-colors",
                        pathname === "/workers" ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Workers
                    </Link>
                    <Link 
                      href="/analytics" 
                      className={cn(
                        "transition-colors",
                        pathname === "/analytics" ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Analytics
                    </Link>
                  </>
                ) : (
                  <Link 
                    href="/resident" 
                    className={cn(
                      "transition-colors",
                      pathname === "/resident" ? "text-green-500" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    My Complaints
                  </Link>
                )}
              </nav>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="mr-2"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Link 
                href="/login" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
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