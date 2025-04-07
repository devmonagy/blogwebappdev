import React from "react";

const Footer: React.FC = () => (
  <div className="bg-footer">
    <div className="container mx-auto p-4 text-primaryText text-center text-xs sm:text-base">
      <footer>
        <p>&copy; {new Date().getFullYear()} Blogwebapp • Version 1.0.0 </p>
      </footer>
    </div>
  </div>
);

export default Footer;
