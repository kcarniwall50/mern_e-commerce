import React, { useEffect, useState } from "react";
import "./editProduct.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EditProduct = () => {
  const { id } = useParams();

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

  const [product, setProduct] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/get-product/${id}`,
          { withCredentials: true }
        );
        setProduct(response.data.product);
        setForm(response.data.product);
      } catch (error) {
        console.log("errrr", error);
      }
    }
    fetch();
  }, []);

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
      const response = await axios.patch(
        `${BACKEND_URL}/api/product/editProduct/${id}`,
        form,
        { withCredentials: true }
      );
      if (response.status === 201) {
        return toast.success("Product updated successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="editProduct-container">
        <h3 style={{ marginTop: "0.4rem", textAlign: "center" }}>
          Edit Product
        </h3>
        <form className="editProduct-form" onSubmit={formSubmit}>
          <div className="form-div">
            <div style={{ textAlign: "" }}>
              <label>Name</label>
            </div>
            <input
              type="text"
              defaultValue={product?.name}
              placeholder="product name"
              name="name"
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
              onChange={inputeChangeHandler}
            >
              <option value={product?.category} selected="selected">
                {product?.category}
              </option>
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
              defaultValue={product?.price}
              type="number"
              placeholder="product price in INR"
              name="price"
              onChange={inputeChangeHandler}
            />
          </div>

          <div>
            <div style={{}}>
              <label>Count In Stock</label>
            </div>
            <input
              defaultValue={product?.countInStock}
              type="number"
              placeholder="count in stock"
              name="countInStock"
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
              defaultValue={product?.image}
              onChange={inputeChangeHandler}
            />
          </div>

          <div>
            <div style={{}}>
              <label>Description</label>
            </div>
            <textarea
              rows={15}
              cols={10}
              placeholder="product description"
              name="description"
              defaultValue={product?.description}
              onChange={inputeChangeHandler}
            ></textarea>
          </div>

          <div>
            <input
              style={{ cursor: "pointer" }}
              type="submit"
              value="Update Product"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
