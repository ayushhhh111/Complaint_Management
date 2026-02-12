"use client";
import { useState } from "react";
import { toast } from "sonner"; 
import Link from "next/link";

export default function SignupPage() {
  // 1. Expand state to include profile fields and the image file
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "",
    phone_number: "",
    address: "",
  });
  const [profileImg, setProfileImg] = useState<File | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Use FormData instead of a plain object
    const dataToSend = new FormData();
    dataToSend.append("username", formData.username);
    dataToSend.append("email", formData.email);
    dataToSend.append("password", formData.password);
    
    // 3. Append nested profile data
    dataToSend.append("profile.phone_number", formData.phone_number);
    dataToSend.append("profile.address", formData.address);
    
    if (profileImg) {
      dataToSend.append("profile.profile_img", profileImg);
    }

    // 4. Note: Remove "Content-Type" header; the browser sets it automatically for FormData
    const res = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      body: dataToSend, 
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Account created successfully!");
      window.location.href = "/login";
    } else {
      // Improved error handling for nested profile errors
      const errorMsg = data.password?.[0] || 
                       data.email?.[0] || 
                       data.username?.[0] || 
                       data.profile?.phone_number?.[0] ||
                       "Signup failed. Please check your entries.";
      toast.error(errorMsg);
    }
  };
  
 return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-4 border border-zinc-800 p-8 rounded-xl bg-zinc-900">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>
        
        <input type="text" placeholder="Username" required className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
          onChange={(e) => setFormData({...formData, username: e.target.value})} />
        
        <input type="email" placeholder="Email" required className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
          onChange={(e) => setFormData({...formData, email: e.target.value})} />
        
        <input type="password" placeholder="Password" required className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
          onChange={(e) => setFormData({...formData, password: e.target.value})} />

        {/* --- New Profile Fields --- */}
        <input type="text" placeholder="Phone Number" className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-sm"
          onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
        
        <textarea placeholder="Address" className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-sm"
          onChange={(e) => setFormData({...formData, address: e.target.value})} />

        <div className="space-y-1">
          <label className="text-xs text-zinc-500 ml-1">PROFILE IMAGE (OPTIONAL)</label>
          <input type="file" accept="image/*" className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
            onChange={(e) => setProfileImg(e.target.files?.[0] || null)} />
        </div>
        {/* ------------------------- */}

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-bold transition-colors">Sign Up</button>
        
        <p className="text-center text-sm text-zinc-400">
          Already have an account? <Link href="/login" className="text-green-500 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}