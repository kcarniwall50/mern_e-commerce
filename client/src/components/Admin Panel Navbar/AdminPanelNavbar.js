import React from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "./adminPanelNavbar.css";

const AdminPanelNavbar = () => {
  return (
    <>
      <MdAdminPanelSettings
        color="blue"
        size="40"
        style={{ marginTop: "1rem", display: "block", marginInline: "auto" }}
      />
      <h2 style={{ textAlign: "center", margin: "0.5rem 0", color: "grey" }}>
        Admin Panel
      </h2>
      <div className="adminPanelNavbar-container">
        <ul>
          <li>
            <NavLink
              style={({ isActive }) => ({
                color: isActive ? "blue" : "",
              })}
              to="userList"
            >
              UserList
            </NavLink>
          </li>
          <li>
            <NavLink
              style={({ isActive }) => ({
                color: isActive ? "blue" : "",
              })}
              to="productList"
            >
              ProductList
            </NavLink>
          </li>
          <li>
            <NavLink
              style={({ isActive }) => ({
                color: isActive ? "blue" : "",
              })}
              to="addNewProduct"
            >
              Add New Product
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminPanelNavbar;
