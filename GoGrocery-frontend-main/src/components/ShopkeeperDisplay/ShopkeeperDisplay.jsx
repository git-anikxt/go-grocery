import React, { useContext } from "react";
import "./ShopkeeperDisplay.css";
import Store from "../Store/Store";
import { StoreContext } from "../../Context/StoreContext";

const ShopkeeperDisplay = ({ category }) => {
  const { shopkeeper_list } = useContext(StoreContext);

  return (
    <div className="shopkeeper-display" id="shopkeeper-display">
      <h2>Top stores near you</h2>
      <div className="shopkeeper-display-list">
        {shopkeeper_list.map((store) => {
          if (category === "All" || category === store.category) {
            return (
              <Store
                key={store._id}
                image={store.image}
                shopName={store.shopName}
                category={store.category}
                shopkeeperName={store.shopkeeperName}
                openTime={store.openTime}
                closeTime={store.closeTime}
                id={store._id}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default ShopkeeperDisplay;
