import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  approveUser,
  rejectUser,
  editUser,
  makeAdmin,
} from "../store/adminSlice";
import { toast } from "react-toastify";
import EditUserModal from "../components/EditUserModal";
import { FaUser, FaUserShield, FaEdit, FaTrash } from "react-icons/fa";

export default function UserManagement() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveUser(id)).then(() => {
      toast.success("User approved successfully");
    });
  };

  const handleReject = (id) => {
    dispatch(rejectUser(id)).then(() => {
      toast.success("User deleted successfully");
    });
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSave = (updatedData) => {
    dispatch(editUser({ id: selectedUser._id, data: updatedData }))
      .unwrap()
      .then(() => {
        toast.success("User updated successfully");
        handleModalClose();
      })
      .catch((error) => {
        toast.error("Failed to update user: " + error);
      });
  };

  const handleMakeAdmin = (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    dispatch(makeAdmin({ id, role: newRole })).then(() => {
      toast.success(`User role changed to ${newRole}`);
    });
  };

  return (
    <div className="space-y-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management Panel</h2>
        <div className="text-sm text-gray-500">
          {users.length} total users
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.hostel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {!user.verified && (
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#4CAF50] hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]"
                      >
                        <FaUser className="mr-1" />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleReject(user._id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleMakeAdmin(user._id, user.role)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
                        user.role === "admin"
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                    >
                      <FaUserShield className="mr-1" />
                      {user.role === "admin" ? "Make User" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditUserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
        onSave={handleSave}
      />
    </div>
  );
}
