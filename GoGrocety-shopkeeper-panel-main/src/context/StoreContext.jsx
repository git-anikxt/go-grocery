import { createContext, useState } from "react";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url =
    import.meta.env.VITE_API_URL || "https://gogrocery-backend.onrender.com";

  const [token, setToken] = useState("");
  const [editForm, setEditForm] = useState(null);

  const contextValue = {
    url,
    token,
    setToken,
    editForm,
    setEditForm,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
