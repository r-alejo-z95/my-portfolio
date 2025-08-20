const GITHUB_API_BASE = 'https://api.github.com'

export interface GitHubApiConfig {
  token?: string
  username: string
}

export class GitHubApi {
  private config: GitHubApiConfig

  constructor(config: GitHubApiConfig) {
    this.config = config
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${GITHUB_API_BASE}${endpoint}`
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App'
    }

    if (this.config.token) {
      headers.Authorization = `Bearer ${this.config.token}`
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getUser() {
    return this.request(`/users/${this.config.username}`)
  }

  async getRepos(options: { sort?: 'created' | 'updated' | 'pushed' | 'full_name', per_page?: number } = {}) {
    const searchParams = new URLSearchParams({
      sort: options.sort || 'updated',
      per_page: (options.per_page || 30).toString()
    })
    
    return this.request(`/users/${this.config.username}/repos?${searchParams}`)
  }

  async getRepoLanguages(repo: string) {
    return this.request(`/repos/${this.config.username}/${repo}/languages`)
  }

  async getRepoContributors(repo: string) {
    return this.request(`/repos/${this.config.username}/${repo}/contributors`)
  }
}