'use client'
import { useMemo } from 'react'
import Card from '@/components/ui/Card'

interface ContributionGraphProps {
  data?: Array<{ date: string; count: number }>
}

export default function ContributionGraph({ data }: ContributionGraphProps) {
  const contributionData = useMemo(() => {
    if (data) return data
    
    // Mock data para demo
    return Array.from({ length: 371 }, (_, i) => ({
      date: new Date(Date.now() - (370 - i) * 24 * 60 * 60 * 1000).toISOString(),
      count: Math.floor(Math.random() * 10)
    }))
  }, [data])

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-800'
    if (count <= 2) return 'bg-green-900'
    if (count <= 4) return 'bg-green-700'
    if (count <= 6) return 'bg-green-500'
    return 'bg-green-400'
  }

  return (
    <Card>
      <h3 className="text-white font-mono text-lg mb-4">Gráfico de Contribuciones</h3>
      <div className="grid grid-cols-53 gap-1 w-full overflow-x-auto">
        {contributionData.map((day, index) => (
          <div
            key={index}
            className={`w-3 h-3 ${getIntensityClass(day.count)} hover:ring-1 hover:ring-green-400 cursor-pointer`}
            title={`${day.count} contribuciones el ${new Date(day.date).toLocaleDateString()}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs font-mono text-gray-400 mt-2">
        <span>Menos</span>
        <span>Más</span>
      </div>
    </Card>
  )
}