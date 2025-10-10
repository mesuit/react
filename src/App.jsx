import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

// 🌍 Public Pages
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import Submit from "./pages/Submit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Learn from "./pages/Learn";
import Earn from "./pages/Earn";

// 🔒 Admin
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminUsers from "./admin/AdminUsers";
import AdminPayments from "./admin/AdminPayments";
import AdminSubmissions from "./admin/AdminSubmissions";
import AdminAssignments from "./admin/AdminAssignments";
import AdminUpdates from "./admin/AdminUpdates";

function LayoutWithNavbar({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminPage && <Navbar />}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <LayoutWithNavbar>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/earn" element={<Earn />} />

        {/* 🔒 Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="users" element={<AdminUsers />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="updates" element={<AdminUpdates />} />
        </Route>
      </Routes>
    </LayoutWithNavbar>
  );
}
