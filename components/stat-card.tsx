import type { LucideIcon } from "lucide-react"


interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  color?: string
}

export default function StatCard({ title, value, icon: Icon, trend, color = "#FF6B35" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-neutral-600">{title}</div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {trend && (
        <div className={`text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
          {trend.isPositive ? "↑" : "↓"} {trend.value}
        </div>
      )}
    </div>
  )
}
