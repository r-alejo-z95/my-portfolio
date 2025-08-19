import Link from 'next/link'
import { Github, Mail, User, Folder } from 'lucide-react'

interface NavigationProps {
  currentPath: string
}

const navigationItems = [
  { href: '/', label: '~/home', icon: User },
  { href: '/projects', label: '~/projects', icon: Folder },
  { href: '/github', label: '~/github', icon: Github },
  { href: '/contact', label: '~/contact', icon: Mail }
]

export default function Navigation({ currentPath }: NavigationProps) {
  return (
    <nav className="flex gap-6">
      {navigationItems.map(({ href, label, icon: Icon }) => {
        const isActive = currentPath === href
        
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 transition-colors ${
              isActive 
                ? 'text-green-400 border-b border-green-400' 
                : 'text-gray-400 hover:text-green-400'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}