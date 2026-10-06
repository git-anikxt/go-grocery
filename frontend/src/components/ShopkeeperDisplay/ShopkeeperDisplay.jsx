import { useContext } from "react";
import "./ShopkeeperDisplay.css";
import Store from "../Store/Store";
import { StoreContext } from "../../Context/StoreContext";

const ShopkeeperDisplay = ({ category }) => {
  const { shopkeeper_list, catalogStatus } = useContext(StoreContext);
  const visibleStores = shopkeeper_list.filter(
    (store) => category === "All" || category === store.category
  );

  return (
    <div className="shopkeeper-display" id="shopkeeper-display">
      <h2>Top stores near you</h2>
      <div className="shopkeeper-display-list">
        {visibleStores.map((store) => (
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
        ))}
      </div>
      {catalogStatus === "loading" && <p>Loading stores...</p>}
      {catalogStatus === "error" && visibleStores.length === 0 && (
        <p>Could not load stores. Please refresh the page to try again.</p>
      )}
      {catalogStatus === "ready" && visibleStores.length === 0 && (
        <p>No stores found in this category.</p>
      )}
    </div>
  );
};

export default ShopkeeperDisplay;
