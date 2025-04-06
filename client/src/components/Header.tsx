import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  return (
    <div className="bg-header">
      <header className="px-7 py-2 mx-auto flex items-center justify-between  text-primaryText">
        {/* Clickable Logo (wrapped in h1) and Caption */}
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
              className="decoration-[0.5px] text-href hover:text-primaryText transition-colors duration-300 ease-in-out"
            >
              Mohamed Nagy
            </a>
          </p>
        </div>

        {/* Navbar aligned to the right */}
        <div className="ml-auto">
          <Navbar isAuthenticated={isAuthenticated} />
        </div>
      </header>
    </div>
  );
};

export default Header;
