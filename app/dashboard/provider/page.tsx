// provider/page.tsx
"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar, DollarSign, Star, Clock, CheckCircle, XCircle, MapPin, Settings, TrendingUp, Package } from "lucide-react"
import { useBookings } from "@/contexts/booking-context"
import { useAuth } from "@/contexts/auth-context"
import { collection, query, where, getDocs, orderBy, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import Link from "next/link"
import type { BookingData, BookingStatus } from '@/lib/db-types'

export default function ProviderDashboard() {
  const { user } = useAuth()
  const { updateBooking } = useBookings()
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [allBookings, setAllBookings] = useState<BookingData[]>([])
  const [stats, setStats] = useState({ activeBookings: 0, thisMonthEarnings: 0, avgRating: 4.8, avgResponseTime: "12 min" })

  // Helper for address union type
  const getAddressDisplay = (address: string | { street: string; city: string } | undefined) => {
    if (!address) return 'Address not specified';
    if (typeof address === 'string') return address;
    return `${address.street}, ${address.city}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("providerId", "==", user.id),
        orderBy("created_at", "desc")  // snake_case
      )
      const snap = await getDocs(bookingsQuery)
      const data: BookingData[] = snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const docData = doc.data() as Partial<BookingData>;
        return { id: doc.id, ...docData } as BookingData;
      })
      setAllBookings(data)

      // Calculate stats
      const active = data.filter((b: BookingData) => ["pending", "assigned", "accepted", "in_progress"].includes(b.status))
      const completedThisMonth = data.filter((b: BookingData) => {
        const updatedAt = b.updated_at ? new Date(b.updated_at) : new Date();  // snake_case
        const now = new Date();
        return b.status === "completed" && updatedAt.getMonth() === now.getMonth() && updatedAt.getFullYear() === now.getFullYear();
      })
      const earnings = completedThisMonth.reduce((sum: number, b: BookingData) => sum + (b.price || b.total_amount || 0), 0)  // Fallback
      setStats({
        activeBookings: active.length,
        thisMonthEarnings: earnings,
        avgRating: 4.8, // Aggregate from reviews in production
        avgResponseTime: "12 min"
      })
    }

    fetchBookings()
  }, [user])

  const handleAcceptBooking = async (bookingId: string) => {
    await updateBooking(bookingId, { status: "accepted" as BookingStatus })
    // Refetch bookings in production
  }

  const handleStartBooking = async (bookingId: string) => {
    await updateBooking(bookingId, { status: "in_progress" as BookingStatus })
  }

  const handleCompleteBooking = async (bookingId: string) => {
    const otp = prompt("Enter OTP to complete:")
    if (otp) {
      await updateBooking(bookingId, { status: "completion_requested" as BookingStatus, otp })
    }
  }

  const handleRejectBooking = async (bookingId: string) => {
    if (confirm("Reject this booking?")) {
      await updateBooking(bookingId, { status: "cancelled" as BookingStatus })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": case "in_progress": return "bg-green-100 text-green-800"
      case "pending": case "assigned": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-neutral-100 text-neutral-800"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["provider"]}>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
          <p className="text-neutral-600">Manage your DOLT bookings, earnings, and performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Active Bookings" value={stats.activeBookings.toString()} icon={Calendar} />
          <StatCard title="This Month Earnings" value={`$${stats.thisMonthEarnings.toFixed(0)}`} icon={DollarSign} color="#4CAF50" />
          <StatCard title="Average Rating" value={stats.avgRating.toString()} icon={Star} color="#FFC107" />
          <StatCard title="Response Time" value={stats.avgResponseTime} icon={Clock} color="#2196F3" />
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Bookings</h2>
            <Link href="/dashboard/provider/analytics" className="text-[#FF6B35] hover:underline text-sm">
              View Analytics →
            </Link>
          </div>

          {allBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
              <p className="text-neutral-600">New bookings will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allBookings.map((booking: BookingData) => (
                <div key={booking.id} className="p-4 border border-neutral-200 rounded-xl hover:border-[#FF6B35] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-lg">{booking.service?.name || booking.service?.title || 'Service'}</div>  // Fallback
                      <div className="text-sm text-neutral-600">{booking.homeowner?.name || booking.homeownerId}</div>
                      <div className="text-sm text-neutral-600 mt-1">ID: {booking.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-[#FF6B35] mb-2">${booking.price || booking.total_amount || 0}</div>  // Fallback
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {booking.preferredDateTime && (
                    <div className="text-sm text-neutral-600 mb-2">
                      📅 {format(new Date(booking.preferredDateTime), "MMM dd, yyyy 'at' h:mm a")}
                    </div>
                  )}
                  <div className="text-sm text-neutral-600 mb-3">
                    <MapPin className="w-4 h-4 inline mr-1" /> {getAddressDisplay(booking.address)}
                  </div>

                  {booking.notes && (
                    <div className="text-sm mb-3 p-3 bg-neutral-50 rounded-lg">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedBooking === booking.id && (
                    <div className="mb-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <h4 className="font-bold mb-4 text-indigo-900">Booking Details</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xs font-semibold text-indigo-700 mb-2">Homeowner</div>
                          <div className="text-sm font-medium">{booking.homeowner?.name}</div>
                          <div className="text-sm text-neutral-600">{booking.homeowner?.email}</div>
                        </div>
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-xs font-semibold text-indigo-700 mb-2">Transaction</div>
                          <div className="text-sm">ID: {booking.transactionId}</div>
                          <div className="text-sm text-neutral-600">Status: {booking.status}</div>
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

                    {booking.status === "assigned" && (
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

                    {booking.status === "accepted" && (
                      <button
                        onClick={() => handleStartBooking(booking.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Job
                      </button>
                    )}

                    {booking.status === "in_progress" && (
                      <button
                        onClick={() => handleCompleteBooking(booking.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                      >
                        Request OTP Completion
                      </button>
                    )}

                    {booking.status === "completion_requested" && (
                      <button
                        onClick={() => {
                          const otp = prompt("Enter customer OTP:")
                          if (otp && otp === booking.otp) {
                            updateBooking(booking.id, { status: "completed" as BookingStatus })
                          } else {
                            alert("Invalid OTP")
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Verify OTP
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/dashboard/provider/settings" className="p-6 bg-white rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
            <Settings className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-medium">Settings</div>
          </Link>
          <Link href="/dashboard/provider/analytics" className="p-6 bg-white rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
            <TrendingUp className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-medium">Analytics</div>
          </Link>
          <Link href="/services" className="p-6 bg-white rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
            <Package className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-medium">Marketplace</div>
          </Link>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}