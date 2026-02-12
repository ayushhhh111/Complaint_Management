"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminLoginPage() {
  // Use 'admin_name' to match your Django AdminUser model and SQLite table
  const [credentials, setCredentials] = useState({ admin_name: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Endpoint is generated in your Django urls.py
      const res = await fetch("http://127.0.0.1:8000/api/admin-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sending 'admin_name' as expected by your Django request.data.get('admin_name')
        body: JSON.stringify({ 
          admin_name: credentials.admin_name, 
          password: credentials.password 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the role and the access token returned by your updated views.py
        localStorage.setItem("user_role", "admin"); 
        // This 'access' key must be returned by your Django view Response
        localStorage.setItem("access_token", data.access); 
        
        // Redirect to the Admin Dashboard
        window.location.href = "/admin"; 
      } else {
        // Capture specific error messages (e.g., "Invalid Password") from Django
        setError(data.error || "Invalid admin credentials or unauthorized access.");
      }
    } catch (err) {
      setError("Connection to backend failed. Ensure Django is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <Card className="w-full max-w-md border-red-900/30 bg-zinc-900 text-zinc-100">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="p-3 rounded-full bg-red-500/10 mb-2">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Admin Access</CardTitle>
          <CardDescription className="text-zinc-400">
            Secure portal for housing society administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Administrator Username</label>
              <input
                type="text"
                required
                value={credentials.admin_name}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded focus:ring-2 focus:ring-red-500 outline-none text-white"
                placeholder="Enter admin name"
                onChange={(e) => setCredentials({ ...credentials, admin_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Security Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={credentials.password}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded focus:ring-2 focus:ring-red-500 outline-none text-white"
                  placeholder="••••••••"
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {loading ? "Verifying..." : "Unlock Dashboard"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
             <Link href="/admin/signup" className="text-red-500 hover:underline">
               New Admin? Request Account
             </Link>
             <Link href="/" className="flex items-center justify-center gap-1 text-zinc-500 hover:text-zinc-300">
               <ArrowLeft className="h-3 w-3" /> Back to Resident Portal
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}