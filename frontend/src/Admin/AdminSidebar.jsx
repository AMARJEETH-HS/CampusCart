// src/components/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaBox } from "react-icons/fa";

export default function AdminSidebar() {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-6 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-[#4CAF50] text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 bg-white h-screen p-6 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#4CAF50]">Admin Panel</h2>
        <p className="text-sm text-gray-500">Manage your platform</p>
      </div>
      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={linkStyle}>
          <FaHome className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={linkStyle}>
          <FaUsers className="w-5 h-5" />
          User Management
        </NavLink>
        <NavLink to="/admin/products" className={linkStyle}>
          <FaBox className="w-5 h-5" />
          Product Management
        </NavLink>
      </nav>
    </div>
  );
}
