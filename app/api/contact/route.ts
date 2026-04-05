import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { contactSchema } from '@/lib/schemas/contact'

export const POST = withSecurity(
  async (_req: NextRequest, { body }) => {
    const { name, email, message } = body as { name: string; email: string; message: string }
    // In production, send via Resend/SendGrid. For now, log server-side.
    console.log('[Contact Form]', { name, email, message: message.slice(0, 50) })
    return NextResponse.json({ ok: true })
  },
  { rateLimit: 'contact', schema: contactSchema }
)
