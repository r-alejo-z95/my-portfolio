import { Code2, Terminal, Activity } from 'lucide-react'
import Card from '@/components/ui/Card'
import { SKILLS } from '@/lib/constants'

const skillIcons = {
  frontend: Code2,
  backend: Terminal,
  tools: Activity
}

export default function SkillsSection() {
  return (
    <section className="mt-16">
      <div className="text-green-400 text-sm mb-6 font-mono">$ cat skills.json</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(SKILLS).map(([key, skill]) => {
          const Icon = skillIcons[key as keyof typeof skillIcons]
          
          return (
            <Card key={key}>
              <Icon className="text-green-400 mb-4" size={24} />
              <h3 className="text-white font-mono text-lg mb-2">{skill.title}</h3>
              <p className="text-gray-400 font-mono text-sm">
                {skill.technologies.join(', ')}
              </p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}