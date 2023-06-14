import React, { useState } from "react";
import "./addNewProduct.css";
import { toast } from "react-toastify";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AddNewProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    countInStock: "",
    image: "",
    description: "",
  });
  const { name, category, price, countInStock, image, description } = form;

  const inputeChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !category ||
      !price ||
      !countInStock ||
      !image ||
      !description
    ) {
      return toast.error("Fields cant be empty");
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/addProduct`, form, {
        withCredentials: true,
      });
      if (response.status === 201) {
        return toast.success("Product added successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="addNewProduct-container">
        <h3 style={{ marginTop: "0.4rem", textAlign: "center" }}>
          Add New Product
        </h3>
        <form className="addNewProduct-form" onSubmit={formSubmit}>
          <div className="form-div">
            <div style={{ textAlign: "" }}>
              <label>Name</label>
            </div>
            <input
              type="text"
              placeholder="product name"
              name="name"
              value={name}
              onChange={inputeChangeHandler}
            />
          </div>

          <div>
            <div style={{}}>
              <label>Category</label>
            </div>
            <select
              style={{ backgroundColor: "rgb(240, 234, 234)" }}
              placeholder="product category"
              name="category"
              value={category}
              onChange={inputeChangeHandler}
            >
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="mobiles">Mobiles</option>
              <option value="games">Games</option>
            </select>
          </div>

          <div>
            <div style={{}}>
              <label>Price</label>
            </div>
            <input
              type="number"
              placeholder="product price in INR"
              name="price"
              value={price}
              onChange={inputeChangeHandler}
            />
          </div>

          <div>
            <div style={{}}>
              <label>Count In Stock</label>
            </div>
            <input
              type="number"
              placeholder="count in stock"
              name="countInStock"
              value={countInStock}
              onChange={inputeChangeHandler}
            />
          </div>

          <div>
            <div style={{}}>
              <label>Image URL</label>
            </div>
            <input
              type="text"
              placeholder="product image url"
              name="image"
              value={image}
              onChange={inputeChangeHandler}
            />
          </div>

          <div>
            <div style={{}}>
              <label>Description</label>
            </div>
            <textarea
              placeholder="product description"
              name="description"
              value={description}
              onChange={inputeChangeHandler}
            ></textarea>
          </div>

          <div>
            <input
              style={{ cursor: "pointer" }}
              type="submit"
              value="Add Product"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewProduct;
