import HeroSection from '@/components/sections/HeroSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <SkillsSection />
    </div>
  )
}