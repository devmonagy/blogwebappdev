import React, { useEffect, useState } from "react";
import axios from "axios";
import UserInfo from "../components/UserInfo";
import UpdateProfileForm from "../components/UpdateProfileForm";

interface UserInfoData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  memberSince: string;
}

const EditProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfoData | null>(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }

      const response = await axios.get<{
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
        createdAt: string;
      }>(`${process.env.REACT_APP_BACKEND_URL}/auth/user-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const {
        username,
        email,
        firstName,
        lastName,
        profilePicture,
        createdAt,
      } = response.data;

      let fullProfilePictureUrl: string | null = null;
      if (profilePicture) {
        const profilePicPath = profilePicture.replace(/^\/+|uploads\/+/g, "");
        fullProfilePictureUrl = profilePicture.startsWith("http")
          ? profilePicture
          : `${process.env.REACT_APP_BACKEND_URL}/uploads/${profilePicPath}`;
      }

      const parsedDate = new Date(createdAt);
      const memberSince =
        parsedDate instanceof Date && !isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString()
          : "N/A";

      setUserInfo({
        username,
        email,
        firstName,
        lastName,
        profilePicture: fullProfilePictureUrl,
        memberSince,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdate = (
    email: string,
    firstName: string,
    lastName: string,
    profilePicture: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/auth/update-profile`,
        { email, firstName, lastName, profilePicture },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        fetchUserData(); // Re-fetch user data to ensure it's up-to-date
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="container p-4 flex flex-col items-center justify-center  py-10 bg-background text-white px-4">
      <h2 className="text-3xl font-semibold mb-8 text-primaryText text-center">
        Edit Your Profile
      </h2>
      <div className="w-full max-w-5xl bg-cardBg p-7 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">
          {/* UpdateProfileForm */}
          <div className="w-full md:w-1/2">
            <div className="bg-cardInner p-6 rounded-xl shadow-sm">
              <UpdateProfileForm
                initialEmail={userInfo?.email || ""}
                initialFirstName={userInfo?.firstName || ""}
                initialLastName={userInfo?.lastName || ""}
                initialProfilePicture={userInfo?.profilePicture || ""}
                onUpdate={handleUpdate}
              />
            </div>
          </div>

          {/* UserInfo */}
          <div className="w-full md:w-1/2">
            <div className="bg-cardInner p-6 rounded-xl shadow-sm">
              <UserInfo
                username={userInfo?.username || "N/A"}
                email={userInfo?.email || "N/A"}
                firstName={userInfo?.firstName || "N/A"}
                lastName={userInfo?.lastName || "N/A"}
                memberSince={userInfo?.memberSince || "N/A"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
