'use client'
import Image from 'next/image'
import { ExternalLink, Github, Pencil, Trash2, GripVertical } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface FeaturedProject {
  id: number
  name: string
  description: string | null
  repo_url: string | null
  live_url: string | null
  image_url: string | null
  technologies: string[]
}

interface AdminProjectCardProps {
  project: FeaturedProject
  onEdit: (project: FeaturedProject) => void
  onDelete: (project: FeaturedProject) => void
}

export default function AdminProjectCard({ project, onEdit, onDelete }: AdminProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800 border border-gray-700 overflow-hidden flex flex-col"
    >
      {project.image_url && (
        <div className="h-36 relative border-b border-gray-700">
          <Image
            src={project.image_url}
            alt={`${project.name} preview`}
            fill
            className="object-cover object-top"
            unoptimized
          />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing mt-0.5 flex-shrink-0 touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-white font-mono font-semibold truncate">{project.name}</p>
            {project.description && (
              <p className="text-gray-400 font-mono text-xs mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0 mt-0.5">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-400 transition-colors p-1"
                aria-label="Open live demo"
              >
                <ExternalLink size={14} />
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-400 transition-colors p-1"
                aria-label="Open repository"
              >
                <Github size={14} />
              </a>
            )}
          </div>
        </div>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map(tech => (
              <span
                key={tech}
                className="text-xs font-mono bg-gray-700 text-gray-300 px-1.5 py-0.5 border border-gray-600"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs font-mono text-gray-500 px-1">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-700">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(project)}
            className="flex-1 flex items-center gap-1.5 justify-center"
          >
            <Pencil size={12} /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(project)}
            className="flex-1 flex items-center gap-1.5 justify-center"
          >
            <Trash2 size={12} /> Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
