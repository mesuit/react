import React, { useState } from "react";

export default function Submit() {
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    setLoading(true);
    try {
      // Fake delay to show feedback
      await new Promise((r) => setTimeout(r, 600));

      alert("✅ Please make sure you provide a real email and correct username. Opening submission form…");

      // Open in a new tab
      window.open("https://submission12.netlify.app/", "_blank");
    } catch (err) {
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mt-10 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-700">📤 Submit Assignment</h2>
      
      <p className="text-gray-700 mb-6">
        Before proceeding, ensure your <strong>username</strong> is correct and 
        you provide a <strong>real email</strong> for feedback. 
        This helps us verify your submission and update your balance.
      </p>

      <button
        onClick={handleProceed}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition disabled:opacity-70"
      >
        {loading ? "Processing…" : "Proceed to Submission Form"}
      </button>
    </div>
  );
}
