import { Metadata } from 'next'
import GitHubSection from '@/components/sections/GitHubSection'

export const metadata: Metadata = {
  title: 'GitHub Activity - Ramon',
  description: 'Explore my GitHub activity, repositories, and contributions.',
}

export default function GitHubPage() {
  return (
    <div>
      <h1 className="text-3xl font-mono font-bold text-white mb-8">
        My GitHub Activity
      </h1>
      <GitHubSection />
    </div>
  )
}