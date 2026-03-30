'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-800 px-4 py-3 sticky top-0 bg-black/90 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-green-400 font-bold text-base font-mono hover:text-green-300 transition-colors"
        >
          dev@portfolio:~$
        </Link>
        <Navigation currentPath={pathname} />
      </div>
    </header>
  )
}
