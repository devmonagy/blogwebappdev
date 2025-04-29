// client/src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlineDotsVertical } from "react-icons/hi";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get<User[]>(
        `${process.env.REACT_APP_BACKEND_URL}/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/users/role`,
        { userId, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setConfirmUserId(userId);
    setOpenDropdownId(null);
  };

  const cancelDelete = () => {
    setConfirmUserId(null);
  };

  const deleteUser = async () => {
    try {
      if (!confirmUserId) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/admin/users/${confirmUserId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
      setConfirmUserId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleDropdown = (userId: string) => {
    setOpenDropdownId((prev) => (prev === userId ? null : userId));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".dropdown-menu") &&
        !target.closest(".dropdown-toggle")
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Admin Dashboard
      </h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div>
                <p className="text-base font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-xs sm:ml-4 px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                {user.role}
              </span>
            </div>
            <div className="absolute top-4 right-4 sm:static sm:ml-auto">
              <button
                onClick={() => toggleDropdown(user._id)}
                className="dropdown-toggle p-2 rounded-full hover:bg-gray-100 transition"
              >
                <HiOutlineDotsVertical className="w-5 h-5 text-gray-600" />
              </button>

              {openDropdownId === user._id && (
                <div className="dropdown-menu absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  {user.role !== "admin" ? (
                    <button
                      onClick={() => updateUserRole(user._id, "admin")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUserRole(user._id, "user")}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Revoke Admin
                    </button>
                  )}
                  <button
                    onClick={() => confirmDeleteUser(user._id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Delete User
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {confirmUserId && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm user deletion
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
