import React, { useContext, useEffect, useState } from "react";
import "./ItemDisplay.css";
import StoreItem from "../StoreItem/StoreItem";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";

const ItemDisplay = ({ id }) => {
  const { url } = useContext(StoreContext);

  const [storeItems, setStoreItems] = useState([]);

  const fetchStoreItems = async () => {
    const response = await axios.get(`${url}/api/store/storeItem/${id}`);
    if (response.data.success) {
      setStoreItems(response.data.items);
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchStoreItems();
  }, []);
  return (
    <div className="item-display" id="item-display">
      <h2>Top items of the store.</h2>
      <hr />
      <div className="item-display-list">
        {storeItems.map((item) => {
          return (
            <StoreItem
              key={item._id}
              image={item.image}
              name={item.name}
              desc={item.description}
              price={item.price}
              id={item._id}
              discount={item.discount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ItemDisplay;
