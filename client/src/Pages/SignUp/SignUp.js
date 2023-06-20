import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { asyncUserSignUp, selectIsError } from "../../RTK/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "./signUp.css";
import Loader from "../../components/Layout/Loader/Loader";

const SignUp = () => {
  console.log("rendered")
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.user.isLoading);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confiremPassword: "",
  });
  const { name, email, password, confiremPassword } = formData;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isError = useSelector(selectIsError);

  const formSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confiremPassword) {
      return toast.error("Fields cant be empty");
    }

    if (password.length < 6) {
      return toast.error("Password size cant be less than 6");
    }

    if (password !== confiremPassword) {
      return toast.error("Passwords didn't match");
    }

    //  calling api
    dispatch(asyncUserSignUp(formData));
    if (!isError) {
      navigate("/login");
    }
  };

  return (

    <>
    {loading && <Loader />}

    <div className="signUp-container">
      <FaUserPlus size="30" color="blue" className="signUp-user-icon" />
      <h2>Register</h2>
      <form onSubmit={formSubmit} className="signUp-form-container">
        <div className="signUp-inputs-container">
          <input
            className="signup-inputs"
            type="text"
            placeholder="enter name"
            name="name"
            value={name}
            onChange={inputChangeHandler}
            required
          />
        </div>

        <div className="signUp-inputs-container">
          <input
            className="signup-inputs"
            type="email"
            placeholder="enter email"
            name="email"
            value={email}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className="signUp-inputs-container">
          <input
            className="signup-inputs"
            type="password"
            placeholder="enter password"
            name="password"
            value={password}
            onChange={inputChangeHandler}
            required
          />
        </div>

        <div className="signUp-inputs-container">
          <input
            className="signup-inputs"
            type="password"
            placeholder="confirm password"
            name="confiremPassword"
            value={confiremPassword}
            onChange={inputChangeHandler}
            required
          />
        </div>

        <div className="signUp-inputs-container">
          <input className="signup-inputs" type="submit" value="SignUp" />
        </div>
      </form>
      <div style={{ display: "block", marginBottom: "1.5rem" }}>
        <div>
          <code>
            <small>Already have account?</small>
          </code>
          <Link style={{ textDecoration: "none" }} to="/login">
            {" "}
            &nbsp;{" "}
            <code>
              <small>Login</small>
            </code>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignUp;
