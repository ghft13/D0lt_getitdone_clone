// // app/dashboard/admin/setting/payments/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/auth-context";
// import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { PaymentGatewaySettings, PaymentGateway } from "@/lib/db-types";

// export default function PaymentSettingsPage() {
//   const { user } = useAuth();
//   const [settings, setSettings] = useState<PaymentGatewaySettings[]>([]);
//   const [newSetting, setNewSetting] = useState<Partial<PaymentGatewaySettings>>({});

//   useEffect(() => {
//     if (user) {
//       const fetchSettings = async () => {
//         const q = query(collection(db, "settings/payments"));
//         const snap = await getDocs(q);
//         setSettings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentGatewaySettings)));
//       };
//       fetchSettings();
//     }
//   }, [user]);

//   const handleCreate = async () => {
//     if (newSetting.gateway && newSetting.apiKey) {
//       const id = `pay_${Date.now()}`;
//       const setting = { id, ...newSetting, isActive: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as PaymentGatewaySettings;
//       await setDoc(doc(db, "settings/payments", id), setting);
//       setSettings([...settings, setting]);
//       setNewSetting({});
//     }
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "settings/payments", id));
//     setSettings(settings.filter((s) => s.id !== id));
//   };

//   const totalGateways = settings.length;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Payment Settings</h1>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Project Details</h2>
//         <p>Total Payment Gateways: {totalGateways}</p>
//       </div>
//       <div className="mb-4">
//         <select
//           className="border p-2 mb-2"
//           value={newSetting.gateway || ""}
//           onChange={(e) => setNewSetting({ ...newSetting, gateway: e.target.value as PaymentGateway })}
//         >
//           <option value="">Select Gateway</option>
//           {["stripe", "paypal"].map((g) => (
//             <option key={g} value={g}>
//               {g}
//             </option>
//           ))}
//         </select>
//         <input
//           className="border p-2 mb-2"
//           placeholder="API Key"
//           value={newSetting.apiKey || ""}
//           onChange={(e) => setNewSetting({ ...newSetting, apiKey: e.target.value })}
//         />
//         <button className="bg-orange-500 text-white p-2" onClick={handleCreate}>
//           Add Setting
//         </button>
//       </div>
//       <ul>
//         {settings.map((s) => (
//           <li key={s.id} className="mb-2 p-2 bg-white">
//             {s.gateway} - {s.apiKey}
//             <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete(s.id)}>
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }