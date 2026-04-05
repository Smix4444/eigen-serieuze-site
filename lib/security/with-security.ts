import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rateLimiters, type RateLimitKey } from './rate-limit'
import type { ZodSchema } from 'zod'

interface SecurityOptions {
  rateLimit: RateLimitKey
  requireAuth?: boolean
  schema?: ZodSchema
}

type Handler = (
  req: NextRequest,
  context: { userId?: string; body?: unknown }
) => Promise<NextResponse>

export function withSecurity(handler: Handler, options: SecurityOptions) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // 1. Rate limit
    const rawIp =
      req.headers.get('x-forwarded-for') ??
      req.headers.get('x-real-ip') ??
      'anonymous'
    const ip = rawIp.split(',')[0].trim()
    const { success } = await rateLimiters[options.rateLimit].limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // 2. Auth check
    let userId: string | undefined
    if (options.requireAuth) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: (name) => req.cookies.get(name)?.value,
            set: () => {},
            remove: () => {},
          },
        }
      )
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userId = user.id
    }

    // 3. Body validation
    let body: unknown
    if (options.schema) {
      try {
        const raw = await req.json()
        body = options.schema.parse(raw)
      } catch (err) {
        console.error('[withSecurity] body validation error:', err)
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        )
      }
    }

    // 4. Call handler
    return handler(req, { userId, body })
  }
}
