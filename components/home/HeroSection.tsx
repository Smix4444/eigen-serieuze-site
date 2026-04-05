'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import MarqueeStrip from '@/components/ui/MarqueeStrip'

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  show: (delay = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

export default function HeroSection() {
  return (
    <section className="relative flex flex-col bg-[var(--color-brand-bg)] overflow-hidden noise-bg">
      {/* Vertical red accent line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-brand-accent)] origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />

      {/* Grid line overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main hero content */}
      <div className="flex-1 flex flex-col justify-center min-h-[92svh] px-8 md:px-16 lg:px-24 pt-8 pb-0 relative z-10">

        {/* Top row: badge + stats */}
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <motion.div custom={0.2} variants={fadeUp} initial="hidden" animate="show">
            <span className="badge-red">NEW DROP — SS26</span>
          </motion.div>
          <motion.div
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="hidden md:flex items-center gap-6 text-[10px] font-bold tracking-widest uppercase text-[var(--color-brand-muted)]"
          >
            <span>28 Products</span>
            <span className="w-[1px] h-3 bg-[var(--color-brand-border)]" />
            <span>4 Categories</span>
            <span className="w-[1px] h-3 bg-[var(--color-brand-border)]" />
            <span>Free Ship $150+</span>
          </motion.div>
        </div>

        {/* Giant title */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            className="font-black uppercase leading-[0.85] text-white"
            style={{ fontSize: 'clamp(5rem, 18vw, 18rem)', letterSpacing: '-0.03em' }}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            VAULT
          </motion.h1>
        </div>

        {/* Divider with tagline */}
        <motion.div
          className="flex items-center gap-6 mb-12"
          custom={0.5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="flex-1 h-[1px] bg-[var(--color-brand-border)]" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--color-brand-muted)] whitespace-nowrap">
            Streetwear / Urban / Drop Culture
          </span>
          <div className="flex-1 h-[1px] bg-[var(--color-brand-border)]" />
        </motion.div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20">
          <motion.div custom={0.65} variants={fadeUp} initial="hidden" animate="show">
            <Link href="/hoodies" className="btn-primary">
              SHOP THE DROP
            </Link>
          </motion.div>
          <motion.div custom={0.75} variants={fadeUp} initial="hidden" animate="show">
            <Link href="/tshirts" className="btn-ghost">
              BROWSE ALL
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom marquee strip */}
      <MarqueeStrip />
    </section>
  )
}
