
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white p-4 space-y-4">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin/users" className="hover:bg-indigo-600 p-2 rounded">Users</Link>
          <Link to="/admin/payments" className="hover:bg-indigo-600 p-2 rounded">Payments</Link>
          <Link to="/admin/submissions" className="hover:bg-indigo-600 p-2 rounded">Submissions</Link>
          <Link to="/admin/assignments" className="hover:bg-indigo-600 p-2 rounded">Assignments</Link>
          <Link to="/admin/updates" className="hover:bg-indigo-600 p-2 rounded">Updates</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 p-2 rounded w-full"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
