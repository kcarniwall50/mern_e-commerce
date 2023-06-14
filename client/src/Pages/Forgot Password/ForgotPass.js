import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./forgotPass.css";
import { asyncForgotPass } from "../../RTK/slice/userSlice";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

const ForgotPass = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
  });
  const { email } = formData;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const FormSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Field cant be empty");
    }

    await dispatch(asyncForgotPass(formData));
  };

  return (
    <div className="forgotPass-container">
      <RiLockPasswordLine
        size="30"
        color="blue"
        style={{ marginTop: "1rem" }}
      />
      <h3>Forgot Password</h3>
      <form onSubmit={FormSubmit}>
        <div className="forgot-input">
          <input
            type="email"
            placeholder="enter email"
            name="email"
            value={email}
            onChange={inputChangeHandler}
          />
        </div>

        <div className="forgot-sub">
          <input type="submit" value="Reset Password" />
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

export default ForgotPass;
