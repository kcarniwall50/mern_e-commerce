import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ShowNavbar = ({ children }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const location = useLocation();
  // only works in Router

  useEffect(() => {
    if (
      location.pathname === "/signUp" ||
      location.pathname === "/login" ||
      location.pathname === "/forgotPass"
    ) {
      setShowNavbar(false);
    }
    if (
      location.pathname === "/" ||
      location.pathname === "/logout" ||
      location.pathname === "/resetPassword" ||
      location.pathname === "/cart" ||
      location.pathname === "/profile" ||
      location.pathname === "/orders" ||
      location.pathname === "/userDashboard" ||
      location.pathname === "/item/63fe04dfde01a546e6fcb84a" ||
      location.pathname === "/placeOrder" ||
      location.pathname === "/orderSummary" ||
      location.pathname === "/admin" ||
      location.pathname === "/admin/userList" ||
      location.pathname === "/admin/productList" ||
      location.pathname === "/admin/addNewProduct" ||
      location.pathname === "/admin/orderList" ||
      location.pathname === "/admin/editProduct"
    ) {
      setShowNavbar(true);
    }
  }, [location]);

  return <div>{showNavbar && children}</div>;
};

export default ShowNavbar;
