import { Card, CardTitle } from '@/components/ui/Card'

interface ChartProps {
  title: string
  height?: number
}

export function Chart({ title, height = 300 }: ChartProps) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <div
        className="flex items-center justify-center rounded-lg bg-dark-800/50 border border-dashed border-dark-700"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-sm text-dark-500">Chart visualization</p>
          <p className="text-xs text-dark-600 mt-1">Data will render here with Recharts</p>
        </div>
      </div>
    </Card>
  )
}
