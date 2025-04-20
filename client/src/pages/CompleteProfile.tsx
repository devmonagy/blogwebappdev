import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

interface ProfileData {
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
}

interface CompleteProfileProps {
  onProfileUpdate: (updatedUser: ProfileData) => void;
}

const MAX_BIO_LENGTH = 160;

const CompleteProfile: React.FC<CompleteProfileProps> = ({
  onProfileUpdate,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/user-profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { email, firstName, lastName, bio } = res.data as ProfileData;

        setFormData({
          email,
          firstName: firstName || "",
          lastName: lastName || "",
          bio: bio || "",
        });
      } catch (err: any) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "bio" && value.length > MAX_BIO_LENGTH) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/update-profile`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onProfileUpdate({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate(redirectPath, { replace: true }), 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen px-4 pt-20 pb-8">
      <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full mx-auto space-y-6">
        <h2 className="text-xl font-bold text-center text-primaryText">
          Complete Your Profile
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-secondaryText">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-200 text-secondaryText cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 text-secondaryText">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-secondaryText"
            />
          </div>

          <div>
            <label className="block mb-1 text-secondaryText">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md text-secondaryText"
            />
          </div>

          <div>
            <label className="block mb-1 text-secondaryText">
              Bio <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md text-secondaryText resize-none"
              placeholder="A short bio about you..."
            />
            <p className="text-xs text-right text-gray-400">
              {formData.bio.length}/{MAX_BIO_LENGTH}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaryButton text-primaryButtonText py-2 rounded-md font-medium hover:bg-buttonHover transition"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
