import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface UpdateProfileFormProps {
  initialEmail: string;
  initialFirstName: string;
  initialLastName: string;
  initialProfilePicture: string | null; // Allow null for cases where there is no picture
  onUpdate: (
    email: string,
    firstName: string,
    lastName: string,
    profilePicture: string
  ) => void;
}

interface ProfilePictureResponse {
  profilePicture: string;
}

interface PasswordCheckResponse {
  isSame: boolean;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  initialEmail,
  initialFirstName,
  initialLastName,
  initialProfilePicture,
  onUpdate,
}) => {
  const [newEmail, setNewEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(
    initialProfilePicture
  );
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStatus, setPasswordStatus] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setProfilePicture(initialProfilePicture);
  }, [initialProfilePicture]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);
    switch (strength) {
      case 1:
        setPasswordStatus("Strength: Weak");
        break;
      case 2:
        setPasswordStatus("Strength: Fair");
        break;
      case 3:
        setPasswordStatus("Strength: Good");
        break;
      case 4:
        setPasswordStatus("Strength: Strong");
        break;
      default:
        setPasswordStatus("Strength: Very Strong");
    }
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("User is not authenticated.");
          return;
        }

        const response = await axios.post<ProfilePictureResponse>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/upload-profile-picture`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data && response.data.profilePicture) {
          const updatedProfilePicture = `${process.env.REACT_APP_BACKEND_URL}/uploads/${response.data.profilePicture}`;
          setProfilePicture(updatedProfilePicture);
          onUpdate(newEmail, firstName, lastName, updatedProfilePicture);
          setMessage("Profile picture updated successfully!");
        } else {
          setMessage("Failed to update profile picture.");
        }
      } catch (error: any) {
        setMessage(
          error.response?.data?.error || "Failed to upload profile picture."
        );
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const trimmedEmail = newEmail.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedNewPassword = newPassword.trim();

    if (
      trimmedEmail === "" &&
      trimmedFirstName === "" &&
      trimmedLastName === "" &&
      trimmedNewPassword === ""
    ) {
      setMessage("No changes were made.");
      return;
    }

    if (
      trimmedEmail === initialEmail &&
      trimmedFirstName === initialFirstName &&
      trimmedLastName === initialLastName &&
      trimmedNewPassword === "" &&
      !newPassword &&
      profilePicture === initialProfilePicture
    ) {
      setMessage("No changes were made.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User is not authenticated.");
        return;
      }

      if (trimmedNewPassword) {
        const passwordResponse = await axios.post<PasswordCheckResponse>(
          `${process.env.REACT_APP_BACKEND_URL}/auth/check-password`,
          { password: trimmedNewPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (passwordResponse.data.isSame) {
          setMessage("Password can't be your current one!");
          return;
        }
      }

      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/auth/update-profile`,
          {
            email: trimmedEmail,
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            newPassword: trimmedNewPassword,
            profilePicture,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          onUpdate(
            trimmedEmail,
            trimmedFirstName,
            trimmedLastName,
            profilePicture || ""
          );
          setMessage("Profile updated successfully!");
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.error
          ) {
            setMessage(error.response.data.error);
          } else {
            setMessage("Failed to update profile.");
          }
        });
    } catch (error: any) {
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="w-full p-6 bg-background rounded-md ">
      <div className="flex flex-col items-center mb-4 ">
        <img
          src={profilePicture || "/path/to/default/avatar.jpg"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-2 object-cover"
        />
        <label className="text-href cursor-pointer hover:underline">
          Update Avatar
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        </label>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block mb-1 text-primaryText text-sm"
          >
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block mb-1 text-primaryText text-sm"
          >
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="newEmail"
            className="block mb-1 text-primaryText text-sm"
          >
            New Email Address:
          </label>
          <input
            type="email"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-700 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="block mb-1 text-primaryText text-sm"
          >
            New Password:
          </label>
          <div className="eyecomp flex items-center border rounded-md overflow-hidden">
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              className="w-full px-3 py-2 border-none text-gray-700 focus:outline-none text-sm"
            />
            <div
              className="px-3 flex items-center cursor-pointer bg-gray-200 "
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <AiFillEyeInvisible className="text-gray-500" />
              ) : (
                <AiFillEye className="text-gray-500" />
              )}
            </div>
          </div>
          <div className="h-2 mt-2 w-full rounded-full bg-gray-300">
            <div
              className={`h-full rounded-full ${
                passwordStrength >= 4 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${(passwordStrength / 5) * 100}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-secondaryText text-sm ">
            {passwordStatus}
          </p>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
        >
          Update Profile
        </button>
      </form>
      {message && (
        <p className="mt-4 text-left text-secondaryText text-sm font-black	">
          {message}
        </p>
      )}
    </div>
  );
};

export default UpdateProfileForm;
