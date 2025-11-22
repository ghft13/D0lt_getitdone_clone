// "use client"

// import type React from "react"

// import { useAuth } from "@/contexts/auth-context"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import {
//   LayoutDashboard,
//   Calendar,
//   Users,
//   Settings,
//   LogOut,
//   Wrench,
//   CreditCard,
//   MessageSquare,
//   Building2,
// } from "lucide-react"

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const { user, logout } = useAuth()
//   const pathname = usePathname()

//   if (!user) return null

//   const getNavItems = () => {
//     switch (user.role) {
//       case "admin":
//         return [
//           { href: "/dashboard/admin", icon: LayoutDashboard, label: "Overview" },
//           { href: "/dashboard/admin/bookings", icon: Calendar, label: "All Bookings" },
//           { href: "/dashboard/admin/users", icon: Users, label: "Users" },
//           { href: "/dashboard/admin/providers", icon: Wrench, label: "Providers" },
//           { href: "/dashboard/admin/payments", icon: CreditCard, label: "Payments" },
//           { href: "/dashboard/admin/contacts", icon: MessageSquare, label: "Contacts" },
//           { href: "/dashboard/admin/settings", icon: Settings, label: "Settings" },
//         ]
//       case "provider":
//         return [
//           { href: "/dashboard/provider", icon: LayoutDashboard, label: "Overview" },
//           { href: "/dashboard/provider/bookings", icon: Calendar, label: "My Bookings" },
//           { href: "/dashboard/provider/earnings", icon: CreditCard, label: "Earnings" },
//           { href: "/dashboard/provider/profile", icon: Settings, label: "Profile" },
//         ]
//       case "owner":
//       case "manager":
//         return [
//           { href: "/dashboard/manager", icon: LayoutDashboard, label: "Overview" },
//           { href: "/dashboard/manager/company", icon: Building2, label: "Company" },
//           { href: "/dashboard/manager/providers", icon: Wrench, label: "Providers" },
//           { href: "/dashboard/manager/bookings", icon: Calendar, label: "Bookings" },
//           { href: "/dashboard/manager/settings", icon: Settings, label: "Settings" },
//         ]
//       case "user":
//       default:
//         return [
//           { href: "/dashboard/user", icon: LayoutDashboard, label: "Overview" },
//           { href: "/dashboard/user/bookings", icon: Calendar, label: "My Bookings" },
//           { href: "/dashboard/user/profile", icon: Settings, label: "Profile" },
//         ]
//     }
//   }

//   const navItems = getNavItems()

//   return (
//     <div className="min-h-screen bg-neutral-50 flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-neutral-900 text-white flex flex-col">
//         <div className="p-6 border-b border-neutral-800">
//           <Link href="/" className="text-2xl font-bold">
//             DOLT
//           </Link>
//           <div className="mt-4">
//             <div className="text-sm text-neutral-400">Welcome back,</div>
//             <div className="font-medium">{user.full_name}</div>
//             <div className="text-xs text-neutral-500 mt-1 capitalize">{user.role}</div>
//           </div>
//         </div>

//         <nav className="flex-1 p-4">
//           <ul className="space-y-2">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href
//               return (
//                 <li key={item.href}>
//                   <Link
//                     href={item.href}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                       isActive ? "bg-[#FF6B35] text-white" : "text-neutral-300 hover:bg-neutral-800"
//                     }`}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     <span>{item.label}</span>
//                   </Link>
//                 </li>
//               )
//             })}
//           </ul>
//         </nav>

//         <div className="p-4 border-t border-neutral-800">
//           <button
//             onClick={logout}
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors w-full"
//           >
//             <LogOut className="w-5 h-5" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-auto">
//         <div className="p-8">{children}</div>
//       </main>
//     </div>
//   )
// }
