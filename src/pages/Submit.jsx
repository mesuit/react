import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Submit() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("engineering");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🚫 Block access if not logged in
  if (!token) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded shadow text-center">
        <p className="mb-2">⚠️ You must be logged in to submit an assignment.</p>
        <Link
          to="/login"
          className="inline-block mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Login
        </Link>
      </div>
    );
  }

  // ✅ Handle Submit (Frontend only version)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate short delay for "sending"
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("✅ Assignment submitted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      // 🌐 Redirect to your working submission form
      setTimeout(() => {
        window.location.href = "https://submission12.netlify.app/";
      }, 2500);

      // 🏠 Then automatically return home after 5 seconds
      setTimeout(() => {
        navigate("/");
      }, 7500);

    } catch (err) {
      console.error(err);
      toast.error("❌ Submission failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">📤 Submit Assignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded focus:ring focus:ring-indigo-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border p-2 rounded focus:ring focus:ring-indigo-200"
          >
            <option value="engineering">Engineering</option>
            <option value="business">Business</option>
            <option value="arts">Arts</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded focus:ring focus:ring-indigo-200"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">File (optional)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
