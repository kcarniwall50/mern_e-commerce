import React, { useEffect, useState } from "react";
import "./order.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Authenticator from "../../components/Authenticator/Authenticator";
import Loader from "../../components/Layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { SET_LOADING } from "../../RTK/slice/ProductSlice";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.product.loading);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getOrderItems() {
      try {
        dispatch(SET_LOADING(true));
        const response = await axios.get(`${BACKEND_URL}/api/user/get-orders`, {
          withCredentials: true,
        });
        dispatch(SET_LOADING(false));
        setData(response.data);
      } catch (error) {
        dispatch(SET_LOADING(false));
        console.log("errrr", error);
      }
    }
    getOrderItems();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <Authenticator />
      <div className="order-container">
        <h2 style={{ textAlign: "center" }}>My Orders</h2>
        <div>
          {data.length > 0 ? (
            data.map((item, index) => (
              <div className="order-item" key={index}>
                <div className="item-photo">
                  <img src={item?.orderItem?.image} alt="pht" />

                  <span className="product-name">
                    <Link to={`/item/${item?.orderItem?.productId}`}>
                      {item?.orderItem?.name}
                    </Link>

                    {item?.isDelivered ? (
                      <p>Order Delivered</p>
                    ) : (
                      <p>Order Placed</p>
                    )}

                    <p className="see-order">
                      <span
                        onClick={() => navigate(`/orderSummary/${item._id}`)}
                      >
                        see order
                      </span>
                    </p>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                marginTop: "2rem",
                fontSize: "1.1rem",
              }}
            >
              You have not ordered anything yet&nbsp;!!
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
