import React, { useEffect, useState } from "react";
import api from "../api"; // ✅ import your configured axios instance

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users"); // ✅ token auto-added
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error fetching users:", err.response?.data || err.message);
        setError(
          err.response?.data?.message || "Failed to fetch users (unauthorized)"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">👥 All Users</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 capitalize">{u.role || "user"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
