"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar, Users, DollarSign, Wrench } from "lucide-react"

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">Overview of platform performance and metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value="1,234"
            icon={Calendar}
            trend={{ value: "12% from last month", isPositive: true }}
          />
          <StatCard
            title="Active Users"
            value="856"
            icon={Users}
            trend={{ value: "8% from last month", isPositive: true }}
            color="#4CAF50"
          />
          <StatCard
            title="Revenue"
            value="$45,678"
            icon={DollarSign}
            trend={{ value: "15% from last month", isPositive: true }}
            color="#2196F3"
          />
          <StatCard
            title="Active Providers"
            value="124"
            icon={Wrench}
            trend={{ value: "3% from last month", isPositive: true }}
            color="#9C27B0"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                >
                  <div>
                    <div className="font-medium">HVAC Maintenance</div>
                    <div className="text-sm text-neutral-600">Maria Rodriguez • Buenos Aires</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[#FF6B35]">$150</div>
                    <div className="text-xs text-neutral-500">2 hours ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Top Providers</h2>
            <div className="space-y-4">
              {[
                { name: "Juan Martinez", bookings: 45, rating: 4.9 },
                { name: "Carlos Silva", bookings: 38, rating: 4.8 },
                { name: "Ana Garcia", bookings: 32, rating: 4.7 },
                { name: "Luis Fernandez", bookings: 28, rating: 4.9 },
                { name: "Sofia Lopez", bookings: 25, rating: 4.6 },
              ].map((provider, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                >
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-neutral-600">{provider.bookings} bookings</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{provider.rating}</span>
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
