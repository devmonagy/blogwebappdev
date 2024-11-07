// src/components/UpdateProfileForm.tsx
import React, { useState } from "react";
import axios from "axios";

interface UpdateProfileFormProps {
  initialEmail: string;
  initialFirstName: string;
  initialLastName: string;
  onUpdate: (email: string, firstName: string, lastName: string) => void;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  initialEmail,
  initialFirstName,
  initialLastName,
  onUpdate,
}) => {
  const [newEmail, setNewEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [message, setMessage] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User is not authenticated.");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/update-profile`,
        { firstName, lastName, email: newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(newEmail, firstName, lastName);
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to update profile.");
    }
  };

  return (
    <div className="w-full p-6 bg-background border border-gray-400 rounded-md shadow-md">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-300" htmlFor="firstName">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300" htmlFor="lastName">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300" htmlFor="newEmail">
            New Email Address:
          </label>
          <input
            type="email"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-700"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
      {message && <p className="mt-4 text-left text-gray-300">{message}</p>}
    </div>
  );
};

export default UpdateProfileForm;
