import React, { useEffect, useState } from "react";
import api from "../api"; // Your Axios instance with baseURL and token

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    deadline: "",
  });
  const [creating, setCreating] = useState(false);

  // 🟣 Fetch assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/earn/assignments/all");
      setAssignments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error fetching assignments:", err);
      setError(err.response?.data?.error || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // 🟢 Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🟢 Submit new assignment
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      setCreating(true);
      await api.post("/earn/assignments", formData);
      alert("✅ Assignment created successfully!");
      setFormData({ title: "", description: "", price: "", deadline: "" });
      fetchAssignments();
    } catch (err) {
      console.error("❌ Error creating assignment:", err);
      alert(err.response?.data?.error || "Failed to create assignment");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold text-indigo-700">
        🛠 Admin — Manage Assignments
      </h2>

      {/* 🟩 Create New Assignment Form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded-xl shadow-md space-y-3 border"
      >
        <h3 className="text-lg font-semibold text-indigo-600">
          ✏️ Create New Assignment
        </h3>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border rounded-md"
          required
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price (Ksh)"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <button
          type="submit"
          disabled={creating}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {creating ? "Creating..." : "Create Assignment"}
        </button>
      </form>

      {/* 🟦 Assignment List */}
      {loading ? (
        <p className="text-gray-600">Loading assignments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-500 italic">No assignments found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition"
            >
              <h4 className="font-semibold text-indigo-700">
                {a.title || "Untitled"}
              </h4>
              <p className="text-gray-700 text-sm mt-1">
                {a.description || "No description"}
              </p>
              <p className="text-gray-600 text-xs mt-2">
                <strong>Deadline:</strong> {a.deadline || "N/A"}
              </p>
              <p className="text-gray-600 text-xs">
                <strong>Price:</strong> {a.price ? `Ksh ${a.price}` : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
