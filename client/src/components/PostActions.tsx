import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clapLightImage from "../assets/clapLight.png";
import {
  faComment,
  faBookmark,
  faShareSquare,
} from "@fortawesome/free-regular-svg-icons";

interface PostActionsProps {
  userId: string | null;
  postAuthorId: string;
  userRole: string | null; // Added to track the role of the user
  handleEdit: () => void;
  handlePinStory: () => void;
  handleStorySettings: () => void;
  handleDelete: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  userId,
  postAuthorId,
  userRole, // Added userRole prop
  handleEdit,
  handlePinStory,
  handleStorySettings,
  handleDelete,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  // Handles clicking outside the menu to close it
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

    // Add when the component is mounted
    document.addEventListener("mousedown", handleClickOutside);

    // Return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAdmin = userRole === "admin";
  const isAuthor = userId === postAuthorId;

  return (
    <div className="flex justify-between items-center border-t border-b py-2 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-gray-600 cursor-pointer">
          <img
            src={clapLightImage}
            alt="Clap"
            className="mr-1 w-5 h-5 clapImg"
          />
          <span>0</span>
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
        {userId && (
          <div>
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
                top: `${
                  iconRef.current ? iconRef.current.offsetHeight + 2 : 20
                }px`,
              }}
            >
              <ul className="text-gray-900">
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
                    <hr className="my-2" /> {/* Separator line */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PostActions;
