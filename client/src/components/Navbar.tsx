import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, Location } from "react-router-dom";
import writeIcon from "../assets/Write.png";
import bellIcon from "../assets/bell.png";
import axios from "axios";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  currentLocation: Location;
}

interface UserProfileResponse {
  profilePicture: string;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onLogout,
  currentLocation,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setProfilePicture(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get<UserProfileResponse>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/user-profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const path = res.data.profilePicture;
        const url = path.startsWith("http")
          ? path
          : `${process.env.REACT_APP_BACKEND_URL}/uploads/${path.replace(
              /^\/+|uploads\/+/g,
              ""
            )}`;
        setProfilePicture(url);
      } catch (err) {
        console.error("Error loading profile image:", err);
      }
    };

    if (isAuthenticated) {
      fetchProfileImage();
    }
  }, [isAuthenticated]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    onLogout();
    navigate("/");
  };

  const handleLoginRedirect = () => {
    setDropdownOpen(false);
    navigate("/login", { state: { from: currentLocation } });
  };

  return (
    <div className="flex items-center gap-4 relative" ref={dropdownRef}>
      {/* Write: Desktop only */}
      <Link
        to="/write-post"
        className="hidden md:flex items-center gap-1 hover:text-buttonBackground"
      >
        <img src={writeIcon} alt="Write" className="w-4 h-4" />
        <span className="text-sm">Write</span>
      </Link>

      {/* Desktop: Logged out links */}
      {!isAuthenticated && (
        <>
          <Link
            to="/register"
            className="hidden md:block text-sm hover:text-buttonBackground"
          >
            Sign up
          </Link>
          <span
            className="hidden md:block text-sm hover:text-buttonBackground cursor-pointer"
            onClick={handleLoginRedirect}
          >
            Sign in
          </span>
        </>
      )}

      {/* Bell Icon (Only logged in) */}
      {isAuthenticated && (
        <img
          src={bellIcon}
          alt="Notifications"
          className="w-5 h-5 cursor-pointer"
        />
      )}

      {/* Profile Dropdown */}
      <div className="relative">
        <img
          src={
            profilePicture ||
            "https://res.cloudinary.com/dqdix32m5/image/upload/v1743881926/UserProfilePics/1743881923775-mo.png"
          }
          alt="User"
          className="w-8 h-8 rounded-full object-cover cursor-pointer"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50">
            {!isAuthenticated ? (
              <>
                <p className="px-4 text-sm text-gray-500 mb-1">
                  Get started on Blogwebapp
                </p>
                <Link
                  to="/register"
                  className="block px-4 py-2 font-semibold text-href hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Sign up
                </Link>
                <span
                  className="block px-4 py-2 text-slate-500 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLoginRedirect}
                >
                  Sign in
                </span>
                <hr className="my-2 border-t border-gray-200 md:hidden" />
                <Link
                  to="/write-post"
                  className="md:hidden flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img src={writeIcon} alt="Write" className="w-4 h-4" />
                  <span className="text-sm">Write</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/write-post"
                  className="md:hidden flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img src={writeIcon} alt="Write" className="w-4 h-4" />
                  <span className="text-sm">Write</span>
                </Link>

                <hr className="my-2 border-t border-gray-200 md:hidden" />

                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/library"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Library
                </Link>
                <Link
                  to="/stories"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Stories
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
