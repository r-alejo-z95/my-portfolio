import { NextResponse } from 'next/server'
import type { GitHubRepo } from '@/types/github'

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
}

export async function GET() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME

    if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
      return NextResponse.json(
        { error: 'GitHub credentials not configured' },
        { status: 500 }
      )
    }

    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        next: { revalidate: 3600 }
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        next: { revalidate: 3600 }
      })
    ])

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error('Failed to fetch GitHub data')
    }

    const [user, repos]: [GitHubUser, GitHubRepo[]] = await Promise.all([
      userResponse.json(),
      reposResponse.json()
    ])

    const publicRepos = repos.filter((repo) => !repo.private && !repo.fork)
    const totalStars = publicRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = publicRepos.reduce((sum, repo) => sum + repo.forks_count, 0)

    const languages: { [key: string]: number } = {}
    publicRepos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    const primaryLanguage = Object.keys(languages).reduce((a, b) =>
      languages[a] > languages[b] ? a : b, 'JavaScript'
    )

    const stats = {
      totalRepos: user.public_repos,
      totalStars,
      totalForks,
      primaryLanguage,
      followers: user.followers,
      following: user.following,
      languageStats: languages
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
