// client/src/components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-header text-primaryText">
      {/* Clickable Logo (wrapped in h1) and Caption */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">
          <Link to="/" className="text-salmon">
            BLOGWEBAPP
          </Link>
        </h1>
        <p className="text-xs text-secondaryText mt-1">
          Development: Mohamed Nagy
        </p>
      </div>

      {/* Navbar aligned to the right */}
      <div className="ml-auto">
        <Navbar isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
};

export default Header;
