import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-secondaryText">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Effective Date: April 19, 2025</p>

      <p className="mb-4">
        This Privacy Policy explains how Blogwebapp ("we", "our", or "us")
        collects, uses, and protects your personal information when you visit or
        use https://blogwebapp.monagy.com.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Information We Collect
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Email address, name, and profile photo via social login (Google or
          Facebook)
        </li>
        <li>Login activity, posts, and interactions on our platform</li>
        <li>
          Technical data (e.g. browser, IP address) via cookies and analytics
          tools
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        How We Use Your Information
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>To authenticate users via Google, Facebook, or email login</li>
        <li>To display your profile and blog posts</li>
        <li>To improve app functionality and performance</li>
        <li>To respond to inquiries or support requests</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Google OAuth (for login)</li>
        <li>Facebook Login</li>
        <li>Cloudinary (image hosting)</li>
        <li>Render and Vercel (app hosting)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
      <p className="mb-4">
        You can request to update, delete, or export your data at any time by
        contacting us at <strong>contactmonagy@gmail.com</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">
        We follow best practices to secure your data, including HTTPS
        encryption, access controls, and regular audits.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy as needed. Changes will be reflected
        on this page with a new effective date.
      </p>

      <p>
        If you have any questions, please contact us at{" "}
        <strong>contactmonagy@gmail.com</strong>.
      </p>
    </div>
  );
};

export default Privacy;
