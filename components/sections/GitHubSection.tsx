'use client'
import { useEffect, useState } from 'react'
import GitHubStats from '@/components/github/GitHubStats'
import ContributionGraph from '@/components/github/ContributionGraph'
import RepoCard from '@/components/github/RepoCard'
import type { GitHubRepo } from '@/types/github'

export default function GitHubSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const [reposResponse, statsResponse] = await Promise.all([
          fetch('/api/github/repos'),
          fetch('/api/github/stats')
        ])

        if (!reposResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch GitHub data')
        }

        const [reposData, statsData] = await Promise.all([
          reposResponse.json(),
          statsResponse.json()
        ])

        setRepos(reposData)
        setStats(statsData)
      } catch (err) {
        setError('Error loading GitHub data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-green-400 text-sm font-mono">$ git status</div>
        <div className="text-gray-400 font-mono animate-pulse">
          Cargando datos de GitHub...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-green-400 text-sm font-mono">$ git status</div>
        <div className="text-red-400 font-mono">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-green-400 text-sm mb-6 font-mono">$ git status</div>
      
      {stats && <GitHubStats stats={stats} />}
      
      <ContributionGraph />

      <div>
        <h3 className="text-white font-mono text-xl mb-4">Repositorios Recientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.slice(0, 6).map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div>
    </div>
  )
}