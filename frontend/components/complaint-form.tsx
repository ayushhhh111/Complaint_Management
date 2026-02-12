"use client"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent,CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Send, AlertTriangle,AlertCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ComplaintForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false) 
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const token = localStorage.getItem("access_token")
    const formData = new FormData(e.currentTarget)
  
    formData.set("is_urgent", String(isUrgent))

    try {
      const res = await fetch("http://127.0.0.1:8000/api/complaints/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData, 
      })

      if (res.ok) {
        toast.success("Complaint Submitted successfully")
        formRef.current?.reset()
        setIsUrgent(false)
        onSuccess()
      } else {
        const err = await res.json()
        toast.error(err.message || "Enable to submit Complaint")
      }
    } catch (error) {
      toast.error("Network error: Could not reach server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto shadow-lg border-muted/40 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">Submit New Issue</CardTitle>
        </div>
        <CardDescription>
          Provide details about your concern and we'll get back to you.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-1.5">
            <Label htmlFor="title">Issue Title</Label>
            <Input 
              id="title"
              name="title" 
              placeholder="Briefly describe the problem" 
              required 
              className="bg-white focus-visible:ring-primary/50 text-black"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Details</Label>
            <Textarea 
              id="description"
              name="description" 
              placeholder="Tell us more about what's happening..." 
              className="min-h-[100px] bg-white resize-none text-black" 
              required 
            />
          </div>
          
          <div className="space-y-1.5">
    <Label htmlFor="department">Department</Label>
    <Select name="department" required>
      <SelectTrigger className="bg-white text-black focus:ring-primary/50">
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="water">Water</SelectItem>
        <SelectItem value="maintenance">Maintenance</SelectItem>
        <SelectItem value="parking">Parking</SelectItem>
        <SelectItem value="security">Security</SelectItem>
        <SelectItem value="noise">Noise</SelectItem>
        <SelectItem value="cleanliness">Cleanliness</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  </div>
          <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isUrgent ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-800 bg-zinc-900/50'}`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${isUrgent ? 'text-amber-500' : 'text-zinc-500'}`} />
              <Label htmlFor="is_urgent" className="text-sm font-medium cursor-pointer">Mark as Urgent</Label>
            </div>
            <Checkbox 
              id="is_urgent" 
              checked={isUrgent} 
              onCheckedChange={(checked) => setIsUrgent(!!checked)}
              className="border-zinc-700 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400 flex items-center gap-2">
              <Upload className="w-3 h-3" /> ATTACH IMAGE (OPTIONAL)
            </Label>
            <Input 
              name="image" 
              type="file" 
              accept="image/*" 
              className="bg-white text-zinc-900 cursor-pointer file:font-bold file:text-emerald-600 hover:bg-zinc-100 transition-colors" 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 shadow-lg shadow-emerald-900/20" 
            disabled={loading}
          >
            {loading ? "Syncing to DB..." : "RAISE COMPLAINT"}
            {!loading && <Send className="ml-2 w-4 h-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}