import React, { useContext, useEffect, useState } from "react";
import "./StoreHeader.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const StoreHeader = ({ id }) => {
  const { url } = useContext(StoreContext);

  const [storeInfo, setStoreInfo] = useState({});

  const fetchStoreInfo = async () => {
    const response = await axios.get(`${url}/api/store/${id}`);
    if (response.data.success) {
      setStoreInfo(response.data.shopkeeper);
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    async function loadStoreData() {
      await fetchStoreInfo();
    }
    loadStoreData();
  }, []);
  return (
    <div className="store-header">
      <div className="store-logo-holder">
        <img
          className="store-logo"
          src={url + "/images/" + storeInfo.image}
          alt=""
        />
      </div>
      <div className="store-details">
        <h4>{storeInfo.shopName}</h4>
        <p>
          By <span>{storeInfo.shopkeeperName}</span>
        </p>
        <p>
          <span>Category:</span> {storeInfo.category}
        </p>
        <p>
          <span>Shop Address:</span> {storeInfo.shopAddress}
        </p>
        <p>
          <span>Timing -</span> {storeInfo.openTime} to {storeInfo.closeTime}
        </p>
      </div>
    </div>
  );
};

export default StoreHeader;
