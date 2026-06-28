import React, { useEffect, useState, useContext } from "react";
import "./List.css";
import "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import EditForm from "../../components/EditForm/EditForm";

const List = () => {
  const navigate = useNavigate();

  const { url, token, setToken, editForm, setEditForm } =
    useContext(StoreContext);

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/shopkeeper/list`, {
      headers: {
        token: `${token}`,
      },
    });
    if (response.data.success) {
      setList(response.data.items);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/shopkeeper/remove`, {
      id: foodId,
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  const handleEditClick = (item) => {
    setEditForm(item);
  };

  useEffect(() => {
    if (!localStorage.getItem("shopkeepertoken")) {
      navigate("/");
    } else {
      setToken(localStorage.getItem("shopkeepertoken"));
    }
    fetchList();
  }, []);

  return (
    <>
      <div className="list add flex-col">
        <p>All Foods List</p>
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Edit</b>
            <b>Remove</b>
          </div>
          {list.map((item, index) => {
            return (
              <div key={index} className="list-table-format">
                {editForm && editForm._id === item._id && (
                  <EditForm fetchList={fetchList} item={item} />
                )}
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₹{item.price}</p>
                <p className="cursor" onClick={() => handleEditClick(item)}>
                  <img
                    className="edit"
                    width="10px"
                    src={assets.edit_icon}
                    alt=""
                  />
                </p>
                <p className="cursor" onClick={() => removeFood(item._id)}>
                  x
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default List;
