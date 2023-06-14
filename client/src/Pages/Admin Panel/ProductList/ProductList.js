import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import "./productList.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_LOADING, selectLoading } from "../../../RTK/slice/ProductSlice";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Loader from "../../../components/Layout/Loader/Loader";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const loading = useSelector(selectLoading);
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        dispatch(SET_LOADING(true));
        const response = await axios.get(`${BACKEND_URL}/api/getAllProducts`, {
          withCredentials: true,
        });
        dispatch(SET_LOADING(false));
        setProducts(response.data);
      } catch (error) {
        dispatch(SET_LOADING(false));
        console.log("errrr", error, "...");
      }
    };
    getAllProducts();
  }, []);

  const deleteProduct = async (id, index) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/product/delete/${id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        let newProducts = [...products];
        newProducts.splice(index, 1);
        setProducts(newProducts);
      }
    } catch (error) {
      console.log("errrr", error, "...");
    }
  };

  const confirmDelete = (id, index) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => deleteProduct(id, index),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const editProduct = (id) => {
    navigate(`/admin/editProduct/${id}`);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="productList-container">
        {products ? (
          <>
            <h3>Product List</h3>
            <div className="productList-headings1  productList-headings2">
              <p> Index</p>
              <p> Id</p>
              <p>Name</p>
              <p>Price</p>
              <p>Stock</p>
              <p>Action</p>
            </div>
            <hr />
            {products.map((item, index) => (
              <div
                className="productList-headings1  productList-data"
                key={index}
              >
                <p>{index + 1}.</p>
                <p>
                  {" "}
                  <Link to={`/item/${item._id}`}>{item._id}</Link>
                </p>
                <p>
                  {" "}
                  <Link to={`/item/${item._id}`}>{item.name.slice(0, 50)}</Link>
                </p>
                <p>₹{item.price}</p>
                <p>{item.countInStock}</p>
                <p>
                  <BiEdit
                    onClick={() => {
                      editProduct(item._id);
                    }}
                    target="_blank"
                    size="19"
                    color="green"
                    style={{ cursor: "pointer" }}
                  />
                  &nbsp;
                  <MdDelete
                    style={{ cursor: "pointer" }}
                    onClick={() => confirmDelete(item._id, index)}
                    size="20"
                    color="red"
                  />
                </p>
              </div>
            ))}{" "}
          </>
        ) : (
          <p>No product in database </p>
        )}
      </div>
    </>
  );
};

export default ProductList;
