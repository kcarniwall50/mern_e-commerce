import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import "./userList.css";
import { SET_LOADING } from "../../../RTK/slice/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import loader from "../../../assets/giphy.gif";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const UserList = () => {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        dispatch(SET_LOADING(true));
        const response = await axios.get(`${BACKEND_URL}/api/getAllUsers`, {
          withCredentials: true,
        });
        dispatch(SET_LOADING(false));
        setUsers(response.data);
      } catch (error) {
        dispatch(SET_LOADING(false));
        console.log("errrr", error, "...");
      }
    };
    getAllUsers();
  }, []);

  const deleteUser = async (id, index) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/user/delete/${id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        let newUsers = [...users];
        newUsers.splice(index, 1);
        setUsers(newUsers);
      }
    } catch (error) {
      console.log("errrr", error, "...");
    }
  };

  const confirmDelete = (id, index) => {
    confirmAlert({
      title: "Delete User",
      message: "Are you sure you want to delete this user.",
      buttons: [
        {
          label: "Delete",
          onClick: () => deleteUser(id, index),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  return (
    <>
      {loading && (
        <div className="dash-img">
          <img src={loader} alt="imge" />
        </div>
      )}

      <div className="userList-container">
        {users ? (
          <>
            <h3>User List</h3>
            <div className="userList-headings1  userList-headings2">
              <p>Index</p>
              <p>User Id</p>
              <p>Name</p>
              <p>Email</p>
              <p>Delete</p>
            </div>
            <hr />
            {users.map((user, index) => (
              <div className="userList-headings1  userList-data" key={index}>
                <p>{index + 1}.</p>
                <p>{user._id}</p>
                <p>{user.name}</p>
                <p>{user.email}</p>
                <p>
                  <MdDelete
                    style={{ cursor: "pointer" }}
                    onClick={() => confirmDelete(user._id, index)}
                    size="20"
                    color="red"
                  />
                </p>
              </div>
            ))}{" "}
          </>
        ) : (
          <p>No user is registered </p>
        )}
      </div>
    </>
  );
};
