import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import "./EditForm.css";
import axios from "axios";
import { toast } from "react-toastify";

const EditForm = ({ item, fetchList }) => {
  const { setEditForm, url, token } = useContext(StoreContext);
  const [data, setData] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    discount: item.discount ? item.discount : 0,
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onEditItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("discount", Number(data.discount));

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(
        `${url}/api/item/updateItem/${item._id}`,
        formData,
        {
          headers: {
            token: `${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setImage(null);
        setEditForm(false);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  return (
    <div className="edit-popup">
      <form onSubmit={onEditItem} className="edit-popup-container">
        <div className="edit-popup-title">
          <h2>Edit Item</h2>
          <img
            onClick={() => !isSubmitting && setEditForm(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="edit-popup-inputs">
          <div className="add-img-upload flex-col">
            <p>Upload image</p>
            <label htmlFor="image">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : `${url}/images/${item.image}`
                }
                alt="Upload"
              />
            </label>
            <input
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              type="file"
              id="image"
              hidden
            />
          </div>
          <div className="add-product-name flex-col">
            <p>Product name</p>
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Type here"
              required
            />
          </div>
          <div className="add-product-description flex-col">
            <p>Product description</p>
            <textarea
              name="description"
              onChange={onChangeHandler}
              value={data.description}
              rows={6}
              placeholder="Write content here"
              required
            />
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="number"
              name="price"
              onChange={onChangeHandler}
              value={data.price}
              placeholder="₹25"
            />
          </div>
          <div className="add-price flex-col">
            <p>Discount</p>
            <input
              type="number"
              name="discount"
              onChange={onChangeHandler}
              value={data.discount}
              placeholder="2%"
            />
          </div>
        </div>
        <button type="submit" className="add-btn" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "UPDATE"}
        </button>
      </form>
    </div>
  );
};

export default EditForm;
