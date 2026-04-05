'use client'
import { useRef } from 'react'
import type { ReactNode } from 'react'

export default function ScrollCarousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseDown = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const startX = e.pageX - el.offsetLeft
    const startScroll = el.scrollLeft

    const onMove = (e: MouseEvent) => {
      const x = e.pageX - el.offsetLeft
      el.scrollLeft = startScroll - (x - startX)
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-8 pb-2 cursor-grab active:cursor-grabbing select-none"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  )
}
