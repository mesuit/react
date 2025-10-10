import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Submit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate sending (since you don’t have backend yet)
      await new Promise((resolve) => setTimeout(resolve, 800));

      alert("✅ Almost there! Redirecting to submission form...");

      // Step 1: Go to your submission site
      window.location.href = "https://submission12.netlify.app/";

      // Step 2: After 5 seconds, go back home
      setTimeout(() => {
        navigate("/");
      }, 30000);
    } catch (err) {
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        📤 Submit Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
        <textarea
          placeholder="Write a message"
          className="w-full p-3 border rounded-lg h-24 resize-none focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition disabled:opacity-70"
        >
          {loading ? "Submitting..." : "Submit Now"}
        </button>
      </form>
    </div>
  );
}
