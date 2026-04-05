'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/cart/store'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount())
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthed(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-bg)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-[0.2em] uppercase text-white">
          VAULT
        </Link>

        {/* Category nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'TEES', href: '/tshirts' },
            { label: 'HOODIES', href: '/hoodies' },
            { label: 'PANTS', href: '/pants' },
            { label: 'SHOES', href: '/shoes' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-bold tracking-widest text-[var(--color-brand-muted)] hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <Link
            href={isAuthed ? '/account' : '/auth'}
            className="text-xs font-bold tracking-widest text-[var(--color-brand-muted)] hover:text-white transition-colors hidden md:block"
          >
            {isAuthed ? 'ACCOUNT' : 'SIGN IN'}
          </Link>
          <Link href="/cart" className="relative flex items-center">
            <span className="text-xs font-bold tracking-widest text-[var(--color-brand-muted)] hover:text-white transition-colors">
              CART
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-[var(--color-brand-accent)] text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
