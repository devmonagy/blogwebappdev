import React, { useEffect } from "react";

const About: React.FC = () => {
  // Function to handle scrolling to the hash from the URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, []);

  return (
    <div className="about container py-20 mx-auto p-7 flex flex-col gap-6 lg:max-w-screen-md">
      <h1 className="text-3xl font-bold mb-4">🚀 App Release Information!</h1>
      <p className="mb-4">
        I'm excitedd to officially launch <strong>Version 1.0.0</strong> of my
        full-stack <strong>MERN blog web application</strong>! 🎉
        <em> (Deployed April 4, 2025).</em>
      </p>

      <p className="mb-4">
        This marks the first production-ready release of the app, now deployed
        and live using:
      </p>

      <ul className="list-disc list-inside mb-4">
        <li>
          🖥️ <strong>Frontend:</strong> React (with TypeScript), hosted on
          Vercel
        </li>
        <li>
          🛠️ <strong>Backend:</strong> Node.js + Express + MongoDB, deployed on
          Render
        </li>
        <li>
          🗃️ <strong>Database:</strong> MongoDB Atlas
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        🛠️ Key Features in v1.0.0
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>🧑‍💻 User Registration & Login (with JWT authentication)</li>
        <li>🔐 Passwords securely hashed using bcryptjs</li>
        <li>📝 Create and manage blog posts (with optional image upload)</li>
        <li>📦 REST API for user and post management</li>
        <li>🎨 Responsive frontend styled with Tailwind CSS</li>
        <li>
          🛡️ CORS-enabled backend to support secure frontend/backend
          communication
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">⚠️ Note</h2>
      <p className="mb-4">
        This is an <strong>early production release</strong>. More features and
        refinements are actively being worked on — including:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>✏️ Post editing</li>
        <li>👤 User profile customization</li>
        <li>🧰 Improved editor experience with formatting options</li>
        <li>🤝 Social interactions</li>
      </ul>

      <p className="mt-6 mb-2">
        Thanks for checking it out! Feel free to explore the live app at:
      </p>
      <a
        href="https://blogwebapp.monagy.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline hover:text-blue-700"
      >
        👉 https://blogwebapp.monagy.com
      </a>

      <p className="mt-4">
        Feedback and bug reports are always welcome! 🙌{" "}
        <a
          href="mailto:contactmonagy@gmail.com"
          className="text-blue-500 underline hover:text-blue-700"
        >
          contactmonagy@gmail.com
        </a>
        .
      </p>
    </div>
  );
};

export default About;
