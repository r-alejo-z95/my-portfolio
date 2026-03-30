import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import Card from '@/components/ui/Card'

interface Project {
  id: number;
  name: string;
  description: string | null;
  repo_url: string | null;
  live_url: string | null;
  image_url: string | null;
  technologies: string[];
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects`, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error('Failed to fetch projects');
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Error in getFeaturedProjects:', error);
    return [];
  }
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card variant="interactive">
      {project.image_url && (
        <div className="h-80 relative mb-4 border border-gray-800 overflow-hidden -mx-6 -mt-6">
          <Image
            src={project.image_url}
            alt={`${project.name} preview`}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-mono text-xl group-hover:text-green-400 transition-colors">
          {project.name}.js
        </h3>
        <div className="flex gap-3">
          {project.live_url && (
            <Link
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors"
              aria-label={`Live demo for ${project.name}`}
            >
              <ExternalLink size={20} />
            </Link>
          )}
          {project.repo_url && (
            <Link
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors"
              aria-label={`GitHub repository for ${project.name}`}
            >
              <Github size={20} />
            </Link>
          )}
        </div>
      </div>

      {project.description && (
        <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed">
          {project.description}
        </p>
      )}

      <div className="flex gap-2 flex-wrap">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 border border-gray-700 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
    </Card>
  )
}

export default async function ProjectsSection() {
  const projects = await getFeaturedProjects();

  return (
    <section>
      <div className="text-green-400 text-sm mb-6 font-mono">$ ls ~/featured-projects</div>

      {projects.length > 0 ? (
        <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 font-mono">
          <p>{'// No featured projects yet.'}</p>
          <p>{'// Use the '}<Link href="/admin" className="text-green-400 underline">/admin</Link>{' dashboard to add some.'}</p>
        </div>
      )}
    </section>
  )
}
