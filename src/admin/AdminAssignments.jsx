import React, { useEffect, useState } from "react";
import api from "../api"; // ✅ Import axios instance

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // ✅ Uses your axios instance, token added automatically
        const res = await api.get("/admin/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.error("❌ Error fetching assignments:", err.response?.data || err.message);
        setError(
          err.response?.data?.message || "Failed to load assignments (unauthorized)"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading)
    return <p className="text-gray-600">Loading assignments, please wait...</p>;

  if (error)
    return <p className="text-red-500 font-medium">⚠️ {error}</p>;

  if (assignments.length === 0)
    return <p className="text-gray-500 italic">No assignments found.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-3">📘 All Assignments</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {assignments.map((a) => (
          <div
            key={a._id}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-blue-700">{a.title}</h3>
            <p className="text-gray-600 mt-1">
              <strong>Subject:</strong> {a.subject || "N/A"}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Due:</strong>{" "}
              {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "N/A"}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Status:</strong>{" "}
              <span
                className={`${
                  a.status === "completed"
                    ? "text-green-600"
                    : "text-orange-500"
                } font-medium`}
              >
                {a.status || "pending"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
