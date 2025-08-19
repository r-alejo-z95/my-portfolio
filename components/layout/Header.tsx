'use client'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header className="border-b border-gray-800 p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-green-400 font-bold text-lg">
          dev@portfolio:~$
        </div>
        <Navigation currentPath={pathname} />
      </div>
    </header>
  )
}