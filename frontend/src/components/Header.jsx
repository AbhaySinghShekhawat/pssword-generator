import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MainContext } from "../context/MainContext";
import { FiLogOut, FiUser, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Header() {
  const { user, setUser, token, setToken, API } = useContext(MainContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      alert("Logout successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <header className="bg-gray-900 text-gray-100 p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-xl text-blue-400">Password Vault</h1>
        {user && (
          <span className="text-sm text-gray-400 ml-2">
            | Logged in as: <strong className="text-blue-300">{user.email}</strong>
          </span>
        )}
      </div>

      {user ? (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition duration-200"
          >
            <FiUser size={18} />
            <span className="hidden sm:inline">Account</span>
            {dropdownOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-100 rounded shadow-lg overflow-hidden">
              <div className="p-3 border-b border-gray-700">
                <p className="text-sm font-semibold text-blue-300">{user.email}</p>
                <p className="text-xs text-gray-400">User ID: {user._id}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-600 hover:text-white transition duration-150"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Not logged in</p>
      )}
    </header>
  );
}
