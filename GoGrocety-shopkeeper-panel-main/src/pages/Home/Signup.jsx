import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { url, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    shopkeeperName: "",
    shopName: "",
    contactNo: "",
    category: "Grocery & Essentials",
    shopAddress: "",
    pincode: "",
    openTime: "",
    closeTime: "",
    gstno: "",
    password: "",
    confirmPassword: "",
  });

  const [image, setImage] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(data);
    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password does not match.");
      return;
    }
    const formData = new FormData();
    formData.append("shopkeeperName", data.shopkeeperName);
    formData.append("shopName", data.shopName);
    formData.append("contactNo", data.contactNo);
    formData.append("category", data.category);
    formData.append("shopAddress", data.shopAddress);
    formData.append("pincode", data.pincode);
    formData.append("openTime", data.openTime);
    formData.append("closeTime", data.closeTime);
    formData.append("gstno", data.gstno);
    formData.append("password", data.password);
    formData.append("image", image);
    const response = await axios.post(`${url}/api/shopkeeper/signup`, formData);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("shopkeepertoken", response.data.token);
      navigate("/add");
    } else {
      toast.error(response.data.message);
    }
  };

  const onChangeHandler = (event) => {
    if (event.target.name === "contactNo") {
      if (event.target.value.length > 10) {
        event.target.value = event.target.value.slice(0, 10);
      }
    }
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  return (
    <div className="signup">
      <form className="" onSubmit={onSubmitHandler}>
        <div className="add-img-upload img">
          <p>Upload Shop logo</p>
          <label htmlFor="image">
            <img
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              alt=""
            />
          </label>
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="">
          <p>Shop name</p>
          <input
            name="shopName"
            onChange={onChangeHandler}
            value={data.shopName}
            type="text"
            placeholder="Type here"
            required
          />
        </div>
        <div className="">
          <p>Shopkeeper name</p>
          <input
            name="shopkeeperName"
            onChange={onChangeHandler}
            value={data.shopkeeperName}
            type="text"
            placeholder="Type here"
            required
          />
        </div>
        <div className="">
          <p>Contact no</p>
          <input
            name="contactNo"
            onChange={onChangeHandler}
            value={data.contactNo}
            type="number"
            placeholder="Type here"
            required
          />
        </div>
        <div className="">
          <p>Shop Address</p>
          <textarea
            name="shopAddress"
            onChange={onChangeHandler}
            value={data.shopAddress}
            type="text"
            rows={6}
            placeholder="Write address here"
            required
          />
        </div>
        <div className="">
          <p>Pin Code</p>
          <input
            name="pincode"
            onChange={onChangeHandler}
            value={data.pincode}
            type="text"
            placeholder="Type here"
            required
          />
        </div>
        <div className="">
          <p>Open time(24hr time format)</p>
          <input
            name="openTime"
            onChange={onChangeHandler}
            value={data.openTime}
            type="time"
            placeholder="open time"
            required
          />
        </div>
        <div className="">
          <p>Close time(24hr time format)</p>
          <input
            name="closeTime"
            onChange={onChangeHandler}
            value={data.closeTime}
            type="time"
            placeholder="close time"
            required
          />
        </div>
        <div className="">
          <p>Shop category</p>
          <select name="category" onChange={onChangeHandler}>
            <option value="Grocery & Essentials">Grocery & Essentials</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Fruites & Vegetables">Fruits & Vegetables</option>
            <option value="Dry Fruits & Nuts">Dry Fruits & Nuts</option>
            <option value="Dairy Products">Dairy Products</option>
          </select>
        </div>
        <div className="">
          <p>Gst no</p>
          <input
            name="gstno"
            onChange={onChangeHandler}
            value={data.gstno}
            type="number"
            placeholder="Type here"
            required
          />
        </div>
        <div className="">
          <p>Password</p>
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Type here"
            required
          />
        </div>
        <div className="">
          <p>Confirm Password</p>
          <input
            name="confirmPassword"
            onChange={onChangeHandler}
            value={data.confirmPassword}
            type="text"
            placeholder="Type here"
            required
          />
        </div>
        <button type="submit" className="signin-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
