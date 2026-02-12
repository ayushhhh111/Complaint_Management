"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignupPage() {
  const [formData, setFormData] = useState({ admin_name: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/api/admin-signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Admin created! You can now login.");
      router.push("/admin/login");
    } else {
      setMsg("Signup failed. Name might be taken.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form onSubmit={handleSignup} className="p-8 bg-zinc-900 rounded-lg border border-zinc-800 space-y-4">
        <h2 className="text-2xl font-bold">Create Admin Account</h2>
        {msg && <p className="text-red-500">{msg}</p>}
        <input 
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="New Admin Name"
          onChange={(e) => setFormData({...formData, admin_name: e.target.value})} 
        />
        <input 
          type="password"
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="New Password"
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button className="w-full bg-red-600 p-2 rounded font-bold">Register Admin</button>
      </form>
    </div>
  );
}