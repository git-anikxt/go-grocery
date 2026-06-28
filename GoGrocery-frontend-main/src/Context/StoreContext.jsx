import { createContext, useEffect, useState } from "react";
import { stores_types } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // const url = "http://localhost:4000";
  const url = "https://gogrocery-backend.onrender.com";
  const [itemList, setItemList] = useState([]);
  const [shopkeeper_list, setShopkeeperList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    postalCode: null,
    error: null,
  });

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = itemList.find((product) => product._id === item);
        totalAmount +=
          ((itemInfo.price * (100 - itemInfo.discount)) / 100).toFixed(2) *
          cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchItemsList = async () => {
    const response = await axios.get(url + "/api/item/getAllItems");
    setItemList(response.data.items);
  };
  const fetchShopkeeperList = async () => {
    const response = await axios.post(url + "/api/shopkeeper/shopkeeperList", {
      postalCode: "201301",
    });
    setShopkeeperList(response.data.shopkeepers);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: token }
    );
    setCartItems(response.data.cartData);
  };

  const showUserLatLng = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ ...location, lat, lng, error: null });
        const postalCode = await getPostalCode(lat, lng);
        setLocation({ ...location, lat, lng, postalCode });
      },
      (error) => {
        setLocation({ ...location, error: error.message });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const getPostalCode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const postalCode = data.address ? data.address.postcode : null;
      return postalCode;
    } catch (error) {
      console.error("Error fetching postal code:", error);
      return null;
    }
  };

  useEffect(() => {
    async function loadData() {
      showUserLatLng();
      await fetchShopkeeperList();
      await fetchItemsList();
      if (localStorage.getItem("gogrocerytoken")) {
        setToken(localStorage.getItem("gogrocerytoken"));
        await loadCartData({ token: localStorage.getItem("gogrocerytoken") });
      }
    }
    loadData();
  }, []);

  const contextValue = {
    url,
    shopkeeper_list,
    stores_types,
    cartItems,
    itemList,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    searchResults,
    setSearchResults,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
