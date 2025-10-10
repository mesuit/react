import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get("/assignments/all");
        setSubmissions(res.data);
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      }
    };
    fetchSubmissions();
  }, []);

  // Simulated real-time notification (if using backend socket, replace here)
  useEffect(() => {
    const interval = setInterval(() => {
      setNotification("✅ New submission just received!");
      setTimeout(() => setNotification(null), 5000);
    }, 20000); // check every 20s (for demo)
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">📤 Recent Submissions</h1>
      {notification && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {notification}
        </div>
      )}

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul className="space-y-2">
          {submissions.map((sub) => (
            <li key={sub.id} className="p-3 border rounded bg-white">
              <strong>{sub.title}</strong> — {sub.department}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
