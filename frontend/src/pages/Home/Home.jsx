import React, { useState } from "react";
import Header from "../../components/Header/Header";
import ExploreStore from "../../components/ExploreStore/ExploreStore";
import ShopkeeperDisplay from "../../components/ShopkeeperDisplay/ShopkeeperDisplay";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <>
      <Header />
      <ExploreStore setCategory={setCategory} category={category} />
      <ShopkeeperDisplay category={category} />
    </>
  );
};

export default Home;
