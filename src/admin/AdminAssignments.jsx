


import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "https://backw-5358.onrender.com/api";

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/assignments`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // in case you’re using cookies/session
        });

        if (!res.ok) {
          throw new Error(`Failed to load assignments (${res.status})`);
        }

        const data = await res.json();
        setAssignments(data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError("Could not load assignments.");
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
