import React, { useState } from "react";
import axios from "axios";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import clapLightImage from "../assets/clapLight.png";
import clapSolidImage from "../assets/clapSolid.png";

interface ClapUser {
  _id: string;
  firstName: string;
  profilePicture?: string;
  claps: number;
}

interface ClapControlProps {
  postId: string;
  userId: string | null;
  isAuthor: boolean;
  claps: number;
  userClaps: number;
  setClaps: (val: number) => void;
  setUserClaps: (val: number) => void;
  setClapUsers: (users: ClapUser[]) => void;
  setShowModal: (show: boolean) => void;
}

const ClapControl: React.FC<ClapControlProps> = ({
  postId,
  userId,
  isAuthor,
  claps,
  userClaps,
  setClaps,
  setUserClaps,
  setClapUsers,
  setShowModal,
}) => {
  const [showClapBubble, setShowClapBubble] = useState(false);
  const [clapIncrement, setClapIncrement] = useState(0);
  const navigate = useNavigate();

  const handleClap = () => {
    if (!userId) {
      navigate("/login");
    } else if (!isAuthor && userClaps < 50) {
      const newIncrement = userClaps + 1;
      socket.emit("sendClap", { postId, userId, increment: 1 });
      setUserClaps(newIncrement);
      setClaps(claps + 1);
      setClapIncrement(newIncrement);
      setShowClapBubble(true);
      setTimeout(() => setShowClapBubble(false), 2000);
    }
  };

  const handleShowClapUsers = async () => {
    try {
      const response = await axios.get<ClapUser[]>(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/clap-users`
      );
      setClapUsers(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to load clap users:", error);
    }
  };

  return (
    <div className="flex items-center gap-1" style={{ position: "relative" }}>
      <div
        className={`flex items-center ${
          isAuthor ? "cursor-default" : "cursor-pointer"
        }`}
        onClick={handleClap}
        title={
          !userId
            ? "You must be logged in to clap"
            : isAuthor
            ? "" // No tooltip for authors
            : "Clap"
        }
      >
        <img
          src={userClaps > 0 ? clapSolidImage : clapLightImage}
          alt="Clap"
          className={`w-5 h-5 ${isAuthor ? "opacity-50" : ""}`}
          style={{ filter: isAuthor ? "grayscale(100%)" : "none" }}
        />
        {showClapBubble && (
          <div className="clap-bubble">{`+${clapIncrement}`}</div>
        )}
      </div>
      <span
        className="text-sm cursor-pointer text-gray-700"
        onClick={handleShowClapUsers}
      >
        {claps}
      </span>
    </div>
  );
};

export default ClapControl;
