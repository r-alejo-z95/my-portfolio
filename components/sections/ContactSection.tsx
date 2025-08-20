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
    
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!form.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!form.message.trim()) newErrors.message = 'El mensaje es requerido'

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
        throw new Error('Error al enviar el mensaje')
      }
    } catch (error) {
      console.error('Error:', error)
      // Aquí podrías mostrar un toast o notificación de error
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
          ¿Tienes un proyecto en mente? Me encantaría colaborar contigo y hacer realidad tus ideas.
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
            <span>github.com/tu-usuario</span>
          </Link>
          <Link 
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors"
          >
            <Linkedin size={20} />
            <span>linkedin.com/in/tu-usuario</span>
          </Link>
        </div>

        <Card className="mt-8">
          <h3 className="text-white text-lg mb-4">Enviar mensaje</h3>
          
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-green-400 text-lg mb-2">✓ Mensaje enviado</div>
              <p className="text-gray-400">Te responderé pronto. ¡Gracias por contactarme!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
              />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
              />
              <TextArea
                placeholder="Cuéntame sobre tu proyecto..."
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
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}