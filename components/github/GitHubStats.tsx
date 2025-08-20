import Card from '@/components/ui/Card'

interface GitHubStatsProps {
  stats: {
    totalRepos: number
    totalCommits: number
    primaryLanguage: string
  }
}

export default function GitHubStats({ stats }: GitHubStatsProps) {
  return (
    <Card>
      <h3 className="text-white font-mono text-lg mb-4">Estadísticas</h3>
      <div className="space-y-2 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Repositorios públicos:</span>
          <span className="text-green-400">{stats.totalRepos}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total de commits:</span>
          <span className="text-green-400">{stats.totalCommits.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Lenguaje principal:</span>
          <span className="text-green-400">{stats.primaryLanguage}</span>
        </div>
      </div>
    </Card>
  )
}