import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, Location } from "react-router-dom";
import writeIcon from "../assets/Write.png";
import bellIcon from "../assets/bell.png";
import profileIcon from "../assets/ProfileDropIcon.png";
import libraryIcon from "../assets/LibraryDropIcon.png";
import storiesIcon from "../assets/StoriesDropIcon.png";
import logoutIcon from "../assets/LogoutDropIcon.png";
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
        className="hidden md:flex items-center gap-1 hover:text-primaryButton"
      >
        <img src={writeIcon} alt="Write new post" className="w-4 h-4" />
        <span className="text-sm">Write</span>
      </Link>

      {/* Desktop: Logged out links */}
      {!isAuthenticated && (
        <>
          <Link
            to="/register"
            className="hidden md:block bg-primaryButton text-primaryButtonText rounded-full px-4 py-1 font-medium hover:bg-buttonHover transition"
          >
            Sign up
          </Link>
          <span
            className="hidden md:block text-sm text-secondaryButtonText hover:text-primaryButton cursor-pointer"
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
            "https://res.cloudinary.com/dqdix32m5/image/upload/v1744561630/user_v0drnu_loggedoutdefault_z25o5l.png"
          }
          alt="User"
          className="w-8 h-8 rounded-full object-cover cursor-pointer"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded-md shadow-lg py-4 px-4 z-50">
            {!isAuthenticated ? (
              <>
                <p className="text-sm text-gray-600 font-medium mb-3">
                  Get started on Blogwebapp
                </p>
                <Link
                  to="/register"
                  onClick={() => setDropdownOpen(false)}
                  className="block w-full text-center bg-primaryButton text-primaryButtonText rounded-full py-2 mb-2 font-semibold hover:bg-buttonHover transition"
                >
                  Sign up
                </Link>
                <button
                  onClick={handleLoginRedirect}
                  className="block w-full text-center bg-white text-secondaryButtonText border border-secondaryButton rounded-full py-2 font-semibold hover:bg-secondaryHover transition"
                >
                  Sign in
                </button>

                <hr className="my-3 border-t border-gray-200 md:hidden" />

                <Link
                  to="/write-post"
                  className="md:hidden flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img
                    src={writeIcon}
                    alt="Write new post"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Write</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/write-post"
                  className="md:hidden flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img
                    src={writeIcon}
                    alt="Write new post"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Write</span>
                </Link>

                <hr className="my-2 border-t border-gray-200 md:hidden" />

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img
                    src={profileIcon}
                    alt="Profile icon"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Profile</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img
                    src={libraryIcon}
                    alt="Library icon"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Library</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img
                    src={storiesIcon}
                    alt="Stories icon"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Stories</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left rounded"
                >
                  <img src={logoutIcon} alt="Logout icon" className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
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
