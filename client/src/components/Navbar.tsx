import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HamburgerIcon from "./HamburgerIcon";

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="relative" ref={navRef}>
      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"} // Accessible label
          className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <HamburgerIcon isOpen={isOpen} />
        </button>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex space-x-6">
        <li>
          <Link to="/" className="hover:text-buttonBackground">
            HOME
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-buttonBackground">
            ABOUT
          </Link>
        </li>
        <li>
          {isAuthenticated ? (
            <Link to="/dashboard" className="hover:text-buttonBackground">
              ACCOUNT
            </Link>
          ) : (
            <Link to="/login" className="hover:text-buttonBackground">
              LOGIN
            </Link>
          )}
        </li>
      </ul>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 transform translate-y-2 bg-background text-center p-4 z-20 flex flex-col items-center md:hidden">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="hover:text-buttonBackground"
                onClick={toggleMenu}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-buttonBackground"
                onClick={toggleMenu}
              >
                ABOUT
              </Link>
            </li>
            <li>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="hover:text-buttonBackground"
                  onClick={toggleMenu}
                >
                  ACCOUNT
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-buttonBackground"
                  onClick={toggleMenu}
                >
                  LOGIN
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
