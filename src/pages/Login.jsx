import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return; // nothing to parse
    }

    let user;
    try {
      user = JSON.parse(savedUser);
    } catch (err) {
      console.error("Invalid user in localStorage, clearing...", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return;
    }

    if (user?.role === "admin") navigate("/admin");
    else navigate("/earn");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/signin", {
        email: email.trim(),
        password: password.trim(),
      });

      if (!data || !data.token) throw new Error("Invalid login response");

      // ✅ Save token + user safely
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect based on role
      if (data.user?.role === "admin") navigate("/admin");
      else navigate("/earn");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.message.includes("Network Error")
          ? "⚠️ Cannot reach server. Try again later."
          : "❌ Login failed. Please check your credentials.");
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
