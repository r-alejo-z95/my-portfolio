'use client'
import { useEffect, useState } from 'react'
import GitHubStats from '@/components/github/GitHubStats'
import ContributionGraph from '@/components/github/ContributionGraph'
import { SOCIAL_LINKS } from '@/lib/constants'
import type { GitHubStats as GitHubStatsType } from '@/types/github'
import Link from 'next/link'
import { Github } from 'lucide-react'

export default function GitHubSection() {
  const [stats, setStats] = useState<GitHubStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const statsResponse = await fetch('/api/github/stats')

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch GitHub data')
        }

        const statsData = await statsResponse.json()
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
          Loading GitHub data...
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
        <Link 
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors"
        >
          <Github size={20} />
          <span>github.com/r-alejo-z95</span>
        </Link>
      {stats && <GitHubStats stats={stats} />}
      
      <ContributionGraph />

      {/* <div>
        <h3 className="text-white font-mono text-xl mb-4">Recent Repositories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.slice(0, 6).map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div> */}
    </div>
  )
}
