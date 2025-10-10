import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Submit() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate sending message (since no backend)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success notification
      alert("✅ Message sent successfully!");

      // Redirect to your working submission form
      window.location.href = "https://submission12.netlify.app/";

      // After 4 seconds, redirect back home
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (err) {
      alert("❌ Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Submit Your Message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
        />
        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full p-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring focus:ring-indigo-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Submit Now"}
        </button>
      </form>
    </div>
  );
}
