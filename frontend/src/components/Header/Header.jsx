import React from "react";
import "./Header.css";
import { HashLink } from "react-router-hash-link";
const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <HashLink to="/#shopkeeper-display">View Stores</HashLink>
      </div>
    </div>
  );
};

export default Header;
