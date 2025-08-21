import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactData {
  name: string
  email: string
  message: string
}

// Configurar transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message }: ContactData = await request.json()

    // Validación básica
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Enviar email de notificación
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter()

        // Email a ti (notificación)
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
          subject: `Nuevo mensaje de contacto de ${name}`,
          html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Enviado desde tu portfolio</small></p>
          `,
        })

        // Email de confirmación al usuario
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Mensaje recibido - Te responderé pronto',
          html: `
            <h2>¡Gracias por contactarme!</h2>
            <p>Hola ${name},</p>
            <p>He recibido tu mensaje y te responderé lo antes posible.</p>
            <p><strong>Tu mensaje:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <br>
            <p>Saludos,<br>Ramon</p>
          `,
        })

      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // No fallar la request si el email falla
      }
    }

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en /api/contact:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}