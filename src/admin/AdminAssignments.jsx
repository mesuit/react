import React, { useEffect, useState } from "react";
import api from "../api"; // Axios instance with token

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch all submissions (admin view)
  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/earn/submissions/all"); // make sure backend route exists

      // Fix file URLs for frontend
      const data = res.data.map(s => ({
        ...s,
        file: s.file ? `${process.env.REACT_APP_API_BASE}${s.file}` : null
      }));

      setSubmissions(data);
    } catch (err) {
      console.error("❌ Error fetching submissions:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">📄 Manage Submissions</h2>

      {loading ? (
        <p className="text-gray-600">Loading submissions...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500 italic">No submissions found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {submissions.map(sub => (
            <div key={sub._id} className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition">
              <h4 className="font-semibold text-indigo-700">{sub.assignmentTitle || "Untitled Assignment"}</h4>
              <p className="text-gray-700 text-sm mt-1">
                <strong>Submitted by:</strong> {sub.userName || "Unknown"}
              </p>
              <p className="text-gray-700 text-sm mt-1">
                <strong>Status:</strong> {sub.status || "pending"}
              </p>

              {sub.link && (
                <a href={sub.link} target="_blank" rel="noreferrer" className="text-sm underline text-indigo-500 mt-2 inline-block">
                  External Link
                </a>
              )}
              {sub.file && (
                <a href={sub.file} target="_blank" rel="noreferrer" className="text-sm underline text-blue-500 mt-2 inline-block">
                  View File
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
