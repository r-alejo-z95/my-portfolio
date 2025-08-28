import { Metadata } from 'next'
import ProjectsSection from '@/components/sections/ProjectsSection'

export const metadata: Metadata = {
  title: 'Projects - Ramon',
  description: 'Explore my web and application development projects.',
}

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-mono font-bold text-white mb-8">
        My Projects
      </h1>
      <ProjectsSection />
    </div>
  )
}