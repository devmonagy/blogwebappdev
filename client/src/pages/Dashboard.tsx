// client/src/pages/Dashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import defaultUserImage from "../assets/userImg.png"; // Import the default image

interface DashboardProps {
  user: string | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white">
      {/* Profile Picture */}
      <div className="w-24 h-24 rounded-full mb-4 overflow-hidden">
        <img
          src={defaultUserImage}
          alt="Default User"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Welcome Message */}
      <h2 className="text-2xl font-bold mb-2">Welcome, {user}!</h2>

      {/* Edit Profile Link */}
      <Link to="/edit-profile" className="text-blue-400 hover:underline mb-4">
        Edit Profile
      </Link>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
