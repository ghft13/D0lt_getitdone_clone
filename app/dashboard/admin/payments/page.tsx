// app/dashboard/admin/payments/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { collection, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Payment } from "@/lib/db-types";

export default function AdminPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({});

  useEffect(() => {
    if (user) {
      const fetchPayments = async () => {
        const q = query(collection(db, "payments"));
        const snap = await getDocs(q);
        setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)));
      };
      fetchPayments();
    }
  }, [user]);

  const handleCreate = async () => {
    if (newPayment.booking_id && newPayment.amount) {
      const id = `pay_${Date.now()}`;
      const payment = { id, ...newPayment, status: "pending", created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Payment;
      await setDoc(doc(db, "payments", id), payment);
      setPayments([...payments, payment]);
      setNewPayment({});
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "payments", id));
    setPayments(payments.filter((p) => p.id !== id));
  };

  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Project Details</h2>
        <p>Total Payments: {totalPayments}</p>
        <p>Total Amount: ${totalAmount.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <input
          className="border p-2 mb-2"
          placeholder="Booking ID"
          value={newPayment.booking_id || ""}
          onChange={(e) => setNewPayment({ ...newPayment, booking_id: e.target.value })}
        />
        <input
          className="border p-2 mb-2"
          placeholder="Amount"
          type="number"
          value={newPayment.amount || ""}
          onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
        />
        <button className="bg-orange-500 text-white p-2" onClick={handleCreate}>
          Add Payment
        </button>
      </div>
      <ul>
        {payments.map((p) => (
          <li key={p.id} className="mb-2 p-2 bg-white">
            {p.booking_id} - ${p.amount} - {p.status}
            <button className="ml-2 bg-red-500 text-white p-1" onClick={() => handleDelete(p.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}