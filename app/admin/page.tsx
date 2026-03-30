'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { GitHubRepo } from '@/types/github'
import AdminProjectCard from '@/components/admin/AdminProjectCard'
import ProjectModal from '@/components/admin/ProjectModal'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { Plus, Github, LogOut } from 'lucide-react'

interface FeaturedProject {
  id: number
  name: string
  description: string | null
  repo_url: string | null
  live_url: string | null
  image_url: string | null
  technologies: string[]
}

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'import'; data: Partial<FeaturedProject> }
  | { type: 'edit'; project: FeaturedProject }

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })
  const [deleteTarget, setDeleteTarget] = useState<FeaturedProject | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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
          throw new Error('Failed to fetch data')
        }

        setGithubRepos(await reposRes.json())
        setFeaturedProjects(await projectsRes.json())
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error')
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

  const handleProjectSuccess = (project: FeaturedProject) => {
    if (modalState.type === 'edit') {
      setFeaturedProjects(prev => prev.map(p => p.id === project.id ? project : p))
    } else {
      setFeaturedProjects(prev => [project, ...prev])
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    const response = await fetch(`/api/admin/projects/${deleteTarget.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setFeaturedProjects(prev => prev.filter(p => p.id !== deleteTarget.id))
    } else {
      const data = await response.json()
      setError(`Failed to remove: ${data.error}`)
    }

    setIsDeleting(false)
    setDeleteTarget(null)
  }

  const getModalInitialData = (): Partial<FeaturedProject> | undefined => {
    if (modalState.type === 'edit') return modalState.project
    if (modalState.type === 'import') return modalState.data
    return undefined
  }

  const featuredNames = new Set(featuredProjects.map(p => p.name))
  const availableRepos = githubRepos.filter(repo => !featuredNames.has(repo.name))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-green-400 font-mono animate-pulse">$ loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
        <div>
          <div className="text-green-400 text-xs font-mono mb-1">$ admin --dashboard</div>
          <h1 className="text-2xl font-mono font-bold text-white">Portfolio Admin</h1>
          {user && (
            <p className="text-gray-500 font-mono text-sm mt-1">{user.email}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={14} />
          Logout
        </Button>
      </header>

      {error && (
        <div className="bg-red-950/30 border border-red-800 text-red-400 font-mono text-sm p-3 mb-6">
          {error}
        </div>
      )}

      {/* Section A: Featured Projects */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-mono text-xl">
            <span className="text-green-400">// </span>featured projects
            <span className="text-gray-600 text-sm ml-3">({featuredProjects.length})</span>
          </h2>
          <Button
            size="sm"
            onClick={() => setModalState({ type: 'create' })}
            className="flex items-center gap-2"
          >
            <Plus size={14} />
            Add Project
          </Button>
        </div>

        {featuredProjects.length === 0 ? (
          <p className="text-gray-600 font-mono text-sm border border-dashed border-gray-800 p-6 text-center">
            // No featured projects yet. Click &quot;Add Project&quot; to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProjects.map(project => (
              <AdminProjectCard
                key={project.id}
                project={project}
                onEdit={project => setModalState({ type: 'edit', project })}
                onDelete={project => setDeleteTarget(project)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section B: Import from GitHub */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Github size={16} className="text-gray-400" />
          <h2 className="text-white font-mono text-xl">
            <span className="text-green-400">// </span>import from github
            <span className="text-gray-600 text-sm ml-3">({availableRepos.length} available)</span>
          </h2>
        </div>

        {availableRepos.length === 0 ? (
          <p className="text-gray-600 font-mono text-sm">
            // All public repos are already featured.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {availableRepos.map(repo => (
              <div
                key={repo.id}
                className="bg-gray-800 border border-gray-700 p-4 flex justify-between items-start gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-mono font-semibold text-sm truncate">
                    {repo.name}
                  </p>
                  {repo.description && (
                    <p className="text-gray-400 font-mono text-xs mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  {repo.language && (
                    <span className="text-xs font-mono text-green-400 mt-2 inline-block">
                      {repo.language}
                    </span>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() =>
                    setModalState({
                      type: 'import',
                      data: {
                        name: repo.name,
                        description: repo.description,
                        repo_url: repo.html_url,
                        live_url: repo.homepage ?? undefined,
                        technologies: repo.language ? [repo.language] : [],
                      },
                    })
                  }
                >
                  Import
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <ProjectModal
        isOpen={modalState.type !== 'closed'}
        mode={modalState.type === 'edit' ? 'edit' : 'create'}
        initialData={getModalInitialData()}
        onClose={() => setModalState({ type: 'closed' })}
        onSuccess={handleProjectSuccess}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Remove Project"
        message={`Remove "${deleteTarget?.name}" from featured projects?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
