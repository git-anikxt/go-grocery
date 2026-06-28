import React, { useState } from "react";
import Header from "../../components/Header/Header";
import ExploreStore from "../../components/ExploreStore/ExploreStore";
import ShopkeeperDisplay from "../../components/ShopkeeperDisplay/ShopkeeperDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <>
      <Header />
      <ExploreStore setCategory={setCategory} category={category} />
      <ShopkeeperDisplay category={category} />
      <AppDownload />
    </>
  );
};

export default Home;
