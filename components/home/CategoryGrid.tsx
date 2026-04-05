import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { label: 'TEES', href: '/tshirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
  { label: 'HOODIES', href: '/hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600' },
  { label: 'PANTS', href: '/pants', image: 'https://images.unsplash.com/photo-1624378441864-6359c8a08a0a?w=600' },
  { label: 'SHOES', href: '/shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
]

export default function CategoryGrid() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <h2 className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand-muted)] mb-8">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative overflow-hidden aspect-[3/4] bg-[var(--color-brand-surface)]"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <span className="absolute bottom-4 left-4 text-white font-black text-lg tracking-widest uppercase">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
