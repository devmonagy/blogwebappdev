import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <div className="bg-header">
      <header className="px-7 py-2 mx-auto flex items-center justify-between text-primaryText">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">
            <Link to="/" className="text-href">
              Blogwebapp
            </Link>
          </h1>
          <p className="text-xxs text-primaryText mt-1">
            Application Developer:{" "}
            <a
              href="https://monagy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[0.5px] text-primaryText transition-colors"
            >
              Mohamed Nagy
            </a>
          </p>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
        </div>
      </header>
    </div>
  );
};

export default Header;
