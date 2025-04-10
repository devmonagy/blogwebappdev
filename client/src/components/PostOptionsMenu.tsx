import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";

interface PostOptionsMenuProps {
  userId: string | null;
  postAuthorId: string;
  userRole: string | null;
  handleEdit: () => void;
  handlePinStory: () => void;
  handleStorySettings: () => void;
  handleDelete: () => void;
  isAdmin: boolean;
  isAuthor: boolean;
  postId: string;
  userClaps?: number;
  setUserClaps?: (count: number) => void;
  setClaps?: (count: number) => void;
}

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({
  userId,
  postAuthorId,
  userRole,
  handleEdit,
  handlePinStory,
  handleStorySettings,
  handleDelete,
  isAdmin,
  isAuthor,
  postId,
  userClaps = 0,
  setUserClaps,
  setClaps,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUndoClaps = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<{ claps: number; userClaps: number }>(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/undo-claps`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { claps: updatedClaps, userClaps: updatedUserClaps } =
        response.data;

      if (setUserClaps) setUserClaps(updatedUserClaps);
      if (setClaps) setClaps(updatedClaps);

      socket.emit("clapUpdated", { postId, claps: updatedClaps });
      setShowOptions(false);
    } catch (error) {
      console.error("Failed to undo claps:", error);
    }
  };

  const canUndoClaps = !isAuthor && userId && userClaps > 0;

  return (
    <>
      <span
        className="material-icons pt-1.5 text-gray-600 cursor-pointer"
        ref={iconRef}
        onClick={() => setShowOptions(!showOptions)}
      >
        more_vert
      </span>
      <div
        ref={menuRef}
        className={`absolute right-0 bg-white rounded-md shadow-xl z-20 w-[max-content] ${
          !showOptions ? "hidden" : ""
        }`}
        style={{
          top: `${iconRef.current ? iconRef.current.offsetHeight + 2 : 20}px`,
        }}
      >
        <ul className="text-gray-900">
          {canUndoClaps && (
            <li
              className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
              onClick={handleUndoClaps}
            >
              Undo claps
            </li>
          )}

          {isAuthor && (
            <>
              <li
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                onClick={handleEdit}
              >
                Edit story
              </li>
              <li
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                onClick={handlePinStory}
              >
                Pin this story to your profile
              </li>
              <li
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                onClick={handleStorySettings}
              >
                Story settings
              </li>
              <li
                className="cursor-pointer hover:bg-red-100 text-red-600 rounded-b-lg px-4 py-2 text-sm"
                onClick={handleDelete}
              >
                Delete story
              </li>
            </>
          )}

          {!isAuthor && (
            <>
              <li className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm">
                Show more
              </li>
              <li className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm">
                Show less
              </li>
              <li className="cursor-pointer hover:bg-gray-100 px-4 py-2 mb-1 text-sm">
                Follow author
              </li>
            </>
          )}

          {isAdmin && !isAuthor && (
            <>
              <hr className="my-2" />
              <li
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                onClick={handleEdit}
              >
                Edit story
              </li>
              <li
                className="cursor-pointer hover:bg-red-100 text-red-600 rounded-b-lg px-4 py-2 text-sm"
                onClick={handleDelete}
              >
                Delete story
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default PostOptionsMenu;
