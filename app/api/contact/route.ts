import { NextRequest, NextResponse } from 'next/server'

interface ContactData {
  name: string
  email: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message }: ContactData = await request.json()

    // Validación básica
    if (!name || !email || !message) {
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

    // Aquí podrías:
    // 1. Guardar en base de datos
    // 2. Enviar por email (usando Resend, SendGrid, etc.)
    // 3. Enviar a un webhook

    console.log('Nuevo mensaje de contacto:', { name, email, message })

    // Simulamos el guardado
    await new Promise(resolve => setTimeout(resolve, 1000))

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