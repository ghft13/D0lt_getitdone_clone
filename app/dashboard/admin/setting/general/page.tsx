// // app/dashboard/admin/setting/general/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { GeneralSettings } from "@/lib/db-types";

// export default function GeneralSettingsPage() {
//   const { user } = useAuth();
//   const [settings, setSettings] = useState<GeneralSettings[]>([]);
//   const [newSetting, setNewSetting] = useState<Partial<GeneralSettings>>({});

//   useEffect(() => {
//     if (user) {
//       const fetchSettings = async () => {
//         const q = query(collection(db, "settings/general"));
//         const snap = await getDocs(q);
//         setSettings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GeneralSettings)));
//       };
//       fetchSettings();
//     }
//   }, [user]);

//   const handleCreate = async () => {
//     if (newSetting.siteName && newSetting.supportEmail) {
//       const id = `gen_${Date.now()}`;
//       const setting = { id, ...newSetting, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as GeneralSettings;
//       await setDoc(doc(db, "settings/general", id), setting);
//       setSettings([...settings, setting]);
//       setNewSetting({});
//     }
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "settings/general", id));
//     setSettings(settings.filter((s) => s.id !== id));
//   };

//   const totalSettings = settings.length;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">General Settings</h1>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Project Details</h2>
//         <p>Total Settings: {totalSettings}</p>
//       </div>
//       <div className="mb-4">
//         <input
//           className="border p-2 mb-2"
//           placeholder="Site Name"
//           value={newSetting.siteName || ""}
//           onChange={(e) => setNewSetting({ ...newSetting, siteName: e.target.value })}
//         />
//         <input
//           className="border p-2 mb-2"
//           placeholder="Support Email"
//           value={newSetting.supportEmail || ""}
//           onChange={(e) => setNewSetting({ ...newSetting, supportEmail: e.target.value })}
//         />
//         <button className="bg-orange-500 text-white p-2" onClick={handleCreate}>
//           Add Setting
//         </button>
//       </div>
//       <ul>
//         {settings.map((s) => (
//           <li key={s.id} className="mb-2 p-2 bg-white">
//             {s.siteName} - {s.supportEmail}
//             <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete(s.id)}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }