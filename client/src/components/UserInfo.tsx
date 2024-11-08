// src/components/UserInfo.tsx
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface UserInfoProps {
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  memberSince: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({
  username,
  email,
  firstName,
  lastName,
  memberSince,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  // Close the tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-200">Review Your Details</h3>
      <div className="relative">
        <label className="block mb-1 text-gray-300 flex items-center font-bold text-cyan-600">
          Username:
          <AiOutlineInfoCircle
            className="ml-2 text-gray-400 cursor-pointer"
            onClick={toggleTooltip}
          />
        </label>
        {showTooltip && (
          <div
            ref={tooltipRef}
            className="absolute mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg"
          >
            Username can't be changed
          </div>
        )}
        <p className="text-gray-100">{username || "N/A"}</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-300 font-bold text-cyan-600">
          First Name:
        </label>
        <p className="text-gray-100">{firstName || "N/A"}</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-300 font-bold text-cyan-600">
          Last Name:
        </label>
        <p className="text-gray-100">{lastName || "N/A"}</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-300 font-bold text-cyan-600">
          Email:
        </label>
        <p className="text-gray-100">{email || "N/A"}</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-300 font-bold text-cyan-600">
          Member Since:
        </label>
        <p className="text-gray-100">{memberSince || "N/A"}</p>
      </div>
    </div>
  );
};

export default UserInfo;
