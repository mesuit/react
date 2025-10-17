import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// 🔒 Safe localStorage parse
const safeGetUser = () => {
  try {
    const item = localStorage.getItem("user");
    if (!item || item === "undefined" || item === "null") return null;
    return JSON.parse(item);
  } catch {
    return null;
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = safeGetUser();

  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Comrades Hub</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700 font-bold text-lg"
          >
            ✖
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          

          <Link
            to="Home"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            🏠 Home
          </Link>

          <Link
            to="/learn"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            📘 Learn
          </Link>

          <Link
            to="/earn"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            💼 Earn
          </Link>

          <Link
            to="/categories"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            📂 Categories
          </Link>

          <a
            href={`${
              process.env.REACT_APP_HUMANISER_URL ||
              "https://humaniser-11.vercel.app/"
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            🤖 Humaniser
          </a>
              <Link 
  to="/donate"
  className="text-gray-700 hover:text-red-600"
  onClick={() => setIsOpen(false)}
>
  ❤️ Donate
</Link>

          <Link
            to="/submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded text-center hover:bg-indigo-700"
            onClick={() => setIsOpen(false)}
          >
            ✍️ Submit Assignment
          </Link>

          {!token || !user ? (
            <>
              <Link
                to="/login"
                className="text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                🔑 Log in
              </Link>
              <Link
                to="/signup"
                className="text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                📝 Sign up
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700">
                👋 Hi, {user?.name || user?.email}
              </span>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  ⚙️ Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-sm text-red-600 text-left"
              >
                🔓 Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Open sidebar button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded shadow-lg"
      >
        ☰
      </button>
    </div>
  );
}
