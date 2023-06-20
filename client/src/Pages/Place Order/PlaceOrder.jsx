import React, { useEffect, useState } from "react";
import "./placeOrder.css";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { pay } from "../../Payment/payment";
import { toast } from "react-toastify";
import Authenticator from "../../components/Authenticator/Authenticator";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PlaceOrder = () => {
  console.log("rendered")
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    town: "",
    pincode: "",
    state: "",
    country: "",
  });

  const { name, email, phone, streetAddress, town, pincode, state, country } =
    data;

  const [cartProducts, setCartProducts] = useState([]);

  const changeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  let amount=0;

  useEffect(() => {
    async function getCartItems() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/getCart`, {
          withCredentials: true,
        });
        setCartProducts(response.data.cartProducts);
      } catch (error) {
        console.log("errrr", error);
      }
    }
    getCartItems();
  }, []);

  const payment = async () => {
    if (
      !name ||
      !email ||
      !phone ||
      !streetAddress ||
      !town ||
      !pincode ||
      !state ||
      !country
    )
      return toast.error("Please fill all the fields");

    pay({ amount, data, cartProducts });
  };

  return (
    <>
      <Authenticator />
      <div className="placeOrder-container">
        <div className="order-title">
          <h3>Order Details</h3>
        </div>

        <div className="order-details">
          <div className="shipping-details">
            <h4>Shipping Details</h4>
            <hr style={{ marginTop: "-0.9rem" }} />
            <div className="input-container">
              <div className="inputs">
                <label>Name:</label>
                <br />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={changeHandler}
                />
              </div>

              <div className="inputs">
                <label>Email:</label>
                <br />
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={changeHandler}
                />
              </div>

              <div className="inputs">
                <label>Phone:</label>
                <br />
                <input
                  type="number"
                  name="phone"
                  value={phone}
                  onChange={changeHandler}
                />
              </div>

              <div className="inputs">
                <label>Street Address:</label>
                <br />
                <input
                  type="text"
                  name="streetAddress"
                  value={streetAddress}
                  onChange={changeHandler}
                />
              </div>

              <div className="inputs">
                <label>Town/City:</label>
                <br />
                <input
                  type="text"
                  name="town"
                  value={town}
                  onChange={changeHandler}
                />
              </div>

              <div className="inputs">
                <label>PinCode:</label>
                <br />
                <input
                  type="number"
                  name="pincode"
                  value={pincode}
                  onChange={changeHandler}
                />
              </div>

              <div className="inputs">
                <label>State:</label>
                <br />
                <input
                  type="text"
                  name="state"
                  value={state}
                  onChange={changeHandler}
                />
              </div>

              <div className="inputs">
                <label>Country:</label>
                <br />
                <input
                  type="text"
                  name="country"
                  value={country}
                  onChange={changeHandler}
                />
              </div>
            </div>
          </div>

          <div className="order-summary">
            <h4>Order Summary</h4>
            <hr style={{ marginTop: "-0.9rem" }} />
            <div className="">
              {cartProducts.length > 0 &&
                cartProducts.map((item, index) => (
                  <div className="order-product" key={index}>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      {item?.product?.name.slice(0, 20)}... &nbsp;
                      <RxCross2 size={15} /> {item.quantity}{" "}
                    </p>

                    <p>₹{(item?.product?.price * item?.quantity).toLocaleString()}</p>
                    <small style={{ display: "none" }}>
                      {(amount += item.product?.price * item.quantity)}
                    </small>
                  </div>
                ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ margin: "1rem  0" }}>
                <b>Total:</b> &nbsp; <span>₹{amount.toLocaleString()}</span>
              </div>

              <button
                onClick={() => payment()}
                style={{
                  backgroundColor: "black",
                  padding: "0.4rem 2rem",
                  borderRadius: "4px",
                  margin: "0.6rem 0rem",
                  cursor: "pointer",
                }}
              >
                <b style={{ color: "white" }}>Pay</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
