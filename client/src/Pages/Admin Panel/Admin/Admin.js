import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminPanelNavbar from "../../../components/Admin Panel Navbar/AdminPanelNavbar";
import Authenticator from "../../../components/Authenticator/Authenticator";
import { useDispatch } from "react-redux";
import { setLogOut } from "../../../RTK/slice/userSlice";
import { toast } from "react-toastify";

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const isLogin = JSON.parse(localStorage.getItem("eIsLogin"));
    const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
    if (isLogin === true && isAdmin !== true) {
      toast.error("Unauthorized Access, You are not Admin ");
      dispatch(setLogOut());
      navigate("/login");
    }
  });

  return (
    <>
      <Authenticator />
      <div style={{ marginBottom: "1.5rem" }}>
        <AdminPanelNavbar />
        <Outlet />
      </div>
    </>
  );
};

export default Admin;
