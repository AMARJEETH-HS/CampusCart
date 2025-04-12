// src/components/EditUserModal.jsx
import React, { useEffect, useState } from "react";

export default function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({ name: "", email: "", hostel: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        hostel: user.hostel,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#F3F4F6] p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-[#1E3A8A]">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-[#1E3A8A]">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-[#1E3A8A]">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              type="email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-[#1E3A8A]">Campus</label>
            <input
              name="hostel"
              value={formData.hostel}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#1E3A8A] text-white px-3 py-1 rounded hover:bg-[#1E40AF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#EF4444] text-white px-3 py-1 rounded hover:bg-[#DC2626]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
