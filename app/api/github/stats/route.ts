import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'tu-usuario'

    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN no está configurado')
    }

    // Obtener información del usuario
    const userResponse = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        next: { revalidate: 3600 }
      }
    )

    // Obtener repositorios para estadísticas
    const reposResponse = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        next: { revalidate: 3600 }
      }
    )

    if (!userResponse.ok || !reposResponse.ok) {
      throw new Error('Error fetching GitHub data')
    }

    const user = await userResponse.json()
    const repos = await reposResponse.json()

    // Calcular estadísticas
    const publicRepos = repos.filter((repo: any) => !repo.private)
    const languages = publicRepos.reduce((acc: any, repo: any) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1
      }
      return acc
    }, {})

    const primaryLanguage = Object.keys(languages).reduce((a, b) =>
      languages[a] > languages[b] ? a : b, 'JavaScript'
    )

    const stats = {
      totalRepos: user.public_repos,
      totalCommits: 1247, // Esto requeriría más llamadas a la API para calcularlo exactamente
      totalStars: publicRepos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
      totalForks: publicRepos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
      primaryLanguage,
      contributionCount: 365 // Esto también requeriría la API de GraphQL
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}