import React from "react";
import StoreHeader from "../../components/StoreHeader/StoreHeader";
import { useParams } from "react-router-dom";
import ItemDisplay from "../../components/ItemDisplay/ItemDisplay";

const StoreDetailDisplay = () => {
  const { id } = useParams();

  return (
    <div>
      <StoreHeader id={id} />
      <ItemDisplay id={id} />
    </div>
  );
};

export default StoreDetailDisplay;
