'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/cart/store'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { label: 'TEES', href: '/tshirts' },
  { label: 'HOODIES', href: '/hoodies' },
  { label: 'PANTS', href: '/pants' },
  { label: 'SHOES', href: '/shoes' },
]

export default function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount())
  const [isAuthed, setIsAuthed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthed(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-brand-bg)]/95 backdrop-blur-md border-b border-[var(--color-brand-border)]'
          : 'bg-[var(--color-brand-bg)] border-b border-[var(--color-brand-border)]'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="font-black tracking-[0.25em] uppercase text-white text-base hover:text-[var(--color-brand-accent)] transition-colors duration-200">
            VAULT
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-[10px] font-black tracking-[0.2em] transition-colors duration-200 group ${
                    active ? 'text-white' : 'text-[var(--color-brand-muted)] hover:text-white'
                  }`}
                >
                  {item.label}
                  {/* Animated underline */}
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-[var(--color-brand-accent)] transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5">
            <Link
              href={isAuthed ? '/account' : '/auth'}
              className="hidden md:block text-[10px] font-black tracking-[0.2em] text-[var(--color-brand-muted)] hover:text-white transition-colors duration-200"
            >
              {isAuthed ? 'ACCOUNT' : 'SIGN IN'}
            </Link>

            <Link href="/cart" className="relative flex items-center gap-1 text-[10px] font-black tracking-[0.2em] text-[var(--color-brand-muted)] hover:text-white transition-colors duration-200">
              CART
              <AnimatePresence mode="popLayout">
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="bg-[var(--color-brand-accent)] text-white text-[9px] font-black min-w-[16px] h-4 flex items-center justify-center px-1 rounded-sm"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-[4px] w-6 py-1"
              aria-label="Menu"
            >
              <span className={`h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5.5px]' : ''}`} />
              <span className={`h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-14 inset-x-0 bg-[var(--color-brand-bg)] border-b border-[var(--color-brand-border)] z-40 px-6 py-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-2xl font-black uppercase tracking-widest text-white hover:text-[var(--color-brand-accent)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-[1px] bg-[var(--color-brand-border)] my-2" />
              <Link
                href={isAuthed ? '/account' : '/auth'}
                className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-muted)] hover:text-white transition-colors"
              >
                {isAuthed ? 'My Account' : 'Sign In'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
