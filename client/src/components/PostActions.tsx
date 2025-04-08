import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clapLightImage from "../assets/clapLight.png";
import {
  faComment,
  faBookmark,
  faShareSquare,
} from "@fortawesome/free-regular-svg-icons";
import PostOptionsMenu from "./PostOptionsMenu";
import socket from "../socket";
import axios from "axios";

interface PostActionsProps {
  userId: string | null;
  postAuthorId: string;
  userRole: string | null;
  postId: string;
  handleEdit: () => void;
  handlePinStory: () => void;
  handleStorySettings: () => void;
  handleDelete: () => void;
}

interface ClapUser {
  _id: string;
  firstName: string;
  profilePicture?: string;
  claps: number;
}

const PostActions: React.FC<PostActionsProps> = ({
  userId,
  postAuthorId,
  userRole,
  postId,
  handleEdit,
  handlePinStory,
  handleStorySettings,
  handleDelete,
}) => {
  const [claps, setClaps] = useState<number>(0);
  const [userClaps, setUserClaps] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [clapUsers, setClapUsers] = useState<ClapUser[]>([]);
  const isAuthor = userId === postAuthorId;
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchInitialClaps = async () => {
      try {
        const response = await axios.get<{ claps: number; userClaps: number }>(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/claps`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setClaps(response.data.claps || 0);
        setUserClaps(response.data.userClaps || 0);
      } catch (error) {
        console.error("Error fetching initial claps:", error);
      }
    };

    if (postId && userId) fetchInitialClaps();

    socket.on("clapUpdated", (data) => {
      if (data.postId === postId) {
        setClaps(data.claps);
      }
    });

    return () => {
      socket.off("clapUpdated");
    };
  }, [postId, userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleClap = () => {
    if (!userId || isAuthor || userClaps >= 50) return;
    socket.emit("sendClap", { postId, userId });
    setUserClaps(userClaps + 1);
    setClaps(claps + 1);
  };

  const openClapUsersModal = async () => {
    try {
      const response = await axios.get<ClapUser[]>(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/clap-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClapUsers(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to load clap users:", error);
    }
  };

  return (
    <div className="flex justify-between items-center border-t border-b py-2 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-1">
          <div
            className={`flex items-center ${
              isAuthor
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 cursor-pointer"
            }`}
            onClick={!isAuthor ? handleClap : undefined}
            title={isAuthor ? "You can't clap your own post" : "Clap"}
          >
            <img
              src={clapLightImage}
              alt="Clap"
              className="w-5 h-5"
              style={{ filter: isAuthor ? "grayscale(100%)" : "none" }}
            />
          </div>
          <span
            onClick={openClapUsersModal}
            className="text-gray-700 cursor-pointer text-sm"
          >
            {claps}
          </span>
        </div>

        <div className="flex items-center text-gray-600 cursor-pointer">
          <FontAwesomeIcon icon={faComment} className="mr-1" />
          <span>0</span>
        </div>
      </div>

      <div className="relative flex items-center space-x-4">
        <FontAwesomeIcon
          icon={faBookmark}
          className="text-gray-600 cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faShareSquare}
          className="text-gray-600 cursor-pointer"
        />
        <PostOptionsMenu
          userId={userId}
          postAuthorId={postAuthorId}
          userRole={userRole}
          handleEdit={handleEdit}
          handlePinStory={handlePinStory}
          handleStorySettings={handleStorySettings}
          handleDelete={handleDelete}
          isAdmin={userRole === "admin"}
          isAuthor={isAuthor}
          postId={postId}
          userClaps={userClaps}
          setUserClaps={setUserClaps}
          setClaps={setClaps}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Users who clapped</h2>
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {clapUsers.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">
                  This post is not yet clapped.
                </p>
              ) : (
                clapUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center space-x-3 border-b pb-2"
                  >
                    <img
                      src={
                        user.profilePicture || "/default-profile-picture.jpg"
                      }
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {user.firstName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.claps} {user.claps === 1 ? "clap" : "claps"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostActions;
