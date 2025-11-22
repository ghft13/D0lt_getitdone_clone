// // app/dashboard/admin/users/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { User } from "@/lib/db-types";

// export default function AdminUsers() {
//   const { user } = useAuth();
//   const [users, setUsers] = useState<User[]>([]);
//   const [newUser, setNewUser] = useState<Partial<User>>({});

//   useEffect(() => {
//     if (user) {
//       const fetchUsers = async () => {
//         const q = query(collection(db, "users"));
//         const snap = await getDocs(q);
//         setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as User)));
//       };
//       fetchUsers();
//     }
//   }, [user]);

//   const handleCreate = async () => {
//     if (newUser.email && newUser.full_name) {
//       const id = `user_${Date.now()}`;
//       const userData = { id, ...newUser, role: "user", is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as User;
//       await setDoc(doc(db, "users", id), userData);
//       setUsers([...users, userData]);
//       setNewUser({});
//     }
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "users", id));
//     setUsers(users.filter((u) => u.id !== id));
//   };

//   const totalUsers = users.length;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Users</h1>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Project Details</h2>
//         <p>Total Users: {totalUsers}</p>
//         <p>Active Users: {users.filter((u) => u.is_active).length}</p>
//       </div>
//       <div className="mb-4">
//         <input
//           className="border p-2 mb-2"
//           placeholder="Email"
//           value={newUser.email || ""}
//           onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//         />
//         <input
//           className="border p-2 mb-2"
//           placeholder="Full Name"
//           value={newUser.full_name || ""}
//           onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
//         />
//         <button className="bg-orange-500 text-white p-2" onClick={handleCreate}>
//           Add User
//         </button>
//       </div>
//       <ul>
//         {users.map((u) => (
//           <li key={u.id} className="mb-2 p-2 bg-white">
//             {u.email} - {u.full_name} - {u.is_active ? "Active" : "Inactive"}
//             <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete(u.id)}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }