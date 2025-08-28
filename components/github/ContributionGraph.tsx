'use client'
import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Tippy from '@tippyjs/react'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ContributionData {
  totalContributions: number
  contributions: ContributionDay[]
}

export default function ContributionGraph() {
  const [data, setData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch('/api/github/contributions')
        if (!response.ok) throw new Error('Failed to fetch')
        const contributionData = await response.json()
        setData(contributionData)
      } catch (err) {
        setError('Error loading contributions')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [])

  const getIntensityClass = (level: number) => {
    const classes = [
      'bg-gray-800 border-gray-700',      // 0 contributions
      'bg-green-900 border-green-800',    // 1-3 contributions
      'bg-green-700 border-green-600',    // 4-6 contributions  
      'bg-green-500 border-green-400',    // 7-9 contributions
      'bg-green-400 border-green-300'     // 10+ contributions
    ]
    return classes[level] || 'bg-gray-800 border-gray-700'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en', {
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }

  // Organizar datos en semanas (7 días cada una)
  const organizeIntoWeeks = (contributions: ContributionDay[]) => {
    const weeks = []
    for (let i = 0; i < contributions.length; i += 7) {
      weeks.push(contributions.slice(i, i + 7))
    }
    return weeks
  }

  if (loading) {
    return (
      <Card className="flex flex-col items-center">
        <h3 className="text-white font-mono text-lg mb-4 self-start">Gráfico de Contribuciones</h3>
        <div className="animate-pulse">
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {Array.from({ length: 53 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div key={dayIndex} className="w-3 h-3 bg-gray-700 border border-gray-600" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <h3 className="text-white font-mono text-lg mb-4">Gráfico de Contribuciones</h3>
        <p className="text-red-400 font-mono text-sm">Error: {error}</p>
      </Card>
    )
  }

  const weeks = organizeIntoWeeks(data.contributions)

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-mono text-lg">Gráfico de Contribuciones</h3>
        <span className="text-green-400 font-mono text-sm">
          {data.totalContributions} contribuciones en el último año
        </span>
      </div>
      
      {/* Contenedor principal centrado */}
      <div className="flex justify-center">
        <div className="flex overflow-x-auto">
          {/* Etiquetas de días de la semana (fijas a la izquierda) */}
          <div className="flex flex-col pt-1.5 gap-1 text-xs text-gray-400 font-mono mr-3 mt-4">
            <div className="h-3"></div> {/* Domingo - vacío */}
            <div className="h-3 flex items-center">Lun</div>
            <div className="h-3"></div> {/* Martes - vacío */}
            <div className="h-3 flex items-center">Mié</div>
            <div className="h-3"></div> {/* Jueves - vacío */}
            <div className="h-3 flex items-center">Vie</div>
            <div className="h-3"></div> {/* Sábado - vacío */}
          </div>

          {/* Contenedor del gráfico con scroll */}
          <div className="overflow-x-auto max-w-4xl">
            {/* Etiquetas de meses (fijas arriba) */}
            <div className="flex pl-0.5 gap-1 mb-1 text-xs text-gray-400 font-mono min-w-max">
              {weeks.map((week, weekIndex) => {
                if (week[0]) {
                  const date = new Date(week[0].date)
                  const isFirstOfMonth = date.getDate() <= 7 // Primera semana del mes
                  if (isFirstOfMonth || weekIndex === 0) {
                    const monthName = date.toLocaleDateString('es-ES', { month: 'short', timeZone: 'UTC' })
                    return <div key={weekIndex} className="w-3 text-center">{monthName}</div>
                  }
                }
                return <div key={weekIndex} className="w-3"></div>
              })}
            </div>
            
            {/* Grid de contribuciones */}
            <div className="flex gap-1 min-w-max p-0.5 pb-2">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <Tippy 
                    key={`${day.date}-${weekIndex}-${dayIndex}`}
                    content={day.count === 0 ? `No contributions on ${formatDate(day.date)}` : `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`}
                    delay={[200, 0]}
                    className='bg-black/40 backdrop-blur-xs text-white text-xs px-2 py-1 shadow-lg'
                    >
                      <div
                        className={`w-3 h-3 border ${getIntensityClass(day.level)} hover:ring-1 hover:ring-green-400 cursor-pointer transition-all rounded-sm`}
                      />
                    </Tippy>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Leyenda */}
      <div className="flex justify-center items-center gap-4 mt-4 text-xs font-mono text-gray-400">
        <span>Menos</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div 
              key={level} 
              className={`w-3 h-3 border rounded-sm ${getIntensityClass(level)}`} 
            />
          ))}
        </div>
        <span>Más</span>
      </div>
    </Card>
  )
}