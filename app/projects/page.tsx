import { Metadata } from 'next'
import ProjectsSection from '@/components/sections/ProjectsSection'

export const metadata: Metadata = {
  title: 'Proyectos - Ramon',
  description: 'Explora mis proyectos de desarrollo web y aplicaciones.',
}

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-mono font-bold text-white mb-8">
        Mis Proyectos
      </h1>
      <ProjectsSection />
    </div>
  )
}