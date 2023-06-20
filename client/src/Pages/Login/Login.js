import axios from "axios";
import React, { useState } from "react";
import { BiLogIn } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./login.css";
import { SET_LOADING, setAdmin, setLogin, setName } from "../../RTK/slice/userSlice";
import Loader from "../../components/Layout/Loader/Loader";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  console.log("rendered")
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const loading = useSelector((state) => state.user.isLoading);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const FormSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Fields cant be empty");
    }

    try {
      dispatch(SET_LOADING(true));
      const response = await axios.post(
        `${BACKEND_URL}/api/user/login`,
        formData,
        { withCredentials: true }
      );
      dispatch(SET_LOADING(false));
      if (response.status === 200) {
        dispatch(setLogin(true));
        dispatch(setName(response.data.name));

        if (response.data.isAdmin === true) {
          dispatch(setAdmin(true));
        } else {
          dispatch(setAdmin(false));
        }

        toast.success("Login Successfully");
        navigate("/userDashboard");
      }
    } catch (error) {
      dispatch(SET_LOADING(false));
      console.log("errrr", error, "...");

      if (error.response.status === 404) {
        toast.error("User is not registered");
      }
      if (error.response.status === 401) {
        toast.error("Email or Password is incorrect");
      }
    }
  };

  return (
    <>
     {loading && <Loader />}
    
    <div className="login-container">
      <BiLogIn size="30" color="blue" style={{ marginTop: "1rem" }} />
      <h2>Login</h2>
      <form onSubmit={FormSubmit}>
        <div className="login-inputs">
          <input
            type="email"
            placeholder="enter email"
            name="email"
            value={email}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className="login-inputs">
          <input
            type="password"
            placeholder="enter password"
            name="password"
            value={password}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className="login-submit">
          <input type="submit" value="Login" />
        </div>
      </form>
      <div style={{ display: "block", marginBottom: "1.5rem" }}>
        <Link style={{ textDecoration: "none" }} to="/forgotPass">
          {" "}
          &nbsp; <code>Forgot Password</code>
        </Link>
        <code>&nbsp; Don't have account?</code>
        <Link style={{ textDecoration: "none" }} to="/signUp">
          {" "}
          <code>SignUp</code>
        </Link>
        &nbsp;
      </div>
    </div>
    </>
  );
};

export default Login;
