import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Verify user
  const verifyUser = async (id) => {
    try {
      await api.post(`/admin/users/${id}/verify`);
      alert("✅ User verified successfully");
      fetchUsers();
    } catch (err) {
      alert("❌ Failed to verify user");
      console.error(err);
    }
  };

  // 🚫 Suspend or unsuspend user
  const toggleSuspend = async (id) => {
    try {
      await api.post(`/admin/users/${id}/suspend`);
      alert("⚙️ User suspension status updated");
      fetchUsers();
    } catch (err) {
      alert("❌ Failed to change suspension status");
      console.error(err);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">👥 Manage Users</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Verified</th>
            <th className="p-2 border">Suspended</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b hover:bg-gray-50">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 capitalize">{u.role || "student"}</td>
              <td className="p-2">
                {u.isVerified ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-600 font-semibold">No</span>
                )}
              </td>
              <td className="p-2">
                {u.isSuspended ? (
                  <span className="text-red-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-green-600 font-semibold">No</span>
                )}
              </td>
              <td className="p-2 flex gap-2">
                {!u.isVerified && (
                  <button
                    onClick={() => verifyUser(u._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => toggleSuspend(u._id)}
                  className={`${
                    u.isSuspended ? "bg-yellow-500" : "bg-red-500"
                  } text-white px-3 py-1 rounded hover:opacity-80`}
                >
                  {u.isSuspended ? "Unsuspend" : "Suspend"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
