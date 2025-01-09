// client/src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

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
      fetchUsers(); // Refresh the list of users
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container p-4 lg:max-w-screen-md">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <table className="w-full mt-4 border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Username</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 p-2">{user.username}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.role}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => updateUserRole(user._id, "admin")}
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Make Admin
                </button>
                <button
                  onClick={() => updateUserRole(user._id, "user")}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Revoke Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
