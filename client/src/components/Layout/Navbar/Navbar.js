import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaShopify } from "react-icons/fa";
import { TiUser } from "react-icons/ti";
import { AiOutlineLogout } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectCartQuantity } from "../../../RTK/slice/ProductSlice";
import { selectName } from "../../../RTK/slice/userSlice";

const Navbar = () => {
  console.log("rendered")

  const isLogin = JSON.parse(localStorage.getItem("eIsLogin"));
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const login = useSelector((state) => state.user.login);

  useSelector(selectCartQuantity);
  const num = useSelector((state) => state.product.cartQuantity);
  const cartQuantity = localStorage.getItem("cartQuantity");
  const navigate = useNavigate();

  const [clicked, setClicked] = useState(false);

  const userName = JSON.parse(localStorage.getItem("eLoginUser"));

  const name = useSelector(selectName);

  const myref = useRef();
  const ulRef = useRef();

  const kp = (e) => {
    if (!myref.current?.contains(e.target)) {
      setClicked(false);
    }
    if (ulRef.current?.contains(e.target)) {
      setClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", kp);
  }, []);

  return (
    <div className="navv">
      <ul className="ul">
        <li>
          <Link to="/">
            <FaShopify size="25" color="blue" />
          </Link>
        </li>
        <div className="navbar-left">
          <li className="user-icon">
            {isLogin === true || login ? (
              <>
                {name ? (
                  <span style={{ color: "grey" }}> {name}</span>
                ) : (
                  <span style={{ color: "grey" }}> {userName}</span>
                )}
                <span ref={myref} className="container">
                  <TiUser
                    style={{ cursor: "pointer" }}
                    size="25"
                    color="blue"
                    onClick={() => setClicked((prev) => !prev)}
                  />
                  <ul className={clicked ? "liItems" : "items"} ref={ulRef}>
                    <li
                      className="top"
                      onClick={() => navigate("/userDashboard")}
                    >
                      Dashboard
                    </li>

                    <li onClick={() => navigate("/orders")}>Orders</li>

                    <li onClick={() => navigate("/profile")}>Profile</li>
                    {isAdmin && (
                      <li onClick={() => navigate("/admin")}>Admin</li>
                    )}

                    <li className="bottom" onClick={() => navigate("/logout")}>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        Logout &nbsp;
                        <AiOutlineLogout size="15" color="" />{" "}
                      </span>
                    </li>
                  </ul>
                </span>
              </>
            ) : (
              <div
                style={{ display: "flex", gap: "2rem", alignItems: "center" }}
              >
                <Link className="navbar-login" to="/login">
                  Login
                </Link>

                <Link className="navbar-login" to="/signUp">
                  SignUp
                </Link>
              </div>
            )}
          </li>
          {(isLogin === true || login) && (
            <li className="navbar-cart">
              <Link to="/cart" className="link-cart">
                <BsCart4 className="cart" size="21" color="green" />
              </Link>

              <span>&nbsp;{ cartQuantity || num}</span>
            </li>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
