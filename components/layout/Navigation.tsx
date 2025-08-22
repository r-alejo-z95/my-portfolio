import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Github, Mail, User, Folder, Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { AnimatePresence, motion } from 'framer-motion'

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
  const [mobileMenuState, setMobileMenuState] = useState<boolean>(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuState(false)
      }
    }

    if (mobileMenuState) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuState])

  const handleMobileLinkClick = () => {
    setMobileMenuState(false)
  }

  return (
    <nav
      ref={navRef}
      data-state={mobileMenuState ? 'active' : 'inactive'}
    >
      <Button
        onClick={() => setMobileMenuState(!mobileMenuState)}
        aria-label={mobileMenuState ? 'Close Menu' : 'Open Menu'}
        className="relative z-20 block cursor-pointer p-2.5 lg:hidden"
      >
        <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
        <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
      </Button>

      <AnimatePresence>
        {mobileMenuState && (
          <motion.div 
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -200 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-3 w-full bg-black/90 p-6 shadow-2xl shadow-zinc-300/20 lg:hidden"
          >
            <ul className="space-y-6 text-base">
              {navigationItems.map(({ href, label, icon: Icon }) => {
                const isActive = currentPath === href
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={handleMobileLinkClick}
                      className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                        isActive
                          ? 'text-green-400 border-b border-green-400'
                          : 'text-gray-400 hover:text-green-400'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:items-center lg:gap-6">
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
      </div>
    </nav>
  )
}