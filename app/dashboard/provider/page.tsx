"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar, DollarSign, Star, Clock, CheckCircle, XCircle } from "lucide-react"
import { useBookings } from "@/contexts/booking-context"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"
import { useState } from "react"

export default function ProviderDashboard() {
  const { user } = useAuth()
  const { getProviderBookings, updateBooking } = useBookings()
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

  // In production, this would filter by actual provider_id
  const allBookings = getProviderBookings(user?.id || "")
  const activeBookings = allBookings.filter((b) => b.status === "confirmed" || b.status === "pending")
  const completedBookings = allBookings.filter((b) => b.status === "completed")

  const thisMonthEarnings = completedBookings
    .filter((b) => {
      const bookingDate = new Date(b.created_at)
      const now = new Date()
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, b) => sum + b.total_amount, 0)

  const avgRating = 4.8 // This would come from reviews in production
  const avgResponseTime = "12 min" // This would be calculated from actual response data

  const handleAcceptBooking = (bookingId: string) => {
    updateBooking(bookingId, {
      status: "confirmed",
      provider_id: user?.id,
    })
  }

  const handleCompleteBooking = (bookingId: string) => {
    updateBooking(bookingId, {
      status: "completed",
      completed_date: new Date().toISOString(),
    })
  }

  const handleRejectBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to reject this booking?")) {
      updateBooking(bookingId, { status: "cancelled" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-neutral-100 text-neutral-800"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["provider"]}>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
          <p className="text-neutral-600">Manage your bookings and track your performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Bookings"
            value={activeBookings.length.toString()}
            icon={Calendar}
            trend={{ value: `${allBookings.length} total`, isPositive: true }}
          />
          <StatCard
            title="This Month Earnings"
            value={`$${thisMonthEarnings.toFixed(0)}`}
            icon={DollarSign}
            trend={{ value: `${completedBookings.length} completed`, isPositive: true }}
            color="#4CAF50"
          />
          <StatCard title="Average Rating" value={avgRating.toString()} icon={Star} color="#FFC107" />
          <StatCard title="Response Time" value={avgResponseTime} icon={Clock} color="#2196F3" />
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Bookings</h2>

          {allBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
              <p className="text-neutral-600">New bookings will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 border border-neutral-200 rounded-xl hover:border-[#FF6B35] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-lg">{booking.service_title}</div>
                      <div className="text-sm text-neutral-600">{booking.user_name || booking.user_email}</div>
                      <div className="text-sm text-neutral-600 mt-1">Booking ID: {booking.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-[#FF6B35] mb-2">
                        ${booking.total_amount} {booking.currency}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {booking.scheduled_date && (
                    <div className="text-sm text-neutral-600 mb-2">
                      📅 {format(new Date(booking.scheduled_date), "MMM dd, yyyy 'at' h:mm a")}
                    </div>
                  )}
                  <div className="text-sm text-neutral-600 mb-3">📍 {booking.address}</div>

                  {booking.notes && (
                    <div className="text-sm mb-3 p-3 bg-neutral-50 rounded-lg">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedBooking === booking.id && (
                    <div className="mb-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <h4 className="font-bold mb-4 text-indigo-900">Complete Booking Information</h4>

                      <div className="space-y-4">
                        {/* Customer Information */}
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xs font-semibold text-indigo-700 mb-2">Customer Details</div>
                          <div className="space-y-1">
                            {booking.user_name && (
                              <div className="text-sm">
                                <span className="text-neutral-600">Name:</span>
                                <span className="font-medium ml-2">{booking.user_name}</span>
                              </div>
                            )}
                            {booking.user_email && (
                              <div className="text-sm">
                                <span className="text-neutral-600">Email:</span>
                                <span className="font-medium ml-2">{booking.user_email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Service Details */}
                        {booking.service_description && (
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-xs font-semibold text-indigo-700 mb-2">Service Description</div>
                            <div className="text-sm text-neutral-700">{booking.service_description}</div>
                          </div>
                        )}

                        {/* Timeline */}
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-xs text-neutral-600 mb-1">Booking Created</div>
                            <div className="font-medium text-sm">
                              {format(new Date(booking.created_at), "MMM dd, yyyy")}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {format(new Date(booking.created_at), "h:mm a")}
                            </div>
                          </div>

                          {booking.scheduled_date && (
                            <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                              <div className="text-xs text-green-700 mb-1">Service Date</div>
                              <div className="font-medium text-sm text-green-900">
                                {format(new Date(booking.scheduled_date), "MMM dd, yyyy")}
                              </div>
                              <div className="text-xs text-green-700">
                                {format(new Date(booking.scheduled_date), "h:mm a")}
                              </div>
                            </div>
                          )}

                          {booking.completed_date && (
                            <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                              <div className="text-xs text-blue-700 mb-1">Completed</div>
                              <div className="font-medium text-sm text-blue-900">
                                {format(new Date(booking.completed_date), "MMM dd, yyyy")}
                              </div>
                              <div className="text-xs text-blue-700">
                                {format(new Date(booking.completed_date), "h:mm a")}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Payment & Location */}
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-xs font-semibold text-indigo-700 mb-2">Payment Details</div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Total Amount:</span>
                                <span className="font-bold text-[#FF6B35]">
                                  ${booking.total_amount} {booking.currency}
                                </span>
                              </div>
                              {booking.payment_method && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-neutral-600">Method:</span>
                                  <span className="font-medium capitalize">{booking.payment_method}</span>
                                </div>
                              )}
                              {booking.payment_status && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-neutral-600">Payment Status:</span>
                                  <span className="font-medium capitalize">{booking.payment_status}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <div className="text-xs font-semibold text-indigo-700 mb-2">Service Location</div>
                            <div className="text-sm text-neutral-700 mb-1">{booking.address}</div>
                            {booking.latitude && booking.longitude && (
                              <div className="text-xs text-neutral-500">
                                GPS: {booking.latitude.toFixed(4)}, {booking.longitude.toFixed(4)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Special Instructions */}
                        {booking.notes && (
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="text-xs font-semibold text-amber-800 mb-1">⚠️ Special Instructions</div>
                            <div className="text-sm text-amber-900">{booking.notes}</div>
                          </div>
                        )}

                        {/* Reference Information */}
                        <div className="pt-3 border-t border-indigo-200">
                          <div className="text-xs text-neutral-500">
                            Booking Reference: <span className="font-mono font-medium">{booking.id}</span>
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            Last updated: {format(new Date(booking.updated_at), "MMM dd, yyyy 'at' h:mm a")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                      className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#ff5722] transition-colors"
                    >
                      {selectedBooking === booking.id ? "Hide Details" : "View Details"}
                    </button>

                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAcceptBooking(booking.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectBooking(booking.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleCompleteBooking(booking.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {booking.user_email && (
                      <button className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                        Contact Customer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
