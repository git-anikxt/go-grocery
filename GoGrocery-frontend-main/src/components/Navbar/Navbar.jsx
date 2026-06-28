import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { StoreContext } from "../../Context/StoreContext";
import SearchBox from "../SearchBox/SearchBox";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("gogrocerytoken");
    setToken("");
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-logo-heading-holder">
          <Link to="/">
            <img className="logo" src={assets.logo} alt="" />
          </Link>
          <h1 className="navbar-heading-user">GoGrocery</h1>
        </div>

        <ul className="navbar-menu">
          <Link
            to="/"
            onClick={() => setMenu("home")}
            className={`${menu === "home" ? "active" : ""}`}
          >
            home
          </Link>
          <HashLink
            smooth
            to="/#explore-store"
            onClick={() => setMenu("menu")}
            className={`${menu === "menu" ? "active" : ""}`}
          >
            stores
          </HashLink>
          <HashLink
            smooth
            to="/#app-download"
            onClick={() => setMenu("mob-app")}
            className={`${menu === "mob-app" ? "active" : ""}`}
          >
            mobile app
          </HashLink>
          <a
            href="#footer"
            onClick={() => setMenu("contact")}
            className={`${menu === "contact" ? "active" : ""}`}
          >
            contact us
          </a>
        </ul>
        <div className="navbar-right">
          <img
            onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}
            src={assets.search_icon}
            alt=""
          />
          <Link to="/cart" className="navbar-search-icon">
            <img src={assets.basket_icon} alt="" />
            <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
          </Link>
          {!token ? (
            <button onClick={() => setShowLogin(true)}>sign in</button>
          ) : (
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="navbar-profile-dropdown">
                <li onClick={() => navigate("/myorders")}>
                  {" "}
                  <img src={assets.bag_icon} alt="" /> <p>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  {" "}
                  <img src={assets.logout_icon} alt="" /> <p>Logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {searchBoxVisibility && <SearchBox />}
    </>
  );
};

export default Navbar;
