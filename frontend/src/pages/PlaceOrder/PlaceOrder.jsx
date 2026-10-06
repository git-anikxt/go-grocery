import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const { getTotalCartAmount, token, itemList, cartItems, url, setCartItems } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleBackButton = (event) => {
    event.preventDefault();
    alert("Please complete your payment or cancel the payment process.");
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const orderItems = itemList
        .filter((item) => cartItems[item._id] > 0)
        .map((item) => ({ ...item, quantity: cartItems[item._id] }));
      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 50,
      };
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Unable to start payment");
      }
      if (!window.Razorpay) {
        throw new Error("Razorpay checkout did not load. Check your internet connection and retry.");
      }

      const { order } = response.data;
      const key = response.data.key || import.meta.env.VITE_RAZORPAY_API_KEY;
      if (!key) {
        throw new Error("Razorpay is not configured. Set the public key in the frontend environment.");
      }
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "GoGrocery",
        description: "Grocery order",
        image: assets.logo,
        order_id: order.id,
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#3399cc",
        },
        handler: async (paymentResponse) => {
          try {
            const verification = await axios.post(
              url + "/api/order/verify",
              paymentResponse
            );
            if (!verification.data.success) {
              throw new Error(verification.data.message || "Payment verification failed");
            }
            setCartItems({});
            navigate("/myorders");
          } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              await axios.post(url + "/api/order/cancelpayment", {
                orderId: order.id,
              });
            } catch (error) {
              toast.error(error.response?.data?.message || "Could not cancel pending order");
            }
            window.removeEventListener("popstate", handleBackButton);
          },
        },
      };

      window.addEventListener("popstate", handleBackButton);
      new window.Razorpay(options).open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to start payment");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("to place an order sign in first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-field">
          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            placeholder="First name"
            required
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            placeholder="Last name"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          placeholder="Email address"
          required
        />
        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          placeholder="Street"
          required
        />
        <div className="multi-field">
          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            placeholder="State"
            required
          />
        </div>
        <div className="multi-field">
          <input
            type="text"
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            placeholder="Zip code"
            required
          />
          <input
            type="text"
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            placeholder="Country"
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}
              </b>
            </div>
          </div>
        </div>
        <button className="place-order-submit" type="submit">
          Proceed To Payment
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
