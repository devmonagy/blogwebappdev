import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faShareSquare } from "@fortawesome/free-regular-svg-icons";
import ClapControl from "./ClapControl";
import CommentControl from "./CommentControl";
import PostOptionsMenu from "./PostOptionsMenu";
import ClapUsersModal from "./ClapUsersModal";
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
  onCommentsClick: () => void; // ✅ Added
}

interface ClapUser {
  _id: string;
  firstName: string;
  lastName: string;
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
  onCommentsClick, // ✅ New prop
}) => {
  const isAuthor = userId === postAuthorId;
  const isAdmin = userRole === "admin";

  const [claps, setClaps] = useState<number>(0);
  const [userClaps, setUserClaps] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [clapUsers, setClapUsers] = useState<ClapUser[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchInitialClaps = async () => {
      try {
        const config = userId
          ? {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              },
            }
          : {};

        const response = await axios.get<{ claps: number; userClaps?: number }>(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/claps`,
          config
        );

        setClaps(response.data.claps || 0);
        setUserClaps(response.data.userClaps || 0);
      } catch (error) {
        console.error("Error fetching initial claps:", error);
      }
    };

    if (postId) fetchInitialClaps();

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

  return (
    <>
      <div className="flex justify-between items-center border-t border-b py-2 mb-6">
        <div className="flex items-center space-x-4">
          <ClapControl
            postId={postId}
            userId={userId}
            isAuthor={isAuthor}
            claps={claps}
            userClaps={userClaps}
            setClaps={setClaps}
            setUserClaps={setUserClaps}
            setClapUsers={setClapUsers}
            setShowModal={setShowModal}
          />
          <CommentControl onClick={onCommentsClick} /> {/* ✅ Hooked up */}
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
          {userId && (
            <PostOptionsMenu
              userId={userId}
              postAuthorId={postAuthorId}
              userRole={userRole}
              handleEdit={handleEdit}
              handlePinStory={handlePinStory}
              handleStorySettings={handleStorySettings}
              handleDelete={handleDelete}
              isAdmin={isAdmin}
              isAuthor={isAuthor}
              postId={postId}
              userClaps={userClaps}
              setUserClaps={setUserClaps}
              setClaps={setClaps}
            />
          )}
        </div>
      </div>

      {showModal && (
        <ClapUsersModal users={clapUsers} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default PostActions;
