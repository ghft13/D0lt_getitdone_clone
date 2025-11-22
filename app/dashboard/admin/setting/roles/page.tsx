// // app/dashboard/admin/setting/roles/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { RoleSettings, UserRole, Permission } from "@/lib/db-types";

// export default function RoleSettingsPage() {
//   const { user } = useAuth();
//   const [settings, setSettings] = useState<RoleSettings[]>([]);
//   const [newSetting, setNewSetting] = useState<Partial<RoleSettings>>({});

//   useEffect(() => {
//     if (user) {
//       const fetchSettings = async () => {
//         const q = query(collection(db, "settings/roles"));
//         const snap = await getDocs(q);
//         setSettings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RoleSettings)));
//       };
//       fetchSettings();
//     }
//   }, [user]);

//   const handleCreate = async () => {
//     if (newSetting.role && newSetting.permissions) {
//       const id = `role_${Date.now()}`;
//       const setting = { id, ...newSetting, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as RoleSettings;
//       await setDoc(doc(db, "settings/roles", id), setting);
//       setSettings([...settings, setting]);
//       setNewSetting({});
//     }
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "settings/roles", id));
//     setSettings(settings.filter((s) => s.id !== id));
//   };

//   const userRoles: UserRole[] = ["admin", "provider"];
//   const permissions: Permission[] = ["manage_bookings"];

//   const totalRoles = settings.length;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Role Settings</h1>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Project Details</h2>
//         <p>Total Roles: {totalRoles}</p>
//       </div>
//       <div className="mb-4">
//         <select
//           className="border p-2 mb-2"
//           value={newSetting.role || ""}
//           onChange={(e) => setNewSetting({ ...newSetting, role: e.target.value as UserRole })}
//         >
//           <option value="">Select Role</option>
//           {userRoles.map((r) => (
//             <option key={r} value={r}>
//               {r}
//             </option>
//           ))}
//         </select>
//         <input
//           className="border p-2 mb-2"
//           placeholder="Permissions (comma-separated)"
//           value={newSetting.permissions?.join(", ") || ""}
//           onChange={(e) => {
//             const inputPermissions = e.target.value.split(",").map((p) => p.trim());
//             const validPermissions = inputPermissions.filter((p): p is Permission => permissions.includes(p as Permission));
//             setNewSetting({ ...newSetting, permissions: validPermissions });
//           }}
//         />
//         <button className="bg-orange-500 text-white p-2" onClick={handleCreate}>
//           Add Role
//         </button>
//       </div>
//       <ul>
//         {settings.map((s) => (
//           <li key={s.id} className="mb-2 p-2 bg-white">
//             {s.role} - {s.permissions.join(", ")}
//             <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete(s.id)}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }