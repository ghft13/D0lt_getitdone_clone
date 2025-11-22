// "use client"

// import type React from "react"

// import DashboardLayout from "@/components/dashboard-layout"
// import { ProtectedRoute } from "@/components/protected-route"
// import { useAuth } from "@/contexts/auth-context"
// import { useState, useRef } from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Camera, Upload } from "lucide-react"

// export default function UserProfilePage() {
//   const { user } = useAuth()
//   const [formData, setFormData] = useState({
//     fullName: user?.full_name || "",
//     email: user?.email || "",
//     phone: "",
//     address: "Av. Santa Fe 2500",
//     city: "Buenos Aires",
//     country: "Argentina",
//   })
//   const [profileImage, setProfileImage] = useState(user?.profileImage || "")
//   const [imagePreview, setImagePreview] = useState(user?.profileImage || "")
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       // Create a preview URL
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)

//       // In production, upload to storage service (Vercel Blob, Supabase Storage, etc.)
//       // For now, store as base64 in localStorage
//       const readerForStorage = new FileReader()
//       readerForStorage.onloadend = () => {
//         setProfileImage(readerForStorage.result as string)
//       }
//       readerForStorage.readAsDataURL(file)
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // Update user profile in localStorage (in production, this would be an API call)
//     const session = localStorage.getItem("auth_session")
//     if (session) {
//       const parsedSession = JSON.parse(session)
//       parsedSession.user.full_name = formData.fullName
//       parsedSession.user.profileImage = profileImage
//       localStorage.setItem("auth_session", JSON.stringify(parsedSession))
//     }

//     alert("Profile updated successfully!")
//     // Force page reload to update navbar
//     window.location.reload()
//   }

//   const getUserInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   return (
//     <ProtectedRoute allowedRoles={["user"]}>
//       <DashboardLayout>
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">My Profile</h1>
//           <p className="text-neutral-600">Manage your account information</p>
//         </div>

//         <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-8 flex flex-col items-center">
//               <div className="relative group">
//                 <Avatar className="w-32 h-32">
//                   <AvatarImage src={imagePreview || "/placeholder.svg"} alt={formData.fullName} />
//                   <AvatarFallback className="bg-[#FF6B35] text-white text-3xl">
//                     {getUserInitials(formData.fullName)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="absolute bottom-0 right-0 w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center text-white hover:bg-[#ff5722] transition-colors shadow-lg"
//                 >
//                   <Camera className="w-5 h-5" />
//                 </button>
//               </div>
//               <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="mt-4 px-4 py-2 text-sm text-[#FF6B35] hover:text-[#ff5722] transition-colors flex items-center gap-2"
//               >
//                 <Upload className="w-4 h-4" />
//                 Upload New Photo
//               </button>
//             </div>

//             <div className="mb-6">
//               <label htmlFor="fullName" className="block text-sm font-medium mb-2">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
//               />
//             </div>

//             <div className="mb-6">
//               <label htmlFor="email" className="block text-sm font-medium mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
//               />
//             </div>

//             <div className="mb-6">
//               <label htmlFor="phone" className="block text-sm font-medium mb-2">
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="+54 11 1234-5678"
//                 className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
//               />
//             </div>

//             <div className="mb-6">
//               <label htmlFor="address" className="block text-sm font-medium mb-2">
//                 Address
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
//               />
//             </div>

//             <div className="grid md:grid-cols-2 gap-4 mb-6">
//               <div>
//                 <label htmlFor="city" className="block text-sm font-medium mb-2">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   id="city"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="country" className="block text-sm font-medium mb-2">
//                   Country
//                 </label>
//                 <input
//                   type="text"
//                   id="country"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full px-8 py-4 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105"
//             >
//               Save Changes
//             </button>
//           </form>
//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   )
// }
