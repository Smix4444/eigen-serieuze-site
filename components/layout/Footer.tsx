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
    <footer className="border-t border-[var(--color-brand-border)] mt-20 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-xl font-black tracking-[0.2em] uppercase mb-4">VAULT</p>
          <p className="text-[var(--color-brand-muted)] text-sm">Streetwear for those who move different.</p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand-muted)] mb-4">Shop</p>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-sm text-[var(--color-brand-text)] hover:text-white transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand-muted)] mb-4">Legal</p>
          <ul className="space-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-[var(--color-brand-text)] hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand-muted)] mb-4">Follow</p>
          <ul className="space-y-2">
            {['Instagram', 'TikTok', 'Twitter'].map((s) => (
              <li key={s}>
                <span className="text-sm text-[var(--color-brand-text)] hover:text-white cursor-pointer transition-colors">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-[var(--color-brand-border)] text-center text-[var(--color-brand-muted)] text-xs">
        © {new Date().getFullYear()} VAULT. All rights reserved.
      </div>
    </footer>
  )
}
