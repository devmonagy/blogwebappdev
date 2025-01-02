import React from "react";

const Footer: React.FC = () => (
  <div className="bg-footer">
    <div className="container mx-auto p-4 text-primaryText text-center">
      <footer>
        <p>
          &copy; {new Date().getFullYear()} BLOGWEBAPP. All rights reserved.
        </p>
      </footer>
    </div>
  </div>
);

export default Footer;
