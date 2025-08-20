import { NextResponse } from 'next/server'

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

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10&type=public`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        next: { revalidate: 3600 } // Cache 1 hora
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos = await response.json()

    // Filtrar y formatear repos
    const formattedRepos = repos
      .filter((repo: any) => !repo.fork && !repo.private) // Solo repos originales y públicos
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        homepage: repo.homepage
      }))

    return NextResponse.json(formattedRepos)

  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}