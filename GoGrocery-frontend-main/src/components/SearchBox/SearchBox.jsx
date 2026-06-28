import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import "./SearchBox.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const { itemList, setSearchResults } = useContext(StoreContext);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (value) => {
    setSearchInput(value);
    const results = itemList.filter((item) => {
      return item.name && item.name.toLowerCase().includes(value.toLowerCase());
    });
    setSearchResults(results);
  };

  return (
    <div className="search-box-container">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Type to search ..."
          onChange={(e) => handleChange(e.target.value)}
        />
        <img
          onClick={() => navigate("/search")}
          src={assets.search_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default SearchBox;
