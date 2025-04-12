// client/src/components/ClapUsersModal.tsx
import React, { useEffect, useRef } from "react";

interface ClapUser {
  _id: string;
  firstName: string;
  profilePicture?: string;
  claps: number;
}

interface ClapUsersModalProps {
  users: ClapUser[];
  onClose: () => void;
}

const ClapUsersModal: React.FC<ClapUsersModalProps> = ({ users, onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-[90%] max-w-sm sm:max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Clapped for by:</h2>
          <button className="text-gray-600 hover:text-black" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              This post has not been clapped yet.
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center space-x-3 border-b pb-2"
              >
                <img
                  src={user.profilePicture || "/default-profile-picture.jpg"}
                  alt={user.firstName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.firstName}</span>
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
  );
};

export default ClapUsersModal;
