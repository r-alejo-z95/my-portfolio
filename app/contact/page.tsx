import { Metadata } from 'next'
import ContactSection from '@/components/sections/ContactSection'

export const metadata: Metadata = {
  title: 'Contacto - Mi Portfolio',
  description: 'Ponte en contacto conmigo para colaborar en tu próximo proyecto.',
}

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-3xl font-mono font-bold text-white mb-8">
        Contacto
      </h1>
      <ContactSection />
    </div>
  )
}