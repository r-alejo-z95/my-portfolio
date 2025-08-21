import HeroSection from '@/components/sections/HeroSection'
import SkillsSection from '@/components/sections/SkillsSection'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <SkillsSection />
    </div>
  )
}
