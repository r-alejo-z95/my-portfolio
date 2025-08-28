'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, Github, Linkedin, Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import TextArea from '@/components/ui/TextArea'
import Card from '@/components/ui/Card'
import { SOCIAL_LINKS } from '@/lib/constants'

interface ContactForm {
  name: string
  email: string
  message: string
}

export default function ContactSection() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<ContactForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {}
    
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email'
    }
    if (!form.message.trim()) newErrors.message = 'Message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        setIsSubmitted(true)
        setForm({ name: '', email: '', message: '' })
      } else {
        throw new Error('Error sending message')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="text-green-400 text-sm mb-6 font-mono">$ cat contact.txt</div>
      
      <div className="space-y-6 font-mono">
        <p className="text-gray-300 text-lg leading-relaxed">
          Have a project in mind? I&apos;d love to bring your ideas to life.
        </p>
        
        <div className="space-y-4">
          <Link 
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors"
          >
            <Mail size={20} />
            <span>{SOCIAL_LINKS.email}</span>
          </Link>
          <Link 
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors"
          >
            <Github size={20} />
            <span>github.com/r-alejo-z95</span>
          </Link>
          <Link 
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors"
          >
            <Linkedin size={20} />
            <span>linkedin.com/in/ralejo-zambrano</span>
          </Link>
        </div>

        <Card className="mt-8">
          <h3 className="text-white text-lg mb-4">Send Message</h3>
          
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-green-400 text-lg mb-2">✓ Message sent</div>
              <p className="text-gray-400">I will reply soon. Thanks for contacting me!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
              />
              <TextArea
                placeholder="Tell me about your project..."
                rows={4}
                value={form.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                error={errors.message}
              />
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Send size={16} />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}