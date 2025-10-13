import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // axios instance

export default function Earn() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [balance, setBalance] = useState(0);
  const [referrals, setReferrals] = useState({ count: 0, points: 0 });
  const [activeTab, setActiveTab] = useState("local");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchUserData();
  }, [token]);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/earn/me");
      setBalance(res.data.balance || 0);
      setReferrals(res.data.referrals || { count: 0, points: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/earn/assignments?type=${activeTab}`);
      setAssignments(res.data || []);
    } catch (err) {
      console.error(err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (acceptedTerms) fetchAssignments();
  }, [activeTab, acceptedTerms]);

  const handleAcceptAssignment = async (assignmentId) => {
    try {
      const res = await api.post(`/earn/assignments/${assignmentId}/accept`);
      alert(res.data.message || "Assignment accepted — check your email for details.");
      fetchUserData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to accept assignment");
    }
  };

  const referralLink = `${window.location.origin}/register?ref=${user?.id || ""}`;

  // Step 1: Terms screen
  if (!acceptedTerms) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow space-y-4">
        <h2 className="text-2xl font-bold text-indigo-700">Terms of Service</h2>
        <p className="text-gray-700 text-sm">
          Welcome to the Learn & Earn Hub. Before accessing assignments, please read and agree to the terms below:
        </p>
        <ul className="list-disc pl-6 text-gray-700 text-sm space-y-2">
          <li>Payments are <strong>manual</strong> for now, but automation is coming soon.</li>
          <li>Assignments (graphic design, web design, bot dev, and cyber services) appear on your account with their prices and instructions.</li>
          <li>Provide a valid <strong>feedback email</strong> when submitting. This email will be used for acceptance and payment updates.</li>
          <li>Follow instructions carefully. Payments are released once client requirements are met and confirmed.</li>
          <li>We are a <strong>registered and certified</strong> platform — always contact us directly for clarity.</li>
          <li>Most communication is done via <strong>email for security</strong> purposes.</li>
          <li>Referral points currently give you <strong>points</strong> — later these will be converted into money.</li>
        </ul>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="agree"
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label htmlFor="agree" className="text-sm text-gray-800">
            I have read and agree to the Terms of Service.
          </label>
        </div>
        <button
          disabled={!acceptedTerms}
          onClick={() => setAcceptedTerms(true)}
          className={`px-6 py-2 rounded text-white ${
            acceptedTerms ? "bg-indigo-600" : "bg-gray-400"
          }`}
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 2: Main Earn Page
  return (
    <div className="space-y-8 p-6">
      <header className="flex items-center justify-between bg-white p-6 rounded shadow">
        <div>
          <h1 className="text-2xl font-bold">Earn — Assignments & Referrals</h1>
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
        <h2 className="font-semibold">Share & Earn</h2>
        <p className="text-sm text-gray-700">
          Share your referral link. When someone registers and becomes active, you earn points.
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
          Points will convert to money in the future.
        </p>
      </section>

      {/* Assignment Tabs */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "local" ? "bg-indigo-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("local")}
          >
            Local Assignments
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "international" ? "bg-indigo-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("international")}
          >
            International Assignments
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.length === 0 && (
              <p className="text-gray-600">No assignments available yet.</p>
            )}
            {assignments.map((a) => (
              <div key={a._id} className="p-4 border rounded">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-600">{a.summary}</p>
                <p className="text-sm mt-2">Pay: <strong>{a.pay} credits</strong></p>
                <div className="mt-3 flex gap-2">
                  {a.documentLink && (
                    <a
                      href={a.documentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline text-blue-600"
                    >
                      Open Document
                    </a>
                  )}
                  <button
                    className="ml-auto bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleAcceptAssignment(a._id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
