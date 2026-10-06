import { createContext, useCallback, useEffect, useState } from "react";
import { stores_types } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url =
    import.meta.env.VITE_API_URL || "https://gogrocery-backend.onrender.com";
  const [itemList, setItemList] = useState([]);
  const [shopkeeper_list, setShopkeeperList] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState("loading");
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
        if (!itemInfo) {
          continue;
        }
        totalAmount +=
          ((itemInfo.price * (100 - itemInfo.discount)) / 100).toFixed(2) *
          cartItems[item];
      }
    }
    return totalAmount;
  };

  const refreshCatalog = useCallback(async () => {
    try {
      const [storesResponse, itemsResponse] = await Promise.all([
        axios.post(url + "/api/shopkeeper/shopkeeperList", {
          postalCode: "201301",
        }),
        axios.get(url + "/api/item/getAllItems"),
      ]);

      if (!storesResponse.data.success || !itemsResponse.data.success) {
        throw new Error("The catalog API returned an unsuccessful response");
      }

      const items = itemsResponse.data.items;
      const storesById = new Map(
        storesResponse.data.shopkeepers.map((store) => [store._id, store])
      );
      const itemOwnerIds = [
        ...new Set(items.map((item) => item.userId).filter(Boolean)),
      ];
      const missingStoreIds = itemOwnerIds.filter(
        (ownerId) => !storesById.has(ownerId)
      );
      const additionalStores = await Promise.all(
        missingStoreIds.map(async (ownerId) => {
          const response = await axios.get(`${url}/api/store/${ownerId}`);
          if (!response.data.success) {
            throw new Error(
              response.data.message || `Unable to load store ${ownerId}`
            );
          }
          return response.data.shopkeeper;
        })
      );

      additionalStores.forEach((store) => storesById.set(store._id, store));
      setShopkeeperList([...storesById.values()]);
      setItemList(items);
      setCatalogStatus("ready");
    } catch (error) {
      setCatalogStatus("error");
      console.error("Failed to refresh stores and items:", error);
      throw error;
    }
  }, [url]);

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
    let isActive = true;
    const refreshIfActive = () => {
      if (isActive && document.visibilityState === "visible") {
        refreshCatalog().catch(() => {});
      }
    };

    async function loadData() {
      showUserLatLng();
      refreshCatalog().catch(() => {});
      if (localStorage.getItem("gogrocerytoken")) {
        const savedToken = localStorage.getItem("gogrocerytoken");
        setToken(savedToken);
        try {
          await loadCartData({ token: savedToken });
        } catch (error) {
          console.error("Failed to load cart:", error);
        }
      }
    }
    loadData();

    const refreshInterval = window.setInterval(refreshIfActive, 15000);
    window.addEventListener("focus", refreshIfActive);
    document.addEventListener("visibilitychange", refreshIfActive);
    return () => {
      isActive = false;
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshIfActive);
      document.removeEventListener("visibilitychange", refreshIfActive);
    };
  }, [refreshCatalog]);

  const contextValue = {
    url,
    shopkeeper_list,
    catalogStatus,
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
    refreshCatalog,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
