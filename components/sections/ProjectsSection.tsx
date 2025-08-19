import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

// Mock data - en producción vendría de una API o CMS
const projects = [
  {
    id: 1,
    name: 'e-commerce-app',
    description: 'Aplicación de e-commerce moderna construida con Next.js, Stripe y PostgreSQL.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe'],
    github: 'https://github.com/usuario/e-commerce-app',
    demo: 'https://mi-ecommerce.vercel.app',
    featured: true
  },
  {
    id: 2,
    name: 'task-manager',
    description: 'Gestor de tareas colaborativo con tiempo real usando Socket.io y React.',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    github: 'https://github.com/usuario/task-manager',
    demo: 'https://mi-taskmanager.vercel.app',
    featured: true
  },
  {
    id: 3,
    name: 'weather-dashboard',
    description: 'Dashboard del clima con visualización de datos y pronósticos.',
    technologies: ['Next.js', 'Chart.js', 'API Rest', 'Tailwind'],
    github: 'https://github.com/usuario/weather-dashboard',
    demo: 'https://mi-weather.vercel.app',
    featured: false
  }
]

interface ProjectCardProps {
  project: typeof projects[0]
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card variant="interactive">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-mono text-xl group-hover:text-green-400 transition-colors">
          {project.name}.js
        </h3>
        <div className="flex gap-2">
          <Link 
            href={project.demo} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            <ExternalLink size={20} />
          </Link>
          <Link 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            <Github size={20} />
          </Link>
        </div>
      </div>
      
      <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed">
        {project.description}
      </p>
      
      <div className="flex gap-2 flex-wrap">
        {project.technologies.map((tech) => (
          <span 
            key={tech} 
            className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 border border-gray-700"
          >
            {tech}
          </span>
        ))}
      </div>
    </Card>
  )
}

export default function ProjectsSection() {
  return (
    <section>
      <div className="text-green-400 text-sm mb-6 font-mono">$ ls ~/projects</div>
      
      <div className="space-y-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link href="/projects">
          <Button variant="outline">Ver todos los proyectos</Button>
        </Link>
      </div>
    </section>
  )
}