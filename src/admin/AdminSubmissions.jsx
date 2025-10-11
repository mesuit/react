import React, { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "https://backw-5358.onrender.com/api";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch submissions from your backend
  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`${API_BASE}/assignments/all`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error("❌ Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();

    // ✅ Simulated "real-time" admin notification (poll every 20s)
    const interval = setInterval(() => {
      setNotification("✅ New submission just received!");
      setTimeout(() => setNotification(null), 5000);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">📤 Recent Submissions</h1>

      {/* ✅ Notification Banner */}
      {notification && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded mb-4">
          {notification}
        </div>
      )}

      {/* ✅ Submission List */}
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((sub) => (
            <li key={sub._id} className="p-3 bg-white rounded shadow border border-gray-200">
              <h3 className="font-semibold text-blue-700">{sub.title}</h3>
              <p className="text-gray-600">Department: {sub.department || "N/A"}</p>
              <p className="text-sm text-gray-400">
                Submitted on:{" "}
                {new Date(sub.createdAt || Date.now()).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
