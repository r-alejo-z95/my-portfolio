import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactData {
  name: string
  email: string
  message: string
}

// Configure email transporter
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

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      )
    }

    // Send notification email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter()

        // Email to you (notification)
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
          subject: `New contact message from ${name}`,
          html: `
            <h2>New contact message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Sent from your portfolio</small></p>
          `,
        })

        // Confirmation email to the user
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: 'Message received - I will reply soon',
          html: `
            <h2>Thanks for contacting me!</h2>
            <p>Hi ${name},</p>
            <p>I have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <br>
            <p>Best regards,<br>Ramon</p>
          `,
        })

      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Do not fail the request if the email fails
      }
    }

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in /api/contact:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}