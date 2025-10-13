import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      if (user?.role === "admin") navigate("/admin");
      else navigate("/"); // normal user goes to homepage
    } catch {
      // corrupted localStorage, clear it
      console.warn("Invalid user in localStorage, clearing...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/signin", {
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login response:", data); // 🔹 debug the server response

      if (!data || !data.token) {
        throw new Error("Invalid login response from server");
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Normalize user object
      const user = data.user || {
        id: data.id,
        name: data.name || data.email,
        email: data.email,
        role: data.role || "user",
      };

      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "admin") navigate("/admin");
      else navigate("/"); // normal users go to homepage
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.message.includes("Network Error")
          ? "⚠️ Cannot reach server. Try again later."
          : err.message || "❌ Login failed. Check credentials.");
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
        <input
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "🔑 Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
