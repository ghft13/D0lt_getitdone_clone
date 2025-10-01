"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar, DollarSign, CheckCircle, Clock, Download } from "lucide-react"
import Link from "next/link"
import { useBookings } from "@/contexts/booking-context"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { generatePDFReport, type ReportData } from "@/lib/pdf-export"
import { format } from "date-fns"

export default function UserDashboard() {
  const { user } = useAuth()
  const { getUserBookings } = useBookings()
  const [reportPeriod, setReportPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")

  const userBookings = getUserBookings(user?.id || "")
  const activeBookings = userBookings.filter((b) => b.status === "confirmed" || b.status === "pending")
  const completedBookings = userBookings.filter((b) => b.status === "completed")
  const pendingBookings = userBookings.filter((b) => b.status === "pending")
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.total_amount, 0)

  const getPeriodData = () => {
    const now = new Date()
    let startDate: Date

    switch (reportPeriod) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
    }

    const periodBookings = userBookings.filter((b) => new Date(b.created_at) >= startDate)
    const periodCompleted = periodBookings.filter((b) => b.status === "completed")
    const periodSpent = periodCompleted.reduce((sum, b) => sum + b.total_amount, 0)

    return {
      bookings: periodBookings.length,
      completed: periodCompleted.length,
      spent: periodSpent,
    }
  }

  const periodData = getPeriodData()

  const handleExportReport = async () => {
    const reportData: ReportData = {
      title: "User Activity Report",
      period: reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1),
      generatedDate: format(new Date(), "MMM dd, yyyy h:mm a"),
      stats: [
        { label: "Total Bookings", value: periodData.bookings },
        { label: "Completed Services", value: periodData.completed },
        { label: "Total Spent", value: `$${periodData.spent.toFixed(2)}` },
        { label: "Active Bookings", value: activeBookings.length },
        { label: "Pending Bookings", value: pendingBookings.length },
      ],
      chartData: userBookings.slice(0, 5).map((b) => ({
        label: b.service_title || "Service",
        value: b.total_amount,
      })),
      additionalInfo: `This report shows your maintenance service activity for the selected ${reportPeriod} period. All data is current as of the generation date.`,
    }

    await generatePDFReport(reportData)
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <DashboardLayout>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-neutral-600">Track your bookings and service history</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as any)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff5722] transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Active Bookings" value={activeBookings.length.toString()} icon={Calendar} />
          <StatCard
            title="Completed Services"
            value={completedBookings.length.toString()}
            icon={CheckCircle}
            color="#4CAF50"
          />
          <StatCard title="Total Spent" value={`$${totalSpent.toFixed(0)}`} icon={DollarSign} color="#2196F3" />
          <StatCard title="Pending" value={pendingBookings.length.toString()} icon={Clock} color="#FFC107" />
        </div>

        {/* Period Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">
            {reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-neutral-50 rounded-xl">
              <div className="text-sm text-neutral-600 mb-1">Bookings This Period</div>
              <div className="text-3xl font-bold text-[#FF6B35]">{periodData.bookings}</div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <div className="text-sm text-neutral-600 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-600">{periodData.completed}</div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <div className="text-sm text-neutral-600 mb-1">Spent</div>
              <div className="text-3xl font-bold text-blue-600">${periodData.spent.toFixed(0)}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/services"
              className="p-4 border-2 border-[#FF6B35] rounded-xl hover:bg-[#FF6B35]/5 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="font-medium">Book a Service</div>
            </Link>
            <Link
              href="/dashboard/user/bookings"
              className="p-4 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">View Bookings</div>
            </Link>
            <Link
              href="/contact"
              className="p-4 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-center"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium">Contact Support</div>
            </Link>
          </div>
        </div>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Active Bookings</h2>
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <div key={booking.id} className="p-4 border border-neutral-200 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-lg">{booking.service_title}</div>
                      <div className="text-sm text-neutral-600">{booking.provider_name || "Pending assignment"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#FF6B35]">
                        ${booking.total_amount} {booking.currency}
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  {booking.scheduled_date && (
                    <div className="text-sm text-neutral-600 mb-3">
                      📅 {format(new Date(booking.scheduled_date), "MMM dd, yyyy 'at' h:mm a")}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/user/bookings`}
                      className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#ff5722] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service History */}
        {completedBookings.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Service History</h2>
            <div className="space-y-3">
              {completedBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                >
                  <div>
                    <div className="font-medium">{booking.service_title}</div>
                    <div className="text-sm text-neutral-600">
                      {format(new Date(booking.created_at), "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${booking.total_amount} {booking.currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
