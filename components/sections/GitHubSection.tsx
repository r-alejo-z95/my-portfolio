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
        if (!statsResponse.ok) throw new Error('Failed to fetch GitHub data')
        setStats(await statsResponse.json())
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
        <div className="text-green-400 text-sm font-mono">$ git log --oneline</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="border border-gray-800 bg-gray-900/30 p-6 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-1/3 mb-4" />
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="h-3 bg-gray-800 rounded w-full mb-2" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-green-400 text-sm font-mono">$ git log --oneline</div>
        <div className="text-red-400 font-mono text-sm">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-green-400 text-sm font-mono">$ git log --oneline</div>
        <Link
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors font-mono text-sm"
        >
          <Github size={16} />
          <span>github.com/r-alejo-z95</span>
        </Link>
      </div>

      {stats && <GitHubStats stats={stats} />}
      <ContributionGraph />
    </div>
  )
}
