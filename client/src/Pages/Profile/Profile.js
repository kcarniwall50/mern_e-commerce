import React, { useEffect, useState } from "react";
import "./profile.css";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import loader from "../../assets/giphy.gif";
import { selectLoading } from "../../RTK/slice/ProductSlice";
import { setName } from "../../RTK/slice/userSlice";
import Authenticator from "../../components/Authenticator/Authenticator";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const [changePass, setChangePass] = useState(false);

  const [user, setUser] = useState(null);
  const [updateUser, setUpdateUser] = useState({
    name: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const { oldPassword, newPassword, confirmNewPassword } = updateUser;

  // get-user
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/get-user/`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.log("errrr", error, "...");
      }
    };
    getUser();
  }, []);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (oldPassword !== "" || newPassword !== "" || confirmNewPassword !== "") {
      if (oldPassword === "") {
        return toast.error("Please enter old password");
      }
      if (newPassword === "") {
        return toast.error("Please enter new password");
      }
      if (confirmNewPassword === "") {
        return toast.error("Please enter confirm password");
      }
      if (newPassword !== confirmNewPassword) {
        return toast.error("Passwords did not match!");
      }
    }
    if (updateUser.name === "" && oldPassword === "") {
      return toast.error("Please update first!");
    }

    if (oldPassword !== "" && newPassword === oldPassword) {
      return toast.error("Old and New passwords are same!");
    }

    // server call
    const formData = {
      userName: updateUser.name,
      oldPassword,
      newPassword,
    };

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(setName(response.data));

        return toast.success("Name changed successfully");
      }

      //if only password changed
      if (response.status === 201) {
        return toast.success(response.data);
      }

      //if name and password both changed
      if (response.status === 202) {
        // localStorage.setItem("eLoginUser", JSON.stringify(response.data));
        dispatch(setName(response.data));
        return toast.success("Name and Password changed successfully");
      }

      // after updating first time, try again and again to update same
      if (response.status === 204) {
        toast.error("Entered name is same as previous name");
        return window.location.reload();
      }
    } catch (e) {
      console.log(e);

      // old password is not correct
      if (e.response.status === 401) {
        return toast.error(e.response.data);
      }

      // malacious token , unauthorised access
      if (e.response.status === 404) {
        return toast.error(e.response.data);
      }
    }
  };

  return (
    <>
      <Authenticator />
      {loading && (
        <div className="profile-img">
          <img src={loader} alt="imge"  />
        </div>
      )}
      <div className="profile-container">
        <CgProfile className="profile-icon" size="30" color="blue" />
        <h2 style={{ textAlign: "center" }}>Update Profile</h2>
        <hr />
        <form onSubmit={formSubmit} className="profile-form">
          <div className="form-input-container">
            <label>Name</label>
            <input
              type="text"
              defaultValue={user?.name}
              onChange={inputChangeHandler}
              name="name"
            />
          </div>

          <div className="form-input-container">
            <label>Email</label>
            <input type="email" defaultValue={user?.email} disabled />
            <br />
            <code style={{ color: "lightgrey" }}>
              <small>Email can't be changed</small>
            </code>
          </div>

          <p
            onClick={() => setChangePass(!changePass)}
            style={{ color: "blue", cursor: "pointer" }}
          >
            {" "}
            Change Password{" "}
          </p>

          {changePass && (
            <>
              <div className="form-input-container">
                <label>Old Password</label>
                <input
                  type="password"
                  onChange={inputChangeHandler}
                  name="oldPassword"
                  value={oldPassword}
                />
              </div>

              <div className="form-input-container">
                <label>New Password</label>
                <input
                  type="password"
                  onChange={inputChangeHandler}
                  name="newPassword"
                  value={newPassword}
                />
              </div>

              <div className="form-input-container">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  onChange={inputChangeHandler}
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                />
              </div>
            </>
          )}

          <input
            type="submit"
            value="Update"
            className="profile-button"
          ></input>
        </form>
      </div>
    </>
  );
};

export default Profile;
