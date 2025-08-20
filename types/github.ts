export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  topics: string[]
  private: boolean
  fork: boolean
  homepage: string | null
}

export interface GitHubStats {
  totalRepos: number
  totalCommits: number
  totalStars: number
  totalForks: number
  primaryLanguage: string
  contributionCount: number
  followers: number
  languageStats: { [key: string]: number }
}

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface GitHubActivity {
  type: string
  repo: string
  message: string
  date: string
}
