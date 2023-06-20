import React, { useEffect, useState } from "react";
import "./orderSummary.css";
import axios from "axios";
import { Link,useParams } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { TiEquals } from "react-icons/ti";
import Authenticator from "../../components/Authenticator/Authenticator";
import { useDispatch, useSelector } from "react-redux";
import { SET_LOADING } from "../../RTK/slice/ProductSlice";
import loader from "../../assets/giphy.gif";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const OrderSummary = () => {
  console.log("rendered")
  const loading = useSelector((state) => state.product.loading);

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    async function getOrderItem() {
      try {
        dispatch(SET_LOADING(true));
        const response = await axios.get(
          `${BACKEND_URL}/api/user/get-order/${id}`,
          {
            withCredentials: true,
          }
        );
        dispatch(SET_LOADING(false));
        setData(response.data);
      } catch (error) {
        dispatch(SET_LOADING(false));
        console.log("errrr", error);
      }
    }
    getOrderItem();
  }, []);

  return (
    <>
      <Authenticator />
      {loading && (
        <div className="dash-img">
          <img src={loader} alt="imge"  />
        </div>
      )}
      <div className="orderSummary-container">
        <h3>Order Summary</h3>
        <div className="display-view">
          <div className="order-content">
            <div className="order-det-container">
              <h4>Item Details</h4>
              <div className="order-info ">
                <p>
                  Product: &nbsp;{" "}
                  <Link to={`/item/${data?.orderItem?.productId}`}>
                    {" "}
                    {data?.orderItem?.name}
                  </Link>
                </p>
                <p>
                  Quantity: &nbsp;{" "}
                  <span className="cont-clr"> {data?.orderItem?.quantity}</span>{" "}
                </p>
                <p className="display">
                  Price: &nbsp;{" "}
                  <span className="cont-clr">
                    {" "}
                    <p className="display">
                      {" "}
                      ₹{data?.orderItem?.price.toLocaleString()}
                      <RxCross2 size={15} />
                      {data?.orderItem?.quantity} &nbsp;{" "}
                      <TiEquals
                        style={{ fontSize: "" }}
                        size={15}
                        color={"grey"}
                      />{" "}
                      &nbsp; ₹
                      {(data?.orderItem?.price * data?.orderItem?.quantity).toLocaleString()}
                    </p>
                  </span>
                </p>
              </div>
            </div>
            <div className="order-det-container">
              <h4>Sent to</h4>
              <div className=" order-info">
                <p>
                  Name: &nbsp;{" "}
                  <span className="cont-clr"> {data?.sent_to?.name}</span>
                </p>
                <p>
                  Email: &nbsp;{" "}
                  <span className="cont-clr"> {data?.sent_to?.email}</span>
                </p>
                <p>
                  Phone: &nbsp;{" "}
                  <span className="cont-clr">{data?.sent_to?.phone}</span>{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="order-content">
            <div className="order-det-container  ">
              <h4>Order Details</h4>
              <div className="order-info">
                <p>
                  Order ID: &nbsp;
                  <span className="cont-clr">
                    {data?.paymentDetails?.orderId}
                  </span>
                </p>
                <p>
                  Transaction ID: &nbsp;
                  <span className="cont-clr">
                    {data?.paymentDetails?.transactionId}
                  </span>
                </p>
                <p>
                  Total Amount: &nbsp;
                  <span className="cont-clr">
                    ₹{data?.paymentDetails?.orderAmount.toLocaleString()}
                  </span>{" "}
                </p>
                <p>
                  Date: &nbsp; <span className="cont-clr">{data?.time}</span>{" "}
                </p>
                <p>
                  Order Status: &nbsp;
                  {data?.paymentDetails?.isDelivered ? (
                    <span className="cont-clr">Order Delivered</span>
                  ) : (
                    <span className="cont-clr">Order Placed</span>
                  )}
                </p>
              </div>
            </div>
            <div className="order-det-container">
              <h4>Shipping Details</h4>
              <div className=" order-info">
                <p>
                  Street Address: &nbsp;{" "}
                  <span className="cont-clr">
                    {" "}
                    {data?.shippingAddress?.streetAddress}
                  </span>
                </p>
                <p>
                  Town/City: &nbsp;{" "}
                  <span className="cont-clr">
                    {" "}
                    {data?.shippingAddress?.town}
                  </span>
                </p>
                <p>
                  Pincode: &nbsp;{" "}
                  <span className="cont-clr">
                    {data?.shippingAddress?.pincode}
                  </span>{" "}
                </p>
                <p>
                  State: &nbsp;{" "}
                  <span className="cont-clr">
                    {data?.shippingAddress?.state}
                  </span>{" "}
                </p>
                <p>
                  Country: &nbsp;{" "}
                  <span className="cont-clr">
                    {data?.shippingAddress?.country}
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
