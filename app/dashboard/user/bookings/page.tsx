"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useBookings } from "@/contexts/booking-context"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, MapPin, User, X, Eye } from "lucide-react"
import { format } from "date-fns"

export default function UserBookingsPage() {
  const { user } = useAuth()
  const { getUserBookings, cancelBooking } = useBookings()
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all")
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

  const allBookings = user ? getUserBookings(user.id) : []
  const filteredBookings = filter === "all" ? allBookings : allBookings.filter((b) => b.status === filter)

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(bookingId)
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
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-neutral-100 text-neutral-800"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-neutral-600">View and manage all your service bookings</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all" ? "bg-[#FF6B35] text-white" : "border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              All ({allBookings.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "pending" ? "bg-[#FF6B35] text-white" : "border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Pending ({allBookings.filter((b) => b.status === "pending").length})
            </button>
            <button
              onClick={() => setFilter("confirmed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "confirmed" ? "bg-[#FF6B35] text-white" : "border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Confirmed ({allBookings.filter((b) => b.status === "confirmed").length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed" ? "bg-[#FF6B35] text-white" : "border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Completed ({allBookings.filter((b) => b.status === "completed").length})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "cancelled" ? "bg-[#FF6B35] text-white" : "border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Cancelled ({allBookings.filter((b) => b.status === "cancelled").length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No bookings found</h3>
            <p className="text-neutral-600 mb-6">
              {filter === "all" ? "You haven't made any bookings yet." : `No ${filter} bookings.`}
            </p>
            <a
              href="/services"
              className="inline-block px-6 py-3 bg-[#FF6B35] text-white font-medium rounded-full hover:bg-[#ff5722] transition-colors"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-xl mb-1">{booking.service_title}</div>
                    <div className="text-sm text-neutral-600 mb-2">Booking ID: {booking.id}</div>
                    {booking.provider_name && (
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <User className="w-4 h-4" />
                        Provider: {booking.provider_name}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-[#FF6B35] mb-2">
                      ${booking.total_amount} {booking.currency}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-neutral-600" />
                    <span className="text-neutral-600">Date:</span>
                    <span className="font-medium">
                      {format(new Date(booking.scheduled_date), "MMM dd, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-neutral-600" />
                    <span className="text-neutral-600">Location:</span>
                    <span className="font-medium">{booking.address}</span>
                  </div>
                  {booking.notes && (
                    <div className="text-sm mt-2 p-3 bg-neutral-50 rounded-lg">
                      <span className="text-neutral-600">Notes:</span> {booking.notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                    className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#ff5722] transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {selectedBooking === booking.id ? "Hide Details" : "View Details"}
                  </button>
                  {booking.status === "completed" && (
                    <button className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                      Leave Review
                    </button>
                  )}
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel Booking
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedBooking === booking.id && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <h4 className="font-bold mb-4 text-lg">Booking Details</h4>

                    <div className="space-y-4">
                      {/* Service Information */}
                      {booking.service_description && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-sm font-semibold text-blue-900 mb-1">Service Description</div>
                          <div className="text-sm text-blue-800">{booking.service_description}</div>
                        </div>
                      )}

                      {/* Booking Timeline */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="text-xs text-neutral-600 mb-1">Created</div>
                          <div className="font-medium text-sm">
                            {format(new Date(booking.created_at), "MMM dd, yyyy")}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {format(new Date(booking.created_at), "h:mm a")}
                          </div>
                        </div>

                        {booking.scheduled_date && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-xs text-green-700 mb-1">Scheduled</div>
                            <div className="font-medium text-sm text-green-900">
                              {format(new Date(booking.scheduled_date), "MMM dd, yyyy")}
                            </div>
                            <div className="text-xs text-green-700">
                              {format(new Date(booking.scheduled_date), "h:mm a")}
                            </div>
                          </div>
                        )}

                        {booking.completed_date && (
                          <div className="p-3 bg-blue-50 rounded-lg">
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

                      {/* Payment & Location Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <div className="text-xs text-neutral-600 mb-2">Payment Information</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-600">Amount:</span>
                              <span className="font-semibold">
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
                                <span className="text-neutral-600">Status:</span>
                                <span className="font-medium capitalize">{booking.payment_status}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {booking.latitude && booking.longitude && (
                          <div className="p-3 bg-neutral-50 rounded-lg">
                            <div className="text-xs text-neutral-600 mb-2">Location Details</div>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-neutral-600">Address:</span>
                                <div className="font-medium">{booking.address}</div>
                              </div>
                              <div className="text-xs text-neutral-500">
                                Coordinates: {booking.latitude.toFixed(4)}, {booking.longitude.toFixed(4)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Provider Information */}
                      {booking.provider_name && (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="text-xs text-orange-700 mb-1">Service Provider</div>
                          <div className="font-medium text-orange-900">{booking.provider_name}</div>
                        </div>
                      )}

                      {/* Additional Notes */}
                      {booking.notes && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="text-xs text-yellow-700 mb-1">Special Instructions</div>
                          <div className="text-sm text-yellow-900">{booking.notes}</div>
                        </div>
                      )}

                      {/* Booking ID for reference */}
                      <div className="pt-2 border-t border-neutral-200">
                        <div className="text-xs text-neutral-500">
                          Reference ID: <span className="font-mono">{booking.id}</span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          Last updated: {format(new Date(booking.updated_at), "MMM dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
