import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useEduorContext } from "../../context/EduorContext";

const Navlink = ({ href, children }) => {
  const { handleMobileNavClose } = useEduorContext();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Link
      to={href}
      className={`nav-link ${pathname === href ? "active" : ""}`}
      onClick={handleMobileNavClose}
    >
      {children}
    </Link>
  );
};

export default Navlink;