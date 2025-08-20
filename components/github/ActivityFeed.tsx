import Card from '@/components/ui/Card'

const mockActivity = [
  { type: 'push', message: 'Pushed to main branch', repo: 'portfolio-nextjs' },
  { type: 'create', message: 'Created new repository', repo: 'react-components' },
  { type: 'update', message: 'Updated README.md', repo: 'github-api-client' }
]

export default function ActivityFeed() {
  return (
    <Card>
      <h3 className="text-white font-mono text-lg mb-4">Actividad Reciente</h3>
      <div className="space-y-2 font-mono text-sm">
        {mockActivity.map((activity, index) => (
          <div key={index} className="text-gray-400">
            <span className={`${
              activity.type === 'push' ? 'text-green-400' : 
              activity.type === 'create' ? 'text-blue-400' : 'text-yellow-400'
            }`}>
              {activity.type === 'push' ? '+' : activity.type === 'create' ? '*' : '!'}
            </span> {activity.message}
          </div>
        ))}
      </div>
    </Card>
  )
}