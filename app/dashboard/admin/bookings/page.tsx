// // app/dashboard/admin/bookings/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { ProtectedRoute } from "@/components/protected-route";
// import { collection, query, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { Booking } from "@/lib/db-types";

// export default function AdminBookings() {
//   const { user } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);

//   useEffect(() => {
//     if (user) {
//       const fetchBookings = async () => {
//         const q = query(collection(db, "bookings"));
//         const snap = await getDocs(q);
//         setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking)));
//       };
//       fetchBookings();
//     }
//   }, [user]);

//   const totalBookings = bookings.length;
//   const pendingBookings = bookings.filter((b) => b.status === "pending").length;

//   return (
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold">D0LT Project Details</h2>
//           <p>Total Bookings: {totalBookings}</p>
//           <p>Pending Bookings: {pendingBookings}</p>
//         </div>
//         <ul>
//           {bookings.map((b) => (
//             <li key={b.id} className="mb-2 p-2 bg-white">
//               {b.user_id} - {b.service_id} - {b.status}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </ProtectedRoute>
//   );
// }