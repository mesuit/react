import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance

export default function Earn() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [balance, setBalance] = useState(0);
  const [referrals, setReferrals] = useState({ count: 0, points: 0 });
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔒 Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [token]);

  // ✅ Fetch user balance + referral data
  const fetchUserData = async () => {
    try {
      const res = await api.get("/earn/me");
      setBalance(res.data.balance || 0);
      setReferrals(res.data.referrals || { count: 0, points: 0 });
    } catch (err) {
      console.error("❌ Error fetching user data:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  // ✅ Fetch assignments (all available)
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/earn/assignments/all");
      if (Array.isArray(res.data)) {
        setAssignments(res.data);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.error("❌ Error fetching assignments:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // ⏱ Load assignments after accepting terms
  useEffect(() => {
    if (acceptedTerms) fetchAssignments();
  }, [acceptedTerms]);

  // ✅ Accept assignment by ID
  const handleAcceptAssignment = async (assignmentId) => {
    try {
      const res = await api.post(`/earn/assignments/${assignmentId}/accept`);
      alert(res.data.message || "✅ Assignment accepted — check your email for details.");
      fetchUserData();
    } catch (err) {
      console.error("❌ Accept assignment error:", err);
      alert(err.response?.data?.error || "❌ Failed to accept assignment");
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const referralLink = `${window.location.origin}/register?ref=${user?.id || ""}`;

  // STEP 1 — Accept Terms before viewing
  if (!acceptedTerms) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6 mt-8">
        <h2 className="text-3xl font-bold text-indigo-700">📋 Terms of Service</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Welcome to the <strong>Learn & Earn Hub</strong>. Before accessing assignments,
          please read and agree to the following terms to ensure transparency and trust.
        </p>

        <ul className="list-disc pl-6 text-gray-700 text-sm space-y-2">
          <li><strong>Payments are manual</strong> — once approved, an admin will process it.</li>
          <li><strong>Provide a valid feedback email</strong> for updates & verification.</li>
          <li><strong>Emails are used for confirmation and fraud prevention.</strong></li>
          <li>Assignments include clear <strong>instructions and pay rate</strong>.</li>
          <li>Follow submission rules carefully — incomplete work may be rejected.</li>
          <li>Never share client data publicly — it may result in suspension.</li>
          <li><strong>Referral points</strong> add to your level and future payouts.</li>
        </ul>

        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            id="agree"
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="agree" className="text-sm text-gray-800">
            I have read and agree to the Terms of Service.
          </label>
        </div>

        <button
          disabled={!acceptedTerms}
          onClick={() => setAcceptedTerms(true)}
          className={`px-6 py-2 rounded text-white font-semibold transition ${
            acceptedTerms ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400"
          }`}
        >
          Continue
        </button>
      </div>
    );
  }

  // STEP 2 — Earn Page
  return (
    <div className="space-y-8 p-6">
      <header className="flex items-center justify-between bg-white p-6 rounded shadow">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">💼 Earn — Assignments & Referrals</h1>
          <p className="text-sm text-gray-600">
            Wallet: <strong>{balance} credits</strong>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm">Referrals: {referrals.count}</p>
          <p className="text-sm">Points: {referrals.points}</p>
        </div>
      </header>

      {/* Referral Section */}
      <section className="bg-white p-6 rounded shadow space-y-3">
        <h2 className="font-semibold text-lg text-indigo-700">Share & Earn</h2>
        <p className="text-sm text-gray-700">
          Share your unique referral link. When someone registers and becomes active, you
          earn points that contribute to your balance.
        </p>
        <div className="flex gap-2 mt-2">
          <input className="flex-1 p-2 border rounded" readOnly value={referralLink} />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              alert("Referral link copied!");
            }}
          >
            Copy
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Referral points will be converted into money soon.
        </p>
      </section>

      {/* Assignments Section */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-indigo-700 mb-4">
          🧾 Available Assignments
        </h3>

        {loading ? (
          <p>Loading assignments...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.length === 0 && (
              <p className="text-gray-600 italic">No assignments available yet.</p>
            )}
            {assignments.map((a) => (
              <div
                key={a._id}
                className="p-4 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-indigo-700">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                <p className="text-sm mt-2">
                  <strong>Price:</strong> {a.price ? `Ksh ${a.price}` : "—"}
                </p>
                <p className="text-xs text-gray-500">
                  Deadline: {a.deadline || "N/A"}
                </p>

                {a.fileUrl && (
                  <a
                    href={a.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 underline mt-2 inline-block"
                  >
                    📎 View Attachment
                  </a>
                )}

                <button
                  className="ml-auto mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => handleAcceptAssignment(a._id)}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
