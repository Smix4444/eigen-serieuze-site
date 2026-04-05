import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-[var(--color-brand-bg)] overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)',
        }}
      />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <span className="badge-red mb-6 inline-block">NEW DROP — WINTER 26</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white leading-none mb-6">
          WEAR<br />DIFFERENT
        </h1>
        <p className="text-[var(--color-brand-muted)] text-sm tracking-widest uppercase mb-10">
          Hoodies. Tees. Pants. Shoes.
        </p>
        <Link href="/hoodies" className="btn-primary inline-block">
          SHOP NOW
        </Link>
      </div>
    </section>
  )
}
