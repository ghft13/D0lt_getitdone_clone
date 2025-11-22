// // app/dashboard/admin/setting/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { ProtectedRoute } from "@/components/protected-route";
// import { collection, query, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { Booking, User, Provider, Payment, Contact, BookingStatus, UserRole, PaymentStatus, ContactStatus } from "@/lib/db-types";

// // Define a union type for all entities
// type Entity = Booking | User | Provider | Payment | Contact;

// // Generic fetch function with type parameter
// const fetchCollection = async <T extends { id: string }>(collectionName: string, setState: React.Dispatch<React.SetStateAction<T[]>>) => {
//   const q = query(collection(db, collectionName));
//   const snap = await getDocs(q);
//   setState(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
// };

// export default function AdminSettings() {
//   const { user } = useAuth();

//   // State for each entity
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [users, setUsers] = useState<User[]>([]);
//   const [providers, setProviders] = useState<Provider[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [newBooking, setNewBooking] = useState<Partial<Booking>>({});
//   const [newUser, setNewUser] = useState<Partial<User>>({});
//   const [newProvider, setNewProvider] = useState<Partial<Provider>>({});
//   const [newPayment, setNewPayment] = useState<Partial<Payment>>({});
//   const [newContact, setNewContact] = useState<Partial<Contact>>({});

//   useEffect(() => {
//     if (user) {
//       const fetchData = async () => {
//         await Promise.all([
//           fetchCollection<Booking>("bookings", setBookings),
//           fetchCollection<User>("users", setUsers),
//           fetchCollection<Provider>("providers", setProviders),
//           fetchCollection<Payment>("payments", setPayments),
//           fetchCollection<Contact>("contacts", setContacts),
//         ]);
//       };
//       fetchData();
//     }
//   }, [user]);

//   // CRUD Functions with type-specific handling
//   const handleCreate = async <T extends Entity>(
//     collectionName: string,
//     newData: Partial<T>,
//     setNewData: React.Dispatch<React.SetStateAction<Partial<T>>>,
//     setState: React.Dispatch<React.SetStateAction<T[]>>
//   ) => {
//     let isValid = false;
//     let data: T | undefined;

//     if (collectionName === "bookings" && "user_id" in newData) {
//       isValid = true;
//       data = {
//         id: `${collectionName}_${Date.now()}`,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         ...newData,
//         status: (newData as Partial<Booking>).status || ("pending" as BookingStatus),
//         total_amount: (newData as Partial<Booking>).total_amount || 0,
//         currency: (newData as Partial<Booking>).currency || "USD",
//       } as T;
//     } else if (collectionName === "users" && "email" in newData) {
//       isValid = true;
//       data = {
//         id: `${collectionName}_${Date.now()}`,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         ...newData,
//         role: (newData as Partial<User>).role || ("user" as UserRole),
//       } as T;
//     } else if (collectionName === "providers" && "user_id" in newData) {
//       isValid = true;
//       data = {
//         id: `${collectionName}_${Date.now()}`,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         ...newData,
//         specialization: (newData as Partial<Provider>).specialization || [""],
//         service_radius_km: (newData as Partial<Provider>).service_radius_km || 0,
//         rating: (newData as Partial<Provider>).rating || 0,
//         total_reviews: (newData as Partial<Provider>).total_reviews || 0,
//         is_available: (newData as Partial<Provider>).is_available || true,
//       } as T;
//     } else if (collectionName === "payments" && "booking_id" in newData) {
//       isValid = true;
//       data = {
//         id: `${collectionName}_${Date.now()}`,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         ...newData,
//         status: (newData as Partial<Payment>).status || ("pending" as PaymentStatus),
//         amount: (newData as Partial<Payment>).amount || 0,
//         currency: (newData as Partial<Payment>).currency || "USD",
//       } as T;
//     } else if (collectionName === "contacts" && "name" in newData) {
//       isValid = true;
//       data = {
//         id: `${collectionName}_${Date.now()}`,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         ...newData,
//         status: (newData as Partial<Contact>).status || ("open" as ContactStatus),
//       } as T;
//     }

//     if (isValid && data) {
//       await setDoc(doc(db, collectionName, data.id), data);
//       setState((prev) => [...prev, data]);
//       setNewData({});
//     }
//   };

//   const handleUpdate = async <T extends { id: string }>(
//     collectionName: string,
//     id: string,
//     updatedData: Partial<T>,
//     setState: React.Dispatch<React.SetStateAction<T[]>>
//   ) => {
//     const docRef = doc(db, collectionName, id);
//     await updateDoc(docRef, { ...updatedData, updated_at: new Date().toISOString() });
//     setState((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData, updated_at: new Date().toISOString() } : item)));
//   };

//   const handleDelete = async <T extends { id: string }>(collectionName: string, id: string, setState: React.Dispatch<React.SetStateAction<T[]>>) => {
//     await deleteDoc(doc(db, collectionName, id));
//     setState((prev) => prev.filter((item) => item.id !== id));
//   };

//   return (
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>

//         {/* Bookings CRUD */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold">Bookings</h2>
//           <input
//             className="border p-2 mb-2"
//             placeholder="User ID"
//             value={newBooking.user_id || ""}
//             onChange={(e) => setNewBooking({ ...newBooking, user_id: e.target.value })}
//           />
//           <input
//             className="border p-2 mb-2"
//             placeholder="Service ID"
//             value={newBooking.service_id || ""}
//             onChange={(e) => setNewBooking({ ...newBooking, service_id: e.target.value })}
//           />
//           <button className="bg-orange-500 text-white p-2 mr-2" onClick={() => handleCreate<Booking>("bookings", newBooking, setNewBooking, setBookings)}>
//             Add
//           </button>
//           <ul>
//             {bookings.map((b) => (
//               <li key={b.id} className="mb-2 p-2 bg-white">
//                 {b.user_id} - {b.service_id} - {b.status}
//                 <input
//                   className="border p-1 ml-2"
//                   placeholder="New Status"
//                   value={b.status || ""}
//                   onChange={(e) => handleUpdate("bookings", b.id, { status: e.target.value as BookingStatus }, setBookings)}
//                 />
//                 <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete("bookings", b.id, setBookings)}>
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Users CRUD */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold">Users</h2>
//           <input
//             className="border p-2 mb-2"
//             placeholder="Email"
//             value={newUser.email || ""}
//             onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//           />
//           <input
//             className="border p-2 mb-2"
//             placeholder="Full Name"
//             value={newUser.full_name || ""}
//             onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
//           />
//           <button className="bg-orange-500 text-white p-2 mr-2" onClick={() => handleCreate<User>("users", newUser, setNewUser, setUsers)}>
//             Add
//           </button>
//           <ul>
//             {users.map((u) => (
//               <li key={u.id} className="mb-2 p-2 bg-white">
//                 {u.email} - {u.full_name}
//                 <input
//                   className="border p-1 ml-2"
//                   placeholder="New Role"
//                   value={u.role || ""}
//                   onChange={(e) => handleUpdate("users", u.id, { role: e.target.value as UserRole }, setUsers)}
//                 />
//                 <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete("users", u.id, setUsers)}>
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Providers CRUD */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold">Providers</h2>
//           <input
//             className="border p-2 mb-2"
//             placeholder="User ID"
//             value={newProvider.user_id || ""}
//             onChange={(e) => setNewProvider({ ...newProvider, user_id: e.target.value })}
//           />
//           <input
//             className="border p-2 mb-2"
//             placeholder="Specialization"
//             value={newProvider.specialization?.[0] || ""}
//             onChange={(e) => setNewProvider({ ...newProvider, specialization: [e.target.value] })}
//           />
//           <button className="bg-orange-500 text-white p-2 mr-2" onClick={() => handleCreate<Provider>("providers", newProvider, setNewProvider, setProviders)}>
//             Add
//           </button>
//           <ul>
//             {providers.map((p) => (
//               <li key={p.id} className="mb-2 p-2 bg-white">
//                 {p.user_id} - {p.specialization?.[0]}
//                 <input
//                   className="border p-1 ml-2"
//                   placeholder="New Rating"
//                   type="number"
//                   value={p.rating?.toString() || ""}
//                   onChange={(e) => handleUpdate("providers", p.id, { rating: parseFloat(e.target.value) }, setProviders)}
//                 />
//                 <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete("providers", p.id, setProviders)}>
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Payments CRUD */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold">Payments</h2>
//           <input
//             className="border p-2 mb-2"
//             placeholder="Booking ID"
//             value={newPayment.booking_id || ""}
//             onChange={(e) => setNewPayment({ ...newPayment, booking_id: e.target.value })}
//           />
//           <input
//             className="border p-2 mb-2"
//             placeholder="Amount"
//             type="number"
//             value={newPayment.amount?.toString() || ""}
//             onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
//           />
//           <button className="bg-orange-500 text-white p-2 mr-2" onClick={() => handleCreate<Payment>("payments", newPayment, setNewPayment, setPayments)}>
//             Add
//           </button>
//           <ul>
//             {payments.map((p) => (
//               <li key={p.id} className="mb-2 p-2 bg-white">
//                 {p.booking_id} - ${p.amount}
//                 <input
//                   className="border p-1 ml-2"
//                   placeholder="New Status"
//                   value={p.status || ""}
//                   onChange={(e) => handleUpdate("payments", p.id, { status: e.target.value as PaymentStatus }, setPayments)}
//                 />
//                 <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete("payments", p.id, setPayments)}>
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Contacts CRUD */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold">Contacts</h2>
//           <input
//             className="border p-2 mb-2"
//             placeholder="Name"
//             value={newContact.name || ""}
//             onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
//           />
//           <input
//             className="border p-2 mb-2"
//             placeholder="Email"
//             value={newContact.email || ""}
//             onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
//           />
//           <button className="bg-orange-500 text-white p-2 mr-2" onClick={() => handleCreate<Contact>("contacts", newContact, setNewContact, setContacts)}>
//             Add
//           </button>
//           <ul>
//             {contacts.map((c) => (
//               <li key={c.id} className="mb-2 p-2 bg-white">
//                 {c.name} - {c.email}
//                 <input
//                   className="border p-1 ml-2"
//                   placeholder="New Status"
//                   value={c.status || ""}
//                   onChange={(e) => handleUpdate("contacts", c.id, { status: e.target.value as ContactStatus }, setContacts)}
//                 />
//                 <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete("contacts", c.id, setContacts)}>
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }