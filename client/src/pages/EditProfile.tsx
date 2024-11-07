import React, { useEffect, useState } from "react";
import axios from "axios";
import UserInfo from "../components/UserInfo";

interface UserInfoData {
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

const EditProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfoData>({
    username: null,
    email: null,
    firstName: null,
    lastName: null,
  });
  const [newEmail, setNewEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user info from localStorage
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName") || "";
    const lastName = localStorage.getItem("lastName") || "";

    // Set the initial user info
    setUserInfo({ username, email, firstName, lastName });
    setNewEmail(email || "");
    setFirstName(firstName);
    setLastName(lastName);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User is not authenticated.");
        return;
      }

      // Send updated data to the backend
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/update-profile`,
        { firstName, lastName, email: newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the data in localStorage and state
      localStorage.setItem("email", newEmail);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);

      setUserInfo({ ...userInfo, email: newEmail, firstName, lastName });
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 bg-background text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>

      {/* Display current user info */}
      <UserInfo
        username={userInfo.username}
        email={userInfo.email}
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
      />

      {/* Form to update first name, last name, and email */}
      <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
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

      {/* Success/Error message */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default EditProfile;
