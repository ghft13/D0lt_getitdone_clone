// "use client"

// // import DashboardLayout from "@/components/dashboard-layout"
// import StatCard from "@/components/stat-card"
// import { ProtectedRoute } from "@/components/protected-route"
// import { Calendar, DollarSign, CheckCircle, Clock, Download, Package } from "lucide-react"
// import Link from "next/link"
// import { useBookings } from "@/contexts/booking-context" // useOrders from same context
// import { useAuth } from "@/contexts/auth-context"
// import { useState, useEffect } from "react"
// import { generatePDFReport, type ReportData } from "@/lib/pdf-export"
// import { format } from "date-fns"
// import { collection, query, where, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
// import { db } from "@/lib/firebase"
// import type { ExtendedAuthUser, BookingData, OrderData } from '@/lib/db-types'
// import { useOrders } from "@/contexts/booking-context" // Ensure exported

// export default function UserDashboard() {
//   const auth = useAuth()
//   const user = auth.user as ExtendedAuthUser | null  // Safe assertion
//   if (!user) return null  // Runtime check for mismatch

//   const { getUserBookings } = useBookings()
//   const { getUserOrders } = useOrders()
//   const [reportPeriod, setReportPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")
//   const [stats, setStats] = useState({ activeBookings: 0, completedBookings: 0, totalSpent: 0, pendingBookings: 0, activeOrders: 0 })

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.id) return

//       const bookingsQuery = query(collection(db, "bookings"), where("homeownerId", "==", user.id))
//       const bookingsSnap = await getDocs(bookingsQuery)
//       const bookings: BookingData[] = bookingsSnap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
//         const docData = doc.data() as Partial<BookingData>;
//         return { id: doc.id, ...docData } as BookingData;
//       })

//       const activeBookings = bookings.filter(b => ["pending", "assigned", "accepted"].includes(b.status))
//       const completedBookings = bookings.filter(b => b.status === "completed")
//       const pendingBookings = bookings.filter(b => b.status === "pending")

//       const totalSpent = completedBookings.reduce((sum: number, b: BookingData) => sum + (b.price || b.total_amount || 0), 0)

//       // Orders
//       const ordersQuery = query(collection(db, "orders"), where("homeownerId", "==", user.id))
//       const ordersSnap = await getDocs(ordersQuery)
//       const orders: OrderData[] = ordersSnap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
//         const docData = doc.data() as Partial<OrderData>;
//         return { id: doc.id, ...docData } as OrderData;
//       })
//       const activeOrders = orders.filter(o => ["pending", "processing", "shipped"].includes(o.status))

//       setStats({
//         activeBookings: activeBookings.length,
//         completedBookings: completedBookings.length,
//         totalSpent,
//         pendingBookings: pendingBookings.length,
//         activeOrders: activeOrders.length
//       })
//     }

//     fetchData()
//   }, [user])

//   const getPeriodData = () => {
//     return {
//       bookings: stats.activeBookings + stats.completedBookings,
//       completed: stats.completedBookings,
//       spent: stats.totalSpent,
//       orders: stats.activeOrders
//     }
//   }

//   const periodData = getPeriodData()

//   const handleExportReport = async () => {
//     const reportData: ReportData = {
//       title: "DOLT User Activity Report",
//       period: reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1),
//       generatedDate: format(new Date(), "MMM dd, yyyy h:mm a"),
//       stats: [
//         { label: "Total Bookings", value: periodData.bookings },
//         { label: "Completed Services", value: periodData.completed },
//         { label: "Total Spent on Services", value: `$${periodData.spent.toFixed(2)}` },
//         { label: "Active Orders", value: periodData.orders },
//         { label: "Pending Bookings", value: stats.pendingBookings },
//       ],
//       additionalInfo: `DOLT report for services and marketplace activity. Generated on ${new Date().toLocaleDateString()}.`
//     }

//     await generatePDFReport(reportData)
//   }

//   return (
//     <ProtectedRoute allowedRoles={["user"]}>
//       <DashboardLayout>
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">My DOLT Dashboard</h1>
//             <p className="text-neutral-600">Track bookings, orders, and home services</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <select
//               value={reportPeriod}
//               onChange={(e) => setReportPeriod(e.target.value as "daily" | "weekly" | "monthly" | "yearly")}  // Typed
//               className="px-4 py-2 border border-neutral-300 rounded-lg focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none"
//             >
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//               <option value="yearly">Yearly</option>
//             </select>
//             <button
//               onClick={handleExportReport}
//               className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff5722] transition-colors flex items-center gap-2"
//             >
//               <Download className="w-4 h-4" />
//               Export PDF
//             </button>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//           <StatCard title="Active Bookings" value={stats.activeBookings.toString()} icon={Calendar} />
//           <StatCard title="Completed Services" value={stats.completedBookings.toString()} icon={CheckCircle} color="#4CAF50" />
//           <StatCard title="Total Spent" value={`$${stats.totalSpent.toFixed(0)}`} icon={DollarSign} color="#2196F3" />
//           <StatCard title="Pending" value={stats.pendingBookings.toString()} icon={Clock} color="#FFC107" />
//           <StatCard title="Active Orders" value={stats.activeOrders.toString()} icon={Package} color="#9C27B0" />
//         </div>

//         {/* Period Stats */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
//           <h2 className="text-xl font-bold mb-4">
//             {reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Overview
//           </h2>
//           <div className="grid md:grid-cols-4 gap-6">
//             <div className="p-4 bg-neutral-50 rounded-xl">
//               <div className="text-sm text-neutral-600 mb-1">Bookings</div>
//               <div className="text-3xl font-bold text-[#FF6B35]">{periodData.bookings}</div>
//             </div>
//             <div className="p-4 bg-neutral-50 rounded-xl">
//               <div className="text-sm text-neutral-600 mb-1">Completed</div>
//               <div className="text-3xl font-bold text-green-600">{periodData.completed}</div>
//             </div>
//             <div className="p-4 bg-neutral-50 rounded-xl">
//               <div className="text-sm text-neutral-600 mb-1">Spent</div>
//               <div className="text-3xl font-bold text-blue-600">${periodData.spent.toFixed(0)}</div>
//             </div>
//             <div className="p-4 bg-neutral-50 rounded-xl">
//               <div className="text-sm text-neutral-600 mb-1">Orders</div>
//               <div className="text-3xl font-bold text-purple-600">{periodData.orders}</div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
//           <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
//           <div className="grid md:grid-cols-4 gap-4">
//             <Link href="/services" className="p-4 border-2 border-[#FF6B35] rounded-xl hover:bg-[#FF6B35]/5 transition-colors text-center">
//               <div className="text-2xl mb-2">🔧</div>
//               <div className="font-medium">Book Service</div>
//             </Link>
//             <Link href="/marketplace" className="p-4 border-2 border-[#FF6B35] rounded-xl hover:bg-[#FF6B35]/5 transition-colors text-center">
//               <div className="text-2xl mb-2">🛒</div>
//               <div className="font-medium">Browse Products</div>
//             </Link>
//             <Link href="/dashboard/user/bookings" className="p-4 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-center">
//               <div className="text-2xl mb-2">📋</div>
//               <div className="font-medium">My Bookings</div>
//             </Link>
//             <Link href="/dashboard/user/orders" className="p-4 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors text-center">
//               <div className="text-2xl mb-2">📦</div>
//               <div className="font-medium">My Orders</div>
//             </Link>
//           </div>
//         </div>

//         {/* Upcoming Bookings & Orders */}
//         <div className="grid lg:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white rounded-2xl p-6 shadow-sm">
//             <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
//             <div className="space-y-4">
//               {/* Mock or fetched upcoming */}
//               <div className="p-4 border border-neutral-200 rounded-xl">
//                 <div className="font-medium">Plumbing Repair</div>
//                 <div className="text-sm text-neutral-600">Oct 10, 10 AM • Provider Assigned</div>
//                 <div className="text-[#FF6B35] font-bold mt-1">$120</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm">
//             <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
//             <div className="space-y-4">
//               <div className="p-4 border border-neutral-200 rounded-xl">
//                 <div className="font-medium">Faucet</div>
//                 <div className="text-sm text-neutral-600">Delivered • Installation Pending</div>
//                 <div className="text-[#FF6B35] font-bold mt-1">$50</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Notifications Bell - Placeholder */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm">
//           <h2 className="text-xl font-bold mb-4">Notifications</h2>
//           <p className="text-neutral-600">Bell icon in layout for in-app notifications</p>
//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   )
// }