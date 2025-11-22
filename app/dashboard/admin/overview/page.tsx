// // app/dashboard/admin/overview/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { ProtectedRoute } from "@/components/protected-route";
// import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// interface Announcement {
//   id: string;
//   message: string;
//   created_at: string;
// }

// export default function AdminOverview() {
//   const { user } = useAuth();
//   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     if (user) {
//       const fetchAnnouncements = async () => {
//         const q = query(collection(db, "announcements"));
//         const snap = await getDocs(q);
//         setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement)));
//       };
//       fetchAnnouncements();
//     }
//   }, [user]);

//   const handleCreate = async () => {
//     if (newMessage) {
//       const id = `ann_${Date.now()}`;
//       const announcement = { id, message: newMessage, created_at: new Date().toISOString() };
//       await setDoc(doc(db, "announcements", id), announcement);
//       setAnnouncements([...announcements, announcement]);
//       setNewMessage("");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "announcements", id));
//     setAnnouncements(announcements.filter((a) => a.id !== id));
//   };

//   const totalUsers = 50; // Replace with actual Firestore query if needed
//   const totalBookings = 120;
//   const totalProviders = 15;

//   return (
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Admin Overview</h1>
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold">Project Statistics</h2>
//           <p>Total Users: {totalUsers}</p>
//           <p>Total Bookings: {totalBookings}</p>
//           <p>Total Providers: {totalProviders}</p>
//         </div>
//         <div className="mb-4">
//           <input
//             className="border p-2 mb-2"
//             placeholder="Announcement Message"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <button className="bg-orange-500 text-white p-2" onClick={handleCreate}>
//             Add Announcement
//           </button>
//         </div>
//         <ul>
//           {announcements.map((a) => (
//             <li key={a.id} className="mb-2 p-2 bg-white">
//               {a.message} - {new Date(a.created_at).toLocaleDateString()}
//               <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete(a.id)}>
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </ProtectedRoute>
//   );
// }