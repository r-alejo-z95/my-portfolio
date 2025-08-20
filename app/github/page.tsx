import { Metadata } from 'next'
import GitHubSection from '@/components/sections/GitHubSection'

export const metadata: Metadata = {
  title: 'GitHub - Mi Portfolio',
  description: 'Explora mi actividad en GitHub, repositorios y contribuciones.',
}

export default function GitHubPage() {
  return (
    <div>
      <h1 className="text-3xl font-mono font-bold text-white mb-8">
        GitHub Activity
      </h1>
      <GitHubSection />
    </div>
  )
}