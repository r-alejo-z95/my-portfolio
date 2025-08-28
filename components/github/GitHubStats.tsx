import Card from '@/components/ui/Card'

interface GitHubStatsProps {
  stats: {
    totalRepos: number
    totalStars: number
    totalForks: number
    primaryLanguage: string
    followers: number
    languageStats: { [key: string]: number }
  }
}

export default function GitHubStats({ stats }: GitHubStatsProps) {
  const topLanguages = Object.entries(stats.languageStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <h3 className="text-white font-mono text-lg mb-4">Statistics</h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Public Repositories:</span>
            <span className="text-green-400">{stats.totalRepos}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Stars:</span>
            <span className="text-green-400">{stats.totalStars}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Forks:</span>
            <span className="text-green-400">{stats.totalForks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Followers:</span>
            <span className="text-green-400">{stats.followers}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-white font-mono text-lg mb-4">Top Languages</h3>
        <div className="space-y-2 font-mono text-sm">
          {topLanguages.map(([language, count]) => (
            <div key={language} className="flex justify-between">
              <span className="text-gray-400">{language}:</span>
              <span className="text-green-400">{count} repos</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}