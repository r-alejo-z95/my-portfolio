import { Metadata } from 'next'
import ContactSection from '@/components/sections/ContactSection'

export const metadata: Metadata = {
  title: 'Contact - Ramon',
  description: 'Get in touch with me to collaborate on your next project.',
}

export default function ContactPage() {
  return (
    <div>
      <h1 className="text-3xl font-mono font-bold text-white mb-8">
        Contact
      </h1>
      <ContactSection />
    </div>
  )
}