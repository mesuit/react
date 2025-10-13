import Landing from "./pages/Landing";
import Home from "./pages/Home";
// ...other imports

export default function App() {
  return (
    <LayoutWithNavbar>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Landing />} />       {/* First landing page */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Logged-in user routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/submit" element={<Submit />} />

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
