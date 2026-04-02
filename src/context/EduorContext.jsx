import { createContext, useContext, useEffect, useState } from "react";

const EduorContext = createContext();

export const EduorProvider = ({ children }) => {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderFixed(window.scrollY >= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [showVideo, setShowVideo] = useState(false);
  const handleVideoClose = () => setShowVideo(false);
  const handleVideoShow = () => setShowVideo(true);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const handleMobileNavOpen = () => setIsMobileNavOpen(true);
  const handleMobileNavClose = () => setIsMobileNavOpen(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <EduorContext.Provider
      value={{
        isHeaderFixed,
        showVideo,
        handleVideoClose,
        handleVideoShow,
        isValidEmail,
        isMobileNavOpen,
        handleMobileNavOpen,
        handleMobileNavClose,
        setIsMobileNavOpen,
      }}
    >
      {children}
    </EduorContext.Provider>
  );
};

export const useEduorContext = () => {
  const context = useContext(EduorContext);
  if (!context) {
    throw new Error("useEduorContext must be used within an EduorProvider");
  }
  return context;
};