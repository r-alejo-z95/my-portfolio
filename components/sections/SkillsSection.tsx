import { Code2, Terminal, Activity } from 'lucide-react'
import Card from '@/components/ui/Card'
import { SKILLS } from '@/lib/constants'

const skillIcons = {
  frontend: Code2,
  backend: Terminal,
  tools: Activity,
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
              <div className="flex items-center gap-3 mb-4">
                <Icon className="text-green-400" size={20} />
                <h3 className="text-white font-mono text-base font-semibold">{skill.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.technologies.map(tech => (
                  <span
                    key={tech}
                    className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 border border-gray-700/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
