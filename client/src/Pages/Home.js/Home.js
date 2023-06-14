import React from "react";
import "./home.css";
import homeImg from "../../assets/e-home.png";
import { Link } from "react-router-dom";

const Home = () => {
  const isLogin = localStorage.getItem("eIsLogin");

  return (
    <div className="hm-container">
      <div>
        <img
          src={homeImg}
          alt="pic"
          style={{ width: "100%", height: "85vh" }}
        />
      </div>

      <div className="home-content">
        <h3>"Shop Smart, Shop Easy - Your Ultimate Online Destination!"</h3>

        <p>
          Welcome to our online store, where shopping is made easy and
          convenient! Explore our vast selection of high-quality products and
          discover everything you need in one place. From trendy fashion pieces
          to innovative gadgets, we have something for everyone.
        </p>
      </div>
      {!isLogin && (
        <div style={{ margin: "1rem 0" }}>
          <ul className="hul">
            <Link className="hlink" to="/signUp">
              SingUp
            </Link>
            <Link className="hlink" to="/login">
              Login
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
