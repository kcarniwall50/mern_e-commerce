import React, { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./resetPassword.css";
import { asyncResetPassword } from "../../RTK/slice/userSlice";
import { AiOutlineArrowLeft } from "react-icons/ai";

const ResetPassword = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });
  const { password, password2 } = formData;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { resetToken } = useParams();

  const FormSubmit = async (e) => {
    e.preventDefault();

    if (!password || !password2) {
      return toast.error("Fields cant be empty");
    }

    if (password !== password2) {
      return toast.error("passwords did not match");
    }

    await dispatch(asyncResetPassword({ password, resetToken }));
  };

  return (
    <div className="resetPassword-container">
      <RiLockPasswordLine
        size="25"
        color="blue"
        style={{ marginTop: "1rem" }}
      />
      <h3 style={{ margin: "0.2rem 0rem 0.8rem 0" }}>Create New Password</h3>
      <form onSubmit={FormSubmit}>
        <div className="reset-input">
          <input
            type="password"
            placeholder="create new password "
            name="password"
            value={password}
            onChange={inputChangeHandler}
          />
        </div>

        <div className="reset-input">
          <input
            type="password"
            placeholder="confirm password "
            name="password2"
            value={password2}
            onChange={inputChangeHandler}
          />
        </div>

        <div className="reset-sub">
          <input type="submit" value="Save Password" />
        </div>
      </form>
      <div style={{ display: "block", marginBottom: "1.5rem" }}>
        <div>
          <Link
            style={{
              textDecoration: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            to="/"
          >
            {" "}
            &nbsp;
            <AiOutlineArrowLeft size="10" /> <code>Home</code>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
