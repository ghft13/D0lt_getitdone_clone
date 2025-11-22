// // app/dashboard/admin/providers/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { Provider } from "@/lib/db-types";

// export default function AdminProviders() {
//   const { user } = useAuth();
//   const [providers, setProviders] = useState<Provider[]>([]);
//   const [newProvider, setNewProvider] = useState<Partial<Provider>>({});

//   useEffect(() => {
//     if (user) {
//       const fetchProviders = async () => {
//         const q = query(collection(db, "providers"));
//         const snap = await getDocs(q);
//         setProviders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Provider)));
//       };
//       fetchProviders();
//     }
//   }, [user]);

//   const handleCreate = async () => {
//     if (newProvider.user_id && newProvider.specialization) {
//       const id = `prov_${Date.now()}`;
//       const provider = { id, ...newProvider, rating: 0, total_reviews: 0, is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Provider;
//       await setDoc(doc(db, "providers", id), provider);
//       setProviders([...providers, provider]);
//       setNewProvider({});
//     }
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "providers", id));
//     setProviders(providers.filter((p) => p.id !== id));
//   };

//   const totalProviders = providers.length;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Providers</h1>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Project Details</h2>
//         <p>Total Providers: {totalProviders}</p>
//         <p>Available Providers: {providers.filter((p) => p.is_available).length}</p>
//       </div>
//       <div className="mb-4">
//         <input
//           className="border p-2 mb-2"
//           placeholder="User ID"
//           value={newProvider.user_id || ""}
//           onChange={(e) => setNewProvider({ ...newProvider, user_id: e.target.value })}
//         />
//         <input
//           className="border p-2 mb-2"
//           placeholder="Specialization"
//           value={newProvider.specialization?.[0] || ""}
//           onChange={(e) => setNewProvider({ ...newProvider, specialization: [e.target.value] })}
//         />
//         <button className="bg-orange-500 text-white p-2" onClick={handleCreate}>
//           Add Provider
//         </button>
//       </div>
//       <ul>
//         {providers.map((p) => (
//           <li key={p.id} className="mb-2 p-2 bg-white">
//             {p.user_id} - {p.specialization?.[0]} - {p.is_available ? "Available" : "Unavailable"}
//             <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete(p.id)}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }