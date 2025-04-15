import React, { useEffect, useState } from "react";
import classNames from "classnames";

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        className={classNames(
          "fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 z-40",
          {
            "opacity-100 pointer-events-auto": isOpen,
            "opacity-0 pointer-events-none": !isOpen,
          }
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={classNames(
          "fixed bg-white shadow-xl transition-transform duration-300 ease-in-out z-50",
          "w-full sm:w-[420px] bottom-0 sm:bottom-auto right-0 sm:right-0 overflow-hidden",
          {
            // Desktop
            "sm:top-0 sm:h-full sm:translate-x-0 sm:rounded-none":
              isOpen && !isMobile,
            "sm:translate-x-full sm:top-0 sm:h-full sm:rounded-none":
              !isOpen && !isMobile,

            // Mobile
            "translate-y-0 h-3/4 rounded-t-xl px-4": isOpen && isMobile,
            "translate-y-full h-3/4 rounded-t-xl px-4": !isOpen && isMobile,
          }
        )}
      >
        <div className="h-full flex flex-col p-4 sm:p-6">{children}</div>
      </div>
    </>
  );
};

export default CommentsDrawer;
