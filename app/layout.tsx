import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Full Stack Developer - Ramon A. Zambrano',
  description: 'Full stack developer portfolio specializing in Next.js and modern technologies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="min-h-screen bg-black text-white font-mono antialiased">
        <Header />
        <main className="max-w-6xl mx-auto px-8 py-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}