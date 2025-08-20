'use client'
import { useState, useEffect } from 'react'
import GitHubStats from '@/components/github/GitHubStats'
import ActivityFeed from '@/components/github/ActivityFeed'
import ContributionGraph from '@/components/github/ContributionGraph'
import RepoCard from '@/components/github/RepoCard'
import type { GitHubRepo } from '@/types/github'

export default function GitHubSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)

  const mockStats = {
    totalRepos: 24,
    totalCommits: 1247,
    primaryLanguage: 'JavaScript'
  }

  useEffect(() => {
    // En producción esto haría fetch a /api/github/repos
    const mockRepos: GitHubRepo[] = [
      {
        id: 1,
        name: 'portfolio-nextjs',
        full_name: 'usuario/portfolio-nextjs',
        description: 'Mi portfolio personal construido con Next.js y TypeScript',
        html_url: 'https://github.com/usuario/portfolio-nextjs',
        clone_url: 'https://github.com/usuario/portfolio-nextjs.git',
        language: 'TypeScript',
        stargazers_count: 12,
        forks_count: 3,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-02-01T14:30:00Z',
        topics: ['nextjs', 'portfolio', 'typescript'],
        private: false
      },
      {
        id: 2,
        name: 'react-components-library',
        full_name: 'usuario/react-components-library',
        description: 'Librería de componentes reutilizables para React',
        html_url: 'https://github.com/usuario/react-components-library',
        clone_url: 'https://github.com/usuario/react-components-library.git',
        language: 'JavaScript',
        stargazers_count: 8,
        forks_count: 2,
        created_at: '2023-12-10T09:00:00Z',
        updated_at: '2024-01-28T16:45:00Z',
        topics: ['react', 'components', 'ui'],
        private: false
      }
    ]
    
    setTimeout(() => {
      setRepos(mockRepos)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-green-400 text-sm font-mono">$ git status</div>
        <div className="text-gray-400 font-mono">Cargando repositorios...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-green-400 text-sm mb-6 font-mono">$ git status</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GitHubStats stats={mockStats} />
        <ActivityFeed />
      </div>

      <ContributionGraph />

      <div>
        <h3 className="text-white font-mono text-xl mb-4">Repositorios Destacados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div>
    </div>
  )
}