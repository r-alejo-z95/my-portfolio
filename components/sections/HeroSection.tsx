'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex flex-col `}>
      <div className="flex flex-col-reverse items-center md:flex-row md:justify-between md:items-start mb-8">
          <div>
            <div className="text-green-400 text-sm mb-2 font-mono">$ whoami</div>
            <h1 className="text-4xl md:text-6xl font-mono font-bold text-white mb-4 leading-tight">
              Full Stack<br />
              <span className="text-green-400">Developer</span>
            </h1>
            <div className="text-gray-400 font-mono text-lg max-w-2xl leading-relaxed">
              <span className="text-green-400">&gt;</span> Construyendo experiencias web modernas<br />
              <span className="text-green-400">&gt;</span> Next.js, React, Node.js<br />
              <span className="text-green-400">&gt;</span> Apasionado por el código limpio
            </div>
          </div>
          <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] mb-24 md:mb-8">
                <Image
                    src="/ramon.png"
                    alt="Ramon's photo"
                    width={1024}
                    height={1536}
                    className="rounded-full object-center object-cover"
                />
          </div>
      </div>
      
      <div className="flex gap-4 mb-12 flex-wrap self-center md:self-start">
        <Link href="/projects">
          <Button variant="primary">Ver Proyectos</Button>
        </Link>
        <Button variant="outline">Descargar CV</Button>
      </div>
    </section>
  )
}