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

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleDownloadCV = async () => {
    if (isDownloading) return; // Prevent multiple simultaneous downloads
    
    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/download-cv');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Check that the blob is not empty
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Ramon_Zambrano_developer.pdf';
      
      // Make the download more robust
      document.body.appendChild(link);
      link.click();
      
      // Cleanup with timeout to ensure download completes
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Error during CV download:', error);
      
      // More specific error message based on error type
      let errorMessage = 'Error downloading CV. Please try again later.';
      
      if (error instanceof Error) {
        if (error.message.includes('HTTP error')) {
          errorMessage = 'Server is unavailable. Please try again later.';
        } else if (error.message.includes('empty')) {
          errorMessage = 'File is empty or corrupted.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col ${className}`}>
      <div className="flex flex-col-reverse items-center md:flex-row md:justify-between md:items-start lg:mr-16 mb-8">
        <div>
          <div className="text-green-400 text-sm mb-2 font-mono">$ whoami</div>
          <h1 className="text-4xl md:text-6xl font-mono font-bold text-white mb-4 leading-tight">
            Full Stack<br />
            <span className="text-green-400">Developer</span>
          </h1>
          <div className="text-gray-400 font-mono text-lg max-w-2xl leading-relaxed">
            <span className="text-green-400">&gt;</span> Building modern web experiences<br />
            <span className="text-green-400">&gt;</span> Next.js, React, Node.js, PostgreSQL<br />
            <span className="text-green-400">&gt;</span> Passionate about code
          </div>
        </div>
        <div className="w-[300px] h-[250px] md:w-[450px] md:h-[450px] mb-24 md:mb-[-100px]">
          <Image
            src="/ramon.jpeg"
            alt="Photo of Ramon"
            width={1024}
            height={1024}
            sizes="100vw"
            className="rounded-full object-center object-cover"
            priority // Add priority for the main image
          />
        </div>
      </div>
      
      <div className="flex gap-4 mb-12 flex-wrap self-center md:self-start">
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
    </section>
  )
}