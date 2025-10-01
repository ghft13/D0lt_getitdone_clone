"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar, DollarSign, Wrench, TrendingUp } from "lucide-react"

export default function ManagerDashboard() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager"]}>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
          <p className="text-neutral-600">Manage your company and team performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Company Bookings"
            value="156"
            icon={Calendar}
            trend={{ value: "10% from last month", isPositive: true }}
          />
          <StatCard
            title="Revenue"
            value="$12,450"
            icon={DollarSign}
            trend={{ value: "15% from last month", isPositive: true }}
            color="#4CAF50"
          />
          <StatCard title="Active Providers" value="12" icon={Wrench} color="#2196F3" />
          <StatCard
            title="Growth Rate"
            value="23%"
            icon={TrendingUp}
            trend={{ value: "5% from last month", isPositive: true }}
            color="#9C27B0"
          />
        </div>

        {/* Company Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Provider Performance</h2>
            <div className="space-y-4">
              {[
                { name: "Juan Martinez", bookings: 45, revenue: "$4,500", rating: 4.9 },
                { name: "Carlos Silva", bookings: 38, revenue: "$3,800", rating: 4.8 },
                { name: "Ana Garcia", bookings: 32, revenue: "$3,200", rating: 4.7 },
                { name: "Luis Fernandez", bookings: 28, revenue: "$2,800", rating: 4.9 },
              ].map((provider, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                >
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-neutral-600">
                      {provider.bookings} bookings • {provider.revenue}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{provider.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Company Bookings</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                >
                  <div>
                    <div className="font-medium">HVAC Maintenance</div>
                    <div className="text-sm text-neutral-600">Juan Martinez • Buenos Aires</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[#FF6B35]">$150</div>
                    <div className="text-xs text-neutral-500">2 hours ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
