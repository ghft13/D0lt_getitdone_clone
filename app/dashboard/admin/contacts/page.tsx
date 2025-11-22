// // app/dashboard/admin/contacts/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { Contact } from "@/lib/db-types";

// export default function AdminContacts() {
//   const { user } = useAuth();
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [newContact, setNewContact] = useState<Partial<Contact>>({});

//   useEffect(() => {
//     if (user) {
//       const fetchContacts = async () => {
//         const q = query(collection(db, "contacts"));
//         const snap = await getDocs(q);
//         setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Contact)));
//       };
//       fetchContacts();
//     }
//   }, [user]);

//   const handleCreate = async () => {
//     if (newContact.name && newContact.email) {
//       const id = `con_${Date.now()}`;
//       const contact = { id, ...newContact, status: "open", created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Contact;
//       await setDoc(doc(db, "contacts", id), contact);
//       setContacts([...contacts, contact]);
//       setNewContact({});
//     }
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "contacts", id));
//     setContacts(contacts.filter((c) => c.id !== id));
//   };

//   const totalContacts = contacts.length;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Contacts</h1>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Project Details</h2>
//         <p>Total Contacts: {totalContacts}</p>
//         <p>Open Contacts: {contacts.filter((c) => c.status === "open").length}</p>
//       </div>
//       <div className="mb-4">
//         <input
//           className="border p-2 mb-2"
//           placeholder="Name"
//           value={newContact.name || ""}
//           onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
//         />
//         <input
//           className="border p-2 mb-2"
//           placeholder="Email"
//           value={newContact.email || ""}
//           onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
//         />
//         <button className="bg-orange-500 text-white p-2" onClick={handleCreate}>
//           Add Contact
//         </button>
//       </div>
//       <ul>
//         {contacts.map((c) => (
//           <li key={c.id} className="mb-2 p-2 bg-white">
//             {c.name} - {c.email} - {c.status}
//             <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete(c.id)}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }