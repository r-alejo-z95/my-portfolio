'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import RepoCard from '@/components/github/RepoCard'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { GitHubRepo } from '@/types/github'

interface FeaturedProject {
  id: number
  name: string
  description: string | null
  repo_url: string | null
  live_url: string | null
  technologies: string[]
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState<User | null>(null)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      try {
        const [reposRes, projectsRes] = await Promise.all([
          fetch('/api/github/repos'),
          fetch('/api/projects'),
        ])

        if (!reposRes.ok || !projectsRes.ok) {
          throw new Error('Failed to fetch initial data')
        }

        const repos = await reposRes.json()
        const projects = await projectsRes.json()

        setGithubRepos(repos)
        setFeaturedProjects(projects)

      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleFeatureProject = async (repo: GitHubRepo) => {
    setIsSubmitting(true)
    const techInput = prompt(`Enter technologies for "${repo.name}" (comma-separated):`)

    if (techInput) {
      const technologies = techInput.split(',').map(t => t.trim()).filter(Boolean)
      
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: repo.name,
          description: repo.description,
          repo_url: repo.html_url,
          live_url: repo.homepage,
          technologies: technologies,
        }),
      })

      if (response.ok) {
        const newProject = await response.json()
        setFeaturedProjects(prev => [newProject, ...prev])
      } else {
        const { error } = await response.json()
        alert(`Error: ${error}`)
      }
    }
    setIsSubmitting(false)
  }

  const handleRemoveProject = async (projectId: number) => {
    setIsSubmitting(true)
    if (confirm('Are you sure you want to remove this project?')) {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFeaturedProjects(prev => prev.filter(p => p.id !== projectId))
      } else {
        const { error } = await response.json()
        alert(`Error: ${error}`)
      }
    }
    setIsSubmitting(false)
  }

  const featuredRepoNames = new Set(featuredProjects.map(p => p.name))
  const availableRepos = githubRepos.filter(repo => !featuredRepoNames.has(repo.name))

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {user && <p className="text-gray-400">Welcome, {user.email}</p>}
        </div>
        <Button onClick={handleLogout} disabled={isSubmitting}>Logout</Button>
      </header>

      {error && <p className="text-red-400 mb-4">Error: {error}</p>}

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Featured Projects ({featuredProjects.length})</h2>
          <div className="space-y-3">
            {featuredProjects.map(proj => (
              <div key={proj.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <span className="font-semibold">{proj.name}</span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveProject(proj.id)}
                  disabled={isSubmitting}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Available GitHub Repos ({availableRepos.length})</h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
            {availableRepos.map(repo => (
                <div key={repo.id} className="flex flex-col gap-1">
                  <RepoCard repo={repo} />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleFeatureProject(repo)}
                    disabled={isSubmitting}
                  >
                    Feature
                  </Button>
                </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
