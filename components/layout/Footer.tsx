import Link from 'next/link'

const categories = [
  { label: 'Tees', href: '/tshirts' },
  { label: 'Hoodies', href: '/hoodies' },
  { label: 'Pants', href: '/pants' },
  { label: 'Shoes', href: '/shoes' },
]

const legal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--color-brand-surface)] border-t border-[var(--color-brand-border)]">
      {/* Top accent line */}
      <div className="h-[2px] bg-[var(--color-brand-accent)] w-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-3xl font-black tracking-[0.2em] uppercase text-white mb-4">VAULT</p>
            <p className="text-[var(--color-brand-muted)] text-sm leading-relaxed mb-6">
              Streetwear for those<br />who move different.
            </p>
            <div className="flex gap-3">
              {['IG', 'TT', 'X'].map((s) => (
                <span
                  key={s}
                  className="w-8 h-8 border border-[var(--color-brand-border)] flex items-center justify-center text-[9px] font-black tracking-widest text-[var(--color-brand-muted)] hover:border-[var(--color-brand-accent)] hover:text-white transition-colors cursor-pointer"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[var(--color-brand-accent)] mb-5">
              Shop
            </p>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm font-medium text-[var(--color-brand-muted)] hover:text-white transition-colors tracking-wide"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[var(--color-brand-accent)] mb-5">
              Legal
            </p>
            <ul className="space-y-3">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-medium text-[var(--color-brand-muted)] hover:text-white transition-colors tracking-wide"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[var(--color-brand-accent)] mb-5">
              Info
            </p>
            <ul className="space-y-3 text-sm font-medium text-[var(--color-brand-muted)]">
              <li>Free shipping $150+</li>
              <li>Mock checkout only</li>
              <li>SS26 Collection</li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-[var(--color-brand-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold tracking-widest text-[var(--color-brand-muted)] uppercase">
            © {new Date().getFullYear()} VAULT. All rights reserved.
          </p>
          <p className="text-[10px] font-bold tracking-widest text-[var(--color-brand-muted)] uppercase">
            Streetwear / Urban / Drop Culture
          </p>
        </div>
      </div>
    </footer>
  )
}
