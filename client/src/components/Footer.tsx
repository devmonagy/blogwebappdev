import React from "react";

const Footer: React.FC = () => (
  <footer className="p-4 bg-footer text-primaryText text-center">
    <p>&copy; {new Date().getFullYear()} BLOGWEBAPP. All rights reserved.</p>
  </footer>
);

export default Footer;
