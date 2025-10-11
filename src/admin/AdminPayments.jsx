import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "https://backw-5358.onrender.com/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/payments`);
        if (!res.ok) throw new Error("Failed to fetch payments");
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!payments.length) return <p>No payments found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">💰 Payment Records</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.user?.name || "Unknown"}</td>
              <td className="p-2">{p.amount}</td>
              <td className="p-2">
                {new Date(p.date).toLocaleDateString() || "N/A"}
              </td>
              <td className="p-2">{p.status || "pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
