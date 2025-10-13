import React, { useEffect, useState } from "react";
import api from "../api"; // ✅ Axios instance with auth token

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Form fields
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "local",
    link: "",
    file: null,
  });

  // ✅ Fetch all assignments (admin view)
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/earn/assignments/all"); // Admin endpoint
      setAssignments(res.data);
    } catch (err) {
      console.error("❌ Error fetching assignments:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle File Upload
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  // ✅ Submit Assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("type", form.type);
      if (form.link) formData.append("link", form.link);
      if (form.file) formData.append("file", form.file);

      const res = await api.post("/earn/assignments/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("✅ Assignment posted successfully!");
      setForm({ title: "", description: "", type: "local", link: "", file: null });
      fetchAssignments();
    } catch (err) {
      console.error("❌ Error posting assignment:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to post assignment");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">📘 Manage Assignments</h2>

      {/* ✅ Assignment Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 border"
      >
        <h3 className="text-xl font-semibold text-gray-800">➕ Post New Assignment</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Assignment Title"
            required
            className="border p-2 rounded w-full"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="local">Local Assignment</option>
            <option value="international">International Assignment</option>
          </select>
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Assignment Description or Instructions"
          required
          rows={3}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Optional external link (e.g., Google Docs)"
          className="border p-2 rounded w-full"
        />

        <div>
          <label className="block text-sm text-gray-600 mb-1">Attach file (optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
        >
          Post Assignment
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </form>

      {/* ✅ Assignment Display */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Posted Assignments</h3>
        {loading ? (
          <p className="text-gray-600">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500 italic">No assignments found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-indigo-700">{a.title}</h4>
                <p className="text-gray-700 text-sm">{a.description}</p>
                <p className="text-sm mt-2">
                  <strong>Type:</strong>{" "}
                  <span
                    className={`${
                      a.type === "local" ? "text-green-600" : "text-blue-600"
                    } font-medium`}
                  >
                    {a.type}
                  </span>
                </p>

                {a.link && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline text-indigo-500 mt-2 inline-block"
                  >
                    Open Link
                  </a>
                )}
                {a.file && (
                  <a
                    href={a.file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline text-blue-500 mt-2 inline-block"
                  >
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
