import React, { useContext } from "react";
import "./ExploreStore.css";
import { StoreContext } from "../../Context/StoreContext";

const ExploreStore = ({ category, setCategory }) => {
  const { stores_types } = useContext(StoreContext);

  return (
    <div className="explore-store" id="explore-store">
      <h1>Explore stores by category</h1>
      <p className="explore-store-text">
        Explore a vast selection of quality products at our grocery store. Our
        mission is to meet your needs and enhance your shopping experience, one
        fresh item at a time.
      </p>
      <div className="explore-store-list">
        {stores_types.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-store-list-item"
            >
              <img
                src={item.menu_image}
                className={category === item.menu_name ? "active" : ""}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreStore;
