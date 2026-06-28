import React, { useEffect, useState, useContext } from "react";
import "./Add.css";
import { assets, url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Add = () => {
  const navigate = useNavigate();

  const { url, token, setToken } = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
  });

  const [image, setImage] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("discount", Number(data.discount));
    formData.append("image", image);
    const response = await axios.post(
      `${url}/api/shopkeeper/addItem`,
      formData,
      {
        headers: {
          token: `${token}`,
        },
      }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      setData({
        name: "",
        description: "",
        price: "",
        discount: "",
      });
      setImage(false);
    } else {
      toast.error(response.data.message);
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    if (!localStorage.getItem("shopkeepertoken")) {
      navigate("/");
    } else {
      setToken(localStorage.getItem("shopkeepertoken"));
    }
  }, []);
  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
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
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            placeholder="Type here"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            name="description"
            onChange={onChangeHandler}
            value={data.description}
            type="text"
            rows={6}
            placeholder="Write content here"
            required
          />
        </div>

        <div className="add-price flex-col">
          <p>Product Price</p>
          <input
            type="Number"
            name="price"
            onChange={onChangeHandler}
            value={data.price}
            placeholder="₹25"
          />
        </div>
        <div className="add-price flex-col">
          <p>Discount</p>
          <input
            type="Number"
            name="discount"
            onChange={onChangeHandler}
            value={data.discount}
            placeholder="2%"
          />
        </div>

        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
