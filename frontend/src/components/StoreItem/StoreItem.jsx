import React, { useContext, useState } from "react";
import "./StoreItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

const StoreItem = ({ image, name, price, desc, id, discount }) => {
  const [itemCount, setItemCount] = useState(0);
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  return (
    <div className="store-item">
      <div className="store-item-img-container">
        <img
          className="store-item-image"
          src={url + "/images/" + image}
          alt=""
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="store-item-counter">
            <img
              src={assets.remove_icon_red}
              onClick={() => removeFromCart(id)}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              onClick={() => addToCart(id)}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="store-item-info">
        <div className="store-item-name-rating">
          <p>{name}</p> <img src={assets.rating_starts} alt="" />
        </div>
        <p className="store-item-desc">{desc}</p>
        <p className="store-item-price">
          ₹{(price * ((100 - discount) / 100)).toFixed(2)}
        </p>
        <p className="store-item-price-before-discount">₹{price}</p>
        <span className="discount-value">Discount: {discount}%</span>
      </div>
    </div>
  );
};

export default StoreItem;
