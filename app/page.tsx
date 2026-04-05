import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedDrop from '@/components/home/FeaturedDrop'
import TrendingCarousel from '@/components/home/TrendingCarousel'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedDrop />
      <TrendingCarousel />
    </>
  )
}
