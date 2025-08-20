import Link from 'next/link'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { GitHubRepo } from '@/types/github'

interface RepoCardProps {
  repo: GitHubRepo
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card variant="interactive">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-white font-mono text-lg group-hover:text-green-400 transition-colors">
          {repo.name}
        </h3>
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-green-400 transition-colors"
        >
          <ExternalLink size={16} />
        </Link>
      </div>
      
      <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed">
        {repo.description || 'No hay descripción disponible'}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-mono">
          {repo.language && (
            <span className="text-gray-300">{repo.language}</span>
          )}
          <div className="flex items-center gap-1 text-gray-400">
            <Star size={14} />
            {repo.stargazers_count}
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <GitFork size={14} />
            {repo.forks_count}
          </div>
        </div>
        <span className="text-xs font-mono text-gray-500">
          {new Date(repo.updated_at).toLocaleDateString()}
        </span>
      </div>
    </Card>
  )
}