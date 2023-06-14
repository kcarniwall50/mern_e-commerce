import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  SET_LOADING,
  asyncDeleteCart,
  asyncUpdateQuantity,
} from "../../RTK/slice/ProductSlice";
import "./cart.css";
import { BiMinus, BiPlus } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Loader from "../../components/Layout/Loader/Loader";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Authenticator from "../../components/Authenticator/Authenticator";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Cart = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isError = useSelector((state) => state.product.error);

  const [cartProducts, setCartProducts] = useState([]);

  let price = 0;

  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    async function getCartItems() {
      try {
        dispatch(SET_LOADING(true));
        const response = await axios.get(`${BACKEND_URL}/api/getCart`, {
          withCredentials: true,
        });
        dispatch(SET_LOADING(false));
        setCartProducts(response.data.cartProducts);
      } catch (error) {
        dispatch(SET_LOADING(false));
        console.log("errrr", error);
      }
    }
    getCartItems();
  }, []);

  const deleteItem = async (index) => {
    await dispatch(asyncDeleteCart(index));

    if (!isError) {
      const newArr = [...cartProducts];
      newArr.splice(index, 1);
      setCartProducts(newArr);
    }
  };

  const confirmDelete = (index) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => deleteItem(index),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const increase = async (item, quantity, index) => {
    if (quantity < 1) {
      return toast.error("Quantity must be atleast one");
    }

    const itemData = {
      id: item._id,
      quantity,
    };
    dispatch(asyncUpdateQuantity(itemData));

    if (!isError) {
      const newArr = [...cartProducts];
      newArr[index].quantity = quantity;

      setCartProducts(newArr);
    }
  };

  const decrease = async (item, quantity, index) => {
    if (quantity < 1) {
      return toast.error("Quantity must be atleast one");
    }

    const itemData = {
      id: item._id,
      quantity,
    };
    dispatch(asyncUpdateQuantity(itemData));

    if (!isError) {
      const newArr = [...cartProducts];
      newArr[index].quantity = quantity;

      setCartProducts(newArr);
    }
  };


  const [width, setWidth] = useState();

  useEffect(() => {
    var screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    setWidth(screenWidth);
  }, []);

  return (
    <>
      <Authenticator />
      {loading && <Loader />}

      <div className="cart-container">
        <h2>My Cart</h2>
        {cartProducts.length >= 1 ? (
          <div style={{ margin: "2rem" }}>
            {width > 600 && (
              <div className="cart-details ">
                <b>Name</b>
                <b>Price</b>
                <b>Quantity</b>
                <b>Total</b>
                <b>Delete</b>
              </div>
            )}

            {cartProducts.length > 0 &&
              cartProducts.map((item, index) => (
                <Fragment key={index}>
                  {width <= 600 ? (
                    <div
                      className={
                        index % 2 !== 0 ? "cart-details ind" : "cart-details ab"
                      }
                      style={{ margin: "0.8rem 0" }}
                    >
                      <span>
                        {" "}
                        <span>Name: &nbsp;</span>
                        <Link to={`/item/${item.product?._id}`}>
                          {`${(item.product?.name).slice(0, 40)}`}
                        </Link>
                      </span>
                      <p>
                        {" "}
                        <span>Price: &nbsp; </span>₹
                        {(item?.product?.price).toLocaleString()}
                      </p>

                      <p className="cartEdit">
                        <span> Quantity: &nbsp;</span>

                        <BiMinus
                          size={10}
                          color="grey"
                          className="cart-icon"
                          onClick={() =>
                            decrease(
                              item.product,
                              Number(item.quantity) - 1,
                              index
                            )
                          }
                        />
                        <span
                          style={{ marginInline: "0.5rem", fontWeight: "500" }}
                        >
                          {item?.quantity}
                        </span>
                        <BiPlus
                          size={10}
                          color="grey"
                          className="cart-icon"
                          onClick={() =>
                            increase(
                              item.product,
                              Number(item.quantity) + 1,
                              index
                            )
                          }
                        />
                      </p>

                      <p>
                        {" "}
                        <span>Total: &nbsp; </span> ₹
                        {(item.product?.price * item.quantity).toLocaleString()}
                      </p>

                      <p>
                        {" "}
                        <span>Delete: &nbsp;</span>
                        <MdDelete
                          color="red"
                          style={{ cursor: "pointer" }}
                          onClick={() => confirmDelete(index)}
                        />
                      </p>
                    </div>
                  ) : (
                    <div
                      className={
                        index % 2 !== 0 ? "cart-details ind" : "cart-details ab"
                      }
                      style={{ margin: "0.8rem 0" }}
                    >
                      <span>
                        <Link to={`/item/${item.product?._id}`}>
                          {`${(item.product?.name).slice(0, 40)}`}
                        </Link>
                      </span>
                      <p>₹{item?.product?.price.toLocaleString()}</p>

                      <p className="cartEdit">
                        <BiMinus
                          size={10}
                          color="grey"
                          className="cart-icon"
                          onClick={() =>
                            decrease(
                              item.product,
                              Number(item.quantity) - 1,
                              index
                            )
                          }
                        />

                        <span
                          style={{ marginInline: "0.5rem", fontWeight: "500" }}
                        >
                          {item?.quantity}
                        </span>

                        <BiPlus
                          size={10}
                          color="grey"
                          className="cart-icon"
                          onClick={() =>
                            increase(
                              item.product,
                              Number(item.quantity) + 1,
                              index
                            )
                          }
                        />
                      </p>

                      <p>₹{(item?.product?.price).toLocaleString()}</p>

                      <p>
                        <MdDelete
                          color="red"
                          style={{ cursor: "pointer" }}
                          onClick={() => confirmDelete(index)}
                        />
                      </p>
                    </div>
                  )}
                  <small style={{ display: "none" }}>
                    {(price += item.product?.price * item.quantity)}
                  </small>
                </Fragment>
              ))}

            {cartProducts.length >= 1 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "1rem  0" }}>
                  <b>Total Price:</b> &nbsp;{" "}
                  <span>₹{price.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => navigate("/placeOrder")}
                  style={{
                    backgroundColor: "black",
                    padding: "0.4rem 2rem",
                    borderRadius: "4px",
                    margin: "0.6rem 0rem",
                    cursor: "pointer",
                  }}
                >
                  <b style={{ color: "white" }}>Place Order</b>
                </button>
              </div>
            )}
          </div>
        ) : (
          <p style={{ textAlign: "center", margin: "2rem 0" }}>
            You have not added any item in your cart
          </p>
        )}
      </div>
    </>
  );
};

export default Cart;
