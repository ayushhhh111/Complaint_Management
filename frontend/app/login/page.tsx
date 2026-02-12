"use client";
import { useState } from "react";
import { toast } from "sonner"; // Optional: for better notifications

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Store the token
        localStorage.setItem("access_token", data.access);
        // 2. Store the admin status (convert boolean to string)
        localStorage.setItem("is_staff", String(data.is_staff));
        
        // 3. Redirect based on role
        if (data.is_staff) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/resident";
        }
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 border border-zinc-800 p-8 rounded-xl bg-zinc-900">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input 
          type="text" 
          placeholder="Username" 
          required 
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 outline-none focus:border-green-500"
          onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 outline-none focus:border-green-500"
          onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}