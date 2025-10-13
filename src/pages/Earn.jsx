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

  // Step 1: Terms of Service before access
  if (!acceptedTerms) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6 mt-8">
        <h2 className="text-3xl font-bold text-indigo-700">📋 Terms of Service</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Welcome to the <strong>Learn & Earn Hub</strong>. Before accessing assignments,
          please read and agree to the following terms to ensure transparency and trust
          between all users and administrators.
        </p>

        <ul className="list-disc pl-6 text-gray-700 text-sm space-y-2">
          <li>
            <strong>Payments are currently manual.</strong> This means once your
            submission is approved, an administrator will process your payment manually.
            Automated payments will be introduced soon.
          </li>
          <li>
            Always <strong>provide a valid feedback email</strong> during submission. This
            is how you will receive updates on your work status, approval, and payment
            progress.
          </li>
          <li>
            <strong>Emails are used for verification and security.</strong> We contact
            you directly via email to confirm submissions, verify ownership, and prevent
            fraud. Payment details are only requested via verified channels.
          </li>
          <li>
            Assignments (graphic design, writing, coding, etc.) will appear on your
            dashboard with their <strong>instructions and pay rate</strong>.
          </li>
          <li>
            Follow all submission guidelines carefully. Incorrect or incomplete work may
            lead to rejection or delayed payment.
          </li>
          <li>
            Do not share sensitive client data or assignment files publicly — doing so may
            result in account suspension.
          </li>
          <li>
            <strong>Referral points</strong> currently contribute to your user level and
            will be converted into money as the platform grows.
          </li>
        </ul>

        <p className="text-sm text-gray-600 mt-4">
          By proceeding, you confirm that you have read and understood these terms and
          agree to comply with all platform policies.
        </p>

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

  // Step 2: Main Earn Page
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
              <p className="text-gray-600 italic">No assignments available yet.</p>
            )}
            {assignments.map((a) => (
              <div key={a._id} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-indigo-700">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{a.summary}</p>
                <p className="text-sm mt-2">
                  Pay: <strong>{a.pay} credits</strong>
                </p>
                <div className="mt-3 flex gap-2 items-center">
                  {a.documentLink && (
                    <a
                      href={a.documentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline text-blue-600"
                    >
                      View Document
                    </a>
                  )}
                  <button
                    className="ml-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
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
