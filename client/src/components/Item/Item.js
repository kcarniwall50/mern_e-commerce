import React, { useEffect, useState } from "react";
import "./item.css";
import axios from "axios";
import loader from "../../assets/giphy.gif";
import { useParams } from "react-router-dom";
import Rating from "react-rating";
import { useDispatch, useSelector } from "react-redux";
import { asyncSaveCart, SET_LOADING } from "../../RTK/slice/ProductSlice";
import { toast } from "react-toastify";
import Authenticator from "../Authenticator/Authenticator";

const Item = () => {

  console.log("rendered")
  const dispatch = useDispatch();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const loading = useSelector((state) => state.product.loading);

  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function fetch() {
      try {
        dispatch(SET_LOADING(true));
        const response = await axios.get(
          `${BACKEND_URL}/api/get-product/${id}`,
          { withCredentials: true }
        );
        dispatch(SET_LOADING(false));
        setProduct(response.data.product);

        // get user comment

        const reviews = response.data.product.reviews;
        const userId = response.data.userId;

        for (let i = 0; i < reviews.length; i++) {
          if (String(reviews[i].userId) === String(userId)) {
            setUserReview({
              comment: reviews[i].comment,
              rating: reviews[i].rating,
            });
            break;
          }
        }
      } catch (error) {
        dispatch(SET_LOADING(false));
        console.log("errrr", error);
      }
    }
    fetch();
  }, []);

  const addToCart = () => {
    const cartData = {
      item: product,
      quantity: JSON.parse(quantity),
    };
    dispatch(asyncSaveCart(cartData));
  };

  const submitReview = async () => {
    const reviewData = {
      productId: id,
      rating,
      comment,
    };

    // submit review
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/review`,
        reviewData,
        { withCredentials: true }
      );
      toast.success(response.data);

      setUserReview({
        comment,
        rating,
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <Authenticator />
      {loading && (
        <div className="dash-img">
          <img src={loader}  alt="imge" />
        </div>
      )}
      <div className="full-item">
        <div className="full-item-left">
          <p className="item-name">
            <span> {product?.name}</span>
          </p>
          <div className="item-img-container">
            <img className="item-img" src={product?.image} alt="item" />
          </div>

          <div>
            <Rating
              style={{ color: "orange" }}
              initialRating={product?.rating}
              emptySymbol="fa fa-star-o fa-1x star"
              fullSymbol="fa fa-star fa-1x star"
              readonly={true}
              fractions={2}
            />
            <p className="item-points">Price: ₹{product?.price?.toLocaleString()}</p>
            <div className="item-points">
              Description:<p className="item-des"> {product?.description}</p>
            </div>
          </div>
        </div>
        <div className="full-item-right">
          <div className="full-item-right-1">
            <h4>Price: &nbsp; ₹{product?.price?.toLocaleString()}</h4>

            <hr style={{ width: "100%", color: "#66646B" }} />
            <br />
            <b>Select Quantity</b>
            <br />
            <select
              style={{ border: "1px solid grey" }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              {[...Array(product.countInStock).keys()].map((x, i) => {
                return (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                );
              })}
            </select>

            <br />
            <button
              style={{
                cursor: "pointer",
                background: "black",
                color: "white",
                padding: "0.4rem",
                borderRadius: "3px",
                marginTop: "1rem",
              }}
              onClick={addToCart}
            >
              Add to Cart
            </button>
          </div>
          <div className="full-item-right-1 ">
            <h4>Give Your Review</h4>
            <hr style={{ width: "100%", color: "#66646B" }} />

            <span>Rating: &nbsp;</span>
            <Rating
              style={{ color: "orange", marginTop: "1rem" }}
              initialRating={userReview?.rating || rating}
              emptySymbol="fa fa-star-o fa-1x star"
              fullSymbol="fa fa-star fa-1x star"
              readonly={false}
              fractions={2}
              onChange={(e) => setRating(e)}
            />
            <br />
            <textarea
              className="item-textarea"
              placeholder="Write about product..."
              defaultValue={userReview?.comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <br />
            <button
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "0.4rem",
                borderRadius: "3px",
                cursor: "pointer",
              }}
              onClick={submitReview}
            >
              {userReview?.comment ? (
                <span>Edit Review </span>
              ) : (
                <span>Give Review</span>
              )}
            </button>
          </div>
          <div className="full-item-right-1  ">
            <h3 style={{}}>
              Latest Reviews
              <hr style={{ width: "100%", color: "#66646B" }} />
            </h3>

            <div className="review">
              {product?.reviews?.length > 0 ? (
                product.reviews.map((item, index) => (
                  <div key={index} className="users-review">
                    <p></p>
                    <Rating
                      style={{ color: "orange", margin: "0.5rem 0" }}
                      initialRating={item.rating}
                      emptySymbol="fa fa-star-o fa-1x star"
                      fullSymbol="fa fa-star fa-1x star"
                      readonly={true}
                      fractions={2}
                    />
                    <p>{item.comment}</p>
                    <p style={{ color: "light" }}>
                      <code>
                        <small></small>By {item.name}
                      </code>
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ margin: "1rem 0" }}>
                  No review, You are the first one to review
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
