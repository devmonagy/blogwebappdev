import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  _id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profilePicture?: string;
}

const OAuthSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const completeLogin = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        localStorage.setItem("token", token);

        const res = await axios.post<{ valid: boolean; user: User }>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/validate-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = res.data.user;

        // Save full user object
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on profile completeness
        const profileIncomplete =
          !user.firstName?.trim() || !user.lastName?.trim();

        window.location.replace(
          profileIncomplete ? "/complete-profile" : "/dashboard"
        );
      } catch (err) {
        console.error("Token validation failed:", err);
        navigate("/login");
      }
    };

    completeLogin();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-white bg-background">
      <h2 className="text-xl font-semibold">Logging you in via Google...</h2>
    </div>
  );
};

export default OAuthSuccess;
