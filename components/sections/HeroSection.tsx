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
    if (isDownloading) return; // Prevenir múltiples descargas simultáneas
    
    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/download-cv');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Verificar que el blob no esté vacío
      if (blob.size === 0) {
        throw new Error('El archivo descargado está vacío');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Ramon_Zambrano_developer.pdf';
      
      // Hacer la descarga más robusta
      document.body.appendChild(link);
      link.click();
      
      // Cleanup con timeout para asegurar que la descarga se complete
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Error durante la descarga del CV:', error);
      
      // Mensaje de error más específico basado en el tipo de error
      let errorMessage = 'Error al descargar el CV. Por favor, inténtalo de nuevo más tarde.';
      
      if (error instanceof Error) {
        if (error.message.includes('HTTP error')) {
          errorMessage = 'El servidor no está disponible. Inténtalo más tarde.';
        } else if (error.message.includes('vacío')) {
          errorMessage = 'El archivo está vacío o corrupto.';
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
            <span className="text-green-400">&gt;</span> Construyendo experiencias web modernas<br />
            <span className="text-green-400">&gt;</span> Next.js, React, Node.js, PostgreSQL<br />
            <span className="text-green-400">&gt;</span> Apasionado por el código
          </div>
        </div>
        <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] mb-24 md:mb-8">
          <Image
            src="/ramon.png"
            alt="Foto de Ramon"
            width={1024}
            height={1536}
            className="rounded-full object-center object-cover"
            priority // Añadir priority para la imagen principal
          />
        </div>
      </div>
      
      <div className="flex gap-4 mb-12 flex-wrap self-center md:self-start">
        <Link href="/projects">
          <Button variant="primary">Ver Proyectos</Button>
        </Link>
        <Button 
          variant="outline" 
          onClick={() => onDownloadRequest(handleDownloadCV)}
          disabled={isDownloading}
        >
          {isDownloading ? 'Descargando...' : 'Descargar CV'}
        </Button>
      </div>
    </section>
  )
}