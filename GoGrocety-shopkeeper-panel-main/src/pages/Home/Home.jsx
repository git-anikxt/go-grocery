import React, { useState } from "react";
import Signin from "./Signin";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import Signup from "./Signup";
const Home = () => {
  const [activeButton, setActiveButton] = useState("signin");
  const signinButtonClick = () => {
    setActiveButton("signin");
  };
  const SignupButtonClick = () => {
    setActiveButton("signup");
  };
  return (
    <div>
      <div className="homepage">
        <div className="btn-holder">
          <button
            className={`btn-home ${
              activeButton === "signin" ? "btn-active" : ""
            }`}
            onClick={signinButtonClick}
          >
            Sign in
          </button>
          <button
            className={`btn-home ${
              activeButton === "signup" ? "btn-active" : ""
            }`}
            onClick={SignupButtonClick}
          >
            Sign up
          </button>
        </div>
        {activeButton === "signin" && <Signin />}
        {activeButton === "signup" && <Signup />}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
