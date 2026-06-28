import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signin = () => {
  const { url, setToken } = useContext(StoreContext);

  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    contactNo: "",
    password: "",
  });

  const onLoginFormInputChange = (e) => {
    if (e.target.name === "contactNo") {
      if (e.target.value.length > 10) {
        e.target.value = e.target.value.slice(0, 10);
      }
    }
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    console.log(loginDetails);

    const response = await axios.post(
      `${url}/api/shopkeeper/signin`,
      loginDetails
    );

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("shopkeepertoken", response.data.token);
      navigate("/add");
    } else {
      toast.error(response.data.message);
    }
  };
  return (
    <div className="signin-div">
      <h2 className="home-heading">
        Sign in to your account using your Phone no and Password.
      </h2>
      <input
        type="number"
        maxLength="10"
        value={loginDetails.number}
        onChange={onLoginFormInputChange}
        name="contactNo"
        placeholder="Contact no"
      />{" "}
      <br />
      <input
        type="password"
        value={loginDetails.password}
        onChange={onLoginFormInputChange}
        name="password"
        placeholder="password"
      />{" "}
      <br />
      <button className="signin-btn" onClick={onLogin}>
        Sign in
      </button>
    </div>
  );
};

export default Signin;
