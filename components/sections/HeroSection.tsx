'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

interface HeroSectionProps {
  onDownloadRequest: (onConfirm: () => void) => void;
  className?: string;
}

export default function HeroSection({ onDownloadRequest, className }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleDownloadCV = async () => {
    if (isDownloading) return
    setIsDownloading(true)
    setDownloadError(null)

    try {
      const response = await fetch('/api/download-cv')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const blob = await response.blob()
      if (blob.size === 0) throw new Error('Downloaded file is empty')

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'Ramon_Zambrano_developer.pdf'
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('Error during CV download:', error)
      let errorMessage = 'Error downloading CV. Please try again later.'
      if (error instanceof Error) {
        if (error.message.includes('HTTP error')) errorMessage = 'Server is unavailable. Please try again later.'
        else if (error.message.includes('empty')) errorMessage = 'File is empty or corrupted.'
      }
      setDownloadError(errorMessage)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section
      className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col ${className}`}
    >
      <div className="flex flex-col-reverse items-center md:flex-row md:justify-between md:items-start lg:mr-16 mb-8 gap-8">
        <div className="flex-1">
          <div className="text-green-400 text-sm mb-3 font-mono tracking-wider">$ whoami</div>
          <h1 className="text-4xl md:text-6xl font-mono font-bold text-white mb-6 leading-tight">
            Full Stack<br />
            <span className="text-green-400">
              Developer
              <span className="animate-pulse text-green-300 ml-1 text-3xl md:text-5xl">_</span>
            </span>
          </h1>
          <div className="text-gray-400 font-mono text-base md:text-lg max-w-xl leading-loose space-y-1">
            <p><span className="text-green-400">&gt;</span> Building modern web experiences</p>
            <p><span className="text-green-400">&gt;</span> Next.js · React · Node.js · PostgreSQL</p>
            <p><span className="text-green-400">&gt;</span> Passionate about clean, fast code</p>
          </div>
        </div>

        <div className="w-[240px] h-[240px] md:w-[380px] md:h-[380px] flex-shrink-0">
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-800 hover:border-green-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.15)]">
            <Image
              src="/ramon.jpeg"
              alt="Photo of Ramon"
              fill
              sizes="(max-width: 768px) 240px, 380px"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 self-center md:self-start">
        <div className="flex gap-4 flex-wrap">
          <Link href="/projects">
            <Button variant="primary">View Projects</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => onDownloadRequest(handleDownloadCV)}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download CV'}
          </Button>
        </div>
        {downloadError && (
          <p className="text-red-400 font-mono text-sm">{downloadError}</p>
        )}
      </div>
    </section>
  )
}
