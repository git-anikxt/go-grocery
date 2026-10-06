import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import StoreItem from "../../components/StoreItem/StoreItem";

const SearchResult = () => {
  const { searchResults } = useContext(StoreContext);
  return (
    <div className="item-display" id="item-display">
      <h2>
        {searchResults.length > 0 ? "Search Results." : "No result found."}
      </h2>
      <div className="item-display-list">
        {searchResults.map((item) => {
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

export default SearchResult;
