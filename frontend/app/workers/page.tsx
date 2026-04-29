'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchWorkers, createWorker, deleteWorker } from '@/lib/api'
import type { Worker } from '@/lib/types'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { LoadingState } from '@/components/loading-spinner'

export default function WorkersPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workerName, setWorkerName] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [isCreating, setIsCreating] = useState(false)

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
      loadWorkers()
    } else {
      setAuthorized(false)
    }
  }, [])

  const loadWorkers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchWorkers()
      setWorkers(data)
    } catch (err) {
      setError('Failed to load workers. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!workerName.trim() || !workerId.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setIsCreating(true)
      const newWorker = await createWorker({
        worker_name: workerName,
        worker_id: workerId,
      })
      setWorkers([...workers, newWorker])
      setWorkerName('')
      setWorkerId('')
      toast.success('Worker created successfully')
    } catch (err) {
      toast.error('Failed to create worker')
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteWorker = async (id: number) => {
    if (!confirm('Are you sure you want to delete this worker?')) {
      return
    }

    try {
      await deleteWorker(id)
      setWorkers(workers.filter(w => w.id !== id))
      toast.success('Worker deleted successfully')
    } catch (err) {
      toast.error('Failed to delete worker')
      console.error(err)
    }
  }

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
          <LoadingState message="Loading workers..." />
        </main>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Workers Management
          </h1>
          <p className="text-muted-foreground">
            Manage and assign workers for complaint resolution
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button 
              onClick={loadWorkers} 
              variant="ghost" 
              size="sm"
              className="ml-auto"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Add New Worker */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Add New Worker</CardTitle>
            <CardDescription>
              Create a new worker entry for complaint assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateWorker} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Worker Name"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                disabled={isCreating}
                className="flex-1"
              />
              <Input
                placeholder="Worker ID"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                disabled={isCreating}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isCreating}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Worker
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Workers List */}
        <div className="grid gap-4">
          {workers.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No workers found. Create one to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            workers.map((worker) => (
              <Card key={worker.id} className="bg-card border-border hover:border-border/80 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {worker.worker_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {worker.worker_id}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {new Date(worker.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWorker(worker.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
