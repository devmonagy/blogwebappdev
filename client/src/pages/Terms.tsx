import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-secondaryText">
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">Effective Date: April 19, 2025</p>

      <p className="mb-4">
        By accessing or using Blogwebapp at https://blogwebapp.monagy.com ("the
        Site"), you agree to the following terms:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Our Service</h2>
      <p className="mb-4">
        You must be at least 13 years old to use this site. By signing up, you
        agree not to use the site for any unlawful or abusive purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Accounts</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your login
        credentials. You may log in via Google, Facebook, or email link.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Content</h2>
      <ul className="list-disc list-inside mb-4">
        <li>You retain ownership of your blog posts and comments</li>
        <li>You grant Blogwebapp a license to display your content publicly</li>
        <li>
          We reserve the right to remove content that violates our policies
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access if you violate these terms or
        misuse the platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Limitation of Liability
      </h2>
      <p className="mb-4">
        We are not liable for any damages resulting from use or inability to use
        the service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes</h2>
      <p className="mb-4">
        We may update these terms periodically. Continued use of the site
        constitutes acceptance of any changes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact</h2>
      <p>
        If you have any questions or concerns, please email us at{" "}
        <strong>contactmonagy@gmail.com</strong>.
      </p>
    </div>
  );
};

export default Terms;
