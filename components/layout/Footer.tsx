'use client'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const currentSection = pathname === '/' ? 'home' : pathname.slice(1)
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 px-4 py-5 mt-auto">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-gray-500 font-mono text-sm">
          <span className="text-green-400">➜</span>{' '}
          <span className="text-gray-400">{currentSection}</span>
          <span className="animate-pulse ml-1 text-green-400">▊</span>
        </div>
        <span className="text-gray-700 font-mono text-xs">
          © {year} Ramon Zambrano
        </span>
      </div>
    </footer>
  )
}
