import React, { useEffect, useState } from "react";
import api from "../api"; // Axios instance (with token for admin)

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      // <-- use the existing backend admin route
      const res = await api.get("/earn/assignments/all");
      const data = Array.isArray(res.data) ? res.data : [];
      setAssignments(data);
    } catch (err) {
      console.error("❌ Error fetching assignments:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-indigo-700">🛠 Admin — Manage Assignments</h2>
        <div>
          {/* Admin only: link/button to create assignment page or modal */}
          <a href="/admin/create-assignment" className="px-3 py-2 bg-indigo-600 text-white rounded-md">
            + Create
          </a>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading assignments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-500 italic">No assignments found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assignments.map(a => (
            <div key={a._id} className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition">
              <h4 className="font-semibold text-indigo-700">{a.title || "Untitled"}</h4>
              <p className="text-gray-700 text-sm mt-1">{a.description || "No description"}</p>
              <p className="text-gray-600 text-xs mt-2"><strong>Deadline:</strong> {a.deadline || "N/A"}</p>

              <div className="mt-3 flex gap-2">
                <a href={`/admin/assignments/${a._id}`} className="text-sm underline text-indigo-500">View</a>
                <button className="text-sm text-red-600">Delete</button>
                <button className="text-sm text-green-600">Mark Closed</button>
                {/* Wire these admin actions to API endpoints as needed */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
