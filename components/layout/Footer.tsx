'use client'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const currentSection = pathname === '/' ? 'home' : pathname.slice(1)
  
  return (
    <footer className="border-t border-gray-800 p-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="text-gray-500 font-mono text-sm">
          <span className="text-green-400">➜</span> {currentSection} 
          <span className="animate-pulse ml-1">▊</span>
        </div>
      </div>
    </footer>
  )
}