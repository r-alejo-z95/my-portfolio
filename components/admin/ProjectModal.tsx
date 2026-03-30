'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import TagInput from './TagInput'

interface FeaturedProject {
  id: number
  name: string
  description: string | null
  repo_url: string | null
  live_url: string | null
  image_url: string | null
  technologies: string[]
}

interface ProjectFormData {
  name: string
  description: string
  live_url: string
  repo_url: string
  image_url: string
  technologies: string[]
}

interface ProjectModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  initialData?: Partial<FeaturedProject>
  onClose: () => void
  onSuccess: (project: FeaturedProject) => void
}

const EMPTY_FORM: ProjectFormData = {
  name: '',
  description: '',
  live_url: '',
  repo_url: '',
  image_url: '',
  technologies: [],
}

function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

export default function ProjectModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSuccess,
}: ProjectModalProps) {
  const [form, setForm] = useState<ProjectFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? {
        name: initialData.name ?? '',
        description: initialData.description ?? '',
        live_url: initialData.live_url ?? '',
        repo_url: initialData.repo_url ?? '',
        image_url: initialData.image_url ?? '',
        technologies: initialData.technologies ?? [],
      } : EMPTY_FORM)
      setErrors({})
      setServerError(null)
      setImageError(false)
    }
  }, [isOpen, initialData])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (form.technologies.length === 0) newErrors.technologies = 'Add at least one technology'
    for (const field of ['image_url', 'live_url', 'repo_url'] as const) {
      if (form[field] && !isValidUrl(form[field])) {
        newErrors[field] = 'Must be a valid URL (include https://)'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setServerError(null)

    const body = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      live_url: form.live_url.trim() || null,
      repo_url: form.repo_url.trim() || null,
      image_url: form.image_url.trim() || null,
      technologies: form.technologies,
    }

    try {
      if (mode === 'edit' && !initialData?.id) {
        setServerError('Cannot edit: project ID is missing.')
        return
      }
      const isEdit = mode === 'edit'
      const url = isEdit
        ? `/api/admin/projects/${initialData!.id}`
        : '/api/admin/projects'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.error ?? 'Something went wrong')
        return
      }

      onSuccess(data)
      onClose()
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const setField = (field: keyof Omit<ProjectFormData, 'technologies'>) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const screenshotUrl = isValidUrl(form.live_url)
    ? `https://api.microlink.io/?url=${encodeURIComponent(form.live_url)}&screenshot=true&meta=false&embed=screenshot.url`
    : null

  const handleGenerateScreenshot = () => {
    if (!screenshotUrl) return
    if (form.image_url && form.image_url !== screenshotUrl) {
      if (!window.confirm('This will replace the existing preview image URL. Continue?')) return
    }
    setField('image_url')(screenshotUrl)
    setImageError(false)
  }

  const showImagePreview = form.image_url && !imageError && isValidUrl(form.image_url)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div>
            <div className="text-green-400 text-xs font-mono mb-0.5">
              {mode === 'edit' ? '// editing project' : '// new project'}
            </div>
            <h2 className="text-white font-mono text-lg">
              {mode === 'edit' ? `Edit: ${initialData?.name}` : 'Add Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            label="Name *"
            value={form.name}
            onChange={e => setField('name')(e.target.value)}
            placeholder="my-awesome-project"
            error={errors.name}
          />

          <div className="space-y-2">
            <label className="block text-sm font-mono text-gray-300">Description</label>
            <textarea
              value={form.description}
              onChange={e => setField('description')(e.target.value)}
              placeholder="What does this project do?"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 p-3 text-white font-mono text-sm focus:border-green-400 focus:outline-none transition-colors placeholder:text-gray-500 resize-none"
            />
          </div>

          <Input
            label="Live URL"
            value={form.live_url}
            onChange={e => setField('live_url')(e.target.value)}
            placeholder="https://my-project.vercel.app"
            error={errors.live_url}
          />

          <div className="space-y-1">
            <Input
              label="Repo URL — leave blank for private projects"
              value={form.repo_url}
              onChange={e => setField('repo_url')(e.target.value)}
              placeholder="https://github.com/user/repo"
              error={errors.repo_url}
            />
            <p className="text-gray-600 text-xs font-mono pl-0.5">
              Leaving this blank hides the GitHub icon on the public site
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-mono text-gray-300">Preview Image URL</label>
              <button
                type="button"
                onClick={handleGenerateScreenshot}
                disabled={!screenshotUrl}
                className="text-xs font-mono px-2 py-1 border border-gray-700 text-gray-400 hover:border-green-400 hover:text-green-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                generate from live url
              </button>
            </div>
            <Input
              value={form.image_url}
              onChange={e => {
                setField('image_url')(e.target.value)
                setImageError(false)
              }}
              placeholder="https://..."
              error={errors.image_url}
            />
            {showImagePreview && (
              <div className="h-32 relative border border-gray-700 overflow-hidden">
                <Image
                  src={form.image_url}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              </div>
            )}
          </div>

          <div>
            <TagInput
              label="Technologies *"
              value={form.technologies}
              onChange={tags => {
                setForm(prev => ({ ...prev, technologies: tags }))
                if (errors.technologies) setErrors(prev => ({ ...prev, technologies: undefined }))
              }}
            />
            {errors.technologies && (
              <p className="text-red-400 text-sm font-mono mt-1">{errors.technologies}</p>
            )}
          </div>

          {serverError && (
            <div className="text-red-400 text-sm font-mono bg-red-950/30 border border-red-800 p-3">
              {serverError}
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-gray-800">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? 'Saving...'
                : mode === 'edit' ? 'Save Changes' : 'Add Project'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
