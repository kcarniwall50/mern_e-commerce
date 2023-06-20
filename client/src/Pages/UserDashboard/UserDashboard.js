import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "./userDashboard.css";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import { SET_CartQuantity, SET_LOADING } from "../../RTK/slice/ProductSlice";
import loader from "../../assets/giphy.gif";
import Filter from "./Filter/Filter";
import Authenticator from "../../components/Authenticator/Authenticator";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserDashboard = () => {
  console.log("rendered")
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.product.loading);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        dispatch(SET_LOADING(true));
        const res = await axios.get(`${BACKEND_URL}/api/get-products`, {
          withCredentials: true,
        });
        dispatch(SET_LOADING(false));
        dispatch(SET_CartQuantity(res.data.userCartQuantity));
        setProductData(res.data.products);
      } catch (error) {
        dispatch(SET_LOADING(false));
        console.log("errrr", error);
      }
    }
    fetch();
  }, []);

  return (
    <>
      <Authenticator />
      <Filter setProductData={setProductData} />
      <div className="home-container">
        {loading && (
          <div className="dash-img">
            <img src={loader} alt="imge"  />
          </div>
        )}
        {productData?.map((item, index) => {
          return (
            <div className="home-item" key={index}>
              <div className="product-img">
                <Link to={`/item/${item._id}`}>
                  <img className="home-img" src={item.image} alt="item" />
                </Link>
              </div>

              <div className="item-description">
                <p className="item-points">
                  <a href={`/item/${item._id}`}>
                    {`${(item?.name).slice(0, 25)}`}
                  </a>
                </p>

                <Rating
                  style={{ color: "orange" }}
                  initialRating={item.rating}
                  emptySymbol="fa fa-star-o fa-1x star"
                  fullSymbol="fa fa-star fa-1x star"
                  readonly={true}
                  fractions={2}
                />

                <p className="item-points">Price: ₹{item?.price.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserDashboard;
