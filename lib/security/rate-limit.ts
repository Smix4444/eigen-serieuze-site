import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimiters = {
  cart: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    prefix: 'rl:cart',
  }),
  checkout: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'rl:checkout',
  }),
  contact: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    prefix: 'rl:contact',
  }),
  products: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'rl:products',
  }),
}

export type RateLimitKey = keyof typeof rateLimiters
