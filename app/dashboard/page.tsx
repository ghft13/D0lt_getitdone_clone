// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/contexts/auth-context"
// import { getDashboardRoute } from "@/lib/auth"

// export default function DashboardPage() {
//   const { user, isLoading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!isLoading) {
//       if (!user) {
//         router.push("/login")
//       } else {
//         // Redirect to role-specific dashboard based on DOLT roles: admin, provider, homeowner (user), or manager/owner
//         const dashboardRoute = getDashboardRoute(user.role)
//         router.push(dashboardRoute)
//       }
//     }
//   }, [user, isLoading, router])

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-neutral-50">
//       <div className="text-center">
//         <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//         <p className="text-neutral-600">Redirecting to your DOLT dashboard...</p>
//       </div>
//     </div>
//   )
// }