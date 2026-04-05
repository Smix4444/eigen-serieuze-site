'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

function CatImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false)
  if (err) return <div className="absolute inset-0 bg-[var(--color-brand-surface-2)]" />
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-700"
      onError={() => setErr(true)}
    />
  )
}

const categories = [
  {
    label: 'TEES',
    sub: 'Graphics & Basics',
    href: '/tshirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  },
  {
    label: 'HOODIES',
    sub: 'Zip-ups & Pullovers',
    href: '/hoodies',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800',
  },
  {
    label: 'PANTS',
    sub: 'Cargos & Joggers',
    href: '/pants',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
  },
  {
    label: 'SHOES',
    sub: 'Runners & Boots',
    href: '/shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  },
]

export default function CategoryGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="px-6 md:px-8 py-20 max-w-7xl mx-auto" ref={ref}>
      {/* Section header */}
      <motion.div
        className="flex items-center justify-between mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--color-brand-accent)] mb-1">
            — Collections
          </p>
          <h2 className="text-2xl font-black uppercase tracking-tight">Shop by Category</h2>
        </div>
        <div className="hidden md:block h-[1px] flex-1 mx-8 bg-[var(--color-brand-border)]" />
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.href}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={cat.href} className="group relative block overflow-hidden aspect-[2/3] bg-[var(--color-brand-surface)]">
              <CatImage src={cat.image} alt={cat.label} />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Red accent top bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-brand-accent)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--color-brand-muted-2)] mb-1 group-hover:text-[var(--color-brand-accent)] transition-colors duration-300">
                  {cat.sub}
                </p>
                <p className="text-white font-black text-xl md:text-2xl uppercase tracking-tight leading-none">
                  {cat.label}
                </p>
                {/* Shop now — slides up on hover */}
                <div className="overflow-hidden h-5 mt-2">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-brand-accent)] translate-y-5 group-hover:translate-y-0 transition-transform duration-300">
                    SHOP NOW →
                  </p>
                </div>
              </div>

              {/* Corner dot */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-[var(--color-brand-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
