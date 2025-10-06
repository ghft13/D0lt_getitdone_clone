"use client"

import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import { ProtectedRoute } from "@/components/protected-route"
import { Users, Calendar, DollarSign, Package, Settings, FileText } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { collection, query, where, getDocs, orderBy, limit, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { format } from "date-fns"
import type { BookingData, OrderData } from '@/lib/db-types'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalRevenue: 0, totalProviders: 0, totalOrders: 0 })
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([])
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      // Total Homeowners
      const usersQuery = query(collection(db, "homeowners"), where("active", "==", true))
      const usersSnap = await getDocs(usersQuery)
      setStats(prev => ({ ...prev, totalUsers: usersSnap.size }))

      // Total Providers
      const providersQuery = query(collection(db, "providers"), where("active", "==", true))
      const providersSnap = await getDocs(providersQuery)
      setStats(prev => ({ ...prev, totalProviders: providersSnap.size }))

      // Total Bookings (recent month example)
      const now = new Date()
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("created_at", ">=", monthAgo.toISOString()),  // snake_case
        orderBy("created_at", "desc"),
        limit(5)
      )
      const bookingsSnap = await getDocs(bookingsQuery)
      const bookingsData: BookingData[] = bookingsSnap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data() as Partial<BookingData>;
        return { id: doc.id, ...data } as BookingData;
      })
      setRecentBookings(bookingsData)
      setStats(prev => ({ ...prev, totalBookings: bookingsData.length }))

      // Total Orders and Revenue
      const ordersQuery = query(
        collection(db, "orders"),
        where("status", "in", ["succeeded", "completed"]),  // Match PaymentStatus
        orderBy("created_at", "desc"),  // snake_case
        limit(5)
      )
      const ordersSnap = await getDocs(ordersQuery)
      const ordersData: OrderData[] = ordersSnap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data() as Partial<OrderData>;
        return { id: doc.id, ...data } as OrderData;
      })
      setRecentOrders(ordersData)
      const revenue = ordersData.reduce((sum: number, order: OrderData) => sum + (order.total_amount || order.amount || 0), 0)  // Fallback for totalPrice
      setStats(prev => ({ ...prev, totalOrders: ordersData.length, totalRevenue: revenue }))
    }

    if (user) fetchStats()
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": case "succeeded": return "bg-green-100 text-green-800"
      case "accepted": return "bg-blue-100 text-blue-800"
      case "pending": case "processing": return "bg-yellow-100 text-yellow-800"
      case "cancelled": case "failed": return "bg-red-100 text-red-800"
      default: return "bg-neutral-100 text-neutral-800"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">Overview of DOLT platform performance, users, bookings, and orders</p>
        </div>

        {/* KPIs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Homeowners" value={stats.totalUsers.toString()} icon={Users} color="#4CAF50" />
          <StatCard title="Active Providers" value={stats.totalProviders.toString()} icon={Package} color="#2196F3" />
          <StatCard title="Recent Bookings" value={stats.totalBookings.toString()} icon={Calendar} color="#FFC107" />
          <StatCard title="Recent Orders" value={stats.totalOrders.toString()} icon={FileText} color="#9C27B0" />
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(0)}`} icon={DollarSign} color="#FF6B35" />
        </div>

        {/* Management Quick Links */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <Link href="/dashboard/admin/users" className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
            <Users className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-medium">Manage Users</div>
          </Link>
          <Link href="/dashboard/admin/providers" className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
            <Package className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-medium">Manage Providers</div>
          </Link>
          <Link href="/dashboard/admin/services" className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
            <Settings className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-medium">Services</div>
          </Link>
          <Link href="/dashboard/admin/products" className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
            <FileText className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-medium">Products</div>
          </Link>
          <Link href="/dashboard/admin/audits" className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
            <FileText className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-medium">Audit Logs</div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-neutral-500">No recent bookings</p>
              ) : (
                recentBookings.map((booking: BookingData) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                    <div>
                      <div className="font-medium">{booking.service?.name || booking.service?.title || 'Service'}</div>
                      <div className="text-sm text-neutral-600">{booking.homeownerId} • {format(new Date(booking.created_at || ''), 'MMM dd')}</div>  // snake_case
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-[#FF6B35]">${booking.price || booking.total_amount || 0}</div>  // Fallback
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/admin/bookings" className="mt-4 inline-block text-[#FF6B35] hover:underline text-sm">
              View All Bookings →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-neutral-500">No recent orders</p>
              ) : (
                recentOrders.map((order: OrderData) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                    <div>
                      <div className="font-medium">{order.items?.[0]?.product?.name || 'Product'}</div>  // Optional chaining
                      <div className="text-sm text-neutral-600">{order.homeownerId} • {format(new Date(order.created_at || ''), 'MMM dd')}</div>  // snake_case
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-[#FF6B35]">${order.total_amount || order.amount || 0}</div>  // Fallback for totalPrice
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/admin/orders" className="mt-4 inline-block text-[#FF6B35] hover:underline text-sm">
              View All Orders →
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
