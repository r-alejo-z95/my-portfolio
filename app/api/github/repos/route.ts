import { NextResponse } from 'next/server'
import type { GitHubRepo } from '@/types/github'

export async function GET() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'tu-usuario'

    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN no está configurado')
    }

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        next: { revalidate: 3600 } // Cache por 1 hora
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos: GitHubRepo[] = await response.json()

    // Filtrar repositorios públicos y agregar información adicional
    const filteredRepos = repos
      .filter(repo => !repo.private)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        private: repo.private
      }))

    return NextResponse.json(filteredRepos)

  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return NextResponse.json(
      { error: 'Error al obtener repositorios' },
      { status: 500 }
    )
  }
}