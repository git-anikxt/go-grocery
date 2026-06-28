import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" width="100px" />
          <p>
            Say goodbye to generic grocery lists and hello to a tailored
            shopping experience that puts you in control. Experience the
            convenience of online shopping without compromising on quality or
            choice. Choose GoGrocery for a personalized grocery experience
            that's all about you.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91-7535867740</li>
            <li>contact@gogrocery.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © GoGrocery - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
