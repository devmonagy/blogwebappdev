import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
  role: string;
}

interface MagicLoginResponse {
  token: string;
  user: User;
}

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const MagicLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your magic link...");

  useEffect(() => {
    const verifyMagicLink = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("Invalid or missing token.");
        return;
      }

      try {
        const res = await axios.get<MagicLoginResponse>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/magic-login`,
          { params: { token } }
        );

        const { token: authToken, user } = res.data;

        // Save full user and token in localStorage
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Trigger global onLogin
        onLogin(user, authToken);

        setStatus("Login successful! Redirecting...");

        const profileIncomplete =
          !user.firstName?.trim() || !user.lastName?.trim();

        setTimeout(() => {
          navigate(profileIncomplete ? "/complete-profile" : "/dashboard");
        }, 500);
      } catch (err: any) {
        console.error("Magic link login failed:", err);
        const fallbackError =
          err.response?.data?.error || "Invalid or expired magic link.";
        setStatus(fallbackError);
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    verifyMagicLink();
  }, [navigate, onLogin]);

  return (
    <div className="flex items-center justify-center h-screen bg-background text-white text-center px-4">
      <div className="bg-cardBackground p-6 rounded-md shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-primaryText">Magic Login</h2>
        <p className="text-secondaryText">{status}</p>
      </div>
    </div>
  );
};

export default MagicLogin;
