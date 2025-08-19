export const NAVIGATION_ITEMS = [
  { href: '/', label: '~/home', section: 'home' },
  { href: '/projects', label: '~/projects', section: 'projects' },
  { href: '/github', label: '~/github', section: 'github' },
  { href: '/contact', label: '~/contact', section: 'contact' }
] as const

export const SKILLS = {
  frontend: {
    title: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
  },
  backend: {
    title: 'Backend', 
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Prisma']
  },
  tools: {
    title: 'Herramientas',
    technologies: ['Git', 'Docker', 'Vercel', 'AWS', 'Figma']
  }
} as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/tu-usuario',
  email: 'tu@email.com',
  linkedin: 'https://linkedin.com/in/tu-usuario'
} as const