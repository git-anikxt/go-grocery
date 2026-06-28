import React, { useContext, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = (e) => {
    localStorage.removeItem("shopkeepertoken");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      <span className="nav-title">GoGrocery Shopkeeper Panel</span>
      {token && (
        <img
          onClick={logout}
          className="logout"
          src={assets.logout_icon}
          alt=""
        />
      )}
    </div>
  );
};

export default Navbar;
